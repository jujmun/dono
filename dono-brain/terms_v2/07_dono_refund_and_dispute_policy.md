# Dono Refund and Dispute Policy

**Version:** Working draft v0.2 — 29 July 2026
**Status:** DRAFT — NOT FOR PUBLICATION. This draft contains unresolved markers ([DEVELOPER INPUT REQUIRED], [SUBJECT TO STRIPE CONFIGURATION], [COUNSEL REVIEW REQUIRED], [ACCOUNTANT REVIEW REQUIRED]). No document may be published while any marker remains. This draft is not legal advice and requires review by a UK solicitor before use.

**Incorporated into:** the Dono Terms of Service, clause 1.6.

> **Changes in v0.2:** decision deadline set at 21 calendar days; fee treatment restated with actual figures; receipts made private to Dono with a redaction requirement and a public evidence status; Closure Statement added; the reserve authorisation for Dono-initiated refunds explained; anonymity in disputes aligned to the single-control model; business address inserted.

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

2.2 You may use either. Using Dono's process first is usually faster and does not prevent you from raising a chargeback afterwards. Note that Dono's decision target in clause 5 is 21 calendar days, which may consume part of your card issuer's chargeback window — if timing matters to you, check your issuer's deadlines.

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
(k) failure to proceed with the Project in circumstances where the funds should therefore be returned;
(l) failure or withdrawal of a Student Status Check; or
(m) failure to publish a Closure Statement after reminders.

3.2 The following are **not** grounds for a refund on their own: disappointment with the outcome; a Project that was attempted honestly but did not succeed; minor deviations from the stated plan; a change of mind; or the Campaign not reaching its funding target where the Campaign Owner can still use the money meaningfully for the stated purpose.

3.3 Campaigns describe the **intended** use of funds. They are not promises of a result.

---

## 4. Time limits

4.1 An ordinary refund request must be made:

(a) within **60 days** after the Campaign End Date; or
(b) within **60 days** after you became aware of the matter complained of, if that is later.

4.2 A request based on fraud or deliberate material misrepresentation may be made up to **12 months** after the Donation.

4.3 A Campaign Owner has **five working days** to respond to a request.

4.4 An appeal must be brought within **ten working days** of the decision. The same deadline applies to appeals against moderation decisions under the Community Guidelines and against refusal or withdrawal of a Student Status Check under the Verification Policy.

---

## 5. How Dono decides

### 5.1 Submitting a request

5.1.1 Refund requests are submitted through the Platform, giving a reason from the structured list and any supporting material.

### 5.2 Evidence

5.2.1 Either party may submit receipts, photographs, purchase records, financial records, Campaign updates, communications, links or pricing sources, and any other relevant material.

5.2.2 Dono will also draw on its own records, including the version of the Campaign page as it appeared at the time of your Donation, the record of your acceptance of these terms, the Campaign Owner's privately submitted evidence of expenditure, and their published updates and Closure Statement.

### 5.3 What the Campaign Owner sees

5.3.1 The Campaign Owner is told the substance of the allegation and is shown the evidence relied on. A person cannot fairly answer a case within five working days without knowing what it is.

5.3.2 **The Donor's identity is withheld from the Campaign Owner** where the Donor donated anonymously or asks for their identity to be withheld. On Dono, an anonymous Donation is hidden from the Campaign Owner as well as from the public, so in the ordinary case the Campaign Owner does not know who the Donor is. Dono may disclose the Donor's identity where it is genuinely necessary to allow the Campaign Owner to answer the allegation, and will record its reasons for doing so.

### 5.4 Decision

5.4.1 Dono will aim to decide within **21 calendar days** of receiving a complete request. Complex or contested cases may take longer, and Dono will say so.

5.4.2 Dono may decide on no refund, a partial refund, or a full refund.

5.4.3 Both parties are given the outcome and the reasons for it.

### 5.5 Appeal

5.5.1 Either party may appeal within ten working days. The appeal is reviewed by a different administrator where reasonably practicable.

5.5.2 The appeal decision is Dono's final internal decision. It does not affect your statutory, card-issuer or legal rights.

---

## 6. How an approved refund is actually paid

6.1 **The Campaign Owner executes the refund from their own Stripe dashboard.** Dono does not process the refund and does not initiate it through Stripe's API.

