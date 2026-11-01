#!/usr/bin/env python3
"""Static contract checks for the generated Twinthos homepage.

Does not claim visual/browser, performance, or accessibility certification.
Run after python3 _src/build.py.
"""
from __future__ import annotations

import re
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


class Document(HTMLParser):
    def __init__(self):
        super().__init__()
        self.h1 = 0
        self.ids = {}
        self.links = []
        self.videos = []
        self.buttons = []
        self.sections = []
        self.heading_depth = 0
        self.h1_text = []
        self.inside_h1 = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get("id"):
            self.ids[attrs["id"]] = self.ids.get(attrs["id"], 0) + 1
        if tag == "h1":
            self.h1 += 1
            self.inside_h1 = True
        if tag == "a":
            self.links.append(attrs.get("href", ""))
        if tag == "video":
            self.videos.append(attrs)
        if tag == "button":
            self.buttons.append(attrs)
        if tag == "section":
            self.sections.append(attrs)
        if tag in ("h2", "h3"):
            self.heading_depth += 1

    def handle_endtag(self, tag):
        if tag == "h1":
            self.inside_h1 = False

    def handle_data(self, data):
        if self.inside_h1:
            self.h1_text.append(data)


def relative_luminance(value: str) -> float:
    v = value.lstrip("#")
    if len(v) != 6:
        raise ValueError(value)
    channels = [int(v[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    linear = [c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in channels]
    return sum(a * w for a, w in zip(linear, (0.2126, 0.7152, 0.0722)))


def contrast(a: str, b: str) -> float:
    x, y = sorted([relative_luminance(a), relative_luminance(b)])
    return (y + 0.05) / (x + 0.05)


def check():
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    css = (ROOT / "assets/tw.css").read_text(encoding="utf-8")
    js = (ROOT / "assets/tw.js").read_text(encoding="utf-8")
    src = (ROOT / "_src/pages/home.html").read_text(encoding="utf-8")
    doc = Document()
    doc.feed(html)

    assert doc.h1 == 1, f"Expected one homepage H1; found {doc.h1}"
    assert all(n == 1 for n in doc.ids.values()), "Duplicated DOM IDs"
    assert "one message." in " ".join(doc.h1_text).lower()
    assert len(html.encode("utf-8")) < 70_000, "Home HTML too large: remove inlined legacy assets"
    assert "<style>" in html and 'rel="stylesheet"' in html
    assert "/* Twinthos v8" not in html, "Full legacy CSS re-inlined into document"
    for anchor in ("/book/?interest=fit", "#experience", "#pricing", "/engineering/"):
        assert anchor in doc.links, f"Missing primary visitor route: {anchor}"
    assert len(doc.videos) == 1
    video = doc.videos[0]
    assert "autoplay" not in video and "loop" not in video
    assert video.get("preload") == "none"
    assert video.get("muted") is None and "muted" in video
    assert any(b.get("class", "").find("film-tap") >= 0 for b in doc.buttons)
    assert sum(b.get("data-scene") is not None for b in doc.buttons) == 3
    assert 'data-workbench' in html
    assert "prefers-reduced-motion:reduce" in css or "prefers-reduced-motion: reduce" in css
    assert "function playVideo()" in js
    assert "document.querySelector('.home-v11')" in js
    assert "IntersectionObserver" in js
    assert "data-scene-outcome" in html
    assert css.count("@media(max-width:600px)") >= 1
    assert "home-v11" in css and "home-workbench" in css
    assert "£999" in html and "£5,000" in html
    assert "home-investment" in html and "home-investment-managed" in html
    assert 'id="managed"' not in html, "Legacy managed pricing ID causes text invisibility"
    assert "home-ops-stage" in html and "home-questions" in html
    assert "we guarantee savings" not in html.lower()\n    assert "no guaranteed savings" in html.lower()
    assert "live business data" in html.lower()

    # These fixed pairs represent the primary text and surface tokens,
    # not a blanket guarantee about every browser-composited pixel.
    contrast_pairs = [
        ("primary ink / carbon", "#F3F2EC", "#080A09", 7.0),
        ("body copy / carbon", "#B4BAB4", "#080A09", 7.0),
        ("muted copy / panel", "#AEB8AE", "#101512", 4.5),
        ("silver accent / carbon", "#BAD4C9", "#080A09", 7.0),
        ("button dark text / porcelain", "#0A0C0A", "#F3F2EC", 7.0),
    ]
    for title, foreground, background, minimum in contrast_pairs:
        ratio = contrast(foreground, background)
        assert ratio >= minimum, f"{title} contrast {ratio:.2f}:1 below {minimum}:1"
        print(f"PASS colour: {title}: {ratio:.1f}:1")

    print(f"PASS homepage: {doc.h1} H1, {len(doc.sections)} sections, "
          f"{len(doc.buttons)} buttons, {len(html.encode('utf-8')):,} HTML bytes")
    print("PASS experience: 3 clickable examples, manual video loading, reduced-motion branch")
    print("PASS commercial content: legible editorial £999 / £5,000 funnel, scoped offer terms retained")


if __name__ == "__main__":
    check()
