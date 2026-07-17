// Result Page Script
// Handles displaying processed images and download functionality

let processedImages = [];

// DOM elements
let backBtn;
let resultsContainer;
let downloadAllBtn;

// Initialize the application
$(document).ready(function() {
    // Initialize DOM elements
    backBtn = document.getElementById('backBtn');
    resultsContainer = document.getElementById('resultsContainer');
    downloadAllBtn = document.getElementById('downloadAllBtn');

    // Load processed images from sessionStorage
    loadProcessedImages();

    // Set up event listeners
    setupEventListeners();
});

// Load processed images from sessionStorage
function loadProcessedImages() {
    const resultsJson = sessionStorage.getItem('processedResults');
    
    if (!resultsJson) {
        // No results found, show message and redirect after delay
        resultsContainer.innerHTML = `
            <div class="bg-white rounded-lg shadow-lg p-8 text-center">
                <i class="fas fa-image text-gray-400 text-6xl mb-4"></i>
                <h3 class="text-xl font-semibold text-gray-600 mb-2">暂无处理结果</h3>
                <p class="text-gray-500">请先上传图片进行处理</p>
                <button id="goBackBtn" class="btn btn-primary mt-4">
                    <i class="fas fa-arrow-left mr-2"></i>返回上传页面
                </button>
            </div>
        `;
        document.getElementById('goBackBtn').addEventListener('click', goBack);
        downloadAllBtn.style.display = 'none';
        return;
    }

    try {
        const results = JSON.parse(resultsJson);
        
        // Filter successful results and map to display format
        processedImages = results
            .filter(r => r.success)
            .map(r => ({
                fileName: r.fileName,
                original: r.original || '', // 原图可能在 batch 处理时未保存
                processed: r.image
            }));

        console.log('Loaded processed images:', processedImages.length);
        displayResults();
        
        // Save to history after loading
        saveToHistory();
        
    } catch (error) {
        console.error('Failed to load processed images:', error);
        resultsContainer.innerHTML = `
            <div class="bg-white rounded-lg shadow-lg p-8 text-center">
                <i class="fas fa-exclamation-triangle text-orange-500 text-6xl mb-4"></i>
                <h3 class="text-xl font-semibold text-gray-600 mb-2">加载失败</h3>
                <p class="text-gray-500">${error.message}</p>
                <button id="goBackBtn" class="btn btn-primary mt-4">
                    <i class="fas fa-arrow-left mr-2"></i>返回上传页面
                </button>
            </div>
        `;
        document.getElementById('goBackBtn').addEventListener('click', goBack);
        downloadAllBtn.style.display = 'none';
    }
}

