#!/usr/bin/env python3
"""Scrape public Telegram channels through their web preview (t.me/s/<handle>).

No API key, no user session: only channels that are public and have the web
preview enabled are readable. Writes one JSON object per message to JSONL.

Usage: python3 telegram_scrape.py out.jsonl handle1 handle2 ... [--pages N]
"""
import json, re, sys, html, time, urllib.request, urllib.error

UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36"


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "en-GB,en;q=0.9"})
    with urllib.request.urlopen(req, timeout=25) as r:
        return r.read().decode("utf-8", "replace")


def strip(t):
    t = re.sub(r"<br\s*/?>", "\n", t)
    t = re.sub(r"<[^>]+>", "", t)
    return html.unescape(t).strip()


def parse(page, handle):
    out = []
    # each message block
    for m in re.finditer(r'<div class="tgme_widget_message[^"]*"[^>]*data-post="([^"]+)"(.*?)(?=<div class="tgme_widget_message[^"]*"[^>]*data-post="|\Z)', page, re.S):
        post, body = m.group(1), m.group(2)
        mid = post.split("/")[-1]
        tm = re.search(r'<time[^>]*datetime="([^"]+)"', body)
        txt = re.search(r'<div class="tgme_widget_message_text[^"]*"[^>]*>(.*?)</div>', body, re.S)
        views = re.search(r'tgme_widget_message_views">([^<]+)<', body)
        out.append({
            "channel": handle, "id": mid,
            "datetime": tm.group(1) if tm else None,
            "views": views.group(1) if views else None,
            "text": strip(txt.group(1)) if txt else "",
            "url": f"https://t.me/{post}",
        })
    return out


def scrape(handle, pages=3):
    msgs, url, seen = [], f"https://t.me/s/{handle}", set()
    for _ in range(pages):
        try:
            page = fetch(url)
        except Exception as e:
            print(f"  ! {handle}: {e}", file=sys.stderr)
            break
        batch = [m for m in parse(page, handle) if m["id"] not in seen]
        if not batch:
            break
        for b in batch:
            seen.add(b["id"])
        msgs.extend(batch)
        oldest = min(int(b["id"]) for b in batch)
        url = f"https://t.me/s/{handle}?before={oldest}"
        time.sleep(0.8)
    msgs.sort(key=lambda m: int(m["id"]))
    return msgs


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    pages = 3
    for a in sys.argv[1:]:
        if a.startswith("--pages="):
            pages = int(a.split("=")[1])
    out_path, handles = args[0], args[1:]
    total, per = 0, {}
    with open(out_path, "a", encoding="utf-8") as f:
        for h in handles:
            msgs = scrape(h, pages)
            per[h] = len(msgs)
            for m in msgs:
                f.write(json.dumps(m, ensure_ascii=False) + "\n")
            total += len(msgs)
            print(f"  {h}: {len(msgs)} messages")
    print(json.dumps({"total": total, "per_channel": per}))
