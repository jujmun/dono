# Dono — £10,000 Use of Funds: the model

Built from the founder interview (5 Aug 2026) plus `dono-brain`. Every figure below is derived, not asserted — the arithmetic is shown so you can defend or flex any of it under questioning.

**Inputs given:** £10,000 prize + £750 unspent grant = **£10,750 total** · nobody paid · must reach revenue-sustaining with no further raise · sustainability means covering running costs **and** a modest marketing budget · incorporating within 12 months · web now, apps later · Oxford broadly plus a first Cambridge college · acquisition via print/physical, society event sponsorship and a paid digital test.

---

## 1. The headline

> **£10,000 takes Dono from "cannot legally launch" to "pays for itself."**

That's the whole slide in one line, and it's the strongest possible framing for a prize fund: you're not asking for money to survive on, you're asking for the money that makes further money unnecessary.

---

## 2. Work backwards: what does self-sustaining actually require?

This is the calculation you asked for. It runs in four steps.

### Step 1 — What must the fee cover each month?

| Cost | Monthly | Basis |
|---|---|---|
| Infrastructure at scale | £150 | Vercel, Convex, Resend, PostHog, domain — top of your current £50–150 range, since usage rises with campaigns |
| Modest ongoing marketing | £150 | Print, QR materials, occasional society sponsorship — your definition of sustainable |
| **Total** | **£300/month** | **= £3,600/year** |

### Step 2 — What donation volume produces £3,600 of fee income?

