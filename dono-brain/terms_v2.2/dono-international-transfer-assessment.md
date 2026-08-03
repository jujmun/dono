# International Transfer Assessment — Dono

**Controller:** Amrit Kaur Rooprai, trading as Dono
**Owner:** Amrit (data protection lead). **Deputy:** Sashank.
**Version:** 2.2 — 31 July 2026
**Next review:** at least annually, and on any change of provider, region or sub-processor list.

**Purpose:** record, for each provider, whether personal data is transferred outside the UK and, if so, the safeguard relied on and whether a transfer risk assessment is required.

**A restricted transfer includes making personal data accessible to a separate organisation outside the UK** — not only physically sending it abroad. Remote access by a provider's support staff, or a sub-processor located overseas, creates a restricted transfer even where the selected storage region is inside the UK or EEA. So "we chose an EU region" is not by itself an answer.

## Changes in v2.2

- Convex and Vercel rows completed from the executed DPAs; both are now **closed** as to mechanism.
- The **Vercel transfer risk assessment is identified as outstanding**, because Vercel's DPA — unlike Convex's — contains no assessment Dono can rely on.
- Regions confirmed: Convex `eu-west-1` (Ireland), Vercel United States (Washington DC), PostHog Cloud EU.
- The interim privacy-notice wording is removed, because the Privacy Notice now names each provider, region and mechanism.

---

## Register

| Provider | Region configured | Transfer outside the UK? | Safeguard relied on | Transfer risk assessment | Status |
|---|---|---|---|---|---|
| **Convex** (database, backend, file storage) | **Ireland / EU — `eu-west-1`** | **Yes.** The DPA expressly permits transfers from the UK to the United States and to other countries used by Convex's authorised sub-processors | **EU Standard Contractual Clauses (2021, Module Two — controller to processor) plus the UK International Data Transfer Addendum.** Not the standalone IDTA. **No UK adequacy decision is relied on for the United States**, because none exists | **Satisfied by Convex's own assessment.** Convex states it has assessed the transfers and concluded they provide protection essentially equivalent to UK GDPR standards without requiring additional supplementary measures. Dono has reviewed and adopted that assessment | **Closed** |
| **Vercel** (web and application hosting) | **United States — Washington DC** | **Yes.** The DPA expressly permits transfers outside the UK, including to the United States and other countries where Vercel or its sub-processors operate (across AWS, Azure and Google Cloud infrastructure) | **EU Standard Contractual Clauses plus the UK International Data Transfer Addendum.** The DPA refers to a "UK IDTA", but the wording shows it is functionally the **UK Addendum**, not the standalone IDTA. **No UK adequacy decision is relied on** | **OUTSTANDING — Dono must complete its own.** Vercel's DPA contains **no documented transfer impact assessment** and no statement of essential equivalence; it contains only a general commitment that transfers will comply with applicable data protection law. Because Dono relies on an Article 46 contractual safeguard, a transfer risk assessment is required before the transfer can lawfully be relied on | **BLOCKING — open** |
| **Convex Auth** (authentication) | As Convex | As Convex | As Convex | As Convex | **Closed** |
| **Resend** (transactional and marketing email) | **[CONFIRM — typically United States]** | **Likely yes** | **[CONFIRM]** — expected to be SCCs plus the UK Addendum | **Required if an Article 46 safeguard is relied on** — assess once the mechanism is confirmed | **Open** |
| **PostHog** (product analytics) | **EU — `eu.i.posthog.com` (PostHog Cloud EU)** | **To confirm.** EU processing is configured; confirm whether any sub-processor or support access sits outside the EEA or UK | **[CONFIRM]** — if processing and access are genuinely EU-only, the position is straightforward; if not, SCCs plus the UK Addendum will apply | Required only if an Article 46 safeguard is relied on | **Open** |
| **Stripe** (payments, identity, fraud) | Ireland and the United States | **Yes** | Stripe's own mechanism under its terms — expected to be SCCs plus the UK Addendum. **[CONFIRM which Stripe entity and terms apply to Dono's account]** | **Note:** Stripe acts as an **independent controller** for most of this processing, not as Dono's processor. Where a recipient is an independent controller, the analysis is a controller-to-controller restricted transfer, and the mechanism relied on differs. Do not simply copy the processor analysis across | **Open** |
| **Error monitoring** | — | — | — | — | **Not applicable — no error-monitoring product is in use.** Dono relies on Vercel and Convex platform logs, which are covered by the rows above |
| **Consent management** | The user's own device | No | — | — | **Not applicable — built in-house** |

## What a transfer risk assessment has to cover

For the outstanding Vercel assessment (and for Resend and PostHog if an Article 46 safeguard turns out to be relied on), record:

1. the categories of personal data transferred, and whether any is special category or criminal-offence data;
2. the purpose, frequency and volume of the transfer;
3. the destination country's laws on government access to data, and any relevant surveillance regime;
4. whether the recipient has ever received a government access request relating to the data, and what its policy is on challenging and reporting them;
5. the practical protections in place — encryption in transit and at rest, key control, access controls, pseudonymisation, and whether Dono or the provider holds the keys;
6. the conclusion: whether the transfer, taken with the contractual safeguard and those practical protections, provides protection essentially equivalent to UK standards; and
7. any supplementary measures required, and the review date.

**A DPA containing SCCs or the UK Addendum does not complete Dono's own assessment obligation.** The contract is the safeguard; the assessment is the check that the safeguard works in the destination.

## Actions before launch

1. **[BLOCKING]** Complete and file the **Vercel transfer risk assessment**. This is the single open item preventing the Privacy Notice's transfer section from being publishable as written.
2. **[BLOCKING]** Confirm **Resend's** processing region and transfer mechanism, and complete an assessment if an Article 46 safeguard is relied on.
3. Confirm **PostHog Cloud EU** processing is genuinely EU-only, including sub-processors and support access.
4. Confirm which **Stripe** entity and product terms apply, and record the controller-to-controller transfer position separately from the processor analysis.
5. Record, for every provider, the backup and disaster-recovery regions, the countries from which support staff may access data, the sub-processor list and its locations, and how Dono is notified of changes.
6. Once every row is closed, this document becomes the evidence base for clause 8 of the Privacy Notice, and the `[TRANSFER RISK ASSESSMENT OUTSTANDING]` and `[DPA OUTSTANDING]` markers there can be removed.
