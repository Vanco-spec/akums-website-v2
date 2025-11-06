// src/components/footer.js

export function initFooter() {
  const footerContainer = document.getElementById("site-footer");
  if (!footerContainer) return; // skip if no footer element exists

  // Insert footer HTML
  footerContainer.innerHTML = `
   <!-- ====== FOOTER ====== -->
   <footer class="footer-section py-5">
     <div class="container">
       <div class="row g-4 fade-zoom">

         <!-- About -->
         <div class="col-md-4">
           <h5 class="footer-title mb-3">ABOUT AKUMS</h5>
           <p class="small footer-p">
             The Association of Kenyatta University Medical Students (AKUMS) fosters leadership,
             community service, and academic excellence among future healthcare professionals.
           </p>
         </div>

         <div class="col-md-4">
           <h5 class="footer-title mb-3">QUICK LINKS</h5>
           <ul class="list-unstyled footer-links">
             <li><a href="index.html">Home</a></li>
             <li><a href="events.html">Events</a></li>
             <li><a href="resources.html">Publications</a></li>
             <li><a href="alumni.html">Alumni</a></li>
             <li><a href="about_us.html">About Us</a></li>
           </ul>
         </div>

         <!-- Contact & Socials -->
         <div class="col-md-4">
           <h5 class="footer-title mb-3">CONTACT & SOCIALS</h5>
           <p class="small footer-p mb-1"><i class="bi bi-geo-alt-fill me-2"></i>Kenyatta University, School of Medicine</p>
           <p class="small footer-p mb-1"><i class="bi bi-envelope-fill me-2"></i>info@akums.org</p>
           <p class="small footer-p mb-3"><i class="bi bi-telephone-fill me-2"></i>+254 700 000 000</p>

           <div class="social-icons">
             <a href="#"><i class="bi bi-facebook"></i></a>
             <a href="#"><i class="bi bi-instagram"></i></a>
             <a href="#"><i class="bi bi-twitter-x"></i></a>
             <a href="#"><i class="bi bi-linkedin"></i></a>
           </div>
         </div>
       </div>

       <hr class="my-4 border-light">

       <div class="d-flex flex-column flex-md-row justify-content-between align-items-center small fade-zoom">
         <p class=" footer-p mb-2 mb-md-0"> &copy; 2025 Association of Kenyatta University Medical Students (AKUMS). All rights reserved.</p>
         <p class="mb-0">Created by <a href="https://yourportfolio.com" target="_blank">BATMAN</a></p>
       </div>
     </div>

     <script defer src="https://speed-insights.vercel.app/script.js"></script>


   </footer>
  `;

  // ===== Fade + Zoom Animation for Footer =====
  const fadeZoomEls = footerContainer.querySelectorAll(".fade-zoom");

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
