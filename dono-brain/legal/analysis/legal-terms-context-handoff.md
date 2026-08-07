# Dono Legal Terms and Policy Context Handoff

**Last consolidated:** 20 July 2026  
**Purpose:** A standalone reference file containing the current commercial, operational and legal-policy context for Dono. It is intended to be uploaded into future conversations before drafting or revising Dono's legal documents.  
**Status:** Working specification only. It is not legal advice and is not ready for publication.

Use the following labels consistently in internal drafts:

- **[TO BE CONFIRMED BEFORE LAUNCH]**
- **[SUBJECT TO STRIPE CONFIGURATION]**
- **[COUNSEL REVIEW REQUIRED]**
- **[ACCOUNTANT REVIEW REQUIRED]**
- **[PRIVACY IMPLEMENTATION REQUIRED]**

No unresolved marker should remain in a published document.

---

# 1. Executive summary

Dono is intended to be a UK-only online crowdfunding platform for students at recognised UK higher-education institutions. Eligible students may create campaigns for defined purposes such as academic research, travel, expeditions and society events. Donors may be located anywhere, subject to Stripe, sanctions, payment-method and currency restrictions.

Dono will use Stripe Connect with Standard connected accounts and direct charges. The individual student, society or institution connected-account holder will receive the payment and will be the merchant of record. Dono will take an application/platform fee. Dono will not hold campaign funds and will not act as a bank, escrow provider or payment processor.

Dono will check student status using a university email address and student-card image. Stripe will separately conduct identity and KYC checks. Dono cannot verify the full authenticity, accuracy or viability of every campaign. Any badge must state precisely what was checked.

Campaign owners must use money only for the stated campaign purpose, maintain itemised budgets, provide evidence of expenditure, publish updates and cooperate with refunds and investigations. Dono will operate an internal refund and appeal process, but cannot guarantee recovery where a connected account has insufficient funds.

Dono is currently an unincorporated sole-trader business operated by Amrit Kaur Rooprai. The operator has personal liability unless the structure changes.

---

# 2. How future conversations should use this file

Future drafting should:

1. Treat confirmed decisions as the current Dono model.
2. Preserve the distinction between:
   - Dono's student-status checks;
   - Stripe's identity and KYC checks;
   - society approval;
   - institutional endorsement;
   - verification of the truth or viability of a campaign.
3. Never say that Dono holds campaign funds.
4. Never say that Dono itself processes card payments.
5. Never say that Stripe bears all unrecoverable losses unless the implemented Stripe configuration confirms this.
6. Never describe Dono as affiliated with any university, college or society unless a specific written arrangement expressly provides otherwise.
7. Use British English.
8. Refer to the service as **Dono**, unless the brand name changes.
9. Mark operational or legal uncertainty rather than inventing a rule.
10. Treat this file as a commercial and operational brief, not a substitute for solicitor review.

---

# 3. Legal identity and operator

## 3.1 Current operator

Dono is:

- A trading name.
- Operated by **Amrit Kaur Rooprai**.
- Operated as a **sole trader**.
- Not incorporated.
- Not registered as a company or other separate legal entity.
- Intended to operate only in the United Kingdom.

Suggested identification clause:

> **Dono is a trading name operated by Amrit Kaur Rooprai, a sole trader. References to "Dono", "we", "us" and "our" mean Amrit Kaur Rooprai trading as Dono.**

## 3.2 Contact details

- Complaints email: **dono.outreach@gmail.com**
- UK geographical business address: **[TO BE INSERTED BEFORE LAUNCH]**
- Privacy contact: initially the same email unless a separate address is created.
- Legal notices contact: initially the same email unless a separate address is created.

The published website and legal terms must identify the operator and include a usable UK geographical address.

## 3.3 Sole-trader implications

Because Dono is not incorporated:

- Amrit Kaur Rooprai is personally responsible for Dono's contractual obligations.
- Amrit Kaur Rooprai may have unlimited personal liability for debts, refunds, claims, regulatory breaches and data-protection liabilities.
- The Stripe platform account, platform-fee income, contracts, software and brand must have clear ownership.
- Any co-founder profit-sharing, intellectual-property or equity expectations need a separate agreement.
- Incorporation before launch should be considered with a solicitor and accountant.

---

# 4. Geographic scope and eligibility

## 4.1 Geographic scope

- Dono will initially operate only in the UK.
- Only recognised UK higher-education institutions may participate.
- Only eligible students of those institutions may create campaigns.
- Students must be physically studying in the UK.
- Donors may be located anywhere, subject to:
  - Stripe availability;
  - supported cards and currencies;
  - sanctions;
  - anti-fraud controls;
  - local legal restrictions;
  - any restrictions Dono later adopts.
- Whether Dono accepts only GBP is **[TO BE CONFIRMED BEFORE LAUNCH]**.

## 4.2 Eligible students

A student campaign owner must:

- Be at least 18.
- Be currently enrolled at a recognised UK higher-education institution.
- Be physically studying in the UK.
- Use a valid university email address.
- Provide an acceptable student-card image.
- Complete the required Stripe connected-account onboarding.
- Remain eligible while the campaign is active.

Eligible categories currently include:

- Visiting students.
- Students on placement.

Not eligible:

- Recent graduates.
- People who have left the institution.
- People whose current student status cannot be verified.
- Students attempting to create a campaign within 60 days of their expected graduation or departure, under the adopted provisional model.

Still undecided:

- Suspended students.
- Students on interruption.
- Students on leave of absence.
- Part-time or distance-learning students who are not physically studying in the UK.
- Students whose course ends before their formal graduation date.

## 4.3 Donor eligibility

- Donors must be at least 18.
- Donors must be legally capable of making the payment.
- Donors may be outside the UK.
- Donors must comply with applicable sanctions, anti-fraud and payment restrictions.
- Donors receive no investment, ownership or repayment right merely by donating.

## 4.4 Recognised institutions

