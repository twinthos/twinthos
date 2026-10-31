---
type: system
synced: 2026-10-14
source: Hermes autonomous setup
---

# Twinthos autonomous backup + memory system

## What runs automatically (no action needed)

- **`obsidian-vault-sync`** (every 30m) — mirrors Hermes live memory into the
  Obsidian vault at `/root/Documents/HermesVault`, commits locally. Vault has
  **no git remote**, so this never leaves the machine on its own.
- **`twinthos-full-backup`** (every 60m, job id `6e9ef2a813b5`) — pushes EVERYTHING
  to the private GitHub repo `twinthos/brain-backup`. This is the piece that gets
  data off-machine. Runs `/root/.hermes/scripts/twinthos-backup.sh`.

## What the backup repo contains

`github.com/twinthos/brain-backup` (private):
- `site/` — byte-for-byte mirror of the LIVE site (`twinthos/twinthos.git` gh-pages)
- `conversations/` — Hermes session dumps, **credentials redacted** by sanitizer
- `terminal/` — Hermes terminal session records
- `memory/` — `/root/.hermes/memories` (fact sheets, dossier PDFs/MDs)
- `vault/` — the Obsidian memory vault (the real long-term memory layer)
- `history/` — `.hermes_history` raw turn/command log
- `SOUL.md`, `docs/twinthos-brand-bible.md`, `CHANGELOG.md`

## Key repos and paths

- **Deploy repo:** `/root/twinthos_hero` → `twinthos/twinthos.git` gh-pages.
  NOTE: this local clone is often behind origin with uncommitted edits. The
  **canonical** clean clone is `/root/twinthos_live` (fresh clone of gh-pages).
  Always deploy from `twinthos_live`, never from the dirty `twinthos_hero`.
- **Backup repo clone:** `/root/twinthos_backup`.
- **Backup script:** `/root/twinthos-backup.sh` (+ copy in `.hermes/scripts/`).
- **Sanitizer:** `/root/twinthos-sanitize.py` (redacts Bearer/JWT/API keys).

## SECURITY RULES (do not violate)

- NEVER commit: `.env`, `auth.json`, `secrets/`, `.hermes/vault/`, `config.yaml`.
- Session dumps contain live Bearer tokens — ALWAYS run through the sanitizer
  before any git add. The backup script aborts if a secret-like string is staged.
- `config.yaml` is security-sensitive (patch tool refuses it).
- Telegram/GitHub tokens go in `[REDACTED]`, never in files, logs or messages.

## Revert-first workflow

Every site change is preceded by a backup commit, so any edit is recoverable.
To restore the live site from backup: rsync `site/` from the backup repo over
`twinthos_live`, commit, push to gh-pages. Or reset gh-pages to an earlier commit.

## Restore command

```
cd /root/twinthos_live
rsync -a --delete --exclude '.git' /root/twinthos_backup/site/ ./
git add -A && git commit -m "restore from backup <stamp>"
git push origin HEAD:gh-pages
```
