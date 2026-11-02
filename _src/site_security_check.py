#!/usr/bin/env python3
"""Fail CI on public-site regressions that can be checked without credentials."""
from __future__ import annotations
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent

def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")

def audit() -> None:
    js = read("assets/tw.js")
    booking = read("book/index.html")
    privacy = read("privacy/index.html")
    policy = read(".well-known/security.txt")
    security = read("security/index.html")
    assert "Object.prototype.hasOwnProperty.call(LBL,want)" in js, "Unsafe querystring selector"
    assert "new AbortController()" in js and "ctrl.signal" in js, "Third-party request needs a timeout"
    assert 'name="_captcha" value="false"' not in booking, "Do not opt out of the provider's anti-spam controls"
    assert 'name="_honey"' in booking, "Honeypot must remain present"
    for field, limit in (("f-name", "150"), ("f-email", "254"), ("f-co", "200"), ("f-msg", "3000")):
        assert re.search(r'id="' + field + r'"[^>]*maxlength="' + limit + '"', booking), "Missing max length " + field
    assert "FormSubmit" in privacy and "30-day" in privacy, "Document third-party form handling"
    assert "mailto:twinthos@agentmail.to" in policy, "Security disclosure contact missing"
    assert 'class="sc-github-glass"' in security, "GitHub evidence panel missing"
    assert "not independently audited" in security.lower() or "not an independently audited" in security.lower(), "Security caveat removed"
    assert "https://github.com/twinthos/ai-sec-sentinel" in security
    for path in (
        "hotbox-pitch-context.md", "hotbox-pitch-laptop.html", "hotbox-pitch-mobile.html",
        "engagement-report.html", "engagement-report.pdf", "engagement-report.txt",
        "engagement-audit.md", "offers.md", "jobs_opportunities.pdf"
    ):
        assert not (ROOT / path).exists(), "Unrelated internal artifact still published: " + path
    for name in (".env", ".env.production", "config/secrets.json", "service-account.json"):
        assert not (ROOT / name).exists(), "Secret-like filename in public site: " + name
    print("PASS: public-site security invariants (form, selector, privacy, disclosure, leakage)")

if __name__ == "__main__":
    audit()
