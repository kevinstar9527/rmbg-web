<template>
  <div class="result-page">
    <!-- Floating Capsule Toolbar -->
    <nav class="result-toolbar">
      <button @click="goBack" class="toolbar-pill-btn">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>返回</span>
      </button>

      <div class="toolbar-center">
        <button
          v-if="processedImages.length > 1"
          class="icon-action nav-arrow"
          :disabled="currentIndex === 0"
          @click="prevImage"
          title="上一张"
        >
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <div class="count-group">
          <span class="eyebrow">已处理</span>
          <span class="toolbar-count">{{ processedImages.length > 0 ? currentIndex + 1 : 0 }} / {{ processedImages.length }}</span>
        </div>

        <button
          v-if="processedImages.length > 1"
          class="icon-action nav-arrow"
          :disabled="currentIndex === processedImages.length - 1"
          @click="nextImage"
          title="下一张"
        >
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <button v-if="processedImages.length > 0" @click="downloadAll" class="toolbar-pill-btn primary">
        <span>下载全部</span>
        <div class="btn-icon-island">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </button>
    </nav>

    <main class="result-stage">
      <!-- Empty State -->
      <div v-if="processedImages.length === 0" class="stage-center reveal">
        <div class="empty-shell">
          <div class="empty-core">
            <div class="empty-icon-ring">
              <svg class="icon-xl" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="M21 15l-5-5L5 21"/>
              </svg>
            </div>
            <h2>暂无处理结果</h2>
            <p>请先上传图片，让 AI 为你去除背景</p>
            <button @click="goBack" class="cta-pill">
              <span>返回上传</span>
              <div class="btn-icon-island">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Single Result Viewer -->
      <div v-else class="result-shell reveal">
        <div class="result-core">
          <!-- Card Header -->
          <header class="result-header">
            <div class="file-badge">
              <span class="file-index">{{ currentIndex + 1 }}</span>
              <span class="file-name">{{ currentItem.fileName }}</span>
            </div>
            <div class="header-actions">
              <button @click="downloadImage(currentIndex)" class="icon-action" title="下载此图片">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <button @click="copyToClipboard(currentIndex)" class="icon-action" title="复制到剪贴板">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
              </button>
            </div>
          </header>

          <!-- Comparison Preview -->
          <div class="comparison-shell">
            <div class="comparison-slider">
              <div class="comparison-container">
                <div class="checkerboard-bg"></div>
                <div class="original-image" :style="{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }">
                  <img :src="currentItem.original" alt="原图">
                </div>
                <div class="result-image">
                  <img :src="currentItem.image" alt="结果图">
                </div>
                <div class="middle-layer" :style="{ left: sliderPosition + '%' }"></div>
              </div>
              <div class="slider-handle"
                   :style="{ left: sliderPosition + '%' }"
                   @mousedown="startDrag($event)"
                   @touchstart="startDrag($event)">
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

          <!-- Thumbnail Strip -->
          <div v-if="processedImages.length > 1" class="thumbnail-strip">
            <button
              v-for="(item, index) in processedImages"
              :key="index"
              class="thumb-item"
              :class="{ active: index === currentIndex }"
              :title="item.fileName"
              @click="switchImage(index)"
            >
              <img :src="item.image" :alt="item.fileName">
            </button>
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
    </main>
  </div>
</template>

<script>
import { addHistory, getProcessedResults } from '../utils/history-db'

