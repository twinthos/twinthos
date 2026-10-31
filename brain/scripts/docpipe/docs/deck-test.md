[Twinthos · Deck pipeline test]{.kick}

# Where the work is.<br>Six sectors, named.

[Machine test of the deck builder at both ratios.]()

---

## The rule

- **One job per slide.** If it needs scrolling it is two slides.
- **Named companies only.** A list of sectors is not a list.
- Numbers carry their source or they do not appear.

---

## What the gate checks

| Check | Threshold |
|---|---|
| Slide overflow | 0px below the frame |
| Body contrast | 4.5:1 on #08090A |
| Type floor | 9pt |
| Links | at least one |
| Metadata | Title + Author |