- Dono decides which institutions count as recognised institutions.
- Initially, only UK higher-education institutions are included.
- Listing an institution does not imply endorsement, sponsorship or affiliation.
- Dono may refuse, suspend or remove an institution from the platform.

---

# 5. Institutional independence

The default public position should be:

> Dono is not operated by, affiliated with, sponsored by or endorsed by any university, college, society or other institution merely because that organisation is listed on Dono, a student uses its email address, Dono checks a student's status, or a campaign appears under that organisation's name.

Any partnership, affiliation or endorsement must be expressly stated and supported by a written arrangement.

Specific distinctions:

- **Student status checked by Dono** does not mean the institution endorses the student or campaign.
- **Society approved** means the society page approved the campaign for presentation as a society campaign.
- **Institutionally endorsed** should be used only where the institution has expressly endorsed the campaign.
- An institution may request removal, but Dono considers the request and does not automatically comply.

---

# 6. Legal-document architecture

Dono should use a suite of separate documents.

## 6.1 Core documents

1. **Terms of Service**
   - Applies generally to all users.
   - Explains Dono's role, accounts, enforcement, liability and general legal provisions.

2. **Student Campaign Terms**
   - Applies to individual student campaign owners.
   - Covers eligibility, campaign creation, permitted use of funds, evidence, updates, refunds and misuse.

3. **Society Campaign Terms**
   - Applies to society campaigns.
   - Covers society approval, responsible individuals, connected-account ownership, property ownership, succession and responsibility.

4. **Donor Terms**
   - Covers the nature of donations, fees, no guaranteed outcome, anonymity, refunds and chargebacks.

5. **Refund and Dispute Policy**
   - Covers refund grounds, evidence, deadlines, decisions, appeals, chargebacks and failed recovery.

6. **Community Guidelines**
   - Covers prohibited content and conduct, comments, reporting, moderation and appeals.

7. **Verification Policy**
   - Explains precisely what Dono, Stripe, societies and institutions check.

8. **Privacy Policy**
   - Covers UK GDPR, student-card data, payments, service providers, institutional sharing, rights and retention.

9. **Cookie Policy**
   - Depends on the actual cookie, analytics and advertising technologies used.

10. **Institution Agreement**
    - For future university, college or institutional customers and partners.

## 6.2 Future institution agreement

A future enterprise/institution agreement may need:

- White-label or platform licensing.
- Branding.
- Data ownership and permitted uses.
- Donor and alumni-data arrangements.
- Stripe and payment responsibilities.
- Service levels.
- Security requirements.
- UK GDPR controller/processor allocation.
- Liability and indemnities.
- Fees.
- Implementation.
- Support.
- Intellectual property.
- Audit rights.
- Procurement and compliance requirements.
- Termination and data-return arrangements.

## 6.3 Working order of precedence

Provisional order where documents conflict:

1. Signed institution agreement, for matters specific to that institution.
2. Society Campaign Terms or Student Campaign Terms.
3. Donor Terms.
4. Refund and Dispute Policy.
5. Verification Policy, Community Guidelines, Privacy Policy and Cookie Policy.
6. General Terms of Service.

**[COUNSEL REVIEW REQUIRED]**

---

# 7. Proposed Terms of Service structure

## Part 1 — Introduction

### 1. Acceptance of Terms

Cover:

- Agreement to be bound.
- Minimum age.
- Eligibility.
- Incorporated policies.
- Changes and versions.
- Applicable law.

### 2. Definitions

Define at least:

- Platform.
- Services.
- User.
- Student.
- Donor.
- Campaign.
- Donation.
- Campaign Owner.
- Institution.
- Society.
- Responsible Individual.
- Project.
- Campaign End Date.
- Connected Account.
- Payment Provider.
- Merchant of Record.
- Verification.
- Student Status Check.
- Content.
- Community.
- Material Change.
- Surplus Funds.

## Part 2 — Platform description

### 3. What Dono does

Dono is:

- A technology platform.
- A donation-crowdfunding platform.
- A university-community and alumni-engagement platform.
- A host for campaign pages and user-generated content.
- A provider of student-status checking, moderation and an internal refund process.

Dono is not:

- A bank.
- An escrow provider.
- A payment processor.
- An investment platform.
- A charity merely because it operates the platform.
- A university, college or society.
- A guarantor of campaigns.
- A provider of legal, tax, investment or financial advice.

### 4. Eligibility

Cover:

- Student eligibility.
- Donor eligibility.
- Society representatives.
- Institution users.
- Geographic restrictions.
- Sanctions and legal restrictions.

## Part 3 — Accounts

### 5. Creating an account

Cover:

- Accurate information.
- Required account data.
- University email.
- Authentication.
- Account security.
- Multiple accounts.
- False information.
- Responsibility for access.

### 6. Identity and student-status checks

Cover:

- Student card.
- University email.
- Stripe onboarding.
- Annual reverification.
- Further information requests.
- Refusal and suspension.
- Expiry at graduation or departure.

## Part 4 — Campaigns

### 7. Creating campaigns

Cover:

- Campaign name.
- Explanation of need.
- Itemised budget.
- Accurate estimated costs.
- Purchase links.
- Funding target.
- Campaign End Date.
- Expected purchase or expenditure date.
- Media.
- Ownership.
- Evidence.
- Updates.

### 8. Campaign rules

Prohibit:

- Misleading information.
- Fraud.
- Plagiarism.
- Illegal activity.
- Unauthorised fundraising for another person.
- Copyright infringement.
- False affiliation.
- Duplicate or deceptive campaigns.
- Prohibited categories.

### 9. Verification

Explain:

- Student-status check.
- Stripe KYC.
- Society approval.
- Institutional endorsement.
- Badge meanings.
- Withdrawal or expiry of status.

### 10. Campaign-owner obligations

Require:

- Proper use of funds.
- Records and receipts.
- Updates.
- Notice of material changes.
- Prompt responses.
- Refund cooperation.
- Investigation cooperation.

## Part 5 — Donations

