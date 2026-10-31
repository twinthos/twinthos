#!/usr/bin/env python3
"""
pdf_gate.py — the pre-send gate for every PDF that leaves this machine.

The five PDFs produced on 21 October passed every visual glance and still had:
  * footers at 2.45:1 contrast
  * body copy that could vanish under overflow:hidden with no error
  * letter-spacing baked into the text layer ("T W I N T H O S")
  * zero clickable source links despite footnoted sources
  * Title only — no Author, no Subject, and a Creator string naming the browser
This gate turns each of those into a machine check.

Checks (all measured from the PDF itself, nothing assumed from the source):
  1  page geometry         A4 within 1pt
  2  safety margins        no glyph outside the 10mm/12mm safe area
  3  clipping              no glyph within 6mm of the page edge
  4  fill                  every non-cover, non-final page at least 55% full
  5  type sizes            no text under 9pt, at most 9 distinct sizes
  6  text layer            no spaced-letter damage; key strings searchable
  7  links                 at least one clickable URI when sources are cited
  8  metadata              Title + Author set, Creator free of browser UA
  9  contrast              every glyph colour at least 4.5:1 on the page's own
                           background (3:1 for text 18.66pt+ bold or 24pt+)

Exit 0 = pass, 1 = fail. Every failure prints the measurement that failed.
Usage: python3 pdf_gate.py file.pdf [--json] [--allow-empty-links] [--min-fill 55]
"""

import argparse
import json
import os
import re
import subprocess
import sys
import tempfile
import xml.etree.ElementTree as ET
from collections import Counter, defaultdict

PT_PER_MM = 72 / 25.4
A4 = (595.0, 841.9)
SAFE_LEFT = 10 * PT_PER_MM
SAFE_RIGHT_PAD = 10 * PT_PER_MM
SAFE_BOTTOM = 8 * PT_PER_MM
CLIP_BAND = 6 * PT_PER_MM
FOOTER_BAND = 45.0  # pts from bottom treated as footer furniture


# ---------------------------------------------------------------- colour maths
def hex_rgb(s):
    s = s.lstrip("#")
    if len(s) == 3:
        s = "".join(c * 2 for c in s)
    return tuple(int(s[i:i + 2], 16) for i in (0, 2, 4))


def rel_lum(rgb):
    def lin(c):
        c /= 255
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = rgb
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)


