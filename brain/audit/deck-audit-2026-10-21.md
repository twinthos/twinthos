# Deck audit — `twinthos-targets-full.pdf` (the 52-page book)

Measured on the file that was sent to Telegram. Every figure below was produced
by a command; the command is named beside it.

## The numbers

| Measure | Result | How |
|---|---|---|
| Pages | 53 | `pdfinfo` |
| Words | 8,473 | `pdftotext -layout` + regex |
| Density | 160 words per page | words ÷ pages |
| Reading time at 200 wpm | **42 minutes** | words ÷ 200 |
| Clickable source links | **0** | search for `http` in the text layer |
| Duplicated table headers | **9** | adjacent identical `FIRM …` lines |
| Flesch Reading Ease (prose) | **38** ("difficult") | prose-only lines, column layout excluded |
| Flesch–Kincaid grade | **13.5** (university) | same |
| Average sentence | 22.1 words | same |
| Sentences over 30 words | **44** | same |
| Separate prices quoted | 4 (£750, £1,500, £5,000, £60,000) | `£` frequency |
| Times £60,000 appears | 11 | same |

The gate passed this document: 52 pages, all above 49% fill, weakest contrast
5.39:1, type ladder clean. The gate measures geometry. It cannot see any of the
following, which is why they shipped.

## What is wrong, plainly

**1. It is a research file wearing a pitch's clothes.** 8,473 words is a
42-minute read. Nobody gives 42 minutes to a supplier they have not met. The
first nine pages argue a market; the register starts on page 10. A buyer who
wants to know what you do for them has to reach page 30.

**2. There are no clickable sources.** Zero. In a document whose whole argument
is "these firms are real and these people are named", the reader cannot click
anything to check. Every claim costs the reader a manual search. That is the
opposite of what a trust business should make easy.

**3. The sentences are too long for the medium.** Reading ease 38, grade 13.5,
22 words a sentence, 44 sentences over 30 words. This is the single clearest
finding in the audit: the copy is written for a reader who is already convinced,
and it is being sent to someone who is not.

**4. It contradicts itself on price.** Four prices appear — £750, £1,500,
£5,000 and £60,000 — and £60,000 is repeated 11 times. `company/pricing.md`
contains none of the £1,500. A document that disagrees with itself tells the
reader the seller has not decided, and a seller who has not decided cannot ask
for a decision.

**5. Nine broken table headers.** On page breaks, `FIRM / THE REPEATING JOB /
WHO TO CALL` repeats immediately below itself. It reads as a layout fault, and
it is one.

**6. The book is not the thing that opens the door.** It does the job of a
leave-behind: after a call, when the reader has a reason. Sent cold, it asks for
an hour before it has earned a minute.

## What replaces it

| Moment | Document | Length |
|---|---|---|
| First contact | **The one page to send** — one job, what goes in, what comes out, what it must never do, the two-week test, the price | 1 page |
| After the first call | The job sheet, written for their job, with their numbers | 2 pages |
| After they ask "who else" | The next door book, section for their trade only | 6–8 pages |
| After they ask about price | The price page with the evidence table | 1 page |
| Never | The 52-page book, cold | — |

The 52-page book still has a use: it is your working file and your proof of
diligence. Keep it. Do not send it first.

## What the rewrite did

The book in `2026-10-21_twinthos_nextdoor.pdf` was built to a different standard:

- **Copy:** measured on the 2,435 words of narrative (tables and firm records
  excluded): average sentence 13.1 words, Flesch reading ease 64 ("plain
  English", grade 7.6), four sentences over 30 words. The old book: 22.1 words,
  ease 38, grade 13.5, 44 long sentences.
- **Firms as blocks, not tables:** at the house 15pt body size a four-column
  table squeezes a cell to about fifteen characters. Blocks paginate and read.
- **Every name is a link** to the page the fact came from, and 77 of the 80
  named people were re-checked by opening the cited page and looking for the
  surname.
- **One price ladder**, stated once, with the external evidence beside it.
- **A verdict on each sector**, including what would make the thesis wrong.

## The rule this audit sets

Before any document leaves this machine for a buyer:

1. One job named in the first paragraph, or it does not go out.
2. Average sentence under 15 words. Reading ease above 50. Enforced by script.
3. Every claim that a reader might doubt carries a clickable link.
4. One price, one ladder, no contradictions with `company/pricing.md`.
5. Under 8 pages unless the reader asked for more.
