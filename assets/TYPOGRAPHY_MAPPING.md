# Twinthos Typography System — Usage Mapping & Change Log

**Date:** 2026-09-26
**Scope:** All 7 pages (index.html + 6 sub-pages)
**Font:** Inter (weights 300/400/500/600)
**Type scale:** 14 levels, 11px → clamp(72–130px)

---

## Type Scale Reference

| Level | Token | Size | Weight | Line-height | Letter-spacing | Purpose |
|-------|-------|------|--------|-------------|----------------|---------|
| 1 | `--micro` | 11px | 400 | 1.0 | +0.02em | Fineprint, legal, tags |
| 2 | `--label` | 12px | 600 | 1.0 | +0.15em | Section labels/eyebrows (uppercase) |
| 3 | `--caption` | 13px | 400 | 1.0 | -0.01em | Nav links, footer, small UI |
| 4 | `--text-xs` | 14px | 400 | 1.6 | 0.01em | Form labels, secondary small body |
| 5 | `--text-sm` | 15px | 400 | 1.6 | 0.01em | Compact body, book form inputs |
| 6 | `--body` | 16px | 400 | 1.6 | 0.01em | Standard body text |
| 7 | `--lead` | 18px | 400 | 1.75 | 0.01em | Introductory paragraphs |
| 8 | `--text-lg` | 20px | 400 | 1.75 | 0.01em | Emphasis body, proof descriptions |
| 9 | `--h3` | 28px | 500 | 1.05 | -0.02em | Subsection headings |
| 10 | `--h2` | 40px | 300 | 1.05 | -0.025em | Major section headings |
| 11 | `--h1` | 56px | 300 | 1.05 | -0.025em | Page-level headings |
| 12 | `--display-sm` | 72px | 300 | 1.0 | -0.03em | Secondary hero, big stats |
| 13 | `--display` | clamp(64–110px) | 300 | 1.0 | -0.035em | Primary hero headline |
| 14 | `--display-lg` | clamp(72–130px) | 300 | 1.0 | -0.035em | Hero brand mark, maximum impact |

---

## Utility Classes

### Label / Eyebrow — ONE PATTERN, EVERYWHERE

```css
.label {
  font-size: var(--label);      /* 12px */
  font-weight: var(--weight-semibold);  /* 600 */
  line-height: var(--lh-tight); /* 1.0 */
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin: 0 0 var(--space-5) 0;
}
```

**Modifiers:** `.label--signal` (green), `.label--tight` (smaller margin)

**USAGE MAPPING — every occurrence across all pages:**

| Page | Element | Old class | Old size/weight | New class | Change |
|------|---------|-----------|-----------------|-----------|--------|
| index.html | Hero | `.hero-label` | 12px/600/0.15em uppercase | `.label` | ✓ Identical — just rename to `.label` |
| index.html | Story | `.enemy-label` | 12px/600/0.15em uppercase | `.label` | ✓ Identical — just rename to `.label` |
| index.html | Enemy | `.enemy-label` | 12px/600/0.15em uppercase | `.label` | ✓ Identical — just rename to `.label` |
| index.html | Proof | `.proof-label` | 12px/600/0.15em uppercase | `.label` | ✓ Identical — just rename to `.label` |
| index.html | Difference | `.difference-label` | 12px/600/0.15em uppercase | `.label` | ✓ Identical — just rename to `.label` |
| index.html | Redacted | `.redacted-label` | 12px/600/0.15em uppercase | `.label` | ✓ Identical — just rename to `.label` |
| index.html | Human | `.human-label` | 12px/600/0.15em uppercase | `.label` | ✓ Identical — just rename to `.label` |
| index.html | Offer | `.offer-label` | 12px/600/0.15em uppercase | `.label` | ✓ Identical — just rename to `.label` |
| index.html | Final CTA | `.final-cta-label` | 12px/600/0.15em uppercase | `.label` | ✓ Identical — just rename to `.label` |
| privacy.html | Hero | `.label` | undefined (falls through) | `.label` | ✗ Was undefined — now gets full label style |
| privacy.html | Sections | `.label` (×5) | undefined | `.label` | ✗ Was undefined — now gets full label style |
| about.html | Hero | `.label` | undefined | `.label` | ✗ Was undefined — now gets full label style |
| about.html | Section | `.label` | undefined | `.label` | ✗ Was undefined — now gets full label style |
| book/index.html | Hero | `.label` | undefined | `.label` | ✗ Was undefined — now gets full label style |
| book/index.html | Info panel | `.label` | undefined | `.label` | ✗ Was undefined — now gets full label style |
| security/index.html | Hero | `.label` | undefined | `.label` | ✗ Was undefined — now gets full label style |
| operations-audit/index.html | Hero | `.label` | undefined | `.label` | ✗ Was undefined — now gets full label style |
| operations-audit/index.html | Section | `.label` | undefined | `.label` | ✗ Was undefined — now gets full label style |
| operations-audit/index.html | Redacted audit | `.redacted-audit-label` | undefined | `.label` | ✗ Was undefined — now gets full label style |

