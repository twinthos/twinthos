# Cloud Sentinel Architecture — Hybrid Local/Cloud AI Security Monitor
*Date: 31 Oct 2026. Manual completion after swarm failure.*

---

## 1. Top 5 Cloud AI Security Vendors/Tools (2026)

| Vendor | Approach | Gaps |
|--------|----------|------|
| **Lakera Guard** | SaaS prompt injection firewall for LLM apps | No local option, no lockfile scanning, no CISA KEV |
| **Protect AI** | AI/ML supply chain security, model scanning | Focus on model weights, not agent frameworks or MCP |
| **NVIDIA SkillSpector** | Static analysis of AI agent skills | Static only, no continuous monitoring, no CVE feed |
| **Vigil LLM** | Input/output scanning for LLM apps | No CVE correlation, no lockfile, no agent egress |
| **Cequence** | API security, bot detection | Not AI-specific, no CISA KEV, no EPSS |

**Market gap:** No tool combines AI-only CVE filtering + CISA KEV + EPSS + lockfile scanning + agent egress monitoring in a hybrid local/cloud deployment.

---

## 2. What Enterprises Actually Need for Cloud AI Security

| Need | Why | Current gap |
|------|-----|-------------|
| **1. Cloud API monitoring** | Track usage of OpenAI, Anthropic, Bedrock, Azure, Vertex | No tool correlates AI API calls to CVEs |
| **2. Kubernetes agent visibility** | Agents run as pods, services, cron jobs | No AI-specific K8s monitoring |
| **3. MCP server inventory** | 200,000+ unauthenticated MCP servers | No allowlist policy enforcement |
| **4. Agent egress baseline** | Agents are escaping to internal systems | No behavioural baseline for AI agents |
| **5. Lockfile + CVE correlation** | Dependencies have known vulnerabilities | Snyk/Dependabot miss AI-specific CVEs |
| **6. SaaS AI usage tracking** | Shadow AI in Slack, Teams, Google Workspace | No visibility into unapproved AI tools |
| **7. Compliance mapping** | NIS2, GDPR, DORA, ISO 42001 | Generic GRC tools don't understand AI |

---

## 3. Hybrid Architecture: Local + Cloud

### Mode A: Local Daemon (existing)
```
What it does:
- Polls CVE feeds (cve.now, NVD, CISA KEV)
- Scans lockfiles (requirements.txt, package.json, pyproject.toml)
- AI-only keyword filtering
- EPSS lookup per CVE
- Telegram/Discord alerts

Where it runs:
- On-prem servers
- Developer laptops
- Air-gapped environments
- Sensitive CI/CD pipelines
```

### Mode B: Cloud Agent (new)
```
What it does:
- Polls cloud AI APIs (OpenAI, Anthropic, Bedrock, Azure, Vertex)
- Monitors Kubernetes pods/services for AI agents
- Tracks MCP server configurations in cloud deployments
- Scans IaC templates (Terraform, CloudFormation) for AI resources
- Monitors SaaS AI usage (Slack, Teams, Google Workspace)
- Cloud-native alerting (PagerDuty, Opsgenie, Slack)

Where it runs:
- Kubernetes cluster (as a DaemonSet or Deployment)
- AWS ECS/EKS, Azure AKS, GCP GKE
- Serverless (Lambda, Cloud Functions)
- SaaS integration via webhooks
```

### Mode C: Hybrid (combined)
```
What it does:
- Local daemon for sensitive environments
- Cloud agent for cloud-native workloads
- Centralised correlation engine
- Unified alerting across both

How it works:
- Local daemon sends metadata to cloud correlation engine
- Cloud agent sends cloud findings to same engine
- Engine deduplicates, enriches with CISA KEV + EPSS
- Single pane of glass for hybrid stacks
```

---

## 4. Concrete Architectural Changes

### Change 1: Add Cloud Provider Modules
```
New files:
- cloud_providers/__init__.py
- cloud_providers/aws.py (Bedrock, SageMaker, Lambda AI monitoring)
- cloud_providers/azure.py (Azure OpenAI, AI Studio)
- cloud_providers/gcp.py (Vertex AI, Gemini API)

Each module:
- Polls provider AI API for usage patterns
- Checks IAM policies for AI service permissions
- Scans for exposed AI endpoints
- Correlates with CVE feeds
```

### Change 2: Add Kubernetes Scanner
```
New file:
- k8s_scanner.py

What it does:
- Lists all pods with AI-related labels/annotations
- Scans container images for vulnerable AI frameworks
- Checks for exposed MCP servers in cluster
- Monitors agent egress from pods
- Alerts on anomalous network connections
```

### Change 3: Add SaaS AI Tracker
```
New file:
- saas_ai_tracker.py

What it does:
- Monitors Slack/Teams for AI bot usage
- Tracks Google Workspace AI features (Duet AI)
- Scans for unapproved AI browser extensions
- Correlates with shadow AI risk
```

### Change 4: Centralised Correlation Engine
```
New file:
- correlation_engine.py

What it does:
- Merges local daemon findings + cloud agent findings
- Deduplicates CVEs across environments
- Enriches with CISA KEV + EPSS
- Generates unified alert queue
- Provides single API for dashboards
```

### Change 5: Deployment Flexibility
```
New configs:
- docker-compose.cloud.yml (cloud agent mode)
- helm-chart/ (Kubernetes deployment)
- terraform/ (IaC for cloud resources)
- serverless/ (Lambda/Cloud Function packages)

Each deployment:
- Same core engine
- Different input adapters
- Same alert format
```

---

## 5. Market Positioning: Hybrid Wins

**Why hybrid beats local-first or cloud-only:**

| Position | Market size | Competition |
|----------|-------------|-------------|
| Local-first | Small (on-prem AI is niche) | cve.now, open-source tools |
| Cloud-only | Large but crowded | Lakera, Protect AI, big vendors |
| **Hybrid** | **Large AND underserved** | **No one does both** |

**The pitch:**
> "Most enterprises run hybrid AI stacks: some on-prem, some cloud, some SaaS. Other tools force you to choose. Sentinel runs everywhere — on your servers, in your Kubernetes cluster, and across your cloud AI APIs — and correlates everything in one place."

---

## 6. Target-Specific Positioning

| Target | Primary need | Sentinel mode |
|--------|--------------|---------------|
| **monday.com** | Cloud + LangGraph | Cloud agent mode |
| **ServiceNow** | Cloud + LangChain | Cloud agent mode |
| **Schneider Electric** | AWS EKS + LangChain | Hybrid: local daemon + K8s scanner |
| **Vodafone** | Cloud + LangGraph | Cloud agent mode |
| **PwC** | Multi-cloud + CrewAI | Hybrid: cloud agent + SaaS tracker |
| **DocuSign** | Snowflake + Salesforce + CrewAI | Cloud agent + SaaS tracker |

---

## 7. What to Build First

**Sprint 1 (Week 1-2): Cloud agent mode**
- AWS Bedrock + Azure OpenAI + Vertex AI polling
- Kubernetes pod scanner
- Cloud-native alerting (Slack, PagerDuty)

**Sprint 2 (Week 3-4): Correlation engine**
- Merge local + cloud findings
- Unified alert queue
- Single API endpoint

**Sprint 3 (Week 5-6): SaaS tracker**
- Slack/Teams AI bot detection
- Shadow AI scanning
- Browser extension detection

---

## 8. The Updated Positioning Statement

**"Twinthos Sentinel: Continuous AI security monitoring for hybrid stacks. Local, cloud, or both — we monitor the agents you actually run."**

---

*Report generated 2026-10-31. Manual completion after swarm failure (HTTP 503).*
