# Superseded Version Archive

**Version:** 3.0
**Version date:** 7 August 2026
**Owner:** Amrit Kaur Rooprai · **Deputy:** Sashank
**Location:** `legal/terms/`
**Status:** Archive index. **Complete and verified as at 7 August 2026.**

---

## 1. The archive rule

> **A superseded version is never overwritten, edited or deleted.**

Four reasons, each independently sufficient:

1. **The version in force at the time of acceptance governs that transaction.** If a user accepted v2.3 of the Donor Terms, v2.3 is what binds them, whatever is published later. Destroying it destroys the contract.
2. **Accountability.** Article 5(2) UK GDPR requires Dono to demonstrate compliance, which includes demonstrating what it told people at the time.
3. **Evidence.** A refund dispute, a moderation appeal or a regulatory enquiry turns on what the documents said then, not now.
4. **Reasoning is not noise.** The earlier versions carry the analysis and the corrections that produced the current position. Deleting them would lose why the current position is what it is.

Every folder below is retained **unaltered**. Nothing in the v3.0 consolidation modified any archived file.

---

## 2. Archive index

| Folder | Version | Date | Files | Character |
|---|---|---|---|---|
| `../v1/` | 1.0 | 27 July 2026 | 9 | First complete public suite. Nine public-facing documents; no governance records |
| `../v2/` | 2.0 | 30 July 2026 | 11 | Adds the first change log and the forms and assessments task list |
| `../v2.1/` | 2.1 | 31 July 2026 | 25 | **First governance suite.** DPIA, ROPA, LIAs, DPA register, transfer assessment, risk assessments, complaints and incident procedures |
| `../v2.2/` | 2.2 | 6 August 2026 | 30 | **The factual-correction release.** Controller corrected to the actual legal person; Stripe's role split by activity; verification model corrected; engineering moderation and traceability documents added |
| `../v2.3/` | 2.3 | 6 August 2026 | 39 | **The amendment-block release.** Amendment blocks placed at the head of twelve documents; Appropriate Policy Document rebuilt; CSEA, Article 14, institutional referral, geographic scope, wind-down and contributor agreement added; engineering pack established |
| `../archive-loose/` | mixed | 31 July 2026 | 3 | Three loose documents that sat at the repository root outside any version folder. Retained rather than discarded because their provenance is unclear and they may have been served |

**Total archived files: 120.** SHA-256 for each is in `ARCHIVE_HASHES.tsv`.

---

## 3. What changed at each version, in one line each

| Version | The one thing that mattered |
|---|---|
| **1.0** | The suite existed |
| **2.0** | Change control began |
| **2.1** | Governance records existed for the first time — the suite stopped being only public-facing |
| **2.2** | The documents started describing the product that exists, rather than the product that was imagined |
| **2.3** | Corrections were made by amendment block rather than rewriting, so the reasoning was preserved but the documents became hard to read as statements of the current position |
| **3.0** | **The amendment blocks were resolved into clean documents that state only the current position** |

---

## 4. Why v3.0 exists

By v2.3, twelve documents carried an amendment block at the top saying, in effect: *"where the body below conflicts with this block, this block prevails."* That was the right call at the time — it preserved the reasoning and the evidence rather than silently rewriting history.

But it produced documents that could not be published or acted on without reading two conflicting accounts and working out which won. In several places the body still described processing that had been removed — student cards, recurring donations, matched funding, Dono-held identity documents — corrected only by a block many pages away.

**v3.0 resolves every amendment into the body.** Each document now states one position: the current one. The reasoning that produced it lives here, in the archive.

**Three documents were substantively re-performed rather than consolidated**, because their v2.3 amendment blocks expressly required it:

- the **Illegal Content Risk Assessment**, re-scored against evidenced controls only;
- the **Children's Risk Assessment**, re-scored with age bands, child journeys, and separate likelihood and severity reasoning; and
- the **Society Onboarding and Succession Forms**, reissued as clean replacement forms, because the v2.3 block directed that the carried-forward v2.2 form text must not be implemented.

**Two documents were created**: the **ICO fee self-assessment** and the **CSEA legal-readiness checklist**. **One was materially corrected**: the **ICO Children's Code assessment**, which had been written on the premise that under-18s may donate — a premise the settled position contradicts.

---

## 5. Retrieval

| Need | Where to look |
|---|---|
| What a user accepted on a given date | The version folder in force on that date, then the specific document |
| Why a rule is as it is | The change log in the version that introduced it, then the amendment block in `../v2.3/` if applicable |
| The corrections that produced the current facts | `../v2.2/` change log — the factual-correction release |
| What was amended and why at v2.3 | The amendment block at the head of each `../v2.3/` document |
| Verification that an archived file is unaltered | `ARCHIVE_HASHES.tsv` |

**Verify with** `shasum -a 256 <file>` and compare against `ARCHIVE_HASHES.tsv`.

---

## 6. Relationship to the published archive

**This repository archive is not the same thing as the published version archive** required by checklist CH-06.

| | Repository archive (this) | Published archive (CH-06) |
|---|---|---|
| **Contains** | Every draft and version, including unpublished ones | Only versions actually **published** to users |
| **Audience** | Dono, its advisers and regulators | Users, at a permanent public address |
| **Purpose** | Drafting history and accountability | Proving what a user accepted |
| **Status** | **Complete** | **Not built** — a publication blocker |

**No version in this repository has been published to users.** The published archive begins empty and receives its first entry when the v3.0 suite is approved and published.

---

## 7. Rules going forward

1. **Never edit a file in a version folder.** If something in an archived version is wrong, that is a fact about the past, recorded not corrected.
2. **A new version means a new folder**, not edits to the old one.
3. **Hash on creation.** Every new version folder gets its hashes recorded before anything else happens.
4. **Never delete a version folder**, including on wind-down. The wind-down plan must preserve this archive for the longest applicable retention period — six years from the last transaction the documents governed.
5. **The loose archive stays.** `../archive-loose/` is retained precisely because its provenance is unclear.

---

## 8. Approval block — SIGNATURE REQUIRED

> **This block is unsigned.**

**I confirm that every superseded version is retained unaltered, that the hashes in `ARCHIVE_HASHES.tsv` were computed over those files, and that no archived file was modified during the v3.0 consolidation.**

| Field | Entry |
|---|---|
| Approver name | Amrit Kaur Rooprai |
| Role | Controller, sole trader and accountable owner |
| Version approved | 3.0 |
| Archived versions | 6 folders, 120 files |
| Any archived file modified during consolidation? | **No** |
| Signature | ______________________ |
| Date | ______________________ |

**Reviewed by:** Sashank (deputy) — Signature ______________________  Date ______________
