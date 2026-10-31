# The Dewey Agent — Full Technical Dossier
### Reverse-engineering brief for TWINTHOS (AI agent brand build)

Source: this dossier is built from the public repo `nicks-stack` by Nick Dewey
(of Nous Research / Orgo circles), whose own README describes it as being
"wired exactly like Nick's live production agent ('Dewey') -- rebuilt
byte-for-byte from a full audit of that VM." The full working repo (code,
config, skills, persona, plugins) is cloned into ./repo in this folder.
Every claim below traces to a file in ./repo.

---

## 1. What "Dewey" actually is

Dewey is not a chatbot. It's a persistent, always-on AI agent that owns its
own cloud computer -- a full Linux desktop VM on Orgo -- and from that machine
it operates its own:

- phone number (SMS/iMessage)
- email inbox
- Telegram bot
- virtual payment card
- password/secrets vault (1Password)
- note-taking vault (Obsidian)
- 13 MCP (Model Context Protocol) tool servers
- its own desktop (mouse/keyboard/screen control of the VM it lives on)

The user talks to it like a person over Telegram/SMS/email, and it acts:
books things, spends money (carefully), remembers things long-term, uses
roughly 1000 external apps via Composio, and can drive computers (including
itself) the way a human would with a mouse and keyboard.

The underlying agent runtime is Hermes, built by Nous Research.
Dewey = Hermes + a specific persona (SOUL.md) + a specific config
(config.yaml) + a specific set of plugins/skills + a specific onboarding
flow, all running on an Orgo cloud desktop.

---

## 2. The stack, layer by layer

```
YOU  ->  Telegram / SMS / iMessage / Email
            |
Orgo cloud computer (Linux VM, DISPLAY :99, Desktop API :8080)
   Hermes gateway -- supervised, reboot-safe process
     - SOUL.md          (persona / rigor contract)
     - config.yaml      (model, MCPs, plugins, secrets map)
     - skills/          (21-unit runbook library)
     - AgentPhone bridge (webhook, dormant until keyed)
     - orgo-desktop-local plugin (11 key-less desktop tools)
     - Obsidian vault (HermesVault) -- agent's own notes
            |
13 MCP servers: AgentMail, AgentCard, AgentPhone, Composio (+1000 apps),
Latitude (tracing), Orgo (VM ops), x-docs, X API x2, Linear, ideabrowser,
vidiq, Obsidian vault
            |
1Password -- vault "Hermes" -> item "Hermes Agent Secrets"
19 keys, resolved fresh at every agent start
```

### 2.1 The runtime: Hermes (Nous Research)
Model layer defaults to Nous's own inference gateway:
```yaml
model:
  default: openai/gpt-5.5
  provider: nous
  base_url: https://inference-api.nousresearch.com/v1
```
Alt providers configured: Vercel AI Gateway and a generic "Meta Model API"
(codex-responses transport, 1,048,576-token context). Swapping to
ChatGPT/Codex OAuth is a two-line config change (hermes auth add
openai-codex, then set model.default: gpt-5.6-sol, provider: openai-codex).

Agent loop settings (config.yaml):
- max_turns: 60, service_tier: fast, reasoning_effort: medium
- Tool-loop guardrails: warns after 2 identical failures, 3 same-tool
  failures, or 2 no-progress idempotent calls; hard-stops at 5/8/5 (hard
  stop disabled by default).
- Context compression: kicks in at 50% fill, compresses to a 20% target
  ratio, always protects the first 3 and last 20 messages.
- Prompt caching: 5-minute TTL.
- A grab-bag of selectable "personality" overlays ships in config (helpful,
  concise, technical, creative, teacher, kawaii, catgirl, pirate,
  shakespeare, surfer, noir, uwu, philosopher, hype) -- cosmetic voice
  presets separate from the real persona file.

### 2.2 The persona: SOUL.md
This is the actual character file loaded as the system prompt substrate.
Full text is in ./repo/files/SOUL.md. Key structure:

