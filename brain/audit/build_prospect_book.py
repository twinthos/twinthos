#!/usr/bin/env python3
"""Generate the plain-English Twinthos prospect book from verified data."""
import json, re

DATA = json.load(open('/root/twinthos-brain/audit/nextdoor-sections.json'))
DROP = {"Doherty Associates", "Heavenly Desserts Franchise Ltd",
        "Arachas Corporate Brokers", "Virtuzone", "Baltic Apprenticeships"}

INTRO = {
 "Research and development claims": (
  "These firms write a technical report for every claim. The report is long, it is "
  "the same shape every time, and HMRC pays per claim. More reports means more money. "
  "The bottleneck is the person who writes them."),
 "Mortgage and protection brokers": (
  "A broker is paid when the case completes, not when the advice is given. Every case "
  "runs through the same steps: collect documents, submit to the lender, chase the "
  "valuation, chase the offer. Admin capacity sets how many finish in a month."),
 "Business energy and utilities consultancies": (
  "Commission arrives when a contract is signed. Renewals sit in a diary, and a "
  "renewal that nobody chased is commission that never arrives. Letters of authority "
  "and invoice checks are paper jobs done at volume."),
 "IT resellers and managed service providers": (
  "Paid per seat, per device, per ticket. Quotations, licence renewals and hardware "
  "orders are the same paperwork repeated hundreds of times a year, and each one "
  "waits on a person."),
 "Debt recovery and credit management": (
  "Paid per pound recovered, per letter, per case. The business is volume. Every case "
  "needs the same letters, the same payment plans and the same follow-up calls."),
 "Franchisors": (
  "Paid when a franchisee signs, and then on royalty. The onboarding pack is identical "
  "for every new site, and the compliance check is identical every quarter."),
 "Training and apprenticeship providers": (
  "Paid per enrolment and per completed apprenticeship. Every learner needs the same "
  "enrolment forms, funding evidence and progress reviews, and the funding body checks "
  "the paperwork."),
 "Chartered surveyors and valuation firms": (
  "Paid per instruction and per valuation. The report is the same structure with a "
  "different address. Instructions arrive in bursts, and the queue is the limit."),
 "Outside the UK": (
  "The same eight ideas exist in other markets, usually with weaker software and no "
  "local competitor selling the job. Treat these as a second list, not the first call."),
}

TRADE_ORDER = [
 "Research and development claims",
 "Mortgage and protection brokers",
 "Business energy and utilities consultancies",
 "IT resellers and managed service providers",
 "Debt recovery and credit management",
 "Franchisors",
 "Training and apprenticeship providers",
 "Chartered surveyors and valuation firms",
 "Outside the UK",
]

def clean_job(j):
    if not j:
        return ""
    j = j.strip()
    j = re.sub(r'^For each client:\s*', 'Every client: ', j)
    j = re.sub(r'^For each claim:\s*', 'Every claim: ', j)
    j = re.sub(r'^For each case:\s*', 'Every case: ', j)
    j = re.sub(r'^For each production:\s*', 'Every production: ', j)
    j = re.sub(r'^For each grant round:\s*', 'Every grant round: ', j)
    j = re.sub(r'^For each site:\s*', 'Every site: ', j)
    j = re.sub(r'^For each learner:\s*', 'Every learner: ', j)
    j = re.sub(r'^For each instruction:\s*', 'Every instruction: ', j)
    j = re.sub(r'^For each new:\s*', 'Every new ', j)
    j = j[0].upper() + j[1:] if j else j
    if not j.endswith('.'):
        j += '.'
    return j


def plain(t):
    """Split the long regulatory clauses into separate sentences. Meaning unchanged."""
    if not t:
        return t
    t = t.replace(", so ", ". So ").replace("; ", ". ")
    t = re.sub(r'\.\s+([a-z])', lambda m: ". " + m.group(1).upper(), t)
    t = t.replace("GBP ", "£").replace("USD ", "$")
    t = re.sub(r'\s+', ' ', t)
    return t.strip()

