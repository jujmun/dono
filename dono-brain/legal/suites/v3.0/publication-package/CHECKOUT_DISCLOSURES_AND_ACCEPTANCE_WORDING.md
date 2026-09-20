# Checkout Disclosures and Acceptance Wording

**Version:** 3.0
**Version date:** 7 August 2026
**Effective from:** on publication approval
**Owner:** Amrit Kaur Rooprai · **Deputy:** Sashank
**Status:** **Not approved.** Prepared for signature.

> **This document is the source of truth for user-facing legal wording at checkout and onboarding.** The exact strings below are what the product displays. **Changing a string requires a new wording version and a new approval** — because the wording shown is stored with every acceptance record, and a silent change would corrupt the evidence of what earlier users actually saw.

---

## 1. Wording version control

Every string carries a **wording version identifier** in the form `W-<code>-<n>`. The identifier, the exact string and the timestamp are stored with each acceptance.

| Rule |
|---|
| A string is **never edited in place**. A change produces `W-<code>-<n+1>` |
| The record of what an earlier user saw **always** resolves to the version they saw |
| A wording change that alters the substance of what a user agreed to is a **material change** requiring re-acceptance |
| Every string below is at version **-1**, none yet published |

---

## 2. Mandatory checkout disclosures

### 2.1 The "You're donating to" panel — `W-PANEL-1`

**Six mandatory fields. Payment is blocked if any is missing** (checklist CH-01). The exact rendered content is persisted with the transaction and the acceptance record (CH-02).

| # | Field | What it shows |
|---|---|---|
| 1 | **Campaign Owner's legal name** | The legal name of the person or body operating the Campaign |
| 2 | **Legal status** | For example: *"an unincorporated student society"* |
| 3 | **Representative** | The named Responsible Representative acting for the Society |
| 4 | **Connected Account holder** | Who actually receives the money |
| 5 | **Owner of purchased property** | Who will legally own what the money buys |
| 6 | **Dono's role** | The statement at §2.2 |

### 2.2 Dono's role statement — `W-ROLE-1`

> *"Dono operates this platform. Dono does not receive your donation, does not hold it, and is not responsible for how it is spent. Your payment goes directly to the account shown above. Dono charges the campaign a fee for using the platform."*

### 2.3 Amount and fee breakdown — `W-FEES-1`

**Checkout shows an exact total before confirmation, itemised** (checklist PF-03). **The charged amount must equal the displayed total.**

| Line | Label | Notes |
|---|---|---|
| 1 | Campaign contribution | The amount going to the Campaign |
| 2 | **"Payment processing fee (Dono)"** (demo) or **"Dono fee"** (production) | The applicable locked schedule: **2% + 20p demo**, **5% + 20p production** |
| 3 | Optional fee cover | Only if actively selected |
| 4 | **"Stripe processing cost (paid by the campaign)"** | Shown for transparency. **Never presented as Dono's charge, and never added to the Donor's total** |
| 5 | **Total you will pay** | The exact amount to be charged |
| 6 | Expected proceeds to the campaign | |

**Absolute rules:**

- **The donor-facing total never varies by card, payment method or country.** No branch on instrument may exist.
- **No copy may imply that Dono's fixed fee is Stripe's actual processing cost**, or the reverse.
- **No VAT reference anywhere** in displayed amounts, receipts or fee statements while Dono is unregistered (PF-04). The only permitted mention of VAT is the statement that Dono is not VAT registered.
- **Fee cover never makes the full intended contribution reach the Campaign** — the Connected Account still bears Stripe's cost. No copy may say or imply otherwise.

### 2.4 External deadlines notice — `W-DEADLINE-1`

> *"If something goes wrong with your donation, deadlines set by your card provider and by law run independently of Dono's process. Contacting us does not pause them."*

### 2.5 Surplus disclosure — `W-SURPLUS-1`

Shown before payment where a Campaign may exceed its target:

> *"If this campaign raises more than its target, surplus is refunded starting with the most recent donations and working backwards, until the surplus runs out. Surplus is not shared out proportionately, and there is no guarantee you will receive an automatic share. You can also ask for a refund of surplus yourself."*

---

## 3. Acceptance wording — Event C, Donation

### 3.1 Age and capacity confirmation — `W-AGE-1` · MANDATORY

> *"I confirm that I am 18 years of age or older and have the legal capacity to enter into this agreement."*

| Rule |
|---|
| **Must be actively ticked. Payment is blocked without it** |
| Required for **every** Donation, guest or account holder |
| **Parent or guardian permission is not an alternative** and must never be offered as one |
| **Never described as age verification** or highly effective age assurance, anywhere |
| The stored value must reflect **the user's actual act**. A hard-coded constant is worthless as evidence and its presence is itself misleading (AG-01) |
| Phrased neutrally. No hint of the permitted answer |

### 3.2 Terms acceptance — `W-ACCEPT-1`

> *"By continuing, I accept the Donor Terms, the Refund and Dispute Policy and the Terms of Service, and I have read the Privacy Notice."*

Each document title is a working link to the exact published version. **The version and hash of each are stored with the acceptance record.**

### 3.3 Fee cover — `W-COVER-1` · OPTIONAL, UNTICKED

> *"Cover Dono's fee"* — displaying the applicable amount

Unticked by default. Adds **only** the applicable fixed Dono fee, never Stripe's cost.

### 3.4 Hide my name — `W-HIDE-1` · OPTIONAL

> *"Hide my name"*

**Not labelled "anonymous"** — that would be a misrepresentation. Shown at the point of selection:

