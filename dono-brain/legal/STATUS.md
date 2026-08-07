# Legal status

**Last reviewed:** 7 August 2026

| Question | Status | Record |
|---|---|---|
| Current legal source | v3.0 — substantive wording content-ready | [`suites/v3.0/`](suites/v3.0/) |
| Display-ready publication files | **Rendered.** Markdown, accessible HTML and PDF for all nine public documents, hashed in `manifest.json` | [`live-terms/`](live-terms/) |
| Are those files servable? | **No — not release-authorised.** See the blockers record | [`publication-handoff/PUBLICATION_BLOCKERS.md`](publication-handoff/PUBLICATION_BLOCKERS.md) |
| Release authorisation | Pending approval signatures and engineering/release controls | [`suites/v3.0/publication-package/PUBLICATION_APPROVAL_REGISTER.md`](suites/v3.0/publication-package/PUBLICATION_APPROVAL_REGISTER.md) |
| Published suite | None recorded; product serves a draft stub requiring replacement | [`../TRUTH.md`](../TRUTH.md) |
| Source edits awaiting sign-off | **Six**, made during rendering, all applied at source | [`publication-handoff/PUBLICATION_BLOCKERS.md`](publication-handoff/PUBLICATION_BLOCKERS.md) §1 |
| Child-friendly privacy layer | **Drafted 7 August 2026; not approved and not published.** Required by ICO Children's Code Standard 4 | [`suites/v3.0/public/10_dono_child_friendly_privacy_layer_v3.0.md`](suites/v3.0/public/10_dono_child_friendly_privacy_layer_v3.0.md) |
| Beta scope | Society-only | [`suites/v3.0/publication-package/BETA_DOCUMENT_MANIFEST.md`](suites/v3.0/publication-package/BETA_DOCUMENT_MANIFEST.md) |
| Future document excluded from beta | Student Campaign Terms | [`suites/v3.0/future/02_dono_student_campaign_terms_v3.0.md`](suites/v3.0/future/02_dono_student_campaign_terms_v3.0.md) |
| Historical suites | v1.0 through v2.3 plus legacy-unversioned | [`suites/README.md`](suites/README.md) |
| Staged for deletion | An earlier rendering that published approval blocks and solicitor-review notes | [`bin/README.md`](bin/README.md) |

The v3.0 wording is current and ready, and display-ready artifacts now exist. It
is **not** published, because the approval register is unsigned and a number of
statements in the copy describe controls the engineering checklist records as
not yet built. `publication-handoff/PUBLICATION_BLOCKERS.md` is the single list.

**Rendering rule:** never render straight from `suites/` to a servable location.
Source files carry approval blocks, signature tables and solicitor-review notes.
Everything in `live-terms/` goes through a stripping pipeline and a verification
gate that re-reads all 27 artifacts, including the text layer of every PDF.
