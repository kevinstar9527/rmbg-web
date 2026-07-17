<template>
  <div class="about-page">
    <!-- Header -->
    <header class="page-header reveal">
      <div class="header-text">
        <h1>关于我</h1>
        <p>开发者信息与联系方式</p>
      </div>
    </header>

    <!-- Bento Grid -->
    <div class="about-bento">
      <!-- Author Card -->
      <section class="bento-card wide reveal">
        <div class="card-shell">
          <div class="card-core">
            <div class="author-avatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="12" cy="7" r="4" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="author-info">
              <h2>kevinstar9527</h2>
              <p>独立开发者 / 全栈工程师</p>
            </div>
          </div>
        </div>
      </section>

      <!-- GitHub + WeChat Card -->
      <section class="bento-card wide reveal" :style="{ animationDelay: '80ms' }">
        <div class="card-shell">
          <div class="card-core dual-links">
            <a href="https://github.com/kevinstar9527" target="_blank" rel="noopener" class="link-item">
              <div class="card-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </div>
              <div class="card-text">
                <h3>GitHub</h3>
                <p>kevinstar9527</p>
              </div>
            </a>
            <div class="dual-divider"></div>
            <div class="link-item wechat-item">
              <div class="card-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm3.347 4.284c-1.753-.086-3.636.434-5.107 1.653-1.616 1.341-2.488 3.517-1.678 5.803.825 2.325 3.239 3.87 5.984 3.87.73 0 1.44-.11 2.11-.316a.72.72 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.492.492 0 0 1 .177-.554C20.339 19.01 21.33 17.345 21.33 15.54c0-3.06-2.986-5.18-6.385-5.265zm-2.18 3.01c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982z"/>
                </svg>
              </div>
              <div class="card-text">
                <h3>微信公众号</h3>
                <p>扫码关注</p>
              </div>
              <div class="qr-wrapper">
                <img src="/qrcode.jpg" alt="微信公众号二维码">
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Blog Card -->
      <section class="bento-card wide reveal" :style="{ animationDelay: '160ms' }">
        <div class="card-shell">
          <a href="https://code-coffee.com" target="_blank" rel="noopener" class="card-core link-card">
            <div class="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="card-text">
              <h3>编程咖啡吧</h3>
              <p>code-coffee.com</p>
            </div>
          </a>
        </div>
      </section>

      <!-- Friend Link Card -->
      <section class="bento-card wide reveal" :style="{ animationDelay: '320ms' }">
        <div class="card-shell">
          <div class="card-core">
            <div class="setting-header">
              <div class="setting-title-group">
                <div class="setting-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M13.828 10.172a4 4 0 0 0-5.656 0l-4 4a4 4 0 1 0 5.656 5.656l1.102-1.101m-.758-4.899a4 4 0 0 0 5.656 0l4-4a4 4 0 0 0-5.656-5.656l-1.1 1.1" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h2>友情链接</h2>
                  <p>相关工具与资源</p>
                </div>
              </div>
            </div>
            <div class="friend-links">
              <a href="https://inpaint.code-coffee.com" target="_blank" rel="noopener" class="friend-link">
                <div class="friend-link-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M4 16l4.586-4.586a2 2 0 0 1 2.828 0L16 16m-2-2l1.586-1.586a2 2 0 0 1 2.828 0L20 14m-6-6h.01M6 20h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="friend-link-text">
                  <span class="friend-link-name">AI 图像修复</span>
                  <span class="friend-link-url">inpaint.code-coffee.com</span>
                </div>
                <svg class="friend-link-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M7 17L17 7M17 7H7M17 7v10" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About'
}
</script>

