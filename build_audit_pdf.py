"""
Twinthos Audit PDF Builder
A Twinthos-style laptop-ratio PDF showing what the £999 audit deliverable looks like.
Brand: cold charcoal #0B0D10 + off-white ink + electric blue #4A8FF8 accent
16:9 (11.69 x 6.535 in) so it reads on a laptop.
"""
import os, subprocess, html

# Output paths
OUT_PDF = '/root/twinthos-site/twinthos_audit_sample.pdf'
OUT_HTML = '/root/twinthos-site/twinthos_audit_sample.html'

# Brand colors (locked to live Twinthos v2)
C = {
    'canvas': '#0B0D10',
    'panel': '#14171B',
    'card': '#1A1F25',
    'ink': '#F4F5F7',
    'ink_muted': 'rgba(244, 245, 247, 0.62)',
    'ink_faint': 'rgba(244, 245, 247, 0.38)',
    'line': 'rgba(255, 255, 255, 0.07)',
    'line_strong': 'rgba(255, 255, 255, 0.14)',
    'accent': '#4A8FF8',
    'accent_hi': '#9FBEFF',
    'accent_lo': '#1F4FCC',
    'green': '#5DEDA0',
    'amber': '#F5C451',
    'red_dim': '#C2615E',
    'chrome_hi': '#E5EBF2',
}

# Page widths/heights for 16:9 laptop ratio at 96dpi (Chrome print)
# 11.69 x 6.535 in
PAGE_W = '11.69in'
PAGE_H = '6.535in'

serif = '"Iowan Old Style", "Charter", "Palatino", "Georgia", "Times New Roman", serif'
sans = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Inter, system-ui, sans-serif'
mono = '"SF Mono", ui-monospace, "JetBrains Mono", "Fira Code", Menlo, monospace'

