# Society Onboarding, Succession and Checkout Consent Forms — Dono

**Document:** Operative form specifications for the Society-only beta
**Version:** 3.0
**Version date:** 7 August 2026
**Effective from:** on publication approval (see approval block)
**Controller:** Amrit Kaur Rooprai, sole trader, trading as Dono
**Accountable owner:** Amrit Kaur Rooprai · **Deputy:** Sashank
**Supersedes:** v2.3 (6 August 2026) and all earlier versions, retained unaltered in the version archive
**Status:** **Clean replacement forms.** The v2.3 document carried forward v2.2 form text that the v2.3 amendment block expressly directed must not be implemented. This version replaces that text entirely. There is no drafting history in this document — only the forms to be built.

**Supports:** Society Campaign Terms clauses 1, 2.2 and 3.3; Terms of Service clauses 2.2, 6, 8.4, 11.3, 11.4, 15 and 16.4; Donor Terms clause 2.2.

---

## 1. Terminology and contracting model

**"Responsible Representative"** is the term used throughout. It replaces "Society Representative" everywhere.

**The contracting model is officer-on-behalf-of, with limited recourse.** Where a Society is unincorporated and has no separate legal personality:

- **the Responsible Representative is the contracting party**, contracting on the Society's behalf;
- they **hold or control the Connected Account for the Society and not personally**; and
- **Dono limits its recourse against them personally to the funds in the Connected Account they control for the Society**, except where they act dishonestly, deliberately misuse funds, or represent that they have authority when they do not.

**There is no provision under which the Responsible Representative automatically accepts all of the Society's obligations personally.** Any such wording in an earlier version is void and must not be implemented.

**Prohibited account structures.** A **registered charity** must not be recorded as holding the Connected Account or funded property for a Society. That structure is prohibited by Terms of Service clause 8.4 and Society Campaign Terms clause 3.3.

---

## 2. Form 1 — Responsible Representative onboarding

Completed before a Society Campaign can be created, alongside the checks in Terms of Service clause 6.

### 2.1 Eligibility checks that must pass first

| Check | Who performs it | Rule |
|---|---|---|
| **Institutional email verification** | Dono | One-time code or link to an address at a Recognised Institution. Non-institutional domains rejected. The code expires. This is **the only eligibility check Dono performs itself** |
| **Identity and Connected Account onboarding** | **The Payment Provider, as independent controller** | The Payment Provider collects and holds any identity document and face scan. **Dono never receives either.** Dono receives only the connected-account identifier and status, the check outcome, the verified name and the verified date of birth |
| **Age gate** | Dono, on the Payment Provider's verified date of birth | **Fail-closed.** A missing, inconsistent or under-18 result blocks onboarding. An apparent error uses the documented correction route. **There is no manual age override** |
| **UK address and onboarding requirements** | The Payment Provider | The Connected Account holder must provide a **valid UK address** and satisfy UK Connected Account onboarding requirements |
| **Enrolment, not location** | Dono | Student eligibility follows **current enrolment**, not physical presence. A student temporarily outside the UK remains eligible — but the UK address requirement above still applies to the Connected Account |

**Dono collects no student card, no student-card image, no student number and no identity document at any point.**

### 2.2 Fields captured

1. Full name
2. Institutional email address at the Recognised Institution
3. Role held within the Society (President, Treasurer, Secretary, or other named office)
4. Society name and Recognised Institution
5. Secondary Contact — name, institutional email and role of a current officer who can take over. **A named backup, not a second approver.** They complete no verification or Payment Provider onboarding unless and until they become the Responsible Representative
6. Ownership Statement — who will legally own the funded property or output

### 2.3 Declarations — each a separate, active tick, never pre-checked

Each is stored with **the exact wording displayed, a version identifier for that wording, and the timestamp.**

**(a) Authority declaration**

> *"I confirm I am authorised under the Society's constitution, or equivalent governing document, to create and operate Campaigns on the Society's behalf, to authorise the receipt of Donations, and to accept the Society Campaign Terms and the Refund and Dispute Policy for and on behalf of the Society."*

**(b) Approvals confirmation** *(replaces the former £2,500 / £10,000 authority bands)*

