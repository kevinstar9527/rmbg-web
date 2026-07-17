let ortSession = null
let isModelLoaded = false
let modelLoadPromise = null
let ortLoadPromise = null

const ORT_VERSION = '1.27.0'

// 检测浏览器能力，选择合适的 ort 构建
async function getCapabilities() {
  const webgpu = typeof navigator.gpu !== 'undefined' && await navigator.gpu.requestAdapter()
  const wasm = typeof WebAssembly === 'object' && typeof WebAssembly.instantiate === 'function'
  const simd = wasm && WebAssembly.validate(
    new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10, 10, 1, 8, 0, 65, 0, 253, 15, 253, 98, 11])
  )
  const threads = wasm && await (async () => {
    try {
      return typeof MessageChannel !== 'undefined' &&
        new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)) &&
        WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 5, 4, 1, 3, 1, 1, 10, 11, 1, 9, 0, 65, 0, 254, 16, 2, 0, 26, 11]))
    } catch (e) {
      return false
    }
  })()
  return { webgpu: !!webgpu, wasm, simd, threads }
}

// 根据浏览器能力获取 ort CDN 地址
async function getOrtSrc() {
  const prefix = `https://cdn.jsdmirror.com/npm/onnxruntime-web@${ORT_VERSION}/dist/`
  const cap = await getCapabilities()
  if (cap.webgpu) return `${prefix}ort.webgpu.min.js`
  if (cap.wasm) {
    if (cap.simd || cap.threads) return `${prefix}ort.wasm.min.js`
    return `${prefix}ort.wasm-core.min.js`
  }
  return `${prefix}ort.min.js`
}

// 动态加载 ort script 标签
function loadOnnxruntime() {
  if (ortLoadPromise) return ortLoadPromise
  if (typeof ort !== 'undefined') return Promise.resolve()

  ortLoadPromise = new Promise(async (resolve, reject) => {
    const script = document.createElement('script')
    script.src = await getOrtSrc()
    script.onload = resolve
    script.onerror = () => reject(new Error('加载 onnxruntime-web 失败'))
    document.head.appendChild(script)
  })
  return ortLoadPromise
}

// 初始化 ONNX Runtime 会话
async function initONNXSession(modelPath = '/model_quantized.onnx') {
  if (isModelLoaded && ortSession) {
    return ortSession
  }

  if (modelLoadPromise) {
    return modelLoadPromise
  }

  modelLoadPromise = (async () => {
    try {
      console.log('正在加载 ONNX Runtime...')
      await loadOnnxruntime()

      console.log('正在加载 ONNX 模型...')
      ort.env.wasm.proxy = true
      ort.env.wasm.numThreads = navigator.hardwareConcurrency || 4
      ort.env.wasm.wasmPaths = `https://cdn.jsdmirror.com/npm/onnxruntime-web@${ORT_VERSION}/dist/`

      // 创建推理会话
      ortSession = await ort.InferenceSession.create(modelPath, {
        executionProviders: ['wasm']
      })

      isModelLoaded = true
      console.log('ONNX 模型加载成功')
      console.log('模型输入信息:', ortSession.inputNames)
      console.log('模型输出信息:', ortSession.outputNames)

      return ortSession
    } catch (error) {
      console.error('加载 ONNX 模型失败:', error)
      isModelLoaded = false
      modelLoadPromise = null
      throw error
    }
  })()

  return modelLoadPromise
}

// 预处理图片：将 dataURL 转换为模型输入张量
function preprocessImage(dataUrl, targetWidth, targetHeight) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        // 设置目标尺寸
        canvas.width = targetWidth
        canvas.height = targetHeight

        // 直接拉伸到目标尺寸，与 server.py 一致
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight)

        // 获取像素数据
        const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight)
        const pixels = imageData.data

        // 转换为模型输入格式 [1, 3, H, W]，归一化到 [0, 1]
        const input = new Float32Array(3 * targetHeight * targetWidth)

        let idx = 0
        // R 通道
        for (let i = 0; i < pixels.length; i += 4) {
          input[idx++] = pixels[i] / 255.0
        }
        // G 通道
        for (let i = 0; i < pixels.length; i += 4) {
          input[idx++] = pixels[i + 1] / 255.0
        }
        // B 通道
        for (let i = 0; i < pixels.length; i += 4) {
          input[idx++] = pixels[i + 2] / 255.0
        }

        resolve({
          tensor: new ort.Tensor('float32', input, [1, 3, targetHeight, targetWidth]),
          originalWidth: img.width,
          originalHeight: img.height
        })
      } catch (error) {
        reject(error)
      }
    }
    img.onerror = () => reject(new Error('无法加载图片'))
    img.src = dataUrl
  })
}

