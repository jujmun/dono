> ## v2.3 AMENDMENT BLOCK — READ FIRST
>
> **Version 2.3 — 6 August 2026.** This document is carried forward from v2.2 with the amendments below.
> **Where anything in the body of this document conflicts with this block, this block prevails.** The v2.2 text is retained beneath so that the reasoning and evidence are not lost.
>
> **Amendments applying to this document (DPA Register):**
>
> 1. **Signature position settled.** A handwritten signature is not required where a provider's Article 28 terms are validly incorporated into its online terms. **Recording acceptance is what matters**: for each provider record the terms accepted, the version, the date, the products covered, the Dono account, and the sub-processor list.
> 2. **Student-card processing removed.** Delete every reference to student-card images or student numbers as a category of data processed by any provider. **Dono no longer collects them.** Convex's entry no longer includes student-card images.
> 3. **Vercel Transfer Risk Assessment** is now recorded as a **launch blocker**, not an open item, and is completed in `dono-international-transfer-assessment-v2.3.md`.
> 4. **Three outstanding DPAs — Resend, PostHog and the applicable Stripe entity and product terms — must be confirmed and recorded before launch.** Until each register row is complete with a date and version, the corresponding statement in Privacy Notice clause 8.2 is not yet true.
> 5. **Analytics gate.** PostHog must not be enabled until its register row is complete **and** the consent flow has passed testing.
>
> **Revision 2.3.1 — from the engineering evidence of 5 August 2026:**
>
> 6. **Add the support mailbox provider (Google) as a processor row.** The single public support address receives complaints, rights requests, content reports and legal notices, and the provider is not in this register at all (item VN-04).
> 7. **Convex transfer risk assessment is closed** (adopting the provider's own assessment). **Vercel remains outstanding and blocking**, and **Resend requires its own** (item VN-02).
> 8. **Confirm for the analytics provider**: that it may not use the data for its own purposes; its sub-processor and support-access locations; and that the retention setting is 12 months with enforcement enabled.
> 9. **Confirm which Payment Provider entity and product terms apply to Dono's account**, and file them. The Payment Provider is an independent controller for payments, onboarding, know-your-customer checks and **identity verification** — not an Article 28 processor for those activities.
> 10. **Sufficient-guarantees evidence remains outstanding for every processor.**

---
# Data Processing Agreement Register — Dono

**Controller:** Amrit Kaur Rooprai, trading as Dono
**Owner:** Amrit (data protection lead). **Deputy:** Sashank.
**Version:** 2.2 — 31 July 2026
**Next review:** at least annually, and whenever a provider changes its terms or sub-processor list.

**Purpose:** a single record of every provider handling personal data for Dono, the role that provider actually plays, the agreement governing the relationship, and where the accepted copy is filed. Under Article 28 UK GDPR a written contract must be in place with every **processor** before it processes personal data for Dono. A provider that acts as an **independent controller** is not covered by Article 28 at all, and recording it as a processor would misdescribe the relationship — so this register records the role first and the contract second.

## Changes in v2.2

- **Stripe is no longer recorded as a processor.** Its role is split by processing activity, and for most activities it is an independent controller.
- Convex and Vercel DPA positions updated to reflect the agreements actually in place, with the transfer mechanism recorded for each.
- Roles recorded **by activity**, not by vendor.
- The missing step 4 in the process list is restored.

---

## Register

| Provider | Activities | Role, by activity | Personal data | Agreement | Status | Filed at |
|---|---|---|---|---|---|---|
| **Stripe** | Payment processing; Connect onboarding and KYC; fraud detection; regulatory and financial compliance; data Dono sends to create a charge | **Independent controller** for payment processing, for Connect onboarding and KYC, for fraud detection, and for its own regulatory compliance. Stripe determines the purposes and means of that processing because it has its own legal obligations. **Do not describe Stripe as Dono's processor** unless a specific Stripe product's documentation says it acts as one for that purpose. | Payment data, identity documents (never seen by Dono), transaction records | Stripe's applicable product terms and DPA | **[DPA OUTSTANDING]** — confirm which Stripe entity and which product terms apply to Dono's account, then accept and file | `[link/folder]` |
| **Convex** | Application backend, database, and file storage (student-card images before deletion, campaign media, evidence) | **Processor** | All Platform data | Convex DPA | **In place.** Permits transfers outside the UK. Base mechanism: **EU Standard Contractual Clauses (2021, Module Two — controller to processor) plus the UK Addendum.** Convex has assessed the transfers as providing essentially equivalent protection without additional supplementary measures. Does **not** rely on a UK adequacy decision for the US. Sub-processors are covered by the same mechanism and listed separately by Convex | `[link/folder]` |
| **Convex Auth** | Authentication | **Processor** (part of Convex) | Credentials, session tokens | As Convex | As Convex | `[link/folder]` |
| **Vercel** | Web and application hosting | **Processor** | Platform data in transit; server logs | Vercel DPA | **In place.** Permits transfers outside the UK, including to the United States. Mechanism: **EU Standard Contractual Clauses plus the UK Addendum** — the DPA calls this a "UK IDTA" but the wording shows it is functionally the UK Addendum, not the standalone IDTA. Does **not** rely on a UK adequacy decision. **Contains no documented transfer impact assessment**, so Dono must complete its own — see the International Transfer Assessment | `[link/folder]` |
| **Resend** | Transactional email (donation confirmations, service messages, one-time passcodes); marketing email | **Processor** | Email addresses, email content, delivery logs | Resend's standard DPA | **[DPA OUTSTANDING]** — accept and file. Confirm whether Resend stores email content and logs, for how long, and its processing region and transfer mechanism | `[link/folder]` |
| **PostHog** | Product analytics (consent-gated) | **Processor** | Usage events, device and browser data, approximate location, user identifier once signed in | PostHog's standard DPA | **[DPA OUTSTANDING]** — accept and file. Dono uses **PostHog Cloud EU**, so confirm the DPA covers the EU instance, confirm PostHog may **not** use the data for its own purposes, and confirm the project's event-retention setting matches the 26-month period in the Privacy Notice | `[link/folder]` |
| **Error monitoring** | — | — | — | — | **None in use.** Dono relies on the platform logs of Vercel and Convex. If a product such as Sentry is ever added, it must be added to this register, the ROPA and the Privacy Notice **before** it goes live, because such logs commonly contain IP addresses, email addresses and request bodies | — |
| **Consent management** | Analytics consent banner | — | Consent choice, stored on the user's device | — | **In-house.** No third-party vendor, so no DPA is required | — |

## Sufficient guarantees

A compliant contract is not the whole test — Article 28 requires that a processor offers sufficient guarantees. For each processor above, hold proportionate evidence of: security documentation; encryption and access controls; breach-notification arrangements; deletion functionality; audit or certification information; sub-processor controls; and assistance with subject-access requests and breaches. **[OUTSTANDING for all four processors — collect and file before launch.]**

## Process

1. Before any new provider goes live, add it to this table and to the ROPA.
2. Determine and record the provider's **role by activity** before assuming it is a processor.
3. Locate the provider's standard or click-through DPA (usually linked from its terms or trust centre) and accept it.
4. **Record the date of acceptance, the version accepted, the products it covers, and the Dono account or legal entity it covers.** A handwritten signature is not generally needed where the DPA is validly incorporated into the provider's online terms.
5. File the accepted DPA (PDF or link) and record its location here.
6. Verify the configured region, backup and disaster-recovery regions, the countries from which support staff may access data, the sub-processor list and its locations, and how Dono is notified of changes. Record the result in the International Transfer Assessment.
7. Review this register at least annually, and whenever a provider changes its terms or sub-processor list.

## Outstanding actions before launch

- **[BLOCKING]** Accept and file DPAs for **Resend**, **PostHog** and **Stripe**.
- **[BLOCKING]** Complete Dono's own transfer risk assessment for **Vercel**.
- Collect sufficient-guarantees evidence for Convex, Vercel, Resend and PostHog.
- Confirm Resend's processing region.
- Confirm PostHog Cloud EU DPA coverage, own-purposes restriction and retention setting.
- Once all of the above are closed, mark this register **"complete for launch"** with a date, and only then remove the corresponding placeholders from the Privacy Notice.


---

## Approval and version control (v2.3)

| Field | Entry |
|---|---|
| Version | 2.3 |
| Version date | 6 August 2026 |
| Accountable owner | Amrit Kaur Rooprai |
| Reviewed by / Approved by | *(to be completed)* |
| Status | Carried forward from v2.2 and amended by the v2.3 amendment block at the top of this document, which takes precedence over anything below it |
| Next scheduled review | 6 February 2027 |
| Supersedes | The corresponding document in `terms_v2.2/`, which is retained unaltered as the historical baseline |