> *"I confirm that every approval required by the Society's constitution or governing rules, its bank mandate, and any Students' Union or institutional requirement has been obtained for this Campaign."*

*Note for reviewers: any internal Dono threshold for requesting documentary evidence is a **risk control for deciding when to ask**, not a legal requirement, and is never stated on the form as one. It is held in the internal review guidance, separately from the financial-crime thresholds in the Financial Crime and Sanctions Policy, which serve a different purpose.*

**(c) Limited-recourse disclosure — prominent, in plain words, before acceptance**

This term is onerous and **must be brought to the representative's attention to be incorporated**. It is displayed prominently, not buried, and accepted by its own separate active tick.

> *"Because your society is not a separate legal entity, you are the person contracting with Dono on its behalf. Dono limits what it can claim from you personally to the money in the Stripe account you control for the society — unless you act dishonestly, deliberately misuse funds, or say you have authority when you do not."*

**(d) Refund, chargeback and mandate acknowledgement**

> *"I understand that the holder of the Connected Account is responsible for refunds and chargebacks associated with that account. I understand that Dono may instruct the Payment Provider to reverse a charge on that account under the refund mandate in clause 13.2 of the Terms of Service, after notice and an opportunity to respond except in urgent cases, and that I may appeal. I understand Dono cannot hold or delay a payout."*

**(e) Ownership warranty**

> *"I warrant that the Ownership Statement I have given is accurate and that I have authority to make it."*

### 2.4 Who receives the funds

The Connected Account holder is one of:

- **The Society's own Connected Account** — *the default and the intended structure*
- The College or University, through its own account
- **A named office-holder personally** — *exceptional*

> **Warning displayed when the personal-account option is selected:** *"A balance cannot be moved between Stripe accounts. If you leave office, money already received stays in your account and you remain responsible for dealing with it. Dono strongly recommends a Society-held account and may refuse to publish a Society Campaign on a personal account."*

**A registered charity is not an available option.**

### 2.5 Society-purpose test

The Campaign's **primary purpose** must advance the Society's activities, members or legitimate objectives. **Incidental third-party benefit is not disqualifying.** A primarily external-benefit Campaign passes only if it is a **formally approved official Society initiative** that directly furthers the Society's charitable, educational, sporting, cultural or community mission and is **controlled and delivered by the Society** rather than passed through it.

The form captures: mission, beneficiaries, recipient, delivery control, ownership and Society approval.

### 2.6 Record-keeping

Each submission is stored as a durable copy: submitter, role, Society, Campaign where known, **document identifiers, versions and hashes accepted**, the **exact wording shown for each declaration**, its version identifier, and the timestamp — consistent with Terms of Service clause 2.2.

> **BUILD REQUIRED.** The wording shown is not currently stored. See checklist CH-05 and DP-ENG-10.

---

## 3. Form 2 — Succession

**A Society must always have a current Responsible Representative.**

### 3.1 Captured at Campaign setup

Responsible Representative (name, institutional email, role) and Secondary Contact (name, institutional email, role).

### 3.2 Change of Responsible Representative

Triggered when the Responsible Representative steps down, graduates or is replaced, or where there is a verified authority dispute.

**On trigger: suspend new Campaigns and Donations immediately**, so that new money does not arrive into an account that is about to be superseded.

**Step 1 — Verify the incoming representative.** They complete the full set of checks in §2.1 in their own right: institutional email verification; **the Payment Provider's identity check on a new Connected Account**, including its verified date of birth as the fail-closed age gate; a valid UK address and UK Connected Account onboarding; and the declarations in §2.3.

**Step 2 — Committee confirmation.** The Society confirms the change was made in line with its constitution, using an evidence hierarchy rather than one mandatory form — many student societies operate informally, and requiring minutes in every case would exclude legitimate changes without materially improving protection:

- **Preferred:** approved committee minutes or a written committee resolution.
- **Alternative:** written confirmation from two current officers, one of whom should ordinarily be the president, chair, treasurer or secretary.
- **Officer-transition fallback:** confirmation from the outgoing principal officer and one current or incoming officer, used only where Dono can verify both individuals' roles. This should not become the standard route.
- **Exceptional fallback:** another form of evidence Dono accepts following manual review, with the reason recorded.