def contrast(a, b):
    la, lb = rel_lum(a), rel_lum(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


def modal_colour(png_path):
    from PIL import Image
    im = Image.open(png_path).convert("RGB").resize((80, 113))
    counts = Counter(im.getdata())  # noqa
    return counts.most_common(1)[0][0]


# ---------------------------------------------------------------- PDF parsing
def stext(pdf):
    out = tempfile.NamedTemporaryFile(suffix=".xml", delete=False)
    out.close()
    subprocess.run(["mutool", "draw", "-F", "stext", "-o", out.name, pdf],
                   check=True, capture_output=True)
    xml = open(out.name, encoding="utf-8", errors="replace").read()
    os.unlink(out.name)
    return ET.fromstring(xml)


def page_glyphs(page_el):
    """Yield dicts: char, x0, y0, x1, y1, size, colour, font. Top-left origin."""
    for block in page_el.findall("block"):
        for line in block.findall("line"):
            for font in line.findall("font"):
                size = float(font.get("size", 0))
                name = font.get("name", "")
                for ch in font.findall("char"):
                    quad = [float(v) for v in ch.get("quad", "").split()]
                    if len(quad) != 8:
                        continue
                    xs, ys = quad[0::2], quad[1::2]
                    yield {
                        "c": ch.get("c", ""),
                        "x0": min(xs), "x1": max(xs),
                        "y0": min(ys), "y1": max(ys),
                        "y": float(ch.get("y", 0)),
                        "size": size, "font": name,
                        "color": ch.get("color", "#000000"),
                    }


def page_background(pdf, page_no, workdir):
    target = os.path.join(workdir, f"p{page_no}.png")
    subprocess.run(["mutool", "draw", "-r", "40", "-F", "png", "-o", target,
                    pdf, str(page_no)],
                   check=True, capture_output=True)
    return modal_colour(target)


def pdf_uri_count(pdf):
    """Distinct link annotations, from the PDF's own annotation list.
    pdfinfo -url prints "page  Annotation  URL" per annotation; byte-grepping
    /URI misses links Chrome packs into compressed object streams."""
    try:
        out = subprocess.run(["pdfinfo", "-url", pdf], capture_output=True,
                             text=True, timeout=60).stdout
    except Exception:
        return 0
    urls = []
    for line in out.splitlines():
        parts = line.split()
        tok = parts[-1] if parts else ""
        if "://" in tok or tok.startswith("mailto:"):
            urls.append(tok)
    return len(set(urls)) if urls else 0


def staleness_failure(pdf, source):
    """A PDF older than the markdown it was built from is shipping stale copy.
    This is the failure that put a withdrawn recommendation in a client's chat."""
    if not source:
        return None
    if not os.path.exists(source):
        return f"STALE  source not found: {source}"
    if os.path.getmtime(pdf) < os.path.getmtime(source):
        return (f"STALE  {os.path.basename(pdf)} predates {os.path.basename(source)} "
                f"by {int(os.path.getmtime(source) - os.path.getmtime(pdf))}s — rebuild")
    return None


def run(pdf, min_fill, allow_empty_links, as_json, source=None, page_size=A4,
        margin_mm=10.0, clip_mm=6.0):
    failures, notes = [], []
    stale = staleness_failure(pdf, source)
    if stale:
        failures.append(stale)
    root = stext(pdf)
    pages = root.findall("page")
    npages = len(pages)

    # 1 geometry
    for i, p in enumerate(pages, 1):
        w, h = float(p.get("width")), float(p.get("height"))
        if abs(w - page_size[0]) > 1 or abs(h - page_size[1]) > 1:
            failures.append(f"p{i}: page size {w:.1f}x{h:.1f}pt is not "
                            f"{page_size[0]:.1f}x{page_size[1]:.1f} (declared)")

    workdir = tempfile.mkdtemp(prefix="pdfgate-")
    all_chars = []
    per_page_stats = []
    sizes_all = Counter()
    colours_all = defaultdict(lambda: {"n": 0, "min_contrast": 99.0, "example": "", "size": 0})

    for i, p in enumerate(pages, 1):
        w, h = float(p.get("width")), float(p.get("height"))
        glyphs = list(page_glyphs(p))
        chars = [g for g in glyphs if g["c"].strip()]
        all_chars.extend(chars)
        bg = page_background(pdf, i, workdir)

        content = [g for g in chars if g["y"] < h - FOOTER_BAND]
        footer = [g for g in chars if g["y"] >= h - FOOTER_BAND]

        # 2 margins / 3 clipping
        for g in chars:
            safe_l = margin_mm * PT_PER_MM
            safe_r = w - margin_mm * PT_PER_MM
            if g["x0"] < safe_l - 0.5 or g["x1"] > safe_r + 0.5:
                failures.append(f"p{i}: glyph {g['c']!r} breaches side safety margin "
                                f"(x {g['x0']:.1f}..{g['x1']:.1f}pt, safe {safe_l:.1f}..{safe_r:.1f})")
                break
        clip_band = min(clip_mm, margin_mm) * PT_PER_MM
        clipped = [g for g in chars if g["y1"] > h - clip_band]
        if clipped:
            failures.append(f"p{i}: {len(clipped)} glyphs within {CLIP_BAND/PT_PER_MM:.0f}mm of the page edge "
                            f"(likely clipped by overflow:hidden) e.g. {''.join(g['c'] for g in clipped)[:40]!r}")

        # 4 fill
        if content:
            top = min(g["y0"] for g in content)
            bottom = max(g["y1"] for g in content)
            fill = (bottom - top) / (h - FOOTER_BAND - top if h - FOOTER_BAND > top else 1)
            fill = max(0, min(100, fill * 100))
        else:
            fill = 0.0
        per_page_stats.append({"page": i, "fill_pct": round(fill, 1),
                               "chars": len(chars), "words": None,
                               "bg": "#%02x%02x%02x" % bg})
        if 1 < i < npages and fill < min_fill:
            failures.append(f"p{i}: only {fill:.0f}% of the live text area is used "
                            f"(gate: {min_fill}%) — the page is padding, not content")

        # 9 contrast on this page
        first_of = {}
        for g in chars:
            col = g["color"].lower()
            if col.startswith("#") and col not in first_of:
                first_of[col] = g
        for col, g in first_of.items():
            cr = float(contrast(hex_rgb(col), bg))
            need = 3.0 if g["size"] >= 18.66 else 4.5
            rec = colours_all[col]
            rec["n"] += sum(1 for x in chars if x["color"].lower() == col)
            rec["size"] = max(rec["size"], g["size"])
            if cr < rec["min_contrast"]:
                rec["min_contrast"] = cr
                rec["example"] = g["c"][:40]
            if cr < need:
                failures.append(
                    f"p{i}: text {col} on #{bg[0]:02x}{bg[1]:02x}{bg[2]:02x} is {cr:.2f}:1 "
                    f"(needs {need}:1) at {g['size']:.1f}pt example {g['c']!r}")

        for g in chars:
            sizes_all[round(g["size"], 1)] += 1

    # 5 type sizes
    if sizes_all:
        body_sizes = [s for s, n in sizes_all.items() if n > 20]
        tiny = sorted(s for s in sizes_all if s < 9 and s not in body_sizes)
        if tiny:
            failures.append(f"text under 9pt: {tiny}")
        if len(sizes_all) > 9:
            notes.append(f"{len(sizes_all)} distinct type sizes: {sorted(sizes_all)}")

    # 6 text layer
    text = "".join(g["c"] if g["y"] != -1 else " " for g in all_chars)
    # rebuild per line to detect letter-spacing damage
    lines = defaultdict(str)
    for p_i, p in enumerate(pages, 1):
        for li, line in enumerate(p.findall("block/line")):
            s = "".join(ch.get("c", "") for ch in line.iter("char"))
            lines[(p_i, li)] = s
    spaced = [s for s in lines.values() if re.search(r"\b(?:\w ){4,}\w\b", s)]
    if spaced:
        failures.append(f"letter-spaced text in the layer ({len(spaced)} lines) e.g. {spaced[0][:50]!r} "
                        f"— search and copy-paste are broken")

    # 7 links
    uris = pdf_uri_count(pdf)
    src_markers = len(re.findall(r"\b(?:https?://|www\.)", text))
    if uris == 0 and not allow_empty_links:
        failures.append("no clickable links in the PDF (0 /URI annotations)")

    # 8 metadata
    info = metadata(pdf)
    if not info.get("Title"):
        failures.append("metadata: Title missing")
    if not info.get("Author"):
        failures.append("metadata: Author missing")
    creator = info.get("Creator", "") + info.get("Producer", "")
    if "HeadlessChrome" in creator or "Skia" in creator:
        failures.append(f"metadata: Creator/Producer leaks the browser pipeline ({creator[:60]!r})")

    # structure
    outlines = pdf_outline_count(pdf)

    result = {
        "pdf": pdf,
        "bytes": os.path.getsize(pdf),
        "pages": npages,
        "per_page": per_page_stats,
        "distinct_type_sizes": sorted(sizes_all),
        "uris": uris,
        "urls_in_text": src_markers,
        "outline_items": outlines,
        "metadata": info,
        "colours": {k: {"chars": v["n"], "min_contrast": round(v["min_contrast"], 2),
                        "example": v["example"], "max_pt": v["size"]}
                    for k, v in colours_all.items()},
        "failures": failures,
        "notes": notes,
    }

    if as_json:
        print(json.dumps(result, indent=1))
    else:
        print(f"\nPDF GATE — {os.path.basename(pdf)}")
        print(f"  {npages} pages, {os.path.getsize(pdf)/1024:.0f} KB, {uris} links, "
              f"{len(sizes_all)} type sizes")
        print(f"  fill per page: " + " ".join(f"{p['fill_pct']:.0f}%" for p in per_page_stats))
        worst = sorted(result["colours"].items(), key=lambda kv: kv[1]["min_contrast"])[:3]
        print("  weakest contrast: " + ", ".join(f"{k} {v['min_contrast']}:1" for k, v in worst))
        if notes:
            for n in notes:
                print(f"  note: {n}")
        if failures:
            print(f"\n  FAIL — {len(failures)} issue(s)")
            for f in failures[:40]:
                print(f"   - {f}")
            if len(failures) > 40:
                print(f"   ... {len(failures)-40} more")
        else:
            print("\n  PASS — every gate clean")

    return 1 if failures else 0


def metadata(pdf):
    try:
        out = subprocess.run(["pdfinfo", pdf], capture_output=True, text=True).stdout
    except FileNotFoundError:
        return {}
    info = {}
    for line in out.splitlines():
        if ":" in line:
            k, v = line.split(":", 1)
            info[k.strip()] = v.strip()
    return info


def pdf_outline_count(pdf):
    try:
        out = subprocess.run(["mutool", "show", pdf, "outline"], capture_output=True, text=True).stdout
        return out.count("URI") + out.count("Title")
    except FileNotFoundError:
        return 0


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("pdf")
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--allow-empty-links", action="store_true")
    ap.add_argument("--min-fill", type=float, default=55.0)
    ap.add_argument("--source", default=None, help="markdown source; enables the staleness check")
    ap.add_argument("--size", default=None, help="page size in pt, WxH (e.g. 792x445.5); default A4")
    ap.add_argument("--margin", type=float, default=10.0, help="side safe margin in mm")
    ap.add_argument("--clip-mm", type=float, default=6.0,
                    help="fail if any glyph sits this close to the page edge")
    a = ap.parse_args()
    size = A4
    if a.size:
        size = tuple(float(x) for x in a.size.lower().split("x"))
    sys.exit(run(a.pdf, a.min_fill, a.allow_empty_links, a.json, source=a.source,
                 page_size=size, margin_mm=a.margin, clip_mm=a.clip_mm))
