# Publication handoff

Control documents for the legal copy the product serves. **Nothing in this
folder is public.** The servable documents are in
[`../live-terms/`](../live-terms/), which contains public-facing files only.

## Start here

1. [`PUBLICATION_BLOCKERS.md`](PUBLICATION_BLOCKERS.md) — every reason the copy
   in `../live-terms/` is not yet release-authorised, plus the record of edits
   made during rendering.
2. [`../live-terms/manifest.json`](../live-terms/manifest.json) — machine-readable
   index: document ID, title, version, effective date, paths and the SHA-256 of
   each Markdown, HTML and PDF artifact.

## What is in live-terms

Nine documents, each rendered three ways from the same source:

| Document | Slug |
|---|---|
| Terms of Service | `terms-of-service` |
| Society Campaign Terms | `society-campaign-terms` |
| Donor Terms | `donor-terms` |
| Community Guidelines | `community-guidelines` |
| Refund and Dispute Policy | `refund-and-dispute-policy` |
| Verification Notice | `verification-notice` |
| Privacy Notice | `privacy-notice` |
| Cookie Notice | `cookie-notice` |
| Complaints Policy | `complaints-policy` |

`.md` is the clean public source, `.html` is for in-product display, `.pdf` is
the durable copy. A tenth manifest document — the **child-friendly privacy
layer** — is drafted at
[`../suites/v3.0/public/10_dono_child_friendly_privacy_layer_v3.0.md`](../suites/v3.0/public/10_dono_child_friendly_privacy_layer_v3.0.md)
but is **not** rendered to `live-terms`, because it has never been approved.

## The pipeline

Source lives in [`../suites/v3.0/public/`](../suites/v3.0/public/) and is the
only place legal meaning may change. Rendering strips approval blocks,
signature tables, status lines, solicitor-review notes, repository paths and
engineering references, then emits Markdown, HTML and PDF plus hashes.

A verification pass then re-reads all 27 artifacts — including the extracted
text layer of every PDF — and fails on any forbidden phrase, checklist ID,
signature rule, approval checkbox or hash mismatch. **Run it before any
release.** It is the control that would have caught the incident below.

## Incident: raw source was rendered and hashed for serving

On 7 August 2026 a parallel rendering run produced `legal/live-versions/3.0/`
containing HTML, PDF and a `manifest.json` for all nine documents, generated
directly from the unmodified source files. Those artifacts published:

- "This block is unsigned. This document is prepared for approval and is not
  approved.";
- the approver name, role and blank signature lines;
- **"Solicitor review outstanding on …"**, enumerating the exact clauses Dono
  believes may be unenforceable — including the refund mandate and payments
  perimeter, the Society contracting model, and the liability caps;
- internal repository paths and the engineering checklist filename.

The solicitor-review line is the most damaging. It is a list of Dono's own
perceived legal weaknesses, and publishing it hands that list to any
counterparty in a dispute. It may also be legally privileged; publishing it
would waive that privilege.

Those files were shaped exactly like a document registry expects to consume
(`manifest.json` with per-document hashes and `document.html` / `document.pdf`
paths), so they were primed to be served by checklist item CH-18.

**Action taken:** `live-terms` was rebuilt from the same source through the
stripping pipeline and verified clean; `live-versions` is to be deleted.
**Do not restore it.** If HTML or PDF is needed, re-render through the pipeline
so the verification gate runs.

## Rules

1. **Legal meaning changes at source only**, in `../suites/v3.0/public/`. Never
   edit `../live-terms/` by hand — it is generated output.
2. **Never render straight from source to a servable location.** The stripping
   and verification steps are the only thing standing between the approval
   blocks and the public.
3. **Re-hash at publication.** Hashes in `manifest.json` are provisional until
   the release is authorised.
4. **Never overwrite a published version.** New version, new folder, new hashes;
   superseded versions stay retrievable at a stable address.
5. **The version in force when a user accepted governs that transaction.**
6. **Fail closed.** If a required document is missing, unknown or
   hash-mismatched, the affected account creation, Society onboarding or
   donation must not proceed.
