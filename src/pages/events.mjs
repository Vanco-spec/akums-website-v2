  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
  import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
  import { getFirestore, collection, query, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
  import { firebaseConfig } from "../firebase.mjs";

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);


  // Events container
  const eventsList = document.getElementById("events-list");
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
      <li class="nav-item"><a class="nav-link" href="Index.html">Home</a></li>
      <li class="nav-item"><a class="nav-link active" href="events.html">Events</a></li>
      <li class="nav-item"><a class="nav-link" href="resources.html">Publications</a></li>
      <li class="nav-item"><a class="nav-link" href="alumni.html">Alumni</a></li>
      <li class="nav-item"><a class="nav-link" href="about_us.html">About Us</a></li>
    `;

    // Dynamic last two buttons
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



  // Wait until DOM is fully loaded
  document.addEventListener("DOMContentLoaded", () => {
    var eventsCarousel = document.querySelector('#eventsCarousel');

    if (eventsCarousel) { // make sure the element exists
      var carousel = new bootstrap.Carousel(eventsCarousel, {
        interval: 5000,  // 5 seconds per slide
        pause: 'hover',  // pause when hovering
        wrap: true       // loop back to first slide
      });
    }
  });

  // ======= SOCIAL EVENTS TIMELINE SCROLL ANIMATION =======
  // ======= SOCIAL EVENTS TIMELINE SCROLL IN/OUT ANIMATION =======
  document.addEventListener("DOMContentLoaded", () => {
    const timelineItems = document.querySelectorAll(".timeline-item");

    const observerOptions = {
      root: null,           // viewport
      rootMargin: "0px",
      threshold: 0.15       // triggers when 15% of item is visible
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");   // item enters view
        } else {
          entry.target.classList.remove("visible"); // item leaves view
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    timelineItems.forEach(item => observer.observe(item));
  });


  document.addEventListener("DOMContentLoaded", () => {
    const sponsors = document.querySelectorAll("#sponsors .sponsor-logo");

    // Step 1: Show placeholder skeletons initially
    sponsors.forEach(img => {
      const placeholder = document.createElement("div");
      placeholder.className = "sponsor-placeholder";
      placeholder.style.height = img.offsetHeight + "px";
      placeholder.style.width = img.offsetWidth + "px";
      placeholder.style.margin = "0 auto 15px";
      img.style.display = "none";
      img.parentNode.insertBefore(placeholder, img);
    });

    // Step 2: After short delay, reveal actual logos
    setTimeout(() => {
      sponsors.forEach(img => {
        const placeholder = img.previousElementSibling;
        if (placeholder && placeholder.classList.contains("sponsor-placeholder")) {
          placeholder.remove();
        }
        img.style.display = "inline-block";
      });
    }, 800); // 0.8s delay to simulate loading
  });

  document.addEventListener("DOMContentLoaded", () => {
    const fadeElements = document.querySelectorAll(
      ".fade-on-scroll-left, .fade-on-scroll-right, .fade-item"
    );
    const parallaxImg = document.querySelector(".fade-on-scroll-left img");

    const onScroll = () => {
      const windowHeight = window.innerHeight;

      // Fade-in and subtle staggered movement for text elements
      fadeElements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < windowHeight - 100) {
          el.classList.add("visible");

          // Subtle staggered vertical movement
          const speed = 0.01 + index * 0.005; // smaller movement
          const translateY = rect.top * speed;
          el.style.transform = `translateY(${translateY}px)`;
        } else {
          el.classList.remove("visible");
          el.style.transform = ""; // reset
        }
      });

      // Parallax for image (subtle)
      if (parallaxImg) {
        const rect = parallaxImg.parentElement.getBoundingClientRect();
        const speed = window.innerWidth < 768 ? 0.03 : 0.1; // toned down
        const translateY = rect.top * speed;
        parallaxImg.style.transform = `translateY(${translateY}px)`;
      }
    };

    // Trigger on load and scroll
    onScroll();
    window.addEventListener("scroll", onScroll);
  });

  // ----------------- LOAD ALL EVENTS -----------------
  async function loadAllEvents() {
    try {
      // ✅ Show loader
      eventsList.innerHTML = `
        <div class="col-12 text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading events...</span>
          </div>
        </div>
      `;

      // ✅ Fetch events
      const snapshot = await getDocs(collection(db, "events"));

      // ✅ Clear loader
      eventsList.innerHTML = "";

      // ✅ Handle empty collection
      if (snapshot.empty) {
        eventsList.innerHTML = `
          <div class="col-12 text-center">
            <div class="card border-0 shadow-sm p-4">
              <i class="bi bi-calendar-x fs-1 text-muted mb-2"></i>
              <h5>No Events Available</h5>
              <p>Please check back later for upcoming events.</p>
            </div>
          </div>
        `;
        return;
      }

      // ✅ Cache modal elements (better performance)
      const modalEl = document.getElementById("eventDetailsModal");
      const modal = new bootstrap.Modal(modalEl);
      const modalTitle = modalEl.querySelector("#eventDetailsModalLabel");
      const modalImg = modalEl.querySelector("#modal-event-image");
      const modalDateTime = modalEl.querySelector("#modal-event-date-time");
      const modalVenue = modalEl.querySelector("#modal-event-venue");
      const modalDesc = modalEl.querySelector("#modal-event-description");
      const modalLink = modalEl.querySelector("#modal-event-link a");

      // ✅ Use fragment for efficient DOM insertion
      const fragment = document.createDocumentFragment();

      snapshot.forEach(doc => {
        const event = doc.data();
        const div = document.createElement("div");
        div.className = "col-12 mb-4";

        const imgSrc = event.imageUrl || "assets/images/placeholder.png";

        div.innerHTML = `
          <div class="card shadow-sm d-flex flex-row align-items-center event-card" style="min-height: 150px; cursor: pointer;">
            <!-- Image Section -->
            <div class="event-image" style="flex: 0 0 200px; position: relative;">
              <img 
                data-src="${imgSrc}"
                src="assets/images/placeholder.png"
                alt="${event.name || 'Event'}"
                class="lazy-img img-fluid h-100 w-100 object-fit-cover rounded-start"
                style="opacity: 0; transition: opacity 0.6s ease;">
            </div>

            <!-- Divider Line -->
            <div style="width: 2px; background-color: #dee2e6;"></div>

            <!-- Info Section -->
            <div class="p-3 flex-grow-1">
              <h5 class="card-title mb-2">${event.name || "Untitled Event"}</h5>
              <p class="card-date text-muted mb-1">
                ${event.date || "Date TBD"} ${event.time ? "• " + event.time : ""}
              </p>
              <p class="card-location text-muted mb-2">
                <i class="bi bi-geo-alt"></i> ${event.venue || event.location || ""}
              </p>
              <p class="card-description mb-0">${event.description || ""}</p>
            </div>
          </div>
        `;

        // ✅ Handle click → open modal
        div.querySelector(".event-card").addEventListener("click", () => {
          modalTitle.textContent = event.name || "Untitled Event";
          modalImg.src = imgSrc;
          modalDateTime.textContent = `${event.date || "Date TBD"} ${event.time ? "• " + event.time : ""}`;
          modalVenue.textContent = event.venue || event.location || "Not specified";
          modalDesc.textContent = event.description || "No description available.";

          if (event.link) {
            modalLink.href = event.link;
            modalLink.style.display = "inline-block";
          } else {
            modalLink.style.display = "none";
          }

          modal.show();
        });

        fragment.appendChild(div);
      });

      // ✅ Add all event cards to DOM at once
      eventsList.appendChild(fragment);

      // ✅ Lazy loading using IntersectionObserver
      const lazyImages = document.querySelectorAll(".lazy-img");
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.onload = () => (img.style.opacity = "1");
            obs.unobserve(img);
          }
        });
      }, { threshold: 0.25 });

      lazyImages.forEach(img => observer.observe(img));

    } catch (error) {
      console.error("Error loading events:", error);
      eventsList.innerHTML = `
        <div class="col-12 text-center">
          <div class="card border-danger shadow-sm p-4">
            <i class="bi bi-exclamation-triangle-fill text-danger fs-1 mb-2"></i>
            <h5 class="text-danger">Failed to Load Events</h5>
            <p>Something went wrong while fetching events. Please try again later.</p>
          </div>
        </div>
      `;
    }
  }

  // Run on page load
  document.addEventListener("DOMContentLoaded", loadAllEvents);

  // ----------------- EVENT SEARCH -----------------

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