**KEY FINDING:** The homepage used 9 different class names for what was visually identical labels. Every sub-page used `.label` but it wasn't defined anywhere, so they got no styling at all. Now there is ONE `.label` class that every page uses.

---

### Body Text — `.body` and variants

```css
.body           { font-size: var(--body);    /* 16px */ line-height: var(--lh-body); /* 1.6 */ }
.body--dim      { color: var(--text-dim); }
.body--sm       { font-size: var(--text-sm); /* 15px */ }
.body--lead     { font-size: var(--lead);   /* 18px */ line-height: var(--lh-loose); /* 1.75 */ }
.body--lg       { font-size: var(--text-lg); /* 20px */ line-height: var(--lh-loose); /* 1.75 */ }
```

**USAGE MAPPING:**

| Page | Element | Old class | Old size/weight | New class | Change |
|------|---------|-----------|-----------------|-----------|--------|
| index.html | Hero body | `.hero-body` | 20px/400/1.6 | `.body--lg` | ✓ 20px was correct — now standardised |
| index.html | Story body | `.story-body` | undefined/homemade | `.body` | ✗ Was inline in index.html — now uses system |
| privacy.html | Short version | `.body-text` | undefined | `.body` | ✗ Was undefined — now gets 16px body |
| privacy.html | What we hold | `.body-text` | undefined | `.body` | ✗ Was undefined — now gets 16px body |
| privacy.html | Where it lives | `.body-text` | undefined | `.body` | ✗ Was undefined — now gets 16px body |
| about.html | Sub-headings | `.sub` | undefined | `.body--dim` | ✗ Was undefined — now gets 16px dimmed body |
| book/index.html | Form intro | `.section-body` | undefined | `.body--lg` | ✗ Was undefined — now gets 20px body |
| book/index.html | Info panel body | `.book-info-body` | var(--text-base) | `.body` | ~ Was using undefined token — now uses system |
| security/index.html | Answers | `.security-a` | undefined | `.body` | ✗ Was undefined — now gets 16px body |
| security/index.html | Sub-text | `.sub` | undefined | `.body--dim` | ✗ Was undefined — now gets 16px dimmed body |
| operations-audit/index.html | Intro | `.sub` | undefined | `.body` | ✗ Was undefined — now gets 16px body |
| operations-audit/index.html | Note | `.sub` | undefined | `.body--dim` | ✗ Was undefined — now gets 16px dimmed body |
| 404.html | Message | `.sub` | undefined | `.body--dim` | ✗ Was undefined — now gets 16px dimmed body |

**KEY FINDING:** `.sub`, `.body-text`, `.section-body`, `.security-a`, `.book-info-body` were all undefined in shared CSS. They rendered with browser defaults (usually 16px, sometimes inherited). Now they all map to the deliberate type scale.

---

### Headings — `.h1`, `.h2`, `.h3`

```css
.h1 { font-size: var(--h1); font-weight: 300; line-height: 1.05; letter-spacing: -0.025em; }
.h2 { font-size: var(--h2); font-weight: 300; line-height: 1.05; letter-spacing: -0.025em; }
.h3 { font-size: var(--h3); font-weight: 500; line-height: 1.05; letter-spacing: -0.02em; }
```

**USAGE MAPPING:**

