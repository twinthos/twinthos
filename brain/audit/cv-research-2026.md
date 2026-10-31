# Modern CV: what the evidence actually says (researched 29 Oct 2026)

Sources are named inline. Where a widely-repeated statistic turned out to have no
study behind it, that is recorded too — repeating it would be the same failure as
printing an unverifiable credential.

## 1. How long you get

| Finding | Number | Source |
|---|---|---|
| Time to decide "worth a closer look" | ~30 seconds | Jobseeker, 1,013 HR professionals, 59 countries (2025–26) |
| Average initial scan | 11.2 seconds | InterviewPal 2025, 4,289 anonymised reviews, 312 recruiters (US/UK/SEA) |
| Share of scan time on six items: name, current title+company, previous title+company, dates, education, layout | 80% | TheLadders eye-tracking study |
| Recruiters who open work experience before anything else | 82.6% | Jobseeker 2025 |
| Recruiters who look at education first | 37.7% | Jobseeker 2025 |

**Consequence:** the job title, the current employer and the first two bullets carry the
application. Everything below the top third is read only if those work.

## 2. What recruiters reward

- 98.7% value quantifiable achievements; 80.1% prefer bullets to paragraphs (Jobseeker 2025).
- 94.5% want reverse-chronological history (Jobseeker 2025).
- 98.8% value clean, consistent formatting; 96.6% say formatting influences the decision,
  30.1% call it significant (Jobseeker 2025).
- 72% say inconsistent spacing or alignment weakens an application; 62% say an
  over-designed CV hurts their perception of the candidate (Resume Genius 2026).
- 90% say a clear summary helps them evaluate faster (Resume Genius 2026).
- 80% say they can often tell when a CV was written by AI, and it counts against it
  (Resume Genius 2026). Write in the candidate's own voice; name tools inside real work
  instead of listing "AI/ML" as a skill line.

## 3. Format: the ATS question, answered honestly

- 76.3% of recruiters use an ATS at least occasionally; 73% filter on experience level,
  64.9% on hard skills, 59.2% on previous titles (Jobseeker 2025).
- **"75% of CVs are rejected by ATS" is not a real statistic.** It traces to Preptel, a
  vendor that shut down in 2013 and never published a method. Enhancv's 2025 study of 25
  recruiters across 10+ ATS platforms found 92% do not auto-reject on content or
  formatting; 8% do. Systems rank and sort, so a low rank is functionally a rejection.
- Parsing failure by format (EDLIGO 2025, 1,000 rejected CVs across Workday, Taleo,
  Greenhouse): plain DOCX ~4%, PDF with heavy styling ~18%, tables and multi-column
  layouts 31%+.
- Single-column parses at ~93% accuracy vs ~86% for two columns; ~25% of ATS skip
  content placed in a document header or footer.

**Consequence:** ship a clean single-column PDF *and* an identical DOCX. Real text, no
tables, no text boxes, contact details in the body.

## 4. Length and paper

- 82.1% say 1–2 pages is ideal; 51% prefer exactly two; 31.1% prefer one (Jobseeker 2025).
- 68.5% of recruiters preferred two pages vs 21.7% one page (Novoresume survey, 203 recruiters).
- UK norm: two pages for anyone with 3+ years of experience; three only for clinical,
  academic or very senior executive tracks (jobs.ac.uk, UK CV guides 2026).
- 76.8% want a PDF; 12% want Word (Jobseeker 2025). Send both anyway — the DOCX is for
  the parser, the PDF is what a human opens.

## 5. Type and layout standards that survive both readers

| Element | Standard | Where it comes from |
|---|---|---|
| Body | 10–11pt, line-height ~1.3–1.4 | UK ATS guides (Cvedo, Atlas Job, salarytax.uk 2026) |
| Section headings | 12–14pt bold, standard words | same |
| Name | 16–24pt, top left | salarytax.uk 2026 |
| Margins | 15–25mm | jobs.ac.uk, Indeed UK |
| Font | classic sans or serif (Arial, Calibri, Helvetica, Georgia) | 59% of recruiters prefer classic faces (Jobseeker 2025) |
| Columns | one | EDLIGO parsing data, Cvedo, Atlas Job |
| Headings to use | Summary, Key skills, Work experience, Education, Certifications | Atlas Job, Cvedo — non-standard headings ("About me", "Career statement") are missed by Taleo and iCIMS |

## 6. What belongs on a UK CV in 2026

Include: name, one contact line (email, city, portfolio), 3–4 line summary, a skills
list matching the advert's vocabulary, reverse-chronological roles with 3–6 achievement
bullets each, education/certifications where verified, and links that resolve.

Leave out: photo, date of birth, age, marital status, nationality, full street address,
skill bars or star ratings, graphics, references list ("available on request" only).

## 7. What this means for this CV (design decision)

1. **A4, two pages, single column, no tables anywhere in the output.** Every label that
   used to sit in a table cell becomes a heading line; the text layer stays linear.
2. **Body 10.2pt Inter, 1.4 line-height, 18mm margins.** The previous edition ran 9.1pt
   in places, under the 10pt floor the UK guides and the CV skill both set.
3. **Standard section words**, 9.5pt bold with a hairline above. No uppercase micro-labels
   at 6.5pt with .28em tracking, which is a text-layer risk and reads as template.
4. **Numbers in the bullets**, plus one metric line (not a four-cell table) so a parser
   reads it as a sentence.
5. **Contact in the body**, one line: city · email · site · GitHub. The email is
   `twinthos@agentmail.to`, verified live on 29 Oct 2026 (inbound from an outside sender
   and outbound both confirmed). `hello@twinthos.com` is not on the site and is not
   printed until it is routed.
6. **Cormorant name + Inter body retained** — the house style survives the readability
   correction; nothing else about the previous design was kept for its own sake.
7. **DOCX twin rebuilt from the same JSON**, Arial 11pt, standard headings, zero
   formatting tricks — this is the file an ATS is most likely to parse cleanly.
