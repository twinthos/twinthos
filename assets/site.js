/* ═════════════════════════════════════════════════════════════════
   TWINTHOS — SCROLL REVEAL + HERO VISUAL + CALCULATOR
   Reveal on scroll: sections fade in as they enter viewport.
   Hero visual: systems fade out, Twinthos line appears.
   Calculator: compute monthly hours, cost, automatable portion.
   ═════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── SCROLL REVEAL ── */
  var reveals = document.querySelectorAll('.reveal, .reveal--fast, .reveal--left, .reveal--right, .reveal--scale');
  if (reveals.length) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var delay = el.getAttribute('data-delay');
          if (delay) {
            setTimeout(function () { el.classList.add('is-in'); }, parseInt(delay, 10));
          } else {
            el.classList.add('is-in');
          }
          revealObserver.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (r) { revealObserver.observe(r); });
  }

  /* ── HERO VISUAL ── */
  var heroSystems = document.querySelectorAll('#heroSystems .hero__sys-row');
  var heroLine = document.getElementById('heroLine');
  if (heroSystems.length && heroLine) {
    var heroVisualObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          heroSystems.forEach(function (row, i) {
            setTimeout(function () { row.classList.add('is-removed'); }, i * 180);
          });
          setTimeout(function () { heroLine.classList.add('is-visible'); }, heroSystems.length * 180 + 100);
          heroVisualObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    heroVisualObserver.observe(document.getElementById('heroSystems'));
  }

  /* ── WORKFLOW HUMAN TASKS ── */
  var workflowSection = document.getElementById('show-work');
  var humanTasks = document.querySelectorAll('#humanTasks .human-task');
  if (workflowSection && humanTasks.length) {
    var workflowObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          humanTasks.forEach(function (task, i) {
            setTimeout(function () { task.classList.add('is-removed'); }, i * 120);
          });
          workflowObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    workflowObserver.observe(workflowSection);
  }

  /* ── NAV SCROLL ── */
  var nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      if (window.pageYOffset > 20) {
        nav.classList.add('nav--scrolled');
      } else {
        nav.classList.remove('nav--scrolled');
      }
    }, { passive: true });
  }

  /* ── MOBILE NAV TOGGLE ── */
  var navToggle = document.getElementById('navToggle');
  var navMobile = document.getElementById('navMobile');
  if (navToggle && navMobile) {
    navToggle.addEventListener('click', function () {
      var expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navMobile.classList.toggle('nav__mobile--open');
      document.body.style.overflow = !expanded ? 'hidden' : '';
    });
    document.querySelectorAll('.nav__mobile-link, .nav__mobile [role="menuitem"]').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.setAttribute('aria-expanded', 'false');
        navMobile.classList.remove('nav__mobile--open');
        document.body.style.overflow = '';
      });
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) {
        navToggle.setAttribute('aria-expanded', 'false');
        navMobile.classList.remove('nav__mobile--open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── CALCULATOR ── */
  var calcRuns = document.getElementById('calcRuns');
  var calcMinutes = document.getElementById('calcMinutes');
  var calcPeople = document.getElementById('calcPeople');
  var calcRate = document.getElementById('calcRate');
  var calcHours = document.getElementById('calcHours');
  var calcCost = document.getElementById('calcCost');
  var calcAuto = document.getElementById('calcAuto');

  function isNumeric(v) {
    return v !== '' && !isNaN(parseFloat(v)) && isFinite(v);
  }

  function formatGBP(n) {
    return '\u00A3' + Math.round(n).toLocaleString('en-GB');
  }

  function calculate() {
    var runs = isNumeric(calcRuns.value) ? parseFloat(calcRuns.value) : 0;
    var minutes = isNumeric(calcMinutes.value) ? parseFloat(calcMinutes.value) : 0;
    var people = isNumeric(calcPeople.value) ? parseFloat(calcPeople.value) : 0;
    var rate = isNumeric(calcRate.value) ? parseFloat(calcRate.value) : 0;

    var monthlyHours = (runs * minutes * 52 / 12 / 60) * people;
    var monthlyCost = monthlyHours * rate;
    var automatableCost = monthlyCost * 0.70;

    if (calcHours) calcHours.textContent = monthlyHours.toFixed(1);
    if (calcCost) calcCost.textContent = formatGBP(monthlyCost);
    if (calcAuto) calcAuto.textContent = formatGBP(automatableCost);
  }

  if (calcRuns && calcMinutes && calcPeople && calcRate && calcHours && calcCost && calcAuto) {
    [calcRuns, calcMinutes, calcPeople, calcRate].forEach(function (el) {
      el.addEventListener('input', calculate);
    });
    calculate();
  }

  /* ── SMOOTH SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = link.getAttribute('href');
      if (targetId.length <= 1) return;
      var target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      var navHeight = 72;
      var targetY = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 24;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  });

})();
