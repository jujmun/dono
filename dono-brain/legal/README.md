# Legal

This domain contains Dono's versioned legal suites, legal analysis, reviews,
engineering inputs, generated artifacts and external reference material.

## Start here

1. [`STATUS.md`](STATUS.md) — legal lifecycle and publication status.
2. [`suites/v3.0/README.md`](suites/v3.0/README.md) — map of the current,
   content-ready source suite.
3. [`suites/v3.0/publication-package/BETA_DOCUMENT_MANIFEST.md`](suites/v3.0/publication-package/BETA_DOCUMENT_MANIFEST.md)
   — candidate documents and blockers for the Society-only beta.
4. [`../TRUTH.md`](../TRUTH.md) — the single company source of settled facts and
   decisions.

v3.0 is the current legal wording and is content-ready. Its Markdown files are
source files, not the display-ready documents users should receive. Legal text
also does not prove that the product implements the behaviour it describes.

## Structure

| Folder | Contents |
|---|---|
| [`live-terms/`](live-terms/) | **Public-facing documents only** — the exact Markdown, HTML and PDF the product may serve, plus `manifest.json`. Generated output; never edit by hand, never put anything internal here |
| [`publication-handoff/`](publication-handoff/) | Internal controls for what `live-terms/` may serve: the blockers record and the pipeline rules |
| [`suites/`](suites/) | Versioned legal suites and immutable historical versions |
| [`bin/`](bin/) | Staged for deletion, pending review. Not in use |
| [`analysis/`](analysis/) | Topic-specific legal analysis and context handoffs |
| [`reviews/`](reviews/) | Point-in-time suite and repository reviews |
| [`engineering-inputs/`](engineering-inputs/) | Questionnaires and evidence requests sent to engineering |
| [`generated/`](generated/) | Generated source/output pairs retained for reproducibility |
| [`references/`](references/) | External regulatory and agency source documents |

## Rules

- Keep historical suites immutable.
- Put only public-facing bytes in `live-terms/`; never copy a working draft, an internal record or a control document there.
- **Never render straight from `suites/` to a servable location.** Source files carry approval blocks, signature tables and solicitor-review notes. Rendering must strip them and a verification gate must confirm it, across Markdown, HTML and the text layer of every PDF.
- Record draft, review, approval, publication and supersession as distinct states.
- Put new legal versions in a new suite directory; never silently overwrite a
  published version.
- Keep public-facing documents separate from internal records and operational
  procedures.
- Update the publication manifest and provisional hashes whenever the exact
  candidate bytes change.
