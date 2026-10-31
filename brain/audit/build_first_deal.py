#!/usr/bin/env python3
"""Build the four-page first-deal pack from the cleaning-contractor research."""
import os, re, sys

sys.path.insert(0, "/root/twinthos-brain/audit")
import build_next_door as B

OUT = "/root/twinthos-brain/audit/first-deal-2026-10-21.md"
TPL = "/root/twinthos-brain/audit/first-deal.template.md"


def main():
    tpl = open(TPL).read()
    recs = B.load("clean.json")
    tpl = tpl.replace("{{TABLE:clean}}", B.firm_table(recs[:10], B.verdict_map()))
    os.makedirs("/root/twinthos-brain/audit/.build", exist_ok=True)
    open("/root/twinthos-brain/audit/.build/first-deal.md", "w").write(tpl)

    clean = []
    for line in tpl.split("\n"):
        if line.startswith(":::"):
            continue
        line = re.sub(r"\{#[-a-z0-9]+\}", "", line)
        line = re.sub(r"\{\.[-a-z]+\}", "", line)
        clean.append(line)
    open(OUT, "w").write("\n".join(clean))
    print("wrote", OUT, len(clean), "lines,", len(recs), "firms")


if __name__ == "__main__":
    main()
