<template>
  <div class="upload-page">
    <!-- Hero Upload Stage -->
    <section class="hero-stage reveal">
      <div class="hero-shell">
        <div class="hero-core">
          <!-- Header inside hero -->
          <div class="hero-header">
            <!-- <span class="eyebrow">AI Background Removal</span> -->
            <h1>智能抠图</h1>
            <p>上传图片，一键去除背景，全部在浏览器本地完成</p>
          </div>

          <!-- Upload View -->
          <div v-if="!showFilesView" class="upload-view">
            <div
              class="drop-zone"
              :class="{ 'drag-over': isDragOver }"
              @click="handleDropAreaClick"
              @dragenter.prevent="handleDragEnter"
              @dragover.prevent
              @dragleave.prevent="handleDragLeave"
              @drop.prevent="handleDrop"
            >
              <div class="drop-zone-shell" :class="{ 'drag-over': isDragOver }">
                <div class="drop-zone-core">
                  <div class="upload-icon-orbital">
                    <div class="upload-icon-ring">
                      <svg class="icon-xl" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  <p class="drop-title">拖放图片到此处</p>
                  <p class="drop-hint">支持 JPG、PNG 格式，可多选上传</p>

                  <div class="drop-actions">
                    <label for="fileInput" class="cta-pill primary" @click.stop>
                      <span>选择文件</span>
                      <div class="btn-icon-island">
                        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </div>
                    </label>
                    <input type="file" id="fileInput" ref="fileInput" accept="image/*" class="hidden" multiple @change="handleFileSelect">

                    <button @click.stop="pasteImage" class="cta-pill secondary">
                      <span>粘贴图片</span>
                      <div class="btn-icon-island">
                        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" stroke-linecap="round" stroke-linejoin="round"/>
                          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                        </svg>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Back to files list button -->
            <div v-if="selectedFiles.length > 0 && !autoProcessMode" class="back-to-files">
              <button @click="showFilesView = true" class="text-pill">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>返回处理 ({{ selectedFiles.length }} 张图片)</span>
              </button>
            </div>
          </div>

          <!-- Files View -->
          <div v-else class="files-view">
            <div class="view-title-row">
              <div class="title-group">
                <h2>已选择的文件</h2>
                <span class="count-badge">{{ selectedFiles.length }}</span>
              </div>
              <div class="title-actions">
                <button @click="showFilesView = false" class="text-pill">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M12 5v14M5 12h14" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>继续添加</span>
                </button>
                <button @click="clearAllFiles" class="text-pill danger">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>清空</span>
                </button>
              </div>
            </div>

            <div class="file-grid">
              <div v-if="selectedFiles.length === 0" class="empty-state">
                <svg class="icon-xl" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <path d="M21 15l-5-5L5 21"/>
                </svg>
                <p>暂无选择的文件</p>
                <p class="empty-hint">点击上方按钮或拖放图片开始上传</p>
              </div>

              <div v-for="(file, index) in selectedFiles" :key="index" class="file-card">
                <div class="file-thumb">
                  <img :src="file.preview" :alt="file.name">
                  <button @click.stop="removeFile(index)" class="remove-btn" title="移除">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>
                <div class="file-meta">
                  <div class="file-name">{{ file.name }}</div>
                  <div class="file-size">{{ formatFileSize(file.size) }}</div>
                </div>
              </div>
            </div>

            <div v-if="selectedFiles.length > 0" class="action-bar">
              <div class="total-size">
                共 <span>{{ formatFileSize(totalSize) }}</span>
              </div>
              <button @click="processAllImages" class="cta-pill primary">
                <span>开始处理</span>
                <div class="btn-icon-island">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Feature Strip -->
    <section class="feature-strip">
      <div class="feature-card reveal" :style="{ animationDelay: '120ms' }">
        <div class="feature-shell">
          <div class="feature-core">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="feature-text">
              <h3>本地处理</h3>
              <p>浏览器内 ONNX 处理</p>
            </div>
          </div>
        </div>
      </div>

      <div class="feature-card reveal" :style="{ animationDelay: '220ms' }">
        <div class="feature-shell">
          <div class="feature-core">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="feature-text">
              <h3>批量处理</h3>
              <p>一次选择多张图片</p>
            </div>
          </div>
        </div>
      </div>

      <div class="feature-card reveal" :style="{ animationDelay: '320ms' }">
        <div class="feature-shell">
          <div class="feature-core">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="feature-text">
              <h3>隐私安全</h3>
              <p>图片不会离开设备</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Progress Dialog -->
    <div v-show="isProcessing" class="progress-overlay">
      <div class="progress-shell">
        <div class="progress-core">
          <!-- <div class="spinner-wrapper">
            <div class="spinner"></div>
          </div> -->
          <div class="progress-dialog-icon">
              <i class="fas fa-cog fa-spin"></i>
          </div>
          <h2 class="progress-title">正在处理</h2>
          <p class="progress-status">{{ statusMessage }}</p>
          <div class="progress-track">
            <div class="progress-fill" :style="{ transform: `scaleX(${progress / 100})` }"></div>
          </div>
          <span class="progress-percent">{{ Math.round(progress) }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import onnxProcessor from '../utils/onnx-processor'
import { saveProcessedResults } from '../utils/history-db'

export default {
  name: 'Upload',
  data() {
    return {
      selectedFiles: [],
      showFilesView: false,
      isProcessing: false,
      progress: 0,
      statusMessage: '准备处理...',
      isDragOver: false,
      autoProcessMode: false
    }
  },
  computed: {
    totalSize() {
      return this.selectedFiles.reduce((sum, file) => sum + file.size, 0)
    }
  },
  methods: {
    handleDropAreaClick(event) {
      const target = event.target
      if (target.tagName === 'BUTTON' || target.tagName === 'LABEL' ||
          target.closest('button') || target.closest('label')) {
        return
      }
      this.$refs.fileInput.click()
    },
    handleFileSelect(event) {
      const files = Array.from(event.target.files)
      this.addFiles(files)
      event.target.value = ''
    },
    handleDragEnter(event) {
      this.isDragOver = true
      event.currentTarget.classList.add('drag-over')
    },
    handleDragLeave(event) {
      this.isDragOver = false
      event.currentTarget.classList.remove('drag-over')
    },
    handleDrop(event) {
      this.isDragOver = false
      event.currentTarget.classList.remove('drag-over')
      const files = Array.from(event.dataTransfer.files)
      this.addFiles(files)
    },
    async pasteImage() {
      // 先尝试读取剪贴板中的图片
      if (navigator.clipboard.read) {
        try {
          const clipboardItems = await navigator.clipboard.read()
          for (const item of clipboardItems) {
            // 优先检查图片类型
            for (const type of item.types) {
              if (type.startsWith('image/')) {
                this.isProcessing = true
                this.progress = 0
                this.statusMessage = '正在读取剪贴板图片...'
                try {
                  const blob = await item.getType(type)
                  const file = new File([blob], `pasted-image-${Date.now()}.png`, { type })
                  this.progress = 100
                  this.statusMessage = '读取完成'
                  this.addFiles([file])
                } finally {
                  this.isProcessing = false
                }
                return
              }
            }
            // 检查文本内容是否为图片链接
            if (item.types.includes('text/plain')) {
              const blob = await item.getType('text/plain')
              const text = (await blob.text()).trim()
              if (this.isImageUrl(text)) {
                await this.downloadAndAddImage(text)
                return
              }
            }
            if (item.types.includes('text/html')) {
              const blob = await item.getType('text/html')
              const html = await blob.text()
              const urlMatch = html.match(/<img[^>]+src=["']([^"']+)["']/i)
              if (urlMatch && this.isImageUrl(urlMatch[1])) {
                await this.downloadAndAddImage(urlMatch[1])
                return
              }
            }
          }
        } catch (e) {
          console.warn('clipboard.read failed:', e)
        }
      }

      // 如果 clipboard.read 不可用或没有找到图片，尝试读取文本
      if (navigator.clipboard.readText) {
        try {
          const text = (await navigator.clipboard.readText()).trim()
          if (this.isImageUrl(text)) {
            await this.downloadAndAddImage(text)
            return
          }
        } catch (e) {
          console.warn('clipboard.readText failed:', e)
        }
      }

      alert('剪贴板中没有图片')
    },
    isImageUrl(text) {
      // 只要是有效的 HTTP/HTTPS URL 就尝试下载
      return /^https?:\/\/.+/i.test(text)
    },
    async downloadAndAddImage(url) {
      this.isProcessing = true
      this.progress = 0
      this.statusMessage = '正在下载图片...'
      try {
        // 方法1: 尝试使用 fetch 下载
        let blob = null
        try {
          const response = await fetch(url, { mode: 'cors' })
          if (response.ok) {
            blob = await response.blob()
            if (!blob.type.startsWith('image/')) {
              blob = null
            }
          }
        } catch (e) {
          console.warn('fetch 下载失败，尝试 img 方式:', e)
        }

        // 方法2: 如果 fetch 失败，尝试使用 Image + Canvas
        if (!blob) {
          blob = await this.loadImageViaCanvas(url)
        }

        if (!blob) {
          throw new Error('无法下载图片，可能是网络问题或该网站不允许跨域访问。建议先保存图片到本地，再上传。')
        }

        const fileName = url.split('/').pop().split('?')[0] || 'downloaded-image.png'
        const file = new File([blob], fileName, { type: blob.type })
        this.progress = 100
        this.statusMessage = '下载完成'
        this.addFiles([file])
      } catch (error) {
        console.error('下载图片失败:', error)
        alert('下载图片失败: ' + error.message)
      } finally {
        this.isProcessing = false
      }
    },
    loadImageViaCanvas(url) {
      return new Promise((resolve) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas')
            canvas.width = img.naturalWidth
            canvas.height = img.naturalHeight
            const ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0)
            
            canvas.toBlob((blob) => {
              if (blob && blob.type.startsWith('image/')) {
                resolve(blob)
              } else {
                resolve(null)
              }
            }, 'image/png')
          } catch (e) {
            console.warn('canvas 转换失败:', e)
            resolve(null)
          }
        }
        
        img.onerror = () => {
          console.warn('图片加载失败')
          resolve(null)
        }
        
        img.src = url
      })
    },
    addFiles(files) {
      const imageFiles = files.filter(file => file.type.startsWith('image/'))
      if (imageFiles.length === 0) return

      const autoProcess = localStorage.getItem('rmbg_auto_process') === 'yes'
      this.autoProcessMode = autoProcess

      // 立即显示文件列表
      if (!autoProcess) {
        this.showFilesView = true
      }

      let loadedCount = 0

      imageFiles.forEach(file => {
        // 先添加占位项，立即显示
        const fileItem = {
          file: file,
          name: file.name,
          size: file.size,
          preview: '',
          dataUrl: ''
        }
        this.selectedFiles.push(fileItem)
        const index = this.selectedFiles.length - 1

        // 异步加载缩略图
        const reader = new FileReader()
        reader.onload = (e) => {
          if (this.selectedFiles[index]) {
            this.selectedFiles[index].preview = e.target.result
            this.selectedFiles[index].dataUrl = e.target.result
          }
          loadedCount++
          if (autoProcess && loadedCount === imageFiles.length) {
            this.$nextTick(() => this.processAllImages())
          }
        }
        reader.readAsDataURL(file)
      })
    },
    removeFile(index) {
      this.selectedFiles.splice(index, 1)
      if (this.selectedFiles.length === 0) {
        this.showFilesView = false
      }
    },
    clearAllFiles() {
      this.selectedFiles = []
      this.showFilesView = false
    },
    formatFileSize(bytes) {
      if (bytes === 0) return '0 B'
      const k = 1024
      const sizes = ['B', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
    },
    async processAllImages() {
      if (this.selectedFiles.length === 0) return

      this.isProcessing = true
      this.progress = 0
      this.statusMessage = '正在加载模型...'

      try {
        const imagesData = this.selectedFiles.map(f => ({
          image: f.dataUrl,
          fileName: f.name
        }))

        const results = await onnxProcessor.removeBackgroundBatch(
          imagesData,
          1024,
          (current, total, fileName) => {
            this.progress = 10 + (current / total) * 90
            this.statusMessage = `正在处理: ${fileName} (${current + 1}/${total})`
          }
        )

        results.forEach((result, i) => {
          if (result.success) {
            result.original = imagesData[i].image
          }
        })

        const successCount = results.filter(r => r.success).length
        if (successCount === 0) {
          throw new Error('所有图片处理失败')
        }

        this.progress = 100
        this.statusMessage = `处理完成，成功 ${successCount}/${results.length} 张图片`

        const resultId = await saveProcessedResults(results)
        sessionStorage.setItem('processedResultsId', resultId)

        setTimeout(() => {
          this.$router.push('/result')
        }, 500)
      } catch (error) {
        const errorMsg = error?.message || error?.toString?.() || '未知错误'
        console.error('处理失败:', error)
        alert('处理失败: ' + errorMsg)
      } finally {
        this.isProcessing = false
      }
    }
  }
}
</script>