### 11. Making donations

Cover:

- Stripe.
- Immediate charging.
- Payment methods.
- Currency.
- Fees.
- Email receipts.
- Anonymous donations.
- Taxes.

### 12. Nature of donations

State:

- Donation or gratuitous contribution.
- Not an investment.
- No equity.
- No ownership.
- No repayment right merely because of dissatisfaction.
- No goods or services in return.
- No guaranteed outcome.
- Not necessarily tax-deductible.
- No charitable tax receipt issued by Dono.

### 13. Refunds

Incorporate:

- Refund grounds.
- Time limits.
- Evidence.
- Partial refunds.
- Appeals.
- Fee treatment.
- Recovery limitations.

### 14. Failed, cancelled or changed projects

Cover:

- Insufficient funding.
- Cancellation.
- Withdrawal.
- Inability to use funds meaningfully.
- Misrepresentation.
- Material changes.
- Surplus funds.
- Remedies.

## Part 6 — Payments

### 15. Payment processing

Cover:

- Stripe Connect.
- Standard connected accounts.
- Direct charges.
- Merchant of record.
- KYC.
- Refunds.
- Chargebacks.
- Payouts.
- Negative balances.
- Stripe terms and privacy policy.

### 16. Fees

Cover:

- Dono platform fee.
- Stripe processing fee.
- Fee-cover option.
- Deduction from campaign proceeds.
- VAT.
- International cards.
- Currency conversion.
- Changes to fees.

## Part 7 — Community

### 17. Communications

Cover:

- Public comments.
- No private messaging.
- Reporting.
- Spam.
- Harassment.
- Moderation.
- Appeals.

### 18. Community standards

Cover:

- Respect.
- No discrimination.
- No abuse.
- No impersonation.
- No illegal content.
- No scams.
- No prohibited sexual or offensive content.

## Part 8 — Content

### 19. User content

Cover:

- User ownership.
- Licence to Dono.
- Public display.
- Marketing use.
- Moderation.
- Removal.
- Audit copies.
- Backups.

### 20. Intellectual property

Cover:

- Dono IP.
- Student and society IP.
- University names and logos.
- Society branding.
- Trademarks.
- Copyright complaints.

## Part 9 — Privacy

### 21. Personal data

Reference the Privacy Policy and cover:

- Dono as controller.
- Stripe.
- Other service providers.
- Retention.
- Lawful bases.
- Rights.
- Institutional data sharing.

### 22. Cookies

Cover:

- Essential cookies.
- Analytics.
- Consent.
- Preferences.
- Cookie Policy.

## Part 10 — Enforcement

### 23. Suspensions

Grounds include:

- Fraud.
- Misconduct.
- Failure to provide evidence.
- Failure to update.
- Community breaches.
- Stripe suspension.
- Payment or refund issues.
- Legal requests.

### 24. Campaign removal

Grounds include:

- Fraud.
- Copyright infringement.
- Illegal activity.
- Community Guidelines.
- Safety.
- Recognised institution request.
- Verification failure.

### 25. Investigations

Cover:

- Information requests.
- Evidence review.
- Temporary visibility restrictions.
- Referrals to institutions.
- Reports to authorities.
- Lawful disclosure.

## Part 11 — Liability

### 26. Platform role

State that Dono:

- Hosts campaigns.
- Conducts limited student-status checks.
- Does not guarantee identity, authenticity, accuracy, viability, completion or outcomes.
- Does not guarantee refunds or recovery.

### 27. No advice

No:

- Investment advice.
- Financial advice.
- Tax advice.
- Legal advice.

### 28. Limitation of liability

Cover:

- Liability cap.
- Indirect losses.
- Lost profits.
- Service interruptions.
- Force majeure.
- Mandatory consumer rights.

**[COUNSEL REVIEW REQUIRED]**

### 29. Indemnity

Potentially cover losses caused by:

- Fraud.
- Illegality.
- IP infringement.
- Misrepresentation.
- Misuse of funds.
- User breach.

Enforceability and fairness against students and unincorporated societies require specialist review.

## Part 12 — Legal

### 30. Changes

Cover:

- Service changes.
- Feature removal.
- Pricing changes.
- Policy updates.
- Notice of material changes.

### 31. Termination

Cover:

- User closure.
- Dono termination.
- Continuing refund, evidence, payment, IP and investigation obligations.

### 32. Governing law

Intended:

- Law of England and Wales.
- Courts of England and Wales.
- Mandatory consumer rights may still apply elsewhere.

**[COUNSEL REVIEW REQUIRED]**

### 33. Contact

Include:

- Operator.
- Business address.
- Complaints email.
- Privacy contact.
- Formal-notice process.

---

# 8. Account information and verification

## 8.1 Information collected for a student account

Current intended fields:

- Full name.
- Date of birth.
- University email address.
- Institution.
- Course.
- College, where applicable.
- Student number.
- Student-card image.
- Student-card expiry.
- Expected graduation or departure date.
- Password or other authentication credential.
- Stripe connected-account status and identifiers where relevant.

Authentication and password architecture are **[TO BE CONFIRMED BEFORE LAUNCH]**.

## 8.2 Student-status process

Current process:

1. Student submits a university email address.
2. Student submits a student-card image.
3. Dono administrators manually review the card.
4. Dono checks current student status and records relevant institutional details.
5. Stripe separately conducts its identity and KYC onboarding.
6. Dono aims to complete its review within seven business days.
7. Student status is reverified at the start of each academic year.
8. Dono may request further information.
9. Failure to respond may result in suspension or refusal.

A general response deadline for information requests is **[TO BE CONFIRMED]**. Five working days is the working proposal.

## 8.3 Age model

Adopted model:

- Date of birth is declared to Dono.
- Student cards are not relied upon as proof of age.
- Stripe KYC is intended to confirm identity and age eligibility.
- Dono should not collect a second government-ID image unless operationally necessary.
- Whether Stripe gives Dono a sufficiently reliable age-check signal must be confirmed in the final implementation.