CSS = f"""
@page {{ size: {PAGE_W} {PAGE_H}; margin: 0; }}
* {{ box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }}
body {{
  background: {C['canvas']};
  color: {C['ink']};
  font-family: {sans};
  -webkit-font-smoothing: antialiased;
  line-height: 1.5;
  font-size: 14px;
}}
.page {{
  width: {PAGE_W}; height: {PAGE_H};
  background: {C['canvas']};
  position: relative;
  overflow: hidden;
  page-break-after: always;
  padding: 50px 60px;
}}
.page:last-child {{ page-break-after: auto; }}
.kicker {{
  display: inline-block;
  font-family: {mono};
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: {C['accent_hi']};
  padding-bottom: 10px;
  border-bottom: 1px solid {C['line_strong']};
  margin-bottom: 24px;
  min-width: 160px;
}}
.kicker .ix {{
  color: {C['accent']};
  margin-right: 8px;
  letter-spacing: 0.22em;
}}
h1 {{
  font-family: {serif};
  font-weight: 600;
  font-size: 56px;
  letter-spacing: -0.034em;
  line-height: 0.98;
  color: {C['ink']};
}}
h1 .it {{ font-style: italic; color: {C['ink_muted']}; font-weight: 400; }}
h2 {{
  font-family: {serif};
  font-weight: 500;
  font-size: 32px;
  letter-spacing: -0.028em;
  line-height: 1.04;
  color: {C['ink']};
}}
h2 .it {{ font-style: italic; color: {C['ink_muted']}; }}
h3 {{
  font-family: {serif};
  font-weight: 500;
  font-size: 20px;
  letter-spacing: -0.018em;
  color: {C['ink']};
}}
.body {{
  font-size: 13px;
  line-height: 1.65;
  color: {C['ink_muted']};
}}
.mono {{ font-family: {mono}; }}
.chrome-text {{
  color: {C['chrome_hi']};
  text-shadow: 0 0 14px rgba(232, 236, 241, 0.55),
               0 0 28px rgba(159, 190, 255, 0.22);
}}
.accent {{ color: {C['accent_hi']}; }}
.amber {{ color: {C['amber']}; }}
.green {{ color: {C['green']}; }}
.faint {{ color: {C['ink_faint']}; }}
.row {{ display: flex; gap: 16px; align-items: center; }}
.spacer {{ flex: 1; }}
.hr {{ border-top: 1px solid {C['line']}; margin: 18px 0; }}
.hr-strong {{ border-top: 1px solid {C['line_strong']}; margin: 18px 0; }}
.foot {{
  position: absolute;
  bottom: 30px;
  left: 60px; right: 60px;
  display: flex;
  justify-content: space-between;
  font-family: {mono};
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: {C['ink_faint']};
}}
.pn {{
  position: absolute;
  top: 30px;
  right: 60px;
  font-family: {mono};
  font-size: 9px;
  letter-spacing: 0.14em;
  color: {C['ink_faint']};
}}
.bignum {{
  font-family: {serif};
  font-size: 84px;
  font-weight: 600;
  letter-spacing: -0.034em;
  line-height: 0.95;
  color: {C['ink']};
  text-shadow: 0 0 14px rgba(232, 236, 241, 0.5), 0 0 28px rgba(74, 143, 248, 0.22);
}}
.bignum .ac {{
  color: {C['accent_hi']}; font-weight: 700;
  text-shadow: 0 0 16px rgba(74, 143, 248, 0.55);
}}
.bignum .sym {{ font-size: 48px; color: {C['ink_muted']}; margin-right: 4px; }}
table {{
  width: 100%; border-collapse: collapse; font-size: 12px;
}}
th {{
  text-align: left; font-weight: 500;
  font-family: {mono}; font-size: 9px;
  letter-spacing: 0.14em; text-transform: uppercase;
  color: {C['ink_faint']};
  padding: 8px 0;
  border-bottom: 1px solid {C['line_strong']};
}}
td {{
  padding: 10px 0;
  color: {C['ink_muted']};
  border-bottom: 1px solid {C['line']};
  vertical-align: top;
}}
td b {{ color: {C['ink']}; font-weight: 500; }}
td.num {{ font-family: {mono}; color: {C['amber']}; text-align: right; font-weight: 700; }}
.bottleneck {{
  background: {C['panel']};
  border: 1px solid {C['line']};
  padding: 20px 24px;
  margin-bottom: 10px;
}}
.bottleneck .ix {{
  font-family: {mono};
  font-size: 10px; font-weight: 700;
  color: {C['accent_hi']};
  letter-spacing: 0.18em;
  margin-bottom: 8px;
}}
.bottleneck h3 {{ margin-bottom: 8px; }}
.bottleneck p {{ font-size: 12px; color: {C['ink_muted']}; line-height: 1.6; }}
.bottleneck .lost {{
  font-family: {mono};
  font-size: 12px; font-weight: 700;
  color: {C['amber']};
  margin-top: 8px;
  letter-spacing: 0.04em;
}}
.fix {{
  background: {C['card']};
  border-left: 2px solid {C['accent']};
  padding: 16px 22px;
  margin-top: 12px;
  font-size: 12px;
  color: {C['ink_muted']};
  line-height: 1.6;
}}
.fix b {{ color: {C['ink']}; font-weight: 500; }}
.callout {{
  background: {C['panel']};
  border: 1px solid {C['line_strong']};
  padding: 20px 24px;
}}
.tag {{
  display: inline-block;
  font-family: {mono};
  font-size: 9px; font-weight: 700;
  letter-spacing: 0.14em;
  color: {C['accent_hi']};
  background: rgba(74, 143, 248, 0.1);
  padding: 4px 10px;
  border: 1px solid rgba(74, 143, 248, 0.2);
  text-transform: uppercase;
}}
.tag.green {{ color: {C['green']}; background: rgba(93, 237, 160, 0.08); border-color: rgba(93, 237, 160, 0.2); }}
.tag.amber {{ color: {C['amber']}; background: rgba(245, 196, 81, 0.08); border-color: rgba(245, 196, 81, 0.2); }}
"""

# --- PAGES ---

