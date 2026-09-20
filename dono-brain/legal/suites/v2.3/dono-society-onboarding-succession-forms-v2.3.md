> ## v2.3 AMENDMENT BLOCK — READ FIRST
>
> **Version 2.3 — 6 August 2026.** This document is carried forward from v2.2 with the amendments below.
> **Where anything in the body of this document conflicts with this block, this block prevails.** The v2.2 text is retained beneath so that the reasoning and evidence are not lost.
>
> **Amendments applying to this document (Society Onboarding and Succession Forms):**
>
> 1. **Terminology.** 'Society Representative' becomes **'Responsible Representative'** throughout.
> 2. **Contracting model changed.** The forms must reflect Society Campaign Terms clause 1: where the Society is unincorporated, **the Responsible Representative is the contracting party**, contracting on the Society's behalf, and holds or controls the Connected Account **for the Society and not personally**. **Delete every provision under which the representative automatically accepts all of the Society's obligations personally.**
> 3. **Add a prominent limited-recourse disclosure to the onboarding form**, in plain words, before acceptance: *'Because your society is not a separate legal entity, you are the person contracting with Dono on its behalf. Dono limits what it can claim from you personally to the money in the Stripe account you control for the society — unless you act dishonestly, deliberately misuse funds, or say you have authority when you do not.'* **Acceptance must be a separate, active tick, recorded with the version and timestamp**, because this term is onerous and must be brought to the representative's attention to be incorporated.
> 4. **Remove the £2,500 / £10,000 authority bands.** Replace with the confirmation in Society Campaign Terms clause 2.2 — that **every approval required by the Society's own constitution, governing rules, bank mandate and any Students' Union or institutional requirement has been obtained.** Any Dono threshold is an internal risk control for deciding when to ask for documentary evidence, and is not stated on the form as a legal requirement.
> 5. **Replacement-account succession.** A Society must always have a current Responsible Representative. On a verified change or authority dispute, suspend new Campaigns and Donations. The successor completes fresh Dono and Payment Provider onboarding and opens a new Connected Account; future Donations use it. **Never describe or implement a transfer of a Stripe account or balance.** Historic funds and transactions stay with the outgoing account holder, who must account to the Society and remains responsible for refunds, disputes and records from their period. Dono may preserve and provide records, restrict the outgoing person and make a proportionate referral, but does not move money, reimburse the Society or guarantee recovery.
> 6. **Delete every reference to student cards, student-card images and student numbers.** The only eligibility check is university-email verification.
> 7. **Delete every reference to a registered charity holding the Connected Account or funded property for a Society** — that structure is prohibited by Terms of Service clause 8.4 and Society Campaign Terms clause 3.3.
> 8. **Delete any consent form relating to institutional data sharing.** No such feature exists (Privacy Notice clause 9.4).
> 9. **Creator age and address.** The incoming Responsible Representative must pass the Payment Provider's verified-DOB final age gate, provide a valid UK address and satisfy UK Connected Account onboarding. Current enrolment, not physical presence in the UK, determines student eligibility.
> 10. **Checkout age and fee copy.** Donors must actively confirm they are 18 or over and have legal capacity; parent/guardian permission is not an alternative. The demo fee is 2% + 20p, borne by the Society unless the Donor actively covers it, and displayed as **“Payment processing fee (Dono)”**. Never say fee cover makes the full intended contribution reach the Campaign, because the Connected Account still bears Stripe's cost.
>
> **Do not implement the carried-forward v2.2 form text below.** It is drafting history. Engineers use the consolidated specifications in `engineering/legal-launch/`; legal/operations must issue clean replacement forms before launch.

---
# Society Onboarding, Succession & Checkout Consent Forms

**Version:** Working draft v2.2 — 31 July 2026
**Status:** DRAFT — NOT FOR PUBLICATION. Internal form specifications supporting the Society Campaign Terms and the Terms of Service (clauses 2.2, 6, 11.3, 11.4, 15, 16.4). Flagged items need a decision or solicitor sign-off before build.

## Changes in v2.2

- **The asset-owner field is split into three**, because the Campaign Owner, the holder of the Connected Account and the legal owner of the funded property can be three different people, and the previous single field conflated them.
- The **Secondary Contact** replaces the "secondary representative": one Society Representative approves, one named backup can take over, and the backup is **not** a second approver.
- **The mandatory balance-transfer step is removed** from the succession flow, because the Payment Provider does not support migrating a balance between connected accounts. The flow now reflects what can actually happen.
- The **default account model is the Society's own Connected Account**, matching the build, with the personal-account case marked as exceptional and discouraged.
- The **institution data-sharing consent stays unbuilt**, with the interim default of no sharing.
- A **checkout age confirmation** is required because Donors must be 18 or over; parent/guardian permission is not an alternative.
- The constitutional-approval bands are aligned with the single-approver rule in the Society Campaign Terms.

---

## 8.1 Society Representative onboarding form

Completed by the Society Representative before a Society Campaign can be created, alongside the identity and student-status checks required under clause 6 of the Terms of Service.

**Fields captured:**

