# Live legal document handoff

**Status: v3.0 artifacts present** — rendered by `scripts/render-legal-live-versions.mjs`.

This is the controlled handoff location for the exact full legal documents that
the product may serve. Canonical Markdown source remains in
[`../suites/v3.0/`](../suites/v3.0/). Engineering serves only the rendered HTML
and PDF under `3.0/`, via the fail-closed product registry.

## Layout

```
3.0/
  manifest.json
  {documentId}/
    document.html
    document.pdf
    source.md
```

Re-render after any source change:

```bash
node scripts/render-legal-live-versions.mjs
```

The script verifies Markdown source hashes against `DOCUMENT_HASHES.md`, writes
HTML/PDF artifacts, and regenerates `lib/legal/artifacts/generated.ts` and
`convex/lib/legalArtifacts/generated.ts`.

## Rules

- Never fall back to draft stubs or raw Markdown in the product.
- Missing, unknown, or hash-mismatched artifacts must block Events A/B/C.
- Student Campaign Terms must never appear here during the Society-only beta.
- Publication approval remains a separate legal gate; these artifacts enable the
  engineering contract-evidence stack.
