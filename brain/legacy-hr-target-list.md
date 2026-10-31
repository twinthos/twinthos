# Legacy HR Software Target List — For Screen-Based Digital Employees

## The Nick Vasilescu Insight

**Post:** https://x.com/nickvasilescu/status/2112695455024832574

**The Problem:**
- Paycom HR workflow: 40 minutes via screen automation
- Official API: 6+ months vendor review + $50K+ in fees
- Most legacy back-office software: No clean public APIs

**The Opportunity:**
Give the agent a screen → bypass API hell → deploy in hours, not months.

---

## Target Companies — Legacy HR/Payroll Systems

### Tier 1: Major Legacy HR Vendors (500K+ employees total)

| Company | HR System | API Pain | Twinthos Angle |
|---|---|---|---|
| **ADP** | RUN, Mobile, Workforce Now | Partner API = 4-6 months, $100K+ | Screen robot for time-tracking, payroll export |
| **Paychex** | Paychex Flex | API requires 90-day review + $25K | Screen bot for invoice processing, compliance reports |
| **Paycom** | Everything | 6-month API freeze typical | Deploy 40-min automated workflows (see Nick's test) |
| **Ultimate Software** (UKG) | Dimensions, Pro | API v2 deprecated, legacy SOAP | Screen-based attendance, scheduling bot |
| **Kronos** | Dimensions, Workforce Central | IBM acquisition = API delays | Payroll reconciliation screen automation |

### Tier 2: Mid-Market Payroll Leaders (100K+ employees)

| Company | System | API Pain | Twinthos Angle |
|---|---|---|---|
| **QuickBooks Payroll** | Desktop/Online | No API for batch operations | Screen bot for data cleanup, reporting |
| **Gusto** | Payroll | API rate limits, no bulk edits | Payroll correction workflows via automation |
| **Zenefits** | HRIS | API approval required for new integrations | Employee onboarding robot |
| **BambooHR** | HRIS | Limited API scope | Screen-based report generation, benefits admin |
| **Rippling** | HRIS | API costs scale per endpoint | Automation for admin-heavy tasks |

### Tier 3: Enterprise HR Suites (10K+ employees each)

| Company | System | API Pain | Twinthos Angle |
|---|---|---|---|
| **Workday** | HCM | API requires certified partner | HR data reconciliation screen bot |
| **Oracle HCM** | Cloud HCM | Complex auth, slow deployment | Payroll audit trail automation |
| **SAP SuccessFactors** | HXM | API onboarding 90+ days | Employee data quality checks via screen |
| **Cornerstone** | OnDemand | API limited to read | Learning compliance tracking bot |
| **Saba** | Cloud | API deprecated v1, v2 unstable | Succession planning data extraction |

---

## Twinthos Implementation Examples

### Example 1: ADP RUN Payroll Fix

**The Problem:** Client's ADP RUN portal has a bug where Q4 bonuses don't calculate.

**Twinthos Solution:**
- Deploy digital employee with Orgo desktop access
- Screen bot navigates to Payroll → Bonuses
- Reads displayed values, compares to expected
- Generates correct bonus file
- Emails corrected file to payroll

**Takedown Time:** 2 hours  
**ADP API Route:** 5 months + $100K certification  
**Twinthos ROI:** Pay for itself in 1 month

---

### Example 2: Paychex Invoice Processing

**The Problem:** Client spends 40 hours/month manually entering vendor invoices.

**Twinthos Solution:**
- Digital employee with email + screen access
- Receives invoice PDF, opens Paychex portal
- Navigates to Expenses → Add Invoice
- Fills fields via screen automation
- Submits, sends confirmation to AP team

**Takedown Time:** 3 hours  
**Manual Process:** 40 hours/month = $2,000  
**Twinthos Savings:** $24,000/year

---

### Example 3: UKG Scheduling Compliance

**The Problem:** UKG Dimensions scheduling changes require 2-day review.

**Twinthos Solution:**
- Digital employee monitors UKG portal daily
- Compares schedule to legal requirements
- Flags violations (max hours, break timing)
- Auto-generates corrective schedule

**Takedown Time:** 4 hours  
**Compliance Risk:** $1M fines for wage theft violations  
**Twinthos Value:** Risk mitigation

---

### Example 4: QuickBooks Desktop Cleanup

**The Problem:** QuickBooks Desktop year-end cleanup missing 2023 entries.

**Twinthos Solution:**
- Screen bot automates month-by-month reconciliation
- Identifies missing transactions via variance reports
- Generates journal entries for correction
- Email summary to CFO

**Takedown Time:** 90 minutes  
**Manual Cleanup:** 12 hours/accountant  
**Twinthos Leverage:** Handle 10 clients simultaneously

---

## Takedown Script Template

```bash
# Typical Twinthos deployment for legacy HR screens
orgo desktop-launch client-company
hermes spawn "twinthos-hr-bot" \
  --target-screen "Paycom Payroll Portal" \
  --tasks "extract-data" "reconcile-values" "export-report" \
  --timeout 30m
```

**Average deployment:** 60-90 minutes  
**Client value:** $5K/month saved

---

## Why This Works

1. **No vendor dependency** — Skip 6-month API approval cycles
2. **Faster deployment** — 2 hours vs 6 months
3. **Lower barrier to entry** — $5K/month vs $100K certification fees
4. **Immediate ROI** — Human hours saved in week 1

---

## Next Steps for Twinthos

**Week 1:** Contact 5 Paycom users → demo 40-min workflow  
**Week 2:** Build template library (ADP, Paychex, UKG)  
**Month 1:** Publish case studies → target 50 HR leaders in Bristol tech scene