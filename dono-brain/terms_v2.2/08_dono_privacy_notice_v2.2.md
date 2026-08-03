# Dono Privacy Notice

**Version:** Working draft v2.2 — 31 July 2026
**Status:** DRAFT — NOT FOR PUBLICATION. Applies the counsel review, the founder's amendments and the engineering configuration answers of 31 July 2026. Requires final UK solicitor sign-off, a revised DPIA, and the outstanding processor DPAs and transfer risk assessment identified in clause 8. Open items marked **[SOLICITOR SIGN-OFF]**, **[DPA OUTSTANDING]** or **[ENGINEERING — BUILD REQUIRED]**.

> **This is a Notice, not a contract.** It provides information about how Dono handles personal data and does not create contractual rights, except where the law provides otherwise. We remain responsible for our legal obligations whether or not this Notice is contractual.

> **What changed from v2.1:** the **processor and transfer table is completed** — Vercel (US), Convex (Ireland/EU), Resend, PostHog Cloud EU and Stripe, with the transfer mechanism for each; the **retention table is rebuilt field by field** with different periods for different categories instead of a blanket six years, and marked where it is not yet enforced in the product; **analytics is stated as consent-based** and retained for 26 months; the **age position** is corrected — anyone may donate, so Dono knowingly processes data about people under 18; **security claims that cannot be evidenced are removed**; the **institutional-sharing default is no sharing**; **Stripe's role is described purpose by purpose**; and the contact address is standardised.

---

## 1. Who is responsible for your data

1.1 The data controller is **Amrit Kaur Rooprai, trading as Dono**, a sole trader. Contact: **joindono.team@gmail.com**; UK business address: 37 St Giles', Oxford OX1 3LD.

1.2 Dono is not a company and there is no current plan to incorporate. If that changes, or ownership changes, this Notice is updated and users are notified before any change of controller takes effect.

1.3 Dono has assessed its data-protection registration position with the Information Commissioner's Office and will comply with any registration obligation that applies. **[CONFIRM — ICO self-assessment; if a registration reference is obtained it will be stated factually here.]**

## 2. What this Notice covers

2.1 This Notice covers personal data Dono processes as a controller. It does **not** cover: the Payment Provider's processing of your payment and identity data as its own controller, under its own policy; a Recognised Institution's processing of data you separately consent to share, as its own controller; or third-party websites you reach through links.

## 3. Data we collect

3.1 **Everyone with an account:** email, name, password or authentication credential; declared date of birth; account settings; records of acceptance of our terms (with timestamps and version identifiers); technical data (IP address, device and browser information, log data); communications you send us.

3.2 **Campaign Owners (students and Society Representatives):** full name and declared date of birth; university email; institution, college and course; **student-card number** and extracted card details; a **student-card image (deleted after a successful check — see clause 6)**; card expiry date; Course End Date; any interruption or leave declaration; Payment Provider connected-account status and identifiers, and any verified name or date of birth the Payment Provider returns; campaign content, budgets, purchase links, receipts, evidence, updates, Ownership Statements and Closure Statements; correspondence, including in investigations.

3.3 **Donors, including donors without an account:** name and email; donation amount, date and Campaign; whether the donation is recurring; your hide-my-name preference; your checkout age confirmation; whether you covered fees; limited payment information from the Payment Provider (clause 5); any consent to share data with an Institution; and, for a guest donation, a temporary identifier used to link your legal acceptance to your donation.

3.4 **Everyone who posts:** comments and content (with edit history); reports you make and reports about you; moderation records.

3.5 **Visitors who only browse:** server log data (clause 14.3) and, where you consent, analytics data (clause 4 and the Cookie Notice).

3.6 **People who report content without an account:** the content you reported, your description of the concern, whether you say you are personally affected, and your email address if you choose to give one.

## 4. Why we process it, and our lawful basis

