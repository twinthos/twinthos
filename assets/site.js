(function () {
  'use strict';

  /* ---- NAV (burger + scroll state) ---- */
  var burger = document.querySelector('.nav-burger');
  var links = document.querySelector('.nav-links');
  var navEl = document.querySelector('.nav');

  if (burger && links) {
    burger.addEventListener('click', function () {
      var expanded = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', !expanded);
      links.classList.toggle('open');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
    burger.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        links.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        burger.focus();
      }
    });
  }

  // Nav background on scroll
  if (navEl) {
    var ticking = false;
    function updateNav() {
      var y = window.scrollY || window.pageYOffset || 0;
      if (y > 20) {
        navEl.style.background = 'rgba(0,0,0,0.96)';
      } else {
        navEl.style.background = 'rgba(0,0,0,0.92)';
      }
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateNav);
      }
    }, { passive: true });
    updateNav();
  }

  /* ---- REDUCED MOTION: skip all animations ---- */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- SCROLL REVEAL — IntersectionObserver ---- */
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -6% 0px' });

    var reveals = document.querySelectorAll('.reveal, .reveal-fast, .flow-step, .diff-point, .acc-row, .step, .offer-item, .cta_row');
    reveals.forEach(function (r) { io.observe(r); });
  }

  /* ---- PARALLAX-LITE: HERO MARK ---- */
  if (!reduceMotion) {
    var heroMark = document.querySelector('.hero-mark');
    if (heroMark) {
      var hLight = heroMark.querySelector('.hero-mark-lit');
      var ticking = false;
      function updateHeroParallax() {
        var y = window.scrollY || window.pageYOffset || 0;
        var progress = Math.min(y / 500, 1);
        // Subtle upward drift: 0 → -10px
        var dy = -progress * 10;
        heroMark.style.transform = 'translateY(' + dy + 'px)';
        // Light opacity: stays in sync
        if (hLight) {
          var opacity = 0.04 + progress * 0.08;
          hLight.style.opacity = opacity;
        }
        ticking = false;
      }
      window.addEventListener('scroll', function () {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(updateHeroParallax);
        }
      }, { passive: true });
      updateHeroParallax();
    }

    /* ---- PARALLAX-LITE: HUMAN ARCHITECT MARK ---- */
    var humanMark = document.querySelector('.human-mark');
    if (humanMark) {
      var huLight = humanMark.querySelector('.human-light');
      var ticking = false;
      function updateHumanParallax() {
        var y = window.scrollY || window.pageYOffset || 0;
        var progress = Math.min(y / 700, 1);
        var dy = -progress * 8;
        humanMark.style.transform = 'translateY(' + dy + 'px)';
        if (huLight) {
          var opacity = 0.03 + progress * 0.06;
          huLight.style.opacity = opacity;
        }
        ticking = false;
      }
      window.addEventListener('scroll', function () {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(updateHumanParallax);
        }
      }, { passive: true });
      updateHumanParallax();
    }
  }

  /* ---- HERO ENTRANCE: re-trigger if needed (CSS handles it) ---- */
  // No JS needed — @keyframes heroEnter/markEnter in CSS handle page-load entrance.

  /* ---- CONVERSION ANALYTICS ---- */
  function trackEvent(name, data) {
    if (!('sendBeacon' in navigator)) return;
    var payload = JSON.stringify({
      event: name,
      ts: new Date().toISOString(),
      path: window.location.pathname,
      ref: document.referrer || '',
      v: 1
    });
    if (data) {
      try { Object.keys(data).forEach(function (k) { payload = payload.replace('"}', ',' + k + ':' + JSON.stringify(data[k]) + '}'); }); } catch(e) {}
    }
    var blob = new Blob([payload], { type: 'application/json' });
    navigator.sendBeacon('/api/track', blob);
    if (window.dataLayer) {
      window.dataLayer.push({ event: name, twinthos: data || {} });
    }
  }

  // Hero CTA clicks
  var heroPrimary = document.querySelector('.hero-cta-row .btn-primary');
  if (heroPrimary) {
    heroPrimary.addEventListener('click', function () { trackEvent('hero_cta_click', { cta: 'assess_operation' }); });
  }

  // Nav CTA click
  var navCTA = document.querySelector('.nav-cta');
  if (navCTA) {
    navCTA.addEventListener('click', function () { trackEvent('nav_cta_click', { cta: 'assess_operation' }); });
  }

  // Mobile CTA click
  var mobileCTA = document.querySelector('.mobile-cta .btn-primary');
  if (mobileCTA) {
    mobileCTA.addEventListener('click', function () { trackEvent('mobile_cta_click', { cta: 'assess_operation' }); });
  }

  // Offer CTA click
  var offerCTA = document.querySelector('.offer-cta-row .btn-primary');
  if (offerCTA) {
    offerCTA.addEventListener('click', function () { trackEvent('offer_cta_click', { cta: 'assess_operation' }); });
  }

  /* ---- NAV LINKS (hash tracking) ---- */
  var navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      var href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        trackEvent('nav_section_click', { section: href.slice(1) });
      }
    });
  });

})();
