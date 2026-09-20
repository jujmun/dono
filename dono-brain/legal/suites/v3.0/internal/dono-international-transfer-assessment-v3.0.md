# International Transfer Assessment — Dono

**Document:** Restricted transfer register and transfer risk assessments (Chapter V UK GDPR)
**Version:** 3.0
**Version date:** 7 August 2026
**Effective from:** on publication approval (see approval block)
**Controller:** Amrit Kaur Rooprai, sole trader, trading as Dono
**Accountable owner:** Amrit Kaur Rooprai (data protection lead) · **Deputy:** Sashank
**Supersedes:** `../../v2.3/dono-international-transfer-assessment-v2.3.md` and all earlier versions
**Status:** Clean consolidated record. States the current position only.
**Next review:** at least annually, and on any change of provider, entity, region or sub-processor list.

---

## 1. Purpose and scope

This document records, for each provider, whether personal data is transferred outside the UK, the Article 46 safeguard relied on, and the transfer risk assessment supporting it.

**A restricted transfer includes making personal data accessible to a separate organisation outside the UK** — not only physically sending it abroad. Remote access by a provider's support staff, or a sub-processor located overseas, creates a restricted transfer even where the selected storage region is inside the UK or EEA. **"We chose an EU region" is not by itself an answer.**

**No UK adequacy regulation is relied on for the United States** in respect of any transfer below, except where a provider's own Data Privacy Framework certification is expressly recorded as an additional basis.

**A DPA containing SCCs or the UK Addendum does not discharge Dono's own assessment obligation.** The contract is the safeguard; the assessment is the check that the safeguard works in the destination.

---

## 2. What has materially changed the risk profile

Two product decisions materially lower the risk of every transfer below, and are the reason several assessments now close:

1. **Dono no longer collects student-card images, student numbers, government identity documents or face scans.** Those categories are removed from every transfer inventory. The most sensitive identity material now sits with Stripe as independent controller and never enters Dono's own processor chain.
2. **Dono never receives or stores payment card data.** Card details go directly to Stripe.

What remains in the Dono processor chain is: account and contact data, campaign content submitted for publication, receipts and evidence, moderation and complaint records, transaction metadata (not card data), four identity **outcome** fields, and server logs. Special category and criminal-offence data appears only in the moderation, safeguarding, complaint and legal-claim records, which are held in Convex (EU) and are restricted-access.

---

## 3. Restricted transfer register

