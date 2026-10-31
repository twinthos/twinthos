# SOPs (standard operating procedures)

## SOP: verifying a website change
1. Push.
2. Poll the served HTML for a unique marker until it appears (not once).
3. If using a browser, append a random query string to defeat CDN caching.
4. Measure real numbers (element positions, viewport height, HTTP status).
5. Report only what the evidence showed.
Reason: pushed changes can be invisible for 1-2 minutes; three "failures" today
were actually successful pushes read too early.

## SOP: writing to GitHub
Ask the founder first. Then: confirm remote, confirm no deletions, push, verify.
Never force-push. Never rewrite history to hide a mistake.

## SOP: recording a business fact
A fact becomes authoritative only when the founder confirms it, or a document
supports it. Mark everything else clearly as unconfirmed. Pricing especially.