<style scoped>
.upload-page {
  flex: 1;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
  font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #0f172a;
}

/* Hero Stage - upload area is the dominant element */
.hero-stage {
  width: 100%;
}

.hero-shell {
  padding: 8px;
  background: rgba(255, 255, 255, 0.55);
  border-radius: 2rem;
  box-shadow:
    0 32px 80px rgba(15, 23, 42, 0.08),
    0 0 0 1px rgba(15, 23, 42, 0.05);
}

.hero-core {
  background: #fff;
  border-radius: calc(2rem - 8px);
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.9),
    0 4px 24px rgba(15, 23, 42, 0.04);
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.hero-header {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.eyebrow {
  width: fit-content;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-weight: 700;
  color: #94a3b8;
  background: rgba(15, 23, 42, 0.04);
  padding: 5px 12px;
  border-radius: 9999px;
}

h1 {
  font-size: 30px;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: #0f172a;
  line-height: 1.1;
}

.hero-header p {
  font-size: 14px;
  color: #64748b;
  max-width: 360px;
}

/* Drop Zone - massive and centered */
.drop-zone {
  cursor: pointer;
}

.drop-zone-shell {
  padding: 8px;
  background: rgba(15, 23, 42, 0.04);
  border-radius: 1.75rem;
  transition: all 500ms cubic-bezier(0.32, 0.72, 0, 1);
}

.drop-zone-shell.drag-over {
  background: rgba(15, 23, 42, 0.06);
}

.drop-zone-core {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 40px;
  background: #fff;
  border-radius: calc(1.75rem - 8px);
  border: 2px dashed #e2e8f0;
  transition: all 500ms cubic-bezier(0.32, 0.72, 0, 1);
}

.drop-zone-shell.drag-over .drop-zone-core {
  border-color: #0f172a;
  transform: scale(1.01);
  background: #f8fafc;
}

.upload-icon-orbital {
  position: relative;
  margin-bottom: 24px;
}

.upload-icon-orbital::before {
  content: '';
  position: absolute;
  inset: -14px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(15, 23, 42, 0.06) 0%, transparent 70%);
  animation: pulse 3s cubic-bezier(0.32, 0.72, 0, 1) infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.15); opacity: 0.3; }
}

