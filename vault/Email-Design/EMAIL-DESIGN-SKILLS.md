# Email Design Skills — Learned 2026-09-27

## Cold Outreach Email Design (What Actually Works)

### The Core Insight

Plain text wins for cold outreach. HTML design is for warm follow-ups.

- Plain text = 21-42% more clicks than HTML in cold outreach
- HTML emails with images = 23-37% drop in open rates vs plain text
- HTML emails get filtered to Gmail Promotions tab — dead zone for cold outreach
- Tracking pixels force HTML rendering — disable them for genuine plain text

### First Touch (Cold) — Plain Text Template

Subject: lowercase, specific, looks internal
- "quick question — [prospect company]"
- "intro: [relevant observation]"
- "[first name], thought about your [specific workflow]"

Avoid: "Limited time", "Free", "ASAP", all-caps, exclamation marks

Body (under 100 words):
1. First line = true observation about the prospect (proves it's not a blast)
2. Value prop in one sentence (what you do, why it's different)
3. One low-friction CTA ("reply yes" > "book a 30-min call")
4. Set expectations ("no pitch deck, no 30-min call")

Signature: name, company, phone. No logo. No social icons. No footer links.

### Follow-Up Sequence

Day 3: One line — "floating this to the top..."
Day 7: Add value — specific task + concrete result
Day 14: Breakup — "closing the loop..."

### When HTML Design Is the Right Choice

- Warm lists (newsletter subscribers, existing customers)
- Follow-up after they've replied "yes" to first touch
- Product updates to customer base
- Promotional campaigns to warm list

### HTML Email Design Rules (2026)

1. **Single column, 600px max** — Outlook uses Word renderer, no flex/grid
2. **Table-based layout** — mandatory for Outlook support
3. **Inline CSS for critical styles** — Gmail strips `<style>` and `<link>`
4. **`<style>` in `<head>` only for responsive + dark mode**
5. **Under 102KB** — Gmail clips larger emails
6. **Dark mode: ~42% of opens** — use `prefers-color-scheme: dark`
7. **Near-black (#0E0E0E) and near-white (#FEFEFE)** to avoid inversion
8. **Transparent logos break in dark mode** — use defined background or dark-mode version
9. **Alt text on ALL images** — 99.89% of HTML emails fail accessibility
10. **Typography-driven** — large bold headlines (28-40px), tight letter-spacing, high contrast body
11. **Mobile first** — 60%+ opens on mobile, design for 390px screens
12. **Test across clients** — Outlook 2019, Apple Mail, Gmail web, Gmail iOS, Outlook.com

### Twinthos Email Brand

- Background: black (#000000 / #0E0E0E soft)
- Text: white (#F4F4F0)
- Signal: green (#20F782) — functional only, <5% visual
- No cards, no pills, no badges, no green backgrounds
- Hairline dividers (1px #1a1a1a borders)
- One idea per viewport
- Headline: 28px, tight letter-spacing (-0.02em)
- Green used as: small dot, green label text, CTA link — nothing more

### The Twinthos Email Sequence

**Email 1 — Plain text first touch**
- Subject: "quick question — removing repeat work from your team"
- Body: ~80 words, plain text, no HTML
- CTA: "reply yes and I'll send over a 5-minute demo"
- Signature: name + Twinthos

**Email 2 — Designed HTML follow-up (after they reply "yes")**
- Subject: "Re: quick question — removing repeat work from your team"
- Black background, white text, green signal
- Headline: "Work handled. Time returned."
- Two sections: "What it takes off your team" / "What it doesn't do"
- CTA: "Reply with a time that works"
- Dark mode compatible, Outlook-safe, single column

Created: 2026-09-27
