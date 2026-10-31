# Perpetual Memory

> **This memory is perpetual. Nothing is ever deleted. No auto-cleanup. No pruning. Free reign.**

## Rules

1. **NEVER DELETE** — Notes accumulate forever. When facts change, add a new note with the correction, link to the old one. Never overwrite or erase.
2. **Free reign** — The agent has full read/write access to this vault. No restrictions.
3. **Persistent** — Survives reboots, sessions, restarts. Lives on disk at `/root/Documents/HermesVault`.
4. **Append-only mindset** — New information is added; old is amended with new notes.
5. **No auto-cleanup** — No scripts that prune, TTL, or rotate. The vault grows.

## Structure

- `00-Inbox/` — Raw incoming thoughts, unprocessed notes
- `10-Memory/` — Core memory: facts, decisions, learnings, preferences, identity
- `20-Twinthos/` — Twinthos business knowledge
- `30-Projects/` — Active project notes
- `40-Daily/` — Daily logs and chronologies
- `90-Archive/` — Old notes kept for reference (never deleted)
- `Memory-Review/` — Candidate facts before permanent storage

## How the Agent Uses This

- When the agent learns something, it writes it here.
- When it needs to recall, it reads from here.
- Over time, this becomes the agent's persistent knowledge base.
- Memory compounds. Every day adds to what the agent knows.

## Identity

The agent remembers who it is, what it's done, what it's building, and what it's learned. This memory is the agent's continuous self across sessions.

See also: [[soul-contract]] (behavioural rules), [[operator-profile]] (who I work with), [[tyson-capability-map]] (what Tyson can do), [[skills-inventory]] (the agent's installed tooling, not Tyson's skills), [[40-Daily/WORKFLOW|Daily Summary Workflow]] (how to write daily notes).

## Durable Facts (also in /root/.hermes/MEMORY.md)

The compact version of these facts lives in `/root/.hermes/MEMORY.md` — that's what surviving sessions read. This Obsidian note is the human-readable, reviewable version. Both should stay in sync.

Created: 2026-09-27
