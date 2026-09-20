# Dono Financial Crime and Sanctions Policy

**Version:** 3.0
**Version date:** 7 August 2026
**Effective from:** on publication approval (see approval block)
**Document type:** Internal policy
**Supersedes:** v2.3 (6 August 2026) and all earlier versions, retained unaltered in the version archive at `../../v2.3/`, `../../v2.2/`, `../../v2.1/`, `../../v2.0/` and `../../v1.0/`
**Owner:** Amrit Kaur Rooprai (financial-crime lead). Deputy: Sashank. Second backup: Joe.
**Resolves review finding:** F54

---

## 1. Purpose and scope

1.1 This policy sets out the financial-crime and sanctions controls that are **proportionate for a small UK student crowdfunding platform that never touches donor funds**. It deliberately avoids enterprise-scale controls that would add cost without reducing Dono's actual risk.

1.2 **Dono's regulatory position.**

(a) Dono is **not** a relevant person in the regulated sector under the Money Laundering, Terrorist Financing and Transfer of Funds (Information on the Payer) Regulations 2017, and therefore has **no customer due diligence, no suspicious activity reporting and no MLRO obligation of its own**, unless legal advice concludes otherwise. Stripe performs KYC on Connected Account holders as its own regulated obligation.
(b) **UK financial sanctions apply to Dono directly and independently of Stripe.** The prohibitions in the Sanctions and Anti-Money Laundering Act 2018 and the regulations made under it bind every person in the UK. Dono cannot delegate them to a payment provider.
(c) Dono commits the **primary criminal offences** in the Proceeds of Crime Act 2002 and the Terrorism Act 2000 if it deals with criminal or terrorist property, whether or not it is in the regulated sector.
(d) Dono is not authorised or registered by the FCA and does not carry on a regulated payment service (see `../../../../governance/open-questions/questions-for-solicitor.md`, item Q1).

## 2. Dono's actual risk profile

| Risk | Why it exists at Dono | Inherent rating | Notes |
|---|---|---|---|
| **Sanctions — donor side** | Donors may be anywhere in the world; a donation could originate from a designated person or a sanctioned jurisdiction | **Medium** | Stripe screens the payment; Dono's exposure is receiving the benefit of a payment, and its platform fee |
| **Sanctions — recipient side** | A Campaign Owner or Society officer could be a designated person | **Low** | UK students at a recognised institution; Stripe performs KYC and its own screening at onboarding |
| **Fraudulent campaign (fabricated purpose)** | The core product risk — a campaign that is invented, exaggerated or does not intend to spend as stated | **Medium–High** | Highest-likelihood financial-crime event for Dono |
| **Impersonation of a society or student** | Someone claims authority they do not have | **Medium** | Mitigated by university-email control and the authority declaration |
| **Money laundering / layering through donations** | Self-donation with stolen or illicit cards, to move value into a controlled Stripe account | **Low–Medium** | Small values, GBP only, target caps, no cash, no crypto, no payouts controlled by Dono |
| **Terrorist financing** | Campaign funds diverted to a proscribed organisation | **Low** | Prohibited category; every campaign human-reviewed; permitted purposes are narrow |
| **Card testing / stolen card use** | Donations made with stolen cards, generating chargebacks | **Medium** | Stripe Radar is the primary control; the Connected Account bears the loss |
| **Circumventing the prohibited categories** | A campaign presented as society activity that is in substance commercial, charitable or third-party fundraising | **Medium** | Addressed by campaign declarations and pre-publication review |

2.1A **Verified position as at 5 August 2026 — three points that change the risk picture.**

(a) **There is no geographic enforcement of any kind.** Access, sign-up and donation were tested successfully from outside the UK using a virtual private network. There is no unsupported-countries list and no decline logic. Clause 3.3 and 3.4 are therefore **requirements, not descriptions**, until items FC-01 and FC-02 are complete.
(b) **The enabled payment methods extend well beyond cards**, and include several tied to specific countries. That both widens the fraud surface and undercuts the "not targeting any market" position in the Geographic Scope Risk Assessment. Item **PF-15** restricts them for beta.
(c) **A public, unauthenticated payment path settles on Dono's own platform account** (`createFundPaymentIntent`), with no age gate and no terms acceptance. **This is the most serious financial-crime control gap on the Platform**: an anonymous payment route into an account Dono controls, outside every screening trigger in clause 4. Item **CF-01** removes it, and item **CF-02** checks whether it has been used.

