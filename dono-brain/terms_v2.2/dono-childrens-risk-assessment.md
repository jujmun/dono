# Dono — Children's Risk Assessment

**Prepared for:** Online Safety Act compliance file
**Service:** Dono (joindono.com) — student crowdfunding platform, Oxford launch
**Designated person (Online Safety Act):** Amrit Kaur Rooprai. **Backup:** Sashank. **Second backup:** Joe.
**Version:** Production operating baseline v2.3 — 6 August 2026
**Approved by:** _________________ **Date:** _________________
**Review triggers:** introduction of direct messaging; links or attachments permitted in comments; campaign creation opened to under-18s; introduction of age assurance; evidence that a significant proportion of users are children; six months of operating data.

**Implementation and traceability:** [`ENGINEERING_MODERATION_REQUIREMENTS.md`](ENGINEERING_MODERATION_REQUIREMENTS.md) and [`ONLINE_SAFETY_TRACEABILITY.md`](ONLINE_SAFETY_TRACEABILITY.md).

## Changes in v2.2 — corrections to the factual record

The previous version overstated Dono's controls in four material ways. Because a risk assessment that overstates its controls does not satisfy the statutory duty, each is corrected here rather than softened.

| Previous statement | Correct position |
|---|---|
| Publishing is gated by "an actual verification mechanism (Stripe Identity), not a checkbox", which confirms 18+ | **Stripe Identity does not reliably return a date of birth and is not used as Dono's age gate.** The gate for campaigns and acting for a society is a **declared date of birth** — a checkbox in substance. Accounts and comments have no age gate at all. Under Ofcom's children's access assessment tool a declared date of birth is **not** highly effective age assurance |
| "Stripe Identity verification for all campaign creators **and commenters**" | **Stripe Identity applies to campaign and society creation only.** Commenting requires an account, which requires a declared date of birth — nothing more |
| Beneficiaries are "verified as affiliated with the university **or school** named in the campaign" | **Dono does not perform institution verification at all**, and **does not recognise schools.** Only UK higher-education institutions participate. There are no under-18 beneficiaries because the Beneficiary is the Campaign Owner, who must be 18+ |
| "Ask Stripe to hold payouts" is a confirmed existing safety measure | **Dono cannot hold or delay a payout.** This is not a control and has been removed from every document |
| Identity documents "deleted once Stripe completes KYC" | Dono never receives Stripe identity documents. **Dono holds a student-card image**, which the retention service deletes immediately after a successful check and records in the deletion log |

The consequence is that Dono's position on children is **weaker than the previous draft claimed**, and the ratings below reflect that. Children are not excluded from authoring roles by a real verification mechanism; they are excluded by a declaration. That is a meaningful deterrent for an incidental under-18 visitor and no barrier at all to a determined one.

---

## 1. Service description

Dono lets students run public fundraising campaigns for university-related costs and lets others donate to them.

- **Campaign creators:** must hold an account, declare a date of birth of **18 or over** to publish, pass a manual student-card and university-email check by a Dono administrator, and complete Stripe Connect onboarding including Stripe Identity.
- **Content in a campaign:** text, images and video.
- **Comments:** any account holder may post public comments — **there is no age requirement to create an account or to post a comment.** Comments are **post-moderated** — they go live immediately and are removed on report. **Links and attachments are not permitted in comments.**
- **Beneficiaries:** the Beneficiary of a campaign **is** its Campaign Owner. Dono does not permit third-party beneficiaries, and does not verify affiliation with any institution beyond the student-card check it performs itself.
- **Donors:** may donate with or without an account, **at any age**. Checkout asks the donor to confirm they are 18 or over — a declaration, not a check, with no parent-or-guardian-permission alternative.
- **Viewers:** campaigns are public and browsable without logging in.
- **Absent by design:** no direct messaging, no livestreaming, no private groups, no disappearing content, no recommendation or engagement-ranked feed. The product surface is a public campaign list plus campaign pages.
- **Moderation:** every campaign is reviewed by a person before publication. Comments are post-moderated.
- **Reporting and complaints:** a report control on every item of user content and a public form for people without an account; reports create tracked moderation cases, acknowledgement is sent within 5 Working Days where contact details are available, outcomes are targeted within 30 days, and urgent matters are handled immediately. Suspected CSEA content enters the specialist NCA workflow.

## 2. Children's access assessment

**Are children likely to visit?** **Yes.** The service is public and unauthenticated, and campaign links are shareable — a child can reach it via search, a shared link or social media, with no barrier at the door.

**Can they browse without logging in?** Yes, fully.

**Can they donate?** **Yes.** No account is required and there is no age gate. The only control is a self-declaration at checkout.

**Can they comment?** **Yes.** Commenting needs an account, but account creation asks for no date of birth and has no age gate of any kind — not even a self-declaration to state falsely. **[COMPLIANCE — 6 Aug 2026: the account-creation/comment age gate this section previously assumed will not be built (see TRUTH.md, Age section). The paragraph above and the Conclusion below need re-scoring against "no barrier at all" rather than "gameable self-declaration" — Amrit/counsel to re-assess.]** They can in any event **read** every comment as an unauthenticated visitor.