| Processing purpose | Who it applies to | Personal data processed | Lawful basis |
|---|---|---|---|
| Create and manage a user account | Registered users | Name, email, password, date of birth, account settings | Contract |
| Check age for account creation | Registered users | Declared date of birth | Contract; legitimate interests (operating an 18+ account service) |
| Verify identity and eligibility | Campaign Owners, Society Representatives | Student-card number and extracted details, card image until deleted, university email, student status, verification records | Contract |
| Create and administer campaigns | Campaign Owners | Campaign content, budget, updates, receipts, Ownership Statement, payout information | Contract |
| Process donations, including recurring donations | Donors | Donation amount, payment status, recurrence, donor preferences, age confirmation, transaction identifiers | Contract |
| Enable payments and payouts | Donors, Campaign Owners, Society Representatives | Payment information, Connected Account details, transaction history | Contract |
| Prevent fraud, abuse and misuse | All users | Account, device/browser, IP, transaction history, verification records, security logs | Legitimate interests (protecting users and the Platform) |
| Moderate content and operate the reporting, complaints and appeals process | All users and people who report | Campaign and comment content, reports, reporter details where given, moderation records and reasons | Legitimate interests; legal obligation (Online Safety Act 2023 duties) |
| Report child sexual exploitation and abuse content to the National Crime Agency | People whose content is reported | Content identifiers, account and upload data, metadata | Legal obligation |
| Investigate complaints, disputes and policy breaches | All users | Relevant account information, communications, campaign records, receipts, moderation records | Legitimate interests |
| Comply with legal obligations | All users where applicable | Identity information, transaction records, communications, information required by law | Legal obligation |
| Respond to support requests | All users | Contact details, correspondence, relevant account information | Contract (service) and legitimate interests (general support) |
| Send essential service communications | Registered users and donors | Email, account and donation information | Contract |
| Send optional marketing communications | Users who opt in | Email, communication preferences | Consent |
| Analyse use of the Platform using analytics | Visitors and users who consent | Cookie and device identifiers, pages and screens viewed, campaign and donation funnel events, browser/device information, session information, approximate location, referring pages | **Consent** (see clause 4.2 and the Cookie Notice) |
| Store and respect your cookie and analytics choice | Visitors | Your consent choice | Legal obligation (PECR consent management) |
| Keep the Platform secure and diagnose faults | All users | Server logs, error logs, performance metrics, technical diagnostics | Legitimate interests |
| Maintain backups, disaster recovery, business continuity | All users | Copies of data already processed for the above | Legitimate interests |

4.1 Where we rely on legitimate interests we have weighed your rights and freedoms, and you may object (clause 13.1). We document a legitimate-interests assessment for each such purpose.

4.2 **Analytics is based on consent.** Our analytics can link events to an identified user, so it is not purely aggregate statistical measurement and **we do not rely on the statistical-purpose exception**. Analytics only runs if you accept it, and nothing analytics-related loads before you do. See the Cookie Notice.

4.3 **We do not use your content to train artificial-intelligence or machine-learning models**, and we do not make solely automated decisions with legal or similarly significant effects. If either changes we will tell you first and explain the basis.

## 5. Payment data

5.1 The Payment Provider receives and handles your full card details. **Dono does not receive or store full card numbers, expiry dates or security codes.** Dono receives and stores: the amount and currency; the payment status; the Payment Provider's transaction, charge and connected-account identifiers; whether you covered fees and the fee amounts; your email address; your display preference; and dispute status. **The Recipient receives the transaction information the Payment Provider makes available to the holder of the connected account, which may include your name even if you chose to hide it on Dono** — see clause 10.

## 6. Your student card

6.1 We ask for an image of your student card so an administrator can confirm you are currently enrolled. We extract your name, institution, college, course, **student number** and card expiry date.

6.2 **The image is deleted immediately after a successful check.** Where a check is rejected or abandoned, the uploaded image is deleted within 30 days. **We keep the student-card number and extracted details** for eligibility, disputes and any institutional referral. We do not retain barcodes, library identifiers or other card information we do not need. **[ENGINEERING — BUILD REQUIRED: neither deletion is currently automated; card images persist until removed manually. This clause must not be published until the deletion jobs exist and their execution is logged.]**

6.3 **We do not ask for a passport, driving licence or other government identity document.** The Payment Provider conducts its own identity checks separately, as its own controller, and **does not share those documents with us**. Access to any card image before deletion, and to card numbers, is restricted to administrators who need it, and **every such access is recorded in an audit log**.