2.1B **Two further gaps affecting escalation.** There is **no alerting of any kind** — a dispute being opened writes a database flag and notifies nobody, so the escalation timescales in clause 6 depend on someone happening to look (item AL-01). And there is **no user suspension capability** in the product; the only options are delete or leave alone, which makes the graduated response in clause 7.1 impossible to deliver (item SU-01).

2.2 **Risk-reducing structural features.** Dono never receives, holds or controls donation funds; there is no pooled account, no escrow, no wallet, no cash and no cryptocurrency; all transactions are GBP; campaigns cannot exceed their stated target; campaign owners are limited to students at one recognised institution at launch; every campaign is human-reviewed before publication; and payouts are made by Stripe, not by Dono.

## 3. Supported and unsupported countries

3.1 **Campaign Owners and Responsible Representatives** must be currently enrolled at a Recognised Institution. Physical presence in the UK is not required: eligibility continues during a year abroad, placement, field trip or other temporary period outside the UK. Anyone who will hold a Connected Account must provide a valid UK address and satisfy the Payment Provider's UK onboarding requirements in their own name.

3.2 **Donors** may be located outside the UK where Stripe supports the payment and where sanctions and other legal restrictions permit.

3.3 **Dono maintains an internal Unsupported Countries List**, reviewed at least quarterly and immediately on any change to the UK sanctions regime. It contains, at minimum:

(a) every country subject to a comprehensive UK territorial sanctions regime;
(b) every country Stripe does not support; and
(c) any country Dono has decided not to accept for documented operational or risk reasons.

3.4 **A payment from a country on the list is declined.** Where a donation is attempted from such a country, the transaction is refused and the attempt is logged. Dono does not otherwise geoblock, and does not restrict donations by country beyond what law, sanctions or Stripe requires.

3.5 **The Unsupported Countries List is maintained by the financial-crime lead** against the UK Sanctions List published by the Office of Financial Sanctions Implementation and the OFSI consolidated list. It is a document, reviewed on a schedule — not an automated feed.

## 4. Screening triggers

4.1 Dono does **not** screen every donor against sanctions lists. That would be disproportionate, duplicative of Stripe's own screening, and would require collecting more personal data than Dono holds. Dono screens on **trigger**.

4.2 **Screening triggers — a name check against the UK Sanctions List is run where:**

(a) a Campaign Owner or Responsible Representative onboards (name check at first campaign creation);
(b) a single donation is £1,000 or more;
(c) donations from one identifiable donor to one campaign total £2,500 or more;
(d) a campaign's funding target is £5,000 or more;
(e) a report, a Stripe alert, a bank enquiry or a law-enforcement enquiry raises a concern;
(f) a red flag in clause 5 is identified; or
(g) a payment is attempted from a country on the Unsupported Countries List and is not automatically declined.

4.3 **What a screen consists of.** A name search against the OFSI consolidated list and the UK Sanctions List, recorded with the date, the search term, the result and the person who ran it. A possible match is escalated immediately under clause 6 and the transaction or campaign is suspended pending the outcome.

4.4 **Records** of every screen — including negative results — are retained for six years.

## 5. Red flags for reviewers

Reviewers must escalate where they see:

- a campaign purpose that is vague, unverifiable, or inconsistent with the itemised budget;
- a budget that does not add up, or line items with no plausible supplier;
- pressure to publish urgently, or resistance to answering questions;
- a campaign that appears in substance commercial, charitable or for a third party despite the declarations;
- a Connected Account holder who is not the person the campaign describes;
- a cluster of donations of similar size in a short period, particularly from newly created accounts;
- donations that appear to come from the Campaign Owner or people closely connected with them, in significant volume;
- a spike of chargebacks or Stripe fraud alerts on one campaign;
- any reference to a person, organisation or country that appears on a sanctions list;
- any request to route funds to a different person, account or organisation; or
- a duplicate campaign, or a campaign re-created after removal.

## 6. Escalation

| Step | Who | Timescale |
|---|---|---|
| Reviewer identifies a red flag or a possible sanctions match | Any reviewer | Immediately |
| Suspend the campaign or decline the donation as an interim measure | Any reviewer | Immediately, before further analysis |
| Escalate to the financial-crime lead (deputy if unavailable within 4 hours) | Reviewer | Same working day |
| Assess: gather evidence, run screening, request information from the user (10 Working Days to respond) | Financial-crime lead | Within 5 Working Days of escalation |
| Decide: clear, restrict, remove, or report | Financial-crime lead | Within 10 Working Days of escalation, or immediately for a sanctions match |
| Report to OFSI where a designated person or frozen asset is involved | Financial-crime lead | **Without delay** — this is a legal obligation |
| Report suspected fraud or other crime to the police (Action Fraud) | Financial-crime lead | Promptly |
| Notify Stripe | Financial-crime lead | Promptly |
| Record the decision, the reasoning, the evidence and the outcome | Financial-crime lead | With the case |

