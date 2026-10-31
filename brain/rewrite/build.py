import json, re, os

OUT = "/root/twinthos-brain/rewrite"

fail = {
    "slug": "why-ai-automations-fail",
    "title": "Why most AI projects fail before they start",
    "description": "MIT found about 95% of generative AI pilots made no measurable difference to profit. The 5% that worked fixed the paperwork before they bought anything.",
    "answer": "Most AI projects fail because the work around them was never fixed. A tool only does what your systems record, and your systems record less than your team knows. The 5% that work write the process down, hand over real knowledge, and keep a person at the approval point.",
    "sections": [
        {
            "h": "The 95% number is real",
            "p": [
                "In August 2025 the MIT Media Lab's NANDA initiative published its report, The GenAI Divide: State of AI in Business 2025. It looked at 300 public deployments, 52 interviews and 153 executives.",
                "The finding was blunt. Roughly 95% of the generative AI tools companies built, and the pilots they bought, produced no measurable impact on profit and loss. Only 5% of integrated tools reached production with any return.",
                "It is not one study either. McKinsey, BCG and Gartner ran their own research and hit the same wall. The table below has their figures. Every one of those reports also describes a way out.",
            ],
        },
        {
            "h": "It is a setup problem, not a model problem",
            "p": [
                "AI demos well and deploys badly. Show a model a task and it looks impressive. Put it inside your business, wired to your inbox, your diary, your accounts and your customer records, and something breaks.",
                "MIT names the cause: the learning gap. The tools do not learn from feedback and do not fit how work actually flows.",
                "You have seen the shape of it. The drafts get written and then sit in a queue. The person who used to write them now checks them, which is slower and harder. Or the software does something it should not, like promising a refund outside policy, and someone pulls its permissions.",
                "In all three cases the model did its job. What was missing was everything around it.",
            ],
        },
        {
            "h": "One: write the messy job down",
            "p": [
                "Every business runs on work that appears in no process document. The invoice was paid, so someone has to notice the money landed and chase the next step. A booking comes in and someone copies it from one system into another. Nothing moves until a person remembers to push it.",
                "Pick one recurring job, ideally the one that stops when someone is on holiday. Write it down end to end. Where it starts, what it touches, who decides, what finished looks like.",
                "That is an afternoon, once. It is the cheapest hour you will spend on the whole project. It is also the step nearly everyone skips, because it does not look like technology.",
            ],
        },
        {
            "h": "Two: hand over your knowledge, not hope",
            "p": [
                "Teams give the system a job and hope it works the rest out. Hope is expensive.",
                "Give it the actual material instead. Your current prices. Your refund policy, including the exceptions. Your standard replies, and the ones you rewrote by hand because they came out wrong. Your tone, written down in plain words.",
                "MIT is specific on this. The tools that work are built into systems you already use, not bolted on as a new place to visit. They also learn from your corrections.",
                "A system with your knowledge behaves like an experienced colleague. The same system without it behaves like a confident stranger who needs checking every time. One gets used. The other gets quietly switched off.",
            ],
        },
        {
            "h": "Three: keep one person at the approval point",
            "p": [
                "Draw a line before you switch anything on. Below it, the software acts on its own. Above it, a person decides.",
                "Sort each action once, with someone who knows the business, not in the moment. The line sits where judgment lives. A refund outside policy. A price that moved. A message to a difficult customer. Everything else runs without anyone watching.",
                "This is not reviewing everything forever. It is also the repair when something goes wrong. You do not cancel the project. You move that one action above the line, which takes five minutes.",
                "Then count staff hours removed, and count the checking too, so you are not simply moving the cost.",
            ],
        },
        {
            "h": "What this means for you",
            "p": [
                "None of this needs a better model. You can do all three this month with the tools you already pay for.",
                "Start with the job that stops when one person is away. Write it down, hand over the knowledge, draw the line, and count the hours that come back. If the hours are small, stop there and keep your money. If they are large, you now know exactly what to buy.",
            ],
        },
    ],
    "table": "| What the research found | Figure |\n| --- | --- |\n| MIT NANDA, August 2025: pilots with no measurable impact on profit and loss | about 95% |\n| MIT NANDA, August 2025: integrated tools that reached production with any return | 5% |\n| McKinsey, 2024: firms reporting no measurable impact on operating profit from generative AI | 65% |\n| BCG, 2024: firms struggling to get value from AI at scale | 74% |\n| BCG, 2024: firms classed as future-built, earning above-average returns | 4% |\n| Gartner, July 2024: projects predicted to be dropped after proof of concept by end of 2025 | at least 30% |",
    "takeaway": "The 95% failure rate is a setup problem, not a technology problem. Write the workflow down, give the tool your real prices and policies, and keep a person at the approval point for anything that costs money or a relationship. Do that before you buy, and the odds stop being the point.",
    "faq": [
        {
            "q": "Where does the 95% figure come from?",
            "a": "MIT Media Lab NANDA, The GenAI Divide: State of AI in Business 2025, published August 2025. It surveyed 300 public deployments, 52 interviews and 153 executives, and found roughly 95% of custom or piloted generative AI tools had no measurable profit and loss impact.",
        },
        {
            "q": "So does that mean AI does not work?",
            "a": "No. The same research points at setup, not intelligence, and names the barrier as the learning gap. The models pass the demos. The deployments miss the recipe.",
        },
        {
            "q": "What does fixing the paperwork actually mean?",
            "a": "Choose one recurring workflow and write it down end to end: where it starts, what it touches, who decides, what done means. Most small firms have never written it down, because one conscientious person has been holding it in their head.",
        },
    ],
    "sources": "MIT Sloan, Why most AI pilots fail, 2025: https://mitsloan.mit.edu/ideas-made-to-matter/why-most-ai-pilots-fail\nMcKinsey, The state of AI, 2024: https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai\nBCG, Where's the value in AI?, 2024: https://www.bcg.com/publications/2024/wheres-the-value-in-ai\nGartner press release, 29 July 2024: https://www.gartner.com/en/newsroom/press-releases/2024-07-29-gartner-predicts-30-percent-of-generative-ai-projects-will-be-abandoned-after-proof-of-concept-by-end-of-2025",
    "image_prompt": "Editorial photograph of a real office desk in a small business: an open laptop abandoned mid-task with the screen dimmed, a printed process document marked up in pen beside it, and a half-finished checklist on a clipboard. Late afternoon daylight from a side window, muted colours, natural clutter, shallow depth of field, one clear subject. No people, no hands, no readable text, no logos, no robots.",
    "image_alt": "An office desk with an abandoned open laptop, a printed process document marked up in pen and a half-finished checklist.",
}