6.4 **Disclosure of your student number.** We may provide your student-card number to your institution only where we make a referral under clause 23.7 of the Terms of Service — that is, where we need the institution to confirm your status or where we are reporting a serious matter. We do not provide it routinely, and each disclosure is recorded.

## 7. How long we keep things

7.1 We keep each category of personal data only for as long as necessary for the purpose it was collected for. Different categories have different periods.

| Data category | Retention period | Trigger |
|---|---|---|
| Account profile (name, email, university, settings) | While the account is active, then **2 years** | Account closure or last activity |
| Declared date of birth | While the account is active, then 2 years | Account closure |
| Verification outcome (verified / not verified, date, institution, expiry) | While active, then **6 years** | Account closure |
| Student-card number and extracted details | While active, then **6 years** | Account closure |
| **Student-card image** | **Deleted immediately after a successful check** | Check completed |
| Failed or abandoned verification uploads | **30 days** | Check rejected or abandoned |
| Payment Provider connected-account reference | While active, then **6 years** | Account closure |
| Donation and payment records | **6 years** | Transaction |
| Donation receipts and confirmations | **6 years** | Transaction |
| Campaign pages | **Publicly accessible indefinitely at their direct URL.** Completed campaigns are archived — removed from browsing, discovery and search, but still reachable by direct link | Campaign completion |
| Campaign ownership records | **6 years** | Campaign closure |
| Campaign drafts never published | **90 days** | Last edit |
| Uploaded expenditure receipts and evidence | **6 years** | Campaign completion |
| Public comments | Until deleted by the user or removed by moderation | — |
| Moderation copy of a removed comment | **6 years** | Removal |
| Moderation decisions (warnings, suspensions, bans, internal notes) | **6 years** | Account closure or the enforcement decision |
| Reports of content (including from people without accounts) | **6 years** | Resolution |
| Complaints | **6 years** | Closure |
| Appeals | **6 years** | Final decision |
| Fraud and security investigation records | **6 years** | Case closure |
| Support correspondence and tickets | **3 years** | Resolution |
| Authentication logs | **12 months** | Event |
| Analytics events | **26 months** | Collection |
| Cookie / analytics consent records | While the choice is current, then 12 months | Choice changed or withdrawn |
| Terms acceptance records | **6 years** | Acceptance |
| Failed registrations (accounts never completed) | **30 days** | Attempt |
| NCA report reference (child sexual exploitation and abuse) | **5 years** | Report submitted |
| Content and supporting information in a report to the NCA | **1 year**, in restricted storage | Report submitted |
| Backups | Rolling **30–35 days** | Backup created |

7.2 **Inactive accounts.** After **24 months** with no login and no activity, we notify you and give you the chance to reactivate. After **27 months** we delete your profile, preferences and non-essential account data. We separately retain donation records, verification outcome, connected-account reference, moderation history and complaints, because those remain subject to the periods above.

7.3 **Legal hold.** Where we reasonably believe information is required for litigation, a regulatory enquiry, a fraud investigation, a law-enforcement request or an unresolved dispute, scheduled deletion is suspended until the matter concludes. Every legal hold is recorded. **[ENGINEERING — BUILD REQUIRED: legal hold is not implemented.]**

7.4 **How far these periods are enforced today.** Being straightforward about this: at the date of this draft, **the periods in clause 7.1 are not yet enforced automatically in the product.** There are no scheduled deletion jobs, student-card images are not auto-deleted, account closure anonymises the profile rather than deleting it, and backup propagation is not documented. **This Notice must not be published until the retention schedule is implemented, because publishing it before then would describe deletion we do not perform.** **[ENGINEERING — BUILD REQUIRED: automated retention enforcement, deletion audit logging, and backup deletion propagation.]**

## 8. Who we share it with

8.1 We use third-party service providers for hosting, database and file storage, authentication, transactional email, analytics and payment processing. The table below lists each one, where it processes data, its role, and the safeguard we rely on for any transfer outside the UK.

