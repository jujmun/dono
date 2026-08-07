# Operative Society-Only Beta Document Manifest

**Version:** 3.0
**Version date:** 7 August 2026
**Effective from:** on publication approval
**Owner:** Amrit Kaur Rooprai · **Deputy:** Sashank
**Status:** **Not approved for publication.** Prepared for signature.

---

## 1. What this manifest is

**This is the authoritative list of documents the product may serve during the Society-only beta.**

Three rules govern it:

1. **The product serves only what this manifest lists.** A document not on this manifest must not be displayed, linked, referenced as applicable, or made acceptable anywhere in the product.
2. **The product serves only the exact versions this manifest pins**, at the exact hashes recorded in `DOCUMENT_HASHES.md`.
3. **A release is not approved until its Release Control Matrix row links the deployment and commit to a specific version of this manifest.**

Serving a document not on the manifest, or a different version of one that is, is a **publication incident**. It means the disclosed processing is not the assessed processing, which is DPIA risk L-22.

---

## 2. Operative documents — the beta suite

These ten documents are the operative suite. Every one is **currently unpublished** and gated on the approval and build conditions in section 5.

### 2.1 Contractual

| # | Document | File | Version | Applies to |
|---|---|---|---|---|
| 1 | **Terms of Service** | `../01_dono_terms_of_service_v3.0.md` | 3.0 | Everyone who creates an account, donates, operates a Campaign or acts for a Society |
| 2 | **Society Campaign Terms** | `../03_dono_society_campaign_terms_v3.0.md` | 3.0 | A Society and its Responsible Representative |
| 3 | **Donor Terms** | `../04_dono_donor_terms_v3.0.md` | 3.0 | Every Donor, account holder or guest |
| 4 | **Community Guidelines** | `../05_dono_community_guidelines_v3.0.md` | 3.0 | Every account holder's content and conduct. Clauses 7 and 8 are open to **anyone, including non-users** |
| 5 | **Refund and Dispute Policy** | `../07_dono_refund_and_dispute_policy_v3.0.md` | 3.0 | Every Donation, Donor and Campaign Owner |

### 2.2 Notices — information, not contract

| # | Document | File | Version | Served |
|---|---|---|---|---|
| 6 | **Verification Notice** | `../06_dono_verification_notice_v3.0.md` | 3.0 | Publicly; before Society onboarding |
| 7 | **Privacy Notice** | `../08_dono_privacy_notice_v3.0.md` | 3.0 | Publicly; linked from every collection point |
| 8 | **Cookie Notice** | `../09_dono_cookie_notice_v3.0.md` | 3.0 | Publicly; linked from the consent banner |
| 9 | **Child-friendly privacy layer** | *to be drafted* | — | Publicly, alongside the Privacy Notice. **Required by ICO Children's Code Standard 4. NOT YET DRAFTED — a publication blocker** |
| 10 | **Complaints Policy** | `../dono-complaints-policy-v3.0.md` | 3.0 | Publicly; referenced from Terms of Service clause 33.1 |

---

## 3. Documents expressly EXCLUDED from the beta

### 3.1 Student Campaign Terms — future release

| Document | File | Status |
|---|---|---|
| **Student Campaign Terms** | `../02_dono_student_campaign_terms_v3.0.md` | **⚠ NOT OPERATIVE — MUST NOT BE SERVED** |

> **The Student Campaign Terms are future-release drafting.** They must not be presented, served, linked, referenced as applicable, or made acceptable during the Society-only beta.
>
> Individual Student Campaigns do not exist in the beta product. Campaign creation, publication and donation for an individual Campaign are **disabled at the API boundary** (checklist CR-00). Direct API tests must confirm that an individual Campaign cannot be created, published or donated to.
>
> **No acceptance record may reference this document.** No onboarding or checkout flow may display it. The document header carries the same warning.
>
> **Before it is ever served it must be:** re-reviewed against the then-current suite; re-approved; added to this manifest with a new hash; and the **DPIA, Children's Risk Assessment and Illegal Content Risk Assessment must each be revisited**, because individual Student Campaigns materially change the risk profile — personal-crisis narratives become far more likely, which affects the suicide and self-harm assessment at Illegal Content §4.5 and the child-exposure assessment at Children's C3.

