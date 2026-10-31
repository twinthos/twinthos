# CV Design Audit — 2026 standards (Tyson Mandela)

Audited 2026-10-31. Method: measured PDF data (page geometry, embedded fonts,
per-line font sizes via pdfminer, full text extraction, ATS text-layer tests).
Vision pass was blocked by an external fair-share rate limit, so visual claims
below are marked where they are inferred rather than seen.

## Files audited

| File | Format | Pages | Name | Name size | Body | Heads | Fonts |
|---|---|---|---|---|---|---|---|
| `artis/cv-v11.pdf` | **16:9 landscape 792×445.5pt** | 2 | "Tyson" (no surname) | 62pt | 23pt | 19pt (3-col tags) | Geist-Mono, Inter-Tight, IBM-Plex-Serif |
| `artis/cv-v11-black.pdf` | **16:9 landscape 792×445.5pt** | 2 | "Tyson" (no surname) | 62pt | 23pt | 19pt (3-col tags) | same (dark edition) |
| `twinthos-brain/audit/tyson-mandela-cv-v16-a4.pdf` | A4 portrait 595.28×841.89pt | 2 | "Tyson Mandela" | 34pt | 15pt | 12.5pt (upper) | Cormorant-Garamond (name), Inter (body) |
| `cv-2026-10-30/tyson-mandela-cv-deep.md` (source copy) | — | — | full | — | — | — | 1258 words |

Word counts in the shipped PDFs: cv-v11 = 173 words; v16-a4 = 366 words;
source copy = **1258 words**. No PDF renders the current copy.

---

## CRITICAL defects (must fix before any send)

1. **Leaked build spec in the text layer — both cv-v11 files.**
   `pdftotext` extracts, verbatim, the generation prompt:
   `AI status: NO AI FOUND — all copy founder-written; spec below Spec: world class /
   stunning design large enough text black background white text elite`.
   This is visible to any ATS and to any recruiter who opens the file. Remove the
   spec string from the HTML source before rendering. v16-a4 is clean.

2. **Wrong page format — cv-v11 files are 16:9 landscape (792×445.5pt).**
   A CV is A4 portrait. 16:9 landscape will not fit standard CV review, printing,
   or most ATS upload pipelines, and reads as a slide, not a CV. v16-a4 is correct A4.

3. **Dropped surname — cv-v11 files show only "Tyson".**
   The candidate record and Companies House use "Tyson Mandela Murray" / "Tyson
   Mandela". A CV under a first name only is unusable for a formal send. v16-a4
   has the full name.

4. **Content gap — every PDF is a shadow of the current copy.**
   The deep.md source is 1258 words with 3 fully-bulleted roles, a "What I do"
   section, "How I develop my AI practice", "Core skills", "Selected work and
   evidence", "Methods", "Tools", and "Publications". v16-a4 renders only 366
   words — one bullet per role, and it **drops Publications, Education, and
   Certifications entirely**. cv-v11 renders 173. Rebuild the A4 from the deep.md
   copy; do not ship any of these three as-is.

---

## Findings by audit dimension

### Visual hierarchy
- **v16-a4 inverts hierarchy: section headings (12.5pt) are SMALLER than body (15pt).**
  Headings only pass as headings because they are uppercase. 2026 norm wants
  headings (14–16pt) to dominate body (10.5–12pt). Fix: raise section heads to
  ≥15pt (ideally 16pt) OR reduce body toward 12pt — not 12.5 < 15.
- **cv-v11 name is 62pt against 23pt body** — strong top-down hierarchy, but the
  scale gap is poster-like, not CV-like.
- Running footer on v16 ("Tyson Mandela · Curriculum vitae 1/2") is good page
  furniture; cv-v11 has none.

### Typography
- v16-a4 pairing (Cormorant-Garamond serif display name + Inter sans body) is a
  tasteful editorial choice and Inter is a named 2026-standard face. ✓
- cv-v11 mixes **three** families (Geist-Mono + Inter-Tight + IBM-Plex-Serif).
  Mono + sans + serif reads busy for a CV; drop to two. Inter-Tight is non-standard
  for ATS; plain Inter is safer.
- All fonts are embedded (`emb yes`) in every file — no fallback defect. ✓
- **ATS heading-token test passes on v16** (SUMMARY/SKILLS/EXPERIENCE/… extract as
  single tokens, no spaced-glyph tracking bug). cv-v11 uses non-standard lowercase
  section names ("Relevant experience", "SELECTED BUILD — Document assistant") that
  an ATS keyword match will not map to standard sections.

### Color scheme
- v16-a4 appears monochrome (light bg, dark ink, gray footer) — consistent with the
  approved "no accent" house style. *(Inferred; vision was blocked.)*