// 后处理：将模型输出转换为掩码图片
function postprocessMask(outputTensor, originalWidth, originalHeight) {
  const [batch, channels, height, width] = outputTensor.dims
  const data = outputTensor.data

  // 检查模型输出范围，与 server.py 保持一致
  let maxValue = 0
  for (let i = 0; i < data.length; i++) {
    if (data[i] > maxValue) maxValue = data[i]
  }
  const needsNormalization = maxValue > 1.0

  // 创建掩码 canvas
  const maskCanvas = document.createElement('canvas')
  maskCanvas.width = originalWidth
  maskCanvas.height = originalHeight
  const ctx = maskCanvas.getContext('2d')

  // 创建临时 canvas 用于处理模型输出
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = width
  tempCanvas.height = height
  const tempCtx = tempCanvas.getContext('2d')
  const tempImageData = tempCtx.createImageData(width, height)

  // 将模型输出转换为灰度掩码
  for (let i = 0; i < width * height; i++) {
    let maskValue = data[i]
    // 如果输出范围是 [0, 255]，归一化到 [0, 1]
    if (needsNormalization) {
      maskValue = maskValue / 255.0
    }
    const alpha = Math.max(0, Math.min(255, maskValue * 255))

    tempImageData.data[i * 4 + 0] = 255 // R
    tempImageData.data[i * 4 + 1] = 255 // G
    tempImageData.data[i * 4 + 2] = 255 // B
    tempImageData.data[i * 4 + 3] = alpha // A
  }

  tempCtx.putImageData(tempImageData, 0, 0)

  // 将掩码缩放回原始尺寸
  ctx.clearRect(0, 0, originalWidth, originalHeight)
  ctx.drawImage(tempCanvas, 0, 0, width, height, 0, 0, originalWidth, originalHeight)

  return maskCanvas
}

// 应用掩码到原始图片
function applyMask(originalDataUrl, maskCanvas) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')

        // 绘制原始图片
        ctx.drawImage(img, 0, 0)

        // 获取掩码数据
        const maskCtx = maskCanvas.getContext('2d')
        const maskData = maskCtx.getImageData(0, 0, img.width, img.height)

        // 获取原始图片数据
        const imageData = ctx.getImageData(0, 0, img.width, img.height)

        // 应用掩码（使用掩码的 alpha 通道）
        for (let i = 0; i < imageData.data.length; i += 4) {
          const maskAlpha = maskData.data[i + 3]
          imageData.data[i + 3] = maskAlpha
        }

        ctx.putImageData(imageData, 0, 0)

        // 转换为 dataURL
        resolve(canvas.toDataURL('image/png'))
      } catch (error) {
        reject(error)
      }
    }
    img.onerror = () => reject(new Error('无法加载原始图片'))
    img.src = originalDataUrl
  })
}

// 主处理函数：移除图片背景
async function removeBackground(dataUrl, inputSize = 1024, onProgress) {
  try {
    // 确保模型已加载
    if (onProgress) onProgress('model-loading')
    const session = await initONNXSession()
    if (onProgress) onProgress('model-loaded')

    // 预处理图片
    const { tensor, originalWidth, originalHeight } = await preprocessImage(dataUrl, inputSize, inputSize)


    // 运行推理
    const feeds = {}
    feeds[session.inputNames[0]] = tensor
    const results = await session.run(feeds)


    // 获取输出
    const outputName = session.outputNames[0]
    const outputTensor = results[outputName]

    // 后处理生成掩码
    const maskCanvas = postprocessMask(outputTensor, originalWidth, originalHeight)


    // 应用掩码到原始图片
    const resultDataUrl = await applyMask(dataUrl, maskCanvas)

    return {
      success: true,
      image: resultDataUrl,
      originalWidth,
      originalHeight
    }
  } catch (error) {
    console.error('背景移除失败:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// 批量处理图片
async function removeBackgroundBatch(imagesData, inputSize = 1024, onProgress) {
  const results = []

  for (let i = 0; i < imagesData.length; i++) {
    const item = imagesData[i]

    if (onProgress) {
      onProgress(i, imagesData.length, item.fileName)
    }


    try {
      const result = await removeBackground(item.image, inputSize, onProgress)
      results.push({
        fileName: item.fileName,
        ...result
      })
    } catch (error) {
      results.push({
        fileName: item.fileName,
        success: false,
        error: error.message
      })
    }
  }

  if (onProgress) {
    onProgress(imagesData.length, imagesData.length, '完成')
  }

  return results
}

export default {
  initONNXSession,
  removeBackground,
  removeBackgroundBatch,
  isModelLoaded: () => isModelLoaded
}
