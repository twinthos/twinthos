#!/usr/bin/env python3
"""Verify twinthos.com live matches local build. Usage: python3 verify_live.py"""
import subprocess, hashlib, time, sys, re
ROOT='/root/twinthos_hero'
PAGES={'':'index.html','book/':'book/index.html','demo/':'demo/index.html','how-it-works/':'how-it-works/index.html',
 'pricing/':'pricing/index.html','operations-audit/':'operations-audit/index.html','security/':'security/index.html',
 'about/':'about/index.html','faq/':'faq/index.html','terms/':'terms/index.html','privacy/':'privacy/index.html',
 'services/':'services/index.html','contact/':'contact/index.html','questions/':'questions/index.html',
 'demos/':'demos/index.html','audit/':'audit/index.html','thankyou/':'thankyou/index.html'}
def get(u):
    r=subprocess.run(['curl','-s','-w','\n%{http_code}','-H','Cache-Control: no-cache',f'https://twinthos.com/{u}?cb={time.time()}'],capture_output=True)
    body,code=r.stdout.rsplit(b'\n',1); return int(code),body
ok=0; bad=[]
for u,f in PAGES.items():
    code,body=get(u); local=open(f'{ROOT}/{f}','rb').read()
    match=hashlib.md5(body).hexdigest()==hashlib.md5(local).hexdigest()
    print(f"{'OK ' if code==200 and match else 'XX '} {code} {'match' if match else 'STALE'} /{u} {len(body)}B")
    (ok:=ok+1) if code==200 and match else bad.append(u)
v=re.search(rb'tw\.css\?v=(\w+)',open(f'{ROOT}/index.html','rb').read()).group(1).decode()
for a in [f'assets/tw.css?v={v}',f'assets/tw.js?v={v}','favicon.svg','og.png','sitemap.xml','robots.txt']:
    code,body=get(a); print(f"{'OK ' if code==200 else 'XX '} {code} /{a} {len(body)}B"); 
    if code!=200: bad.append(a)
code,_=get('nope-404-check/'); print(f"{'OK ' if code==404 else 'XX '} {code} 404 page")
print('RESULT', 'PASS' if not bad else f'FAIL {bad}')
sys.exit(0 if not bad else 1)
