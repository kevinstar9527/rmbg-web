// Upload Page Script
// Handles multi-file upload and processing

let selectedFiles = [];
let processedImages = [];
let fileThumbnails = []; // Store thumbnails data
let processingHistory = []; // 存储历史记录

// DOM elements
let fileInput;
let pasteBtn;
let dropArea;
let fileList;
let noFilesText;
let processBtn;
let clearAllBtn;
let backBtn;
let backToFilesBtn;
let actionBar;
let totalSizeElement;
let progressDialog;
let statusText;
let progressBar;
let progressText;
let uploadView;
let filesView;
let historyList;
let noHistoryText;
let historyFooter;
let clearHistoryBtn;
let navItems;
let pages;
let autoProcessSetting;

// 模型管理相关变量
let availableModels = [];
let modelRefreshInterval = null;

// Initialize the application
$(document).ready(function() {
    // Initialize DOM elements
    fileInput = document.getElementById('fileInput');
    pasteBtn = document.getElementById('pasteBtn');
    dropArea = document.getElementById('dropArea');
    fileList = document.getElementById('fileList');
    noFilesText = document.getElementById('noFilesText');
    processBtn = document.getElementById('processBtn');
    clearAllBtn = document.getElementById('clearAllBtn');
    backBtn = document.getElementById('backBtn');
    backToFilesBtn = document.getElementById('backToFilesBtn');
    actionBar = document.getElementById('actionBar');
    totalSizeElement = document.getElementById('totalSize');
    progressDialog = document.getElementById('progressDialog');
    statusText = document.getElementById('statusText');
    progressBar = document.getElementById('progressBar');
    progressText = document.getElementById('progressText');
    uploadView = document.getElementById('uploadView');
    filesView = document.getElementById('filesView');
    historyList = document.getElementById('historyList');
    noHistoryText = document.getElementById('noHistoryText');
    historyFooter = document.getElementById('historyFooter');
    clearHistoryBtn = document.getElementById('clearHistoryBtn');
    navItems = document.querySelectorAll('.nav-item[data-page]');
    pages = document.querySelectorAll('.page');
    autoProcessSetting = document.getElementById('autoProcessSetting') || null;

    // Set up event listeners
    setupEventListeners();

    // 加载设置
    loadSettings();

    // 加载历史记录
    loadHistory();

    // 加载模型列表（本地处理模式）
    loadModels();

    // 检查是否从详情页返回，如果是则自动显示历史记录页面
    if (sessionStorage.getItem('showHistoryOnLoad') === 'true') {
        sessionStorage.removeItem('showHistoryOnLoad');
        
        // 恢复主页视图状态
        const mainView = sessionStorage.getItem('mainView');
        sessionStorage.removeItem('mainView');
        
        if (mainView === 'files') {
            uploadView.style.display = 'none';
            filesView.style.display = 'block';
        }
        
        setTimeout(() => {
            // 切换到历史记录页面
            switchPage('history');
            
            // 恢复历史记录列表的滚动位置
            const scrollTop = sessionStorage.getItem('historyScrollTop');
            if (scrollTop) {
                sessionStorage.removeItem('historyScrollTop');
                const historyPage = document.getElementById('page-history');
                if (historyPage) {
                    historyPage.scrollTop = parseInt(scrollTop);
                }
            }
        }, 100);
    }

    showStatus('准备就绪，可以开始上传图片', 'success');
});

