# Outreach Templates — AI Security Audits
**Use:** LinkedIn messages, email intros, follow-up sequences  
**Tone:** Direct, technical, no fluff. Lead with the specific CVE. End with the ask.

---

## Template 1: Langflow Enterprise Customer (Generic)

**Subject:** Langflow — 1,423 confirmed RCE attempts. Your deployment is in the attacker's window.

Hi [First Name],

Langflow's MCP stdio transport has a CVSS 9.9 RCE. IBM has confirmed 1,423+ exploitation attempts from 27 IPs across 15 countries since September 2026.

**If you do nothing, the math is brutal:**
- A single breach from this vector starts at £500,000 (UK ICO fine + incident response)
- The audit costs £10,000
- You are already in the attacker's window — the question is when, not if

I specialise in AI agent security audits. I can deliver a full Langflow MCP security audit in 3 days:
- CVE cross-reference against your deployment
- Stdio transport configuration review
- MCP server inventory and allowlist policy
- Environment variable injection test
- Remediation playbook

Price: £10,000. Deliverable: formal audit report + 30-min debrief.

30-min call this week to discuss?

Tyson Mandela  
Twinthos — Applied AI Security

---

## Template 2: CrewAI Production User

**Subject:** CrewAI — unpatched zero-day. No fix from vendor in 11 months.

Hi [First Name],

CrewAI has an unpatched zero-day (CVE-2026-92206, CVSS 8.8). Trend Micro published it after 11 months of vendor silence. Zero GitHub Security Advisories. No patched version.

**If you do nothing, the math is brutal:**
- RCE via agent loading: one malicious config from a repo = full system compromise
- Sandbox escape when Docker is unavailable: attacker gets host access
- SSRF via RAG tools: attacker reaches your internal network and cloud metadata
- A single breach starts at £500,000
- The audit costs £8,000

I specialise in AI agent security audits. I can deliver a CrewAI Production Security Baseline in 3 days:
- Full CVE audit of your dependency tree
- Sandbox configuration review
- MCP server inventory
- Agent config source audit
- Remediation playbook

Price: £8,000. Deliverable: formal audit report + 30-min debrief.

30-min call this week?

Tyson Mandela  
Twinthos — Applied AI Security

---

## Template 3: Schneider Electric / Critical Infrastructure

**Subject:** LangChain agent security for OT-adjacent AI — operational continuity at risk

Hi [First Name],

LangChain/LangGraph has 13 CVEs in 90 days, including namespace collisions and deserialization RCE. You're running 60+ LangChain agents in critical infrastructure. The blast radius is not just data — it's operational continuity.

**If you do nothing, the math is brutal:**
- Agent compromise becomes lateral movement through OT-adjacent systems
- Regulatory exposure under NIS2, IEC 62443, ISO 27001
- Incident response costs: £200K–£10M plus operational downtime
- The audit costs £15,000–£25,000

I specialise in AI agent security for environments where traditional pentesting doesn't reach. I can deliver:
- LangChain/LangGraph production audit (namespace isolation, checkpoint security, MCP gateway config)
- Continuous monitoring setup using the Twinthos AI Security Sentinel (CISA KEV + EPSS + lockfile tracking)
- Remediation playbook mapped to your OT security standards

Price: £15,000–25,000. Timeline: 5 days.

I understand the sensitivity of OT environments. NDA and flexible engagement models available.

30-min call to discuss scope?

Tyson Mandela  
Twinthos — Applied AI Security

---

## Template 4: Vodafone / Telecom

**Subject:** LangGraph — SQL injection in agent memory. GDPR + NIS2 notification risk.

Hi [First Name],

LangGraph has confirmed vulnerabilities in checkpoint deserialization (CVE-2026-28277, CVSS 7.2) and Redis injection (CVE-2026-27022, CVSS 6.5). If your Insight Engine or Enigma agents use LangGraph persistence layers, you have SQL injection and RCE paths in your agent memory.

**If you do nothing, the math is brutal:**
- Agent memory compromise = customer data exfiltration
- Under NIS2 and GDPR, agent security incidents carry mandatory notification requirements
- Regulatory fine + mandatory forensic audit: £200K–£10M
- The audit costs £15,000

I can deliver:
- LangGraph production audit (checkpoint security, namespace isolation, MCP gateway config)
- Continuous monitoring setup with CISA KEV + EPSS correlation
- Regulatory mapping to NIS2, GDPR, ISO 42001

Price: £15,000. Deliverable: audit report + monitoring setup + compliance mapping.

30-min call this week?

Tyson Mandela  
Twinthos — Applied AI Security

---

## Template 5: Generic MCP / AI Agent Security

**Subject:** Your MCP servers are likely unauthenticated. This is architectural, not a CVE.

Hi [First Name],

Trend Micro estimated 200,000+ MCP servers exposed globally with no authentication in April 2026. The MCP specification has no built-in auth. Tool poisoning, rug pulls, and confused-deputy attacks are architectural — no CVE will ever patch them.

**If you do nothing, the math is brutal:**
- 43% of tested MCP servers had command injection (Equixly)
- A compromised MCP server = every connected agent becomes an attack pivot
- Data exfiltration through legitimate tool calls is invisible to traditional security
- A single incident starts at £500,000
- The workshop costs £3,000–£5,000; monitoring costs £750/month

I can deliver:
- MCP server inventory and allowlist policy
- Tool poisoning scan (MCPTox-style canary tests)
- Egress baseline and anomaly detection setup
- Continuous monitor with Telegram/Discord alerts

Price: £3,000–£5,000 for a 1-day workshop + implementation. Or £750/month for ongoing monitoring.

30-min call to scope?

Tyson Mandela  
Twinthos — Applied AI Security

---

## Template 6: Follow-up (Day 3)

**Subject:** Re: Langflow — 1,423 confirmed RCE attempts

Hi [First Name],

Quick follow-up on the Langflow MCP security issue (CVE-2026-105740, CVSS 9.9, 1,423+ exploitation attempts).

The math is simple: the audit is £10,000. A single breach from this vector starts at £500,000. You are already in the attacker's window.

I published a short audit report on this. Happy to send it over — no strings, just the technical detail.

If you'd like to discuss a full engagement, I have capacity next week.

Tyson

---

## Template 7: White-label Partner (PA Consulting / LevelBlue / KPMG)

**Subject:** AI agent security capability partner

Hi [First Name],

I run Twinthos, an applied AI security practice. We specialise in technical audits of AI agent frameworks — LangChain, LangGraph, CrewAI, MCP servers — with real exploit paths, not GRC slide decks.

I'm looking for capability partners who need deep technical AI security work sub-contracted. I bring:
- Live CVE correlation (CISA KEV + EPSS + lockfile scanning)
- Proven tooling (Twinthos AI Security Sentinel, open-source)
- Mirofish adversarial simulation for threat modelling
- Fast turnaround: 3-5 day audits

Happy to discuss a referral arrangement or white-label delivery.

Tyson Mandela  
Twinthos — Applied AI Security

---

## Usage Notes

- **Personalise every message.** Mention the specific tech stack you know they use (Langflow, CrewAI, LangGraph, etc.).
- **Send max 5 per day.** Quality over volume.
- **Follow up once** on day 3 with Template 6.
- **Never mention Twinthos pricing** in the first message unless asked.
- **Attach the relevant audit report** (Langflow or CrewAI) if they engage.
