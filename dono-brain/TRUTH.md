# TRUTH.md — Dono's ground truth

**What this is.** The single record of Dono's settled decisions. Where any other document in `dono-brain/` disagrees with this file, **this file is right and the other document is wrong** — correct the other document, and if the decision itself has changed, change it here first.

**What belongs here.** Decisions that are high-stakes, or that have previously been a source of contradiction across documents. Not summaries, not reasoning, not history.

**How to use it.** Read this before drafting anything. Update it the day a decision is made, not later. Every entry carries the date it was settled, so a stale entry is visible.

**Last updated:** 6 August 2026

**Status column.** Every entry carries one:

| Status | Meaning |
|---|---|
| **CURRENT** | True of the product and the business today |
| **APPROVED — NOT YET IMPLEMENTED** | Decided and reflected in the legal documents, but the product does not do it yet. **The corresponding clause may not be published where publishing it would be inaccurate** — see `terms_v2.3/ENGINEERING_IMPLEMENTATION_CHECKLIST_v2.3.md` |
| **FUTURE** | Intended, not decided in detail, not drafted |
| **AWAITING DECISION** | Open — see `terms_v2.3/UNRESOLVED_QUESTIONS_REGISTER_v2.3.md` |
| **SUPERSEDED** | Was true, is not. Kept so the change is visible |

**Last updated:** 6 August 2026 (revision 2, incorporating verified engineering evidence dated 5 August 2026)

---

## Legal & Compliance

### Entity and people

| Decision | Status | Settled |
|---|---|---|
| **Dono is a trading name of Amrit Kaur Rooprai, a sole trader.** She is the contracting party, the data controller and the person accountable for the Platform. No document may refer to "Dono (UK) Ltd" or to a governing body | CURRENT | 31 Jul 2026 |
| **Incorporation is not required.** The governance model is a sole trader plus written agreements with every contributor. The suite is drafted so incorporation later is possible without redrafting | CURRENT | 6 Aug 2026 |
| **Amrit Kaur Rooprai** is the Online Safety lead, data protection lead, financial-crime lead and incident lead | CURRENT | 31 Jul 2026 |
| **Sashank** is the deputy for all four roles, and Deputy Organisation Administrator for NCA CSEA reporting | CURRENT | 31 Jul 2026 |
| **Joe** is the second backup | CURRENT | 31 Jul 2026 |
| **One contact address for everything: `joindono.team@gmail.com`.** Dono operates a **single public support email** at launch and early-stage operations. No multiple inboxes, ticketing systems, role-based queues, shared mailboxes or category-specific infrastructure. No document may claim otherwise. Dedicated tooling may be introduced later; it is not a launch requirement | CURRENT | 6 Aug 2026 |
| Registered address: 37 St Giles', Oxford OX1 3LD | CURRENT | 30 Jul 2026 |
| **Every founder, contributor, volunteer and contractor must accept the Team and Contributor Agreement** (`terms_v2.3/dono-team-and-contributor-agreement-v2.3.md`) before accessing production systems or personal data. It covers IP assignment, confidentiality, data protection and authorised access, security, decision authority, conflicts, and exit and offboarding with immediate access removal | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |
| **There is no code review gate, no code-owners file and no branch protection.** Anyone with commit access can change legal copy, a document version constant, the fee calculation or a feature flag and ship it — and **bumping a version constant invalidates every prior acceptance and forces global re-acceptance.** The legally accountable person holds roughly 4% of commits. **A review gate on the files that carry legal effect is a launch blocker** (item GV-09) | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |
| **No engineering release owner, backup or version-identifier convention exists.** One must be named, with a sign-off statement pinning the deployment, the payment account and mode, and the commit (item GV-10) | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |
| **A demonstration mode can grant full unauthenticated administrative access on a non-production deployment.** The production gate is sound, but it must be confirmed in writing that the flag is not set on any deployment holding real data (item SE-09) | AWAITING CONFIRMATION | 6 Aug 2026 |
| **FCA authorisation is a long-term goal**, to be pursued with investment funding if the model ever requires it. It is not being sought now and nothing in the product depends on it | FUTURE | 6 Aug 2026 |
| **Dono is an uninsured sole trader.** No professional indemnity, cyber, media or public-liability cover. No policy documents exist in the repository. **No document may imply that insurance, a reserve or a compensation scheme stands behind Dono's obligations.** If cover is ever obtained, ToS 27.3 (caps) and Privacy 14.2 (security) must be revisited | CURRENT | 6 Aug 2026 |

### Age

| Decision | Status | Settled |
|---|---|---|
| **You must be 18 or over to create an account** — and therefore to create a campaign, act for a society, or post a comment | CURRENT | 31 Jul 2026 |
| **You must be 18 or over to donate**, and must have legal capacity. Checkout requires: *"I confirm that I am 18 years of age or older and have the legal capacity to enter into this agreement."* | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |
| ~~Donating is open to everyone, at any age~~ | **SUPERSEDED** 6 Aug 2026 | was 31 Jul 2026 |
| **For Donors, age is declared and self-certified, not verified.** No document may imply otherwise | CURRENT | 31 Jul 2026 |
| **For Campaign and Society creators the position is stronger**: the identity check returns a government-document date of birth. It is stored but not yet used as the gate | CURRENT (returned) / APPROVED — NOT YET IMPLEMENTED (used) | 6 Aug 2026 |
| **The 18+ confirmation is not actually captured today.** `ageAttested` is a hardcoded client value written to every donation record as a constant, so the stored field is worthless as evidence. **It must be derived from the user's real confirmation or removed** | **DEFECT — FIX REQUIRED** (item AG-01) | verified 5 Aug 2026 |
| **Account creation and commenting have no age gate at all today**, contradicting the settled 18+ rule for both. Signed-in donations and campaign, society and college creation **do** enforce an adult date of birth, fail-closed | APPROVED — NOT YET IMPLEMENTED (items AG-02, AG-03) | verified 5 Aug 2026 |
| **Where Dono reasonably believes a donation was made by someone under 18, it may cancel or refund it** | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |
| **Browsing is open to everyone, at any age.** **Children are therefore still likely to access the service**, and Dono operates child-safe by default rather than deploying age assurance to exclude them. The 18+ donation rule does not change the children's-access conclusion | CURRENT | 6 Aug 2026 |
| Dono recognises UK **higher-education** institutions only, never schools | CURRENT | 31 Jul 2026 |

