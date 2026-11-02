#!/usr/bin/env python3
"""Produce publication-ready, article-specific editorial covers for twinthos.com/notes.

Uses the existing licensed/site-owned AI-generated source photography and builds
new 16:9 compositions with deliberate article hooks. The underlying photographs
are retained as source material, not passed off as newly generated photos.
Outputs: 12 x 800/1600px JPEG/WebP and 12 Open Graph previews plus index preview.
Updates actual published index/article HTML paths so browsers request the new art.
Deterministic and idempotent; intended for the GitHub Actions publishing run.
"""
from __future__ import annotations
from pathlib import Path
from PIL import Image, ImageOps, ImageEnhance, ImageDraw, ImageFont
import re

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets/notes-img"
DEST = ROOT / "assets/notes-covers"
DEST.mkdir(parents=True, exist_ok=True)

# Hooks are editorial summaries/questions, NOT manufactured performance claims.
ARTICLES = [
    ("intro-to-ai", "THE STARTING POINT", ["WHAT AI", "ACTUALLY", "DOES"], "AI EXPLAINED"),
    ("what-an-ai-agent-actually-does", "BEYOND THE CHAT", ["FROM PROMPT", "TO ACTION"], "AI AGENTS"),
    ("digital-employee-vs-chatbot", "A DIFFERENT JOB", ["CHATBOT OR", "DIGITAL", "EMPLOYEE?"], "COMPARISON"),
    ("digital-employee-cost", "TRUE COST", ["THE REAL", "COST OF AN", "AI EMPLOYEE"], "ECONOMICS"),
    ("questions-to-ask-managed-ai-agent", "BUYER'S CHECKLIST", ["19 QUESTIONS", "BEFORE YOU", "BUY"], "DUE DILIGENCE"),
    ("cost-of-an-ai-employee", "COST COMPARISON", ["HUMAN OR", "DIGITAL", "EMPLOYEE?"], "ECONOMICS"),
    ("why-ai-automations-fail", "WHY PROJECTS BREAK", ["WHY AI", "WORKFLOWS", "FAIL"], "RELIABILITY"),
    ("small-businesses-already-hired-ai", "SMALL BUSINESSES", ["WHO IS", "HIRING AI", "ALREADY?"], "ADOPTION"),
    ("the-company-brain", "ONE CUSTOMER / TWO ANSWERS", ["WHO KNOWS", "WHAT'S", "TRUE?"], "COMPANY MEMORY"),
    ("super-intelligence-si", "WHAT THE TERM MEANS", ["WHAT IS", "SUPER-", "INTELLIGENCE?"], "AI RESEARCH"),
    ("atm-and-bank-tellers", "THE AUTOMATION LESSON", ["DID ATMS", "REPLACE", "TELLERS?"], "HISTORY"),
    ("the-2-dollar-ai-that-answers-the-phone", "CHECK THE MATH", ["A $2 AI", "PHONE CALL?"], "UNIT ECONOMICS"),
]

def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    possibilities = (
        ["/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
         "/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf"]
        if bold else
        ["/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
         "/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf"]
    )
    for path in possibilities:
        if Path(path).is_file():
            return ImageFont.truetype(path, size)
    raise FileNotFoundError("Need an installed sans font; no fallback to unreadable bitmap.")

def editorial_cover(src: Image.Image, width: int, height: int, hook: list[str],
                    kicker: str, topic: str, number: int) -> Image.Image:
    s = width / 1600
    # No fake UIs or metrics: genuine article-specific source photography.
    stage = Image.new("RGB", (width, height), (12, 14, 16))
    art_width = round(width * .71)
    photo = ImageOps.fit(src, (art_width, height), method=Image.Resampling.LANCZOS,
                         centering=(.51, .5)).convert("RGB")
    photo = ImageEnhance.Color(photo).enhance(.72)
    photo = ImageEnhance.Contrast(photo).enhance(1.13)
    photo = ImageEnhance.Brightness(photo).enhance(.86)
    stage.paste(photo, (width - art_width, 0))
    # Darken imagery behind the art-directed type without dirty overlays.
    shade = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shade)
    for x in range(width):
        t = x / width
        if t < .32: alpha = 247
        elif t < .62: alpha = round(247 * (1 - ((t-.32)/.30)**1.3)) + 22
        else: alpha = 20
        sd.line((x, 0, x, height), fill=(7, 9, 11, min(247, int(alpha))))
    stage = Image.alpha_composite(stage.convert("RGBA"), shade).convert("RGB")
    d = ImageDraw.Draw(stage)
    left = round(84*s)
    d.text((left, round(66*s)), "TWINTHOS", fill=(247, 246, 240),
           font=font(round(24*s), True), stroke_width=0)
    d.text((left, round(116*s)), "NOTES   /   "+f"{number:02d}",
           fill=(190, 194, 193), font=font(round(17*s)))
    d.line((left, round(161*s), round(790*s), round(161*s)), fill=(125, 133, 137), width=max(1,round(s)))
    d.text((left, round(210*s)), kicker, fill=(210, 213, 210), font=font(round(18*s)))
    size = round(84*s)
    max_width = round(775*s)
    for proposed in range(size, round(53*s), -max(1,round(2*s))):
        f = font(proposed, True)
        if max(d.textbbox((0,0), txt, font=f)[2] for txt in hook) < max_width:
            size = proposed
            break
    main_font = font(size, True)
    top = round(315*s)
    line_height = round(size*1.21)
    for i, line in enumerate(hook):
        d.text((left, top+i*line_height), line, font=main_font,
               fill=(249, 249, 243), stroke_width=0)
    fy = height-round(110*s)
    d.line((left, fy, round(790*s), fy), fill=(127, 134, 136), width=max(1,round(s)))
    d.text((left, fy+round(26*s)), topic+"   /   EDITORIAL GUIDE",
           font=font(round(17*s)), fill=(205, 209, 207))
    return stage

