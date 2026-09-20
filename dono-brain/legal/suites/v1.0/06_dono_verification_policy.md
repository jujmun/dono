# Dono Verification Policy

**Version:** Working draft v0.1 — 24 July 2026
**Status:** DRAFT — NOT FOR PUBLICATION. This draft contains unresolved markers ([TO BE CONFIRMED BEFORE LAUNCH], [SUBJECT TO STRIPE CONFIGURATION], [COUNSEL REVIEW REQUIRED], [ACCOUNTANT REVIEW REQUIRED], [PRIVACY IMPLEMENTATION REQUIRED]). No document may be published while any marker remains. This draft is not legal advice and requires review by a UK solicitor before use.

**Incorporated into:** the Dono Terms of Service, clause 1.6.

---

## 1. Purpose of this Policy

1.1 This Policy explains exactly what Dono checks, what Dono does not check, what other parties check, and what each label displayed on the Platform means.

1.2 It exists because the word "verified" means very different things to different people. Nothing on the Platform should lead a Donor to believe that Dono has confirmed more than it actually has.

1.3 In this Policy, capitalised terms have the meanings given in clause 2 of the Terms of Service.

---

## 2. The four separate checks

2.1 Four distinct and independent things may happen in relation to a Campaign. They are performed by different parties, at different times, for different purposes, and none of them implies any of the others:

| Check | Performed by | What it establishes |
|---|---|---|
| Student Status Check | Dono | That the person appears to be a currently enrolled student at a Recognised Institution |
| Identity and KYC checks | Stripe | Stripe's own identity, anti-money-laundering and account-eligibility requirements, under Stripe's terms |
| Society approval | The Society | That the Society has approved the Campaign for presentation as a Society Campaign |
| Institutional endorsement | The Institution | That the Institution has expressly endorsed the specific Campaign |

2.2 A Campaign may have all four, some, or only one.

---

## 3. The Student Status Check

### 3.1 What we ask for

3.1.1 To complete a Student Status Check, an applicant must provide:

(a) a valid university email address at a Recognised Institution;
(b) an image of a current student card;
(c) their full name;
(d) their declared date of birth;
(e) their institution and, where applicable, college;
(f) their course;
(g) their student number;
(h) the expiry date shown on the student card; and
(i) their expected graduation or departure date.

### 3.2 What we do with it

3.2.1 A Dono administrator manually reviews the student card image against the information provided and against the university email address.

3.2.2 We aim to complete this review within seven business days. This is a target, not a contractual commitment.

3.2.3 We may ask for further information at any time. You must respond within **five working days** of our request. If you do not, we may suspend your account or your Campaign, or refuse or withdraw a Student Status Check.

3.2.4 We may refuse a Student Status Check without giving detailed reasons where we reasonably suspect fraud, impersonation or attempted circumvention of this Policy.

### 3.3 What the Student Status Check does **not** establish

3.3.1 A completed Student Status Check does **not** mean that Dono has verified, confirmed, endorsed or guaranteed:

(a) that any statement made on the Campaign page is true;
(b) that any document provided is authentic;
(c) that any cost, quotation or price is accurate or reasonable;
(d) that the Project is viable, sensible, lawful in every respect, or capable of being completed;
(e) how the Campaign Owner will behave in future;
(f) that the Campaign Owner will use the money as promised;
(g) that the Institution, or any college, department, supervisor or Society, knows of, approves of or endorses the Campaign; or
(h) that the Campaign will succeed, or that any outcome will be achieved.

3.3.2 Dono cannot verify the full authenticity, accuracy or viability of every Campaign. Donors must form their own judgement about a Campaign before donating.

---

## 4. Stripe's checks

4.1 Every Campaign Owner must complete Stripe's onboarding for a Stripe Connect Standard connected account before a Campaign can receive Donations.

4.2 Stripe conducts its own identity, know-your-customer and account-eligibility checks. Those checks are performed by Stripe, under Stripe's own terms, for Stripe's own purposes. They are not performed for Dono, and Dono does not control them.

4.3 Stripe's checks are **not displayed publicly on Campaign pages**. Dono records internally whether Stripe onboarding is complete, because a Campaign cannot take Donations without it, but does not present this to Donors as a trust signal. Displaying it would suggest to Donors that Stripe has assessed the Campaign, which Stripe has not.

> **Discrepancy note (internal, remove before publication):** `dono-brain/engineering/product-legal-alignment-roadmap.md` currently lists "Stripe Onboarding Completed" and a generic "Verified Student" among the required public badges. Both conflict with this Policy. The roadmap should be corrected before the badge system is built.

4.4 Dono does not receive, and does not store, the documents that Stripe collects during onboarding.

### 4.5 Age

4.5.1 All Users must be at least 18.

4.5.2 Date of birth is declared to Dono by the User. Dono does **not** rely on a student card as proof of age, and does not collect a separate government identity document for age purposes.

4.5.3 Dono intends to rely on Stripe's identity checks as the authoritative confirmation of age eligibility. Whether Stripe reliably returns a sufficient age or date-of-birth signal to the Platform for every onboarding flow is **[TO BE CONFIRMED BEFORE LAUNCH — see the age-verification investigation in the engineering roadmap]**. If it does not, an alternative must be adopted before launch, and this clause rewritten.

---

## 5. Society approval

5.1 A Society Campaign must be approved through the relevant Society page before it becomes publicly visible. No Campaign becomes public automatically.

5.2 Society approval means only this: **the Society has approved the Campaign for presentation as a Society Campaign.**

5.3 Society approval does **not** mean:

