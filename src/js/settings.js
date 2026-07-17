// Settings Page Script

let autoProcessSetting;
let previewModeSetting;

document.addEventListener('DOMContentLoaded', function() {
    autoProcessSetting = document.getElementById('autoProcessSetting');
    previewModeSetting = document.getElementById('previewModeSetting');

    setupEventListeners();
    loadSettings();
    displayModelInfo();
});

function setupEventListeners() {
    if (autoProcessSetting) {
        autoProcessSetting.addEventListener('change', (e) => {
            localStorage.setItem('rmbg_auto_process', e.target.value);
        });
    }

    if (previewModeSetting) {
        previewModeSetting.addEventListener('change', (e) => {
            localStorage.setItem('rmbg_preview_mode', e.target.value);
        });
    }
}

function loadSettings() {
    const autoProcess = localStorage.getItem('rmbg_auto_process') || 'yes';
    if (autoProcessSetting) {
        autoProcessSetting.value = autoProcess;
    }

    const previewMode = localStorage.getItem('rmbg_preview_mode') || 'comparison-only';
    if (previewModeSetting) {
        previewModeSetting.value = previewMode;
    }
}

function displayModelInfo() {
    const modelList = document.getElementById('modelList');
    const currentModelBadge = document.getElementById('currentModelBadge');
    const currentModelName = document.getElementById('currentModelName');

    // 显示当前使用的模型信息
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
    if (currentModelBadge && currentModelName) {
        currentModelName.textContent = 'RMBG Quantized';
        currentModelBadge.style.background = 'var(--green-500)';
    }
}