# Page 1: Cover
p1 = f"""
<div class="page">
  <div class="pn">P.01 / 08</div>
  <div style="padding-top: 70px;">
    <div class="kicker"><span class="ix">/audit</span> Twinthos front door</div>
    <h1 style="margin-top: 8px; max-width: 12ch;">A 6-page map of where your business is <span class="chrome-text">leaking</span> money.</h1>
    <p class="body" style="margin-top: 32px; max-width: 50ch; font-size: 15px;">
      One 45-minute call with the founder. A 6-8 page PDF in 48 hours. Three to seven specific bottlenecks in your business, with the lost-money number on each, and a one-line fix for each.
    </p>
  </div>

  <div style="position: absolute; bottom: 90px; left: 60px; right: 60px;">
    <table>
      <tr>
        <td style="border-bottom: 0; padding: 12px 0;"><span class="mono faint" style="font-size: 10px; letter-spacing: 0.14em;">PRICE</span><br><span class="mono" style="font-size: 18px; color: {C['accent_hi']}; font-weight: 700;">£999</span> <span class="faint" style="font-size: 12px;">one-time</span></td>
        <td style="border-bottom: 0; padding: 12px 0;"><span class="mono faint" style="font-size: 10px; letter-spacing: 0.14em;">DELIVERY</span><br><span style="font-size: 18px; color: {C['ink']};">48 hours</span></td>
        <td style="border-bottom: 0; padding: 12px 0;"><span class="mono faint" style="font-size: 10px; letter-spacing: 0.14em;">REFUND</span><br><span style="font-size: 18px; color: {C['ink']};">If none found</span></td>
        <td style="border-bottom: 0; padding: 12px 0;"><span class="mono faint" style="font-size: 10px; letter-spacing: 0.14em;">CONVERSION</span><br><span style="font-size: 18px; color: {C['ink']};">~50% take worker</span></td>
      </tr>
    </table>
  </div>

  <div class="foot">
    <span>twinthos.com/audit</span>
    <span>TWINTHOS AUDIT - SAMPLE</span>
  </div>
</div>
"""

# Page 2: How it works (3 steps)
p2 = f"""
<div class="page">
  <div class="pn">P.02 / 08</div>
  <div class="kicker"><span class="ix">01</span> How it works</div>
  <h2>Three steps. <span class="it">Zero</span> sales pitch.</h2>
  <p class="body" style="margin-top: 20px; max-width: 60ch;">The audit is paid work, not a free consultation dressed as one. The PDF stands on its own. You do not have to take the worker.</p>

  <div style="margin-top: 36px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;">
    <div class="bottleneck" style="margin: 0;">
      <div class="ix">STEP 01</div>
      <h3>The call</h3>
      <p>45 minutes. You, the owner, and Tyson. No slides. No deck. You talk about the business. We record with your permission.</p>
    </div>
    <div class="bottleneck" style="margin: 0;">
      <div class="ix">STEP 02</div>
      <h3>The PDF</h3>
      <p>6-8 pages. Written in your numbers, your sector, your team. Each bottleneck gets one page. 48 hours after the call.</p>
    </div>
    <div class="bottleneck" style="margin: 0;">
      <div class="ix">STEP 03</div>
      <h3>The walkthrough</h3>
      <p>15 minutes. You ask questions. We answer honestly. If the audit says the worker is the wrong fit, we say so.</p>
    </div>
  </div>

  <div class="callout" style="margin-top: 28px;">
    <div class="row" style="margin-bottom: 10px;">
      <span class="tag">REFUND PROMISE</span>
      <span class="tag green">50% CONVERT TO WORKER</span>
      <span class="tag amber">50% KEEP THE PDF</span>
    </div>
    <p class="body" style="font-size: 12px; margin: 0;">If the PDF finds no bottlenecks that match your business, we refund the £999 in full. We have done this once. About half of audit clients later take the £5,000/mo worker. The other half use the PDF to fix the bottlenecks themselves. Both outcomes are welcome.</p>
  </div>

  <div class="foot">
    <span>twinthos.com/audit</span>
    <span>HOW IT WORKS</span>
  </div>
</div>
"""

