# Publication blockers and change record — live-terms v3.0

**Prepared:** 7 August 2026
**Applies to:** the nine files in this folder
**Read with:** [`../suites/v3.0/publication-package/BETA_DOCUMENT_MANIFEST.md`](../suites/v3.0/publication-package/BETA_DOCUMENT_MANIFEST.md)

The files in this folder contain no internal material and are technically
deployable. This document records (1) the three substantive edits made during
rendering, and (2) everything that must still be true before they are served.

---

## 1. Substantive edits made during rendering — APPROVAL REQUIRED

Three edits changed words rather than merely removing internal material. Each
exists because the source relied on the **Student Campaign Terms**, which the
manifest excludes from the beta and which must not be presented, served, linked
or referenced as applicable.

### 1.1 Society Campaign Terms clause 4.1 — evidence redaction

**Problem.** Clause 4.1 required evidence to be redacted "as required by clause
7.2 of the Student Campaign Terms". A Responsible Representative accepting these
Terms would have been bound by an obligation in a document they cannot read.

**Fix.** The text of Student Campaign Terms clause 7.2 is now inlined as a new
**clause 4.1A**, and 4.1 points to it. Wording is carried across substantively
unchanged; only "you" became "the Responsible Representative".

**Assess:** whether a new clause number 4.1A is acceptable, or whether the
Society Campaign Terms should be renumbered at source instead.

### 1.2 Society Campaign Terms clause 5.1 — funded property and disposal

**Problem.** Clause 5.1 said "Clause 8 of the Student Campaign Terms applies"
and then paraphrased it. Same incorporation-by-reference failure.

**Fix.** Split into **clause 5.1 (funded property)** and **clause 5.2
(disposal)**, using the operative wording of Student Campaign Terms clause 8,
retaining the Society-specific sentence that proceeds may not be retained by an
individual officer. No clause 5.2 previously existed, so no renumbering cascade.
No other document cross-references Society Campaign Terms clause 5.

### 1.3 Verification Notice — opening callout

**Problem.** The callout read "The operative obligations sit in the Student and
Society Campaign Terms." The Student Campaign Terms are not published, so this
directed the reader to a non-existent document.

**Fix.** Narrowed to "The operative obligations sit in the Society Campaign
Terms."

### Why this matters legally

Under **Consumer Rights Act 2015 s68** a consumer-facing term must be
transparent — expressed in plain, intelligible language and, if written,
legible. A term incorporated from a document the consumer cannot obtain is
vulnerable on both transparency and incorporation grounds. Student officers
accepting the Society Campaign Terms are plausibly consumers, and clause 1.6
already limits their liability in a way that depends on prominent disclosure
working correctly.

> **These three edits need sign-off before publication.** They should ideally be
> made at source in `../suites/v3.0/public/` and re-rendered, so that source and
> published copy stay byte-comparable.

---

## 2. Terms of Service references to Student Campaign Terms — RETAINED

Four references remain in `terms-of-service.md`: clause 1.4(c), the clause 1.7
precedence table, the definition of "Student", and clause 4.8.

These were retained by decision. Clause 4.8 expressly states that beta supports
Society Campaigns only, that individual Campaign routes are disabled, and that
the Student Campaign Terms "are not presented as operative beta terms."

