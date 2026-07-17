<template>
  <div class="app-frame" :class="{ 'result-mode': isResultRoute, 'mobile': isMobile }">
    <!-- Desktop Floating Nav Island -->
    <nav v-if="!isResultRoute && !isMobile" class="nav-island" aria-label="主导航">
      <div class="nav-island-shell">
        <div class="nav-island-core">
          <div class="brand">
            <div class="brand-mark">
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="12" fill="#0f172a"/>
                <path d="M12 28c0-6 4-10 8-14 4 4 8 8 8 14H12z" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="20" cy="16" r="3" stroke="#fff" stroke-width="2"/>
              </svg>
            </div>
            <span class="brand-text">RMBG</span>
          </div>

          <div class="nav-links">
            <router-link to="/" class="nav-pill" :class="{ active: $route.path === '/' }">
              <span class="nav-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M4 16l4.586-4.586a2 2 0 0 1 2.828 0L16 16m-2-2l1.586-1.586a2 2 0 0 1 2.828 0L20 14m-6-6h.01M6 20h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
              <span class="nav-label">AI抠图</span>
            </router-link>

            <router-link to="/history" class="nav-pill" :class="{ active: $route.path === '/history' }">
              <span class="nav-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
              <span class="nav-label">历史</span>
            </router-link>

            <router-link to="/settings" class="nav-pill" :class="{ active: $route.path === '/settings' }">
              <span class="nav-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
              <span class="nav-label">设置</span>
            </router-link>

            <router-link to="/about" class="nav-pill" :class="{ active: $route.path === '/about' }">
              <span class="nav-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="12" cy="7" r="4" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
              <span class="nav-label">关于我</span>
            </router-link>

            <router-link to="/feedback" class="nav-pill" :class="{ active: $route.path === '/feedback' }">
              <span class="nav-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3l-4 4z" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
              <span class="nav-label">问题反馈</span>
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Mobile Bottom Tab Bar -->
    <nav v-if="!isResultRoute && isMobile" class="mobile-tabbar" aria-label="底部导航">
      <div class="mobile-tabbar-shell">
        <div class="mobile-tabbar-core">
          <router-link to="/" class="tab-item" :class="{ active: $route.path === '/' }">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M4 16l4.586-4.586a2 2 0 0 1 2.828 0L16 16m-2-2l1.586-1.586a2 2 0 0 1 2.828 0L20 14m-6-6h.01M6 20h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>AI抠图</span>
          </router-link>
          <router-link to="/history" class="tab-item" :class="{ active: $route.path === '/history' }">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>历史</span>
          </router-link>
          <router-link to="/settings" class="tab-item" :class="{ active: $route.path === '/settings' }">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>设置</span>
          </router-link>
          <router-link to="/about" class="tab-item" :class="{ active: $route.path === '/about' }">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="12" cy="7" r="4" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>关于我</span>
          </router-link>
          <router-link to="/feedback" class="tab-item" :class="{ active: $route.path === '/feedback' }">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3l-4 4z" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>反馈</span>
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Main Stage -->
    <main class="page-stage" :class="{ 'with-nav': !isResultRoute, 'mobile': isMobile }">
      <router-view></router-view>
    </main>

    <!-- Footer -->
    <footer v-if="!isResultRoute" class="app-footer">
      <div class="footer-inner">
        <a href="https://code-coffee.com" target="_blank" rel="noopener" class="footer-brand">code-coffee.com</a>
        <span class="footer-divider">|</span>
        <a href="https://inpaint.code-coffee.com" target="_blank" rel="noopener" class="footer-link">AI 图像修复</a>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isMobile: false,
      mobileBreakpoint: 768
    }
  },
  computed: {
    isResultRoute() {
      return this.$route.path === '/result'
    }
  },
  mounted() {
    this.checkViewport()
    window.addEventListener('resize', this.checkViewport)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkViewport)
  },
  methods: {
    checkViewport() {
      this.isMobile = window.innerWidth < this.mobileBreakpoint
    }
  }
}
</script>

