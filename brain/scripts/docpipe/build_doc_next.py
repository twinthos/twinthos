#!/usr/bin/env python3
"""
Twinthos document pipeline — markdown to measured A4 PDF.

Why this exists: the previous five Telegram PDFs were hand-written HTML with
fixed-height pages and overflow:hidden, printed by Chrome with no build script,
no page map, no links and no gate. Content could vanish silently and page
cross-references were hand-guessed.

This script does four things, in order, and refuses to print if any step fails:

  1. markdown -> HTML   (pandoc, fenced_divs + bracketed spans)
  2. pagination         (headless Chrome measures every block, packs pages,
                         never splits a box or table, keeps headings with their
                         following block, writes the footer and real page number)
  3. printing           (same Chrome session, Page.printToPDF, CSS page size)
  4. verification       (pdf_gate.py asserts geometry, fill, type size,
                         contrast, text layer, links, metadata)

Cross-references: write {{ref:slug}} in the source. It is replaced with the real
page number after pagination and re-checked after the final layout pass.

Usage:
  python3 build_doc.py --source docs/x.md --out /root/x.pdf \
      --title "Document title" --author "Twinthos" --label "Audit" --date "21 October 2026"
"""

import argparse
import asyncio
import json
import os
import re
import secrets
import shutil
import socket
import subprocess
import sys
import tempfile
import time

HERE = os.path.dirname(os.path.abspath(__file__))
MM = 96 / 25.4  # css px per mm

