// src/components/loader.js
export function initLoader() {
  if (document.getElementById('page-loader')) return;

  const loaderHTML = `
  <!-- ===== LOADING SCREEN ===== -->
<div id="loader">
    <div class="circle-wrap">
    <div class="circle"></div>
    <div class="circle"></div>
    <div class="circle"></div>
    <div class="circle"></div>
    <div class="circle"></div>
  </div>

    <!-- Hovering Logo -->
  <img src="/assets/images/logo.png" id="loader-logo" alt="AKUMS Logo">
</div>
  `;

  document.body.insertAdjacentHTML('afterbegin', loaderHTML);
}
