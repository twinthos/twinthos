# CV Content Audit — 2026 AI/Tech Hiring Standards

**Subject:** Tyson Mandela — `tyson-mandela-cv-deep.md` (116 lines)
**Target roles:** AI security, DevSecOps, platform engineering, applied AI builder
**Grounded against:** `cv-canon.md`, `tyson-facts-canonical.md`, `tyson-skills-audit.md` (the verified fact base + never-claim list)
**Date:** 2026-10-31

Verdict in one line: the *substance* is strong for a builder/agent-security role, but the document (a) carries three fact-integrity defects that are dismissal offences if sent, (b) overclaims code authorship the git record contradicts, and (c) is structured as a founder manifesto, not an employee-facing CV — so the strongest evidence is buried and the ATS can't match the target keywords. Fix integrity first, then restructure.

---

## 0. STOP-LIST defects — fix before any send (integrity, not style)

These override every other recommendation. Each traces to the never-claim / authorship rules in the canon.

| # | Line | Current text | Problem | Fix |
|---|------|--------------|---------|-----|
| S1 | 21, 59 | "289 commits in 18 days" | **Forbidden figure.** Real public record: 121 commits, 2 repos (GitHub API, 28 Oct 2026). The 289 is the *local* site repo, authored by 10 agent identities (only 15 human commits). A hiring manager reads "289 commits" as personal output; the git log contradicts it. "18 days" also implies ~16 commits/day of hand work. | Delete the commit count. Lead with shipped artifacts, not commit volume. If any number is kept, it must be "2 public repos" framed as *directed*. |
| S2 | 59 | "208-file knowledge layer", "24-route site" | Internal dashboard metrics — a stranger cannot interpret them (canon: "A CV is not a dashboard"). | Cut. Replace with an outcome ("a 24-page knowledge base with verified disaster recovery" → drop the file count, keep the concept). |
| S3 | 60, 84, 21 | "526-line HTML-to-PDF pipeline", "32-page × 24-check auditor", "nine-check release gate", "353-line gate" | Line/check counts are internal noise. Also inconsistent: "nine-check" (line 60) vs the 353-line/9-check gate elsewhere. | Keep the *capability* ("an automated PDF release gate"), drop every line and check count. |
| S4 | 61 | "£3,500 per month ... and £999 for a one-off operations audit" | Conflicts with canon pricing (£2,500 setup + £750–£950/mo, marked TEST). v12 already removed pricing. Recruiters don't need it and it anchors value low + contradicts the record. | Delete pricing from the CV entirely. |
| S5 | 62, 54 | "managed digital employee", "digital employee" | **Banned internal vocabulary** — means nothing to an outside screener. | "managed AI agent" / "production AI agent". |
| S6 | 107 | "Nous Portal" | Internal product name, unknown off-site. | Cut. |
| S7 | 57–62, 83–89 | "Built the tooling: a 526-line pipeline…", "Built the platform…", "Built the company end to end" | **Authorship overclaim.** Git author fields show the pipelines, auditor, scrapers and backup are agent-written under his direction; he hand-wrote the first ~10 landing-page iterations only. "I coded a platform" fails one interview question. | Recast as *direction*: "Specified and shipped…", "Directed the build of…", "Python-literate direction". Conception/positioning/review/shipping are his; code authorship is not. |

---

## 1. What is MISSING for 2026 AI/tech hiring standards