Each signatory confirms: their name and committee role; that the Society has approved the change; the funding target and intended use of the Campaign; who is authorised to operate the Connected Account; that the change does not conflict with the Society's constitution or any known institutional rules; and that the Society will tell Dono if approval is withdrawn or the authorised officers change again.

**Step 3 — Replacement account, never a transfer.**

> **The successor opens a NEW Connected Account. Future Donations use it.**
>
> **Never describe, promise or implement a transfer of a Stripe account or of a balance.** The Payment Provider does not support moving a balance between connected accounts, and creating a new account moves nothing.

- **Where the Society, College or University holds the account:** the account holder is unchanged. Confirm this, and confirm the incoming representative has been given access by the Society. No new account is needed.
- **Where a named individual holds the account:** the incoming representative completes their own Payment Provider onboarding and a **new Connected Account is opened**. The outgoing account is not migrated.

**Step 4 — Funds already received.** Record the balance at the point of handover.

**Historic funds and transactions stay with the outgoing account holder.** They must account to the Society for them and **remain responsible for refunds, disputes, chargebacks and records from their period**. Any transfer of money between the outgoing and incoming representative is a matter between them and the Society — **outside Dono and outside the Payment Provider.**

**Dono does not move money, reimburse the Society, guarantee recovery, or describe any such transfer as a step in its own process.** What Dono may do: preserve and provide records, restrict the outgoing person, and make a proportionate referral under the Institutional Referral Protocol.

**Step 5 — Complete.** The incoming representative becomes the Responsible Representative, a new Secondary Contact is nominated, and the Campaign resumes with the new Connected Account.

**Record-keeping.** Each change is logged with the date, the outgoing and incoming representative, the evidence reviewed at Step 2, the balance recorded at Step 4, whether a new Connected Account was opened, and the date Donations were suspended and resumed.

---

## 4. Form 3 — Checkout consent and confirmation capture

Each item below is a **separate, specific choice**. **None may be bundled with another or with acceptance of the Donor Terms.** For each, Dono stores **the exact wording displayed, a version identifier for that wording, and the timestamp**, tied to the specific Donation — independently, so that a later change to one item's wording does not retroactively affect the record of what an earlier Donor actually saw.

### 4.1 Age and capacity confirmation — mandatory

> *"I confirm that I am 18 years of age or older and have the legal capacity to enter into this agreement."*

- **Must be actively confirmed. Payment is blocked without it.**
- Required for **every** Donation, including guest Donations.
- **Parent or guardian permission is not an alternative** and must not be offered as one.
- This is a **declaration, not a verified check.** No Dono document may describe it as age verification or as highly effective age assurance.
- Credible evidence that the Donor was under 18 when the Donation was made is an **objective refund ground**, requiring no proof of materiality, reliance or causation.

> **BUILD REQUIRED.** The confirmation must reflect the user's actual act. A hard-coded constant is worthless as evidence and its presence is itself misleading. See checklist AG-01 and CH-04.

### 4.2 Fee cover — optional, unticked by default

> *"Cover Dono's fee"* — showing the applicable amount: **2% + 20p (demo)** or **5% + 20p (production)**

- Unticked by default; charged only if the Donor **actively** selects it.
- Adds **only the applicable fixed Dono fee** — never the Payment Provider's actual processing cost.
- The **Campaign Owner bears the Dono fee unless the Donor actively covers it.**
- In demo, Dono's charge is labelled **"Payment processing fee (Dono)"** and must be visibly distinguished from **"Stripe processing cost (paid by the campaign)"**.
- **Never say or imply that fee cover makes the full intended contribution reach the Campaign** — the Connected Account still bears the Payment Provider's cost.
- The donor-facing total **never varies by card, payment method or country.**

### 4.3 Hide my name — optional

> *"Hide my name"* — **not** labelled "anonymous"

Displayed at the point of selection:

> *"This hides your name on Dono's public pages. Your donation amount is still shown. It does not hide information Stripe gives to the person or society receiving the money — because your payment goes straight to their own Stripe account, they may be able to see your name there. Dono will not tell them who you are, and our Terms prohibit them from using payment information to identify or contact you."*

### 4.4 Marketing consent — optional, unticked by default

