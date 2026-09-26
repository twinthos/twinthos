/* ═════════════════════════════════════════════════════════════════
   TWINTHOS — 2027 SCROLL REVEAL + NAV + WORK DISAPPEAR
   Reveal on scroll: sections fade in as they enter viewport.
   Nav: scroll-aware border + mobile toggle.
   Work disappear: system actions mute as user scrolls past hero.
   ═════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Token helpers ── */
  var qs = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var qsa = function (sel, ctx) { return (ctx || document).querySelectorAll(sel); };

  /* ── Scroll reveal ── */
  var revealEls = qsa('.reveal, .reveal--left, .reveal--right, .reveal--scale, .reveal--fast');
  if (revealEls.length) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var delay = el.getAttribute('data-delay');
          if (delay) {
            el.style.transitionDelay = delay + 'ms';
          }
          el.classList.add('is-in');
          revealObserver.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ── Nav: scroll-aware hairline ── */
  var nav = qs('#nav');
  var navInner = nav ? qs('.nav__inner', nav) : null;
  var scrolled = false;
  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      var y = window.scrollY || window.pageYOffset || 0;
      scrolled = y > 40;
      if (navInner) {
        navInner.style.borderBottom = scrolled
          ? '1px solid rgba(255,255,255,0.08)'
          : '1px solid transparent';
      }
      ticking = false;
    });
  }

  if (navInner) {
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile nav toggle ── */
  var toggle = qs('#navToggle');
  var mobileMenu = qs('#navMobile');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      mobileMenu.style.display = open ? 'none' : 'flex';
      if (!open) {
        mobileMenu.querySelectorAll('a').forEach(function (link) {
          link.addEventListener('click', function () {
            toggle.setAttribute('aria-expanded', 'false');
            mobileMenu.style.display = 'none';
          });
        });
      }
    });
    mobileMenu.style.display = 'none';
  }

  /* ── Smooth scroll for in-page anchors ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = link.getAttribute('href');
      if (href.length < 2) return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      var y = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: y, behavior: 'smooth' });
      history.replaceState(null, '', href);
    });
  });

  /* ── Work disappear: system actions mute on scroll ── */
  var heroActions = qsa('.systems-list__action');
  var heroComplete = false;

  function fadeActions() {
    if (heroComplete) return;
    var hero = qs('.section--hero');
    if (!hero) return;
    var rect = hero.getBoundingClientRect();
    if (rect.bottom < 120) {
      heroComplete = true;
      heroActions.forEach(function (el, i) {
        var delay = i * 60;
        (function (el, delay) {
          setTimeout(function () {
            el.classList.add('systems-list__action--muted');
          }, delay);
        })(el, delay);
      });
    }
  }

  if (heroActions.length) {
    window.addEventListener('scroll', fadeActions, { passive: true });
    fadeActions();
  }

  /* ── Process axis: active step on scroll ── */
  var processSteps = qsa('.process-step');
  var processActive = false;

  function updateProcessAxis() {
    if (processActive) return;
    var axis = qs('.process-axis');
    if (!axis || processSteps.length === 0) return;
    var rect = axis.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      processActive = true;
      var count = processSteps.length;
      processSteps.forEach(function (step, i) {
        var delay = i * 120;
        (function (step, delay) {
          setTimeout(function () {
            step.classList.add('process-step--complete');
          }, delay);
        })(step, delay);
      });
    }
  }

  if (processSteps.length) {
    window.addEventListener('scroll', updateProcessAxis, { passive: true });
    updateProcessAxis();
  }

  /* ── Process steps block (how it works): active stage ── */
  var stepBlocks = qsa('.process-step-block');
  var stepsActive = false;

  function updateStepBlocks() {
    if (stepsActive) return;
    var section = qs('#how');
    if (!section || stepBlocks.length === 0) return;
    var rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight - 200) {
      stepsActive = true;
      stepBlocks.forEach(function (block, i) {
        var delay = i * 200;
        (function (block, delay) {
          setTimeout(function () {
            block.classList.add('process-step-block--active');
          }, delay);
        })(block, delay);
      });
    }
  }

  if (stepBlocks.length) {
    window.addEventListener('scroll', updateStepBlocks, { passive: true });
    updateStepBlocks();
  }

  /* ── Vertical axis (hero): pulse the dot on first view ── */
  var heroAxis = qs('.systems-axis');
  var heroAxisViewed = false;

  function pulseAxis() {
    if (heroAxisViewed) return;
    var hero = qs('.section--hero');
    if (!hero) return;
    var rect = hero.getBoundingClientRect();
    if (rect.bottom > 100) {
      heroAxisViewed = true;
      if (heroAxis) {
        heroAxis.style.opacity = '1';
        heroAxis.style.transform = 'scaleY(1)';
      }
    }
  }

  if (heroAxis) {
    heroAxis.style.opacity = '0.3';
    heroAxis.style.transform = 'scaleY(0.6)';
    heroAxis.style.transformOrigin = 'top';
    heroAxis.style.transition = 'opacity 800ms ease-out, transform 800ms ease-out';
    window.addEventListener('scroll', pulseAxis, { passive: true });
    pulseAxis();
  }
})();