| Page | Element | Old class | Old size/weight | New class | Change |
|------|---------|-----------|-----------------|-----------|--------|
| index.html | Hero headline | `.hero-headline` | clamp(64–110px)/300/1.0/-0.035em | `.display` | ~ Same scale, standardised letter-spacing |
| index.html | Story headline | `.story-headline` (h2) | clamp(48–72px)/300/1.05/-0.025em | `.h2` | ~ Was using homemade clamp — now uses system `--h2` (40px) |
| index.html | Enemy headline | `.enemy-headline` (h2) | clamp(48–72px)/300/1.05/-0.025em | `.h2` | ~ Same — standardised |
| index.html | Proof headline | `.proof-headline` (h2) | clamp(48–72px)/300/1.05/-0.025em | `.h2` | ~ Same — standardised |
| index.html | Difference headline | `.difference-headline` (h2) | clamp(40–56px)/300/1.1/-0.025em | `.h2` | ~ Was 40–56px clamp — now 40px fixed (more consistent) |
| index.html | Redacted headline | `.redacted-headline` (h2) | clamp(40–56px)/300/1.1/-0.025em | `.h2` | ~ Same — standardised |
| index.html | Human headline | `.human-headline` (h2) | clamp(40–56px)/300/1.1/-0.025em | `.h2` | ~ Same — standardised |
| index.html | Offer price | `.offer-price` | clamp(64–110px)/300/1.0/-0.035em | `.display` | ✓ Same — now uses `.display` utility |
| index.html | Final CTA headline | `.final-cta-headline` (h2) | clamp(40–56px)/300/1.1/-0.025em | `.h2` | ~ Same — standardised |
| privacy.html | Page title | `h1` | undefined (browser default) | `.h1` | ✗ Was unstyled — now 56px/300 with tight spacing |
| about.html | Page title | `h1` | undefined | `.h1` | ✗ Was unstyled — now 56px/300 with tight spacing |
| book/index.html | Page title | `h1` | undefined | `.h1` | ✗ Was unstyled — now 56px/300 with tight spacing |
| security/index.html | Page title | `h1` | undefined | `.h1` | ✗ Was unstyled — now 56px/300 with tight spacing |
| operations-audit/index.html | Page title | `h1` | undefined | `.h1` | ✗ Was unstyled — now 56px/300 with tight spacing |
| 404.html | Page title | `h1` | undefined | `.h1` | ✗ Was unstyled — now 56px/300 with tight spacing |
| book/index.html | Step titles | `h3` | var(--text-base)/500 | `.h3` | ~ Was using undefined token — now 28px/500 |

**KEY FINDING:** Every sub-page had an unstyled `<h1>`. They rendered as browser-default 2em (32px), weight 400, with default line-height. Now they're 56px/300/1.05/-0.025em — a dramatic improvement in presence and consistency. The homepage was the only page with styled headings, using homemade clamp() values that varied per section.

---

### Display — `.display`, `.display-lg`

```css
.display     { font-size: var(--display);     /* clamp(64–110px) */ font-weight: 300; line-height: 1.0; letter-spacing: -0.035em; }
.display-lg  { font-size: var(--display-lg);  /* clamp(72–130px) */ font-weight: 300; line-height: 1.0; letter-spacing: -0.035em; }
```

**USAGE MAPPING:**

| Page | Element | Old | New | Change |
|------|---------|-----|-----|--------|
| index.html | Hero headline | `.hero-headline` (inline styles) | `.display` | ✓ Standardised — same size, now a utility class |
| index.html | Hero brand wordmark | `.hero-brand .logo-wordmark` (22px/600) | `.display-lg` (for the SVG text only) | ~ Wordmark stays at 22px; the SVG text inside it is separate |
| index.html | Offer price | `.offer-price` (inline styles) | `.display` | ✓ Standardised |
| index.html | Story stat number | `.story-stat-number` (56px/300) | `.h1` (or keep as custom) | ~ 56px stat numbers map to `--h1` size but keep their custom styling |

---

### Caption — `.caption`

```css
.caption          { font-size: var(--caption); /* 13px */ line-height: 1.0; letter-spacing: -0.01em; color: var(--text-dim); }
.caption--strong  { font-weight: 500; color: var(--text); }
.caption--faint   { color: var(--text-faint); }
```

**USAGE MAPPING:**

| Page | Element | Old class | Old size | New class | Change |
|------|---------|-----------|----------|-----------|--------|
| index.html | Nav links | `.nav-link` | 13px/500 | `.caption` + `.caption--strong` | ~ Same size, now uses system |
| index.html | Nav CTA | `.nav-cta` | 13px/600 | `.caption` + `.strong` | ~ Same size, now uses system |
| index.html | Footer copy | `.footer-copy` | 13px/400 | `.caption--faint` | ✓ Same — standardised |
| index.html | Footer links | `.footer-link` | 13px/500 | `.caption--strong` | ✓ Same — standardised |
| privacy.html | Footer | `.caption` | 13px | `.caption--faint` | ~ Same — standardised |
| about.html | Footer | `.caption` | 13px | `.caption--faint` | ~ Same — standardised |
| book/index.html | Footer | `.caption` | 13px | `.caption--faint` | ~ Same — standardised |
| security/index.html | Footer | `.caption` | 13px | `.caption--faint` | ~ Same — standardised |
| operations-audit/index.html | Footer | `.caption` | 13px | `.caption--faint` | ~ Same — standardised |
| 404.html | Footer | `.mono` | undefined | `.caption--faint` + `.mono` | ✗ Was undefined — now gets 13px faded |

