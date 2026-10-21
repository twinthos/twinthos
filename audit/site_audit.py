#!/usr/bin/env python3
"""Whole-site audit for twinthos_live.

Reads the built site on disk and, when --live is passed, checks the deployed
copy too. Emits JSON plus a markdown findings table. Every finding carries the
file, the evidence string and a severity: P0 (broken/lying), P1 (hurts money or
trust), P2 (hygiene).

Usage: python3 audit/site_audit.py [--live] [--out audit/site-audit.json]
"""
import json, os, re, subprocess, sys, urllib.request, urllib.error
from pathlib import Path
from html.parser import HTMLParser

ROOT = Path("/root/twinthos_live")
BASE = "https://twinthos.com"
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124 Safari/537.36"
findings = []


def add(sev, page, check, evidence, fix):
    findings.append({"severity": sev, "page": page, "check": check, "evidence": evidence[:300], "fix": fix})


class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.title = ""; self._in_title = False
        self.metas = {}; self.links = []; self.imgs = []; self.scripts = []; self.styles = []
        self.h = {"h1": [], "h2": [], "h3": []}; self._h = None
        self.text = []; self.forms = 0; self.inputs = []; self.labels = 0
        self.ld = []; self._in_ld = False; self._ldbuf = ""
        self.lang = None; self.canonical = None; self.robots = None; self.div_depth = 0
        self.anchors = []; self._a = None; self.buttons = 0; self.iframes = 0

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "html": self.lang = a.get("lang")
        if tag == "title": self._in_title = True
        if tag == "meta":
            k = (a.get("name") or a.get("property") or "").lower()
            if k: self.metas[k] = a.get("content", "")
            if k == "robots": self.robots = a.get("content", "")
        if tag == "link":
            rel = (a.get("rel") or "").lower(); href = a.get("href", "")
            self.links.append({"rel": rel, "href": href})
            if rel == "canonical": self.canonical = href
            if rel == "stylesheet": self.styles.append(href)
        if tag == "script":
            if a.get("type") == "application/ld+json":
                self._in_ld = True; self._ldbuf = ""
            elif a.get("src"): self.scripts.append(a["src"])
        if tag == "img": self.imgs.append({"src": a.get("src", ""), "alt": a.get("alt"), "loading": a.get("loading"), "w": a.get("width"), "h": a.get("height")})
        if tag in self.h: self._h = tag
        if tag == "a":
            self.anchors.append({"href": a.get("href", ""), "text": ""}); self._a = self.anchors[-1]
        if tag == "form": self.forms += 1
        if tag in ("input", "select", "textarea"):
            self.inputs.append({"type": a.get("type", tag), "name": a.get("name", ""), "aria": a.get("aria-label")})
        if tag == "label": self.labels += 1
        if tag == "button": self.buttons += 1
        if tag == "iframe": self.iframes += 1

    def handle_endtag(self, tag):
        if tag == "title": self._in_title = False
        if tag in self.h and self._h == tag: self._h = None
        if tag == "a": self._a = None
        if tag == "script" and self._in_ld:
            self._in_ld = False
            try: self.ld.append(json.loads(self._ldbuf))
            except Exception: self.ld.append({"__invalid__": self._ldbuf[:200]})

    def handle_data(self, d):
        if self._in_title: self.title += d
        if self._in_ld: self._ldbuf += d
        if self._h: self.h[self._h].append(d.strip())
        if self._a is not None: self._a["text"] += d.strip()
        if d.strip(): self.text.append(d.strip())


def ld_types(obj, out):
    if isinstance(obj, dict):
        t = obj.get("@type")
        if isinstance(t, str): out.add(t)
        elif isinstance(t, list): out.update(t)
        for v in obj.values(): ld_types(v, out)
    elif isinstance(obj, list):
        for v in obj: ld_types(v, out)
    return out