.upload-icon-ring {
  position: relative;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 500ms cubic-bezier(0.32, 0.72, 0, 1);
}

.drop-zone:hover .upload-icon-ring {
  color: #0f172a;
  transform: scale(1.08);
}

.drop-title {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 8px;
}

.drop-hint {
  font-size: 14px;
  color: #94a3b8;
  margin-bottom: 28px;
}

.drop-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

/* CTA Pills */
.cta-pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 24px;
  border-radius: 9999px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 500ms cubic-bezier(0.32, 0.72, 0, 1);
}

.cta-pill.primary {
  background: #0f172a;
  color: #fff;
}

.cta-pill.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.2);
}

.cta-pill.secondary {
  background: #fff;
  color: #334155;
  box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.08), 0 4px 16px rgba(15, 23, 42, 0.04);
}

.cta-pill.secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.1), 0 0 0 1px rgba(15, 23, 42, 0.12);
}

.cta-pill:active {
  transform: scale(0.97);
}

.btn-icon-island {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 500ms cubic-bezier(0.32, 0.72, 0, 1);
}

.cta-pill:hover .btn-icon-island {
  transform: translate(2px, -1px) scale(1.08);
}

.cta-pill.secondary .btn-icon-island {
  background: rgba(15, 23, 42, 0.08);
}

