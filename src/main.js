// src/main.js

// Import global CSS and Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import './styles.css';

// Import shared components
import { initNavbar } from './components/navbar.js';
import { initFooter } from './components/footer.js';

// Initialize components after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize navbar and footer
  initNavbar();
  initFooter();

  // Detect current page and dynamically load page-specific JS
  const path = window.location.pathname;

  if (path.endsWith('/index.html') || path === '/') {
    import('./pages/home.js').then(m => m.init?.());
  } else if (path.endsWith('/events.html')) {
    import('./pages/events.js').then(m => m.init?.());
  } else if (path.endsWith('/resources.html')) {
    import('./pages/resources.js').then(m => m.init?.());
  } else if (path.endsWith('/alumni.html')) {
    import('./pages/alumni.js').then(m => m.init?.());
  } else if (path.endsWith('/about_us.html')) {
    import('./pages/about_us.js').then(m => m.init?.());
  } else if (path.endsWith('/login.html')) {
    import('./auth/login.js').then(m => m.init?.());
  } else if (path.endsWith('/constitution.html')) {
    import('./pages/constitution.js').then(m => m.init?.());  
  } else if (path.endsWith('/leaders.html')) {
    import('./pages/leaders.js').then(m => m.init?.()); 
  } else if (path.endsWith('/scorp.html')) {
    import('./pages/scorp.js').then(m => m.init?.());     
  } else if (path.endsWith('/signup.html')) {
    import('./auth/auth.js').then(m => m.init?.());       
  }
});
