import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// 生成时间戳版本号插件
function timestampVersionPlugin() {
  return {
    name: 'timestamp-version',
    configResolved(config) {
      const now = new Date()
      const timestamp = now.toISOString().replace(/[-:T]/g, '').slice(0, 14)
      const version = `v${timestamp}`

      // 将版本号注入到 HTML 的 meta 标签
      if (config.build) {
        config.build.rollupOptions = config.build.rollupOptions || {}
        config.build.rollupOptions.output = config.build.rollupOptions.output || {}

        // 在文件名中添加版本号
        config.build.rollupOptions.output.assetFileNames = `assets/[name]-${version}.[hash][extname]`
        config.build.rollupOptions.output.chunkFileNames = `assets/[name]-${version}.[hash].js`
        config.build.rollupOptions.output.entryFileNames = `assets/[name]-${version}.[hash].js`
      }

      console.log(`📦 Build version: ${version}`)
    }
  }
}

export default defineConfig({
  plugins: [vue(), timestampVersionPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    open: true,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
