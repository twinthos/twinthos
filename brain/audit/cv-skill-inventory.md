> **SUPERSEDED 28 Oct 2026.** The figures in this file are out of date and must not be
> used in any CV, pitch or application. Superseded: 359,926 views / 71 videos (use
> ~20M views per month), 21 repositories / 289 commits (github.com/twinthos has 2 public
> repos and 121 commits), `alkalinearchitect` as the GitHub account (it is `twinthos`).
> Current source of truth: `/root/Documents/HermesVault/10-Memory/tyson-facts-canonical.md`
> and `tyson-mandela-cv-2026.pdf`.

# Tyson Mandela — Source-Bound Skill & Achievement Inventory

Audited 2026-10-25. Every line is traceable to a file path, a live URL, a command
output, or a conversation message. Items that could not be verified are in
Section E (GAPS) and are marked **[UNVERIFIED]** or **[USER-STATED]** inline where
they appear. This is raw material for a skills-first CV, not the CV itself.

Primary sources mined:
- `/root/twinthos-brain/` corpus (company/, identity/, memory/, audit/, projects/,
  sops/, scripts/, architecture/, research/, notes-*.md) and
  `/root/twinthos-brain/EVIDENCE-AUDIT-2026-10-25.txt` (40 numbered findings).
- `/root/twinthos-brain/audit/system-audit-2026-10-21.md`,
  `audit/tyson-skills-audit-2026-10-25.md`, `audit/tyson-mandela-cv.md`.
- GitHub REST (unauthenticated): `github.com/alkalinearchitect` — 21 public repos,
  account created 2024-10-20.
- Conversation history, session `local-972825b860…65911` (session_search).
- Companies House 16891121 (Humanitai CIC), verified via the `humanitai-cic` repo README.

---

## A. SKILL CATEGORIES

### A1. Agent / LLM design
- **Writes an agent job as a specification first** — inputs, outputs, decision
  rights, escalation rule, audit trail, "what it must never do".
  Source: `company/product-truth.md` (the three parts); `sops/dewey-prospecting-playbook.md` (Loop 3).
- **Designs human-in-the-loop approval** — a named human signs off consequential
  actions; "Someone has to sign off what it does. Make that one person, by name."
  Source: `identity/soul.md` (principle 8); `notes-voice-spec.md` (voice example).
- **Builds persistent-knowledge architecture (retrieval-first, not model-magic)** —
  a Company Brain that holds approved facts, decisions, project state; never invents
  a memory, never shares data across clients.
  Source: `company/product-truth.md`; `company/services.md`; `README.md` / `INDEX.md` (208-file tree).
- **Treats the underlying model as a swappable commodity input** — "the model is a
  commodity input, swappable… change the model tomorrow and the employee keeps its
  job, its knowledge and its record."
  Source: `company/product-truth.md`; `memory/decisions.md` (SI-rename caveat).
- **Specified a full delivery contract as the product** — the engagement contract
  (inputs, decision rights, escalation, evidence) was made the product, not just code.
  Source: `audit/tyson-mandela-cv.md` (Experience); `company/product-truth.md`.
- **Built an agent operations console** — FastAPI + WebSocket console with a pty
  terminal, cron, kanban and a memory store (repo `agent-os`). **[USER-STATED — from session transcript]**
  Source: session_search, session `local-972825b860…65911`, msg 91260 snippet.
- **Designed a two-component platform architecture** — Twinthos BRAIN (persistent
  intelligence layer) + Twinthos WORKFORCE (cloud digital employees), one
  infrastructure, sold separately or together.
  Source: `memory/decisions.md` (2026-10-14); `company/strategy-2027.md`.

### A2. Automation / Python / Engineering
- **Markdown → measured A4 PDF pipeline** — `build_doc.py` (526 lines) + companion
  builders `build_deck.py` (346), `build_doc_next.py` (530); real pagination,
  6-step type scale, metadata, clickable links via Chrome/CDP.
  Source: `scripts/docpipe/` (`wc -l` run 2026-10-25); `audit/EVIDENCE-AUDIT-2026-10-25.txt` §1.1.
