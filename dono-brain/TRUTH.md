# TRUTH.md — Dono's ground truth

**What this is.** The single record of Dono's settled decisions. Where any other document in `dono-brain/` disagrees with this file, **this file is right and the other document is wrong** — correct the other document, and if the decision itself has changed, change it here first.

**What belongs here.** Decisions that are high-stakes, or that have previously been a source of contradiction across documents. Not summaries, not reasoning, not history. Each entry is a short statement of what is currently true.

**What does not belong here.** Anything still open, anything being discussed, and anything that is merely a description of how something works. If it is not decided, it is not ground truth.

**How to use it.** Read this before drafting anything. Update it the day a decision is made, not later. Every entry carries the date it was settled, so a stale entry is visible.

**Last updated:** 6 August 2026

---

## Legal & Compliance

### Entity and people

| Decision | Settled |
|---|---|
| **Dono is a trading name of Amrit Kaur Rooprai, a sole trader.** There is no company, and there is no plan to incorporate. Amrit is the contracting party, the data controller and the person accountable for the Platform. No document may refer to "Dono (UK Ltd)", to incorporation being pending, or to a governing body | 31 Jul 2026 |
| **Amrit Kaur Rooprai** is the Online Safety lead, the data protection lead, the financial-crime lead and the incident lead | 31 Jul 2026 |
| **Sashank** is the deputy for all four roles, and the Deputy Organisation Administrator for NCA CSEA reporting | 31 Jul 2026 |
| **Joe** is the second backup for all of the above | 31 Jul 2026 |
| **One contact address for everything: `joindono.team@gmail.com`** — complaints, appeals, reports, privacy queries, subject-access requests and legal notices | 31 Jul 2026 |
| Registered address: 37 St Giles', Oxford OX1 3LD | 30 Jul 2026 |

### Age

| Decision | Settled |
|---|---|
| **There is no age gate on creating an account or on posting a comment.** Signup collects no date of birth, and commenting checks only that you are signed in. No document may claim otherwise | 6 Aug 2026 |
| **Creating a campaign, and acting for a society, each require you to declare a date of birth of 18 or over at that step** — enforced server-side (`assertAdultOrThrow`). This is a per-action gate, not a consequence of account creation | 6 Aug 2026 |
| **Browsing is open to everyone, at any age** | 31 Jul 2026 |
| **Donating is open to everyone, at any age**, with or without an account | 31 Jul 2026 |
| **Age is declared, not verified.** Dono asks for a date of birth and relies on the answer. This is **not** highly effective age assurance and no document may imply that it is. Stripe Identity does not reliably return a date of birth and is not used as an age gate — self-declaration is the intended model, not a gap to be closed | 31 Jul 2026 |
| Checkout asks the donor to confirm they are 18 or over. **There is no parent-or-guardian-permission alternative** — that branch was never built and will not be; no document may offer it. There is **no** cap on guest donations | 6 Aug 2026 |
| **Children are likely to access the service.** Dono operates child-safe by default rather than deploying age assurance to exclude them | 31 Jul 2026 |
| Dono recognises UK **higher-education** institutions only. It does not recognise schools | 31 Jul 2026 |

### Who is who

| Decision | Settled |
|---|---|
| **The Beneficiary of a campaign is its Campaign Owner.** There are no third-party beneficiaries and no pass-through campaigns. Wherever any document says "beneficiary", it means the Campaign Owner | 31 Jul 2026 |
| **The Recipient** is the holder of the Stripe connected account, and may be a different person from the Campaign Owner | 30 Jul 2026 |
| **The owner of the funded property** is whoever the campaign's Ownership Statement names, and may be a third different person | 31 Jul 2026 |
| A **Society Campaign** has **one Society Representative**, who approves it, and **one Secondary Contact**, who is a named backup able to take over. **The Secondary Contact is not a second approver** | 31 Jul 2026 |
| The Society is responsible for complying with the Terms. **Where the Society cannot bear legal responsibility because of its legal status, the Society Representative accepts those obligations personally**, automatically | 31 Jul 2026 |
| For liability purposes: an **individual student Campaign Owner is a consumer**; a **Society is a business user** | 31 Jul 2026 |
| At launch, Dono recognises the **University of Oxford** only, and registration is restricted to `ox.ac.uk` addresses | 31 Jul 2026 |

### Money

