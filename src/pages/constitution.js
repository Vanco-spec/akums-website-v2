import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, collection, getDocs, query, orderBy, limit, where } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { firebaseConfig } from "../firebase.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ------------------ DOM ELEMENTS ------------------
const navbar = document.querySelector('.navbar-nav.ms-auto');
const navElement = document.querySelector('nav.navbar');

// Pre-created buttons
const dashboardButton = Object.assign(document.createElement("a"), {
  className: "nav-link",
  href: "#",
  textContent: "Dashboard"
});
const logoutButton = Object.assign(document.createElement("a"), {
  className: "nav-link text-danger fw-bold",
  href: "#",
  textContent: "Logout"
});

// Original login/signup links
const loginLink = document.querySelector('a[href="login.html"]');
const signupLink = document.querySelector('a[href="signup.html"]');

// ------------------ SHOW SKELETON ------------------
function showNavbarSkeleton() {
  navbar.innerHTML = `
    <li class="nav-item placeholder-glow"><a class="nav-link placeholder col-3"></a></li>
    <li class="nav-item placeholder-glow"><a class="nav-link placeholder col-4"></a></li>
    <li class="nav-item placeholder-glow"><a class="nav-link placeholder col-5"></a></li>
    <li class="nav-item placeholder-glow"><a class="nav-link placeholder col-3"></a></li>
    <li class="nav-item placeholder-glow"><a class="nav-link placeholder col-6"></a></li>
  `;
  navElement.style.visibility = "visible"; // show navbar immediately
}

// ------------------ RENDER NAVBAR ------------------
function renderNavbar(isLoggedIn = false) {
  // Clear navbar
  navbar.innerHTML = "";

  // Static links
  navbar.innerHTML = `
    <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
    <li class="nav-item"><a class="nav-link" href="events.html">Events</a></li>
    <li class="nav-item"><a class="nav-link" href="resources.html">Publications</a></li>
    <li class="nav-item"><a class="nav-link" href="alumni.html">Alumni</a></li>
    <li class="nav-item"><a class="nav-link active" href="about_us.html">About Us</a></li>
  `;

  // Dynamic last two buttons
    if (!isLoggedIn) {
    const navbar = document.querySelector(".navbar-nav"); // make sure this matches your HTML

    // Login link
    const loginLi = document.createElement("li");
    loginLi.className = "nav-item";
    const loginA = document.createElement("a");
    loginA.className = "nav-link"; // plain nav link
    loginA.href = "login.html";
    loginA.textContent = "Login";
    loginLi.appendChild(loginA);
    navbar.appendChild(loginLi);

    // Sign Up link as plain nav link
    const signupLi = document.createElement("li");
    signupLi.className = "nav-item";
    const signupA = document.createElement("a");
    signupA.className = "nav-link"; // same as login
    signupA.href = "signup.html";
    signupA.textContent = "Sign Up";
    signupLi.appendChild(signupA);
    navbar.appendChild(signupLi);

    } else {
      
    // User is logged in — add Dashboard and Logout
    const dashboardLi = document.createElement("li");
    dashboardLi.className = "nav-item";
    dashboardButton.className = "nav-link";
    dashboardLi.appendChild(dashboardButton);
    navbar.appendChild(dashboardLi);

    const logoutLi = document.createElement("li");
    logoutLi.className = "nav-item";
    logoutButton.className = "nav-link text-danger fw-bold";
    logoutLi.appendChild(logoutButton);
    navbar.appendChild(logoutLi);
  }
}

// ------------------ DASHBOARD & LOGOUT ------------------
dashboardButton.addEventListener("click", (e) => {
  e.preventDefault();
  const role = localStorage.getItem("userRole");
  if (role === "student") window.location.href = "student-dashboard.html";
  else if (role === "sponsor") window.location.href = "sponsor-dashboard.html";
  else window.location.href = "visitor-dashboard.html";
});

logoutButton.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    await signOut(auth);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    window.location.href = "index.html";
  } catch (err) {
    console.error("Error signing out:", err);
  }
});

// ------------------ INIT FLOW ------------------
document.addEventListener("DOMContentLoaded", () => {
  showNavbarSkeleton(); // show placeholders immediately

  // Render cached navbar from localStorage first (instant)
  const cachedLogin = localStorage.getItem("isLoggedIn") === "true";
  renderNavbar(cachedLogin);

  // Then re-check Firebase auth (update dynamically)
  onAuthStateChanged(auth, (user) => {
    renderNavbar(!!user);
    if (user) localStorage.setItem("isLoggedIn", "true");
    else {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userRole");
    }
  });
});

// --- SCROLL HIDE / SHOW LOGIC FOR FLOATING NAVBAR ---
// Detect scrolling direction and toggle .nav-hidden on wrapper.
(() => {
  const wrapper = document.querySelector('.floating-navbar-wrapper');
  const collapseEl = document.getElementById('navbarNavFloating'); // the collapse element
  if (!wrapper) return;

  let lastScroll = window.scrollY || 0;
  let ticking = false;
  const THRESHOLD = 10; // minimal scroll to consider
  const HIDE_AFTER = 80; // only start hiding after page scrolled this far (optional)

  function onScroll() {
    const current = window.scrollY || 0;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const delta = current - lastScroll;

        // If the page is not scrolled much, show the navbar
        if (current < HIDE_AFTER) {
          wrapper.classList.remove('nav-hidden');
        } else {
          if (Math.abs(delta) > THRESHOLD) {
            if (delta > 0) {
              // Scrolling down -> hide
              wrapper.classList.add('nav-hidden');
            } else {
              // Scrolling up -> show
              wrapper.classList.remove('nav-hidden');
            }
          }
        }

        lastScroll = current;
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Keep navbar visible while Bootstrap collapse (mobile menu) is shown
  if (collapseEl) {
    collapseEl.addEventListener('show.bs.collapse', () => {
      document.body.classList.add('navbar-menu-open');
    });
    collapseEl.addEventListener('hide.bs.collapse', () => {
      document.body.classList.remove('navbar-menu-open');
    });
  }

  // Optional: ensure on page load it's visible if top
  if ((window.scrollY || 0) < HIDE_AFTER) {
    wrapper.classList.remove('nav-hidden');
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  const fadeUps = document.querySelectorAll(".fade-up");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.2 }
  );

  fadeUps.forEach((el) => observer.observe(el));
});

document.addEventListener("DOMContentLoaded", () => {
  // ===== Fade + Zoom Animation (repeatable) =====
  const fadeZoomEls = document.querySelectorAll(".fade-zoom");

  const fadeZoomObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        } else {
          // Remove visible to allow repeat on scroll back
          entry.target.classList.remove("visible");
        }
      });
    },
    { threshold: 0.2 }
  );

  fadeZoomEls.forEach((el) => fadeZoomObserver.observe(el));
});