## Twinthos Product & Offers
- Twinthos is a Dewey clone: managed digital employee platform — AI agents running defined jobs in existing tools
- Products: Operations audit (£999, one-off) + Managed digital employee (£3,500/mo from 23 Oct 2026, 3-mo min; was £5k)
- Earlier offers are superseded by current site pricing.
§
Hermes CLI: /usr/local/lib/hermes-agent/.hermes/bin/hermes (wrapper /root/.local/bin/hermes). Newsjack v0.1.20 at ~/.newsjack/bin/newsjack; Twinthos monitor twinthos.json runs 07:20 and 14:20, but news_search/x credentials are missing so profile lanes return nothing relevant.
§
## Twinthos brain is authoritative before any strategy/pricing work
Read these before deriving a sector, target or price — they already answer most of it:
- `company/mission.md` — priority buyers: multi-office property groups, recruitment agencies, professional services.
- `company/pricing.md` — Foundation £2,500 setup + £750/mo; Digital Employee £3,500/mo (live); Operations Audit £999. Marked TEST prices, not market rates.
- `company/services.md`, `company/strategy-2027.md`, `memory/core-memory.md`.
A bottom-up "gap" calculation does not override the stated floor — reconcile and say which one wins.
§
## Standing mode: loop engineering
Skill `loop-engineering`. Write a numeric pass test → attempt → verify with an independent tool → one named fix → max three iterations → report with the evidence path. Live beats local.
Telegram: bot token (no channels); public scrape `~/twinthos-brain/scripts/telegram_scrape.py`; prospecting plays `sops/dewey-prospecting-playbook.md`. Send PDFs: `hermes send -t telegram:813848257 --json "MEDIA:/abs/path\nCaption"`. Verify payload before sending.
§
Git facts (30 Oct 2026): 174 commits under the user's personal git address (6 public repos). Site repo twinthos/twinthos: 291 commits across branches, 121 on main, 276 from agent identities. 352 commits under user-like handles with placeholder addresses, unconfirmed.
§
AI security market 2026: $1.8B→$17.8B by 2033 (CAGR 38.9%); agentic AI workflow audit $0.6B→$22.4B by 2035 (CAGR 42.9%); Gartner securing-AI $4.8B in 2027. Key targets: Langflow/IBM (CVSS 9.9 RCE), Schneider Electric (60+ LangChain agents), Vodafone, monday.com, ServiceNow, CrewAI. Monetisation: Langflow MCP audit, LangChain/LangGraph audit, MCP monitor subscription, AI agent red-team lite, compliance-as-code. Audit: /root/twinthos-brain/audit/ai-sec-audit-2026-10-31.md.
§
cvedotnow tweet learning (2026-10-31): High-engagement CVE format = severity emoji + product + CVE ID + mechanism + patch versions. Generic infra CVEs matter when they hit AI workloads. Sentinel updated with two-tier keyword filter: AI infrastructure keywords only flag when combined with AI keywords in same entry.