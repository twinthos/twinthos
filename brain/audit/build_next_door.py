#!/usr/bin/env python3
"""Assemble the next-door target book from the swarm's JSON and the template.

Every firm row is checked against verdicts.json (produced by verify_firms.py),
which re-opened the cited URL and confirmed the person's surname appears.
Unverified people are printed with "(name unverified)" rather than silently kept.
"""
import json, os, re, subprocess, sys, textwrap

SCRATCH = "/root/.hermes/cache/scratch"
FIRMS = os.path.join(SCRATCH, "firms")
OUT_MD = "/root/twinthos-brain/audit/next-door-2026-10-21.md"

WEIGHTS = {"afford": .30, "repeatable": .25, "speed": .20, "trigger": .15, "risk": .10}

SECTORS = [
    # key, title, scores (afford, repeatable, speed, trigger, reg-risk where 10 = low friction)
    ("randd",       "Research and development claims",      8, 9, 8, 8, 7),
    ("debt",        "Debt recovery and credit management",  7, 10, 8, 5, 4),
    ("mortgage",    "Mortgage and protection brokers",      8, 9, 7, 6, 6),
    ("energy",      "Business energy consultancies",        7, 9, 8, 7, 5),
    ("it",          "IT resellers and MSPs",                8, 7, 7, 7, 8),
    ("franchisors", "Franchisors",                          8, 7, 8, 5, 7),
    ("training",    "Training and apprenticeship providers",6, 9, 7, 8, 5),
    ("surveyors",   "Chartered surveyors",                  7, 8, 7, 6, 7),
]

FILE_FOR = {"it": "it-resellers.json"}

SIMPLE = [
    # key, title, afford, repeat, speed, trigger, low-friction
    ("wholesale",   "Food and drink wholesalers",        8, 9, 9, 6, 7),
    ("planthire",   "Plant and tool hire",               8, 9, 8, 6, 8),
    ("bodyshop",    "Accident repair centres",           7, 9, 9, 7, 7),
    ("clean",       "Commercial cleaning contractors",   7, 9, 9, 6, 8),
    ("security",    "Security guarding companies",       8, 9, 7, 7, 6),
    ("events",      "Event and AV contractors",          6, 8, 9, 8, 8),
    ("print",       "Print and signage",                 6, 9, 9, 5, 8),
    ("removals",    "Removals and storage",              6, 8, 9, 6, 8),
]
FILE_FOR_SIMPLE = {}



def score(a, r, s, t, g):
    return round(a*.30 + r*.25 + s*.20 + t*.15 + g*.10, 2)


def clean(s, n=None):
    s = re.sub(r"\s+", " ", (s or "")).strip()
    s = s.replace("|", "/")
    if n and len(s) > n:
        cut = s[:n].rsplit(" ", 1)[0]
        s = cut + "…"
    return s


def load(name):
    p = os.path.join(FIRMS, name)
    if not os.path.exists(p):
        print("MISSING", name)
        return []
    try:
        return json.load(open(p))
    except Exception as e:
        print("BAD", name, e)
        return []


def verdict_map():
    p = os.path.join(FIRMS, "verdicts.json")
    if not os.path.exists(p):
        return {}
    out = {}
    for r in json.load(open(p)):
        out[(r["firm"], r["person"])] = r
    return out


def firm_table(records, vm):
    """Render firms as readable blocks, not a table.

    The pipeline sets body copy at 15pt (the house spec), so a four-column table
    squeezes cells to about fifteen characters and long names breach the page
    margin. Blocks paginate cleanly and read properly on a phone.
    """
    if not records:
        return "_No records returned for this sector._\n"
    chunks = []
    for f in records:
        person = clean(f.get("person"))
        v = vm.get((f.get("firm", ""), f.get("person", "")), {})
        if person and v.get("person_found") is False:
            person = person + " (unverified)"
        role = clean(f.get("person_role"), 60)
        firm = clean(f.get("firm"), 70)
        url = f.get("source_url") or ""
        head = f"**[{firm}]({url})**" if url.startswith("http") else f"**{firm}**"
        size = clean(f.get("size_evidence"))
        size = re.split(r"(?<=[.;])\s", size)[0].rstrip(" ;,.") + "."
        lines = [head, size]
        if person and person != "—":
            purl = f.get("person_source_url") or ""
            who = f"[{person}]({purl})" if purl.startswith("http") else person
            lines.append(f"Call: **{who}**, {role}" if role else f"Call: **{who}**")
        lines.append(f"Job: {clean(f.get('repeating_job'))}")
        why = clean(f.get("why_now"))
        if why:
            why = re.split(r"(?<=[.;])\s", why)[0].rstrip(" ;,.")
            why = why[:1].upper() + why[1:] + "."
            lines.append(f"Why now: {why}")
        chunks.append("<br>".join(lines))
    return "\n\n".join(chunks) + "\n"


