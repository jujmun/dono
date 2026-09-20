# Publication Approval Register

**Version:** 3.0
**Version date:** 7 August 2026
**Owner:** Amrit Kaur Rooprai · **Deputy:** Sashank
**Status:** **V3.0 CONTENT IS READY; RENDERED ARTIFACTS ARE NOT YET RELEASE-AUTHORISED.** Every release row below is unsigned.

---

## 1. What this register does

**One row per document. The v3.0 wording is current and content-ready; a rendered document is published only when its row is signed.**

This is the last gate. A signature here means the approver is satisfied that:

1. the document is **factually accurate about the product as it will exist at publication** — it does not describe a control that will not be running;
2. its **document-specific publication conditions** are met;
3. its **HTML and PDF publication hashes** are recorded and match the exact rendered bytes to be served or supplied; and
4. it is **on the operative manifest** at the version being published.

**A document that fails any of the four is not published.** Publishing a document that describes processing Dono does not carry out is not a presentational problem — it is a fairness and accuracy breach under Article 5(1)(a), and it is DPIA risk L-22.

---

## 2. Suite-wide gates

**These must ALL be closed before ANY document is published.** They are not per-document.

| # | Gate | Owner | Status |
|---|---|---|---|
| G1 | Immutable published archive exists; superseded versions retrievable at a stable address (CH-06) | Engineering | **OPEN** |
| G2 | Acceptance records capture identifier, role, campaign, versions, **hashes**, wording, timestamp (CH-05) | Engineering | **OPEN** |
| G3 | Guest acceptance linked to donation (CH-14) | Engineering | **OPEN** |
| G4 | On-screen confirmation and durable copy delivered (CH-07, CH-08) | Engineering | **OPEN** |
| G5 | The product serves the release-authorised v3.0 HTML artifact, not a draft stub or raw Markdown (CH-15) | Engineering | **OPEN** |
| G6 | Individual Campaign routes disabled and negative-tested (CR-00) | Engineering | **OPEN** |
| G7 | Hashes recomputed at publication and re-signed | Amrit | **OPEN** |
| G8 | Release Control Matrix row signed — deployment, commit, payment mode, manifest version | Amrit | **OPEN** |
| G9 | **DPIA approved and signed** | Amrit | **OPEN** |
| G10 | **ICO fee registration completed** | Amrit | **OPEN** |
| G11 | Provider register complete for launch — PostHog and Google terms recorded, Vercel TRA completed | Amrit | **OPEN** |
| G12 | Retention and deletion engine running, with clock-controlled tests per data class | Engineering | **OPEN** |
| G13 | Child-friendly privacy layer drafted and approved | Amrit | **OPEN** |

**13 of 13 suite-wide gates are open.**

---

## 3. Per-document approval rows

### 3.1 Terms of Service — `../public/01_dono_terms_of_service_v3.0.md`

| Field | Entry |
|---|---|
| Version | 3.0 · Hash per `DOCUMENT_HASHES.md` |
| Specific conditions | Refund mandate (13.2) built and tested (RF-01); fee schedule locked to Campaign (PF-00, PF-01); VAT references removed (PF-04); Stripe configuration verified and recorded (PF-07); Society-purpose test implemented (CR-04) |
| Solicitor review outstanding on | Refund mandate and the payment-services perimeter; Society contracting model; consumer status of Campaign Owners; liability caps at 27.3(b)–(c); Consumer Contracts Regulations position |
| Approved for publication | ☐ Yes · **☑ No** |
| Signature | ______________________ · Date ____________ |

### 3.2 Society Campaign Terms — `../public/03_dono_society_campaign_terms_v3.0.md`

| Field | Entry |
|---|---|
| Version | 3.0 · Hash per `DOCUMENT_HASHES.md` |
| Specific conditions | Limited-recourse disclosure served as a separate active tick with wording and version stored; replacement-account succession implemented with **no balance-transfer path anywhere in code**; split-role agreement gate (CR-07); registered-charity account-holder option removed |
| Solicitor review outstanding on | Representative authority and the officer-on-behalf-of model; limited recourse; connected-account ownership; the settled replacement-account succession wording |
| Approved for publication | ☐ Yes · **☑ No** |
| Signature | ______________________ · Date ____________ |

### 3.3 Donor Terms — `../public/04_dono_donor_terms_v3.0.md`

| Field | Entry |
|---|---|
| Version | 3.0 · Hash per `DOCUMENT_HASHES.md` |
| Specific conditions | Real 18-or-over confirmation built and stored (AG-01, CH-04); exact total shown before confirmation and charged amount equal to it (PF-03); fee cover unticked adding only the Dono fee (PF-02); hidden-name disclosure served in full at the point of choice |
| Solicitor review outstanding on | Contract formation and the Consumer Contracts Regulations 2013 position; adequacy of the 18+ self-certification; fee-cover presentation against the Consumer Rights (Payment Surcharges) Regulations 2012 |
| Approved for publication | ☐ Yes · **☑ No** |
| Signature | ______________________ · Date ____________ |

