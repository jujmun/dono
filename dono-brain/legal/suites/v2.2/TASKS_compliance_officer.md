# Tasks for the compliance and legal officer

**Version:** 2.2 — 31 July 2026
**Owner:** Amrit Kaur Rooprai (data protection lead, Online Safety lead, financial-crime lead). **Deputy: Sashank. Second backup: Joe.**

Non-engineering work that terms_v2.2 creates an obligation for — registrations, agreements, assessments, sign-offs, figures to set and people to notify. Nothing here needs a developer.

**BLOCKING** items prevent launch or prevent publication of the cited document.

---

## 1. Registrations and external filings

**1.1 Register Dono with the NCA CSEA Industry Reporting Portal.** **BLOCKING**
The reporting duty has been in force since 7 April 2026 and applies regardless of size or assessed risk. Registration is a precondition of using the portal and must not wait for an incident. Register **Amrit as Organisation Administrator**, create and test a **Deputy Organisation Administrator account for Sashank**, and register **at least two individually authorised reporters** meeting the NCA's eligibility requirements. Record an emergency contact. Complete a **mock report using harmless test data** and confirm the urgent alert works.
*Source: OSA Procedures 3.4; review C08.*

**1.2 Complete the ICO registration self-assessment and act on the result.**
The Privacy Notice currently says Dono has assessed its position and will comply with any obligation that applies. Close the `[CONFIRM]` — either state a registration reference factually, or record the assessed conclusion that none is required.
*Source: Privacy 1.3.*

**1.3 Confirm the VAT position with an accountant.**
Dono states it is not VAT registered and that displayed prices contain no VAT element. Confirm the threshold position and set a monitoring trigger, since the clause will date.
*Source: ToS 16.3; Donor 6.2; review M17.*

## 2. Contracts with providers

**2.1 Accept and file the Resend DPA.** **BLOCKING**
Record the entity covered, how it was accepted, its effective date and version, whether it covers every product used, and where the copy is filed. Confirm Resend's processing region, its transfer mechanism, and how long it retains email content and logs.
*Source: DPA Register; Privacy 8.1; ROPA rows 23–24.*

**2.2 Accept and file the PostHog DPA.** **BLOCKING**
Confirm it covers the **Cloud EU** instance. Confirm contractually that **PostHog may not use the data for its own purposes**. Confirm the project's event-retention setting can be set to 26 months.
*Source: DPA Register; Privacy 8.1; Cookie 3.2.*

**2.3 Confirm and file the correct Stripe terms and DPA.** **BLOCKING**
Identify which Stripe entity and which product terms apply to Dono's account. Note that Stripe is an **independent controller** for most of this processing, so the analysis is controller-to-controller, not Article 28.
*Source: DPA Register; Privacy 8.2.*

**2.4 Complete Dono's own transfer risk assessment for Vercel.** **BLOCKING**
Vercel's DPA relies on SCCs plus the UK Addendum but contains **no transfer impact assessment**, unlike Convex's. Because Dono relies on an Article 46 safeguard, Dono must complete its own before the transfer can lawfully be relied on. Cover the seven points listed in the International Transfer Assessment.
*Source: International Transfer Assessment; Privacy 8.1; review C09.*

**2.5 Collect sufficient-guarantees evidence for all four processors.**
Article 28 requires more than a signed contract. Hold, for Convex, Vercel, Resend and PostHog: security documentation; encryption and access controls; breach-notification arrangements; deletion functionality; audit or certification information; sub-processor controls; and assistance with subject-access requests and breaches.
*Source: DPA Register; review C09.*

**2.6 Record each provider's sub-processor list, backup regions, and support-access countries, and set up change notifications.**
A restricted transfer includes remote access, so "we chose an EU region" is not an answer on its own.
*Source: International Transfer Assessment.*

## 3. Agreements with people

**3.1 Execute written agreements with everyone who has access to identity data, evidence, moderation records or appeals.** **BLOCKING**
Several people review student cards, refund evidence, moderation cases and appeals. No document establishes their status, confidentiality obligations, IP assignment, data-access authority, training or conflicts position. This is a data, IP and vicarious-liability gap, and it also undermines the Privacy Notice's assurance that access is restricted to authorised people. Cover: confidentiality; IP assignment; data-processing and security obligations; acceptable use; conflicts; and return or deletion on departure.
*Source: ToS 1.1; Privacy 14.1; APD §11; review H27.*

**3.2 Approve and record an access matrix.**
Who may see student-card images, card numbers, refund evidence, moderation cases, CSEA material and financial-crime escalations. Remove access promptly on departure.
*Source: Privacy 6.3, 14.1; APD §6.*

**3.3 Audit and secure Dono's IP chain of title.**
Saying the software and branding belong to Dono does not prove assignment from founders, contractors or volunteers. Audit code, designs, copy, the domain, trade marks and datasets; execute assignments and moral-rights consents; record open-source licences; consider trade-mark registration after clearance.
*Source: ToS 20.1; review M16.*

