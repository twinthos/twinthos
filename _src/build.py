#!/usr/bin/env python3
"""Twinthos static build. Source: _src/. Output: repo root. Run: python3 _src/build.py"""
import os, re, json, glob, html, hashlib
SRC = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.dirname(SRC)
SITE = "https://twinthos.com"

css = "".join(open(p).read() for p in sorted(glob.glob(f"{SRC}/css/*.css")))
js = open(f"{SRC}/js/tw.js").read()
os.makedirs(f"{OUT}/assets", exist_ok=True)
open(f"{OUT}/assets/tw.css", "w").write(css)
open(f"{OUT}/assets/tw.js", "w").write(js)
VER = hashlib.sha1((css + js).encode()).hexdigest()[:8]

fav = open(f"{OUT}/favicon.svg").read()
MARK_D = re.search(r'<path[^>]*d="([^"]+)"', fav).group(1)
MARK = f'<svg viewBox="176 176 364 364" aria-hidden="true"><path fill="currentColor" d="{MARK_D}"/></svg>'

ARROW = '<svg class="ar" viewBox="0 0 14 14" aria-hidden="true"><path d="M1 7h11M8 3l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>'
NAV = [("How it works", "/how-it-works/", "how"), ("Demo", "/demo/", "demo"), ("Pricing", "/pricing/", "pricing"),
       ("Audit", "/operations-audit/", "audit"), ("Security", "/security/", "security"), ("About", "/about/", "about")]

def partial(name):
    return open(f"{SRC}/partials/{name}.html").read()

def layout(meta, body):
    title = meta["title"]; desc = meta["desc"]; path = meta["path"]; key = meta.get("nav", "")
    links = "".join(f'<a href="{h}"{" aria-current=\"page\"" if k == key else ""}>{t}</a>' for t, h, k in NAV)
    robots = '<meta name="robots" content="noindex">' if meta.get("noindex") else ""
    ld = ""
    if path == "":
        ld = '<script type="application/ld+json">' + json.dumps({
            "@context": "https://schema.org", "@type": "ProfessionalService", "name": "Twinthos",
            "url": SITE + "/", "email": "hello@twinthos.com", "areaServed": "GB",
            "description": "Managed AI for business operations. Twinthos builds and manages AI agents that carry recurring operational work through existing systems.",
            "priceRange": "£999–£5,000/month"}) + '</script>'
    body = body.replace('<span class="ar">→</span>', ARROW)
    return f'''<!DOCTYPE html>
<html lang="en-GB" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(title)}</title>
<meta name="description" content="{html.escape(desc)}">
{robots}<link rel="canonical" href="{SITE}/{path}">
<meta name="theme-color" content="#050505">
<meta name="color-scheme" content="dark">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Twinthos">
<meta property="og:url" content="{SITE}/{path}">
<meta property="og:title" content="{html.escape(title)}">
<meta property="og:description" content="{html.escape(desc)}">
<meta property="og:image" content="{SITE}/og.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400..600&display=swap">
<link rel="stylesheet" href="/assets/tw.css?v={VER}">
<script src="/assets/tw.js?v={VER}" defer></script>
{ld}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="nav">
  <div class="wrap">
    <a class="brand" href="/" aria-label="Twinthos home">{MARK}<span>Twinthos</span></a>
    <nav class="nav-links" id="navLinks" aria-label="Main">{links}</nav>
    <a class="btn btn-ink btn-sm" href="/book/">Request a fit call</a>
    <button class="nav-toggle" aria-label="Menu" aria-expanded="false" aria-controls="navLinks"><span></span></button>
  </div>
</header>
<main id="main">
{body}
</main>
<footer class="foot">
  <div class="wrap">
    <div class="foot-grid">
      <div>
        <a class="brand" href="/" aria-label="Twinthos home">{MARK}<span>Twinthos</span></a>
        <p style="margin-top:16px;max-width:22em">Managed AI for business operations. Designed and operated by Tyson Architect, Bath, United Kingdom.</p>
      </div>
      <div><h4>Service</h4><ul><li><a href="/how-it-works/">How it works</a></li><li><a href="/demo/">Demo</a></li><li><a href="/pricing/">Pricing</a></li><li><a href="/operations-audit/">Operations audit</a></li></ul></div>
      <div><h4>Company</h4><ul><li><a href="/about/">About</a></li><li><a href="/security/">Security and data</a></li><li><a href="/faq/">Questions</a></li></ul></div>
      <div><h4>Start</h4><ul><li><a href="/book/">Book a 15-minute fit call</a></li><li><a href="mailto:hello@twinthos.com">hello@twinthos.com</a></li></ul></div>
    </div>
    <div class="foot-base"><span>© 2026 Twinthos. Work handled. Time returned.</span><span><a href="/privacy/">Privacy</a> &nbsp;·&nbsp; <a href="/terms/">Terms</a></span></div>
  </div>
</footer>
</body>
</html>
'''

def read_page(files):
    raw = "".join(open(f).read() for f in files)
    m = re.match(r"\s*<!--(\{.*?\})-->", raw, re.S)
    meta = json.loads(m.group(1)); body = raw[m.end():]
    body = re.sub(r"\{\{(\w+)\}\}", lambda x: partial(x.group(1)), body)
    return meta, body

groups = {}
for f in sorted(glob.glob(f"{SRC}/pages/*.html")):
    groups.setdefault(os.path.basename(f).split("~")[0].replace(".html", ""), []).append(f)

built = []
for name, files in groups.items():
    meta, body = read_page(files)
    dest = f"{OUT}/{meta['path']}index.html" if meta["path"] != "404" else f"{OUT}/404.html"
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    open(dest, "w").write(layout(meta, body))
    built.append(meta)

REDIRECTS = {"services/": "/how-it-works/", "audit/": "/operations-audit/", "questions/": "/faq/",
             "demos/": "/demo/", "contact/": "/book/", "thankyou/": "/book/"}
for src, to in REDIRECTS.items():
    os.makedirs(f"{OUT}/{src}", exist_ok=True)
    open(f"{OUT}/{src}index.html", "w").write(
        f'<!DOCTYPE html><html lang="en-GB"><head><meta charset="utf-8"><title>Twinthos</title>'
        f'<meta name="robots" content="noindex"><link rel="canonical" href="{SITE}{to}">'
        f'<meta http-equiv="refresh" content="0; url={to}"></head>'
        f'<body style="background:#050505;color:#F4F4F0;font-family:sans-serif"><a href="{to}" style="color:#F4F4F0">Continue to {to}</a></body></html>')

urls = [m["path"] for m in built if not m.get("noindex") and m["path"] != "404"]
open(f"{OUT}/sitemap.xml", "w").write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    "".join(f"<url><loc>{SITE}/{u}</loc></url>\n" for u in sorted(urls, key=lambda u: (u != "", u))) + "</urlset>\n")
print(f"built {len(built)} pages, {len(REDIRECTS)} redirects, css {len(css)}B js {len(js)}B v={VER}")
