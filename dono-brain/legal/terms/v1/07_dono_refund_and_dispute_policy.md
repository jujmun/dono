# Dono Refund and Dispute Policy

**Version:** Working draft v0.1 — 24 July 2026
**Status:** DRAFT — NOT FOR PUBLICATION. This draft contains unresolved markers ([TO BE CONFIRMED BEFORE LAUNCH], [SUBJECT TO STRIPE CONFIGURATION], [COUNSEL REVIEW REQUIRED], [ACCOUNTANT REVIEW REQUIRED], [PRIVACY IMPLEMENTATION REQUIRED]). No document may be published while any marker remains. This draft is not legal advice and requires review by a UK solicitor before use.

**Incorporated into:** the Dono Terms of Service, clause 1.6.

---

## 1. Read this first

1.1 Dono does not hold your money. When you donate, your payment goes directly to the Campaign Owner's own Stripe connected account. Dono takes a platform fee and never receives, holds or controls the donation itself.

1.2 This has a consequence you must understand before donating: **Dono can decide that a refund is owed, but Dono cannot force one to happen.** A refund is executed by the Campaign Owner from their own Stripe account. Where a Campaign Owner refuses, or has spent the money, Dono has sanctions and escalation routes but no power to take money back.

1.3 **Dono never pays refunds out of its own funds.**

1.4 Nothing in this Policy removes your statutory rights, your rights against your card issuer, or your rights under Stripe's terms.

---

## 2. Two different processes

2.1 There are two entirely separate routes, and they work differently:

| | **Refund request** | **Chargeback** |
|---|---|---|
| You go to | Dono | Your bank or card issuer |
| Decided by | Dono | Your card issuer, under Visa/Mastercard rules |
| Dono's role | Investigator and adjudicator | Evidence supplier only |
| Can Dono stop it? | Not applicable | No |
| Who bears the loss | The Campaign Owner, who executes the refund | The Campaign Owner, whose Stripe account is debited |

2.2 You may use either. Using Dono's process first is usually faster and does not prevent you from raising a chargeback afterwards. Note that Dono's decision deadline in clause 5 is up to 30 days, which may consume part of your card issuer's chargeback window — if timing matters to you, check your issuer's deadlines.

2.3 Chargebacks should be used for fraud, unauthorised payments or material misconduct, not for dissatisfaction. Dishonest use of either process is a breach of the Terms of Service.

---

## 3. Grounds for a refund

3.1 Dono may approve a refund on grounds including:

(a) duplicate payment;
(b) payment error;
(c) unauthorised payment;
(d) cancellation of the Campaign;
(e) material misrepresentation on the Campaign page;
(f) fraud;
(g) misuse of funds;
(h) failure to provide required evidence of expenditure;
(i) a Material Change made without authorisation;
(j) inability to use the money meaningfully for the stated campaign purpose;
(k) failure to proceed with the Project in circumstances where the funds should therefore be returned; or
(l) failure or withdrawal of a Student Status Check.

3.2 The following are **not** grounds for a refund on their own: disappointment with the outcome; a Project that was attempted honestly but did not succeed; minor deviations from the stated plan; a change of mind; or the Campaign not reaching its funding target where the Campaign Owner can still use the money meaningfully for the stated purpose.

3.3 Campaigns describe the **intended** use of funds. They are not promises of a result.

---

## 4. Time limits

4.1 An ordinary refund request must be made:

(a) within **60 days** after the Campaign End Date; or
(b) within **60 days** after you became aware of the matter complained of, if that is later.

4.2 A request based on fraud or deliberate material misrepresentation may be made up to **12 months** after the Donation.

4.3 A Campaign Owner has **five working days** to respond to a request.

4.4 An appeal must be brought within **ten working days** of the decision.

---

## 5. How Dono decides

### 5.1 Submitting a request

5.1.1 Refund requests are submitted through the Platform, giving a reason from the structured list and any supporting material.

### 5.2 Evidence

5.2.1 Either party may submit receipts, photographs, purchase records, financial records, Campaign updates, communications, links or pricing sources, and any other relevant material.