1. **ATS-standard section headers.** Current headers ("What I do", "How I develop my AI practice", "Selected work and evidence", "Tools and capabilities") are creative but cost ATS matches. Recruiters' tools and the target JDs expect: *Summary, Skills (or Core Competencies), Work Experience, Projects, Education.* Rename per §3.
2. **A keyword strip near the top.** No scannable "Core Competencies" line in the 6–7 second region. The good terms are scattered in prose; an ATS greps a dense block, not narrative.
3. **Named security / infra stack.** For the *specific* target roles the CV is thin on the 2026 keyword set (see §4). "AI security auditing" and "Cloud computers and VPS" are generic; 2026 JDs name frameworks and tools.
4. **LinkedIn URL.** Only website + GitHub are present. Most employee applications expect LinkedIn. (Add only if a real profile exists.)
5. **Education section — honest gap, do NOT fabricate.** The MSc AI / University of Bristol line that appeared in an early draft is **unverified and must never appear** (canon grade X; it is a dismissal offence). There is no verifiable degree on record. Either omit the section or state "Continuous, project-based — see Projects" plainly. Do not invent one.
6. **Certifications — none on record.** Do not add. (No AI Adoption Trainer credential exists; it was removed 28 Oct 2026.) Omitting is fine; faking is fatal.
7. **Role-fit framing for non-founder tracks.** Everything reads "solo founder." For DevSecOps/platform/AI-security *employee* roles, add the collaborative/production signal: "human sign-off," "release gates," "audit trail" are already there — surface them as competencies, not just narrative.

---

## 2. What is WEAK or VAGUE — needs concrete, interpretable metrics

| Line | Weak claim | Why it's weak | Stronger (metric already in the file or canon) |
|------|-----------|---------------|--------------------------------------------------|
| 25 | "Teach AI in plain English… removing the fear without removing the rigour." | No scale; proof exists but is filed under a *different* business. | "Designed and delivered every course in a 2,000-student community; authored 6 books." Tie the teaching claim to the 2,000 + 6. |
| 21 | "Ship documents and sites at volume." | "Volume" undefined; the numbers present are internal. | "Ships hundreds of QA-gated pages; zero QC failures on re-run." Keep the interpretable outcome, drop the line counts. |
| 37 | "I have found and closed real exposure on my own infrastructure." | The single best AI-security proof, stated without its evidence. | Promote the line-87 detail: "Found a web server bound to all interfaces exposing a repository and its full history; closed it and fixed the redaction gap." That is a concrete AppSec story. |
| 23 | "Research a market to a named person." | Abstract; the metric is one section down. | "114-firm register, named decision-maker at 100 firms, each re-checked against their own page before publication." |
| 13–25 (What I do) | Seven abstract capability claims | Each has a concrete artifact in §"Selected work" but they aren't linked, so the reader can't verify any. | Pair each capability with its proof inline or move to a Projects section that leads with artifacts. |
| 31–37 (How I develop) | "Practical understanding of context, tool use, memory…" | Self-rating language; not verifiable. | Show it: "Compares capability, quality and cost across Claude, GPT, DeepSeek and open-weight models to match the job spec." |

**Note on metrics discipline:** the file is *rich* in numbers but many are internal (line counts, check counts, file counts, commit counts). The interpretable ones to keep: ~20M views/month, 500k followers (sold), 2,000 students, 6 books, 114 firms / 100 named, 83-page/314-source market book, the security-exposure story. Everything a stranger can't read goes to the cut list.

---

## 3. Sections to REORDER / RENAME

Current → Proposed (ATS-standard headers, portfolio-first order):

| # | Current (line) | Problem | Proposed header |
|---|----------------|---------|-----------------|
| 1 | Header (1–7) | Good; summary is strong | Keep; add AI-security to title + LinkedIn if present |
| 2 | "What I do" (11–25) | Functional but vague, no keywords | → **Skills / Core Competencies** (condense to a keyword block) |
| 3 | "How I develop my AI practice" (29–37) | Meta-narrative, non-standard, repeats security point | Fold into Summary + a 3-line "How I work" |
| 4 | "Core skills" (41–48) | Overlaps "What I do" | Merge into **Skills** (one skills section, not two) |
| 5 | "Experience" (52–77) | Founder-manifesto framing | → **Work Experience** (recast bullets per §5) |
| 6 | "Selected work and evidence" (81–89) | Best evidence, placed *after* experience | → **Selected Projects** — **move above Experience** (portfolio-first) |
| 7 | "Methods" (93–101) | Internal vocabulary (loop engineering, the one page) | Cut or compress to one "How I work" paragraph |
| 8 | "Tools and capabilities" (105–110) | Internal names; overlaps Skills | Fold into **Skills** |
| 9 | "Publications" (114–116) | Health books are off-topic for AI roles | Keep brief at the very end, or merge into Experience |
| — | *(absent)* | No Education/Certifications | Omit honestly (see §1.5/1.6) — do not fabricate |

