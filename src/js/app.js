// Background Removal Tool
// Using ONNX Runtime Web with WASM backend

// Global variables
let originalImage = null;
let resultImageUrl = null;
let originalImageData = null;
let processedImageData = null;

// DOM elements
let fileInput;
let pasteBtn;
let dropArea;
let statusText;
let progressBar;
let resultContainer;
let downloadBtn;
let copyBtn;
let copyStatus;

// Slider-related elements and state
let slider;
let originalImageDiv;
let resultImageDiv;
let resultImageElement;
let originalImageElement;
let comparisonSlider;
let sliderWidth;
let isDragging = false;

// Initialize the application
$(document).ready(function() {
    // Initialize DOM elements
    fileInput = document.getElementById('fileInput');
    pasteBtn = document.getElementById('pasteBtn');
    dropArea = document.getElementById('dropArea');
    statusText = document.getElementById('statusText');
    progressBar = document.getElementById('progressBar');
    resultContainer = document.getElementById('resultContainer');
    downloadBtn = document.getElementById('downloadBtn');
    copyBtn = document.getElementById('copyBtn');
    copyStatus = document.getElementById('copyStatus');
    
    // Initialize slider elements
    slider = document.querySelector('.slider-handle');
    originalImageDiv = document.querySelector('.original-image');
    resultImageDiv = document.querySelector('.result-image');
    resultImageElement = document.getElementById('sliderResult');
    originalImageElement = document.getElementById('sliderOriginal');
    comparisonSlider = document.querySelector('.comparison-slider');
    
    // Set up event listeners
    setupEventListeners();
    
    // Ready to use
    showStatus('准备就绪，可以开始上传图片', 'success');
    setTimeout(() => {
        showStatus('等待上传图片...', 'idle');
    }, 2000);
});

// Set up event listeners for user interactions
function setupEventListeners() {
    // File input change event
    fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            handleImageFile(e.target.files[0]);
        }
    });
    
    // Paste button click event
    pasteBtn.addEventListener('click', () => {
        navigator.clipboard.read().then(clipboardItems => {
            for (const clipboardItem of clipboardItems) {
                if (clipboardItem.types.includes('image/png') || 
                    clipboardItem.types.includes('image/jpeg')) {
                    const type = clipboardItem.types.find(type => 
                        type === 'image/png' || type === 'image/jpeg');
                    clipboardItem.getType(type).then(blob => {
                        handleImageFile(blob);
                    });
                    break;
                }
            }
        }).catch(err => {
            showStatus('无法访问剪贴板，请尝试使用键盘快捷键 Ctrl+V', 'error');
        });
    });
    
    // Paste from keyboard
    document.addEventListener('paste', (e) => {
        if (e.clipboardData && e.clipboardData.items) {
            const items = e.clipboardData.items;
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const blob = items[i].getAsFile();
                    handleImageFile(blob);
                    break;
                }
            }
        }
    });
    
    // Drag and drop events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        dropArea.classList.add('active');
    }
    
    function unhighlight() {
        dropArea.classList.remove('active');
    }
    
    dropArea.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        if (dt.files && dt.files[0]) {
            handleImageFile(dt.files[0]);
        }
    });
    
    // Enhanced comparison slider functionality
    // Function to update slider position with original image visibility controlled by slider
    function updateSliderPosition(clientX) {
        const container = document.querySelector('.comparison-container');
        const rect = container.getBoundingClientRect();
        sliderWidth = rect.width;
        
        // Calculate percentage
        const x = clientX - rect.left;
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
        
        // Update original image clip path to show only part of it
        // Create a clip-path that reveals the original image from the left edge to the slider position
        originalImageDiv.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
        
        // Update slider position
        slider.style.left = `${percentage}%`;
        
        // Update middle layer position
        const middleLayer = document.querySelector('.middle-layer');
        if (middleLayer) {
            middleLayer.style.left = `${percentage}%`;
        }
    }
    
    // Start dragging on mouse down
    slider.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isDragging = true;
        slider.style.cursor = 'grabbing';
        document.body.style.cursor = 'grabbing';
    });
    
    // Allow clicking anywhere on the slider to move the divider
    comparisonSlider.addEventListener('click', (e) => {
        if (e.target === slider || slider.contains(e.target)) return;
        updateSliderPosition(e.clientX);
    });
    
    // Move divider on mouse move
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        updateSliderPosition(e.clientX);
    });
    
    // Stop dragging on mouse up
    document.addEventListener('mouseup', () => {
        isDragging = false;
        slider.style.cursor = 'grab';
        document.body.style.cursor = 'default';
    });
    
    // Mobile touch support
    slider.addEventListener('touchstart', (e) => {
        isDragging = true;
    });
    
    // Allow tapping anywhere on the slider to move the divider
    comparisonSlider.addEventListener('touchstart', (e) => {
        if (e.target === slider || slider.contains(e.target)) return;
        const touch = e.touches[0];
        updateSliderPosition(touch.clientX);
    }, { passive: true });
    
    // Move divider on touch move
    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const touch = e.touches[0];
        updateSliderPosition(touch.clientX);
    }, { passive: true });
    
    // Stop dragging on touch end
    document.addEventListener('touchend', () => {
        isDragging = false;
    });
    
    // Download button
    downloadBtn.addEventListener('click', () => {
        if (resultImageUrl) {
            downloadBtn.href = resultImageUrl;
        }
    });
    
    // Copy button - copy the processed image to clipboard
    copyBtn.addEventListener('click', async () => {
        if (!resultImageUrl) return;
        
        try {
            // Fetch the image from the data URL
            const response = await fetch(resultImageUrl);
            const blob = await response.blob();
            
            // Create a ClipboardItem
            const data = [new ClipboardItem({ [blob.type]: blob })];
            
            // Write to clipboard
            await navigator.clipboard.write(data);
            
            // Show success message
            copyStatus.style.display = 'block';
            copyStatus.textContent = '图片已复制到剪贴板！';
            copyStatus.className = 'mt-2 text-success';
            
            // Hide message after 3 seconds
            setTimeout(() => {
                copyStatus.style.display = 'none';
            }, 3000);
        } catch (err) {
            console.error('复制到剪贴板失败:', err);
            copyStatus.style.display = 'block';
            copyStatus.textContent = '复制失败: ' + err.message;
            copyStatus.className = 'mt-2 text-danger';
            
            // Hide message after 3 seconds
            setTimeout(() => {
                copyStatus.style.display = 'none';
            }, 3000);
        }
    });
    
    // Handle window resize to adjust the slider
    window.addEventListener('resize', () => {
        if (comparisonSlider) {
            // Get current percentage
            const sliderLeft = parseFloat(slider.style.left) || 50;
            
            // Update the container size
            const container = document.querySelector('.comparison-container');
            sliderWidth = container.getBoundingClientRect().width;
            
            // Reapply the same percentage
            slider.style.left = `${sliderLeft}%`;
            originalImageDiv.style.clipPath = `inset(0 ${100 - sliderLeft}% 0 0)`;
            
            // Update middle layer position
            const middleLayer = document.querySelector('.middle-layer');
            if (middleLayer) {
                middleLayer.style.left = `${sliderLeft}%`;
            }
        }
    });
}

