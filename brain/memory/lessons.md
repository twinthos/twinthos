# Verified technical lessons

Only lessons supported by an observed result belong here.

## GitHub Pages does not serve a change the moment you push it
Lesson: after `git push`, the CDN can serve old HTML for another 30-120 seconds.
Consequence: verifying immediately gives FALSE negatives. Earlier fixes looked
like failures when they had already shipped.
Method: poll for a unique marker in the served HTML until it appears, then
measure. Do not trust the first read.
Evidence: 2026-10-14, /work/reel/v18/ — marker absent on attempt 1, present on
attempt 2; Playwright had reported stale geometry twice before that.

## Do not use Playwright measurements through a CDN floor without cache-busting
Lesson: append a random query string before measuring a page you just changed.
Evidence: same date; identical pre-change geometry reported until cache was
busted.

## A later CSS rule beats an earlier media query at equal specificity
Lesson: overriding a base rule from an earlier-positioned @media block silently
fails. Either raise specificity or edit the base rule itself.
Evidence: `.controls` stayed absolutely positioned even though a max-width:700px
block set `position:static`. It only took effect once the BASE rule was changed.

## px-sized internal text breaks when you shrink a fixed-composition frame
Lesson: scaling a designed composition by changing its box size leaves text at
fixed px, so it overlaps. Scale the whole composition (transform) instead.
Evidence: portrait reel fix, 2026-10-14. CSS `zoom` proved unreliable here; a
small measured JS transform worked.

## Deploy gate: never let a deletion reach gh-pages
Standing rule from memory: `git diff --name-status origin/gh-pages HEAD` must
show no `D` lines. Also: clone gh-pages fresh into a scratch dir and overlay
only changed files; never replace the tree with build output.
Evidence: applied on every push 2026-10-14.
