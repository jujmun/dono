# Dono Pitch Deck v1 — Slide-by-Slide Fix List

Worked against **`Dono Pitch Deck v1.pptx`** (20 slides). Slide numbers below are *your* numbers unless stated.
Assumes: v1 is the base, your team builds, India Society campaign **not yet live**.

---

## Part 0 — Do these first (15 minutes, and they're all ship-blockers)

**1. Sweep the deck for my analysis prose.** Commentary written *to you* has been pasted in as slide copy. Confirmed instances:

| Slide | Delete this text |
|---|---|
| 4 | "Three respondents went without it entirely — forfeited the opportunity. **That number is more affecting than the 73% rejection rate and it's currently nowhere in the deck.**" (delete from "That number…") |
| 17 | "Fee resistance is a minority concern, **which surprised me**. Only 4 of 23 flagged worry about fees, and one named it as a dealbreaker. **The notes read as though fees were a major risk; the raw data doesn't support that. It strengthens the donor-pays model.**" (delete the whole block — it's a reasoning note, not slide copy) |
| 12 | "Outline the idea of how we work to ease the issues of the three major stakeholder" (that's a to-do, not copy) |
| 16 | "Show results from demos we have" (to-do) |

Search the deck for: *"surprised me"*, *"currently nowhere"*, *"the notes read"*, *"it's worth"*, *"I'd"*. Anything in first person that isn't a student or a fundraiser speaking should come out.

**2. Fix the 38% on slide 4.** It currently reads "38% — Of those paid abandoned", which doesn't parse and looks like 38% of all students. The real figure is 3 of the 8 rejected applicants. Correct copy:

> **38%**
> of rejected applicants gave up on the opportunity entirely

That's a *stronger* stat than the 73%, and it's the only place in your data where the human cost is visible. Give it room.

**3. Slide 3 uses the same stock photo nine times.** Replace with nine different real people — teammates, society members, anyone who'll consent. If you can't get nine real photos, use nine *objects* instead (a rowing blazer, a flight ticket, an exam receipt, a lab coat), which is arguably better anyway because it makes the collage about the needs rather than the faces.

**4. Delete slide 7** ("Information to Include" — a scaffold marker).

**5. Fix text running off the left edge of slide 6** ("…ave the resources to provide transparency").

---

## Part 1 — Structural surgery

### The problem
**Nobody learns what Dono is until slide 12 of 20 — 60% through a 10-minute pitch.** Everything before it is problem, and the audience has no frame to hold it in. Meanwhile slides 4/5/6 are three versions of the same problem slide (you were versioning and didn't delete), and slides 9/10/11 are three near-empty slides doing one slide's job.

### The fix — new running order (18 slides)

| New # | Content | From your | Action |
|---|---|---|---|
| 1 | **Hook** — the story, big photo | 2 | Absorb slide 1 into this; "Dono Pitch" is a wasted slide |
| 2 | **Dono, one line + logo** | *new* | **Move the tombstone up from slide 12.** Single biggest fix in the deck |
| 3 | "This is not a rare experience" collage | 3 | Fix the photo repetition |
| 4 | **Problem — Students** | 4 | Build 1 of 3 |
| 5 | **Problem — Alumni** | 4/5/6 | Build 2 of 3 |
| 6 | **Problem — Colleges** | 5/6 | Build 3 of 3 |
| 7 | Institutions are leaving money on the table | 8 | Distribution chart lives here — see Part 3 |
| 8 | "Imagine if this problem was solved?" | 9 + 10 | Merge the two |
| 9 | **Meet Dono** — how it works, 3 stakeholders | 11 + 12 | Merge the two |
| 10 | Demo | 13 | |
| 11 | Why now | 14 | |
| 12 | How we compare | 15 | Nearly finished already |
| 13 | Traction and validation | 16 | See Part 4 |
| 14 | Business model | 17 | |
| 15 | Use of investment | 18 | |
| 16 | Team | 19 | |
| 17 | Close | 20 | |

**Delete outright:** your 1, 7, and two of the three duplicate problem slides. **Net saving: ~90 seconds**, which you need.

### On slides 4/5/6 — build them, don't stack them
Roger's rule: reveal one stakeholder at a time on an otherwise identical slide. Three copies of the slide, each adding a column. The audience can't read ahead, so your mouth does the work. You already have three near-identical slides — you're 80% of the way there, you just need them to be *deliberately* cumulative rather than three drafts.

---

## Part 2 — Design system (you're building, so here are the rules)

The deck is currently default Office: black Arial on white, default blue/orange charts. Nothing says Dono. Minimum viable fix:

**Colours** (from `design/design-psychology-and-community-guide.md`)
```
Primary green   #168456   headlines, key numbers, chart series 1
Deep green      #126E49   small text on light, hover/emphasis
Eucalyptus      #69A984   secondary chart series, decorative
Pale green      #E8F5EE   quote blocks, callout panels
Ink             #17211B   body text
Slate           #56615A   captions, labels
Background      #F7FAF8   light slides
Near-black      #0E1F17   dark slides (hook, why-now, close)
```
One accent only, used sparingly on dark slides: **amber `#E8A33D`**.

**Typography** — pair a serif header with a sans body. Cambria + Calibri both ship with Office and won't substitute. Titles 34–40pt bold, body 11–14pt, captions 9–10pt. Never below 9pt.

**Kill the default chart colours.** Any chart still rendering Office orange is the single fastest tell that a deck wasn't designed.

**Structure**: dark slides for hook / why-now / close, light for everything else. It gives the deck a shape.

---

## Part 3 — The distribution chart (replacing the pie)

The pie on slides 5/6/8 gets you "200 is a tiny sliver" but throws away the actual argument. A pie has no axis for gift size, so there is no *money left on the table* — only a proportion. Swap it for the skewed distribution.

**Build it as a stacked area chart, not a drawn shape** — stays editable, renders crisply.

1. Insert → Chart → Area → **Stacked Area**
2. Two series, ~20 rows of gift-size buckets (£0 → £100k+):
   - **Series 1 "Never asked"** — carries all the value across low and mid buckets, drops to 0 in the tail
   - **Series 2 "Where 100% of effort goes"** — 0 everywhere, carries value only in the last 3–4 buckets
   - Stacking gives you one continuous curve, two colours, automatically
3. Y-values to get the right skew (type by hand):
   `5, 40, 95, 100, 88, 70, 52, 38, 26, 18, 12, 8, 5, 3, 2, 1.5, 1, 0.8, 0.5, 0.3`
4. **Delete the legend, gridlines and the entire y-axis.** The unlabelled y-axis is deliberate — it signals "this is the shape of the market," which is defensible, rather than "here is our dataset," which invites a fight
5. Colours: body `#168456`, tail `#56615A` (grey) — the grey tail reads as "already served, not our market"
6. Labels as text boxes over the chart, with thin leader lines:
   - over the tail: **"200 people. 100% of the effort."**
   - over the body: **"8,800 people. Nobody asks them."**

**Draw it right-skewed, not a symmetric bell.** Giving capacity is log-normal — a wall of people at the low end, a thin tail of major donors. A symmetric curve is both wrong and *weaker*, because the asymmetry is the argument.

**Footer line for that slide** — this is the defensible version of "money on the table":

> At that college's own participation rate, a single £10 ask to the 8,800 returns roughly what its telethon returns. The telethon costs £30–50k to net £10–15k.

The win is **cost of collection**, not pot size. That framing survives scrutiny; a big TAM number won't.

---

## Part 4 — Slide 13, traction (campaign not live)

This is the slide that decides your traction score and it's currently one line and a to-do. With the campaign not live, don't fake it — reframe. Recommended contents:

**Four numbers**
> **11** development offices interviewed · **26** students surveyed across **14** colleges · **1** platform live at joindono.com · **£0** raised — *by design, we haven't launched*

**Three evidence rows**
- **Product is built and live** — Stripe payments, human campaign review, society verification, moderation portal, all shipped
- **The students the system rejected are our most likely users** — rejected applicants score **7.1/10** on likelihood to use Dono, vs a 6.4 average
- **A college is waiting on a demo case** — colleges copy colleges; the first one is the only hard one

**One quote, spoken** (show up to three, deliver one):
> *"Get young alumni onto the ladder who wouldn't otherwise give."* — Director of Development, 10,000-alumni Oxford college

**The line to say out loud** — this converts the weakness into the criterion you can win:
> "We haven't launched yet, and I'm not going to pretend otherwise. What we do have is eleven Oxford development offices on record, which I doubt anyone else here can say."

**Two things to check before you build this slide:**
- Your speaker note says **"15+ development offices."** I can only find **11** documented in `dono-brain`. If it's genuinely 15+, write the other four up — it's a better number. If it's 11, say 11. Do not say 15 with 11 in the files.
- **Cut the nine-document legal suite from this slide.** I put it on my version and I now think that was wrong: "nine legal documents and zero users" reads as effort pointed the wrong way. Hold it for Q&A, where it's the right answer if a lawyer asks about compliance.

---

## Part 5 — Remaining slides, in order

**New 2 — Dono, one line.** The whole point of moving this up. Logo, one slogan-style line, nothing else. Suggested:
> **See exactly where your money goes.**
> *Students ask. Alumni fund. Everyone sees the receipts.*

**New 3 — Collage.** Concept is good — keep it. Add a price tag to every item so the *range* is visible at a glance (£15 lab coat → £700 MBAT). The current items are strong: £400 flights, rowing blazer, exam fees, neuroanatomy Olympiad travel. Add: anatomy models, sports kit, conference travel, Oxformals (£500).

**New 4–6 — Problem builds.** One stakeholder per reveal. Suggested per-column content:

| | Students | Alumni | Colleges |
|---|---|---|---|
| Headline | Can't ask | Aren't asked | Can't afford to |
| Stat 1 | **73%** of funding applications rejected or underfunded | **4 in 10** doubt their donation reached the cause | **£2,000** — below this an appeal costs more than it raises |
| Stat 2 | **38%** of rejected applicants gave up entirely | **£75k from 200 donors** in 2026 vs **£56k from 200** in 2021 | **£30–50k** telethon cost, for £10–15k net |
| Quote | *"Missed the bursary deadline. Paid for it myself."* | *"I actively avoid asking anyone in their twenties."* | *"The problem raising money for societies is the students."* |

Note the alumni column: move the **£75k/£56k** stat here from your slide 6. Donor count flat, gift size up a third — institutions squeezing the same pool rather than growing it. It's the best statistic you have and it belongs in the problem, not in traction.

**New 6, colleges column — say this explicitly:** *"Colleges are not the villain. They are trapped by arithmetic."* You need them as allies, and the judges will mark you up for the fairness.

**New 8 — "Imagine if this problem was solved?"** Merge in your belief line from slide 10. One slide, one line, a real pause. Currently three slides doing this.

**New 9 — Meet Dono.** Merge your 11 and 12. Three steps: student asks → alumni fund → everyone sees the receipt. **This is where the college positioning must become idiot-proof.** Put it on the slide as a strip:
> Students pay £0 · Colleges pay £0 · Donors pay the fee · We hold £0

And say: *"Colleges pay us nothing. They are not our customer and we are not competing with them."* Roger was emphatic that this must be unmissable by the end of the solution section. Right now it's implicit at best.

**New 10 — Demo.** joindono.com is live, so use it. Storyboard every click; no dead air. 55–75 seconds max. If there's any network risk in the room, use a screen recording.

**New 11 — Why now.** Your three points are right. Add the fourth, which is the technical unlock: *£5 gifts only became economic with Stripe Connect and mobile wallets — a college physically cannot administer a £15 restricted gift; the accounting costs more than the gift.* Compress the whole slide to one memorable sentence: **"The channel that acquired small donors is dying, and the technology that replaces it just became viable."**

**New 12 — Comparison table.** Nearly done. Two notes: add **OxReach** to the Hubbub row (Oxford's own attempt: 6 projects ever, 4 from professors, not renewed — it's your strongest competitive moment), and check the Instagram row — "student can start in minutes" should probably be a full tick, not a half.

**New 14 — Business model.** Your content is right once the pasted commentary is stripped. Show it as a receipt:
> Donation £10.00 · Payment processing at cost · Dono fee (3.5%) £0.35 · **Student receives £10.00**
> *Donor pays £10.35. Student gets the full £10.*

Keep the donor-covers-fee precedent (two Oxford colleges already do it, one saving £3,000/year) — it pre-empts the obvious "why would a donor volunteer to pay more?"

**New 15 — Use of investment.** Currently a title only. **This is worth 5 tie-break points** and it's the cheapest points in the competition. Four buckets: acquisition · legal & incorporation · build-out · runway. To get the number, work backwards from an 18-month milestone (suggest: *120 active campaigns across 8–10 colleges, 30% of donors giving a second time*), cost each line, add 25%, round up.

**New 16 — Team.** Photo, subject, one-line superpower, internship logos. Make each line a *proof*, not a credential. Close on: *"We built the product, the payments model and the legal framework before asking anyone for a pound."*

**New 17 — Close.** Suggested, if you want it:
> **Somebody paid for you.**
> A scholarship, a bursary, a fund with someone's name on it. You almost certainly never found out who, or what it bought.
> **Back the first generation that gets to find out.**

Then stop. No "thank you", no "any questions". Hold the silence.

---

## Part 6 — Timing budget (18 slides / 10 min)

| Section | Slides | Target |
|---|---|---|
| Hook + Dono one-liner | 1–2 | 1:00 |
| Collage + problem builds | 3–6 | 2:20 |
| Money on the table + imagine | 7–8 | 0:50 |
| Meet Dono + demo | 9–10 | 2:00 |
| Why now + comparison | 11–12 | 1:10 |
| Traction + business model | 13–14 | 1:30 |
| Investment + team + close | 15–17 | 1:10 |
| | | **10:00** |

If you run long, cut in this order: (1) fold *Why now* into one spoken sentence over the comparison slide, (2) merge problem builds 2 and 3 into one reveal, (3) trim the demo to 55 seconds by dropping the Discover step.

**Presenters: one or two, never four.** Suggested — Sashank opens through new slide 9 (the story is his, it must be first person), a co-presenter takes 10–15 (demo through investment), Sashank returns for 16–17. All four take Q&A.

---

## Part 7 — Accuracy flags carried over

1. **"We have raised nothing"** — `company/company-context.md` records grant money transferred into the Starling account on 31 Jul. Say *"no equity raised, no external investors"* instead.
2. **Survey n** — 26 responses, 23 of them current Oxford students. Safest phrasing: *"twenty-six responses across fourteen colleges."*
3. **73% is 8 of 11.** Small n. If pressed: *"eight of the eleven students in our survey who applied for funding."*
4. **One college explicitly asked not to be named** in written material. Keep all institutions anonymised by role and scale unless you have written consent.
5. **Quotes are compressed paraphrases from meeting notes**, not verbatim transcripts. If asked directly, say so.
6. **Insurance** — `company-context.md` and `TRUTH.md` contradict each other, same date. Don't claim it until reconciled.
7. **Entity** — `TRUTH.md` says sole trader with no incorporation planned; the corporate handoff describes five founders and a UK Ltd. Make no entity claim on stage until this is settled; "who owns it?" is a routine Q&A question.

---

## Part 8 — The two things worth more than any slide edit

1. **Get the India Society campaign live and raising.** Any number at all outweighs most of this document. It's also the direct answer to the second-biggest objection in your own survey data — 11 of 23 students said *"I don't think anyone would actually donate."* Blockers in your TODO: speak to Cathy; resolve Step's concerns about Somerville.

2. **Five alumni interviews.** Every number in this deck is supply-side — it proves students want money. Nothing proves an alumnus will give to a stranger through an app, which is the entire business. Five conversations would let you say *"we asked our customers"* rather than *"we asked our users."* Roger flagged this as make-or-break and he's right.