6.2 This is deliberate. Dono deciding a refund is owed is a platform function. Dono reaching into a Campaign Owner's payment account and moving their money is a different activity, and one that would raise questions about whether Dono is controlling payment transactions rather than merely hosting a platform. Dono stays on the platform side of that line.

6.3 **Reserve authorisation.** Clause 11.3 of the Student Campaign Terms and clause 4.3 of the Society Campaign Terms contain a contractual authorisation permitting Dono to initiate an approved refund as a last resort. **That authorisation is drafted but dormant.** Dono will not exercise it unless and until:

(a) specialist advice confirms that exercising it would not bring Dono within the Payment Services Regulations 2017; and
(b) the Payment Provider confirms that the power is technically available on Standard connected accounts.

Dono will update this Policy and notify Campaign Owners before it begins to exercise the authorisation. **[COUNSEL REVIEW REQUIRED — FCA perimeter]** **[SUBJECT TO STRIPE CONFIGURATION]**

> **Internal note (remove before publication):** clauses 6.1 to 6.3 depart from §21.5 of `legal-terms-context-handoff.md`, which contemplated Dono initiating refunds in v1. They follow `dono-brain/engineering/payments-architecture.md` §5, which rules API-authorised refunds out of v1 pending specialist advice. **The handoff file should be corrected.** The authorisation is retained in the Campaign Terms so that the power can be switched on without re-contracting, once counsel clears it.

6.4 A Campaign Owner who is notified of an approved refund is contractually obliged to execute it promptly. Failure to do so is a breach of the Student Campaign Terms or Society Campaign Terms and a ground for enforcement action under Part 10 of the Terms of Service.

6.5 A refund may be delayed or may fail where the Connected Account holds insufficient funds. Dono does not make up the difference.

6.6 **Refunds and exchange rates.** All Donations are in pounds sterling. A refund returns the sterling amount donated. Where a Donor's card was issued outside the United Kingdom, their card issuer converts that amount back at the rate applying on the day of the refund, so the sum received in the Donor's own currency may differ slightly from the sum originally paid. Neither Dono nor the Campaign Owner controls that rate, and neither makes up any difference.

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

8.2 The Connected Account bears the chargeback and its consequences. Dono's platform settings are intended to be configured so that connected accounts, not Dono, are responsible for negative balances. **[SUBJECT TO STRIPE CONFIGURATION — confirm the negative-balance and losses-coverage settings on the platform account, and confirm the position in the Stripe Connected Account Agreement and Platform Agreement, before publication]**

8.3 Where a chargeback follows a refund request that Dono rejected, Dono assembles and submits the defence evidence package on the Campaign Owner's behalf. Dono assists; it does not decide.

8.4 Who submits dispute evidence to Stripe, and who pays Stripe's dispute fees, is **[SUBJECT TO STRIPE CONFIGURATION]**.

---

## 9. Fees on a refund

9.1 Dono's platform fee is **5% of the Donation plus 20 pence**. Dono is not registered for VAT, so no VAT is charged on it. The Payment Provider charges its own processing fees separately, and an additional amount (currently 2%) applies to non-UK cards, which is passed through to the Donor.

9.2 The general principle is that **the party at fault bears Dono's fee.**

9.3 Applying that:

(a) where a Campaign cannot proceed because it did not raise enough, Dono refunds its own fee, but the Payment Provider's processing fee is not refunded;
(b) where the Campaign Owner caused the refund through mistake, breach or misrepresentation, the Donor receives Dono's fee back and the Campaign Owner bears the economic cost, so far as this is technically possible;
(c) where the Donor caused the refund through their own error, the Donor bears Dono's fee, which is not refunded;
(d) on a partial refund, Dono's fee may be refunded proportionately where the Donor was not at fault.

9.4 Where a Donor chose to cover fees at checkout, the fee-cover amount is treated the same way as Dono's fee under clause 9.3.

9.5 The non-UK card cost under clause 9.1 is charged by the Payment Provider and is not refunded by Dono.

9.6 Whether Dono's application fee can be automatically reversed through Stripe, and what Stripe can technically reverse in each case, is **[SUBJECT TO STRIPE CONFIGURATION]**. The published version of this clause must state clearly and separately: what the Donor actually receives; who bears the economic cost; and what Stripe can technically reverse.