- **Data-driven document builders, not hand-built decks** — prospect-book assembler
  (266 lines, from 82 verified firm records), first-deal pack (31 lines), next-door
  book builder (321 lines).
  Source: `audit/build_prospect_book.py`, `audit/build_first_deal.py`, `audit/build_next_door.py`; EVIDENCE-AUDIT §1.2.
- **Production cron automation with uptime evidence** — 4 Hermes cron jobs all
  `last_status: ok`; vault sync every 30 min (1,294 completed runs); full backup
  every 30–60 min (339 completed runs, last push 2026-10-21T17:53:08Z, repo 203 MB).
  Source: `audit/system-audit-2026-10-21.md`; `architecture/infrastructure.md`.
- **Key-free / session-free public scraper** — Telegram channel scraper, no bot
  token: 449 messages, 20 channels, 315,556 chars of raw JSONL, ~6 posts worth
  keeping; documented that a bot token cannot read channel history.
  Source: `scripts/telegram_scrape.py` (82 lines); `research/telegram-scrape-2026-10-21.md`; EVIDENCE-AUDIT §1.7.
- **Automated UK grant scraper (Humanitai CIC)** — key-free Python across UK
  funding bodies, weekly capture; repo `humanitai-cic` ("automated UK grant
  scraper (weekly capture)"). **[The specific "29 opportunities/week" figure is
  not in the corpus — see GAPS.]**
  Source: GitHub repo `alkalinearchitect/humanitai-cic`; `audit/tyson-mandela-cv.md`.
- **Self-hosted OSINT forecast system** — `humanitai-pulse`: free, self-hosted
  community-forecast system (OSINT + free LLM), Python.
  Source: GitHub repo `alkalinearchitect/humanitai-pulse`.
- **Static-site deploy discipline** — clone gh-pages fresh, overlay only changed
  files, refuse any diff containing a deletion, push, verify across all four GitHub
  Pages IPs after CDN propagation (with cache-busting marker polling).
  Source: `workflows/README.md`; `memory/lessons.md`; EVIDENCE-AUDIT §1.3.
- **289 commits in 18 days** on the live site repo (2026-10-05 → 2026-10-23, HEAD
  96b6e91); twinthos.com returns HTTP 200, sitemap 24 URLs.
  Source: `git log` (EVIDENCE-AUDIT §1.3); `audit/system-audit-2026-10-21.md`.
- **Stack** (stated): Python, Flask, FastAPI, REST APIs, OAuth, webhooks, JSON/CSV
  data pipelines, cron scheduling, Git, Linux, static-site + CDN operation;
  TypeScript/Next.js for the bookstore; HTML/CSS/TS for dashboards.
  Source: `audit/tyson-mandela-cv.md` (Core skills); repo language fields.

### A3. Verification / Quality
- **Nine-check machine release gate** — `pdf_gate.py` (353 lines) checks geometry,
  margins, clipping, page fill, type sizes, text-layer damage, links, metadata,
  contrast. Re-run on the 6-page audit: 0 failures, 6 type sizes, weakest contrast
  5.39:1, 7 URI entries, Author/Subject/Keywords set.
  Source: `scripts/docpipe/pdf_gate.py`; EVIDENCE-AUDIT §1.1; `system-audit-2026-10-21.md` §4.
- **Loop engineering (named method)** — write the pass test first, fix, re-run the
  identical script, treat the diff between the two JSON runs as the proof.
  Source: EVIDENCE-AUDIT §4.31; `audit/site-audit-2026-10-21-v3.md`.
- **Source verifier** — re-fetches every named/cited page before a document ships;
  80 named people, 77 re-confirmed by re-opening the cited page, 2 printed as
  unverified, 1 with no public page.
  Source: EVIDENCE-AUDIT §2.14; `audit/tyson-mandela-cv.md`.
- **Website auditor + fix pass (named method)** — 32 pages × 24 checks; local
  findings driven to 0; 8 live findings left (all DNS/Pages limits); deployed as
  commit dfb47d0 (2026-10-21 22:17).
  Source: `audit/site-audit-2026-10-21-v3.md`; `/root/twinthos_live/audit/site_audit.py`, `fix_pass1.py`; EVIDENCE-AUDIT §1.6.