// Handle image file from upload or paste
function handleImageFile(file) {
    // Check if file is an image
    if (!file.type.match('image.*')) {
        showStatus('请选择有效的图片文件', 'error');
        return;
    }
    
    // Read the image file
    const reader = new FileReader();
    reader.onload = async (e) => {
        // Show the image preview immediately
        const imageUrl = e.target.result;
        
        // Display original image
        document.getElementById('originalImage').src = imageUrl;
        document.getElementById('sliderOriginal').src = imageUrl;
        
        // Show result container with just the original image
        resultContainer.classList.remove('hidden');
        
        // Create original image object for processing
        originalImage = new Image();
        originalImage.onload = async () => {
            // Process the image
            try {
                await processImage(imageUrl);
            } catch (error) {
                console.error('Image processing error:', error);
                showStatus('图片处理失败: ' + error.message, 'error');
            }
        };
        originalImage.src = imageUrl;
    };
    reader.readAsDataURL(file);
    
    showStatus('图片已加载，正在处理...', 'processing');
}

// Process image using ONNX Runtime Web
async function processImage(imageData) {
    try {
        updateProgress(0);
        showStatus('正在加载模型...', 'processing');
        
        // Update progress
        updateProgress(10);
        
        // Process using ONNX Runtime Web
        const result = await window.ONNXProcessor.removeBackground(imageData, 1024);
        
        if (!result.success) {
            throw new Error(result.error || '处理失败');
        }
        
        // Update progress
        updateProgress(80);
        
        // Get the processed image
        resultImageUrl = result.image;
        
        // Display result
        document.getElementById('resultImage').src = resultImageUrl;
        document.getElementById('sliderResult').src = resultImageUrl;
        
        // Ensure images are properly aligned in the comparison slider
        // This is done by loading both images first to ensure dimensions match
        const preloadOriginal = new Image();
        const preloadResult = new Image();
        
        preloadResult.onload = () => {
            // Reset slider position to 50%
            slider.style.left = '50%';
            originalImageDiv.style.clipPath = 'inset(0 50% 0 0)';
            
            // Update middle layer position
            const middleLayer = document.querySelector('.middle-layer');
            if (middleLayer) {
                middleLayer.style.left = '50%';
            }
            
            // Update progress to 100% when everything is loaded
            updateProgress(100);
            showStatus('处理完成！', 'success');
            
            // Reset progress after a delay
            setTimeout(() => {
                updateProgress(0);
            }, 2000);
        };
        
        preloadOriginal.src = imageData;
        preloadResult.src = resultImageUrl;
        
    } catch (error) {
        console.error('Image processing error:', error);
        showStatus('图片处理失败: ' + error.message, 'error');
        throw error;
    }
}

