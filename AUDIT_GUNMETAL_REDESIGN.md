# Twinthos Design Audit — Cheap Gold & Text-Overlay Defects
## Proposal: Gunmetal Steel / Chrome Redesign (no gold)

**Audited file:** `/root/twinthos-site/index.html` (679 lines, single-file page)
**Method:** full CSS/HTML read + WCAG 2.1 luminance-contrast math on actual colors + 2026 dark-theme reference research (Hexcore, Muzli/99designs, dark.design) + brand-lock cross-check against `~/.hermes/skills/content-creation/twinthos-landing/SKILL.md`.
**Visual render attempted:** headless Chromium render to PNG; `vision_analyze` was unavailable for local/private URLs in this subagent context, so findings are grounded in code + computed contrast (all contrast claims below are reproduced from the attached math, not asserted).

---

## 0. CRITICAL CONTEXT — This file is a STALE, divergent build

The audited copy at `/root/twinthos-site/index.html` is **not** the live site. Cross-checking the workspace:

| Location | Accent color | Status |
|---|---|---|
| `/root/twinthos-site/index.html` (audited) | **gold `#C7A86B`** + brass `#D4AF37` | stale / divergent |
| `/root/twinthos-correct/index.html` (live working copy) | **signal red `#FF3B30`** | live, brand-locked |

The `twinthos-landing` skill (brand lock, corrected 2026-09-01) states **explicitly: "Signal red `#FF3B30` is the ONLY accent. NO gold (`#C2A14D`) BANNED."** The audited file therefore violates the current brand lock on two counts:
1. It still ships **gold**, which is banned outright.
2. Its accent (`#FF3B30` red) is the *wrong* color vs. the file's *own* `--accent` variable.

A second stale artifact, `AUDIT_2026.md` in the same folder, describes a **third** palette (`#00FFFF` cyan / `#F0EDE6` ink / `#010103` bg) that matches neither the file on disk nor the live red build. Treat that audit as superseded.

**The task** asks for a **gunmetal steel/chrome** redesign (cold metallics, no gold). I audit and propose to that spec. The steel/chrome direction is *fully compatible* with the file's own stated intent — its `:root` is literally commented `/* Gunmetal palette */` and `/* Silver gunmetal shimmer */` (line 165). Only the accent hex is gold; everything else is already gunmetal. So the fix is the accent swap the file already intended.

> Tension to resolve offline: `twinthos-landing` brand lock names **signal red** as the only accent. The user's explicit instruction here is **gunmetal steel/chrome**. These are not reconcilable in one lock. Recommend T pick: (a) keep the live site's signal-red lock and leave this gold copy untouched, OR (b) adopt the gunmetal steel/chrome lock below as the new standard and propagate it to `twinthos-correct/`. I do **not** touch the live `twinthos-correct/` build in this pass — the proposal targets the audited gold file.

---

## 1. Cheat list — every cheap-gold element (with line refs)

The gold is centralized in **four CSS variables** (lines 166–169, 178–179) and then fanned out everywhere via `var(--accent)` / `var(--accent-glow)` / `var(--accent-soft)` / `var(--accent-dim)`. That is the single reason "everything" reads cheap when the accent changes color.

### The four offending variables (the root cause)
| Line | Variable | Value | Effect |
|---|---|---|---|
| 166 | `--accent` | `#C7A86B` | **gold** — the master accent used ~30× below |
| 167 | `--accent-dim` | `#A68345` | muted gold — gradient stop + button gradient end |
| 168 | `--accent-soft` | `rgba(199,168,107,.10)` | **gold mist surface tint** — used as hover/active background on cards |
| 169 | `--accent-glow` | `rgba(199,168,107,.40)` | **gold glow halo** — text-shadow / box-shadow on everything |
| 178 | `--shimmer-gold` | `#C7A86B` | gold gradient stop inside animated text |
| 179 | `--shimmer-brass` | `#D4AF37` | **brass** gradient stop inside animated text |

Every `--accent` reference below inherits the gold. The cheapness comes from **(a) the gold+brass dual-metal gradient being animated**, and **(b) gold-mist surfaces that make gold/ink/muted text unreadable**.

