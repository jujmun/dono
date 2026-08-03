# Financial Crime & Payments Policy

**Owner:** Amrit Kaur Rooprai. **Deputy:** Sashank. **Second backup:** Joe.
**Version:** 2.2 — 31 July 2026
**Approved by:** _________________ **Date:** _________________
**Next review:** 31 January 2027, and whenever Dono's scale, payment volume or Stripe arrangement changes.

Internal policy. Applies to everyone involved in reviewing campaigns, handling donor or campaign-owner queries, or monitoring platform activity.

## Changes in v2.2

- **The "ask Stripe to hold the payout" power is removed.** Engineering has confirmed Dono cannot hold or delay a payout, and that the payments architecture deliberately forbids it. A policy authorising an action that cannot be taken is worse than no policy.
- **Dono's own responsibility for sanctions is stated.** UK sanctions apply to Dono independently of Stripe; the previous draft over-delegated.
- **The "do not tip off" instruction is qualified** by Dono's actual regulatory status.
- Dono's claim to verify that campaign purposes are "genuine and lawful" is **narrowed** to match the public disclaimers.
- **Campaign value thresholds, enhanced-review triggers, red flags and escalation routes** are added.
- A **sanctions decision route** and the OFSI escalation are added.

---

## 1. Purpose, scope and Dono's regulatory position

1.1 This policy sets out how Dono manages the risk of financial crime — money laundering, terrorist financing, fraud and sanctions evasion — on the Platform.

1.2 **Dono's position.** Dono is not a payment institution and does not operate a bank-style anti-money-laundering programme. Payment processing is carried out by Stripe under a Stripe Connect arrangement using direct charges to connected accounts, and Stripe's own compliance obligations cover the regulated elements of that processing. **Dono does not receive, hold, safeguard or control donation funds.**

1.3 **Statutory reporting assumption.** Dono is **not** treated as having regulated-sector anti-money-laundering reporting obligations, unless and until legal advice concludes otherwise. Dono will comply with any legal obligation that does apply and will cooperate with competent authorities. **[SOLICITOR SIGN-OFF — confirm this assumption as part of the payment-services perimeter memorandum.]**

1.4 **Sanctions are different.** **UK financial sanctions apply to Dono directly**, whatever Stripe does. Stripe's screening does not establish that a campaign's purpose, its beneficiary or the persons connected to it are lawful. Dono therefore maintains its own risk-based sanctions controls, described in section 5.

## 2. Division of responsibility

**Stripe is responsible for:** identity verification (KYC) of connected-account holders; payment processing; payment-level sanctions screening; payment-level fraud detection; and chargeback mechanics.

**Dono is responsible for:** reviewing and approving campaigns before they go live; **assessing, on a reasonable and risk-based basis, whether a campaign's stated purpose appears legitimate and lawful**; monitoring the Platform for suspicious patterns; enforcing this policy, including pausing campaigns and escalating concerns; Dono's own sanctions compliance; and cooperating with Stripe and law enforcement.

2.1 **What Dono does not claim.** Dono does not verify that a campaign's purpose and use of funds *are* genuine and lawful. It carries out reasonable, risk-based review, and it cannot guarantee the accuracy, legality or success of any campaign. This wording must match the public documents (Terms of Service clauses 9.1 and 26.1, and the Verification Notice) — internal policy must not claim a stronger check than Dono publicly disclaims.

## 3. Prohibited activity

The following are prohibited and result in campaign removal and, where appropriate, escalation under section 6:

- campaigns raising funds for a purpose other than the one stated;
- campaigns created using false, stolen or borrowed identities;
- structuring donations to avoid review thresholds;
- using Dono to move funds between parties with no genuine donation purpose;
- any activity that appears designed to launder funds or evade sanctions;
- fraudulent claims about need, circumstance or the Campaign Owner's situation;
- fundraising for, or for the benefit of, any person or organisation subject to UK financial sanctions;
- **anonymous or unidentified beneficiaries** — under clause 3.1 of the Terms of Service the Beneficiary is the Campaign Owner, so a campaign whose beneficiary is unclear, undisclosed or a third party is prohibited on its face;
- investment propositions, securities, loans, repayment, revenue share, tokens or any inducement to invest; and
- **pooled funds, community funds or any arrangement under which Dono itself would receive or hold the money.** No such feature may be enabled unless and until Dono holds any authorisation required for it.

## 4. Thresholds and enhanced review

4.1 **Campaign value thresholds.** These are internal risk thresholds, not published limits.

| Campaign type | Threshold above which enhanced review applies |
|---|---|
| Individual student | **£10,000** |
| Registered student society | **£50,000** |
| Verified university department or institution | No automatic limit, but **any campaign above £100,000** receives founder review |

4.2 **Enhanced-review triggers.** Enhanced review applies where any of the following is present:

- the campaign exceeds the value threshold in 4.1;
- the beneficiary is outside the UK — note that under the Terms only UK-based Campaign Owners are eligible, so this is itself a red flag rather than a routine case;
- the fundraising purpose is unusual;
- there is a request to redirect funds;
- a moderator identifies a fraud or sanctions concern; or
- there is a credible external complaint.