| Provider | Contracting entity | Region configured | Transfer outside the UK? | Safeguard relied on | TRA | Status |
|---|---|---|---|---|---|---|
| **Convex** (database, backend, file storage) | Convex, San Francisco | **Ireland / EU — `eu-west-1`** | **Yes.** The DPA expressly permits transfers from the UK to the United States and to sub-processor countries | **EU SCCs (2021, Module Two — controller to processor) plus the UK Addendum.** Not the standalone IDTA | **Provider assessment adopted** — see §4.1 | **Closed** |
| **Convex Auth** (authentication) | As Convex | As Convex | As Convex | As Convex | As Convex | **Closed** |
| **Vercel** (web and application hosting) | Vercel | **United States**, across AWS, Azure and GCP | **Yes**, and more diffuse than any other provider — "anywhere else in the world where Vercel or its Subprocessors maintain data processing operations" | **EU SCCs plus the UK Addendum.** Vercel's Schedule 3 labels this a "UK IDTA", but Schedule 5's text shows it is the ICO's **Addendum** to the EU SCCs, not the free-standing IDTA. Modules One, Two and Three selected per relationship | **Dono's own required — Vercel's DPA contains none.** Substantially completed at §4.3; two elements outstanding | **OPEN — BLOCKING** |
| **Resend** (transactional, campaign-update and marketing email) | **Plus Five Five, Inc.**, San Francisco | **United States** (DPA §6.1) | **Yes**, expressly | **EU SCCs (Modules 1/2/3) as amended by the UK Addendum ("UK SCCs")**, plus **EU–U.S. DPF and UK Extension certification** as an additional basis, plus documented supplementary measures at DPA §6.6 | **Completed** — see §4.2 | **Closed** |
| **PostHog** (product analytics) | PostHog | **EU — PostHog Cloud EU** | **To confirm.** EU processing is configured; sub-processor locations and support-access locations are not yet confirmed | **[CONFIRM]** — if processing and all access are genuinely EU-only, no Article 46 safeguard is needed for a UK-to-EU transfer beyond the Article 28 contract; if not, EU SCCs plus the UK Addendum will apply | Required only if an Article 46 safeguard is relied on | **OPEN — BLOCKING** (analytics gate) |
| **Google** (support mailbox) | **[CONFIRM]** | **[CONFIRM]** | **[CONFIRM] — likely yes** | **[CONFIRM]** | Required once the mechanism is known | **OPEN — BLOCKING** |
| **Stripe** (payments, Connect onboarding, KYC, identity, fraud) | **Stripe Payments Europe, Limited** (a UK-located Stripe Account contracts with SPEL, not Stripe, LLC) | Ireland and the United States, plus Stripe Affiliates and sub-processors globally | **Yes** | **Stripe's Data Transfers Addendum** (`stripe.com/legal/dta`), which supplies the applicable instrument: Data Privacy Framework, EEA SCCs (Modules 1 and 2), or the **UK International Data Transfer Addendum**. The Data Transfers Addendum prevails over the DPA on any transfer conflict | **See §4.4.** Stripe is an **independent controller** for most of this processing, so the analysis is controller-to-controller, not the processor analysis | **Closed as to mechanism**; see §4.4 |
| **Error monitoring** | — | — | — | — | — | **Not applicable — none in use** |
| **Consent management** | — | The user's own device | No | — | — | **Not applicable — built in-house** |

---

## 4. Transfer risk assessments

Each assessment addresses the seven elements required: (1) categories of data; (2) purpose, frequency and volume; (3) destination-country law on government access; (4) the recipient's government-request history and policy; (5) practical protections; (6) the essential-equivalence conclusion; and (7) supplementary measures and review date.

### 4.1 Convex — CLOSED (provider assessment adopted)

| Element | Assessment |
|---|---|
| **1. Categories** | All Platform data held in Convex: account and contact data, campaign content, receipts and evidence, moderation, complaint and contract records, transaction metadata, four identity outcome fields, and the four special category / criminal-offence categories in the moderation, safeguarding, complaint and legal-claim records. **No identity documents, no face scans, no student cards, no card data** |
| **2. Purpose, frequency, volume** | Continuous, for the life of the service. Volume is pre-launch and small. Storage region is Ireland; the transfer arises from US-based operation and sub-processors |
| **3. Destination law** | United States. FISA 702 and EO 12333 are the relevant surveillance regimes. No UK adequacy regulation exists for the US generally |
| **4. Recipient history and policy** | Convex's Exhibit A Section D contains the standard **FISA 702 and national-security-request questionnaire**, addressing whether the importer is subject to those regimes and its history of requests |
| **5. Practical protections** | Encryption in transit and at rest; role-based access control; EU storage region reducing routine US exposure; sub-processors bound by the same mechanism and listed separately with a **10-day** objection window |
| **6. Conclusion** | Convex's Exhibit A Section E records the parties' assessment that transferred personal data receives protection **essentially equivalent** to that under applicable law, with **no supplementary measures required**. Dono has reviewed that assessment against the categories actually transferred and, given the removal of identity documents and card data, **adopts it** |
| **7. Supplementary measures / review** | None required beyond the contractual and technical measures above. Review annually or on any sub-processor or region change |
| **Note** | The Convex DPA does not reference the EU–US Data Privacy Framework. If Convex is DPF-certified that would be an additional independent basis and should be checked on its trust centre |

### 4.2 Resend — CLOSED

