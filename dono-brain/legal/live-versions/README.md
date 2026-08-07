# Live legal document handoff

**Status: EMPTY — v3.0 content is ready, but its display files have not yet been rendered.**

This is the controlled handoff location for the exact full legal documents that
the product may serve. The current wording lives in [`../suites/v3.0/`](../suites/v3.0/)
as canonical Markdown source and is ready to go. It must first be rendered into
accessible HTML for in-product display and formal PDF for durable viewing or
download. Engineering may build the registry, routes and acceptance flows now,
but must fail closed until the required rendered artifacts are present.

## Do not use as live copy

- Raw Markdown from [`../suites/v3.0/`](../suites/v3.0/) is canonical source, not
  a user-facing publication format.
- The product's existing draft stub is not an approved legal document.
- Historical suites are evidence of earlier versions, not automatic live copy.

## Future handoff requirements

For each v3.0 document, the publication handoff will provide:

- a stable document ID and title;
- the approved version and effective date;
- accessible HTML and a formal PDF rendered from the same source;
- the Markdown source hash plus separate hashes for the HTML and PDF bytes; and
- its place in the approved beta document manifest and Acceptance Matrix.

Engineering must map those values through one configurable document registry.
The UI, acceptance record, receipt, permanent historical route and release
evidence must all resolve to the same version and hash. If a required document
is missing, unknown or hash-mismatched, the affected account-creation, Society-
onboarding or donation event must not proceed.

Do not add a draft, convenience copy, raw Markdown file or fallback document
here. The rendered handoff should add a versioned subfolder and machine-readable
manifest. Neither is created yet because the HTML and PDF artifacts have not
been generated and checked.
