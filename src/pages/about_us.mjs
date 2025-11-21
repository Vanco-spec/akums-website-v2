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

 (function(){
    // animate numeric counts (very small / graceful fallback)
    document.querySelectorAll('.count').forEach(el=>{
      const start = 0;
      const end = parseInt(el.textContent.replace(/\D/g,'')) || 1200;
      let cur = start;
      const dur = 900;
      const step = Math.max(1, Math.round(end / (dur/16)));
      const t = setInterval(()=>{
        cur += step;
        if(cur >= end){ el.textContent = end.toLocaleString(); clearInterval(t); }
        else el.textContent = cur.toLocaleString();
      }, 16);
    });
    // optional: open registration links in new tab for safety
    document.querySelectorAll('.card-actions a').forEach(a=>{
      if(a.href && a.getAttribute('target')===null) a.setAttribute('target','_blank');
    });
  })();

  