// Set up event listeners
function setupEventListeners() {
    // File input change event (supports multiple files)
    fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
            addFiles(Array.from(e.target.files));
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
                        addFiles([blob]);
                    });
                    break;
                }
            }
        }).catch(err => {
            showStatus('无法访问剪贴板，请尝试使用键盘快捷键 Ctrl+V', 'error');
        });
    });

    // Global paste event
    document.addEventListener('paste', (e) => {
        if (e.clipboardData && e.clipboardData.items) {
            const items = e.clipboardData.items;
            const imageFiles = [];
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const blob = items[i].getAsFile();
                    imageFiles.push(blob);
                }
            }
            if (imageFiles.length > 0) {
                addFiles(imageFiles);
            }
        }
    });

    // Prevent default browser drag-and-drop behavior at document level
    // This stops the WebView from navigating to the dropped file
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        document.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
        }, false);
    });

    // Drag and drop events on dropArea
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
        dropArea.classList.add('drag-over');
    }

    function unhighlight() {
        dropArea.classList.remove('drag-over');
    }

    dropArea.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        if (dt && dt.files && dt.files.length > 0) {
            addFiles(Array.from(dt.files));
        }
    });

    // Process button click
    processBtn.addEventListener('click', processAllImages);

    // Clear all button click
    clearAllBtn.addEventListener('click', clearAllFiles);

    // Back button click - return to upload view (keep selected files)
    backBtn.addEventListener('click', () => {
        uploadView.style.display = 'block';
        filesView.style.display = 'none';
        // Show back to files button if there are files selected
        if (selectedFiles.length > 0) {
            backToFilesBtn.classList.remove('hidden');
        }
    });

    // Back to files button click - return to files view
    backToFilesBtn.addEventListener('click', () => {
        uploadView.style.display = 'none';
        filesView.style.display = 'block';
        backToFilesBtn.classList.add('hidden');
    });

    // Drop area click to open file dialog
    dropArea.addEventListener('click', (e) => {
        // 阻止点击按钮或标签时触发文件选择
        const target = e.target;
        if (target.tagName === 'BUTTON' || target.tagName === 'LABEL' || 
            target.closest('button') || target.closest('label')) {
            return;
        }
        fileInput.click();
    });

    // Navigation items click
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.getAttribute('data-page');
            switchPage(page);
        });
    });

    // Clear history
    clearHistoryBtn.addEventListener('click', clearHistory);

    // Settings change
    if (autoProcessSetting) {
        autoProcessSetting.addEventListener('change', (e) => {
            localStorage.setItem('rmbg_auto_process', e.target.value);
        });
    }
}

// Switch between pages
function switchPage(pageName) {
    console.log('Switching to page:', pageName);

    if (!pageName) {
        return;
    }

    navItems.forEach(item => {
        if (item.getAttribute('data-page') === pageName) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Update pages
    Array.from(pages).forEach(page => {
        if (page.id === `page-${pageName}`) {
            page.style.display = 'block';
            page.classList.add('active');
            console.log('Showing page:', page.id);
        } else {
            page.style.display = 'none';
            page.classList.remove('active');
            console.log('Hiding page:', page.id);
        }
    });

    // If switching to history page, render history
    if (pageName === 'history') {
        renderHistory();
    }

    // If switching to settings page, load current settings and models
    if (pageName === 'settings') {
        loadSettings();
        loadModels();
        startModelProgressPolling();
    } else {
        stopModelProgressPolling();
    }
}

// Clear all selected files
function clearAllFiles() {
    selectedFiles = [];
    fileThumbnails = [];
    uploadView.style.display = 'block';
    filesView.style.display = 'none';
    updateFileList();
    updateProcessButton();
    showStatus('已清空所有文件', 'success');
}

// Add files to the selected files list
function addFiles(files) {
    const newFiles = [];
    
    files.forEach(file => {
        // Check if file is an image
        if (!file.type.match('image.*')) {
            showStatus(`"${file.name}" 不是有效的图片文件`, 'error');
            return;
        }

        // Check if file already selected
        const exists = selectedFiles.some(f => f.name === file.name && f.size === file.size);
        if (exists) {
            showStatus(`"${file.name}" 已在列表中`, 'warning');
            return;
        }

        // Add to selected files
        selectedFiles.push(file);
        newFiles.push(file);
    });

    // Generate thumbnails for new files
    newFiles.forEach((file, idx) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const thumbnailIndex = selectedFiles.length - newFiles.length + idx;
            if (!fileThumbnails[thumbnailIndex]) {
                fileThumbnails[thumbnailIndex] = e.target.result;
            }
            // 缩略图生成完成后刷新列表
            updateFileList();
        };
        reader.readAsDataURL(file);
    });

    // Check auto-process setting
    const autoProcess = localStorage.getItem('rmbg_auto_process') || 'no';

    if (autoProcess === 'yes' && selectedFiles.length > 0) {
        // Directly process images without showing file list
        processAllImages();
        return;
    }

    // Switch to files view after adding files
    if (selectedFiles.length > 0) {
        uploadView.style.display = 'none';
        filesView.style.display = 'block';
    }

    updateFileList();
    updateProcessButton();
}

// Calculate total size of selected files
function calculateTotalSize() {
    return selectedFiles.reduce((total, file) => total + file.size, 0);
}