4.3 These thresholds are separate from, and should not be confused with, the **constitutional-approval evidence bands** in clause 2.3 of the Society Campaign Terms (£2,500 / £10,000), which are about a society's internal authority rather than financial-crime risk.

## 5. Sanctions

5.1 **Screening is risk-based, not universal.** Manual sanctions screening is carried out **only** where a campaign is flagged for enhanced review under 4.2, or where a moderator has a reasonable suspicion. Dono does **not** manually screen every ordinary student campaign.

5.2 **Where screening applies**, check the Campaign Owner, the named beneficiary of the funded activity, and any organisation named as a recipient of goods or services, against the UK Sanctions List.

5.3 **Restricted jurisdictions.** Dono does not knowingly facilitate campaigns benefiting persons or organisations in countries or territories subject to comprehensive UK financial sanctions.

5.4 **Decision-maker.** The final decision on any sanctions concern is taken by **Amrit** (or the nominated compliance lead). Any trained moderator may temporarily suspend a campaign pending review; **final removal or reinstatement is Amrit's decision.**

5.5 **Escalation.** A suspected UK sanctions breach is escalated to **OFSI** where legally appropriate, and this decision is recorded with its reasoning.

## 6. Detection and escalation

6.1 Anyone who becomes aware of activity that may fall within section 3 must escalate it to **Amrit**, who is the designated contact for financial-crime concerns, with **Sashank** as deputy.

6.2 Escalate as soon as suspicion arises. Staff do not need to be certain and should not investigate beyond what is needed to form a reasonable suspicion.

6.3 **Confidentiality.** Do not discuss a suspected financial-crime concern with the person concerned or with anyone outside the escalation chain. **The statutory "tipping off" offence applies to the regulated sector, and Dono does not currently consider itself to be in the regulated sector (see 1.3) — so this is a Dono confidentiality rule, adopted because premature disclosure would prejudice an investigation, rather than a statement that a criminal tipping-off offence necessarily applies.** If legal advice concludes that Dono is in the regulated sector, this paragraph is replaced with the statutory obligation.

6.4 **Red flags.** An extremely high fundraising target relative to the stated purpose; an anonymous or unclear beneficiary; a campaign description inconsistent with the budget; attempts to move funds to third parties; repeated suspicious behaviour across accounts; credible reports of fraud; and apparent links to a sanctioned person or organisation.

## 7. Authorised actions

7.1 Once a concern has been escalated, Amrit (or a team member acting on Amrit's instruction) is authorised to:

- pause or remove the campaign from the Platform;
- restrict or suspend the user's account;
- prevent future fundraising on Dono;
- refuse to publish a campaign;
- raise the matter with Stripe;
- refer the matter to the Recognised Institution under clause 23.7 of the Terms of Service;
- report suspected crime to the police, or a suspected sanctions breach to OFSI; and
- preserve evidence — campaign content as it appeared, messages, correspondence and transaction records — before it can be altered or deleted.

7.2 **What Dono cannot do.** **Dono cannot hold, delay or divert a payout, and cannot ask Stripe to do so on its behalf.** Under the live configuration the platform has no payout-control capability, and the payments architecture deliberately excludes one in order to keep Dono outside the payment-services perimeter. Any earlier version of this policy that authorised a payout hold was wrong, and no Dono document may claim that power. If a campaign needs to be stopped, the available levers are **preventing further donations** and the enforcement actions in 7.1 — not reaching into money that has already been paid.

7.3 Where a campaign is paused, donors should not be left without an explanation for an unreasonable length of time; provide a holding message once it is safe to do so.

## 8. Cooperation with Stripe and law enforcement

8.1 Where a concern relates to payment processing, identity verification or payment-level sanctions screening, Dono raises it with Stripe and follows Stripe's guidance, including any payout holds or account restrictions **Stripe itself** decides to impose. Dono cannot direct those.

8.2 Where a concern may involve criminal activity, Dono cooperates with law-enforcement requests, including preserving relevant records and providing information as required by law. **Dono does not conduct its own criminal investigations.**

8.3 **Escalation routes at a glance:** payment fraud → Stripe. Criminal activity → police. Suspected UK sanctions breach → OFSI, where legally appropriate. Child sexual exploitation and abuse content → the NCA, under the Online Safety Act Procedures.

## 9. Records

9.1 Amrit maintains an incident log recording, for each escalated concern: the date raised and who raised it; the campaign or account concerned; the nature of the suspected activity; the actions taken; the outcome; and any external cooperation. This log is not a regulatory filing; it exists so Dono can show a consistent, documented approach if asked. Records are retained for six years from case closure (ROPA row 17).

9.2 **A sanctions and financial-crime risk assessment**, tying these controls to Dono's actual transaction and campaign profile, is required before launch. **[OUTSTANDING]**

9.3 Everyone who reviews campaigns receives short training on this policy — the red flags, the escalation route, the confidentiality rule and the limits of Dono's powers — and the training is recorded. **[OUTSTANDING]**
