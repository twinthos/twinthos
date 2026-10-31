# Nick Vasilescu — AI Agent Methods & Playbook (Expanded)

**Who:** Co-founder & Head of Growth at Orgo. Cloud VMs for AI computer-use agents (sub-500ms boot headless Linux desktops via API/SDK). YC-backed. From pre-med biology → 혁신 design → AI agents. Built Testkey (medical device, won $25k at Wichita State). Started in Berkeley hacker house electrical room under stairs with 1 month runway left → 10 months later YC. YouTube @nickvasiles, X @nickvasiles (14K followers), Agent Empire Skool community (free), Substack newsletter. Everything built in public with real client deployments streamed live.

---

## PART 1: NICK'S METHODS — WHAT I LEARNED FROM 11 TRANSCRIPTS

### The Business Model in His Words

**"People are charging $5,000 a month per customer to build and manage agents for them. This is a startup idea I wish more people would do. The customer doesn't touch tokens or models or any infrastructure. They just get a digital employee that knows their business and it gets better every single week."** (BI-MNjm1tTQ, 0:00)

**"You're selling an AI employee, you're not selling an AI agent. People need less agents than they actually think that they need."** (BI-MNjm1tTQ)

**"The minute you say oh you're going to be paying for X amount of credits... it ruins the magic. The more clarity, the more simplicity you can create in the offer... the faster time to yes."** (BI-MNjm1tTQ)

**"These categories are large — law, insurance agency, manufacturing, wholesalers, real estate. The key here is once you've identified a category, then you have to figure out what is the subcategory or sub niche that I want to go after. It's too hard to just focus on wholesalers."** (BI-MNjm1tTQ)

**"The decision maker at the end of the day has very similar problems, no matter what the industry is. They have too many emails, too many meetings, too many follow-ups, too many open loops. They have context over so many different projects and places and people to keep track of."** (BI-MNjm1tTQ)

**"Content is like overpowered in 2026... The most leveraged thing you can do is post a piece of content that reaches a lot of people and then have this robot that helps you fulfill for the thing that you're providing as you go on a walk or you right before you go to bed or when you wake up."** (BI-MNjm1tTQ)

**"I think everyone should make content. If you can jump on a call with somebody and they know who you are and what you sell without you having to tell them and they're warm to begin with, that's the ideal position to be. You never want to be in a position where you're having a cold call. You never want to sell to a cold audience."** (BI-MNjm1tTQ)

**"Starting for free even is sometimes worth it just to get case studies and get referrals."** (BI-MNjm1tTQ)

### The Stack (exactly as he uses it)

**Cloud computer:** Orgo — each agent gets its own computer. "Orgo will host the computer environment and together these two things make up a computer using agent."

**Orchestrator:** Hermes Agent. "I have my own Hermes agent is what I use these days."

**Models (his picks):** GPT-5.5, GLM-5.1, Kimmy, Opus 4.7. "Claude Opus 4.5 is the model and the computer environment to have that model running in... they keep getting better and better."

**Connectors:** Composio — "one connector, every tool."

**Comms:** AgentMail (email), AgentPhone + iMessage (phone/SMS). "Its own email (AgentMail). Its own phone number (AgentPhone + iMessage)."

**Interface:** Telegram as main chat. "I'll send off a long horizon task to my agent via Telegram."

**Knowledge base:** Obsidian vault as second brain. "Why Obsidian Is the Second Brain Layer." Daily notes synced from voice memos/transcripts.

**Coding:** Claude Code for coding tasks. "I'm just going to tell Claude code which I showed you how to do it."

**Observability:** Latitude — "Latitude for observability so I can know when shit breaks."

**Payments:** Credit card so agent can spend money autonomously.

**Template:** nicks-stack on GitHub — ready-to-run Hermes AI agent template for Orgo. "Bring your own keys; zero secrets baked in."

### Architecture: Orchestrator + Sub-Agents

**"I made one main orchestrator agent (named it Hubert) that stays in charge 99% of the time and just hands tasks off to specialized sub-agents underneath it. One giant bloated agent is a nightmare to debug. This way everything stays clean and purpose-built."** (Skool post, Jul 2 2026)

