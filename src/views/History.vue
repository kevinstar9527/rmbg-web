<template>
  <div class="history-page">
    <!-- Header -->
    <header class="page-header reveal">
      <div class="header-text">
        <span class="eyebrow">Processing History</span>
        <h1>历史记录</h1>
        <p>查看和管理已处理的图片</p>
      </div>
      <button v-if="history.length > 0" @click="clearHistory" class="text-pill danger">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>清空历史</span>
      </button>
    </header>

    <!-- History Grid -->
    <div v-if="history.length > 0" class="history-grid">
      <div v-for="(item, index) in history" :key="index" class="history-card reveal" :style="{ animationDelay: `${index * 70}ms` }">
        <div class="history-shell">
          <div class="history-core">
            <div class="history-thumb">
              <img :src="item.processedThumb || item.processed" :alt="item.fileName">
            </div>
            <div class="history-body">
              <div class="history-info">
                <div class="history-name">{{ item.fileName }}</div>
                <div class="history-meta">{{ formatTime(item.timestamp) }}</div>
              </div>
              <div class="history-actions">
                <button @click="viewDetail(index)" class="icon-action" title="查看">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
                <button @click="downloadImage(index)" class="icon-action" title="下载">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state reveal">
      <div class="empty-shell">
        <div class="empty-core">
          <div class="empty-icon-ring">
            <svg class="icon-xl" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="M21 15l-5-5L5 21"/>
            </svg>
          </div>
          <h2>暂无历史记录</h2>
          <p>处理图片后会显示在这里，随时查看和下载</p>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <div v-if="showDetail" class="detail-overlay" @click.self="closeDetail">
      <div class="detail-shell reveal">
        <div class="detail-core">
          <!-- Modal Header -->
          <div class="detail-header">
            <div class="detail-title">
              <button @click="closeDetail" class="icon-action back">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <span class="detail-filename">{{ selectedHistory.fileName }}</span>
            </div>
            <div class="detail-actions">
              <button @click="downloadImage(selectedIndex)" class="icon-action" title="下载">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <button @click="copyToClipboard" class="icon-action" title="复制到剪贴板">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Comparison Slider -->
          <div class="comparison-shell">
            <div class="comparison-slider" @mousedown="startDrag" @touchstart="startDrag">
              <div class="comparison-container">
                <div class="checkerboard-bg"></div>
                <div class="original-image" :style="{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }">
                  <img :src="selectedHistory.original || selectedHistory.originalThumb" alt="原图">
                </div>
                <div class="result-image">
                  <img :src="selectedHistory.processed" alt="处理后">
                </div>
                <div class="middle-layer" :style="{ left: sliderPosition + '%' }"></div>
              </div>
              <div class="slider-handle" :style="{ left: sliderPosition + '%' }">
                <div class="slider-line"></div>
                <div class="slider-button">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="slider-line"></div>
              </div>
            </div>
          </div>

          <!-- Copy Toast -->
          <transition name="toast">
            <div v-if="copyStatus" class="copy-toast">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>已复制到剪贴板</span>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAllHistory, clearHistory as clearHistoryDB } from '../utils/history-db'

