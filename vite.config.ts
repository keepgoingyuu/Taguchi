import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    server: {
      port: parseInt(env.VITE_PORT),
      host: '0.0.0.0',
      allowedHosts: ['taguchi.yuudemo.com'],
      hmr: false, // 禁用自動重新載入
    },
    preview: {
      port: parseInt(env.VITE_PORT),
      host: '0.0.0.0',
      allowedHosts: ['taguchi.yuudemo.com'],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // 將 plotly.js 分割成獨立檔案
            'plotly': ['plotly.js', 'react-plotly.js'],
            // 將 React 相關分割
            'react-vendor': ['react', 'react-dom'],
            // 將 UI 圖示庫分割
            'lucide': ['lucide-react'],
          },
        },
      },
      chunkSizeWarningLimit: 1000, // 提高警告閾值到 1MB
    },
  }
})