### 3.4 Community Guidelines — `../public/05_dono_community_guidelines_v3.0.md`

| Field | Entry |
|---|---|
| Version | 3.0 · Hash per `DOCUMENT_HASHES.md` |
| Specific conditions | **All eight Online Safety acceptance tests passed** with dated evidence and named approvers; appeals workflow with reviewer separation (test 7); account suspension and ban (test 5); URL blocking in comments (OS-22) |
| Note | Clauses 7 and 8 are open to anyone including non-users, so the reporting and complaints routes they describe **must work for a logged-out person** |
| Approved for publication | ☐ Yes · **☑ No** |
| Signature | ______________________ · Date ____________ |

### 3.5 Refund and Dispute Policy — `../public/07_dono_refund_and_dispute_policy_v3.0.md`

| Field | Entry |
|---|---|
| Version | 3.0 · Hash per `DOCUMENT_HASHES.md` |
| Specific conditions | Refund mandate executable (RF-01); pre-refund dispute check (RF-02); application-fee reversal (RF-03); single dispute state (RF-04); notifications and deadline alerts (RF-05, RF-06); refund evidence record (RF-07); surplus ledger (RF-08); full request workflow with appeal (RF-09); discretionary admin refund path removed (RF-10) |
| Approved for publication | ☐ Yes · **☑ No** |
| Signature | ______________________ · Date ____________ |

### 3.6 Verification Notice — `../public/06_dono_verification_notice_v3.0.md`

| Field | Entry |
|---|---|
| Version | 3.0 · Hash per `DOCUMENT_HASHES.md` |
| Specific conditions | Student-card collection removed entirely (EL-01, EL-02); **Dono's own identity-document upload and admin viewer removed** (EL-07); institutional email verification tested (EL-03); retention and deletion cascade for verified name and date of birth (EL-08); **every trust indicator removed** (EL-05); neutral lifecycle states (EL-06) |
| Note | This Notice's whole purpose is to prevent a Donor believing Dono has checked more than it has. **Publishing it while any badge or tick remains would be self-defeating** |
| Approved for publication | ☐ Yes · **☑ No** |
| Signature | ______________________ · Date ____________ |

### 3.7 Privacy Notice — `../public/08_dono_privacy_notice_v3.0.md`

| Field | Entry |
|---|---|
| Version | 3.0 · Hash per `DOCUMENT_HASHES.md` |
| Specific conditions | **Retention-enforcement and deletion-audit jobs running** — verified 5 Aug 2026 that none runs today; receipt quarantine and auto-delete; campaign archival and de-indexing; consent timestamp and Cookie Notice version recorded; privacy-settings link and immediate withdrawal; **written team confidentiality and data-handling agreements executed**; **PostHog and Google Article 28 terms recorded**; **Vercel Transfer Risk Assessment completed**; student-card and Dono identity-document storage removed; retention and deletion cascade for verified name and DOB; **backup period, restore behaviour and deletion propagation verified** |
| Note | Clause 7 promises deletion Dono does not currently perform. **This is the document most likely to be published prematurely and the one where doing so would be most damaging** |
| Approved for publication | ☐ Yes · **☑ No** |
| Signature | ______________________ · Date ____________ |

### 3.8 Cookie Notice — `../public/09_dono_cookie_notice_v3.0.md`

| Field | Entry |
|---|---|
| Version | 3.0 · Hash per `DOCUMENT_HASHES.md` |
| Verified already working (5 Aug 2026) | Analytics not loaded before consent; banner offers equally prominent Accept and Reject; session replay off in the client; IP anonymised at ingest; no advertising or third-party integration |
| Specific conditions | Live clean-browser **desktop and mobile** audit and correction of clause 4 (CK-06); privacy-settings link (CK-03); **consent timestamp and Notice version stored** — neither is today (CK-05); immediate withdrawal and downstream revocation (CK-04); **session replay disabled at project level** as well as in the client (CK-07); retention set to 12 months with **enforcement enabled** (CK-08) |
| Approved for publication | ☐ Yes · **☑ No** |
| Signature | ______________________ · Date ____________ |

### 3.9 Complaints Policy — `../public/dono-complaints-policy-v3.0.md`

| Field | Entry |
|---|---|
| Version | 3.0 · Hash per `DOCUMENT_HASHES.md` |
| Specific conditions | Appeals workflow with reviewer separation (test 7); single support address operating with a named responsible person and backup; complaint register in place; DMCCA 2024 Chapter 4 Part 4 references confirmed current |
| Approved for publication | ☐ Yes · **☑ No** |
| Signature | ______________________ · Date ____________ |