5.2.2 Dono will also draw on its own records, including the version of the Campaign page as it appeared at the time of your Donation, the record of your acceptance of these terms, and the Campaign Owner's uploaded evidence and updates.

### 5.3 What the Campaign Owner sees

5.3.1 The Campaign Owner is told the substance of the allegation and is shown the evidence relied on. A person cannot fairly answer a case within five working days without knowing what it is.

5.3.2 **The Donor's identity is withheld from the Campaign Owner by default** where the Donor donated publicly anonymously or asks for their identity to be withheld. Dono may disclose the Donor's identity where it is genuinely necessary to allow the Campaign Owner to answer the allegation, and will record its reasons for doing so.

### 5.4 Decision

5.4.1 Dono will aim to decide within **30 calendar days** of receiving a complete request. Complex or contested cases may take longer, and Dono will say so.

5.4.2 Dono may decide on no refund, a partial refund, or a full refund.

5.4.3 Both parties are given the outcome and the reasons for it.

### 5.5 Appeal

5.5.1 Either party may appeal within ten working days. The appeal is reviewed by a different administrator where reasonably practicable.

5.5.2 The appeal decision is Dono's final internal decision. It does not affect your statutory, card-issuer or legal rights.

---

## 6. How an approved refund is actually paid

6.1 **The Campaign Owner executes the refund from their own Stripe dashboard.** Dono does not process the refund and does not initiate it through Stripe's API.

6.2 This is deliberate. Dono deciding a refund is owed is a platform function. Dono reaching into a Campaign Owner's payment account and moving their money is a different activity, and one that would raise questions about whether Dono is controlling payment transactions rather than merely hosting a platform. Dono stays on the platform side of that line.

> **Internal note (remove before publication):** this reverses §21.5 of `legal-terms-context-handoff.md`, which contemplated Campaign Owners contractually authorising Dono to initiate refunds. It follows `dono-brain/engineering/payments-architecture.md` §5, which rules API-authorised refunds out of v1 pending specialist advice. The handoff should be updated. **[COUNSEL REVIEW REQUIRED — FCA perimeter]**

6.3 A Campaign Owner who is notified of an approved refund is contractually obliged to execute it promptly. Failure to do so is a breach of the Student Campaign Terms or Society Campaign Terms.

6.4 A refund may be delayed or may fail where the Connected Account holds insufficient funds. Dono does not make up the difference.

---

## 7. If the Campaign Owner does not cooperate

7.1 Where an approved refund is not executed, Dono may, in escalating order:

(a) suspend or remove the Campaign, and suspend or permanently ban the account;
(b) prevent the person from fundraising on Dono in future;
(c) escalate the matter to the Recognised Institution through Dono's institutional contact channel, and record that correspondence;
(d) support you in pursuing a chargeback through your bank, by assembling the relevant evidence in your favour;
(e) report suspected fraud to the police or another authority; and
(f) share relevant identity information with you, where lawful and reasonably necessary, so that you can pursue your own remedies.

7.2 Dono does not pursue debt collection on your behalf and does not guarantee that you will recover your money. The Campaign Owner remains contractually liable to you.

---

## 8. Chargebacks

8.1 A chargeback is decided by your card issuer under payment-network rules. Neither Dono nor Stripe makes the substantive decision, and Dono cannot prevent or reverse one.

8.2 The Connected Account bears the chargeback and its consequences. Dono's platform settings are configured so that connected accounts, not Dono, are responsible for negative balances. **[SUBJECT TO STRIPE CONFIGURATION — confirm the negative-balance and losses-coverage settings on the platform account, and confirm the position in the Stripe Connected Account Agreement and Platform Agreement, before publication]**

8.3 Where a chargeback follows a refund request that Dono rejected, Dono assembles and submits the defence evidence package on the Campaign Owner's behalf. Dono assists; it does not decide.

8.4 Who submits dispute evidence to Stripe, and who pays Stripe's dispute fees, is **[SUBJECT TO STRIPE CONFIGURATION]**.

