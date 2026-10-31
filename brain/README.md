# Twinthos Brain — local knowledge layer

Purpose: a durable, searchable home for Twinthos company knowledge, project
state, decisions and lessons, so work continues correctly across sessions.

STATUS: local working copy, created 2026-10-14. Not yet pushed to GitHub.

## Why this exists
Hermes's native memory buffer is small (configured limit: 4000 characters) and
was already 99% full. Bulk knowledge does not belong there. This tree holds the
long-form material; only short, high-signal pointers go into native memory.

## How it relates to existing systems (do not duplicate these)
- Backup repo (private): github.com/twinthos/brain-backup — already exists.
  Cron job `twinthos-full-backup` mirrors it every 60 minutes.
- Restore hook: /root/.hermes/hooks/memory-restore — gap-fills memory at session
  start ONLY for files that are missing. It never overwrites live edits.
- Active memory: /root/.hermes/memories/MEMORY.md and USER.md.
- Vault sync: cron job `obsidian-vault-sync` every 30 minutes.

## Retrieval rule
Never load this whole tree into a prompt. Start at INDEX.md, open only the files
a task needs, and cite the file path for any fact you use.
