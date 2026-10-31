# System audit — 21 October 2026

Measured on the machine, not from memory. Every finding below has the command or
the URL that produced it.

## 1. What is actually running

| Check | Result |
|---|---|
| Uptime / load | 22h 57m, load 0.81 (4 cores) |
| Disk | 52G used of 79G (69%), 24G free |
| Memory | 32 GB total, 27 GB available |
| Scheduled jobs | 4 Hermes cron jobs, all `last_status: ok` |
| Backups | `twinthos-full-backup` runs every 30 min. 339 completed runs. Last push 2026-10-21T17:53:08Z, 15 paths changed, repo 203 MB |
| Vault sync | `obsidian-vault-sync` every 30 min, 1,294 runs, ok |
| Listening services | Hermes (49343, 8642, 35073), desktop-api 8080, websockify 6080, VNC 5999, two `python3 -m http.server` (8901 all interfaces, 8899 loopback), sshd 22, tailscale |

Two findings:

- **`python3 -m http.server 8901` is bound to `0.0.0.0` and its working
  directory is `/root/twinthos_live`** — the full source of the live site,
  including `.git` and `_src`. Anything that can reach this machine's port 8901
  can browse the repository, history included. Bind it to 127.0.0.1 or stop it.
  (The second server, on 8899, is loopback-only and is fine.)
- **The knowledge tree is not a git repository itself.** `/root/twinthos-brain`
  has no `.git`. Versioning happens through `/root/twinthos_backup`, which
  copies paths on a schedule. That works, but it means `git log` inside the
  brain tells you nothing and there is no per-file history there.

## 2. Secrets

A live GitHub token and a Stripe live key are sitting in plaintext in the
filesystem, not in `.env`:

- `/root/push_ghpages.py`, `/root/push_all.py`, `/root/push_fixes.py`,
  `/root/upload_video.py`, `/root/upload_video2.py` through `upload_video6.py`
- `/root/twinthos_backup` — **25 matches in the repository history**: two
  distinct GitHub tokens (prefixes `ghp_W6…` and `ghp_xx…`) and two Stripe live
  keys. The current copy of `history/hermes_history.txt` is already redacted (12
  markers), so the working file is clean; the exposure sits in older commits,
  which stay recoverable until the keys are rotated.
- `/root/.hermes/state-snapshots/20261009-174807-pre-update/.env`

`twinthos_live` history is clean (0 matches), which is the one that matters for
the public site. The backup repository is private, so the exposure is internal
— but a private repo is one collaborator, one token leak or one accidental
public flip away from being a public one, and history keeps the secret after
the file is deleted.

Fixed on this machine: the backup script copied `history/hermes_history.txt`
raw while redacting only the session dumps. It now routes that file through the
same redactor, and withholds it rather than copying it raw if the redactor fails.

**Action (yours, not mine):** rotate both keys at GitHub and Stripe, then let
me replace the hard-coded strings with reads from `.env`. Rotation first —
cleaning the files does nothing while the old keys are still valid.

## 3. The live site

| URL | Status |
|---|---|
| https://twinthos.com/ | 200 |
| /pricing/ /book/ /brain/ /workforce/ | 200 |
| /sitemap.xml | 200, 24 URLs |
| /robots.txt | 200 |
| /ai-catalog.json | 200 (previously reported as undeployed — it is live) |
| **https://www.twinthos.com/** | **fails** |

**The www host is broken.** DNS resolves `www.twinthos.com` to the GitHub Pages
IPs, but the TLS certificate served is `CN = *.github.io` — GitHub does not
recognise `www.twinthos.com` as a custom domain for the site, so the handshake
presents the wrong name and every browser blocks the page. The `CNAME` file
contains `twinthos.com` only.

Fix, in order: add a DNS record `www` CNAME → `twinthos.com` (currently www
resolves straight to Pages), and add a redirect so www lands on the apex. Until
then every visitor who types "www." sees a security warning.

**Five pages exist on disk but are missing from the sitemap:** `/audit/`,
`/demo/`, `/demos/`, `/questions/`, `/thankyou/`. The sitemap has 24 URLs; the
site has 29 directories with an `index.html`.

**Still no analytics of any kind.** Zero matches for gtag, GTM, Plausible,
Umami, PostHog, Hotjar, Fathom or Clarity on the homepage. You cannot know
whether any of the outbound work in this book produced a visit.

## 4. The documents

`2026-10-21_twinthos_targetbook_v2_52pp.pdf` passes the machine gate: 52 pages,
560 KB, 7 type sizes, weakest contrast 5.39:1, all pages above 49% fill.

The gate cannot see the following, which is why they are still there:

- **Seven duplicated table headers.** `FIRM / THE REPEATING JOB / WHO TO CALL`
  prints twice, back to back, on page breaks (text lines 205, 335, 506, 784,
  1035, 1175, 1315 of the extraction). Same fault in the appendix cover table.
- **The prose reads at university level.** Prose-only Flesch Reading Ease 38,
  Flesch–Kincaid grade 13.5, average sentence 22 words, 44 sentences over 30
  words. The target for a phone reader is 60+ and 14 words.
- **Four prices live in one document** — £750/month, £1,500 pilot, £5,000/month,
  £60,000/year — and `company/pricing.md` contains none of the £1,500. The
  document says on page 5 that no price is final until Tyson decides. That is
  honest, and it is also why a reader cannot act.
- **It is 52 pages.** Nine thousand words. It is a research file, not a door
  opener. See the deck audit for what to send instead.

## 5. What the audit changes

1. Rotate two keys today. Everything else can wait; that cannot.
2. Fix www before any outbound push, because the first thing a prospect does
   after an email is type the domain.
3. Put one analytics tag on the site this week so the outbound work is
   measurable.
4. Add the five missing pages to the sitemap.
5. From here on, the deck is a leave-behind. The door opener is one page.