def firm_block(e):
    parts = []
    parts.append("**[" + e['firm'] + "](" + e['furl'] + ")**")
    if e['fact']:
        parts.append("::: {.ev}\n" + e['fact'].replace("GBP ", "£").replace("USD ", "$") + "\n:::")
    parts.append("Call **[" + e['person'] + "](" + (e['purl'] or e['furl']) + ")**, " + (e['role'] or ""))
    job = clean_job(e['job'])
    if job:
        parts.append("::: {.job}\n**The job.** " + plain(job) + "\n:::")
    if e.get('why'):
        parts.append("::: {.why}\n**Why now.** " + plain(e['why']) + "\n:::")
    body = "\n\n".join(parts)
    return ":::: {.firm}\n" + body + "\n::::"

UK_TRADES = [t for t in TRADE_ORDER if t != "Outside the UK"]
N_UK = sum(1 for t in UK_TRADES for e in DATA[t] if e['firm'] not in DROP)
N_OS = sum(1 for e in DATA["Outside the UK"] if e['firm'] not in DROP)
N_ALL = N_UK + N_OS
WORDS = {70:"Seventy",71:"Seventy-one",72:"Seventy-two",73:"Seventy-three",74:"Seventy-four",
         75:"Seventy-five",76:"Seventy-six",77:"Seventy-seven",78:"Seventy-eight",
         79:"Seventy-nine",80:"Eighty"}
NWORD = WORDS[N_ALL]
NREM = 5

out = []
A = out.append

A("""::: {.cover-block}
::: {.kick}
Prospect book · 21 October 2026
:::

# {NWORD} firms.<br>[One finished job each.]{.accent}

::: {.bar}
:::

::: {.lead}
Every firm here gets paid when a piece of work finishes. That makes admin capacity the ceiling on their income, which is the only argument you need.
:::
:::

## How to use this {#how}

One page before you dial. Five minutes, no more.

::: {.steps}
1. **Find the firm's trade.** Each section says who they are and what they get paid for.
2. **Read the one line under the name.** It is the size of the firm, from their filed accounts or their own team page.
3. **Read the job.** That is the work you are replacing one piece of.
4. **Read why now.** That is the sentence that gets the meeting. It is a date, a rule or a change in their market.
5. **Call the named person.** The link goes to the page where the name appears.
:::

If a firm fails this test, skip it. There are seventy-seven more.

## Why these firms {#why}

Most prospect lists are built on how much admin a company has. That is the wrong test. Plenty of firms have admin and no money to spend on it.

This list is built on one question: **does the firm get paid when a piece of work finishes?**

A firm paid per claim, per case, per renewal or per placement has a reason to want more finished work. Admin is not a cost to them. It is the thing standing between them and revenue.

That changes what you are on the call. You are not the consultant asking them to cut staff. You are more capacity in a business that bills by the unit.

Three things follow from that:

- **The first step is small.** One job, two weeks, a fixed fee. One person can say yes.
- **The pitch is short.** "You bill per claim. Your team handles this many a week. This makes it that many."
- **The monthly fee comes after a result, not before one.**

## The price {#price}

Two numbers. Nothing else is negotiable on the first call.

| What | Price | What they get |
|---|---|---|
| Operations audit | **£999**, one off | Two weeks. The job written down, the cost modelled, the plan costed. |
| The digital employee | **£5,000** a month | One job run every day inside their existing tools. Three-month minimum. |

The audit exists so nobody has to guess. If the job is not worth £5,000 a month, the audit says so and you both walk away.

## The eight trades {#trades}

They are ranked by how easily the first sale closes, not by market size.

| Trade | Why it is easy to sell |
|---|---|
| **R&D claims** | Paid per claim. Missed deadline kills the fee. |
| **Mortgage brokers** | Paid on completion. Admin sets how many complete. |
| **Business energy** | Commission per signature. Renewals are a diary. |
| **IT resellers** | Paid per seat and per renewal. Same paperwork, hundreds of times. |
| **Debt recovery** | Paid per pound recovered. Volume is the whole business. |
| **Franchisors** | Paid per signing and per royalty. Identical onboarding packs. |
| **Training providers** | Paid per enrolment. Funding paperwork is checked. |
| **Surveyors** | Paid per instruction. Same report, different address. |

Each section follows the same shape: what the trade gets paid for, then the firms with a named person to call.
""")

