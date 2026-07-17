// History Detail Page Script

let historyItem = null;

// DOM elements
let loading;
let error;
let errorMessage;
let detail;
let detailFileName;
let detailTimestamp;
let fileName;
let downloadBtn;
let originalImage;
let processedImage;
let originalPreview;
let processedPreview;
let backBtn;
let goBackBtn;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize DOM elements
    loading = document.getElementById('loading');
    error = document.getElementById('error');
    errorMessage = document.getElementById('errorMessage');
    detail = document.getElementById('detail');
    detailFileName = document.getElementById('detailFileName');
    detailTimestamp = document.getElementById('detailTimestamp');
    fileName = document.getElementById('fileName');
    downloadBtn = document.getElementById('downloadBtn');
    originalImage = document.getElementById('originalImage');
    processedImage = document.getElementById('processedImage');
    originalPreview = document.getElementById('originalPreview');
    processedPreview = document.getElementById('processedPreview');
    backBtn = document.getElementById('backBtn');
    goBackBtn = document.getElementById('goBackBtn');

    // Set up event listeners
    backBtn.addEventListener('click', goBack);
    goBackBtn.addEventListener('click', goBack);
    downloadBtn.addEventListener('click', downloadImage);

    // 加载历史记录
    loadHistoryItem();
});

// Load history item from localStorage
function loadHistoryItem() {
    const params = new URLSearchParams(window.location.search);
    const index = parseInt(params.get('index'));
    
    console.log('Loading history item with index:', index);
    
    if (isNaN(index)) {
        showError('无效的记录索引');
        return;
    }

    try {
        const history = JSON.parse(localStorage.getItem('rmbg_history') || '[]');
        
        console.log('History data:', history);
        console.log('History length:', history.length);
        
        if (index < 0 || index >= history.length) {
            showError('记录不存在');
            return;
        }

        historyItem = history[index];
        console.log('Loaded history item:', historyItem);
        
        displayDetail();
        
    } catch (e) {
        console.error('Failed to load history:', e);
        showError('加载历史记录失败: ' + e.message);
    }
}

// Display detail
function displayDetail() {
    if (!historyItem) return;

    console.log('History item:', historyItem);

    loading.classList.add('hidden');
    
    fileName.textContent = historyItem.fileName || '未知文件';

    const previewMode = localStorage.getItem('rmbg_preview_mode') || 'comparison-only';
    const showFullView = previewMode !== 'comparison-only';

    if (!showFullView) {
        const sideBySideContainer = document.querySelector('#detail .flex.flex-col.md\\:flex-row');
        if (sideBySideContainer) {
            sideBySideContainer.style.display = 'none';
        }
        
        const comparisonSlider = document.querySelector('#detail .comparison-slider');
        if (comparisonSlider) {
            comparisonSlider.classList.add('comparison-slider-large');
        }
    }

    // 优先使用存储的完整图片数据，其次使用缩略图
    if (historyItem.processed) {
        console.log('Using stored processed image data');
        processedImage.src = historyItem.processed;
        processedPreview.src = historyItem.processed;
    } else if (historyItem.processedThumb) {
        console.log('Using processed thumbnail');
        processedImage.src = historyItem.processedThumb;
        processedPreview.src = historyItem.processedThumb;
    } else {
        console.error('History item missing processed image data:', historyItem);
        showError('此历史记录数据不完整，请重新处理图片');
        return;
    }

    if (historyItem.original) {
        console.log('Using stored original image data');
        originalImage.src = historyItem.original;
        originalPreview.src = historyItem.original;
    } else if (historyItem.originalThumb) {
        console.log('Using original thumbnail');
        originalImage.src = historyItem.originalThumb;
        originalPreview.src = historyItem.originalThumb;
    } else {
        console.warn('History item missing original image data');
        originalPreview.alt = '原图不可用';
        originalImage.alt = '原图不可用';
    }

    detail.classList.remove('hidden');

    setTimeout(initComparisonSlider, 100);
}

// Show error
function showError(message) {
    loading.classList.add('hidden');
    errorMessage.textContent = message;
    error.classList.remove('hidden');
}

// Go back to upload page
function goBack() {
    // 标记从详情页返回，让主页自动打开历史记录弹窗
    sessionStorage.setItem('showHistoryOnLoad', 'true');
    // 保存主页当前视图状态
    sessionStorage.setItem('filesViewVisible', 
        document.getElementById('filesView') ? 'false' : 'true');
    window.location.href = 'index.html';
}

// Download image
async function downloadImage() {
    if (!historyItem) return;

    console.log('Download history item:', historyItem);
    
    // 获取文件名
    const originalName = historyItem.fileName || 'image';
    const downloadName = originalName.replace(/\.[^/.]+$/, '_no_bg.png');
    
    // 优先使用完整图片数据，其次使用缩略图
    const imageData = historyItem.processed || historyItem.processedThumb;
    
    if (!imageData) {
        alert('无法下载图片，数据不存在');
        return;
    }
    
    try {
        const response = await fetch(imageData);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = downloadName;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
            URL.revokeObjectURL(blobUrl);
            if (document.body.contains(a)) {
                document.body.removeChild(a);
            }
        }, 1000);
        
        console.log('Download successful');
    } catch (error) {
        console.error('Download failed:', error);
        alert('下载失败: ' + error.message);
    }
}

// Initialize comparison slider
function initComparisonSlider() {
    const slider = document.querySelector('.comparison-slider');
    if (!slider) return;

    const sliderHandle = slider.querySelector('.slider-handle');
    const originalImageDiv = slider.querySelector('.original-image');
    const middleLayer = slider.querySelector('.middle-layer');
    
    let isDragging = false;

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
}