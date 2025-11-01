import { defineConfig } from 'vite';

export default defineConfig({
  // Base path — use '/akums-website-v2/' for GitHub Pages or './' for local hosting
  base: '/akums-website-v2/',

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
