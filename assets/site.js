// Twinthos v33 – interactions
// Fixes: calculator (example population, correct math, optional revenue,
// validation, currency formatting), demo (timer cleanup, ordered states,
// meaningful approval branch), telemetry (static, labelled), nav (aria states).
(function () {
  'use strict';

  /* ---- NAV (burger accessibility) ---- */
  var burger = document.querySelector('.nav-burger');
  var links = document.querySelector('.nav-links');
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
    // Close on Escape
    burger.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        links.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        burger.focus();
      }
    });
  }

  /* ---- REVEAL (visible by default without JS) ---- */
  // Content is visible by default. Reveal only adds subtle transitions
  // when JS + IntersectionObserver are available.
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    var reveals = document.querySelectorAll('.reveal');
    reveals.forEach(function (r) { io.observe(r); });
  } else {
    var revFallback = document.querySelectorAll('.reveal');
    revFallback.forEach(function (r) { r.classList.add('in'); });
  }

  /* ---- WORKFLOWS (tab pattern with arrow keys + roving tabindex) ---- */
  var wfBtns = document.querySelectorAll('.wf-btn');
  var wfPanel = document.getElementById('wfPanel');
  function setWF(k) {
    if (!WF[k]) return;
    var d = WF[k];
    document.getElementById('wfInput').textContent = d.i;
    document.getElementById('wfOutput').textContent = d.o;
    document.getElementById('wfSys').textContent = d.s;
    document.getElementById('wfBound').textContent = d.b;
    wfBtns.forEach(function (b, i) {
      var sel = (i === k);
      b.classList.toggle('active', sel);
      b.setAttribute('aria-selected', sel);
      b.setAttribute('tabindex', sel ? '0' : '-1');
    });
    if (wfPanel) { wfPanel.setAttribute('aria-labelledby', 'wftab' + k); wfPanel.classList.remove('in'); void wfPanel.offsetWidth; wfPanel.classList.add('in'); }
    // Focus the active tab
    if (wfPanel) wfBtns[k].focus();
  }
  var WF = [
    { i: "A new enquiry arrives by email: \u201cCan we view the Albert Road unit this week?\u201d",
      o: "Viewing booked and confirmed with the customer. Calendar updated, customer record updated, site team notified. No follow-up needed.",
      s: "Email \u00b7 Calendar \u00b7 Customer record (CRM)",
      b: "Unusual requests, unapproved pricing and commitments outside your rules." },
    { i: "A promised callback has not happened within the agreed window.",
      o: "Follow-up sent and owner notified. Next step scheduled and logged. Escalated if still unresolved.",
      s: "Email \u00b7 Messaging \u00b7 Task list",
      b: "Sensitive relationship issues and anything needing your judgement." },
    { i: "A customer invoice is issued and the payment window is closing.",
      o: "Reminder sent on schedule. Receipt recorded and matched once paid. No duplicate messages.",
      s: "Invoicing \u00b7 Payment status \u00b7 Email",
      b: "Disputed amounts, refunds and changes to payment terms." },
    { i: "A booked job is complete and the customer is ready for the next stage.",
      o: "Completion confirmed, record updated and the next appropriate step prepared. Paused for your approval where required.",
      s: "Job records \u00b7 Customer record \u00b7 Messaging",
      b: "Scope changes, pricing decisions and anything outside the agreed workflow." }
  ];
  function keyNav(k, max) {
    var idx = parseInt(k.target.dataset.wf, 10);
    var next = idx;
    switch (k.key) {
      case 'ArrowRight': case 'ArrowUp': next = (idx + 1) % max; break;
      case 'ArrowLeft': case 'ArrowDown': next = (idx - 1 + max) % max; break;
      case 'Home': next = 0; break;
      case 'End': next = max - 1; break;
      default: return;
    }
    k.preventDefault();
    setWF(next);
  }
  wfBtns.forEach(function (b) {
    b.addEventListener('click', function () { setWF(parseInt(b.dataset.wf, 10)); });
    b.addEventListener('keydown', function (k) { keyNav(k, wfBtns.length); });
  });

  /* ---- EXCEPTION CARD ---- */
  var excKeep = document.getElementById('excKeep');
  var excNote = document.getElementById('excNote');
  if (excKeep) excKeep.addEventListener('click', function () { if (excNote) excNote.hidden = false; });

  /* ---- CALCULATOR ---- */
  var calc = {
    hours: document.getElementById('c_hours'), handover: document.getElementById('c_handover'),
    review: document.getElementById('c_review'), rate: document.getElementById('c_rate'),
    cash: document.getElementById('c_cash'), opp: document.getElementById('c_opp'),
    conv: document.getElementById('c_conv'), gp: document.getElementById('c_gp'),
    extra: document.getElementById('c_extra')
  };
  var out = {
    empty: document.getElementById('calcEmpty'), box: document.getElementById('calcOut'),
    hours: document.getElementById('r_hours'), capval: document.getElementById('r_capval'),
    cash: document.getElementById('r_cash'), gp: document.getElementById('r_gp'), gp_note: document.getElementById('r_gp_note'),
    net: document.getElementById('r_net'), net_note: document.getElementById('r_net_note'),
    netRow: document.getElementById('r_net_row'), neg: document.getElementById('calcNeg')
  };
  // Validation rules for each field
  var rules = {
    c_hours: { min: 0, max: 200, label: 'Hours/week', err: 'Enter a value between 0 and 200.', id: 'c_hours' },
    c_handover: { min: 0, max: 100, label: 'Handover %', err: 'Enter a percentage between 0 and 100.', id: 'c_handover' },
    c_review: { min: 0, max: 100, label: 'Review hrs/week', err: 'Review time cannot exceed 100 hours per week.', id: 'c_review' },
    c_rate: { min: 0, max: 500, label: 'Hourly cost', err: 'Enter a value between 0 and 500.', id: 'c_rate' },
    c_cash: { min: 0, max: 100000, label: 'Monthly cash savings', err: 'Enter a value up to 100,000.', id: 'c_cash' },
    c_opp: { min: 0, max: 100000, label: 'Opportunities', err: 'Enter a value up to 100,000.', id: 'c_opp' },
    c_conv: { min: 0, max: 50, label: 'Conversion uplift', err: 'Enter up to 50 percentage points.', id: 'c_conv' },
    c_gp: { min: 0, max: 100000, label: 'Gross profit per customer', err: 'Enter a value up to 100,000.', id: 'c_gp' },
    c_extra: { min: 0, max: 100000, label: 'Extra operating costs', err: 'Enter a value up to 100,000.', id: 'c_extra' }
  };

  function num(v) {
    if (v === null || v === undefined || v === '') return null;
    var n = parseFloat(v);
    return isFinite(n) && n >= 0 ? n : null;
  }

  function fmtMoney(n) {
    if (!isFinite(n)) return '\u2013';
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
  }

  function fmtNeg(n) {
    // Format negatives as -£1,700, not £-1,700
    if (!isFinite(n)) return '\u2013';
    if (n < 0) return '-\u00a3' + Math.abs(Math.round(n)).toLocaleString('en-GB');
    return '\u00a3' + Math.round(n).toLocaleString('en-GB');
  }

  function setError(id, message) {
    var field = calc[id];
    if (!field) return;
    var container = field.parentNode;
    var existing = container.querySelector('.field-error');
    if (existing) existing.remove();
    if (message) {
      field.setAttribute('aria-invalid', 'true');
      var err = document.createElement('span');
      err.className = 'field-error';
      err.id = id + '_error';
      err.textContent = message;
      field.setAttribute('aria-describedby', id + '_error');
      container.appendChild(err);
    } else {
      field.removeAttribute('aria-invalid');
      field.removeAttribute('aria-describedby');
    }
  }

  function validateField(id) {
    var r = rules[id];
    var field = calc[id];
    if (!field || !r) return true;
    var val = num(field.value);
    if (val === null) return true; // empty = treated as zero for optional fields, skip for required
    if (val < r.min || val > r.max) {
      setError(id, r.err);
      return false;
    }
    // Special: handover must be 0-100
    if (id === 'c_handover' && (val < 0 || val > 100)) {
      setError(id, r.err);
      return false;
    }
    setError(id, null);
    return true;
  }

  function recalc() {
    // Validate all fields; if any invalid, show errors and skip calculation
    var allValid = true;
    Object.keys(calc).forEach(function (k) {
      if (!validateField(k)) allValid = false;
    });
    if (!allValid) {
      if (out.empty) out.empty.hidden = false;
      if (out.box) out.box.hidden = true;
      return;
    }

    var h = num(calc.hours && calc.hours.value), hd = num(calc.handover && calc.handover.value),
        rv = num(calc.review && calc.review.value), rt = num(calc.rate && calc.rate.value),
        cs = num(calc.cash && calc.cash.value), op = num(calc.opp && calc.opp.value),
        cv = num(calc.conv && calc.conv.value), gp = num(calc.gp && calc.gp.value),
        ex = num(calc.extra && calc.extra.value);

    // Time recovered and cash savings are required
    if (h === null || hd === null || rv === null) {
      if (out.empty) out.empty.hidden = false; if (out.box) out.box.hidden = true; return;
    }

    // Revenue fields are optional — treat as 0 if omitted
    var rtVal = (rt !== null) ? rt : 0;
    var csVal = (cs !== null) ? cs : 0;
    var opVal = (op !== null) ? op : 0;
    var cvVal = (cv !== null) ? cv : 0;
    var gpVal = (gp !== null) ? gp : 0;
    var exVal = (ex !== null) ? ex : 0;

    if (out.empty) out.empty.hidden = true; if (out.box) out.box.hidden = false;

    // Correct calculation per audit spec:
    // netWeeklyHours = weeklyHours * (handoverPercentage / 100) - weeklyReviewHours
    // netMonthlyHours = netWeeklyHours * 4.33
    var netWeeklyHours = h * (hd / 100) - rv;
    var recovered = netWeeklyHours * 4.33;

    // If review exceeds time handed over, explain
    var reviewExceeds = netWeeklyHours < 0;

    var capValue = Math.max(0, recovered) * rtVal;
    var gpValue = opVal * (cvVal / 100) * gpVal;
    var net = csVal + gpValue - 5000 - exVal;

    // Display recovered capacity
    if (out.hours) {
      out.hours.textContent = recovered.toFixed(1) + ' h/mo';
    }
    if (out.capval) {
      out.capval.textContent = '\u2248 ' + fmtMoney(capValue) + ' staff cost equivalent';
    }
    if (out.cash) {
      out.cash.textContent = fmtMoney(csVal);
    }
    if (out.gp) {
      out.gp.textContent = fmtMoney(gpValue);
    }
    if (out.gp_note) {
      if (opVal > 0 && cvVal > 0 && gpVal > 0) {
        out.gp_note.textContent = 'Based on ' + opVal + ' opportunities \u00d7 ' + cvVal + ' pts \u00d7 ' + fmtMoney(gpVal) + ' \u2013 an estimate, not a measurement';
      } else {
        out.gp_note.textContent = 'Include opportunities, conversion uplift and profit per customer to include potential profit';
      }
    }
    if (out.net) {
      out.net.textContent = fmtNeg(net);
    }
    if (out.net_note) {
      var netParts = fmtMoney(csVal) + ' savings + ' + fmtMoney(gpValue) + ' est. profit \u2212 \u00a35,000 fee \u2212 ' + fmtMoney(exVal) + ' extra';
      out.net_note.textContent = netParts;
    }
    if (out.netRow) out.netRow.classList.toggle('neg', net < 0);
    if (out.neg) out.neg.hidden = net >= 0;

    // Add review-exceeds message
    var negBox = out.neg;
    if (negBox) {
      if (net < 0) {
        negBox.hidden = false;
        if (reviewExceeds) {
          negBox.innerHTML = '<p>Review time exceeds time handed over, leaving an additional ' + fmtNeg(-recovered) + ' hours of review work per month.</p>';
        } else {
          negBox.innerHTML = '<p>On these assumptions, this workflow does not cover the monthly fee in cash terms. Review a higher-value scope or a smaller solution.</p>';
        }
      }
    }
  }

  // Attach input listeners with validation
  Object.keys(calc).forEach(function (k) {
    if (calc[k]) {
      calc[k].addEventListener('input', function () { validateField(k); recalc(); });
    }
  });

  // Example button — uses correct element IDs
  var exBtn = document.getElementById('calcExample');
  var EXAMPLE_VALUES = {
    c_hours: '20', c_handover: '70', c_review: '2', c_rate: '30',
    c_cash: '1000', c_opp: '100', c_conv: '5', c_gp: '500', c_extra: '200'
  };
  if (exBtn) exBtn.addEventListener('click', function () {
    Object.keys(EXAMPLE_VALUES).forEach(function (id) {
      if (calc[id]) {
        calc[id].value = EXAMPLE_VALUES[id];
        setError(id, null);
      }
    });
    recalc();
  });

  var rst = document.getElementById('calcReset');
  if (rst) rst.addEventListener('click', function () {
    Object.keys(calc).forEach(function (k) {
      if (calc[k]) { calc[k].value = ''; setError(k, null); }
    });
    setTimeout(function () { if (out.empty) out.empty.hidden = false; if (out.box) out.box.hidden = true; }, 10);
  });

  /* ---- DEMO (ordered state sequence + timer cleanup) ---- */
  var demoMsg = document.getElementById('demoMsg');
  var demoOut = document.getElementById('demoOut');
  var demoDone = document.getElementById('demoDone');
  var demoExc = document.getElementById('demoExc');
  var demoSteps = document.getElementById('demoSteps');
  var demoRun = document.getElementById('demoRun');
  var demoReset = document.getElementById('demoReset');
  var demoIdleBox = document.getElementById('demoIdle');
  var demoStatus = document.getElementById('demoStatus');

  var demoTimers = [];
  var demoRunning = false;

  function clearTimers() {
    demoTimers.forEach(function (t) { clearTimeout(t); });
    demoTimers = [];
    demoRunning = false;
  }

  function resetDemo() {
    clearTimers();
    [demoMsg, demoOut, demoDone, demoExc].forEach(function (e) { if (e) e.hidden = true; });
    if (demoSteps) demoSteps.querySelectorAll('li').forEach(function (li) { li.classList.remove('done'); });
    if (demoIdleBox) demoIdleBox.hidden = false;
    if (demoRun) { demoRun.textContent = 'Play example'; demoRun.disabled = false; demoRun.setAttribute('aria-label', 'Play example'); }
    if (demoStatus) demoStatus.textContent = '';
  }

  function announce(step) {
    if (demoStatus) demoStatus.textContent = step;
  }

  function markStep(i) {
    if (!demoSteps) return;
    var li = demoSteps.querySelectorAll('li')[i];
    if (li) li.classList.add('done');
  }

  if (demoRun) {
    demoRun.addEventListener('click', function () {
      if (demoRunning) return;
      demoRunning = true;
      if (demoIdleBox) demoIdleBox.hidden = true;
      // Start with step 1 visible
      if (demoMsg) demoMsg.hidden = false;
      if (demoOut) demoOut.hidden = true;
      if (demoDone) demoDone.hidden = true;
      if (demoExc) demoExc.hidden = true;

      demoRun.textContent = 'Replaying…'; demoRun.disabled = true;

      // Step 1: Enquiry arrives
      announce('Step 1: Enquiry received');
      markStep(0);

      // Step 2: Availability checked -> booking confirmed (after 1.2s)
      demoTimers.push(setTimeout(function () {
        announce('Step 2: Availability checked');
        markStep(1);
        if (demoMsg) demoMsg.hidden = true;
        if (demoOut) demoOut.hidden = false;
        announce('Step 3: Booking confirmed');
        markStep(2);
      }, 1200));

      // Step 4: Calendar and customer record updated (after 2.8s)
      demoTimers.push(setTimeout(function () {
        if (demoDone) demoDone.hidden = false;
        announce('Step 4: Calendar and customer record updated');
        markStep(3);
      }, 2800));

      // Step 5: Out-of-policy request paused for approval (after 4.2s)
      demoTimers.push(setTimeout(function () {
        if (demoExc) demoExc.hidden = false;
        announce('Step 5: Approval required — pausing before restricted action');
        markStep(4);
      }, 4200));

      // End: enable replay
      demoTimers.push(setTimeout(function () {
        if (demoRun) { demoRun.textContent = 'Replay'; demoRun.disabled = false; demoRun.setAttribute('aria-label', 'Replay demonstration'); }
        announce('Demonstration complete');
        demoRunning = false;
      }, 5600));
    });
  }
  if (demoReset) demoReset.addEventListener('click', resetDemo);

  /* ---- year in footer ---- */
  var y = document.querySelector('.foot-base .mono');
  if (y) y.innerHTML = '\u00a9 2026 Twinthos \u00b7 Work handled. Time returned.';
})();