---

## 9. Fees on a refund

9.1 The general principle is that **the party at fault bears Dono's fee.**

9.2 Applying that:

(a) where a Campaign cannot proceed because it did not raise enough, Dono refunds its own fee, but Stripe's processing fee is not refunded;
(b) where the Campaign Owner caused the refund through mistake, breach or misrepresentation, the Donor receives Dono's fee back and the Campaign Owner bears the economic cost, so far as this is technically possible;
(c) where the Donor caused the refund through their own error, the Donor bears Dono's fee, which is not refunded;
(d) on a partial refund, Dono's fee may be refunded proportionately where the Donor was not at fault.

9.3 Where a Donor chose to cover fees at checkout, the fee-cover amount is treated the same way as Dono's fee under clause 9.2.

9.4 Whether Dono's application fee can be automatically reversed through Stripe, and what Stripe can technically reverse in each case, is **[SUBJECT TO STRIPE CONFIGURATION]**. The published version of this clause must state clearly and separately: what the Donor actually receives; who bears the economic cost; and what Stripe can technically reverse.

---

## 10. Failed, cancelled and partially funded Campaigns

10.1 **Partial funding.** Not reaching the target does not automatically cancel a Project. The Campaign Owner decides whether the Project can still proceed meaningfully on the amount raised. If it can, it proceeds. If it cannot, the Campaign Owner must arrange refunds.

10.2 **Cancellation.** Where a Campaign is cancelled before the money is spent, the funds must be refunded.

10.3 **Surplus funds.** Funds may be moved between verified line items and used for reasonable additional expenditure directly advancing the stated campaign purpose. Any amount that cannot reasonably be used for that purpose must be refunded.

10.4 **How surplus is refunded.** Because refunding a small surplus proportionately across every Donor is often impracticable, surplus is refunded in **reverse chronological order**: the most recent Donor is refunded first, up to the amount they donated; then the next most recent; and so on until the surplus is exhausted.

10.5 The consequence of clause 10.4 is that **surplus is not shared proportionately, and no Donor is guaranteed a share of it.** This is disclosed at checkout before you donate.

10.6 There is currently no minimum threshold below which surplus need not be refunded. Stripe and fee consequences of small refunds are **[SUBJECT TO STRIPE CONFIGURATION]**.

---

## 11. Evidence of expenditure

11.1 Campaign Owners must declare when they expect to make purchases, upload receipts or other evidence within **14 days** of expenditure, and provide an outcome update approximately **three months** after expenditure.

11.2 Campaign Owners set their own progress milestones, subject to a minimum of one milestone for every three months of active fundraising. Milestones are fixed on approval of the Campaign and may only be changed with Dono's approval.

11.3 Receipts published on a Campaign page must be **redacted by the Campaign Owner before upload**, following the redaction checklist shown at the point of upload. Dono reviews the first receipt uploaded by any Campaign Owner before publication, and samples thereafter. Unredacted originals are held privately by Dono and are never published. Receipts naming third parties must be sent to Dono privately rather than published.

11.4 Failure to provide evidence is a ground for a refund under clause 3.1(h) and for enforcement action under the Terms of Service.

---

## 12. Records

12.1 Dono retains refund and dispute records — including requests, evidence, decisions, reasons, appeals and escalation history — for **six years**, reflecting the limitation period for contract claims in England and Wales. See the Privacy Policy for the full retention position.

---

## 13. Contact

Refund requests are submitted through the Platform. Complaints about this Policy or how it has been applied: **dono.outreach@gmail.com**

Dono is a trading name operated by Amrit Kaur Rooprai, a sole trader.
UK business address: **[TO BE INSERTED BEFORE LAUNCH]**

**[COUNSEL REVIEW REQUIRED — consumer-law review of this Policy as a whole, including whether Donors are consumers, the characterisation of a Donation, and the fairness of clauses 1.2, 3.2, 7.2, 10.4 and 10.5 against the Consumer Rights Act 2015]**
