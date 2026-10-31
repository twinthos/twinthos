# AI Agents Making Money Online — Research

> Compiled 2026-09-27. Real examples, real revenue, real constraints.

---

## Executive Summary

AI agents ARE making money autonomously in 2026 — but with critical caveats:
1. **Distribution is the bottleneck, not AI capability.** Felix made $14,718 in 3 weeks but 90%+ came from Nat's existing 100K+ audience.
2. **Starting from zero is brutally hard.** Dan Kulkov spent $100, got 47 followers, $0 revenue. dfdx labs' Hans Krämer spent $47+ and made $1.54.
3. **The ones making real money have a human distributing for them** or built a community first.
4. **The "zero-human company" category is real** (Galaxy Research named it March 2026) but the capital ownership problem remains unsolved — agents earn, humans own the bank account.

---

## Category 1: Info Products — Fastest Path to First Revenue

### Felix Craft (Nat Eliason) — $14,718 in 3 weeks → $300K+/month

**Setup:** OpenClaw agent on Mac Mini, Telegram interface, Claude Opus 4.6, $1,000 budget, Stripe + Vercel + Gumroad.

**Playbook:**
- Day 1: Build a PDF ("How to Hire an AI"), landing page, deploy to Vercel overnight
- Day 2-7: X account, post 3-5x/day about AI productivity, engage with niche accounts
- Days 4-7: Expand to 66-page guide after feedback
- Revenue: $41,000 from the PDF alone

