# Infrastructure (verified 2026-10-14)

## Machine
One Orgo cloud computer. Hostname orgo-desktop. Linux.
NOT a multi-profile Hermes install: there is no /root/.hermes/profiles tree.
Everything lives directly under /root/.hermes.

## Hermes
Version 0.21.7. Gateway running as one supervisord process.
Telegram connected, founder chat id 813848257.
API server listening on 127.0.0.1:8642.

## Native memory
Enabled. Files: /root/.hermes/memories/MEMORY.md and USER.md.
Configured limit MEMORY.md = 4000 characters; it was at 3996 bytes (99% full).
This is why bulk knowledge belongs in /root/twinthos-brain instead.

## Scheduled jobs (cron)
- obsidian-vault-sync — every 30 minutes — vault-sync.py
- twinthos-full-backup — every 60 minutes — /root/twinthos-backup.sh

## What the hourly backup captures
- /root/twinthos_live  -> site/
- /root/.hermes/memories -> memory/
- /root/Documents/HermesVault -> vault/
- brand bible -> docs/
- sanitised shell history -> history/
- sanitised conversations -> conversations/
It deliberately excludes .env, auth.json, secrets/ and config.yaml.

Now included (approved 2026-10-14): `mirror "/root/twinthos-brain" brain`
Added to /root/twinthos-backup.sh and to the restore hook, so the BOTH halves of
disaster recovery work — hourly push out, and gap-fill back after a wipe.

## Disaster recovery
/root/.hermes/hooks/memory-restore fires on session:start and gateway:startup.
It pulls brain-backup and restores ONLY files missing locally, so live edits are
never reverted. Verified working: log shows it restored TWINTHOS_LOGO_GUIDE.md
on 2026-10-14T01:15:57Z.

## Model actually in use
This session is running tencent/hy4-preview via Nous Portal — NOT MiniMax M3.
Recorded because a written brief assumed MiniMax M3. Flagged rather than assumed.