- **Accessibility / contrast QA** — WCAG contrast measured (page furniture
  `#6E675E` = 5.39:1, never the old `#A9A196` at 2.45:1); mobile font-size and
  tap-target measurement; overflow/clipping checks.
  Source: `scripts/docpipe/` docpipe skill (created in session `local-7fb2800305c2…`); `notes-voice-spec.md`.
- **Attacks his own work with numbers** — audited his own 52-page book (Flesch 38 /
  grade 13.5, 22.1 words/sentence, 44 sentences over 30 words, 0 clickable links,
  4 conflicting prices, 9 duplicated headers) and rebuilt it at 83 pages with 314
  clickable links and one price ladder.
  Source: EVIDENCE-AUDIT §3.27, §3.28; `audit/deck-audit-2026-10-21.md`; `audit/pdf-audit-2026-10-21.md`.
- **Forensic review that killed his own recommendation, then published the reversal**
  — 5 independent reviewers, 4 errors admitted, output cut 12 → 6 pages.
  Source: EVIDENCE-AUDIT §3.26; `audit/report.md` / `forensic-audit-v2.pdf`.
- **Verified disaster recovery, not asserted** — deleted a knowledge file, ran the
  restore hook, file returned byte-identical (sha256 77f749d7bdfe003b, 862 bytes);
  hourly private mirror, gap-fill restore hook fires on session:start.
  Source: `architecture/infrastructure.md`; `memory/decisions.md`; EVIDENCE-AUDIT §1.4.

### A4. Document / PDF systems
- **Measured-PDF contract** — A4, 6-step type scale, body 15.5pt (~9.8pt effective
  at 375pt phone width), nothing under 9pt, footnotes 12.5pt, text ≥4.5:1 contrast,
  real `<a href>` links kept as `/Subtype /Link`, metadata Title/Author/Subject/
  Keywords/Creator, every non-cover page ≥55% full, no glyph within 6mm of edge.
  Source: `scripts/docpipe/` (telegram-pdf-pipeline skill body); EVIDENCE-AUDIT §1.1.
