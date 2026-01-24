import { db } from '../firebase.mjs'; // your Firestore instance
import { collection, addDoc } from 'firebase/firestore';
import 'animate.css';

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

  // ===== EVENT CARD ANIMATION (animate.css) =====
  const eventCards = document.querySelectorAll(".event-card");

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(
            "animate__animated",
            "animate__fadeInUp"
          );

          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";

          obs.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.2 }
  );

  eventCards.forEach(card => observer.observe(card));

      // ===== PURE FADE-IN (NO SLIDE) =====
    const fadeOnlyEls = document.querySelectorAll(".fade-only");

    const fadeObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add(
              "animate__animated",
              "animate__fadeIn"
            );

            entry.target.style.opacity = "1";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    fadeOnlyEls.forEach(el => fadeObserver.observe(el));


// ===== NEW IMPACT RING ANIMATION =====

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

