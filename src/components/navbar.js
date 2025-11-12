// src/components/navbar.js
import { auth } from "../firebase.mjs";
import { onAuthStateChanged, signOut } from "firebase/auth";

// ====== NAVBAR HTML TEMPLATE ======
const NAV_HTML = (isLoggedIn) => `
  <div class="floating-navbar-wrapper">
    <nav class="navbar navbar-expand-lg navbar-light floating-navbar">
      <div class="container-fluid px-3">
        <a class="navbar-brand d-flex align-items-center" href="/index.html">
          <img  src="/assets/images/logo.png" height="36" class="me-2" alt=" " loading="lazy">
          <span class="navbar-text text-wrap text-dark">
            Association of Kenyatta University Medical Students
          </span>
        </a>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavFloating">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse justify-content-end" id="navbarNavFloating">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item"><a class="nav-link" href="/index.html">Home</a></li>
            <li class="nav-item"><a class="nav-link" href="/events.html">Events</a></li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="publicationsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Magazine
              </a>
              <ul class="dropdown-menu" aria-labelledby="publicationsDropdown">
                <li><a class="dropdown-item" href="/resources.html">About</a></li>
                <li><a class="dropdown-item" href="/submission-magazine.html">Submission</a></li>
                <li><a class="dropdown-item" href="/issue-magazine.html">Issues</a></li>
                <li><a class="dropdown-item" href="/team-magazine.html">Team</a></li>
              </ul>
            </li>
            <li class="nav-item"><a class="nav-link" href="/alumni.html">Alumni</a></li>
            <li class="nav-item"><a class="nav-link" href="/about_us.html">About Us</a></li>
            ${
              !isLoggedIn
                ? `<li class="nav-item"><a class="nav-link" href="/login.html">Login</a></li>
                   <li class="nav-item"><a class="nav-link" href="/signup.html">Sign Up</a></li>`
                : `<li class="nav-item"><a class="nav-link" id="dashboard-link" href="#">Dashboard</a></li>
                   <li class="nav-item"><a id="logout-link" class="nav-link text-danger fw-bold" href="#">Logout</a></li>`
            }
          </ul>
        </div>
      </div>
    </nav>
  </div>
`;

// ====== INIT NAVBAR ======
export function initNavbar() {
  const header = document.getElementById("site-header");
  if (!header) return;

  showNavbarSkeleton(header);

  // Render cached state instantly
  const cachedLogin = localStorage.getItem("isLoggedIn") === "true";
  header.innerHTML = NAV_HTML(cachedLogin);

  // Listen for Firebase auth changes
  onAuthStateChanged(auth, (user) => {
    const isLoggedIn = !!user;
    header.innerHTML = NAV_HTML(isLoggedIn);

    if (isLoggedIn) localStorage.setItem("isLoggedIn", "true");
    else {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userRole");
    }

    attachDynamicLinks();
    setActiveNavLink();
    initNavbarScroll();
  });
}

// ====== SKELETON LOADING ======
function showNavbarSkeleton(header) {
  header.innerHTML = `
    <div class="floating-navbar-wrapper">
      <nav class="navbar navbar-expand-lg navbar-light floating-navbar">
        <div class="container-fluid px-3">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item placeholder-glow"><a class="nav-link placeholder col-3"></a></li>
            <li class="nav-item placeholder-glow"><a class="nav-link placeholder col-4"></a></li>
            <li class="nav-item placeholder-glow"><a class="nav-link placeholder col-5"></a></li>
            <li class="nav-item placeholder-glow"><a class="nav-link placeholder col-3"></a></li>
            <li class="nav-item placeholder-glow"><a class="nav-link placeholder col-6"></a></li>
          </ul>
        </div>
      </nav>
    </div>
  `;
}

// ====== SET ACTIVE NAV LINK ======
function setActiveNavLink() {
  const links = document.querySelectorAll(".floating-navbar .nav-link");
  const currentPath = window.location.pathname;
  links.forEach(link => {
    const href = link.getAttribute("href").replace(/^\/|\/$/g, "");
    const path = currentPath.replace(/^\/|\/$/g, "");
    if (href === path || (href === "index.html" && path === "")) {
    link.classList.add("active");
  }
 else 
  {
      link.classList.remove("active");
    }
  });
}

