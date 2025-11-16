// Intersection Observer for fade animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
});
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

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

document.addEventListener("DOMContentLoaded", () => {
  // Select all elements inside the about-magazine section that should animate
  const elements = document.querySelectorAll(".about-magazine-section h2, .about-magazine-section p, .about-magazine-section img");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view"); // triggers CSS transition
      } else {
        entry.target.classList.remove("in-view"); // allows repeat animation when scrolled out and back
      }
    });
  }, {
    threshold: 0.2 // trigger when 20% visible
  });

  elements.forEach(el => observer.observe(el));
});
