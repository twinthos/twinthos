# Twinthos — Deploy Guide

This document covers the two deployment methods for the Twinthos landing page
at `/root/twinthos-site/index.html`. Choose method 1 if the GitHub token is
valid; otherwise fall back to method 2 (cloudflared tunnel).

---

## Method 1 — GitHub Pages (primary, repo: `alkalinearchitect/twinthos`)

### Prerequisites
- A valid GitHub PAT (classic) or fine-grained token with `repo` + `workflow` scope
- `gh` CLI authenticated: `gh auth login -h github.com`
- SSH key authorized on the `alkalinearchitect` account, OR HTTPS token in `~/.netrc`

### Sequence (force rebuild via `gh api`)

```bash
# 1. On master, stage the rebuilt index.html
cd /root/twinthos-site
git checkout master
git add index.html hero-canvas.js scrub-engine.js
git commit -q -m "rebuild: premium red/black/white twinthos landing"

# 2. Push to master (origin = git@github.com:alkalinearchitect/twinthos.git)
git push -q origin master

# 3. Sync gh-pages branch from master
git fetch origin
git checkout -B gh-pages origin/gh-pages
git checkout master -- index.html
git commit -q -m "gh-pages: deploy rebuilt index.html"
git push -q origin gh-pages

# 4. Force GitHub Pages to rebuild from the gh-pages branch
gh api -X POST /repos/alkalinearchitect/twinthos/pages/builds

# 5. Poll for live status
while true; do
  status=$(gh api /repos/alkalinearchitect/twinthos/pages 2>/dev/null | jq -r '.status // "unknown"')
  echo "Pages status: $status"
  [ "$status" = "built" ] && break
  sleep 3
done

# 6. Curl-poll the live URL and grep for the new string
LIVE="https://alkalinearchitect.github.io/twinthos/"
for i in $(seq 1 30); do
  grep -q "monitors your inbox" <(curl -s "$LIVE") && echo "LIVE OK" && break
  sleep 2
done
```

**If the GitHub token is dead** (gh reports `token invalid`), skip to Method 2.

---

## Method 2 — Cloudflared Tunnel (fallback, when GitHub auth is dead)

### Why
- The stored `gh` token in `/root/.config/gh/hosts.yml` is invalid.
- SSH keys (`id_ed25519 / id_ed25519_vps`) are not authorized on the account.
- HTTP(S) token auth is blocked by GitHub.

### Sequence

```bash
# 1. Ensure the local static server is running (binds 127.0.0.1, NOT localhost)
cd /root/twinthos-site
python3 -m http.server 9099 --bind 127.0.0.1 &

# 2. Start a quick cloudflared tunnel to the origin
cloudflared tunnel \
  --url http://127.0.0.1:9099 \
  --no-autoupdate >> /tmp/twinthos-cloudflared.log 2>&1 &

# 3. Extract the tunnel URL
sleep 8
TUNNEL_URL=$(grep -oE 'https://[a-z0-9-]+\.trycloudflare\.com' /tmp/twinthos-cloudflared.log | head -1)
echo "Tunnel URL: $TUNNEL_URL"

# 4. Verify live: curl the URL and grep for the new seed-line string
curl -s "$TUNNEL_URL/" | grep "monitors your inbox"

# 5. (Optional) Bind to a custom domain via cloudflared
#    cloudflared tunnel --hostname twinthos.example.com --url http://127.0.0.1:9099
```

### Key detail: 127.0.0.1, not localhost
Always use `127.0.0.1` explicitly in the `--url` flag. `localhost` can resolve
to `::1` (IPv6) in some environments, causing `connection refused` when the
origin server only listens on IPv4.

---

## Git state

| Branch       | Status         |
|--------------|----------------|
| master       | v9 + terminal  |
| gh-pages     | needs refresh  |
| origin remote| `git@github.com:alkalinearchitect/twinthos.git` |

Run `git checkout master` from `/root/twinthos-site` to inspect the working tree.
