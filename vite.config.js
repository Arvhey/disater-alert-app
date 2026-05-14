import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// Force Microsoft Edge on Windows
if (process.platform === 'win32') {
  process.env.BROWSER = 'msedge';
}

export default defineConfig({
  plugins: [react()],
  server: {
    open: true
  }
})
