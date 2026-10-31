# INDEX — where to find things

Start here for any Twinthos task. Pick the narrowest source that answers.

## Company knowledge
- company/mission.md — what Twinthos is and who it serves
- company/services.md — what we sell
- company/pricing.md — prices to test (NOT confirmed market rates)
- company/strategy.md — current priorities and direction
- company/strategy-2027.md — the 2027 Brain + Workforce platform architecture

## Identity and rules
- identity/soul.md — who the Twinthos agent is
- identity/operating-principles.md — nine rules that govern behaviour

## Memory
- memory/core-memory.md — stable business facts
- memory/decisions.md — decisions made, with dates
- memory/si-rename-2026.md — the "SI" rename (Sep–Oct 2026) and our position
- memory/lessons.md — verified technical lessons
- memory/corrections.md — mistakes and the approved fix

## Projects (four tracked)
- projects/INDEX.md — one-line status for each
- projects/twinthos-website/
- projects/twinthos-dashboard/
- projects/company-brain-product/
- projects/hotbox-social-demo/  (PROSPECT — not a signed client)

## How the machine is wired
- architecture/infrastructure.md — servers, cron, gateway, deploy flow
- architecture/integrations.md — what is connected today
- architecture/security.md — what is secret, what is never committed
- architecture/agentmail.md — AgentMail email API setup and inbox (live)

## Working aids
- skills/README.md, workflows/README.md, sops/README.md — reusable procedures
- research/INDEX.md — external research done so far
- research/nick-vasilescu-playbook.md — the operator playbook, quoted, with what to copy
- research/nick-vasilescu-posts.md — 44 posts, 21 Oct 2026
- sops/dewey-prospecting-playbook.md — the five prospecting loops: choose a stage, build the artefact, close on it, let the employee deliver, keep it by widening
- research/telegram-scrape-2026-10-21.md — what a real public-Telegram scrape returned (449 messages, 20 channels) and what Telegram cannot give without a user session
- logs/approved-milestones.md — confirmed progress record

## Selling (built 21 Oct 2026)
- audit/next-door-2026-10-21.md — target book two: 82 firms in 8 new trades, 18 overseas, 12 acquirers, 12 backers
- 2026-10-21_twinthos_nextdoor.pdf — 60pp. Part one: the eight SIMPLE trades (wholesale, plant hire, bodyshops, cleaning, security, events, print, removals — 64 firms). Part two: the eight harder trades. 146 firms, 12 acquirers, 12 backers.
- 2026-10-21_twinthos_firstdeal.pdf — 8pp phone pack: one trade (commercial cleaning), eight verified names, the call script, pushback answers, the one page to send, the price, the week. Source audit/first-deal.template.md, builder audit/build_first_deal.py, reading copy audit/first-deal-2026-10-21.md.
- audit/deck-audit-2026-10-21.md — why the 52-page book cannot open a door
- audit/system-audit-2026-10-21.md — what is running, what is exposed, what is broken
- audit/site-audit-2026-10-21-v3.md — whole-site audit: 32 pages, local findings zero, the 8 live items that need DNS or a CDN, and the analytics gap. Re-run with `python3 ~/twinthos_live/audit/site_audit.py --live`
- audit/next-door.template.md — the editable source; `python3 audit/build_next_door.py` rebuilds it

## Conflicts
If two files disagree, do NOT silently pick one. Report the conflict and cite
both paths.
