<template>
  <div class="settings-page">
    <!-- Header -->
    <header class="page-header reveal">
      <div class="header-text">
        <!-- <span class="eyebrow">Preferences</span> -->
        <h1>设置</h1>
        <p>配置应用程序行为和模型选项</p>
      </div>
    </header>

    <!-- Bento Grid -->
    <div class="settings-bento">
      <!-- Model Card -->
      <section class="bento-card wide reveal">
        <div class="card-shell">
          <div class="card-core">
            <div class="setting-header">
              <div class="setting-title-group">
                <div class="setting-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h2>抠图模型</h2>
                  <p>选择用于背景去除的 AI 模型</p>
                </div>
              </div>
              <span class="status-badge">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                RMBG Quantized
              </span>
            </div>

            <div class="model-card active">
              <div class="model-info">
                <div class="model-name">
                  RMBG Quantized Model
                  <span class="active-dot"></span>
                </div>
                <p class="model-description">使用 ONNX Runtime Web (WASM) 在浏览器端进行背景移除处理，数据无需上传服务器</p>
                <span class="model-status">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  当前使用
                </span>
              </div>
              <button class="model-btn" disabled>
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                已激活
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Preview Mode Card -->
      <section class="bento-card reveal" :style="{ animationDelay: '100ms' }">
        <div class="card-shell">
          <div class="card-core">
            <div class="setting-title-group">
              <div class="setting-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div>
                <h2>预览模式</h2>
                <p>结果页和历史详情展示方式</p>
              </div>
            </div>

            <div class="select-control">
              <select v-model="previewMode" class="setting-select">
                <option value="comparison-only">仅对比预览</option>
                <option value="full">完整展示</option>
              </select>
              <p class="control-hint">选择"仅对比预览"可隐藏单独的原图和处理后图片展示，突出对比滑块</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Auto Process Card -->
      <section class="bento-card reveal" :style="{ animationDelay: '200ms' }">
        <div class="card-shell">
          <div class="card-core">
            <div class="setting-title-group">
              <div class="setting-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div>
                <h2>上传后立即处理</h2>
                <p>选择上传后的默认行为</p>
              </div>
            </div>

            <div class="select-control">
              <select v-model="autoProcess" class="setting-select">
                <option value="no">否</option>
                <option value="yes">是</option>
              </select>
              <p class="control-hint">选择"是"则上传图片后直接开始处理，跳过文件列表页面</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Settings',
  data() {
    return {
      autoProcess: 'yes',
      previewMode: 'comparison-only'
    }
  },
  mounted() {
    this.loadSettings()
  },
  watch: {
    autoProcess(newVal) {
      localStorage.setItem('rmbg_auto_process', newVal)
    },
    previewMode(newVal) {
      localStorage.setItem('rmbg_preview_mode', newVal)
    }
  },
  methods: {
    loadSettings() {
      this.autoProcess = localStorage.getItem('rmbg_auto_process') || 'yes'
      this.previewMode = localStorage.getItem('rmbg_preview_mode') || 'comparison-only'
      // 确保默认值写入 localStorage，供其他页面读取
      if (!localStorage.getItem('rmbg_auto_process')) {
        localStorage.setItem('rmbg_auto_process', this.autoProcess)
      }
      if (!localStorage.getItem('rmbg_preview_mode')) {
        localStorage.setItem('rmbg_preview_mode', this.previewMode)
      }
    }
  }
}
</script>

<style scoped>
.settings-page {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 8px 0 64px;
  font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #0f172a;
}

