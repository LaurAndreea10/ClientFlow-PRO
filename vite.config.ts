import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Folosim base dinamic: în dev rulează pe '/', în build pentru GitHub Pages pe '/ClientFlow-PRO/'
// Astfel `npm run dev` funcționează normal local, iar `npm run build` produce output corect pentru Pages.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/ClientFlow-PRO/' : '/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
  },
}))
