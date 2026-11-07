"""Event-driven backup: run the Twinthos backup script on session:end.

WHY: the 30-minute cron job means up to 30 minutes of memory edits are
unbacked when a machine dies. This hook fires the SAME script (single directed
edge, same sanitize + secret-grep gate, same self-lock) the instant a session
ends, so the recovery window shrinks from "worst case 30 min" to "worst case
one session". Cron stays as the safety net for changes that never end a
session (raw file edits).

Non-negotiable rules:
- The script self-locks with flock, so a hook run and a cron run can never
  collide on the shared git index. The hook never waits — if the lock is held
  it exits in milliseconds.
- Errors are swallowed: a failed push must never crash or block the gateway.
- Never runs the restore script — this hook writes only.
"""
import asyncio
import subprocess
from datetime import datetime, timezone
from pathlib import Path

SCRIPT = "/root/twinthos-backup.sh"
LOG = Path("/root/.hermes/hooks/memory-backup/backup.log")


def _log(msg: str) -> None:
    stamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    try:
        with LOG.open("a") as fh:
            fh.write(f"[{stamp}] {msg}\n")
    except OSError:
        pass


async def handle(event_type: str, context: dict):
    _log(f"event={event_type} firing backup")
    try:
        loop = asyncio.get_event_loop()
        proc = await loop.run_in_executor(
            None,
            lambda: subprocess.run(
                ["bash", SCRIPT],
                capture_output=True,
                text=True,
                timeout=300,
            ),
        )
        out = (proc.stdout or "").strip().replace("\n", " | ")
        _log(f"exit={proc.returncode} {out[:200]}")
        if proc.returncode != 0 and proc.stderr:
            _log(f"stderr: {proc.stderr.strip()[:300]}")
    except subprocess.TimeoutExpired:
        _log("TIMEOUT after 300s — next cron run will retry")
    except Exception as exc:  # hooks must never crash the agent
        _log(f"error: {exc!r}")