survey = {
    "slug": "small-businesses-already-hired-ai",
    "title": "53% of small firms already let AI cover a full job",
    "description": "A survey of 729 owners found 53% let AI absorb a full-time role's workload, and nobody in the data was let go. The 65% who are tired kept the checking.",
    "answer": "Just over half of small firms have handed a full-time role's workload to software. Bluevine asked 729 owners and 53% said yes, while 48% never opened a role they would have. Nobody in the data was let go. The tired ones kept the checking.",
    "sections": [
        {
            "h": "More than half of 729 owners had already done it",
            "p": [
                "On 7 October 2026, Bluevine published its Lean Team Economy Report. It asked 729 owners of US firms with 2 to 249 staff how AI had changed their business. The survey ran from 25 to 30 June 2026.",
                "The headline is simple. 53% said AI or automation had absorbed the workload of at least one full-time role. Not a task here and there. A job's worth of work, done by software.",
                "Three quarters of the owners surveyed plan to absorb more roles rather than hire over the next twelve months. Read that as a queue. Half have done it once. Most want to do it again.",
            ],
        },
        {
            "h": "Nobody in this data was let go",
            "p": [
                "The survey did not ask about redundancies, so it cannot tell you how many people were made redundant anywhere. It asked about workload, and on workload nothing in it describes a person being let go.",
                "What the 53% describes is a job's worth of work moving into software while the people stayed put. In most small firms, the person doing that work at half nine at night was the owner.",
                "There is a real cost, and it is the 48%. Nearly half the owners said they never opened a role they otherwise would have. Someone who wanted that job did not get it. Better to say that plainly than to dress it up.",
            ],
        },
        {
            "h": "The work that went first was the boring work",
            "p": [
                "Owners named where they would rather automate than hire, and the table below has the shares. Look at the shape of that work.",
                "It arrives when it likes. It lands in an inbox. It only moves when someone remembers to push it. A lead comes in and sits there. An invoice needs chasing. A customer who liked you goes quiet because nobody had ten minutes that week.",
                "Nobody has ever enjoyed this. It is what you do at half nine because the day ran out. That is why it went into software first, and it is the right place to start. Admin, chasing and follow up are where the hours actually leak.",
            ],
        },
        {
            "h": "65% of owners are still tired",
            "p": [
                "Same report, harder finding. 65% said running a leaner team had hurt their wellbeing.",
                "There are two versions of what happens next. In the first, the tool takes the volume and the owner stops chasing. In the second, the tool produces the drafts and the owner becomes the checker.",
                "Checking someone else's work is harder than doing it. You hold what is true in your head while you read. The saved hours get counted. The reviewing, the chasing and the apologising do not.",
                "Six months later the week is long again and nobody can name the day it happened. The firms that handed over the draft are still tired. The ones that handed over the follow through are not.",
            ],
        },
        {
            "h": "Finish the handover, do not automate less",
            "p": [
                "The fix is not less automation. It is finishing the job. Draw one line per workflow.",
                "Below it, the software acts. It answers the routine enquiry, books the meeting, updates the record, sends the reminder, chases the invoice. Above it, a person decides. Agree a discount. Issue a refund. Change a contract. Commit money. Handle anything delicate.",
                "Two things follow. The software never becomes the source of truth about anything it cannot prove, so a request for money back stops with a human. And your people keep the judgment work, which is the part they would miss.",
                "No one opens a bakery because they love chasing invoices. Every hour of chasing handed to software is an hour back in the shop.",
            ],
        },
        {
            "h": "What this means for you",
            "p": [
                "Count the hours your team spends moving work between systems, and count the checking you do at night. That number is the decision.",
                "If it is small, buy nothing. If it is large, hand over the whole job, including the follow through. Put one drawn line around anything that touches money or a customer relationship. Half of the firms in this survey have started. Finish it and the tiredness goes with it.",
            ],
        },
    ],
    "table": "| Work owners plan to automate rather than hire for | Share of owners |\n| --- | --- |\n| Marketing and sales | 39% |\n| Customer service | 37% |\n| Finance and bookkeeping | 34% |\n| Administration | 28% |",
    "takeaway": "53% of 729 owners say software now carries a full-time role's workload, and nobody in the survey was let go. The 48% who never opened a role is the real cost. The 65% who are tired automated the draft but kept the checking. Hand over the follow through too, draw one line for decisions, and the evenings come back.",
    "faq": [
        {
            "q": "Did the survey say 53% of small businesses replaced a person with AI?",
            "a": "It asked whether AI or automation absorbed the workload of at least one full-time employee, not whether it replaced a named individual. 53% of the 729 owners said yes, in a survey run from 25 to 30 June 2026 and published on 7 October 2026.",
        },
        {
            "q": "If nobody was fired, where did the work go?",
            "a": "Into software, mostly the chasing and admin that used to sit at the end of the owner's day. 48% said they never hired someone they otherwise would have.",
        },
        {
            "q": "Why are 65% of owners still tired?",
            "a": "Because most handed over the draft, not the job. The software produces the work and a person still checks it, chases it and apologises for it, usually the owner, usually at night.",
        },
    ],
    "sources": "Bluevine Lean Team Economy Report, PR Newswire, 7 October 2026: https://finance.yahoo.com/small-business/articles/bluevine-study-finds-more-half-130000916.html\nBluevine press release, PR Newswire, 7 October 2026: https://www.prnewswire.com/news-releases/bluevine-study-finds-more-than-half-of-smbs-use-ai-to-handle-workload-of-at-least-one-employee-302900406.html",
    "image_prompt": "Editorial photograph inside a small business that is clearly in use: a service counter with a till, a paper staff rota pinned to the wall behind it, a mug and a stack of order pads. Natural daylight, worn surfaces, muted colours, wide shot with one clear subject. No people posing, no hands, no readable text, no logos.",
    "image_alt": "A small shop counter with a till, a paper rota on the wall behind it and everyday clutter, nobody posing.",
}