6.1 **Sanctions matches are never handled informally.** Where Dono has reasonable cause to suspect it is dealing with a designated person or with frozen funds, it must not proceed with the transaction, must not tip off the person concerned about a report, and must report to OFSI. Legal advice is taken immediately.

6.2 **A suspicion of money laundering or terrorist financing** is escalated to the financial-crime lead, who takes legal advice on whether a report to the National Crime Agency is appropriate. Dono is not in the regulated sector and so has no automatic SAR duty, but the primary POCA and Terrorism Act offences apply and a report may be needed to obtain a defence.

## 7. Campaign and donation suspension workflow

7.1 **What Dono can do:** refuse to publish a campaign; unpublish or hide a live campaign; close a campaign to new donations; suspend or ban an account; decline a donation before it is taken; and refuse to onboard a Connected Account through the Platform.

7.2 **What Dono cannot do, and must never claim:** freeze, hold, delay, divert or seize funds in a Connected Account; reverse a payout; or prevent a Campaign Owner spending money already received. **The only money movement Dono can cause is a refund instruction under clause 13.2 of the Terms of Service, which returns money to the donor and never to Dono.**

7.3 **Timing matters.** Because Dono cannot hold funds, controls must operate **before** the money moves. Pre-publication review, campaign-level screening triggers and prompt suspension are therefore the load-bearing controls, not post-hoc investigation.

7.4 **Where funds have already been paid out and a campaign is found to be fraudulent**, Dono's response is: suspend and remove; refund what can be refunded under the refund mandate to the extent the account holds funds; support donor chargebacks with evidence; refer to the Institution under the Institutional Referral Protocol; and report to the police. Dono states honestly that it cannot recover dissipated funds.

## 8. Training and records

8.1 **Everyone who reviews campaigns or handles reports must complete financial-crime and sanctions training before their first review**, covering: Dono's risk profile; the red flags in clause 5; the screening triggers in clause 4; the escalation route in clause 6; the prohibition on tipping off; and the suspension workflow. Training is recorded with the name, date and content, and refreshed annually.

8.2 **Records retained for six years:** screening searches and results; escalations and their outcomes; suspension and removal decisions with reasons; OFSI and law-enforcement reports and references; training records; and each quarterly review of the Unsupported Countries List.

## 9. Review

9.1 This policy is reviewed at least annually, and immediately on: a change in Dono's payment architecture; any decision to hold or control funds; a change in the UK sanctions regime affecting Dono; a material incident; or legal advice on Dono's regulated-sector status.

---

## Approval block — SIGNATURE REQUIRED

> **This block is unsigned. This document is prepared for approval and is not approved.**

**I confirm that I have reviewed this document in its consolidated v3.0 form, that it states the current position only, and that I approve it.**

| Field | Entry |
|---|---|
| Approver name | Amrit Kaur Rooprai |
| Role | Controller, sole trader and accountable owner |
| Document version approved | 3.0 |
| Approved for use | ☐ Yes, on ____________ · ☑ **No** |
| Signature | ______________________ |
| Date of approval | ______________________ |

**Reviewed by:** Sashank (deputy) — Signature ______________________  Date ______________

---

## Version control

| Field | Entry |
|---|---|
| Version | 3.0 |
| Version date | 7 August 2026 |
| Effective from | On publication approval |
| Accountable owner | Amrit Kaur Rooprai, sole trader trading as Dono |
| Prepared by | Legal consolidation, 7 August 2026 |
| Reviewed by | *(signature required — approval block above)* |
| Approved by | *(signature required — approval block above)* |
| Status | **Not approved.** Clean consolidated document prepared for signature |
| Supersedes | v2.3 (6 August 2026) and all earlier versions, retained unaltered in the version archive |
| Next scheduled review | 7 February 2027, or on any material change to the Platform, the law, or Dono's payment configuration |
| Archive rule | Published versions are never overwritten or deleted. The version in force at the time of acceptance governs the relevant transaction |