**Portfolio-first reorder (recommended):**
`Header → Summary → Skills (keyword strip) → Selected Projects (proof) → Work Experience → How I work (3–4 lines) → Publications`

Rationale: for a builder, artifacts beat job titles. The current file buries the strongest proof (site auditor, PDF gate, security review, research register) below three founder roles. Moving Projects up lets a screening engineer see *evidence* in the first screen.

---

## 4. ATS KEYWORD gaps (target: AI security · DevSecOps · platform engineering · agent · automation)

**Present and good:** Python, Flask, FastAPI, REST, OAuth, webhooks, Git, Linux, static-site/CDN, cron, agents, automation, audit trail, human-in-the-loop, security review, release gate.

**Missing — add ONLY if genuinely true (flagged per category):**

- **AI security (high value for the target roles):** prompt injection, agent security, LLM security, MCP (Model Context Protocol) security, secrets management, data-access controls, guardrails, AI red-teaming, OWASP Top 10 for LLM Applications, NIST AI RMF, MITRE ATLAS. *(The security-exposure story on line 87 is real evidence — name the practice it demonstrates.)*
- **DevSecOps:** CI/CD, containerization, Docker, Kubernetes, Infrastructure as Code / Terraform, SAST/DAST, secrets scanning, GitHub Actions, observability/monitoring, incident response. ⚠️ Skills audit rates engineering as "working knowledge / Python-literate direction" — **do not add cloud/containers/IaC terms he doesn't actually use**; that's a gap to state, not stuff.
- **Platform engineering:** deployment pipeline, release gate, environment management, backups / disaster recovery, static-site hosting, CDN.
- **Agent / automation:** job specification, decision rights, escalation, audit trail, tool orchestration, retrieval/RAG, human-in-the-loop, cron scheduling, webhooks, API integration, data pipelines. *(Mostly present — just needs to be in the keyword block.)*

**Honest gap to tell the user:** for pure DevSecOps/platform-engineering roles the CV lacks named cloud (AWS/GCP/Azure), containers (Docker/Kubernetes) and IaC (Terraform). If he has any of these, add them; if not, those specific role families are a stretch and the AI-security / applied-AI-builder angle is the stronger fit.

---

## 5. How to restructure for a builder / portfolio-first narrative

1. **Lead the summary with the security + agent-systems angle**, since that's the target. The current opener ("Not chat interfaces — agents with a written job spec, a defined decision boundary, an audit trail, and a human sign-off…") is canon-approved and strong; keep it, add "AI security" explicitly, tighten to ~4 lines.
2. **One Skills block, keyword-dense**, merging "What I do" + "Core skills" + "Tools," stripped of internal names. Group by: Agent design · AI security · Engineering · Verification · Adoption/education · Research.
3. **Selected Projects above Experience.** Each project = one artifact + one interpretable metric + one link. This is the portfolio-first move and it puts proof in the first screen.
4. **Recast Experience bullets as direction, not authorship** (see §6, R-Block). Keep the founder roles but lead each with outcome.
5. **Compress "How I develop" + "Methods" into a 3–4 line "How I work"** — keep loop engineering only as a plain one-liner ("test-first: write the check, fix, re-run, treat the delta as proof"), drop the internal jargon.
6. **Kill duplication.** Security/oversight currently appears in "What I do," "How I develop," "Core skills," and "Tools." State it once, in Skills, with the line-87 evidence in Projects.

---

## 6. LINE-BY-LINE improvements with rewrites

### Header (lines 3–7)
- **Line 3 title:** add the target keyword.
  - Before: `Applied AI Builder — agents, automation, adoption, and the systems underneath`
  - After: `Applied AI Builder — AI agents, automation, and AI security. Systems that ship with an audit trail and a human sign-off.`