// ====== SCROLL HIDE/SHOW ======
function initNavbarScroll() {
  const wrapper = document.querySelector(".floating-navbar-wrapper");
  const collapseEl = document.getElementById("navbarNavFloating");
  if (!wrapper) return;

  let lastScroll = window.scrollY || 0;
  let ticking = false;
  const THRESHOLD = 10;
  const HIDE_AFTER = 80;

  function onScroll() {
    const current = window.scrollY || 0;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const delta = current - lastScroll;
        if (current < HIDE_AFTER) {
          wrapper.classList.remove("nav-hidden");
        } else if (Math.abs(delta) > THRESHOLD) {
          if (delta > 0) wrapper.classList.add("nav-hidden");
          else wrapper.classList.remove("nav-hidden");
        }
        lastScroll = current;
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  if (collapseEl) {
    collapseEl.addEventListener("show.bs.collapse", () =>
      document.body.classList.add("navbar-menu-open")
    );
    collapseEl.addEventListener("hide.bs.collapse", () =>
      document.body.classList.remove("navbar-menu-open")
    );
  }

  if ((window.scrollY || 0) < HIDE_AFTER) wrapper.classList.remove("nav-hidden");
}

// ====== DYNAMIC BUTTON HANDLERS ======
function attachDynamicLinks() {
  const logoutEl = document.getElementById("logout-link");
  if (logoutEl) {
    logoutEl.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        await signOut(auth);
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userRole");
        window.location.href = "/index.html";
      } catch (err) {
        console.error("Sign out error", err);
      }
    });
  }

  const dashboardEl = document.getElementById("dashboard-link");
  if (dashboardEl) {
    dashboardEl.addEventListener("click", (e) => {
      e.preventDefault();
      const role = localStorage.getItem("userRole");
      if (role === "student") window.location.href = "/student-dashboard.html";
      else if (role === "sponsor") window.location.href = "/sponsor-dashboard.html";
      else window.location.href = "/visitor-dashboard.html";
    });
  }
}

// Smooth dropdown hide animation
document.addEventListener("hide.bs.dropdown", (e) => {
  const menu = e.target.querySelector(".dropdown-menu");
  if (menu) {
    e.preventDefault(); // stop Bootstrap from closing instantly
    menu.classList.remove("show");
    menu.classList.add("hide");
    setTimeout(() => {
      menu.classList.remove("hide");
      e.target.classList.remove("show");
    }, 620); // match animation duration
  }
});

const dropdownItems = document.querySelectorAll('.floating-navbar .dropdown-item');

dropdownItems.forEach(item => {
  item.addEventListener('click', () => {
    dropdownItems.forEach(i => i.classList.remove('active')); // remove active from all
    item.classList.add('active'); // add to clicked
  });
});


const dropdowns = document.querySelectorAll('.floating-navbar .nav-item.dropdown');

dropdowns.forEach(drop => {
  const link = drop.querySelector('.nav-link');
  const menu = drop.querySelector('.dropdown-menu');

  // Track toggle state
  let clicked = false;

  // Click toggles the dropdown manually
  link.addEventListener('click', e => {
    e.preventDefault(); // optional: prevent default link jump
    clicked = !clicked;
    if (clicked) {
      menu.classList.add('show');
      menu.style.opacity = 1;
      menu.style.visibility = 'visible';
    } else {
      menu.classList.remove('show');
      menu.style.opacity = 0;
      menu.style.visibility = 'hidden';
    }
  });

  // Hover also shows the dropdown
  drop.addEventListener('mouseenter', () => {
    menu.classList.add('show');
    menu.style.opacity = 1;
    menu.style.visibility = 'visible';
  });

  // Only hide on mouseleave if not clicked
  drop.addEventListener('mouseleave', () => {
    if (!clicked) {
      menu.classList.remove('show');
      menu.style.opacity = 0;
      menu.style.visibility = 'hidden';
    }
  });
});
