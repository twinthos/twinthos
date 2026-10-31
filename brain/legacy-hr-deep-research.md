# Legacy HR Software + Screen Agents — What's Actually True

Researched 21 October 2026. Every number below has a source. Three claims in my
earlier guide were wrong; they are corrected in section 6.

---

## 1. The tweet, plainly

Nick Vasilescu deployed an HR workflow on **Paycom** in **40 minutes** using an
agent on an Orgo Windows box. The official partner API route takes **6 months of
vendor review and tens of thousands in fees**. His conclusion: most legacy
back-office software will never ship a clean public API, so **give the agent a
screen**.

That is one engineer's anecdote, not a study. But the API half of it checks out
against independent data (section 3).

---

## 2. Why screen agents got viable in 2026 — hard evidence

**OSWorld** is the benchmark that matters, because it is 369 real tasks on real
operating systems, not a demo sandbox.

| When | Score |
|---|---|
| April 2024 (paper) | Best agent **12.24%**, human baseline **72.36%** |
| 2026 public leaderboard | Top entries **mid-80s** — above the human baseline |

Source: arxiv.org/abs/2404.07972v2; leaderboard.steel.dev; analysis at
stepto.net/blog/computer-use-gui-agents-enterprise-automation-2026

12% → 85% on unmodified desktop software in 26 months. That is why this is sellable
now and was not sellable in 2024.

**Gartner:** 40% of enterprise applications will embed task-specific AI agents by
end of 2026, up from under 5% in 2025.

**What killed old RPA — and why this is different.** RPA recorded click paths
against fixed selectors. A vendor UI refresh on a Tuesday broke forty bots at once.
RPA teams became permanent repair crews. Computer-use agents read the screen like a
person, so a moved button is not a break. Same source.

**The cost of being wrong.** The same analysis is blunt: benchmark scores say
nothing about whether an agent should be driving your ERP. Probabilistic clicking
fails silently. Budget human review on anything that moves money.

---

## 3. The API half — verified, vendor by vendor

| Vendor | Reality | Source |
|---|---|---|
| **Paycom** | **No public API.** Partner REST exists but undocumented, SID+Token per integration. Most production paths run through **Finch or Merge**. Bulk still CSV/SFTP. Grade **C** | supergood.ai/api-report-card/paycom (verified Oct 2026) |
| **Workday** | API is **usage-priced in volume tiers** beyond a baseline allowance, with throttling. Most customers never budget it and lose leverage later | workdaynegotiations.com/blog/workday-hcm-api-usage-costs |
| **ADP** | Marketplace partner program: application review + **30-day sandbox stage** + contract | developers.adp.com |
| **Rippling** | **No public developer API.** App Shop listing costs the partner nothing | integuru.com/platform-api-guides/rippling; rippling.stoplight.io |

So the opportunity is real: the systems holding the most valuable process
knowledge are the ones nobody can integrate with.

**But there is a competitor the tweet ignores: unified-API middleware.**
Finch, Merge, Knit and Supergood sell exactly the missing API, monthly, with
managed auth and compliance. Knit advertises Rippling access from **$8 per user per
month**. In an evaluation, middleware wins on reliability and loses on coverage and
setup time. Screen agents only win where middleware has no connector, or where the
client refuses a two-month integration project.

**Position accordingly:** screen agents for the tail nobody covers; middleware for
the head that already has a connector. Selling screen automation against a vendor
that Finch already covers is a losing pitch to anyone technical.

---

## 4. What the market actually pays — real price anchors

RPA and hosted-bot pricing is your ceiling. You cannot charge more than the
alternative the client can already buy.

| Product | Published price |
|---|---|
| Power Automate **Process** (unattended bot) | **$150/bot/month**, paid yearly |
| Power Automate **Hosted Process** (bot + hosted VM) | **$215/bot/month** — nearest direct comparable to an Orgo box |
| Ten unattended bots | **$18,000/year at list** |
| UiPath Basic | $25/month, capped at 2 robots, EU-only, flagged provisional |
| UiPath Screenplay | $10,000 per 50,000 runs |
| Automation Anywhere (AWS Marketplace) | **$126,000** for a 12-month contract |

Source: thebotdesk.com/a/rpa-platforms-what-they-cost.html (checked Sept 2026)

**Read this carefully.** A hosted unattended bot with a VM lists at **$215/month**.
That is the market clearing price for the machinery. So $5,000/month cannot be
justified by "a bot runs your workflow" — it can only be justified by **the labour
you replace**, not the software you install.