### 3.2 Internal records — never served to users

The following are governance records. They are **not published**, not linked from the product, and not acceptable by any user. They are listed so that no one mistakes an internal record for a public document.

| Document | Purpose |
|---|---|
| `../dono-dpia-v3.0.md` | Data Protection Impact Assessment |
| `../dono-ropa-v3.0.md` | Article 30 record |
| `../dono-appropriate-policy-document-v3.0.md` | Article 9 / 10 condition mapping |
| `../dono-article-14-assessment-v3.0.md` | Article 14 assessment |
| `../dono-legitimate-interests-assessments-v3.0.md` | LIAs |
| `../dono-dpa-register-v3.0.md` | Provider and Article 28 register |
| `../dono-international-transfer-assessment-v3.0.md` | Chapter V assessments |
| `../dono-ico-fee-self-assessment-v3.0.md` | ICO fee determination |
| `../dono-ico-childrens-code-assessment-v3.0.md` | Children's Code assessment |
| `../dono-childrens-risk-assessment-v3.0.md` | OSA children's risk assessment |
| `../dono-illegal-content-risk-assessment-v3.0.md` | OSA illegal content risk assessment |
| `../dono-online-safety-procedures-v3.0.md` | OSA operating procedure |
| `../dono-csea-reporting-procedure-v3.0.md` | CSEA procedure |
| `../dono-csea-legal-readiness-checklist-v3.0.md` | CSEA readiness gate |
| `../dono-notice-and-action-procedure-v3.0.md` | Notice and action procedure |
| `../dono-dp-complaints-workflow-v3.0.md` | Data-protection complaints workflow |
| `../dono-society-onboarding-succession-forms-v3.0.md` | Form specifications |
| `../dono-refund-decision-checklist-v3.0.md` | Reviewer checklist |
| `../dono-evidence-review-and-closure-procedure-v3.0.md` | Evidence review procedure |
| `../dono-financial-crime-sanctions-policy-v3.0.md` | Financial crime and sanctions |
| `../dono-institutional-referral-protocol-v3.0.md` | Referral protocol |
| `../dono-incident-response-plan-v3.0.md` | Incident response |
| `../dono-geographic-scope-risk-assessment-v3.0.md` | Geographic scope |
| `../dono-fee-and-processing-cost-reference-v3.0.md` | Internal fee reference |
| `../dono-team-and-contributor-agreement-v3.0.md` | Contractor agreement template |
| `../dono-wind-down-plan-v3.0.md` | Wind-down plan |

> **The forms in `../dono-society-onboarding-succession-forms-v3.0.md` are a specification, not a served document.** The *wording* they specify is served, at the versions recorded in `CHECKOUT_DISCLOSURES_AND_ACCEPTANCE_WORDING.md`.

### 3.3 Features that must not be presented

No document, screen or copy may present any of the following, because none exists:

- individual Student Campaigns;
- recurring donations;
- matched funding or Match Windows;
- institutional data sharing;
- any verification, validation, eligibility or trust badge, tick, shield or "verified" label;
- a registered charity as a Connected Account holder;
- an error-monitoring product;
- Dono holding, pooling or delaying donation funds.

---

## 4. Precedence

Where documents conflict, the order is:

1. **Refund and Dispute Policy** — for refunds, surplus, disputes and chargebacks.
2. **Community Guidelines clause 8** — for complaints and appeals, across the whole suite.
3. **Privacy Notice** — for privacy and data protection.
4. **Cookie Notice** — for cookies and similar technologies.
5. **Society Campaign Terms** — for the Society relationship.
6. **Donor Terms** — for the Donor relationship.
7. **Terms of Service** — for everything else.

This mirrors Terms of Service clause 1.7. **A document may not be published with a precedence statement inconsistent with this list.**

---

## 5. Publication conditions

**No document on this manifest may be published until all of the following are true.**

### 5.1 Suite-wide conditions

