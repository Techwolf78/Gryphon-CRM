import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// No need for tailwindcss() here, it's handled via PostCSS/Tailwind config

export default defineConfig({
  plugins: [react()],
  base: './', // 👈 This is the important line
})