---

### Micro — `.micro`

```css
.micro { font-size: var(--micro); /* 11px */ line-height: 1.0; letter-spacing: 0.02em; color: var(--text-faint); }
```

**USAGE MAPPING:**

| Page | Element | Old | New | Change |
|------|---------|-----|-----|--------|
| book/index.html | Fineprint | `.fineprint` (14px) | `.micro` (11px) or `.body--sm` | ✗ Fineprint was 14px — reconsider: 11px may be too small for readability. Suggest `.body--sm` (15px) for form fineprint. |
| book/index.html | Form messages | `.form-msg` (16px/500) | `.body` + `.strong` | ~ Standardised |
| book/index.html | Step numbers | `.step-num` (var(--text-xs)/500) | `.caption` + `.strong` | ~ 14px step numbers → caption size |

---

## Weight as Design Tool — Rules

| Context | Weight | Why |
|---------|--------|-----|
| Display headlines (`.display`, `.display-lg`, `.h1`, `.h2`) | 300 | Light weight at large size = editorial, cinematic, confident. The contrast between 300 at 110px and 600 at 12px is the core typographic tension. |
| Body text (`.body`, `.body--lg`, `.body--lead`) | 400 | Normal weight for reading. Never 300 for body — too insubstantial. Never 500+ — too heavy for long-form. |
| Labels/eyebrows (`.label`) | 600 | Bold enough to command attention at 12px. The uppercase + letter-spacing + 600 weight is the brand's "archival document" signature. |
| Captions/nav/footer links | 400 default, 500 for emphasis | Nav links at 500 give them presence without heaviness. Footer copyright at 400 stays quiet. |
| Subsection headings (`.h3`) | 500 | Slightly heavier than body to establish hierarchy, lighter than labels to stay in the heading family. |
| Buttons/CTAs | 600 | Command attention. The CTA is the action point — it should feel deliberate. |

---

## Line-height as Design Tool — Rules

| Context | Line-height | Why |
|---------|-------------|-----|
| Display/headlines | 1.0 | Letters sit on the baseline. At 64px+, even 1.0 has visual breathing room because the letters are large. Tight = confident, cinematic. |
| Section headings (h1/h2/h3) | 1.05 | One notch of breathing room. Prevents the heading from feeling cramped while staying tight. |
| Body text | 1.6 | Optimal for 16px Inter. 1.5 would be slightly tight; 1.6 gives comfortable reading rhythm. |
| Lead/large body (18–20px) | 1.75 | Larger text needs more line spacing to feel breathable. 1.75 at 20px = same absolute line height as 1.6 at 16px (32px). |
| Labels/captions/micro | 1.0 | Single-line elements. No need for multi-line spacing. |

---

## Letter-spacing as Design Tool — Rules

| Context | Letter-spacing | Why |
|---------|---------------|-----|
| Display headlines | -0.035em | Negative tracking at large sizes pulls letters together into a solid block. Cinematic. The Mirofish signature. |
| Section headings | -0.025em | Slightly less negative than display — still tight but not as aggressive. |
| Body text | +0.01em | Nearly neutral. A hair of positive spacing improves readability at small sizes without feeling spaced out. |
| H3 subsections | -0.02em | Between heading and body — tighter than body, looser than display. |
| Labels/eyebrows | +0.15em | Positive tracking on uppercase 12px text = authoritative, archival, "document" feel. This is the most distinctive typographic signature on the site. |
| Captions | -0.01em | Nearly neutral, slightly tight. Nav links and footer text shouldn't feel spaced out. |
| Micro | +0.02em | A touch of breathing room at 11px so individual characters remain distinguishable. |

---

## What Changes on Each Page

### Homepage (index.html)

**Current state:** Has inline `<style>` with its own type system. Uses 9 different label class names that are visually identical. Uses homemade clamp() values. No `.body` utility. No `.caption` utility. Headings styled inline.

