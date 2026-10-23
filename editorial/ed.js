/* Twinthos editorial preview — one evolving composition.
   A single WebGL point field carries ten compositions. Particle identity is stable:
   every point keeps its seed, so morphs travel rather than dissolve.
   Scroll selects a continuous phase; the opening runs as a timed prologue. */
(function (W, D) {
  'use strict';

  var stage = D.getElementById('stage');
  var cv = D.getElementById('gl');
  var rail = D.getElementById('railfill');
  var body = D.body;
  if (!stage || !cv) return;

  var reduce = W.matchMedia && W.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) { body.classList.add('reduced'); return; }

  var VERT =   'precision highp float;' +
  'attribute vec4 aS;' +
  'uniform float uT,uK,uPS,uDpr,uAl,uPortrait;' +
  'uniform vec3 uFit;' +
  'uniform vec2 uFr;' +
  'uniform float uA,uB;' +
  'varying vec4 vC;' +
  'const float TAU=6.28318530718;' +
  'const vec3 GR=vec3(0.204,0.827,0.600);' +
  'const vec3 IV=vec3(0.945,0.949,0.930);' +
  'const vec3 DIM=vec3(0.115,0.360,0.280);' +
  '' +
  'vec2 markP(vec4 a,float K){' +
  '  float pick=a.x*620.0; vec2 lo;' +
  '  if(pick<158.0){ lo=vec2(mix(11.0,30.75,a.y),mix(12.0,20.0,a.z)); }' +
  '  else if(pick<310.0){ lo=vec2(mix(26.0,30.75,a.y),mix(20.0,52.0,a.z)); }' +
  '  else if(pick<468.0){ lo=vec2(mix(33.25,53.0,a.y),mix(12.0,20.0,a.z)); }' +
  '  else { lo=vec2(mix(33.25,38.0,a.y),mix(20.0,52.0,a.z)); }' +
  '  return (lo-vec2(32.0,32.0))*K;' +
  '}' +
  '' +
  'vec2 rN(float k){' +
  '  vec2 N0=vec2(-650.0,160.0),N1=vec2(-250.0,-160.0),N2=vec2(180.0,140.0),N3=vec2(610.0,-150.0);' +
  '  if(k<1.0) return N0; if(k<2.0) return N1; if(k<3.0) return N2; return N3;' +
  '}' +
  'vec2 route(float t){' +
  '  float seg=clamp(floor(t*3.0),0.0,2.0); float tt=fract(t*3.0);' +
  '  vec2 a0=rN(seg), a1=rN(seg+1.0);' +
  '  float e=tt*tt*(3.0-2.0*tt);' +
  '  return mix(a0,a1,e);' +
  '}' +
  'vec2 rnorm(float t){' +
  '  vec2 d=route(min(1.0,t+0.02))-route(max(0.0,t-0.02));' +
  '  float l=max(0.0001,length(d));' +
  '  return vec2(-d.y,d.x)/l;' +
  '}' +
  '' +
  'vec2 shape(float sid, vec4 a, out vec3 col, out float al, out float sz){' +
  '  int s=int(floor(sid+0.5));' +
  '  col=GR; al=0.6; sz=1.0; vec2 p=vec2(0.0);' +
  '' +
  '  if(s==0){' +
  '    float r=330.0*sqrt(a.x)*(0.55+0.45*a.y);' +
  '    float ang=a.z*TAU+sin(uT*0.22+a.x*6.0)*0.35;' +
  '    p=vec2(cos(ang),sin(ang)*0.72)*r;' +
  '    al=0.14+0.34*(1.0-a.x); sz=0.85;' +
  '' +
  '  } else if(s==1){' +
  '    p=markP(a,7.6); p.x+=(uPortrait>0.5)?0.0:430.0; p.y+=(uPortrait>0.5)?-260.0:-10.0;' +
  '    al=0.66+0.34*a.w; sz=1.15;' +
  '    col=mix(GR,IV,step(0.92,a.w));' +
  '' +
  '  } else if(s==2){' +
  '    if(a.x<0.46){' +
  '      float i=floor(a.y*11.0),j=floor(a.z*8.0);' +
  '      p=vec2(-580.0+i*(440.0/10.0),-280.0+j*(560.0/7.0));' +
  '      al=0.26+0.34*a.w; sz=0.95;' +
  '      col=mix(GR,DIM,0.35);' +
  '      if(a.w>0.965){ al=0.95; sz=1.7; col=IV; }' +
  '    } else {' +
  '      float t=(a.y-0.46)/0.54;' +
  '      float x=110.0+t*520.0;' +
  '      float spine=sin(x*0.010+uT*0.55)*96.0;' +
  '      float lane=(a.z-0.5);' +
  '      float y=spine+lane*118.0;' +
  '      p=vec2(x,y+(a.w-0.5)*10.0);' +
  '      al=0.22+0.30*a.w;' +
  '      sz=1.0;' +
  '      if(abs(lane)<0.10){ al=0.70; sz=1.6; col=mix(GR,IV,0.25); }' +
  '      if(a.w>0.985){ al=1.0; sz=2.2; col=IV; }' +
  '    }' +
  '' +
  '  } else if(s==3){' +
  '    float i=floor(a.y*4.0);' +
  '    float y=-285.0+i*190.0;' +
  '    float x=mix(-700.0,700.0,a.x);' +
  '    float gc=-300.0+mod(i,2.0)*420.0;' +
  '    float thick=(a.w-0.5)*7.0;' +
  '    if(abs(x-gc)<82.0){' +
  '      x=gc+sign(x-gc)*(82.0+abs(a.z-0.5)*22.0);' +
  '      y+=thick*1.6; al=0.85; sz=1.5;' +
  '      col=mix(GR,IV,0.30);' +
  '    } else {' +
  '      al=0.24+0.26*abs(a.z-0.5); sz=0.9;' +
  '      y+=thick;' +
  '    }' +
  '    p=vec2(x,y);' +
  '' +
  '  } else if(s==4){' +
  '    float sh=floor(a.x*5.0);' +
  '    float y=-300.0+sh*150.0;' +
  '    float x=mix(-660.0,660.0,a.y)*(0.74+0.055*sh);' +
  '    y+=16.0*sin(x*0.0045);' +
  '    float cell=step(0.86,a.z);' +
  '    p=vec2(x,y+(a.w-0.5)*4.0);' +
  '    al=0.20+0.26*a.w; sz=0.9;' +
  '    if(cell>0.5){ al=0.78; sz=1.7; col=mix(GR,IV,0.55); }' +
  '    if(a.w>0.992){ al=1.0; sz=2.4; col=IV; }' +
  '' +
  '  } else if(s==5){' +
  '    if(a.y<0.22){' +
  '      float k=floor(a.z*4.0);' +
  '      vec2 n=rN(k);' +
  '      float ang=a.w*TAU; float r=20.0+34.0*fract(a.x*57.0);' +
  '      p=n+vec2(cos(ang),sin(ang))*r;' +
  '      al=0.52+0.40*a.w; sz=1.25;' +
  '      col=mix(GR,IV,step(0.9,a.w));' +
  '    } else {' +
  '      float t=a.x;' +
  '      float off=(a.z-0.5);' +
  '      vec2 n=rnorm(t);' +
  '      p=route(t)+n*off*46.0;' +
  '      al=0.24+0.30*a.w; sz=0.95;' +
  '      if(abs(off)<0.10){ al=0.86; sz=1.5; col=mix(GR,IV,0.2); }' +
  '      if(a.w>0.985){ al=1.0; sz=2.0; col=IV; }' +
  '    }' +
  '' +
  '  } else if(s==6){' +
  '    float t=a.x*0.56;' +
  '    float off=(a.z-0.5);' +
  '    vec2 n=rnorm(t);' +
  '    p=route(t)+n*off*40.0;' +
  '    al=0.12+0.16*a.w; sz=0.9;' +
  '    if(a.y<0.08){' +
  '      float ang=a.w*TAU; float r=14.0+18.0*fract(a.z*41.0);' +
  '      p=route(0.56)+vec2(cos(ang),sin(ang))*r;' +
  '      float pulse=0.40+0.60*pow(max(0.0,sin(uT*1.05)),8.0);' +
  '      al=0.30+0.70*pulse; sz=1.5; col=mix(GR,IV,0.25);' +
  '    }' +
  '    if(a.y>0.93){' +
  '      float rp=fract(uT*0.11);' +
  '      p=route(0.56+rp*0.40)+vec2((a.z-0.5)*9.0,(a.w-0.5)*9.0);' +
  '      al=0.95; sz=1.8; col=IV;' +
  '    }' +
  '' +
  '  } else if(s==7){' +
  '    if(a.x<0.62){' +
  '      float lane=(floor(a.y*5.0)-2.0);' +
  '      float x=mix(-720.0,40.0,a.z);' +
  '      float squeeze=smoothstep(-720.0,40.0,x);' +
  '      float y=lane*118.0*(1.0-0.62*squeeze)+(a.w-0.5)*7.0;' +
  '      p=vec2(x,y);' +
  '      al=0.20+0.26*a.w; sz=0.95;' +
  '      if(abs(lane)<0.5){ al=0.62; sz=1.35; col=mix(GR,IV,0.15); }' +
  '      if(a.w>0.99){ al=1.0; sz=2.0; col=IV; }' +
  '    } else if(a.x<0.78){' +
  '      p=vec2(44.0+(a.y-0.5)*7.0,mix(-390.0,390.0,a.z));' +
  '      al=(abs(p.y)<128.0)?0.06:0.62;' +
  '      sz=1.05; col=mix(GR,IV,0.1);' +
  '    } else {' +
  '      float t=a.z;' +
  '      vec2 A=vec2(50.0,-52.0), B=vec2(430.0,-268.0);' +
  '      float e=t*t*(3.0-2.0*t);' +
  '      p=mix(A,B,e)+vec2((a.y-0.5)*14.0,(a.w-0.5)*14.0);' +
  '      al=0.60+0.38*a.w; sz=1.3;' +
  '      col=mix(GR,IV,step(0.88,a.w));' +
  '    }' +
  '' +
  '  } else if(s==8){' +
  '    float row=floor(a.x*7.0);' +
  '    float y=-300.0+row*100.0;' +
  '    float x=mix(-500.0,540.0,a.y);' +
  '    p=vec2(x,y+(a.z-0.5)*3.0);' +
  '    al=0.16+0.24*a.w; sz=0.9;' +
  '    if(a.y<0.16){ p=vec2(mix(-560.0,-400.0,fract(a.y*6.0)),y); al=0.55; sz=1.2; }' +
  '    if(a.z>0.96){ p=vec2(-566.0,mix(-320.0,320.0,a.w)); al=0.62; sz=1.3; }' +
  '' +
  '  } else if(s==9){' +
  '    float x=mix(-730.0,730.0,a.x);' +
  '    float y=(a.y-0.5)*74.0+sin(x*0.004+uT*0.25)*9.0;' +
  '    p=vec2(x,y); al=0.05+0.08*a.w; sz=0.8;' +
  '    if(a.w>0.995){ al=0.5; sz=1.6; col=IV; }' +
  '' +
  '  } else {' +
  '    if(a.x<0.64){' +
  '      p=markP(a,11.6);' +
  '      al=0.62+0.36*a.w; sz=1.2;' +
  '      col=mix(GR,IV,step(0.93,a.w));' +
  '    } else {' +
  '      float ang=a.y*TAU+uT*0.06;' +
  '      float r=395.0+56.0*a.z;' +
  '      p=vec2(cos(ang),sin(ang)*0.84)*r;' +
  '      al=0.14+0.24*a.w; sz=0.95;' +
  '      col=mix(GR,IV,step(0.94,a.w));' +
  '    }' +
  '  }' +
  '' +
  '  if(uPortrait>0.5){ p.x*=0.80; p.y*=0.84; }' +
  '  return p;' +
  '}' +
  '' +
  'void main(){' +
  '  vec3 ca,cb; float aa,ab,sa,sb;' +
  '  vec2 pa=shape(uA,aS,ca,aa,sa);' +
  '  vec2 pb=shape(uB,aS,cb,ab,sb);' +
  '  float k=clamp((uK-aS.y*0.18)/0.82,0.0,1.0); k=k*k*(3.0-2.0*k);' +
  '  vec2 p=mix(pa,pb,k);' +
  '  vec3 c=mix(ca,cb,k);' +
  '  float al=mix(aa,ab,k);' +
  '  float sz=mix(sa,sb,k);' +
  '  vec2 px=vec2(uFit.x*p.x+uFit.y,uFit.x*p.y+uFit.z);' +
  '  gl_Position=vec4(px.x/uFr.x*2.0-1.0,1.0-px.y/uFr.y*2.0,0.0,1.0);' +
  '  gl_PointSize=uPS*sz*(0.72+0.62*aS.w);' +
  '  vC=vec4(c,al*uAl);' +
  '}';

  var FRAG = [
    'precision mediump float;',
    'varying vec4 vC;',
    'void main(){',
    '  vec2 q=gl_PointCoord-0.5; float r=length(q);',
    '  float a=smoothstep(0.5,0.02,r); a*=a;',
    '  float al=a*vC.a;',
    '  if(al<0.004) discard;',
    '  gl_FragColor=vec4(vC.rgb*al,al);',
    '}'
  ].join('\n');

  var gl = null, prog = null, U = {}, NP = 0, bufS = null, dpr = 1;
  var raf = 0, t0 = 0, uT = 0, morph = 0, phase = 2, introT = 0, introOn = true;
  var introStart = 0, pausedAt = 0, forced = -1;
  var paused = false, soundOn = false, audio = null, lastShape = -1;
  var W_ = 0, H_ = 0, FW = 0, FH = 0, portrait = false;

  function initGL() {
    try { gl = cv.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false }); } catch (e) { gl = null; }
    if (!gl) { body.classList.add('no-gl'); return false; }
    function sh(type, src) {
      var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; }
      return s;
    }
    var v = sh(gl.VERTEX_SHADER, VERT), f = sh(gl.FRAGMENT_SHADER, FRAG);
    if (!v || !f) { body.classList.add('no-gl'); return false; }
    prog = gl.createProgram(); gl.attachShader(prog, v); gl.attachShader(prog, f); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { console.warn(gl.getProgramInfoLog(prog)); gl = null; body.classList.add('no-gl'); return false; }
    gl.useProgram(prog);
    ['uT', 'uK', 'uPS', 'uDpr', 'uAl', 'uPortrait', 'uFit', 'uFr', 'uA', 'uB'].forEach(function (n) { U[n] = gl.getUniformLocation(prog, n); });
    var aS = gl.getAttribLocation(prog, 'aS');
    bufS = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufS);
    gl.enableVertexAttribArray(aS);
    gl.vertexAttribPointer(aS, 4, gl.FLOAT, false, 0, 0);
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE); gl.disable(gl.DEPTH_TEST);
    cv.addEventListener('webglcontextlost', function (e) { e.preventDefault(); cancelAnimationFrame(raf); raf = 0; }, false);
    cv.addEventListener('webglcontextrestored', function () { initGL(); size(); seed(); loop(); }, false);
    return true;
  }

  function rng(seed) {
    return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }

  function seed() {
    if (!gl) return;
    var n = portrait ? 7000 : (W_ < 900 ? 9000 : 14000);
    NP = n;
    var R = rng(19), a = new Float32Array(n * 4);
    for (var i = 0; i < n * 4; i++) a[i] = R();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufS);
    gl.bufferData(gl.ARRAY_BUFFER, a, gl.STATIC_DRAW);
  }

  function size() {
    if (!gl) return;
    W_ = stage.clientWidth; H_ = stage.clientHeight;
    portrait = W_ < 700 || H_ > W_ * 1.25;
    FW = Math.round(W_ * dpr); FH = Math.round(H_ * dpr);
    if (cv.width !== FW || cv.height !== FH) { cv.width = FW; cv.height = FH; }
    gl.viewport(0, 0, FW, FH);
    var vw = portrait ? 900 : 1600, vh = portrait ? 1600 : 900;
    var sc = Math.max(W_ / vw, H_ / vh);
    gl.uniform3f(U.uFit, sc * dpr, FW / 2, FH / 2);
    gl.uniform2f(U.uFr, FW, FH);
    gl.uniform1f(U.uPortrait, portrait ? 1 : 0);
    gl.uniform1f(U.uPS, portrait ? 2.9 : 2.7);
    gl.uniform1f(U.uDpr, 1);
    gl.uniform1f(U.uAl, 1);
  }

  /* ---------- scroll: one continuous phase across nine sections ---------- */
  var sections = [], anchors = [], maxScroll = 1;
  function measure() {
    size();
    sections = [].slice.call(D.querySelectorAll('[data-shape]'));
    var sy = scrollY();
    anchors = sections.map(function (el) {
      return Math.max(0, el.getBoundingClientRect().top + sy - H_ * 0.52);
    });
    for (var i = 1; i < anchors.length; i++) if (anchors[i] <= anchors[i - 1]) anchors[i] = anchors[i - 1] + 1;
    maxScroll = Math.max(1, D.documentElement.scrollHeight - H_);
  }

  function scrollPhase() {
    var y = W_.scrollY || D.documentElement.scrollTop || 0;
    if (y <= anchors[0]) return 2;
    for (var i = 0; i < anchors.length - 1; i++) {
      if (y < anchors[i + 1]) {
        var k = (y - anchors[i]) / Math.max(1, anchors[i + 1] - anchors[i]);
        return 2 + i + Math.min(1, Math.max(0, k));
      }
    }
    return 2 + anchors.length - 1;
  }

  /* ---------- render ---------- */
  function draw() {
    if (!gl || !prog) return;
    var a = Math.floor(phase), b = Math.min(10, a + 1), k = phase - a;
    gl.uniform1f(U.uA, a); gl.uniform1f(U.uB, b); gl.uniform1f(U.uK, k);
    gl.uniform1f(U.uT, uT);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, NP);
    cv.classList.add('on');
    if (a !== lastShape) { lastShape = a; blip(a); }
  }

  function loop(now) {
    raf = 0;
    if (!now) now = performance.now();
    if (!t0) t0 = now;
    var dt = Math.min(0.12, (now - t0) / 1000); t0 = now;
    if (!paused) {
      uT += dt;
      if (forced >= 0) {
        phase = forced;
      } else if (introOn) {
        introT = (now - introStart) / 1000 * (scrollY() > 60 ? 2.4 : 1);
        if (introT >= 4.2) { introT = 4.2; introOn = false; }
        phase = Math.max(introTarget(introT), scrollPhase());
      } else {
        phase += (scrollPhase() - phase) * Math.min(1, dt * 7);
      }
    }
    draw();
    if (rail) rail.style.height = (Math.min(1, scrollY() / maxScroll) * 100).toFixed(2) + '%';
    raf = requestAnimationFrame(loop);
  }
  function scrollY() { return W_.scrollY || D.documentElement.scrollTop || 0; }
  function introTarget(t) {
    /* dust -> mark -> hero structure */
    if (t < 0.5) return 0;
    if (t < 2.4) return (t - 0.5) / 1.9;
    if (t < 2.9) return 1;
    return 1 + Math.min(1, (t - 2.9) / 1.3);
  }

  /* ---------- sound: explicit, quiet, tied to arrivals ---------- */
  function blip(s) {
    if (!soundOn || !audio) return;
    var map = { 1: 392.0, 2: 523.25, 5: 587.33, 7: 440.0, 8: 659.25, 10: 523.25 };
    var f = map[Math.floor(s)];
    if (!f) return;
    try {
      var o = audio.createOscillator(), g = audio.createGain();
      o.type = 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, audio.currentTime);
      g.gain.exponentialRampToValueAtTime(0.045, audio.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.55);
      o.connect(g); g.connect(audio.destination);
      o.start(); o.stop(audio.currentTime + 0.6);
    } catch (e) { }
  }
  var btnSound = D.getElementById('btn-sound');
  if (btnSound) btnSound.addEventListener('click', function () {
    if (!audio) { try { audio = new (W.AudioContext || W.webkitAudioContext)(); } catch (e) { audio = null; } }
    soundOn = !soundOn;
    if (audio && audio.state === 'suspended') audio.resume();
    btnSound.setAttribute('aria-pressed', soundOn ? 'true' : 'false');
    btnSound.setAttribute('aria-label', soundOn ? 'Sound on. Turn sound off' : 'Sound off. Turn sound on');
  });

  var btnPause = D.getElementById('btn-pause');
  if (btnPause) btnPause.addEventListener('click', function () {
    paused = !paused;
    if (paused) pausedAt = performance.now();
    else if (pausedAt) { introStart += performance.now() - pausedAt; pausedAt = 0; }
    btnPause.setAttribute('aria-pressed', paused ? 'true' : 'false');
    btnPause.setAttribute('aria-label', paused ? 'Resume background motion' : 'Pause background motion');
  });

  var btnReplay = D.getElementById('btn-replay');
  if (btnReplay) btnReplay.addEventListener('click', function () {
    W.scrollTo({ top: 0, behavior: 'smooth' });
    introT = 0; introOn = true; phase = 0; lastShape = -1; paused = false; introStart = performance.now();
    if (btnPause) btnPause.setAttribute('aria-pressed', 'false');
  });

  D.addEventListener('visibilitychange', function () {
    if (D.hidden) { if (raf) cancelAnimationFrame(raf); raf = 0; }
    else if (!raf) { t0 = 0; raf = requestAnimationFrame(loop); }
  });

  var rt = 0;
  W.addEventListener('resize', function () {
    clearTimeout(rt); rt = setTimeout(function () { dpr = Math.min(W.devicePixelRatio || 1, 2); measure(); seed(); }, 140);
  }, { passive: true });

  /* ---------- boot ---------- */
  dpr = Math.min(W.devicePixelRatio || 1, 2);
  if (!initGL()) return;
  measure(); seed();
  W.addEventListener('load', function () { measure(); }, { passive: true });
  setTimeout(function () { measure(); }, 700);
  if (D.fonts && D.fonts.ready) D.fonts.ready.then(function () { measure(); });
  phase = 0; introT = 0; introOn = true; introStart = performance.now();
  /* deep link: if the visitor arrives mid-page, skip the prologue */
  if (scrollY() > 80) { introOn = false; phase = scrollPhase(); }
  raf = requestAnimationFrame(loop);

  /* expose a little state for review tooling */
  W.__ed = { phase: function () { return phase; }, shapes: 10, particles: function () { return NP; }, intro: function () { return introOn; },
    set: function (v) { if (v < 0) { forced = -1; return; } forced = v; introOn = false; introT = 99; phase = v; }, anim: function (on) { paused = !on; } };
})(window, document);
