# Durable Copy Requirements

**Version:** 3.0
**Version date:** 7 August 2026
**Effective from:** on publication approval
**Owner:** Amrit Kaur Rooprai · **Deputy:** Sashank
**Status:** **Not approved.** Prepared for signature.

---

## 1. What a durable copy is, and why it matters

A **durable medium** is one that lets the recipient store information addressed personally to them, in a way accessible for future reference for an adequate period, and that allows the **unchanged reproduction** of the information stored.

Three things follow, and each is a design constraint rather than a nicety:

1. **A page on Dono's website is not a durable medium** if Dono can change it. That is the whole point of the concept.
2. **A link is acceptable only if it resolves permanently to the unchanged version** the user actually accepted — never to "the current version".
3. **The user must be able to keep the copy without depending on continued access to their Dono account**, because they may close it, lose access, or never have had one.

Consumer law requires confirmation of a distance contract on a durable medium. Terms of Service clause 2.4 commits Dono to it. Checklist items CH-06, CH-07 and CH-08 implement it.

---

## 2. What the user receives

### 2.1 On-screen confirmation — immediately (CH-07)

Displayed at the moment of acceptance or payment:

| # | Element |
|---|---|
| 1 | Confirmation the acceptance or payment succeeded |
| 2 | The transaction details — amount, Campaign, date and time, reference |
| 3 | **The exact document versions accepted**, each a link to that specific version |
| 4 | The recipient panel as it was displayed |
| 5 | The fee breakdown as displayed |
| 6 | The choices made — age confirmation, fee cover, display preference, marketing |
| 7 | How to get a copy, and how to complain |

### 2.2 Confirmation email — the durable copy (CH-08)

Sent to the address given, **including for a guest Donor**.

**The email must contain either:**

- the applicable documents **attached as PDFs**; **or**
- a **permanent link to each archived version**, at a stable address that will resolve to those exact bytes indefinitely.

**Plus, in the body of the email itself** — not only behind a link:

| # | Element |
|---|---|
| 1 | Transaction details — amount, Campaign, date and time, reference |
| 2 | Who received the money — the Connected Account holder |
| 3 | Document titles, **versions and hashes** accepted |
| 4 | The fee breakdown as displayed at checkout |
| 5 | The choices made |
| 6 | Refund and complaint routes, with the single support address |
| 7 | The external-deadlines notice (`W-DEADLINE-1`) |

> **Contract formation does not depend on this email.** The contract forms on payment success (CH-03). **A successful charge with failed email delivery still produces a formed contract and a complete record.** The email is evidence and a durable copy, not a condition.

### 2.3 On request, at any time

Any user or guest may ask for a copy of what they accepted, using the reference in their confirmation. **A guest must be able to do this without an account.**

---

## 3. The permanent archive (CH-06)

| Rule |
|---|
| **Every published version is permanently addressable at a stable address** |
| A published version is **never overwritten and never deleted** |
| A new version gets a **new address and a new hash**. It does not replace the old address |
| A link in a durable copy resolves to **that exact version**, never to "current" |
| **The archive contains no personal data**, so it is retained indefinitely (ROPA row 25a) |
| The archive survives a redesign, a migration and a change of hosting. **Address stability is a hard requirement, not a preference** |

**Address form.** Each version has an address that encodes the document identifier and the version, so that it is human-readable and independently verifiable against `DOCUMENT_HASHES.md` — for example `/legal/donor-terms/3.0`.

---

## 4. Which events require a durable copy

| Event | Durable copy required? | Documents |
|---|---|---|
| **A — Account creation** | **Yes** | Terms of Service, Community Guidelines; Privacy Notice link |
| **B — Society onboarding** | **Yes** | Society Campaign Terms, Refund and Dispute Policy, and **the exact wording of all five declarations** |
| **C — Donation** | **Yes** | Donor Terms, Refund and Dispute Policy, Terms of Service (guest), plus the recipient panel, fee breakdown and choices |
| **Material change requiring re-acceptance** | **Yes** | The new versions accepted |
| Non-material change | Notification only | The change and its classification are recorded |

---

## 5. Guest donors — the specific gap

**A guest is the hardest case and the one most likely to be got wrong.** A guest:

- has no account to log into;
- has no persistent identity in the product beyond a guest key;
- receives one email and nothing else; and
- is the party for whom the durable copy is therefore **the entire record**.

| Requirement | Status |
|---|---|
| A guest's acceptance is recorded with the same fields as a registered user's | **Outstanding** (CH-05) |
| **A guest's acceptance is linked to their donation** | **Outstanding** (CH-14) |
| A guest receives the full durable copy by email | **Outstanding** (CH-08) |
| A guest can request a copy later without an account | **Outstanding** |

> **Until CH-14 is closed, Dono cannot prove which version a guest accepted.** That is DPIA risk L-21 and it is a publication blocker.

---

## 6. Retention

| Record | Period |
|---|---|
| Acceptance records | **6 years** from acceptance |
| Donation and checkout-disclosure records | **6 years** from the transaction |
| **Published document versions** | **Indefinite** — immutable archive, no personal data |
| Confirmation email delivery log | 12 months |

---

## 7. Build requirements

| # | Requirement | Ref | Status |
|---|---|---|---|
| 1 | Immutable archive; superseded versions retrievable at a stable address | CH-06 | **Outstanding** |
| 2 | On-screen confirmation with applicable versions | CH-07 | **Outstanding** |
| 3 | Confirmation email with PDFs or permanent links | CH-08 | **Outstanding** |
| 4 | Contract forms on payment success, independent of email delivery | CH-03 | **Outstanding** |
| 5 | Guest acceptance linked to donation | CH-14 | **Outstanding** |
| 6 | Copy-on-request route accessible without an account | — | **Outstanding** |
| 7 | Version binding preserved when a new version publishes | CH-09 | **Outstanding** |
| 8 | Delivery failure logged and alerted, without blocking contract formation | CH-03, AL-01 | **Outstanding** |

---

## 8. Test evidence required before publication

| # | Test | Evidence |
|---|---|---|
| 1 | Guest donation produces a complete acceptance record linked to the donation | Sample record |
| 2 | Confirmation email received containing a **working permanent link** | Sample email |
| 3 | Historical version retrieval returns the exact archived bytes | Hash comparison against `DOCUMENT_HASHES.md` |
| 4 | Publishing a new version does not alter an existing record's binding | Before-and-after test |
| 5 | A successful charge with email delivery failed still produces a formed contract and complete record | Test log |
| 6 | A guest can obtain a copy later without an account | Walkthrough |

---

## 9. Approval block — SIGNATURE REQUIRED

> **This block is unsigned.**

**I confirm that these are the durable-copy requirements for the Dono suite, that no requirement is satisfied by a page Dono can change, and that I approve them.**

| Field | Entry |
|---|---|
| Approver name | Amrit Kaur Rooprai |
| Role | Controller, sole trader and accountable owner |
| Version approved | 3.0 |
| All eight build requirements complete? | ☐ Yes, on ____________ · ☑ **No — 8 outstanding** |
| Signature | ______________________ |
| Date | ______________________ |

**Reviewed by:** Sashank (deputy) — Signature ______________________  Date ______________
