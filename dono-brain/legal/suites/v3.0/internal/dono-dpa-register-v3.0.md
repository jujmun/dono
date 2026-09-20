# Provider and Data Processing Agreement Register — Dono

**Document:** Article 28 provider register and contract record
**Version:** 3.0
**Version date:** 7 August 2026
**Effective from:** on publication approval (see approval block)
**Controller:** Amrit Kaur Rooprai, sole trader, trading as Dono
**Accountable owner:** Amrit Kaur Rooprai (data protection lead) · **Deputy:** Sashank
**Supersedes:** `../../v2.3/dono-dpa-register-v2.3.md` and all earlier versions
**Status:** Clean consolidated record. States the current position only.
**Next review:** at least annually, and whenever a provider changes its terms, entity, region or sub-processor list.

---

## 1. Purpose and method

A single record of every provider that handles personal data for Dono: **the role that provider actually plays, the agreement governing it, and where the accepted copy is filed.**

Article 28 UK GDPR requires a written contract with every **processor** before it processes personal data for Dono. A provider acting as an **independent controller** is not covered by Article 28 at all, and recording it as a processor would misdescribe the relationship. This register therefore records **role first, contract second, and role by activity rather than by vendor** — a single provider can be a processor for one activity and an independent controller for another.

**A handwritten signature is not required** where a provider's Article 28 terms are validly incorporated into its online terms. What matters is **recording acceptance**: the terms accepted, the version, the date, the products covered, the Dono account or legal entity covered, and the sub-processor list.

---

## 2. Register

### 2.1 Stripe

| Field | Entry |
|---|---|
| **Contracting entity** | **Stripe Payments Europe, Limited ("SPEL").** Confirmed from the DPA structure clause: a User whose Stripe Account is located in North or South America contracts with Stripe, LLC; **a User located elsewhere — including the United Kingdom — contracts with SPEL** |
| **Agreement** | Stripe Data Processing Agreement, **last updated 18 November 2025**, forming part of the Stripe Services Agreement at `stripe.com/legal/ssa`. Incorporates the Data Transfers Addendum at `stripe.com/legal/dta` |
| **Status** | **In place and filed.** Accepted by entering into the Stripe Services Agreement. Copy on file: `Stripe_DPA.pdf` |
| **Role — independent controller** | Payment processing; Connect onboarding; know-your-customer and identity verification; anti-money-laundering screening; fraud monitoring, prevention and detection; determining and using banks and payment method providers; billing and invoicing; regulatory compliance and responses to Financial Provider and Governmental Authority requirements; and analysing, improving and developing Stripe's own products. Stripe has **sole and exclusive authority** to determine the purposes and means of this processing |
| **Role — processor** | Where Stripe processes personal data to service the Stripe platform and to provide access to its products and services **on Dono's instructions**. Stripe's Article 28 obligations, including the sub-processor, audit and incident terms below, apply to that processing |
| **Do not** | Describe Stripe as Dono's processor for payments, onboarding, KYC, identity verification or fraud. It is an independent controller for those activities and has its own legal obligations |
| **Personal data** | Payment method account details, bank account details, billing and shipping address, name, order description, device ID, email address, IP address and location, order ID, payment card details, tax ID and status, unique customer identifier, and **identity information including government-issued documents (national IDs, driving licences, passports)**. **Sensitive data** where applicable, expressly including **facial recognition data**. **Dono never receives the identity document or the face scan** |
| **What Dono receives** | Connected-account identifier and status; identity-check outcome; verified name; verified date of birth. Nothing further |
| **Transfers** | Personal data is transferred to Stripe, LLC in the United States and to Stripe Affiliates and sub-processors globally. Mechanism is the **Data Transfers Addendum**, which supplies the applicable instrument — Data Privacy Framework, EEA SCCs (Modules 1 and 2), or the **UK International Data Transfer Addendum** issued by the ICO. The Data Transfers Addendum **prevails** over the DPA on any transfer conflict |
| **Sub-processors** | `stripe.com/legal/service-providers`. Stripe imposes comparable obligations by written agreement and **remains liable** for its sub-processors' acts and omissions |
| **Incident notification** | **No later than 48 hours** after becoming aware, for a Data Incident affecting personal data subject to GDPR or UK GDPR |
| **DPIA assistance** | Stripe will provide reasonable information to help Dono conduct a DPIA or consult a supervisory authority (DPA §3.1(e)). Assistance beyond its legal obligations may be chargeable |
| **Security** | PCI-DSS Level 1, confirmed annually by a QSA; SOC reports maintained; AES-256 at rest; TLS 1.2 in transit and mTLS internally; payment card and bank numbers separately encrypted and stored in a restricted vault with decryption keys on separate machines; MFA aligned to NIST 800-63B; documented access, entry, separation and availability controls |
| **Audit** | Annual written security questionnaire of reasonable scope on written request |
| **Point to note** | Stripe **disclaims liability to Dono for any claim made by a data subject** arising from Stripe's or its Affiliates' acts or omissions (DPA §3.4). This is a liability-allocation point, not a transfer point, and should be flagged to the solicitor |
| **Outstanding** | Confirm which **Stripe products** are enabled on the Dono account and that the DPA version on file is the version in force for that account. Collect sufficient-guarantees evidence (§4) |