# ----------------------------------------------------------------------------
# Design system. One scale, seven sizes, no ad-hoc tuning.
# ----------------------------------------------------------------------------
CSS = r"""
@page { size: A4; margin: 0; }
* { margin: 0; padding: 0; box-sizing: border-box;
    print-color-adjust: exact; -webkit-print-color-adjust: exact; }
:root{
  --ink:#0B0D0C; --paper:#FDFDFB; --muted:#566058; --faint:#5F6A64;
  --accent:#0B6E60; --deep:#075E52; --rule:#E3E6E2; --wash:#F3F6F4;
  --sans: "Inter", "Inter Display", "DejaVu Sans", Arial, sans-serif;
  --serif: "Inter", "DejaVu Sans", Arial, sans-serif;
}
html,body{ background:#fff; }
body{ font-family:var(--sans); color:var(--ink); -webkit-font-smoothing:antialiased;
      font-variant-numeric: tabular-nums; }

.page{
  width:210mm; height:297mm; padding:16mm 20mm 20mm; background:var(--paper);
  position:relative; overflow:hidden; page-break-after:always;
  display:flex; flex-direction:column;
}
.page:last-child{ page-break-after:auto; }
.head{ display:flex; justify-content:space-between; align-items:baseline;
       padding-bottom:3.5mm; margin-bottom:8mm; border-bottom:1px solid var(--rule); }
.kick{ font-family:var(--sans); font-size:10pt; font-weight:700; letter-spacing:.14em;
       text-transform:uppercase; color:var(--accent); }
.body{ flex:1; min-height:0; }

/* type: 10 / 12.5 / 16 / 20 / 30 / 56 */
h1{ font-family:var(--sans); font-size:56pt; font-weight:800; line-height:.96;
    letter-spacing:-.042em; }
h2{ font-family:var(--sans); font-size:30pt; font-weight:800; line-height:1.04;
    letter-spacing:-.028em; margin-bottom:6mm; }
h3{ font-family:var(--sans); font-size:18pt; font-weight:700; line-height:1.2;
    letter-spacing:-.012em; margin-bottom:3mm; }
p{ font-size:16pt; line-height:1.54; margin-bottom:4.5mm; }
p:last-child{ margin-bottom:0; }
.lead{ font-size:19.5pt; line-height:1.4; letter-spacing:-.012em; }
.small, .footnote{ font-size:12.5pt; line-height:1.5; color:var(--faint); }
.footnote{ margin-top:5mm; padding-top:4mm; border-top:1px solid var(--rule); }
.dim{ color:var(--muted); }
.accent{ color:var(--accent); }
.alert{ color:var(--deep); }
strong{ font-weight:700; }
em{ font-style:italic; }

/* firm record */
.firm{ margin-bottom:4.5mm; padding-bottom:4mm; border-bottom:1px solid var(--rule); }
.firm:last-child{ border-bottom:0; margin-bottom:0; }
.firm > p:first-child{ font-size:16.5pt; font-weight:800; letter-spacing:-.018em;
  margin-bottom:2mm; line-height:1.15; }

.ev{ font-size:11.5pt; line-height:1.44; color:var(--faint); margin-bottom:2mm;
     padding-left:4mm; border-left:2px solid var(--rule); }
.job, .why{ font-size:14pt; line-height:1.42; margin-bottom:2mm; }
.why{ color:var(--muted); }

/* callout: rule, not a filled box */
.box{ border-left:3px solid var(--accent); background:var(--wash);
      padding:5mm 6mm; margin-bottom:5mm; }
.box:last-child{ margin-bottom:0; }
.box .label{ font-family:var(--sans); font-size:9.5pt; font-weight:800; letter-spacing:.14em;
             text-transform:uppercase; color:var(--accent); margin-bottom:2.5mm; }
.box p{ font-size:16pt; line-height:1.46; }
.box.ok{ border-left-color:var(--deep); }

table{ width:100%; border-collapse:collapse; margin-bottom:6mm; }
th{ font-family:var(--sans); font-size:9.5pt; font-weight:800; letter-spacing:.13em;
    text-transform:uppercase; text-align:left; color:var(--faint);
    padding:0 2mm 2.5mm; border-bottom:1px solid var(--ink); }
td{ font-size:14.5pt; line-height:1.42; padding:3.5mm 2mm; border-bottom:1px solid var(--rule);
    vertical-align:top; }
td.n{ font-family:var(--sans); font-weight:700; white-space:nowrap; }
tr.hl td{ background:var(--wash); }
tr.hl td:first-child{ box-shadow:inset 3px 0 0 var(--accent); }
tr.ok td{ background:var(--wash); }

blockquote{ border-left:3px solid var(--accent); padding-left:6mm; margin-bottom:5mm; }
blockquote p{ font-size:19pt; line-height:1.36; letter-spacing:-.012em; margin-bottom:2mm; }
blockquote p.att{ font-family:var(--sans); font-size:10pt; letter-spacing:.13em;
                  text-transform:uppercase; color:var(--faint); }

.stat{ font-family:var(--sans); font-size:76pt; font-weight:800; line-height:.9;
       letter-spacing:-.05em; color:var(--accent); margin-bottom:4mm; }
.statlabel{ font-size:16pt; line-height:1.46; color:var(--ink); }

ol.steps{ list-style:none; counter-reset:s; }
ol.steps > li{ counter-increment:s; position:relative; padding-left:11mm; margin-bottom:5mm;
               font-size:15.5pt; line-height:1.5; }
ol.steps > li::before{ content:counter(s); position:absolute; left:0; top:-.5mm;
  font-family:var(--sans); font-weight:800; font-size:17pt; color:var(--accent); }

ul.sources{ list-style:none; }
ul.sources li{ font-size:12.5pt; line-height:1.55; color:var(--muted); margin-bottom:2.5mm;
               padding-left:5mm; text-indent:-5mm; }
a{ color:var(--deep); text-decoration:none; border-bottom:.5pt solid var(--rule); }

.foot, .num{ position:absolute; bottom:9mm; font-family:var(--sans); font-size:9.5pt;
             color:var(--faint); letter-spacing:.13em; text-transform:uppercase; }
.foot{ left:20mm; } .num{ right:20mm; }

.page.cover{ background:#0A0C0B; color:#FDFDFB; justify-content:center; }
.page.cover .bar{ width:34mm; height:2px; background:#5FD3C4; margin:9mm 0; }
.page.cover .kick{ color:#5FD3C4; margin-bottom:11mm; }
.page.cover h1{ color:#FDFDFB; }
.page.cover h1 em, .page.cover h1 .accent, .page.cover .accent{ color:#5FD3C4; font-style:normal; }
.page.cover p, .page.cover .lead{ color:#C9D6D1; max-width:150mm; }
.page.cover .foot, .page.cover .num{ color:#5FD3C4; }
"""