1. Full name
2. University email address (must be valid at the Recognised Institution — clause 6.1)
3. Role held within the Society (President, Treasurer, Secretary, or other named office)
4. Society name and Recognised Institution
5. **Authority declaration** — must be actively ticked, never pre-checked:

   > *"I confirm I am authorised under the Society's constitution, or equivalent governing document, to create and operate Campaigns on the Society's behalf, to authorise the receipt of Donations, and to accept the Society Campaign Terms and Refund and Dispute Policy for and on behalf of the Society and its members."*

6. **Personal responsibility acknowledgement** — must be actively ticked. This is the operative part of the officer contracting model and must be shown plainly, not buried:

   > *"I understand that the Society is responsible for complying with these Terms, and that where the Society cannot bear legal responsibility because of its legal status — for example because it is an unincorporated association — **I accept those obligations personally**, to the extent permitted by law."*

7. **Refund and chargeback acknowledgement:**

   > *"I understand that the holder of the Connected Account is responsible for refunds and chargebacks associated with that account, that Dono does not initiate refunds of donations, and that Dono cannot hold or delay a payout."*

8. **Who receives the funds** — the Connected Account holder. One of:
   - **The Society's own Connected Account** *(default — this is how Dono is built, and society officers share access to it)*
   - The College or University, through its own account
   - A registered charity holding funds for the Society
   - **A named office-holder personally** *(exceptional — see the warning below)*

   > **Warning shown when the last option is selected:** *"A balance cannot be moved between Stripe accounts. If you leave office, money already received stays in your account and you remain responsible for dealing with it. Dono strongly recommends a Society-held account and may refuse to publish a Society Campaign on a personal account."*

9. **Ownership Statement** — who will legally own the funded property or output. Free text with examples, plus a warranty:
   - *"Funds and purchased assets will belong to the Oxford Robotics Society."*
   - *"Equipment will become the property of St Peter's College Boat Club."*
   - *"The purchased software licence will belong to the Society."*

   > *"I warrant that this Ownership Statement is accurate and that I have authority to make it."*

10. **Secondary Contact** — name, university email and role of a current officer who can take over as Society Representative if the primary leaves office. **The Secondary Contact is a named backup, not a second approver**, and does not complete verification or Stripe onboarding unless and until they become the Society Representative.

11. **Constitutional-approval evidence, scaled to the funding target.** This is evidence that the **Society** authorised the Campaign under its own rules. It is **not** a second Dono approval — one Society Representative's approval is sufficient for Dono to publish.

    | Funding target | Evidence required |
    |---|---|
    | Under £2,500 | The Society Representative's confirmation that the committee has approved the Campaign |
    | £2,500 – £10,000 | Written confirmation from two current committee officers |
    | Over £10,000 | Formal committee approval — minutes, a written resolution, or equivalent evidence permitted by the Society's constitution |

    Dono may request further evidence at any tier where a Campaign appears unusually risky. **Satisfying these checks does not mean Dono endorses the Campaign or guarantees that the Society has complied with its own constitution.** **[CONFIRM — these bands are a commercial risk decision, not a legal requirement. Sign off the figures before publication, and keep them distinct from the financial-crime thresholds in the Financial Crime & Payments Policy, which serve a different purpose.]**

**Record-keeping.** Each submission is stored as a durable copy — submitter, role, Society, Campaign where known, document identifiers and versions accepted, the exact wording shown, and the timestamp — consistent with clause 2.2 of the Terms of Service. **[ENGINEERING — BUILD REQUIRED: the wording shown is not currently stored.]**

---

## 8.2 Succession form

Captures the Society Representative and the Secondary Contact at Campaign setup, and governs what happens when the Society Representative changes.

**At setup:** Society Representative (name, university email, role) and Secondary Contact (name, university email, role).

### Change-of-representative flow

Triggered when the Society Representative steps down, graduates or is replaced.

**Step 1 — Verify the incoming representative.** They complete the same checks as onboarding: valid university email, student-card check, current student status, the authority declaration and the personal responsibility acknowledgement in 8.1.

**Step 2 — Committee confirmation.** The Society confirms the change was made in line with its constitution, using an evidence hierarchy rather than one mandatory form — many student societies operate informally, and requiring minutes in every case would exclude legitimate changes without materially improving protection:

- **Preferred:** approved committee minutes or a written committee resolution.
- **Alternative:** written confirmation from two current officers, one of whom should ordinarily be the president, chair, treasurer or secretary.
- **Officer-transition fallback:** confirmation from the outgoing principal officer and one current or incoming officer — used only where Dono can verify both individuals' roles. This should not become the standard route.
- **Exceptional fallback:** another form of evidence Dono accepts following manual review.

Each signatory confirms: their name and committee role; that the Society has approved the change; the funding target and intended use of the Campaign; who is authorised to operate the connected Stripe account; that the change does not conflict with the Society's constitution or any known institutional rules; and that the Society will tell Dono if approval is withdrawn or the authorised officers change again.

**Step 3 — The Connected Account.**

