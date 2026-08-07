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