// Update the file list display with thumbnails
function updateFileList() {
    const fileCount = document.getElementById('fileCount');
    
    // Update file count display
    if (selectedFiles.length === 0) {
        fileCount.textContent = '0 个文件';
        clearAllBtn.style.display = 'none';
        actionBar.style.display = 'none';
        
        fileList.innerHTML = `
            <div id="noFilesText" class="empty-state">
                <i class="fas fa-image text-gray-300"></i>
                <p>暂无选择的文件</p>
                <p class="text-xs text-gray-400 mt-1">点击上方按钮或拖放图片开始上传</p>
            </div>
        `;
        return;
    }

    // Update UI for selected files
    fileCount.textContent = `${selectedFiles.length} 个文件`;
    clearAllBtn.style.display = 'block';
    actionBar.style.display = 'block';
    
    // Update total size
    totalSizeElement.textContent = formatFileSize(calculateTotalSize());

    fileList.innerHTML = '';

    selectedFiles.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-card';
        const thumbnail = fileThumbnails[index] || '';
        
        fileItem.innerHTML = `
            <div class="file-thumbnail">
                ${thumbnail ? `
                    <img src="${thumbnail}" alt="${file.name}">
                ` : `
                    <div class="w-full h-full flex items-center justify-center">
                        <i class="fas fa-file-image text-gray-400 text-3xl"></i>
                    </div>
                `}
                <button class="remove-btn absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition" data-index="${index}" title="移除文件">
                    <i class="fas fa-times text-xs"></i>
                </button>
            </div>
            <div class="file-info">
                <div class="file-name" title="${file.name}">${file.name}</div>
                <div class="file-size">${formatFileSize(file.size)}</div>
            </div>
        `;
        fileList.appendChild(fileItem);
    });

    // Add remove button listeners
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.closest('.remove-btn').dataset.index);
            removeFile(index);
        });
    });
}

// Remove file from list
function removeFile(index) {
    selectedFiles.splice(index, 1);
    updateFileList();
    updateProcessButton();
}

// Format file size
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// Update process button state
function updateProcessButton() {
    // Since actionBar is hidden when no files are selected, 
    // we just need to update the button text when files exist
    if (selectedFiles.length > 0) {
        processBtn.innerHTML = `<i class="fas fa-magic mr-2"></i>开始处理 (${selectedFiles.length} 个文件)`;
    }
}

// Process all images using ONNX Runtime Web
async function processAllImages() {
    if (selectedFiles.length === 0) return;

    // Show progress dialog
    progressDialog.classList.remove('hidden');
    processedImages = [];

    // Read all files first
    showStatus('正在读取文件...', 'processing');
    const imagesData = [];
    
    for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const dataUrl = await readFileAsDataURL(file);
        imagesData.push({
            image: dataUrl,
            fileName: file.name
        });
        updateProgress(((i + 1) / selectedFiles.length) * 10); // 10% for reading
    }

    // Process images using ONNX Runtime Web
    showStatus('正在加载模型...', 'processing');
    
    try {
        // Batch process with progress callback
        const results = await window.ONNXProcessor.removeBackgroundBatch(
            imagesData,
            1024, // input size
            (current, total, fileName) => {
                const progress = 10 + (current / total) * 90; // 10-100%
                updateProgress(progress);
                showStatus(`正在处理: ${fileName} (${current + 1}/${total})`, 'processing');
            }
        );

        // Add original image data to results
        results.forEach((result, i) => {
            if (result.success) {
                result.original = imagesData[i].image;
            }
        });

        // Check results
        const successCount = results.filter(r => r.success).length;
        if (successCount === 0) {
            throw new Error('所有图片处理失败');
        }

        // Update progress to 100%
        updateProgress(100);
        showStatus(`处理完成！成功 ${successCount}/${results.length} 张图片`, 'success');
        
        // Store results in sessionStorage and redirect
        sessionStorage.setItem('processedResults', JSON.stringify(results));
        console.log('Processed results stored:', results.length);
        
        setTimeout(() => {
            window.location.href = 'result.html';
            console.log('Redirecting to result.html');
        }, 500);
        
    } catch (error) {
        console.error('Batch processing error:', error);
        progressDialog.classList.add('hidden');
        showStatus(`处理失败: ${error.message}`, 'error');
    }
}

// Helper function to read file as data URL
function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => reject(new Error('无法读取文件'));
        reader.readAsDataURL(file);
    });
}

// Process single image using ONNX Runtime Web
async function processImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = async (e) => {
            const originalDataUrl = e.target.result;
            console.log('File read successfully, size:', originalDataUrl.length);
            
            try {
                // Process using ONNX Runtime Web
                const result = await window.ONNXProcessor.removeBackground(originalDataUrl, 1024);
                
                if (!result.success) {
                    throw new Error(result.error || '处理失败');
                }

                console.log('Processing successful, result size:', result.image ? result.image.length : 0);
                resolve({
                    original: originalDataUrl,
                    processed: result.image
                });
            } catch (error) {
                console.error('Error in processImage:', error);
                reject(error);
            }
        };
        
        reader.onerror = (event) => {
            console.error('FileReader error:', event);
            reject(new Error('无法读取文件: ' + event.target.error));
        };
        
        reader.onabort = () => {
            console.error('FileReader aborted');
            reject(new Error('读取文件被中止'));
        };
        
        reader.readAsDataURL(file);
        console.log('Started reading file:', file.name);
    });
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
        case 'processing':
            statusText.classList.add('text-primary');
            break;
        default:
            statusText.classList.add('text-gray-500');
    }
}

