import { defineConfig } from "vite";
import compress from "vite-plugin-compression";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    compress({
      algorithm: "brotliCompress", // or 'gzip'
      ext: ".br", // output file extension
    }),
  ],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
});