### 3.10 Child-friendly privacy layer — NOT YET DRAFTED

| Field | Entry |
|---|---|
| Version | — |
| Status | **DOES NOT EXIST.** Required by ICO Children's Code Standard 4 |
| Specific conditions | Draft it; aim it primarily at 13–17-year-old readers; include a parent and carer section and a route to the full notice; add just-in-time explanations at the analytics choice, the donation display choice and the age confirmation |
| Approved for publication | ☐ Yes · **☑ No — not drafted** |
| Signature | ______________________ · Date ____________ |

---

## 4. Excluded — Student Campaign Terms

| Field | Entry |
|---|---|
| Document | `../future/02_dono_student_campaign_terms_v3.0.md` |
| Status | **⚠ FUTURE RELEASE — MUST NOT BE SERVED** |
| Reason | Individual Student Campaigns do not exist in the beta. Creation, publication and donation are disabled at the API boundary (CR-00) |
| Approval sought? | **No. None is sought and none may be given for the Society-only beta** |
| Before it is ever served | Re-review against the then-current suite; re-approve; add to the manifest with a new hash; **and revisit the DPIA, the Children's Risk Assessment and the Illegal Content Risk Assessment**, because individual Student Campaigns materially change the risk profile |

---

## 5. Governance records — approval status

Not published, but each requires approval before the suite is relied on.

| Record | Approved? |
|---|---|
| DPIA | ☑ **No** — **suite-wide gate G9** |
| ROPA | ☑ No |
| Appropriate Policy Document | ☑ No — solicitor review outstanding |
| Article 14 assessment | ☑ No |
| Legitimate Interests Assessments | ☑ No |
| Provider and DPA register | ☑ No — 3 blocking items |
| International Transfer Assessment | ☑ No — 3 rows open |
| ICO fee self-assessment | ☑ No — determination complete, **registration outstanding (G10)** |
| ICO Children's Code assessment | ☑ No — 10 launch-critical controls outstanding |
| Children's Risk Assessment | ☑ No — 2 risks HIGH |
| Illegal Content Risk Assessment | ☑ No — re-performance required on evidence |
| Online Safety Procedures | ☑ No — 6 of 8 acceptance tests fail |
| CSEA legal-readiness checklist | ☑ No — **0 of 12 items complete** |
| Society onboarding and succession forms | ☑ No |
| Beta document manifest | ☑ No |
| Document hashes | ☑ No — provisional |
| Acceptance matrix | ☑ No |
| Checkout disclosures and wording | ☑ No |
| Durable copy requirements | ☑ No |
| Superseded version archive | ☑ No |

---

## 6. Overall publication determination

> ## **PUBLICATION IS NOT APPROVED.**
>
> **0 of 10 operative documents approved. 13 of 13 suite-wide gates open. 0 of 20 governance records approved.**
>
> The three largest blocking clusters:
>
> 1. **The reporting and moderation system does not exist.** Six of eight Online Safety acceptance tests fail. This blocks the Community Guidelines and, through them, the public UGC surface.
> 2. **The retention and deletion engine does not exist.** No retention or deletion job of any kind runs. This blocks the Privacy Notice, which promises deletion Dono does not perform.
> 3. **The contract-evidence layer does not exist.** No immutable archive, no version-and-hash acceptance record, no guest linkage, no durable copy. This blocks every contractual document, because Dono could not prove what anyone accepted.

---

## 7. Final publication approval — SIGNATURE REQUIRED

> **This block is unsigned. Nothing is published.**

**I confirm that every suite-wide gate in section 2 is closed, that every document row in section 3 is individually signed, that the hashes have been recomputed and verified against the bytes to be served, that the Student Campaign Terms are excluded, and that I approve publication of the Society-only beta legal suite.**

| Field | Entry |
|---|---|
| Approver name | Amrit Kaur Rooprai |
| Role | Controller, sole trader and accountable owner |
| Manifest version published | 3.0 |
| Suite-wide gates closed | ______ of 13 |
| Document rows signed | ______ of 10 |
| Hashes recomputed and verified? | ☐ Yes, on ____________ · ☑ **No** |
| Release Control Matrix row signed? | ☐ Yes, on ____________ · ☑ **No** |
| **PUBLICATION APPROVED** | ☐ **Yes**, effective ____________ · ☑ **No** |
| Signature | ______________________ |
| Date | ______________________ |

**Reviewed by:** Sashank (deputy) — Signature ______________________  Date ______________

---

## 8. Publication log

Completed only when a document is actually published.

| Document | Version | Hash | Published on | Withdrawn on | Approved by |
|---|---|---|---|---|---|
| *(none published)* | | | | | |