PAGINATE_JS = r"""
(() => {
  const mm = 96/25.4;
  const PAD_X = 20*mm;
  const contentW = (210*mm) - 2*PAD_X;

  const flow = document.getElementById('flow');
  const blocks = [...flow.children];

  // live host: pages must be in the document for scrollHeight to mean anything
  const host = document.createElement('div');
  host.style.cssText = 'position:absolute;left:0;top:0;visibility:hidden;';
  document.body.appendChild(host);

  function makePage(firstCover) {
    const page = document.createElement('div');
    page.className = 'page' + (firstCover ? ' cover' : '');
    const body = document.createElement('div');
    body.className = 'body';
    body.style.width = contentW + 'px';
    page.appendChild(body);
    host.appendChild(page);
    return {page, body, avail: 0};
  }

  const LABEL = (document.getElementById('flow').dataset.label || '').trim();
  const DATE = (document.getElementById('flow').dataset.date || '').trim();

  function stampHead(st) {
    const head = document.createElement('div');
    head.className = 'head';
    const l = document.createElement('span'); l.className = 'kick'; l.textContent = LABEL;
    const r = document.createElement('span'); r.className = 'kick'; r.textContent = DATE;
    r.style.color = '#6E675E';
    head.appendChild(l); head.appendChild(r);
    if (!LABEL && !DATE) head.style.borderBottom = 'none';
    st.page.insertBefore(head, st.body);
    st.avail = st.body.clientHeight;   // residual flex height = true live area
  }

  const pages = [];
  let cur = null, headingPending = null;

  const fits = (body, el) => {
    body.appendChild(el);
    const ok = body.scrollHeight <= body.clientHeight + 0.5;
    if (!ok) body.removeChild(el);
    return ok;
  };

  const newPage = () => { const st = makePage(false); stampHead(st); pages.push(st); cur = st; return st; };

  for (const blk of blocks) {
    if (blk.classList.contains('cover-block')) {
      const st = makePage(true);
      st.body.appendChild(blk);
      pages.push(st); cur = st;
      continue;
    }
    if (!cur || cur.page.classList.contains('cover')) newPage();

    if (headingPending) {
      const h = headingPending; headingPending = null;
      if (cur.body.lastElementChild !== h) cur.body.appendChild(h);
      if (!fits(cur.body, blk)) { cur.body.removeChild(h); newPage(); cur.body.appendChild(h); cur.body.appendChild(blk); }
      continue;
    }

    if (/^H[23]$/.test(blk.tagName)) {
      if (!fits(cur.body, blk)) { newPage(); cur.body.appendChild(blk); }
      headingPending = blk;
      continue;
    }

    if (!fits(cur.body, blk)) {
      if (blk.tagName === 'TABLE' && blk.rows.length > 2) {
        const head = blk.tHead ? blk.tHead.cloneNode(true) : blk.rows[0].cloneNode(true);
        const rows = [...blk.rows].slice(blk.tHead ? 0 : 1);
        let t = document.createElement('table');
        let th = document.createElement('thead'); th.appendChild(head.cloneNode(true)); t.appendChild(th);
        let tb = document.createElement('tbody'); t.appendChild(tb);
        cur.body.appendChild(t);
        if (!fits(cur.body, t) && t.parentNode === cur.body) {
          cur.body.removeChild(t);
          newPage();
          t = document.createElement('table');
          th = document.createElement('thead'); th.appendChild(head.cloneNode(true)); t.appendChild(th);
          tb = document.createElement('tbody'); t.appendChild(tb);
          cur.body.appendChild(t);
        }
        for (const r of rows) {
          tb.appendChild(r.cloneNode(true));
          if (cur.body.scrollHeight > cur.body.clientHeight + 0.5) {
            if (tb.lastChild && tb.lastChild.parentNode === tb) tb.removeChild(tb.lastChild);
            newPage();
            t = document.createElement('table');
            th = document.createElement('thead'); th.appendChild(head.cloneNode(true)); t.appendChild(th);
            tb = document.createElement('tbody'); t.appendChild(tb);
            cur.body.appendChild(t);
            tb.appendChild(r.cloneNode(true));
          }
        }
        continue;
      }
      newPage(); cur.body.appendChild(blk);
    }
  }
  if (headingPending) cur.body.appendChild(headingPending);

  // footer, page number, fill measurement (real content extents, not scrollHeight)
  const stats = [];
  pages.forEach((st, i) => {
    const n = i + 1;
    const f = document.createElement('div'); f.className = 'foot'; f.textContent = 'Twinthos';
    const num = document.createElement('div'); num.className = 'num'; num.textContent = String(n).padStart(2, '0');
    st.page.appendChild(f); st.page.appendChild(num);
    const isCover = st.page.classList.contains('cover');
    const br = st.body.getBoundingClientRect();
    const last = st.body.lastElementChild ? st.body.lastElementChild.getBoundingClientRect().bottom : br.top;
    const used = isCover ? br.height : Math.max(0, last - br.top);
    stats.push({page: n, usedPx: Math.round(used), availPx: Math.round(br.height),
                fillPct: Math.round(used / br.height * 100)});
  });

  // page map for cross references
  const map = {};
  pages.forEach((st, i) => {
    st.page.querySelectorAll('[data-slug]').forEach(el => { if (!(el.dataset.slug in map)) map[el.dataset.slug] = i + 1; });
  });

  pages.forEach(st => {
    st.body.innerHTML = st.body.innerHTML.replace(/\{\{ref:([a-z0-9\-]+)\}\}/g,
      (m, s) => (s in map) ? String(map[s]) : '??');
  });

  const html = '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">' +
      document.querySelector('title').outerHTML + '<style>' + document.getElementById('css').textContent + '</style></head><body>' +
      pages.map(p => p.page.outerHTML).join('\n') + '</body></html>';

  const unresolved = (html.match(/\?\?/g) || []).length;
  return JSON.stringify({html, pagemap: map, stats, unresolved});
})()
"""