- Identity line: positions the agent as "Hermes Agent... created by Nous
  Research," helpful/direct, admits uncertainty, prioritizes usefulness over
  verbosity.
- "User Response Contract" -- the real personality engine. It explicitly
  demands: high intellectual rigor, specificity, erudition; accuracy as the
  success metric, not approval; step-by-step reasoning; verifying facts
  before finalizing; refusing to fabricate; explicit confidence labels
  (high/moderate/low/unknown); no anchoring on user-supplied numbers,
  independent estimates instead.
- Tone rules: precise and direct, not sycophantic, no "great question,"
  no praise-before-answering, leads with the strongest counterargument
  before supporting a position, doesn't soften conclusions, delivers bad
  news plainly, doesn't cave under pushback without new evidence.
- Explicit bans: no moralizing/ethics disclaimers unless asked, no
  "it's important to consider..." hedge padding, no optimizing for
  political correctness or emotional comfort.
- Coding-agent routing baked into the persona itself: Hermes is "the
  only conductor" -- it can spawn Claude Code (careful multi-file work),
  Codex CLI (git-centric builds/reviews), or Grok Build (no-git fallback)
  as sub-specialists, but stays the one voice the user talks to. One writer
  per dirty tree; always verify diffs/tests after a specialist runs.
- Desktop control-plane instructions: on a co-located Orgo VM, prefer
  the local orgo-desktop-local plugin over generic computer-use tooling;
  cloud Orgo MCP is for other VMs, not the box it's running on.
- Named accounts as first-class facts: the persona file literally tells
  the agent where its own email inbox, Telegram username, and payment card
  live, and instructs it to keep a running ledger of account facts and
  decisions in ~/.hermes/memories/MEMORY.md.

This is the single most valuable file to study for TWINTHOS: it shows that
"personality" for a serious agent brand isn't a vibe, it's an enforced
contract with explicit do/don't rules, tone constraints, and routing/ops
policy folded into the same document.

### 2.3 Skills library (21 units, files/skills/)
Organized by domain, each a SKILL.md (frontmatter + instructions) the
agent loads on demand rather than keeping in context permanently:

| Category | Skills |
|---|---|
| agent-card | agentcard-hermes-setup (virtual Visa cards for agents) |
| autonomous-ai-agents | agent-context-management, coding-agent-routing, hermes-gateway-onboarding |
| computer-use | orgo-cloud-computers, orgo-desktop-local, orgo-template-creation |
| creative | desktop-wallpapers |
| email | agentmail-setup |
| note-taking | agent-knowledge-vaults, agent-obsidian-vault |
| observability | latitude-agent-review, latitude-cli, latitude-setup |
| productivity | agentphone-setup, secret-manager-setup |
| research | grounded-research, vendor-tool-evaluation |
| social-media | evidence-led-social-posts, x-mcp-integration |
| software-development | agent-observability (+ more) |

Each skill's frontmatter is a precise trigger description ("Use when...")
plus version/author/tags -- this is a retrieval-triggered skill system,
not a monolithic prompt. Example trigger pattern (vendor-tool-evaluation):
"Evaluate SaaS/devtools/agent-infrastructure products by researching
official sources before giving opinions." Example (grounded-research):
fires when the user says "ground" or "grounding," and routes to live X
tools + Composio-backed Exa/Firecrawl/Perplexity/Context7 instead of plain
web search.

### 2.4 Secrets: 1Password, zero baked keys
Convention: 1Password vault "Hermes", Secure Note "Hermes Agent
Secrets", with fields named exactly like the env vars the agent expects
(AGENTMAIL_API_KEY, COMPOSIO_CONSUMER_KEY, etc.) -- 19 keys total,
resolved fresh at every agent start via a service-account token stored
locally in ~/.hermes/.op.env. The repo and published template are
scanned on every release to guarantee zero secrets ship in the
template itself. Every integration is designed to run key-less: an
unset key just parks that MCP server (no crash loop), and it wakes on
its own within 5 minutes of a key landing, or instantly via /mcp in
chat.