**Can they publish campaigns?** Not without an account, and additionally not without passing a manual student-card check and Stripe Identity. **The student-card check is the meaningful barrier here** — a child would need a plausible university student card and a working university email address, which is a real obstacle in a way that a declared date of birth is not.

**Conclusion.** **Children are likely to access the service.** Dono cannot conclude otherwise on the strength of a self-declared date of birth. Children are effectively excluded from **publishing campaigns** by the student-card and university-email requirement, but only nominally excluded from **commenting**, and not excluded at all from **viewing** or **donating**. Those last three are where the risk sits. **[COMPLIANCE — this conclusion still describes commenting as "only nominally excluded," which assumed a gameable declared-DOB gate at account creation. That gate does not exist and will not be built; commenting has no age-related barrier at all. Needs re-scoring, not just a wording fix.]**

## 3. User journeys

**Child visitor.** Arrives via search, link or social share, with no login. Browses or searches public campaigns. Views campaign text, images, video and updates. Reads public comments. **Can donate as a guest** — no account, no verified age check, no parental visibility, one self-declaration.

**Child using their real age.** Creates an account — no age is asked or checked. Can post public comments. Cannot publish a campaign, because that step declares a date of birth and the student-card and university-email check would fail regardless.

**Adult campaign creator.** Creates an account, declares a date of birth of 18 or over, submits a student card and university email for manual review, completes Stripe Connect and Stripe Identity, builds a campaign, submits it for human review, and on approval goes live.

**Adult commenter.** Holds an account. Posts a comment. The comment is live immediately — visible to everyone including children — before any human reviews it. It can be reported and removed afterwards.

## 4. Harm assessment

Assessed on: can a child encounter it, how, how likely, what controls exist, and residual risk.

### Illegal content — fraud, scams, terrorist fundraising, CSAM, hate

A child could encounter this as a **viewer** of a published campaign or comment, and could in principle author a comment directly — there is no age check on commenting to get past.

- *Campaigns:* every campaign is reviewed by a person before publication. This is a genuine pre-publication gate and the single strongest control in this assessment.
- *Comments:* post-moderated, so illegal content could be visible for a window before removal. The author pool is anyone who holds an account, with no age barrier of any kind — weaker than a previous draft's "declared date of birth" assumption, since even that self-declaration will not be built for account creation or commenting (6 Aug 2026, see TRUTH.md, Age section). Links and attachments are not permitted, which removes the most common vector.
- **Residual risk: Low** (campaigns) / **Medium** (comments — this Medium rating was itself set on the assumption of a declared-DOB barrier that no longer applies; it should be re-scored, not carried forward unchanged). **[COMPLIANCE — Amrit/counsel to re-assess.]**

### Bullying and abuse via comments

A child could read abusive content directed at a campaign creator, or an abusive exchange between users. A child who falsified their age could also be a participant.

- Controls: reporting on every comment, post-moderation, removal, account restriction, no direct messaging so no private channel to a child.
- **Residual risk: Medium.** Post-moderation means exposure happens before removal, not instead of it. This remains the most exposed surface for a child viewer.

### Self-harm or suicide content

- *Campaigns:* pre-moderated — a strong gate.
- *Comments:* post-moderated, so a comment could be visible before review.
- **Residual risk: Low** (campaigns) / **Medium** (comments).

### Eating disorder content

Same structure and reasoning. **Residual risk: Low (campaigns) / Medium (comments).**

### Pornographic content

Prohibited by the Community Guidelines; campaigns are pre-moderated, with text, images and video all going through human review. **Video is materially harder to review end to end than a still image or a paragraph of text** — a reviewer skimming a video is more likely to miss embedded content. **Residual risk: Low**, contingent on the review team watching video content in full rather than sampling it (section 7).

### Violence and graphic content

Same reasoning and the same video caveat. **Residual risk: Low**, contingent on full video review.

### Fraud and financial exploitation of children as donors

This is the category where nothing upstream helps, because the harm does not require the child to author anything — only to see a campaign and pay.

- A campaign creator is identity-verified by Stripe, but identity verification confirms *who they are*, not that their campaign's framing is appropriate for a young reader. A verified adult can write a campaign or update that emotionally pressures someone into donating.
- **Donating has no age gate and no account requirement.** A child can donate as a guest.
- The **checkout confirmation** — "you are 18 or over" — is the only control that sits at the point of payment. There is no parent-or-guardian-permission alternative; that branch was decided against building, not deferred (6 Aug 2026, see TRUTH.md, Age section). It is a declaration, not a check, and Dono does not pretend otherwise. It is nonetheless a meaningfully stronger signal than silence: it makes the position explicit at the moment of decision, and it costs nothing to implement.
- A donation made by a child without a parent or guardian's permission is handled as an **unauthorised payment** — an objective refund ground under the Refund and Dispute Policy that does not require the family to prove materiality or causation. That is a genuine remedy, not a paper one, even without a dedicated parental-permission ground.
- **Residual risk: Medium.** Reduced from Medium–High because there is now a control at the point of payment and a real remedy afterwards — but not to Low, because neither prevents the donation happening.

