/* Twinthos redesign — site.js
   Scroll reveals, nav toggle, booking form (fetch-based, self-posted), demo controls. */

;(function(){
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* ── Nav burger ── */
  var burger = document.getElementById('navBurger');
  var navLinks = document.getElementById('navLinks');
  if (burger && navLinks) {
    burger.addEventListener('click', function(){
      var open = navLinks.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // Close on link click (mobile)
    navLinks.querySelectorAll('a').forEach(function(link){
      link.addEventListener('click', function(){
        navLinks.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
    // Close on outside click
    document.addEventListener('click', function(e){
      if (!navLinks.contains(e.target) && !burger.contains(e.target)) {
        navLinks.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── Scroll reveals (IntersectionObserver) ── */
  if (!prefersReduced) {
    var reveals = document.querySelectorAll('.reveal');
    if (reveals.length) {
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      }, {threshold: 0.12, rootMargin: '0px 0px -30px 0px'});
      reveals.forEach(function(el){
        io.observe(el);
      });
    }
    // Add the CSS for the transition
    var style = document.createElement('style');
    style.textContent = '.reveal{opacity:0;transform:translateY(12px);transition:opacity .6s cubic-bezier(.22,1,.36,1),transform .6s cubic-bezier(.22,1,.36,1)}.reveal.in{opacity:1;transform:none}';
    document.head.appendChild(style);
  } else {
    document.querySelectorAll('.reveal').forEach(function(el){
      el.classList.add('in');
    });
  }

  /* ── Hero fade-in on load ── */
  var hero = document.querySelector('.hero');
  if (hero && !prefersReduced) {
    hero.style.opacity = '0';
    hero.style.transform = 'translateY(8px)';
    hero.style.transition = 'opacity .8s cubic-bezier(.22,1,.36,1), transform .8s cubic-bezier(.22,1,.36,1)';
    window.addEventListener('load', function(){
      requestAnimationFrame(function(){
        hero.style.opacity = '1';
        hero.style.transform = 'none';
      });
    });
  }

  /* ── Smooth scroll for same-page anchors (no JS polyfill needed, CSS handles it) ── */

  /* ── Booking form (fetch) ── */
  var bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', function(e){
      e.preventDefault();
      var submitBtn = bookingForm.querySelector('.btn-primary[type="submit"]');
      var originalText = submitBtn ? submitBtn.textContent : 'Send request';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      var data = new FormData(bookingForm);
      var payload = {};
      data.forEach(function(val, key){
        payload[key] = val;
      });

      fetch('/api/assess', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      })
      .then(function(res){
        if (!res.ok) throw new Error('Server error');
        return res.json();
      })
      .then(function(){
        // Hide form, show confirmation
        var formBlock = bookingForm.closest('.form-block');
        if (formBlock) {
          formBlock.innerHTML =
            '<div class="form-confirmation">' +
              '<div class="check">&#10003;</div>' +
              '<h2>Request received</h2>' +
              '<p>We will review your details and follow up within two working days to confirm whether the first workflow is a fit.</p>' +
              '<p style="margin-top:16px;font-family:var(--mono);font-size:13px;color:var(--dk)">hello@twinthos.com</p>' +
            '</div>';
          formBlock.querySelectorAll('.form-confirmation').forEach(function(el){ /* already inside */ });
        }
      })
      .catch(function(err){
        console.error('Booking submission error:', err);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Try again';
        }
        var note = document.getElementById('formError');
        if (note) note.textContent = 'Something went wrong. Please email hello@twinthos.com directly.';
      });
    });
  }

  /* ── Demo play/reset ── */
  var demoRun = document.getElementById('demoRun');
  var demoReset = document.getElementById('demoReset');
  var demoFrame = document.getElementById('demoFrame');
  var demoStatus = document.getElementById('demoStatus');
  var demoSteps = document.getElementById('demoSteps');
  var demoMsg = document.getElementById('demoMsg');
  var demoOut = document.getElementById('demoOut');
  var demoDone = document.getElementById('demoDone');
  var demoExc = document.getElementById('demoExc');
  var demoExcDetail = document.getElementById('demoExcDetail');
  var demoReviewBtn = document.getElementById('excReview');

  if (demoRun && demoFrame) {
    var demoStepsList = [
      {msg: 'New enquiry email: "Can we view the Albert Road unit this week?"', step:'01 – Incoming'},
      {msg: 'Checks availability, finds Thursday 6pm and Saturday 10am open.', step:'02 – Agent action'},
      {msg: 'Books the Thursday slot. Sends confirmation. Updates the customer record. Notifies the team.', step:'03 – Complete'},
      {msg: 'A discount outside policy is requested. Agent pauses. Awaiting your decision.', step:'04 – Approval'}
    ];

    var currentStep = -1;
    var timer = null;

    function resetDemo(){
      if (timer) { clearTimeout(timer); timer = null; }
      currentStep = -1;
      if (demoFrame) demoFrame.innerHTML = '<div class="demo-idle"><p>Press run to watch an enquiry move from incoming message to booked viewing, with the out-of-policy moment handed back to a person. This is an illustrative workflow using sample data — no live business actions are performed.</p></div>';
      if (demoStatus) demoStatus.textContent = '';
      if (demoSteps) {
        demoSteps.querySelectorAll('li').forEach(function(li){
          li.classList.remove('done');
        });
      }
      if (demoExcDetail) demoExcDetail.hidden = true;
      if (demoReviewBtn) demoReviewBtn.disabled = false;
    }

    function showStep(index){
      if (index >= demoStepsList.length) {
        if (demoStatus) demoStatus.textContent = 'Workflow complete.';
        return;
      }
      var item = demoStepsList[index];
      currentStep = index;

      // Update frame content
      if (demoFrame) {
        var stepNum = (index + 1);
        var excuseMode = (index === 3);
        var html = '<div class="demo-step-label">' + stepNum + ' – ' + item.step + '</div>';
        html += '<p>' + item.msg + '</p>';
        if (excuseMode) {
          html += '<div class="demo-exc-detail" id="demoExcDetail">' +
            '<p class="mono label" style="font-size:13px;letter-spacing:.1em;text-transform:uppercase;color:var(--dk);margin-bottom:12px">Request</p>' +
            '<p>A 15% early-payment discount on invoice #INV-2026-042, below the 20% approval rule.</p>' +
            '<p class="mono label" style="font-size:13px;letter-spacing:.1em;text-transform:uppercase;color:var(--dk);margin:16px 0 12px">Rule requiring approval</p>' +
            '<p>Discounts below 20% must be approved by a manager.</p>' +
            '<p class="mono label" style="font-size:13px;letter-spacing:.1em;text-transform:uppercase;color:var(--dk);margin:16px 0 12px">Current status</p>' +
            '<p>Paused. No discount has been applied. Customer notified.</p>' +
            '</div>' +
            '<button class="btn btn-ghost btn-sm" id="excReview" style="margin-top:16px">Review request</button>';
        }
        demoFrame.innerHTML = html;
      }

      if (demoStatus) demoStatus.textContent = 'Step ' + (index + 1) + ' of ' + demoStepsList.length;

      // Mark step as done
      if (demoSteps) {
        var lis = demoSteps.querySelectorAll('li');
        if (lis[index]) lis[index].classList.add('done');
      }

      // Excuse review button
      if (demoReviewBtn && index === 3) {
        demoReviewBtn.addEventListener('click', function(){
          if (demoStatus) demoStatus.textContent = 'Request under review. No action taken.';
          demoReviewBtn.disabled = true;
        }, {once:true});
      }

      // Advance
      timer = setTimeout(function(){
        showStep(index + 1);
      }, 1800);
    }

    demoRun.addEventListener('click', function(){
      resetDemo();
      setTimeout(function(){ showStep(0); }, 300);
    });

    if (demoReset) {
      demoReset.addEventListener('click', resetDemo);
    }
  }

  /* ── Mobile nav scroll lock ── */
  if (navLinks) {
    navLinks.addEventListener('transitionend', function(){
      // no-op
    });
  }

})();
