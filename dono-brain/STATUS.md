# Dono Brain status

This is the short repository dashboard. It points to authoritative records; it
does not replace them.

**Last reviewed:** 7 August 2026

## At a glance

| Area | Status | Authoritative detail |
|---|---|---|
| Settled facts and decisions | One canonical record | [`TRUTH.md`](TRUTH.md) |
| Open company work | One visible root action register | [`TODO.md`](TODO.md) |
| Current legal source | **v3.0 — content-ready** | [`legal/suites/v3.0/README.md`](legal/suites/v3.0/README.md) |
| Display-ready legal files | **Not yet rendered** — Markdown must become accessible HTML and formal PDF artifacts | [`legal/live-versions/`](legal/live-versions/) |
| Product release authorisation | Pending engineering controls and exact publication-artifact hashes | [`legal/suites/v3.0/publication-package/BETA_DOCUMENT_MANIFEST.md`](legal/suites/v3.0/publication-package/BETA_DOCUMENT_MANIFEST.md) |
| Legal text served by the product | Draft stub requiring replacement before launch | `TRUTH.md`, Contract evidence and versioning |
| Beta scope | Society-only | `TRUTH.md` and the v3.0 beta manifest |
| Engineering launch requirements | **Current and actively used**; path retained | [`engineering/legal-launch/README.md`](engineering/legal-launch/README.md) |
| Older engineering material | **Superseded or historical; not build instructions** | [`engineering/archive/README.md`](engineering/archive/README.md) |
| Release Control Matrix | Required and not yet populated | [`governance/releases/release-control-matrix.md`](governance/releases/release-control-matrix.md) |
| Counsel questions | Prepared against v2.3; reconcile with v3.0 before sending | [`governance/open-questions/questions-for-solicitor.md`](governance/open-questions/questions-for-solicitor.md) |

## Immediate rule

v3.0 is the current, content-ready legal source. Do not serve the Markdown files
directly. A rendered HTML or PDF artifact may be served only when the manifest
identifies it, its publication hash is recorded, and the Release Control Matrix
permits the release.

## Migration state

- **Completed:** root navigation and governance entry points.
- **Completed:** legal suites, reviews, analyses, engineering inputs, generated
  artifacts and regulatory references have been separated by purpose.
- **Completed:** README navigation for main domains and complex/high-risk entry
  points, without adding an index to every small folder.
- **Kept stable:** `engineering/legal-launch/`, because the team is actively
  working from that path.
- **Completed:** engineering history is classified under `engineering/archive/`;
  insurance is grouped under `corporate/insurance/`.
- **Not migrated:** research, product/design and pitch, which remain coherent
  domains. Any future bulk moves require review before they proceed.
