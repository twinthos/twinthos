# Legacy HR Software — Simple Guide for Twinthos

## The Problem (Simple)

**Big HR software = No easy API**

- ADP, Paychex, Paycom, UKG = Can't connect programs automatically
- Vendor says: "Wait 6 months, pay $50K"
- Reality: You need fixes NOW

**Solution:** Give the AI agent a screen robot

---

## The 10 Biggest HR Software Targets

### 1. Paycom
**Pain:** Payroll calculations broken  
**Twinthos Fix:** AI robot opens Paycom → runs payroll → sends corrected file  
**Time:** 2 hours  
**Save:** $1,000/client/month

### 2. ADP RUN  
**Pain:** Time tracking errors, need data export  
**Twinthos Fix:** AI robot pulls timesheets daily → fixes errors → emails report  
**Time:** 90 min  
**Save:** $1,200/client/month

### 3. Paychex Flex
**Pain:** Manual invoice entry = 40 hours/week waste  
**Twinthos Fix:** AI robot reads PDF invoices → enters Paychex → confirms  
**Time:** 2 hours setup  
**Save:** $2,000/month per client

### 4. UKG Dimensions (Workday Kronos)
**Pain:** Scheduling rules changed, need updates fast  
**Twinthos Fix:** AI robot checks schedule daily → flags violations → auto-corrects  
**Time:** 3 hours  
**Risk Avoid:** $1M wage theft fines

### 5. QuickBooks Payroll Desktop
**Pain:** Year-end cleanup = 12 hours/accountant  
**Twinthos Fix:** AI robot cleans data → finds missing entries → fixes  
**Time:** 90 min  
**Save:** $500/client

### 6. Gusto Payroll
**Pain:** Rate limits, can't process bulk changes  
**Twinthos Fix:** AI robot batches changes overnight → updates payroll  
**Time:** 1 hour  
**Save:** $2,500/client/year

### 7. BambooHR
**Pain:** Annual benefits enrollment = 2 weeks admin  
**Twinthos Fix:** AI robot pulls employee data → updates benefits → confirms  
**Time:** 3 hours  
**Save:** $1,500/client/qtr

### 8. Zenefits HRIS
**Pain:** No bulk API for new hires  
**Twinthos Fix:** AI robot creates 100 employee profiles in 2 hours  
**Time:** 90 min  
**Save:** $3,000/year hiring cycle

### 9. Workday HCM (Enterprise)
**Pain:** Expensive partners, slow changes  
**Twinthos Fix:** AI robot makes HR updates → pushes to Workday  
**Time:** 4 hours  
**Save:** $10,000/engagement

### 10. Rippling
**Pain:** No public developer API — no official route to sync employee, payroll or benefits data out.  
**Twinthos Fix:** Screen bot connects tools via UI actions (no API available)  
**Time:** 2 hours/setup

> **CORRECTION (21 Oct 2026):** an earlier version of this file claimed Rippling charges
> "$0.10 per API call = $500/month". That is **false**. Rippling has no public developer API,
> and App Shop listing costs the partner nothing. See `legacy-hr-deep-research.md`.

---

## How Twinthos Makes Money — SUPERSEDED

> These figures were **estimated, not researched**, and the profit column double-counted.
> Market list price for a hosted unattended bot is **~$215/month** (Power Automate Hosted
> Process). So price against the **salary you replace**, not the bot you install.
> Use the labour-cost method in `legacy-hr-deep-research.md` section 5.

| Client Size | Monthly Price | Target Clients | Monthly Revenue |
|---|---|---|---|
| SMB (10-500 staff) | $5,000 | 5 | $25,000 |
| Mid-market (500-5K) | $10,000 | 3 | $30,000 |
| Enterprise (5K+) | $15,000 | 2 | $30,000 |
| **Total** | | | **$85,000/month** |

---

## Action Plan

### Week 1: Proof of Concept
1. Reach out to 3 Paycom users in Bristol
2. Demo: Fix payroll bonus in 40 minutes
3. Close: First 2 SMB clients

### Week 2: Build Templates
1. Paycom template (payroll fixes)
2. ADP template (time tracking)
3. UKG template (scheduling)

### Week 3: Sales Push
1. LinkedIn outreach to HR directors
2. Case study: "Saved £5,000 in 2 hours"
3. Web demo for Bristol tech meetup

---

## Key Message for Prospects

> "Your HR software cost $100K and takes 6 months. Our AI agent works in 2 hours. Try both ways."

---

## Takedown Code (Orgo Terminal)

```bash
# Start screen robot for any HR system
orgo desktop-launch client-hr-system
hermes spawn "screen-bot" \
  --task "fix-payroll" "extract-data" "update-schedule" \
  --timeout 60m

# Profit: $5K/month/client
```

---

*Updated: 2026-10-21*  
*Purpose: Simple field guide for HR outreach*  
*Next: Add 10 more targets: medical software, legal software, finance software*