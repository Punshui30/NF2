import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 5173, // Frontend port
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // Backend server
        changeOrigin: true,
        secure: false
      }
    }
  }
});
