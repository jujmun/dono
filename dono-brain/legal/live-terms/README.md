# Live terms — public-facing legal documents

**Contains:** the nine v3.0 public documents, rendered as deployable public copy.
**Version:** 3.0 · **Effective:** 7 August 2026
**Canonical source:** [`../suites/v3.0/public/`](../suites/v3.0/public/)

These are the exact documents the website serves. Every file here is stripped of
internal material and is safe to publish as-is.

## What is here

| File | Type | Route suggestion |
|---|---|---|
| [`terms-of-service.md`](terms-of-service.md) | Contractual | `/legal/terms` |
| [`society-campaign-terms.md`](society-campaign-terms.md) | Contractual | `/legal/society-campaign-terms` |
| [`donor-terms.md`](donor-terms.md) | Contractual | `/legal/donor-terms` |
| [`community-guidelines.md`](community-guidelines.md) | Contractual (clauses 7–8 open to anyone) | `/legal/community-guidelines` |
| [`refund-and-dispute-policy.md`](refund-and-dispute-policy.md) | Contractual | `/legal/refunds` |
| [`verification-notice.md`](verification-notice.md) | Notice | `/legal/verification` |
| [`privacy-notice.md`](privacy-notice.md) | Notice | `/legal/privacy` |
| [`cookie-notice.md`](cookie-notice.md) | Notice | `/legal/cookies` |
| [`complaints-policy.md`](complaints-policy.md) | Public policy | `/legal/complaints` |

A tenth document — the **child-friendly privacy layer** required by ICO
Children's Code Standard 4 — is on the manifest but has never been drafted. It
is not here because it does not exist. See
[`PUBLICATION_BLOCKERS.md`](PUBLICATION_BLOCKERS.md).

## What was removed from the source

Approval blocks and signature tables; "Not approved" and "not yet published"
status lines; solicitor-review-outstanding notes; version-control tables naming
the preparer and reviewer; internal repository paths; and every reference to the
engineering implementation checklist, moderation requirements, traceability
matrix and publication package.

Substantive legal text was not changed, except for the three edits recorded in
[`PUBLICATION_BLOCKERS.md`](PUBLICATION_BLOCKERS.md) §1, which exist because the
source incorporated clauses from a document that is not published during the
beta.

## Before these go live

**Read [`PUBLICATION_BLOCKERS.md`](PUBLICATION_BLOCKERS.md) first.** These files
are publication-*ready* in the sense that nothing internal remains in them. They
are not publication-*approved*: the approval register in
[`../suites/v3.0/publication-package/`](../suites/v3.0/publication-package/) is
still unsigned, and several statements in this copy describe controls that the
manifest records as not yet built.

## Rules for this folder

1. **Do not edit these files to change legal meaning.** Amend the source in
   [`../suites/v3.0/public/`](../suites/v3.0/public/), then re-render.
2. **Do not add a draft, convenience copy or fallback document here.** Every
   file in this folder is servable copy.
3. **Never overwrite a published version.** A new version gets a new folder and
   a new hash; the superseded version stays retrievable at a stable address.
4. **The version in force when a user accepted governs that transaction**,
   whatever is published later.
5. Hash each file at publication and pin the hashes to the release. If a
   document is missing, unknown or hash-mismatched, the affected account
   creation, Society onboarding or donation must not proceed.
