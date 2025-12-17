// src/main.js
// Import global CSS and Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import 'animate.css';

import AOS from 'aos';
import 'aos/dist/aos.css';

// Import shared components
import { initNavbar } from './components/navbar.js';
import { initFooter } from './components/footer.mjs';
import { initLoader } from './components/loader.js';

initLoader(); // ← injects loader into <body>
// ===== INITIAL LOADER (FIRST LOAD ONLY) =====
const loader = document.getElementById('loader');
loader?.classList.remove('hidden');

// Initialize AOS
AOS.init({
  duration: 1000,
  once: true,
});

// Initialize components after DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Initialize navbar and footer
    await initNavbar();
    await initFooter();

    // Detect current page and dynamically load page-specific JS
    const path = window.location.pathname;

    if (path.endsWith('/index.html') || path === '/') {
      const m = await import('./pages/home.mjs');
      m.init?.();
    } else if (path.endsWith('/events.html')) {
      const m = await import('./pages/events.mjs');
      m.init?.();
    } else if (path.endsWith('/about-magazine.html')) {
      const m = await import('./pages/about-magazine.mjs');
      m.init?.();
    } else if (path.endsWith('/submission-magazine.html')) {
      const m = await import('./pages/submission-magazine.mjs');
      m.init?.();
    } else if (path.endsWith('/issue-magazine.html')) {
      const m = await import('./pages/issue-magazine.mjs');
      m.init?.();
    } else if (path.endsWith('/team-magazine.html')) {
      const m = await import('./pages/team-magazine.mjs');
      m.init?.();
    } else if (path.endsWith('/alumni.html')) {
      const m = await import('./pages/alumni.mjs');
      m.init?.();
    } else if (path.endsWith('/about_us.html')) {
      const m = await import('./pages/about_us.mjs');
      m.init?.();
    } else if (path.endsWith('/constitution.html')) {
      const m = await import('./pages/constitution.mjs');
      m.init?.();
    } else if (path.endsWith('/leaders.html')) {
      const m = await import('./pages/leaders.mjs');
      m.init?.();
    } else if (path.endsWith('/scorp.html')) {
      const m = await import('./pages/scorp.mjs');
      m.init?.();
    }

  } catch (err) {
    console.error('Initialization error:', err);
  } finally {
    // ✅ HIDE LOADER ONCE INITIALIZATION IS DONE
    loader?.classList.add('hidden');
  }
});
