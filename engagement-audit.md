# Twinthos — engagement analytics & site audit

## What's installed
- No analytics platform (GA4/GTM/Plausible/Umami/PostHog/Fathom/Hotjar) — zero tags anywhere.
- No Google Search Console access/configured.
- Booking form sends to FormSubmit.co but no UTM/conversion event tracking on the 28 `/book/` links.

## What's missing on the site (engagement + SEO)
- `contact`, `questions`, `services`, `demo`, `thankyou`, `audit`: no og:title, og:description, og:image.
- No `alt` attribute on any `<img>` in the whole site.
- Sitemap misses the 3 notes on disk: `notes/digital-employee-cost/`, `notes/digital-employee-vs-chatbot/`, `notes/questions-to-ask-managed-ai-agent/`.
- `www.twinthos.com` TLS cert does not cover www (custom domain cert is twinthos.com only).
- `ai-catalog.json` and `.well-known/oauth-protected-resource` exist locally but NOT deployed.
- Exposed GitHub PAT and Stripe live key in git history — must be rotated by user.

## Model
- Main model set to `upstage/solar-mini4:free` (config.yaml: model.default + delegation.model).
- Verified working via API: returned `model: "upstage/solar-mini4:free"`.
