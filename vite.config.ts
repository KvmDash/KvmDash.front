import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { API_BASE_URL } from './src/config';


// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@components': path.resolve(__dirname, './src/components'),
            '@assets': path.resolve(__dirname, './src/assets'),
            '@interfaces': path.resolve(__dirname, './src/types'),  // Geändert von @types zu @interfaces
            '@theme': path.resolve(__dirname, './src/theme'),
            '@services': path.resolve(__dirname, './src/services')
        },
    },
    server: {
        port: 5173,
        proxy: {
            // Proxy API-Anfragen zum Backend
            '/api': {
                target: API_BASE_URL,
                changeOrigin: true,
                secure: false,
            }
        }
    }
})