| Function | Provider | Where data is processed | Role | Transfer position and safeguard |
|---|---|---|---|---|
| Web and application hosting | **Vercel** | **United States** (Washington DC region), and worldwide via its sub-processors | Processor | Transfers outside the UK. Safeguard: **EU Standard Contractual Clauses plus the UK Addendum**. No UK adequacy decision is relied on. **[TRANSFER RISK ASSESSMENT OUTSTANDING — Vercel's DPA contains no transfer impact assessment, so Dono must complete its own before publication.]** |
| Database, backend and file storage (student-card images before deletion, campaign media, evidence) | **Convex** | **Ireland / EU** (`eu-west-1`), with transfers to the United States and other countries used by its sub-processors | Processor | Transfers outside the UK are permitted. Safeguard: **EU Standard Contractual Clauses (2021, Module Two — controller to processor) plus the UK Addendum**. Convex has assessed the transfers as providing essentially equivalent protection without additional supplementary measures. No UK adequacy decision is relied on for the United States. |
| Authentication | **Convex Auth**, with **Resend** delivering one-time passcodes | As for Convex and Resend | Processors | As for Convex and Resend |
| Transactional email (donation confirmations, service messages, one-time passcodes) | **Resend** | **[CONFIRM — typically United States]** | Processor | **[DPA OUTSTANDING — confirm and file Resend's DPA and its transfer mechanism]** |
| Analytics | **PostHog Cloud EU** | **European Union** | Processor | EU processing. **[DPA OUTSTANDING — confirm and file PostHog's DPA, confirm it may not use the data for its own purposes, and confirm the project retention setting]** |
| Payment processing, identity verification and fraud prevention | **Stripe** | Ireland and the United States | **Independent controller** for most of this processing — see clause 8.2 | Stripe's own transfer mechanism under its terms. **[DPA OUTSTANDING — confirm which Stripe entity and product terms apply to Dono's account, and file them]** |
| Error monitoring | **None.** Dono uses the platform logs provided by Vercel and Convex; there is no separate error-monitoring product | As for Vercel and Convex | Processors | As above |
| Cookie and analytics consent management | **In-house.** Dono uses no third-party consent-management vendor | Your device | — | No transfer |

8.2 **The Payment Provider's role.** Stripe processes personal data for payment processing, identity verification, fraud prevention and compliance with financial regulations. **For those activities Stripe acts as an independent data controller under its own privacy notice**, because it determines how that processing is carried out in order to meet its own legal and regulatory obligations. Dono also discloses limited personal data to Stripe where necessary to provide the Platform and facilitate payments. Dono is not Stripe's controller for its KYC, and Dono has no legal obligation of its own to perform KYC.

8.3 **Everyone else on this list acts on our instructions as a processor**, under a written agreement required by Article 28 UK GDPR. You can ask us for details of the safeguards for any transfer by emailing us at clause 1.1.

8.4 We may also disclose personal data where lawful and reasonably necessary to: the police, the National Crime Agency or another authority where we report or are lawfully required to; a Recognised Institution under the referral protocol in clause 23.7 of the Terms of Service; our professional advisers; and a purchaser or successor on a sale or transfer of the business. **We do not sell your personal data or email addresses.** We do not disclose one user's identity directly to another private user as a dispute-resolution step (clause 25 of the Terms of Service).

## 9. Institutions and development offices

9.1 **We do not share identifiable donor or user data with any university, college, development office or other institution.** That is the default and the current position: no such sharing is happening.

9.2 **Opt-in sharing, if you choose it.** Where Dono offers it and **you give separate, specific consent**, we may share with a **named** Institution: your name; your email; your donations to that Institution's Campaigns; the dates of those donations; and whether you covered fees — so that the Institution can thank you or invite you to events connected to your donation. Any such consent is optional, unticked by default, separate from accepting the Terms, names the specific Institution and its purpose, shows you that Institution's own privacy notice before you consent, and is withdrawable. **Refusing does not prevent you donating, and nothing about your donation changes if you refuse.** We record the consent wording, its version and the timestamp.

9.3 **This is not offered yet.** Dono will not present an institutional-sharing consent to anyone until: the specific institution is identified; a written data-sharing agreement is in place with it; its privacy notice is available to show you; the exact data fields are fixed; and donors who hid their name are excluded from it. Until all of that is done, clause 9.1 is the position. **[SOLICITOR SIGN-OFF — the consent wording and the Institution Agreement.]**

9.4 **Marketing is separate.** If an Institution wishes to send fundraising or other electronic marketing, that requires a **separate, unticked marketing consent**, never combined with the data-sharing consent.

9.5 **Once shared, an Institution is an independent controller** under its own notice; by contract it may use the data only for the agreed purpose, must comply with UK GDPR and PECR, must honour withdrawals, must not use the data for unrelated purposes, and must delete it when no longer required. We pass on withdrawal requests but cannot delete data already held by an Institution.

9.6 **Aggregate reporting.** We may in future share with an Institution aggregated figures about its own Campaigns (totals, numbers of donations, date ranges, averages), applying a suppression threshold so small groups are rolled up. **Aggregation reduces identifiability but may not eliminate it**, particularly for small campaigns with public pages; we assess re-identification risk for each report and treat outputs as personal data unless that risk is sufficiently remote. We do not share donor demographics. **No such reporting exists today.** **[SOLICITOR SIGN-OFF — before any external report or dashboard.]**

## 10. Hiding your name

10.1 You may donate with your **name hidden from Dono's public pages**. This is not the same as being untraceable:

- your donation amount is still shown publicly, and unique amounts or timing can sometimes identify a donor in a small community;
- the Payment Provider has your payment data;
- Dono always holds your name against the payment; and
- **because your payment is charged directly to the Recipient's own Stripe account, the person or Society operating that account may be able to see the transaction details the Payment Provider shows them, which can include your name. Dono cannot prevent that and does not claim to.**

We explain this when you choose the option. Changing the setting affects future display only. In a dispute, **Dono** withholds your identity from the Campaign Owner and discloses it only where required or permitted by law; and the Campaign Terms prohibit a Campaign Owner from using payment information to identify, contact or pressure you.

## 11. Receipts and third-party data in uploads

11.1 Campaign Owners submit receipts and evidence **privately to Dono**; these are not published or shown to Donors. Receipts may **incidentally contain third-party personal data** — for example a supplier's contact details, or another individual named on an invoice. We process such data only for expenditure verification and retain it only as long as necessary.

11.2 Campaign Owners must remove unnecessary personal data before uploading, and are given just-in-time instructions on what to redact at the point of upload. **Dono reserves the right to redact or remove unnecessary personal information from uploaded evidence**, and quarantines or deletes accidental sensitive uploads.

11.3 **Third parties whose data appears on a receipt.** Where we hold information about you only because it appeared on a receipt uploaded by someone else: we process it solely to check that campaign funds were spent as described; we do not use it for anything else, do not share it and do not use it to contact you; and we delete it with the evidence. We maintain an internal Article 14 assessment recording, by category of data, why individual notification does not apply — and making this Notice publicly available is part of how we meet that obligation. If you believe your data is in a receipt held by us, contact us at clause 1.1. **[SOLICITOR SIGN-OFF]**

## 12. Special category and criminal-offence data

12.1 Some campaigns or moderation reports may contain **special category data** (for example health, disability, religion or sexual orientation). Dono does not ask for this, encourages users not to upload unnecessary sensitive information, limits who can access it, removes unnecessary sensitive information where appropriate, and only processes it where an appropriate condition applies.

12.2 **We do not infer characteristics from your behaviour.** We do not derive, tag or record any inference about your health, religion, political views, sexual orientation or other protected characteristic from your donation history or browsing, and we do not build profiles of that kind.

12.3 Fraud investigations, moderation reports, reports to the National Crime Agency and chargeback disputes may involve **allegations of criminal conduct**. Dono restricts access to such information, records an unresolved allegation **as an allegation and not as a finding**, only processes it where legally permitted, and retains it only as long as necessary. The precise conditions and safeguards are documented in an internal Special Category & Criminal Data Policy, which operates as Dono's Appropriate Policy Document. **[SOLICITOR SIGN-OFF]**

## 13. Your rights and how to complain

13.1 **Your right to object.** Where we process your personal data on the basis of our legitimate interests — fraud prevention, moderation, investigating disputes, security and backups — **you have the right to object at any time on grounds relating to your particular situation.** If you object we will stop that processing unless we can show compelling legitimate grounds that override your interests, or we need the data to establish, exercise or defend legal claims. You also have an **absolute** right to object to direct marketing, and we will stop immediately. To object, email us at clause 1.1 and tell us what you object to and why.

13.2 **Your other rights**, and when each applies:

| Right | When it applies |
|---|---|
| Access a copy of your data | Always |
| Correct inaccurate data | Always |
| Erasure | Where we no longer need the data, you withdraw consent we relied on, or you successfully object. It does not apply where we need the data for a legal obligation or to establish, exercise or defend a legal claim |
| Restrict processing | Where you contest accuracy, the processing is unlawful, or you have objected and we are considering it |
| Data portability | Only for data you gave us that we process by consent or under a contract, by automated means — so it applies to your account and donation data, but not to moderation records or evidence about you |
| Withdraw consent | Where we rely on consent — analytics, marketing, and any institutional sharing. Withdrawal is as easy as giving it, and does not affect processing before you withdrew |
| Not be subject to solely automated decisions | We do not make such decisions |

Where we did not obtain data directly from you, we tell you the source and categories. **Some data cannot be deleted** where we need it to defend a legal claim, comply with a legal obligation, meet an Online Safety Act duty, or allow a Donor to pursue a refund they are entitled to.

13.3 Exercise a right by emailing **joindono.team@gmail.com**. We may ask for information to confirm your identity. We respond without undue delay and within one month; we may extend by two further months for complex or numerous requests, and we will tell you within the first month if we do. If we refuse a request we will tell you why and how to complain.

13.4 **Complaining to Dono about your data.** You may complain to us as controller about how we handle your personal data. We will **acknowledge your complaint within 30 days**, investigate without undue delay, keep you informed of progress, and tell you the outcome. We aim to resolve most within 30 days. This is a separate process from the content complaints in the Community Guidelines, and has a different statutory clock — but the address is the same. **[ENGINEERING — BUILD REQUIRED: complaints form and workflow; currently email only.]**

13.5 You may also complain to the Information Commissioner's Office at ico.org.uk or on 0303 123 1113. We would rather you came to us first, but you do not have to.

## 14. Security, children, cookies and changes

14.1 **Security — what is actually in place.** We use technical and organisational measures proportionate to the risk. Specifically:

- data is encrypted in transit using TLS;
- data at rest is encrypted by our hosting and database providers;
- access to administrative functions is restricted to authorised people through server-side role checks;
- **every administrator access to a student-card image or identity data is recorded in an audit log**;
- authentication is rate-limited and accounts lock temporarily after repeated failed attempts;
- access rights are reviewed and removed when no longer required;
- our processors are contractually required to notify us without undue delay of any security incident affecting Dono data; and
- security incidents are recorded, assessed and handled under our Incident Response Plan, and reviewed afterwards.

We describe controls proportionately rather than absolutely. **We do not claim that our incident-response plan is regularly tested, that all access is logged, or that security is continuously monitored, because those things are not yet true.** **[ENGINEERING — confirm each control above with evidence before publication; multi-factor authentication for administrators is not yet implemented.]**

14.2 **Children.** **You must be 18 or over to create an account. Anyone may browse the Platform and anyone may make a Donation, at any age.** This means we knowingly process a limited amount of personal data about people under 18 — a donor's name, email, donation record and checkout age confirmation. We ask at checkout for a confirmation that the donor is 18 or over or has a parent or guardian's permission, but **this is a declaration and not a verified age check**. We collect no more from a donor under 18 than from any other donor, do not profile donors, do not send marketing without an opt-in, and do not target children in our design or marketing. A parent or guardian may contact us at clause 1.1 to ask about, correct or delete a child's data, or to request a refund of a donation made without their permission. We have completed a children's access assessment and a children's risk assessment under the Online Safety Act 2023. **[SOLICITOR SIGN-OFF]**

14.3 **Server logs.** We retain proportionate server logs (IP address, timestamp, requested page, browser and error data) for security, fraud prevention, service availability, fault detection and incident investigation, relying on our legitimate interests. We limit retention, restrict access, and do not repurpose security logs for behavioural analytics.

14.4 **Cookies.** See the Cookie Notice. We update this Notice as the Platform develops and tell you about material changes; the version and date appear at the top.