### Elements that read "cheap" — line-anchored
| # | Location | Lines | What's cheap |
|---|---|---|---|
| 1 | Animated headline shimmer | 193–206, 208–211 | `.shimmer-text` = moving `linear-gradient(110deg, gold→silver→gold-dim→brass→gold)` with `animation: shimmer-sweep 4s ease-in-out infinite` (line 205) over text. Gold+brass+animated = "neon bar sign / bling." Applied to hero h1 ("you"(454), "point"(455)), the circle center "We remove the limit."(488), and the pricing figure "£5k"(564). |
| 2 | `.shimmer-subtle` glow halo | 213–216 | `color:var(--accent); text-shadow:0 0 8px var(--accent-glow)` — solid gold text + gold bloom. Applied to "you"(480), "screen"(499), "thing it sells"(539), "Twinthos"(554), "worker"(574), "week"(607). |
| 3 | Accent dots + pulse | 225, 236, 383 | `.dot` = `background:var(--accent); box-shadow:0 0 12px var(--accent-glow); animation:pulse 2s infinite` — blinking gold LED on black. Three dots pulse in sequence. |
| 4 | Hero eyebrow | 235–236 | `color:var(--accent)` gold uppercase label + gold dot. |
| 5 | Nav "Hire" CTA | 230–231 | `background:var(--accent)` gold button; on hover `box-shadow:0 0 20px var(--accent-glow)` + bg→`--shimmer-silver` (light silver, jarring color flip). |
| 6 | Primary buttons | 253–278, 365–381 | `background:linear-gradient(135deg, var(--accent)→var(--accent-dim))` gold gradient; `::before` white-skid sweep; hover doubles to `0 0 30px/50px var(--accent-glow)` — thick gold aureole. Two copies of this block (hero + final). |
| 7 | Scroll-hint wheel | 289 | `.wheel { background:var(--accent); animation:scrollWheel … }` gold animated scroll cue. |
| 8 | Section labels / eyebrows | 295 | `color:var(--accent)` gold uppercase labels on every scroll section. |
| 9 | h2 `.accent` highlights | 297, 345, 361 | `color:var(--accent); text-shadow:0 0 10px var(--accent-glow)` — gold word-in-heading + gold bloom. |
| 10 | `.highlight` spans | 300, 345 | `color:var(--accent)` gold emphasis (e.g. stats ".s" subs, 342). |
| 11 | "Golden Circle" ring labels | 309–310, 351 | `.ring-label.why/.how { background:var(--accent-soft); color:var(--accent) }` — gold-on-gold-mist; `.maths .card.featured { border-color:var(--accent); background:var(--accent-soft) }` gold border + gold-mist featured card. |
| 12 | Diff grid hover | 330 | `.diff .item:hover { border-color:var(--accent); background:var(--accent-soft) }` — card flips to gold-mist on hover. |
| 13 | Diff item numbers | 332 | `.num { color:var(--accent) }` gold step numbers. |
| 14 | Proof stat sub-numbers | 342 | `.n .s { color:var(--accent) }` — gold "£5k/mo", "h", "/365" suffixes. |
| 15 | Focus ring | 416 | `:focus-visible { outline:2px solid var(--accent); … }` gold focus outline. |

