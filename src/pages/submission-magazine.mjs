// src/pages/publication.js
export function initPublicationPage() {
  // ===== Fade + Zoom Animation (repeatable) =====
  const fadeZoomEls = document.querySelectorAll(".fade-zoom");

  const fadeZoomObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        } else {
          entry.target.classList.remove("visible"); // allow repeat on scroll back
        }
      });
    },
    { threshold: 0.2 }
  );

  fadeZoomEls.forEach((el) => fadeZoomObserver.observe(el));
}

// Run the page animations when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  initPublicationPage();
});