// Display processed results with premium design
function displayResults() {
    if (processedImages.length === 0) return;

    const previewMode = localStorage.getItem('rmbg_preview_mode') || 'comparison-only';
    const showFullView = previewMode !== 'comparison-only';

    const resultCount = document.getElementById('resultCount');
    resultCount.textContent = processedImages.length;

    processedImages.forEach((item, index) => {
        const resultCard = document.createElement('div');
        resultCard.className = 'bg-white rounded-2xl shadow-xl p-8 border border-gray-100';
        
        let sideBySideHtml = '';
        if (showFullView) {
            sideBySideHtml = `
                <div class="flex flex-col md:flex-row gap-6">
                    <!-- Original Image -->
                    <div class="flex-1">
                        <h4 class="text-sm font-medium text-gray-600 mb-3 flex items-center gap-2">
                            <i class="fas fa-image text-gray-400"></i>
                            原图
                        </h4>
                        <div class="rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                            <img src="${item.original}" class="w-full max-h-[400px] object-contain" alt="原图">
                        </div>
                    </div>
                    
                    <!-- Processed Image -->
                    <div class="flex-1">
                        <h4 class="text-sm font-medium text-gray-600 mb-3 flex items-center gap-2">
                            <i class="fas fa-check-circle text-green-500"></i>
                            去除背景后
                        </h4>
                        <div class="rounded-xl overflow-hidden bg-gray-100 border border-gray-200 relative">
                            <img src="${item.processed}" class="w-full max-h-[400px] object-contain" alt="处理后">
                        </div>
                    </div>
                </div>
                
                <!-- Comparison Slider -->
                <div class="mt-8">
            `;
        } else {
            sideBySideHtml = `
                <!-- Comparison Slider -->
                <div>
            `;
        }

        resultCard.innerHTML = `
            <div class="mb-6 flex items-center justify-between">
                <div>
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
                            <i class="fas fa-image text-green-500"></i>
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold text-gray-800">图片 ${index + 1}</h3>
                            <p class="text-sm text-gray-500">${item.fileName}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            ${sideBySideHtml}
                <h4 class="text-sm font-medium text-gray-600 mb-3 flex items-center gap-2">
                    <i class="fas fa-columns text-blue-500"></i>
                    对比预览
                </h4>
                <div class="comparison-slider ${showFullView ? '' : 'comparison-slider-large'}" data-index="${index}">
                    <div class="comparison-container">
                        <div class="checkerboard-bg"></div>
                        <div class="original-image">
                            <img src="${item.original}" alt="原图">
                        </div>
                        <div class="result-image">
                            <img src="${item.processed}" alt="结果图">
                        </div>
                        <div class="middle-layer">
                            <div class="middle-content"></div>
                        </div>
                    </div>
                    <div class="slider-handle">
                        <div class="slider-line"></div>
                        <div class="slider-button">
                            <i class="fas fa-arrows-alt-h"></i>
                        </div>
                        <div class="slider-line"></div>
                    </div>
                </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="mt-8 flex flex-wrap justify-center gap-4">
                <button class="download-btn btn btn-success" data-index="${index}">
                    <i class="fas fa-download mr-2"></i>下载此图片
                </button>
                <button class="copy-btn btn btn-info" data-index="${index}">
                    <i class="fas fa-copy mr-2"></i>复制到剪贴板
                </button>
            </div>
            <div class="copy-status mt-3 text-center" style="display: none;">
                <span class="text-green-600 text-sm font-medium">
                    <i class="fas fa-check-circle mr-1"></i>
                    图片已复制到剪贴板
                </span>
            </div>
        `;
        resultsContainer.appendChild(resultCard);
    });

    initComparisonSliders();

    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const index = parseInt(e.target.closest('.copy-btn').dataset.index);
            await copyToClipboard(index);
        });
    });

    document.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const index = parseInt(e.target.closest('.download-btn').dataset.index);
            await downloadImage(index);
        });
    });
}

// Get download file name
function getDownloadFileName(originalName) {
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
    return `${nameWithoutExt}_no_bg.png`;
}

// Download single image
async function downloadImage(index) {
    console.log('downloadImage called with index:', index);
    
    if (index < 0 || index >= processedImages.length) {
        console.error('Invalid index:', index);
        return;
    }

    const item = processedImages[index];
    console.log('Downloading item:', item);
    
    const downloadName = getDownloadFileName(item.fileName);
    
    try {
        // Convert dataURL to blob and download
        const response = await fetch(item.processed);
        const blob = await response.blob();
        
        // Create download link
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = downloadName;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        setTimeout(() => {
            URL.revokeObjectURL(blobUrl);
            if (document.body.contains(a)) {
                document.body.removeChild(a);
            }
        }, 1000);
        
        console.log('Image downloaded successfully:', item.fileName);
    } catch (error) {
        console.error('Download failed:', error);
        alert('下载失败: ' + error.message);
    }
}

