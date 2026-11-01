#!/usr/bin/env python3
"""Browser verification of visible homepage, pricing and interaction contracts.

Runs after the static site build, using real Chromium via Playwright.
Records mobile/tablet/desktop screenshots for human review.
"""
from __future__ import annotations

import functools
import http.server
import json
import re
import threading
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
SHOTS = ROOT / "_src" / "qa-shots"


def components(value: str):
    m = re.search(r"rgba?\((\d+),\s*(\d+),\s*(\d+)", value)
    if not m:
        raise AssertionError(f"Cannot parse CSS colour: {value!r}")
    return [int(x) / 255 for x in m.groups()]


def luminance(rgb):
    parts = [x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in rgb]
    return sum(x * weight for x, weight in zip(parts, (0.2126, 0.7152, 0.0722)))


def contrast(fg, bg):
    a, b = sorted((luminance(components(fg)), luminance(components(bg))))
    return (b + 0.05) / (a + 0.05)


def test_price(page, name):
    price = page.locator(".home-investment-price > span")
    assert price.count() == 2, f"{name}: missing pricing values"
    body = page.locator(".home-investment")
    managed = page.locator(".home-investment-managed")
    assert body.count() == 1 and managed.count() == 1
    for i in (0, 1):
        item = price.nth(i)
        item.scroll_into_view_if_needed()
        assert item.is_visible(), f"{name}: price hidden"
        rect = item.bounding_box()
        assert rect and rect["height"] >= 55 and rect["width"] > 120
        fg = item.evaluate("(el) => getComputedStyle(el).color")
        background = (body if i == 0 else managed).evaluate(
            "(el) => getComputedStyle(el).backgroundColor"
        )
        ratio = contrast(fg, background)
        assert ratio >= 7, f"{name}: pricing text contrast {ratio:.2f} < 7"
        print(f"PASS {name} price {i + 1}: contrast {ratio:.1f}:1")
    labels = page.locator(".home-investment-index, .home-investment-price small, "
                          ".home-investment-details > div > span")
    for i in range(labels.count()):
        el = labels.nth(i)
        size = float(el.evaluate("(el) => parseFloat(getComputedStyle(el).fontSize)"))
        assert size >= 14, f"{name}: unreadable label {size}px"
    for item in page.locator(".home-investment-row").all():
        item.scroll_into_view_if_needed()
        assert item.is_visible(), f"{name}: hidden investment row"


def check_browser():
    SHOTS.mkdir(parents=True, exist_ok=True)
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(ROOT))
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    base = f"http://127.0.0.1:{server.server_port}"
    results = []
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True, args=["--no-sandbox"])
            for width in (390, 768, 1440):
                for path, label in (("/", "home"), ("/pricing/", "pricing")):
                    page = browser.new_page(viewport={"width": width, "height": 900},
                                            device_scale_factor=1,
                                            reduced_motion="reduce")
                    errors = []
                    page.on("pageerror", lambda error: errors.append(str(error)))
                    response = page.goto(base + path, wait_until="networkidle", timeout=30000)
                    assert response and response.ok, f"{label}/{width}: page unavailable"
                    page.screenshot(path=str(SHOTS / f"{label}-{width}.png"), full_page=True,
                                    animations="disabled")
                    dimensions = page.evaluate("""() => ({
                        width: document.documentElement.clientWidth,
                        scroll: document.documentElement.scrollWidth,
                        height: document.documentElement.scrollHeight
                    })""")
                    assert dimensions["scroll"] <= dimensions["width"] + 3, (
                        f"{label}/{width}: horizontal overflow {dimensions}"
                    )
                    assert not errors, f"{label}/{width}: JavaScript errors {errors}"
                    test_price(page, f"{label}/{width}")
                    if label == "home":
                        heading = page.locator("h1")
                        assert heading.count() == 1 and heading.is_visible()
                        button = page.locator('.home-v11 .home-primary')
                        assert button.is_visible(), f"{label}/{width}: booking CTA hidden"
                        page.locator('[data-scene="admin"]').click()
                        assert "next week" in page.locator("[data-scene-message]").inner_text()
                        page.locator('[data-scene="research"]').click()
                        assert "prospects" in page.locator("[data-scene-message]").inner_text()
                        assert page.locator("video").get_attribute("preload") == "none"
                    results.append({"page": label, "width": width, **dimensions})
                    print(f"PASS {label}/{width}: no overflow, no page errors, pricing legible")
                    page.close()
            browser.close()
    finally:
        server.shutdown()
        server.server_close()
    (SHOTS / "report.json").write_text(json.dumps(results, indent=2), encoding="utf-8")
    print(f"PASS: {len(results)} visual render checks, screenshots saved to {SHOTS}")


if __name__ == "__main__":
    check_browser()