### Who is who

| Decision | Status | Settled |
|---|---|---|
| **The Recipient is also the beneficial owner of the donations and of anything bought with them. This is the default and expected position for every campaign** | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |
| ~~The Recipient may be a different person from the Campaign Owner; the owner of funded property may be a third different person~~ | **SUPERSEDED** 6 Aug 2026 | was 30–31 Jul 2026 |
| **Where roles genuinely must differ, it is exceptional** and requires an express written agreement signed by every affected party before publication, covering the intended beneficiary, asset ownership, permitted use, refund responsibility, record-keeping, succession and disputes | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |
| The term is **"Responsible Representative"**, not "Society Representative", throughout the suite | CURRENT | 6 Aug 2026 |
| A Society Campaign has **one Responsible Representative** and **one Secondary Contact**. The Secondary Contact is **not** a second approver | CURRENT | 31 Jul 2026 |
| **Where a Society is unincorporated it has no legal personality and cannot contract. The Responsible Representative is the contracting party**, acting for the Society, and holds or controls the Connected Account **for the Society, not personally** | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |
| **Dono's recourse against a Responsible Representative personally is limited to the funds in the Connected Account they control**, except for fraud, dishonesty, deliberate misuse of funds, material misrepresentation (including lack of authority), and obligations inherently personal at law. **No provision automatically transfers society liabilities to them, and nothing operates as a personal guarantee** | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |
| ~~Where the Society cannot bear legal responsibility, the Society Representative accepts those obligations personally, automatically~~ | **SUPERSEDED** 6 Aug 2026 | was 31 Jul 2026 |
| **A Society is its own category — not a business user.** Business provisions apply only where the user genuinely acts in the course of a trade, business, craft or profession, or is an incorporated commercial organisation. **An individual student Campaign Owner is a consumer. An individual acting as Responsible Representative is a consumer in their own right** | CURRENT | 6 Aug 2026 |
| ~~A Society is a business user~~ | **SUPERSEDED** 6 Aug 2026 | was 31 Jul 2026 |
| **A society must always have a current Responsible Representative.** On a change, the replacement completes onboarding; the outgoing representative must cooperate on transferring the account, records and outstanding obligations; Dono may block new campaigns and suspend a campaign to new donations until the transition completes | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |
| **A registered charity may not hold the Connected Account or funded property for a Society** | CURRENT | 6 Aug 2026 |
| At launch Dono recognises the **University of Oxford** only. **The `ox.ac.uk` requirement applies to accounts used to create or operate Campaigns and Societies. A donor account may be opened with any email address** | CURRENT | 6 Aug 2026 |
| ~~Registration is restricted to `ox.ac.uk` addresses~~ — true only for student accounts | **SUPERSEDED** 6 Aug 2026 | was 31 Jul 2026 |
| **Account type is fixed when first chosen** and cannot later be switched to a student account without a valid institutional address | CURRENT | 6 Aug 2026 |
| **At launch, every Campaign is a Society Campaign.** A Campaign is created by an approved society member, approved by the society, and receives Donations into that society's Connected Account. **Individual campaigns are not available at launch but will be offered shortly**; the legal infrastructure for them is drafted and must be kept sound | CURRENT (society-only) / FUTURE (individual, weeks away) | 6 Aug 2026 |
| **An unincorporated society's Connected Account is opened by the Responsible Representative onboarding to the Payment Provider as a sole trader, in their own name.** Confirmed working. The account is legally theirs, held for the society; they may have their own HMRC obligations, on which Dono does not advise | CURRENT | 6 Aug 2026 |

### Money