// Initialize comparison sliders
function initComparisonSliders() {
    const sliders = document.querySelectorAll('.comparison-slider');
    
    sliders.forEach(slider => {
        const sliderHandle = slider.querySelector('.slider-handle');
        const originalImageDiv = slider.querySelector('.original-image');
        const middleLayer = slider.querySelector('.middle-layer');
        
        let isDragging = false;

        // Update slider position
        function updateSliderPosition(percent) {
            percent = Math.max(0, Math.min(100, percent));
            sliderHandle.style.left = `${percent}%`;
            originalImageDiv.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
            if (middleLayer) {
                middleLayer.style.left = `${percent}%`;
            }
        }

        // Initialize at 50%
        updateSliderPosition(50);

        // Mouse events
        sliderHandle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            isDragging = true;
            sliderHandle.style.cursor = 'grabbing';
            document.body.style.cursor = 'grabbing';
        });

        slider.addEventListener('click', (e) => {
            if (e.target === sliderHandle || sliderHandle.contains(e.target)) return;
            const rect = slider.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percent = (x / rect.width) * 100;
            updateSliderPosition(percent);
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const rect = slider.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percent = (x / rect.width) * 100;
            updateSliderPosition(percent);
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            sliderHandle.style.cursor = 'grab';
            document.body.style.cursor = 'default';
        });

        // Touch events
        sliderHandle.addEventListener('touchstart', (e) => {
            isDragging = true;
        });

        slider.addEventListener('touchstart', (e) => {
            if (e.target === sliderHandle || sliderHandle.contains(e.target)) return;
            const touch = e.touches[0];
            const rect = slider.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const percent = (x / rect.width) * 100;
            updateSliderPosition(percent);
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const touch = e.touches[0];
            const rect = slider.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const percent = (x / rect.width) * 100;
            updateSliderPosition(percent);
        }, { passive: true });

        document.addEventListener('touchend', () => {
            isDragging = false;
        });
    });
}

// History Functions
async function saveToHistory() {
    for (const item of processedImages) {
        try {
            // 从 dataURL 生成缩略图
            const [originalThumb, processedThumb] = await Promise.all([
                createThumbnailFromDataURL(item.original, 200),
                createThumbnailFromDataURL(item.processed, 200)
            ]);
            
            // 存储原图缩略图、处理后缩略图和处理后的 dataURL
            addToHistory({
                fileName: item.fileName,
                originalThumb: originalThumb,
                processedThumb: processedThumb,
                processed: item.processed,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('Failed to save to history:', error);
        }
    }
}

// 从 dataURL 创建缩略图
function createThumbnailFromDataURL(dataUrl, maxSize) {
    return new Promise((resolve, reject) => {
        if (!dataUrl) {
            resolve('');
            return;
        }
        
        const img = new Image();
        
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // 计算缩放尺寸
            let width = img.width;
            let height = img.height;
            
            if (width > height) {
                if (width > maxSize) {
                    height = (height * maxSize) / width;
                    width = maxSize;
                }
            } else {
                if (height > maxSize) {
                    width = (width * maxSize) / height;
                    height = maxSize;
                }
            }
            
            canvas.width = width;
            canvas.height = height;
            
            ctx.drawImage(img, 0, 0, width, height);
            
            // 转换为 JPEG 格式，质量 0.7
            const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.7);
            resolve(thumbnailUrl);
        };
        
        img.onerror = () => {
            reject(new Error('Failed to create thumbnail'));
        };
        
        img.src = dataUrl;
    });
}

// 创建缩略图（保留以兼容旧代码）
function createThumbnail(blob, maxSize) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(blob);
        
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // 计算缩放尺寸
            let width = img.width;
            let height = img.height;
            
            if (width > height) {
                if (width > maxSize) {
                    height = (height * maxSize) / width;
                    width = maxSize;
                }
            } else {
                if (height > maxSize) {
                    width = (width * maxSize) / height;
                    height = maxSize;
                }
            }
            
            canvas.width = width;
            canvas.height = height;
            
            ctx.drawImage(img, 0, 0, width, height);
            
            // 转换为 JPEG 格式，质量 0.7
            const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.7);
            
            URL.revokeObjectURL(url);
            resolve(thumbnailUrl);
        };
        
        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to create thumbnail'));
        };
        
        img.src = url;
    });
}