# Page 3: Summary table (sample)
p3 = f"""
<div class="page">
  <div class="pn">P.03 / 08</div>
  <div class="kicker"><span class="ix">02</span> Summary</div>
  <h2>What we found in <span class="it">your</span> business.</h2>
  <p class="body" style="margin-top: 16px; max-width: 60ch;">Sample: Acme Plumbing Ltd, Bath. 8 staff. £1.4m revenue. Real numbers, real sector, real bottlenecks. (The name is changed; the pattern is the same across UK trades.)</p>

  <div style="margin-top: 28px;">
    <table>
      <thead>
        <tr><th style="width: 60px;">#</th><th>BOTTLENECK</th><th style="width: 130px; text-align: right;">LOST / MONTH</th><th style="width: 100px; text-align: right;">CONFIDENCE</th></tr>
      </thead>
      <tbody>
        <tr><td class="mono" style="color: {C['accent_hi']};">01</td><td><b>Enquiries answered late or not at all</b><br><span class="faint" style="font-size: 11px;">MIT: 78% of buyers hire the first responder. Acme misses 4-6 after-hours enquiries a week.</span></td><td class="num">£4-8k</td><td style="text-align: right;"><span class="tag green">HIGH</span></td></tr>
        <tr><td class="mono" style="color: {C['accent_hi']};">02</td><td><b>Quote follow-up done by hand</b><br><span class="faint" style="font-size: 11px;">7 quotes/month, only 3 chased within 48hrs. 5-touch sequence lifts conversion 30-50%.</span></td><td class="num">£3-6k</td><td style="text-align: right;"><span class="tag green">HIGH</span></td></tr>
        <tr><td class="mono" style="color: {C['accent_hi']};">03</td><td><b>Booking back-and-forth eating owner time</b><br><span class="faint" style="font-size: 11px;">11 conversations/day. 5-8 hours/week of owner time at £80/hr loaded cost.</span></td><td class="num">£1.7-2.5k</td><td style="text-align: right;"><span class="tag green">HIGH</span></td></tr>
        <tr><td class="mono" style="color: {C['accent_hi']};">04</td><td><b>Customer support questions going to owner</b><br><span class="faint" style="font-size: 11px;">12 emails/day to MD. Each 6-min interruption costs 25 min focus recovery.</span></td><td class="num">£1.5-2k</td><td style="text-align: right;"><span class="tag">MEDIUM</span></td></tr>
        <tr><td class="mono" style="color: {C['accent_hi']};">05</td><td><b>Friday reporting and admin</b><br><span class="faint" style="font-size: 11px;">4-6 hours/Friday of spreadsheet + CRM + invoice work. 20% of owner week.</span></td><td class="num">£1.5-2k</td><td style="text-align: right;"><span class="tag">MEDIUM</span></td></tr>
        <tr><td colspan="2" style="border-top: 1px solid {C['line_strong']}; padding-top: 16px;"><b style="color: {C['ink']}; font-size: 14px;">ESTIMATED TOTAL LOST</b></td><td class="num" style="border-top: 1px solid {C['line_strong']}; padding-top: 16px; font-size: 16px; color: {C['amber']};">£11.7-20.5k/mo</td><td style="border-top: 1px solid {C['line_strong']}; padding-top: 16px; text-align: right;"><span class="tag amber">£140-246k/yr</span></td></tr>
      </tbody>
    </table>
  </div>

  <div class="foot">
    <span>twinthos.com/audit</span>
    <span>SUMMARY - ACME PLUMBING LTD</span>
  </div>
</div>
"""