- **Solved hard PDF engineering problems** (each logged as a pitfall): Chrome
  `--print-to-pdf` never exits (drove CDP `Page.printToPDF` instead); metadata must
  be written as a PDF incremental update (ghostscript can't override `/Creator`);
  em dash/£ in metadata needs UTF-16BE hex; count links as `/Subtype /Link` not
  `/URI`; letter-spacing above ~.15em bakes gaps into the text layer.
  Source: `scripts/docpipe/` (Pitfalls section).
- **Volume document production** — 52-page target book (8,473 words), rebuilt as
  83-page book (14,909 words, 314 links); 4 PDFs at two page ratios (10pp laptop
  16:9 + 10pp mobile 3:4 "targets"; 8pp each "what it is").
  Source: EVIDENCE-AUDIT §3.22–§3.25; `system-audit-2026-10-21.md` §4.
- **First-contact one-pager** — 8 pages, 8 verified cleaning contractors with named
  decision-makers, a 5-sentence script, 3 pushback answers, £3,500 install /
  £1,250 per month.
  Source: EVIDENCE-AUDIT §3.24; `audit/first-deal-2026-10-21.md`; `2026-10-21_twinthos_firstdeal.pdf`.
- **Delivered these as Telegram documents** — CV mobile (5pp, 425.2×566.9pt) and
  ATS editions sent to Telegram with message IDs. **[Operational, from session]**
  Source: session_search, msg 91671 / 91710.

### A5. Research / Analysis
- **114-firm UK prospect register with a named human per firm** — 114 firms, 100
  with a named decision-maker, 8 sectors, each with size, the repeated job and a
  published contact.
  Source: `audit/target-register.md`, `audit/target-register.json` (114 records); EVIDENCE-AUDIT §2.11.
- **Weighted five-factor scoring model** — affordability .30, repeatability .25,
  speed .20, dated trigger .15, regulatory friction .10; capped 10 / floored 3;
  tiers A 30, B 33, C 39, D 12; 3 sectors dropped with stated reasons + reversal
  condition.
  Source: `audit/probability-ranking.json`; EVIDENCE-AUDIT §2.12, §4.32; `memory/decisions.md`.
- **Second-market research written as a book** — 82 firms (64 UK across 8 trades +
  18 overseas) plus 12 acquirers and 12 backers; delivered book built out to 128 UK
  firms; 14,909 words.
  Source: `audit/nextdoor-sections.json` (82 entries), `audit/next-door-2026-10-21.md`; EVIDENCE-AUDIT §2.13.
- **Software-stack research on target firms** — 24 firms profiled for the software
  they actually run (Linetime, Visualfiles, Eclipse ProClaim, Sage 50, Forward
  Solutions); 5 graded "strong" for screen-only entry; 1 window closing (Taylor
  Rose → Salesforce).
  Source: `audit/firm-status.md`, `audit/firm-status.json`; EVIDENCE-AUDIT §2.16.
- **Scripted prospect-list verification** — 24 firms (15 accountancy, 4 recruitment,
  5 freight), 23/24 confirmed by automated re-fetch, £699m accountancy fee income +
  £903m recruitment/freight turnover covered, 9 firms with a dated trigger.
  Source: `audit/prospect-list-2026-10-23.md`; EVIDENCE-AUDIT §2.15.
- **Competitor teardown from filed accounts, not marketing** — Tenhaw Ltd
  (company no. 12735685, incorporated 10 Jul 2020, ~1 avg monthly employee incl.
  director to 31 Jul 2025); seven client logos shown to be career history. 9 pages.
  Source: `tenhaw-play.pdf`; EVIDENCE-AUDIT §2.17.
- **Competitor-corpus → operating procedure** — 44 X posts with engagement figures
  → a five-loop SOP with a pass test on each loop (Dewey method).
  Source: `research/nick-vasilescu-posts.md`, `research/nick-vasilescu-playbook.md`; `sops/dewey-prospecting-playbook.md`; EVIDENCE-AUDIT §1.8.
- **Local job-market sweep** — 245 unique adverts; 55 training-course adverts
  mis-sold as jobs excluded (exclusion reported); zero AI-titled vacancies in Bath;
  one matching AEO/GEO role at £80k–£95k in London.
  Source: `audit/jobs-bath-ai-brand-2026-10-23.md`; EVIDENCE-AUDIT §2.19.
- **Computer-use agent evidence review** — corrected three of his own earlier
  claims in writing; cited OSWorld 12.24% (Apr 2024) → mid-80s (2026) vs 72.36%
  human baseline; Gartner 40% of enterprise apps to embed task agents by end-2026.
  Source: `legacy-hr-deep-research.md`; EVIDENCE-AUDIT §2.18.
- **TikTok audience analysis** — computed 71 videos, 359,926 total views
  (verified by recomputation 2026-10-25), 2025-07-27 → 2026-10-18; top two videos
  323,000 views = 89.7% of all views.
  Source: `audit/tiktok_humanarchitect8.json` (recomputed); EVIDENCE-AUDIT §2.20.
- **Prospect booking-system scrape → quantified audit** — 146 sessions, 4,031
  bookable places, 57 sold, 12–31 Oct 2026 window = 1.41% fill (recomputed).
  **[Note: an earlier headline of 344 slots / 9,632 places / 0.65% does not
  reproduce — see GAPS.]**
  Source: `/root/hotbox-audit-v19/sessions.json`; `projects/hotbox-social-demo/PROJECT.md`; EVIDENCE-AUDIT §2.21, §5.36.

### A6. Security
- **Found and fixed a real defect on his own machine** — an HTTP server bound to
  `0.0.0.0` (port 8901) serving the live site's source including `.git`; fixed by
  binding to loopback / stopping it.
  Source: `audit/system-audit-2026-10-21.md` §1; EVIDENCE-AUDIT §1.10.
- **Secrets detection + redaction-gap fix** — 25 secret matches in backup history
  (2 GitHub tokens `ghp_W6…`/`ghp_xx…`, 2 Stripe live keys); fixed the backup
  script so `history/hermes_history.txt` is redacted or withheld rather than copied
  raw.
  Source: `system-audit-2026-10-21.md` §2; EVIDENCE-AUDIT §1.10.
- **Standing secret-hygiene rules** — never commit `.env`/`auth.json`/`config.yaml`/
  SSH keys; hourly backup already excludes them; token read from `/root/.hermes/.env`
  and never printed; client brains isolated from founder memory.
  Source: `architecture/security.md`.
- **Human-oversight gate on external writes** — "Ask. Every time." before GitHub
  writes, purchases, external connections or destructive operations.
  Source: `architecture/security.md`; `identity/operating-principles.md`.
- **[OPEN GAP] The two exposed keys were never rotated** — cleaning the files does
  nothing while the old keys are valid; history stays recoverable. Flagged for the
  founder as "yours, not mine".
  Source: `system-audit-2026-10-21.md` §2 (Action line); EVIDENCE-AUDIT §5.40.

### A7. Commercial / Product
- **Product definition & positioning** — wrote the canonical "digital employee"
  definition and a structural not-vs-not table (model / chatbot / copilot / wrapper
  / retrained model / integration project / consultancy deliverable).
  Source: `company/product-truth.md`.
- **Pricing analysis with external comparables** — 4 data points (Nick Vasilescu
  $3,500 first sale; Belgian operator €2,750 + €267/mo; $15k up front then $2–3k/mo;
  UK band £750–£2,000 per role/month); recommended ladder £3,500 install / £1,250 per
  job / £2,950 for three / £999 audit; decision recorded 2026-10-23 at £3,500/month
  replacing £5,000.
  Source: `audit/next-door-2026-10-21.md` ("The price"); `company/pricing.md`; `memory/decisions.md`; EVIDENCE-AUDIT §3.29.
- **Money frame arithmetic** — one UK admin £28k × 1.25 = £35k/yr = £2,917/mo =
  £17.95/hr; Foundation £750/mo (26% of one hire); Brain+employee £5,000/mo = 1.7
  admin hires.
  Source: `company/product-truth.md` (money frame).
- **Offer & go-to-market design** — "the one page" doctrine (one job in the first
  paragraph, avg sentence <15 words, reading ease >50, a clickable link per
  doubtable claim, one price ladder, <8 pages); five-minute pre-dial test; five
  prospecting loops each with a pass test; cadence table (Mon–Fri + monthly).
  Source: EVIDENCE-AUDIT §4.33–§4.34; `sops/dewey-prospecting-playbook.md`; `audit/deck-audit-2026-10-21.md`.
- **2027 platform strategy** — BRAIN + WORKFORCE on one infrastructure; competitive
  question reframed from "which model" to "what does the system know, what is it
  authorised to do, how reliably does it complete work"; backed by McKinsey State of
  AI (25 Aug 2026) and ILO-NASK Global Index (20 May 2025).
  Source: `memory/decisions.md`; `company/strategy-2027.md`.
- **Solo operation & cost control** — one operator, no employees, no outside
  funding; principle "do not spawn unnecessary subagents or use expensive models by
  default."
  Source: `audit/tyson-mandela-cv.md`; `identity/operating-principles.md`.

### A8. Content / Publishing
- **Grew a health/nutrition audience to 359,926 views across 71 videos** with no
  paid acquisition (2025-07-27 → 2026-10-18). **[Verified by recomputation.]**
  Source: `audit/tiktok_humanarchitect8.json`; EVIDENCE-AUDIT §2.20.
- **Published 6 books under a pen name** — Alkaline Awakening, Intelligent Design,
  Life Force Energy, Body OS, Parasite Conspiracy, Quit PRN Manual (in the
  `human-architect-books` Next.js bookstore repo).
  Source: `audit/tyson-skills-audit-2026-10-25.md`; GitHub repo `human-architect-books`; `audit/tyson-mandela-cv.md`.
- **Sold the brand and social handle to Jason van Blerk of The Human Garage.**
  **[USER-STATED — background brief; no sale contract in corpus.]**
  Source: task brief; `audit/tyson-mandela-cv.md` (Experience).
- **12 articles to a written house style, all live** — 700–1,100 words each, a
  10-rule voice spec (title ≤62 chars, 700–950 words, avg sentence <18, banned
  jargon list), deployed under `/notes/`.
  Source: EVIDENCE-AUDIT §3.30; `notes-voice-spec.md`; `/root/twinthos_live/notes/`.
- **House-voice discipline** — read-aloud test, first 45 words answer the title,
  second person, one number per section, no em dashes, headings as claims.
  Source: `notes-voice-spec.md`.
- **Prior publishing/agency repos** — `philosophy` (Premium Clipping Agency, 1
  star), `human-architect-blog` (OWL-powered NHI blog), `ai-oracle` (company
  weakness/strength finder), `whoop-dash` (TypeScript dashboard).
  Source: GitHub repo descriptions.

### A9. Knowledge / Memory systems
- **Built a retrieval-first knowledge layer to escape a hard memory cap** — native
  MEMORY.md capped at 4,000 chars and 99% full (3,996 bytes); built a 208-file tree
  with an INDEX-first, cite-the-path rule.
  Source: `README.md`, `INDEX.md`, `architecture/infrastructure.md`; EVIDENCE-AUDIT §1.9.
- **Evidence-discipline governance for the tree** — "Only write a lesson here when a
  verified result supports it"; corrections log so the same error isn't repeated;
  conflict rule surfaces both records with paths rather than quietly choosing.
  Source: `memory/lessons.md`, `memory/corrections.md`, `identity/operating-principles.md`.

---

## B. ACHIEVEMENTS (quantified, each with a source)

1. **21 public GitHub repositories** under `alkalinearchitect`, account created
   2024-10-20; multiple serve live sites. Source: GitHub REST user + repos.
2. **289 commits in 18 days** on the live-site repo (2026-10-05 → 10-23). Source:
   `git log` (EVIDENCE-AUDIT §1.3); `system-audit-2026-10-21.md`.
3. **twinthos.com live** — HTTP 200, sitemap 24 URLs, /pricing /book /brain
   /workforce /ai-catalog.json all 200. Source: `system-audit-2026-10-21.md` §3.
4. **Document pipeline: 526-line builder + 353-line gate**, 9 machine checks,
   0 failures on re-run. Source: `scripts/docpipe/`; EVIDENCE-AUDIT §1.1.
5. **Site auditor: 32 pages × 24 checks**, local findings → 0, deployed dfb47d0.
   Source: `audit/site-audit-2026-10-21-v3.md`; EVIDENCE-AUDIT §1.6.
6. **Disaster recovery proven byte-identical** — sha256 77f749d7bdfe003b, 862
   bytes; 203 MB mirror; 339 backup runs. Source: `memory/decisions.md`;
   `system-audit-2026-10-21.md` §1.
7. **Vault sync 1,294 completed runs**; 4 cron jobs all `ok`. Source:
   `system-audit-2026-10-21.md` §1.
8. **114-firm UK register, 100 with a named decision-maker.** Source:
   `audit/target-register.json`; EVIDENCE-AUDIT §2.11.
9. **Source verification: 77 of 80 named people re-confirmed** by re-opening the
   cited page. Source: EVIDENCE-AUDIT §2.14.
10. **83-page market book, 314 clickable source links**, 14,909 words, one price
    ladder, a "what would make me wrong" section. Source: EVIDENCE-AUDIT §3.23.
11. **Self-audit cut a 52-page book to numbers** (Flesch 38, 44 sentences >30 words,
    4 prices) and rebuilt it 12→6 pages, 0→13 links, contrast 2.45:1→5.39:1, fill
    53–77%→82–96%. Source: EVIDENCE-AUDIT §3.27, §3.28.
12. **Forensic review with 5 reviewers** killed his own recommendation; 4 errors
    admitted; output 12→6 pages. Source: EVIDENCE-AUDIT §3.26.
13. **Telegram scraper: 449 messages, 20 channels, 315,556 chars**, no key/token.
    Source: EVIDENCE-AUDIT §1.7.
14. **Competitor corpus → SOP: 44 X posts** → five-loop playbook with per-loop pass
    tests. Source: EVIDENCE-AUDIT §1.8.
15. **Job-market sweep: 245 adverts**, 55 training ads excluded and reported.
    Source: EVIDENCE-AUDIT §2.19.
16. **359,926 video views across 71 videos**, no paid acquisition; top 2 videos =
    89.7% of total. Source: `audit/tiktok_humanarchitect8.json` (recomputed).
17. **6 books published** under a pen name. Source: `human-architect-books` repo;
    EVIDENCE-AUDIT / skills-audit.
18. **Security defect found and fixed on his own machine** — `0.0.0.0` server
    exposing `.git`; 25 secret matches in backup history; redaction gap closed.
    Source: `system-audit-2026-10-21.md` §1–§2.
19. **Pricing analysis from 4 external comparables**, ladder recorded 2026-10-23.
    Source: EVIDENCE-AUDIT §3.29; `memory/decisions.md`.
20. **12 house-style articles live** to a 10-rule spec. Source: EVIDENCE-AUDIT §3.30.
21. **Humanitai CIC active** — Companies House 16891121, verified on Companies
    House. Source: `humanitai-cic` repo README; task brief.
22. **Weighted scoring model applied across the whole register** — weights
    30/25/20/15/10; tiers A 30 / B 33 / C 39 / D 12; 3 sectors dropped with reasons.
    Source: EVIDENCE-AUDIT §2.12.

---

## C. CAPABILITIES HE CAN DO (plain-language "what I can do")

- Turn a job into an agent: write the spec first — inputs, decision rights,
  escalation, audit trail — then build it inside the tools the client already owns.
  (Source: `company/product-truth.md`; `audit/tyson-mandela-cv.md`.)
- Automate the work underneath: Python, Flask, FastAPI, REST APIs, OAuth, webhooks,
  JSON/CSV pipelines, key-free scrapers, cron scheduling.
  (Source: `audit/tyson-mandela-cv.md`.)
- Prove the output: release gates, machine checks, source re-fetching, contrast and
  overflow tests. "If it cannot be checked, it does not ship."
  (Source: `audit/tyson-mandela-cv.md`; `scripts/docpipe/pdf_gate.py`.)
- Audit a live system and name what is real: 32 pages at 24 checks each, separating
  true defects from platform/hosting limits.
  (Source: `audit/site-audit-2026-10-21-v3.md`.)
- Ship documents at volume: a 526-line pipeline that holds a house style across
  hundreds of pages without degrading, with real clickable links and metadata.
  (Source: `scripts/docpipe/`.)
- Research a market to a named person: every company, every decision-maker, every
  claim traced to the page it came from, re-checked before publication.
  (Source: `audit/target-register.md`; EVIDENCE-AUDIT §2.14.)
- Build and operate live sites and static deployment pipelines: 289 commits in 18
  days, gate-checked deploys, CDN propagation verification, disaster recovery.
  (Source: `system-audit-2026-10-21.md`; `memory/lessons.md`.)
- Run a solo operation end to end — product, site, copy, pipeline, backup, audit —
  with no employees and no funding.
  (Source: `audit/tyson-mandela-cv.md`; `identity/soul.md`.)
- Write to a strict editorial house style for owners/ops directors reading on a
  phone: plain language, short sentences, no jargon, cost + who-does-it + failure
  mode in every piece.
  (Source: `notes-voice-spec.md`.)
- Design a go-to-market as repeatable loops, each with a pass test, so delivery is
  measurable and the human only sells.
  (Source: `sops/dewey-prospecting-playbook.md`.)

---

## D. VOICE (short samples in his actual writing, quoted)

1. "A task is done when evidence says so (HTTP status, measured pixels, commit SHA)
   — not when a tool returns 'success'."
   — `identity/operating-principles.md`
2. "Say that out loud in the room. It is the sentence that makes the number credible
   and it stops the client finding the flaw for you."
   — `company/product-truth.md`
3. "The model is a commodity input, swappable. What is not swappable is the brain,
   the job definition and the history."
   — `company/product-truth.md`
4. "Someone has to sign off what it does. Make that one person, by name."
   — `notes-voice-spec.md` (house "Good" line)
5. "Truth before persuasion. If no document supports a fact, say it is unknown.
   Never fill the gap."
   — `identity/operating-principles.md`

Style markers (from the same files): short declaratives, second person, no em
dashes in client copy, headings as claims, every number sourced, willingness to
state a price or a failure plainly.

---

## E. GAPS (claimed but unverifiable — flagged)

1. **No paying client, no signed contract, no revenue, no delivered digital
   employee.** His own files state it flatly: "No client has been delivered these
   yet as a paid service" and "No paying client brain exists yet." Client counts are
   deliberately excluded from the CV per founder instruction.
   Source: `company/services.md`; `projects/company-brain-product/PROJECT.md`;
   `architecture/security.md`; EVIDENCE-AUDIT §5.35.
2. **"29 verified opportunities each week" (Humanitai CIC)** — appears in the CV but
   is not in the corpus and not in the repo README; the repo only says "weekly
   capture." **[UNVERIFIED number — keep as "weekly capture" or drop the figure.]**
   Source: `audit/tyson-mandela-cv.md`; `humanitai-cic` README (no figure).
3. **HotBox Social headline numbers do not reproduce.** A profile calls it "in
   production"/"running in a real client's systems", but the project record says
   PROSPECT, and the headline 344 slots / 9,632 places / 63 booked / 0.65% does not
   recompute — the disk data gives 146 sessions / 4,031 places / 57 sold / 1.41%.
   Use the recomputed figures or label it a prospect demo.
   Source: EVIDENCE-AUDIT §5.36; `projects/hotbox-social-demo/PROJECT.md`;
   `/root/hotbox-audit-v19/sessions.json`.
4. **Dashboard / Command Centre does not exist as software** — "No evidence found";
   the Company Brain is a local folder with isolation still a design requirement; a
   content-automation script points at an absent queue directory and emits stub text.
   Source: EVIDENCE-AUDIT §5.37; `projects/INDEX.md`;
   `projects/twinthos-dashboard/PROJECT.md`.
5. **Zero outbound selling evidenced; no audience measurement.** The send log holds
   10 entries, all PDFs to his own Telegram chat — no prospect contact, reply or
   booked call. The site carries no analytics (GA4/GTM/Plausible all absent), so no
   traffic claim can be made.
   Source: EVIDENCE-AUDIT §5.38; `logs/sends.jsonl`; `audit/site-audit-2026-10-21-v3.md`.
6. **"Engineered visibility" AEO/GEO strategy was written, never executed** — no
   submission, star or Reddit post evidenced; the 2,142 follower count it cites has
   no source file. **[The ~359,926 view count is corroborated; the follower count is
   not.]**
   Source: EVIDENCE-AUDIT §5.39; `engineered-visibility-strategy.md`.
7. **"Sold the brand and social handle to Jason van Blerk of The Human Garage"** and
   the prior ventures (Humanitai CIC, OWL, Human Architect, the clipping agency) have
   no sale/registration record inside the knowledge base beyond the TikTok view file
   and the CIC Companies House number. Treat the exit as **[USER-STATED]**.
   Source: task brief; `audit/tyson-mandela-cv.md`; EVIDENCE-AUDIT §5.40.
8. **"12 years" in the health/brand business (2013–2025)** is stated on the CV but
   no file dates the start of that venture; the TikTok data only spans 2025-07 to
   2026-10. **[USER-STATED duration — no corpus record of the 2013 start.]**
   Source: `audit/tyson-mandela-cv.md` (Experience dates).
9. **"15 live sites" (HTTP 200 one-by-one, 25 Oct 2026)** is asserted by the prior
   skills audit but the per-site status table is not stored in the corpus.
   Source: `audit/tyson-skills-audit-2026-10-25.md` (claim only).
10. **Agent operations console (FastAPI + WebSocket, pty/cron/kanban/memory)** is
    quoted from a CV/self-description in the session transcript, not from readable
    console source in the corpus. **[USER-STATED — verify against `agent-os` repo.]**
    Source: session_search msg 91260.
11. **Conflicts to resolve before publishing** (do not quietly pick one): next-door
    book length 60pp (INDEX) vs 83pp (pdfinfo); firm count 128 (cover) vs 146 (INDEX)
    vs 82 (JSON); 52pp vs 53pp; audit link annotations 13 (send log) vs 7 URIs (gate).
    Source: EVIDENCE-AUDIT "CONFLICTS FOUND".
12. **Two exposed keys never rotated** — a live security gap, not yet closed.
    Source: `system-audit-2026-10-21.md` §2; EVIDENCE-AUDIT §5.40.

---

*Inventory compiled 2026-10-25. Counts: 9 skill categories (≈60 cited capabilities),
22 quantified achievements, 10 "what I can do" statements, 5 voice samples, 12 gap
flags. Every Section A–D line carries a source path; Section E lists what cannot be
proved.*