// Update progress bar
function updateProgress(percent) {
    progressBar.style.width = `${percent}%`;
    progressBar.setAttribute('aria-valuenow', percent);
    progressText.textContent = `${Math.round(percent)}%`;
}

// History Functions
function loadHistory() {
    try {
        const saved = localStorage.getItem('rmbg_history');
        if (saved) {
            processingHistory = JSON.parse(saved);
        }
    } catch (e) {
        console.error('Failed to load history:', e);
        processingHistory = [];
    }
}

function saveHistory() {
    try {
        localStorage.setItem('rmbg_history', JSON.stringify(processingHistory));
    } catch (e) {
        console.error('Failed to save history:', e);
    }
}

function addToHistory(item) {
    // 添加到历史记录开头
    processingHistory.unshift(item);

    // 限制历史记录数量（最多保存3条）
    if (processingHistory.length > 3) {
        processingHistory = processingHistory.slice(0, 3);
    }

    saveHistory();
}

function showHistory() {
    switchPage('history');
    renderHistory();
}

function hideHistory() {
    switchPage('upload');
}

async function clearHistory() {
    // 检查是否在 Tauri 环境中
    const isTauri = window.__TAURI_INTERNALS__ !== undefined ||
                    window.__TAURI__ !== undefined ||
                    window.tauri !== undefined;

    let confirmed = false;

    if (isTauri) {
        // 使用自定义的 Tauri 命令
        try {
            let invoke;
            if (window.__TAURI__ && typeof window.__TAURI__.invoke === 'function') {
                invoke = window.__TAURI__.invoke;
            } else if (window.__TAURI_INTERNALS__ && typeof window.__TAURI_INTERNALS__.invoke === 'function') {
                invoke = window.__TAURI_INTERNALS__.invoke;
            } else if (window.__TAURI__ && window.__TAURI__.core && typeof window.__TAURI__.core.invoke === 'function') {
                invoke = window.__TAURI__.core.invoke;
            }

            if (invoke) {
                confirmed = await invoke('confirm_dialog', {
                    message: '确定要清空所有历史记录吗？'
                });
            } else {
                // 回退到原生 confirm
                confirmed = confirm('确定要清空所有历史记录吗？');
            }
        } catch (e) {
            console.error('Tauri confirm failed:', e);
            // 回退到原生 confirm
            confirmed = confirm('确定要清空所有历史记录吗？');
        }
    } else {
        confirmed = confirm('确定要清空所有历史记录吗？');
    }

    if (confirmed) {
        processingHistory = [];
        saveHistory();
        renderHistory();
        showStatus('历史记录已清空', 'success');
    }
}

