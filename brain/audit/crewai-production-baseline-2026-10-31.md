# CrewAI Production Security Baseline
**Prepared for:** [Enterprise Engineering Lead]  
**Prepared by:** Tyson Mandela, Twinthos  
**Date:** 2026-10-31  
**Classification:** Confidential — Technical Audit

---

## Executive Summary

CrewAI has **nine CVEs in 2026**, including an **unpatched zero-day** (CVE-2026-92206, CVSS 8.8) published by Trend Micro's Zero Day Initiative after **11 months of vendor silence**. The project has **zero published GitHub Security Advisories** despite confirmed RCE, sandbox escape, and SSRF flaws.

If your organisation runs CrewAI in production — especially with Code Interpreter, RAG tools, or agent configs loaded from repositories — you are running unpatched critical vulnerabilities.

---

## Finding 1: Unpatched Zero-Day — Unsafe Reflection RCE

| Field | Detail |
|-------|--------|
| **CVE** | CVE-2026-92206 |
| **CVSS** | 8.8 (High) |
| **CWE** | CWE-470 — Use of Externally-Controlled Input to Select Classes or Code |
| **ZDI Advisory** | ZDI-26-706 |
| **Status** | **No patched version exists.** Vendor unresponsive for 11 months. |
| **Exploitation** | Requires victim to load malicious agent config from a repository |
| **CISA KEV** | Not listed |

**Mechanism:** `load_agent_from_repository()` does not restrict user-supplied arguments before importing a module. Loading a malicious agent configuration from a Git repo, S3 bucket, or shared drive results in remote code execution in the service account's context.

**Why this matters for production:**
- CI/CD pipelines that pull agent configs from repos are exposed
- Multi-tenant platforms where users can upload agent definitions are exposed
- Any agent config path influenceable by a prompt is an attack surface

**Current status as of 2026-10-31:** No fixed version named. PyPI shows 1.15.22 as latest with no changelog reference to this CVE. The GHSA entry lists no patched version. Dependabot will not alert on this.

---

## Finding 2: Code Interpreter Sandbox Escape

| Field | Detail |
|-------|--------|
| **CVE** | CVE-2026-2275 |
| **CVSS** | 9.8 (Critical) |
| **Mechanism** | Code Interpreter falls back to unsandboxed execution when Docker is unreachable |
| **Status** | Fixed in commit `fb2323b` — Docker now mandatory unless `unsafe_mode=True` |

**Why this matters:** If your deployment runs CrewAI without Docker, or if Docker is temporarily unavailable, the Code Interpreter executes arbitrary Python/bash as root. The fix exists but many production deployments have not upgraded.

**Evidence path:** Fix commit enforces Docker as mandatory. Execution raises `RuntimeError` when Docker is missing unless `unsafe_mode=True` is set. Many deployments set this flag for convenience.

---

## Finding 3: SSRF via RAG Search Tools

| Field | Detail |
|-------|--------|
| **CVE** | CVE-2026-2286 |
| **CVSS** | High |
| **Mechanism** | RAG search tools don't validate runtime-provided URLs |
| **Impact** | SSRF against internal services and cloud metadata endpoints (169.254.169.254) |

**Why this matters:** A prompt-injected URL in a RAG query can reach internal services, cloud metadata, and databases. This is the same class as CVE-2026-33626 (LMDeploy) which is actively exploited.

---

## Finding 4: Path Traversal via JSON Loader

| Field | Detail |
|-------|--------|
| **CVE** | CVE-2026-2285 |
| **CVSS** | High |
| **Mechanism** | JSON loader tool reads files without path validation |
| **Impact** | Arbitrary local file read, including `/etc/passwd`, `.env` files, private keys |

**Why this matters:** A prompt-injected file path can read any file the CrewAI process can access. This includes environment files with API keys, database credentials, and cloud tokens.

---

## Finding 5: Silent Sandbox Downgrade