## 8.4 Verification language

Preferred label:

> **Student status checked by Dono**

Do not use a generic “Verified” badge without explanation.

Dono's check does not verify:

- Every campaign statement.
- The authenticity of every document.
- The accuracy of every cost.
- The viability of the project.
- The future conduct of the campaign owner.
- Institutional endorsement.
- Successful completion.

Possible separate labels:

- Student status checked by Dono.
- Stripe onboarding completed.
- Society approved.
- Institutionally endorsed.

---

# 9. Campaign requirements

Every campaign should include:

- Campaign name.
- Clear explanation of what is being funded.
- Explanation of why the money is needed.
- Detailed itemised budget.
- Accurate estimated costs.
- Purchase links where applicable.
- Funding target.
- Campaign End Date.
- Expected expenditure or purchase date.
- Supporting media and documents where appropriate.
- Ownership of the funded property or output.
- Planned update schedule.
- Agreement to provide evidence.
- Agreement to provide accurate information.
- Agreement to use funds only for the stated purpose.
- Agreement to notify material changes.
- Agreement to cooperate with Dono and Stripe.

Campaign owners must accurately represent the campaign in both the application and public campaign page.

---

# 10. Campaign duration and partial funding

## 10.1 Campaign End Date

Adopted provisional model:

- Every campaign must have a funding-closing date.
- The funding-closing date is the Campaign End Date.
- A campaign may ordinarily remain open for no more than 12 months.
- A campaign must ordinarily close at least 60 days before the campaign owner's expected graduation or departure.
- Dono may approve an extension.
- Donations are charged immediately.
- Donations are collected even if the target is not met.

## 10.2 Partially funded campaigns

- The campaign owner decides whether the project can proceed with the amount raised.
- If the money can still be meaningfully used for the stated campaign purpose, the project may proceed.
- If it cannot be meaningfully used, the campaign owner must arrange refunds.
- Insufficient funding alone does not automatically cancel the project.

## 10.3 Graduation and departure

- No new campaign should start within 60 days of expected graduation or departure.
- Active campaigns must close, complete or be properly transferred before the student leaves.
- Graduation or departure does not extinguish:
  - refund obligations;
  - evidence obligations;
  - update obligations;
  - cooperation obligations;
  - investigation obligations.
- Individual campaigns normally cannot be transferred.
- Society campaigns may be transferred to a replacement Responsible Individual.

---

# 11. Permitted use of funds and campaign changes

## 11.1 Core use-of-funds rule

> Campaign funds may be used only for the purposes represented to donors on the campaign page, including approved line items and reasonable directly related expenditure.

## 11.2 Moving funds between line items

- Funds may be moved between verified line items.
- The reallocation must remain within the same stated campaign purpose.
- A material diversion to a different purpose is prohibited without approval and any necessary donor notice or refund.

## 11.3 Adding or changing line items

Campaign owners may:

- Add a line item after publication, subject to Dono review.
- Update a price where a source or reasonable evidence is provided.
- Buy a substitute item serving substantially the same purpose and costing a similar or lower amount.

Material changes require:

- Explanation.
- Evidence or source.
- Dono review.
- Campaign-page update.
- Donor notice where appropriate.
- Potential refund rights.

## 11.4 Material change

The final definition should include changes to:

- Core purpose.
- Recipient.
- Main item or service.
- Expected outcome.
- Ownership.
- Timing.
- Use of a significant share of funds.
- Society or responsible individual.
- Connected-account recipient.

---

# 12. Surplus funds

Adopted rule:

> Funds may be moved between verified line items and used for reasonable additional expenditure directly advancing the stated campaign purpose. Any amount that cannot reasonably be used for that purpose must be refunded.

There is currently no de minimis threshold.

Because proportionate micro-refunds may be impracticable, the adopted objective process is:

1. Refund the most recent donor, up to the amount they donated.
2. If surplus remains, refund the next most recent donor.
3. Continue in reverse chronological order until the surplus is exhausted.

Consequences:

- Surplus is not distributed proportionately to every donor.
- No donor is guaranteed a proportionate surplus refund.
- The rule must be disclosed before donation.
- Stripe and fee implications remain **[SUBJECT TO STRIPE CONFIGURATION]**.

---

# 13. Evidence and update obligations

Confirmed:

- Campaign owners declare when they plan to make purchases.
- Receipts or other evidence must be uploaded within 14 days of expenditure.
- An outcome update is required approximately three months after expenditure.
- Dono sends reminders before suspension.
- One missed deadline triggers follow-up by email and on-platform notice.
- Continued failure may result in suspension or removal.

Still to decide:

- Whether updates are also required every three months while fundraising.
- The general response deadline for Dono information requests.
- Whether evidence is public, donor-visible or Dono-only.
- What must be redacted from receipts.
- Evidence-retention periods.
- Whether a final closure statement is mandatory.

---

# 14. Funded property and resale

## 14.1 Ownership

Individual campaign:

- The item or output belongs to the individual campaign owner unless the campaign says otherwise.
- It must be used for the stated purpose.

Society campaign:

- The item or output belongs to the society.
- It must not be retained personally by an outgoing officer.
- Sale proceeds belong to the society or remain dedicated to society purposes.

## 14.2 Resale model

Adopted working rule:

- An item must not be acquired with the intention of immediate resale or personal profit.
- It may not normally be sold within 12 months without Dono's prior approval.
- Earlier sale may be permitted where the item is defective, unsuitable, replaced or no longer reasonably needed for a documented reason.
- If sold before the campaign purpose is completed, proceeds must be reapplied to that purpose or refunded.
- Disposal after genuine use for the campaign purpose is permitted.

---

# 15. Society campaigns

## 15.1 Creation and approval

- A student may fundraise on behalf of a society.
- A student may not fundraise on behalf of another individual.
- A society campaign must be approved through the relevant society page.
- The society must register at least one named Responsible Individual.
- The Responsible Individual must confirm authority to act.

