<template>
  <div class="feedback-page">
    <!-- Header -->
    <header class="page-header reveal">
      <div class="header-text">
        <h1>问题反馈</h1>
        <p>帮助我们改进产品</p>
      </div>
    </header>

    <!-- Feedback Cards -->
    <div class="feedback-bento">
      <!-- Discussions Card -->
      <section class="bento-card wide reveal" :style="{ animationDelay: '80ms' }">
        <div class="card-shell">
          <a href="https://github.com/kevinstar9527/rmbg-web/discussions" target="_blank" rel="noopener" class="card-core link-card">
            <div class="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3l-4 4z" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="card-text">
              <h3>讨论区</h3>
              <p>提问、分享想法、参与讨论</p>
            </div>
            <svg class="card-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M7 17L17 7M17 7H7M17 7v10" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
        </div>
      </section>

      <!-- Issues Card -->
      <section class="bento-card wide reveal" :style="{ animationDelay: '160ms' }">
        <div class="card-shell">
          <a href="https://github.com/kevinstar9527/rmbg-web/issues" target="_blank" rel="noopener" class="card-core link-card">
            <div class="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 9v2m0 4h.01M5.07 19H19a2 2 0 0 0 1.75-2.95L13.75 4a2 2 0 0 0-3.5 0L3.32 16.05A2 2 0 0 0 5.07 19z" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="card-text">
              <h3>报告问题</h3>
              <p>提交 Bug 报告或功能建议</p>
            </div>
            <svg class="card-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M7 17L17 7M17 7H7M17 7v10" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Feedback'
}
</script>

<style scoped>
.feedback-page {
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
.feedback-bento {
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

/* Link Card */
a.link-card {
  text-decoration: none;
  color: inherit;
  transition: all 400ms cubic-bezier(0.32, 0.72, 0, 1);
}

a.link-card:hover {
  background: #f8fafc;
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
  flex: 1;
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

.card-arrow {
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
  .feedback-bento {
    grid-template-columns: 1fr;
  }

  .card-core {
    padding: 16px;
  }

  .header-text h1 {
    font-size: 24px;
  }
}
</style>
