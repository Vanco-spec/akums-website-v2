import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
  base: './', // ✅ ensures correct relative paths
  server: {
    port: 5173,
  },
});
