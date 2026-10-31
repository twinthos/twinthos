# Project: Company Brain product

## Objective
Offer each client an isolated Company Brain: identity and rules, approved
knowledge, memory, projects, skills, employee responsibilities, activity
history, permissions.

## Current state (2026-10-14)
Local founder brain under construction at /root/twinthos-brain.
No paying client brain exists yet. Isolation is a design requirement for later,
not something in production today.

## What already exists that this builds on
- Private backup repo: github.com/twinthos/brain-backup (hourly).
- Restore hook that gap-fills memory at session start.
- Native Hermes memory (small, 4000 char limit, was 99% full).

## Decisions
- Reuse brain-backup instead of creating a second repo (PROPOSED, pending
  founder approval).
- Founder brain and client brains must not mix.

## Blockers
Waiting on founder decision about repository approach before any GitHub write.

## Next actions
1. Founder approves or rejects the reuse proposal.
2. Add a HotBox demonstration brain as a SYNTHETIC, clearly-labelled example.
3. Build the isolation boundary only when a real client needs it. Do not
   build enterprise plumbing prematurely.
