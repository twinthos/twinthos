# Whole-site audit, twinthos.com — 21 October 2026

Run by `twinthos_live/audit/site_audit.py` (32 pages, 24 checks per page plus site-level
and live checks). Findings JSON: `twinthos_live/audit/site-audit.json`. Fix script:
`twinthos_live/audit/fix_pass1.py`. Deploy commit: `dfb47d0`.

Method was the loop-engineering loop: write pass tests, fix, re-run the same script, then
check the deployed URLs. The diff between the two JSON runs is the proof.

## Result in one line

Local findings are now **zero** across 32 pages. Live findings are down to **8**, and every
one of those eight is a limit of GitHub Pages or of DNS rather than a defect in the site.

The pass closed: 1 missing production file, 7 out-of-band descriptions, 2 over-long titles,
9 pages with no structured data, and 7 redirect stubs without a viewport.

## What was fixed

| Fix | Evidence |
| --- | --- |
| `/.well-known/oauth-protected-resource` returned 404 in production | GitHub Pages skips dotfolders unless `.nojekyll` exists. Added it; the URL now returns **200**. `ai-catalog.json` also 200. |
| 7 page descriptions outside the 100–165 character band | Rewritten to 132–140 characters on index, brain, how-it-works, notes, privacy, terms, workforce; og and twitter copies follow the same text. |
| 2 titles over 62 characters before the brand suffix | brain → "Twinthos Brain: company memory that persists"; notes → "Twinthos Notes: AI in plain English for business". |
| 9 pages with no structured data | Organization + AboutPage / ContactPage / FAQPage / WebPage + BreadcrumbList added. `/faq/` now carries FAQPage with the questions and answers that are on the page. Verified in the browser: every block parses, one h1, no horizontal overflow. |
| 7 redirect stubs with no viewport | Added to services, contact, demo, demos, audit, questions, thankyou. |
| No way to audit the site at all | `audit/site_audit.py` is now the repeatable check: `python3 audit/site_audit.py --live`. |

## What the site actually is, measured

| Page | Words | Notes |
| --- | --- | --- |
| Homepage | 1,882 | 145 KB HTML, 154 KB of subresources (one 110 KB hero, one 44 KB font) |
| Brain | 1,804 | Longest page on the site |
| Workforce | 1,122 | |
| FAQ | 582 | |
| Pricing | 488 | |
| About | 449 | |
| Book | 407 | |
| How it works | 339 | |
| Operations audit | 312 | |
| 12 notes | 700–1,100 each | Rewritten 21 Oct, all live |

32 pages in total. Homepage weight is about 300 KB, which is acceptable. The 29 MB in
`assets/` includes six PNGs of 270–482 KB (`guides-img/horse.png` 482 KB) that no page
references; that costs nothing at runtime and is only repo hygiene.

## The expensive finding: you are buying attention and discarding the measurement

All nine `/book/` links on the homepage carry tracking parameters, in three flavours:

```
/book/?interest=audit&utm_source=index&utm_medium=cta&utm_campaign=homepage
/book/?interest=fit&utm_source=index&utm_medium=cta&utm_campaign=homepage   (x7)
/book/?interest=managed&utm_source=index&utm_medium=cta&utm_campaign=homepage
```

There is no analytics tag anywhere on the site: no GA4, GTM, Plausible, Umami, PostHog,
Fathom, Hotjar or Clarity. So those parameters are written into a URL, sent to the server,
and never read by anything. Twelve articles of new writing went live today with no way to
tell whether a single person read them or clicked through. That is the largest gap on the
site and it costs about ten minutes to close.

## What is left, and why it is not a repo fix

| Finding | Cause | Who can fix it |
| --- | --- | --- |
| `http://twinthos.com` serves 200 with no redirect | GitHub Pages does not force HTTPS on custom domains | DNS or CDN layer |
| `https://www.twinthos.com` fails certificate verification | certificate covers `twinthos.com` only | DNS: add a `www` CNAME to `twinthos.github.io` and enable the certificate |
| No `Strict-Transport-Security`, `Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options` | GitHub Pages serves fixed headers, no custom ones | a proxy in front (Cloudflare) or a host that allows headers |

The DNS answers check confirms there is no CDN in front: the four `185.199.x.x` records are
GitHub Pages directly, and responses carry `server: GitHub.com`. Putting Cloudflare in
front of the domain would fix all three rows at once, since their edge sets HSTS, forces
HTTPS and issues the `www` certificate.

## Recommendations, in money order

1. **Install analytics this week.** Plausible, Umami Cloud or Cloudflare Web Analytics, all
   free at this traffic. One script tag in the shared head. Without it the notes cannot be
   judged, the UTMs cannot be read, and no price test can be run.
2. **Fix the `www` record and force HTTPS** at the DNS provider. Two records, and it also
   removes a duplicate-host SEO problem.
3. **Decide the price.** The site says £5,000/month in three places and £999 in four; the
   market research says the UK band is £750–£2,000 per role per month. Every document,
   deck and call script is blocked on this decision, and it is not a website problem.
4. **Retire the seven redirect stubs.** `/services/`, `/contact/`, `/demo/`, `/demos/`,
   `/audit/`, `/questions/`, `/thankyou/` are all `noindex` meta-refresh pages that bounce
   to homepage anchors. Anything that points at them loses the click at the moment of
   intent. Point them at `/book/` or build one real page.

## What was deliberately not touched

- Page copy on the money pages. Changing words and prices at the same time as fixing
  metadata would make it impossible to tell which change moved anything.
- The seven stubs' destinations: choosing between "build a real page" and "redirect to
  /book/" is a product decision, not a defect fix.