- **Where the Society, College, University or a charity holds the account (the default):** nothing moves. The Recipient does not change, no funds are transferred, and the change is simply a change of who is authorised to act. **Confirm the account holder is unchanged and that the incoming representative has been given access by the Society.**
- **Where a named individual holds the account (exceptional):** the incoming representative completes their own Stripe Connect onboarding and identity verification before the change takes effect.

**Step 4 — Funds already received.** Record the balance at the point of handover.

> **A balance cannot be migrated between connected accounts.** The Payment Provider does not support moving a balance from one connected account to another, and creating a new account does not move anything. Where a personal Connected Account is being replaced, **funds already received stay in the outgoing representative's account** and must be dealt with by them under the Campaign Terms — spent on the campaign purpose, or refunded. Any transfer of money between the outgoing and incoming representative is a matter between them and the Society, outside Dono and outside the Payment Provider. **Dono does not require, arrange, supervise or guarantee it, and must not describe it as a step in its own process.**

The Campaign is **paused to new Donations** while steps 1–3 complete, so that new money does not arrive into an account that is about to be superseded.

**Step 5 — Complete.** The incoming representative becomes the Society Representative and the Campaign resumes. A new Secondary Contact is nominated. The outgoing representative **remains responsible for every transaction processed through their Connected Account before the change**, including refunds and chargebacks, and remains bound by the personal responsibility acknowledgement in 8.1.

**Record-keeping.** Each change is logged with the date, the outgoing and incoming representative, the evidence reviewed at step 2, the balance recorded at step 4, and confirmation that step 3 was completed or was not needed and why.

---

## 8.3 Checkout consent and confirmation capture

Each of the following is a **separate, specific choice**. None may be bundled with another or with acceptance of the Donor Terms. For each, Dono stores the exact wording displayed, a version identifier for that wording, and the timestamp, tied to the specific Donation.

**1. Age confirmation.**

> *"I confirm that I am 18 years of age or older and have the legal capacity to enter into this agreement."*

Must be actively confirmed. This is a **declaration, not a verified check**, and no Dono document may describe it as age verification. It is required for every Donation, including guest Donations. Credible evidence that the Donor was under 18 is an objective refund ground requiring no proof of materiality, reliance or causation.

**2. Fee cover.**

> *"Cover Dono's [2% + 20p demo / 5% + 20p production] fee"*

Unticked by default; charged only if the Donor actively selects it. The Campaign Owner remains Dono's customer in every case. Fee cover offsets only Dono's applicable fee and does not cover the Payment Provider's actual processing cost, so checkout must never say it makes the full intended amount reach the Campaign.

**3. Hide my name.**

> *"Hide my name"*

Not labelled "anonymous". Shown at the point of selection:

> *"This hides your name on Dono's public pages. Your donation amount is still shown. It does not hide information Stripe gives to the person or society receiving the money — because your payment goes straight to their own Stripe account, they may be able to see your name there. Dono will not tell them who you are, and our Terms prohibit them from using payment information to contact you."*

**4. Institution data-sharing consent — do not build until the data flow is defined.**

A vague or unused consent checkbox creates compliance risk and may mislead donors into thinking an institution is formally involved in the Campaign. **Interim default: Dono shares no identifiable donor information with any university, college or institution.**

Before this is built, Dono must decide and record: whether the feature is genuinely required and for what purpose; **which specific institution** can receive data; exactly what fields are shared; **that donors who hid their name are excluded**; what the institution may use the data for and that it becomes an independent controller for that use; and how consent is withdrawn — with withdrawal stopping future sharing but not reversing what was lawfully disclosed. A **written data-sharing agreement must be executed with the institution, and its privacy notice must be available to show the donor before they consent.**

Once defined, the checkbox must be optional, unticked by default, separate from accepting Dono's Terms, and specific about the recipient and purpose. It must not bundle in marketing or general alumni communications. Dono may still provide genuinely anonymised or aggregate campaign statistics, provided individuals cannot reasonably be identified — and no such reporting exists today either.

**5. Marketing consent.**

A separate, specific opt-in for Dono to contact the Donor about future campaigns or updates. Unticked by default, independent of item 4. Where an Institution wishes to send marketing, that requires its own separate consent and is not covered by this one.

**Storage requirement.** Each of the five choices above is recorded **independently**, even where a Donor makes several at once, so that a later change to one item's wording does not retroactively affect the record of what an earlier Donor actually saw and agreed to. **[ENGINEERING — BUILD REQUIRED: consent records currently store the choice only, without the wording shown, a version identifier or a timestamp.]**


---

## Approval and version control (v2.3)

| Field | Entry |
|---|---|
| Version | 2.3 |
| Version date | 6 August 2026 |
| Accountable owner | Amrit Kaur Rooprai |
| Reviewed by / Approved by | *(to be completed)* |
| Status | Carried forward from v2.2 and amended by the v2.3 amendment block at the top of this document, which takes precedence over anything below it |
| Next scheduled review | 6 February 2027 |
| Supersedes | The corresponding document in `terms_v2.2/`, which is retained unaltered as the historical baseline |