## 4. Assessments and internal records to complete

**4.1 Complete the sanctions and financial-crime risk assessment.** **BLOCKING**
Tie the controls in the Financial Crime & Payments Policy to Dono's actual campaign and transaction profile. UK sanctions apply to Dono independently of Stripe.
*Source: Financial Crime 9.2; review H18.*

**4.2 Approve and date the DPIA — and note that it does not currently support launch.** **BLOCKING**
Residual risk is assessed as **HIGH**, because seven of sixteen risks depend on unbuilt engineering controls. Reassess once features 17–20, 8, 9, 10 and the Vercel TRA are complete. **Do not process high-risk data until the required mitigations are live.**
*Source: DPIA §6, §7.*

**4.3 Run the incident-response tabletop exercise and record it.** **BLOCKING**
One simulated breach covering a stolen account, an exposed database and a compromised API key. Record the timeline, decisions and improvements. **Until this happens, no Dono document may say the plan is tested** — the Privacy Notice has already been corrected.
*Source: Incident Response Plan, Status; Privacy 14.1; review H17.*

**4.4 Complete the pre-launch acceptance test in the Online Safety Act Procedures.** **BLOCKING**
Ten checks, from "every UGC surface has a working report control" to "a Priority 1 scenario has been rehearsed". None has been demonstrated. This is what turns a paper assessment into a working system.
*Source: OSA Procedures, Pre-launch acceptance test; review C07.*

**4.5 Sign and date every internal document.**
The Financial Crime Policy, Refund Decision Checklist and Appropriate Policy Document previously carried `Last updated: [date]`; the DPIA and Illegal-Content Risk Assessment have blank approval fields. Give each an owner, approver, effective date, version, review date, backup and linked evidence location.
*Source: review M24.*

**4.6 Build the evidence register for the Illegal-Content Risk Assessment.**
Production screenshots; deployment record; Stripe Connect configuration; test-user results; moderation policy version; the named responsibility matrix; a reporting-inbox test; a takedown test; an audit-log example; the prohibited-content rules; training records; NCA registration evidence; the incident-response exercise; and the complaints workflow test. Ofcom has identified inadequate evidence as a recurring weakness.
*Source: Illegal-Content RA §11.*

## 5. Figures and decisions to set

