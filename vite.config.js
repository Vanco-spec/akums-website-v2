import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: './',               // project root
  base: './',               // use './' for Vercel or root-based hosting

  build: {
    outDir: 'dist',         // production build output
    assetsDir: 'assets',    // static assets folder
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        events: path.resolve(__dirname, 'events.html'),
        resources: path.resolve(__dirname, 'resources.html'),
        alumni: path.resolve(__dirname, 'alumni.html'),
        about_us: path.resolve(__dirname, 'about_us.html'),
        '404': path.resolve(__dirname, '404.html'),
        'admin-dashboard': path.resolve(__dirname, 'admin-dashboard.html'),
        constitution: path.resolve(__dirname, 'constitution.html'),
        contact: path.resolve(__dirname, 'contact.html'),
        leaders: path.resolve(__dirname, 'leaders.html'),
        login: path.resolve(__dirname, 'login.html'),
        scorp: path.resolve(__dirname, 'scorp.html'),
        signup: path.resolve(__dirname, 'signup.html'),
        'sponsor-dashboard': path.resolve(__dirname, 'sponsor-dashboard.html'),
        'student-dashboard': path.resolve(__dirname, 'student-dashboard.html'),
        'visitor-dashboard': path.resolve(__dirname, 'visitor-dashboard.html'),
      },
    },
    emptyOutDir: true,      // clear dist folder before build
  },

  server: {
    host: true,             // allow access from other devices in network
    port: 8080,             // dev server port
    strictPort: true,       // fail if port is taken
  },

  preview: {
    port: 5000,             // preview production build locally
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // allows import like "@/auth/firebase.js"
    },
  },
});
