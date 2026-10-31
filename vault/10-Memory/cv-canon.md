---
type: canon
created: 2026-10-28
---

# CV canon

Single source of truth for every CV build. Numbers here are the approved set.

## Identity
- **Name on CV**: Tyson Mandela.
- **Title line**: AI systems architect · Content creator · Founder, Twinthos.
- **Location**: Bath / Bristol, United Kingdom.
- **Contact**: hello@twinthos.com · twinthos.com · github.com/twinthos.
- **No phone number** — the 7912 345678 line is a placeholder.
- **GitHub is github.com/twinthos** — never `alkalinearchitect`.

## Approved metrics
| Metric | Value | Source |
|---|---|---|
| Monthly views (peak) | ~20 million | Tyson, stated — this is the only view figure to use |
| Community size (peak) | 2,000 students, all courses designed by him | Tyson, stated |
| Books published | 6, pen name | Tyson, stated |
| Prospect register | 114 UK firms, 100 named decision-makers | target-register.json |
| Market book | 83 pages, 314 source links, 77/80 re-confirmed | audit artefacts |
| Instagram followers | 500,000, account sold to Jason van Blerk (The Human Garage) | Tyson, stated |
| GitHub | github.com/twinthos, 2 public repos, 121 commits | GitHub API, 28 Oct 2026 |
| Companies | Twinthos (live), HumanitAI CIC 16891121 | Companies House |

## Structure that works
1. Header: name, title, contact — clean two-row block, no floating right column.
2. Summary: four lines, one claim, one number.
3. Selected impact: metric band (20M / 2,000 / 6 / 114).
4. Experience: three roles, each with a fixed-width label rail
   (What / Scale / Method / Outcome) so every line aligns on one vertical edge.
5. Capabilities: two columns, grouped by discipline.
6. Education and training: only verified entries.
7. Proof: links.

## Current build (v12, 28 Oct 2026) — elite minimalism, recruiter-clean

- `/root/twinthos-brain/audit/tyson-mandela-cv-2026.pdf` — send this.
- `/root/twinthos-brain/audit/tyson-mandela-cv-2026.docx` — ATS twin, same content.
- Builder: `/root/.hermes/cache/scratch/build_cv_v12.py`; gate: `cv_v12_gate.py` (43 checks, all passing).
- Delivered: Telegram 5268 (PDF), 5269 (DOCX).
- v12 removed every internal metric that had crept in: 114-firm prospect list, 173 backup paths,
  314 source links, 24-check auditor, £2,500 / £750–£950 pricing, 121 commits. A recruiter cannot
  interpret them; they made the page read like a dashboard. Only audience, students, books, money stay.
- Row labels are now WHAT / ROLE / HOW / BUILT / AUDIENCE / COMMUNITY / BOOKS / EXIT, and on page 2
  BRIEF / DID / NOW / APPROACH / MEASURED BY. "Founder & CEO" became "Founder": CEO in a
  one-person company invites the contradiction question.
- Page 1: header, metric line, profile, three roles. Page 2: one case study, capabilities,
  proof, how I work, training.
- v10 (navy, Inter throughout, metric band) is retired. Its builder and gate are kept for history.

## Design rules (v11)
- Monochrome. No accent colour, no filled bands, no boxes. One hairline per section.
- Name in Cormorant Garamond Light 44pt; everything else Inter. Nothing below 6.3pt.
- Asymmetric header: name left, four-line contact block right-aligned to the same edge.
- Metric line is caps at 7pt, numbers at 600 weight, separated by thin middots — not a table.
- Section labels 6.5pt caps at .28em tracking with a 0.5pt rule above. Never track past .3em:
  pdftotext starts inserting spaces between letters and the text stops being searchable.
- Label rail is a fixed 54pt table cell; body 9.1pt at 1.48 line-height; 22mm side margins.
- Running foot: name left, "n / 2" right, both 6.3pt at #a8a8a8. It anchors the page; without
  it both pages read as floating.
- Both pages must end within 12–20mm of the 282mm text-box line. Measure with PIL: find the
  last ink row in the render, not by eye.

## Design rules
- A4, two pages, single column, 15mm–18mm margins.
- Fixed label column via CSS grid (`grid-template-columns: 92pt 1fr`) — this is what
  kills the "text is off" misalignment. Never right-align a contact block against a
  left-aligned name.
- Body 10.5pt, line-height 1.25, one accent colour (navy `#0A2540`), rules at 0.5pt.
- Fonts embedded and checked with `pdffonts`; text order checked with `pdftotext -layout`.

## Never claim

- Any view figure other than 20M/month — no 359,926, no 71 videos, no 300k.
- `alkalinearchitect` as the GitHub account.
- 289 commits or 21 repositories — the real figures are 121 commits and 2 public repos.
- 
- MSc Artificial Intelligence, University of Bristol — unverified.
- `16891121` anywhere except the HumanitAI CIC line — it is a company number.
- "Alkaline Architect" / "Tyson Murray" — public fraud allegations attach to that name.
- "Wrote 5,200 lines of Python" — he directs the agent that writes it.
