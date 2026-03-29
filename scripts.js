// scripts.js — Timeline, tabs, lightbox, scroll animations, card flipping
document.addEventListener('DOMContentLoaded', function () {

  // ───── Timeline: horizontal swipeable with drag-to-scroll ─────
  const details = document.getElementById('timeline-details');
  const scroller = document.getElementById('timeline-scroller');
  if (scroller) {
    const points = Array.from(scroller.querySelectorAll('.timeline-item'));
    let dragDist = 0;

    function activateItem(pt) {
      points.forEach(p => p.classList.remove('active'));
      pt.classList.add('active');
      const text = pt.getAttribute('data-details') || '';
      if (details) {
        details.style.opacity = '0';
        setTimeout(() => {
          details.textContent = text;
          details.style.opacity = '1';
        }, 150);
      }
      const target = Math.round(pt.offsetLeft + pt.offsetWidth / 2 - scroller.clientWidth / 2);
      scroller.scrollTo({ left: target, behavior: 'smooth' });
    }

    points.forEach(pt => {
      pt.addEventListener('click', (e) => {
        if (e.target.closest('a')) return;
        if (dragDist > 5) return; // ignore click after drag
        activateItem(pt);
      });
    });

    // Pointer drag to scroll (no pointer capture — avoids eating clicks)
    let isDown = false, startX, startScroll;
    scroller.addEventListener('pointerdown', (e) => {
      isDown = true;
      dragDist = 0;
      startX = e.clientX;
      startScroll = scroller.scrollLeft;
      scroller.style.cursor = 'grabbing';
    });
    window.addEventListener('pointermove', (e) => {
      if (!isDown) return;
      dragDist = Math.abs(e.clientX - startX);
      scroller.scrollLeft = startScroll - (e.clientX - startX);
    });
    window.addEventListener('pointerup', () => {
      if (!isDown) return;
      isDown = false;
      scroller.style.cursor = '';
    });

    // Nav buttons
    const prev = document.getElementById('tl-prev');
    const next = document.getElementById('tl-next');
    if (prev) prev.addEventListener('click', () => scroller.scrollBy({ left: -scroller.clientWidth * 0.6, behavior: 'smooth' }));
    if (next) next.addEventListener('click', () => scroller.scrollBy({ left: scroller.clientWidth * 0.6, behavior: 'smooth' }));

    // Keyboard
    scroller.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') scroller.scrollBy({ left: -200, behavior: 'smooth' });
      if (e.key === 'ArrowRight') scroller.scrollBy({ left: 200, behavior: 'smooth' });
    });

    // Auto-select first timeline item on load
    if (points.length > 0) {
      activateItem(points[0]);
    }
  }

  // ───── Tab Switching (Bachelor / Master) ─────
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      // Deactivate all
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));
      // Activate clicked
      btn.classList.add('active');
      const panel = document.getElementById('tab-' + tabId);
      if (panel) panel.classList.add('active');
    });
  });

  // ───── Project Card Flipping ─────
  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    card.addEventListener('click', (ev) => {
      if (ev.target.closest('a')) return;
      card.classList.toggle('is-flipped');
    });
  });

  // ───── Lightbox for images ─────
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');

  document.querySelectorAll('.lightbox-trigger').forEach(img => {
    img.addEventListener('click', () => {
      if (lightbox && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || 'Enlarged view';
        lightbox.classList.add('active');
      }
    });
  });

  function closeLightbox() {
    if (lightbox) lightbox.classList.remove('active');
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // ───── Escape key: close lightbox, unflip cards ─────
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      cards.forEach(c => c.classList.remove('is-flipped'));
      if (details) details.textContent = '';
      const timelineItems = document.querySelectorAll('.timeline-item');
      timelineItems.forEach(i => i.classList.remove('active'));
    }
  });

  // ───── Scroll-triggered animations ─────
  const animateElements = document.querySelectorAll('section, .subject-card, .embed-card, .job-card, .interest-card, .project-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    observer.observe(el);
  });

  // ───── Active nav link highlight ─────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });

  // ───── Timeline details smooth transition ─────
  if (details) {
    details.style.transition = 'opacity 0.3s ease';
  }
});
