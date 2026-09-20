# International Transfer Assessment — Dono

Owner: Amrit (data protection lead)
Last updated: 30 July 2026

Purpose: record, for each processor, whether personal data is transferred outside the UK, and if so, the safeguard relied on. Do not assume UK-only processing without verifying each vendor's documentation — most SaaS infrastructure defaults to US-based processing unless a specific EU/UK region is selected.

| Processor | Transfer position | Safeguard relied on | What to verify | Status |
|---|---|---|---|---|
| Convex | TBC — likely yes | TBC | Which deployment region is selected (EU vs US); whether support/sub-processors access data outside the UK/EEA | Open |
| Vercel | Yes | Vercel's DPA (Standard Contractual Clauses / UK Addendum, per their DPA) | Confirm which SCC/Addendum version is current in Vercel's DPA | Open |
| Resend | Likely yes | TBC | Whether email content and logs are processed/stored in the US; which transfer mechanism Resend's DPA relies on | Open |
| PostHog | Depends on configuration | TBC | Confirm whether the Dono project uses PostHog Cloud EU or Cloud US — this determines both the transfer position and the safeguard | Open |
| Stripe | Yes | Stripe's DPA (Standard Contractual Clauses / UK Addendum, per Stripe's terms) | Confirm which Stripe entity/terms apply to Dono's account | Open |

## Interim privacy notice wording

Until every row above is resolved, do not state "we do not transfer data outside the UK." Use instead:

> Some of our service providers are located, or process personal data, outside the United Kingdom. Where this happens, we ensure appropriate safeguards are in place in line with UK data protection law — such as an adequacy decision, the UK Extension to the EU–US Data Privacy Framework where applicable, or the UK International Data Transfer Agreement (or other approved transfer mechanism).

## Actions before launch

1. For each processor marked "Open," confirm the deployment region and the transfer mechanism from their DPA/trust documentation, and update the safeguard column.
2. Where a processor offers an EU/UK-only region (e.g. PostHog Cloud EU) and Dono's user base is UK-only at launch, consider selecting that region to simplify the transfer position.
3. Once all rows are confirmed, this document becomes the source for the Privacy Notice's international transfers section — replace the interim wording above with the confirmed position.
