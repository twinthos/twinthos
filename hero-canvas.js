/* hero-canvas.js — live "Non-Human Intelligence" field for the Twinthos hero.
   Real-time rendered: no static image, no slideshow. Genuine motion. */
(function () {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let W = 0, H = 0, DPR = 1;
  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  const BG = '#060607';
  const RED = [255, 59, 48];
  const INK = [242, 239, 233];

  function rnd(a, b) { return a + Math.random() * (b - a); }

  // Particle field (drifting intelligence dust)
  const N = Math.max(60, Math.floor((W * H) / 14000));
  const pts = [];
  for (let i = 0; i < N; i++) {
    pts.push({ x: rnd(0, W), y: rnd(0, H), vx: rnd(-0.12, 0.12), vy: rnd(-0.12, 0.12), r: rnd(0.6, 1.8), a: rnd(0.15, 0.6) });
  }

  // Orbiting nodes around a central core
  const nodes = [];
  const nodeCount = 7;
  for (let i = 0; i < nodeCount; i++) {
    nodes.push({ ang: (i / nodeCount) * Math.PI * 2, rad: rnd(0.22, 0.42), spd: rnd(0.06, 0.14) * (i % 2 ? 1 : -1), size: rnd(2.2, 4.2) });
  }

  // Travelling pulses along core->node links
  const pulses = [];
  function spawnPulse() {
    pulses.push({ ni: Math.floor(rnd(0, nodeCount)), t: 0, spd: rnd(0.012, 0.022), fromCore: Math.random() > 0.4 });
  }
  let pulseTimer = 0;

  let t = 0;
  function frame() {
    t += 1;
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, W, H);

    const cx = W / 2, cy = H / 2;
    const baseR = Math.min(W, H) * 0.5;

    // core glow (pulsing)
    const pulse = 0.5 + 0.5 * Math.sin(t * 0.02);
    const coreR = baseR * (0.16 + 0.02 * pulse);
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 3.2);
    g.addColorStop(0, `rgba(${RED[0]},${RED[1]},${RED[2]},${0.55 + 0.2 * pulse})`);
    g.addColorStop(0.25, `rgba(${RED[0]},${RED[1]},${RED[2]},0.22)`);
    g.addColorStop(1, 'rgba(6,6,7,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(cx, cy, coreR * 3.2, 0, Math.PI * 2); ctx.fill();

    // solid core
    ctx.fillStyle = `rgba(${RED[0]},${RED[1]},${RED[2]},0.95)`;
    ctx.beginPath(); ctx.arc(cx, cy, coreR, 0, Math.PI * 2); ctx.fill();

    // compute node positions
    const np = [];
    for (const n of nodes) {
      n.ang += n.spd * 0.01;
      const rr = baseR * n.rad;
      np.push({ x: cx + Math.cos(n.ang) * rr, y: cy + Math.sin(n.ang) * rr, size: n.size });
    }

    // links core<->node
    ctx.lineWidth = 1;
    for (const p of np) {
      const lg = ctx.createLinearGradient(cx, cy, p.x, p.y);
      lg.addColorStop(0, `rgba(${RED[0]},${RED[1]},${RED[2]},0.45)`);
      lg.addColorStop(1, `rgba(${RED[0]},${RED[1]},${RED[2]},0.05)`);
      ctx.strokeStyle = lg;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(p.x, p.y); ctx.stroke();
    }

    // node dots
    for (const p of np) {
      ctx.fillStyle = `rgba(${INK[0]},${INK[1]},${INK[2]},0.9)`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = `rgba(${RED[0]},${RED[1]},${RED[2]},0.5)`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 2.4, 0, Math.PI * 2); ctx.fill();
    }

    // travelling pulses
    pulseTimer++;
    if (pulseTimer > 14) { spawnPulse(); pulseTimer = 0; }
    ctx.fillStyle = `rgba(${INK[0]},${INK[1]},${INK[2]},0.95)`;
    for (let i = pulses.length - 1; i >= 0; i--) {
      const pu = pulses[i];
      pu.t += pu.spd;
      if (pu.t >= 1) { pulses.splice(i, 1); continue; }
      const p = np[pu.ni];
      const x = pu.fromCore ? cx + (p.x - cx) * pu.t : p.x + (cx - p.x) * pu.t;
      const y = pu.fromCore ? cy + (p.y - cy) * pu.t : p.y + (cy - p.y) * pu.t;
      ctx.beginPath(); ctx.arc(x, y, 2.6, 0, Math.PI * 2); ctx.fill();
    }

    // drifting dust
    for (const pt of pts) {
      pt.x += pt.vx; pt.y += pt.vy;
      if (pt.x < 0) pt.x = W; if (pt.x > W) pt.x = 0;
      if (pt.y < 0) pt.y = H; if (pt.y > H) pt.y = 0;
      ctx.fillStyle = `rgba(${INK[0]},${INK[1]},${INK[2]},${pt.a})`;
      ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2); ctx.fill();
    }

    // subtle scan sweep
    const sx = (t * 1.4) % (W + 200) - 100;
    const sg = ctx.createLinearGradient(sx - 80, 0, sx + 80, 0);
    sg.addColorStop(0, 'rgba(255,59,48,0)');
    sg.addColorStop(0.5, 'rgba(255,59,48,0.05)');
    sg.addColorStop(1, 'rgba(255,59,48,0)');
    ctx.fillStyle = sg;
    ctx.fillRect(sx - 80, 0, 160, H);

    // vignette
    const vg = ctx.createRadialGradient(cx, cy, baseR * 0.4, cx, cy, baseR * 1.15);
    vg.addColorStop(0, 'rgba(6,6,7,0)');
    vg.addColorStop(1, 'rgba(6,6,7,0.85)');
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, W, H);

    if (!reduce) requestAnimationFrame(frame);
  }
  if (reduce) { frame(); } else { requestAnimationFrame(frame); }
})();