| Element | Assessment |
|---|---|
| **1. Categories** | Email addresses, message metadata and message content for donation confirmations, service messages, one-time passcodes, campaign updates and marketing email. Message content may include a name and attachments added by the sender. **Resend's Exhibit A records sensitive data as "Not applicable"**, and Dono must keep it that way — no special category or criminal-offence content in email bodies. If open and link tracking is enabled it would add IP address, location, operating system, browser, device, email client and spam complaints; **Dono must confirm whether it is enabled and disable it unless separately justified** |
| **2. Purpose, frequency, volume** | Continuous for the life of the agreement. Volume is transactional and pre-launch. Purpose is reliable delivery of application email |
| **3. Destination law** | United States (San Francisco). FISA 702 and EO 12333 apply |
| **4. Recipient history and policy** | **Documented.** DPA §6.6.1 records that as at the DPA date Resend **had received no formal legal request from any government intelligence or security service** for access to customer personal data. §6.6.2 commits Resend, where permitted by law, to redirect a requesting authority to Dono, to give Dono prompt notice unless prohibited, to cooperate with Dono in seeking a protective order, and **not to disclose voluntarily** in the absence of a valid and binding legal requirement. §6.6.3 commits both parties to meet and consider whether transfers should be suspended |
| **5. Practical protections** | TLS in transit; encryption at rest; SOC 2 Type II / ISO 27001 audited infrastructure providers; MFA and SSO; multi-tenant authorisation with no direct infrastructure access; static code analysis and annual third-party penetration testing; personnel background checks and executed confidentiality agreements; log aggregation and alerting; documented incident records; **deletion of customer data within 90 days of account termination** |
| **6. Conclusion** | Taken together — the EU SCCs as amended by the UK Addendum, the **EU–U.S. DPF and UK Extension certification with FTC enforcement and ICO complaint cooperation**, the documented absence of government access requests, the challenge-and-notify commitments, the low sensitivity of the data (transactional email metadata and content with no special category data), and the technical measures — the transfer provides protection **essentially equivalent** to UK standards. **Assessment closed.** |
| **7. Supplementary measures / review** | No additional supplementary measures required beyond those in DPA §6.6. **Required operational actions:** subscribe to sub-processor change notices (14 days' notice, silence deemed consent); request the certifications or reports available under DPA §8.4; request deletion certification under SCC Clause 8.1(d)/8.5, which is provided **only on request**. Review annually or on any sub-processor change |

### 4.3 Vercel — OPEN (BLOCKING)

Vercel's DPA states only that it "will ensure such transfers are made in compliance with the requirements of Applicable Data Protection Laws" (§13). That is a general compliance promise, **not a documented assessment**. Dono therefore must complete its own. This assessment is substantially complete; two elements remain open and are the reason it cannot yet be closed.

| Element | Assessment | Complete? |
|---|---|---|
| **1. Categories** | **Platform data in transit** and **server logs**: IP address, timestamp, page requested, browser and error data. Vercel is the hosting and delivery layer, not the data store — persistent records live in Convex (EU). **No identity documents, no face scans, no student cards, no card data, and no special category or criminal-offence record is stored in Vercel.** Special category data may transit the hosting layer within an in-flight request body (for example a moderation note being saved), so the assessment treats transient exposure as in scope | **Yes** |
| **2. Purpose, frequency, volume** | Continuous, for every request to the Platform. Purpose is hosting, delivery, security, availability and fault detection. Volume is pre-launch and small. **Diffuse destination**: the US as primary, plus "anywhere else in the world where Vercel or its Subprocessors maintain data processing operations", across AWS, Azure and GCP | **Yes** |
| **3. Destination law** | United States primarily. FISA 702 and EO 12333 are the relevant regimes. Because Vercel reserves the right to process anywhere its sub-processors operate, the destination set is not closed, which is itself a risk factor and is recorded as such | **Yes** |
| **4. Recipient history and policy** | **OUTSTANDING.** Vercel's DPA contains **no FISA 702 questionnaire, no government-request history disclosure and no notify-or-challenge commitment**. Dono holds no information on whether Vercel has received government access requests or what its policy is on challenging and reporting them | **NO** |
| **5. Practical protections** | Encryption in transit (TLS) and at rest; role-based access control; **persistent personal data is stored in Convex in the EU rather than in Vercel**, so the material at rest in the US hosting layer is limited to logs; log content is limited to IP, timestamp, request path, browser and error data; authentication logs retained 12 months. **Platform log retention beyond that is [CONFIRM]** | **Partly** |
| **6. Conclusion** | **Cannot yet be concluded.** The data categories are low-sensitivity and the technical measures are adequate, which points towards essential equivalence. But element 4 is entirely absent and the destination set is open-ended, so the conclusion cannot be responsibly recorded. **A transfer risk assessment with a blank element 4 is not a completed assessment** | **NO** |
| **7. Supplementary measures / review** | To be determined on the answer to element 4. At minimum: **subscribe to sub-processor change notices via `privacy@vercel.com`** — Vercel sends none unless subscribed, and the objection window is only **5 days**, the shortest of any provider | **NO** |

**To close this assessment, Dono must:**

1. Request from Vercel its transfer impact assessment, or its FISA 702 position and government-request history and transparency policy, in writing. Record the request and the response, **including a non-response**.
2. Confirm Vercel's platform log retention period and whether any log is retained beyond the authentication-log period.
3. Confirm the current sub-processor list and their locations, and **subscribe to change notices**.
4. Record the essential-equivalence conclusion and any supplementary measures on that evidence.

**If Vercel does not provide the information**, Dono must record that fact and reach its own conclusion on the basis of the low sensitivity of the hosted data and the EU location of the persistent store, or change provider. An unanswered request that is documented is a defensible position; an unasked question is not.

### 4.4 Stripe — CLOSED as to mechanism

| Element | Assessment |
|---|---|
| **Relationship** | **This is not a processor transfer for most of the processing.** Stripe is an **independent controller** for payment processing, Connect onboarding, KYC, AML, identity verification, fraud detection and its own regulatory compliance. Dono's disclosure of personal data to Stripe for those purposes is a **controller-to-controller** restricted transfer. Stripe is Dono's processor only where it processes on Dono's instructions to service the Stripe platform |
| **1. Categories** | Name, email, billing address, transaction data, device ID, IP address and location, order description and ID, tax ID, unique customer identifier. Stripe additionally collects — **directly from the data subject, not from Dono** — payment card details, bank account details, government-issued identity documents and facial recognition data. **Dono never transfers an identity document, a face scan or card data to Stripe, because Dono never holds them** |
| **2. Purpose, frequency, volume** | Continuous, per transaction and per onboarding. Purpose is payment processing and Stripe's own regulatory obligations |
| **3. Destination law** | United States (Stripe, LLC) plus Stripe Affiliates and sub-processors globally. Contracting entity SPEL is in Ireland |
| **4. Recipient history and policy** | Stripe informs Dono of each law enforcement request requiring disclosure of personal data, unless prohibited by law (DPA §3.1(d)) |
| **5. Practical protections** | PCI-DSS Level 1, confirmed annually by a QSA; SOC reports; AES-256 at rest; TLS 1.2 in transit and mTLS internally; card and bank numbers separately encrypted in a restricted vault with decryption keys on separate machines; MFA aligned to NIST 800-63B; documented access, entry, separation and availability controls; 48-hour incident notification for GDPR and UK GDPR data |
| **6. Conclusion** | The **Data Transfers Addendum** supplies the applicable instrument for each transfer — DPF, EEA SCCs or the **UK IDTA** — and prevails over the DPA on conflict. Combined with the security measures above and the fact that the highest-sensitivity categories are collected by Stripe directly rather than transferred by Dono, the transfer provides protection essentially equivalent to UK standards. **Closed as to mechanism** |
| **7. Supplementary measures / review** | **Required actions:** confirm which Stripe products are enabled on the Dono account and that the DPA version on file (18 November 2025) is the version in force; obtain and file the current SOC report reference; check the Data Transfers Addendum for updates at each review. **Flag to the solicitor:** DPA §3.4 disclaims Stripe's liability to Dono for any claim brought by a data subject arising from Stripe's acts or omissions |

### 4.5 PostHog — OPEN (analytics gate)

No assessment can be completed until the Article 28 terms are accepted and the following are confirmed: that the terms cover the **Cloud EU instance**; the **sub-processor locations**; the **support-access locations**; and that PostHog **may not use the data for its own purposes**. If processing and all access are genuinely EU-only, a UK-to-EU transfer requires no Article 46 safeguard and the row closes on the Article 28 contract alone. If any access sits outside the EEA or UK, EU SCCs plus the UK Addendum apply and a full assessment on the §4.3 template is required.

**PostHog must not be enabled until this row and the provider-register row are both closed.**

### 4.6 Google (support mailbox) — OPEN

No assessment can be completed until the exact Google product, entity, terms and region are identified. **This channel receives data protection complaints, rights requests, content reports, Online Safety complaints and legal notices**, so its sensitivity is high relative to its low visibility in the architecture. Treat as blocking.

---

## 5. Summary

| Provider | Mechanism | TRA | Blocking? |
|---|---|---|---|
| Convex | EU SCCs (M2) + UK Addendum | **Closed** — provider assessment adopted | No |
| Convex Auth | As Convex | **Closed** | No |
| **Resend** | EU SCCs (M1/2/3) + UK Addendum + DPF/UK Extension | **Closed** — completed at §4.2 | No |
| Stripe (SPEL) | Data Transfers Addendum: DPF / EEA SCCs / UK IDTA | **Closed as to mechanism** — §4.4 | No |
| **Vercel** | EU SCCs + UK Addendum | **OPEN** — element 4 absent | **YES** |
| **PostHog** | To confirm | **OPEN** | **YES** (analytics gate) |
| **Google** | To confirm | **OPEN** | **YES** |

Three of six restricted-transfer rows are now closed, including Resend, which was open at v2.3. Three remain blocking.

---

## 6. Actions before launch

| # | Action | Priority |
|---|---|---|
| 1 | Request Vercel's transfer impact assessment or FISA 702 position and government-request history **in writing**, and record the request and any response or non-response | **BLOCKING** |
| 2 | Complete and record the Vercel essential-equivalence conclusion on that evidence | **BLOCKING** |
| 3 | Accept the PostHog Cloud EU terms and confirm sub-processor and support-access locations | **BLOCKING** |
| 4 | Identify and record the Google support-mailbox entity, terms and region | **BLOCKING** |
| 5 | Subscribe to sub-processor change notices — **Vercel (`privacy@vercel.com`, 5-day window, no notice without subscription)** and Resend (14-day window) | High |
| 6 | Confirm whether Resend open and link tracking is enabled; disable unless separately justified | High |
| 7 | Confirm Convex and Vercel platform log retention, backup regions, restore behaviour and deletion propagation | High |
| 8 | Confirm which Stripe products are enabled and that the filed DPA version is in force | Medium |

**Only when rows 1–4 are closed does this document become a complete evidence base for clause 8 of the Privacy Notice**, and only then may the transfer-outstanding markers there be removed.

---

## 7. Approval block — SIGNATURE REQUIRED

> **This block is unsigned. Three restricted-transfer rows remain open and blocking.**

| Field | Entry |
|---|---|
| Approver name | Amrit Kaur Rooprai |
| Role | Controller and data protection lead |
| Document version approved | 3.0 |
| All restricted transfers assessed and closed? | ☐ Yes, on ____________ · ☑ **No — Vercel, PostHog and Google outstanding** |
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
| Status | **Not approved.** Prepared for signature |
| Supersedes | `../../v2.3/dono-international-transfer-assessment-v2.3.md` and all earlier versions |
| Next scheduled review | 7 February 2027, or on any provider, entity, region or sub-processor change |