**Changes:**
1. Replace all 9 label class names (`.hero-label`, `.enemy-label`, `.proof-label`, `.difference-label`, `.redacted-label`, `.human-label`, `.offer-label`, `.final-cta-label`, `.story-label` if it exists) with `.label`
2. Replace `.hero-headline` with `.display`
3. Replace `.story-headline`, `.enemy-headline`, `.proof-headline`, `.difference-headline`, `.redacted-headline`, `.human-headline`, `.final-cta-headline` with `.h2`
4. Replace `.hero-body` with `.body--lg`
5. Replace `.story-body` with `.body`
6. Replace `.proof-intro` with `.body--lead`
7. Replace `.difference-item` text with `.body--lg`
8. Replace `.redacted-item-body` with `.body`
9. Replace `.human-sub` with `.body--lg`
10. Replace `.offer-desc` with `.body--lg`
11. Replace `.offer-list-item` text with `.body--lg`
12. Replace `.final-cta-sub` with `.body--lg`
13. Replace `.offer-price` with `.display`
14. Replace nav link styles with `.caption` + `.caption--strong`
15. Replace footer link styles with `.caption--strong`
16. Replace footer copy with `.caption--faint`
17. Remove inline `<style>` type rules — keep only page-specific layout (grid, positioning, colors)
18. Add `<link rel="stylesheet" href="assets/typography.css">` if not already present

**Note:** The homepage has `<link rel="stylesheet" href="assets/typography.css">` already on line 36. But it also has its own massive inline `<style>` block that overrides/defines everything. The inline block should be trimmed to only layout-specific CSS.

### Privacy page (privacy.html)

**Current state:** Uses `.label` (undefined), `.sub` (undefined), `.body-text` (undefined), `.never-label` (undefined), `.never-body` (undefined), `.caption` (undefined), `.p-brand` (undefined).

**Changes:**
1. `.label` → now styled (was broken before)
2. `.sub` → replace with `.body--dim`
3. `.body-text` → replace with `.body`
4. `.never-label` → replace with `.label`
5. `.never-body` → replace with `.body`
6. `.caption` → replace with `.caption--faint`
7. `.p-brand` → needs its own style (brand tagline in footer) — add as `.footer-brand-text` with `.body--sm` + `.text-dim`
8. `.cta-row` → now defined in typography.css
9. `.btn` → now defined in typography.css

### About page (about.html)

**Current state:** Uses `.label` (undefined), `.sub` (undefined), `.p-brand` (undefined).

**Changes:**
1. `.label` → now styled
2. `.sub` → replace with `.body--dim`
3. `.p-brand` → add as `.footer-brand-text`
4. `.cta-row` → now defined
5. `.btn` → now defined

### Book page (book/index.html)

**Current state:** Most complex page. Has its own `<style>` block with form styles. Uses `.label` (undefined), `.sub` (undefined), `.section-body` (undefined), `.book-info-body` (undefined), `.book-info-num` (undefined), `.book-info-text` (undefined), `.step-num` (undefined), `.step h3` (undefined), `.step p` (undefined), `.fineprint` (undefined), `.form-msg` (undefined), `.caption` (undefined).

**Changes:**
1. `.label` → now styled
2. `.sub` → replace with `.body--dim`
3. `.section-body` → replace with `.body--lg`
4. `.book-info-body` → replace with `.body`
5. `.book-info-num` → replace with `.caption` + `.strong` + signal color
6. `.book-info-text` → replace with `.body--sm`
7. `.step-num` → replace with `.caption` + `.strong` + signal color
8. `.step h3` → replace with `.h3`
9. `.step p` → replace with `.body`
10. `.fineprint` → replace with `.body--sm` + `.text-dim` (15px, not 11px — too small for form context)
11. `.form-msg` → replace with `.body` + `.strong`
12. `.caption` → replace with `.caption--faint`
13. Keep form-specific styles (input, textarea, field, validation) in page `<style>` — those are UI, not typography
14. Remove font-size/line-height/letter-spacing from `.field label`, `.field input`, `.fineprint`, `.form-msg`, `.step-num`, `.step h3`, `.step p`, `.book-info-num`, `.book-info-text` — let typography.css handle it

### Security page (security/index.html)

**Current state:** Uses `.label` (undefined), `.sub` (undefined), `.security-q` (undefined), `.security-a` (undefined), `.caption` (undefined).

**Changes:**
1. `.label` → now styled
2. `.sub` → replace with `.body--dim`
3. `.security-q` → replace with `.h3` (28px/500 — questions are subsection headings)
4. `.security-a` → replace with `.body`
5. `.caption` → replace with `.caption--faint`
6. `.cta-row` → now defined
7. `.btn` → now defined

