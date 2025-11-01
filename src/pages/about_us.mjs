document.addEventListener("DOMContentLoaded", () => {
  // ===== Fade-Zoom Elements =====
  const fadeZoomEls = document.querySelectorAll(".fade-zoom");
  const fadeObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        entry.target.classList.toggle("visible", entry.isIntersecting);
      });
    },
    { threshold: 0.2 }
  );
  fadeZoomEls.forEach(el => fadeObserver.observe(el));

  // ===== Animate Counters =====
  const counters = document.querySelectorAll(".stat-number");
  const impactSection = document.getElementById("impact");
  let countersTriggered = false;

  const animateCounter = (el) => {
    const target = +el.getAttribute("data-target");
    let count = 0;
    const increment = target / 200; // adjust speed
    const step = () => {
      count += increment;
      if (count < target) {
        el.textContent = Math.ceil(count);
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    };
    step();
  };

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!countersTriggered && entry.isIntersecting) {
          counters.forEach(c => animateCounter(c));
          countersTriggered = true;
          observer.disconnect();
        }
      });
    },
    { threshold: 0.4 }
  );

  observer.observe(impactSection);
});
