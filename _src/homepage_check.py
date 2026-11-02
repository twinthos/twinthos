#!/usr/bin/env python3
"""Homepage source contracts for Quiet Authority; run on every deploy."""
from html.parser import HTMLParser
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
class Doc(HTMLParser):
 def __init__(self):
  super().__init__();self.h1=0;self.ids={};self.links=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=="h1":self.h1+=1
  if a.get("id"):self.ids[a["id"]]=self.ids.get(a["id"],0)+1
  if tag=="a":self.links.append(a.get("href",""))
def check():
 html=(ROOT/"index.html").read_text(encoding="utf-8")
 css=(ROOT/"assets/experience.css").read_text(encoding="utf-8")
 js=(ROOT/"assets/experience.js").read_text(encoding="utf-8")
 doc=Doc();doc.feed(html)
 assert doc.h1==1 and all(x==1 for x in doc.ids.values()),"heading or ID semantics"
 assert "People should not" in html and "operational drag" in html.lower(),"belief and problem"
 assert "ILLUSTRATIVE" in html and "NOT A CUSTOMER CASE STUDY" in html,"honest demonstration disclosure"
 assert html.count('data-story-step=')==6,"six-stage workflow"
 for key in ("why","story","anatomy","trust","investment","contact"):
  assert ('id="'+key+'"') in html,"missing section "+key
 for link in ("/book/?interest=fit","/book/?interest=audit","/book/?interest=managed","/security/","/privacy/","/terms/"):
  assert link in doc.links,"missing route "+link
 assert "£999" in html and "£5,000" in html and "£15,000" in html,"commercial terms"
 assert "Own computer" not in html or "computer" in html.lower()
 assert "Purchasing." in html and "memory" in html.lower(),"real operator details"
 assert 'href="https://github.com/' not in html,"no repo links on home"
 assert "data-story-mode" in js and "data-story-step" in js and "aria-pressed" in js,"interactive comparison"
 assert "prefers-reduced-motion" in css,"accessible motion"
 assert "capability-grid" in css and "investment-grid" in css,"source styling"
 assert (ROOT/"assets/experience.css").stat().st_size>12000,"stylesheet unexpectedly empty"
 print("PASS: Quiet Authority public homepage; design, claims, prices, navigation, interaction")
if __name__=="__main__":check()
