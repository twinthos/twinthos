::: {.cover-block}
::: {.kick}
Twinthos · Pipeline smoke test · 21 October 2026
:::

# Paged<br>by<br>measurement

::: {.bar}
:::

::: {.lead}
Every block is measured before it is placed. Nothing is clipped, nothing is guessed.
:::
:::

## What this proves {#what}

The paginator packs blocks by measured height, never splits a box or a table, and
keeps a heading with the block that follows it. Page numbers are written after
layout, so a cross-reference is always true. See page {{ref:profit}} for the
worked example.

::: {.box}
::: {.label}
Killed
:::

**The old pipeline could drop content silently.** `overflow:hidden` on a fixed
297mm page has no error path: the text simply stops.
:::

## The worked example {#profit}

| Line | Value |
|---|---|
| Revenue at 1,000 units × £300 | £300,000 |
| Pre-tax profit at 10% | £30,000 |
| Annual fee at £2,500/mo | £30,000 |

::: {.footnote}
Sources: [legislation.gov.uk](https://www.legislation.gov.uk/uksi/2023/315/pdfs/uksi_20230315_en.pdf),
[MRI Agora Orchestrator](https://mrisoftware.com/news).
:::

## Long table, split at rows {#long}

| Company | Signal | Fee |
|---|---|---|
| Hurley | named contact | £5,000 |
| Hipkiss | named contact | £5,000 |
| Ashby | named contact | £5,000 |
| Brent | named contact | £5,000 |
| Cole | named contact | £5,000 |
| Dale | named contact | £5,000 |
| Ellis | named contact | £5,000 |
| Frost | named contact | £5,000 |
| Grant | named contact | £5,000 |
| Hayes | named contact | £5,000 |
| Ingram | named contact | £5,000 |
| Jones | named contact | £5,000 |
| Kerr | named contact | £5,000 |
| Lowe | named contact | £5,000 |
| Marsh | named contact | £5,000 |