A separate, specific opt-in for Dono to contact the Donor about future campaigns or updates. **Independent of every other choice.** Where an institution wishes to send marketing, that requires its own separate consent and is not covered by this one.

### 4.5 Institution data-sharing consent — DO NOT BUILD

**No such feature exists and none is to be built for beta.**

**Interim position, which is the published position: Dono shares no identifiable donor information with any university, college or institution.**

A vague or unused consent checkbox creates compliance risk and may mislead donors into thinking an institution is formally involved in the Campaign. Before this could ever be built, Dono must decide and record: whether the feature is genuinely required and for what purpose; **which specific institution** may receive data; exactly what fields are shared; **that donors who hid their name are excluded**; what the institution may use the data for and that it becomes an independent controller for that use; and how consent is withdrawn, with withdrawal stopping future sharing but not reversing what was lawfully disclosed. A **written data-sharing agreement must be executed with the institution and its privacy notice made available to the donor before they consent.** Introducing this feature is a **DPIA review trigger** and must be assessed before it goes live.

---

## 5. Mandatory checkout disclosure

Separately from the choices above, the checkout must display the **"You're donating to"** panel with all six mandatory fields — Campaign Owner's legal name; legal status; any representative; Connected Account holder; owner of purchased property; and Dono's role — and **block payment if any mandatory field is missing**. The exact panel content is persisted with the transaction and the acceptance record.

Full disclosure and acceptance wording is specified in `../publication-package/CHECKOUT_DISCLOSURES_AND_ACCEPTANCE_WORDING.md`.

---

## 6. Build requirements arising from these forms

| # | Requirement | Checklist ref |
|---|---|---|
| 1 | Store the **exact wording shown** and a version identifier for every declaration and consent, not just the choice | CH-05, DP-ENG-10 |
| 2 | Capture a **real** 18-or-over confirmation; remove the hard-coded constant | AG-01, CH-04 |
| 3 | Block payment where any mandatory recipient-panel field is missing | CH-01 |
| 4 | Persist the exact panel content with the transaction | CH-02 |
| 5 | Link a **guest's** acceptance to their donation | CH-05, CH-14 |
| 6 | Separate, unbundled storage of each consent | DP-ENG-06 |
| 7 | Suspend new Donations on a succession trigger, and resume only on completion | Succession flow |
| 8 | Never expose a Stripe account or balance transfer path in code | Settled boundary |
| 9 | Fail-closed creator age gate on the verified date of birth, with no manual override | EL-08 |
| 10 | Remove any registered-charity account-holder option | ToS 8.4 |

---

## 7. Approval block — SIGNATURE REQUIRED

> **This block is unsigned. These forms are prepared for approval and are not approved for build or use.**

**I confirm that these are the operative forms for the Society-only beta, that they replace the v2.2 form text carried forward into v2.3 in full, and that I approve them.**

| Field | Entry |
|---|---|
| Approver name | Amrit Kaur Rooprai |
| Role | Controller, sole trader and accountable owner |
| Document version approved | 3.0 |
| Approved for build and use | ☐ Yes, on ____________ · ☑ **No** |
| Solicitor review outstanding on | The limited-recourse disclosure in §2.3(c) and the officer-on-behalf-of contracting model; the refund mandate acknowledgement in §2.3(d) and the payment-services perimeter; whether the approvals confirmation in §2.3(b) is sufficient without documentary evidence at any funding level |
| Signature | ______________________ |
| Date of approval | ______________________ |

**Reviewed by:** Sashank (deputy) — Signature ______________________  Date ______________

---

## 8. Version control

| Field | Entry |
|---|---|
| Version | 3.0 |
| Version date | 7 August 2026 |
| Effective from | On publication approval |
| Accountable owner | Amrit Kaur Rooprai, sole trader trading as Dono |
| Prepared by | Legal consolidation, 7 August 2026 |
| Approved by | *(signature required — section 7)* |
| Status | **Not approved.** Clean replacement forms prepared for signature |
| Supersedes | v2.3 (6 August 2026) and all earlier versions. The v2.2 form text carried forward into v2.3 is **void and must not be implemented** |
| Next scheduled review | 7 February 2027, or on any change to the Society contracting model, the succession model or the checkout |