Whether two officers should approve is **[TO BE CONFIRMED BEFORE LAUNCH]**. The present minimum is one Responsible Individual.

## 15.2 Payment recipient

Preferred order:

1. Society connected Stripe account and society bank account.
2. If no suitable society account exists, the named student's connected account and bank account.

The connected-account holder is the merchant of record.

Where an individual account is used:

- The individual remains responsible to Stripe and Dono.
- Society approval does not transfer Stripe liability.
- The campaign page should disclose the legal recipient.
- Funded property still belongs to the society.

The ability of each unincorporated society to open the relevant Stripe account must be checked in practice.

## 15.3 Responsibility

- The owner of the connected account is responsible for refunds and chargebacks.
- The society and Responsible Individual must maintain evidence and updates.
- A replacement Responsible Individual must be appointed before the original person leaves.
- The replacement must expressly accept outstanding duties.
- Dono may refuse a transfer.
- Where the campaign is fully complete and all obligations are satisfied, Dono may decide that no transfer is needed.

---

# 16. Stripe payment model

## 16.1 Confirmed intended model

- Stripe Connect.
- Standard connected accounts.
- Direct charges.
- The connected account receives the donation.
- The connected-account holder is the merchant of record.
- Dono takes an application/platform fee.
- Platform fees go to the Dono Stripe platform account.
- The Dono Stripe platform account is owned by Amrit Kaur Rooprai trading as Dono.
- Dono does not hold campaign funds.
- Dono does not process card payments itself.
- Stripe performs KYC.
- Donations are charged immediately.
- Dono can initiate refunds through the platform.
- Dono may remove or suspend a campaign on the website.
- Dono cannot necessarily stop or recall funds already paid out.
- The connected account is intended to be debited for refunds and chargebacks.
- Stripe's terms and privacy policy also apply.

## 16.2 Matters not yet confirmed

These must remain marked **[SUBJECT TO STRIPE CONFIGURATION]**:

- Who bears unrecoverable negative balances.
- Whether Stripe or Dono is the configured losses collector.
- Whether Stripe can debit the connected bank account.
- What happens when Stripe recovery fails.
- Whether Dono can be debited or invoiced.
- Who handles dispute evidence.
- Who pays dispute fees.
- Whether Dono can automatically reverse its application fee.
- Whether refunds remain pending when the connected balance is insufficient.
- The exact permissions Dono has over Standard accounts.
- Payout-control limitations.
- The precise data accessible to Dono through the API.

Do not state that Stripe assumes all losses until this is confirmed.

---

# 17. Payment-data visibility

Current intended wording:

- Stripe receives and processes the donor's full payment credentials.
- The connected-account holder receives transaction information made available by Stripe.
- Dono may receive transaction information and limited payment-method information through Stripe, such as:
  - amount;
  - payment status;
  - card brand or type;
  - expiry information where available;
  - last four digits;
  - billing or receipt information where collected.
- Dono should not receive or store full card numbers or card security codes where Stripe Checkout or Elements is correctly implemented.
- Payment information is not displayed publicly.

This must be checked against the final backend.

---

# 18. Donation receipts and tax

- Donors receive an email confirming the donation.
- Dono does not issue a charitable tax receipt.
- Donations are not necessarily tax-deductible.
- The receipt should identify the merchant of record and recipient where appropriate.
- Receipt content and branding are **[TO BE CONFIRMED BEFORE LAUNCH]**.
- Gift Aid must not be claimed unless a legally eligible charity and compliant process are involved.

---

# 19. Fee model

## 19.1 Checkout choice

A donor may choose to:

1. Cover Dono and Stripe-related fees at checkout so the intended campaign amount reaches the recipient; or
2. Decline, in which case fees are deducted from the amount received by the campaign.

Checkout should show separately:

- Intended campaign donation.
- Dono platform fee.
- Estimated Stripe processing fee.
- Total charged.
- Expected amount reaching the campaign.

## 19.2 Undecided fee details

- Exact Dono percentage: **[TO BE CONFIRMED BEFORE LAUNCH]**
- Any fixed Dono fee: **[TO BE CONFIRMED BEFORE LAUNCH]**
- GBP-only or multi-currency: **[TO BE CONFIRMED BEFORE LAUNCH]**
- Whether foreign-card costs are passed through: **[TO BE CONFIRMED]**
- Whether fees are VAT-inclusive: **[ACCOUNTANT REVIEW REQUIRED]**

Stripe's discussed standard UK-card price of 1.5% + 20p must not be presented as the universal fee. International, premium or converted payments may cost more and pricing may change.

## 19.3 Fee-refund allocation

Current intended rule:

- If a campaign cannot proceed because it did not raise enough, Dono refunds its own fee.
- Dono does not refund Stripe's fee.
- If the campaign owner caused the refund through mistake, breach or misrepresentation:
  - the donor should receive Dono's fee back;
  - the campaign owner bears the economic cost where technically possible.
- If the donor caused the refund through their own error:
  - the donor bears the non-refundable Dono fee.
- For a partial refund, Dono's fee may be refunded proportionately where the donor was not at fault.
- The party at fault should bear the Dono fee.

The final document must distinguish:

- What the donor receives.
- Who bears the cost.
- What Stripe can technically reverse.

**[SUBJECT TO STRIPE CONFIGURATION]**

---

# 20. Nature of donations

A Dono contribution is intended to be:

- A donation or gratuitous contribution to the stated campaign purpose.
- Not an investment.
- Not a loan.
- Not equity.
- Not an ownership interest.
- Not made in return for goods or services.
- Not guaranteed to achieve an outcome.
- Not automatically repayable because of dissatisfaction.
- Not necessarily tax-deductible.

The precise legal characterisation as a gift, conditional gift or consumer payment requires solicitor review.

---

# 21. Refund and dispute policy

## 21.1 Potential refund grounds