| Decision | Status | Settled |
|---|---|---|
| **Dono does not receive, hold, safeguard or control donation funds, and holds no payment account.** Every donation is a Stripe Connect **direct charge** to the Recipient's connected account | CURRENT | 31 Jul 2026 |
| **No pooled funds, no community funds, no escrow, no platform-held balance, no payout delays, no reserves** — not at launch, not at demo. Any change here requires legal advice first, because each of these pushes Dono toward the FCA perimeter | CURRENT | 31 Jul 2026 |
| **Dono charges a fee of 5% + 20p.** Flat. **Identical regardless of card, payment method or country.** Collected as a Stripe application fee; it is Dono's revenue | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |
| **What the product does today is the opposite, and must change before launch: no Dono fee is charged at all, and the donor is charged Stripe's processing cost on top at a rate that varies with their card** (1.5% + 20p standard UK up to 5.25% + 20p international with conversion). **That is a card-dependent charge on a consumer and is the prohibited surcharge under reg 6A.** Checkout also displays the standard-UK figure regardless of card, so a donor can be charged more than they were shown | **SUPERSEDED — must be removed** (items PF-12, PF-13) | verified 5 Aug 2026 |
| **The Payment Provider's payouts run on a delay and then a schedule**, so donation funds sit in the Connected Account for a short period. This makes a promptly-raised refund more likely to succeed. It is a provider setting, not a Dono capability, and Dono still cannot hold or delay a payout | CURRENT | 6 Aug 2026 |
| **Negative balances are debited from the Connected Account holder's bank account**; anything unrecoverable is absorbed by the Payment Provider | CURRENT | 6 Aug 2026 |
| **Dono's ability to instruct a refund on a Connected Account is technically confirmed.** The capability exists and is already used for one internal path. The mandate in the Terms is therefore implementable | CURRENT (capability) / APPROVED — NOT YET IMPLEMENTED (the donor-refund path itself) | 6 Aug 2026 |
| **`stripe.createFundPaymentIntent` is a live, public, unauthenticated path that charges Dono's own platform account as merchant of record**, with no age gate and no terms acceptance. **This breaches the no-pooled-funds decision and, if it has been used, means Dono has received donation funds. It must be removed at the API boundary before beta** | **BREACH — REMOVAL REQUIRED** (items CF-01 to CF-03) | verified 5 Aug 2026 |
| **There is no server-side cap on funding a Campaign beyond its target today.** The decision that a Campaign cannot be over-funded stands and must be built (item CR-09). Where a payment nevertheless completes past the target, the excess is refunded in full | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |
| **Society-level monthly subscriptions are live** and must be removed at the API boundary, together with their automatic refund-and-cancel path. They currently enforce **no age check and no legal-acceptance check** | **REMOVAL REQUIRED** (item CR-01a) | verified 5 Aug 2026 |
| **Match Windows exist and are publicly visible**, created by administrators with a multiplier, budget and sponsor label. They must be removed (item CR-02a) | **REMOVAL REQUIRED** | verified 5 Aug 2026 |
| **Payment methods currently enabled go well beyond cards** and include several country-specific local methods. They should be restricted to card, Link and mainstream wallets for beta, because enabling local methods for specific countries weakens the "not targeting any market" position | APPROVED — NOT YET IMPLEMENTED (item PF-15) | 6 Aug 2026 |
| **The card statement descriptor currently reads `DONO DONATOIN`** and must be corrected | **DEFECT — FIX REQUIRED** (item PF-14) | verified 5 Aug 2026 |
| ~~Dono's fee is the Payment Provider's applicable cost plus 3.5 percentage points~~ | **SUPERSEDED** 6 Aug 2026 — card-dependent, risked being a prohibited surcharge under reg 6A of the Consumer Rights (Payment Surcharges) Regulations 2012, and the code charged 5% + 20p anyway | was 31 Jul 2026 |
| **No hard-coded processing-cost table appears in any contractual document.** A dated, expressly non-contractual internal copy lives at `terms_v2.3/dono-fee-and-processing-cost-reference-v2.3.md` | CURRENT | 6 Aug 2026 |
| **Stripe's processing cost is borne by the Connected Account and is never charged to the donor.** It is shown at checkout as a deduction from the amount reaching the campaign | CURRENT | 6 Aug 2026 |
| **Fee cover is limited to Dono's fee.** It never includes Stripe's cost, and **no document may say that fee cover makes the full intended amount reach the campaign — it does not** | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |
| **The Campaign Owner is Dono's customer for the platform service in every case**, whether or not a donor covers the fee | CURRENT | 6 Aug 2026 |
| **Dono may change its fee, prospectively only** — future campaigns and future donations. Existing donations are never repriced; live campaigns are grandfathered | CURRENT | 6 Aug 2026 |
| **Dono's application fee must be recorded separately from campaign money and from Stripe processing costs**, in the product and in the accounts | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |
| **Refund authority model.** Dono does not hold customer funds. **Under the Terms, the Campaign Owner and Recipient grant Dono advance irrevocable authority, as their agent for that limited purpose only, to instruct the Payment Provider to reverse a charge from the Connected Account.** Dono decides whether a refund is due, its amount and the remedy. The Campaign Owner may appeal after the refund has been processed | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |
| ~~Dono does not initiate refunds and holds no reserve power to do so~~ | **SUPERSEDED** 6 Aug 2026 | was 31 Jul 2026 |
| **Dono still cannot hold, delay, divert or recall a payout**, cannot recover money already spent, holds no reserve, and never pays refunds from its own funds | CURRENT | 31 Jul 2026 |
| **Dono refunds its own fee** where a refund is due and the donor was not at fault — proportionately on a partial refund | CURRENT | 30 Jul 2026 |
| The **Payment Provider is the losses collector**; the **connected account** pays processing and dispute fees and **owns any dispute**, including submitting evidence | CURRENT | 31 Jul 2026 |
| **Every donation has one dispute state** covering refund requests, chargebacks and completed refunds. **Dono checks for an existing chargeback before executing any refund**, alerts the account holder before card-network deadlines, notifies them immediately of any refund request or chargeback, records evidence of every completed refund, and may recover a duplicate where both a refund and a chargeback succeed | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |
| All campaigns, targets and donations are in **pounds sterling** | CURRENT | 30 Jul 2026 |
| **Dono is not VAT registered.** No amount anywhere includes or is described as VAT, and no VAT invoices are issued | CURRENT | 30 Jul 2026 |
| **A campaign cannot be funded beyond its target.** Any over-payment is refunded in full | CURRENT | 31 Jul 2026 |
| **There is no de minimis.** Every penny of unused money is refundable. Campaign owners are told to request an accurate amount first time | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |
| ~~A residual amount below a threshold need not be refunded~~ | **SUPERSEDED** 6 Aug 2026 | was 31 Jul 2026 |
| **Dono will never use pro rata refunds.** Surplus is allocated **reverse chronologically** — most recent donor first — **and, independently, any donor may claim their share of unused funds**. One ledger reconciles both so nothing is refunded twice | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |
| **Money not used for the explicit purpose of the campaign, or a purpose strongly related to it, must be refunded in full.** No allowance for small deviations | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |
| **Serious breaches are standalone refund triggers.** Fraud, misuse of funds, unauthorised material changes, failure to provide mandatory evidence after a cure period, inability to use funds for the stated purpose, material misrepresentation and failure to proceed each independently justify a refund. **No materiality, reliance or causation test applies. Proportionality governs the amount only** | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |
| **A campaign owner is contractually prohibited from spending affected funds during a material-change notice period.** Breach may lead to suspension, removal, institutional referral, a report to the police and legal action. **Dono cannot freeze funds and does not claim to** | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |
| **Recurring donations are removed from the Platform and from every document.** Engineering must remove anything implementing them | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |
| **Matched fundraising and Match Windows are removed** from the Platform and every document. Engineering must remove anything implementing them | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |
| ~~Recurring donations and matched fundraising are permitted features~~ | **SUPERSEDED** 6 Aug 2026 | was 31 Jul 2026 |
| **Recurring donations and matched fundraising may return** under a proper lifecycle-controls framework and a signed matching agreement respectively | FUTURE | 6 Aug 2026 |
| **Commercial and entrepreneurial fundraising is prohibited.** If Dono later supports it, a separate framework is needed with dedicated onboarding, trader declarations, business terms, tax warnings, consumer and marketing compliance, and any platform-to-business disclosures | CURRENT | 6 Aug 2026 |
| ~~Commercial and entrepreneurial campaigns are permitted where no consideration is offered~~ | **SUPERSEDED** 6 Aug 2026 | was 31 Jul 2026 |
| **Campaigns must primarily benefit the Campaign Owner or their Society.** Third-party, charitable and public-benefit fundraising is prohibited, including where a campaign is charitable in substance. A campaign is **not** prohibited merely because its subject falls in a field the law also treats as charitable — the test is who the money and the funded assets are for | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |
| **Start a monthly rolling-total spreadsheet of all sole-trader taxable revenue** now. VAT registration preparation, invoice and credit-note automation, Making Tax Digital and place-of-supply workflows wait until roughly **£60,000–£70,000** rolling taxable turnover | CURRENT (spreadsheet) / FUTURE (tooling) | 6 Aug 2026 |
| **Ask an accountant once** about the reverse-charge treatment of Stripe's Irish invoices. **Retain Stripe exports and transaction records from day one** | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |

