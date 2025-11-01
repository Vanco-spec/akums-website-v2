import { defineConfig } from 'vite';

export default defineConfig({
  root: './', 
  base: './',  // ✅ Correct for Vercel or any root-based hosting

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
    emptyOutDir: true,
  },

  server: {
    host: true,
    port: 8080,
    strictPort: true,
  },

  preview: {
    port: 5000,
  },
});