def update_article(path: Path, slug: str) -> None:
    doc = path.read_text(encoding="utf-8")
    prefix_old = f"/assets/notes-img/{slug}-h-"
    prefix_new = f"/assets/notes-covers/{slug}-h-"
    for size in (800,1600):
        for ext in ("jpg","webp"):
            doc = doc.replace(f"{prefix_old}{size}.{ext}", f"{prefix_new}{size}.{ext}")
    # Only replace old OG URLs for the current article, not other in-article art.
    og = f"https://twinthos.com/assets/notes-covers/og-{slug}.jpg"
    doc = re.sub(r"https://twinthos\.com/assets/notes-img/[a-z0-9-]+\.jpg", og, doc)
    doc = doc.replace('<meta property="og:image:width" content="1600">', '<meta property="og:image:width" content="1200">')
    doc = doc.replace('<meta property="og:image:height" content="900">', '<meta property="og:image:height" content="630">')
    if f"/assets/notes-covers/{slug}-h-1600.jpg" not in doc:
        raise AssertionError(f"{slug}: article hero was not migrated")
    if f"/assets/notes-covers/og-{slug}.jpg" not in doc:
        raise AssertionError(f"{slug}: social image was not migrated")
    path.write_text(doc, encoding="utf-8")

def main() -> None:
    index = ROOT / "notes/index.html"
    listing = index.read_text(encoding="utf-8")
    for i, (slug, kicker, hook, topic) in enumerate(ARTICLES, 1):
        photo = SOURCE / f"{slug}-h-1600.jpg"
        if not photo.is_file():
            raise FileNotFoundError(f"Missing original photo: {photo}")
        with Image.open(photo) as raw:
            original = raw.convert("RGB")
        high = editorial_cover(original,1600,900,hook,kicker,topic,i)
        low = high.resize((800,450),Image.Resampling.LANCZOS)
        high.save(DEST/f"{slug}-h-1600.jpg",quality=88,optimize=True,subsampling=0)
        low.save(DEST/f"{slug}-h-800.jpg",quality=85,optimize=True,subsampling=0)
        high.save(DEST/f"{slug}-h-1600.webp",quality=83,method=6)
        low.save(DEST/f"{slug}-h-800.webp",quality=80,method=6)
        og = editorial_cover(original,1200,630,hook,kicker,topic,i)
        og.save(DEST/f"og-{slug}.jpg",quality=87,optimize=True)
        before = listing
        for size in (800,1600):
            for ext in ("jpg","webp"):
                listing=listing.replace(f"/assets/notes-img/{slug}-h-{size}.{ext}",
                                        f"/assets/notes-covers/{slug}-h-{size}.{ext}")
        if before==listing:
            raise AssertionError(f"{slug}: no index image references found")
        update_article(ROOT/"notes"/slug/"index.html",slug)
        print("Generated 5 new assets and migrated article:",slug)
    # A distinct Notes landing-page share image uses the featured article's new art.
    (DEST/"og-index.jpg").write_bytes((DEST/"og-the-company-brain.jpg").read_bytes())
    listing=listing.replace("https://twinthos.com/assets/notes-img/og-index.jpg",
                            "https://twinthos.com/assets/notes-covers/og-index.jpg")
    index.write_text(listing,encoding="utf-8")
    print("PASS: all 12 article-cover families, 13 HTML pages and social images refreshed.")

if __name__=="__main__":
    main()
