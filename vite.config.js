import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // bind to all addresses so Render (or other hosts) can reach the dev server
    host: true,
    // allow Render to override the port via the PORT env var
    port: Number(process.env.PORT) || 5173,
  },
})



/*
Public IP: 206.41.88.149
*/