function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => reject(new Error('Failed to convert blob to data URL'));
        reader.readAsDataURL(blob);
    });
}

function addToHistory(item) {
    try {
        let history = JSON.parse(localStorage.getItem('rmbg_history') || '[]');

        // Add to beginning
        history.unshift(item);

        // Limit to 3 items
        if (history.length > 3) {
            history = history.slice(0, 3);
        }

        // Check if there's enough space before saving
        const serialized = JSON.stringify(history);
        const estimatedSize = serialized.length * 2; // UTF-16 approximation

        // Try to save; if quota exceeded, remove oldest items until it fits
        try {
            localStorage.setItem('rmbg_history', serialized);
        } catch (quotaError) {
            console.warn('localStorage quota exceeded, removing oldest items');
            // Remove oldest items one by one until it fits
            while (history.length > 1) {
                history.pop();
                try {
                    localStorage.setItem('rmbg_history', JSON.stringify(history));
                    console.log('Saved to history after trimming:', item.fileName, '(kept', history.length, 'items)');
                    return;
                } catch (e) {
                    // Still too large, continue removing
                }
            }
            // Even with 1 item it doesn't fit - clear history entirely
            localStorage.removeItem('rmbg_history');
            console.error('Failed to save history: item too large for localStorage');
        }

        console.log('Saved to history:', item.fileName);
    } catch (error) {
        console.error('Failed to add to history:', error);
    }
}

// Copy image to clipboard
async function copyToClipboard(index) {
    if (index < 0 || index >= processedImages.length) return;

    const item = processedImages[index];
    const cards = document.querySelectorAll('.bg-white.rounded-2xl');
    const card = cards[index];
    const copyStatus = card.querySelector('.copy-status');

    try {
        const response = await fetch(item.processed);
        const blob = await response.blob();
        const data = [new ClipboardItem({ [blob.type]: blob })];
        await navigator.clipboard.write(data);

        copyStatus.textContent = '图片已复制到剪贴板！';
        copyStatus.className = 'copy-status mt-2 text-success text-center';
        copyStatus.style.display = 'block';

        setTimeout(() => {
            copyStatus.style.display = 'none';
        }, 3000);
    } catch (err) {
        console.error('复制失败:', err);
        copyStatus.textContent = '复制失败，请手动下载';
        copyStatus.className = 'copy-status mt-2 text-danger text-center';
        copyStatus.style.display = 'block';

        setTimeout(() => {
            copyStatus.style.display = 'none';
        }, 3000);
    }
}

// Download all images
async function downloadAllImages() {
    if (processedImages.length === 0) return;

    showLoading(true);

    try {
        // Download each image individually using dataURL
        processedImages.forEach((item, index) => {
            setTimeout(() => {
                const link = document.createElement('a');
                link.href = item.processed;
                link.download = getDownloadFileName(item.fileName);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }, index * 300);
        });

        setTimeout(() => {
            showLoading(false);
            alert(`已开始下载 ${processedImages.length} 张图片`);
        }, processedImages.length * 300 + 500);
    } catch (error) {
        showLoading(false);
        alert('下载失败: ' + error.message);
    }
}

// Show loading state
function showLoading(loading) {
    downloadAllBtn.disabled = loading;
    if (loading) {
        downloadAllBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>正在下载...';
    } else {
        downloadAllBtn.innerHTML = '<i class="fas fa-download mr-2"></i>下载全部图片';
    }
}

// Go back to upload page
function goBack() {
    // Clear session storage
    sessionStorage.removeItem('sessionId');
    window.location.href = 'index.html';
}

// Set up event listeners
function setupEventListeners() {
    backBtn.addEventListener('click', goBack);
    downloadAllBtn.addEventListener('click', downloadAllImages);

    // Handle back button in browser
    window.addEventListener('popstate', (e) => {
        sessionStorage.removeItem('sessionId');
    });
}