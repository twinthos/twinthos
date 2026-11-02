#!/usr/bin/env python3
"""Real Chromium smoke test for Notes index, article imagery and scroll visuals."""
from __future__ import annotations
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
import json
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
SHOTS=ROOT/"_src"/"qa-mobile"
SHOTS.mkdir(parents=True,exist_ok=True)
CASES=[
    ("/notes/","index"),
    ("/notes/the-company-brain/","company-brain"),
    ("/notes/small-businesses-already-hired-ai/","survey"),
    ("/notes/cost-of-an-ai-employee/","cost"),
    ("/notes/intro-to-ai/","intro"),
    ("/notes/super-intelligence-si/","si"),
]
class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args):
        pass

def main():
    server=ThreadingHTTPServer(("127.0.0.1",0),partial(Quiet,directory=str(ROOT)))
    Thread(target=server.serve_forever,daemon=True).start()
    base=f"http://127.0.0.1:{server.server_port}"
    results=[]
    try:
        with sync_playwright() as p:
            browser=p.chromium.launch(headless=True,args=["--no-sandbox"])
            for width in (390,1440):
                page=browser.new_page(viewport={"width":width,"height":900},device_scale_factor=1,reduced_motion="reduce")
                errs=[]
                page.on("pageerror",lambda exc: errs.append(str(exc)))
                for route,label in CASES:
                    errs.clear()
                    response=page.goto(base+route,wait_until="networkidle",timeout=30000)
                    assert response and response.status==200,(label,"status")
                    assert page.locator("h1").is_visible(),(label,width,"heading")
                    scroll=page.evaluate("document.documentElement.scrollWidth")
                    viewport=page.evaluate("document.documentElement.clientWidth")
                    assert scroll<=viewport+3,(label,width,"overflow",scroll,viewport)
                    assert not errs,(label,width,"JS errors",errs)
                    if label=="index":
                        assert page.locator(".nx-card").count()>=10,(label,"card count")
                        assert page.locator('.nx-latest-img img').evaluate("(x)=>x.complete&&x.naturalWidth>0"),(label,"featured art")
                    else:
                        stage=page.locator(".nx-motion-stage")
                        assert stage.count()==1,(label,"visual infographic absent")
                        assert page.locator(".nx-hero-hook strong").is_visible(),(label,"art headline absent")
                        assert page.locator("article .nx-fig img").evaluate("(x)=>x.complete&&x.naturalWidth>=800"),(label,"hero image broken")
                        assert page.locator(".nx-verified-sources a[href^='https://']").count()>=1,(label,"sources")
                        stage.scroll_into_view_if_needed()
                        assert stage.is_visible(),(label,"scroll visual hidden")
                        assert page.locator(".nx-motion-source a").count()==1,(label,"graphic source")
                        if label=="survey":
                            assert page.locator(".nx-motion-track").count()==4,(label,"measured chart missing")
                            assert page.locator(".nx-motion-value").all_text_contents()==["53%","40%","75%","65%"],(label,"survey numbers")
                        if label=="cost":
                            assert page.locator("body").inner_text().find("£12.71")!=-1,(label,"2026 wage correction absent")
                        stage.screenshot(path=str(SHOTS/f"notes-chart-{label}-{width}.png"),animations="disabled")
                    if label in ("index","company-brain","survey"):
                        page.screenshot(path=str(SHOTS/f"notes-{label}-{width}.png"),animations="disabled",full_page=False)
                    results.append({"path":route,"viewport":width,"jsErrors":len(errs),"horizontalOverflow":False})
                    print(f"PASS Notes {label} at {width}px: art, text, infographic, source links, no overflow")
                page.close()
            browser.close()
    finally:
        server.shutdown()
        server.server_close()
    (SHOTS/"notes-summary.json").write_text(json.dumps(results,indent=2))
    print(f"PASS: {len(results)} Notes browser journeys across 390px and 1440px")

if __name__=="__main__":
    main()
