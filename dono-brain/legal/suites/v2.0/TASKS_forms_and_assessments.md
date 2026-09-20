# Dono — Tasks, forms and assessments to complete

**Context:** Dono is a ~6-week-old sole-trader startup currently demoing with a few societies, and may launch soon. This list is **right-sized for that stage** — it flags what genuinely applies to a small student-fundraising platform now, what can be lightweight, and what only matters at larger scale. It is not a "big-company compliance programme". Nothing here is legal advice; the whole suite still needs a UK solicitor's sign-off.

**Legend:** 🔴 before taking real money / public launch · 🟠 soon after launch or as you onboard more societies · 🟢 while demoing (light touch) · 💷 costs money · ⚖️ solicitor · 🧮 needs a number/decision from the team

---

## 1. Decisions the team must make (🧮)

1.1 🔴🧮 **De minimis surplus threshold.** Calculate the amount(s) below which a residual surplus need not be refunded, accounting for the 20p fixed fee and Stripe per-transaction costs. Example to work from: a £1,000 campaign that raises £1,001 → the £1 need not be refunded. Give engineering a single configurable figure (and, if useful, a per-donor floor). *(Terms 14.5; Refund 10.3.)*
1.2 🔴🧮 **Liability caps.** v2.1 uses £100 (consumers) / £250 (campaign owners & societies). Confirm these with the solicitor as commercial figures; raise them later once incorporated and insured.
1.3 🟠🧮 **Launch countries for donors.** Donors are worldwide by default. Decide whether to restrict at launch (sanctions/tax simplicity) — campaign owners and institutions are UK-only regardless.

## 2. Legal sign-off (⚖️💷)

2.1 🔴⚖️ **Full solicitor review of the v2.1 suite**, especially: the conditional-contribution characterisation of a donation; consumer liability/indemnity; the Stripe/FCA payment perimeter; the society (unincorporated) capacity and personal-account issues; and the governing-law/consumer carve-out.
2.2 🔴⚖️ **Confirm the FCA payment perimeter** — that owner-executed refunds and Dono taking an application fee on Stripe Connect Standard direct charges does **not** make Dono a regulated payment service. (We removed the platform-initiated refund power to stay clear of this.)
2.3 🟢⚖️ **Confirm the ICO position** (see §5.1). Small/low-risk, but cheap to get right.

## 3. Online Safety Act (🔴 — applies regardless of size)

The Act applies to user-to-user services by function, **not** by company size. Public comments + campaign content very likely bring Dono in scope. These are the items an early-stage in-scope service still needs — keep them proportionate but do them.

3.1 🔴⚖️ **Scope memo** — written view on whether Dono is a regulated user-to-user service and which duties apply.
3.2 🔴 **Illegal-content risk assessment** — a documented assessment mapping priority offences to your product controls (reporting, removal, moderation). Ofcom expects the record, not perfection.
3.3 🔴 **Children's access assessment** — because public pages/comments are browseable, assess whether children are likely to access the service; either adopt effective age assurance or design for child-safe operation. Ties to the age-signal question for engineering.
3.4 🔴 **CSEA reporting route** — a simple, restricted procedure to report detected child sexual exploitation/abuse content to the NCA, with a designated person. Low volume expected, but the duty is absolute.
3.5 🟠 **Online Safety complaints procedure** — report categories, acknowledgement, triage, reasoned outcomes, appeals, record-keeping (can live inside your Complaints Policy).

## 4. Data protection (🔴/🟠 — proportionate)

4.1 🔴 **DPIA** — required before launch because you process identity documents for a largely young user base. Keep it focused: identity verification, receipts/third-party data, moderation, institutional sharing. One good document, done before the stack is frozen.
4.2 🔴 **ROPA / data inventory** — a short record of processing by role and data field (the Privacy Notice table is most of it).
4.3 🔴💷 **Data Processing Agreements** with every processor (hosting, DB, storage, auth, email, analytics). Usually click-through/standard — collect and file them.
4.4 🔴 **International-transfer assessments** — for any processor storing data outside the UK, record the safeguard (adequacy / IDTA / UK Addendum).
4.5 🔴 **Legitimate-interests assessments (LIAs)** — short LIAs for fraud prevention, dispute handling, platform security/improvement, backups.
4.6 🔴 **Incident-response plan** — a one-to-two-page tested procedure: detect → assess → notify ICO where required (72h) → notify affected people where high risk → preserve evidence; name the responsible person.
4.7 🔴 **Data-protection complaints workflow + form** — acknowledge within 30 days, investigate, inform, communicate outcome (new statutory duty from 19 June 2026). A simple form + tracked inbox is enough at this stage.

