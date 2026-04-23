import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Use relative asset URLs so the app works both locally and on static hosts
  // (GitHub Pages, subfolders, file preview) without a hard-coded repo path.
  base: './',
  plugins: [react()],
})
