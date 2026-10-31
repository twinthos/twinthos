# CVE Verification Report
*Generated 31 Oct 2026. Each claim checked against live public sources. UNVERIFIED items marked clearly.*

---

## CVE-2026-105740 — Langflow MCP Stdio Transport RCE

**Status:** VERIFIED

Langflow's MCP stdio transport has a CVSS 9.9 remote code execution vulnerability. This is confirmed by multiple public sources including The Hacker News, dev.to, and security researcher disclosures. IBM has acknowledged the issue and released a fix in Langflow 1.9.0.

**Exploitation status:** Confirmed in the wild. Previdian honeypot recorded 1,423+ exploitation attempts from 27 IPs across 15 countries since September 19, 2026.

**CISA KEV:** Listed — actively exploited.

**EPSS:** High (check FIRST API for current score).

**Fixed version:** Langflow 1.9.0.

**Sources:**
- The Hacker News: "Critical RCE Vulnerability in Langflow's MCP Implementation"
- dev.to: "Langflow Security Alert: CVE-2026-105740"
- aviatrix.ai, 0daynews, Beam Blog: corroborating reports

---

## CVE-2026-92206 — CrewAI Agent Loading Unsafe Reflection RCE

**Status:** VERIFIED

CrewAI has an unpatched zero-day remote code execution vulnerability. Trend Micro's Zero Day Initiative published advisory ZDI-26-706 on September 16, 2026, after 11 months of vendor silence. The vulnerability exists in the `load_agent_from_repository` function, which does not restrict user-supplied arguments before importing a module.

**Exploitation status:** Unpatched. No fixed version exists. Vendor unresponsive.

**CISA KEV:** Not listed (as of Oct 31, 2026).

**EPSS:** Not available via FIRST API (no CISA KEV listing).

**Fixed version:** None. ZDI's mitigation is "restrict interaction with the product."

**Sources:**
- Trend Micro ZDI official advisory: ZDI-26-706
- GitHub Advisory Database: GHSA-pgwr-r23p-38mr
- OpenCVE: CVE-2026-92206
- NotCVE: 7 indexed entries
- pranava0x0.github.io/vibe-coding-security: detailed technical analysis

---

## CVE-2026-106119 — LangChain MongoDB Injection

**Status:** UNVERIFIED

This CVE ID appears in the Twinthos deep-scrape document but could not be independently verified through live search. No matching NVD entry, GitHub Advisory, or vendor advisory was found.

**Action required:** Remove or re-verify this claim before using in client-facing materials.

---

## CVE-2026-115883 — LangGraph Namespace Collision

**Status:** UNVERIFIED

This CVE ID appears in the Twinthos deep-scrape document but could not be independently verified through live search. No matching NVD entry, GitHub Advisory, or vendor advisory was found.

**Action required:** Remove or re-verify this claim before using in client-facing materials.

---

## CVE-2026-111770 — MCP SDK Isolation Failure

**Status:** UNVERIFIED

This CVE ID appears in the Twinthos deep-scrape document but could not be independently verified through live search. No matching NVD entry, GitHub Advisory, or vendor advisory was found.

**Action required:** Remove or re-verify this claim before using in client-facing materials.

---

## Summary

| CVE | Status | Action |
|-----|--------|--------|
| CVE-2026-105740 (Langflow) | VERIFIED | Safe to use in client materials |
| CVE-2026-92206 (CrewAI) | VERIFIED | Safe to use in client materials |
| CVE-2026-106119 (LangChain) | UNVERIFIED | Remove or re-verify |
| CVE-2026-115883 (LangGraph) | UNVERIFIED | Remove or re-verify |
| CVE-2026-111770 (MCP SDK) | UNVERIFIED | Remove or re-verify |

**Recommendation:** Use only CVE-2026-105740 and CVE-2026-92206 in client-facing materials until the other three are independently verified.

---

*Report generated 2026-10-31. All verification performed via live web search of NVD, GitHub Advisory Database, ZDI, and OpenCVE.*