def wc(s):
    return len(re.findall(r"[A-Za-z0-9£$%'’\-]+", s))


def stats(a):
    body = " ".join(a["answer"].split())
    secs = sum(wc(p) for s in a["sections"] for p in s["p"])
    per_sec = [(s["h"], sum(wc(p) for p in s["p"])) for s in a["sections"]]
    faq = sum(wc(f["q"]) + wc(f["a"]) for f in a["faq"])
    total_no_faq = wc(a["answer"]) + secs + wc(a["takeaway"])
    return {
        "title_len": len(a["title"]),
        "desc_len": len(a["description"]),
        "answer_words": wc(a["answer"]),
        "section_words": secs,
        "per_section": per_sec,
        "takeaway_words": wc(a["takeaway"]),
        "faq_words": faq,
        "total_no_faq": total_no_faq,
        "total_with_faq": total_no_faq + faq,
        "n_sections": len(a["sections"]),
    }


for art in (fail, survey):
    st = stats(art)
    print(art["slug"], json.dumps(st, indent=1))
    text = json.dumps(art, ensure_ascii=False)
    bad = [w for w in ["agentic", "orchestration", "paradigm", "leverage", "synergy",
                       "operationalise", "robust", "seamless", "cutting-edge", "harness",
                       "unlock", "empower", "ecosystem", "best-in-class", "—", "–"] if w in text]
    print("banned:", bad)
    assert st["title_len"] <= 62, "title too long"
    assert 120 <= st["desc_len"] <= 155, "desc length"
    assert 40 <= st["answer_words"] <= 50, "answer words"
    assert 4 <= st["n_sections"] <= 6
    assert 50 <= st["takeaway_words"] <= 70, "takeaway"
    assert 700 <= st["total_with_faq"] <= 950, "length"
    assert len(art["faq"]) == 3
    assert not bad
    with open(os.path.join(OUT, art["slug"] + ".json"), "w") as f:
        json.dump(art, f, ensure_ascii=False, indent=2)
print("written")
