# bin — staged for deletion, not yet deleted

Nothing here is in use. It is parked for you to evaluate before removing it.
**Do not serve anything in this folder and do not restore it to `../live-terms/`.**

## `live-versions/`

A rendering of all nine v3.0 legal documents — `source.md`, `document.html` and
`document.pdf` each, plus a `manifest.json` with per-document hashes — generated
on 7 August 2026 **directly from the unmodified source files**.

**Why it is here:** the HTML and PDF publish internal material. Verified present
in `live-versions/3.0/terms_of_service/document.html` and its PDF:

- "This block is unsigned. This document is prepared for approval and is not
  approved."
- the approver's name, role and blank signature lines
- **"Solicitor review outstanding on | Refund mandate (clause 13.2) and the
  payment-services perimeter; Society contracting model; consumer status of
  student Campaign Owners; liability caps in clause 27.3(b)–(c); Consumer
  Contracts Regulations position"**
- internal repository paths and the engineering checklist filename

The solicitor-review line is the serious one. It is a list of the clauses Dono
believes may be unenforceable. Publishing it hands that list to any counterparty
in a dispute, and it may be privileged — publishing would waive that privilege.

The layout matched what a document registry expects to consume (`manifest.json`
with hashes, `document.html` / `document.pdf` paths), so these files were shaped
to be served by checklist item CH-18.

**Before deleting,** worth keeping if you want: the folder layout and
`manifest.json` schema are a reasonable design, and the rendering approach was
sound. Only the input was wrong — it skipped the stripping step. The replacement
pipeline reuses the same idea and adds a verification gate.

**Superseded by:** [`../live-terms/`](../live-terms/), rebuilt from the same
source through a stripping pipeline and verified clean across all 27 artifacts.

## `live-terms-README-superseded.md` and `live-terms-PUBLICATION_BLOCKERS-superseded.md`

Two internal control documents I put in `live-terms/` earlier in the session,
before the rule that the folder holds public-facing documents only. They were
overwritten with pointer stubs and moved here, so these files are now just those
stubs — the real content is at
[`../publication-handoff/`](../publication-handoff/) and is more complete than
what they replaced. **Safe to delete.**

## Deleting

```
rm -rf legal/bin
```
