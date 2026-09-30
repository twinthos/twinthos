#!/usr/bin/env python3
"""Twinthos static build. Source: _src/. Output: repo root. Run: python3 _src/build.py
PREVIEW=1 marks every page noindex (private review builds)."""
import os, re, json, glob, html, hashlib, sys
SRC = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.dirname(SRC)
SITE = "https://twinthos.com"
PREVIEW = os.environ.get("PREVIEW") == "1"
sys.path.insert(0, SRC)
import wheel

css = "".join(open(p).read() for p in sorted(glob.glob(f"{SRC}/css/*.css")))
js = open(f"{SRC}/js/tw.js").read().replace("/*GEO*/{}", wheel.geo_js())
os.makedirs(f"{OUT}/assets", exist_ok=True)
open(f"{OUT}/assets/tw.css", "w").write(css)
open(f"{OUT}/assets/tw.js", "w").write(js)
VER = hashlib.sha1((css + js).encode()).hexdigest()[:8]

fav = open(f"{OUT}/favicon.svg").read()
MARK_D = re.search(r'<path[^>]*d="([^"]+)"', fav).group(1)
MARK = f'<svg viewBox="8 8 48 48" aria-hidden="true"><path fill="currentColor" d="{MARK_D}"/></svg>'
ARROW = '<svg class="ar" viewBox="0 0 14 14" aria-hidden="true"><path d="M1 7h11M8 3l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>'
NAV = [("How it works", "/how-it-works/", "how"), ("Security", "/security/", "security"), ("About", "/about/", "about")]

PARTS = {"wheel": wheel.wheel_svg, "hero_wheel": lambda: wheel.wheel_svg("hero-svg"),
         "map_audit": lambda: wheel.map_svg("audit"), "map_managed": lambda: wheel.map_svg("managed")}

def partial(name):
    if name in PARTS:
        return PARTS[name]()
    body = open(f"{SRC}/partials/{name}.html").read()
    return re.sub(r"\{\{(\w+)\}\}", lambda x: partial(x.group(1)), body)

def layout(meta, body):
    title = meta["title"]; desc = meta["desc"]; path = meta["path"]; key = meta.get("nav", "")
    home = path == ""
    pricing = "#pricing" if home else "/pricing/"
    cur = lambda k: ' aria-current="page"' if k == key else ""
    links = "".join(f'<a href="{h}"{cur(k)}>{t}</a>' for t, h, k in NAV)
    robots = '<meta name="robots" content="noindex, nofollow">\n' if (meta.get("noindex") or PREVIEW) else ""
    ld = ""
    if home:
        ld = '<script type="application/ld+json">' + json.dumps({
            "@context": "https://schema.org", "@type": "ProfessionalService", "name": "Twinthos",
            "url": SITE + "/", "email": "hello@twinthos.com", "areaServed": "GB",
            "description": "Twinthos builds and manages recurring work across a business's existing tools. Decisions outside agreed rules go to the client's team.",
            "makesOffer": [
                {"@type": "Offer", "name": "Operations audit", "price": "999", "priceCurrency": "GBP", "description": "One-off written assessment and plan."},
                {"@type": "Offer", "name": "Managed workflow", "price": "5000", "priceCurrency": "GBP", "description": "Monthly implementation and management of one agreed workflow. Three-month minimum."}]},
            ensure_ascii=False) + '</script>'
    body = body.replace('<span class="ar">→</span>', ARROW)
    return f'''<!DOCTYPE html>
<html lang="en-GB" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(title)}</title>
<meta name="description" content="{html.escape(desc)}">
{robots}<link rel="canonical" href="{SITE}/{path}">
<meta name="theme-color" content="#F4F0E6">
<meta name="color-scheme" content="light">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Twinthos">
<meta property="og:url" content="{SITE}/{path}">
<meta property="og:title" content="{html.escape(title)}">
<meta property="og:description" content="{html.escape(desc)}">
<meta property="og:image" content="{SITE}/og.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="preload" href="/assets/fonts/InterTight-normal-400-700.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/tw.css?v={VER}">
<script>document.documentElement.classList.replace('no-js','js')</script>
<script src="/assets/tw.js?v={VER}" defer></script>
{ld}
</head>
<body class="pg-{meta.get('body', 'page')}">
<a class="skip" href="#main">Skip to content</a>
<header class="nav">
  <div class="wrap nav-in">
    <a class="brand" href="/" aria-label="Twinthos home">{MARK}<span>Twinthos</span></a>
    <a class="nav-price" href="{pricing}"{cur('pricing')}>Pricing</a>
    <nav class="nav-links" id="navLinks" aria-label="Main">{links}<a class="nav-book" href="/book/?interest=fit">Request a call</a></nav>
    <a class="btn btn-ink btn-sm nav-cta" href="/book/?interest=fit">Request a call</a>
    <button class="nav-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="navLinks"><span></span></button>
  </div>
</header>
<main id="main">
{body}
</main>
<footer class="foot">
  <div class="wrap">
    <div class="foot-grid">
      <div class="foot-brand">
        <a class="brand" href="/" aria-label="Twinthos home">{MARK}<span>Twinthos</span></a>
        <p class="foot-line">Work handled. Time returned.</p>
      </div>
      <div><h2 class="foot-h">Service</h2><ul><li><a href="/how-it-works/">How it works</a></li><li><a href="/pricing/">Pricing</a></li><li><a href="/operations-audit/">Operations audit</a></li></ul></div>
      <div><h2 class="foot-h">Company</h2><ul><li><a href="/about/">About</a></li><li><a href="/security/">Security and data</a></li><li><a href="/faq/">Questions</a></li></ul></div>
      <div><h2 class="foot-h">Start</h2><ul><li><a href="/book/?interest=fit">Request a 15-minute call</a></li><li><a href="mailto:hello@twinthos.com">hello@twinthos.com</a></li></ul></div>
    </div>
    <div class="foot-base"><span>© 2026 Twinthos</span><span><a href="/privacy/">Privacy</a> · <a href="/terms/">Terms</a></span></div>
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
             "demo/": "/#wheel", "demos/": "/#wheel", "contact/": "/book/", "thankyou/": "/book/"}
for src, to in REDIRECTS.items():
    os.makedirs(f"{OUT}/{src}", exist_ok=True)
    open(f"{OUT}/{src}index.html", "w").write(
        f'<!DOCTYPE html><html lang="en-GB"><head><meta charset="utf-8"><title>Twinthos</title>'
        f'<meta name="robots" content="noindex"><link rel="canonical" href="{SITE}{to}">'
        f'<meta http-equiv="refresh" content="0; url={to}"></head>'
        f'<body style="background:#F4F0E6;color:#161815;font-family:sans-serif"><a href="{to}">Continue</a></body></html>')

urls = [m["path"] for m in built if not m.get("noindex") and m["path"] != "404"]
open(f"{OUT}/sitemap.xml", "w").write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    "".join(f"<url><loc>{SITE}/{u}</loc></url>\n" for u in sorted(urls, key=lambda u: (u != "", u))) + "</urlset>\n")
print(f"built {len(built)} pages, {len(REDIRECTS)} redirects, css {len(css)}B js {len(js)}B v={VER} preview={PREVIEW}")