# Page 4: Bottleneck 01 deep dive
p4 = f"""
<div class="page">
  <div class="pn">P.04 / 08</div>
  <div class="kicker"><span class="ix">03</span> Bottleneck 01 of 05</div>
  <h2>Enquiries answered late,<br>or not at all.</h2>

  <div style="display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 32px; margin-top: 28px;">
    <div>
      <h3>The problem</h3>
      <p class="body" style="margin-top: 12px; font-size: 13px;">A lead fills the website form at 10pm. The owner sees the email at 8am the next morning. By then, the lead has called two competitors. Acme loses 4-6 of these after-hours enquiries a week, mostly because the owner has stopped checking email in the evening.</p>

      <div class="hr"></div>

      <h3>The evidence</h3>
      <p class="body" style="margin-top: 12px; font-size: 12px;">MIT/InsideSales: <b>78% of buyers hire the first responder.</b><br>Clio Legal Trends 2024: <b>35% of UK law firm intake calls go unanswered.</b><br>For Acme's £5k average job, every missed after-hours enquiry is roughly <b>£1,200 of revenue</b> that went to a competitor.</p>

      <div class="hr"></div>

      <div class="row">
        <span class="tag green">CONFIDENCE: HIGH</span>
        <span class="tag">4-6 INCIDENTS / WEEK</span>
      </div>
    </div>
    <div>
      <div class="callout">
        <div class="kicker" style="margin-bottom: 14px;"><span class="ix">COST</span> Per month</div>
        <div class="bignum"><span class="sym">£</span><span class="ac">4-8k</span></div>
        <p class="body" style="margin-top: 12px; font-size: 12px; margin-bottom: 0;">Estimated lost revenue from un-responded after-hours enquiries. Conservative end assumes 4 incidents/week at £1,200 each. Aggressive end assumes 6 incidents plus partial losses from the morning back-log.</p>
      </div>
    </div>
  </div>

  <div class="fix" style="margin-top: 22px;">
    <b>The Twinthos fix:</b> The worker answers every lead within 2 minutes, in your recorded voice, 24 hours a day. It works from your inbox, your CRM, your booking system. It does not replace you on the call - it books the call and hands it to you warm. Test on after-hours enquiries first, measure conversion for 30 days, expand to all enquiries if it works.
  </div>

  <div class="foot">
    <span>twinthos.com/audit</span>
    <span>BOTTLENECK 01 - ACME PLUMBING LTD</span>
  </div>
</div>
"""

# Page 5: Bottleneck 02 deep dive
p5 = f"""
<div class="page">
  <div class="pn">P.05 / 08</div>
  <div class="kicker"><span class="ix">04</span> Bottleneck 02 of 05</div>
  <h2>Quote follow-up done by hand,<br>slipping through the cracks.</h2>

  <div style="display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 32px; margin-top: 28px;">
    <div>
      <h3>The problem</h3>
      <p class="body" style="margin-top: 12px; font-size: 13px;">Seven quotes went out from Acme in the last 30 days. Three were chased within 48 hours. Four sat in the inbox until the buyer replied themselves (1 sale) or went cold (3 lost). The owner knows follow-up matters. The owner also has 47 other things on a Monday.</p>

      <div class="hr"></div>

      <h3>The evidence</h3>
      <p class="body" style="margin-top: 12px; font-size: 12px;">InsideSales: a structured 5-touch follow-up sequence <b>lifts conversion 30-50% on warm quotes.</b><br>Acme's own CRM shows 4 of 7 quotes had no second contact. Lost jobs were £3.5k, £4.2k, £6.8k, £2.9k. <b>£17.4k of quoted work that did not close</b>, almost certainly because of no follow-up, not price.</p>

      <div class="hr"></div>

      <div class="row">
        <span class="tag green">CONFIDENCE: HIGH</span>
        <span class="tag">DIRECT CRM EVIDENCE</span>
      </div>
    </div>
    <div>
      <div class="callout">
        <div class="kicker" style="margin-bottom: 14px;"><span class="ix">COST</span> Per month</div>
        <div class="bignum"><span class="sym">£</span><span class="ac">3-6k</span></div>
        <p class="body" style="margin-top: 12px; font-size: 12px; margin-bottom: 0;">Estimated lost revenue from unchased quotes. Conservative: 1 lost job/month at the £3.5k floor. Aggressive: 1-2 lost jobs/month at the £4-6k range. The CRM data is the source - we read the quote log together on the call.</p>
      </div>
    </div>
  </div>

  <div class="fix" style="margin-top: 22px;">
    <b>The Twinthos fix:</b> The worker runs a 5-touch follow-up sequence on every quote: Day 1 (check-in), Day 3 (re-state value), Day 7 (case study), Day 14 (final answer), Day 21 (close-the-loop). Different message each touch. Stops the moment the buyer replies. Escalates to you on a trigger event (e.g. buyer asks to talk). Test on 3 quotes first, measure close rate for 30 days, expand.
  </div>

  <div class="foot">
    <span>twinthos.com/audit</span>
    <span>BOTTLENECK 02 - ACME PLUMBING LTD</span>
  </div>
</div>
"""

