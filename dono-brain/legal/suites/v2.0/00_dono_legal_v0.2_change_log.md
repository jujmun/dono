# Dono Legal Suite — v0.2 Change Log

**Date:** 29 July 2026
**Scope:** Documents 01–09. All nine moved from v0.1 to v0.2.
**Status:** Still DRAFT. No document is publishable. Every remaining marker is listed in section 4 below.

---

## 1. Decisions applied in v0.2

### Money

| Decision | Where it lands |
|---|---|
| Platform fee: **5% + 20p** | ToS 16.1; Donor 6.1; Refund 9.1 |
| Non-UK cards: Payment Provider's additional ~2% **passed through as a separate checkout line** | ToS 16.4; Donor 6.4; Refund 9.1, 9.5 |
| **Not VAT registered** — no VAT charged on the platform fee | ToS 16.2; Donor 6.2; Refund 9.1 |
| **GBP-only** presentment; donor's issuer converts; donor bears any FX difference | ToS 4.5; Donor 2.2, 2.3; Refund 6.6 |

### Campaign categories

- **Permitted:** religious society activities; animal-related **projects** (research, fieldwork, conservation, society activity) — ToS 8.2, 8.3
- **Permitted but discouraged and closely scrutinised:** commercial start-ups, with a mandatory prominent disclosure that donors receive nothing while value accrues to the owner — ToS 8.4; Student 4.4; Donor 3.4
- **Prohibited:** funding a specific identified animal; tuition fees; rent; ordinary living costs; personal hardship; medical expenses; registered-charity fundraising; legal expenses; regulated goods; retrospective reimbursement; matching funds; raffles, lotteries and prize draws; recurring donations; pooled funds — ToS 8.3, 8.5

### Eligibility

- Interruption and leave of absence **permitted** on self-declaration of return before the Campaign End Date — Student 2.3; Verification 9.1.1
- Suspension **refused** while it lasts — Student 2.4; Verification 9.1.2
- Distance/part-time students outside the UK fail the existing "physically studying in the UK" test; no separate machinery added — Student 2.7; Verification 9.1.3
- **Course End Date**, not the graduation ceremony, drives the 60-day rules — new defined term in ToS 2.1; applied at ToS 6.6; Student 2.5, 2.6, 5.2, 12.1; Society 6.1; Verification 3.1.1(i), 9.2
- **One** Responsible Individual approves a Society Campaign, with reasoning recorded — Society 2.3; Verification 5.4

### Evidence, updates, closure

- Receipts **private to Dono**; not published, not shown to donors — Student 9.3; Society 4.4; Donor 9.2; Refund 11.3; Privacy 11.2
- Public **evidence status** instead: *received and reviewed* / *outstanding* / *overdue*, with an express statement of what it does not mean — ToS 9.2, 10.3, 26.3; Student 9.7; Donor 9.3, 9.4; Community 4.4; Verification 7.6; Refund 11.5
- **Redaction checklist drafted** — Student 9.4; Refund 11.4; Privacy 11.3. Note that with private receipts the checklist is now a data-minimisation control rather than a third-party protection, so it is deliberately lighter: card and bank details, non-supplier third parties, unrelated purchases and special category data must go; supplier names, prices, dates and references must stay, because Dono needs them to review against the budget.
- **Closure Statement mandatory**, and the trigger that ends update obligations — new defined term in ToS 2.1; ToS 7.2, 10.2; Student 9.6; Society 4.2; Refund 3.1(m), 11.6
- Quarterly progress updates during fundraising **confirmed** — Student 9.5; Society 4.2; Refund 11.2

### Deadlines

- Information requests: **five working days** — ToS 6.4, 10.1(e); Student 3.4, 11.1; Society 4.2; Verification 3.2.3
- Refund decisions: **21 calendar days** — Refund 5.4.1; ToS 13.1; Donor 11.3; Student 11.1; Society 7.1
- All appeals: **ten working days** — Refund 4.4; Community 8.2; Verification 10.3; ToS 17.3

### Donor-facing

- Anonymity is **one control**: hides the donor from the public **and** from the Campaign Owner — ToS 11.5; Donor 8.1; Privacy 10.1; Refund 5.3.2
- Comments **always display a name**; no anonymous commenting — ToS 17.2; Donor 8.3; Community 5.2; Privacy 10.4
- Anonymity **changeable at any time**, future display only — Donor 8.4; Privacy 10.3
- Receipt: **Dono-branded, recording the Campaign Owner as Merchant of Record**, showing amount, date, campaign, recipient, platform fee separately, fee-cover, non-UK card cost, and a statement that it is not a charitable tax receipt — Donor 7

### Structural

- Business address **37 St Giles', Oxford OX1 3LD** inserted in all nine documents
- **Not incorporating before launch.** ToS 33.1 redrafted so transfer on incorporation is clean and notified
- Liability cap: **greater of** platform fees on the relevant Campaign **or** the Donation(s) to which the claim relates, plus an aggregate 12-month cap — ToS 28.3, 28.4
- **No insurance**, recorded at Privacy 1.5 and flagged in the priority counsel marker at ToS 28.5
- Development-office opt-in narrowed to **five fields**: name, email, donations to that Institution's Campaigns, donation dates, fee-cover election. Comment history and browsing history cut, with the reasoning recorded — Privacy 9.3.1, 9.3.2

