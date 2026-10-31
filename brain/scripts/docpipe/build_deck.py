#!/usr/bin/env python3
"""
Twinthos deck pipeline — markdown slides to a measured, gated PDF at a fixed
aspect ratio (laptop 16:9 or mobile 3:4), dark ground, white text.

Why: the report pipeline flows text into A4 pages. A deck cannot flow — every
slide is a fixed frame, so the only honest test is to measure each slide's
content against its own frame and refuse to print if anything overflows.

  1. markdown -> HTML       (pandoc; slides separated by a line containing ---)
  2. measure                (headless Chrome: per-slide content bottom vs frame,
                             font sizes, overflow; fails with the slide number)
  3. print                  (same Chrome session, Page.printToPDF, printBackground)
  4. metadata + gate        (pdf_gate.py with the deck's page size)

Usage:
  python3 build_deck.py --source docs/deal.md --out /root/deck-laptop.pdf \
      --size laptop --title "Where the work is" --compact
"""

import argparse
import asyncio
import base64
import json
import os
import shutil
import subprocess
import sys
import tempfile
import time

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from build_doc import free_port, write_metadata, md_to_html  # noqa: E402

# pt -> css px
PT = 96 / 72

SIZES = {
    "laptop": (792.0, 445.5, "Laptop 16:9"),
    "mobile": (425.2, 566.9, "Mobile 3:4"),
    "a4":     (595.28, 841.89, "A4"),
}

# ---------------------------------------------------------------------------
# Dark deck design system. Black ground, white ink, one mint accent.
# Contrast on #08090A: #F7F7F5 18.4:1 | #C9C9C4 11.9:1 | #8E8E88 6.6:1
#                      #7FBAB0 9.1:1 | #E0A36B 9.0:1   — all above 4.5:1.
# ---------------------------------------------------------------------------
CSS_TMPL = r"""
@page {{ size: {w}pt {h}pt; margin: 0; }}
* {{ margin:0; padding:0; box-sizing:border-box;
     print-color-adjust:exact; -webkit-print-color-adjust:exact; }}
:root {{
  --bg:#08090A; --ink:#F7F7F5; --body:#DEDEDA; --muted:#A9A9A3; --faint:#8E8E88;
  --mint:#7FBAB0; --warm:#E0A36B; --rule:#26282B; --card:#101214;
  --sans:"Inter","Liberation Sans",Arial,Helvetica,sans-serif;
  --serif:Georgia,"Liberation Serif","DejaVu Serif",serif;
}}
html,body {{ background:var(--bg); }}
body {{ font-family:var(--serif); color:var(--body); -webkit-font-smoothing:antialiased; }}

.slide {{
  width:{w}pt; height:{h}pt; background:var(--bg); color:var(--body);
  padding:{pad_top}pt {pad_x}pt {pad_bottom}pt {pad_x}pt;
  position:relative; overflow:hidden; page-break-after:always;
  display:flex; flex-direction:column;
}}
.slide:last-child {{ page-break-after:auto; }}
.slide .body {{ flex:1 1 auto; min-height:0; overflow:hidden; }}

.kick {{ font-family:var(--sans); font-size:{s_kick}pt; letter-spacing:.10em;
         text-transform:uppercase; color:var(--mint); margin-bottom:{gap_s}pt; }}
.slide h1 {{ font-size:{s_h1}pt; line-height:1.06; color:var(--ink); font-weight:600;
             letter-spacing:-.01em; margin-bottom:{gap_m}pt; }}
.slide h2 {{ font-size:{s_h2}pt; line-height:1.14; color:var(--ink); font-weight:600;
             margin-bottom:{gap_s}pt; }}
.slide p {{ font-size:{s_body}pt; line-height:1.42; margin-bottom:{gap_s}pt; }}
.slide p.lead {{ font-size:{s_lead}pt; color:var(--ink); line-height:1.34; }}
.slide ul {{ margin:0 0 {gap_s}pt 0; list-style:none; }}
.slide li {{ font-size:{s_body}pt; line-height:1.36; padding-left:{bullet_pad}pt;
             position:relative; margin-bottom:{li_gap}pt; }}
.slide li::before {{ content:""; position:absolute; left:0; top:{dot_top}pt;
                     width:{dot_w}pt; height:{dot_w}pt; background:var(--mint);
                     border-radius:50%; }}
.slide li strong {{ color:var(--ink); font-weight:600; }}
.slide .big {{ font-size:{s_big}pt; line-height:1; color:var(--mint); font-weight:600;
               letter-spacing:-.02em; margin:{gap_s}pt 0; }}
.slide table {{ width:100%; border-collapse:collapse; font-family:var(--sans);
                font-size:{s_table}pt; }}
.slide th {{ text-align:left; color:var(--faint); font-weight:600;
             text-transform:uppercase; letter-spacing:.06em; font-size:{s_th}pt;
             border-bottom:1px solid var(--rule); padding:{cell_y}pt {cell_x}pt; }}
.slide td {{ color:var(--body); border-bottom:1px solid var(--rule);
             padding:{cell_y}pt {cell_x}pt; vertical-align:top; }}
.slide td strong {{ color:var(--ink); }}
.slide td .sec {{ display:block; color:var(--faint); font-weight:600;
                  font-size:{s_th}pt; letter-spacing:.06em; text-transform:uppercase;
                  margin-top:1px; }}
.slide .d {{ font-size:{s_note}pt; color:var(--faint); line-height:1.42;
             border-left:2px solid var(--rule); padding-left:{cell_x}pt;
             margin-top:{gap_s}pt; }}
.slide a {{ color:var(--mint); text-decoration:none; }}
.slide .note {{ font-size:{s_note}pt; color:var(--faint); line-height:1.34;
                font-family:var(--sans); }}
.slide .rule {{ border-top:1px solid var(--rule); margin:{gap_s}pt 0; }}
.slide .cols {{ display:flex; gap:{col_gap}pt; }}
.slide .cols > div {{ flex:1 1 0; min-width:0; }}
.slide .tag {{ display:inline-block; font-family:var(--sans); font-size:{s_th}pt;
               letter-spacing:.08em; text-transform:uppercase; color:var(--warm);
               border:1px solid var(--rule); border-radius:2pt;
               padding:1pt {cell_x}pt; margin-right:{cell_x}pt; }}
.slide.cover {{ justify-content:flex-end; }}
.slide.cover .body {{ display:flex; flex-direction:column; justify-content:flex-end; }}
.slide:not(.cover) .body {{ display:flex; flex-direction:column; justify-content:center; }}
.slide.cover h1 {{ font-size:{s_cover}pt; }}
.foot {{ position:absolute; left:{pad_x}pt; right:{pad_x}pt; bottom:{foot_b}pt;
         display:flex; justify-content:space-between; font-family:var(--sans);
         font-size:{s_foot}pt; color:var(--faint); letter-spacing:.08em;
         text-transform:uppercase; }}
.num {{ position:absolute; right:{pad_x}pt; bottom:{foot_b}pt; font-family:var(--sans);
        font-size:{s_foot}pt; color:var(--faint); }}
{compact}
"""