| Decision | Settled |
|---|---|
| **Dono does not receive, hold, safeguard or control donation funds.** Every donation is a Stripe Connect **direct charge** to the Recipient's connected account | 31 Jul 2026 |
| **No pooled funds, no community funds, no escrow, no platform-held balance** — at launch or at demo. Not until Dono holds any authorisation required for it | 31 Jul 2026 |
| **Dono's fee is the Payment Provider's applicable cost for the transaction plus 3.5 percentage points.** The 3.5 points is Dono's revenue | 31 Jul 2026 |
| **Dono does not initiate refunds of donations and holds no reserve power to do so.** The Recipient executes every refund from their own account | 31 Jul 2026 |
| **Dono does refund its own platform fee** where a refund is due and the donor was not at fault — proportionately on a partial refund | 30 Jul 2026 |
| **Dono cannot hold, delay or divert a payout**, and no document may claim it can | 31 Jul 2026 |
| The **Payment Provider is the losses collector**; the **connected account** pays processing and dispute fees and **owns any dispute**, including submitting evidence | 31 Jul 2026 |
| A donor may **cover the fee** or have it **deducted**. Where the donor covers it, the donor is Dono's customer for the platform service. Where it is deducted, the **Campaign Owner** is | 31 Jul 2026 |
| All campaigns, targets and donations are in **pounds sterling**, charged and settled in GBP | 30 Jul 2026 |
| Dono is **not VAT registered**; displayed prices contain no VAT element | 30 Jul 2026 |
| **A campaign cannot be funded beyond its target.** Over-funding therefore does not arise, and any over-payment is refunded **in full, with no de minimis** | 31 Jul 2026 |
| **Surplus from under-spend** is refunded in **reverse chronological order** — most recent donor first — not proportionately. A residual amount below a threshold need not be refunded; it **stays dedicated to the campaign purpose, is never kept by Dono**, and is declared in the Closure Statement. *The threshold figure is not yet set.* | 31 Jul 2026 |
| **Recurring donations and matched fundraising are permitted features**, not prohibited categories | 31 Jul 2026 |
| **Commercial and entrepreneurial campaigns are permitted**, but only where no reward, return, repayment, priority access, discount, product, service or other benefit is offered. Anything offering consideration or an investment opportunity is prohibited and removed | 31 Jul 2026 |

### Data protection

| Decision | Settled |
|---|---|
| **The student-card image is deleted immediately after a successful check**; within 30 days if the check is rejected or abandoned. **The card number and extracted details are kept** | 31 Jul 2026 |
| **Dono never receives a government identity document**, a passport, a driving licence, a selfie, or any Stripe KYC document | 31 Jul 2026 |
| **Dono has no KYC obligation of its own.** That obligation is Stripe's | 31 Jul 2026 |
| **Stripe is an independent controller** for payment processing, Connect onboarding and KYC, and fraud prevention — not Dono's processor | 31 Jul 2026 |
| **Analytics runs on consent**, not on legitimate interests and not on the statistical-purpose exception, because events can be linked to an identified user. Nothing analytics-related loads before consent | 31 Jul 2026 |
| **Analytics retention: 26 months** | 31 Jul 2026 |
| **Dono shares no identifiable donor or user data with any institution.** A donor may opt in if the feature is ever offered, but it may not be offered until a named institution, an executed data-sharing agreement and that institution's privacy notice all exist | 31 Jul 2026 |
| **Dono does not infer protected characteristics** — health, religion, sexual orientation, political opinion or any other — from donation history, browsing or any pattern of activity. No tagging, no segments, no use in moderation or fraud scoring | 31 Jul 2026 |
| **Dono does not use user content to train AI or machine-learning models** | 31 Jul 2026 |
| **Retention is field-level, not a blanket six years.** Key periods: account profile 2 years after closure; verification outcome, card number, donation records, campaign ownership, evidence, moderation, reports, complaints, appeals, fraud investigations and acceptance records 6 years; support correspondence 3 years; authentication logs 12 months; analytics 26 months; failed registrations 30 days; backups rolling 30–35 days | 31 Jul 2026 |
| **Campaign pages remain publicly accessible indefinitely at their direct URL.** Completed campaigns are archived — removed from browsing, discovery and search, but still reachable by link | 31 Jul 2026 |
| **Inactive accounts:** notified at 24 months, deleted at 27 months, except for records the retention schedule requires Dono to keep | 31 Jul 2026 |
| **CSEA retention is two clocks, not one:** the NCA report reference for **5 years**; the reported content and prescribed supporting information for **1 year**, in restricted storage. Never a single five-year period | 31 Jul 2026 |
| Processors and regions: **Vercel** (US, Washington DC) hosting; **Convex** (EU, `eu-west-1`) database and file storage; **Convex Auth + Resend** authentication; **Resend** transactional email; **PostHog Cloud EU** analytics; **Stripe** payments. **No error-monitoring product** — Vercel and Convex platform logs only. **No third-party consent-management vendor** — the banner is in-house | 31 Jul 2026 |
| Transfer mechanism for **Convex and Vercel**: EU Standard Contractual Clauses plus the **UK Addendum**. Not the standalone IDTA, and no UK adequacy decision is relied on for the United States | 31 Jul 2026 |

### Liability