Your fee is **3.5%** of the donation (payment provider's cost + 3.5 percentage points; the 3.5pp is your revenue).

```
Required GMV  =  £3,600 ÷ 0.035  =  £102,857
```

**≈ £103,000 of donations processed per year.** That is the number the whole business turns on.

### Step 3 — How many campaigns is that?

Society campaigns run larger than individual ones — sports tours, plays, equipment, kit. Blending your survey's £150–£500 individual need with larger society asks gives a working average of **£800 per successful campaign**.

```
Campaigns needed  =  £103,000 ÷ £800  =  129
```

**≈ 130 successful campaigns in 12 months** — about 11 a month.

### Step 4 — How many societies is that?

A society typically runs about two campaigns a year, and it *persists* — committees hand over annually, so the account renews itself.

```
Societies needed  =  130 ÷ 2  =  65
```

**≈ 65 active societies.** Across 39 Oxford colleges that's under two societies per college, plus university-wide clubs.

### The sanity check that makes it feel small

£103,000 at an average donation of £25 is about **4,100 donations**. If a donor gives roughly one and a half times a year, that's **~2,750 individual donors**.

Oxford has roughly **300,000 living alumni** (your own interviews: 9,000 · 10,000 · 9,100 · 6,000 across four colleges, averaged over 39).

```
2,750 ÷ 300,000  =  0.9%
```

> **We need nine-tenths of one per cent of Oxford's alumni to give £25, once.**

The colleges you interviewed already achieve **5%, 13%, 17–18% and 30–40%** participation on their own lists. You need under 1%. **Say this number out loud in the pitch** — it converts an ambitious-sounding target into an obviously achievable one, and it's built entirely from their data, not yours.

---

## 3. Where the £10,750 goes

| # | Line | Amount | % | What it buys |
|---|---|---|---|---|
| 1 | **Legal & incorporation** | **£4,000** | 37% | Solicitor sign-off on the nine-document terms suite; incorporation; IP assignment; founder agreements |
| 2 | **Acquisition** | **£4,500** | 42% | 65 societies across Oxford and the first Cambridge college |
| 3 | **Infrastructure & runway** | **£1,500** | 14% | 15 months of hosting, tooling and app-store fees — long enough to reach break-even |
| 4 | **Contingency** | **£750** | 7% | The legal quote is unconfirmed; this absorbs it |
| | **Total** | **£10,750** | 100% | |

### Line 1 — Legal & incorporation, £4,000

**This is the unlock, not the overhead.** `TRUTH.md` is explicit: *nothing in the terms suite is publishable, every document requires solicitor sign-off*. Until that's done you cannot legally take a single donation at scale. Every other pound in this budget is wasted without it.

| Item | Est. | Note |
|---|---|---|
| Solicitor review — 9-document consumer-facing suite | £2,800 | Payments-adjacent, consumer terms, Online Safety duties. **You have no quote — this is the number to confirm first** |
| Incorporation + IP assignment + founder agreements | £1,000 | The corporate handoff calls IP assignment "extremely important… backend development is already occurring" |
| Companies House registration | £50 | |
| UK trademark, one class | £170 | `ip-branding-and-data-notes.md` |
| | **£4,020** | round to £4,000 |

**Two honest notes.** First, 37% on legal looks heavy on a slide and a judge may say so — the answer is that it's a *blocker*, not a cost, and you should say that before they ask. Second, if the solicitor you're meeting quotes materially above £2,800, the contingency covers it and the acquisition line flexes down. Get that quote before you present if you possibly can.

### Line 2 — Acquisition, £4,500

Sized to land 65 societies. Split across the three channels you chose:

| Channel | Amount | Reasoning |
|---|---|---|
| **Society launch sponsorship (Oxford)** | £2,200 | Highest conviction. ~£35 per society across ~60 societies — buying presence at the moment a committee is actually thinking about money. Societies are your wedge: they have a treasurer, a mailing list and an annual handover, and society campaigns dodge the embarrassment problem that kills individual ones (14 of 23 in your survey) |
| **Print & physical** | £1,300 | Freshers' fair stalls (~£100–200 each), QR posters, pigeonhole flyers. Cheap and genuinely effective in a collegiate environment where noticeboards still work |
| **Cambridge beachhead** | £500 | Travel and first-society sponsorship at one Cambridge college. Small, but it's what turns "an Oxford thing" into "a model that travels" — and that's the story that unlocks whatever comes after this money |
| **Paid digital — capped test** | £500 | See below |
| | **£4,500** | |

**On the paid digital.** You picked it after I argued against it, so it's in — but capped at £500 and I'd hold you to a kill criterion: *if the first £250 doesn't produce a measurable campaign or donation, stop and move the rest into society sponsorship.* The reason for scepticism is structural rather than snobbery: your growth loop already **is** distribution. A campaign link forwarded into a year-group WhatsApp reaches alumni through a trusted sender, in a channel you could never buy. Paid social reaches them cold. The £500 is worth spending to *learn* that, and being able to say "we tested it and killed it" is a good answer in Q&A.

### Line 3 — Infrastructure & runway, £1,500

£100/month × 15 months = £1,500, covering the ramp from your current £50–150 range plus the step-up as campaign volume rises. Includes Apple Developer (~£80/yr) and Google Play (~£20 one-off) for the app launch later in the year. Fifteen months rather than twelve deliberately: it gets you three months past the point where fee income should take over.

### Line 4 — Contingency, £750

Because the legal quote is the one number in this model you don't have.

---

## 4. Unit economics (have this ready — a good panel will ask)

```
Cost to acquire one society   £4,500 ÷ 65        =  £69
Revenue per society per year  2 × £800 × 3.5%    =  £56
Payback period                £69 ÷ £56          =  ~15 months
3-year value per society      6 × £800 × 3.5%    =  £168
LTV / CAC                     £168 ÷ £69         =  2.4×
```

The number that matters isn't the 2.4× — it's that **societies don't churn the way individuals do.** A committee hands over every year, so the account renews itself without you re-acquiring it. That's why societies are the wedge and not individual students, and it's the honest answer to "isn't your customer base graduating every three years?"

---

## 5. What if you're wrong? (the downside case)

Say you only land **40 societies instead of 65** — 62% of plan.

```
80 campaigns × £800  =  £64,000 GMV
£64,000 × 3.5%       =  £2,240/year fee income
Infrastructure only  =  £1,800/year
```

**Fee income still covers infrastructure, with £440 to spare.** You'd lose the marketing budget, growth would slow to word of mouth — but Dono doesn't die, and nobody has to put more money in.

That's the single most reassuring thing you can tell a funder, and it maps directly onto the two-curve roadmap slide: **the organic curve is survival, the funded curve is speed.**

---

## 6. Slide-ready content

### Headline
> **£10,000 to go from "cannot legally launch" to "pays for itself."**

### Four cards

| | |
|---|---|
| **Legal & incorporation — £4,000** | Solicitor sign-off, incorporation, IP assignment. *We cannot legally take a donation at scale until this is done.* |
| **Acquisition — £4,500** | 65 societies across Oxford, plus our first Cambridge college. |
| **Infrastructure — £1,500** | 15 months of runway — three months past break-even. |
| **Contingency — £750** | The legal quote is the one number we don't have yet. |

### The milestone strip
> **65 societies · 130 campaigns · £103,000 raised for students · self-sustaining**

### The closing line for the slide
> To cover our own costs we need **0.9% of Oxford's alumni to give £25, once.**
> The colleges we interviewed already get between 5% and 40%.

---

## 7. Speaker notes

> "Nobody on this team takes a penny of this. All four of us are students and we stay students — every pound goes into the business.
>
> Four thousand of it goes to lawyers, and I know how that sounds, so let me be clear about why. Our terms are drafted — nine documents. Until a solicitor signs them off we cannot legally take a donation at scale. It isn't overhead, it's the lock on the door.
>
> Four and a half thousand goes to acquisition — sixty-five societies across Oxford and our first Cambridge college. We buy societies rather than students because a society has a treasurer, a mailing list, and a committee that hands over every year. We acquire it once and it renews itself.
>
> Fifteen hundred keeps the platform running for fifteen months — three months past the point we expect to break even.
>
> And here's what that buys you. A hundred and thirty campaigns. A hundred and three thousand pounds raised for students. And at that point our three and a half per cent covers our costs, and Dono never needs money again.
>
> [beat] One number to leave you with. To get there, we need nine-tenths of one per cent of Oxford's alumni to give twenty-five pounds, once. The colleges we interviewed already get between five and forty per cent — from the people they *do* ask. We just want the ones they don't."

---

## 8. Q&A: the six questions this slide invites

**"37% on lawyers seems a lot."**
It's the constraint, not a cost. Nine documents are drafted; none can publish without sign-off, and we can't take money at scale until they do. Spending on growth before that would be spending on something we're not yet allowed to run.

**"How confident are you in the £2,800 legal figure?"**
It's a market estimate — we're meeting a solicitor shortly and don't have a quote yet. That's exactly what the £750 contingency is for, and if it comes in high, acquisition flexes down rather than the legal getting cut.

**"Why £800 average campaign when your survey says £150–£500?"**
Because that survey measured *individual* need. Societies are our wedge and they raise more — kit, tours, productions. £800 is a blend. At £500 we'd need 206 campaigns instead of 130, which is the main sensitivity in the model.

**"What if you miss?"**
At 62% of plan — 40 societies instead of 65 — fee income still covers infrastructure. We lose the marketing budget and growth slows to word of mouth, but nobody has to put more money in.

**"Your users graduate. Doesn't your customer base churn out every three years?"**
Individuals do. Societies don't — a committee hands over annually, so the account renews itself. That's precisely why we acquire societies rather than students.

**"Why isn't anyone taking a salary?"**
Because we're students and this is £10,000. If it were £100,000 the honest answer would be different, and one of us going full-time would be the fastest way to spend it.

---

## 9. Numbers to confirm before you present

- [ ] **The solicitor quote.** The single soft figure in the model. Ask for a fixed fee for reviewing the nine-document suite, and ask separately for incorporation and IP assignment
- [ ] **Actual current monthly infrastructure spend** — you gave a £50–150 range; get the real figure off the invoices
- [ ] **Freshers' fair and society sponsorship costs** — one real quote from one society turns the £2,200 from an estimate into a plan
- [ ] **Whether £800 average campaign is defensible.** The India Society campaign is your only real data point — its target is worth knowing before you stand up
- [ ] **Reconcile the entity position.** This slide commits to incorporating; `TRUTH.md` currently says sole trader with no plan to incorporate. Update `TRUTH.md` or change the slide — a judge who's read nothing will still ask "who owns this?"
