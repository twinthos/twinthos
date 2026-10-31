# Strategy 2027 — Brain + Workforce

Founder direction supplied 2026-10-14. Internal record: completeness matters here.
Public-facing copy elsewhere (/brain/, /workforce/) is a short version of this.

## 1. The platform: two products, one infrastructure

- **Twinthos BRAIN** — the persistent intelligence layer. It organises the
  customer's approved company knowledge: brand identity, product expertise,
  project history, decisions, operational memory. It is what the business knows.
- **Twinthos WORKFORCE** — the execution layer. Cloud digital employees with
  approved tools, computers, inboxes, workflows, schedules and the ability to
  act. It is what the business does.

Both sit on the same infrastructure.

**How they are bought:**
- A Brain can be bought on its own, without a digital employee.
- A digital employee can be bought connected to the customer's existing
  systems, without buying a Brain.
- Bought together is the most complete service — the employee acts, and the
  Brain is what it acts *from*.
- Neither product depends on the other existing.

## 2. The 2027 thesis

The competitive question changes. It stops being "which AI model do you use"
and becomes:
1. What does your system know?
2. What is it authorised to do?
3. How reliably does it complete the work?

The model is replaceable. A trustworthy *integrated service* is not. Anyone can
swap a model; almost nobody can hand over an operation that already knows the
business and has permission to act inside it.

**Three opportunities this opens:**
- **Own the customer relationship.** Not the model vendor's customer — ours.
- **Manage persistent context.** Knowledge that compounds instead of resetting
  every conversation.
- **Deliver accountable operational outcomes.** Work completed, with evidence,
  not text produced.

## 3. Platform layers

Top to bottom:

1. **Access layer** — client dashboard, Telegram, founder console, approvals,
   reporting.
2. **Product layer** — Twinthos BRAIN and Twinthos WORKFORCE.
3. **Control and Governance** — identity, permissions, human approvals, audit
   logs, spending limits.
4. **24/7 cloud execution** — events, durable jobs, queues, Hermes agents, Orgo
   computers, APIs.
5. **The business's existing world** — CRM, email, phone, booking, documents,
   websites, payments.

**Load-bearing design rule:** the agent, the knowledge and the computer must NOT
be inseparably bound. A Brain has to survive a model change, a computer failure,
or a digital employee being replaced. Bind any two of those permanently and the
product becomes fragile in exactly the way competitors' products are.

## 4. Three kinds of Brain

One engine, three configurations.

### Organisation Brain
Who it is for: companies, departments, charities, property groups, professional
firms.
What it holds: procedures, documents, policies, projects, decisions.
What it does: helps staff find answers, onboard new people, resume projects that
were left half-finished.

### Brand Brain
Who it is for: consumer brands, agencies, hospitality.
What it holds: identity, positioning, voice, approved claims.
What it does: makes the brand machine-readable so other AI systems can consult
it rather than guess.
Guardrail: a Brand Brain must never claim authority merely by *existing*. It
earns authority through verified ownership, approved publication rules, and
reliable source updates. An unverified brand brain is worse than none — it
launders guesses as facts.

### Product Brain
Who it is for: manufacturers, SaaS companies, retailers.
What it holds: specifications, compatibility, manuals, versions, prices,
warranty terms.
What it does: answers questions from authoritative records, not from marketing
text.

**Commercial insight — who values which Brain:**
- Organisation Brain is valuable to *employees*.
- Brand Brain is valuable to *everyone representing the brand*.
- Product Brain is valuable to *customers, sales, support, and other purchasing
  agents* — including machines buying on a human's behalf.

## 5. Eight Brain capabilities

1. **Identity** — who/what this Brain speaks for.
2. **Authoritative facts** — the records that outrank conversation.
3. **Knowledge library** — documents and their versions.
4. **Persistent memory** — what carried over from last time.
5. **Projects** — work in progress, resumable.
6. **Relationship graph** — people, companies, and how they connect.
7. **Retrieval** — answers returned with evidence and timestamps.
8. **Governance** — access, corrections, publication, retention, deletion,
   exports.

**Operating principles behind them:**
- A product's actual specification must come from authoritative records, never
  from conversational memory.
- A meeting summary is evidence of what was discussed — it is NOT automatically
  new policy.
- Memory must be able to say "I don't know". A brain full of unverified claims
  makes a business *less* reliable, not more.

## 6. Memory hierarchy

Four tiers, in order of decreasing volatility:
1. **Current working context** — the conversation right now.
2. **Persistent memories** — stable facts established across sessions.
3. **Organisational knowledge** — approved, versioned company truth.
4. **External source systems** — CRM, inbox, documents, the live world.

**Storage, matched to change rate:**
- **GitHub** — approved versioned documents.
- **A database** — frequently changing things: projects, permissions, task
  states.
- **Private object storage** — confidential source material.
- **A search index** — retrieval across all of the above.

The mature architecture is a *governed knowledge system*. It is explicitly not
"one giant GitHub memory file".

## 7. The always-on digital employee

Not a long-running chatbot. It can receive work, wake, continue a task, wait for
events, recover after failure, and report what it did.

**Operating cycle:**
1. **Receives work** — an event, a message, a schedule, a queue item.
2. **Wakes and continues** — resumes from durable state, not from scratch.
3. **Works the systems** — acts inside approved tools within permissions.
4. **Waits for events** — including human approval, and long delays.
5. **Recovers from failure** — retries, escalates, does not silently vanish.
6. **Reports what it did** — evidence, audit trail, plain-language summary.

## 8. Verified market facts (with sources)

**McKinsey — State of AI Global Survey**
Published 25 August 2026. 1,719 respondents across 97 countries.
- 40% of organisations with >$1bn revenue report scaling AI agents, up from 27%
  a year earlier.
- Smaller organisations flat at 22% over the same period — large firms are
  pulling away from small ones on agent deployment.
- Source: https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai

**ILO–NASK Global Index**
Published 20 May 2025.
- 1 in 4 jobs worldwide (25% of global employment) potentially exposed to
  generative AI; 34% in high-income countries.
- The likely outcome described is *transformation* of jobs, not replacement.
- Source: https://www.ilo.org/resource/news/one-four-jobs-risk-being-transformed-genai-new-ilo%E2%80%93nask-global-index-shows

**Caveat, and it matters:** these are two different measurements. Survey-based
adoption figures and occupational exposure estimates do NOT imply equivalent
automation rates. Do not present them together as if one predicts the other.

STATUS: founder-supplied strategy plus two externally verified sources above.
Nothing in this file beyond section 8 has been independently verified as market
data — it is the founder's stated 2027 direction.
