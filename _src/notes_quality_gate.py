#!/usr/bin/env python3
"""Offline editorial quality gate for published Notes. Does not assert article facts are true."""
import json
import re
import sys
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
PAGES = sorted((ROOT / "notes").glob("*/index.html"))
errors = []
assert_file = lambda path: errors.append("Missing file: " + str(path)) if not path.is_file() else None
assert_file(ROOT / "assets/notes-motion.css")
assert_file(ROOT / "assets/notes-motion.js")
if len(PAGES) != 12:
    errors.append(f"Expected 12 article pages; found {len(PAGES)}")

for page in PAGES:
    slug = page.parent.name
    data = page.read_text(encoding="utf-8")
    for required in ("notes-motion.css", "notes-motion.js", 'class="nx-verified-sources"', '<meta property="og:image"', 'name="twitter:card"'):
        if required not in data:
            errors.append(f"{slug}: missing {required}")
    for asset in ("notes-motion.css", "notes-motion.js"):
        if data.count(asset) != 1:
            errors.append(f"{slug}: expected exactly one {asset} include")
    if data.count('class="nx-verified-sources"') != 1:
        errors.append(f"{slug}: expected exactly one source notes section")
    published = re.search(r'<meta property="article:published_time" content="([^"]+)"', data)
    schema = re.search(r'"datePublished":"(\d{4}-\d{2}-\d{2})"', data)
    if not published or not schema or published.group(1)[:10] != schema.group(1):
        errors.append(f"{slug}: published date disagrees with structured data")
    if 'rel="canonical"' not in data or f"/notes/{slug}/" not in data:
        errors.append(f"{slug}: incorrect canonical")
    if not re.search(r'<section class="nx-verified-sources".*?<a href="https://', data, re.S):
        errors.append(f"{slug}: no clickable source links")
    hero = re.search(r'<figure class="nx-fig">.*?<img[^>]*src="([^"]+)"', data, re.S)
    if not hero:
        errors.append(f"{slug}: no hero image")
    else:
        relative = hero.group(1).split("?")[0].lstrip("/")
        assert_file(ROOT / relative)
        if not re.search(r'<figure class="nx-fig">.*?<img[^>]*alt="[^"]{8,}"', data, re.S):
            errors.append(f"{slug}: missing descriptive hero alt")
    for img in set(re.findall(r'/assets/notes-img/[^"\s,<>]+?\.(?:jpg|webp|png)', data)):
        assert_file(ROOT / img.lstrip("/"))
    if slug == "cost-of-an-ai-employee":
        if "£13.20" in data or "£12.71" not in data:
            errors.append("cost article: 2026 wage rate is outdated")
    if slug == "super-intelligence-si" and "/assets/notes-img/chip-1600" in data:
        errors.append("SI article: generic hero image")
    if slug == "intro-to-ai" and "/assets/notes-img/employee-desk-1600" in data:
        errors.append("intro article: generic hero image")

index = (ROOT / "notes/index.html").read_text(encoding="utf-8")
if "notes-motion.css" not in index:
    errors.append("Notes index: missing motion stylesheet")
for page in PAGES:
    if f'/notes/{page.parent.name}/' not in index:
        errors.append(f"Notes index: missing link to {page.parent.name}")


# The published editorial artwork must exist for every article, not just the
# source photographs. Catch stale thumbnails or missing social cards in CI.
COVERS = ROOT / "assets/notes-covers"
for page in PAGES:
    slug = page.parent.name
    article = page.read_text(encoding="utf-8")
    for size in (800, 1600):
        for ext in ("jpg", "webp"):
            asset = COVERS / f"{slug}-h-{size}.{ext}"
            assert_file(asset)
            if f"/assets/notes-covers/{slug}-h-{size}.{ext}" not in article:
                errors.append(f"{slug}: not using editorial {size}.{ext} cover")
    og = COVERS / f"og-{slug}.jpg"
    assert_file(og)
    if f"https://twinthos.com/assets/notes-covers/og-{slug}.jpg" not in article:
        errors.append(f"{slug}: old or missing OG image")
if "https://twinthos.com/assets/notes-covers/og-index.jpg" not in index:
    errors.append("Notes index: old social preview image")
if "assets/notes-covers/" not in index:
    errors.append("Notes index: editorial covers not linked")
assert_file(COVERS / "og-index.jpg")

if errors:
    print("\n".join(errors))
    sys.exit(1)
print(f"Notes quality gate: PASS; {len(PAGES)} articles, source links, dates, imagery and motion assets. Factual claims require independent editorial review.")
