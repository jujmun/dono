# Publication blockers — live-terms v3.0

**Prepared:** 7 August 2026
**Applies to:** the 27 artifacts in [`../live-terms/`](../live-terms/)
**Read with:** [`../suites/v3.0/publication-package/BETA_DOCUMENT_MANIFEST.md`](../suites/v3.0/publication-package/BETA_DOCUMENT_MANIFEST.md)

The files in `../live-terms/` contain no internal material and are technically
deployable. They are **not release-authorised**. This document records what
changed during rendering and what must still be true before anything is served.

---

## 1. Edits applied at source — APPROVAL REQUIRED

Six edits changed words rather than merely removing internal material. All are
applied in `../suites/v3.0/public/`, so source and published copy stay
byte-comparable. **None has been approved.**

Each of the first three exists because the source relied on the **Student
Campaign Terms**, which the manifest excludes from the beta and which must not
be presented, served, linked or referenced as applicable.

### 1.1 Society Campaign Terms 4.1 → new clause 4.1A

**Problem.** Clause 4.1 required evidence to be redacted "as required by clause
7.2 of the Student Campaign Terms". A Responsible Representative accepting these
Terms was bound by an obligation in a document they cannot read.

**Fix.** The text of Student Campaign Terms clause 7.2 is inlined as new clause
**4.1A**; 4.1 now points to it. Substance unchanged; "you" became "the
Responsible Representative".

### 1.2 Society Campaign Terms 5.1 → clauses 5.1 and 5.2

**Problem.** Clause 5.1 said "Clause 8 of the Student Campaign Terms applies"
and then paraphrased it. Same incorporation-by-reference failure.

**Fix.** Split into **5.1 (funded property)** and **5.2 (disposal)** using the
operative wording of Student Campaign Terms clause 8, keeping the
Society-specific sentence that proceeds may not be retained by an individual
officer. No clause 5.2 previously existed, so nothing renumbered. No other
document cross-references Society Campaign Terms clause 5.

### 1.3 Verification Notice — opening callout

**Was:** "The operative obligations sit in the Student and Society Campaign
Terms." **Now:** "…sit in the Society Campaign Terms." The Student Campaign
Terms are not published, so the original sent readers to a document that does
not exist.

### 1.4 Terms of Service 1.4(c) — signpost added

Clause 1.4(c) read as an operative statement that the Student Campaign Terms
apply. Added: "**Individual Campaigns are not available at present and the
Student Campaign Terms are not operative — see clause 4.8;**" Clause 4.8 already
said this, but only for readers who got that far.

### 1.5 and 1.6 Plain English for two engineering phrases

The ToS header and clause 4.8 said individual Campaigns are "disabled at the API
boundary" and that "their routes are disabled". Accurate internally, meaningless
to a donor. Now: "cannot currently be created or donated to" and "cannot
currently be created, published or donated to". No change in meaning.

### Why 1.1 to 1.4 matter legally

Under **Consumer Rights Act 2015 s68** a consumer-facing term must be
transparent — plain, intelligible and legible. A term incorporated from a
document the consumer cannot obtain is vulnerable on both transparency and
incorporation grounds. Student officers accepting the Society Campaign Terms are
plausibly consumers, and clause 1.6 already limits their liability in a way that
depends on prominent disclosure working.

---

## 2. Remaining references to the Student Campaign Terms — RETAINED

Four remain in `terms-of-service.md`: clause 1.4(c) (now signposted), the clause
1.7 precedence table, the definition of "Student", and clause 4.8. Retained by
decision, on the basis that clause 4.8 expressly states beta is Society-only and
that the Student Campaign Terms are not operative.

**Residual risk.** A strict reading of the manifest — "must not be … referenced
as applicable" — is arguably still breached by the precedence table, which lists
the Student Campaign Terms as governing "the obligations of an individual student
Campaign Owner" with no qualifier.

---

## 3. Documents on the manifest that are not published

| # | Document | Status |
|---|---|---|
| 9 | **Child-friendly privacy layer** | **DRAFTED, NOT APPROVED** — [`../suites/v3.0/public/10_dono_child_friendly_privacy_layer_v3.0.md`](../suites/v3.0/public/10_dono_child_friendly_privacy_layer_v3.0.md) |

Required by **ICO Children's Code Standard 4 (transparency)**. Community
Guidelines clause 1.3 and the Privacy Notice both acknowledge that public
campaign pages can be viewed by people of any age, which is what engages the
standard. It is drafted but deliberately **not rendered into `../live-terms/`**,
because unapproved copy must not sit in a servable location.

It should be reviewed against the **ICO Children's Code assessment**, which
`TODO.md` records as still outstanding. The draft makes claims about Dono's
behaviour that inherit every dependency in section 4 below.

---

## 4. Claims in the live copy that depend on unbuilt controls

Each row states something as current fact. The checklist records the underlying
control as **Not started** — 174 of 179 items are, 31 of them P0-PUB.

Publishing a notice that misdescribes actual processing is the publication
incident the manifest calls **DPIA risk L-22**: the disclosed processing would
not be the assessed processing.

### 4.1 Terms of Service

| Claim | Outstanding |
|---|---|
| Clause 13.2 — Dono may instruct the Payment Provider to reverse a charge | Refund mandate built and tested; solicitor confirmation on the payments perimeter |
| Fee schedule fixed when the Campaign is approved | Not yet locked to Campaign |

### 4.2 Society Campaign Terms

