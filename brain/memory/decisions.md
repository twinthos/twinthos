# Decision log

Format: date | decision | why | source

## 2026-10-14 | Keep the original hero film; put the new reel elsewhere
Decision: the new demonstrator video must NOT replace the homepage hero.
Reason: founder instruction — the 29s v17 hero stays.
Result: reel lives under /work/ — index at /work/, landscape at /work/reel/,
portrait at /work/reel/v18/. Old /reel/ returns 404.
Source: founder brief 2026-10-14; verified live by HTTP check.

## 2026-10-14 | Rewrite client-facing copy in plain English
Decision: remove insider jargon from public pages.
Reason: founder: "useless txt in discription".
Result: "One rail, three tokens, one line where the work waits" replaced with
a description of the actual events (enquiry handled, refund approved by you,
invoice chased without asking).
Source: founder brief; verified live.

## 2026-10-14 | Reuse existing brain-backup repo rather than creating a new one
Decision: do not create a second knowledge repository. APPROVED by founder.
Reason: github.com/twinthos/brain-backup already exists, is private, and updates
hourly; a duplicate would fragment the record.
Result: the knowledge tree is pushed to brain-backup/brain on every hourly run.
Evidence: commit c3052d7 (2026-10-14T13:05:09Z), 29 files under brain/.

## 2026-10-14 | Protect /root/twinthos-brain against machine loss
Decision: add the tree to the hourly backup AND to the restore hook.
Approved by founder: "yes make sure it survives back up".
Why both: backup alone would not bring it back to a wiped machine, because the
restore hook previously only gap-filled memory/ and vault/.
Evidence: deleted architecture/security.md, ran the restore hook, the file
returned byte-identical (sha256 77f749d7bdfe003b, 862 bytes).

## 2026-10-14 | Remove fictional test records from the knowledge tree
Decision: do not leave test fixtures where retrieval might pick them up.
Reason: fictional facts like "Project Zephyr / room Greenfield" could later be
retrieved as if they were real company knowledge.
Result: _tests/ deleted locally and from the repository.

## 2026-10-14 | Do not let SOUL.md replacement lose base instructions
Decision: append the Twinthos identity to /root/.hermes/SOUL.md rather than
overwrite the file.
Reason: the file currently holds the base operating instructions that govern
behaviour; deleting them would degrade the agent.
Source: inspection 2026-10-14.

## 2026-10-14 | Adopt the two-product Brain + Workforce architecture for 2027
Decision: the 2027 platform strategy is Twinthos BRAIN (persistent intelligence
layer) plus Twinthos WORKFORCE (cloud digital employees, execution layer), one
infrastructure, sold separately or together.
Reason: the competitive question shifts from "which model" to "what does the
system know, what is it authorised to do, how reliably does it complete work";
the model is replaceable, an integrated trustworthy service is not.
Key constraint recorded: the agent, the knowledge and the computer must not be
inseparably bound — the Brain survives model change, computer failure or
employee replacement.
Source: founder direction 2026-10-14; full detail in company/strategy-2027.md
(including two externally verified sources: McKinsey State of AI, 25 Aug 2026;
ILO-NASK Global Index, 20 May 2025).

## 2026-10-14 | Treat the "SI" rename as a content/search opportunity, honestly
Decision: Twinthos uses the "super intelligence / SI" vocabulary because that is
what people search for, and never claims to be superintelligent.
Reason: no current system has achieved superintelligence (experts call the rename
contested and misleading); adopting the word is cheap, adopting the implied
capability claim is false.
Caveat recorded: the rename rests on a US federal executive order (29 Sep 2026)
and industry posture, not on any change in capability. Adoption is partial.
Source: Politico, BBC, Politifact (linked in memory/si-rename-2026.md).
Website actions taken 2026-10-14: new /workforce/, /brain/ rewritten with the
2027 architecture, new /notes/super-intelligence-si/, llms.txt and robots.txt
updated for AI crawlers.

## 2026-10-21 | Target book two: sell to firms paid per completed unit
Decision: the next outbound push targets firms paid per completed case, claim,
renewal or placement (R&D claims, debt recovery, mortgage brokers, energy
consultancies, surveyors, IT resellers, training providers, franchisors) instead
of firms with a large admin function (accountancy, recruitment, logistics).
Reason: the 114-firm book asked "who has a lot of admin", which makes the buyer
the defender of their own team. A per-unit firm gains revenue from throughput, so
the same offer becomes a promotion; it also cannot be absorbed by a single AI
platform they already use.
Evidence: 82 firms researched across 8 UK sectors plus 18 overseas, 80 with a
named person; 77 confirmed by re-opening the cited page, 2 flagged in the book
as unverified, 1 with no public page.
Scoring model unchanged (afford .30, repeat .25, speed .20, trigger .15,
regulatory risk .10) so the new book compares directly with the old one.
Result: R&D claims 8.15 is the highest-scoring trade recorded, above accountancy
8.1. Full list: audit/next-door-2026-10-21.md and
2026-10-21_twinthos_nextdoor.pdf.

## 2026-10-21 | Pricing proposal: £3,500 install, not £1,500 pilot
Decision proposed, NOT adopted. Recommended ladder: £3,500 install (one job, two
weeks, measured on the client's last 20 files), £1,250/month per job, £2,950/month
for three jobs, £999 audit unchanged.
Reason: every external data point pays the install and keeps the monthly modest
(Nick Vasilescu $3,500 first sale; Belgian operator EUR 2,750 + EUR 267; Nick's
named models $15k up front then $2-3k/mo, or $5k flat). The UK managed-agent band
is £750-£2,000 per role per month, so £5,000/month for one role sits outside it,
while £1,500 for an install sits below what operators charge.
Status: awaiting founder decision. company/pricing.md not edited.

## 2026-10-21 | One page replaces the deck on first contact
Decision: first contact carries one page (the job, what goes in, what comes out,
what it must never do, the two-week test, the price), not the 52-page target book
or the 6-page audit. The book stays a leave-behind and a working file.
Reason: the 52-page book reads at Flesch 38 / grade 13.5 with 44 sentences over
30 words; it is a research file. A buyer needs one job and one date.

## 2026-10-21 — the simple trades go first

Tyson's correction: the eight trades in the first draft were still hard to sell
(a regulator or a finance director between him and a yes). Rebuilt so the book
opens with eight trades where the job is obvious and the owner decides alone:
food and drink wholesale, plant and tool hire, accident repair, commercial
cleaning, security guarding, events/AV, print and signage, removals.

Scores run 7.3 to 8.05, below R&D on money but above it on speed and simplicity.
Decision: start with commercial cleaning for the first ten calls — same job at
every firm, owner answers the phone, they already pay someone to do it — and
sell one job at £3,500 install plus £1,250 a month.

New artefact: a short phone pack (`2026-10-21_twinthos_firstdeal.pdf`) so the
action is not buried in a 60-page reference book.