**5.1 Set the under-spend de minimis threshold.** **BLOCKING for four documents**
Calculate it from the objective per-transaction cost (the 20p fixed component and the Payment Provider's per-transaction charges). **There is no de minimis on over-funding** — that is refunded in full. The residue under the threshold stays dedicated to the campaign purpose, is never retained by Dono, and must be declared in the Closure Statement. Disclose the figure at checkout and at closure.
*Source: ToS 14.6; Student 6.1; Donor 10.3; Refund 10.3.*

**5.2 Sign off the constitutional-approval bands** (£2,500 / £10,000) in the Society Campaign Terms. These are a commercial risk decision, not a legal requirement.
*Source: Society 2.3; Society Forms 8.1 item 11.*

**5.3 Sign off the financial-crime thresholds** (£10,000 individual / £50,000 society / £100,000 founder review) and decide whether they are published or remain internal. Keep them distinct from 5.2, which serves a different purpose.
*Source: Financial Crime 4.1.*

**5.4 Sign off the business-user liability cap** — the greater of £500 or twelve months' platform fees — with the solicitor, and revisit once insurance is in place.
*Source: ToS 27.3(b).*

## 6. Insurance and financial

**6.1 Obtain broker advice and put insurance in place.** 
Dono is an uninsured sole trader with, now, **no monetary cap on consumer liability**. Map insured risks, exclusions, deductibles and required controls before finalising the business-user cap. Consider cyber, technology errors-and-omissions, public liability and crime or fidelity cover.
*Source: ToS 27.7; review L12.*

**6.2 Obtain accountant sign-off on the tax position** for Dono and for Campaign Owners and Recipients — including whether a society or an individual receiving funds has income, corporation or VAT consequences. Do not imply that the word "donation" determines tax treatment.
*Source: ToS 16.3; review M17.*

## 7. Solicitor sign-off — the list to send

Send the whole suite, with these questions marked:

**7.1** **Payment-services perimeter memorandum.** Based on the executed Stripe agreement, the live API flow, the charge type, the fund flow, the contractual agency and the user-facing communications. Confirm whether Dono is only a technical service provider, a registered agent, or outside scope for another reason. **Do not publish "Dono does not receive, hold, safeguard or control donation funds" until the conclusion supports that exact statement** — and note that the community-fund path must be removed first. *ToS 4.2; review C10.*

**7.2** **Contract formation and agency.** Does the standing-offer plus disclosed-agency mechanism in ToS 12.2 form an enforceable contract between donor and campaign owner, and identify the counterparty adequately? *ToS 12; review C04.*

**7.3** **Society capacity and the personal-fallback clause.** Is clause 1.2(c) of the Society Campaign Terms enforceable against a Society Representative — that where the Society cannot bear legal responsibility, the representative accepts the obligations personally? And is an unincorporated student society properly treated as a **business user** under clause 1.5? *Society 1.2–1.5; review C05.*

**7.4** **Consumer status.** Is an individual student Campaign Owner a consumer, as ToS 27.2 and Student 1.4 now assume? *Review H02, H28.*

**7.5** **The business-user cap.** Is the greater of £500 or twelve months' fees defensible, and is the exclusion of indirect loss in ToS 27.3(a) enforceable against a student society? *ToS 27.3.*

**7.6** **Consumer Contracts Regulations.** The two-structure analysis in ToS 16.4 and Donor 5.2–5.3; the immediate-performance request and acknowledgement wording; and the model cancellation form. *Review H03.*

**7.7** **DMCC Act section 308.** What exactly must a final response to a consumer complaint contain, and does any sector-specific or contractual ADR participation duty apply to Dono? The previous draft cited the revoked 2015 Regulations. *Complaints 6.2; review H26.*

**7.8** **Defamation Act section 5.** The website-operator notice procedure and its timings, which ToS 20.3 now points at. *Review M15.*

**7.9** **Article 9 and Article 10 conditions** in the Appropriate Policy Document — particularly whether Schedule 1 paragraph 10 properly supports processing a **user-to-user allegation** of criminal conduct, which is the weakest of the cases relied on. *APD §11; review H14.*

**7.10** **Article 14 assessment** for third-party personal data in uploaded receipts. *Privacy 11.3; review M10.*

**7.11** **Children's access and children's risk assessments**, given the decision to operate child-safe by default with **declared, not verified** age, and with donating open to all ages. *OSA Procedures 3.3; Children's RA; review C06.*

**7.12** **Governing law and jurisdiction**, and the consumer carve-out. *ToS 32.*

**7.13** **Institutional referral protocol** in ToS 23.7 — authority, lawful basis, minimum data, allegation labelling, notice and correction. *Review M22.*

**7.14** **The wind-down plan and deputy authority** in ToS 31.3, given that Dono is a sole trader and the operator's incapacity would otherwise leave users without access to evidence, refund decisions or moderation. *Review M23.*

## 8. Documents still to write

**8.1 A wind-down and business-continuity plan.** Named authorised deputies, credential recovery, user notices, data export and deletion, live-campaign closure, and regulator contacts. ToS 31.3 already promises it exists.
*Source: ToS 31.3; review M23.*

**8.2 An Institution Agreement**, before any institutional data sharing or aggregate reporting. Purpose limitation, data fields, retention, controller status, honouring withdrawals, and deletion when no longer required. **Not needed for launch, because no sharing is happening — but nothing may be shared without it.**
*Source: Privacy 9.3, 9.6; review H19.*

**8.3 A moderation decision guide** covering all 18 categories of priority illegal content, permitting either conclusion — reasonable grounds to consider the content illegal, **or** breach of Dono's own Terms — so that a moderator is never asked to determine criminal liability.
*Source: Illegal-Content RA §11; OSA Procedures 3.2.*

**8.4 A launch sign-off register.** For every remaining `[SOLICITOR SIGN-OFF]`, `[ENGINEERING — BUILD REQUIRED]`, `[DPA OUTSTANDING]`, `[CONFIRM]` and `[TO BE CALCULATED]` marker: owner, evidence, decision, approving person, and the document version it was applied to. **No public document may be deployed unless legal, payments, privacy, online-safety and engineering sign-offs are complete for that version.**
*Source: review C01.*

## 9. Training and ongoing operations

**9.1 CSEA training for everyone who reviews reports.** Short and **non-graphic**: what may amount to CSEA content including grooming material and not only images; when to stop viewing; how to restrict content; how to escalate; the three priority levels; the 999 route; the prohibition on personal downloads, screenshots and forwarding; confidentiality; and staff welfare. Only Amrit and Sashank need detailed portal training. **Keep a training record.**
*Source: OSA Procedures 3.4.*

**9.2 Financial-crime training** on red flags, the escalation route, the confidentiality rule, and the limits of Dono's powers — in particular that **Dono cannot hold a payout**.
*Source: Financial Crime 9.3.*

**9.3 Brief Sashank on the incident-response plan and the data-protection complaints workflow** before launch. Both name him as deputy.
*Source: Incident Response Plan; DP Complaints Workflow.*

**9.4 Set up the monthly reviews:** the online-safety metrics record; the complaints log; and the breach log. All three are promised in v2.2.
*Source: OSA Procedures; Complaints 7.1; Incident Response Plan §8.*

**9.5 Diarise the review dates.** Every internal document carries a review date of 31 January 2027 and a set of earlier triggers. The Illegal-Content Risk Assessment additionally requires an effectiveness review at three months and six months after launch, and the Children's Risk Assessment at six months.
