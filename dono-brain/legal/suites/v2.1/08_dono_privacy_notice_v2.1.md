# Dono Privacy Notice

**Version:** Working draft v2.1 — 30 July 2026
**Status:** DRAFT — NOT FOR PUBLICATION. Applies the counsel review and founder decisions; requires final UK solicitor sign-off, a completed DPIA, and confirmation of the live technology stack and processors. Open items marked **[SOLICITOR SIGN-OFF]**, **[CONFIRM WITH ENGINEERING]**.

> **This is a Notice, not a contract.** It provides information about how Dono handles personal data and does not create contractual rights, except where the law provides otherwise. We remain responsible for our legal obligations whether or not this Notice is contractual.

> **What changed from v0.2:** reclassified as a Notice; the ICO registration claim made neutral (no assertion that prior registration is universally required, no fee stated, no placeholder number); a role-based lawful-basis table added; **special category** and **criminal-offence** sections added; the retention table rebuilt by record type; the **student-card image is deleted after verification** while the **card number is kept**; institution consent names the institution and its purpose, with separate marketing consent; the "aggregate data is not personal data" statement removed; receipt-upload third-party data addressed; a **data-protection complaints process** (acknowledge within 30 days) added; provider description simplified.

---

## 1. Who is responsible for your data

1.1 The data controller is **Amrit Kaur Rooprai, trading as Dono**, a sole trader. Contact: **dono.outreach@gmail.com**; UK business address: 37 St Giles', Oxford OX1 3LD.

1.2 Dono is not currently registered as a company. If Dono incorporates, or ownership changes, this Notice is updated and users notified. Where a provider or the business is sold, transferred or incorporated, we address any change of controller here.

1.3 Dono has assessed, or is assessing, its data-protection registration position with the Information Commissioner's Office and will comply with any registration obligation that applies. **[CONFIRM — ICO self-assessment; if a registration reference is obtained, it will be stated factually here.]**

## 2. What this Notice covers

2.1 This Notice covers personal data Dono processes as a controller. It does **not** cover: the Payment Provider's processing of your payment data (as its own controller, under its own policy); a Recognised Institution's processing of data you separately consent to share (as its own controller); or third-party websites you reach through links.

## 3. Data we collect

3.1 **Everyone:** email, name, password or authentication credential; account settings; records of acceptance of our terms (with timestamps and versions); technical data (IP address, device and browser information, log data); communications you send us.

3.2 **Campaign Owners (students and Responsible Individuals):** full name and declared date of birth; university email; institution, college and course; **student-card number** and extracted card details; a **student-card image (deleted after verification — see clause 6)**; card expiry date; Course End Date; any interruption/leave declaration; Stripe connected-account status and identifiers; campaign content, budgets, purchase links, receipts, evidence, updates and Closure Statements; correspondence, including in investigations.

3.3 **Donors:** name and email; donation amount, date and Campaign; your hide-my-name preference; whether you covered fees; limited payment information from the Payment Provider (clause 5); any consent to share data with an Institution.

3.4 **Everyone who posts:** comments and content (with edit history); reports you make and reports about you; moderation records.

## 4. Why we process it, and our lawful basis

| Processing purpose | Who it applies to | Personal data processed | Lawful basis |
|---|---|---|---|
| Create and manage a user account | All registered users | Name, email, password, account settings | Contract |
| Verify identity and eligibility | Campaign Owners, Society Representatives | Student-card number/details, card image (until deleted), university email, student status, verification records | Contract |
| Create and administer campaigns | Campaign Owners | Campaign content, budget, updates, receipts, ownership information, payout information | Contract |
| Process donations | Donors | Donation amount, payment status, donor preferences, transaction identifiers | Contract |
| Process payments and payouts | Donors, Campaign Owners, Society Representatives | Payment information, Connected Account details, bank account details, transaction history | Contract |
| Prevent fraud, abuse and misuse | All users | Account, device/browser, IP, transaction history, verification records, security logs | Legitimate interests (protecting users and the Platform) |
| Investigate complaints, disputes and policy breaches | All users | Relevant account information, communications, campaign records, receipts, moderation records | Legitimate interests |
| Comply with legal obligations | All users where applicable | Identity information, transaction records, communications, information required by law | Legal obligation |
| Respond to support requests | All users | Contact details, correspondence, relevant account information | Contract (service) and legitimate interests (general support) |
| Send essential service communications | Registered users | Email, account information | Contract |
| Send optional marketing communications | Users who opt in | Email, communication preferences | Consent |
| Analyse website usage using analytics | Website visitors and users who consent | Cookie identifiers, pages viewed, browser/device information, session information, approximate location, referring pages | Consent (or the statistical-purpose basis — see the Cookie Notice) |
| Store and respect cookie preferences | Website visitors | Cookie consent choices | Legal obligation (PECR/UK GDPR consent management) |
| Improve, monitor and secure the Platform | All users | Error logs, performance metrics, technical diagnostics, device/browser information | Legitimate interests |
| Maintain backups, disaster recovery, business continuity | All users | Copies of data already processed for the above | Legitimate interests |