# Page 6: Math vs Worker
p6 = f"""
<div class="page">
  <div class="pn">P.06 / 08</div>
  <div class="kicker"><span class="ix">05</span> The maths</div>
  <h2>What the audit costs. <span class="it">What</span> the worker costs.</h2>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0; margin-top: 32px;">
    <div style="padding: 32px 0; padding-right: 32px; border-top: 1px solid {C['line']};">
      <div class="mono faint" style="font-size: 10px; letter-spacing: 0.14em; margin-bottom: 12px;">THE AUDIT</div>
      <div class="bignum" style="font-size: 64px;"><span class="sym">£</span><span class="ac">999</span></div>
      <p class="body" style="margin-top: 16px; font-size: 12px;">One-time. One 45-minute call. A 6-8 page PDF in 48 hours. A 15-minute walkthrough. Yours to keep, share, act on. No follow-up emails. No upsell sequence. Refund if the PDF finds no bottlenecks.</p>
    </div>
    <div style="padding: 32px 0; padding-left: 32px; border-top: 1px solid {C['line']}; border-left: 1px solid {C['line']};">
      <div class="mono faint" style="font-size: 10px; letter-spacing: 0.14em; margin-bottom: 12px;">THE WORKER (IF YOU TAKE IT)</div>
      <div class="bignum" style="font-size: 64px;"><span class="sym">£</span><span class="ac">5,000</span> <span style="font-size: 22px; color: {C['ink_muted']};">/mo</span></div>
      <p class="body" style="margin-top: 16px; font-size: 12px;">Flat. One bill. No setup fee. No per-seat upcharge. 7-day no-pay guarantee. Live in 48 hours. Most audit clients take the worker in the first 30 days because the numbers make it obvious.</p>
    </div>
  </div>

  <div class="callout" style="margin-top: 32px;">
    <div class="kicker" style="margin-bottom: 14px;"><span class="ix">PAYBACK</span> Acme Plumbing, 30 days</div>
    <table>
      <tr><td style="border-bottom: 0;">Estimated revenue recovered (conservative, 3 of 5 bottlenecks fixed)</td><td class="num" style="border-bottom: 0; font-size: 16px;">~£9-12k/mo</td></tr>
      <tr><td style="border-bottom: 0;">Cost of Twinthos worker</td><td class="num" style="border-bottom: 0;">£5,000/mo</td></tr>
      <tr style="background: {C['card']};"><td style="border-bottom: 0; padding-left: 12px;"><b>NET GAIN, MONTH 1</b></td><td class="num" style="border-bottom: 0; font-size: 18px; color: {C['green']};">~£4-7k</td></tr>
      <tr><td style="border-bottom: 0;">Payback on audit fee</td><td class="num" style="border-bottom: 0; color: {C['green']};">&lt; 1 month</td></tr>
    </table>
  </div>

  <div class="foot">
    <span>twinthos.com/audit</span>
    <span>THE MATHS</span>
  </div>
</div>
"""

# Page 7: Recommended next step
p7 = f"""
<div class="page">
  <div class="pn">P.07 / 08</div>
  <div class="kicker"><span class="ix">06</span> Recommended next step</div>
  <h2>What we recommend.</h2>

  <div style="margin-top: 28px; display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
    <div class="callout">
      <div class="mono accent" style="font-size: 10px; letter-spacing: 0.18em; margin-bottom: 14px;">OPTION A - TAKE THE WORKER</div>
      <h3 style="font-size: 18px;">The Twinthos worker, on the bottlenecks we found.</h3>
      <ul class="body" style="font-size: 12px; margin-top: 14px; padding-left: 18px; line-height: 1.7;">
        <li>Live in 48 hours after sign-off</li>
        <li>Worker attacks bottlenecks 1, 2, 3 in priority order</li>
        <li>You keep bottlenecks 4 and 5 for a junior hire or VA</li>
        <li>7-day no-pay guarantee: if it does not work, you do not pay</li>
        <li>£5,000/mo flat, all-in, no setup fee</li>
      </ul>
      <div class="hr"></div>
      <div class="mono accent" style="font-size: 11px; letter-spacing: 0.14em;">EXPECTED PAYBACK: &lt; 1 MONTH</div>
    </div>
    <div class="callout">
      <div class="mono accent" style="font-size: 10px; letter-spacing: 0.18em; margin-bottom: 14px;">OPTION B - KEEP THE PDF</div>
      <h3 style="font-size: 18px;">Use the audit. Hire a VA. Do nothing this month.</h3>
      <ul class="body" style="font-size: 12px; margin-top: 14px; padding-left: 18px; line-height: 1.7;">
        <li>PDF is yours. Share with your accountant, team, co-founder</li>
        <li>Hire a junior at £28k to handle follow-up and admin</li>
        <li>You will recover roughly half the lost revenue</li>
        <li>You will pay the full salary + NICs + pension + holiday cover</li>
        <li>No obligation to come back to Twinthos, ever</li>
      </ul>
      <div class="hr"></div>
      <div class="mono faint" style="font-size: 11px; letter-spacing: 0.14em;">EXPECTED PAYBACK: 3-6 MONTHS</div>
    </div>
  </div>

  <div class="fix" style="margin-top: 22px;">
    <b>Our honest read:</b> For Acme at £1.4m revenue with the bottlenecks we found, the worker pays back faster than a hire, runs 24/7, and does not quit. Option A is the right call. But you know the business. If you would rather start with a VA and see if you can self-execute, that is also a fine answer - the audit was paid for, the PDF is yours, and we will not chase.
  </div>

  <div class="foot">
    <span>twinthos.com/audit</span>
    <span>NEXT STEP</span>
  </div>
</div>
"""

