# Project: Twinthos website

## Objective
Public site (twinthos.com) that is accurate on mobile and laptop and makes no
claims we cannot support.

## Current state (verified 2026-10-14)
Live on GitHub Pages via repo twinthos/twinthos, branch gh-pages.
- Homepage hero: 29s v17 HTML film, audio clock from assets/film17.mp3.
  Plays silently on load; first click or key starts sound.
- Work section added: /work/ (index), /work/reel/ (landscape v1 MP4, 6,647,354
  bytes), /work/reel/v18/ (portrait HTML composition).
- Old /reel/ URL returns 404.
- Four page IPs checked (185.199.108-111.153) after each push.

## Decisions
- New reel never replaces the hero.
- Public copy is plain English; no insider jargon.
- Landscape video keeps 16:9 on mobile rather than being cropped to 9:16.

## Tasks completed
- Created /work/ tree; moved reel out of top level.
- Rewrote copy on homepage strip, /work/, /work/reel/, /work/reel/v18/.
- Fixed broken 3-column "On a phone?" notice.
- Portrait reel now fits phone and laptop without scrolling (Play/Restart in view).
- Fixed nav item rendering jammed as "WorkThe reel".

## Blockers
None.

## Documents
Deploy scratch: /root/.hermes/cache/scratch/deploy
Source of truth note: /root/twinthos_v3/_src is NOT the source of truth.

## Next actions
Only if asked: add a nav entry pointing to Work.

## Change history
2026-10-14 — six fixing commits, all verified live after CDN propagation.