COMPACT_CSS = ".slide .d { display:none !important; }"

MEASURE_JS = r"""
(() => {
  const slides = [...document.querySelectorAll('.slide')];
  const out = slides.map((s, i) => {
    const frame = s.getBoundingClientRect();
    const body = s.querySelector('.body') || s;
    const br = body.getBoundingClientRect();
    let last = 0, first = Infinity, widest = 0;
    body.querySelectorAll('*').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.height === 0 && r.width === 0) return;
      last = Math.max(last, r.bottom);
      first = Math.min(first, r.top);
      widest = Math.max(widest, r.right);
    });
    if (!isFinite(first)) first = br.top;
    const used = Math.max(0, last - first);   // real content height, not the top gap
    const avail = br.height;
    const sizes = new Set();
    body.querySelectorAll('*').forEach(el => {
      const fs = parseFloat(getComputedStyle(el).fontSize);
      if (fs && el.textContent.trim()) sizes.add(Math.round(fs * 0.75 * 10) / 10);
    });
    return {
      slide: i + 1,
      avail_px: Math.round(avail),
      used_px: Math.round(used),
      overflow_px: Math.round(Math.max(0, last - br.bottom)),
      fill_pct: Math.round(used / avail * 100),
      side_overflow_px: Math.round(Math.max(0, widest - br.right)),
      words: body.innerText.trim().split(/\s+/).filter(Boolean).length,
      min_pt: sizes.size ? Math.min(...sizes) : 0,
      max_pt: sizes.size ? Math.max(...sizes) : 0,
      typesizes: sizes.size,
      scroll_over: Math.round(Math.max(0, body.scrollHeight - body.clientHeight)),
    };
  });
  return JSON.stringify({slides: out, total: slides.length});
})()
"""


