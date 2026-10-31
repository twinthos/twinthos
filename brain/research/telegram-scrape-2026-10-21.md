# Telegram scrape, 21 October 2026

**What this is.** A real scrape of public Telegram channels, run today, looking for
operator methods that help Twinthos sell and deliver. Not a summary of what Telegram
might contain: 449 messages pulled across 20 channels and read.

## How it was pulled

Telegram's own web preview (`https://t.me/s/<handle>`), paginated with `?before=<id>`.
No API key, no phone number, no user session. Script: `scripts/telegram_scrape.py`.
Raw corpus: `research/tg_raw.jsonl` (315,556 characters, one JSON object per message).

**What the bot token cannot do.** The token in `~/.hermes/.env` is a bot token. A bot
receives only what people send it directly; it cannot read channel history, cannot join
a channel without an admin adding it, and cannot search. So "scrape Telegram" through
the bot is impossible by design. The only route without a session is the public web
preview, which is what this used.

**Dewey has no public channel.** Probed `t.me/s/dewey`, `deweyai`, `getdewey`: zero
messages each. Nick Vasilescu publishes on X, not Telegram, and those 44 posts are
already in `research/nick-vasilescu-posts.md`.

## The corpus

| Channel | Msgs | Verdict |
| --- | --- | --- |
| `salestech` | 30 | **The only substantive source.** Russian B2B sales + AI. Long, first-person, operational. |
| `LicbeAIMedia` | 60 | Russian AI news aggregator. Product launches, no method. |
| `codeprogrammer` | 57 | Technical explainers (transformers, residual streams). No commercial method. |
| `digitalemployees` | 40 | Dormant; channel-created notices and fragments. |
| `sales_talk` | 40 | Sales job adverts (Ukrainian/Russian). Useful only as a market signal. |
| `snovioupdates` | 38 | Vendor product marketing. |
| `manusagentai` | 35 | Vendor marketing, some crypto. |
| `aiagency` | 32 | Vendor marketing. |
| `aipost` | 27 | News. |
| `aiedgeofficial` | 20 | Prompt packs from a YouTube channel. |
| `aisales`, `outboundmarketing`, `aifounders`, `aiagents`, `neuro_agency`, `agencygrowth`, `coldemailmarketing`, `aiautomations`, `agentsaiportal`, `aiemployee` | 2–17 each | Dormant or noise. |

Yield: roughly 6 posts out of 449 carried a method worth keeping. That is what public
Telegram looks like. The value was not volume, it was two long posts.

## What was worth keeping

**1. The six-stage map of AI in a B2B sales process** — `t.me/salestech/163`, 20 Aug 2026.

Prepare (who and where to sell: segmentation, ICP, account research, sales scenario) →
Find (spot the buyer before they arrive: new hire, funding, tech stack, site visits) →
Contact (reach the right person: contact data, personalisation, channel choice, touch
sequence) → Sell (help inside the deal: meeting prep, call summary, next step, objections,
proposal) → Manage (what is really happening in the pipeline: stalled deals, risk, silence)
→ Grow (expand the account).

Named tools per stage: Clay, 6sense, Common Room (prepare/find); Apollo, Clay, Unify,
Qualified Piper (contact); Gong (sell and manage); Clari (manage).

Why it matters for Twinthos: this is the shape a *prospecting digital employee* must take.
One employee cannot own all six stages. Twinthos should sell one stage, run it end to end,
and prove it with numbers.

**2. The client pays for an effect, not a product** — `t.me/salestech/182`, 22 Sep 2026.

The author moderated a panel at a Russian retail forum. One participant priced the
argument: winning a new client costs about 2,000 ₽; getting more work from an existing
client costs about 400 ₽. The test he gives for any complex B2B product: can you explain
the value in the client's money, time and risk rather than in your features.

**3. What actually works with AI in sales, and the honest failure mode** — same post.

Working cases on that panel: cleaning and enriching client databases; personalised
outreach; finding stalled deals in the CRM; meeting analysis and rebuilding context after
long gaps; drafting large RFI/RFP responses; researching the decision-maker before a
meeting; onboarding new salespeople. One example: a 57-page RFI took a week of personal
time by hand, a few hours with AI.

The failure mode, stated by several participants: configuring the agent, correcting its
errors and supervising it can take as long as doing the task, so people stop using it.
Their conclusion is the test Twinthos should hold itself to: **a specific task → known
hours of effort → automation → measured effect.** If step two is missing, there is no case.

**4. Most sales teams do not have an AI problem, they have an undefined process** — same post.

Before automating, the panel's six questions: what do we sell, to whom, why should the
client buy, what stages does a deal pass through, where does it stall, and what has to
happen for it to move. Inside one department the answers often disagree. Automating a
process nobody has written down just makes the confusion faster.

## What this changes

- Selling one clearly bounded stage, with the hours and the effect measured, is the
  sellable unit. Selling "AI in your sales team" is not.
- The demo has to show the effect on the client's own material, because the panel's
  objection is supervision cost, not capability.
- The six-stage map is now the structure for how Twinthos describes a prospecting
  employee: `sops/dewey-prospecting-playbook.md`.

## To go further

Reading more Telegram needs one of two things and both are the user's to do:
1. An MTProto session (`api_id`/`api_hash` from my.telegram.org plus a phone login) for a
   real account, which unlocks channel search and reading any public channel by keyword.
2. The bot added as an admin to specific channels, which only unlocks those channels.

Until then the honest statement is: public preview works, was scraped, and yielded six
usable posts.
