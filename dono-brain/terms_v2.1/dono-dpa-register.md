# Data Processing Agreement Register — Dono

Owner: Amrit (data protection lead)
Last updated: 30 July 2026

Purpose: a single record of every processor handling personal data on Dono's behalf, the DPA governing that relationship, and where the signed/accepted copy is filed. Under UK GDPR Article 28, a written contract (which can be the processor's own standard/click-through DPA) must be in place with every processor before they process personal data for Dono.

| Processor | Service | Personal data processed | DPA type | Status | Filed at | Notes |
|---|---|---|---|---|---|---|
| Stripe | KYC/identity verification, payments | ID verification data, payment details | Stripe's standard DPA (accepted as part of Stripe's terms) | Accept and file | [link/folder] | Confirm the correct Stripe product's DPA (Identity vs Payments may have separate terms) |
| Convex | Application hosting / database | All platform data | Convex's standard DPA (request if not auto-included in ToS) | To action | [link/folder] | Check whether Convex offers an EU-region deployment; relevant to transfer assessment |
| Vercel | Frontend hosting | Platform data in transit; logs | Vercel's standard DPA | To action | [link/folder] | Vercel's DPA expressly contemplates US processing |
| Resend | Transactional email | Email address, email content | Resend's standard DPA | To action | [link/folder] | Confirm whether Resend stores email content/logs and for how long |
| PostHog | Analytics | Usage events, device data | PostHog's standard DPA | To action | [link/folder] | Confirm EU Cloud vs US Cloud instance — affects both DPA terms and transfer position |

## Process

1. Before any new processor goes live, add it to this table.
2. Locate the processor's standard/click-through DPA (usually linked from their terms or trust centre) and accept/sign it.
3. File the accepted DPA (PDF or link) and record the date and location here.
5. Review this register at least annually, and whenever a processor changes its terms or sub-processor list.

## Outstanding actions

- Confirm and file DPAs for Convex, Vercel, Resend and PostHog (all currently "to action").
- Confirm which Stripe product terms apply and file the correct DPA.
- Once all four are filed, mark this register "complete for launch" with a date.