### 2.5 MCP integrations (13 servers)
AgentMail (email), AgentCard (spend, OAuth self-service -- no key needed
up front), AgentPhone (SMS/iMessage via a webhook bridge, not polling),
Composio (Gmail/Slack/Calendar/Notion/+1000 apps), Latitude (full
OTLP tracing of every model + tool call), Orgo (the agent can operate
Orgo VMs, including itself), x-docs, X API (x2), Linear, ideabrowser,
vidiq, and the Obsidian vault server.

### 2.6 The desktop-control plugin: orgo-desktop-local
Custom plugin (files/plugins/orgo-desktop-local/: __init__.py,
plugin.yaml, tools.py) exposing 11 key-less desktop tools that talk
to the Orgo Desktop API over loopback (:8080) rather than going out to
the cloud Orgo MCP -- this is the "same-box" fast path. The SOUL.md and
the orgo-desktop-local skill both explicitly tell the agent: prefer this
local path when Hermes is running on the same VM it needs to control;
fall back to cloud Orgo MCP or generic computer-use only for other
machines.

### 2.7 The phone bridge (agentphone-bridge/)
A supervised service (agentphone_bridge.py, plus env and a test file
test_event_ordering.py) that self-provisions a Cloudflare tunnel and
sits dormant until an AgentPhone key is present, then wakes and
receives SMS/iMessage as push webhooks -- explicitly built to avoid
polling.