> *"This hides your name on Dono's public pages. Your donation amount is still shown. It does not hide information Stripe gives to the person or society receiving the money — because your payment goes straight to their own Stripe account, they may be able to see your name there. Dono will not tell them who you are, and our Terms prohibit them from using payment information to identify or contact you."*

> **This is the honest disclosure of DPIA accepted residual risk A1.** It must not be softened, shortened or moved behind a link.

### 3.5 Marketing consent — `W-MKT-1` · OPTIONAL, UNTICKED

> *"Email me occasionally about Dono and campaigns I might like."*

Separate and independent from every other choice. Unticked. **Never bundled** with acceptance or with any other consent.

### 3.6 Public display default — `W-DISPLAY-1` · OPTIONAL, UNTICKED

Required by ICO Children's Code Standard 7. **The default is private.**

> *"Show my support publicly"*

Unticked by default. If activated, the Donor chooses whether to show their name, their amount, or both. **Where it is not activated: no name, no individual amount and no precise timestamp is displayed.** Campaign totals and aggregate donor counts are shown instead.

---

## 4. Acceptance wording — Event A, Account creation

### 4.1 Age confirmation — `W-ACCT-AGE-1`

> *"I confirm that I am 18 years of age or older."*

With a neutral date-of-birth entry. **No immediate retry with a different date after a failed under-18 attempt** (ICO Children's Code Standard 13).

### 4.2 Terms acceptance — `W-ACCT-ACCEPT-1`

> *"By creating an account, I accept the Terms of Service and the Community Guidelines, and I have read the Privacy Notice."*

---

## 5. Acceptance wording — Event B, Society onboarding

The five declarations are set out in full in `../procedures/dono-society-onboarding-succession-forms-v3.0.md` §2.3. Their wording identifiers:

| Declaration | Identifier | Onerous? |
|---|---|---|
| Authority declaration | `W-SOC-AUTH-1` | No |
| Approvals confirmation | `W-SOC-APPROVE-1` | No |
| **Limited-recourse disclosure** | `W-SOC-RECOURSE-1` | **YES — must be prominent to be incorporated** |
| Refund, chargeback and mandate acknowledgement | `W-SOC-REFUND-1` | Arguably — treat as prominent |
| Ownership warranty | `W-SOC-OWNER-1` | No |

### 5.1 Terms acceptance — `W-SOC-ACCEPT-1`

> *"I accept the Society Campaign Terms and the Refund and Dispute Policy on behalf of the Society, and I confirm I am authorised to do so."*

---

## 6. Presentation rules

These apply to every string above.

| # | Rule | Source |
|---|---|---|
| 1 | **Each choice is separate and specific. None may be bundled** with another or with acceptance of any document | UK GDPR Art. 7; PECR |
| 2 | **Optional items are unticked by default.** No pre-selection, ever | Children's Code Standard 7 |
| 3 | **Privacy choices carry equal visual weight. Reject is as easy as accept** | Children's Code Standard 13 |
| 4 | **No scarcity, countdown, streak, guilt or social-proof pressure mechanics** anywhere | Children's Code Standard 5 |
| 5 | **Neutral amount suggestions.** No anchoring on high values | Children's Code Standard 13 |
| 6 | **The exact wording shown, its version and the timestamp are stored** with every acceptance | CH-05 |
| 7 | **Contract forms on payment success**, not on confirmation-email delivery. The email is evidence only | CH-03 |
| 8 | **On-screen confirmation** after acceptance or payment, showing the transaction and the applicable document versions | CH-07 |
| 9 | **A dark-pattern review of mobile and web flows is completed and recorded** before launch | Children's Code Standard 13 |
| 10 | **No trust indicator of any kind** — no badge, tick, shield, "verified", "validated", "eligibility checked", "society approved" or "institutionally endorsed" — anywhere near checkout | EL-05 |

---

## 7. Build requirements

| # | Requirement | Ref | Status |
|---|---|---|---|
| 1 | Recipient panel with all six fields; payment blocked if any missing | CH-01 | **Outstanding** |
| 2 | Persist exact panel content with the transaction | CH-02 | **Outstanding** |
| 3 | Real 18-or-over confirmation; remove the hard-coded constant | AG-01, CH-04 | **Outstanding** |
| 4 | Exact total shown before confirmation; charged amount equals displayed total | PF-03 | **Outstanding** |
| 5 | Store exact wording and version for every declaration and consent | CH-05 | **Outstanding** |
| 6 | Public display private by default | Children's Code S7 | **Outstanding** |
| 7 | Remove all VAT references from displayed amounts | PF-04 | **Outstanding** |
| 8 | No card, method or country branch on the donor-facing total | PF-01 | **Outstanding** |
| 9 | Contract forms on payment success | CH-03 | **Outstanding** |
| 10 | Dark-pattern review recorded | Children's Code S13 | **Outstanding** |

---

## 8. Wording change log

| Identifier | Version | Date | Change | Approved by |
|---|---|---|---|---|
| All | -1 | 7 August 2026 | Initial wording set | *(unsigned)* |

---

## 9. Approval block — SIGNATURE REQUIRED

> **This block is unsigned. No wording is approved for display.**

**I confirm that the strings above are the exact wording the product will display, that each carries a version identifier stored with every acceptance record, and that I approve them.**

| Field | Entry |
|---|---|
| Approver name | Amrit Kaur Rooprai |
| Role | Controller, sole trader and accountable owner |
| Wording set version | 3.0, all strings at -1 |
| Dark-pattern review completed? | ☐ Yes, on ____________ · ☑ **No** |
| Signature | ______________________ |
| Date | ______________________ |

**Reviewed by:** Sashank (deputy) — Signature ______________________  Date ______________
