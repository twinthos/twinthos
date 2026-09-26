/* TWINTHOS motion — purposeful only.
   1. Hero word reveal (on load, 55ms stagger)
   2. Scroll cascade via IO (.reveal/.reveal-fast, data-delay)
   3. Proof steps cascade (same IO — .pipe-step has .reveal+data-delay)
   4. Section headings transition on entry (same IO — headings have .reveal)
   5. CTA press (scale 0.97 on pointerdown)
   6. prefers-reduced-motion: all off, everything visible.
   Targets:
     .hero-headline .word       → #1
     .reveal, .reveal-fast      → #2+#4 (all reveal elements)
     .pipe-step                  → #3 (via .reveal+data-delay)
     section h1/h2/h3 .reveal   → #4 (via .reveal)
     .hero-cta, .offer-cta,
     .final-cta-btn, .nav-cta   → #5
*/

(function () {
  var rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var q = function (s, c) { return (c || document).querySelector(s); };
  var qa = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* 01 — hero word reveal, on load */
  (function () {
    if (rm) { qa('.hero-headline .word').forEach(function (w) {
      w.style.opacity = '1'; w.style.transform = 'translateY(0)';
    }); return; }
    var h = q('.hero-headline'); if (!h) return;
    qa('.word', h).forEach(function (w, i) {
      w.style.transitionDelay = (i * 55) + 'ms';
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { w.classList.add('in'); });
      });
    });
  })();

  /* 02+03+04 — scroll cascade via IntersectionObserver */
  if (!rm) {
    var nodes = qa('.reveal, .reveal-fast');
    if (nodes.length) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          var n = e.target;
          var d = parseInt(n.getAttribute('data-delay'), 10) || 0;
          n.style.transitionDelay = d + 'ms';
          n.classList.add('in');
          io.unobserve(n);
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });
      nodes.forEach(function (n) { io.observe(n); });
    }
  } else {
    qa('.reveal, .reveal-fast').forEach(function (n) { n.classList.add('in'); });
  }

  /* 05 — CTA tactile press */
  if (!rm) {
    qa('.hero-cta, .offer-cta, .final-cta-btn, .nav-cta').forEach(function (b) {
      b.addEventListener('pointerdown', function () { b.style.transform = 'scale(0.97)'; });
      b.addEventListener('pointerup', function () { b.style.transform = ''; });
      b.addEventListener('pointerleave', function () { b.style.transform = ''; });
    });
  }

  /* nav scroll state */
  (function () {
    var nav = q('.nav'); if (!nav) return;
    var ticking = false;
    function u() {
      var y = window.scrollY;
      nav.classList.toggle('scrolled', y > 20);
      nav.style.background = y > 20 ? 'rgba(0,0,0,0.96)' : 'rgba(0,0,0,0.7)';
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(u); }
    }, { passive: true });
    u();
  })();

  /* smooth scroll for anchor links */
  qa('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href').slice(1); if (!id) return;
      var t = document.getElementById(id); if (!t) return;
      e.preventDefault();
      window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 80,
        behavior: rm ? 'auto' : 'smooth' });
    });
  });

  /* mobile burger */
  (function () {
    var b = q('#navBurger'), ln = q('#navLinks');
    if (!b || !ln) return;
    b.addEventListener('click', function () {
      var o = b.getAttribute('aria-expanded') === 'true';
      b.setAttribute('aria-expanded', o ? 'false' : 'true');
      ln.style.display = o ? 'none' : 'flex';
      ln.style.flexDirection = 'column';
      ln.style.position = 'absolute';
      ln.style.top = '56px';
      ln.style.right = 'var(--space-4)';
      ln.style.background = 'rgba(0,0,0,0.96)';
      ln.style.padding = 'var(--space-5)';
      ln.style.gap = 'var(--space-4)';
      ln.style.border = '1px solid var(--border-strong)';
    });
    ln.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        ln.style.display = 'none';
        b.setAttribute('aria-expanded', 'false');
      }
    });
  })();
})();