TYPE = {
    # Laptop is read at ~screen size in a viewer; mobile is read at full phone
    # width. Type is chosen for legibility, not scaled proportionally — a 3:4
    # page at 0.54 scale would put body copy at 7pt, which is unreadable.
    "laptop": dict(pad_top=30, pad_x=40, pad_bottom=26, max_w=680,
                   kick=10.5, h1=31, h2=22, body=16.2, lead=18.5, big=64,
                   table=13.2, th=10.2, note=11, cover=38, foot=9.6,
                   gap_s=7, gap_m=11, li_gap=3.6, bullet_pad=13, dot_top=4.2,
                   dot_w=4.4, cell_y=3.6, cell_x=4, col_gap=16, foot_b=20),
    "mobile": dict(pad_top=34, pad_x=30, pad_bottom=30, max_w=1000,
                   kick=11, h1=27, h2=19, body=16.4, lead=17.5, big=48,
                   table=13.6, th=10.4, note=11.6, cover=30, foot=10.2,
                   gap_s=8, gap_m=12, li_gap=4.5, bullet_pad=15, dot_top=5,
                   dot_w=5, cell_y=4.2, cell_x=4.5, col_gap=14, foot_b=20),
}


def build_html(slides_html, title, label, date, compact, w, h, preset="laptop"):
    t = TYPE[preset]
    css = CSS_TMPL.format(
        w=round(w, 2), h=round(h, 2),
        pad_top=t["pad_top"], pad_x=t["pad_x"], pad_bottom=t["pad_bottom"],
        s_kick=t["kick"], s_h1=t["h1"], s_h2=t["h2"], s_body=t["body"],
        s_lead=t["lead"], s_big=t["big"], s_table=t["table"], s_th=t["th"],
        s_note=t["note"], s_cover=t["cover"], s_foot=t["foot"],
        gap_s=t["gap_s"], gap_m=t["gap_m"], li_gap=t["li_gap"],
        bullet_pad=t["bullet_pad"], dot_top=t["dot_top"], dot_w=t["dot_w"],
        cell_y=t["cell_y"], cell_x=t["cell_x"], col_gap=t["col_gap"],
        foot_b=t["foot_b"],
        compact=COMPACT_CSS if compact else "",
    )
    css += f"\n.slide .body {{ max-width:{t['max_w']}pt; }}\n"
    body = []
    n = len(slides_html)
    for i, sl in enumerate(slides_html, 1):
        cls = "slide cover" if i == 1 and n > 1 else "slide"
        foot = "" if cls.endswith("cover") else (
            f'<div class="foot"><span>{label}</span><span>{date}</span></div>')
        num = "" if cls.endswith("cover") else f'<div class="num">{i:02d}</div>'
        body.append(f'<section class="{cls}"><div class="body">{sl}</div>{foot}{num}</section>')
    return f"""<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>{title}</title>
<meta name="author" content="Twinthos">
<meta name="description" content="{title}">
<meta name="keywords" content="Twinthos, digital employee, AI agents">
<style>{css}</style></head><body>{''.join(body)}</body></html>"""


