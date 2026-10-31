# Withdrawn — do not send

Three files were moved here on 21 October 2026 by the agent, after the forensic
audit and a five-reviewer swarm found the problems below. Nothing was deleted.

## who-to-target.pdf — DO NOT SEND

- Page 9 cold email contains a client result that never happened: “One Bristol
  bureau cut a two-day run to about four hours.” The same page carries a note
  telling the author to delete it if the case study had not been done. It had not
  — `company/services.md`: no client has been delivered these as a paid service.
- This is v1. `who-to-target-v2.pdf` (capital root) supersedes it.
- Violates the standing rule: never fabricate customer results.

## who-to-target.md — DO NOT SEND

- Source of the same PDF. It does not contain the Bristol sentence (the .md was
  never the source of its own PDF), but it carries the same sector plan, and
  `recruitment-people.md` contradicts its Heat Recruitment recommendation.

## what-twinthos-is.pdf — DO NOT SEND

- Recommends block management and prices it at £2,500/mo and £5,000/mo. The
  sector and the fee are withdrawn: at £30,000 pre-tax profit, £2,500/mo is 100%
  of profit and £5,000/mo is 200%.
- Built 4,958 seconds **before** `what-twinthos-is.md` was corrected to read
  “CORRECTED 21 OCT 2026 — DO NOT ACT ON THIS DOCUMENT”. The PDF carries no such
  banner, so a reader who forwards it sends the withdrawn recommendation.
- Reproduce the defect with: `pdf_gate.py archive/what-twinthos-is.pdf --source
  what-twinthos-is.md` → `STALE ... rebuild`.

## What replaces them

- `forensic-audit-v2.pdf` — the corrected analysis, 6 pages, gated.
- `who-to-target-v2.pdf` — the plan, still to be rebuilt through the pipeline.

## Standing rule

No PDF leaves this machine unless `pdf_gate.py` exits 0, and no PDF is sent
whose source markdown is newer than the build.