export default {
  name: 'History',
  data() {
    return {
      history: [],
      showDetail: false,
      selectedHistory: null,
      selectedIndex: null,
      sliderPosition: 50,
      copyStatus: false
    }
  },
  mounted() {
    this.loadHistory()
  },
  methods: {
    async loadHistory() {
      try {
        this.history = await getAllHistory()
      } catch (error) {
        console.error('加载历史记录失败:', error)
      }
    },
    formatTime(timestamp) {
      const date = new Date(timestamp)
      const now = new Date()
      const diff = now - date

      if (diff < 60000) return '刚刚'
      if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前'
      if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前'
      if (diff < 604800000) return Math.floor(diff / 86400000) + '天前'

      return date.toLocaleDateString('zh-CN')
    },
    viewDetail(index) {
      this.selectedIndex = index
      this.selectedHistory = this.history[index]
      this.sliderPosition = 50
      this.showDetail = true
    },
    closeDetail() {
      this.showDetail = false
      this.selectedHistory = null
      this.selectedIndex = null
    },
    async downloadImage(index) {
      const item = this.history[index]
      if (!item) return

      const downloadName = item.fileName.replace(/\.[^/.]+$/, '_no_bg.png')

      try {
        const response = await fetch(item.processed)
        const blob = await response.blob()
        const blobUrl = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = blobUrl
        a.download = downloadName
        a.click()
        URL.revokeObjectURL(blobUrl)
      } catch (error) {
        console.error('下载失败:', error)
        alert('下载失败: ' + error.message)
      }
    },
    async clearHistory() {
      if (confirm('确定要清空所有历史记录吗？')) {
        try {
          await clearHistoryDB()
          this.history = []
        } catch (error) {
          console.error('清空历史记录失败:', error)
          alert('清空历史记录失败')
        }
      }
    },
    async copyToClipboard() {
      if (!this.selectedHistory) return

      try {
        const response = await fetch(this.selectedHistory.processed)
        const blob = await response.blob()

        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob
          })
        ])

        this.copyStatus = true
        setTimeout(() => {
          this.copyStatus = false
        }, 2000)
      } catch (error) {
        console.error('复制失败:', error)
        alert('复制失败: ' + error.message)
      }
    },
    startDrag(event) {
      event.preventDefault()

      const sliderWrapper = event.currentTarget
      const slider = sliderWrapper.querySelector('.comparison-container')
      if (!slider) return

      const rect = slider.getBoundingClientRect()

      const updatePosition = (clientX) => {
        const x = clientX - rect.left
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
        this.sliderPosition = percentage
      }

      const onMove = (e) => {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX
        updatePosition(clientX)
      }

      const onEnd = () => {
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', onEnd)
        document.removeEventListener('touchmove', onMove)
        document.removeEventListener('touchend', onEnd)
      }

      document.addEventListener('mousemove', onMove)
      document.addEventListener('mouseup', onEnd)
      document.addEventListener('touchmove', onMove)
      document.addEventListener('touchend', onEnd)

      const clientX = event.touches ? event.touches[0].clientX : event.clientX
      updatePosition(clientX)
    }
  }
}
</script>

<style scoped>
.history-page {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 8px 0 64px;
  font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #0f172a;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
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

.text-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: 9999px;
  border: none;
  background: rgba(15, 23, 42, 0.04);
  color: #64748b;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 400ms cubic-bezier(0.32, 0.72, 0, 1);
  flex-shrink: 0;
}

.text-pill:hover {
  background: rgba(239, 68, 68, 0.08);
  color: #ef4444;
}

.text-pill svg {
  width: 16px;
  height: 16px;
}

/* History Grid */
.history-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.history-card {
  min-width: 0;
}

.history-shell {
  padding: 8px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 1.75rem;
  box-shadow:
    0 24px 64px rgba(15, 23, 42, 0.06),
    0 0 0 1px rgba(15, 23, 42, 0.05);
  transition: all 500ms cubic-bezier(0.32, 0.72, 0, 1);
}

.history-card:hover .history-shell {
  transform: translateY(-4px);
  box-shadow:
    0 32px 72px rgba(15, 23, 42, 0.1),
    0 0 0 1px rgba(15, 23, 42, 0.06);
}

.history-core {
  background: #fff;
  border-radius: calc(1.75rem - 8px);
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.9),
    0 4px 20px rgba(15, 23, 42, 0.04);
  overflow: hidden;
}

.history-thumb {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  background: #e2e8f0;
  overflow: hidden;
}

.history-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 700ms cubic-bezier(0.32, 0.72, 0, 1);
}

.history-card:hover .history-thumb img {
  transform: scale(1.05);
}

.history-body {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px;
}

.history-info {
  flex: 1;
  min-width: 0;
}

.history-name {
  font-size: 15px;
  font-weight: 600;
  color: #0f172a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 4px;
}

.history-meta {
  font-size: 13px;
  color: #94a3b8;
}

.history-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.icon-action {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: none;
  background: #f1f5f9;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 400ms cubic-bezier(0.32, 0.72, 0, 1);
}

.icon-action:hover {
  background: #0f172a;
  color: #fff;
  transform: translateY(-1px);
}

.icon-action.back:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.icon-action svg {
  width: 18px;
  height: 18px;
}

/* Empty State */
.empty-state {
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
}