<style scoped>
.about-page {
  flex: 1;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Header */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.header-text h1 {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: #0f172a;
  line-height: 1.1;
}

.header-text p {
  font-size: 14px;
  color: #64748b;
}

/* Bento Grid */
.about-bento {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.bento-card.wide {
  grid-column: 1 / -1;
}

/* Card Shell */
.card-shell {
  padding: 6px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 1.25rem;
  box-shadow:
    0 24px 64px rgba(15, 23, 42, 0.06),
    0 0 0 1px rgba(15, 23, 42, 0.05);
  height: 100%;
  transition: all 500ms cubic-bezier(0.32, 0.72, 0, 1);
}

.bento-card:hover .card-shell {
  transform: translateY(-3px);
  box-shadow:
    0 32px 72px rgba(15, 23, 42, 0.1),
    0 0 0 1px rgba(15, 23, 42, 0.06);
}

.card-core {
  height: 100%;
  background: #fff;
  border-radius: calc(1.25rem - 6px);
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.9),
    0 4px 20px rgba(15, 23, 42, 0.04);
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}

/* Author Card */
.author-avatar {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: #f1f5f9;
  color: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.author-avatar svg {
  width: 28px;
  height: 28px;
}

.author-info h2 {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
}

.author-info p {
  font-size: 13px;
  color: #64748b;
}

/* Link Card */
a.link-card {
  text-decoration: none;
  color: inherit;
  transition: all 400ms cubic-bezier(0.32, 0.72, 0, 1);
}

a.link-card:hover {
  background: #f8fafc;
}

/* Dual Links (GitHub + Blog) */
.dual-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
}

.dual-links .link-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 32px;
  text-decoration: none;
  color: inherit;
  flex: 1;
  transition: all 400ms cubic-bezier(0.32, 0.72, 0, 1);
  border-radius: calc(1.25rem - 6px);
}

.dual-links .link-item:hover {
  background: #f8fafc;
}

.dual-links .author-item,
.dual-links .wechat-item {
  cursor: default;
}

.dual-links .author-item:hover,
.dual-links .wechat-item:hover {
  background: transparent;
}

.dual-links .wechat-item {
  gap: 12px;
}

.dual-divider {
  width: 1px;
  height: 40px;
  background: #e2e8f0;
  flex-shrink: 0;
}

/* Card Icon */
.card-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #f1f5f9;
  color: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-icon svg {
  width: 22px;
  height: 22px;
}

.card-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.card-text h3 {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
}

.card-text p {
  font-size: 13px;
  color: #64748b;
}

/* QR Code */
.qr-wrapper {
  margin-left: auto;
  width: 100px;
  height: 100px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
  background: #f8fafc;
}

.qr-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Setting Header (for friend links section) */
.setting-header {
  width: 100%;
}

.setting-title-group {
  display: flex;
  align-items: center;
  gap: 14px;
}

.setting-icon {
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

.setting-icon svg {
  width: 20px;
  height: 20px;
}

.setting-title-group h2 {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}

.setting-title-group p {
  font-size: 13px;
  color: #64748b;
}

/* Friend Links */
.friend-links {
  width: 100%;
  margin-top: 16px;
}

.friend-link {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 14px;
  background: #f8fafc;
  text-decoration: none;
  color: inherit;
  transition: all 400ms cubic-bezier(0.32, 0.72, 0, 1);
}

.friend-link:hover {
  background: #f1f5f9;
  transform: translateX(4px);
}

.friend-link-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #e2e8f0;
  color: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.friend-link-icon svg {
  width: 18px;
  height: 18px;
}

.friend-link-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.friend-link-name {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
}

.friend-link-url {
  font-size: 12px;
  color: #94a3b8;
}

.friend-link-arrow {
  width: 18px;
  height: 18px;
  color: #94a3b8;
  flex-shrink: 0;
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
  .about-bento {
    grid-template-columns: 1fr;
  }

  .card-core {
    padding: 16px;
  }

  .header-text h1 {
    font-size: 24px;
  }

  .qr-wrapper {
    width: 80px;
    height: 80px;
  }

  .dual-links {
    flex-direction: column;
    gap: 8px;
  }

  .dual-divider {
    width: 40px;
    height: 1px;
  }

  .dual-links .link-item {
    padding: 12px 16px;
  }

  .dual-links .author-item {
    justify-content: center;
  }
}
</style>
