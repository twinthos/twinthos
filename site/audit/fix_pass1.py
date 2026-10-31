#!/usr/bin/env python3
"""Fix pass 1 for the whole-site audit: metadata, redirect stubs, structured data.

Every change is idempotent and printed with its measured length so the audit
can be re-run straight after.
"""
import json, re
from pathlib import Path

ROOT = Path("/root/twinthos_live")
BASE = "https://twinthos.com"

DESC = {
    "index.html": "Twinthos runs managed digital employees that do one named job inside the software your firm already uses. Work handled, time returned.",
    "brain/index.html": "Twinthos Brain keeps what your business knows in one place: prices, policies, exceptions and history, ready for any digital employee to use.",
    "how-it-works/index.html": "Five working days, one job named and measured on your own documents, then a digital employee live in two weeks. Here is the whole process.",
    "notes/index.html": "Plain-English writing on what AI does to a small business: the job, the money, the record, and who answers for it. Every claim sourced.",
    "privacy/index.html": "How Twinthos handles your data: what we collect, where it is stored, how long we keep it, and how to ask for a copy or for deletion.",
    "terms/index.html": "The terms that govern Twinthos services: what is included, the minimum term, payment, cancellation, liability and the law that applies.",
    "workforce/index.html": "Twinthos Workforce is the always-on digital employee: it works inside your existing tools, logs every action, and escalates what matters.",
}
TITLE = {
    "brain/index.html": "Twinthos Brain: company memory that persists",
    "notes/index.html": "Twinthos Notes: AI in plain English for business",
}
ORG = {"@type": "Organization", "@id": f"{BASE}/#org", "name": "Twinthos", "url": f"{BASE}/",
       "description": "Twinthos is a managed digital-employee company. A digital employee does one named job inside the software a business already runs, with memory, permissions, an audit trail and a named human who signs off consequential actions."}
PAGES = {
    "about/index.html": ("AboutPage", "About Twinthos"),
    "book/index.html": ("ContactPage", "Book a call with Twinthos"),
    "faq/index.html": ("FAQPage", "Twinthos questions, answered"),
    "how-it-works/index.html": ("WebPage", "How Twinthos works"),
    "operations-audit/index.html": ("WebPage", "The Twinthos Operations Audit"),
    "pricing/index.html": ("WebPage", "Twinthos pricing"),
    "privacy/index.html": ("WebPage", "Privacy notice"),
    "security/index.html": ("WebPage", "Security and data handling"),
    "terms/index.html": ("WebPage", "Terms of service"),
}


def crumbs(path, name):
    return {"@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Twinthos", "item": f"{BASE}/"},
        {"@type": "ListItem", "position": 2, "name": name, "item": f"{BASE}/{path}"}]}


def faq_from(html):
    qs = []
    for m in re.finditer(r"<h2[^>]*>(.*?)</h2>\s*(?:<p[^>]*>(.*?)</p>)", html, re.S):
        q = re.sub(r"<[^>]+>", "", m.group(1)).strip()
        a = re.sub(r"<[^>]+>", "", m.group(2)).strip()
        if q.endswith("?") and 60 < len(a) < 600:
            qs.append({"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}})
    return qs[:8]


def set_meta(html, name, value):
    pat_prop = re.compile(r'(<meta property="%s" content=")[^"]*(")' % re.escape(name))
    if pat_prop.search(html):
        return pat_prop.sub(lambda m: m.group(1) + value.replace('"', "&quot;") + m.group(2), html, count=1)
    pat_name = re.compile(r'(<meta name="%s" content=")[^"]*(")' % re.escape(name))
    if pat_name.search(html):
        return pat_name.sub(lambda m: m.group(1) + value.replace('"', "&quot;") + m.group(2), html, count=1)
    return html


def main():
    changed = []

    # 0. GitHub Pages skips dotfolders without .nojekyll, which is why
    #    /.well-known/oauth-protected-resource 404s in production.
    nj = ROOT / ".nojekyll"
    if not nj.exists():
        nj.write_text("")
        changed.append("created .nojekyll so .well-known is published")

    # 1. descriptions and titles
    for rel, d in DESC.items():
        p = ROOT / rel
        h = p.read_text(encoding="utf-8")
        h = set_meta(h, "description", d)
        h = set_meta(h, "og:description", d)
        h = set_meta(h, "twitter:description", d)
        p.write_text(h, encoding="utf-8")
        changed.append(f"{rel}: description {len(d)} chars")

    for rel, t in TITLE.items():
        p = ROOT / rel
        h = p.read_text(encoding="utf-8")
        h = re.sub(r"<title>.*?</title>", f"<title>{t} | Twinthos</title>", h, count=1, flags=re.S)
        h = set_meta(h, "og:title", f"{t} | Twinthos")
        h = set_meta(h, "twitter:title", f"{t} | Twinthos")
        p.write_text(h, encoding="utf-8")
        changed.append(f"{rel}: title {len(t)} chars before suffix")

    # 2. viewport on the redirect stubs
    for rel in ["services", "contact", "demo", "demos", "audit", "questions", "thankyou"]:
        p = ROOT / rel / "index.html"
        h = p.read_text(encoding="utf-8")
        if "name=\"viewport\"" not in h:
            h = re.sub(r'(<meta charset="utf-8">)', r'\1<meta name="viewport" content="width=device-width, initial-scale=1">', h, count=1)
            p.write_text(h, encoding="utf-8")
            changed.append(f"{rel}/: viewport added")

    # 3. structured data on the pages that had none
    for rel, (kind, name) in PAGES.items():
        p = ROOT / rel
        h = p.read_text(encoding="utf-8")
        if "application/ld+json" in h:
            continue
        url = f"{BASE}/{rel.replace('index.html', '')}"
        graph = [ORG, {"@type": kind, "@id": url + "#webpage", "url": url, "name": name,
                       "inLanguage": "en-GB", "isPartOf": {"@id": f"{BASE}/#org"},
                       "breadcrumb": {"@id": url + "#breadcrumb"}}, crumbs(rel.replace("index.html", ""), name)]
        if kind == "FAQPage":
            qs = faq_from(h)
            if qs:
                graph.append({"@type": "FAQPage", "@id": url + "#faq", "mainEntity": qs})
        block = '<script type="application/ld+json">' + json.dumps({"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False, separators=(",", ":")) + "</script>"
        h = h.replace("</head>", block + "</head>", 1)
        p.write_text(h, encoding="utf-8")
        changed.append(f"{rel}: {kind} JSON-LD added" + (f" with {len(qs)} questions" if kind == "FAQPage" and qs else ""))

    print("\n".join(changed))


if __name__ == "__main__":
    main()