---

## 10. Failed, cancelled and partially funded Campaigns

10.1 **Partial funding.** Not reaching the target does not automatically cancel a Project. The Campaign Owner decides whether the Project can still proceed meaningfully on the amount raised. If it can, it proceeds. If it cannot, the Campaign Owner must arrange refunds.

10.2 **Cancellation.** Where a Campaign is cancelled before the money is spent, the funds must be refunded.

10.3 **Surplus funds.** Funds may be moved between verified line items and used for reasonable additional expenditure directly advancing the stated campaign purpose. Any amount that cannot reasonably be used for that purpose must be refunded.

10.4 **How surplus is refunded.** Because refunding a small surplus proportionately across every Donor is often impracticable, surplus is refunded in **reverse chronological order**: the most recent Donor is refunded first, up to the amount they donated; then the next most recent; and so on until the surplus is exhausted.

10.5 The consequence of clause 10.4 is that **surplus is not shared proportionately, and no Donor is guaranteed a share of it.** This is disclosed at checkout before you donate.

10.6 There is currently no minimum threshold below which surplus need not be refunded. Stripe and fee consequences of small refunds are **[SUBJECT TO STRIPE CONFIGURATION]** — note in particular that the 20 pence fixed component of Dono's fee, and the Payment Provider's per-transaction charges, may make very small refunds uneconomic to process.

---

## 11. Evidence of expenditure, updates and closure

11.1 Campaign Owners must declare when they expect to make purchases, submit receipts or other evidence to Dono within **14 days** of expenditure, and provide an outcome update approximately **three months** after expenditure.

11.2 Campaign Owners set their own progress milestones, subject to a minimum of one milestone for every three months of active fundraising. Milestones are fixed on approval of the Campaign and may only be changed with Dono's approval.

11.3 **Evidence is private.** Receipts and evidence are submitted to Dono privately. They are **not published on the campaign page and are not shown to Donors.** Receipts routinely contain personal information about the Campaign Owner and about third parties, and publishing them would create privacy risks out of proportion to the benefit.

11.4 **Redaction before submission.** Before submitting evidence, a Campaign Owner must remove: full payment card numbers, card security codes and full bank account or sort code details; the names, addresses and contact details of any third party who is not a supplier acting in the course of business; information relating to any purchase that is not part of the Campaign but appears on the same document; and any special category information belonging to anyone, unless inherent in the campaign purpose. Supplier names, item descriptions, prices, dates, order references and VAT details must **not** be redacted, because Dono needs them to review expenditure against the budget.

11.5 **What Donors see.** The campaign page displays a factual evidence status: *evidence of expenditure received and reviewed*, *evidence outstanding*, or *evidence overdue*. The first means only that Dono has received evidence for the declared expenditure and has reviewed it against the stated budget. It is **not** a statement by Dono that the money was spent properly, that goods were delivered, that a price was reasonable, or that any document is authentic.

11.6 **Closure Statement.** Every Campaign must be concluded by a Closure Statement published on the campaign page, setting out what was done, what was spent, and the final position on any unspent funds. This is mandatory. Acceptance of the Closure Statement ends the Campaign Owner's update obligations; evidence, refund, cooperation and investigation obligations continue.

11.7 Failure to provide evidence is a ground for a refund under clause 3.1(h), and failure to publish a Closure Statement is a ground under clause 3.1(m). Both are also grounds for enforcement action under the Terms of Service.

---

## 12. Records

12.1 Dono retains refund and dispute records — including requests, evidence, decisions, reasons, appeals and escalation history — for **six years**, reflecting the limitation period for contract claims in England and Wales. Receipts and evidence of expenditure are retained for the same period. See the Privacy Policy for the full retention position.

---

## 13. Contact

Refund requests are submitted through the Platform. Complaints about this Policy or how it has been applied: **dono.outreach@gmail.com**

Dono is a trading name operated by Amrit Kaur Rooprai, a sole trader.
UK business address: **37 St Giles', Oxford OX1 3LD**

**[COUNSEL REVIEW REQUIRED — consumer-law review of this Policy as a whole, including whether Donors are consumers, the characterisation of a Donation, and the fairness of clauses 1.2, 3.2, 7.2, 10.4 and 10.5 against the Consumer Rights Act 2015]**