- Duplicate payment.
- Payment error.
- Unauthorised payment.
- Campaign cancellation.
- Material misrepresentation.
- Fraud.
- Misuse of funds.
- Failure to provide evidence.
- Material unauthorised change.
- Inability to use money meaningfully for the stated purpose.
- Failure to proceed where funds should therefore be returned.
- Verification failure.

Mere dissatisfaction with the outcome is insufficient.

## 21.2 Time limits

Adopted provisional timetable:

- Ordinary request:
  - within 60 days after the Campaign End Date; or
  - within 60 days after the donor became aware of the alleged breach, where later.
- Fraud or deliberate material misrepresentation:
  - up to 12 months after the donation.
- Campaign-owner response:
  - five working days.
- Appeal:
  - within ten working days after the initial decision.
- Appeal reviewer:
  - a different administrator where reasonably practicable.

Dono's decision deadlines are **[TO BE CONFIRMED BEFORE LAUNCH]**.

## 21.3 Evidence

Either party may submit:

- Receipts.
- Photographs.
- Purchase records.
- Bank or financial information.
- Campaign updates.
- Communications.
- Links and pricing sources.
- Other relevant evidence.

## 21.4 Dono decisions

Dono may decide:

- No refund.
- Partial refund.
- Full refund.

Dono's initial decision is appealable.

## 21.5 Authority to initiate refund

Campaign owners should contractually authorise Dono to initiate an approved refund where Dono considers this necessary.

This is intended as a last-resort power.

**[SUBJECT TO STRIPE CONFIGURATION AND COUNSEL REVIEW]**

## 21.6 Where funds have been withdrawn

- Stripe applies its connected-account balance and recovery process.
- The connected-account holder remains responsible.
- A refund may be delayed or fail.
- Dono never pays refunds from its own funds.
- Dono does not pursue external debt collection.

If Stripe cannot recover an approved refund:

- The responsible account holder remains contractually liable.
- Dono may suspend or permanently ban the user.
- Dono may remove campaigns.
- Dono may refer deliberate misuse to the institution.
- Dono may report suspected fraud to the police or other authority.
- Dono may share relevant identity information with the donor where lawful and reasonably necessary.
- The donor may pursue chargeback, Stripe or legal remedies.
- Dono does not guarantee recovery.

## 21.7 Chargebacks

Chargebacks are separate from Dono's internal process.

- Card issuers and payment networks decide chargebacks.
- The connected account is intended to bear the chargeback and Stripe consequences.
- Dono may collect and assist with evidence.
- Who submits evidence and who pays dispute fees is **[SUBJECT TO STRIPE CONFIGURATION]**.
- Dono's internal decision does not remove statutory, payment-provider or legal rights.

---

# 22. Community and comments

## 22.1 Communications model

- There is no private messaging.
- All users with accounts may comment.
- Comments are public.
- Users may report content.
- There is no blocking feature at present.
- Moderation occurs after publication.

## 22.2 Comment controls

Adopted model:

- Users may edit or delete their own comments.
- Campaign owners may remove a comment from public display.
- Campaign owners may not edit another user's wording.
- Dono should retain a private moderation copy and audit log.
- Dono may restore a comment where campaign-owner deletion is misused.
- Users may appeal moderation decisions.
- The interface should indicate when a comment was edited.

## 22.3 Community Guidelines

Prohibit:

- Illegal activity.
- Fraud.
- Scams.
- Misleading fundraising.
- Harassment.
- Threats.
- Abuse.
- Discrimination.
- Hateful content.
- Impersonation.
- Spam.
- Sexual or pornographic content.
- Grossly offensive content.
- Exploitation.
- Dangerous or regulated activity.
- Copyright infringement.
- Trademark infringement.
- Unauthorised institutional branding.
- False affiliation or endorsement.
- Ban evasion.
- Malicious reporting.

Dono may remove content it reasonably considers contrary to the Community Guidelines.

The policy should be Dono-specific rather than merely referring to Meta's rules.

---

# 23. Campaign categories

## 23.1 Main intended uses

- Academic research.
- Educational or academic projects.
- Project-related travel.
- Expeditions.
- Society events.
- Society equipment and activities.

## 23.2 Expressly prohibited

- Alcohol-related expenditure.
- Political campaigning.
- Investments.
- Loans.
- Financial products.
- Equity or financial return.
- Fundraising on behalf of another individual.
- Pass-through donations to another person or organisation.
- Illegal goods, services or conduct.
- Fraudulent or misleading campaigns.
- Copyright-infringing campaigns.
- Campaigns breaching the Community Guidelines.

## 23.3 Still undecided

- Tuition fees.
- Rent.
- Ordinary living costs.
- Personal hardship.
- Medical expenses.
- Religious activities.
- Registered-charity fundraising.
- Commercial start-ups.
- Retrospective reimbursement.
- Legal expenses.
- Animal-related campaigns.
- Regulated goods.
- Raffles, lotteries and prize draws.
- Recurring donations.
- Pooled funds.
- Matching funds.

---

# 24. Institutional and society removal requests

- Recognised institution accounts may assign verified users.
- An assigned verified user may request removal of a campaign.
- Dono considers the request but does not automatically comply.
- Dono should verify authority where practicable.
- Dono may disclose the reason for removal.
- The campaign owner may appeal.
- A request does not automatically establish wrongdoing.

---

# 25. Privacy and data protection

## 25.1 Controller

Intended controller:

> **Amrit Kaur Rooprai trading as Dono**

This must change if the business incorporates or ownership changes.

## 25.2 Student-card data

Intended fields:

- Name.
- Institution.
- Course.
- College.
- Student number.
- Expiry date.
- University email.
- Student-card image.
- Expected graduation date.
- Declared date of birth.

Dono currently intends to store the student-card image and allow administrators to view it.

A data-minimisation review is needed. Dono should collect and retain only information reasonably necessary to:

- Verify student status.
- Identify the institution and course.
- Record the student number for lawful referral.
- Determine expiry and eligibility.