/* Text Pills */
.text-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 9999px;
  border: none;
  background: rgba(15, 23, 42, 0.04);
  color: #64748b;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 400ms cubic-bezier(0.32, 0.72, 0, 1);
}

.text-pill:hover {
  background: rgba(15, 23, 42, 0.08);
  color: #334155;
}

.text-pill.danger:hover {
  background: rgba(239, 68, 68, 0.08);
  color: #ef4444;
}

.text-pill svg {
  width: 16px;
  height: 16px;
}

.hidden {
  display: none !important;
}

/* Back to files button */
.back-to-files {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

/* Files View */
.files-view {
  width: 100%;
}

.view-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.view-title-row h2 {
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
}

.title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.count-badge {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
  background: rgba(15, 23, 42, 0.06);
  padding: 5px 12px;
  border-radius: 9999px;
}

.title-actions {
  display: flex;
  gap: 8px;
}

.file-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 20px;
  min-height: 160px;
}

.file-card {
  display: flex;
  flex-direction: column;
  background: #f8fafc;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(15, 23, 42, 0.05);
  transition: all 400ms cubic-bezier(0.32, 0.72, 0, 1);
}

.file-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.06);
  border-color: rgba(15, 23, 42, 0.1);
}

.file-thumb {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  background: #e2e8f0;
  overflow: hidden;
}

