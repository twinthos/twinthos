#!/usr/bin/env python3
"""Browser QA for mobile navigation, real links, first paint and accessible hero."""
from __future__ import annotations
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from threading import Thread
import json
import subprocess
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parent.parent
SHOTS=ROOT/"_src"/"qa-mobile"
SHOTS.mkdir(exist_ok=True)

class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,fmt,*args):
        pass

def main():
    home=(ROOT/"index.html").read_text(encoding="utf-8")
    js=(ROOT/"assets"/"tw.js").read_text(encoding="utf-8")
    assert len(home.encode())<65000, "The homepage must remain lean and externally styled"
    assert '<link rel="stylesheet" href="/assets/tw.css' in home
    assert "/assets/gunmetal.css?v=gunmetal-20261102-v1" in home, "Missing sitewide gunmetal theme"
    gm=(ROOT/"assets"/"gunmetal.css").read_text(encoding="utf-8")
    assert "--gm-bg:#090B0E" in gm and "body.notes .nx-motion-stage" in gm
    assert 'class="rh"' in home and 'class="kn"' not in home
    assert "Pause the film" not in home and "Home hero film" not in home
    assert "kn-chip" not in home and 'id="navLinks"' in home
    assert js.count("var nav=d.querySelector('.nav')")==1,"Duplicate navigation controller"
    assert "Your business has enough tools." in home
    assert (ROOT/"_src"/"css"/"zzzzzzzzzzz-human-first.css").exists(), "Human-first design source missing"
    assert 'id="pricing"' in home
    assert 'class="rates sec"' in home and 'class="dep sec"' not in home, "Repeated sections returned"
    assert 'class="rh-bottom"' not in home and 'class="rh-evidence"' not in home, "Extra badge or navigation clutter"
    assert '£999' in home and '£5,000' in home and "three-month minimum" in home
    assert 'class="rh-composition rh-compare"' in home and 'class="rh-system"' not in home
    assert '.rh-composition:not(.rh-compare){display:none!important}' in home, "Critical protection from obsolete circular hero missing"
    css=(ROOT/"assets"/"tw.css").read_text(encoding="utf-8")
    assert 'body.pg-home .rh-system-stage' in css and 'body.pg-home .rh-compare * {animation:none!important}' in css, "Orbit guard missing from published CSS"
    assert home.count('class="rh-compare-row"') == 3
    assert 'class="plain-define"' in home, "Missing simple explanation of digital employee"
    assert "Depends on your integrations" not in home and "approved inbox or trigger" not in home, "Outdated technical copy on homepage"
    assert "d.querySelector(\'.rh-primary\')" in js, "Sticky booking must watch the current hero CTA"
    assert 'class="journey-rail"' in home and 'class="kit-lines"' in home, "Editorial workflow sections missing"
    assert 'class="vs-t"' not in home and 'class="rh-feature-card"' not in home and 'class="kit-grid"' not in home, "Retired boxed layout returned"
    assert home.count('class="journey-step"') == 2 and home.count('class="journey-step journey-decision"') == 1, "Workflow missing stages"
    assert "Example only. We agree what it can do" in home
    assert (ROOT/"_src"/"css"/"zzzzzz-cinematic.css").exists(), "Editorial style source missing"
    assert all(f'id="{i}"' in home for i in ("why","employee","industries","pricing"))
    assert (ROOT/"book"/"index.html").exists()
    assert (ROOT/"security"/"index.html").exists()
    assert (ROOT/"pricing"/"index.html").exists()
    subprocess.run(["node","--check",str(ROOT/"assets"/"tw.js")],check=True)

    server=ThreadingHTTPServer(("127.0.0.1",0),partial(Quiet,directory=str(ROOT)))
    thread=Thread(target=server.serve_forever,daemon=True)
    thread.start()
    base=f"http://127.0.0.1:{server.server_port}"
    results=[]
    try:
      with sync_playwright() as p:
        browser=p.chromium.launch(headless=True,args=["--no-sandbox"])
        for width in (320,375,390,768,1024,1440):
          page=browser.new_page(viewport={"width":width,"height":812},device_scale_factor=1,reduced_motion="reduce")
          errors=[]
          page.on("pageerror",lambda e:errors.append(str(e)))
          response=page.goto(base+"/",wait_until="domcontentloaded",timeout=30000)
          assert response.status==200
          assert page.locator("#rh-title").is_visible(),f"{width}: hero must render immediately"
          assert page.locator(".rh-primary").is_visible(),f"{width}: hero CTA missing"
          assert page.locator(".rh-compare").is_visible(),f"{width}: comparison card missing"
          assert page.evaluate("getComputedStyle(document.body).backgroundColor")=="rgb(9, 11, 14)",f"{width}: homepage dark background failed"
          assert page.evaluate("getComputedStyle(document.querySelector('.rh-compare')).animationName")=="none",f"{width}: retired animation returned"
          definition=page.locator(".plain-define")
          assert definition.is_visible(),f"{width}: digital employee definition missing"
          definition.locator("summary").click()
          assert definition.get_attribute("open") is not None,f"{width}: definition did not open"
          definition.locator("summary").click()
          assert page.locator(".rh-compare-row").count()==3
          assert page.locator(".rh-system-stage").count()==0
          assert page.locator(".journey-rail .journey-step").count()==3
          assert page.locator(".kit-lines li").count()==4
          assert page.locator(".rh-links a").count()==0, "Duplicate navigation returned"
          dims=page.evaluate("""() => ({
            viewport:document.documentElement.clientWidth,
            scroll:document.documentElement.scrollWidth,
            htmlBytes:document.documentElement.outerHTML.length
          })""")
          assert dims["scroll"]<=dims["viewport"]+3,f"{width}: overflow {dims}"
          assert not errors,f"{width}: JS errors {errors}"
          # Test the actual visible links and clickability, rather than just href attributes.
          page.locator('.rh-secondary[href="#why"]').click()
          assert page.evaluate("location.hash")=="#why",f"{width}: problem CTA failed"
          page.locator("#employee").scroll_into_view_if_needed()
          assert page.locator("#employee").is_visible(),f"{width}: employee section hidden"
          (page.locator('.nav-price[href="#pricing"]') if width<=900 else page.locator('.nav-links a[href="#pricing"]')).click()
          assert page.evaluate("location.hash")=="#pricing",f"{width}: pricing navigation failed"
          page.evaluate("window.scrollTo(0,0)")
          if width<=900:
            toggle=page.locator(".nav-toggle")
            toggle.click()
            assert toggle.get_attribute("aria-expanded")=="true",f"{width}: menu did not open"
            assert page.locator("#navLinks").is_visible(),f"{width}: mobile menu hidden"
            assert page.locator("#navLinks .nav-book").is_visible(),f"{width}: mobile booking link hidden"
            menu_link=page.locator('#navLinks a[href="#industries"]')
            menu_link.click()
            assert page.evaluate("location.hash")=="#industries",f"{width}: mobile nav anchor failed"
            assert toggle.get_attribute("aria-expanded")=="false",f"{width}: menu did not close"
          else:
            assert page.locator('.nav-links a[href="#industries"]').is_visible()
            assert not page.locator(".nav-links .nav-book").is_visible(),f"{width}: duplicate booking link"
            assert page.locator(".nav-cta").is_visible()
          # Ensure the primary booking CTA takes a visitor to a real page.
          page.locator(".rh-primary").click()
          page.wait_for_url("**/book/?interest=fit",timeout=10000)
          assert page.locator("form[data-form]").is_visible(),f"{width}: booking page missing"
          assert not errors,f"{width}: JS errors on booking {errors}"
          page.goto(base+"/",wait_until="networkidle")
          page.screenshot(path=str(SHOTS/f"home-{width}.png"),full_page=False,animations="disabled")
          if width in (320,390,1440):
            card=page.locator(".rh-compare")
            card.scroll_into_view_if_needed()
            bounds=card.bounding_box()
            assert bounds and bounds["x"] >= -2 and bounds["x"]+bounds["width"] <= width+2, f"{width}: clipped comparison {bounds}"
            page.screenshot(path=str(SHOTS/f"compare-{width}.png"),full_page=False,animations="disabled")
          if width in (320,390,1440):
            page.locator(".journey-rail").scroll_into_view_if_needed()
            assert page.locator(".journey-rail").is_visible()
            page.screenshot(path=str(SHOTS/f"journey-{width}.png"),full_page=False,animations="disabled")
          results.append({"width":width,**dims,"jsErrors":len(errors)})
          print(f"PASS {width}px: visible first screen, hero CTA, pricing link, mobile menu, booking CTA, no overflow or JS errors")
          page.close()
        browser.close()
    finally:
      server.shutdown()
      server.server_close()
    (SHOTS/"summary.json").write_text(json.dumps(results,indent=2))
    print("PASS: 6 viewport tests, first paint, real navigation and conversion links")

if __name__=="__main__":
    main()
