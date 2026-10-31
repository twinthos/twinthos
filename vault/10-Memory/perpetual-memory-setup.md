# Perpetual Memory Vault — Setup

> **Status:** ACTIVE | **Last verified:** 2026-09-27 | **Rule:** NEVER DELETE

## What This Is

The Orgo desktop's persistent memory layer. Everything here survives reboots, sessions, restarts. Lives on disk forever. No auto-cleanup, no pruning, no TTL.

## Design Rules

1. **Never delete.** Notes accumulate. When facts change, add a new note and link to the old one.
2. **Free reign.** The agent can write, read, organize, restructure — no restrictions.
3. **Append-only mindset.** New information added; old amended, never erased.
4. **No auto-cleanup scripts.** No "forget after N days."
5. **Vault grows over time.** That's the point.

## Vault Structure

- `00-Inbox/` — Raw incoming, unprocessed
- `10-Memory/` — Core memory: facts, decisions, learnings, preferences
- `20-Twinthos/` — Twinthos-specific knowledge
- `30-Projects/` — Project notes
- `40-Daily/` — Daily logs
- `90-Archive/` — Old notes kept for reference

## Paths (writable by agent)

- `/root/Documents/HermesVault/00-Inbox/`
- `/root/Documents/HermesVault/10-Memory/`
- `/root/Documents/HermesVault/20-Twinthos/`
- `/root/Documents/HermesVault/30-Projects/`
- `/root/Documents/HermesVault/40-Daily/`
- `/root/Documents/HermesVault/90-Archive/`

## Obsidian Config

- Vault: `/root/Documents/HermesVault` (open in Obsidian)
- Config: `/root/Documents/HermesVault/.obsidian/`
- Obsidian binary: `/opt/Obsidian/obsidian`
- Workspace: XFCE desktop on Orgo, controlled via desktop API (:8080) + Chrome CDP (:9223)

## Agent Access

- Read/write via direct file access (bash, python, etc.)
- Visual: open via Obsidian URI `obsidian://open?vault=HermesVault`
- CDP: Chrome can navigate to Obsidian URI scheme
- Desktop API: can type into Obsidian, control via mouse/keyboard

## What's Already Here

- `HOME.md` — home note
- `operator-profile.md` — operator profile
- `soul-contract.md` — agent soul/identity contract
- `skills-inventory.md` — skills and capabilities
- `perpetual-memory.md` — this file
- `perpetual-memory-setup.md` — this setup note
- `twinthos-design-system-red-team-audit-2026-09-24.md`
- `dylan-b2wp-model-2026-09-26.md`
- `telegram-delivery-fix-when-user-reports-not-rece.md`
- PDFs of playbooks and research

## No Deletion Policy

This vault does not auto-delete anything. Notes from 2026-09-27 will still be here in 2030. The `90-Archive/` folder is for notes the agent considers "done" but keeps for reference — never deleted, just moved.

## Future Agent Use

When the agent needs to remember something, it writes to this vault. When it needs to recall, it reads from this vault. Over time, the vault becomes the agent's persistent knowledge base — a growing library of everything it has learned, decided, and experienced.

> **Remember:** This vault is perpetual. Nothing gets deleted. Ever.