- **Line 5 contact:** add LinkedIn if a real profile exists; keep GitHub as `github.com/twinthos` (never `alkalinearchitect`). No phone (the 7912 345678 is a placeholder — do not print).
- **Lines 7 summary:** keep the approved opener; tighten and make security explicit.
  - Suggested: `I build and test AI systems end to end — not chat interfaces, but agents with a written job spec, a defined decision boundary, an audit trail, and a human sign-off before anything consequential ships. Since 2020 I've moved between models, CLIs and cloud environments to find what actually works in production. My depth comes from developing, breaking and fixing real systems, and from auditing them for exposure before they ship — not from prompting a consumer product.`

### "What I do" (lines 13–25) → fold into Skills
- **Line 15:** "key-free scrapers" → "scrapers with no API keys required" (clearer). The stack list is fine as a Skills keyword source.
- **Line 21:** apply S1/S3/S4 fixes — drop 289 commits, 526-line, 208-file; keep the outcome.
  - Before: `Ship documents and sites at volume. A 526-line measured-PDF pipeline holds a house style across hundreds of pages. The live site runs 289 commits in 18 days, gated and verified.`
  - After: `Ship documents and sites at volume. An automated PDF release gate holds one house style across hundreds of pages; the site runs through a per-page QA gate, gated and verified before publish.`
- **Line 25 (teaching):** attach the scale — see §2.

### "How I develop my AI practice" (lines 29–37)
- **Line 37 (security):** make concrete and promote-worthy.
  - Before: `I apply AI security auditing to agent workflows — reviewing data access, automated actions, and operating boundaries. A named human signs off consequential decisions. I have found and closed real exposure on my own infrastructure.`
  - After: `I audit agent workflows for security — data access, automated actions and operating boundaries — with a named human signing off consequential decisions. On my own infrastructure I found a web server bound to all interfaces exposing a repository and its full history, closed it, and fixed the redaction gap that let secrets through.`

### "Core skills" (lines 43–48) → merge into one Skills block
Suggested consolidated, ATS-keyworded block (only true terms; add §4 items if genuine):

```
Agent design: job specification, decision rights, escalation, audit trails,
  tool orchestration, human-in-the-loop approval, retrieval/RAG knowledge design
AI security: workflow auditing, data-access control, secrets handling, prompt-injection
  awareness, guardrails, human sign-off on consequential actions
Engineering: Python, Flask, FastAPI, REST, OAuth, webhooks, data pipelines, cron,
  Git, Linux, static-site + CDN deployment, HTML/CSS/JS, TypeScript, Next.js
Verification: test-first development, automated release gates, source verification,
  accessibility/contrast QA, security review
Adoption & education: plain-English teaching, change management, workshop design,
  AI literacy for non-technical teams
Research: primary-source market research, decision-maker verification, weighted scoring,
  pricing against external comparables
```