| Decision | Settled |
|---|---|
| **No monetary cap on Dono's liability to a consumer.** The £100 and £250 caps are removed. Liability to a consumer is for **reasonably foreseeable** loss caused by Dono's breach or failure to use reasonable care and skill | 31 Jul 2026 |
| **Consumers, including individual student Campaign Owners, are subject to no indemnity** | 31 Jul 2026 |
| For **business users**: indirect and consequential loss excluded, and liability capped at the greater of **£500** or twelve months' platform fees. *Figure not yet solicitor-approved.* | 31 Jul 2026 |
| Dono is an **uninsured sole trader**. No insurance is in place | 31 Jul 2026 |

### Safety and process

| Decision | Settled |
|---|---|
| **One complaints and appeals framework**, in clause 8 of the Community Guidelines. Every other document points at it and none describes it differently | 31 Jul 2026 |
| Three clocks, one address: **online safety** acknowledge within 5 Working Days, outcome within 30 days; **data protection** acknowledge within 30 days; **everything else** acknowledge within 2 Working Days | 31 Jul 2026 |
| An appeal is decided by **someone not substantially involved in the original decision**. Where team size genuinely prevents that, the original decision-maker may reconsider — but only as a documented second look. **Dono does not promise independence it cannot supply** | 31 Jul 2026 |
| **Every campaign is reviewed by a person before publication.** Comments are **post-moderated** | 30 Jul 2026 |
| **Comments permit no links, no attachments and no images** | 31 Jul 2026 |
| **No private messaging**, no livestreaming, no private groups, no disappearing content, no recommendation feed | 30 Jul 2026 |
| **"Hide my name" hides the name from Dono's public pages only.** The donation amount is still shown. Because donations are charged directly to the Recipient's own Stripe account, **Dono cannot guarantee the name is hidden from the account holder** — and says so. Dono itself always holds the name, and does not disclose it to the Campaign Owner as a dispute step | 31 Jul 2026 |
| **Deemed acceptance of a Closure Statement is replaced by administrative closure.** Dono missing its own 30-day deadline records only that — it is not a finding that the Campaign Owner complied | 31 Jul 2026 |
| **Dono does not carry out "institution verification".** It checks a student card and a university email itself. No institution confirms anything as part of the publication check | 31 Jul 2026 |
| **Dono does not use "Verified" badges** | 30 Jul 2026 |
| **Refund grounds split in two.** Objective grounds — duplicate payment, payment error, unauthorised payment, a donation by a child without permission, campaign cancellation, verification failure, surplus — do **not** require materiality or causation. Conduct grounds do | 31 Jul 2026 |
| Dono is **not treated as being in the regulated sector** for anti-money-laundering purposes, unless legal advice concludes otherwise. **UK sanctions apply to Dono independently of Stripe** | 31 Jul 2026 |
| Response deadlines for users are **ten Working Days**, extendable on reasonable request | 31 Jul 2026 |
| **Dono operates primarily for UK students and UK student organisations.** Campaign Owners must be UK-based; donors may be anywhere, but access from outside the UK is not targeted or guaranteed | 31 Jul 2026 |

### Document status

| Decision | Settled |
|---|---|
| **`terms_v2.2/` is the current suite.** `terms_v2.1/`, `terms_v2/`, `terms_v1/` and `terms/` are historical and must not be edited | 31 Jul 2026 |
| **Nothing in `terms_v2.2/` is publishable yet.** Every document requires solicitor sign-off, and many clauses describe controls that have not been built | 31 Jul 2026 |
| **No public document may lose its DRAFT banner** until legal, payments, privacy, online-safety and engineering sign-offs are complete for that version and recorded in a launch sign-off register | 31 Jul 2026 |
| Six contractual documents (Terms of Service, Student Campaign Terms, Society Campaign Terms, Donor Terms, Community Guidelines, Refund and Dispute Policy); three notices (Privacy, Cookie, Verification). **The notices are information, not contract** | 30 Jul 2026 |

---

## Product

*Not yet populated. This section is for settled product decisions — what the platform does and does not do, which features are in and out of scope, and the decisions that have previously been a source of contradiction between what documents describe and what exists.*

Candidates to record here when they are confirmed: the feature inventory as built; the campaign lifecycle; what a moderator can actually do; the evidence and closure flow; which surfaces accept user-generated content.

---

## Tech

*Not yet populated. This section is for settled architecture and stack decisions.*

Candidates to record here when they are confirmed: the Stripe Connect configuration and who bears what; the fee calculation as implemented; the auth and session model; storage locations by data type; backup and deletion behaviour; what is logged and for how long.

Note that several technical facts currently sit under **Legal & Compliance** above — the processor list, the regions and the Stripe configuration — because they were recorded there to settle legal contradictions. When this section is populated, keep one authoritative copy and cross-reference rather than duplicating.

---

## Changing an entry

1. Make the decision.
2. Change it here first, with today's date.
3. Then correct every document that depended on it — the reconciliation report at `legal/v2.1-reconciliation-report.md` shows how tightly coupled the legal suite is, and a change to one of these entries typically touches five to nine documents.
4. If the change makes a published document untrue, unpublish it before changing the product.