// Update status message
function showStatus(message, type = 'info') {
    statusText.textContent = message;
    
    // Clear previous classes
    statusText.className = '';
    
    // Add appropriate class based on status type
    switch (type) {
        case 'error':
            statusText.classList.add('text-danger');
            break;
        case 'success':
            statusText.classList.add('text-success');
            break;
        case 'warning':
            statusText.classList.add('text-warning');
            break;
        case 'loading':
            statusText.classList.add('text-primary');
            // Add spinner if loading
            statusText.innerHTML = `<div class="spinner d-inline-block me-2"></div> ${message}`;
            break;
        default:
            statusText.classList.add('text-gray-500');
    }
}

// Update progress bar
function updateProgress(percent) {
    progressBar.style.width = `${percent}%`;
    progressBar.setAttribute('aria-valuenow', percent);
}

// DOM元素加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const fileInput = document.getElementById('fileInput');
    const pasteBtn = document.getElementById('pasteBtn');
    const dropArea = document.getElementById('dropArea');
    const statusText = document.getElementById('statusText');
    const progressBar = document.getElementById('progressBar');
    const resultContainer = document.getElementById('resultContainer');
    const originalImage = document.getElementById('originalImage');
    const resultImage = document.getElementById('resultImage');
    const sliderOriginal = document.getElementById('sliderOriginal');
    const sliderResult = document.getElementById('sliderResult');
    const downloadBtn = document.getElementById('downloadBtn');
    const copyBtn = document.getElementById('copyBtn');
    const copyStatus = document.getElementById('copyStatus');

    // 初始化对比滑块
    initComparisonSlider();

    // 文件选择处理
    fileInput.addEventListener('change', function(e) {
        if (this.files && this.files[0]) {
            handleImageUpload(this.files[0]);
        }
    });

    // 拖拽处理
    dropArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('drag-over');
    });

    dropArea.addEventListener('dragleave', function() {
        this.classList.remove('drag-over');
    });

    dropArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('drag-over');
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleImageUpload(e.dataTransfer.files[0]);
        }
    });

    dropArea.addEventListener('click', function() {
        fileInput.click();
    });

    // 粘贴处理
    pasteBtn.addEventListener('click', function() {
        statusText.textContent = '等待粘贴图片...';
        document.addEventListener('paste', handlePaste);
        
        // 5秒后如果没有粘贴，取消监听
        setTimeout(() => {
            document.removeEventListener('paste', handlePaste);
            if (statusText.textContent === '等待粘贴图片...') {
                statusText.textContent = '粘贴超时，请重试或选择其他上传方式';
            }
        }, 5000);
    });

    // 直接监听全局粘贴事件
    document.addEventListener('paste', handlePaste);

    // 下载按钮
    downloadBtn.addEventListener('click', function(e) {
        if (processedImageData) {
            this.href = processedImageData;
        } else {
            e.preventDefault();
        }
    });

    // 复制按钮
    copyBtn.addEventListener('click', function() {
        if (processedImageData) {
            copyImageToClipboard(processedImageData);
        }
    });

    // 粘贴处理函数
    function handlePaste(e) {
        const items = (e.clipboardData || e.originalEvent.clipboardData).items;
        
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const blob = items[i].getAsFile();
                handleImageUpload(blob);
                document.removeEventListener('paste', handlePaste);
                return;
            }
        }
        
        statusText.textContent = '剪贴板中没有图片';
    }

    // 图片上传处理函数
    function handleImageUpload(file) {
        // 检查文件类型
        if (!file.type.match('image.*')) {
            statusText.textContent = '请上传图片文件';
            return;
        }

        // 重置状态
        statusText.textContent = '正在处理图片...';
        progressBar.style.width = '0%';
        resultContainer.classList.add('hidden');

        // 读取文件并显示原图
        const reader = new FileReader();
        reader.onload = async function(e) {
            originalImageData = e.target.result;
            originalImage.src = originalImageData;
            sliderOriginal.src = originalImageData;
            
            // 使用 ONNX Runtime Web 处理
            try {
                const result = await window.ONNXProcessor.removeBackground(originalImageData, 1024);
                
                if (result.success) {
                    processedImageData = result.image;
                    resultImage.src = processedImageData;
                    sliderResult.src = processedImageData;
                    
                    // 显示结果
                    resultContainer.classList.remove('hidden');
                    
                    // 重新初始化对比滑块
                    resetComparisonSlider();
                    
                    statusText.textContent = '处理完成';
                    progressBar.style.width = '100%';
                } else {
                    statusText.textContent = '处理失败: ' + result.error;
                }
            } catch (error) {
                console.error('Processing error:', error);
                statusText.textContent = '处理失败: ' + error.message;
            }
        };
        reader.readAsDataURL(file);
    }

    // 复制图片到剪贴板
    function copyImageToClipboard(dataUrl) {
        fetch(dataUrl)
            .then(res => res.blob())
            .then(blob => {
                try {
                    navigator.clipboard.write([
                        new ClipboardItem({
                            [blob.type]: blob
                        })
                    ]).then(() => {
                        copyStatus.style.display = 'block';
                        setTimeout(() => {
                            copyStatus.style.display = 'none';
                        }, 2000);
                    }).catch(err => {
                        console.error('复制失败:', err);
                        copyStatus.textContent = '复制失败，请手动下载';
                        copyStatus.style.display = 'block';
                    });
                } catch (e) {
                    // 回退到旧方法
                    const img = new Image();
                    img.src = dataUrl;
                    img.onload = function() {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0);
                        
                        canvas.toBlob(function(blob) {
                            const item = new ClipboardItem({ 'image/png': blob });
                            navigator.clipboard.write([item]).then(() => {
                                copyStatus.style.display = 'block';
                                setTimeout(() => {
                                    copyStatus.style.display = 'none';
                                }, 2000);
                            }).catch(err => {
                                console.error('复制失败:', err);
                                copyStatus.textContent = '复制失败，请手动下载';
                                copyStatus.style.display = 'block';
                            });
                        });
                    };
                }
            });
    }

    // 初始化对比滑块
    function initComparisonSlider() {
        const slider = document.getElementById('comparisonSlider');
        if (!slider) return;
        
        const sliderHandle = slider.querySelector('.slider-handle');
        const originalImageDiv = slider.querySelector('.original-image');
        const middleLayer = slider.querySelector('.middle-layer');
        
        let isDragging = false;
        
        // 鼠标/触摸事件处理
        sliderHandle.addEventListener('mousedown', startDrag);
        sliderHandle.addEventListener('touchstart', startDrag);
        
        document.addEventListener('mousemove', drag);
        document.addEventListener('touchmove', drag);
        
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchend', endDrag);
        
        // 调整初始位置
        updateSliderPosition(50);
        
        function startDrag(e) {
            e.preventDefault();
            isDragging = true;
        }
        
        function endDrag() {
            isDragging = false;
        }
        
        function drag(e) {
            if (!isDragging) return;
            
            const sliderRect = slider.getBoundingClientRect();
            let x = (e.clientX || e.touches[0].clientX) - sliderRect.left;
            
            // 计算百分比位置（0-100）
            let percent = (x / sliderRect.width) * 100;
            
            // 限制范围
            percent = Math.max(0, Math.min(100, percent));
            
            // 更新位置
            updateSliderPosition(percent);
        }
        
        // 直接点击滑块区域也能移动
        slider.addEventListener('click', function(e) {
            if (e.target === sliderHandle || sliderHandle.contains(e.target)) return;
            
            const sliderRect = slider.getBoundingClientRect();
            let x = e.clientX - sliderRect.left;
            let percent = (x / sliderRect.width) * 100;
            percent = Math.max(0, Math.min(100, percent));
            
            updateSliderPosition(percent);
        });
        
        // 更新滑块位置
        function updateSliderPosition(percent) {
            sliderHandle.style.left = `${percent}%`;
            originalImageDiv.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
            middleLayer.style.left = `${percent}%`; // 更新中间层位置
        }
    }
    
    // 重置对比滑块位置
    function resetComparisonSlider() {
        const sliderHandle = document.querySelector('.slider-handle');
        const originalImageDiv = document.querySelector('.original-image');
        const middleLayer = document.querySelector('.middle-layer');
        
        if (sliderHandle && originalImageDiv && middleLayer) {
            sliderHandle.style.left = '50%';
            originalImageDiv.style.clipPath = 'inset(0 50% 0 0)';
            middleLayer.style.left = '50%'; // 重置中间层位置
        }
    }
}); 