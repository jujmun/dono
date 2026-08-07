# Dono Brain

Dono Brain is Dono's shared company knowledge base. It contains the decisions,
requirements, research, legal material and operating context used to build and
govern Dono. It does not contain the application code.

## Start here

Read these files in this order:

1. [`STATUS.md`](STATUS.md) — a short dashboard showing which material is latest,
   approved, published or blocked.
2. [`TRUTH.md`](TRUTH.md) — the **single authoritative record** of settled facts
   and decisions.
3. [`TODO.md`](TODO.md) — the **single, visible company action register** and
   launch-gate summary.
4. [`governance/releases/release-control-matrix.md`](governance/releases/release-control-matrix.md)
   — the operational release gate connecting product behaviour, legal documents,
   evidence and approval.

If another document contradicts `TRUTH.md`, correct that document. Do not create
another truth file.

## What each authoritative file does

| File | Answers | Must not become |
|---|---|---|
| `TRUTH.md` | What is true, settled, approved, blocked or superseded? | A task list or implementation guide |
| `TODO.md` | What remains to be done, by whom, and with what priority? | A second source of settled facts |
| `STATUS.md` | Where should a reader start today? | A detailed duplicate of the other files |
| Release Control Matrix | May this feature be released, and what evidence supports that decision? | A general company backlog |
| Legal suite manifest | Which exact legal documents may be served? | Evidence that the product implements them |

## Repository map

| Folder | Purpose | Start here |
|---|---|---|
| [`governance/`](governance/) | Repository governance, counsel questions and release control | [`governance/README.md`](governance/README.md) |
| [`company/`](company/) | Mission, strategy, business model and company history | [`company/README.md`](company/README.md) |
| [`product/`](product/) | Product model, user journeys, architecture and feature areas | [`product/README.md`](product/README.md) |
| [`design/`](design/) | Product design, community psychology and UX guidance | [`design/README.md`](design/README.md) |
| [`engineering/`](engineering/) | Current legal-launch requirements plus clearly labelled historical engineering material | [`engineering/README.md`](engineering/README.md) |
| [`legal/`](legal/) | Legal suites, reviews, assessments, policies and regulatory references | [`legal/README.md`](legal/README.md) |
| [`corporate/`](corporate/) | Founder, corporate and insurance-risk records | [`corporate/README.md`](corporate/README.md) |
| [`research/`](research/) | Survey data, interviews and market synthesis | [`research/README.md`](research/README.md) |
| [`pitch/`](pitch/) | Pitch decks, scripts and fundraising evidence | [`pitch/README.md`](pitch/README.md) |

The last two legacy folders will be handled in later migration batches. Their
presence here does not make them authoritative.

## Legal document states

The word **current** is not precise enough for legal documents. Use these states:

1. **Draft** — being prepared; not approved for publication.
2. **In review** — awaiting internal or professional approval.
3. **Content-ready source** — the substantive wording is current and ready, but
   publication files may still need to be rendered.
4. **Release-authorised** — the exact display files and required release controls
   are approved.
5. **Published** — the exact version served to users.
6. **Superseded** — retained as immutable history and not edited.

The current legal source is v3.0 in [`legal/suites/v3.0/`](legal/suites/v3.0/).
Its wording is content-ready. The remaining document task is to render the
Markdown source into accessible in-product HTML and formal PDF files, record
their hashes, and place those exact publication artifacts in
[`legal/live-versions/`](legal/live-versions/). Content readiness does not by
itself mean that the product release has passed its engineering controls.

## Repository conventions

- Keep exactly one root `TRUTH.md` and one root `TODO.md`.
- Put a document in the domain that owns it; link to it elsewhere instead of
  copying it.
- Use lowercase kebab-case for new filenames.
- Keep historical legal versions immutable.
- Use Markdown by default. Important binary sources should have a readable
  Markdown summary or manifest entry.
- When adding or moving a file, update its domain index and any affected links.
- Main domain folders should have a short `README.md`. Add a subfolder README
  only when the folder is complex, actively used as an entry point, or controls
  a high-risk process. Immutable historical legal suites are indexed from
  `legal/suites/README.md` instead of being modified.
- A legal statement is not evidence that the product behaves that way.

## Migration status

The navigation, governance, legal-information and engineering-history layers
have been reorganised. Main domains and important operational areas contain
README navigation. The actively used `engineering/legal-launch/` path remains
unchanged to avoid disrupting the team. Insurance is under corporate risk and
outdated engineering material is under `engineering/archive/`. Research,
product/design and pitch remain separate because they are already coherent
domains. Any further major migration requires explicit review.