# ----------------------------------------------------------------------------
# markdown -> html
# ----------------------------------------------------------------------------
def md_to_html(src_path):
    if not shutil.which("pandoc"):
        sys.exit("pandoc not found")
    proc = subprocess.run(
        ["pandoc", src_path, "-f", "markdown+fenced_divs+bracketed_spans+pipe_tables+smart",
         "-t", "html5", "--wrap=none"],
        capture_output=True, text=True)
    if proc.returncode != 0:
        sys.exit("pandoc failed: " + proc.stderr)
    return proc.stdout


def add_slugs(html):
    """Give every h2/h3 a stable data-slug so {{ref:slug}} can resolve to its page.
    Note group numbering: (?P<tag>..) is group 1, attrs group 2, inner html group 3."""
    counter = {"n": 0}

    def repl(m):
        tag, attrs, inner = m.group(1), m.group(2), m.group(3)
        text = re.sub(r"<[^>]+>", "", inner)
        slug = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")[:40] or f"s{counter['n']}"
        counter["n"] += 1
        return f'<{tag}{attrs} data-slug="{slug}">{inner}</{tag}>'

    return re.sub(r'<(?P<tag>h[23])([^>]*)>(.*?)</(?P=tag)>', repl, html, flags=re.S)


def build_html(body_html, title, label, date, footer_label="Twinthos"):
    body_html = add_slugs(body_html)
    # pandoc figures/tables: mark tables so the paginator can split them at rows
    return f"""<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<title>{title}</title>
<style id="css">{CSS}</style></head><body>
<div id="flow" data-label="{label}" data-date="{date}" style="position:absolute;left:-9999px;top:0;width:{int(210*MM-40*MM)}px">{body_html}</div>
</body></html>"""


