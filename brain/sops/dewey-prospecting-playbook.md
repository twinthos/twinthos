# The prospecting machine: Dewey's method, run as loops

**Purpose.** This is how Twinthos finds, closes and keeps clients. It copies the one
thing Dewey demonstrably does — the agent builds and delivers the client's agent, while
the human only sells — and runs it as five repeatable loops with a pass test on each.

Sources for every claim: `research/nick-vasilescu-posts.md` (Nick Vasilescu, X, 44 posts),
`what-twinthos-is.md` (deep read, correcting block at top), `research/telegram-scrape-2026-10-21.md`
(the salestech stage map and panel evidence), `audit/target-register.md` (114 verified UK firms).

## What Dewey actually does

> "my agent Dewey builds and onboards the agents i sell to clients. i close the deal. Dewey
> spins up the agent on Orgo, configures it, connects it to their systems, and sends them a
> screen recording when it's done." — X, 31 Aug 2026

> "Just closed another $5K-a-month customer today for an AI employee for a design agency.
> I'm not even building any of it. All I do is ask the questions, make sure it gets recorded
> in Granola, and then Dewey takes it over." — X, 30 Jun 2026

Two facts follow, and they are the whole thesis:

1. **The delivery artefact is a screen recording of the thing working**, sent without a
   meeting. Not a deck. Not a proposal.
2. **The selling work is questions, not building.** The build is the agent's job.

Nothing in the public record says Dewey has a UK client, a contract, a price list or a
referenceable outcome. Treat the method as evidence, the results as unverified.

## The five loops

### Loop 0 — Choose the stage, not the industry
Selling "AI for your sales team" is unsellable; selling one stage with measured hours is
not. Use the six-stage map (prepare → find → contact → sell → manage → grow) and pick one.

- **Input:** `audit/target-register.json`, `audit/probability-ranking.json`.
- **Action:** pick one sector and one stage. Score the sector on affordability,
  countability, speed to a first result, a dated trigger and data friction (weights 30/25/20/15/10).
- **Artefact:** one page: sector, stage, the job sentence ("chases every unpaid invoice over
  30 days and logs what it did"), and the hours that job consumes today.
- **Pass test:** the job sentence contains one verb, one object, one system, and the hours
  figure comes from the client's own documents or the firm's own advert — not from a model.
- **Fail:** drop the sector. Current drops: field service, NHS-facing healthcare.

### Loop 1 — Build the artefact before the first call
The demo is the product. Build it from what is already public about the firm.

- **Input:** the firm's own website, job adverts, published documents (adverts name the
  system: Eclipse ProClaim, Visualfiles, Linetime, Sage 50, Forward Solutions).
- **Action:** run the job once, on their material, in a copy of their tool or a close
  equivalent. Record the screen. Label it "illustrative, built from your public documents".
- **Artefact:** a 90-second recording plus a one-page before/after: hours, per week, per year.
- **Pass test:** the recording shows the real system, the real output, and one number the
  owner can check. No fabricated client results, no invented logos, no "trusted by".
- **Fail:** if it cannot be built from public material, the job is not yet defined. Return
  to Loop 0.

### Loop 2 — Close on the artefact
One message, one link, one question. The recording does the persuading.

- **Action:** send the recording, name the number, ask for 20 minutes to check the number.
  Then the £999 audit, which is the paid version of the same thing on their data.
- **Artefact:** message, recording, audit one-pager.
- **Pass test:** the prospect replies with a number of their own, a system name, or a date.
  Anything else is not a reply — it is politeness.
- **Fail:** after two touches with no number, system or date, close the file for 90 days.
  Do not send a third. Dewey's own claim is speed to value, and chasing is not speed.

### Loop 3 — Let the employee do the delivery
The human sells. The employee builds, onboards and reports.

- **Action:** after signature, the build runs from a template: connect the tools, set
  permissions, write the escalation rule, name the human who signs off, log every action.
- **Artefact:** a working employee, a written job definition, an escalation rule, a log,
  and a recording of the first successful run sent to the client.
- **Pass test:** the client's own user, not Twinthos, performs one real task through it in
  week two. First job live in two weeks, per the audit-to-deployment path.
- **Fail:** if the client's user cannot do it unattended, the permissions or the job
  definition is wrong. Fix that, not the sales pitch.

### Loop 4 — Keep it by widening, not by discounting
A retained client is cheaper than a new one — the panel figure quoted on Telegram put
acquisition at about five times the cost of expanding an existing account
(`t.me/salestech/182`).

- **Action:** every month, one measured number (hours returned, items processed, errors
  caught) and one next job proposed.
- **Artefact:** a one-page monthly note in the client's own numbers.
- **Pass test:** the client renews on the measured number, not on enthusiasm.
- **Fail:** if there is no number after two months, the job was wrong. Replace the job
  before the term ends.

## The discipline that makes it work

From the same panel, and the reason most agent deployments die: configuring, correcting
and supervising an agent can cost as much as doing the task by hand. So every loop above
ends in a measurement, and every job starts with the hours it replaces. Specific task →
known hours → automation → measured effect. If the second step is missing, do not sell.

And the six questions to ask before automating anything, in the client's own words: what
do we sell, to whom, why do they buy, what stages does the work pass through, where does
it stall, and what has to happen for it to move.

## Cadence and numbers

| When | Loop | Output |
| --- | --- | --- |
| Monday | 0 | 10 firms with a stage and a job sentence |
| Tue–Wed | 1 | 3 recordings built from public material |
| Thursday | 2 | 10 sends, all with a recording |
| Friday | 2 | every reply carrying a number, system or date goes to a call |
| Monthly | 4 | one measured note per client |

Track four numbers only: recordings sent, replies carrying a number/system/date, audits
sold, first jobs live inside two weeks.

## Honest status

No client has paid for the managed service. There is one £999 audit offer, five firms with
publicly cited legacy systems, and a 114-firm register with 24 shortlisted. Every number in
this playbook that is not sourced above comes from `company/pricing.md`, which is marked
TEST PRICES and must not be quoted as list.