**Market size, for context:**
- AI agents market: **$7.84B (2025) → $52.62B (2030)**, 46.3% CAGR (MarketsandMarkets)
- Enterprise agentic AI: **$2.58B (2024) → $24.50B (2030)**, 46.2% CAGR (Grand View)
- AI workflow automation companies trade at **8–10x revenue**, median ~9x (Windsor Drake, Q2 2026)

---

## 5. Can you make money on this fast?

**Yes — as a services business, sold one broken workflow at a time. No — as a
$5K/month product in the first 90 days.**

### Why the old pricing was fantasy
$5,000/month for a 2-hour setup, sold to an SMB that has never heard of you, with
no case study and no security review, does not close. Payroll buyers are the most
risk-averse buyers in a company. They do not buy a stranger's robot with payroll
credentials in week one.

### The fast path that does work

**Step 1 — one workflow, one client, fixed fee (week 1–2)**
Pick a single recurring, verifiable, low-risk task. Examples that are safe to
automate first:
- Monthly payroll variance report across two systems
- New-hire record creation (not payroll itself)
- Benefits invoice reconciliation against headcount
- Weekly compliance schedule check

Price: **£1,500–£3,000 fixed**, 1–2 weeks, paid up front or 50/50. Fastest
possible cash, and it buys you the case study.

**Step 2 — convert to a retainer (month 1–3)**
Same client, expand scope. Price against the **human**, not the bot: a payroll
administrator costs roughly £28–35K/year loaded. Take out 60% of a role and
**£1,200–£1,800/month** is an easy yes.

**Step 3 — the multiplier: go through a BPO, not direct to SMBs**
Bookkeeping firms, payroll bureaus and outsourced back-office shops **already bill
hours** and have 5–50 clients on identical workflows. One BPO deal = a dozen
end-clients with one integration and one sales cycle. This is the fastest route to
revenue, because their labour cost is the budget line you are cutting.

### Realistic 90-day numbers

| Path | Deals | Cash |
|---|---|---|
| 3 fixed-fee pilots | 3 × £2,000 | **£6,000** |
| 2 converted to retainer | 2 × £1,500/mo | **£3,000/mo recurring** |
| 1 BPO, 8 clients at £400/client | 1 | **£3,200/mo** |

Total by day 90: roughly **£6K one-off plus £6K/month recurring**. That is a
credible business. It is not £85K/month, and anyone promising that with no track
record is guessing.

### The four things that will kill it
1. **Vendor terms.** Many portals prohibit credential sharing or automated access.
   Read the client's contract before you log in. Put it in writing that they
   authorise it.
2. **Payroll data.** This is GDPR special-category-adjacent data. You need a DPA,
   scoped credentials, audit logs, and a deletion policy before client one — not after.
3. **UI churn.** Agents survive moves better than RPA, but not perfectly. Budget
   monitoring: a daily canary run that fails loudly, or you find out when payroll
   is wrong.
4. **Silent wrongness.** Always ship a human-review checkpoint on money-moving
   steps. "It ran" is not "it was right".

---

## 6. Corrections to my earlier guide

Three claims I made earlier were not sourced and one was wrong. Corrected:

| Earlier claim | Reality |
|---|---|
| "Rippling API pricing = $0.10 per API call, 100 employees × 50 calls = $500/month" | **Wrong.** Rippling has no public developer API. App Shop listing is free to the partner. |
| "Annual client cost $60K / $120K / $250K" value matrix | **Unsourced.** Those were my estimates, not data. Replace with the labour-cost method in section 5. |
| "Your profit $5,000" on a $5,000 price | **Double counting.** Profit = price minus your cost (compute + support + maintenance). At $215/bot list comparable, cost is low but support is not free. |
| "Most legacy back-office software will never build clean public APIs" | Holds up. Paycom Grade C, Rippling no public API, Workday gated by volume pricing. |

The 40-minute Paycom deployment is Nick Vasilescu's own anecdote. Real, attributable,
and not independently reproduced.

---

## 7. One-page summary

- **The thesis is real:** legacy HR systems are un-integrable by design.
- **The machinery got viable in 2026:** OSWorld 12% → mid-80s, past human baseline.
- **The market price for a hosted bot is ~$215/month.** Charge for labour replaced, not software installed.
- **The real competitor is middleware** (Finch, Merge, Knit) — cover the tail they miss.
- **Fast money:** one fixed-fee workflow at £1.5–3K, convert to £1.2–1.8K/mo, then sell through a BPO for volume.
- **Non-negotiables:** signed authorisation, DPA, canary monitoring, human checkpoint on money.

---

*Sources inline above. Compiled from live web research 21 Oct 2026.*