| Field | Detail |
|-------|--------|
| **CVE** | CVE-2026-2287 |
| **CVSS** | Medium |
| **Mechanism** | No continuous verification that Docker is running during execution |
| **Impact** | Silent downgrade to insecure sandbox mode |

**Why this matters:** Even if Docker is running at startup, a crash or restart can leave the Code Interpreter in unsandboxed mode with no alert.

---

## Finding 6: GitHub Security Advisory Gap

**Fact:** CrewAI has **zero published GitHub Security Advisories** as of 2026-10-31.

**Implication:** Dependabot, Renovate, and other automated dependency tools will not alert on these CVEs. The project's own security infrastructure does not track its vulnerabilities. This is a governance failure that extends to every downstream project using CrewAI.

---

## Dependency Chain Exposure

CrewAI depends on:
- **LangChain** — 13 CVEs in 90 days including CVE-2026-106119 (MongoDB injection)
- **LangGraph** — 3 CVEs including SQLite/Redis injection and deserialization RCE
- **Pydantic** — multiple CVEs in deserialization
- **OpenAI / Anthropic SDKs** — API key leakage vectors

Standard `pip install crewai` pulls all of these. A standard deployment inherits the entire vulnerability surface.

---

## Production Deployment Checklist

### Before you deploy CrewAI

| Check | Status | Action |
|-------|--------|--------|
| `crewai` version | | Pin to latest. Check GHSA for CVEs. |
| `crewai-tools` version | | Pin to >= 1.15.1 (SSRF fix). |
| Docker required for Code Interpreter | | Enforce. Never set `unsafe_mode=True`. |
| Agent config source | | Load only from reviewed, signed repositories. |
| MCP servers in config | | Audit each server. Remove unapproved. |
| Network egress from CrewAI container | | Restrict to LLM API endpoints only. |
| Environment variables in process scope | | Use runtime injection, not `.env` files the agent can read. |
| Logging | | Enable audit log for all tool calls with parameters. |
| CI/CD pipeline | | Scan agent configs for untrusted sources before deployment. |
| Dependency scanning | | Use sentinel or equivalent. CrewAI GHSA is empty — don't rely on it. |

---

## Remediation Playbook

### Immediate (24 hours)
1. **Upgrade `crewai` and `crewai-tools`** to latest versions. Confirm Docker is running wherever Code Interpreter is used.
2. **Audit all agent config sources.** Remove any loaded from repos, S3, or shared drives not under your control.
3. **Rotate all credentials** accessible to the CrewAI process.

### Short-term (1 week)
1. **Implement MCP server allowlist.** Only approved servers with signed manifests.
2. **Add URL validation** to all RAG/search tools. Block private IP ranges and metadata endpoints.
3. **Add path validation** to all file-reading tools. Restrict to project directory.

### Medium-term (1 month)
1. **Deploy continuous dependency monitoring.** CrewAI's GHSA is empty — use external feeds (CISA KEV, NVD, sentinel).
2. **Conduct prompt injection testing** against all CrewAI workflows.
3. **Review multi-tenant isolation** if you run CrewAI as a platform.

---

## What Twinthos Delivers

| Service | Deliverable | Price |
|---------|-------------|-------|
| CrewAI Production Security Baseline | Full CVE audit, dependency chain analysis, sandbox configuration review, MCP server inventory, remediation playbook | £8,000 |
| Ongoing CrewAI Monitor | Continuous CVE tracking, config drift alerts, Telegram notifications | £500/month |
| Prompt Injection Test Suite | Automated canary prompts against all agents, weekly re-tests | £2,000/setup + £500/month |

---

## Contact

Tyson Mandela  
Twinthos — Applied AI Security  
[contact details]

*This audit was prepared using the Twinthos AI Security Sentinel, which cross-references CISA KEV, FIRST EPSS, and dependency lockfiles against real-time CVE feeds.*