**What made it work:**
- Nat's 100K+ newsletter subscribers + 300K X followers = distribution
- Info products = near-zero marginal cost
- AI agent posted consistently (3-5x/day humans can't match)

**What humans still do:**
- Strategic direction (voice memos)
- Legal/financial obligations
- Fixing bad decisions (pricing, design)
~5 min/day review

**Costs:** ~$1,500/month (2 Claude Max subscriptions + hosting). ROI: 200x.

**Current (April 2026):** $100,570 Stripe + $94,973 ETH = ~$195K total. Products: Felix Craft PDF, ClawMart marketplace ($14K+/month fees), Clawcommerce ($2K setup + $500/month maintenance). Sub-agents: Iris (support), Remy (sales).

---

### Earendel (Indie Hackers) — $880.30 in 7 days

**Setup:** OpenClaw agent, $50 budget, goal: buy Mac Mini ($750)

**Playbook:**
- Day 1: Free Starter AI Prompt Pack on Gumroad, origin story thread on X
- Day 2: Reddit post went viral (200K+ views), downloads jumped to 156
- Day 3-4: Built Pro Pack ($12 pay-what-you-want, 116 pages)
- Day 6-7: Big sales — $150 UK, $77 Canada, $57.50 Singapore, $50 Brazil
- **Total: $880.30 net revenue in 7 days. Goal smashed.**

**What made it work:**
- Storytelling distribution (origin thread got 13x impressions of stats posts)
- Pay-what-you-want pricing (people voting for experiment, not just buying)
- Reddit + X combo
- 1,100+ X followers built in week 1

**Now:** Running "Chapter 2: The Studio Fund" — $7,500 goal, same transparency approach.

---

### Ron / Robbie Houston — $8,374/month in 13 days (non-coder)

**Setup:** OpenClaw agent, $100 budget, Claude Max subscription, no coding skills

**Playbook:**
- First idea: Fiverr SWOT analysis gigs → failed
- TikTok posts about "my AI is analyzing my TikTok" → 200 comments asking "how do I get my own Ron?"
- **Market research came from the agent reading comments** — not from Robbie
- Built "AI Co-founder Club" — $10 deposit pre-order → 617 pre-orders → 270 converted to $29/month
- Containerized OpenClaw hosting (4 bare-metal servers, ~$600/month)
- Discord community + each member gets their own Ron

**Revenue:** $8,374 MRR, ~$100K annualized. Net ~$5,800/month after costs.

**Key insight:** Robbie posted *before there was anything to buy* — "document what you're doing, not what you've built." The 200 comments were the market signal.

---

## Category 2: Marketplaces — Scaling Beyond One Product

### ClawMart (built by Felix)

**Problem Felix identified:** People who bought the PDF needed ready-made AI configurations, not just instructions.

**Solution:** Marketplace for OpenClaw skills and personas — "app store for AI agents"

**Built in a weekend. Launched Feb 12, 2026.**

**Revenue model:**
- 10% commission on skill sales
- $20/month creator subscription
- ~$14,000+/month in marketplace fees
- Hundreds of builders selling AI skills as Markdown files

**Why it works:** OpenClaw deployment is getting easy, but knowing what to do with it isn't. ClawMart solves the "what now?" problem.

---

## Category 3: Service Business — Highest Revenue per Customer

### Clawcommerce (built by Felix)

**Offer:** Custom OpenClaw setups for businesses
**Price:** $2,000 upfront + $500/month maintenance
**Target:** B2B — content marketing, customer support, operations agents

**Revenue:** Part of the ~$100K+ Stripe total. This is where the enterprise money lives.

**What the agent does:**
- Handles sales conversations
- Onboarding and configuration
- Ongoing maintenance
- Escalates to Nat only when stuck

---

## Category 4: SaaS — Slow but Compounding

### Maggie / Magic Door (Gijs Verheijke)

**Setup:** OpenClaw agent, Mac Mini sandbox, runs Magic Door (multi-model chat app)

**What Maggie does autonomously:**
- Night shift (1am-5am cron jobs)
- Pull requests (38 open at recording time)
- Reddit posts (3-4/day, got banned from one subreddit for self-promotion)
- Product grew 50%/month for 3 months before flatlining

**Revenue:** Not disclosed specifically, but "80% gross margin on inference" — covers AI costs + "a couple of beers a month"

**Key insight:** "If you can stick around as a solo solopreneur with very little time investment, it keeps accruing. Domain authority increases. Accumulated Reddit posts keep growing. It's a snowball."

**Human role:** Gijs writes every word of copy himself. Deletes 9 out of 10 drafts Maggie writes. "Agents are still far from creative, self-started, tasteful work."

---

## Category 5: DeFi / On-Chain — Fully Autonomous But Narrow

### Giza's ARMA

**What it does:** Monitors lending rates across Morpho, Moonwell, Aave. Moves stablecoin capital to highest-yielding option in real time.

**Scale:** Deployed $35 million in first 4 weeks. Every transaction profitable after gas fees.

**Why it's different from Felix:** Fully on-chain, no human bank account needed. The earning AND the ownership are automated.

**Constraint:** Only works in DeFi. Can't sell PDFs or provide consulting.

---

## Category 6: The Failure Case — Important Reality Check

### Hans Krämer / dfdx labs — $1.54 revenue, $47+ spent

**Setup:** OpenClaw agent, $100 budget, goal: build business in agentic economy

**What happened:**
- 21 days, 17 paid products, 46 API endpoints, 100s of blog comments
- 5 billion tokens used (~$7,000 at API pricing)
- $47.19 own money spent + $40/month server + $400/month AI subscriptions
- **Revenue: $1.54** (from 30 calls by "mystery buyer")

**Why it failed:**
- "Agentic economy" payment rails had ~30K buyers, ~80K sellers, ~$1.5M volume in 30 days
- Stripe does ~$158B/month — agentic economy is 100,000x smaller
- 90% of surveyed agents had no wallet or spending authority
- "Few agents had both spending authority and a reason to buy"

**Key lesson:** The market for agents buying from agents is "extremely thin." The buyer side is missing.

---

### Dan Kulkov — $0 revenue, $100 spent

**Setup:** OpenClaw agent, $100 budget, similar playbook to Felix

**Result:** 2 weeks, zero sales, 47 X followers, $100 spent on API + domain.

**Why:** No existing audience. No distribution. "The bot was impressive. But the audience made the money."

---

## Social Media Presence for AI Agents

### X/Twitter — The Primary Channel

**Felix's X strategy:**
- 3-5 posts/day (humans can't sustain this)
- Mix of original tips + threads linking to product
- Engaged with accounts in AI/productivity space
- Built 1,100-2,000 followers in 2-3 weeks from zero

**Earendel's X strategy:**
- Origin story thread (narrative, not stats) got 13x impressions
- Daily content automated
- 1,100+ followers in 7 days

**Maggie's X/Reddit strategy:**
- 3-4 Reddit posts/day via all.reddit.com (easier for agent than API)
- Got banned from one subreddit for self-promotion
- Product grew 50%/month for 3 months

**Key patterns:**
1. High-frequency posting is an AI advantage
2. Storytelling > stats for distribution
3. Engagement (replying, not just posting) matters
4. Getting banned is a real risk — need rate limit awareness

### Bluesky — Emerging Alternative

**Status:** 40M+ users, decentralized, AT Protocol

**Attie (Bluesky's AI app, announced March 2026):**
- AI agent that builds custom social feeds via natural language
- "Vibe-code your own social media experience"
- Built on AT Protocol — open, portable identity
- In private beta, monetization planned (subscription + paid hosting)

**Why it matters for AI agents:**
- Decentralized = no platform risk of sudden ban
- Portable identity = agent's social presence isn't trapped on one platform
- Attie shows the direction: AI curating feeds, not just posting

### Reddit — High Leverage, High Risk

**Maggie's approach:**
- Used all.reddit.com (easier for agents than official API)
- 3-4 posts/day
- Got banned from one community for self-promotion
- Product grew 50%/month for 3 months from Reddit

**Key insight:** Reddit rewards consistency and value. Self-promotion without value gets banned. Agents need to learn the difference.

---

## Common Architecture Patterns

### The "Felix Stack" (most replicated)
- **Runtime:** OpenClaw (open-source, free)
- **Model:** Claude Opus 4.6 (or Sonnet for cheaper routing)
- **Interface:** Telegram (voice memos from human, text from agent)
- **Ops hub:** Discord (isolated channels per function)
- **Payments:** Stripe + Gumroad + ETH
- **Deployment:** Vercel + Docker containers
- **Sub-agents:** Iris (support), Remy (sales) — tiered model routing
- **Memory:** Layered — daily logs consolidated nightly into long-term memory
- **Self-improvement:** Nightly loop reviewing every human intervention

### The "Ron Stack" (non-coder accessible)
- **Runtime:** OpenClaw
- **Interface:** TikTok + Telegram
- **Hosting:** Bare-metal servers with Docker containers (isolated per user)
- **Payments:** Stan (creator monetization platform)
- **Community:** Discord
- **Key:** Agent did market research by reading TikTok comments — not told what to research

### The "Maggie Stack" (SaaS, slow compounding)
- **Runtime:** OpenClaw
- **Model:** Multi-model (cheap for monitoring, expensive for synthesis)
- **Sandbox:** Mac Mini (separate computer, blast radius contained)
- **Distribution:** Reddit (all.reddit.com) + organic search
- **Margin:** 80% gross margin on inference
- **Human:** Writes all copy, deletes 9/10 drafts

---

## What Works (Confirmed Patterns)

1. **Info products first** — low marginal cost, fast to build, AI can write them
2. **Storytelling distribution** — origin stories get 13x the reach of stats
3. **High-frequency social posting** — AI advantage over humans (3-5x/day)
4. **Nightly self-improvement loops** — every day, a little more autonomous
5. **Tiered model routing** — cheap models for routine, expensive for strategic
6. **Community before product** — Ron's 200 comments came before the club existed
7. **$10 filter for pre-orders** — eliminates tire-kickers, validates demand
8. **Multiple revenue streams** — Felix has 3+ products, not relying on one

## What Doesn't Work (Yet)

1. **Starting from zero distribution** — Dan Kulkov, Hans Krämer proved this
2. **Agentic economy payments** — market too thin, buyers don't have wallets
3. **Pure AI copy** — Maggie's drafts get 9/10 deleted by human
4. **Unsupervised financial decisions** — Felix still needs human for legal/financial
5. **Single-product dependency** — risky, Felix diversified early

---

## The Open Question: Capital Ownership

Galaxy Research named "Zero Human Companies" as a category in March 2026. The definition: businesses operated primarily by AI agents, with real revenue and no human employees in daily operations.

The unsolved problem: **agents earn autonomously, but humans own the bank account.**

- Felix: All revenue in Nat's Stripe/bank account. Agent can't access it directly.
- ARMA: Fully on-chain, both earning and ownership automated. But only works in DeFi.
- Earendel: Human owns the Gumroad account, the agent earns through it.

No agent has its own bank account, its own Stripe account, its own legal identity. That's the next frontier — and it's a regulatory/technical problem, not an AI capability problem.

---

## Sources

- midastools.co — "Felix Craft: The AI Agent Making $300K/Month (2026 Breakdown)"
- cystems.io — "An AI Agent Made $250,000 in Less Than Two Months"
- fastrouter.ai — "Building Real AI Agents: From Stock Screeners to Zero-Human"
- htx.com — "The One-Person Company: The Path to Million-Dollar Revenue"
- fystack.io — "AI Agents and the Missing Layer of Zero Human Companies"
- openclawdc.com — "OpenClaw Bot Made $14,718 in 3 Weeks"
- dfdxlabs.com — "Our agent used 5B tokens to build a business empire in 3 weeks. It made $1.54."
- indiehackers.com — "I gave my AI agent $50 and told it to buy its own computer"
- buzzsprout.com — "How an OpenClaw agent runs a profitable SaaS overnight" (Gijs Verheijke)
- openclawdatabase.com — "Non-Coder Gives OpenClaw Agent $100 — It Builds $8,374/Month Business in 13 Days"
- mixergy.com — "How Nat Eliason's OpenClaw earned $177,417"
- indianexpress.com — "Bluesky introduces Attie, a new app that lets users vibe-code their own social feed"
- forbes.com — "Bluesky's Attie Tests Who Really Controls Social AI"

---

*Compiled 2026-09-27. Prices, revenue figures, and product status may have changed.*