for t in TRADE_ORDER:
    ents = [e for e in DATA[t] if e['firm'] not in DROP]
    # promote a trigger shared by three or more firms to the section intro
    from collections import Counter
    keys = Counter((e['why'] or '')[:45] for e in ents if e['why'])
    promo = None
    for k, n in keys.most_common():
        if n >= 3 and k:
            promo = next(e['why'] for e in ents if (e['why'] or '')[:45] == k)
            break
    if promo:
        import copy
        ents = [dict(e, why=(None if (e['why'] or '')[:45] == promo[:45] else e['why'])) for e in ents]
    slug = "t-" + re.sub(r'[^a-z0-9]+', '-', t.lower()).strip('-')
    A("\n## " + t + " {#" + slug + "}\n")
    A(INTRO[t] + "\n")
    if promo:
        A(":::: {.box}\n::: {.label}\nWhy now\n:::\n\n" + plain(promo) + "\n::::\n")
    for e in ents:
        A(firm_block(e) + "\n")

A("""
## The call {#call}

Thirty seconds, then a question. Do not pitch on the first breath.

::: {.box}
::: {.label}
Opening
:::

"Morning. I work with [trade] firms on the admin that sits between finishing a job and getting paid for it. Can I ask how many [units] you handle a month, and who owns that process?"
:::

Then stop talking. The answer tells you whether the firm is worth an hour.

**If they answer with a number:** "Then the question is whether that number is set by demand or by how fast the paperwork moves."

**If they say they are busy:** "That is the usual answer. The firms I work with are busy too. The difference is whether the queue clears."

**If they ask for a price:** "£999 for a two-week audit. You get the job written down, the cost modelled and a plan. If it is not worth doing, the audit says that."

## What to send after the call {#after}

Three things, in this order, and nothing else.

1. **The job, written in their words.** One page. What goes in, what comes out, what it must never do.
2. **The two-week test.** What you will measure, and the number that decides it.
3. **The price.** The same two numbers as above. No new tiers.

## How this list was checked {#checking}

Every firm below was checked before this book was built. The rule was simple: if a claim could not be pointed at, it did not go in.

- **The firm is real.** Its own website resolved and named the firm, or the firm's Companies House record was used.
- **The person is real and named.** Their name appears on a live page, and the link next to their name is that page.
- **The size figure is sourced.** Employee counts and turnover come from filed accounts, or from the firm's own team page where no accounts figure exists.
- **Five firms were removed** during checking: two had no named person, three had a name that could not be confirmed on a live page.

That leaves **{N_ALL} firms, {N_UK} in the UK and {N_OS} outside it**, every one with a person to call.

The check is a point in time. People change jobs. The link is there so you can look before you dial.

## Sources {#sources}

::: {.sources}
- Companies House, filed accounts and officer records — https://find-and-update.company-information.service.gov.uk/
- Each firm's own website and team page, linked beside every name in this book.
- Trade rules cited in the "why now" lines: HMRC R&D guidance, UK Finance remortgage forecasts, Ofgem and supplier rules, FCA and SRA requirements where named.
:::

::: {.footnote}
Prices in this book are Twinthos test prices, not market rates. Employee counts and turnover are quoted from the filing named in each line, or from the firm's own page. Where a figure was not available it is not stated. AI status: AI FOUND — the service sold is a digital employee running inside the client's own tools.
:::
""")

md = "\n".join(out)
md = md.replace("{N_ALL}", str(N_ALL)).replace("{N_UK}", str(N_UK)).replace("{N_OS}", str(N_OS)).replace("{NWORD}", NWORD)
md = re.sub(r'\n{3,}', '\n\n', md)
open('/root/twinthos-brain/scripts/docpipe/docs/prospect-book.md','w').write(md)
print("words:", len(md.split()), "chars:", len(md))