**"Starting with a workflow is how I like to start because it's a single use case. Makes things clearer, simpler, less failure points. You get one nailed use case, start there. But then after you have that, it's also just a very competent employee that can do other things too adjacent to that task that it's already really good at."** (bpM9D1kQaAs)

**Each agent gets its own persistent Orgo computer. The computer stays running. Agent is shut down to save token cost when task is complete, but computer remains so agent can return to same state.**

**"The agent should be shut down of course just to save token cost when the task is complete but the computer itself should remain running so that the agent could always return to that same computer whenever the script is run again."** (gHCZzYBZy4U)

### The Prompt IS the Program

Nick's prompts include:
1. Claude's computer use API docs (copied from actual docs)
2. Orgo docs (copied for context)
3. The specific task description in natural language
4. Environment setup notes — which tabs to pre-open, login state, browser state

**"I took Claude's computer use doc and I copied that. I took their actual API docs. I copied that. And then I took all the orgo docs. I copied those for context for the AI model. So now the AI has that as context."** (gHCZzYBZy4U)

**"If you can describe a process in words and understand the sequence and combination of these different elements involved of a workflow, then you can create a computer use agent for it with natural language... you don't have to write a single line of code."** (t6wWLVd-C_I)

**"I haven't written a single line of code for the clients that I've delivered computer use agents for because I understand the system, I understand the architecture and I'm able to clearly communicate to the agent what I want it to do."** (t6wWLVd-C_I)

### Demo-First Sales

**"This is just a demo to get her sold into the service... wowing her is important. And I think this is another big asset of computer use agents is that they have this wow factor. They have this sexy factor to them where like traditional workflow automations they're just all in the back end, they're all APIs. Computer use is very visual. You can understand what's going on as a client who has no tech experience. It's very cool to watch."** (gHCZzYBZy4U)

**"When you have a sexy demo, you can convert the client."** (gHCZzYBZy4U)

**"I'll be sending clips of this video to the client as far as the demo goes."** (gHCZzYBZy4U)

### Computer Use Agent Definition (Nick's own words)

**"LLM agents are essentially AIs that have access to tools and these tools allow them to do things that we can do in a non-deterministic way... Computer use agents are actually a tool that LLM agents can use to now operate a computer environment and those LLM agents combined with a computer environment is what makes a computer use agent."** (t6wWLVd-C_I)

**"LLMs like Claude... Opus 4.5 this is the best computer use model at the moment and they keep getting better and better... Orgo will host the computer environment and together these two things make up a computer using agent."** (t6wWLVd-C_I)

**"Every reason that a personal computer for a human is valuable is also a reason for a personal computer being valuable for AI. So in this case you're watching a computer using agent open up Firefox and it's now navigating to a website... It's not very an intellectually stimulating task. It involves going to different platforms using different tools to get data on something and store that data in a centralized way. It's just a very data repetitive monotonous task which AI will now replace."** (t6wWLVd-C_I)

**"2025 was the year of agents in general but I believe that 2026 will be the year of computer use agents."** (t6wWLVd-C_I)

### His Content Strategy (from his own description)

**"I do recommend that [making content]. I mean that's how we met, you know, it's like it's like midnight, can't fall asleep. I'm like doom scrolling Instagram, I see Nick's face pop up showing me how to use open claw and I was like this is a guy who has some sauce and I need to have him on the podcast."** (BI-MNjm1tTQ — Greg Isenberg describing how he found Nick)

**"It also helps you you know get known, get on podcasts, hire the right people. So there's there's a lot of advantages in an AI world when you can use AI to automate a lot of the research and a lot of the just help you know the editing and things like that."** (BI-MNjm1tTQ)

**"I recently built a Stripe refund request agent..."** — he copies working prompts from previous builds. Reuses them. (gHCZzYBZy4U)

### "I Just Love Being in the Trenches"

**"I just love being in the trenches — hands on, building agents for customers. Starting to record all of these builds, and even do some of them live."** (nickvasilescu.com/blog, 2026-06-30)

