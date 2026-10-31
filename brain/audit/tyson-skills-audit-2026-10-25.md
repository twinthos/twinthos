# Skills, mindset and assets — audit before the CV rebuild

Audited 25 October 2026. Everything below was checked against a file, a live URL or a command run during this audit. Where a number could not be verified it says so.

## What is actually evidenced

**Build and ship**
- 21 public repositories on github.com/alkalinearchitect, account created 20 October 2024.
- 15 of them serve a live site today (HTTP 200 checked one by one, 25 Oct 2026).
- twinthos.com returns 200; sitemap holds 24 URLs.
- 289 commits in 18 days in the live site repo, 5–23 October 2026.

**Systems, not pages**
- A document pipeline: `build_doc.py` 526 lines + `pdf_gate.py` 353 lines, nine machine checks (geometry, margins, clipping, page fill, type sizes, text-layer damage, links, metadata, contrast).
- A site auditor: 32 pages × 24 checks; drove local findings to zero; named the eight that only DNS could fix.
- A knowledge layer of 208 files with an INDEX-first, cite-the-path rule, built to escape a 4,000-character memory cap that was 99% full.
- Disaster recovery that was proven, not asserted: file deleted, restored byte-identical (sha256 77f749d7…), 203 MB private mirror, 339 completed backup runs.

**Research with sources**
- 114-firm UK register, 100 with a named decision-maker, scored 30/33/39/12.
- Source-verification pass: 80 named people, 77 re-confirmed by re-opening the cited page, 2 published as unverified.
- 83-page book with 314 clickable source links and a "what would make me wrong" section.
- 245-advert jobs sweep, 55 training-course ads excluded and the exclusion reported.

**Security**
- Found an HTTP server bound to 0.0.0.0 serving the site's .git, and 25 secret matches in backup history (2 GitHub tokens, 2 Stripe live keys); fixed the redaction gap.

**Content and audience**
- 6 books in the bookstore repo: Alkaline Awakening, Intelligent Design, Life Force Energy, Body OS, Parasite Conspiracy, Quit PRN Manual.
- 359,926 video views across 71 videos, 27 July 2025 to 18 October 2026 — two videos carry 89.7% of the total.
- 12 articles live to a written 10-rule house style.

## Mindset, as shown by the work

1. **Truth before persuasion.** Unsourced numbers get cut, including from his own documents.
2. **Executes solo and finishes.** Product, site, copy, pipeline, backup, audit — one operator, no funding.
3. **Verifies instead of assuming.** Every claim carries a path; every gate is a script, not an opinion.
4. **Attacks his own work.** Wrote a 52-page book, then audited it to death in numbers (44 sentences over 30 words, 0 links, 4 contradictory prices) and rebuilt it at 83 pages with 314 links.
5. **Names his methods.** Loop engineering, the one page, the five-minute test, five-factor scoring — repeatable, not vibes.

## Assets

- **Twinthos** — live site, offer, pipeline, knowledge layer, agent console.
- **The knowledge tree** — 208 files, INDEX-first, hourly mirrored.
- **Tooling** — document pipeline with gate, site auditor with fix pass, source verifier, Telegram scraper.
- **Publishing engine** — 6 books, 71 videos, 12 articles, one house style.

## Two corrections made for the CV

- **"500,000 followers" is not supported.** The only numbers on record are 2,171 TikTok followers and 359,926 lifetime video views. The CV now says "71 videos, 359,926 views, no paid acquisition" — verifiable, and still a build story.
- **Client counts removed** as instructed. The CV states that the company was built end to end and does not discuss how many clients exist.

## What the CV cannot claim yet

A delivered paid engagement, revenue, or a working dashboard product. None of these appear on the CV.
