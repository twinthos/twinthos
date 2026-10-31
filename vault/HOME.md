---
type: dashboard
synced: 2026-10-31 19:23 UTC
---

# Twinthos // Continuous Memory

Live mirror of this agent's brain. Last sync **2026-10-31 19:23 UTC**.

## Memory
- [[operator-profile]] — who the operator is and how they work
- [[soul-contract]] — behavioural contract (SOUL.md)
- [[skills-inventory]] — 132 installed skills
- `10-Memory/` — 9 long-term facts, one note each

## Work
- [[task-queue]] — 5 items from the live kanban
- `40-Daily/` — append-only sync history

## Twinthos
- [[dewey-dossier]] — technical teardown of the Dewey stack
- [[twinthos-brand-bible]] — positioning, enemy, manifesto
- [[research-nick-vasilescu]] — source research

## How this works
`10-Memory/`, `20-Twinthos/`, `30-Projects/` are **generated** by
`~/.hermes/scripts/vault-sync.py` and overwritten each run. Hermes memory is the
source of truth, so edit there, not here.

`00-Inbox/` and `90-Archive/` are **yours**. The sync never touches them,
so notes written by hand survive.
