/**
 * TWINTHOS — Mirofish-grade motion and interaction
 *
 * Every animation has a purpose:
 *  - Guides attention to what matters
 *  - Teaches the user about the system
 *  - Never decorative, never accidental
 *
 * Under 4KB. Respects reduced-motion.
 */

(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── DOM helpers ── */
  const el = (sel, ctx = document) => ctx.querySelector(sel);
  const els = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ── Navigation: scroll-aware background (smooth, not jarring) ── */
  function initNav() {
    const nav = el('.nav');
    if (!nav) return;

    let ticking = false;
    function update() {
      const y = window.scrollY;
      if (y > 32) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });

    update();
  }

  /* ── Hero: stagger word-by-word reveal on load ── */
  function initHeroReveal() {
    if (reduceMotion) {
      const s = el('.hero-statement');
      if (s) { s.style.opacity = '1'; s.style.transform = 'none'; }
      return;
    }

    const statement = el('.hero-statement');
    if (!statement) return;

    // Already has .line1 and .line2 spans — animate their entrance
    const lines = els('.hero-statement .line1, .hero-statement .line2');
    if (!lines.length) return;

    lines.forEach(function (line, i) {
      line.style.opacity = '0';
      line.style.transform = 'translateY(16px)';
      line.style.transition =
        'opacity 400ms cubic-bezier(0.16,1,0.3,1), ' +
        'transform 400ms cubic-bezier(0.16,1,0.3,1)';
      line.style.transitionDelay = (i * 120) + 'ms';

      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          line.style.opacity = '1';
          line.style.transform = 'translateY(0)';
        });
      });
    });
  }

  /* ── Scroll-reveal: stagger cascade ── */
  function initScrollReveal() {
    if (reduceMotion) {
      els('.reveal, .reveal-fast, [data-stagger-child]')
        .forEach(function (n) { n.classList.add('in'); });
      return;
    }

    const items = els(
      '.reveal, .reveal-fast, [data-stagger-child], ' +
      '.pipe-step, .enemy-card, .redacted-item, ' +
      '.difference-col, .offer-list-item'
    );

    if (!items.length) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const node = entry.target;

        // Determine delay: data-reveal-delay takes precedence,
        // then index-based stagger for sibling groups
        let delay = 0;
        const parent = node.parentNode;
        const siblings = parent ? Array.from(parent.children) : [];
        const idx = siblings.indexOf(node);
        const staggerChild = parseInt(node.getAttribute('data-stagger-child'), 10);
        const revealDelay = parseInt(node.getAttribute('data-reveal-delay'), 10);

        if (!isNaN(revealDelay) && revealDelay > 0) {
          delay = revealDelay;
        } else if (!isNaN(staggerChild) && staggerChild >= 0) {
          delay = staggerChild * 60;
        } else if (idx >= 0) {
          // Group-based stagger: check if siblings share a reveal class
          const revealSiblings = siblings.filter(function (s) {
            return s.classList.contains('reveal') ||
                   s.classList.contains('reveal-fast') ||
                   s.classList.contains('pipe-step') ||
                   s.classList.contains('enemy-card') ||
                   s.classList.contains('redacted-item') ||
                   s.classList.contains('difference-col');
          });
          if (revealSiblings.length > 1) {
            delay = idx * 80;
          } else {
            delay = idx * 120;
          }
        }

        node.style.transitionDelay = delay + 'ms';
        node.classList.add('in');
        observer.unobserve(node);
      });
    }, {
      threshold: 0.10,
      rootMargin: '0px 0px -30px 0px'
    });

    items.forEach(function (node) { observer.observe(node); });
  }

  /* ── Proof pipe: animate the particle ── */
  function initPipeParticle() {
    if (reduceMotion) return;

    const conduit = el('.pipe-conduit');
    if (!conduit) return;

    // The CSS animation handles the loop — this ensures it starts
    // only when the section is visible
    const stream = el('.proof-pipe');
    if (!stream) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const particle = el('.pipe-particle', conduit);
          if (particle) particle.style.animationPlayState = 'running';
          observer.unobserve(stream);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(stream);
  }

  /* ── Enemy cards: 3D tilt on hover (subtle, purposeful) ── */
  function initCardTilt() {
    if (reduceMotion) return;

    const cards = els('.enemy-card');
    if (!cards.length) return;

    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const rotateY = x * 4;
        const rotateX = y * -3;

        card.style.transform =
          'perspective(600px) rotateX(' + rotateX + 'deg) ' +
          'rotateY(' + rotateY + 'deg) translateY(-3px)';
        card.style.boxShadow = '0 16px 40px rgba(0,0,0,0.5)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
        card.style.boxShadow = '';
      });
    });
  }

  /* ── CTA press feedback ── */
  function initCTAFeedback() {
    if (reduceMotion) return;

    const buttons = els('.btn--primary, .nav-cta');
    buttons.forEach(function (btn) {
      btn.addEventListener('pointerdown', function () {
        btn.style.transform = 'scale(0.97)';
      });
      btn.addEventListener('pointerup', function () {
        btn.style.transform = '';
      });
      btn.addEventListener('pointerleave', function () {
        btn.style.transform = '';
      });
    });
  }

  /* ── Smooth scroll for hash links ── */
  function initSmoothScroll() {
    els('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;

        e.preventDefault();
        const offset = 80; // nav height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;

        window.history.pushState(null, '', link.getAttribute('href'));

        window.scrollTo({
          top: top,
          behavior: reduceMotion ? 'auto' : 'smooth'
        });
      });
    });
  }

  /* ── Initialise ── */
  function init() {
    initNav();
    initHeroReveal();
    initScrollReveal();
    initPipeParticle();
    initCardTilt();
    initCTAFeedback();
    initSmoothScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