(a) that the Institution knows of, approves of or endorses the Campaign;
(b) that the Society has verified the accuracy of the Campaign's contents;
(c) that the Society bears legal responsibility for the Campaign; or
(d) that the Society is a separate legal person. A Society is typically an unincorporated association and typically is not.

5.4 The Society must register at least one named Responsible Individual, who must confirm they have authority to act. Whether two officers should be required to approve a Society Campaign is **[TO BE CONFIRMED BEFORE LAUNCH]**; the present minimum is one.

---

## 6. Institutional endorsement

6.1 The label "Institutionally endorsed" is used **only** where the Recognised Institution has expressly endorsed that specific Campaign.

6.2 It is not applied because a student used a university email address, because the Institution is listed on the Platform, because a Society is associated with the Institution, or because a Campaign mentions the Institution.

6.3 Dono is not operated by, affiliated with, sponsored by or endorsed by any university, college, Society or other institution merely because that organisation is listed on Dono, a student uses its email address, Dono checks a student's status, or a Campaign appears under that organisation's name. Any partnership, affiliation or endorsement must be expressly stated and supported by a written arrangement.

---

## 7. Labels displayed on the Platform

7.1 Dono displays **separate, plainly worded labels**. It does not display a single combined badge, and it does not use an unexplained "Verified" label, because a single badge is read by Donors as confirmation that Dono has checked the Campaign itself.

7.2 The labels that may appear publicly are:

- **Student status checked by Dono** — the check in clause 3 has been completed.
- **Society approved** — the approval in clause 5 has been given.
- **Institutionally endorsed** — the express endorsement in clause 6 has been given.

7.3 Each label links to this Policy.

7.4 The following are recorded internally and are **not** displayed publicly: Stripe onboarding status; the outcome of any investigation; and any internal risk classification.

7.5 No label anywhere on the Platform, and no marketing material, may use language suggesting that Dono guarantees a Campaign, its authenticity, its outcome or the conduct of a Campaign Owner.

---

## 8. Reverification

8.1 Student status is reverified **each October**, or on the expiry date shown on the student card if that falls earlier.

8.2 A User who completed a Student Status Check within the **three months** preceding a scheduled reverification is not reverified until the following cycle.

8.3 While a reverification is pending and within time, a live Campaign continues to run normally and may continue to receive Donations.

8.4 If a User does not respond to a reverification request within five working days, Dono sends a reminder. Continued failure to respond may result in withdrawal of the Student status label, suspension of the Campaign, or suspension of the account.

---

## 9. Loss of student status during a Campaign

9.1 Student status may lapse before a Campaign concludes — through graduation, withdrawal, interruption, suspension, transfer, expiry of leave to remain, or otherwise.

9.2 **No new Campaign may be started within 60 days of the Campaign Owner's expected graduation or departure**, and a Campaign must ordinarily close at least 60 days before that date. This rule is the primary protection against this situation and remains in force.

### 9.3 Individual Campaigns

9.3.1 An individual Campaign **cannot be transferred to another person.** The Connected Account belongs to an individual, the donations already taken sit in that individual's account, and Stripe cannot move charges between connected accounts. A change of Campaign Owner would therefore separate the money and the legal responsibility for it from the person publicly running the Campaign.

9.3.2 Where an individual Campaign Owner loses student status before the Campaign concludes, the Campaign closes to new Donations and any funds not already properly spent on the stated campaign purpose must be refunded in accordance with the Refund and Dispute Policy.

9.3.3 Loss of student status does not extinguish any obligation. The former Campaign Owner remains bound by their refund, evidence, update, cooperation and investigation obligations, and remains the Merchant of Record for Donations already received.

### 9.4 Society Campaigns

9.4.1 Succession is available for Society Campaigns **only where the Society itself holds the Connected Account and the associated bank account.** In that case the Merchant of Record does not change: only the Responsible Individual changes, no funds move, and no liability is split.

9.4.2 Where, under the Society Campaign Terms, a Society Campaign is instead paid into a named student's personal Connected Account because no suitable Society account exists, **succession is not available**, and clause 9.3 applies.

9.4.3 A replacement Responsible Individual must be verified under clause 3, must be appointed before the outgoing Responsible Individual leaves, and must expressly accept the outstanding obligations. Dono may refuse a proposed transfer.

9.4.4 Where the Campaign is fully complete and all obligations have been satisfied, Dono may decide that no transfer is required.

> **Practical check required:** many unincorporated Societies cannot open a business bank account, and therefore cannot hold a Connected Account. If that is the common case rather than the exception, succession will rarely be available in practice and clause 9.4 will do little work. **[TO BE CONFIRMED BEFORE LAUNCH]**

---

## 10. Withdrawal of a label

10.1 Dono may withdraw any label at any time, including where student status lapses or cannot be confirmed, where information provided proves to be inaccurate, where a Society withdraws its approval, where an Institution withdraws its endorsement, where Stripe suspends or closes a Connected Account, or where Dono is investigating the Campaign.

10.2 Withdrawal of a label is not by itself a finding of wrongdoing.

10.3 A decision to refuse or withdraw a Student Status Check may be appealed within **ten working days**, under the appeals process in the Terms of Service. The appeal is reviewed by a different administrator where reasonably practicable.

---

## 11. Reporting

11.1 Any User may report a Campaign they believe to be inaccurate, fraudulent or in breach of the Terms, using the reporting tools on the Platform.

11.2 Dono investigates reports under the Terms of Service and may request information, review evidence, restrict visibility temporarily, refer matters to an Institution, or report suspected crime to the police or another authority.

---

## 12. Contact

Questions about this Policy: **dono.outreach@gmail.com**
Dono is a trading name operated by Amrit Kaur Rooprai, a sole trader.
UK business address: **[TO BE INSERTED BEFORE LAUNCH]**
