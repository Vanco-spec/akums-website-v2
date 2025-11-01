export function init() {

  // ===== HERO background =====
  const heroSection = document.querySelector(".hero-section");
  if (heroSection) {
    const bgImage = new Image();
    bgImage.src = "/assets/images/20250912_183220.jpg";
    bgImage.onload = () => heroSection.classList.add("hero-loaded");
  }

  // ===== IMPACT COUNTERS =====
  const skeleton = document.getElementById("impact-skeleton");
  const statsContainer = document.getElementById("impact-stats");
  const stats = document.querySelectorAll(".stat-number");

  function animateCounters() {
    stats.forEach(stat => {
      const target = +stat.dataset.target;
      let count = 0;
      const increment = Math.ceil(target / 80);
      const update = () => {
        count += increment;
        if (count < target) {
          stat.innerText = count.toLocaleString();
          requestAnimationFrame(update);
        } else {
          stat.innerText = target.toLocaleString() + "+";
        }
      };
      update();
    });
  }

  if (skeleton && statsContainer) {
    setTimeout(() => {
      skeleton.classList.add("d-none");
      statsContainer.classList.remove("d-none");
    }, 800);

    const counterObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) animateCounters();
        });
      },
      { threshold: 0.3 }
    );
    const impactSection = document.querySelector("#impact");
    if (impactSection) counterObserver.observe(impactSection);
  }

  // ===== TIMELINE ITEMS =====
  const timelineItems = document.querySelectorAll(".timeline-item");
  const timelineObserver = new IntersectionObserver(
    entries => entries.forEach(entry => entry.target.classList.toggle("visible", entry.isIntersecting)),
    { threshold: 0.15 }
  );
  timelineItems.forEach(item => timelineObserver.observe(item));

  // ===== SPONSORS PLACEHOLDER & FADE-IN =====
  const sponsors = document.querySelectorAll("#sponsors .sponsor-logo");
  sponsors.forEach(img => {
    const placeholder = document.createElement("div");
    placeholder.className = "sponsor-placeholder";
    placeholder.style.width = img.offsetWidth + "px";
    placeholder.style.height = img.offsetHeight + "px";
    placeholder.style.margin = "0 auto 15px";
    img.style.opacity = 0;
    img.parentNode.insertBefore(placeholder, img);
  });

  setTimeout(() => {
    sponsors.forEach(img => {
      const placeholder = img.previousElementSibling;
      if (placeholder && placeholder.classList.contains("sponsor-placeholder")) placeholder.remove();
      img.style.transition = "opacity 0.6s ease-in";
      img.style.opacity = 1;
    });
  }, 800);

  // ===== FADE-ON-SCROLL ELEMENTS & PARALLAX =====
  const fadeElements = document.querySelectorAll(".fade-on-scroll-left, .fade-on-scroll-right, .fade-item");
  const parallaxImg = document.querySelector(".fade-on-scroll-left img");

  const onScroll = () => {
    const windowHeight = window.innerHeight;

    fadeElements.forEach((el, idx) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < windowHeight - 100) {
        el.classList.add("visible");
        const speed = 0.01 + idx * 0.005;
        el.style.transform = `translateY(${rect.top * speed}px)`;
      } else {
        el.classList.remove("visible");
        el.style.transform = "";
      }
    });

    if (parallaxImg) {
      const rect = parallaxImg.parentElement.getBoundingClientRect();
      const speed = window.innerWidth < 768 ? 0.03 : 0.1;
      parallaxImg.style.transform = `translateY(${rect.top * speed}px)`;
    }
  };

  window.addEventListener("scroll", onScroll);
  onScroll();

  // ===== FADE + ZOOM ELEMENTS =====
  const fadeZoomEls = document.querySelectorAll(".fade-zoom");
  const fadeZoomObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        entry.target.classList.toggle("visible", entry.isIntersecting);
      });
    },
    { threshold: 0.2 }
  );
  fadeZoomEls.forEach(el => fadeZoomObserver.observe(el));
}