### 2.2 Resend

| Field | Entry |
|---|---|
| **Contracting entity** | **Plus Five Five, Inc.**, 2261 Market Street #5039, San Francisco, CA 94114 |
| **Agreement** | Resend Data Processing Addendum, **updated 31 December 2025**, executed by DocuSign (envelope `CC958417-9D1F-42CD-8B94-53B5F496F14E`), **countersigned by Resend's CEO on 14 January 2026** |
| **Status** | **In place and filed.** Copy on file: `resend-dpa-signed.pdf`. This closes the v2.3 outstanding item |
| **Role — processor** | Transactional email (donation confirmations, service messages, one-time passcodes), campaign-update email and marketing email sent on Dono's instructions. Resend is expressly the processor and Dono the controller (DPA §2.1; Exhibit B) |
| **Role — independent controller** | **Company Account Data** (Dono's own account and billing contacts, identity verification for the account relationship) and **Company Usage Data** (source and destination metadata, activity logs, performance and abuse-prevention data). Resend is an **independent controller, not a joint controller**, for these, under its own privacy policy (DPA §9.1) |
| **Personal data** | Email metadata, email addresses and message content, which may include names and attachments added by the sender. Open and link tracking is **optional** and would add IP address, location, operating system, browser, device, email client and spam complaints — **Dono must confirm whether tracking is enabled and disable it unless separately justified** |
| **Sensitive data** | Exhibit A records **"Not applicable"**. Dono must keep it that way — no special category or criminal-offence content in email bodies |
| **Region** | **Primary processing operations are in the United States** (DPA §6.1). This answers the v2.3 "[CONFIRM] Resend region" item |
| **Transfers** | **EU SCCs** (Commission Decision 2021/914) — Module One where Resend acts as controller, Module Two for Dono's controller-to-processor use, Module Three where Dono acts as processor. **Ex-UK transfers use the UK SCCs, defined as the EU SCCs as amended by the UK Addendum.** Governed by Irish law, disputes before the Irish courts |
| **Additional basis** | Resend certifies to the **EU–U.S. Data Privacy Framework and the UK Extension**, is subject to FTC enforcement, and commits to cooperate with the ICO and EU DPAs on unresolved DPF complaints |
| **Supplementary measures** | DPA §6.6 records that Resend **had received no government intelligence or security-service access request as at the DPA date**, commits to redirect requests to Dono where lawful, to give prompt notice unless prohibited, not to disclose voluntarily, and to meet with Dono to consider whether transfers should be suspended. This is a **documented transfer safeguard**, which is why Resend's TRA can be closed on the provider's own material |
| **Sub-processors** | `resend.com/legal/subprocessors`. **14 days' written notice** of any addition or replacement. Objection remedy: discontinue the affected service; fees remain owed. Silence for 14 days is deemed authorisation. **Dono must subscribe to change notices** |
| **Incident notification** | Without undue delay, with reasonable cooperation on Dono's Article 33 and 34 obligations |
| **Deletion** | Return or deletion at Dono's choice on completion of services. **Customer data is deleted within 90 days of account termination.** Certification of deletion under SCC Clause 8.1(d)/8.5 **only on request** — Dono must request it |
| **Security** | Named head of security; documented security programme; SOC 2 Type II / ISO 27001 audited infrastructure providers; MFA and SSO available; multi-tenant authorisation model; static code analysis; annual third-party penetration testing; background checks and executed confidentiality agreements for personnel; TLS in transit; encryption at rest; log aggregation and alerting; documented incident record; tested business-continuity and disaster-recovery programme |
| **Audit** | Certifications and reports on written request at reasonable intervals; independent third-party audit where reports are insufficient, at Dono's cost |
| **Records** | Resend retains compliance records for **3 years** after termination and Dono may review, audit and copy them on reasonable notice |
| **Outstanding** | Confirm whether open and link tracking is enabled; confirm **live message and log retention** (distinct from the 90-day post-termination deletion); subscribe to sub-processor change notices; collect sufficient-guarantees evidence (§4) |

### 2.3 Convex

| Field | Entry |
|---|---|
| **Role** | **Processor** — application backend, database and file storage (campaign media, evidence, moderation, complaint and contract records) |
| **Agreement** | Convex DPA. **In place** |
| **Personal data** | All Platform data. **No student-card images** — that category no longer exists |
| **Region** | EU (`eu-west-1`) plus sub-processors |
| **Transfers** | Permitted outside the UK, at minimum to the United States. **EU SCCs (2021, Module Two — controller to processor) plus the UK Addendum.** Not a standalone IDTA and **not** reliant on a US adequacy decision |
| **Transfer assessment** | **Closed.** Convex's Exhibit A includes a FISA 702 and national-security-request questionnaire and a contractual conclusion of essentially equivalent protection with no supplementary measures required. Dono adopts that assessment, recorded in the International Transfer Assessment |
| **Sub-processors** | Listed separately by Convex, covered by the same mechanism. **10 days'** objection window |
| **Note** | The DPA does not reference the EU–US Data Privacy Framework. If Convex is DPF-certified that would be an additional basis and should be checked separately |
| **Outstanding** | Confirm platform log retention and backup restore/deletion propagation; collect sufficient-guarantees evidence (§4) |

### 2.4 Convex Auth

| Field | Entry |
|---|---|
| **Role** | **Processor** (part of Convex) — authentication |
| **Personal data** | Credentials, session tokens |
| **Agreement, region, transfers** | As Convex |

### 2.5 Vercel

| Field | Entry |
|---|---|
| **Role** | **Processor** — web and application hosting |
| **Agreement** | Vercel DPA. **In place** |
| **Personal data** | Platform data in transit; server logs |
| **Region** | **Primary processing facilities in the United States as at the DPA effective date**, with transfer and processing permitted "to and in the United States and anywhere else in the world where Vercel or its Subprocessors maintain data processing operations". Infrastructure runs across **AWS, Azure and GCP** (Schedule 2), so data can move across multiple cloud regions |
| **Transfers** | **EU SCCs plus what is functionally the UK Addendum.** Vercel's Schedule 3 calls this a "UK IDTA" incorporated "together with the Standard Contractual Clauses", but Schedule 5's text — "Addendum EU SCCs", "Approved Addendum", clause-by-clause amendments to the EU SCCs — shows it is the **ICO's International Data Transfer Addendum**, the bolt-on to the EU SCCs, not the free-standing IDTA. **Record it as the UK Addendum and do not repeat Vercel's label.** Modules One, Two and Three are selected per relationship |
| **Transfer assessment** | **OUTSTANDING AND BLOCKING.** Vercel's DPA contains **no transfer impact assessment** — no FISA 702 questionnaire, no government-request history disclosure, no essentially-equivalent conclusion. It gives only a general compliance promise (§13). **Dono must complete its own TRA** or obtain Vercel's separately |
| **Sub-processors** | **5 days'** objection window, and **only if Dono has proactively subscribed** to notices via `privacy@vercel.com` — otherwise Dono may receive no notification at all. **Subscribing is a required operational action** |
| **Objection remedy** | Narrower than Convex's: if unresolved, Dono's sole remedy is termination for convenience, with no refund and committed fees still owed (§7) |
| **Note** | Schedule 4 §2 provides that neither party is liable to the other for the other's own Article 83 GDPR fines — a liability-allocation point to flag to the solicitor |
| **Outstanding** | **Complete the TRA**; subscribe to sub-processor notices; confirm platform log retention and backup behaviour; collect sufficient-guarantees evidence (§4) |

### 2.6 PostHog

| Field | Entry |
|---|---|
| **Role** | **Processor** — consent-gated product analytics |
| **Agreement** | PostHog's standard DPA. **OUTSTANDING AND BLOCKING — not yet accepted or filed** |
| **Personal data** | Usage events, device and browser data, approximate location derived from an IP anonymised at ingest |
| **Region** | **PostHog Cloud EU** |
| **Analytics gate** | **PostHog must not be enabled** until this row is complete **and** the consent flow has passed testing |
| **Outstanding** | Accept and file the DPA; confirm it covers the **EU instance**; confirm PostHog **may not use the data for its own purposes**; confirm sub-processor and support-access locations; confirm the project's event retention is set to **12 months with enforcement enabled**; confirm **session replay is disabled at project level** as well as in the client; collect sufficient-guarantees evidence (§4) |

### 2.7 Google — support mailbox

| Field | Entry |
|---|---|
| **Role** | **Processor** — hosting the single published support address |
| **Agreement** | **OUTSTANDING AND BLOCKING — not yet recorded** |
| **Why it matters** | The single support address receives **data protection complaints, data subject rights requests, content reports, Online Safety complaints and legal notices**. It is one of the highest-sensitivity inbound channels Dono operates and it is not yet covered by a recorded Article 28 contract |
| **Outstanding** | Identify the exact Google product and terms applying to the account; confirm the Article 28 position, the region and the sub-processor position; accept, record and file; collect sufficient-guarantees evidence (§4) |

### 2.8 Providers not in use

| Provider | Position |
|---|---|
| **Error monitoring** (e.g. Sentry) | **None in use.** Dono relies on Vercel and Convex platform logs. If such a product is ever added it must be added to this register, the ROPA and the Privacy Notice **before** it goes live, because such logs commonly contain IP addresses, email addresses and request bodies |
| **Consent management** | **In-house.** No third-party vendor, so no Article 28 contract is required |
| **Advertising, attribution, session replay, CDP** | **None in use, and none may be added** without a DPIA review trigger being actioned first |

---

## 3. Summary status

| Provider | Role | Article 28 contract | Transfer mechanism | Transfer assessment | Blocking? |
|---|---|---|---|---|---|
| Stripe (SPEL) | Independent controller (payments, KYC, fraud); processor (platform servicing) | **In place** — 18 Nov 2025 | Data Transfers Addendum: DPF / EEA SCCs / UK IDTA | Provider instrument relied on | No |
| Resend (Plus Five Five, Inc.) | Processor; independent controller for account and usage data | **In place** — executed 14 Jan 2026 | EU SCCs + UK Addendum; DPF and UK Extension certified | **Closed** on the provider's documented supplementary measures | No |
| Convex | Processor | **In place** | EU SCCs (Module 2) + UK Addendum | **Closed** — provider assessment adopted | No |
| Convex Auth | Processor | As Convex | As Convex | As Convex | No |
| Vercel | Processor | **In place** | EU SCCs + UK Addendum (mislabelled "UK IDTA") | **OUTSTANDING** — no TIA in the DPA | **YES** |
| PostHog | Processor | **OUTSTANDING** | EU instance — confirm | Not started | **YES** |
| Google (support mailbox) | Processor | **OUTSTANDING** | Confirm | Not started | **YES** |

**Two of the three v2.3 outstanding contracts are now closed** (Resend, Stripe). Three items remain blocking: the Vercel transfer risk assessment, the PostHog contract, and the Google contract.

---

## 4. Sufficient guarantees — Article 28(1)

A compliant contract is not the whole test. Article 28(1) requires that a processor provides sufficient guarantees to implement appropriate technical and organisational measures. For each processor, hold proportionate evidence of: security documentation; encryption and access controls; breach-notification arrangements; deletion functionality; audit or certification information; sub-processor controls; and assistance with rights requests and breaches.

| Processor | Evidence held | Gap |
|---|---|---|
| Stripe | PCI-DSS Level 1 (QSA-confirmed annually), SOC reports, documented security exhibit, 48-hour incident term, DPIA assistance term, annual questionnaire right | Obtain and file the current SOC report reference; record the products enabled |
| Resend | Documented security programme, SOC 2 Type II / ISO 27001 audited infrastructure providers, annual penetration testing, personnel screening and confidentiality agreements, encryption in transit and at rest, incident record, business-continuity testing, 3-year compliance records with audit right | Request and file the certifications or reports under DPA §8.4 |
| Convex | DPA security terms; provider transfer assessment | Request and file security documentation and certifications |
| Vercel | DPA security terms | Request and file security documentation and certifications; **and the TRA** |
| PostHog | None | Everything |
| Google | None | Everything |

**Status: OUTSTANDING for all processors — collect and file before launch.**

---

## 5. Process

1. Before any new provider goes live, add it to this register and to the ROPA.
2. Determine and record the provider's **role by activity** before assuming it is a processor.
3. Locate the provider's standard or click-through Article 28 terms and accept them.
4. **Record the date of acceptance, the version accepted, the products covered, and the Dono account or legal entity covered.** A handwritten signature is not generally needed where the terms are validly incorporated into the provider's online terms.
5. File the accepted copy (PDF or link) and record its location here.
6. Verify the configured region, backup and disaster-recovery regions, the countries from which support staff may access data, the sub-processor list and its locations, and how Dono is notified of changes. **Subscribe to every sub-processor change notice** — Vercel in particular sends none unless subscribed. Record the result in the International Transfer Assessment.
7. Collect sufficient-guarantees evidence under §4.
8. Review this register at least annually, and whenever a provider changes its terms, entity, region or sub-processor list.

---

## 6. Outstanding actions before launch

| # | Action | Priority |
|---|---|---|
| 1 | Complete Dono's own **transfer risk assessment for Vercel** | **BLOCKING** |
| 2 | Accept, record and file the **PostHog** Article 28 terms for the Cloud EU instance | **BLOCKING** |
| 3 | Identify, accept, record and file the **Google** Article 28 terms for the support mailbox | **BLOCKING** |
| 4 | Collect **sufficient-guarantees evidence** for all six processors | **BLOCKING** |
| 5 | Confirm PostHog project settings — 12-month retention with enforcement enabled, session replay off at project level, no own-purpose use | **BLOCKING** (analytics gate) |
| 6 | Confirm whether Resend open and link tracking is enabled, and disable it unless separately justified | High |
| 7 | Confirm Resend live message and log retention | High |
| 8 | Confirm Convex and Vercel platform log retention, backup period, restore behaviour and deletion propagation | High |
| 9 | Subscribe to sub-processor change notices for **Vercel** (`privacy@vercel.com`) and Resend | High |
| 10 | Confirm which Stripe products are enabled on the Dono account | Medium |
| 11 | Flag to the solicitor: Stripe's data-subject-claim liability disclaimer (§3.4) and Vercel's Article 83 fines carve-out (Schedule 4 §2) | Medium |

**Only when items 1–5 are closed may this register be marked "complete for launch" with a date, and only then may the corresponding placeholders be removed from the Privacy Notice.**

---

## 7. Approval block — SIGNATURE REQUIRED

> **This block is unsigned. This register is not marked complete for launch.**

| Field | Entry |
|---|---|
| Approver name | Amrit Kaur Rooprai |
| Role | Controller and data protection lead |
| Document version approved | 3.0 |
| Register complete for launch? | ☐ Yes — all blocking items closed on ____________ · ☑ **No** |
| Signature | ______________________ |
| Date | ______________________ |

---

## 8. Version control

| Field | Entry |
|---|---|
| Version | 3.0 |
| Version date | 7 August 2026 |
| Effective from | On publication approval |
| Accountable owner | Amrit Kaur Rooprai |
| Approved by | *(signature required — section 7)* |
| Status | **Not approved.** Prepared for signature. Three blocking items outstanding |
| Supersedes | `../../v2.3/dono-dpa-register-v2.3.md` and all earlier versions |
| Next scheduled review | 7 February 2027, or on any provider change |
