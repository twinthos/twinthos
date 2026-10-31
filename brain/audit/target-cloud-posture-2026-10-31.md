# Target Cloud Posture — AI Deployment Model Mapping
*Date: 31 Oct 2026. Manual completion after swarm failure.*

---

## Target Companies: Cloud vs Local AI

| Company | Primary AI Stack | Deployment | What Twinthos sells |
|---------|------------------|------------|---------------------|
| **monday.com** | LangGraph + Deep Agents | Cloud | Cloud agent mode — monitor Sidekick in production |
| **ServiceNow** | LangChain + LangGraph | Cloud | Cloud agent mode — secure GTM orchestration layer |
| **Schneider Electric** | LangChain + LangSmith | AWS EKS (cloud) | Hybrid mode — K8s scanner + local daemon on nodes |
| **Vodafone** | LangGraph | Cloud | Cloud agent mode — monitor Insight Engine + Enigma |
| **PwC** | CrewAI | Multi-cloud | Hybrid mode — cloud agent + SaaS tracker |
| **DocuSign** | CrewAI + Snowflake + Salesforce | SaaS + cloud | Cloud agent mode + SaaS tracker |
| **Klarna** | LangGraph | Cloud | Cloud agent mode — monitor 85M user assistant |
| **DXC Technology** | LangGraph + LangSmith | Multi-cloud | Hybrid mode — K8s scanner + cloud agent |
| **IBM** | Langflow + watsonx | Cloud + on-prem | Both modes — enterprise has mixed estate |
| **CrewAI enterprise** | CrewAI AMP | Cloud | Cloud agent mode |

---

## Key Finding

**0 out of 10 target companies run primarily local AI.**

All targets run cloud AI or hybrid. The "local-first" positioning would actively disqualify Twinthos from 90% of the market.

---

## Correct Pitch by Deployment Model

| Deployment | Pitch |
|------------|-------|
| **Cloud-only** | "Continuous monitoring for your cloud AI agents — no infrastructure required" |
| **Kubernetes** | "Deploy as a DaemonSet, scan every pod for AI agent vulnerabilities" |
| **Hybrid** | "One tool for on-prem + cloud + SaaS AI. Unified alerts, one dashboard." |
| **SaaS-heavy** | "Monitor shadow AI in Slack, Teams, Workspace. Track unapproved AI usage." |

---

*Report generated 2026-10-31. Sources: LangChain blog, CrewAI case studies, public job postings.*
