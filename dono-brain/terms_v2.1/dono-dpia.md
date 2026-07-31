# Data Protection Impact Assessment (DPIA) — Dono

Status: draft for founder review before stack freeze
Owner: Amrit (data protection lead)
Last updated: 30 July 2026

## 1. Screening — why this DPIA is required

Dono processes identity documents to verify campaign creators, a large proportion of whom are university students (a young user base), and shares data with third parties (Stripe) and institutions (universities). Under UK GDPR Article 35 and ICO guidance, this combination — large-scale processing of identity data, a demographic including under-25s, and use of new/automated verification — triggers the requirement for a DPIA before processing begins.

This DPIA is scoped to four processing streams: (1) identity verification, (2) receipts and third-party data, (3) campaign moderation, (4) institutional sharing. General platform processing (browsing, donating, comments, profiles) is covered in the ROPA but does not independently require DPIA treatment.

## 2. Description of processing

### 2.1 Identity verification
- **What happens**: campaign creators (18+) upload a university ID and/or government ID; Stripe performs KYC verification; Dono receives a verified/not-verified outcome plus a verification record (date, method, outcome, Stripe reference).
- **Documents themselves**: held by Dono only transiently, deleted within 30 days of verification completing. Stripe retains documents per its own KYC obligations, outside Dono's control as controller for that copy.
- **Why needed**: to confirm campaign creators are real, of age, and affiliated with the university claimed — core to donor trust.

### 2.2 Receipts and third-party data
- **What happens**: campaign creators may upload receipts or evidence of spend (e.g. invoices, quotes) which can contain third-party personal data (a supplier's name, a tutor's name, another student mentioned in a quote).
- **Why needed**: supports transparency and donor confidence that funds are used as described.
- **Risk driver**: this is the one category where Dono knowingly receives personal data about people who are not Dono users and have not consented to Dono holding it.

### 2.3 Moderation
- **What happens**: every campaign undergoes manual human review before publication, covering the campaign text, images, and any receipts/attachments.
- **Why needed**: fraud and safeguarding control, particularly given the young user base.
- **Risk driver**: reviewers see identity-adjacent and third-party data as part of review.

### 2.4 Institutional sharing
- **What happens**: Dono has approached universities and other institutions about the platform; some data may be shared with institutions (e.g. confirming a student's affiliation, or aggregate/campaign-level reporting).
- **Why needed**: institutional buy-in and, in some cases, verification of student status.
- **Risk driver**: sharing personal data (even affiliation data) with a third-party institution needs a clear lawful basis and, ideally, a data-sharing agreement — currently undocumented.

## 3. Necessity and proportionality

- ID verification is necessary and proportionate: it is limited to campaign creators (not donors or browsers), outsourced to Stripe (a specialist processor), and the underlying document is deleted quickly rather than retained.
- Manual moderation is necessary given no automated content-safety tooling is described; proportionate provided reviewer access is logged and limited to those with a moderation role.
- Receipt collection is necessary for platform integrity but is the least proportionate element as currently designed, because third parties whose data appears on a receipt have no visibility or control. Mitigation options below.
- Institutional sharing needs a defined scope before DPIA sign-off — "some interested, some opposed" institutional reception suggests no standard data-sharing terms exist yet.

## 4. Risks identified

| Risk | Likelihood | Severity | Notes |
|---|---|---|---|
| ID document retained beyond 30-day window by error | Medium | High | Manual/human deletion step is a common failure point — needs a system-enforced deletion job, not a policy reliance. |
| Third-party personal data on receipts processed with no lawful basis for that third party | Medium | Medium | Third party is not a Dono user; legitimate interests likely applies but needs the LIA (see LIA document) to hold up. |
| Reviewer over-access to ID/verification data during moderation | Low–Medium | Medium | Depends on whether moderation tooling separates "content to review" from "identity data" — confirm at build stage. |
| Institutional data-sharing without agreement or defined lawful basis | Medium | Medium–High | No data-sharing agreement currently exists with any institution. |
| Young user base misunderstanding what happens to their ID document | Low | Medium | Addressed by clear, plain-language verification copy at upload (UX task, not purely legal). |

## 5. Mitigations

1. Automate ID document deletion at 30 days (or on verification completion, whichever is later) rather than relying on manual process; log deletion events for audit.
2. Restrict receipt uploads to what is strictly needed for review; add a line to campaign creator terms noting they must not upload receipts containing sensitive third-party data (e.g. another person's ID or financial details) beyond what's necessary.
3. Scope moderator access so verification data (the Stripe outcome/reference) is separate from content moderation, if the Convex data model allows it.
4. Before any institution receives personal data, put a short data-sharing agreement in place (even a one-page mutual confidentiality + purpose-limitation letter) — flag this as a launch blocker if any institutional sharing is live at launch.
5. Add verification-specific privacy copy at the ID upload step (what's collected, that it's deleted in 30 days, what's retained afterward).

## 6. Residual risk and sign-off

Once mitigations 1–4 are in place, residual risk is assessed as low, proportionate to Dono's purpose and scale at launch. This DPIA should be revisited before any of the following: automated identity/fraud scoring, expansion of receipt/third-party data collection, or any institutional data-sharing arrangement going live.

Signed off by: _________________ (data protection lead)
Date: _________________