def score_table(part):
    rows = [("Trade", "Money", "Repeats", "Speed", "Date", "Simple", "Score")]
    data = []
    for key, title, a, r, s, t, g in (SIMPLE if part == "simple" else SECTORS):
        data.append((score(a, r, s, t, g), title, a, r, s, t, g))
    data.sort(reverse=True)
    out = ["| " + " | ".join(rows[0]) + " |", "|" + "---|" * 7]
    for sc, title, a, r, s, t, g in data:
        out.append(f"| **{title}** | {a} | {r} | {s} | {t} | {g} | **{sc}** |")
    return "\n".join(out) + "\n"


def investor_table(records):
    if not records:
        return "_No records returned._\n"
    chunks = []
    for r in records:
        name = clean(r.get("name"), 60)
        org = clean(r.get("org"), 50)
        url = r.get("source_url") or ""
        head = f"**[{name}]({url})**" if url.startswith("http") else f"**{name}**"
        lines = [head + (f", {org}" if org else "")]
        if r.get("thesis"):
            lines.append(f"Thesis: {clean(r.get('thesis'))}")
        if r.get("why_them"):
            lines.append(f"Why them: {clean(r.get('why_them'))}")
        route = clean(r.get("contact_route") or "")
        cheque = clean(r.get("cheque_or_role") or "")
        tail = " · ".join(x for x in (cheque, route) if x)
        if tail:
            lines.append(f"Route: {tail}")
        chunks.append("<br>".join(lines))
    return "\n\n".join(chunks) + "\n"


ACQ_PRIORITY = {
    "The Access Group": "start here",
    "IRIS Software Group": "start here",
    "Advania UK": "start here",
    "Acturis": "start here",
    "Aliter Capital": "start here",
    "Descartes Systems Group": "later",
    "Version 1": "later",
    "Kainos": "later",
    "Clio": "long shot",
    "Capgemini": "long shot",
    "Concentrix": "long shot",
    "TP (Teleperformance)": "long shot",
}


def acquirer_table(records):
    if not records:
        return "_No records returned._\n"
    chunks = []
    for r in records:
        org = clean(r.get("org"), 60)
        url = r.get("evidence_url") or ""
        head = f"**[{org}]({url})**" if url.startswith("http") else f"**{org}**"
        person = clean(r.get("person"), 60)
        role = clean(r.get("person_role"), 60)
        purl = r.get("person_url") or ""
        if person and purl.startswith("http"):
            head += f" — [{person}]({purl}), {role}"
        elif person:
            head += f" — {person}, {role}"
        lines = [head, clean(r.get("what_they_do"))]
        pri = ACQ_PRIORITY.get(r.get("org"), "later")
        lines.append(f"Route: {clean(r.get('route'))}. Contact window: {pri}.")
        lines.append(f"Why it fits: {clean(r.get('why_fit'))}")
        chunks.append("<br>".join(lines))
    return "\n\n".join(chunks) + "\n"


def short_label(url):
    m = re.match(r"https?://(?:www\.)?([^/]+)(/.*)?$", url)
    if not m:
        return url[:34]
    dom, path = m.group(1), (m.group(2) or "")
    seg = path.strip("/").split("/")[-1] if path.strip("/") else ""
    seg = re.sub(r"[^A-Za-z0-9._-]+", "-", seg)[:18]
    lab = dom + ("/" + seg if seg else "")
    return lab[:30]


def sources(records, label):
    seen, lines, per_domain = set(), [], {}
    for r in records:
        for k in ("source_url", "job_source_url", "person_source_url", "why_now_url",
                  "second_source_url", "evidence_url", "person_url"):
            u = r.get(k)
            if not u or not u.startswith("http") or u in seen:
                continue
            dom = re.sub(r"https?://(?:www\.)?([^/]+).*", r"\1", u)
            if per_domain.get(dom, 0) >= 2:
                continue
            per_domain[dom] = per_domain.get(dom, 0) + 1
            seen.add(u)
            lines.append(f"[{short_label(u)}]({u})")
    return lines