4.1 Where we rely on legitimate interests we have weighed your rights and freedoms, and you may object (clause 12). We document a legitimate-interests assessment for each such purpose.

## 5. Payment data

5.1 The Payment Provider receives and handles your full card details. **Dono does not receive or store full card numbers or security codes.** Dono may receive the amount, payment status, card brand/type, expiry information where available, the last four digits, and billing/receipt information where collected. The Recipient receives the transaction information the Payment Provider makes available, subject to your hide-my-name choice. Payment information is never displayed publicly. **[CONFIRM WITH ENGINEERING — against the implemented integration]**

## 6. Your student card

6.1 We ask for an image of your student card so an administrator can confirm you are currently enrolled. We extract your name, institution, college, course, **student number** and card expiry date.

6.2 **The image is deleted immediately after a successful verification** (or, where a manual review is needed, within 30 days). Where a verification is rejected or abandoned, the uploaded document is deleted within 30 days. **We keep the student-card number and extracted details** for eligibility, disputes and any institutional referral (we may need to provide the card number to colleges or relevant authorities). We do not retain barcodes, library identifiers or other card information we do not need. **[CONFIRM WITH ENGINEERING — extraction discards unneeded fields]**

6.3 We do not ask for a passport, driving licence or other government identity document; the Payment Provider conducts its own identity checks separately and does not share those documents with us. Access to any card image (before deletion) and to card numbers is restricted to administrators who need it, and every access is logged.

## 7. How long we keep things

| Data category | Retention period | Trigger | What is deleted |
|---|---|---|---|
| User account | While active, then 6 years after closure | Account deletion | Personal profile after retention period |
| Donation and payment records | 6 years | Transaction completed | Full record after expiry unless legally required |
| Campaign pages (successful) | While public, then archive 6 years | Campaign closes | Public content after retention period |
| Campaign drafts (never published) | 90 days | Last edit | Entire draft |
| Identity verification status | While account active + 6 years | Verification completed | Verification record after expiry |
| **Student-card image** | **Deleted immediately after successful verification (or within 30 days if manual review needed)** | Verification complete | Original image |
| Student-card number / extracted details | While account active, then per verification-status row | Verification complete | After retention period unless needed for referral/dispute |
| Failed verification submissions | 30 days | Verification rejected/abandoned | Uploaded documents |
| Fraud investigations | 6 years after investigation closes | Investigation closed | Investigation file |
| Support tickets | 2 years after closure | Ticket resolved | Ticket content |
| Analytics data | 14 months | Collection | Analytics events |
| Cookie consent records | While consent active + ~12 months | Consent withdrawn/expires | Consent logs |
| Backups | Rolling 30–35 days | Backup created | Overwritten automatically |

7.1 The six-year periods reflect the limitation period for contract claims in England and Wales. **Legal hold:** where Dono reasonably believes information is required for litigation, regulatory enquiries, fraud investigations or legal obligations, it may retain the relevant information until those matters conclude. We do not keep personal data indefinitely. **[CONFIRM WITH ENGINEERING — backup deletion propagation]**

## 8. Who we share it with

8.1 We use **carefully selected third-party service providers for payment processing, cloud hosting, authentication, email delivery and analytics.** Before launch we finalise the infrastructure, list the actual categories of recipients (and principal providers), state where data may be processed internationally and the applicable transfer safeguard, and put the necessary data processing agreements in place. **[CONFIRM WITH ENGINEERING — complete the provider/transfer map below before publication]**

| Function | Provider | Location / transfer safeguard |
|---|---|---|
| Payment processing | Stripe (independent controller for payment processing) | Ireland / United States |
| Cloud hosting | **[CONFIRM]** | **[CONFIRM]** |
| Database and backend | **[CONFIRM]** | **[CONFIRM]** |
| File storage (card images pre-deletion, receipts) | **[CONFIRM]** | **[CONFIRM]** |
| Authentication | **[CONFIRM]** | **[CONFIRM]** |
| Transactional email | **[CONFIRM]** | **[CONFIRM]** |
| Analytics | **[CONFIRM]** | **[CONFIRM]** |

8.2 We carry out a role analysis for each provider; those acting on our instructions are processors under a written agreement, while the Payment Provider acts as an independent controller for payment processing. Where a provider stores data outside the UK, we rely on adequacy regulations or the International Data Transfer Agreement / UK Addendum, identified per transfer. **[CONFIRM WITH ENGINEERING]**

8.3 We may also disclose personal data where lawful and reasonably necessary to: the police or another authority where we report or are lawfully required to; our professional advisers; and a purchaser or successor on a sale, transfer or incorporation. **We do not sell your personal data or email addresses.** We do not disclose one user's identity directly to another private user as a dispute-resolution step (see clause 25 of the Terms of Service).

## 9. Institutions and development offices

9.1 **Aggregate insights.** We may share with an Institution aggregated figures about its own Campaigns (totals, numbers of donations, date ranges, averages), applying a suppression threshold so small groups are rolled up. **Aggregation reduces identifiability but may not completely eliminate it**, particularly for small campaigns with public pages; we assess re-identification risk per report and treat outputs as personal data unless that risk is sufficiently remote. We do not share donor demographics. **[SOLICITOR SIGN-OFF — before any external analytics dashboards/reports]**

