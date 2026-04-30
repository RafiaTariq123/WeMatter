import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      buffer: 'buffer',
      stream: 'stream-browserify',
      crypto: 'crypto-browserify',
      util: 'util',
      events: 'events',
    },
  },
  optimizeDeps: {
    include: ['buffer', 'stream-browserify', 'crypto-browserify', 'util', 'events'],
    force: true,
  },
  build: {
    rollupOptions: {
      external: [],
    },
  },
})