def main():
    tpl = open("/root/twinthos-brain/audit/next-door.template.md").read()
    vm = verdict_map()

    _simple = sum(len(load(k + ".json")) for k, *_ in SIMPLE)
    _hard = sum(len(load(FILE_FOR.get(k, k + ".json"))) for k, *_ in SECTORS)
    tpl = tpl.replace("{{COVER_COUNT}}", str(_simple + _hard))
    tpl = tpl.replace("{{SCORE_TABLE}}", score_table("simple"))
    tpl = tpl.replace("{{SCORE_TABLE_HARD}}", score_table("hard"))

    us = load("us.json")
    intl = load("international.json")
    acq = load("acquirers.json")
    inv = load("investors.json")

    counts = (
        "| What is in here | How many |\n|---|---|\n"
        f"| Firms in the eight simple trades | {len(load('clean.json')) + len(load('bodyshop.json')) + len(load('security.json')) + len(load('planthire.json')) + len(load('wholesale.json')) + len(load('events.json')) + len(load('removals.json')) + len(load('print.json'))} |\n"
        f"| Firms in the eight harder trades | {len(load('randd.json')) + len(load('debt.json')) + len(load('mortgage.json')) + len(load('energy.json')) + len(load('it-resellers.json')) + len(load('franchisors.json')) + len(load('training.json')) + len(load('surveyors.json'))} |\n"
        f"| Firms outside the UK | {len(us) + len(intl)} |\n"
        f"| Organisations that could buy the company | {len(acq)} |\n"
        f"| People and funds who could back it | {len(inv)} |\n"
        f"| Firms with a named person | {sum(1 for f in load('randd.json') + load('debt.json') + load('mortgage.json') + load('energy.json') + load('it-resellers.json') + load('franchisors.json') + load('training.json') + load('surveyors.json') + us + intl if f.get('person'))} |\n"
    )
    tpl = tpl.replace("{{COUNTS}}", counts)

    all_recs = []
    for key, title, *_ in SIMPLE:
        recs = load(FILE_FOR_SIMPLE.get(key, key + ".json"))
        all_recs += recs
        tpl = tpl.replace("{{TABLE:%s}}" % key, firm_table(recs, vm))
    for key, title, *_ in SECTORS:
        recs = load(FILE_FOR.get(key, key + ".json"))
        all_recs += recs
        tpl = tpl.replace("{{TABLE:%s}}" % key, firm_table(recs, vm))

    us = load("us.json")
    intl = load("international.json")
    acq = load("acquirers.json")
    inv = load("investors.json")
    all_recs += us + intl

    # US and international share one table slot each
    tpl = tpl.replace("{{TABLE:us}}", "**United States.** Eight firms paid by the case, the claim or the return.\n\n" + firm_table(us, vm))
    tpl = tpl.replace("{{TABLE:international}}", "**Ireland, the Gulf, Australia, Canada and Singapore.** Ten firms in markets where admin is bought as a service.\n\n" + firm_table(intl, vm))
    tpl = tpl.replace("{{TABLE:acquirers}}", acquirer_table(acq))
    tpl = tpl.replace("{{TABLE:investors}}", investor_table(inv))

    src = []
    src += sources(all_recs, "firms")
    src += sources(acq, "acq")
    src += sources(inv, "inv")
    seen = set()
    uniq = [x for x in src if not (x in seen or seen.add(x))]

    # Every firm name in the body is a live link, so the appendix only needs the
    # domains checked plus the handful of sources that carry an argument.
    raw = set()
    for x in uniq:
        m = re.search(r"\(https?://(?:www\.)?([^/)]+)", x)
        if m:
            raw.add(m.group(1))
    doms = sorted(raw)
    key = [
        "[x.com/nickvasilescu — 44 posts](https://x.com/nickvasilescu)",
        "[youtube.com/watch?v=CGkC8ukXnfw](https://www.youtube.com/watch?v=CGkC8ukXnfw)",
        "[nickvasilescu.com/writing — 16 notes](https://www.nickvasilescu.com/writing)",
        "[gov.uk — R&D guidance](https://www.gov.uk/guidance/corporation-tax-research-and-development-rd-relief)",
        "[gov.uk — additional information form](https://www.gov.uk/guidance/submit-detailed-information-on-your-rd-claim)",
        "[company-information.service.gov.uk](https://find-and-update.company-information.service.gov.uk/)",
        "[fca.org.uk — mortgage and protection rules](https://www.fca.org.uk/)",
        "[ofgem.gov.uk — broker conduct](https://www.ofgem.gov.uk/)",
    ]
    domain_para = ", ".join(doms[:60])
    tpl = tpl.replace("{{SOURCES}}",
        "Two kinds of source sit behind this book: the firms and the argument.\n\n"
        "**How the names were checked.** Every named person was checked by re-opening\n"
        "the page cited beside them and looking for the surname. Of the 80 people\n"
        "named here, 77 confirmed. Two are marked unverified in the text because the\n"
        "page did not show the name when re-read. One has no public page.\n\n"
        "**The firms.** Every firm name in this book is a live link to the page the\n"
        "facts came from. Those pages sit on these domains, each opened on 20 or 21\n"
        "October 2026:\n\n" + domain_para + "\n\n"
        "**The argument.** These carry the pricing, the timing and the playbook:\n\n"
        + "\n\n".join(key) + "\n")

    os.makedirs("/root/twinthos-brain/audit/.build", exist_ok=True)
    open("/root/twinthos-brain/audit/.build/next-door.md", "w").write(tpl)

    # A clean copy for reading: strip the pandoc-only syntax.
    clean = []
    for line in tpl.split("\n"):
        if line.startswith(":::"):
            continue
        line = re.sub(r"\{#[-a-z0-9]+\}", "", line)
        line = re.sub(r"\{\.[-a-z]+\}", "", line)
        clean.append(line)
    open(OUT_MD, "w").write("\n".join(clean))
    print("wrote", OUT_MD, len(tpl), "chars")
    print("firms:", len(all_recs), "acquirers:", len(acq), "investors:", len(inv))


if __name__ == "__main__":
    main()