### "Experience" (lines 54–77) — recast for authorship + outcome
- **Twinthos block (57–62):** apply S1/S2/S3/S4/S5/S7. Suggested rewrite of the bullets:
  - Before (59): `Built the platform: a 24-route site, 289 commits in 18 days, a 208-file knowledge layer with byte-identical disaster recovery, and an agent operations console.`
  - After: `Specified and shipped the platform: a multi-page site with per-page QA gating, a versioned knowledge base with byte-identical disaster recovery, and an agent operations console.`
  - Before (60): `Built the tooling: a 526-line HTML-to-PDF pipeline with a nine-check release gate, a 32-page × 24-check site auditor, and a source verifier that re-fetches every cited page.`
  - After: `Directed the build of an automated HTML-to-PDF release gate, a per-page site auditor, and a source verifier that re-fetches every cited page before publication.`
  - Delete line 61 (pricing) entirely.
  - Before (62): `Position: trainer teaches; Twinthos does. Same budget, one gives a course, the other gives output.` → keep (it's a crisp positioning line, no integrity issue) but change "digital employee" wherever it recurs.
  - Line 54 role title: keep "Founder — Twinthos"; avoid "CEO" (canon: invites the contradiction question).
- **Human Architect / Alkaline Architect (64–70):**
  - Keep 500k / ~20M views / 2,000 students / 6 books — these are the interpretable, verified scale metrics.
  - **Line 69:** the sale to Jason van Blerk / The Human Garage is fine (grade B) but note the canon conflict: the 500k figure is operator-stated and an earlier audit found only ~359,926 video views / 2,171 TikTok on record — *resolve the 500k before sending* (it's conflict #2 in the facts file). Never print 359,926 / "300k".
  - **Line 70:** "six books under a pen name" — good. (Canon conflict #3: site says "the book Alkaline Awakening and six ebooks" = 7 titles; reconcile before sending.)
  - Do **not** add the Djokovic/Joshua/Travolta line unless he reconfirms — and if kept, use only "worked with … among others," never "trained/coached/consultant to."
- **HumanitAI CIC (72–77):**
  - Keep as a current role (canon: current, not a footnote). "Companies House 16891121" is correctly placed here (never elsewhere).
  - **Line 73 date:** "December 2025 – present" — verify against Companies House before sending.
  - **Line 75:** grant scraper — canon grades the "29 verified opportunities weekly" as C (no live check). Keep the capability; soften or verify the weekly count.
  - **Line 76:** "free LLMs" → "open-source LLMs" (clearer, more current).

### "Selected work and evidence" (lines 81–89) → "Selected Projects," moved up
Keep these — they're the portfolio — but strip internal counts and lead with outcome:
- **Site auditor (83):** keep "drove local findings to zero, separated eight genuine hosting limits from repository defects" (interpretable). Drop "32 pages at 24 checks each" → "audited every page; drove local findings to zero."
- **Document pipeline (84):** keep "zero failures on re-run"; drop "526-line / 353-line / nine-check."
- **Research register (85):** keep 114 firms / 100 named (good, interpretable).
- **Market book (86):** keep 83 pages / 314 sources / "a section stating what would prove the thesis wrong" (strong, shows intellectual honesty).
- **Security review (87):** **promote to top of Projects** — it's the AI-security proof of work. Keep as written (it's concrete and honest); it directly evidences the "AI security" target keyword.
- **Job-market sweep (88), Telegram scraper (89):** optional. The scraper's "no bot token required" reads as a grey-area technique — consider cutting for a corporate security/DevSecOps application unless reframed as "OSINT collection within ToS."

### "Methods" (lines 93–101) → compress to "How I work"
- Keep only "Loop engineering" as a plain line: `Test-first: write the check, fix, re-run the identical script, and treat the difference between runs as the proof.` Drop "The one page," "Five-factor scoring," "Source-before-claim" as internal jargon, or reduce to one clause each.

### "Tools and capabilities" (lines 105–110)
- Delete "Nous Portal" (S6). Fold remaining lines into the Skills block. "AI security auditing," "Bespoke agents," "Website development" are good — move to Skills.

### "Publications" (lines 114–116)
- Keep brief at the end. For AI roles the health books are tangential; one line suffices: `Six books under a pen name (research synthesis to publishable standard); an 83-page, 314-source market book.`

---

## 7. Priority order for the rebuild

1. **Integrity (S1–S7):** remove 289/£3,500/internal counts, fix authorship verbs, cut banned internal names. *(Blocks send.)*
2. **Structure:** rename to ATS headers; move Selected Projects above Experience; merge the two skills sections and Tools.
3. **Keywords:** add the true AI-security terms (prompt injection, agent security, secrets handling, guardrails, human-in-the-loop) and, if genuine, DevSecOps/platform terms; state the cloud/containers/IaC gap honestly.
4. **Metrics discipline:** keep only stranger-interpretable numbers; attach teaching→2,000/6, security→the exposure story.
5. **Resolve open conflicts** before sending: 500k figure, 6-vs-7 books, HumanitAI date, grant-scraper weekly count.

**Do not:** add Education/Certifications from imagination, print the phone placeholder, use alkalinearchitect, or claim code authorship the git log contradicts.
