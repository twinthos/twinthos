# Twinthos homepage — design, colour and motion audit

**1 November 2026.** Scope: homepage source and generated build. Browser screenshots and live Core Web Vitals were not independently verified.

## Findings and fixes

| Area | Audit finding | Implemented change |
|---|---|---|
| First-screen hierarchy | Full-bleed video appeared before the main offer and CTA | Hero now leads with the proposition, action and operating-model illustration |
| Product understanding | Generic description and repetitive task lists | Interactive, labelled example workbench explaining instructions, agreed steps and exceptions |
| Brand colour | Base and later style layers used different emerald greens and olive surfaces | Carbon, porcelain, polished sage and warm exception tones scoped to homepage |
| Motion | Looping autoplay film without user choice | User-initiated film with preload=none, separate controls, viewport pause and reduced-motion handling |
| Mobile | Tall portrait video pushed CTA away | Copy and call-to-action come first; illustration and video follow at responsive sizes |
| Accessibility | Video controls were tied to JavaScript playback | Native video controls without JS; explicit ARIA for tabs, sections, illustration and playback |
| Performance | Entire legacy CSS was inlined into home HTML | Shared cacheable CSS asset plus a tiny dark canvas fallback |
| Conversion | Pricing and security proof did not connect to the initial story | Step-by-step product flow, approval boundary and clear audit/managed offers |

## Art direction and colour

- Carbon: #080A09, used for the canvas.
- Porcelain: #F3F2EC, main copy and buttons.
- Silver: #B4BAB4, secondary copy.
- Sage platinum: #BAD4C9, focused interaction accents and motion.
- Deep panel: #101512, interactive demonstration surface.
- Warm exception: #E2C4A6, strictly for human approval.

Source-level contrast formula checks from GitHub CI: main text 17.7:1, body copy 10:1, panel copy 9:1, silver/sage accent 12.6:1 and button 17.5:1. These do not certify every rendered pixel.

Typography: Inter Tight for headlines, IBM Plex Serif italic for one expressive passage per section, Geist Mono for short editorial annotations.

## Motion system

- Hero content is immediately visible. No introductory loader or automatic video.
- Ambient decorative orbits run slowly (~28 and ~39 seconds), with an 11-second chrome light sweep. These use CSS, not perpetual JavaScript.
- Three workflow examples are selected using native buttons; they update safe textContent and aria-pressed, never access real external systems.
- The demonstration film downloads only when requested, plays on an explicit gesture, pauses when out of view and has fallback controls if JS is absent.
- Supporting sections use one-time viewport reveals. Reduced-motion settings leave information fully visible and suppress nonessential animation.

## Reproducible checks

Run from the repository root:

    python3 _src/build.py
    python3 _src/homepage_check.py
    node --check assets/tw.js

Initial verified redesign build: 12 pages built; 23,689 bytes of generated homepage HTML; 143,567 bytes of concatenated global CSS before compression. This is not a measured network payload or a Lighthouse score.

## Outstanding browser and production QA

1. Capture and compare desktop and mobile screenshots at 375, 390, 768, 1024, 1440 and 1920 px, including Safari/iOS.
2. Test keyboard-only operation, screen readers, video on slow connections, no-JS and reduced-motion behaviour.
3. Collect actual Core Web Vitals and confirm cache headers, image/video poster crops and font rendering.
4. Safely retire legacy CSS v3-v9 after visual regression tests across pricing, notes, industries and secondary pages.
5. Carry the new brand palette into secondary pages in a separate coordinated pass.
6. Verify all real deployment and integration claims with client-specific evidence. Illustrations are not production screenshots.

No invented conversion uplift, third-party audit, design award, browser certification or uptime claim.

