#!/usr/bin/env python3
"""Prepare an explicit website allowlist for GitHub Pages.

Never publish repository-root reports, client pitch material, research,
automation scripts, PDFs, workspace notes, source files or credentials.
This does not make the public GitHub repository/history private.
"""
import argparse
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PUBLIC_TOP = {
    "index.html", "404.html", "favicon.svg", "og.png", "robots.txt",
    "sitemap.xml", "llms.txt", "ai-catalog.json", "indexnow-key.txt",
    "CNAME", ".nojekyll",
}
PUBLIC_PAGES = {
    "about", "audit", "book", "brain", "contact", "demo", "demos",
    "engineering", "faq", "how-it-works", "operations-audit",
    "pricing", "privacy", "questions", "security", "sentinel",
    "services", "terms", "thankyou", "workforce",
}
ASSET_EXTENSIONS = {".css", ".js", ".svg", ".png", ".webp", ".jpg", ".jpeg", ".avif",
                    ".woff2", ".woff", ".ico", ".mp4", ".webm", ".mp3"}
PUBLIC_OTHER = {
    ".well-known/oauth-protected-resource",
    "notes/feed.xml",
    "demos/twinthos-demo.mp4",
}
FORBIDDEN_WORDS = {"password", "secret", "credential", "access_token", "private",
                   "research", "backup", "pitch", "client-context", "client_data",
                   "engagement-report", "internal", "sensitive"}


def should_publish(relative: Path) -> bool:
    name = relative.as_posix()
    if name in PUBLIC_TOP or name in PUBLIC_OTHER:
        return True
    if any(part.startswith(".") for part in relative.parts):
        return False
    if any(bad in name.lower() for bad in FORBIDDEN_WORDS):
        return False
    if len(relative.parts) >= 2:
        top = relative.parts[0]
        if top in {"assets", "images"} and relative.suffix.lower() in ASSET_EXTENSIONS:
            return True
        if top == "notes" and relative.name == "index.html":
            return True
        if top in PUBLIC_PAGES and len(relative.parts) == 2 and relative.name == "index.html":
            return True
    return False


def stage(dest: Path):
    dest = dest.resolve()
    if dest == ROOT or ROOT in dest.parents:
        raise ValueError("Site staging must be outside source repository")
    dest.mkdir(parents=True, exist_ok=True)
    selected = []
    for item in ROOT.rglob("*"):
        if not item.is_file() or item.is_symlink():
            continue
        relative = item.relative_to(ROOT)
        if not should_publish(relative):
            continue
        out = dest / relative
        out.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(item, out)
        selected.append(relative.as_posix())
    for required in ("index.html", "pricing/index.html", "book/index.html",
                     "security/index.html", "engineering/index.html", "assets/tw.css",
                     "assets/tw.js", "CNAME", ".well-known/oauth-protected-resource"):
        if not (dest / required).is_file():
            raise RuntimeError(f"Missing required public page/asset: {required}")
    for item in dest.rglob("*"):
        if item.is_file() and not should_publish(item.relative_to(dest)):
            raise RuntimeError(f"Unapproved published file: {item.relative_to(dest)}")
    print(f"PASS: {len(selected)} allowlisted public files; no repo reports, PDFs or source")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("dest", type=Path)
    args = parser.parse_args()
    stage(args.dest)