def head_requests(url):
    req = urllib.request.Request(url, method="GET", headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            body = r.read()
            return r.status, dict(r.headers), body
    except urllib.error.HTTPError as e:
        return e.code, dict(e.headers), b""
    except Exception as e:
        return 0, {"error": str(e)}, b""


def main():
    live = "--live" in sys.argv
    out_path = "audit/site-audit.json"
    for a in sys.argv[1:]:
        if a.startswith("--out="): out_path = a.split("=", 1)[1]

    pages = sorted(p for p in ROOT.rglob("index.html") if "node_modules" not in str(p) and "/_src/" not in str(p))
    parsed = {}
    all_internal_targets = set()

    for p in pages:
        rel = "/" + str(p.parent.relative_to(ROOT)).replace("\\", "/").strip(".")
        rel = rel if rel != "/." else "/"
        url_path = "/" if rel == "/." else re.sub(r"/$", "/", rel)
        src = p.read_text(encoding="utf-8", errors="replace")
        pg = Page(); pg.feed(src)
        stub = bool(re.search(r'http-equiv=["\']refresh', src, re.I)) or "noindex" in (pg.robots or "")
        parsed[url_path] = (p, pg, src, stub)
        for an in pg.anchors:
            h = an["href"]
            if h.startswith("/") and not h.startswith("//"):
                all_internal_targets.add(h.split("#")[0].split("?")[0])

    # ---------- per page ----------
    titles, descs = {}, {}
    for path, (p, pg, src, stub) in parsed.items():
        name = str(p.relative_to(ROOT))
        if stub:
            if "noindex" not in (pg.robots or ""):
                add("P0", name, "redirect stub indexable", "no robots noindex on a redirect stub", "add noindex,follow")
            if not pg.canonical:
                add("P1", name, "canonical", "redirect stub has no canonical", "point at the destination")
            if not pg.metas.get("viewport"):
                add("P1", name, "viewport", "missing", "add viewport meta")
            if not re.search(r'<a [^>]*href="/(?!' + re.escape(path.strip("/") or "x") + r')', src):
                add("P2", name, "no fallback link", "redirect stub has no visible link", "add one for people who block meta refresh")
            continue
        t = pg.title.strip()
        t_core = re.sub(r"\s*[|·—-]\s*Twinthos\s*$", "", t)
        d = (pg.metas.get("description") or "").strip()
        titles.setdefault(t, []).append(path); descs.setdefault(d, []).append(path)

        if not t: add("P0", name, "title", "missing <title>", "add a title")
        elif len(t_core) > 62: add("P2", name, "title length", f"{len(t_core)} chars before the suffix: {t_core[:80]}", "cut to 62 characters")
        if not d: add("P1", name, "meta description", "missing", "add 120-155 char description")
        elif not (100 <= len(d) <= 165): add("P2", name, "description length", f"{len(d)} chars", "aim 120-155")
        if not pg.lang: add("P1", name, "html lang", "missing lang attribute", 'add lang="en-GB"')
        if not pg.canonical: add("P1", name, "canonical", "missing", "add rel=canonical")
        if len(pg.h["h1"]) != 1: add("P1", name, "h1 count", f"{len(pg.h['h1'])} h1: {pg.h['h1'][:2]}", "exactly one h1")
        words = len(" ".join(pg.text).split())
        if words < 120 and path not in ("/thankyou/",): add("P2", name, "thin page", f"{words} words", "add substantiating copy")
        for need in ("og:title", "og:description", "og:image"):
            if not pg.metas.get(need): add("P1", name, f"{need}", "missing", "add the tag")
        if not pg.metas.get("twitter:card"): add("P2", name, "twitter:card", "missing", "summary_large_image")
        types = set()
        for block in pg.ld: ld_types(block, types)
        if not types: add("P2", name, "structured data", "no JSON-LD", "add Article/Organization/FAQPage as fits")
        if "__invalid__" in json.dumps(pg.ld)[:400]: add("P0", name, "structured data", "invalid JSON-LD", "fix JSON")
        for im in pg.imgs:
            if im["alt"] is None: add("P1", name, "image alt", im["src"][:80], 'add alt="" or a description')
            if not im.get("w") or not im.get("h"): add("P2", name, "image dimensions", im["src"][:80], "add width/height to stop layout shift")
        if pg.forms:
            if pg.labels == 0 and not any(i["aria"] for i in pg.inputs):
                add("P1", name, "form labels", f"{len(pg.inputs)} inputs, 0 labels", "label every input")
        if not pg.metas.get("viewport"): add("P1", name, "viewport", "missing", "add viewport meta")

    for t, ps in titles.items():
        if t and len(ps) > 1: add("P1", ps[0], "duplicate title", f"shared by {ps}", "unique titles")
    for dsc, ps in descs.items():
        if dsc and len(ps) > 1: add("P1", ps[0], "duplicate description", f"shared by {ps}", "unique descriptions")

    # ---------- internal links ----------
    files = {"/" + str(p.relative_to(ROOT)).replace("\\", "/") for p in ROOT.rglob("*") if p.is_file()}
    dirs = {"/" + str(p.relative_to(ROOT)).replace("\\", "/").rstrip("/") + "/" for p in ROOT.rglob("index.html")}
    for path, (p, pg, src, stub) in parsed.items():
        for an in pg.anchors:
            h = an["href"]
            if not h or h.startswith(("http", "mailto:", "tel:", "#", "//")): continue
            target = h.split("#")[0].split("?")[0]
            if not target: continue
            cands = {target, target.rstrip("/"), target.rstrip("/") + "/", target.rstrip("/") + "/index.html"}
            if not (cands & files) and not (cands & dirs):
                add("P0", str(p.relative_to(ROOT)), "broken internal link", h, "fix or remove")

    # ---------- site level ----------
    sm = (ROOT / "sitemap.xml")
    if not sm.exists(): add("P0", "sitemap.xml", "sitemap", "missing", "generate")
    else:
        locs = re.findall(r"<loc>([^<]+)</loc>", sm.read_text())
        sm_paths = {re.sub(r"^https?://[^/]+", "", u).rstrip("/") + "/" for u in locs}
        for path, (p_, pg_, src_, stub_) in parsed.items():
            if stub_:
                continue
            if path.rstrip("/") + "/" not in sm_paths:
                add("P1", "sitemap.xml", "not in sitemap", path, "add the URL")
        for sp in sm_paths:
            if sp not in parsed and not (ROOT / sp.strip("/")).exists():
                add("P1", "sitemap.xml", "sitemap lists a missing page", sp, "remove from sitemap")

    # orphan pages: no internal link points at them
    linked = {t.rstrip("/") + "/" for t in all_internal_targets}
    for path, (p, pg, src, stub) in parsed.items():
        if stub:
            continue
        if path != "/" and (path.rstrip("/") + "/") not in linked:
            add("P2", str(parsed[path][0].relative_to(ROOT)), "orphan page", "no internal link points here", "link it from nav or a hub")

    for f, need in (("robots.txt", True), ("llms.txt", True), ("404.html", True), ("favicon.ico", False)):
        if not (ROOT / f).exists() and need:
            add("P1", f, "missing file", f, "add it")

    # ---------- live ----------
    if live:
        for probe in ["/", "/pricing/", "/notes/", "/robots.txt", "/sitemap.xml", "/llms.txt", "/notes/feed.xml",
                      "/ai-catalog.json", "/.well-known/oauth-protected-resource", "/this-does-not-exist/"]:
            code, hdrs, body = head_requests(BASE + probe)
            if probe == "/this-does-not-exist/" and code == 200:
                add("P1", probe, "soft 404", "unknown URL returns 200", "return a real 404")
            elif probe != "/this-does-not-exist/" and code != 200:
                add("P0", probe, "live status", str(code), "check deployment")
            if probe == "/":
                for h, want in (("Strict-Transport-Security", None), ("Content-Security-Policy", None),
                                ("X-Content-Type-Options", "nosniff"), ("Referrer-Policy", None),
                                ("Permissions-Policy", None), ("X-Frame-Options", None)):
                    if h not in hdrs: add("P1", "live headers", f"missing {h}", "; ".join(hdrs)[:200], "add the header")
                if "server" in {k.lower() for k in hdrs}: pass
        for alt in ["http://twinthos.com/", "https://www.twinthos.com/"]:
            code, hdrs, _ = head_requests(alt)
            if code != 200: add("P1", alt, "host variant", f"status {code} {hdrs.get('error','')[:80]}", "redirect www and http to https://twinthos.com")
            elif "Location" not in hdrs: add("P1", alt, "host variant", "200 with no redirect, duplicate host", "add a 301")

    findings.sort(key=lambda f: (f["severity"], f["check"], f["page"]))
    counts = {}
    for f in findings: counts[f["severity"]] = counts.get(f["severity"], 0) + 1
    Path(out_path).write_text(json.dumps({"pages": len(parsed), "counts": counts, "findings": findings}, indent=1, ensure_ascii=False))
    print(json.dumps({"pages": len(parsed), "counts": counts}, indent=1))
    for f in findings:
        if f["severity"] in ("P0", "P1"):
            print(f'{f["severity"]} {f["page"]:44} {f["check"]:32} {f["evidence"][:90]}')


if __name__ == "__main__":
    main()