### Operations audit page (operations-audit/index.html)

**Current state:** Uses `.label` (undefined), `.sub` (undefined), `.redacted-audit-label` (undefined), `.redacted-audit-num` (undefined), `.redacted-audit-title` (undefined), `.redacted-audit-body` (undefined), `.caption` (undefined).

**Changes:**
1. `.label` → now styled
2. `.sub` → replace with `.body`
3. `.redacted-audit-label` → replace with `.label`
4. `.redacted-audit-num` → replace with `.caption` + `.strong` + signal color
5. `.redacted-audit-title` → replace with `.label` (it's already uppercase/label-like)
6. `.redacted-audit-body` → replace with `.body`
7. `.caption` → replace with `.caption--faint`
8. `.steps` → now defined in typography.css
9. `.cta-row` → now defined
10. `.btn` → now defined

### 404 page (404.html)

**Current state:** Uses `h1` (unstyled), `.sub` (undefined), `.mono` (undefined), `.foot` (undefined).

**Changes:**
1. `h1` → add `.h1` class
2. `.sub` → replace with `.body--dim`
3. `.mono` → replace with `.caption--faint` + `.mono`
4. `.foot` → replace with `.footer`
5. Remove inline SVG symbol defs (the old logo geometry) — use `.lk` from site.css instead

---

## Logo consistency note

The homepage uses inline SVG logos in three places (nav, hero, human-architect). Sub-pages use `<span class="lk"></span>` (CSS mask) or inline SVG with the same geometry. The `.lk` class in `assets/site.css` is the single source of truth for sub-pages. The homepage should also use `.lk` for consistency, or at minimum use the same SVG geometry.

The `assets/site.css` `.lk` class uses a CSS mask with inline SVG data URI. This is the correct approach — one logo geometry, defined once, used everywhere via a class.

---

## Files modified

- **`/tmp/twinthos-site/assets/typography.css`** — COMPLETELY REWRITTEN. 596 lines. Complete 14-level type scale, all utility classes, label/eyebrow system, body variants, heading system, display system, caption system, micro system, container system, button system, footer system, reveal system, steps system, responsive breakpoints, reduced motion.

---

## Files that need updating (HTML class replacements)

These are the HTML changes needed to use the new typography system. They're documented here for the developer to apply:

1. **index.html** — replace 9 label class names with `.label`, replace all heading/body classes with system utilities, trim inline `<style>`
2. **privacy.html** — replace `.sub`, `.body-text`, `.never-label`, `.never-body`, `.caption`, `.p-brand`
3. **about/index.html** — replace `.sub`, `.p-brand`
4. **book/index.html** — replace `.section-body`, `.book-info-body`, `.book-info-num`, `.book-info-text`, `.step-num`, `.step h3`, `.step p`, `.fineprint`, `.form-msg`, `.caption`
5. **security/index.html** — replace `.sub`, `.security-q`, `.security-a`, `.caption`
6. **operations-audit/index.html** — replace `.sub`, `.redacted-audit-label`, `.redacted-audit-num`, `.redacted-audit-title`, `.redacted-audit-body`, `.caption`
7. **404.html** — replace `h1`, `.sub`, `.mono`, `.foot`

---

## Design principles applied

1. **One label pattern everywhere** — 12px/600/0.15em/uppercase/text-dim. The same class, the same look, on every page, in every section. This is the site's typographic signature.

2. **Weight as hierarchy, not decoration** — 300 for display (light, airy, editorial), 400 for body (neutral, readable), 600 for labels (authoritative). No random weight choices.

3. **Line-height as rhythm tool** — Tight (1.0) for display, 1.05 for headings, 1.6 for body, 1.75 for lead. Each level has a deliberate breathing room that matches its size.

4. **Letter-spacing as tone tool** — Negative for display (cinematic, tight), near-zero for body (neutral), positive for labels (archival, spaced). The contrast between -0.035em at 110px and +0.15em at 12px is the core tension.

5. **Consistent scale, not per-section customization** — Every section heading is `--h2` (40px). Every page title is `--h1` (56px). Every label is `--label` (12px). No more per-section clamp() variations.

6. **Body text is 16px everywhere** — No more 18px here, 20px there, undefined elsewhere. 16px body, 18px lead, 20px emphasis. Predictable.

7. **Sub-pages are no longer second-class** — They used to have unstyled headings and undefined body text. Now they use the same system as the homepage.
