// events-carousel.js
const query = (sel, ctx=document) => ctx.querySelector(sel);
const queryAll = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

class SimpleCarousel {
  constructor(root) {
    this.root = root;
    this.track = query('.carousel-track', root);
    this.slides = queryAll('.carousel-slide', this.track);
    this.prevBtn = query('.carousel-prev', root);
    this.nextBtn = query('.carousel-next', root);
    this.indicatorsContainer = query('.carousel-indicators', root);

    this.current = 0;
    this.count = this.slides.length;
    this.autoplay = root.dataset.autoplay === 'true';
    this.interval = Number(root.dataset.interval) || 5000;
    this.timer = null;
    this.isPointerDown = false;
    this.startX = 0;
    this.currentTranslate = 0;
    this.prevTranslate = 0;
    this.isDragging = false;
    this._visibilityHandler = this._onVisibilityChange.bind(this);

    this.init();
  }

  init() {
    if (!this.track || this.count === 0) return;
    this._createIndicators();
    this._bindEvents();
    this.goTo(0, false);
    this._lazyLoadAround(0);
    document.addEventListener('visibilitychange', this._visibilityHandler);
    if (this.autoplay) this.play();
  }

  _createIndicators() {
    this.indicators = [];
    this.indicatorsContainer.innerHTML = '';
    for (let i=0;i<this.count;i++){
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('role','tab');
      btn.setAttribute('aria-selected','false');
      btn.setAttribute('aria-label',`Show slide ${i+1}`);
      btn.addEventListener('click', ()=> { this.goTo(i); this.pauseTemporarily(); });
      this.indicatorsContainer.appendChild(btn);
      this.indicators.push(btn);
    }
  }

  _bindEvents(){
    this.prevBtn?.addEventListener('click', ()=> { this.prev(); this.pauseTemporarily(); });
    this.nextBtn?.addEventListener('click', ()=> { this.next(); this.pauseTemporarily(); });

    // keyboard
    this.root.addEventListener('keydown', (e)=>{
      if (e.key === 'ArrowLeft') { this.prev(); this.pauseTemporarily();}
      if (e.key === 'ArrowRight') { this.next(); this.pauseTemporarily();}
    });
    // make root focusable
    this.root.tabIndex = 0;

    // pointer events for swipe (works for mouse and touch)
    let track = this.track;
    track.addEventListener('pointerdown', this._onPointerDown.bind(this));
    track.addEventListener('pointermove', this._onPointerMove.bind(this));
    track.addEventListener('pointerup', this._onPointerUp.bind(this));
    track.addEventListener('pointercancel', this._onPointerUp.bind(this));
    track.addEventListener('pointerleave', this._onPointerUp.bind(this));

    // pause on hover/focus
    this.root.addEventListener('mouseenter', ()=> this.pause());
    this.root.addEventListener('mouseleave', ()=> { if (this.autoplay) this.play(); });
    this.root.addEventListener('focusin', ()=> this.pause());
    this.root.addEventListener('focusout', ()=> { if (this.autoplay) this.play(); });

    // resize -> re-calc transform
    window.addEventListener('resize', ()=> this.goTo(this.current, false));
  }

  _onVisibilityChange(){
    if (document.hidden) this.pause();
    else if (this.autoplay) this.play();
  }

  _onPointerDown(e){
    this.isPointerDown = true;
    this.startX = e.clientX;
    this.prevTranslate = this.currentTranslate;
    this.track.style.transition = 'none';
    this.track.setPointerCapture(e.pointerId);
  }

 _onPointerMove(e) {
  if (!this.isPointerDown) return;
  e.preventDefault(); // ✅ stops page scrolling while swiping
  const dx = e.clientX - this.startX;
  const width = this.root.offsetWidth;
  this.currentTranslate = -this.current * width + dx;
  this.track.style.transform = `translateX(${this.currentTranslate}px)`;
  this.isDragging = true;
}

  _onPointerUp(e){
    if (!this.isPointerDown) return;
    this.isPointerDown = false;
    const dx = e.clientX - this.startX;
    const width = this.root.offsetWidth;
    this.track.style.transition = '';
    if (Math.abs(dx) > width * 0.15) {
      if (dx < 0) this.next();
      else this.prev();
    } else {
      this.goTo(this.current);
    }
    this.isDragging = false;
  }

  goTo(index, animate=true){
    if (index < 0) index = this.count - 1;
    if (index >= this.count) index = 0;
    this.current = index;
    const offset = - index * this.root.offsetWidth;
    if (!animate) this.track.style.transition = 'none';
    else this.track.style.transition = '';
    this.track.style.transform = `translateX(${offset}px)`;
    // update classes
    this.slides.forEach((s,i)=> {
      s.classList.toggle('is-active', i===index);
      s.setAttribute('aria-hidden', i===index ? 'false' : 'true');
    });
    // indicators
    this.indicators.forEach((b,i)=> b.setAttribute('aria-selected', String(i===index)));
    // lazy load nearby images
    this._lazyLoadAround(index);
  }

  prev(){ this.goTo(this.current - 1); }
  next(){ this.goTo(this.current + 1); }

  play(){
    if (this.timer) return;
    this.timer = setInterval(()=> {
      this.next();
    }, this.interval);
  }

  pause(){
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
  }

  pauseTemporarily(){
    // stop autoplay for a short time after user interaction
    this.pause();
    if (this.autoplay) {
      setTimeout(()=> { if (!document.hidden) this.play(); }, 4000);
    }
  }

  _lazyLoadAround(index){
    // load current, previous, and next images
    [index-1,index,index+1].forEach(i => {
      if (i < 0) i = this.count - 1;
      if (i >= this.count) i = 0;
      const img = this.slides[i].querySelector('img.lazy');
      if (img && !img.dataset.loaded) {
        const src = img.dataset.src;
        if (src) {
          img.src = src;
          img.addEventListener('load', ()=> {
            img.classList.add('loaded');
            img.dataset.loaded = 'true';
          });
          img.removeAttribute('data-src');
        }
      }
    });
  }

  destroy(){
    document.removeEventListener('visibilitychange', this._visibilityHandler);
    this.pause();
  }
}

// Auto-init all carousels on page
document.addEventListener('DOMContentLoaded', () => {
  const carousels = document.querySelectorAll('.carousel');
  carousels.forEach(root => {
    new SimpleCarousel(root);
  });
});