| # | Condition | Status |
|---|---|---|
| 1 | Every document on the manifest is approved and signed | **Outstanding** |
| 2 | Hashes computed and recorded in `DOCUMENT_HASHES.md` | Computed; **re-computation required at publication** |
| 3 | The immutable version archive exists and superseded versions remain retrievable at a stable address (CH-06) | **Outstanding** |
| 4 | Acceptance records capture user or guest identifier, role, campaign, document versions **and hashes**, timestamp and event (CH-05) | **Outstanding** |
| 5 | A guest's acceptance is linked to their donation (CH-14) | **Outstanding** |
| 6 | On-screen confirmation and durable copy delivered (CH-07, CH-08) | **Outstanding** |
| 7 | The product serves the approved suite, not a draft stub (CH-15) | **Outstanding** |
| 8 | Release Control Matrix row signed, pinning deployment, commit, payment mode and this manifest version | **Outstanding** |
| 9 | Individual Campaign routes disabled and negative-tested (CR-00) | **Outstanding** |
| 10 | The child-friendly privacy layer is drafted and approved | **Outstanding** |

### 5.2 Document-specific conditions

| Document | Additional condition |
|---|---|
| **Terms of Service** | Refund mandate (clause 13.2) built and tested; fee schedule locked to Campaign; VAT references removed; solicitor confirmation on the payments perimeter |
| **Society Campaign Terms** | Limited-recourse disclosure served as a separate active tick with wording and version stored; replacement-account succession implemented with no balance-transfer path |
| **Donor Terms** | Real 18-or-over confirmation built and stored (AG-01, CH-04); exact checkout total shown before confirmation (PF-03) |
| **Community Guidelines** | All eight Online Safety acceptance tests passed |
| **Refund and Dispute Policy** | Refund mandate, dispute state machine and surplus ledger built (RF-01 to RF-08) |
| **Verification Notice** | Student-card collection removed; Dono's identity-document upload and admin viewer removed (EL-07); retention and deletion cascade for verified name and date of birth (EL-08); all trust indicators removed (EL-05) |
| **Privacy Notice** | Retention enforcement and deletion audit jobs running; receipt quarantine and auto-delete; campaign archival and de-indexing; consent timestamp and version recorded; privacy settings link and immediate withdrawal; **PostHog and Google Article 28 terms recorded**; **Vercel Transfer Risk Assessment completed**; backup period verified |
| **Cookie Notice** | Clean-browser desktop and mobile audit; consent timestamp and Notice version stored; immediate withdrawal and downstream revocation; **session replay off at project level**; retention set to 12 months with enforcement enabled |
| **Complaints Policy** | Appeals workflow built with reviewer separation (acceptance test 7) |

---

## 6. Change control

1. **Adding, removing or re-versioning a document on this manifest requires a new manifest version and a fresh publication approval.**
2. A new document version gets a **new hash**, recorded in `DOCUMENT_HASHES.md`. Hashes are never edited in place.
3. The **superseded version is never overwritten or deleted.** It moves to the archive and remains retrievable at a stable address (`SUPERSEDED_VERSION_ARCHIVE.md`).
4. **The version in force at the time of acceptance governs that transaction**, whatever is published later.
5. A **material** change requires active re-acceptance before the affected feature is available. **Continued use is never treated as acceptance** (Terms of Service clause 30.2(c), checklist CH-10).
6. Every manifest change is recorded in section 7.

---

## 7. Manifest change log

| Manifest version | Date | Change | Approved by |
|---|---|---|---|
| 3.0 | 7 August 2026 | Initial manifest. Ten operative documents; Student Campaign Terms expressly excluded | *(unsigned)* |

---

## 8. Approval block — SIGNATURE REQUIRED

> **This block is unsigned. No document on this manifest is approved for publication.**

**I confirm that this manifest lists every document the product may serve during the Society-only beta, that the Student Campaign Terms are excluded and must not be served, that the publication conditions in section 5 are outstanding, and that I approve this manifest.**

| Field | Entry |
|---|---|
| Approver name | Amrit Kaur Rooprai |
| Role | Controller, sole trader and accountable owner |
| Manifest version approved | 3.0 |
| Operative documents | 9 approved-and-listed + 1 to be drafted (child-friendly layer) |
| Student Campaign Terms excluded from beta? | **Yes — confirmed** |
| Publication approved? | ☐ Yes, on ____________ · ☑ **No** |
| Signature | ______________________ |
| Date | ______________________ |

**Reviewed by:** Sashank (deputy) — Signature ______________________  Date ______________