.file-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: rgba(239, 68, 68, 0.9);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transform: scale(0.9);
  transition: all 300ms cubic-bezier(0.32, 0.72, 0, 1);
}

.file-card:hover .remove-btn {
  opacity: 1;
  transform: scale(1);
}

.remove-btn svg {
  width: 14px;
  height: 14px;
}

.file-meta {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.file-name {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-size {
  font-size: 12px;
  color: #94a3b8;
}

.empty-state {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #94a3b8;
  text-align: center;
  min-height: 160px;
}

.empty-state svg {
  width: 44px;
  height: 44px;
  margin-bottom: 14px;
  color: #cbd5e1;
}

.empty-state p {
  font-size: 15px;
  font-weight: 500;
  color: #64748b;
}

.empty-hint {
  font-size: 13px;
  color: #94a3b8;
  margin-top: 4px;
}

.action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 20px;
  border-top: 1px solid rgba(15, 23, 42, 0.06);
}

.total-size {
  font-size: 14px;
  color: #64748b;
}

.total-size span {
  font-weight: 700;
  color: #0f172a;
}

/* Feature Strip */
.feature-strip {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.feature-shell {
  padding: 6px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 1.25rem;
  box-shadow:
    0 24px 64px rgba(15, 23, 42, 0.06),
    0 0 0 1px rgba(15, 23, 42, 0.05);
  height: 100%;
  transition: all 500ms cubic-bezier(0.32, 0.72, 0, 1);
}

.feature-card:hover .feature-shell {
  transform: translateY(-3px);
  box-shadow:
    0 32px 72px rgba(15, 23, 42, 0.1),
    0 0 0 1px rgba(15, 23, 42, 0.06);
}

.feature-core {
  height: 100%;
  background: #fff;
  border-radius: calc(1.25rem - 6px);
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.9),
    0 4px 20px rgba(15, 23, 42, 0.04);
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 14px;
}

.feature-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #f1f5f9;
  color: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feature-icon svg {
  width: 22px;
  height: 22px;
}

.feature-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.feature-core h3 {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
}

.feature-core p {
  font-size: 13px;
  line-height: 1.4;
  color: #64748b;
}

/* Progress Overlay */
.progress-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(15, 23, 42, 0.45);
  animation: fadeIn 200ms ease forwards;
}

