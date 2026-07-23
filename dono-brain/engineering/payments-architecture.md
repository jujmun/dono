# Dono — Payments, Disputes & Risk Architecture
### Unified brief for engineering (July 2026)

This document consolidates our internal analyses of chargebacks, refunds, regulatory position, and platform liability into a single reference for the build. It explains **why** the architecture was chosen, **what** must be implemented, and which questions are deliberately deferred.

---

## 1. The governing principle

> **Donor money must never pass through Dono.**

Everything else in this document follows from this. The flow is:

```
Donor card
    ↓
Student's own Stripe Connect Standard account (direct charge)
    ↓
Student's bank account

Dono: hosts campaigns, takes an application fee, stores evidence,
      mediates disputes. Never holds, pools, delays, or reallocates funds.
```

**Why this matters:**

- **Regulatory (FCA):** If Dono held or controlled donor funds, it would risk falling within payment-services regulation (safeguarding obligations, authorisation requirements). As a pure platform and dispute mediator, Dono stays substantially outside that perimeter. The strategic framing: Dono is a **trusted crowdfunding platform and dispute mediator**, never a **payment intermediary or quasi-bank**.
- **Chargeback economics:** With Connect Standard direct charges, the student is the merchant of record. Stripe contracts directly with each student, and the student's Stripe account is debited when a dispute is lost. Dono's direct financial exposure is limited to fees, operational time, and reputation.
- **Founder/platform liability:** Payment architecture is the single largest protection factor — more important than legal drafting. Terms and conditions mitigate perhaps 60–80% of ordinary contractual disputes, but only the architecture removes the catastrophic scenario of the platform being economically responsible for all donations moving through it.

**Hard constraints for engineering:**

- Stripe Connect **Standard** accounts only (not Express, not Custom).
- **Direct charges** on the student's account, with Dono taking an `application_fee_amount`. No destination charges, no separate transfers, no platform balance ever holding donor funds.
- No escrow, no pooled funds, no community funds, no virtual cards, no reallocating money between parties.
- **No payout delays of any kind.** This is a firm decision for regulatory reasons — delaying payouts is an activity that pushes a platform toward the FCA perimeter. Fraud control happens before and around the money (verification, review, suspension), never by interfering with fund movement. (Under Standard direct charges, Dono has no clean lever to delay settlement anyway.)
- Dono does **not** trigger refunds via API in v1 (see §4).
- **Reserve/hardship funds are out of scope entirely** for now. Pooling money would flip the entire risk model and invite regulation.

---

## 2. Stripe liability position: how insulated is Dono?

The Standard-account, direct-charge architecture **significantly reduces** Dono's chargeback and payment liability: Stripe's contractual relationship for the charge is with the student, and disputes debit the student's account. This is the correct baseline understanding for the build.

However, insulation is not automatic or absolute. Three caveats determine whether the insulation holds in practice, and each has implementation implications:

### 2.1 The Stripe agreements govern
Stripe's contracts and platform settings — not Dono's own terms — ultimately determine who Stripe can pursue. Before launch we must review:

- the **Connected Account Agreement**;
- the **Platform Agreement**;
- **negative balance provisions**.

These documents matter more than anything we draft ourselves. *(Action item: legal/founder review, not engineering — but engineering should not enable any Stripe platform setting that shifts liability toward Dono, e.g. opting into losses coverage for connected accounts.)*

### 2.2 Platform conduct matters
Even with the right account type, Dono can create additional risk through its own behaviour. Engineering and product must therefore ensure Dono never:

- controls payouts;
- overrides or forces refunds;
- manually moves money;
- makes representations that Dono **guarantees** campaigns or outcomes.

The last point is a copy/UX requirement as much as a legal one: campaign pages, marketing, and trust signals (verification badges etc.) must be worded so that Dono verifies *identity and evidence*, not *outcomes*. Never use guarantee language anywhere in the product.

### 2.3 Extreme cases remain
Even with Stripe looking primarily to students, Dono can still face reputational pressure, contractual disputes, and negligence or misrepresentation claims from donors or students. This is separate from Stripe recovery risk and is managed through terms (§7), fraud controls (§6), and evidence (§5) — not payment architecture.