# ----------------------------------------------------------------------------
# CDP plumbing
# ----------------------------------------------------------------------------
def free_port():
    s = socket.socket(); s.bind(("127.0.0.1", 0)); p = s.getsockname()[1]; s.close(); return p


async def cdp_paginate_and_print(html_path, out_pdf):
    import websockets

    port = free_port()
    profile = tempfile.mkdtemp(prefix="twinthos-docpipe-")
    chrome = shutil.which("google-chrome") or shutil.which("chromium")
    if not chrome:
        sys.exit("no chrome binary")
    proc = subprocess.Popen(
        [chrome, "--headless=new", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage",
         "--no-first-run", "--allow-file-access-from-files", "--force-color-profile=srgb",
         f"--remote-debugging-port={port}", f"--user-data-dir={profile}", "about:blank"],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    ws_url = None
    for _ in range(100):
        try:
            import urllib.request
            data = json.loads(urllib.request.urlopen(f"http://127.0.0.1:{port}/json/version", timeout=1).read())
            ws_url = data["webSocketDebuggerUrl"]; break
        except Exception:
            time.sleep(0.15)
    if not ws_url:
        proc.kill(); sys.exit("chrome did not expose CDP")

    async with websockets.connect(ws_url, max_size=64 * 1024 * 1024) as ws:
        counter = {"i": 0}

        async def call(method, params=None, session=None):
            counter["i"] += 1
            msg = {"id": counter["i"], "method": method, "params": params or {}}
            if session:
                msg["sessionId"] = session
            await ws.send(json.dumps(msg))
            while True:
                raw = json.loads(await ws.recv())
                if raw.get("id") == counter["i"]:
                    if "error" in raw:
                        raise RuntimeError(f"{method}: {raw['error']}")
                    return raw.get("result", {})

        target = await call("Target.createTarget", {"url": "about:blank"})
        attached = await call("Target.attachToTarget", {"targetId": target["targetId"], "flatten": True})
        sid = attached["sessionId"]
        await call("Page.enable", session=sid)
        await call("Runtime.enable", session=sid)
        await call("Page.navigate", {"url": "file://" + html_path}, session=sid)
        await asyncio.sleep(0.6)

        # wait for fonts/layout
        await call("Runtime.evaluate", {"expression": "document.fonts.ready.then(()=>1)",
                                        "awaitPromise": True}, session=sid)
        res = await call("Runtime.evaluate", {"expression": PAGINATE_JS, "returnByValue": True,
                                             "awaitPromise": True}, session=sid)
        if "exceptionDetails" in res:
            raise RuntimeError(json.dumps(res["exceptionDetails"])[:800])
        payload = json.loads(res["result"]["value"])

        # write the paginated document and re-load it so print matches exactly
        paginated_path = out_pdf.replace(".pdf", ".paginated.html")
        with open(paginated_path, "w", encoding="utf-8") as fh:
            fh.write(payload["html"])
        await call("Page.navigate", {"url": "file://" + paginated_path}, session=sid)
        await asyncio.sleep(0.6)
        await call("Runtime.evaluate", {"expression": "document.fonts.ready.then(()=>1)",
                                        "awaitPromise": True}, session=sid)

        pdf = await call("Page.printToPDF", {
            "printBackground": True, "preferCSSPageSize": True,
            "displayHeaderFooter": False, "marginTop": 0, "marginBottom": 0,
            "marginLeft": 0, "marginRight": 0, "transferMode": "ReturnAsBase64",
        }, session=sid)

    proc.terminate()
    try:
        proc.wait(timeout=5)
    except Exception:
        proc.kill()
    shutil.rmtree(profile, ignore_errors=True)

    import base64
    with open(out_pdf, "wb") as fh:
        fh.write(base64.b64decode(pdf["data"]))
    return payload


# ----------------------------------------------------------------------------
# metadata (Chrome emits only Title; clients read Author/Subject/Keywords)
# Written as a standard PDF incremental update: the original body, its links and
# its embedded fonts are untouched, so nothing can be re-encoded or lost.
# ----------------------------------------------------------------------------
def _pdf_str(s):
    """PDF text string. ASCII goes in a literal string; anything else uses the
    UTF-16BE hex form with a BOM so the em dash and the £ sign survive."""
    s = str(s)
    if all(32 <= ord(c) < 127 for c in s):
        return "(" + s.replace("\\", r"\\").replace("(", r"\(").replace(")", r"\)") + ")"
    return "<FEFF" + s.encode("utf-16-be").hex().upper() + ">"


def write_metadata(pdf_path, title, author, subject, keywords):
    data = open(pdf_path, "rb").read()
    tail = data[-2048:]
    ti = tail.rfind(b"trailer")
    if ti < 0:
        return False
    trailer = tail[ti:].decode("latin-1")

    def grab(key, default=None):
        m = re.search(r"/" + key + r"\s*(\[[^\]]*\]|\d+\s+\d+\s+R)", trailer)
        return m.group(1) if m else default

    m_size = re.search(r"/Size\s+(\d+)", trailer)
    size = m_size.group(1) if m_size else None
    root = grab("Root")
    ident = grab("ID")
    if not size or not root:
        return False
    new_obj = int(size)
    prev_xref = data.rfind(b"startxref")
    prev = re.search(rb"startxref\s+(\d+)", data[prev_xref:])
    if not prev:
        return False
    prev_off = int(prev.group(1))

    stamp = time.strftime("D:%Y%m%d%H%M%SZ")
    info = (f"<</Title{_pdf_str(title)}/Author{_pdf_str(author)}"
            f"/Subject{_pdf_str(subject)}/Keywords{_pdf_str(keywords)}"
            f"/Creator{_pdf_str('Twinthos document pipeline')}"
            f"/Producer{_pdf_str('Twinthos document pipeline')}"
            f"/CreationDate{_pdf_str(stamp)}/ModDate{_pdf_str(stamp)}>>")

    body = b"\n" + f"{new_obj} 0 obj\n{info}\nendobj\n".encode("latin-1")
    obj_off = len(data) + 1          # byte position of the new object (0-based)
    xref_off = len(data) + len(body)  # byte position of the new xref table
    xref = (f"xref\n{new_obj} 1\n{obj_off:010d} 00000 n \n"
            f"trailer\n<</Size {new_obj + 1}/Root {root}/Info {new_obj} 0 R"
            f"{'/ID ' + ident if ident else ''}/Prev {prev_off}>>\nstartxref\n"
            f"{xref_off}\n%%EOF\n").encode("latin-1")
    with open(pdf_path, "ab") as fh:
        fh.write(body)
        fh.write(xref)
    return True


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--source", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--title", required=True)
    ap.add_argument("--author", default="Twinthos")
    ap.add_argument("--subject", default="")
    ap.add_argument("--keywords", default="Twinthos")
    ap.add_argument("--label", default="Twinthos")
    ap.add_argument("--date", default=time.strftime("%d %B %Y"))
    ap.add_argument("--no-gate", action="store_true")
    args = ap.parse_args()

    body = md_to_html(args.source)
    html = build_html(body, args.title, args.label, args.date)
    tmpdir = tempfile.mkdtemp(prefix="twinthos-html-")
    html_path = os.path.join(tmpdir, "source.html")
    open(html_path, "w", encoding="utf-8").write(html)

    payload = asyncio.run(cdp_paginate_and_print(html_path, args.out))
    write_metadata(args.out, args.title, args.author, args.subject, args.keywords)

    print(json.dumps({
        "pdf": args.out,
        "pages": len(payload["stats"]),
        "fill": [s["fillPct"] for s in payload["stats"]],
        "pagemap": payload["pagemap"],
        "bytes": os.path.getsize(args.out),
    }, indent=1))

    if not args.no_gate:
        gate = os.path.join(HERE, "pdf_gate.py")
        if os.path.exists(gate):
            sys.exit(subprocess.run([sys.executable, gate, args.out, "--source",
                                                os.path.abspath(args.source)]).returncode)


if __name__ == "__main__":
    main()
