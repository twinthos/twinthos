#!/usr/bin/env python3
"""Real Chromium QA: rendering, conversion flow, readability and interactions.

Screenshots are review artifacts, not a substitute for real-device Safari/
screen-reader tests or customer acceptance.
"""
from __future__ import annotations
import functools
import http.server
import json
import re
import threading
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parent.parent
SHOTS=ROOT/"_src"/"qa-shots"


def rgb(color):
    match=re.search(r"rgba?\((\d+),\s*(\d+),\s*(\d+)", color)
    if not match:
        raise AssertionError("Unsupported computed colour representation: "+repr(color))
    return [int(x)/255 for x in match.groups()]


def light(rgb_values):
    channels=[x/12.92 if x<=.04045 else ((x+.055)/1.055)**2.4 for x in rgb_values]
    return sum(x*w for x,w in zip(channels,(.2126,.7152,.0722)))


def contrast(a,b):
    lo,hi=sorted((light(rgb(a)),light(rgb(b))))
    return (hi+.05)/(lo+.05)


def test_prices(page,label):
    prices=page.locator(".home-investment-price > span")
    assert prices.count()==2,f"{label}: price visibility"
    for index in (0,1):
        item=prices.nth(index)
        item.scroll_into_view_if_needed()
        assert item.is_visible()
        box=item.bounding_box()
        assert box and box["width"]>110 and box["height"]>=55
        fg=item.evaluate("(e)=>getComputedStyle(e).color")
        panel=(page.locator(".home-investment") if index==0 else page.locator(".home-investment-managed"))
        bg=panel.evaluate("(e)=>getComputedStyle(e).backgroundColor")
        ratio=contrast(fg,bg)
        assert ratio>=7,f"{label}: price {index} has only {ratio:.2f}:1 contrast"
        print(f"PASS {label} investment {index+1}: {ratio:.1f}:1")
    for el in page.locator(".home-investment-index, .home-investment-price small, .home-investment-details>div>span").all():
        size=float(el.evaluate("(e)=>parseFloat(getComputedStyle(e).fontSize)"))
        assert size>=14,f"{label}: tiny {size}px price label"


