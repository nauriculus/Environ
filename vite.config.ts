import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import 'process/browser';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': {}
  },
  server: {
    host: true,
  },
  plugins: [react()],
})
