import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      "lc-pencil-existence-norfolk.trycloudflare.com", // add your tunnel/host here
    ],
  }, // ✅ comma added here
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});