- cv-v11-black is the dark edition (dark bg / white text, per the leaked spec line
  "black background white text"). Dark CVs are a valid edition but must be paired
  with a light ATS twin — never sent to an unknown recruiter system.
- No evidence of a single disciplined accent in any file; all are accent-free
  monochrome, which matches the conservative 2026 direction. ✓

### Spacing / white space
- v16-a4 left margin = 57pt (≈2.0cm) and single column — matches the 2026 "2cm
  margins, single column" norm. ✓
- cv-v11 content runs near full width with a 3-column role-tag block at the top
  (tags at x=0 / 268 / 536) — columns-for-layout, which 2026 ATS guidance discourages.
- v16-a4 page 2 shows large trailing dead space (footer at y≈20, last ink ~y=762 of
  842) — the thin copy leaves the page under-filled. Fix by rebuilding from full
  copy (raises fill) rather than enlarging type to fake fullness.

### Section ordering / scannability
- v16-a4 order: SUMMARY → SKILLS → EXPERIENCE → EARLIER CAREER → PROOF →
  TECHNICAL SKILLS. Skills appear **twice** (SKILLS on p1, TECHNICAL SKILLS on p2) —
  dedupe to one high-on-page skills block.
- "PROOF" (raw links) is a non-standard section label; fold links into contact or a
  "Selected work" section with named artefacts.
- Skills are high on the page (2nd section) — good for the 6–7 second scan. ✓
- deep.md's order (Summary → What I do → Core skills → Experience → Selected work →
  Methods → Tools → Publications) is the stronger structure; port it to the A4.

### ATS translation
- v16-a4: clean text layer, standard uppercase headings, single column, real bullet
  structure — **ATS-safe**. ✓ (One check to run post-rebuild: confirm heading
  tracking stays ≤0.3pt so headings don't fragment — currently fine.)
- cv-v11: 16:9 landscape + 3-column top block + non-standard section names + leaked
  spec + oversized type = **poor ATS fit**. The light file is also unusable as
  delivered; the dark file must never go to an unknown parser.
- Parser hygiene: v16 uses en-dash "–" as bullets; the approved canon prefers a real
  bullet glyph (•, U+2022) with a hanging indent for clean list extraction.

---

## Specific improvements (before → after)

1. Format: `792×445.5pt 16:9 landscape` → `595.28×841.89pt A4 portrait`.
2. Name: `"Tyson" @ 62pt` → `"Tyson Mandela" @ 22–26pt` (2026 norm 18–22pt; 34pt on
   v16 is acceptable-but-large; 62pt is poster).
3. Body: `23pt (cv-v11)` / `15pt (v16)` → `11–12pt` to match 2026 body norm, OR keep
   15pt deliberately for screen and raise headings to ≥16pt so hierarchy is correct.
4. Section heads: `12.5pt (smaller than body)` → `16pt bold uppercase, tracking ≤0.3pt`.
5. Leaked spec line: present in both cv-v11 files → **remove from source**; verify
   with `pdftotext file.pdf - | grep -iE 'spec:|stunning|NO AI FOUND|elite'` returns nothing.
6. Surname: `"Tyson"` → `"Tyson Mandela"` everywhere.
7. Fonts: 3 families (Geist-Mono/Inter-Tight/IBM-Plex-Serif) → 2 (Inter body + one
   serif for the name only). Plain Inter, not Inter-Tight, for ATS safety.
8. Skills: two blocks (SKILLS + TECHNICAL SKILLS) → one, high on page.
9. Sections: add the dropped **Publications** (6 books under pen name) and, if
   present in canon, Education/Certifications; rebuild from deep.md (1258 words).
10. Bullets: en-dash "–" → real bullet "•" with hanging indent.
11. Ship two artefacts from one copy: a light A4 PDF for humans/ATS and a matching
    DOCX as the ATS twin (identical text, never a re-typed summary).

## Recommended 2026-compliant A4 target spec
- A4 portrait, single column, 2cm (57pt) margins, 2 pages max.
- Name 22–26pt; headline 14–16pt; section heads 16pt bold uppercase (tracking ≤0.3pt);
  body 11–12pt (or 15pt only if headings are raised to dominate); running footer with
  page numbers.
- Section order: Summary → Core skills (8–12 phrases, JD wording) → Experience
  (full bullets from deep.md) → Selected work → Methods/Tools → Publications.
- One accent or none; left-aligned; real bullet glyphs; contact in the body.
- Build light PDF + DOCX twin from the deep.md copy; gate with the ATS text-layer
  and heading-token tests before send.
