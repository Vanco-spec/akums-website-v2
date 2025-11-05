document.addEventListener("DOMContentLoaded", () => {
  const carousels = document.querySelectorAll(".event-slideshow");

  carousels.forEach((carousel) => {
    const slides = carousel.querySelectorAll(".slide");
    const indicators = carousel.querySelectorAll(".indicator");
    const prevBtn = carousel.querySelector(".prev");
    const nextBtn = carousel.querySelector(".next");

    let current = 0;

    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === index);
        indicators[i].classList.toggle("active", i === index);
      });
      current = index;
    }

    function nextSlide() {
      const next = (current + 1) % slides.length;
      showSlide(next);
    }

    function prevSlide() {
      const prev = (current - 1 + slides.length) % slides.length;
      showSlide(prev);
    }

    // Event listeners
    nextBtn.addEventListener("click", nextSlide);
    prevBtn.addEventListener("click", prevSlide);

    indicators.forEach((btn, i) => {
      btn.addEventListener("click", () => showSlide(i));
    });

    // Optional: auto-advance every 5s
    let autoPlay = setInterval(nextSlide, 5000);

    // Pause autoplay on hover
    carousel.addEventListener("mouseenter", () => clearInterval(autoPlay));
    carousel.addEventListener("mouseleave", () => {
      autoPlay = setInterval(nextSlide, 5000);
    });
  });
});
