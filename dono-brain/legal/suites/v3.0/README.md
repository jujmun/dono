# Dono legal suite v3.0

**Lifecycle state:** **Current, content-ready legal source** — publication formats pending  
**Version date:** 7 August 2026

Start with [`00_v3.0_change_log.md`](00_v3.0_change_log.md), then use the section
matching your task.

## Suite map

| Folder | Purpose | Publication treatment |
|---|---|---|
| [`public/`](public/) | Current contracts, notices, guidelines and complaints-policy source | Render to accessible HTML and formal PDF before serving |
| [`internal/`](internal/) | DPIA, ROPA, assessments, registers and internal governance records | Never served as user contracts or notices |
| [`procedures/`](procedures/) | Operational procedures, workflows, checklists and response plans | Internal operating material; wording may feed product flows where expressly specified |
| [`future/`](future/) | Drafting for features outside the Society-only beta | Must not be served or accepted during beta |
| [`publication-package/`](publication-package/) | Manifest, approvals, hashes, acceptance wording and archive controls | Controls publication of the exact candidate suite |

## Publication state

The authoritative candidate list is
[`publication-package/BETA_DOCUMENT_MANIFEST.md`](publication-package/BETA_DOCUMENT_MANIFEST.md).
The substantive v3.0 wording is ready. The files in this suite are canonical
Markdown source, not user-facing publication artifacts. Render the operative
public documents to accessible HTML for in-product display and formal PDF for
durable download, then place and hash the exact artifacts through
[`../../live-terms/`](../../live-terms/).

The approval register continues to control release of the rendered artifacts
and the engineering implementation. Its open gates do not mean the v3.0 wording
is still a drafting exercise.

The existing hashes pin the Markdown source. Rendering creates new bytes, so
each HTML and PDF artifact requires its own publication hash and must be checked
against the source before release.

Navigation READMEs in this suite are repository metadata. They are excluded from
legal-document and publication-package counts and are not candidate documents
for approval, publication or acceptance.
