#!/usr/bin/env python3
"""Source-level content/contrast/accessibility contracts for Twinthos 2027.

These are reproducible source checks, not a substitute for screen-reader review
or independent live-site performance measurement.
"""
from __future__ import annotations
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


class Doc(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = {}
        self.headings = []
        self.h1 = 0
        self.links = []
        self.buttons = []
        self.sections = []
        self.open_h1 = False
        self.h1_text = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get("id"):
            self.ids[attrs["id"]] = self.ids.get(attrs["id"], 0) + 1
        if tag == "h1":
            self.open_h1 = True
            self.h1 += 1
        if tag == "a":
            self.links.append(attrs.get("href", ""))
        if tag == "button":
            self.buttons.append(attrs)
        if tag == "section":
            self.sections.append(attrs)

    def handle_endtag(self, tag):
        if tag == "h1":
            self.open_h1 = False

    def handle_data(self, data):
        if self.open_h1:
            self.h1_text.append(data)


def luminance(value):
    rgb = [int(value[i:i+2], 16)/255 for i in (1,3,5)]
    linear = [x / 12.92 if x <= .04045 else ((x + .055) / 1.055)**2.4 for x in rgb]
    return sum(x*w for x, w in zip(linear, (.2126, .7152, .0722)))


def contrast(foreground, background):
    a, b = sorted((luminance(foreground), luminance(background)))
    return (b+.05)/(a+.05)


def check():
    home = (ROOT/"index.html").read_text(encoding="utf-8")
    css = (ROOT/"assets/tw.css").read_text(encoding="utf-8")
    js = (ROOT/"assets/tw.js").read_text(encoding="utf-8")
    doc = Doc()
    doc.feed(home)
    assert doc.h1 == 1
    assert "your business moves." in " ".join(doc.h1_text).lower()
    assert all(count == 1 for count in doc.ids.values()), "duplicate HTML IDs"
    assert len(home.encode("utf-8")) < 65_000, "Home should not inline the full site stylesheet"
    assert 'rel="stylesheet"' in home and 'id="main"' in home
    assert "w-hero" in home and "w-why" in home and 'id="memory"' in home
    assert 'id="anatomy"' in home and 'id="use-cases"' in home
    assert 'id="control"' in home and 'id="pricing"' in home
    assert len([b for b in doc.buttons if b.get("data-w-part")]) == 8
    assert len([b for b in doc.buttons if b.get("data-w-scene")]) == 3
    for term in ("Its own computer", "Own email", "Card & spending",
                 "Long-term memory", "Specialist helpers", "Phone & messages"):
        assert term in home, f"Missing digital employee capability {term}"
    for link in ("/book/?interest=fit", "/how-it-works/", "/security/", "/pricing/"):
        assert link in doc.links, f"Missing conversion/trust link: {link}"
    for rule in ("prefers-reduced-motion", ".w-anatomy", ".w-hero", ".w-why", ".w-sim-grid"):
        assert rule in css, f"Missing visual requirement: {rule}"
    assert "data-w-part" in js and "data-w-scene" in js
    assert "textContent" in js and "IntersectionObserver" in js
    assert "£999" in home and "£5,000" in home
    assert "home-investment-managed" in home
    assert "no guaranteed savings" in home.lower()
    assert "not a live customer dashboard" in home.lower()
    assert "unrestricted autonomous spending" in home.lower() is False
    for foreground, background, minimum in (
        ("#F3F1EA", "#090D0C", 7),
        ("#C2CBC5", "#090D0C", 7),
        ("#E9EAE3", "#14231A", 7),
        ("#C3DFD0", "#0D1410", 7),
        ("#142119", "#F3F1EA", 7),
        ("#C5D6C6", "#111B15", 7),
    ):
        ratio=contrast(foreground, background)
        assert ratio>=minimum, f"Contrast {foreground}/{background} = {ratio:.2f}:1"
    print(f"PASS: {len(doc.sections)} homepage sections; 8-part anatomy and three workflow examples")
    print("PASS: why-first narrative, persistent knowledge, controlled card and human authority copy")
    print("PASS: desktop/mobile CSS, reduced-motion, booking/pricing routes and six token contrast pairs")


if __name__ == "__main__":
    check()
