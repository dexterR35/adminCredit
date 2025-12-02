import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // Always use /admin/ base path since obtinecredit.ro is the main website and /admin is the dashboard
  base: '/admin/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Copy .htaccess to dist folder
    copyPublicDir: true,
  },
  publicDir: 'public',
})
