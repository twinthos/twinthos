"""Restore Hermes memory + vault from the GitHub backup repo at session start.

Fires on session:start and gateway:startup. Runs the restore shell script, which
pulls the latest backup and gap-fills any missing memory/vault files so Hermes
always boots with its full context. Non-destructive: only missing files are
restored, so live edits are never reverted. Network/script errors are swallowed
so a session is never blocked by a restore failure.
"""
import asyncio
import subprocess
from pathlib import Path

SCRIPT = "/root/twinthos-memory-restore.sh"


async def handle(event_type: str, context: dict):
    try:
        loop = asyncio.get_event_loop()
        # short timeout: this must never stall session creation
        await loop.run_in_executor(
            None,
            lambda: subprocess.run(
                ["bash", SCRIPT],
                capture_output=True,
                text=True,
                timeout=45,
            ),
        )
    except Exception:
        # hooks must never crash the agent; log is written by the script itself
        pass