**"I changed my mind on this. One agent is all you need to start — but the minute you're running hundreds of skills and automations, you need a fleet of them working in parallel."** (nickvasilescu.com/blog, 2026-07-02)

**"It's comical how similar an AI automation agency is to a marketing agency from 2014. The fixed-retainer model is back — but instead of ad spend you have tokens, and instead of ad campaigns you're deploying managed AI employees."** (nickvasilescu.com/blog, 2026-06-29)

---

## PART 2: YOUR FIRST CLIENT — STEP-BY-STEP PLAYBOOK

This is reconstructed from Nick's methods + general agent business best practices. Not Nick's exact words, but derived from his approach.

### Phase 0: Before You Talk to Anyone

**1. Pick one vertical you understand or can research fast.**
Nick's recommended starting verticals: marketing agencies, law firms, insurance agencies, manufacturers, wholesalers, real estate agencies. Avoid healthcare and finance initially (regulatory burden).
Sub-niche within it: geography + specialty. Example: "commercial real estate agencies in Florida" or "personal injury law firms in Texas."

**2. Pick ONE use case within that vertical.**
Nick's pattern: identify what the decision maker struggles with across all industries — too many emails, too many meetings, too many follow-ups, too many open loops, context spread everywhere. Then layer in vertical-specific solutions.
Example use cases:
- Re-engage dormant customers/leads (Nick's demo use case — bpM9D1kQaAs)
- Prospect + create pipeline for sales team
- Form filling / data extraction from websites into sheets/CRMs (Nick's demo — gHCZzYBZy4U)
- Fraud detection & website signup screening
- Triage buying signals
- Monitor viral content
- Follow-up automation for missed calls/emails

**3. Build the agent on your own computer first.**
Use Hermes Agent + Orgo + Composio + the model of your choice. Nick uses Claude Opus for computer use. Build it for yourself or a fake client first. Get it working end-to-end. Record everything.

**4. Record a screen-capture demo.**
Nick's exact words: "I'm going to be sending clips of this video to the client as far as the demo goes." Computer use is visual — the demo is the sales tool. "When you have a sexy demo, you can convert the client."

**5. Set your pricing.**
Nick's: $5,000/month flat. Unlimited agents, unlimited usage, unlimited monitoring, support, security, ongoing changes. "You're selling an AI employee, you're not selling an AI agent." Don't mention tokens, credits, or usage.

### Phase 1: First Client Acquisition

**Option A — Content-first (Nick's preferred):**
- Post content about building the agent (screen recording, walkthrough, before/after)
- "Content is overpowered in 2026"
- Goal: people know who you are and what you sell before the call
- "You never want to sell to a cold audience"
- Get on podcasts (how Nick met Greg Isenberg)

**Option B — Direct outreach (also works):**
- Identify 10-20 businesses in your vertical
- Find the decision maker (owner, partner, executive)
- Send them the demo video
- Frame: "I built this for [similar business]. It handles [specific pain]. $5K/month. 48 hours to first agent."
- "Starting for free even is sometimes worth it just to get case studies and get referrals"

**Option C — Start free for a case study:**
- Find one business willing to try for free or heavily discounted
- Get a testimonial + case study
- Use that to charge full price to the next 3 clients

### Phase 2: The First Client Engagement (48-hour playbook)

**Hour 0-2: Discovery call**
- Understand their specific workflow. "If you can describe a process in words and understand the sequence and combination of these different elements involved of a workflow, then you can create a computer use agent for it."
- Identify the ONE use case. Not 10. One.
- Ask: "What's the most repetitive, monotonous task that a human does that you'd pay someone $5K/month to never do again?"
- Map the workflow: what websites, what data, what output, what decisions
- Get their login credentials for any systems the agent needs (or set up agent-native accounts — AgentMail, AgentPhone)

**Hour 2-4: Design the agent**
- Write the prompt. Include: Claude/Orgo docs for context, the specific task description, environment notes (tabs to pre-open, login state, expected navigation flow)
- "I took Claude's computer use doc and I copied that... And then I took all the orgo docs. I copied those for context for the AI model."
- Design the orchestrator prompt — what it should do, when to stop, how to verify its work
- "The agent should also automatically be logged in to Google Sheets. Just a heads up. The agent should also already be met with a computer that has the Google Sheet tab open along with the [site] tab open. But in the case that they are not, then the agent must open Firefox and navigate to the appropriate tabs."

**Hour 4-12: Build on Orgo**
- Spin up an Orgo computer (sub-500ms boot)
- Install Hermes Agent + your template
- Configure Composio connectors for any external tools
- Set up the agent's own accounts (email, phone) if needed
- Write the prompt into the agent's config
- Test locally on your machine first, then on the Orgo computer

**Hour 12-24: Test and refine**
- Run the agent against real data
- Watch it work. Take screenshots. Record the screen.
- "You can see it clicking, waiting, taking screenshots, looking around."
- Fix edge cases: what happens when the site changes? When data is missing? When login fails?
- "If it hasn't [gathered all information], then it will tab back and forth."
- Add verification steps: "It's going to probably go back and double check everything like any good employee should do."

**Hour 24-36: Build the demo**
- Record a clean screen capture of the agent doing the full workflow
- Edit it down to 2-5 minutes
- This is what you send to the client and use in sales

**Hour 36-48: Handoff**
- Set up the agent on the client's infrastructure (their Orgo computer, their accounts)
- "Each agent gets its own computer" — give them their own Orgo workspace
- Train them on how to trigger it, how to check its work, how to reach you
- Set up monitoring (Latitude or similar) "so I know when shit breaks"
- Schedule a weekly check-in

### Phase 3: Delivery and Expansion

**The ongoing retainer:**
- $5K/month includes: the agent(s), monitoring, support, security, ongoing changes, new workflows as they come up
- "Unlimited agents, unlimited usage, unlimited monitoring, support, security, ongoing changes, etc."
- Weekly review: what did the agent do? What broke? What's next?
- Add new use cases as the client sees value: "after you have that, it's also just a very competent employee that can do other things too adjacent to that task"

**Expanding to more clients:**
- Template everything. "Nick makes a template for each agent he creates and gives them all away — spin up an AI employee in minutes, not days."
- Your first client's workflow becomes the template for client #2 in the same vertical
- "Fleet-scale agents: one agent → many. Scaling from single agents to cloned fleets on Orgo — one computer per agent, templates all the way down."

**Scaling yourself:**
- Record all builds. "Starting to record all of these builds, and even do some of them live."
- Turn each build into content → attracts more clients
- Eventually: orchestrator agent manages sub-agents across multiple clients
- "One agent to start — then a fleet"

---

## PART 3: MAIN BOTTLENECKS BY INDUSTRY

These are the operational bottlenecks that make each vertical a good fit for AI agents AND the specific challenges you'll hit building for them.

### Marketing Agencies

**Bottlenecks:**
- Client onboarding is repetitive: same questions, same setup, same reporting every month
- Content production at scale: writing posts, finding images, scheduling across platforms
- Lead follow-up: inbound leads from ads/forms sit unattended
- Reporting: pulling data from Google Ads, Meta, analytics into/client reports
- Account management: staying on top of dozens of client accounts, deadlines, deliverables

**Agent opportunities:**
- Automated client reporting agent (pulls data, writes summary, sends to client)
- Content production agent (drafts posts, finds images, schedules)
- Lead response agent (catches inbound leads within minutes, even off-hours)
- Onboarding agent (collects assets, sets up tracking, sends welcome sequence)

**Challenges:**
- Each client has different tools, different logins, different processes
- Agency owners are hard to sell to — they've seen every "AI will fix it" pitch
- Compliance: client data, ad account access, creative approvals
- Renewal conversations: clients churn when they don't see ROI fast

---

### Law Firms

**Bottlenecks:**
- Lead intake: website forms, phone calls, chat — lawyers miss potential cases
- Client intake forms: repetitive data collection, conflict checks, engagement letters
- Document drafting: repetitive clauses, standard documents, template filling
- Courthouse filing: checking status, deadlines, docket updates
- Follow-up: unpaid invoices, case status check-ins, referral follow-ups
- Research: finding relevant case law, statutes, precedents (time-consuming, billable-hour pressure)

**Agent opportunities:**
- Lead intake agent (captures leads 24/7, qualifies, routes to right attorney, sends engagement info)
- Document automation agent (fills templates, checks for consistency, generates first drafts)
- Deadline tracking agent (monitors dockets, calendar alerts, filing reminders)
- Client communication agent (status updates, invoice reminders, appointment rescheduling)

**Challenges:**
- Confidentiality — client data, case details, privileged communications
- Ethics rules — attorneys can't delegate certain tasks; "unauthorized practice of law" concerns
- Trust barrier — law firms are conservative, slow to adopt
- Billing model conflict — hourly billing means efficiency can reduce revenue (unless positioned as capacity increase)
- Regulation — varying by jurisdiction, some AI use may need disclosure

**Nick specifically calls out law firms as a top vertical. "If it's a law firm and you have a partner who wants to buy your services, you can have all of these things out of the blocks for your agents that you set up... oh yes, we have an agent that does following up with people, projects, etc., but it also manages your cases, it does demand letters for your law firm."** (BI-MNjm1tTQ)

---

### Insurance Agencies

**Bottlenecks:**
- Policy renewals: hundreds of policies expiring at different dates, manual outreach
- Quote comparison: shop multiple carriers for each new client, repetitive data entry
- Claims follow-up: checking status, pushing adjusters, client communication
- Lead response: inbound leads from websites, referrals, partnerships — time-sensitive
- Compliance documentation: updating client files, regulatory records, annual reviews
- Client communication: annual reviews, coverage checks, life event updates

**Agent opportunities:**
- Renewal agent (tracks expiring policies, outreach sequence, comparison quotes)
- Lead response agent (catches inbound leads, qualifies, schedules appointments)
- Claims status agent (monitors claims, follows up with adjusters, updates clients)
- Annual review agent (identifies clients due for review, schedules, prepares coverage summary)

**Challenges:**
- Compliance — insurance is heavily regulated, statements must be accurate
- Carrier systems — many different underwriting platforms, some with no API
- Consent — agents need authorization to access client policies, make changes
- Licensing — in some jurisdictions, certain activities require licensed agents
- Data accuracy — wrong quote or coverage detail = liability

---

### Manufacturers

**Bottlenecks:**
- Order processing: receiving POs (email, fax, portal), entering into ERP, confirming
- Inventory monitoring: tracking stock levels, reordering, supplier coordination
- Shipping/logistics: tracking shipments, coordinating with carriers, update customers
- Supplier communication: reordering, lead time checks, quality issues, price comparisons
- QA documentation: inspection reports, compliance certificates, lot tracking
- Customer service: order status inquiries, rush requests, returns/RMAs

**Agent opportunities:**
- Order entry agent (receives POs, enters into system, confirms with customer)
- Inventory reorder agent (monitors stock, triggers POs when thresholds hit, coordinates suppliers)
- Shipment tracking agent (monitors in-transit orders, updates customers, flags delays)
- QA doc agent (compiles inspection reports, generates certificates, files compliance docs)

**Challenges:**
- Legacy systems — many manufacturers run on old ERPs with no API (exactly the use case for computer-use agents)
- B2B relationships — sales cycles longer, trust takes time, switching costs high
- Accuracy — wrong orders, wrong shipments = expensive
- Integration complexity — ERP, WMS, TMS, supplier portals, customer systems
- Physical world dependency — agents can handle the digital workflow but not the physical manufacturing

**Nick specifically calls out manufacturers as a top vertical: "They want to be a full-stack AI company. Meaning they want to be like fully automated with AI."** (BI-MNjm1tTQ)

---

### Wholesalers

**Bottlenecks:**
- Inventory management across multiple locations/warehouses
- Order processing from multiple channels (catalog, web, sales reps, phone)
- Price updates across systems when costs change
- Supplier ordering and lead time management
- Customer price quoting (often manual, repetitive)
- Shipping coordination with multiple carriers
- Returns processing

**Agent opportunities:**
- Order processing agent (multi-channel order intake, entry, confirmation)
- Inventory sync agent (monitors stock, updates systems, flags discrepancies)
- Quote agent (generates quotes from current pricing, sends to sales reps/clients)
- Reorder agent (triggers supplier orders based on inventory + lead times)

**Challenges:**
- Similar to manufacturers — legacy systems, accuracy, integration
- Price volatility — frequent cost changes mean agents need up-to-date pricing
- Sales rep workflows — human sales reps often have their own processes, tools, relationships
- Customer-specific pricing — negotiated rates, contract pricing, volume discounts

---

### Real Estate Agencies

**Bottlenecks:**
- Lead response: internet leads (Zillow, Realtor.com, website) go cold fast if not contacted immediately
- Property listing management: updating listings across MLS, portals, social, flyers
- Showing scheduling: coordinating schedules, confirming, reminders, feedback collection
- Transaction coordination: contract deadlines, inspection dates, closing checklists
- Client communication: market updates, property alerts, appointment reminders
- IDX website lead management: capturing, qualifying, nurturing website leads

**Agent opportunities:**
- Lead response agent (catches internet leads within minutes, 24/7, qualifies, schedules)
- Listing distribution agent (posts to MLS, portals, social, generates flyers)
- Transaction coordinator agent (tracks contract deadlines, sends reminders, manages checklist)
- Client nurture agent (market updates, property alerts, personalized recommendations)

**Challenges:**
- Licensing — real estate agents must be licensed; some activities require licensee
- MLS rules — data usage, attribution, listing syndication rules vary
- Local market variation — every market is different, agents are relationship-driven
- Trust — real estate is hyper-local, personal relationships matter enormously
- Time sensitivity — leads go cold in minutes, not hours

**Nick specifically calls out real estate agencies as a top vertical. Sub-niche examples: "real estate agencies in Florida" or "commercial real estate agencies in Florida."** (BI-MNjm1tTQ)

---

## PART 4: BOTTLENECK PATTERNS ACROSS ALL INDUSTRIES

### The Universal Bottlenecks (Nick's observation)

**"The decision maker at the end of the day has very similar problems, no matter what the industry is. They have too many emails, too many meetings, too many follow-ups, too many open loops. They have context over so many different projects and places and people to keep track of."** (BI-MNjm1tTQ)

These are the universal entry points — the problems every executive has regardless of industry:

1. **Inbox overload** — hundreds of emails, important ones buried, responses delayed
2. **Meeting overload** — too many meetings, not enough execution time, calendar chaos
3. **Follow-up failure** — leads, clients, partners fall through cracks because no one follows up
4. **Open loop fatigue** — projects, tasks, commitments scattered across email, Slack, spreadsheets, memory
5. **Context switching** — jumping between tools, tabs, systems to get basic work done

**"Just out of the gate, if you can anticipate this, you can have something that you put together that, you know, maybe from a template perspective solves a lot of these issues."** (BI-MNjm1tTQ)

### The "Last Mile" Problem (why computer-use agents specifically)

**"Computer use is the last-mile capability every agent needs. An agent can understand your request perfectly. It can reason about it, plan the steps, even write the code. But if it can't click a button or navigate a UI, it still needs you to do the actual work."** (X post, Nick Vasilescu, recent)

This is the key insight for why computer-use agents beat API-only automation:

- Most business software has no API, or the API is incomplete, or the API requires permissions the user doesn't have
- The work happens in UIs — browsers, desktop apps, legacy systems
- API-based automation (Zapier, Make, N8N) hits a wall when there's no API endpoint
- Computer-use agents can do anything a human can do in a UI — click, type, scroll, navigate, extract
- "If you can describe a process in words... you can create a computer use agent for it with natural language"

### The Trust/Proof Bottleneck

**"They just want it to work. And so the biggest thing is you need to create abundance in your offer."** (BI-MNjm1tTQ)

The biggest non-technical bottleneck: business owners don't trust that AI agents will work reliably. They've been burned by automation promises before.

**How Nick solves it:**
- Demo-first: "When you have a sexy demo, you can convert the client"
- "Starting for free even is sometimes worth it just to get case studies"
- "The minute that things start to break, like the business owners... they're going to become so reliant, so dependent on these agents that if something does start to break, it is very painful for them. And so in this video like I want to make sure that I help you make it very clear on how to prevent those fall gaps so that when something breaks you have something in a way to fix it before they even realize it."
- Unlimited support in the offer — "unlimited monitoring, support, security, ongoing changes"
- "If a customer, if they want constant improvements, how do you keep up? How do you fulfill? We're going to be going through all of that in this video."

### The SEO/Competition Bottleneck

**"You're not a commodity, you're not just selling Claude code. You're not just selling ChatGPT. You're selling a vertically specific, industry-specific agent."** (BI-MNjm1tTQ)

Every vertical has generic "AI automation" competitors. The way to stand out:
- Go deep on one vertical + sub-niche
- Speak their language (their tools, their workflows, their pain)
- Have a working demo of THEIR specific workflow
- "A big way to get the attention of someone is to be like, 'Oh my god, this person is really speaking to me.'"

### The Time-to-Value Bottleneck

**"It shouldn't take longer than 48 hours to get up and running with the first agent for your customer."** (BI-MNjm1tTQ)

If you take weeks, the client loses faith. If you take 48 hours, you prove the model. The 48-hour clock is a feature of the offer, not just a delivery target.

### The Model/Scaling Bottleneck

**"One agent is all you need to start — but the minute you're running hundreds of skills and automations, you need a fleet of them working in parallel."** (nickvasilescu.com/blog, 2026-07-02)

The bottleneck shifts as you grow:
- 1-3 clients: you personally manage everything
- 5-10 clients: you need templated deployments, your own monitoring, your own support process
- 10+: you need an orchestrator that manages sub-agents across clients, clone-ready infrastructure, fleet management

Nick's answer: one orchestrator agent (Hubert) managing specialized sub-agents, each with its own Orgo computer, templates all the way down. "One computer per agent, templates all the way down."

---

## PART 5: SUMMARY — NICK'S PLAYBOOK IN 10 POINTS

1. **Sell an AI employee, not an AI agent.** $5K/month flat. Unlimited everything. Don't mention tokens.

2. **Go vertical, then sub-niche.** Marketing agencies, law firms, insurance, manufacturers, wholesalers, real estate. Pick one. Sub-niche within it. Diverge → converge.

3. **Start with one use case, not full autonomy.** Single workflow first. Clear, simple, fewer failure points. Expand after.

4. **Build it on Orgo + Hermes + Composio + Claude.** Each agent gets its own computer. Orchestrator manages sub-agents. Templates all the way down.

5. **Natural language is the interface.** You describe the process. The computer-use model executes. You don't write code. The prompt IS the program — include API docs + task description + environment notes.

6. **Demo converts.** Record the screen. Send the clip. "When you have a sexy demo, you can convert the client." Computer use is visual — clients watch it work.

7. **Content is your acquisition engine.** Post → get known → warm calls → podcasts → clients. Never cold sell if you can avoid it. Start free sometimes for case studies.

8. **48 hours to first agent.** Fast delivery proves the model. Slow delivery kills it.

9. **Prevent the breakdown before it happens.** Unlimited monitoring + support in the offer. Fix things before the client notices. "If something does start to break, it is very painful for them."

10. **One agent → fleet.** Start single. Template everything. When you hit hundreds of skills, you need parallel agents, each with its own computer, orchestrated by one orchestrator.

---

*Source: 11 YouTube transcripts (BI-MNjm1tTQ, bpM9D1kQaAs, DlILpW2FRNE, pjvT25T_81o, BFRmOxT8QIo, fAhwYrjmQRk, kdvm_kRZk8A, EqJKt2AqiHE, iZV1PJ4iaRs, t6wWLVd-C_I, gHCZzYBZy4U), Nick's X posts, GitHub (nicks-stack, hermes-desktop-os1, orgo-mcp, korgo-bot, clawdbot-channel-linq), Skool community (Agent Empire), nickvasilescu.com/blog, nickvasilescu.com/about. All transcripts saved to /root/.hermes/cache/terminal-output/out-1790354885-751-f800.log.*