.empty-shell {
  padding: 8px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 2rem;
  box-shadow:
    0 24px 64px rgba(15, 23, 42, 0.06),
    0 0 0 1px rgba(15, 23, 42, 0.05);
}

.empty-core {
  background: #fff;
  border-radius: calc(2rem - 8px);
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.9),
    0 4px 20px rgba(15, 23, 42, 0.04);
  padding: 80px 32px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-icon-ring {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: #f1f5f9;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 28px;
}

.empty-core h2 {
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 10px;
}

.empty-core p {
  font-size: 15px;
  color: #64748b;
  max-width: 320px;
}

/* Detail Modal */
.detail-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  animation: fadeIn 400ms cubic-bezier(0.32, 0.72, 0, 1) forwards;
}

.detail-shell {
  width: 100%;
  max-width: 960px;
  max-height: calc(100dvh - 64px);
  animation: scaleIn 500ms cubic-bezier(0.32, 0.72, 0, 1) forwards;
}

.detail-core {
  background: #fff;
  border-radius: calc(2rem - 8px);
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.9),
    0 4px 20px rgba(15, 23, 42, 0.04);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
}

.detail-title {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  flex: 1;
}

.detail-filename {
  font-size: 15px;
  font-weight: 600;
  color: #334155;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.detail-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

/* Comparison Slider */
.comparison-shell {
  padding: 24px;
  background: #f8fafc;
}

.comparison-slider {
  position: relative;
  width: 100%;
  height: clamp(420px, 62vh, 680px);
  border-radius: 20px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 4px 24px rgba(15, 23, 42, 0.05);
  cursor: ew-resize;
}

.comparison-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.checkerboard-bg {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(45deg, #e2e8f0 25%, transparent 25%),
    linear-gradient(-45deg, #e2e8f0 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #e2e8f0 75%),
    linear-gradient(-45deg, transparent 75%, #e2e8f0 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  opacity: 0.4;
}

.original-image,
.result-image {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.original-image {
  z-index: 2;
}

.result-image {
  z-index: 1;
}

.original-image img,
.result-image img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  user-select: none;
  pointer-events: none;
}

.comparison-container::before,
.comparison-container::after {
  content: "原图";
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: #fff;
  padding: 6px 14px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  z-index: 10;
  pointer-events: none;
}

.comparison-container::after {
  content: "处理后";
  left: 20px;
  right: auto;
}

.middle-layer {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, transparent 0%, #0f172a 50%, transparent 100%);
  z-index: 3;
  transform: translateX(-50%);
  opacity: 0.35;
}

.slider-handle {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 56px;
  transform: translateX(-50%);
  z-index: 4;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.slider-line {
  width: 2px;
  flex: 1;
  background: linear-gradient(180deg, transparent 0%, #0f172a 50%, transparent 100%);
  opacity: 0.35;
}

.slider-button {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #0f172a;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.25), 0 0 0 4px rgba(255, 255, 255, 0.9);
  transition: transform 400ms cubic-bezier(0.32, 0.72, 0, 1);
}

.slider-button:hover {
  transform: scale(1.08);
}

.copy-toast {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: #0f172a;
  color: #fff;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.2);
  pointer-events: none;
  z-index: 20;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 400ms cubic-bezier(0.32, 0.72, 0, 1);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(12px);
}

/* Icons */
.icon {
  width: 18px;
  height: 18px;
}

.icon-xl {
  width: 32px;
  height: 32px;
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
  .history-page {
    padding-bottom: 32px;
  }

  h1 {
    font-size: 32px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .history-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .history-body {
    flex-direction: column;
    align-items: flex-start;
    padding: 14px;
  }

  .history-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .detail-overlay {
    padding: 16px;
  }

  .detail-shell {
    max-height: calc(100dvh - 32px);
  }

  .detail-header {
    padding: 16px;
  }

  .comparison-shell {
    padding: 16px;
  }

  .comparison-slider {
    height: clamp(320px, 52vh, 480px);
    border-radius: 16px;
  }

  .comparison-container::before,
  .comparison-container::after {
    top: 12px;
    right: 12px;
    padding: 5px 10px;
    font-size: 10px;
  }

  .comparison-container::after {
    left: 12px;
  }

  .empty-core {
    padding: 64px 24px;
  }

  .empty-core h2 {
    font-size: 22px;
  }
}
</style>
