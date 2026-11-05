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

    assert "NOT A LIVE DEPLOYMENT DIAGRAM" in security, "Reference architecture must be labelled"
    assert "one read-only MCP tool in an isolated local subprocess" in security, "Sentinel proof scope must stay explicit"
    assert "The agent asks." in security and "The host decides." in security, "Control-path explanation missing"
    assert "Exposes one bounded MCP read tool" in security, "MCP proof description drifted"
    assert "Controls need to be verified against each deployment" in security, "Deployment assurance language drifted"
    assert "Inspect MCP server implementation" in security, "MCP implementation link label drifted"
    security_css = read("_src/css/zzzz-security-editorial.css")
    assert ".pg-security .sc-button-primary{background:#E8E6E1;border:1px solid #E8E6E1;color:#0B0B0F}" in security_css, "Primary CTA contrast regression"
    assert ".pg-security .sc-button-quiet{background:transparent;border:1px solid #6A6A70;color:#E8E6E1}" in security_css, "Secondary CTA contrast regression"
    assert ".pg-security .sc-github-glass{\n  border:1px solid #55565F;" in security_css, "Evidence panel surface regression"
    for path in (
        "hotbox-pitch-context.md", "hotbox-pitch-laptop.html", "hotbox-pitch-mobile.html",
        "engagement-report.html", "engagement-report.pdf", "engagement-report.txt",
        "engagement-audit.md", "offers.md", "jobs_opportunities.pdf"
    ):
        assert not (ROOT / path).exists(), "Unrelated internal artifact still published: " + path
    # All repository files on this branch are publicly retrievable on GitHub Pages.
    assert not list((ROOT / "_src").rglob("*.pyc")), "Python bytecode must not be published"
    assert not (ROOT / "images").exists(), "Legacy private pitch image directory still exposed"
    # Heuristic catches common hard-coded credential formats; not a comprehensive secret scanner.
    signatures = (
        re.compile(r"\b(?:AKIA|ASIA)[A-Z0-9]{16}\b"),
        re.compile(r"\bgh[pousr]_[A-Za-z0-9]{28,}\b"),
        re.compile(r"\bgithub_pat_[A-Za-z0-9_]{50,}\b"),
        re.compile(r"\bxox[baprs]-[A-Za-z0-9-]{24,}\b"),
        re.compile(r"sk-proj-[A-Za-z0-9_-]{24,}"),
        re.compile(r"-----BEGIN (?:OPENSSH |RSA |EC |DSA )?PRIVATE KEY-----"),
    )
    assert signatures[0].search("AKIA" + "A" * 16), "Credential detector self-test failed"
    for path in ROOT.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in {".html", ".js", ".json", ".css", ".xml", ".txt", ".md", ".yml", ".yaml", ".py"}:
            continue
        if path.stat().st_size > 1_000_000:
            continue
        data = path.read_text(encoding="utf-8", errors="replace")
        if any(pattern.search(data) for pattern in signatures):
            raise AssertionError("Credential-like text appears in public file: " + str(path.relative_to(ROOT)))
    for name in (".env", ".env.production", "config/secrets.json", "service-account.json"):
        assert not (ROOT / name).exists(), "Secret-like filename in public site: " + name
    print("PASS: public-site security invariants (form, selector, privacy, disclosure, leakage)")

if __name__ == "__main__":
    audit()
