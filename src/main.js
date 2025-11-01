// src/main.js
import './auth/auth.js'
import './auth/login.js'
import './components/footer.js'
import './components/navbar.js'
import './firebase.js'
import './pages/about_us.js'
import './pages/admin-dashboard.js'
import './pages/admin.js'
import './pages/alumni.js'
import './pages/constitution.js'
import './pages/dashboard.js'
import './pages/events.js'
import './pages/home.js'
import './pages/leaders.js'
import './pages/resources.js'
import './pages/scorp.js'
import './pages/sponsor-dashboard.js'
import './pages/student-dashboard.js'
import './pages/subscription.js'
import './pages/visitor-dashboard.js'

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
