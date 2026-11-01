#!/usr/bin/env python3
"""Public homepage design contracts; checked during every deployment."""
from html.parser import HTMLParser
from pathlib import Path

ROOT=Path(__file__).resolve().parent.parent
class Doc(HTMLParser):
    def __init__(self):
        super().__init__(); self.h1=0; self.ids={}; self.links=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=="h1": self.h1+=1
        if a.get("id"): self.ids[a["id"]]=self.ids.get(a["id"],0)+1
        if tag=="a": self.links.append(a.get("href",""))

def check():
    h=(ROOT/"index.html").read_text(encoding="utf-8")
    css=(ROOT/"assets/experience.css").read_text(encoding="utf-8")
    js=(ROOT/"assets/experience.js").read_text(encoding="utf-8")
    doc=Doc();doc.feed(h)
    assert doc.h1==1,"exactly one H1"
    assert all(v==1 for v in doc.ids.values()),"duplicate HTML IDs"
    assert 'THE END OF' in h and 'OPERATIONAL' in h and 'DRAG.' in h
    assert "PRIVATE DESIGN PREVIEW" not in h
    assert 'name="robots" content="noindex' not in h
    assert 'rel="canonical" href="https://twinthos.com/"' in h
    assert "data-story" in h and "data-story-mode" in h
    assert h.count('data-story-step=')>=6
    assert 'data-part="card"' in h and 'data-part="memory"' in h
    for i in ("why","story","anatomy","trust","investment","contact"):
        assert ('id="'+i+'"') in h,"missing route: "+i
    for link in ("/book/?interest=fit","/book/?interest=audit","/book/?interest=managed","/privacy/","/terms/"):
        assert link in doc.links,"missing public route "+link
    assert 'href="https://github.com/' not in h
    assert "£999" in h and "£5,000" in h
    assert "long-term memory" in h.lower() and "card" in h.lower()
    assert 'prefers-reduced-motion' in css
    assert 'data-story' in js and 'data-part' in js and 'aria-pressed' in js
    assert (ROOT/"assets/experience.css").stat().st_size>15000
    print("PASS: public 2027 homepage, six-step demo, card/memory, privacy, pricing and source assets")
if __name__=="__main__":
    check()
