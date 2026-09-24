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

  // Nav background on scroll — darken and add border
  if (navEl) {
    var ticking = false;
    function updateNav() {
      var y = window.scrollY || window.pageYOffset || 0;
      if (y > 20) {
        navEl.classList.add('scrolled');
      } else {
        navEl.classList.remove('scrolled');
      }
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateNav);
      }
    }, { passive: true });
    window.addEventListener('resize', updateNav);
    updateNav();
  }

  /* ---- REVEAL (scroll animation) ---- */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });
    var reveals = document.querySelectorAll('.reveal');
    reveals.forEach(function (r) { io.observe(r); });
  } else {
    var revFallback = document.querySelectorAll('.reveal');
    revFallback.forEach(function (r) { r.classList.add('in'); });
  }

  /* ---- OPERATIONS STREAM (hero animation) ---- */
  var opsItems = document.querySelectorAll('.ops-item');
  var streamStarted = false;

  function startOpsStream() {
    if (streamStarted) return;
    streamStarted = true;
    opsItems.forEach(function (item, i) {
      setTimeout(function () {
        item.classList.add('show');
      }, i * 650 + 200);
    });
  }

  // Start when hero is visible
  if ('IntersectionObserver' in window && opsItems.length) {
    var heroObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          startOpsStream();
          heroObs.unobserve(en.target);
        }
      });
    }, { threshold: 0.3 });
    var hero = document.querySelector('.hero');
    if (hero) heroObs.observe(hero);
  } else if (opsItems.length) {
    // Fallback: start after a short delay
    setTimeout(startOpsStream, 800);
  }

  /* ---- ECONOMIC VALUE STRIP (animation) ---- */
  var econCards = document.querySelectorAll('.econ-card');
  var econStarted = false;

  function activateEconCards() {
    if (econStarted) return;
    econStarted = true;
    econCards.forEach(function (card, i) {
      setTimeout(function () {
        card.classList.add('active');
        var val = card.querySelector('.econ-card-value');
        if (val) {
          var text = val.textContent;
          val.textContent = 'Handled';
          val.classList.add('processed');
        }
      }, i * 500 + 1200);
    });
  }

  if ('IntersectionObserver' in window && econCards.length) {
    var econObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          activateEconCards();
          econObs.unobserve(en.target);
        }
      });
    }, { threshold: 0.4 });
    var econStrip = document.querySelector('.econ-strip');
    if (econStrip) econObs.observe(econStrip);
  }

  /* ---- WORKFLOW DEMO ---- */
  var demoRunBtn = document.getElementById('demoRunBtn');
  var demoResetBtn = document.getElementById('demoResetBtn');
  var demoSteps = document.querySelectorAll('.demo-step');
  var demoBody = document.getElementById('demoBody');
  var demoStarted = false;
  var demoTimer = null;

  function resetDemo() {
    if (demoTimer) { clearTimeout(demoTimer); demoTimer = null; }
    demoStarted = false;
    demoSteps.forEach(function (step) {
      step.classList.remove('show', 'completed', 'approval');
    });
  }

  function runDemoStep(stepIndex) {
    if (stepIndex >= demoSteps.length) return;
    var step = demoSteps[stepIndex];
    step.classList.add('show');
    if (stepIndex === demoSteps.length - 1) {
      step.classList.add('approval');
    } else if (stepIndex < demoSteps.length - 1) {
      step.classList.add('completed');
    }
  }

  function runDemo() {
    if (demoTimer) { clearTimeout(demoTimer); }
    if (demoStarted) { resetDemo(); }
    demoStarted = true;
    demoTimer = setTimeout(function stagger() {
      runDemoStep(0);
      demoTimer = setTimeout(function () {
        runDemoStep(1);
        demoTimer = setTimeout(function () {
          runDemoStep(2);
          demoTimer = setTimeout(function () {
            runDemoStep(3);
            demoTimer = setTimeout(function () {
              runDemoStep(4);
            }, 1400);
          }, 1200);
        }, 1000);
      }, 900);
    }, 400);
  }

  if (demoRunBtn) {
    demoRunBtn.addEventListener('click', runDemo);
  }
  if (demoResetBtn) {
    demoResetBtn.addEventListener('click', resetDemo);
  }

  // Start demo automatically when visible
  if ('IntersectionObserver' in window && demoBody) {
    var demoObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && !demoStarted) {
          setTimeout(runDemo, 600);
          demoObs.unobserve(en.target);
        }
      });
    }, { threshold: 0.4 });
    demoObs.observe(demoBody);
  }

  /* ---- WORKS CARDS (click to highlight) ---- */
  var worksCards = document.querySelectorAll('.works-card');
  worksCards.forEach(function (card) {
    card.addEventListener('click', function () {
      worksCards.forEach(function (c) { c.classList.remove('active'); });
      card.classList.add('active');
    });
  });

  /* ---- APPROVAL CARD BUTTONS ---- */
  var approvalBtns = document.querySelectorAll('.approval-actions .btn');
  approvalBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var actions = document.querySelectorAll('.approval-actions .btn');
      actions.forEach(function (b) {
        b.disabled = true;
        b.style.opacity = '0.5';
      });
      btn.textContent = btn.textContent.indexOf('Approve') === 0 ? 'Approved' :
                       btn.textContent.indexOf('Decline') === 0 ? 'Declined' : 'Context shown';
      // Reset after 2s
      setTimeout(function () {
        actions.forEach(function (b) {
          b.disabled = false;
          b.style.opacity = '1';
          if (b.textContent === 'Approved') b.textContent = 'Approve';
          if (b.textContent === 'Declined') b.textContent = 'Decline';
          if (b.textContent === 'Context shown') b.textContent = 'Review context';
        });
      }, 2000);
    });
  });

  /* ---- CALCULATOR ---- */
  

  

    var span = document.getElementById(valueId);
    if (span) span.textContent = input.value;
  }

  function fmtMoney(n) {
    if (!isFinite(n) || n === 0) return '£0';
    return '£' + Math.round(n).toLocaleString('en-GB');
  }

  
      }
    }
  }

  // Bind all inputs
    if (el) {
      el.addEventListener('input', function () {
        var valId = id + '-val';
        var span = document.getElementById(valId);
        if (span) span.textContent = el.value;
      });
    }
  });

  // Example button
  var EXAMPLE_VALUES = {
  };

  function loadExample() {
    Object.keys(EXAMPLE_VALUES).forEach(function (id) {
      if (el) {
        el.value = EXAMPLE_VALUES[id];
        var span = document.getElementById(id + '-val');
        if (span) span.textContent = EXAMPLE_VALUES[id];
      }
    });
  }

  if (exampleBtn) exampleBtn.addEventListener('click', loadExample);
  if (loadExampleLink) loadExampleLink.addEventListener('click', function (e) {
    e.preventDefault();
    loadExample();
  });

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
    // Also record in dataLayer for GTM if present
    if (window.dataLayer) {
      window.dataLayer.push({ event: name, twinthos: data || {} });
    }
  }

  // Hero CTA clicks
  var heroPrimary = document.querySelector('.hero-ctas .btn-primary');
  if (heroPrimary) {
    heroPrimary.addEventListener('click', function () { trackEvent('hero_cta_click', { cta: 'see_what_you_could_save' }); });
  }
  var heroSecondary = document.querySelector('.hero-ctas .btn-secondary');
  if (heroSecondary) {
    heroSecondary.addEventListener('click', function () { trackEvent('hero_cta_click', { cta: 'watch_twins_work' }); });
  }

  // Demo tracking
  var demoRunBtn = document.getElementById('demoRunBtn');
  if (demoRunBtn) {
    demoRunBtn.addEventListener('click', function () {
      trackEvent('demo_started');
      setTimeout(function () { trackEvent('demo_completed'); }, 5200);
    });
  }

  // Calculator tracking
      entries.forEach(function (en) {
        }
      });
    }, { threshold: 0.3 });
  }
    inp.addEventListener('input', function () {
        var allFilled = true;
        if (allFilled) {
        }
      }
    });
  });
  }

  // Pricing viewed
  var pricingSection = document.getElementById('pricing');
  if (pricingSection) {
    var pricingObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          trackEvent('pricing_viewed');
          pricingObserver.unobserve(en.target);
        }
      });
    }, { threshold: 0.3 });
    pricingObserver.observe(pricingSection);
  }

  // Pilot CTA clicked
  var pilotCTA = document.querySelector('.pilot-section .btn-primary');
  if (pilotCTA) {
    pilotCTA.addEventListener('click', function () { trackEvent('pilot_cta_click'); });
  }

  // Security viewed
  var securitySection = document.getElementById('security');
  if (securitySection) {
    var secObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          trackEvent('security_viewed');
          secObserver.unobserve(en.target);
        }
      });
    }, { threshold: 0.3 });
    secObserver.observe(securitySection);
  }

  // Operations audit CTA clicked
  var auditCTA = document.querySelector('#audit-page .btn-primary');
  if (auditCTA) {
    auditCTA.addEventListener('click', function () { trackEvent('operations_audit_cta_click'); });
  }

  // Booking form tracking
  var bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('focusin', function () {
      if (bookingForm.dataset.tracked !== '1') {
        bookingForm.dataset.tracked = '1';
        trackEvent('booking_form_started');
      }
    });
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();
      trackEvent('booking_form_submitted', {
        name: document.getElementById('name') ? document.getElementById('name').value : '',
        company: document.getElementById('company') ? document.getElementById('company').value : ''
      });
      var btn = document.getElementById('bookingSubmit');
      if (btn) {
        btn.textContent = 'Sending...';
        btn.disabled = true;
        setTimeout(function () {
          btn.textContent = 'Booking request sent';
          setTimeout(function () { location.href = '/thank-you/'; }, 1500);
        }, 800);
      }
    });
  }

  /* ---- LEAKAGE COUNTER ---- */
    var s = parseInt(document.getElementById('leak-staff-input').value) || 8;
    var h = parseInt(document.getElementById('leak-hours-input').value) || 4;
    var total = s * h * 4.33;
    var el = document.getElementById('leak-staff');
    var eh = document.getElementById('leak-hours');
    var et = document.getElementById('leak-total');
    if (el) el.textContent = s;
    if (eh) eh.textContent = h;
    if (et) et.textContent = Math.round(total);
  }
  var leakStaffInput = document.getElementById('leak-staff-input');
  var leakHoursInput = document.getElementById('leak-hours-input');

})();// test 1790266651