## 5. Risk factors — why Dono is lower risk than a typical social platform

- **No direct messaging**, so no private one-to-one channel between an adult and a child. This is the single most important structural protection, and it is absent from most services where children come to harm.
- **No recommendation or engagement-ranked feed** surfacing content to children.
- **No livestreaming, no private groups, no disappearing content** — the formats associated with the hardest-to-moderate children's harms are simply not in the product.
- **No anonymous publishing.** Every campaign and comment is attributable to an account.
- **Every campaign is reviewed by a person before it goes live** — a pre-publication gate, which is stronger than most platforms' post-publication moderation.
- **Campaign creation is genuinely gated** by a manual student-card and university-email check, which a child cannot realistically pass.
- **No links or attachments in comments.**

**What these do not address** is the donation-side risk in section 4, which sits outside the publishing and commenting gates entirely, and the fact that comment authorship is gated only by a declaration.

## 6. Operational safety measures

- Manual student-card and university-email check by a Dono administrator for every campaign creator.
- Stripe Connect onboarding and Stripe Identity for every campaign creator (identity, **not** a reliable age signal).
- Declared date of birth enforced at account creation, campaign creation and society creation.
- Mandatory human review of every campaign before publication.
- No direct messaging; no links or attachments in comments; no livestreaming, private groups, disappearing content or recommendation feed.
- Audit logging of every administrator access to student-card and identity data.
- Designated person (Amrit) for Online Safety Act complaints and for CSEA reports, with a named backup (Sashank) and second backup (Joe).
- Checkout requires an 18-or-parental-permission confirmation and stores the confirmation with the donation record.
- Every user-content surface has a report control, and `/report` accepts logged-out and anonymous reports.
- Every report creates a case with urgency triage, alerts, evidence preservation, moderator assignments, decisions, notices and appeal linkage.
- Role-authorised moderators can restrict and restore content, campaigns, donations and accounts.
- NCA CSEA portal registration, named reporters and quarterly access tests are maintained.
- Retention jobs delete student-card images and case evidence on the configured schedule, subject to audited legal holds.
- Comments are plain text; client and server validation reject links and attachments. Rate limits and risk signals reduce coordinated abuse.
- Tamper-evident audit logs record privileged access and moderation actions.
- The refund workflow includes the objective ground for a child's unauthorised donation.

Automated content classification is not used to make moderation decisions. Human moderators review every case. Risk signals may prioritise a case but never remove content or sanction an account without a recorded human decision, except for narrowly defined emergency access restrictions that receive prompt human review.

## 7. Residual risk summary

| Harm | Residual risk | Basis |
|---|---|---|
| Illegal content in campaigns | Low | Pre-publication human review |
| Illegal content in comments | **Medium** | Post-moderation window; author pool gated only by a declared date of birth |
| Bullying and abuse in comments | **Medium** | Post-moderation window is the main exposed surface for a child viewer |
| Self-harm or suicide — campaigns | Low | Pre-publication human review |
| Self-harm or suicide — comments | **Medium** | Post-moderation window |
| Eating disorders — campaigns | Low | Pre-publication human review |
| Eating disorders — comments | **Medium** | Post-moderation window |
| Pornographic content | Low | Pre-publication review, contingent on full video review |
| Violent or graphic content | Low | Pre-publication review, contingent on full video review |
| Financial exploitation of child donors | **Medium** | No age gate on donating; checkout confirmation and an objective refund ground are real but limited controls |

**Overall: children are likely to access the service, and Dono operates child-safe by default rather than deploying age assurance to exclude them.** That decision is recorded in the Online Safety Act Procedures section 3.3, with its reasoning. No harm is rated High. Several harms remain Medium despite the section 6 controls because comments are visible before post-moderation and the donation-side risk cannot be removed by a declaration alone.

## 8. Monitoring and review

Dono monitors the effectiveness of the controls in section 6 through:

1. full-length human review of every uploaded video before publication;
2. fast-track triage for reports involving children or content visible to children;
3. comment risk signals that prioritise human review without making automated removal decisions;
4. repeat-offender and linked-account detection for comment authors and campaign owners;
5. automated tests confirming that comment links and attachments are rejected by both client and server;
6. monthly measurement of under-18 donation declarations, parental refund requests, account date-of-birth anomalies, reports involving children and time from publication to restriction; and
7. a formal review after the first six months of operating data and at least annually thereafter, with earlier review after a serious incident or material service change.

The Online Safety lead records any control failure as a corrective action. A failure affecting reporting, emergency restriction, CSEA escalation, access control or evidence preservation is launch-critical and triggers immediate remediation or feature disablement.