9.2 **Identifiable data — only if you opt in.** Where you give separate consent, we share with a **named** Institution: your name; your email; your donations to that Institution's Campaigns; the dates of those donations; and whether you covered fees — so that the Institution can **thank you or invite you to relevant events** connected to your donation, contacting you through the channel you opt into, at a time of their choosing. The consent names the specific Institution and its purpose, shows the Institution's privacy notice before you consent, is optional, unticked by default, separate from the Terms, and withdrawable. **Refusing does not prevent donating.**

9.3 **Marketing is separate.** If an Institution wishes to send fundraising or other electronic marketing, that is collected through a **separate, unticked marketing consent**, not combined with the data-sharing consent.

9.4 We record the consent wording, version and timestamp. Once transferred, the Institution is an independent controller under its own notice; by contract it may use the data only for the agreed purpose, must comply with UK GDPR and PECR, must honour withdrawals, must not use the data for unrelated purposes, and must delete it when no longer required. We pass on withdrawal requests but cannot delete data already held by an Institution. **[SOLICITOR SIGN-OFF — consent wording alongside the Institution Agreement]**

## 10. Hiding your name

10.1 You may donate with your **name hidden** from the public page and the Campaign Owner. This is not the same as being untraceable: your donation amount is still shown, the Payment Provider has your payment data, and Dono holds your records. Unique amounts or timing can sometimes identify a donor in a small community; we explain this when you choose the option. Changing the setting affects future display only. In a dispute, your identity remains withheld from the Campaign Owner and is disclosed only where required or permitted by law.

## 11. Receipts and third-party data in uploads

11.1 Campaign Owners submit receipts and evidence **privately to Dono**; these are not published or shown to Donors. Receipts may **incidentally contain third-party personal data** (for example supplier or other individuals' details). We process such data only for expenditure verification and retain it only as long as necessary.

11.2 Campaign Owners must remove unnecessary personal data before uploading, and **Dono reserves the right to redact or remove unnecessary personal information from uploaded evidence.** We use redaction checks before permanent storage where feasible and quarantine or delete accidental sensitive uploads. We maintain an internal Article 14 assessment explaining why individual notification does not apply where the data is processed only incidentally for a limited purpose and notification would involve disproportionate effort. **[SOLICITOR SIGN-OFF]**

## 12. Special category and criminal-offence data

12.1 Some campaigns or moderation reports may contain **special category data** (for example health, disability, religion or sexual orientation). Dono does not ask for this unless genuinely necessary, encourages users not to upload unnecessary sensitive information, limits who can access it, removes unnecessary sensitive information where appropriate, and only processes it where an appropriate condition applies.

12.2 Fraud investigations, moderation reports and chargeback disputes may involve **allegations of criminal conduct**. Dono restricts access to such information, only processes it where legally permitted, and retains it only as long as necessary. The precise conditions and safeguards are documented in an internal Special Category & Criminal Data Policy. **[INTERNAL DOCUMENT — see tasks list; SOLICITOR SIGN-OFF]**

## 13. Your rights and how to complain

13.1 You have the right to: access your data; correct inaccurate data; request erasure; restrict processing; object to processing based on legitimate interests; data portability; and withdraw consent where we rely on it. Where we have not obtained data directly from you, we tell you the source and categories. We do not make solely automated decisions with legal or similarly significant effects; if that changes we will explain it. Some data cannot be deleted where we need it to defend a legal claim, comply with a legal obligation, or allow a Donor to pursue a refund they are entitled to.

13.2 Exercise a right by emailing **dono.outreach@gmail.com**. We respond without undue delay and within one month, extendable where lawfully permitted, and we will tell you if an extension applies.

13.3 **Complaining to Dono.** You may complain to us as controller about how we handle your personal data. We will **acknowledge your complaint within 30 days**, make appropriate enquiries without undue delay, keep you informed of progress, and tell you the outcome. **[CONFIRM WITH ENGINEERING — complaints form and workflow]**

13.4 You may also complain to the Information Commissioner's Office at ico.org.uk or on 0303 123 1113. We would rather you came to us first, but you do not have to.

## 14. Security, children, cookies and changes

14.1 **Security.** We use appropriate technical and organisational measures proportionate to the risk, including access controls, logging of administrative access to identity data, and defined deletion schedules; specific measures depend on the finalised providers. We operate a tested incident-response plan covering assessment, notification to the ICO where required (without undue delay and, where feasible, within 72 hours of becoming aware), notification to affected people where the risk is high, and evidence preservation. We describe controls proportionately rather than absolutely. **[CONFIRM WITH ENGINEERING — verify each control with architecture evidence]**

14.2 **Children.** The Platform is for adults; you must be 18 or over. We do not knowingly collect data from anyone under 18 and delete it if we learn we have. A children's access assessment under the Online Safety Act is being completed. **[SOLICITOR SIGN-OFF]**

14.3 **Cookies.** See the Cookie Notice. We update this Notice as the Platform develops and tell you about material changes; the version and date appear at the top.