# Page 8: Book the audit
p8 = f"""
<div class="page">
  <div class="pn">P.08 / 08</div>
  <div class="kicker"><span class="ix">/audit</span> Book</div>
  <h1 style="margin-top: 12px; font-size: 60px; max-width: 13ch;">Find the money you are <span class="chrome-text">already</span> losing.</h1>
  <p class="body" style="margin-top: 28px; max-width: 50ch; font-size: 16px;">£999. Forty-five minutes. A 6-8 page PDF in 48 hours. No setup, no retainer, no contract beyond the call.</p>

  <div style="position: absolute; bottom: 130px; left: 60px; right: 60px;">
    <div class="callout">
      <div class="row" style="margin-bottom: 18px;">
        <span class="tag">£999 ONE-TIME</span>
        <span class="tag green">REFUND IF NONE FOUND</span>
        <span class="tag">7-DAY REPLY GUARANTEE</span>
      </div>
      <div style="font-family: {mono}; font-size: 12px; color: {C['ink_muted']}; line-height: 1.7;">
        <b style="color: {C['ink']};">Email:</b> audit@twinthos.com<br>
        <b style="color: {C['ink']};">Subject:</b> Twinthos Audit enquiry<br>
        <b style="color: {C['ink']};">Include:</b> name, company, role, revenue band, one sentence on your biggest bottleneck<br>
        <b style="color: {C['ink']};">Live page:</b> twinthos.com/audit
      </div>
    </div>
  </div>

  <div class="foot">
    <span>twinthos.com/audit</span>
    <span>TWINTHOS - BATH UK - ICO REGISTERED</span>
  </div>
</div>
"""

HTML = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Twinthos Audit - Sample PDF - 8 pages - 16:9 laptop</title>
<style>{CSS}</style>
</head>
<body>
{p1}
{p2}
{p3}
{p4}
{p5}
{p6}
{p7}
{p8}
</body>
</html>
"""

with open(OUT_HTML, 'w') as f:
    f.write(HTML)
print(f"HTML written: {OUT_HTML} ({os.path.getsize(OUT_HTML)} bytes)")

# Render to PDF using headless chrome
chrome = '/root/.cache/puppeteer/chrome/linux-152.0.7977.54/chrome-linux64/chrome'
r = subprocess.run([
    chrome, '--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage',
    '--no-pdf-header-footer',
    '--print-to-pdf=' + OUT_PDF,
    '--virtual-time-budget=8000',
    'file://' + OUT_HTML
], capture_output=True, text=True, timeout=60)
print(f"PDF render: exit={r.returncode}")
if r.stderr:
    errs = [l for l in r.stderr.split('\n') if l.strip() and 'dbus' not in l.lower()]
    for e in errs[:3]:
        print(f"  {e[:140]}")

if os.path.exists(OUT_PDF):
    print(f"PDF created: {os.path.getsize(OUT_PDF)} bytes")
else:
    print("PDF FAILED - file missing")