| Claim | Outstanding |
|---|---|
| Clause 1.6 limited recourse | Must be served as a **separate active tick**, wording and version stored |
| Clause 6 succession | Replacement-account succession with **no balance-transfer path** |

### 4.3 Donor Terms

| Claim | Outstanding |
|---|---|
| Clause 2.2 — 18-or-over confirmation at checkout | Real confirmation built and stored (AG-01, CH-04) |
| Clause 7.1 — exact checkout total shown before confirmation | PF-03 |
| Clause 3.3 — payment cannot proceed without the "You're donating to" panel | Not built |

### 4.4 Community Guidelines

| Claim | Outstanding |
|---|---|
| Clause 8 complaints and appeals, with stated clocks | All eight Online Safety acceptance tests |
| Clause 8.8 — full moderation audit logging | Not built |

### 4.5 Refund and Dispute Policy

| Claim | Outstanding |
|---|---|
| Dono determines refunds and may execute them | Refund mandate, dispute state machine, surplus ledger (RF-01 to RF-08) |
| Reverse-chronological surplus allocation | Fairness under CRA 2015 s62 unconfirmed |

### 4.6 Verification Notice — cheapest to fix

| Claim | Outstanding |
|---|---|
| "Dono shows no badges, ticks or 'verified' labels anywhere" | **EL-05** — remove every trust indicator |
| Dono never receives or stores an identity document | **EL-07** — remove `idDocumentStorageId` and the admin viewer, delete stored documents |
| Verified name and date of birth have a retention period | **EL-08** — they currently persist indefinitely and survive account deletion |
| Student cards are not collected | Student-card collection must be removed |

`TRUTH.md` records EL-07's target state as "APPROVED — NOT YET IMPLEMENTED" and
notes explicitly that while Dono stores government identity documents, **the
Verification Notice and Privacy Notice are untrue.**

### 4.7 Privacy Notice

| Claim | Outstanding |
|---|---|
| Stated retention periods are enforced | Retention and deletion audit jobs not running |
| Rejected receipts quarantined and auto-deleted | Not built |
| Campaign pages archived and de-indexed after 24 months | Not built |
| Consent timestamp and version recorded; immediate withdrawal | Not built |
| PostHog and Google act under Article 28 terms | **Not recorded — see §5** |
| Hosting transfers assessed | **Vercel Transfer Risk Assessment not completed** |
| Backup retention | Not verified |

### 4.8 Cookie Notice

| Claim | Outstanding |
|---|---|
| "It is not loaded at all unless you accept it" | Clean-browser desktop and mobile audit |
| Withdrawal as easy as consent | Immediate withdrawal and downstream revocation not built |
| Session replay is off | **CK-07** — the client disables it but **the project still has recording enabled** |
| 12-month analytics retention | Not set; enforcement not enabled |

### 4.9 Complaints Policy

| Claim | Outstanding |
|---|---|
| Appeals decided by someone other than the original decision-maker | Appeals workflow with reviewer separation not built |

---

## 5. The Google mailbox may have no Article 28 terms to record

The DPA register lists the Google support mailbox as **BLOCKING** and asks
someone to "identify the exact Google product and terms applying to the
account".

Every published document gives **`joindono.team@gmail.com`** as the single
address for questions, complaints, appeals, reports, privacy requests, rights
requests and legal notices. That is a **consumer Gmail address**. Google's data
processing terms are offered for Workspace and Cloud, not for free consumer
Gmail accounts.

If that is right, the register item cannot be closed as written — there is no
DPA to accept. Personal data of data subjects, including special category data
arriving in rights requests and complaints, is flowing through a mailbox with no
Article 28 terms, no defined sub-processor position and no documented transfer
mechanism.

**Worth confirming early.** The likely fix is migrating to Google Workspace on a
custom domain, which also removes a `@gmail.com` address from the face of every
legal document. Changing the published contact address means re-versioning all
nine documents, so it is cheaper to decide before publication than after.

---

## 6. Suite-wide conditions still outstanding

From manifest §5.1 — rendering satisfies none of these:

1. Every document approved and signed — **approval register unsigned**
2. Hashes re-computed at publication
3. Immutable version archive at a stable address (CH-06)
4. Acceptance records capturing identifier, role, campaign, **document versions
   and hashes**, timestamp and event (CH-05)
5. Guest acceptance linked to their donation (CH-14)
6. On-screen confirmation and durable copy delivered (CH-07, CH-08)
7. Product serves the release-authorised artifact, not the draft stub (CH-15)
8. Release Control Matrix row signed
9. Individual Campaign routes disabled and **negative-tested** (CR-00)
10. Child-friendly privacy layer approved (§3)

---

## 7. Ordering

`TODO.md` gate 0 flags three reachable payment paths that would produce unlawful
or contractually false behaviour if used, and live payment keys are already
enabled. **Those outrank everything here.**

After that, in rough order of cost:

1. Approve or revise the six edits in §1.
2. Settle the Google mailbox question in §5 — it may force a contact-address
   change across all nine documents, so decide before publication.
3. Close the Verification Notice items in §4.6. Three of the four are product
   *removals*, and `TRUTH.md` already records two notices as untrue until EL-07
   lands.
4. Flip the PostHog project session-replay setting (CK-07) — a console toggle.
5. Record the PostHog Article 28 terms; complete the Vercel transfer assessment.
6. Complete the ICO Children's Code assessment, then approve the child-friendly
   layer against it.
7. Build the refund mandate, then acceptance and consent records.
8. Re-render, re-verify, re-hash, sign the approval register, pin the release.
