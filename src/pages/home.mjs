import { db } from '../firebase.mjs'; // your Firestore instance
import { collection, addDoc } from 'firebase/firestore';

export function init() {

function hideLoader() {
  const loader = document.getElementById("loader");
  if (!loader) return;

  loader.classList.add("hidden");

  // Remove completely after animation
  setTimeout(() => loader.remove(), 1800);
}

// If page loads from cache extremely fast
if (document.readyState === "complete" || document.readyState === "interactive") {
  hideLoader();
} else {
  document.addEventListener("DOMContentLoaded", hideLoader);
}

// Also run after full load (fallback)
window.addEventListener("load", hideLoader);


  // ===== HERO background =====
  const heroSection = document.querySelector(".hero-section");
  if (heroSection) {
    const bgImage = new Image();
    bgImage.src = "/assets/images/20250912_183220.jpg";
    bgImage.onload = () => heroSection.classList.add("hero-loaded");
  }

// ===== NEW IMPACT RING ANIMATION =====

// Get elements ONCE at the top
const impactStats = document.querySelector('#impact-stats');
const skeleton = document.getElementById("impact-skeleton");

// Remove skeleton + show stats BEFORE observing
if (skeleton && impactStats) {
  skeleton.classList.add("d-none");
  impactStats.classList.remove("d-none");
}

function animateStats() {
  const stats = document.querySelectorAll('.stat-ring');
  stats.forEach(stat => {
    const target = parseInt(stat.dataset.target);
    const numberEl = stat.querySelector('.stat-number');
    const progressEl = stat.querySelector('.ring-progress');

    let current = 0;
    const increment = target / 100;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }

      numberEl.textContent = Math.floor(current);
      const progress = (current / target) * 100;
      progressEl.style.setProperty('--progress', `${progress}%`);
    }, 30);
  });
}

// Intersection Observer
const impactObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateStats();
    }
  });
}, { threshold: 0.3 });

// Start observing stats container
if (impactStats) impactObserver.observe(impactStats);


  // ===== TIMELINE ITEMS =====
  const timelineItems = document.querySelectorAll(".timeline-item");
  const timelineObserver = new IntersectionObserver(
    entries => entries.forEach(entry => entry.target.classList.toggle("visible", entry.isIntersecting)),
    { threshold: 0.15 }
  );
  timelineItems.forEach(item => timelineObserver.observe(item));

// Intersection Observer for hall of fame animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
});
document.querySelectorAll('.fade-hall').forEach(el => observer.observe(el));
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

  // ===== NEWSLETTER FORM HANDLING =====
const newsletterForm = document.querySelector('.newsletter-form');

if (newsletterForm) {
  newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const emailInput = newsletterForm.querySelector('.newsletter-input');
    const email = emailInput.value.trim();

    // Check if input is empty
    if (!email) {
      alert("Please enter your email.");
      emailInput.focus();
      return;
    }

    // Check if input contains @gmail.com
    if (!email.endsWith("@gmail.com")) {
      alert("Please enter a valid Gmail address (e.g., example@gmail.com).");
      emailInput.focus();
      return;
    }

    try {
      await addDoc(collection(db, "newsletterSubscribers"), {
        email: email,
        timestamp: new Date()
      });

      // Success feedback
      alert("Thank you for subscribing to our news letter!");
      newsletterForm.reset();

    } catch (error) {
      console.error("Error adding email: ", error);
      alert("Subscription failed. Please try again later.");
    }
  });
}

}