def run():
    SHOTS.mkdir(parents=True,exist_ok=True)
    handler=functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(ROOT))
    server=http.server.ThreadingHTTPServer(("127.0.0.1",0),handler)
    thread=threading.Thread(target=server.serve_forever,daemon=True)
    thread.start()
    base=f"http://127.0.0.1:{server.server_port}"
    routes=[("/","home"),("/pricing/","pricing"),("/about/","about"),
            ("/how-it-works/","how"),("/security/","security"),
            ("/faq/","faq"),("/operations-audit/","audit"),
            ("/book/","book"),("/engineering/","engineering")]
    results=[]
    try:
        with sync_playwright() as p:
            browser=p.chromium.launch(headless=True,args=["--no-sandbox"])
            for width in (390,768,1440):
                for url,label in routes:
                    page=browser.new_page(viewport={"width":width,"height":900},
                                          device_scale_factor=1,reduced_motion="reduce")
                    errors=[]
                    page.on("pageerror",lambda e:errors.append(str(e)))
                    response=page.goto(base+url,wait_until="networkidle",timeout=45000)
                    assert response and response.ok,f"{label}/{width}: HTTP error"
                    dimensions=page.evaluate("""() => ({
                      width:document.documentElement.clientWidth,
                      scroll:document.documentElement.scrollWidth,
                      height:document.documentElement.scrollHeight
                    })""")
                    assert dimensions["scroll"]<=dimensions["width"]+3,(
                        f"{label}/{width}: horizontal overflow: {dimensions}")
                    assert not errors,f"{label}/{width}: JS errors {errors}"
                    assert page.locator("h1").count()==1
                    assert page.locator("h1").is_visible()
                    assert page.locator(".nav .brand").is_visible(), f"{label}/{width}: header brand hidden"
                    if label in ("home","pricing","book"):
                        page.screenshot(path=str(SHOTS/f"{label}-{width}-firstscreen.png"),
                                        full_page=False,animations="disabled")
                    assert page.locator('a[href="/book/?interest=fit"]').count()>=1 or label=="book"
                    if label=="home":
                        nav=page.locator(".nav").bounding_box()
                        intro=page.locator(".w-hero .w-kicker").bounding_box()
                        assert nav and intro and intro["y"]>=nav["y"]+nav["height"]+4,(
                            f"Hero overlaps fixed nav: {nav} vs {intro}")
                        assert page.locator(".w-hero .w-button").is_visible()
                        compare=page.locator("[data-drag-demo]")
                        assert compare.count()==1
                        assert compare.get_attribute("data-drag-mode")=="manual"
                        assert "checks" in page.locator("[data-drag-title]").inner_text().lower()
                        page.locator('[data-drag-mode-button="agent"]').click()
                        assert compare.get_attribute("data-drag-mode")=="agent"
                        assert page.locator('[data-drag-mode-button="agent"]').get_attribute("aria-pressed")=="true"
                        page.locator('[data-drag-step="4"]').click()
                        assert "approval" in page.locator("[data-drag-action]").inner_text().lower() or "human" in page.locator("[data-drag-action]").inner_text().lower()
                        page.locator("[data-drag-next]").click()
                        assert page.locator("[data-drag-counter]").inner_text().startswith("06")
                        page.locator('[data-drag-mode-button="manual"]').click()
                        assert compare.get_attribute("data-drag-mode")=="manual"
                        page.locator('[data-w-scene="scheduling"]').click()
                        assert "appointments" in page.locator("[data-w-message]").inner_text()
                        page.locator('[data-w-scene="research"]').click()
                        assert "prospective" in page.locator("[data-w-message]").inner_text()
                        assert page.locator('[data-w-scene="research"]').get_attribute("aria-pressed")=="true"
                        assert page.locator('[data-w-part]').count()==8
                        page.locator('[data-w-part="card"]').click()
                        assert "card" in page.locator("[data-w-title]").inner_text().lower()
                        assert "human approval" in page.locator("[data-w-limit]").inner_text().lower()
                        page.locator('[data-w-part="memory"]').click()
                        assert "memory" in page.locator("[data-w-title]").inner_text().lower()
                        assert page.locator('[data-w-part="memory"]').get_attribute("aria-pressed")=="true"
                        if width==390:
                            toggle=page.locator(".nav-toggle")
                            toggle.click()
                            assert toggle.get_attribute("aria-expanded")=="true"
                            assert page.locator(".nav-links").is_visible()
                            toggle.click()
                    if label in ("home","pricing"):
                        test_prices(page,f"{label}/{width}")
                    if label=="book":
                        assert page.locator("form[data-form]").count()==1
                        assert page.locator("input[name=email]").count()==1
                        assert page.locator("button[type=submit]").count()==1
                        # No external submission in CI.
                    if label=="security":
                        assert "card" in page.locator("main").inner_text().lower()
                        assert "memory" in page.locator("main").inner_text().lower()
                    if label=="how":
                        assert "Specialist" in page.locator("main").inner_text()
                    if label=="faq":
                        assert page.locator("details").count()>=10
                    page.screenshot(path=str(SHOTS/f"{label}-{width}.png"),full_page=True,animations="disabled")
                    results.append({"page":label,"width":width,**dimensions})
                    print(f"PASS {label}/{width}: no overflow, no errors, layout and navigation")
                    page.close()
            browser.close()
    finally:
        server.shutdown()
        server.server_close()
    (SHOTS/"report.json").write_text(json.dumps(results,indent=2),encoding="utf-8")
    print(f"PASS {len(results)} real Chromium route/viewport renders")


if __name__=="__main__":
    run()
