import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    cssCodeSplit: false,
    minify: true,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})
