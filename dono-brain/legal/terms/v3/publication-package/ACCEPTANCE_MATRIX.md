# Acceptance Matrix — which terms apply, when

**Version:** 3.0
**Version date:** 7 August 2026
**Effective from:** on publication approval
**Owner:** Amrit Kaur Rooprai · **Deputy:** Sashank
**Status:** **Not approved.** Prepared for signature.

---

## 1. The three acceptance events

Dono has **exactly three** points at which a person accepts a legal document. There is no fourth, and no document may be made acceptable outside these three.

| Event | Who | When |
|---|---|---|
| **A — Account creation** | Any person creating an account | Before the account exists |
| **B — Society onboarding** | A Responsible Representative acting for a Society | Before a Society Campaign can be created |
| **C — Donation** | Any Donor, **account holder or guest** | Before payment is taken |

**Roles are cumulative.** A Responsible Representative who donates to another Campaign accepts the Donor Terms for that Donation, in addition to everything already accepted.

---

## 2. Matrix

### Event A — Account creation

| Document | Accepted? | How |
|---|---|---|
| **Terms of Service** | **Yes** | Active acceptance. Account not created without it |
| **Community Guidelines** | **Yes** | Active acceptance. Governs the account, its content and conduct |
| **Privacy Notice** | **Acknowledged, not accepted** | It is a notice. Presented and linked; the acknowledgement that it was shown is recorded |
| **Cookie Notice** | Separate | Governed by the consent banner, independent of account creation |
| Society Campaign Terms | No | Only at Event B |
| Donor Terms | No | Only at Event C |
| Refund and Dispute Policy | No | Only at Event C, and at Event B for the Society |
| Verification Notice | No | Information only |
| **Student Campaign Terms** | **NEVER** | **Not operative in beta. Must not be presented** |

**Also captured at A:** the **18-or-over confirmation** with a declared date of birth. Neutral entry; no immediate retry with a different date after a failed under-18 attempt.

### Event B — Society onboarding

| Document | Accepted? | How |
|---|---|---|
| **Society Campaign Terms** | **Yes** | Active acceptance, on behalf of the Society |
| **Refund and Dispute Policy** | **Yes** | Active acceptance. The Society is bound by refund determinations |
| **Community Guidelines** | Already accepted at A | Re-confirmed as applying to the Society's content |
| Terms of Service | Already accepted at A | Continues to apply |
| **Verification Notice** | **Shown** | Presented before the checks begin, so the representative knows what is and is not checked |
| Privacy Notice | Acknowledged | Linked at the point of collection |

**Also captured at B, each as a separate active tick with wording and version stored** (see `../dono-society-onboarding-succession-forms-v3.0.md` §2.3):

1. **Authority declaration**
2. **Approvals confirmation**
3. **Limited-recourse disclosure** — onerous; must be prominent to be incorporated
4. **Refund, chargeback and mandate acknowledgement**
5. **Ownership warranty**

### Event C — Donation

**This is the only event a guest reaches, and the only one at which money moves. It carries the heaviest disclosure load.**

| Document | Accepted? | How |
|---|---|---|
| **Donor Terms** | **Yes** | Active acceptance. **Guest and account holder alike** |
| **Refund and Dispute Policy** | **Yes** | Active acceptance |
| **Terms of Service** | **Yes** for a guest; already accepted at A for an account holder | A guest accepts the Terms of Service at this point, because they have never accepted them |
| **Privacy Notice** | Acknowledged | Linked at the point of collection |
| Community Guidelines | Only if the Donor holds an account | A guest posts no content |
| Society Campaign Terms | No | Binds the Society, not the Donor |
| **Student Campaign Terms** | **NEVER** | |

**Also captured at C, each separate and unbundled** (see `CHECKOUT_DISCLOSURES_AND_ACCEPTANCE_WORDING.md`):

1. **18-or-over and capacity confirmation** — mandatory; payment blocked without it
2. **Fee cover** — optional, unticked
3. **Hide my name** — optional
4. **Marketing consent** — optional, unticked

---

## 3. Summary grid