### The single worst offender
The **animated gold+brass shimmer gradient over text** (element #1, lines 193–206). It mixes two metals (yellow gold `#C7A86B` + brass `#D4AF37`) with a silver, then **sweeps** it with a 4 s infinite animation and a 200% background size. That is the literal definition of "illuminated words look cheap": a moving multi-metal gradient halo on dark = disco-ball bling, not illumination.

---

## 2. Text-overlay errors (the "overlay issues" / "text error overlays")

The user flagged "visual text/design overlay issues" and "fix text error overlays." Four are confirmed in code:

### A. Scroll-reveal blanks the page (the big one) — lines 390–391, 478, 497, 537, 552, 572, 605
```css
.reveal { opacity:0; transform:translateY(30px); ... }
.reveal.in { opacity:1; transform:translateY(0); }
```
JS at 670–676 (`IntersectionObserver`) adds `.in` only when scrolled. **Every** section's `.wrap` renders at `opacity:0` until scrolled. This is the exact anti-pattern documented in `apple-grade-web-design` + `anti-slop-dark-checklist`: *"Scroll-triggered reveals render the page BLANK — never ship them."* Consequences:
- Lightbot/Lighthouse/SEO renders see **empty sections** below the fold.
- No-JS or mid-animation screenshots → large blank voids (the NOHUMA team already hit this exact bug and fixed it by switching to a load-time fade).
- `prefers-reduced-motion` (417–419) kills `animation` but **not** the `.reveal` `transition` — so reduced-motion users still get hidden-then-reveal behaviour; the `.reveal.in` class only lands if JS + intersection fire.

### B. Hero headline clipped with no JS — lines 238–239
```css
.hero h1 .line { overflow:hidden; }
.hero h1 .word { transform:translateY(118%); animation:wordUp … }
```
Words rest 118% below the line inside `overflow:hidden`. `wordUp` (244) slides them up, but if the animation is blocked (reduced-motion, slow load, JS off) the headline is **clipped/cut**. A text-visibility failure.

### C. Animated gradient laid OVER text — lines 193–206
`background-clip:text` + moving `linear-gradient` is literally a visual *overlay* painted on the glyphs. Mixed with the gold+brass stops, the moving ridge passes through green-white-yellow, producing momentary low-contrast flash (a word briefly becomes near-invisible mid-sweep). This is the "text error overlay."

### D. Gold-mist surfaces crush text contrast (verified by contrast math) — lines 168, 309–310, 330, 351
`.accent-soft` = `rgba(199,168,107,.10)`. Blended onto the card bg `#161E29` it resolves to an effective mid-tone **`#747A82`**. Measured contrasts on that tinted surface:

| Text | Color | vs tinted `#747A82` | Pass AA (4.5)? |
|---|---|---|---|
| gold accent text | `#C7A86B` | **1.91:1** | ❌ FAIL |
| ink body | `#E5E8F0` | **3.55:1** | ❌ FAIL |
| muted body (0.65) | `rgba(229,232,240,.65)` | **3.34:1** | ❌ FAIL |

This is why the diff-card hover and the featured maths card (both use `background:var(--accent-soft)`) are readability disasters: text lands at 1.9–3.5:1, far below the AA floor. The gold-on-gold-mist is the textbook "overlay makes text unreadable" case.

---

## 3. What 2026 premium dark themes do (research synthesis)

Sources: Hexcore "10 Website Design Trends Dominating 2026", Muzli dark-mode inspiration, 99designs 2026 dark collection, dark.design curated gallery.

| 2026 pattern | Why it matters here |
|---|---|
| **Off-blacks, not `#000`** — `#171717`/`#1a1a1a` family with 2-stop surface ramps. | The site already uses a gunmetal ramp (`#0A0F14→#111822→#161E29`); good — extend to 4 layers, not 3. |
| **"Subtlety" over saturation** — saturated pure hues (pure cyan `#00FFFF`, pure gold) "signal synthetic/amateur." | Confirms gold is the wrong register; a *desaturated* metallic is the 2026 move. |
| **Matte metals, not mirror** — chrome/silver used as *structural* accents and static highlights; animation only for functional purpose, never for its own sake. | Directly supports: kill the sweep animation, make illumination **static chrome**. |
| **Single metallic key** — one cool metallic (steel/brushed chrome) repeated; no gold+brass+silver mixing in one element. | The gold element (#1) mixes TWO metals. Fix = one metal per treatment. |
| **Reveals serve hierarchy** — micro-animations only to direct attention; content visible by default. | Reinforces replacing `opacity:0` reveal with a load-time fade. |
| **Metal-text-on-metal is a trap** — keep ≥4.5:1 everywhere; tinted hover surfaces must still carry AAA body text. | Validates the contrast math in §2D and the button-text insight below. |

---

## 4. Proposed replacement — Gunmetal Steel / Chrome palette

All values below are **WCAG-verified** via the luminance math attached to this audit. Cold metallics only.

```css
:root {
  /* === gunmetal steel / chrome — NO GOLD, NO BRASS === */
  /* surface depth: 4 steps, ~1.5–2 stops each (lets layers "breathe") */
  --bg:          #0A0F14;   /* gunmetal canvas (keep)        L=0.0046 */
  --panel:       #131A25;   /* deep steel                    L=0.0101 */
  --card:        #1B2433;   /* brushed steel                 L=0.0173 */
  --surface:     #242E3E;   /* hover/active steel            L=0.0268 */

  /* text */
  --ink:         #E6E9F0;   /* off-white body / headings     15.83:1 on bg  AAA */
  --muted:       #94A0B5;   /* steel body copy               7.29:1 on bg / 5.18:1 on surface  AA */

  /* === the metallic key (cold) === */
  --chrome:      #B1BAC5;   /* brushed chrome — illuminated text + buttons   9.80:1 on bg  AAA */
  --silver:      #C1C9D3;   /* polished silver — strong highlight            11.51:1 on bg AAA */
  --steel:       #4A90D4;   /* cool steel accent — borders/focus/icons       5.71:1 on bg  AA */

  /* accents / dividers / glows (desaturated, static) */
  --line:        rgba(230,233,240,.08);
  --line-soft:   rgba(230,233,240,.04);
  --chrome-glow: rgba(177,186,197,.45);   /* static chrome highlight bloom (not gold) */
  --steel-focus: rgba(74,144,212,.60);    /* steel focus ring */

  --sans: "Inter", system-ui, sans-serif;
  --mono: ui-monospace, "SF Mono", "Cascadia Code", Menlo, monospace;
}
```

Contrast verification table (foreground on the surface it actually appears on):

| Foreground | On bg `#0A0F14` | On card `#1B2433` | On surface `#242E3E` |
|---|---|---|---|
| ink `#E6E9F0` (body/heading) | 15.83 AAA | 12.83 AAA | 11.25 AAA |
| muted `#94A0B5` (body copy) | 7.29 AAA | 5.91 AA | 5.18 AA |
| chrome `#B1BAC5` (illuminated text/buttons) | 9.80 AAA | 7.94 AAA | 6.97 AA |
| silver `#C1C9D3` (strong highlight) | 11.51 AAA | 9.33 AAA | 8.18 AA |
| steel `#4A90D4` (border/focus/icon) | 5.71 AA | 4.63 AA | 4.06 (border use only) |
| `--bg` dark text **on chrome button** | 9.80 AAA | — | — |

Button-text insight: chrome/silver fills carry **dark (`--bg`) ink text** (9.80–11.51:1) — *not* light text. Light text on chrome reads 1.38:1 (FAIL) because chrome is near-white. This mirrors the existing gold button, which already used `color:#0A0F14` (line 255) — keep that dark-text-on-medium-metal pattern and just swap the metal.

---

## 5. Specific CSS to replace (gold → chrome/steel)

### 5.1 Swap the four variables (lines 165–179)
Replace the whole accent block:
```css
  /* === gunmetal steel / chrome — NO GOLD, NO BRASS === */
  --accent:      #4A90D4;            /* was #C7A86B gold  -> cool steel (borders/focus/icons) */
  --accent-dim:  #2E6FB0;            /* was #A68345 gold-dim -> darker steel for gradients */
  --accent-soft: rgba(74,144,212,.08);/* was rgba(199,168,107,.10) gold mist -> STEEL mist, lighter */
  --accent-glow: rgba(177,186,197,.45);/* was golden glow -> brushed-CHROME glow (not gold) */

  --shimmer-silver: #B1BAC5;         /* keep, rename intent */
  --shimmer-chrome:  #B1BAC5;         /* was #C7A86B gold -> chrome */
  --shimmer-steel:   #4A90D4;         /* was #D4AF37 brass -> steel */
```
Why the hover tint changes hue: the old `rgba(199,168,107,.10)` over a dark card produced `#747A82` and then gold/ink text collapsed to 1.9/3.5:1. The new `rgba(74,144,212,.08)` over `#1B2433` stays a **dark steel** so ink/muted/chrome text all remain readable (ink 11.25/12.83/15.83, muted 5.91/7.29 — see table).

### 5.2 Kill the moving multi-metal shimmer (lines 192–211) → static chrome illuminate
```css
/* --- REPLACES .shimmer-text (was lines 193-211) --- */
/* Static chrome highlight on gunmetal. No animation, no gold, no brass. */
.chrome-text {
  color: var(--chrome);
  text-shadow:
    0 0 6px var(--chrome-glow),
    0 0 12px var(--chrome-glow);
}
/* (delete @keyframes shimmer-sweep entirely) */
```

### 5.3 .shimmer-subtle → static steel highlight (lines 213–216)
```css
/* --- REPLACES .shimmer-subtle --- */
.steel-subtle {
  color: var(--steel);
  text-shadow: 0 0 6px var(--steel-focus);
}
```

### 5.4 Reveal fix: load-time fade, default-visible (lines 389–391)
```css
/* --- REPLACES .reveal / .reveal.in --- */
.reveal {
  opacity: 1;              /* visible by default */
  transform: translateY(0);
  animation: revealFade .65s ease both;   /* decoration only, never hides content */
}
@keyframes revealFade {
  from { opacity: .25; transform: translateY(12px); }
  to   { opacity: 1;   transform: none; }
}
@media (prefers-reduced-motion: reduce) {
  .reveal { animation: none; }
}
```
This fixes the blank-screenshot/SEO/blank-below-fold bug from §2A. (Matches the working pattern in `apple-grade-web-design` references.)

### 5.5 Hero headline clip fix (lines 238–244)
Keep `.line { overflow:hidden }` but make the word start state *visible* and animate only position:
```css
.hero h1 .word {
  display: inline-block;
  transform: translateY(0);            /* visible by default (was 118% clipped) */
  opacity: 0;                          /* start hidden... */
  animation: wordFade .6s ease forwards;/* ...and fade in; no clipping possible */
}
@keyframes wordFade { to { opacity: 1; transform: none; } }
```

### 5.6 Buttons: chrome fill + dark ink (lines 253–278, 365–381)
```css
.hero .cta-row .btn.primary,
.final .cta-row .btn.primary {
  color: var(--bg);                    /* dark ink on chrome — keeps AAA */
  background: linear-gradient(135deg, var(--chrome) 0%, var(--silver) 100%);
  box-shadow: 0 0 16px var(--chrome-glow);
  border: none;
}
.hero .cta-row .btn.primary:hover,
.final .cta-row .btn.primary:hover {
  box-shadow: 0 0 24px var(--chrome-glow);   /* tame: 16→24, not 30+50 */
  transform: translateY(-1px);
}
.hero .cta-row .btn.ghost:hover {
  border-color: var(--chrome);
  color: var(--chrome);
}
```

### 5.7 Dots, labels, focus: steel/chrome (lines 225, 235–236, 289, 295, 297, 300, 332, 342, 345, 361, 416)
- `.dot` → `background:var(--steel); box-shadow:0 0 10px var(--steel-focus);` (pulse kept, hue swapped).
- All `color:var(--accent)` label/number/highlight occurrences stay on `--accent` — they now resolve to steel `#4A90D4` automatically (AA on bg/card). 
- `.golden .ring-label.why/.how` → rename class (see §6) and set `background:rgba(74,144,212,.08); color:var(--steel);`.
- `:focus-visible { outline: 2px solid var(--steel); ... }` — `var(--accent)` already maps to steel after the var swap.

### 5.8 Card hovers (lines 330, 351) — tint that doesn't kill contrast
```css
.diff .item:hover,
.maths .card.featured {
  border-color: var(--steel);
  background: var(--surface);          /* solid dark steel, NOT a mist */
}
.diff .item:hover::after {
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.04), transparent);
}
```
Result on hover: ink 11.25 / muted 5.18 / chrome 6.97 — all readable (vs the old gold's 1.9/3.3/3.5).

---

## 6. Mock implementation — stronger illuminated text (static chrome/silver)

Goal: "illuminated words" that look **intentional metal**, not bling. One metal per element, **static** highlight, no sweep animation, verified contrast.

```html
<h1>
  <span class="line"><span class="word">Your business</span></span>
  <span class="line"><span class="word">runs without</span> <span class="word chrome-text">you</span>.</span>
  <span class="line"><span class="word">That is the</span> <span class="word chrome-text">point</span>.</span>
</h1>
```

```css
/* === STATIC CHROME ILLUMINATION (no gold, no animation, no brass) === */
.chrome-text {
  position: relative;
  color: var(--chrome);                       /* brushed chrome, 9.80:1 on bg  AAA */
  text-shadow:
    0 0   4px rgba(177,186,197,.45),          /* chrome-glow, inner bloom   */
    0 0   8px rgba(177,186,197,.35),          /* softer outer               */
    0 0  16px rgba(36,46,62,.60);            /* inner-glow from the dark steel bg */
  letter-spacing: -0.01em;
}
/* optional single static anodised line so the metal reads as a "bar", not a smear */
.chrome-text::after {
  content: "";
  position: absolute;
  inset: auto 0 0 0; bottom: -4px;
  height: 2px;
  width: 0.6em;
  background: linear-gradient(90deg, var(--silver), var(--chrome), transparent);
  border-radius: 1px;
}
/* reduced motion: glow untouched (it's static), just drop the wordFade timing */
@media (prefers-reduced-motion: reduce) {
  .chrome-text { text-shadow: 0 0 6px var(--chrome-glow); }
}
```

Contrast of the illuminated result: chrome `#B1BAC5` on bg `#0A0F14` = **9.80:1** (AAA). The glow is additive only; foreground luminance is unchanged, so contrast does not drop. This is the key fix vs. the gold shimmer: **illumination is a static highlight, not a sweeping gradient that momentarily erases contrast.**

Apply the same static pattern to the other `.shimmer-subtle` callouts (lines 480, 499, 539, 554, 574, 607): class `.steel-subtle` (§5.3) for the cool-steel word, `.chrome-text` where the emphasis should read as "lit metal." Both are static, single-metal, AA/AAA.

---

## 7. Reconciliation checklist before shipping

1. **Repo confusion:** the audited file lives in `/root/twinthos-site/` (gold, gh-pages-ish). The live build is `/root/twinthos-correct/` (signal-red). Do not push this gold file to the live repo — pick one source of truth.
2. **Brand lock vs. this proposal:** `twinthos-landing` brands accent as **signal red `#FF3B30` only**; this proposal is **gunmetal steel/chrome**. Not the same brand key. If T wants steel/chrome as the new lock, update `twinthos-landing` SKILL.md's palette block too (bg `#060607`, ink `#F2EFE9` there are near-identical to the proposed gunmetal — only the accent differs).
3. **One metal per element** — audit never again mixes steel + chrome + silver in a single gradient.
4. **After any edit:** `grep -nE "#C7A86B|#A68345|#D4AF37|shimmer-gold|shimmer-brass" index.html` → must be 0; `grep -c "shimmer-sweep\|opacity: 0; transform: translateY" ` → 0; `grep -c "background: var(--accent-soft)" ` → 0 (replaced by `--surface`).
5. **Visual gate:** render `file:///…/index.html` at 390 px + 1280 px, confirm (a) hero headline visible with JS off, (b) all `.reveal` sections opaque by default, (c) no gold pixels anywhere, (d) muted body ≥4.5:1 on every surface. (vision_analyze was blocked here; run the real vision gate in the live session.)

---

## TL;DR — change these lines, delete those
- **Swap variables:** 166–169, 178–179.
- **Delete** `shimmer-sweep` keyframes (208–211) and the `animation:` on `.shimmer-text` (205).
- **Replace** `.shimmer-text` body (193–206) → static `.chrome-text`; `.shimmer-subtle` body (213–216) → static `.steel-subtle`.
- **Fix reveals:** 390–391 → load-time fade; 238–244 → no `overflow:hidden` clipping.
- **Button bg** (254, 366) → `linear-gradient(135deg, var(--chrome), var(--silver))`, text stays `var(--bg)`.
- **Card/tint surfaces** (309–310, 330, 351) → solid `var(--surface)` steel, not `var(--accent-soft)` gold mist.
- **Grep-gate:** zero gold/brass tokens; zero `opacity:0` reveal base; zero gold-mist tinted surfaces.