**Net position:** the architecture removes the payment-liability core of the risk; the caveats above are behavioural and contractual guardrails that keep it removed.

---

## 3. Two distinct processes: refunds vs chargebacks

These must be modelled separately in the product.

| | Refund request | Chargeback |
|---|---|---|
| Initiated | Donor, via Dono | Donor, via their bank (bypasses Dono) |
| Decided by | Dono (platform decision) | Donor's bank / card issuer, under Visa/Mastercard rules |
| Dono's role | Investigator & adjudicator | Evidence supplier |
| Can Dono prevent it? | N/A | No |
| Who bears the loss if donor wins | Student (executes refund voluntarily, per T&Cs) | Student (Stripe debits their account) |

Note: Stripe generally does not make the substantive chargeback decision — the issuer does. Dono's leverage is entirely in the quality of the evidence package.

---

## 4. The dispute lifecycle (what to build)

### Step 1 — Campaign completion & evidence upload
Students upload post-campaign evidence: receipts, photographs, proof of attendance, campaign updates, proof of expenditure. This serves donor trust **and** future chargeback defence — treat it as first-class data, not an optional feature.

### Step 2 — Donor refund request
A donor-facing flow for submitting a refund request with structured reasons.

### Step 3 — Dono review
Internal admin tooling to assess the request against policy:

- **Potentially valid:** fraudulent campaign, fake student, material misrepresentation, campaign cancelled before expenditure, substantial misuse of funds.
- **Potentially invalid:** donor regret, disappointment, poor outcomes, minor deviations from the stated plan.

### Step 4 — Decision
- **Approved:** the student is notified and is contractually obliged to cooperate; **the student executes the refund from their own Stripe dashboard**.
- **Rejected:** the donor is informed; the full investigation record is retained.

### Step 5 — If the student does not cooperate with an approved refund
This is the defined escalation path (specifics of debt recovery are deferred and are **not crucial for the build**):

1. **Platform sanctions:** suspend the student's campaigns/account; flag/ban from future fundraising.
2. **Escalate to the university**, using our university relationship/contact channel. Engineering implication: admin tooling should support an "escalated to university" case state and record the correspondence.
3. **Encourage the donor to pursue a chargeback** through their bank. In this scenario Dono's evidence package supports the *donor's* dispute rather than the student's defence — the case tooling must be able to assemble evidence for either direction.

### Step 6 — If the donor charges back anyway (after a rejected refund)
Dono assembles and submits the defence evidence package on the student's behalf (assisting, not deciding). The issuer decides the outcome. Possible outcomes: chargeback rejected → student keeps funds; chargeback accepted → funds reversed and the student bears the loss.

---

## 5. Refund execution: why the student presses the button

**v1 decision: refunds are executed manually by the student, never by Dono via API.**

Rationale: if Dono itself triggered refunds against student accounts, a fact-specific FCA question would arise — is Dono merely the student's authorised agent, or is it *controlling payment transactions*? The latter edges toward regulated activity, and per §2.2, overriding refunds is exactly the kind of conduct that erodes our insulation. Manual student execution keeps Dono clearly on the platform side of the line.

API-authorised refunds are a possible future enhancement **only after specialist legal advice**. Do not build them into v1, and do not design the data model on the assumption that Dono can move money.

---

## 6. Evidence package (data retention requirements)

For every campaign, retain immutably and retrievably:

- The original campaign wording **as the donor saw it at the time of donation** — version/snapshot campaigns so edits never overwrite what a donor relied on;
- The donor's acceptance of terms (timestamped, with terms version);
- Receipts and photographs;
- Campaign updates;
- Donor–student and platform communications;
- Refund investigation records and decisions, including escalation history.

This evidence materially improves the odds in any dispute — whether defending a student against an unjustified chargeback or supporting a donor against a non-cooperating student. Build audit trails from day one.

---

## 7. Fraud controls (the biggest remaining operational risk)