---

## 2. Contradictions resolved

| # | Was | Now |
|---|---|---|
| 1 | Refund execution: Refund 6.1 said Campaign Owner, ToS/Student/Society said Dono | **Campaign Owner executes.** Dono-initiated power retained as a dormant reserve authorisation, drafted but not exercised, pending FCA advice — ToS 15.3, 15.4; Student 11.2, 11.3; Society 4.3; Refund 6.1–6.3 |
| 2 | "Stripe onboarding completed" was a public badge in ToS 9.1 and Community 4.2 | **Internal only**, with the three-part reasoning recorded — ToS 9.3; Community 4.3; Verification 4.3 |
| 3 | Reverification: "start of each academic year" vs October/expiry | **October or card expiry, three-month carve-out** — ToS 6.3; Student 3.3; Verification 8 |
| 4 | Student 9.5 listed six questions already answered elsewhere | Resolved and removed |
| 5 | Donor 8.2 listed three anonymity questions already answered | Resolved and removed |
| 6 | Donor 10.3 said decision deadline TBC | **21 calendar days** |

---

## 3. Repository corrections still outstanding

These are actions in `dono-brain`, not in these documents:

1. **`legal-terms-context-handoff.md` §21.5** — still contemplates Dono initiating refunds in v1. Correct to reflect the reserve-authorisation model. (Internal note retained at Refund 6.3 for now; remove before publication.)
2. **`engineering/product-legal-alignment-roadmap.md`** — badge list still includes "Stripe Onboarding Completed" and a generic "Verified Student". Both contradict the Verification Policy. Correct before the badge system is built.
3. **`legal-terms-context-handoff.md`** — update §4.1 (currency), §19 (fee model), §23 (categories), §13 (evidence visibility) and §25.6 (development-office fields) to match the decisions above, so the handoff stops disagreeing with the drafts.

---

## 4. Every remaining marker, by who resolves it

### [DEVELOPER INPUT REQUIRED] — one conversation

Hosting; database and backend; file storage; authentication and password architecture; transactional email; analytics; error monitoring; cookie consent tool; backup cycle and deletion propagation; whether Stripe returns a usable age signal; confirmation that card details never reach Dono; confirmation that student-card extraction discards unneeded fields; security measures; breach procedure.

**Blocks:** the whole of Cookie Policy clause 4, Privacy clauses 8 and 13, ToS 5.2 and 15.7, Verification 4.5.3.

### [SUBJECT TO STRIPE CONFIGURATION] — dashboard and Connect docs

Negative-balance allocation; dispute fees; who submits dispute evidence; whether the application fee can be reversed automatically; exact permissions on Standard accounts; whether the reserve refund authorisation is technically possible; whether unincorporated societies can in fact onboard; fee mechanics on surplus and micro-refunds.

**Blocks:** ToS 15.5, 16.7; Student 8.2, 11.3, 11.4; Society 3.2, 4.3, 6 note; Donor 10.3, 11.5, 13.3; Refund 8.2, 8.4, 9.6, 10.6; Privacy 5.5.

### [COUNSEL REVIEW REQUIRED] — one review of the finished suite

FCA perimeter on the reserve refund authorisation (ToS 15.4; Student 11.3; Society 4.3; Refund 6.3); **liability cap — flagged as priority given no incorporation and no insurance** (ToS 28.5); indemnity enforceability (ToS 29.1); consumer-law review including whether donors are consumers and the characterisation of a Donation (ToS 12.1, 32.1; Donor 16.1; Refund 13); Online Safety Act scope (Community 9.1; Privacy 4.2); order of precedence (ToS 1.7); content licence scope (ToS 19.1); unincorporated association obligations (Society 1.3, 9.1); UK GDPR consent standard and PECR for the institution opt-in (Privacy 9.3.6); DPIA (Privacy drafting note).

### [ACCOUNTANT REVIEW REQUIRED]

Confirm the VAT position and set up threshold monitoring (ToS 16.2).

### [ACTION REQUIRED]

**ICO registration and data protection fee** (Privacy 1.4). Legal requirement, roughly £52, must be done before processing any personal data.

---

## 5. Artefacts promised by the drafts but not yet built

1. **Institution Agreement** — never drafted. Not needed for launch, but Privacy 9.3.6 points at it.
2. **Institution consent wording** — the actual form of words for the opt-in.
3. **DPIA** — likely required before launch.
4. **Online Safety Act illegal-content risk assessment** — if the service is in scope.
5. **Checkout copy** — the surplus disclosure (Refund 10.5), the reverse-chronological explanation, and the anonymity trade-off note (that anonymous donors cannot be thanked).

---

## 6. Two operational commitments worth naming

**The 21-day refund decision** is now a published promise from a solo operator. It is achievable but it will be held against you, and it interacts with card-issuer chargeback windows — which is why Refund 2.2 and Donor 13.2 both warn donors about the timing.

**Anonymity hiding donors from Campaign Owners** means societies cannot thank donors by name. Expect friction. The trade-off is disclosed at Donor 8.5 and Privacy 10.6, but it belongs in the checkout copy too.
