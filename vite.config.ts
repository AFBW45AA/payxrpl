import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  // ← Das ist die entscheidende Zeile!
  optimizeDeps: {
    exclude: ['xumm']
  }
})