.page-header {
  margin-bottom: 32px;
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.eyebrow {
  width: fit-content;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-weight: 700;
  color: #94a3b8;
  background: rgba(15, 23, 42, 0.04);
  padding: 6px 12px;
  border-radius: 9999px;
}

h1 {
  font-size: 42px;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: #0f172a;
  line-height: 1.1;
}

.header-text p {
  font-size: 16px;
  color: #64748b;
}

/* Bento Grid */
.settings-bento {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  align-items: start;
}

.bento-card {
  min-width: 0;
}

.bento-card.wide {
  grid-column: 1 / -1;
}

.card-shell {
  padding: 8px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 2rem;
  box-shadow:
    0 24px 64px rgba(15, 23, 42, 0.06),
    0 0 0 1px rgba(15, 23, 42, 0.05);
}

.card-core {
  background: #fff;
  border-radius: calc(2rem - 8px);
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.9),
    0 4px 20px rgba(15, 23, 42, 0.04);
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Setting Header */
.setting-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.setting-title-group {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.setting-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: #f1f5f9;
  color: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.setting-icon svg {
  width: 24px;
  height: 24px;
}

.setting-title-group h2 {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 4px;
}

.setting-title-group p {
  font-size: 14px;
  color: #94a3b8;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 9999px;
  background: #0f172a;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.status-badge svg {
  width: 14px;
  height: 14px;
  color: #10b981;
}

/* Model Card */
.model-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 24px;
  background: #f8fafc;
  border-radius: 20px;
  border: 1px solid rgba(15, 23, 42, 0.05);
}

.model-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.model-name {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
}

.active-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
}

.model-description {
  font-size: 14px;
  line-height: 1.6;
  color: #64748b;
  max-width: 520px;
}

.model-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  width: fit-content;
  padding: 6px 12px;
  border-radius: 9999px;
  background: rgba(15, 23, 42, 0.06);
  color: #0f172a;
  font-size: 12px;
  font-weight: 600;
}

.model-status svg {
  width: 14px;
  height: 14px;
}

.model-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border-radius: 9999px;
  border: none;
  background: rgba(15, 23, 42, 0.06);
  color: #94a3b8;
  font-size: 13px;
  font-weight: 600;
  cursor: not-allowed;
  flex-shrink: 0;
}

.model-btn svg {
  width: 14px;
  height: 14px;
}

/* Select Control */
.select-control {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.setting-select {
  width: 100%;
  padding: 14px 18px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 16px;
  background: #f8fafc;
  color: #0f172a;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 400ms cubic-bezier(0.32, 0.72, 0, 1);
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748b' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 18px center;
}

.setting-select:hover {
  border-color: rgba(15, 23, 42, 0.15);
  background: #fff;
}

.setting-select:focus {
  outline: none;
  border-color: #0f172a;
  box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.08);
}

.setting-select:focus-visible {
  outline: 2px solid #0f172a;
  outline-offset: 2px;
}

.control-hint {
  font-size: 13px;
  line-height: 1.5;
  color: #94a3b8;
}

/* Icons */
.icon {
  width: 18px;
  height: 18px;
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

/* Mobile */
@media (max-width: 768px) {
  .settings-page {
    padding: 4px 0 24px;
  }

  .page-header {
    margin-bottom: 20px;
  }

  .header-text {
    gap: 6px;
  }

  .eyebrow {
    font-size: 9px;
    padding: 5px 10px;
  }

  h1 {
    font-size: 28px;
  }

  .header-text p {
    font-size: 14px;
  }

  .settings-bento {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .bento-card.wide {
    grid-column: 1 / -1;
  }

  .card-shell {
    border-radius: 1.5rem;
    padding: 6px;
  }

  .card-core {
    padding: 20px;
    gap: 18px;
    border-radius: calc(1.5rem - 6px);
  }

  .setting-title-group {
    gap: 12px;
  }

  .setting-icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
  }

  .setting-icon svg {
    width: 22px;
    height: 22px;
  }

  .setting-title-group h2 {
    font-size: 17px;
  }

  .setting-title-group p {
    font-size: 13px;
  }

  .setting-header {
    flex-direction: column;
    gap: 12px;
  }

  .status-badge {
    align-self: flex-start;
    padding: 6px 12px;
    font-size: 11px;
  }

  .model-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: 18px;
    border-radius: 16px;
  }

  .model-name {
    font-size: 15px;
  }

  .model-description {
    font-size: 13px;
  }

  .model-btn {
    align-self: flex-start;
  }

  .setting-select {
    padding: 12px 16px;
    border-radius: 14px;
  }
}
</style>
