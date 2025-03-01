import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Proxy API-Anfragen zum Backend
      '/api': {
        target: 'https://localhost:8001',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})