.progress-shell {
  width: 100%;
  max-width: 400px;
  animation: scaleIn 500ms cubic-bezier(0.32, 0.72, 0, 1) forwards;
}

.progress-core {
  padding: 40px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  background: #fff;
  border-radius: calc(2rem - 8px);
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.9),
    0 4px 20px rgba(15, 23, 42, 0.04);
}

.spinner-wrapper {
  width: 48px;
  height: 48px;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e2e8f0;
  border-top-color: #0f172a;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.progress-dialog-icon {
  font-size: 48px;
  color: #0f172a;
  line-height: 1;
}

.progress-title {
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
}

.progress-status {
  font-size: 14px;
  color: #64748b;
  min-height: 20px;
}

.progress-track {
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 9999px;
  overflow: hidden;
}

.progress-fill {
  width: 100%;
  height: 100%;
  background: #0f172a;
  border-radius: 9999px;
  transform-origin: left;
  transform: scaleX(0);
  transition: transform 500ms cubic-bezier(0.32, 0.72, 0, 1);
}

.progress-percent {
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
}

/* Icons */
.icon {
  width: 18px;
  height: 18px;
}

.icon-xl {
  width: 36px;
  height: 36px;
}

/* Reveal Animation */
.reveal {
  opacity: 0;
  transform: translateY(24px);
  animation: revealUp 800ms cubic-bezier(0.32, 0.72, 0, 1) forwards;
}

@keyframes revealUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Mobile */
@media (max-width: 768px) {
  .upload-page {
    padding: 8px 0;
    gap: 12px;
    justify-content: flex-start;
  }

  .hero-core {
    padding: 22px 18px;
    gap: 16px;
  }

  h1 {
    font-size: 24px;
  }

  .hero-header p {
    font-size: 13px;
  }

  .drop-zone-core {
    padding: 36px 20px;
  }

  .upload-icon-ring {
    width: 76px;
    height: 76px;
  }

  .upload-icon-orbital {
    margin-bottom: 18px;
  }

  .drop-title {
    font-size: 20px;
  }

  .drop-hint {
    margin-bottom: 22px;
  }

  .drop-actions {
    width: 100%;
    flex-direction: column;
  }

  .cta-pill {
    width: 100%;
    justify-content: center;
    padding: 12px 20px;
  }

  .view-title-row {
    flex-wrap: wrap;
    gap: 12px;
  }

  .title-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .file-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .action-bar {
    flex-direction: column;
    gap: 14px;
  }

  .action-bar .cta-pill {
    width: 100%;
  }

  .feature-strip {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .feature-shell {
    padding: 5px;
    border-radius: 1rem;
  }

  .feature-core {
    padding: 12px 8px;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 8px;
  }

  .feature-icon {
    width: 34px;
    height: 34px;
  }

  .feature-icon svg {
    width: 18px;
    height: 18px;
  }

  .feature-core h3 {
    font-size: 12px;
  }

  .feature-core p {
    display: none;
  }

  .progress-core {
    padding: 32px 24px;
  }
}
</style>