Unnecessary barcodes, library identifiers or unrelated information should not be retained without a documented need.

## 25.3 Retention

Still undecided:

- Student-card-image retention.
- Account-data retention.
- Receipt retention.
- Refund and dispute evidence.
- Moderation logs.
- Backups.
- Stripe metadata.
- Institutional referrals.
- Consent records.

Indefinite retention should not be used without a clear legal and operational reason.

## 25.4 Technology providers

Still unknown:

- Hosting provider.
- Database provider.
- File-storage provider.
- Authentication provider.
- Password architecture.
- Email provider.
- Analytics provider.
- Error monitoring.
- Cookie-consent provider.
- International data transfers.
- Encryption and administrator controls.
- Data-breach procedure.

These must be added to the Privacy Policy once selected.

## 25.5 Anonymous donations

Current model:

- Donor may hide their name publicly.
- Donation amount is displayed publicly.
- Payment information is not public.
- Stripe sees the payment data.
- Dono may receive transaction and contact data.
- The connected account may receive information made available by Stripe.

Still to decide:

- Whether donor name is hidden from the campaign owner.
- Whether donor email is hidden from the campaign owner.
- Whether anonymous comments are allowed.
- Whether anonymity can be changed later.

Use the phrase **publicly anonymous**, not completely anonymous.

## 25.6 Development-office and institutional data

Current model:

- Institutions and development offices may receive donation insights.
- Aggregate or anonymised insights may be shared where lawful.
- Identifiable donor information is shared only through separate opt-in consent.
- Consent must be:
  - optional;
  - unticked by default;
  - separate from the Terms;
  - specific about the recipient;
  - specific about the data;
  - specific about the purpose;
  - withdrawable.
- Refusal must not prevent donation.

Possible purposes:

- Development-office communications.
- Alumni engagement.
- Fundraising.
- Analytics.

## 25.7 Sale of email addresses

Do not include a blanket right to sell donor email addresses.

Any sale or identifiable marketing-data transfer requires:

- Specific legal review.
- Specific informed consent where required.
- Clear identification of recipient.
- Clear marketing purpose.
- Consent records.
- Withdrawal process.
- UK GDPR and PECR compliance.
- Controller-role agreement.

The safer launch model is aggregate insights by default and specific opt-in for identifiable sharing.

## 25.8 Lawful disclosures

Dono may disclose information where lawful and reasonably necessary for:

- Stripe processing.
- Service providers.
- Fraud prevention.
- Refunds and disputes.
- Legal compliance.
- Safety.
- Institutional misconduct referrals.
- Crime reports.
- Providing relevant identity data to a donor pursuing an unrecovered approved refund.

The Privacy Policy must identify categories of recipients and lawful bases.

---

# 26. Cookies

The Cookie Policy cannot be completed until the technology stack is known.

Still to define:

- Essential cookies.
- Authentication cookies.
- Analytics.
- Advertising or tracking.
- Consent-management tool.
- Preferences.
- Retention.
- Third-party cookies.

---

# 27. Enforcement

Dono may warn, restrict, suspend, remove or ban for:

- False account information.
- False campaign information.
- Fraud or suspected fraud.
- Failure to provide evidence.
- Failure to provide updates.
- Failure to respond.
- Misuse of campaign funds.
- Unpaid approved refunds.
- Community breaches.
- Copyright or trademark infringement.
- Harassment.
- Impersonation.
- Spam.
- Stripe suspension.
- Loss of payment capability.
- Loss of student status.
- Legal or safety requests.
- Ban evasion.

Dono may:

- Hide or remove campaigns.
- Restrict comments.
- Prevent new campaigns.
- Restrict platform features.
- Request evidence.
- Refer matters to institutions.
- Report suspected crime.
- Permanently ban users.

Dono cannot necessarily:

- Pause a payout already sent.
- Recover money already withdrawn.
- Guarantee refunds.
- Control chargeback decisions.

---

# 28. Appeals

Appeals should be available for:

- Content removal.
- Comment removal.
- Campaign removal.
- Account suspension.
- Internal refund decisions.

Current refund appeal deadline:

- Ten working days.

Other deadlines and reviewer arrangements remain **[TO BE CONFIRMED]**.

---

# 29. Dono's limited role and liability position

The Terms should state that Dono:

- Hosts campaigns.
- Checks limited student-status information.
- Provides moderation.
- Provides an internal refund process.
- Uses Stripe for payment processing.
- Does not hold donations.
- Cannot verify the complete authenticity of every campaign.
- Does not guarantee accuracy, viability, completion or outcomes.
- Does not guarantee that refunds can be recovered.

Avoid an absolute statement that Dono is never liable for fraudulent campaigns. Liability exclusions must remain fair, transparent and lawful.

---

# 30. Campaign-owner responsibility

Campaign owners are responsible for:

- Truth and accuracy.
- Authority.
- Lawful conduct.
- Costs and line items.
- Proper use of funds.
- Evidence.
- Updates.
- Property and disposal.
- Refunds.
- Chargebacks.
- Cooperation with Dono and Stripe.
- Claims caused by fraud, illegality, misrepresentation or IP infringement.

---

# 31. Donor responsibility

Donors are responsible for:

- Reviewing campaign information.
- Understanding that outcomes are not guaranteed.
- Providing correct payment information.
- Paying selected fee-cover amounts.
- Using refund and chargeback procedures honestly.
- Understanding that a donation is not an investment or purchase.

---

# 32. Legal and regulatory questions for specialist review

## 32.1 FCA and payment services

Obtain a written conclusion on whether Dono remains outside FCA authorisation with:

- Direct charges.
- Standard connected accounts.
- Recipient as merchant of record.
- Dono application fee.
- Dono-initiated refunds.
- No holding or pooling of campaign funds.

Review whether future features would change the analysis, especially:

- Pooled funds.
- Internal balances.
- Delayed payouts.
- Reallocation between campaigns.
- Wallets.
- Escrow-like promises.

