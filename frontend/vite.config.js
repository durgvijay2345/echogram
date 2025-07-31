import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    historyApiFallback: true  // ✅ This line handles refresh on dynamic routes
  },
  build: {
    rollupOptions: {
      input: '/index.html'  // Ensure fallback during build
    }
  }
})