<style scoped>
.app-frame {
  min-height: 100dvh;
  width: 100%;
  position: relative;
  background: #f8fafc;
}

/* Desktop Floating Nav Island */
.nav-island {
  position: fixed;
  top: 32px;
  left: 32px;
  bottom: 32px;
  z-index: 40;
  display: flex;
  flex-direction: column;
  width: 220px;
}

.nav-island-shell {
  padding: 8px;
  background: rgba(255, 255, 255, 0.55);
  border-radius: 2rem;
  box-shadow:
    0 24px 64px rgba(15, 23, 42, 0.06),
    0 0 0 1px rgba(15, 23, 42, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  animation: islandEnter 800ms cubic-bezier(0.32, 0.72, 0, 1) forwards;
}

@keyframes islandEnter {
  from {
    opacity: 0;
    transform: translateX(-24px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.nav-island-core {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  border-radius: calc(2rem - 8px);
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.9),
    0 4px 20px rgba(15, 23, 42, 0.04);
  padding: 28px 20px;
  gap: 40px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-mark {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
}

.brand-mark svg {
  width: 100%;
  height: 100%;
}

.brand-text {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #0f172a;
}

.nav-links {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.nav-pill {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 16px;
  color: #64748b;
  font-size: 15px;
  font-weight: 600;
  transition: all 500ms cubic-bezier(0.32, 0.72, 0, 1);
  position: relative;
}

.nav-pill:hover {
  background: rgba(15, 23, 42, 0.04);
  color: #334155;
}

.nav-pill.active {
  background: #0f172a;
  color: #fff;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.18);
}

.nav-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-icon svg {
  width: 100%;
  height: 100%;
}

.nav-label {
  line-height: 1;
}

/* Mobile Bottom Tab Bar */
.mobile-tabbar {
  position: fixed;
  left: 16px;
  right: 16px;
  bottom: 16px;
  z-index: 40;
}

.mobile-tabbar-shell {
  padding: 6px;
  background: rgba(255, 255, 255, 0.72);
  border-radius: 1.75rem;
  box-shadow:
    0 20px 48px rgba(15, 23, 42, 0.1),
    0 0 0 1px rgba(15, 23, 42, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  animation: tabbarEnter 700ms cubic-bezier(0.32, 0.72, 0, 1) forwards;
}

@keyframes tabbarEnter {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.mobile-tabbar-core {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: #fff;
  border-radius: calc(1.75rem - 6px);
  padding: 10px 8px;
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.9),
    0 4px 20px rgba(15, 23, 42, 0.04);
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  border-radius: 16px;
  color: #94a3b8;
  font-size: 11px;
  font-weight: 600;
  transition: all 400ms cubic-bezier(0.32, 0.72, 0, 1);
  flex: 1;
}

.tab-item svg {
  width: 22px;
  height: 22px;
}

.tab-item.active {
  color: #0f172a;
  background: rgba(15, 23, 42, 0.05);
}

/* Main Stage */
.page-stage {
  width: 100%;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  padding: 32px;
}

.page-stage.with-nav {
  padding-left: 284px;
}

.page-stage.mobile {
  padding: 24px 24px 120px;
}

.page-stage:not(.with-nav) {
  padding: 0;
}

@media (max-width: 768px) {
  .page-stage.with-nav {
    padding-left: 24px;
  }
}

/* Footer */
.app-footer {
  width: 100%;
  padding: 24px 32px 32px;
  padding-left: 284px;
  display: flex;
  justify-content: center;
}

.footer-inner {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: #94a3b8;
}

.footer-brand {
  font-weight: 600;
  color: #64748b;
  transition: color 300ms ease;
}

.footer-brand:hover {
  color: #0f172a;
}

.footer-divider {
  color: #cbd5e1;
}

.footer-link {
  color: #64748b;
  transition: color 300ms ease;
}

.footer-link:hover {
  color: #0f172a;
}

@media (max-width: 768px) {
  .app-footer {
    padding: 16px 24px 24px;
  }
}
</style>
