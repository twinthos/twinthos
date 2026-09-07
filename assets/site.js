/* Twinthos v30 interactions - demo, workflows, calculator, nav */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* MOBILE NAV */
  var burger = document.querySelector('.nav-burger');
  var links = document.querySelector('.nav-links');
  if (burger && links) {
    burger.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* DEMO */
  var demoIdle = document.getElementById('demoIdle');
  var demoMsg = document.getElementById('demoMsg');
  var demoStep = document.getElementById('demoStep');
  var demoOut = document.getElementById('demoOut');
  var demoDone = document.getElementById('demoDone');
  var demoExc = document.getElementById('demoExc');
  var stepEls = Array.prototype.slice.call(document.querySelectorAll('#demoSteps li'));
  var demoTimer = null;

  function hideAll() {
    [demoIdle, demoMsg, demoStep, demoOut, demoDone, demoExc].forEach(function (el) { el.hidden = true; });
    stepEls.forEach(function (li) { li.classList.remove('done'); });
  }
  function show(el) { if (el) el.hidden = false; }
  window.__demoReset = function () {
    if (demoTimer) { clearTimeout(demoTimer); demoTimer = null; }
    hideAll(); show(demoIdle);
  };
  var stepsText = ['Step 1 · Understanding the request. Request identified as a commercial viewing enquiry. Approved business information loaded.', 'Step 2 · Taking agreed actions. Availability checked with the site team. Reply drafted within approved rules.', 'Step 3 · Checking the outcome. Reply delivered, customer confirmed, records updated.'];
  window.__demoPlay = function () {
    window.__demoReset();
    show(demoMsg);
    var i = 0;
    function next() {
      if (i < 3) {
        demoStep.textContent = stepsText[i];
        show(demoStep);
        stepEls[i].classList.add('done');
        if (i === 1) { show(demoOut); }
        if (i === 2) { show(demoDone); }
        i++;
        demoTimer = setTimeout(next, reduce ? 300 : 2400);
      }
    }
    next();
  };
  function bind(id, fn) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('click', fn);
  }
  bind('playBtn', window.__demoPlay);
  bind('replyBtn', function () { window.__demoReset(); show(demoMsg); show(demoOut); });
  bind('recordBtn', function () { window.__demoReset(); show(demoDone); stepEls.forEach(function (li) { li.classList.add('done'); }); });
  bind('excBtn', function () { window.__demoReset(); show(demoMsg); show(demoExc); });
  bind('resetBtn', window.__demoReset);

  /* WORKFLOW SELECTOR */
  var wfData = [
    { input: 'A new enquiry arrives by email: \u201CCan we view the Albert Road unit this week?\u201D', output: 'Viewing booked and confirmed with the customer. Calendar updated, CRM record updated, site team notified. No follow-up needed.', sys: 'Email · Calendar · Customer record (CRM)', bound: 'Unusual requests, unapproved pricing and commitments outside your rules.' },
    { input: 'An agreed follow-up is due: a customer has not replied to a quotation sent three days ago.', output: 'Approved reminder sent and reply recorded. Next action kept visible for the team. No reply needed from staff to trigger it.', sys: 'Email · Sales record · Task list', bound: 'Negotiations, sensitive responses and changes to commercial terms.' },
    { input: 'A scheduled check runs on issued invoices: three are overdue by more than seven days.', output: 'Agreed reminders sent, payment statuses updated, one missing PO number flagged for the team.', sys: 'Accounting system · Email', bound: 'Disputes, payment changes and refunds.' },
    { input: 'A new client onboarding begins: welcome pack issued, information requested, documents filed.', output: 'Onboarding checklist advanced. Approved documents organised, records updated, two missing actions flagged.', sys: 'Email · Document store · Client record', bound: 'Incomplete, conflicting or sensitive instructions.' }
  ];
  var wfBtns = Array.prototype.slice.call(document.querySelectorAll('.wf-btn'));
  var wfPanel = document.getElementById('wfPanel');
  wfBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      wfBtns.forEach(function (b) { b.setAttribute('aria-selected', 'false'); b.classList.remove('active'); });
      btn.setAttribute('aria-selected', 'true'); btn.classList.add('active');
      var d = wfData[parseInt(btn.dataset.wf, 10)];
      if (!d) return;
      wfPanel.setAttribute('aria-labelledby', btn.id);
      document.getElementById('wfInput').textContent = d.input;
      document.getElementById('wfOutput').textContent = d.output;
      document.getElementById('wfSys').textContent = d.sys;
      document.getElementById('wfBound').textContent = d.bound;
    });
  });

  /* EXCEPTION CARD */
  bind('excReview', function () {
    var n = document.getElementById('excNote');
    if (n) { n.hidden = false; n.textContent = 'Request opened for review with full context. Nothing proceeds until a person decides.'; }
  });
  bind('excKeep', function () {
    var n = document.getElementById('excNote');
    if (n) { n.hidden = false; n.textContent = 'Stays paused until a person decides. The customer sees no automatic response.'; }
  });

  /* CALCULATOR */
  var ids = ['c_hours', 'c_handover', 'c_review', 'c_rate', 'c_cash', 'c_opp', 'c_conv', 'c_gp', 'c_extra'];
  var FEE = 5000;
  function val(id) {
    var el = document.getElementById(id);
    if (!el) return NaN;
    var v = parseFloat(el.value);
    if (isNaN(v) || v < 0) return NaN;
    if (el.id === 'c_handover' && v > 100) return NaN;
    return v;
  }
  function gbp(n) {
    var neg = n < 0;
    var v = Math.abs(Math.round(n));
    var s = '\u00A3' + v.toLocaleString('en-GB');
    return neg ? '\u2212' + s : s;
  }
  function calc() {
    var out = document.getElementById('calcOut');
    var empty = document.getElementById('calcEmpty');
    var anyInput = ids.some(function (id) { var el = document.getElementById(id); return el && el.value !== ''; });
    if (!anyInput) { out.hidden = true; empty.hidden = false; return; }
    empty.hidden = true; out.hidden = false;
    var hours = val('c_hours') || 0, handover = (val('c_handover') || 0) / 100, review = val('c_review') || 0;
    var rate = val('c_rate') || 0, cash = val('c_cash') || 0, opp = val('c_opp') || 0;
    var conv = (val('c_conv') || 0) / 100, gp = val('c_gp') || 0, extra = val('c_extra') || 0;
    var recHours = Math.max(0, hours * handover - review) * 4.33;
    var capVal = recHours * rate;
    var addGp = opp * conv * gp;
    var net = cash + addGp - FEE - extra;
    document.getElementById('r_hours').textContent = Math.round(recHours) + ' hours/month';
    document.getElementById('r_capval').textContent = rate > 0 ? 'Capacity value ' + gbp(capVal) + '/month (time equivalent, not automatic cash)' : 'Enter a staff cost to value this time';
    document.getElementById('r_cash').textContent = gbp(cash) + '/month';
    document.getElementById('r_gp').textContent = gbp(addGp) + '/month';
    document.getElementById('r_gp_note').textContent = (opp > 0 && conv > 0) ? (Math.round(opp * conv) + ' additional customers assumed at ' + gbp(gp) + ' gross profit each. Estimate, not a measurement.') : 'Enter affected opportunities, conversion uplift and gross profit per customer.';
    document.getElementById('r_net').textContent = gbp(net) + '/month';
    document.getElementById('r_net_note').textContent = 'Cash savings + estimated gross profit \u2212 ' + gbp(FEE) + ' fee' + (extra > 0 ? ' \u2212 ' + gbp(extra) + ' extra costs' : '');
    var netRow = document.getElementById('r_net_row');
    var neg = document.getElementById('calcNeg');
    if (net < 0) { netRow.classList.add('neg'); neg.hidden = false; }
    else { netRow.classList.remove('neg'); neg.hidden = true; }
  }
  ids.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('input', calc);
  });
  var exBtn = document.getElementById('calcExample');
  if (exBtn) exBtn.addEventListener('click', function () {
    var ex = { c_hours: '20', c_handover: '70', c_review: '2', c_rate: '30', c_cash: '1000', c_opp: '100', c_conv: '5', c_gp: '500', c_extra: '200' };
    Object.keys(ex).forEach(function (k) { var el = document.getElementById(k); if (el) el.value = ex[k]; });
    calc();
  });
  var rsBtn = document.getElementById('calcReset');
  if (rsBtn) rsBtn.addEventListener('click', function () {
    setTimeout(function () {
      var out = document.getElementById('calcOut'); var empty = document.getElementById('calcEmpty');
      out.hidden = true; empty.hidden = false;
    }, 0);
  });
})();
