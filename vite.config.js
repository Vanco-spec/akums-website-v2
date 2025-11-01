import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: './', 
  base: './', // ✅ Works perfectly for Vercel, GitHub Pages, or any static hosting

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        // ✅ All HTML entry points for multipage setup
        main: resolve(__dirname, 'index.html'),
        events: resolve(__dirname, 'events.html'),
        resources: resolve(__dirname, 'resources.html'),
        alumni: resolve(__dirname, 'alumni.html'),
        about_us: resolve(__dirname, 'about_us.html'),
        constitution: resolve(__dirname, 'constitution.html'),
        contact: resolve(__dirname, 'contact.html'),
        leaders: resolve(__dirname, 'leaders.html'),
        login: resolve(__dirname, 'login.html'),
        signup: resolve(__dirname, 'signup.html'),
        scorp: resolve(__dirname, 'scorp.html'),
        'student-dashboard': resolve(__dirname, 'student-dashboard.html'),
        'sponsor-dashboard': resolve(__dirname, 'sponsor-dashboard.html'),
        'visitor-dashboard': resolve(__dirname, 'visitor-dashboard.html'),
        'admin-dashboard': resolve(__dirname, 'admin-dashboard.html'),
        '404': resolve(__dirname, '404.html'),
      },
    },
    emptyOutDir: true,
  },

  server: {
    host: true, // allows access from LAN
    port: 8080,
    strictPort: true,
  },

  preview: {
    port: 5000,
  },
});

