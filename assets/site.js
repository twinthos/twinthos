// Twinthos v32 – interactions
(function () {
  'use strict';

  /* ---- NAV ---- */
  var burger = document.querySelector('.nav-burger');
  var links = document.querySelector('.nav-links');
  if (burger && links) {
    burger.addEventListener('click', function () { links.classList.toggle('open'); });
    links.addEventListener('click', function (e) { if (e.target.tagName === 'A') links.classList.remove('open'); });
  }

  /* ---- REVEAL ---- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (r) { io.observe(r); });
  } else { reveals.forEach(function (r) { r.classList.add('in'); }); }

  /* ---- WORKFLOWS ---- */
  var WF = [
    { i: "A new enquiry arrives by email: “Can we view the Albert Road unit this week?”",
      o: "Viewing booked and confirmed with the customer. Calendar updated, customer record updated, site team notified. No follow-up needed.",
      s: "Email · Calendar · Customer record (CRM)",
      b: "Unusual requests, unapproved pricing and commitments outside your rules." },
    { i: "A promised callback has not happened within the agreed window.",
      o: "Follow-up sent and owner notified. Next step scheduled and logged. Escalated if still unresolved.",
      s: "Email · Messaging · Task list",
      b: "Sensitive relationship issues and anything needing your judgement." },
    { i: "A customer invoice is issued and the payment window is closing.",
      o: "Reminder sent on schedule. Receipt recorded and matched once paid. No duplicate messages.",
      s: "Invoicing · Payment status · Email",
      b: "Disputed amounts, refunds and changes to payment terms." },
    { i: "A booked job is complete and the customer is ready for the next stage.",
      o: "Completion confirmed, record updated and the next appropriate step prepared. Paused for your approval where required.",
      s: "Job records · Customer record · Messaging",
      b: "Scope changes, pricing decisions and anything outside the agreed workflow." }
  ];
  var wfBtns = document.querySelectorAll('.wf-btn');
  var wfPanel = document.getElementById('wfPanel');
  function setWF(k) {
    var d = WF[k]; if (!d) return;
    document.getElementById('wfInput').textContent = d.i;
    document.getElementById('wfOutput').textContent = d.o;
    document.getElementById('wfSys').textContent = d.s;
    document.getElementById('wfBound').textContent = d.b;
    wfBtns.forEach(function (b, i) { b.classList.toggle('active', i === k); b.setAttribute('aria-selected', i === k ? 'true' : 'false'); });
    if (wfPanel) { wfPanel.classList.remove('in'); void wfPanel.offsetWidth; wfPanel.classList.add('in'); }
  }
  wfBtns.forEach(function (b) { b.addEventListener('click', function () { setWF(parseInt(b.dataset.wf, 10)); }); });

  /* ---- EXCEPTION CARD ---- */
  var excKeep = document.getElementById('excKeep');
  var excNote = document.getElementById('excNote');
  if (excKeep) excKeep.addEventListener('click', function () { if (excNote) excNote.hidden = false; });

  /* ---- TELEMETRY TICKER ---- */
  var tEl = {
    time: document.getElementById('tTime'),
    act: document.getElementById('tAct'),
    flow: document.getElementById('tFlow'),
    rec: document.getElementById('tRec')
  };
  var flows = ['enquiries', 'bookings', 'invoices', 'follow-ups', 'client ops'];
  var acts = ['completing', 'monitoring', 'logging', 'handing over', 'awaiting approval'];
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function tick() {
    if (tEl.time) { var d = new Date(); tEl.time.textContent = pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds()) + ' UTC'; }
    if (tEl.act) tEl.act.textContent = acts[Math.floor(Math.random() * acts.length)];
    if (tEl.flow) tEl.flow.textContent = flows[Math.floor(Math.random() * flows.length)];
    if (tEl.rec) { var n = (180 + Math.floor(Math.random() * 40)); tEl.rec.textContent = n + ' today'; }
  }
  tick(); setInterval(tick, 1400);

  /* ---- DEMO ---- */
  var demoMsg = document.getElementById('demoMsg');
  var demoOut = document.getElementById('demoOut');
  var demoDone = document.getElementById('demoDone');
  var demoExc = document.getElementById('demoExc');
  var demoSteps = document.getElementById('demoSteps');
  var demoRun = document.getElementById('demoRun');
  var demoIdleBox = document.getElementById('demoIdle');
  function resetDemo() {
    [demoMsg, demoOut, demoDone, demoExc].forEach(function (e) { if (e) e.hidden = true; });
    if (demoSteps) demoSteps.querySelectorAll('li').forEach(function (li) { li.classList.remove('done'); });
    if (demoIdleBox) demoIdleBox.hidden = false;
    if (demoRun) { demoRun.textContent = 'Run demonstration'; demoRun.disabled = false; }
  }
  if (demoRun) {
    demoRun.addEventListener('click', function () {
      if (demoIdleBox) demoIdleBox.hidden = true;
      [demoMsg, demoOut, demoDone, demoExc].forEach(function (e) { if (e) e.hidden = false; });
      demoRun.textContent = 'Running…'; demoRun.disabled = true;
      var steps = demoSteps ? demoSteps.querySelectorAll('li') : [];
      steps.forEach(function (li, i) { setTimeout(function () { li.classList.add('done'); }, 700 * (i + 1)); });
      setTimeout(function () { if (demoRun) { demoRun.textContent = 'Run again'; demoRun.disabled = false; } }, 700 * (steps.length + 1));
    });
  }
  var demoReset = document.getElementById('demoReset');
  if (demoReset) demoReset.addEventListener('click', resetDemo);

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
  function num(v) { var n = parseFloat(v); return isFinite(n) && n >= 0 ? n : null; }
  function money(n) { return '£' + Math.round(n).toLocaleString('en-GB'); }
  function recalc() {
    var h = num(calc.hours && calc.hours.value), hd = num(calc.handover && calc.handover.value),
        rv = num(calc.review && calc.review.value), rt = num(calc.rate && calc.rate.value),
        cs = num(calc.cash && calc.cash.value), op = num(calc.opp && calc.opp.value),
        cv = num(calc.conv && calc.conv.value), gp = num(calc.gp && calc.gp.value),
        ex = num(calc.extra && calc.extra.value);
    if (h === null || hd === null || rv === null || rt === null || cs === null || op === null || cv === null || gp === null || ex === null) {
      if (out.empty) out.empty.hidden = false; if (out.box) out.box.hidden = true; return;
    }
    if (out.empty) out.empty.hidden = true; if (out.box) out.box.hidden = false;
    var monthlyHours = h * 4.33;
    var recovered = Math.max(0, monthlyHours * (hd / 100) - rv);
    var capValue = recovered * rt;
    var gpValue = op * (cv / 100) * gp;
    var net = cs + gpValue - 5000 - ex;
    if (out.hours) out.hours.textContent = recovered.toFixed(1) + ' h/mo';
    if (out.capval) out.capval.textContent = '≈ ' + money(capValue) + ' staff cost equivalent';
    if (out.cash) out.cash.textContent = money(cs);
    if (out.gp) out.gp.textContent = money(gpValue);
    if (out.gp_note) out.gp_note.textContent = 'Based on ' + op + ' opportunities × ' + cv + ' pts × ' + money(gp) + ' – an estimate, not a measurement';
    if (out.net) out.net.textContent = money(net);
    if (out.net_note) out.net_note.textContent = money(cs) + ' savings + ' + money(gpValue) + ' est. profit − £5,000 − ' + money(ex) + ' extra';
    if (out.netRow) out.netRow.classList.toggle('neg', net < 0);
    if (out.neg) out.neg.hidden = net >= 0;
  }
  Object.keys(calc).forEach(function (k) { if (calc[k]) calc[k].addEventListener('input', recalc); });
  var exBtn = document.getElementById('calcExample');
  if (exBtn) exBtn.addEventListener('click', function () {
    var v = { c_hours: '20', c_handover: '70', c_review: '2', c_rate: '30', c_cash: '1000', c_opp: '100', c_conv: '5', c_gp: '500', c_extra: '200' };
    Object.keys(v).forEach(function (id) { if (calc[id]) calc[id].value = v[id]; }); recalc();
  });
  var rst = document.getElementById('calcReset');
  if (rst) rst.addEventListener('click', function () { setTimeout(function () { if (out.empty) out.empty.hidden = false; if (out.box) out.box.hidden = true; }, 10); });

  /* year in footer */
  var y = document.querySelector('.foot-base .mono');
  if (y) y.innerHTML = '© 2026 Twinthos · Work handled. Time returned.';
})();