function renderHistory() {
    if (processingHistory.length === 0) {
        historyList.style.display = 'none';
        noHistoryText.style.display = 'flex';
        historyFooter.style.display = 'none';
        return;
    }

    historyList.style.display = 'block';
    noHistoryText.style.display = 'none';
    historyFooter.style.display = 'flex';
    
    // 清空历史记录列表
    historyList.innerHTML = '';
    
    // 渲染每个历史记录项
    processingHistory.forEach((item, index) => {
        const date = new Date(item.timestamp);
        const dateStr = date.toLocaleDateString('zh-CN');
        const timeStr = date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        
        // 使用存储的缩略图
        let thumbnailUrl;
        if (item.processedThumb) {
            thumbnailUrl = item.processedThumb;
        } else if (item.thumbnail) {
            thumbnailUrl = item.thumbnail;
        } else {
            thumbnailUrl = item.processed || '';
        }
        
        // 创建历史记录项元素
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <img src="${thumbnailUrl}" alt="${item.fileName}" class="history-thumbnail" />
            <div class="history-info">
                <div class="history-name">${item.fileName}</div>
                <div class="history-meta">${dateStr} ${timeStr}</div>
            </div>
            <div class="history-actions">
                <button class="history-action-btn history-view-btn">
                    <i class="fas fa-eye mr-1"></i>查看
                </button>
                <button class="history-action-btn history-download-btn">
                    <i class="fas fa-download mr-1"></i>下载
                </button>
            </div>
        `;
        
        // 添加事件监听器
        const viewBtn = historyItem.querySelector('.history-view-btn');
        const downloadBtn = historyItem.querySelector('.history-download-btn');
        
        viewBtn.addEventListener('click', () => viewHistoryItem(index));
        downloadBtn.addEventListener('click', () => downloadHistoryItem(index));
        
        // 添加到历史记录列表
        historyList.appendChild(historyItem);
    });
}

function viewHistoryItem(index) {
    console.log('View history item:', index);
    console.log('History length:', processingHistory.length);
    console.log('History item:', processingHistory[index]);
    
    if (index < 0 || index >= processingHistory.length) {
        console.error('Invalid history index:', index);
        alert('无效的历史记录索引');
        return;
    }
    
    const item = processingHistory[index];
    if (!item) {
        console.error('Invalid history item:', item);
        alert('历史记录数据无效');
        return;
    }
    
    // 保存历史记录列表的滚动位置
    const historyPage = document.getElementById('page-history');
    if (historyPage) {
        sessionStorage.setItem('historyScrollTop', historyPage.scrollTop.toString());
    }
    
    // 保存主页视图状态
    sessionStorage.setItem('mainView', uploadView.style.display === 'none' ? 'files' : 'upload');
    
    // 跳转到详情页面
    const url = `history-detail.html?index=${index}`;
    console.log('Navigating to:', url);
    
    window.location.href = url;
}

async function downloadHistoryItem(index) {
    console.log('Download history item:', index);
    
    if (index < 0 || index >= processingHistory.length) {
        console.error('Invalid history index:', index);
        return;
    }
    
    const item = processingHistory[index];
    if (!item) {
        console.error('History item not found:', index);
        return;
    }
    
    const downloadName = item.fileName.replace(/\.[^/.]+$/, '_no_bg.png');
    
    // 优先使用完整图片数据，其次使用缩略图
    const imageData = item.processed || item.processedThumb;
    
    if (!imageData) {
        showStatus('无法下载图片，数据不存在', 'error');
        return;
    }
    
    try {
        const response = await fetch(imageData);
        const blob = await response.blob();
        
        // Create download link
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = downloadName;
        a.style.display = 'none';
        document.body.appendChild(a);
        
        a.click();
        
        // Cleanup after delay
        setTimeout(() => {
            URL.revokeObjectURL(blobUrl);
            if (document.body.contains(a)) {
                document.body.removeChild(a);
            }
        }, 1000);
        
        showStatus(`已下载: ${item.fileName}`, 'success');
    } catch (error) {
        console.error('Download error:', error);
        showStatus('下载失败: ' + error.message, 'error');
    }
}

// 确保函数在全局作用域
window.viewHistoryItem = viewHistoryItem;
window.downloadHistoryItem = downloadHistoryItem;

// Settings Functions
function loadSettings() {
    const autoProcess = localStorage.getItem('rmbg_auto_process') || 'no';
    if (autoProcessSetting) {
        autoProcessSetting.value = autoProcess;
    }
}

// ==================== 模型管理函数（本地处理模式） ====================

async function loadModels() {
    // 本地 ONNX 处理模式，显示固定模型信息
    const modelList = document.getElementById('modelList');
    if (modelList) {
        modelList.innerHTML = `
            <div class="model-card active">
                <div class="model-info">
                    <div class="model-name">
                        RMBG Quantized Model
                        <span class="active-indicator"></span>
                    </div>
                    <div class="model-description">
                        使用 ONNX Runtime Web (WASM) 在浏览器端进行背景移除处理
                    </div>
                    <span class="model-status active">
                        <i class="fas fa-check"></i>
                        当前使用
                    </span>
                </div>
                <div class="model-actions">
                    <button class="model-btn model-btn-active" disabled>
                        <i class="fas fa-check"></i>
                        已激活
                    </button>
                </div>
            </div>
        `;
    }
    
    // 更新顶部模型徽章
    const badge = document.getElementById('currentModelBadge');
    const nameSpan = document.getElementById('currentModelName');
    if (badge && nameSpan) {
        nameSpan.textContent = 'RMBG Quantized';
        badge.style.background = 'var(--green-500)';
    }
}

function renderModelList() {
    // 本地处理模式，无需渲染
}

function updateCurrentModelBadge() {
    // 本地处理模式，无需更新
}

async function activateModel(modelId) {
    showStatus('本地处理模式，无需切换模型', 'info');
}

async function downloadModel(modelId) {
    showStatus('模型已内置，无需下载', 'info');
}

function startModelProgressPolling() {
    // 本地处理模式，无需轮询
}

function stopModelProgressPolling() {
    // 本地处理模式，无需轮询
}

// 确保模型管理函数在全局作用域
window.activateModel = activateModel;
window.downloadModel = downloadModel;