async def render(html_path, out_pdf):
    import websockets
    port = free_port()
    profile = tempfile.mkdtemp(prefix="twinthos-deck-")
    chrome = shutil.which("google-chrome") or shutil.which("chromium")
    proc = subprocess.Popen(
        [chrome, "--headless=new", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage",
         "--no-first-run", "--allow-file-access-from-files", "--force-color-profile=srgb",
         f"--remote-debugging-port={port}", f"--user-data-dir={profile}", "about:blank"],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    ws_url = None
    import urllib.request
    for _ in range(120):
        try:
            ws_url = json.loads(urllib.request.urlopen(
                f"http://127.0.0.1:{port}/json/version", timeout=1).read())["webSocketDebuggerUrl"]
            break
        except Exception:
            time.sleep(0.15)
    if not ws_url:
        proc.kill(); sys.exit("chrome did not expose CDP")

    async with websockets.connect(ws_url, max_size=64 * 1024 * 1024) as ws:
        c = {"i": 0}

        async def call(method, params=None, session=None):
            c["i"] += 1
            msg = {"id": c["i"], "method": method, "params": params or {}}
            if session:
                msg["sessionId"] = session
            await ws.send(json.dumps(msg))
            while True:
                raw = json.loads(await ws.recv())
                if raw.get("id") == c["i"]:
                    if "error" in raw:
                        raise RuntimeError(f"{method}: {raw['error']}")
                    return raw.get("result", {})

        tgt = await call("Target.createTarget", {"url": "about:blank"})
        sid = (await call("Target.attachToTarget", {"targetId": tgt["targetId"], "flatten": True}))["sessionId"]
        await call("Page.enable", session=sid)
        await call("Runtime.enable", session=sid)
        await call("Page.navigate", {"url": "file://" + html_path}, session=sid)
        await asyncio.sleep(0.6)
        await call("Runtime.evaluate", {"expression": "document.fonts.ready.then(()=>1)",
                                        "awaitPromise": True}, session=sid)
        res = await call("Runtime.evaluate", {"expression": MEASURE_JS, "returnByValue": True},
                         session=sid)
        if "exceptionDetails" in res:
            raise RuntimeError(json.dumps(res["exceptionDetails"])[:600])
        stats = json.loads(res["result"]["value"])
        pdf = await call("Page.printToPDF", {
            "printBackground": True, "preferCSSPageSize": True, "displayHeaderFooter": False,
            "marginTop": 0, "marginBottom": 0, "marginLeft": 0, "marginRight": 0,
            "transferMode": "ReturnAsBase64"}, session=sid)

    proc.terminate()
    try:
        proc.wait(timeout=5)
    except Exception:
        proc.kill()
    shutil.rmtree(profile, ignore_errors=True)
    with open(out_pdf, "wb") as fh:
        fh.write(base64.b64decode(pdf["data"]))
    return stats


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--source", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--size", default="laptop", help="laptop | mobile | WxH in pt")
    ap.add_argument("--title", required=True)
    ap.add_argument("--subject", default="")
    ap.add_argument("--keywords", default="Twinthos,digital employee,AI agents")
    ap.add_argument("--label", default="Twinthos")
    ap.add_argument("--date", default=time.strftime("%d %B %Y"))
    ap.add_argument("--compact", action="store_true", help="hide .d elements (mobile variant)")
    ap.add_argument("--min-fill", type=float, default=35.0)
    ap.add_argument("--no-gate", action="store_true")
    a = ap.parse_args()

    preset = a.size if a.size in TYPE else ("mobile" if "x" in a.size and float(
        a.size.lower().split("x")[0]) < 600 else "laptop")
    if a.size in SIZES:
        w, h, name = SIZES[a.size]
    else:
        w, h = [float(x) for x in a.size.lower().replace(" ", "").split("x")]
        name = f"{w}x{h}"

    body = md_to_html(os.path.abspath(a.source))
    slides = [chunk.strip() for chunk in body.split("<hr />") if chunk.strip()]
    if not slides:
        sys.exit("no slides found — separate slides with a line containing ---")

    html = build_html(slides, a.title, a.label, a.date, a.compact, w, h, preset)
    tmp_html = a.out.replace(".pdf", ".src.html")
    with open(tmp_html, "w", encoding="utf-8") as fh:
        fh.write(html)

    stats = asyncio.run(render(tmp_html, a.out))
    write_metadata(a.out, a.title, "Twinthos", a.subject or a.title, a.keywords)

    print(f"DECK — {os.path.basename(a.out)}  [{name}]  {stats['total']} slides")
    bad = [s for s in stats["slides"] if s["overflow_px"] > 0 or s["side_overflow_px"] > 2]
    for s in stats["slides"]:
        flag = "  OVERFLOW" if s in bad else ""
        print(f"  {s['slide']:02d}  fill {s['fill_pct']:3d}%  {s['words']:3d} words  "
              f"{s['min_pt']:.1f}-{s['max_pt']:.1f}pt  {s['typesizes']} sizes{flag}")

    if bad:
        print("\n  FAIL — slide content does not fit its frame:")
        for s in bad:
            print(f"   - slide {s['slide']}: {s['overflow_px']}px below the frame, "
                  f"{s['side_overflow_px']}px past the right edge")
        sys.exit(1)

    if not a.no_gate:
        gate = os.path.join(HERE, "pdf_gate.py")
        if os.path.exists(gate):
            rc = subprocess.run([sys.executable, "-W", "ignore", gate, a.out,
                                 "--size", f"{w}x{h}", "--min-fill", str(a.min_fill),
                                 "--margin", "5", "--clip-mm", "3",
                                 "--source", os.path.abspath(a.source)]).returncode
            if rc != 0:
                sys.exit(rc)


if __name__ == "__main__":
    main()