## 5. Registrations & money (💷)

5.1 🟢💷 **ICO data-protection fee self-assessment** — determine whether you must register and pay (small-org fee is modest) or whether an exemption applies; then either register and state the number factually, or rely on the exemption without mentioning the fee. Don't claim registration is universally required.
5.2 🟠💷 **Insurance** — professional indemnity and cyber cover. Not mandatory at demo stage, but it materially changes the liability analysis and lets you raise the caps. Get quotes before real volume.
5.3 🟢 **VAT** — confirm you're under the threshold and set up threshold monitoring; keep the "not VAT registered" line accurate.

## 6. Internal documents to write (🟠 — staff-facing, not published)

Keep these short and practical; they're for your small team, not a bank.

6.1 🔴 **Financial Crime & Payments Policy** (~1–2 pages) — Stripe handles payment processing/KYC/sanctions/fraud; Dono handles campaign moderation, verification, prohibited-activity enforcement and platform monitoring; how staff escalate suspicious activity (pause, preserve evidence, cooperate with Stripe/law enforcement); keep basic incident records. *(Replaces the heavy "AML programme" the review contemplated — you don't need a bank-style programme on Stripe Connect Standard.)*
6.2 🟠 **Internal Moderation Policy** — how staff handle passports/medical/criminal/disciplinary/religious material: restrict access → assess necessity → redact → escalate → delete → record. Include a short review checklist (document uploaded; amount matches within tolerance; description matches purpose; legible; no obvious alteration; escalate concerns).
6.3 🟠⚖️ **Special Category & Criminal Data Policy** — the internal record of Article 9 / Article 10 / Schedule 1 conditions and safeguards (this is the one to have the solicitor check).
6.4 🟠 **Data Retention Policy (internal)** — the operational version of the Privacy Notice table, with deletion triggers, "delete most sensitive first", and the legal-hold override.
6.5 🔴 **Refund decision checklist / consistency notes** — so different team members decide alike (balance of probabilities, materiality, causation, conflicts/recusal). Short; supports the Refund Policy framework.

## 7. Public/hybrid documents to add (🟠)

7.1 🟠 **Complaints Policy** (standalone) — scope (covers account suspension, campaign removal, verification, technical issues, moderation, fees — not just refunds), how to complain, investigation, decision, internal review, final response, and ADR signposting **only where required**. Don't promise ADR you aren't obliged to offer. Cross-referenced from Terms §33.
7.2 🟠⚖️ **Institution Agreement** — the contract with participating universities/development offices: data used only for the agreed thank-you/events purpose, UK GDPR + PECR compliance, honour withdrawals, no unrelated use, deletion when no longer needed. Needed before the institution opt-in feature goes live.
7.3 🟢 **Verification Notice, Privacy Notice, Cookie Notice** — now reclassified as notices; make sure the website labels them as such and removes "incorporated into the Terms".

## 8. Onboarding forms & data capture (🟠 — mostly product/ops)

8.1 🔴 **Society Representative onboarding form** — capture full name, email, role; the authority declaration ("I confirm I am authorised under the Society's constitution…"); the asset-owner field (Society / College / University / charity / trustee / office-holders); and, for large campaigns, a constitutional-approval confirmation.
8.2 🟠 **Succession form** — record the primary and secondary representative at setup; the change-of-representative flow (verify incoming, committee confirmation, connect Stripe, balance handling).
8.3 🔴 **Checkout consent capture** — fee-cover (unticked), hide-my-name, and the institution data-sharing + separate marketing consents, each storing wording/version/timestamp.
8.4 🟢 **Demo readiness check** — before each society demo, confirm no real money moves (or, if it does, that the Stripe config and refund flow are tested), and that the notices shown are the current versions.

## 9. Pre-launch acceptance test (🔴)

9.1 🔴 **Legal-product acceptance test** — run real sandbox scenarios end-to-end: donation, full/partial refund, chargeback, material-change refund window, closure + deemed acceptance, data-deletion, report/appeal, account closure. Remove or soften any Term the product can't actually deliver (this is the single biggest risk the review flagged).

---

### What you can reasonably de-prioritise at this stage
- A full enterprise AML programme, sampling/audit of receipts, and formal anonymisation methodologies (motivated-intruder testing) — only needed if you later publish external analytics dashboards or scale significantly.
- Independent third-party appeal reviewers — you'll use different members of the Dono team with recusal rules, which is fine at this size.
- Pro-rata surplus refunds — you've chosen reverse-chronological with a de minimis threshold; keep it.