export default {
  name: 'Result',
  data() {
    return {
      processedImages: [],
      currentIndex: 0,
      sliderPosition: 50,
      copyStatus: false
    }
  },
  computed: {
    currentItem() {
      return this.processedImages[this.currentIndex] || null
    }
  },
  async created() {
    await this.loadResults()
    await this.$nextTick()
    this.saveToHistory()
    window.addEventListener('keydown', this.handleKeydown)
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeydown)
  },
  methods: {
    async loadResults() {
      sessionStorage.removeItem('processedResults')

      const resultId = sessionStorage.getItem('processedResultsId')
      if (!resultId) return

      try {
        const results = await getProcessedResults(resultId)
        if (!results) return

        this.processedImages = results.filter(r => r.success)
        this.currentIndex = 0
        this.sliderPosition = 50
      } catch (error) {
        console.error('加载结果失败:', error)
      }
    },
    handleKeydown(event) {
      if (this.processedImages.length <= 1) return
      if (event.key === 'ArrowLeft') this.prevImage()
      if (event.key === 'ArrowRight') this.nextImage()
    },
    switchImage(index) {
      this.currentIndex = index
      this.sliderPosition = 50
    },
    nextImage() {
      if (this.currentIndex < this.processedImages.length - 1) {
        this.currentIndex++
        this.sliderPosition = 50
      }
    },
    prevImage() {
      if (this.currentIndex > 0) {
        this.currentIndex--
        this.sliderPosition = 50
      }
    },
    goBack() {
      this.$router.push('/')
    },
    async downloadImage(index) {
      const item = this.processedImages[index]
      if (!item) return

      const downloadName = item.fileName.replace(/\.[^/.]+$/, '_no_bg.png')

      try {
        const response = await fetch(item.image)
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
    async downloadAll() {
      for (let i = 0; i < this.processedImages.length; i++) {
        await this.downloadImage(i)
        await new Promise(resolve => setTimeout(resolve, 300))
      }
    },
    async copyToClipboard(index) {
      const item = this.processedImages[index]
      if (!item) return

      try {
        const response = await fetch(item.image)
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
    async saveToHistory() {
      for (const item of this.processedImages) {
        try {
          const [originalThumb, processedThumb] = await Promise.all([
            this.createThumbnail(item.original, 200),
            this.createThumbnail(item.image, 200)
          ])

          await addHistory({
            fileName: item.fileName,
            original: item.original,
            originalThumb: originalThumb,
            processedThumb: processedThumb,
            processed: item.image,
            timestamp: new Date().toISOString()
          })
        } catch (error) {
          console.error('保存历史记录失败:', error)
        }
      }
    },
    createThumbnail(dataUrl, maxSize) {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height

          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width
              width = maxSize
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height
              height = maxSize
            }
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)
          resolve(canvas.toDataURL('image/jpeg', 0.7))
        }
        img.onerror = reject
        img.src = dataUrl
      })
    },
    startDrag(event) {
      event.preventDefault()

      const slider = event.target.closest('.comparison-slider')
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
.result-page {
  flex: 1;
  min-height: 0;
  width: 100%;
  position: relative;
  background: #f8fafc;
  font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #0f172a;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Floating capsule toolbar */
.result-toolbar {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 30;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 9999px;
  box-shadow:
    0 0 0 1px rgba(15, 23, 42, 0.06),
    0 12px 40px rgba(15, 23, 42, 0.08),
    0 1px 2px rgba(255, 255, 255, 0.8) inset;
  animation: toolbarDescend 800ms cubic-bezier(0.32, 0.72, 0, 1) forwards;
}

@keyframes toolbarDescend {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.toolbar-pill-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 9999px;
  border: none;
  background: rgba(15, 23, 42, 0.04);
  color: #334155;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 500ms cubic-bezier(0.32, 0.72, 0, 1);
}

.toolbar-pill-btn:hover {
  background: rgba(15, 23, 42, 0.08);
  transform: translateY(-1px);
}

.toolbar-pill-btn:active {
  transform: scale(0.97);
}

.toolbar-pill-btn.primary {
  background: #0f172a;
  color: #fff;
}

.toolbar-pill-btn.primary:hover {
  background: #1e293b;
}

.btn-icon-island {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 500ms cubic-bezier(0.32, 0.72, 0, 1);
}

.toolbar-pill-btn.primary .btn-icon-island {
  background: rgba(255, 255, 255, 0.18);
}

.toolbar-pill-btn:hover .btn-icon-island {
  transform: translate(1px, -1px) scale(1.05);
}

.toolbar-center {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 0 8px;
}

.count-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.eyebrow {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-weight: 700;
  color: #94a3b8;
}

.toolbar-count {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
}

.nav-arrow {
  width: 34px;
  height: 34px;
}

.nav-arrow:disabled {
  opacity: 0.35;
  cursor: not-allowed;
  transform: none;
}

.nav-arrow:disabled:hover {
  background: #f1f5f9;
  color: #64748b;
}

/* Main stage */
.result-stage {
  flex: 1;
  min-height: 0;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 104px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.stage-center {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Double-Bezel card */
.result-shell,
.empty-shell {
  flex: 1;
  min-height: 0;
  width: 100%;
  padding: 8px;
  background: rgba(255, 255, 255, 0.45);
  border-radius: 2rem;
  box-shadow:
    0 24px 64px rgba(15, 23, 42, 0.06),
    0 0 0 1px rgba(15, 23, 42, 0.05);
}

.empty-shell {
  flex: 0 0 auto;
  max-width: 480px;
}

.result-core,
.empty-core {
  position: relative;
  width: 100%;
  flex: 1;
  min-height: 0;
  background: #fff;
  border-radius: calc(2rem - 8px);
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.9),
    0 4px 20px rgba(15, 23, 42, 0.04);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.empty-core {
  height: auto;
  padding: 80px 32px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.reveal {
  opacity: 0;
  transform: translateY(40px);
  animation: revealUp 900ms cubic-bezier(0.32, 0.72, 0, 1) forwards;
}

@keyframes revealUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.empty-icon-ring {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 28px;
  color: #94a3b8;
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
  margin-bottom: 32px;
  max-width: 320px;
}

.cta-pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 24px;
  border-radius: 9999px;
  border: none;
  background: #0f172a;
  color: #fff;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 500ms cubic-bezier(0.32, 0.72, 0, 1);
}

.cta-pill:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.2);
}

.cta-pill:active {
  transform: scale(0.97);
}

.cta-pill .btn-icon-island {
  background: rgba(255, 255, 255, 0.15);
}

/* Result header */
.result-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 28px;
  border-bottom: 1px solid rgba(15, 23, 42, 0.05);
}

.file-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.file-index {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: #0f172a;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}

.file-name {
  font-size: 14px;
  font-weight: 500;
  color: #334155;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.icon-action {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 400ms cubic-bezier(0.32, 0.72, 0, 1);
}

.icon-action:hover {
  background: #f1f5f9;
  color: #0f172a;
  transform: translateY(-1px);
}

.icon-action:active {
  transform: scale(0.94);
}

/* Comparison slider */
.comparison-shell {
  flex: 1;
  min-height: 450px;
  padding: 24px;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
}

.comparison-slider {
  position: relative;
  width: 100%;
  flex: 1;
  min-height: 240px;
  border-radius: 20px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 4px 24px rgba(15, 23, 42, 0.05);
  cursor: ew-resize;
}

.comparison-container {
  position: absolute;
  inset: 0;
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
  content: "处理后";
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
  content: "原图";
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

/* Thumbnail strip */
.thumbnail-strip {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 24px;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  border-top: 1px solid rgba(15, 23, 42, 0.05);
}

.thumbnail-strip::-webkit-scrollbar {
  display: none;
}

.thumb-item {
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  border-radius: 12px;
  border: 2px solid transparent;
  background: #f1f5f9;
  overflow: hidden;
  cursor: pointer;
  padding: 0;
  transition: all 300ms cubic-bezier(0.32, 0.72, 0, 1);
}

.thumb-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb-item:hover {
  transform: translateY(-2px);
  border-color: rgba(15, 23, 42, 0.15);
}

.thumb-item.active {
  border-color: #0f172a;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.12);
}

/* Copy toast */
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

/* Responsive */
@media (max-width: 768px) {
  .result-toolbar {
    top: 16px;
    gap: 8px;
    padding: 8px 10px;
    width: calc(100% - 32px);
    justify-content: space-between;
  }

  .toolbar-pill-btn span {
    display: none;
  }

  .toolbar-pill-btn {
    padding: 10px;
  }

  .toolbar-pill-btn.primary {
    padding: 10px 14px;
  }

  .toolbar-pill-btn.primary span {
    display: inline;
  }

  .toolbar-center {
    gap: 10px;
    padding: 0;
  }

  .eyebrow {
    font-size: 9px;
  }

  .toolbar-count {
    font-size: 16px;
  }

  .nav-arrow {
    width: 30px;
    height: 30px;
  }

  .result-stage {
    padding: 88px 16px 16px;
    gap: 16px;
  }

  .result-shell,
  .empty-shell {
    border-radius: 1.5rem;
    padding: 6px;
  }

  .result-core,
  .empty-core {
    border-radius: calc(1.5rem - 6px);
  }

  .empty-core {
    padding: 56px 24px;
  }

  .empty-core h2 {
    font-size: 22px;
  }

  .result-header {
    padding: 14px 18px;
  }

  .file-name {
    max-width: 140px;
  }

  .comparison-shell {
    padding: 16px;
  }

  .comparison-slider {
    min-height: 200px;
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

  .slider-button {
    width: 44px;
    height: 44px;
  }

  .thumbnail-strip {
    padding: 10px 16px;
    gap: 8px;
  }

  .thumb-item {
    width: 48px;
    height: 48px;
    border-radius: 10px;
  }

  .copy-toast {
    bottom: 24px;
  }
}
</style>