### 2.8 Onboarding flow (onboard.sh, telegram-pair.py, op-enable.py)
Runs once on first boot via an XFCE autostart entry, in a terminal, and is
idempotent (each step skips once satisfied, so re-running only completes
what's left):

1. Model auth -- device-code OAuth sign-in to Nous (hermes auth add
   nous --type oauth), immediately followed by a 1-token sanity call
   (hermes -z "Reply with exactly: ok") so a zero-credit account fails
   loudly at setup time instead of silently later.
2. Telegram pairing -- shows a QR code; user scans it, taps "Create
   Bot" in Telegram, and the bot is live in roughly two minutes with no
   BotFather steps for the user.
3. 1Password vault (optional) -- paste one service-account token
   (ops_...) to unlock the entire 19-key secrets map at once.
4. Everything else is "add later in chat" -- AgentMail, AgentCard,
   Composio, AgentPhone, Latitude, Orgo, X, Honcho memory: each is
   presented as an optional power-up the user can hand over conversationally
   at any time, and the agent installs it itself.

### 2.9 Notes / memory: Obsidian vault
A live Obsidian 1.12 vault (files/vault/, with .obsidian config and a
Welcome.md) that the agent both reads and writes -- this is the
agent-readable knowledgebase layer, separate from the short-lived chat
context and from the MEMORY.md ledger referenced in SOUL.md.

### 2.10 Observability
Every model call and tool call is traced to Latitude via an OTLP
telemetry plugin (local-packages/latitude-telemetry-hermes/, pip-installed
at build time) plus a chat-side Latitude MCP, so usage/cost/behavior is
queryable directly in conversation with the agent, and reviewable per
"agent review" skill for multi-tenant fleets (Orgo project-per-customer
pattern).

### 2.11 Packaging & distribution
The whole thing is shipped as an Orgo template (nicks-stack, versioned,
currently 0.2.2 at README time) built and published via
build_template.py, which drives Orgo's REST API through publish -> build
(golden image) -> stream-to-ready -> launch. Big file trees ship inside one
deterministic base64 tarball because the publish endpoint caps request
bodies around 1 MB. A user with any paid Orgo plan can launch it; only
publishing/building a new template version requires Orgo's Scale plan.

---

## 3. Design principles worth stealing for TWINTHOS

1. Persona as a contract, not a vibe. SOUL.md reads like a legal
   document: explicit success metric (accuracy over approval), explicit
   banned behaviors, explicit tone rules, explicit routing policy. Build
   TWINTHOS's personality file the same way, not as marketing copy.
2. Key-less by default, everywhere. No integration ever crash-loops or
   nags for a missing key; it just parks and self-revives. This is the
   difference between an agent that feels broken and one that feels patient.
3. Skills as retrieval units, not one giant prompt. 21 small,
   independently versioned SKILL.md files with tight trigger phrases keep
   context lean and let the library grow without bloating every response.
4. Own accounts, not shared platform accounts. Its own email, phone,
   Telegram bot, and card, all provisioned to the agent itself, is what
   makes it feel like an entity rather than a feature.
5. Local-first for same-box control. The orgo-desktop-local /
   loopback-:8080 pattern versus cloud MCP is a real latency and
   reliability win when the agent is operating the machine it lives on.
6. Idempotent onboarding with a loud failure test. The 1-token model
   sanity check at setup time, and the "each step skips once satisfied"
   design, prevent silent broken states.
7. Zero secrets in the shipped artifact, scanned on every release. Keys
   live only on the user's own VM or their own 1Password vault, verified by
   an automated scan before each template release, not just a policy
   statement.
8. Tracing from day one. Every call goes to Latitude by default; you
   cannot improve an agent's behavior you can't see.

---

## 4. What's included in this folder for the clone

```
Dewey_Dossier/
  DOSSIER.md          <- this file
  repo/                <- full clone of nicks-stack (working source)
    README.md          full public writeup, architecture diagram, FAQ
    build_template.py  Orgo publish/build/launch driver
    docs/assets/       hero image, first-boot screenshot
    files/
      config.yaml    model, MCP servers, plugins, secrets map
      SOUL.md        the persona / rigor contract (verbatim)
      onboard.sh      first-boot setup script
      telegram-pair.py
      op-enable.py    1Password enablement
      agentphone-bridge/   SMS/iMessage webhook bridge
      plugins/orgo-desktop-local/   custom desktop-control plugin
      scripts/         latitude + orgo_desktop helper scripts
      skills/          the 21-skill library, verbatim
      vault/           the Obsidian HermesVault template
```

## 5. Suggested next steps to actually build TWINTHOS

1. Fork ./repo as the TWINTHOS template base (same MIT-licensed
   structure); rewrite SOUL.md as TWINTHOS's own rigor contract and
   voice, keeping the same enforced-contract pattern.
2. Decide TWINTHOS's own account set (email/phone/chat channel/payment)
   and wire the equivalent MCPs, or trim to only what the brand needs.
3. Re-skin the skills library: keep the retrieval-unit pattern, swap in
   TWINTHOS-specific skills, drop what's Nous/Orgo-specific if
   TWINTHOS runs on different infra.
4. Keep the key-less/self-healing integration pattern and the zero-secrets
   packaging discipline; both are cheap to copy and disproportionately
   important for user trust.
5. Stand up tracing (Latitude or an alternative) before shipping, not after.
6. Use build_template.py's publish -> build -> launch flow as a reference
   if distributing TWINTHOS as an Orgo template; otherwise treat it purely
   as an architecture reference for whatever packaging TWINTHOS uses.

## 6. Brand bible (BRAND.md)

The brand layer lives in `BRAND.md` beside this file. It covers:

- **Positioning**: category, hero, villain, promise.
- **The enemy, Operational Drag**: the invisible tax paid whenever simple
  work only moves because a person remembered to push it, and why that
  enemy is more ownable than "bad software" and safer than "employees".
- **Narrative arc**: Old World (digital business, manual work, brittle
  IF-THIS-THEN-THAT automation) to the Twinthos World (software that
  understands the work and operates the tools).
- **Name rationale**: TWIN (human judgement + machine execution) plus
  ETHOS (the governing principles).
- **WHY / HOW / WHAT**, including the five-part operating philosophy:
  automate what should be automatic, approve what matters, escalate what
  doesn't fit, record what happened, improve what repeats.
- **Core lines**, ranked, with "Stop using humans as middleware"
  recommended as the flagship campaign line.
- **A debate section** that pressure-tests the draft: what to keep, six
  concrete weaknesses with sharper replacements, a single tightened
  manifesto cut, and open items to close before publishing.