With payment liability handled by architecture, **fraudulent campaigns are the top residual risk**: fake students, fabricated campaigns (e.g. fake medical electives), misuse of funds, impersonation of societies, false claims of university endorsement. Terms only cover an estimated 30–40% of this problem; the rest is operational. Build:

1. **Identity verification** of campaign organisers. Stripe Standard onboarding provides KYC for payments, but Dono should independently know who organisers are at platform level.
2. **University verification** — university email verification at minimum; this also underpins the university escalation path (§4, Step 5).
3. **Evidence requirements scaled to campaign size** — stricter tiers for larger campaigns, and manual review of unusually large donations.
4. **Donor fraud reporting** — a simple, visible mechanism for donors to report suspected fraud.
5. **Suspension powers** — admin ability to immediately freeze/unpublish a campaign and suspend an account. (Suspension of the *campaign page and account* — never of money movement.)
6. **Comprehensive audit trails** on all admin actions, campaign edits, and case decisions.

---

## 8. Terms & conditions (product surface requirements)

Engineering must surface, version, and record acceptance of the following (legal will draft the exact wording):

**Donors acknowledge:**
- donations are generally non-refundable and final;
- campaigns describe *intended* rather than guaranteed use of funds;
- Dono does not guarantee campaigns or outcomes;
- chargebacks should only be used for fraud, unauthorised payments, or material misconduct.

**Students agree:**
- to provide evidence of expenditure;
- to cooperate with legitimate, approved refund requests — including executing them;
- to participate in dispute investigations;
- accuracy warranties on campaign content and proper use of funds;
- indemnities;
- Dono's rights to suspend/remove campaigns, suspend/ban users, and escalate non-cooperation to the university.

Store every acceptance event with a timestamp and the terms version accepted.

---

## 9. Data protection

Dono will hold sensitive data (identity documents, donor data, financial information), making data protection a top-tier residual risk. Requirements: data minimisation (collect the least needed), encryption at rest and in transit, role-based access controls, deletion schedules, processor agreements with vendors, and a breach-response procedure. Privacy policies do not substitute for actual technical compliance — this is an engineering deliverable.

---

## 10. Known limitations & deferred items

1. **Student hardship on legitimate chargebacks.** A student can honestly spend the money and later lose a chargeback, owing funds they no longer have. There is no perfect solution. Mitigations: donor education, a strong refund policy, evidence quality, and manual review of large donations. Hardship/reserve mechanisms are explicitly out of scope.
2. **Debt recovery specifics.** Where a student refuses to honour an approved refund, the escalation path (§4, Step 5) is defined, but the detailed mechanics of reclaiming money are deferred — not crucial for the build.
3. **Stripe agreement review.** The Connected Account Agreement, Platform Agreement, and negative balance provisions must be reviewed before launch (founder/legal task).
4. **Incorporation.** Deferred for now; to be revisited before scaling beyond the pilot. Not an engineering dependency.
5. **API-authorised refunds.** Deferred pending specialist legal advice.

---

## 11. Implementation summary

| Area | v1 build | Explicitly excluded / deferred |
|---|---|---|
| Payments | Connect Standard, direct charges + application fee | Express/Custom accounts, escrow, pooled funds, virtual cards, **any payout delays**, reserve funds |
| Refunds | Donor request flow, admin review tooling, student-executed refunds, escalation states (university, donor-chargeback route) | API-authorised refunds, debt-recovery mechanics |
| Chargebacks | Evidence package assembly & submission tooling (defence **and** donor-support directions) | — |
| Fraud | ID + university verification, evidence tiers, donor reporting, campaign/account suspension, audit trails | Payout-based controls of any kind |
| Terms & copy | Versioned terms with recorded acceptance; no "guarantee" language anywhere in product or marketing | — |
| Data | Campaign snapshots, immutable audit logs, DP controls (encryption, access control, retention/deletion) | — |

**The one-line rule for every future feature decision:** if a proposed feature would give Dono possession of, or control over, donor money — or would have Dono guaranteeing campaigns — it is an architecture-breaking change requiring legal review before any build work begins.