## 32.2 Charity and fundraising law

Confirm:

- Professional fundraiser status.
- Commercial participator status.
- Written agreements.
- Solicitation statements.
- Differences between students, societies, colleges, universities and charities.
- Fundraising Regulator registration.
- Code of Fundraising Practice.
- Charitable campaigns.
- Gift Aid.
- Use of the word donation.

## 32.3 Consumer law

Confirm:

- Whether donors are consumers.
- Whether the payment is a gift, conditional gift or consumer payment.
- Fairness of refund and disclaimer wording.
- Mandatory information.
- Fee transparency.
- International donor rights.

## 32.4 Data protection

Confirm:

- Controller roles.
- Student-card lawful basis.
- Retention.
- Data minimisation.
- Institution referrals.
- Direct marketing.
- PECR.
- International transfers.
- ICO fee.
- DPIA requirements.

## 32.5 Online Safety Act

Because users can publish public comments, confirm:

- Whether Dono is an in-scope user-to-user service.
- Illegal-content risk assessment.
- Safety duties.
- Complaints and appeals.
- Record-keeping.
- Children's access analysis.
- Terms and reporting duties.

## 32.6 Tax

Confirm:

- VAT on Dono's fee.
- Whether prices are VAT-inclusive.
- Sole-trader tax and National Insurance.
- Campaign-recipient tax.
- Society tax.
- Refund treatment.
- Pre-incorporation expenses.
- Future founder shares or options.

## 32.7 Sole-trader risk

Review:

- Personal liability.
- Ownership of software, brand and Stripe account.
- Co-founder arrangements.
- Insurance.
- Incorporation before launch.
- Business-address disclosure.
- Continuity.
- Data-controller liability.

---

# 33. Statements to avoid

Do not state:

- “Every campaign is verified.”
- “Dono guarantees campaigns are genuine.”
- “Dono is affiliated with your institution.”
- “Stripe always pays unrecoverable refunds.”
- “Dono can pause all payouts.”
- “Every payment costs 1.5% + 20p.”
- “Dono can never be liable for fraud.”
- “Anonymous donors are completely anonymous.”
- “Dono may sell your data to anyone.”
- “A society is always a separate legal person.”
- “Dono issues tax-deductible receipts.”
- “A donation guarantees goods, services or an outcome.”

---

# 34. Preferred wording concepts

Use wording along these lines:

- **Student status checked by Dono.**
- **Stripe conducts separate identity and connected-account checks.**
- **The connected-account holder is the merchant of record.**
- **Dono does not hold campaign funds.**
- **Dono cannot verify every statement or guarantee campaign outcomes.**
- **Society approval does not mean university endorsement.**
- **Anonymous means hidden from public display, not anonymous to Stripe or necessarily to Dono.**
- **Donors receive no goods, services, equity or financial return in exchange for a donation.**
- **Approved refunds remain dependent on recovery from the responsible connected account.**
- **Dono does not fund refunds from its own money.**
- **Mandatory legal, consumer and chargeback rights remain unaffected.**

---

# 35. Remaining launch blockers and placeholders

The principal unresolved items are:

1. UK geographical business address.
2. Exact Dono platform fee.
3. Fixed-fee component, if any.
4. GBP-only or multi-currency.
5. Stripe negative-balance allocation.
6. Stripe dispute-fee allocation.
7. Stripe refund and application-fee implementation.
8. Exact Standard-account permissions.
9. Hosting provider.
10. Database provider.
11. File-storage provider.
12. Authentication and password architecture.
13. Email provider.
14. Analytics and cookie technologies.
15. Student-card retention.
16. Receipt and evidence retention.
17. Moderation-log retention.
18. General information-request deadline.
19. Dono refund-decision deadline.
20. Non-refund moderation appeal deadlines.
21. Evidence visibility and redaction.
22. Whether ongoing three-month fundraising updates are required.
23. Exact donor anonymity visibility.
24. Exact development-office data fields.
25. Institution consent language.
26. Society officer evidence and number of approvers.
27. Treatment of suspended and interrupted students.
28. Final campaign-category list.
29. Insurance.
30. Incorporation timing.
31. Online Safety Act implementation.
32. ICO registration and fee.
33. VAT treatment.
34. FCA perimeter advice.
35. Charity and fundraising-law advice.
36. Consumer-law review.
37. Liability cap and indemnity review.

---

# 36. Recommended next drafting sequence

The most efficient drafting order is:

1. Finalise the payment and Stripe configuration.
2. Decide the fee structure.
3. Decide final permitted campaign categories.
4. Decide the technology and data-retention model.
5. Draft the Verification Policy.
6. Draft the Student Campaign Terms.
7. Draft the Society Campaign Terms.
8. Draft the Donor Terms.
9. Draft the Refund and Dispute Policy.
10. Draft the Community Guidelines.
11. Draft the main Terms of Service.
12. Draft the Privacy Policy.
13. Draft the Cookie Policy after the website stack is known.
14. Have a UK solicitor review the complete suite.
15. Update every document after incorporation or any change of payment model.

---

# 37. Original high-level document map

The original agreed architecture was:

- Terms of Service for all users.
- Student Campaign Terms.
- Donor Terms.
- Privacy Policy.
- Community Guidelines.
- Refund and Dispute Policy.
- Cookie Policy.
- Separate institution agreement for enterprise relationships.

The guiding principle is not to force every operational rule into the main Terms. The main Terms should remain readable, while detailed and frequently changing rules sit in incorporated policies.

---

# 38. Change-control note

This file reflects the model as discussed on 20 July 2026. Before relying on it in a later conversation, check whether any of the following have changed:

- Dono's legal structure.
- Stripe account type or charge type.
- Merchant-of-record model.
- Refund permissions.
- Fees.
- Campaign categories.
- Data providers.
- Donor-data sharing.
- Institution relationships.
- Comment functionality.
- UK law or regulatory guidance.

Any changed fact should override this file and be recorded in a revised version.