**Residual risk.** A strict reading of the manifest ("must not be … referenced
as applicable") is arguably breached by clause 1.4(c), which reads as an
operative statement of which documents apply. Clause 4.8 cures this only if the
reader reaches it. **Consider whether clause 1.4(c) should carry an inline
cross-reference to clause 4.8.**

---

## 3. Documents on the manifest that do not exist

| # | Document | Status |
|---|---|---|
| 9 | **Child-friendly privacy layer** | **NOT DRAFTED — publication blocker** |

Required by **ICO Children's Code Standard 4 (transparency)**. Dono's own
Community Guidelines clause 1.3 and Privacy Notice acknowledge that public
campaign pages can be viewed by people of any age, which is what engages the
standard. Publishing the adult Privacy Notice alone does not satisfy it.

---

## 4. Claims in the live copy that depend on unbuilt controls

Each row states something as current fact in the published copy. The manifest
records the underlying control as outstanding. **Publishing a notice that
misdescribes actual processing is the publication incident the manifest calls
DPIA risk L-22** — the disclosed processing would not be the assessed
processing.

### 4.1 Terms of Service

| Claim in live copy | Outstanding condition |
|---|---|
| Clause 13.2 refund mandate — Dono may instruct the Payment Provider to reverse a charge | Refund mandate built and tested; solicitor confirmation on the payments perimeter |
| Fee schedule locked to Campaign | Not yet locked |

### 4.2 Society Campaign Terms

| Claim in live copy | Outstanding condition |
|---|---|
| Clause 1.6 limited recourse | Must be served as a **separate active tick**, with wording and version stored |
| Clause 6 succession | Replacement-account succession implemented with **no balance-transfer path** |

### 4.3 Donor Terms

| Claim in live copy | Outstanding condition |
|---|---|
| Clause 2.2 — 18-or-over confirmation at checkout | Real confirmation built and stored |
| Clause 7.1 — exact checkout total shown before confirmation | Not yet built |
| Clause 3.3 — "You're donating to" panel blocks payment until shown | Not yet built |

### 4.4 Community Guidelines

| Claim in live copy | Outstanding condition |
|---|---|
| Clause 8 complaints and appeals framework, with stated clocks | All eight Online Safety acceptance tests must pass |
| Clause 8.8 — full moderation audit logging | Not yet built |

### 4.5 Refund and Dispute Policy

| Claim in live copy | Outstanding condition |
|---|---|
| Dono determines refunds and may execute them | Refund mandate, dispute state machine and surplus ledger all outstanding |
| Reverse-chronological surplus allocation | Fairness under CRA 2015 s62 not yet confirmed by solicitor |

### 4.6 Verification Notice

| Claim in live copy | Outstanding condition |
|---|---|
| "Dono shows no badges, ticks or 'verified' labels anywhere" | All trust indicators must be removed from the product |
| Dono does not collect identity documents | Dono's identity-document upload and admin viewer must be removed |
| Retention of verified name and date of birth | Retention and deletion cascade not yet built |
| Student-card collection | Must be removed |

### 4.7 Privacy Notice

| Claim in live copy | Outstanding condition |
|---|---|
| Stated retention periods are enforced | Retention enforcement and deletion audit jobs not yet running |
| Rejected receipts quarantined and auto-deleted | Not yet built |
| Campaign pages archived and de-indexed after 24 months | Not yet built |
| Consent timestamp and version recorded; immediate withdrawal | Not yet built |
| PostHog and Google act under Article 28 terms | **Terms not yet recorded** |
| Hosting transfers assessed | **Vercel Transfer Risk Assessment not completed** |
| Backup retention period | Not yet verified |

### 4.8 Cookie Notice

| Claim in live copy | Outstanding condition |
|---|---|
| "Analytics is not loaded at all unless you accept it" | Clean-browser desktop and mobile audit outstanding |
| Consent as easy to withdraw as to give | Immediate withdrawal and downstream revocation not built |
| Session replay | **Must be switched off at project level** |
| 12-month analytics retention | Retention must be set and enforcement enabled |

### 4.9 Complaints Policy

| Claim in live copy | Outstanding condition |
|---|---|
| Appeals decided by someone other than the original decision-maker | Appeals workflow with reviewer separation not yet built |

---

## 5. Suite-wide conditions still outstanding

From manifest §5.1 — none of these are satisfied by rendering these files:

1. Every document approved and signed — **approval register unsigned**
2. Hashes re-computed at publication
3. Immutable version archive at a stable address
4. Acceptance records capturing identifier, role, campaign, **document versions
   and hashes**, timestamp and event
5. Guest acceptance linked to their donation
6. On-screen confirmation and durable copy delivered
7. Product serves the release-authorised artifact, not a draft stub
8. Release Control Matrix row signed
9. Individual Campaign routes disabled and **negative-tested at the API
   boundary**
10. Child-friendly privacy layer drafted and approved (§3 above)

---

## 6. Recommended order of work

1. Approve or revise the three edits in §1, preferably at source.
2. Draft the child-friendly privacy layer (§3).
3. Close the Verification Notice items in §4.6 — several are product removals
   rather than builds, so they are the cheapest way to stop the copy being
   inaccurate.
4. Record the Article 28 terms and complete the transfer assessment (§4.7) —
   paperwork, not engineering.
5. Build the refund mandate, then the acceptance and consent records.
6. Re-render from source, re-hash, sign the approval register, pin the release.