### Verification

| Decision | Status | Settled |
|---|---|---|
| **Two checks, by two different people.** **Dono checks student status** by university email — a one-time code or link sent to an address at a Recognised Institution and returned. **The Payment Provider checks identity** using a government document and a face scan | CURRENT (identity check live and mandatory) / APPROVED — NOT YET IMPLEMENTED (email check) | 6 Aug 2026 |
| **Dono never receives, sees or stores an identity document or a face scan.** Those go to, and stay with, the Payment Provider as an independent controller. **Dono receives and stores only the check outcome, the verified name and the verified date of birth** | APPROVED — NOT YET IMPLEMENTED (Dono's own ID upload must be removed first — item EL-07) | 6 Aug 2026 |
| ~~University email verification is the sole verification method~~ — corrected once engineering confirmed that the Payment Provider's identity check is live and mandatory | **SUPERSEDED** 6 Aug 2026 | was 6 Aug 2026 |
| ~~Dono never receives a government identity document, passport, driving licence or selfie~~ — was inaccurate: the product stores an uploaded government ID (`idDocumentStorageId`) and serves it to administrators. **That storage is being removed**; the principle is retained as the target state | **SUPERSEDED as a statement of fact; retained as a requirement** 6 Aug 2026 | was 31 Jul 2026 |
| **A Campaign cannot be created, published or receive Donations while the identity check is pending or has failed** | CURRENT | 6 Aug 2026 |
| **The verified date of birth returned by the identity check is currently stored but not used.** It should become the age gate for Campaign and Society creators | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |
| ~~Stripe Identity does not reliably return a date of birth and is not used as an age gate~~ — it **does** return one for creators; it is simply not used | **SUPERSEDED** 6 Aug 2026 | was 31 Jul 2026 |
| **The student-card system is scrapped entirely.** No student-card uploads, no student-card images, no student numbers, no extraction, no image deletion workflow, no retention of verification documents. **Every reference is removed from every document.** Existing card data must be deleted | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |
| ~~The student-card image is deleted immediately after a successful check; the card number and extracted details are kept~~ | **SUPERSEDED** 6 Aug 2026 | was 31 Jul 2026 |
| **Dono never receives a government identity document**, passport, driving licence, selfie or any Stripe KYC document | CURRENT | 31 Jul 2026 |
| **Dono has no KYC obligation of its own.** That is Stripe's | CURRENT | 31 Jul 2026 |
| **Dono does not carry out "institution verification"** and does not contact an institution as part of the publication check | CURRENT | 31 Jul 2026 |
| **No public-facing verification, validation, eligibility or trust indicators of any kind.** No badges, ticks, shields, "validated", "verified", "eligibility checked", "society approved" or "institutionally endorsed". **No UI that could reasonably be read as endorsing, authenticating or guaranteeing a campaign.** Internal checks stay internal unless the law requires disclosure | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |
| **The only public state is a neutral campaign lifecycle state** — funding open, funding closed, evidence submitted, evidence outstanding, evidence overdue, closed, closed (administrative) — rendered without approving styling | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |

### Data protection

| Decision | Status | Settled |
|---|---|---|
| **Stripe is an independent controller** for payment processing, Connect onboarding, KYC and fraud prevention — not Dono's processor | CURRENT | 31 Jul 2026 |
| **Analytics runs on consent.** Nothing analytics-related loads before consent. **Accept and Reject are equally prominent. A permanent "Privacy and analytics settings" link sits in the footer of every page, with the Cookie Notice. Withdrawal takes effect immediately for future collection and revokes consent downstream. The consent decision, its timestamp and the Cookie Notice version are recorded** | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |
| **A clean-browser audit on desktop and mobile must be run** to identify every cookie, local-storage item and similar technology actually deployed, and the Cookie Notice corrected against it. **Analytics may not be enabled until the consent flow has passed testing** | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |
| **Analytics retention: 12 months.** This matches the live analytics project. **Enforcement of that period is currently switched off and must be enabled** (item CK-08) | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |
| ~~Analytics retention: 26 months~~ — never matched the live configuration | **SUPERSEDED** 6 Aug 2026 | was 31 Jul 2026 |
| **The analytics consent gate genuinely works**: nothing is loaded and nothing is sent before consent; Accept and Reject are equally prominent; session replay is off in the client; IP is anonymised at ingest; authentication fields are excluded; there is no identify call, no advertising pixel and no third-party integration or export. **What is missing is the consent timestamp and Notice version, the withdrawal route, and alignment of the project's own session-replay setting** | CURRENT (gate) / APPROVED — NOT YET IMPLEMENTED (the rest) | verified 5 Aug 2026 |
| **Analytics collects approximate country and city derived from an anonymised IP address**, plus device and browser type and limited interaction capture recorded against component test identifiers | CURRENT | verified 5 Aug 2026 |
| **Institutional disclosures are permitted only as limited exceptions.** Dono's default is that it does **not** routinely share identifiable user or donor data with universities or institutions. Any disclosure must have a documented lawful basis, be limited to the minimum necessary, and fall within the circumstances in the Privacy Notice and the Terms. **All legal documents must use this consistent position** | CURRENT | 6 Aug 2026 |
| ~~Dono shares no identifiable donor or user data with any institution~~ — the absolute statement contradicted the referral and verification provisions | **SUPERSEDED** 6 Aug 2026 | was 31 Jul 2026 |
| **All institutional referrals are governed by the Institutional Referral Protocol**, which is the single source of the rules: six permitted circumstances, a seriousness and necessity test, authorised approvers, minimum necessary disclosure, mandatory allegation labelling, secure transmission, notice unless prejudicial, correction and appeal, records and six-monthly audit | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |
| **No institution dashboards and no aggregate donor reporting.** Not offered until a named institution, an executed data-sharing agreement and that institution's privacy notice all exist | CURRENT | 31 Jul 2026 |
| **Dono does not infer protected characteristics** from donation history, browsing or any pattern of activity | CURRENT | 31 Jul 2026 |
| **Dono does not use user content to train AI or machine-learning models** | CURRENT | 31 Jul 2026 |
| **Receipts must be redacted before upload.** Guidance is shown before every upload. **A receipt containing unnecessary personal data is rejected, quarantined and automatically deleted after 30 days**, with the deletion logged. Only the minimum needed for verification is retained from an accepted receipt | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |
| **Dono relies on the Article 14 disproportionate-effort exception** for people named incidentally on receipts, supported by a documented assessment and the safeguards above | CURRENT | 6 Aug 2026 |
| **Retention is field-level and risk-based.** The authoritative schedule is **Privacy Notice clause 7.1** — there is no separate retention document, deliberately, so there is one place to change | CURRENT | 6 Aug 2026 |
| **No retention or deletion job of any kind runs today.** There are two scheduled jobs and neither deletes or anonymises anything. There is no legal hold. **Nothing in the retention schedule is enforced** | verified 5 Aug 2026 | — |
| **Account deletion is anonymisation, not erasure.** Sign-in is severed and the profile is anonymised; campaigns, societies, donation history, acceptances, refund requests, audit entries and the verified name and date of birth are all retained untouched. There is no confirmation step, no cooling-off and no audit entry, and **a campaign owner who deletes their account can no longer sign in to execute a refund they owe** | verified 5 Aug 2026 | — |
| **Backup retention and restore behaviour are unverified.** Nothing about backups is configured or documented; it is governed by the database provider and must be confirmed in writing (item PR-10) | AWAITING CONFIRMATION | 6 Aug 2026 |
| **The support mailbox provider is a processor and is not yet in the DPA Register** (item VN-04) | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |
| **Moderation retention is risk-based, not a flat six years:** spam and filter blocks 6 months; ordinary breaches 12 months; repeat-offender history 3 years; illegal content other than CSEA 3 years; fraud and financial misconduct 6 years; safeguarding 6 years; anything under live dispute until conclusion | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |
| ~~Removed comments and moderation material retained six years across the board~~ | **SUPERSEDED** 6 Aug 2026 | was 31 Jul 2026 |
| **Campaign pages are archived 24 months after closure** — de-indexed, removed from browsing, discovery and search, and stripped of unnecessary donor-identifying and sensitive information. **Campaign owners may request depublication or deletion at any time**, subject to overriding legal obligations, in which case only the minimum evidence is kept | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |
| ~~Campaign pages remain publicly accessible indefinitely at their direct URL~~ | **SUPERSEDED** 6 Aug 2026 | was 31 Jul 2026 |
| **Inactive accounts:** notified at 24 months, deleted at 27 | CURRENT | 31 Jul 2026 |
| **CSEA retention is two clocks:** the NCA report reference **5 years**; the reported content and prescribed supporting information **1 year**, in restricted storage. Never a single five-year period | CURRENT | 31 Jul 2026 |
| Processors and regions: **Vercel** (US) hosting; **Convex** (EU `eu-west-1`) database and file storage; **Convex Auth + Resend** authentication; **Resend** transactional email; **PostHog Cloud EU** analytics; **Stripe** payments. No error-monitoring product; no third-party consent-management vendor | CURRENT | 31 Jul 2026 |
| Transfer mechanism for every transfer: **EU Standard Contractual Clauses plus the UK Addendum**. Not the standalone IDTA; no UK adequacy decision relied on for the US. **A documented Transfer Risk Assessment is required for each transfer, including Vercel** | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |
| **A handwritten signature is not required for a processor DPA** validly incorporated into the provider's online terms. **Recording acceptance — terms, version, date, products, sub-processors — is what matters** | CURRENT | 6 Aug 2026 |
| **Data-protection complaints:** a dedicated public email route, an automatic acknowledgement, a named founder plus backup monitoring the inbox, a Gmail label and a simple spreadsheet register, acknowledgement within 30 days, and conclusion without undue delay. **No bespoke complaints portal or case-management system for beta.** A more formal system will be considered if complaint volume or team size increases | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |

### Security

| Decision | Status | Settled |
|---|---|---|
| **The security baseline, stated as platform requirements:** production access restricted on least privilege; secrets, API keys and credentials managed securely and never in source code or shared insecurely; everyone with access to production systems or personal data bound by written confidentiality and data-handling obligations; a documented offboarding procedure requiring prompt removal of access to all production systems, repositories and third-party services; and public documentation that accurately reflects the implemented controls | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |
| **Not required for launch:** mandatory multi-factor authentication, immutable audit logs, formal device management, ISO 27001-style governance or other enterprise controls. **MFA is a post-launch priority and is contractually required of team members, but is not stated in any public document as an implemented control until it is** | CURRENT | 6 Aug 2026 |
| **No document may claim a security control Dono has not implemented**, and none may claim certification, continuous monitoring or cyber insurance | CURRENT | 6 Aug 2026 |

### Liability

| Decision | Status | Settled |
|---|---|---|
| **No monetary cap on Dono's liability to a consumer**, and **no consumer is subject to any indemnity**. Consumers include donors, account holders, individual student campaign owners, and individuals acting as Responsible Representatives | CURRENT | 6 Aug 2026 |
| **Non-excludable liabilities are expressly preserved**: death or personal injury from negligence; fraud; the terms implied by ss49 and 51 CRA 2015; Part I CPA 1987; anything that cannot lawfully be excluded; and mandatory consumer rights. Data-protection liability is not limited beyond what the law permits | CURRENT | 6 Aug 2026 |
| **Proportionate caps by user type:** Society — indirect loss excluded, cap the greater of **£2,500** or twelve months' fees. Business user — indirect loss excluded, cap the greater of **£1,000** or twelve months' fees. *Figures not yet solicitor-approved* | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |
| ~~Business users capped at the greater of £500 or twelve months' fees, with societies treated as business users~~ | **SUPERSEDED** 6 Aug 2026 | was 31 Jul 2026 |
| **Indemnities are narrow**: specified third-party claims arising from the user's own breach only, with defence control, mitigation and proportionate reduction. Plus a separate indemnity limited to the consequences of a Responsible Representative lacking authority | CURRENT | 6 Aug 2026 |

### Safety and process

| Decision | Status | Settled |
|---|---|---|
| **One complaints and appeals framework**, in clause 8 of the Community Guidelines. Every other document points at it | CURRENT | 31 Jul 2026 |
| Three clocks, one address: **online safety** acknowledge within 5 Working Days, outcome target 30 days; **data protection** acknowledge within 30 days; **everything else** acknowledge within 2 Working Days. **All are targets, not guarantees** | CURRENT | 6 Aug 2026 |
| **No moderator may review an appeal against their own decision — no exception.** Appeals and high-impact decisions go to a different trained moderator wherever reasonably practicable; where only one is available the matter is **escalated to another authorised founder**, never self-reviewed | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |
| **All response-time language is "we aim to", never "we will"** | CURRENT | 6 Aug 2026 |
| **All appeal and response clocks start when the user is notified**, not when the decision was made. Immediate action may take effect when applied where necessary | CURRENT | 6 Aug 2026 |
| **Email notices are deemed received on the next working day**, subject to proof of non-delivery | CURRENT | 6 Aug 2026 |
| **Document precedence is by subject matter, not document rank:** the Refund and Dispute Policy governs refunds; the Community Guidelines govern moderation and content; the Privacy Notice governs privacy; the Cookie Notice governs cookies; role terms govern that role's obligations; the Terms of Service apply except where a subject-specific document expressly governs | CURRENT | 6 Aug 2026 |
| **Every campaign is reviewed by a person before publication** — text, images, uploaded documents, video and every external link — and again after any change. **Confirmed working** | CURRENT | verified 5 Aug 2026 |
| **Commenting is restricted to approved members of the Society that owns the Campaign.** A society controls who may comment on its campaigns. Comments are post-moderated | CURRENT | verified 5 Aug 2026 |
| ~~Any account holder aged 18+ may post a comment~~ | **SUPERSEDED** 6 Aug 2026 | was 31 Jul 2026 |
| **Society Leaders may hide comments on their own Campaigns**; the content is retained for audit and an administrator may restore it | CURRENT | 6 Aug 2026 |
| **Campaign updates are a live feature**: a Society Leader publishes an update recording amount spent against amount raised, with a mandatory reconciliation note where spend is less than raised, emailed to Donors who opted in, with per-send idempotency and a signed-token unsubscribe link | CURRENT | verified 5 Aug 2026 |
| **Administrators are blocked from donating** | CURRENT | verified 5 Aug 2026 |
| **Comment moderation model at launch:** keyword and pattern filtering before publication; comments that pass are published immediately; a report control on every comment; reports create a moderation case; moderators may immediately hide or remove, suspend commenting privileges or restrict accounts; repeat offenders may lose commenting or be suspended; rate limiting; full internal records. **No pre-moderation of all comments; no enterprise moderation infrastructure** | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |
| **Comments permit no links, no attachments and no images** — plain text only, rejected server-side. **Attachments and images are blocked today; URLs are not, and that must be fixed** (item OS-22) | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |
| **There is no reporting system, no logged-out reporting route, no report categories, no urgency routing and no appeals workflow today.** A rudimentary report exists with a free-text reason and an administrator queue. **This is why all public user-generated content is launch-blocked** | verified 5 Aug 2026 | — |
| **There is no user-level suspension or ban capability in the product at all** — the only options are delete or leave alone. Proportionate enforcement requires it to be built (item SU-01) | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |
| **There is no malware or image-safety scanning on any upload path**, and no monitoring or alerting of any kind — including for a dispute being opened | verified 5 Aug 2026 | — |
| **Campaign video, external links and avatars are retained rather than disabled, subject to controls:** video uploaded directly, scanned, manually reviewed in full before publication and re-reviewed after any change with the moderator recording full review; links HTTPS-only with the destination stored, re-reviewed on edit, periodically checked for redirects, and disableable immediately; avatars automatically scanned, removable, re-reviewed after change | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |
| **No private messaging, no livestreaming, no private groups, no disappearing content, no recommendation feed** | CURRENT | 30 Jul 2026 |
| **All public user-generated content is launch-blocked** until the eight mandatory acceptance tests in the Online Safety Procedures pass, each with dated evidence and an accountable approver. **Demonstrations before then use synthetic or staff-authored content only** | CURRENT | 6 Aug 2026 |
| **"Hide my name" hides the name from Dono's public pages only.** The amount is still shown. Dono cannot guarantee the name is hidden from the connected-account holder, and says so | CURRENT | 31 Jul 2026 |
| **Administrative closure replaces deemed acceptance.** It records only that Dono missed its own 30-day deadline, must be labelled prominently as procedural, and must never be styled as approval | CURRENT | 31 Jul 2026 |
| **The evidence lifecycle is defined end to end** in `terms_v2.3/dono-evidence-review-and-closure-procedure-v2.3.md`: deadlines and reminders, reviewer assignment and conflict rules, a 14-item checklist, one cure cycle, determination, closure, donor notifications, appeal, and nine categories of immutable evidence | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |
| Dono is **not treated as being in the regulated sector** for anti-money-laundering purposes unless legal advice concludes otherwise. **UK sanctions apply to Dono independently of Stripe** | CURRENT | 31 Jul 2026 |
| **Financial-crime controls are trigger-based, not universal:** an Unsupported Countries List reviewed quarterly; payments from listed countries declined; screening on defined triggers rather than every donor; documented red flags; a defined escalation route with an OFSI reporting duty; and reviewer training. See `terms_v2.3/dono-financial-crime-sanctions-policy-v2.3.md` | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |
| Response deadlines for users are **ten Working Days**, extendable on reasonable request | CURRENT | 31 Jul 2026 |
| **Geographic scope:** campaign creators are limited to eligible UK students; **donors may be international** where Stripe supports the payment and sanctions and legal restrictions permit. **No document may imply Dono has assessed or supports any particular jurisdiction. No geo-blocking beyond what law or the payment provider requires.** Expansion into a specific country only after legal and commercial review | CURRENT | 6 Aug 2026 |
| **A wind-down plan exists** and states honestly that funds already paid to campaign owners via Stripe are outside Dono's control and cannot be recovered or redistributed by Dono | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |
| **The incident response model for beta is a rotating founder Incident Lead**, not a 24/7 team, using a dedicated Signal group as the secure out-of-band channel, with verified processor emergency contacts and **two mandatory documented tabletop exercises before launch** | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |
| **A single legal notice-and-action workflow** covers copyright, trade marks, impersonation, defamation and privacy. **Dono does not determine complex legal disputes and guarantees no outcome** | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |

### Contract evidence and versioning

| Decision | Status | Settled |
|---|---|---|
| **Every legal document has a permanent version number. Once published, a version is never overwritten or deleted. The version in force at the time of acceptance governs the transaction** | CURRENT | 6 Aug 2026 |
| **Every acceptance is recorded** with: user or guest ID, role, campaign ID where applicable, the accepted document versions, the timestamp and the acceptance event. **Guests are recorded on the same basis as registered users** | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |
| **What exists today, and what does not.** Acceptance records **are** insert-only and immutable, and the correct documents **are** required for each action, enforced server-side. But the record stores only a **version string** — not the text or a hash; the text lives in a **mutable file with no historical route**; the version map is **duplicated in two files** that can silently desync; **a guest's acceptance is not linked to their donation at all**; there is **no acceptance receipt email**; and there is **no way for a user to see what they accepted** | verified 5 Aug 2026 | — |
| **The legal text currently served by the product is a draft stub, not the approved suite.** It must be replaced before launch (item CH-15) | **DEFECT — FIX REQUIRED** | verified 5 Aug 2026 |
| **An on-screen confirmation is shown after acceptance or payment**, and a **confirmation email** sent, containing the transaction details and either the applicable documents attached or a permanent link to those exact archived versions | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |
| **Material changes require explicit re-acceptance.** Affected features are unavailable until the user accepts. **Continued use is never relied on for a material change.** Each campaign and donation stays bound to the versions in force when it was created | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |
| **The checkout legal identity panel is mandatory.** Before payment, checkout must show the Campaign Owner's legal name, their legal status, any representative, the Connected Account holder, the owner of any purchased property, and Dono's role. **Payment is blocked if any mandatory field is missing. The exact information displayed is persisted with the transaction and the acceptance record** | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |
| **The donation contract forms when Stripe confirms the payment has succeeded.** The on-screen receipt and confirmation email are evidence of the completed transaction, **not conditions of formation** | APPROVED — NOT YET IMPLEMENTED | 6 Aug 2026 |
| **Every document carries an approval block** recording owner, reviewer, approver, publication decision, outstanding sign-offs, review date and archive rule | CURRENT | 6 Aug 2026 |

### Document status

| Decision | Status | Settled |
|---|---|---|
| **`terms_v2.3/` is the current suite.** `terms_v2.2/`, `terms_v2.1/`, `terms_v2/`, `terms_v1/` and `terms/` are historical and must not be edited | CURRENT | 6 Aug 2026 |
| **Nothing in `terms_v2.3/` is published yet.** Each document's approval block states whether it may be published and what blocks it | CURRENT | 6 Aug 2026 |
| Six contractual documents (Terms of Service, Student Campaign Terms, Society Campaign Terms, Donor Terms, Community Guidelines, Refund and Dispute Policy); three notices (Privacy, Cookie, Verification). **The notices are information, not contract** | CURRENT | 30 Jul 2026 |
| **`TODO.md` holds what is pending; `TRUTH.md` holds what is settled.** Together they are the skeleton that organises everything else | CURRENT | 6 Aug 2026 |

---

## Release Control Matrix

**This section is normative. RFC 2119 keywords — MUST, MUST NOT, SHOULD, MAY — carry their usual meaning.**

### Purpose and rationale

The Release Control Matrix is the governance mechanism linking engineering, legal, compliance and operational documentation. Its purpose is to make it structurally impossible to release a feature whose product behaviour, published documentation, compliance records and operational controls are out of step with one another. Dono's central historical failure has been that documents described a service the product did not deliver. **The matrix is the single place where that is checked, and it is authoritative.**

### Principles

- Every user-facing feature **MUST** have exactly one entry in the Release Control Matrix.
- The matrix **MUST** be the authoritative record of whether a feature may be released. Where any other document, ticket or conversation disagrees with the matrix, the matrix governs.
- No feature **MUST** move to production unless every required control is complete.
- If any required item is incomplete, the feature **MUST** remain blocked, **regardless of engineering completion**.
- Any change to a feature that affects legal, privacy, payments, moderation, security, safety or data processing **MUST** update the relevant documentation **before** release.

### Columns

Every feature entry **MUST** carry each of the following:

| Column | Content |
|---|---|
| **Feature name** | The user-facing feature, named as users would recognise it |
| **Feature flag (On / Off)** | The current production state of the flag |
| **Engineering status** | Not started / In progress / Complete / Deployed to staging |
| **Public documentation updated** | Terms of Service, Privacy Notice, Cookie Notice, Help Centre and FAQs, where applicable |
| **Data flow reviewed** | Whether the personal-data flow has been mapped and reviewed |
| **DPIA updated (if required)** | Updated / Not required |
| **Risk assessments updated** | Illegal Content, Children's, Financial Crime, Online Safety, Geographic Scope or other applicable assessments |
| **Moderation / operational procedures updated (if applicable)** | Updated / Not applicable |
| **Test evidence completed** | Reference to the dated evidence |
| **Accountable owner** | A named person, not a team |
| **Launch state (Blocked / Ready / Live)** | The decision |
| **Notes** | Anything a reader needs in order to understand the entry |

### Release rules

- A feature **MUST NOT** be marked **Ready** unless every applicable column is complete.
- A feature **MUST NOT** be enabled in production while its Launch State is **Blocked**.
- A feature that does not affect a particular control **MUST** be marked **Not Applicable (N/A)** explicitly. A column **MUST NOT** be left blank.
- The matrix **MUST** be reviewed before every production deployment.
- Every production release **MUST** reference the relevant Release Control Matrix entries.
- Where a feature is released and a control is subsequently found to be incomplete, the feature flag **MUST** be turned off until the control is completed.
- The accountable owner named for a feature **MUST** be the person who confirms each column, and **MUST NOT** be the same person for both the engineering status and the legal documentation columns where more than one person is available.
- The matrix **SHOULD** be reviewed in full at least monthly, independently of any deployment.
- A feature **MAY** be enabled in a staging or synthetic-data environment while **Blocked**, provided no real user, real payment or real personal data is involved.

### The matrix

> **To be populated.** Every user-facing feature requires an entry before launch. At minimum: account registration; university email verification; campaign creation; campaign review and publication; campaign pages; donations and checkout; the checkout identity panel; fee cover; refunds and the refund mandate; the dispute state; evidence upload; closure statements; comments; comment reporting; the logged-out reporting route; the moderation dashboard; appeals; analytics and the consent banner; campaign archival; data export; and the platform kill switches.
>
> Population is tracked as **RM-01** in `terms_v2.3/ENGINEERING_IMPLEMENTATION_CHECKLIST_v2.3.md`.

| Feature | Flag | Eng. status | Public docs | Data flow | DPIA | Risk assessments | Moderation / ops | Test evidence | Owner | Launch state | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| *(to be populated)* | | | | | | | | | | Blocked | |

---

## Changing an entry

1. Make the decision.
2. Change it here first, with today's date and a status.
3. **Mark the old entry SUPERSEDED rather than deleting it**, so the change is visible.
4. Correct every document that depended on it. A change to one of these entries typically touches five to nine documents.
5. Update `terms_v2.3/00_v2.3_change_log.md` and, where a build is needed, `ENGINEERING_IMPLEMENTATION_CHECKLIST_v2.3.md`.
6. If the change makes a published document untrue, **unpublish it before changing the product**.