| Document | A — Account | B — Society onboarding | C — Donation |
|---|---|---|---|
| Terms of Service | **ACCEPT** | (already) | **ACCEPT** if guest |
| Community Guidelines | **ACCEPT** | (already) | (if account holder) |
| Society Campaign Terms | — | **ACCEPT** | — |
| Donor Terms | — | — | **ACCEPT** |
| Refund and Dispute Policy | — | **ACCEPT** | **ACCEPT** |
| Verification Notice | — | Shown | — |
| Privacy Notice | Acknowledge | Acknowledge | Acknowledge |
| Cookie Notice | Consent banner, independent of all three | | |
| Complaints Policy | Referenced | Referenced | Referenced |
| **Student Campaign Terms** | **NEVER** | **NEVER** | **NEVER** |

---

## 4. What every acceptance record must contain

Per checklist CH-05 and DP-ENG-10. **The same fields for a guest as for a registered user** — this is the gap at CH-14.

| Field | Notes |
|---|---|
| User identifier **or guest key** | A guest acceptance with no link to their donation proves nothing |
| Role at acceptance | Account holder, Responsible Representative, Donor, guest Donor |
| Acceptance event | A, B or C |
| Campaign identifier | Where the acceptance relates to a Campaign or Donation |
| Donation identifier | For Event C. **The link that closes CH-14** |
| Document identifiers | Every document accepted at that event |
| Document **versions** | Exact version per document |
| Document **hashes** | SHA-256 per document, per `DOCUMENT_HASHES.md` |
| Exact wording shown | For each separate declaration or consent |
| Wording version identifier | So a later wording change does not retroactively alter an earlier record |
| Timestamp | |
| Acceptance mechanism | Active tick, button press — never inferred from continued use |

**These are evidence records, not user profiles.** No field beyond those listed. Retention: **6 years from acceptance**.

---

## 5. Version binding

1. **Each Campaign is permanently bound to the document versions in force when it was created.**
2. **Each Donation is permanently bound to the document versions in force when it was made.**
3. Publishing a new version **does not** change either binding (checklist CH-09).
4. **The version in force at the time of acceptance governs that transaction.**
5. Fee changes are **prospective only** — the fee schedule is bound to the Campaign at creation and to the Donation at payment (PF-06).

---

## 6. Re-acceptance on change

| Change type | Consequence |
|---|---|
| **Material** | The affected feature is **unavailable until the user actively accepts** the new version. **Continued use is never treated as acceptance** (Terms of Service clause 30.2(c), checklist CH-10) |
| Non-material | Notified; no re-acceptance required. The change and its classification are recorded |

**Who classifies.** The accountable owner, recorded in the manifest change log with reasons. **Where it is genuinely arguable, treat it as material.**

---

## 7. Build requirements

| # | Requirement | Ref | Status |
|---|---|---|---|
| 1 | Acceptance record for every acceptance, guests included | CH-05 | **Outstanding** |
| 2 | Guest acceptance linked to the donation | CH-14 | **Outstanding** |
| 3 | Immutable archive of every published version at a stable address | CH-06 | **Outstanding** |
| 4 | Version binding for Campaigns and Donations | CH-09 | **Outstanding** |
| 5 | Re-acceptance gating for material changes | CH-10 | **Outstanding** |
| 6 | On-screen confirmation after acceptance or payment | CH-07 | **Outstanding** |
| 7 | Durable copy by email | CH-08 | **Outstanding** |
| 8 | Store the exact wording and version for each declaration | CH-05 | **Outstanding** |
| 9 | Contract forms on payment success, not on email delivery | CH-03 | **Outstanding** |
| 10 | Student Campaign Terms unreachable from any acceptance flow | CR-00 | **Outstanding** |

---

## 8. Approval block — SIGNATURE REQUIRED

> **This block is unsigned.**

**I confirm that this matrix states which documents apply at each acceptance event, that the Student Campaign Terms are accepted at no event, and that I approve it.**

| Field | Entry |
|---|---|
| Approver name | Amrit Kaur Rooprai |
| Role | Controller, sole trader and accountable owner |
| Version approved | 3.0 |
| Signature | ______________________ |
| Date | ______________________ |

**Reviewed by:** Sashank (deputy) — Signature ______________________  Date ______________
