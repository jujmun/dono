> ## v2.3 AMENDMENT BLOCK — READ FIRST
>
> **Version 2.3 — 6 August 2026.** This document is carried forward from v2.2 with the amendments below.
> **Where anything in the body of this document conflicts with this block, this block prevails.** The v2.2 text is retained beneath so that the reasoning and evidence are not lost.
>
> **Amendments applying to this document (Children's Risk Assessment):**
>
> 1. **Re-perform on current controls.** As with the illegal-content assessment, every rating that depends on unbuilt report controls, moderation tooling or filtering is suspended and must be re-scored against the service as it actually exists.
> 2. **Correct the financial-exploitation rating.** The previous assessment described a refund as a 'genuine remedy'. Under v2.3 the remedy is stronger — Dono may now execute a refund under the mandate in Terms of Service clause 13.2 — but it is **still limited by the funds in the Connected Account**. The rating must reflect the remedy that actually exists, with its limits.
> 3. **Reflect the 18+ donation policy.** Donating now requires the donor to be 18 or over and to self-certify legal capacity. This materially reduces the financial-exploitation pathway, but **self-certification is not highly effective age assurance** and no rating may treat it as though it were.
> 4. **Children still access the service by browsing.** Campaign pages and comments remain visible to people of any age. The children's-access conclusion is unchanged.
> 5. **The assessment must additionally contain, and does not yet:** the age bands considered (**under 13; 13–15; 16–17; adults**); the child user journeys through Dono (arriving via a shared link; browsing a campaign; reading comments; attempting to donate and being blocked at the 18+ gate; attempting to create an account and being blocked); the ways children interact with the service; each potential harm; **likelihood and severity scored separately, with the reasoning for each score stated**; **exactly which implemented control reduces each risk**; and **evidence that each control works, referencing the test that demonstrated it**. This is more detailed than the illegal-content assessment because Ofcom expects analysis of the specific ways children may use the service.
> 6. **Cross-reference the ICO Age Appropriate Design Code assessment**, which is a separate statutory data-protection assessment and is not satisfied by this document.
>
> **Revision 2.3.1 — verified facts of 5 August 2026 that must be reflected in the re-scoring:**
>
> 7. **Commenting is restricted to approved members of the society that owns the campaign.** The population able to post is small, identified and controlled by the society, not open to any account holder. **This materially reduces the child-facing risk from comments** and must be reflected in the ratings — the previous assessment assumed an open commenting surface.
> 8. **Every campaign, including images, documents, video and links, is reviewed by a person before publication** and again after any change. A genuine, evidenced control.
> 9. **But there is no report control on any content, no logged-out reporting route and no appeals workflow.** A child, or an adult acting for one, **currently has no way to report anything.** No rating may credit a reporting route.
> 10. **There is no account suspension or restriction capability at all**, so the graduated responses this assessment assumes are unavailable.
> 11. **The 18+ donation confirmation is a hardcoded constant**, so it is not a control and must not be scored as one. **Account creation and commenting have no age gate whatsoever.** Campaign, society and college creation do enforce an adult date of birth, fail-closed.
> 12. **Superseded by item 15.** The identity check returns a government-document date of birth for creators and it is now the settled fail-closed final creator age gate.
> 13. **URLs are not blocked in comments**, and there is **no malware or image-safety scanning** on any upload path.
> 14. **There is no monitoring or alerting**, so nothing escalates an urgent child-safety report on its own.
>
> **Revision 2.3.2 — settled decisions of 6 August 2026:**
>
> 15. **Creator age gate.** The Payment Provider's government-document date of birth is the final age gate for Campaign and Society creators. Missing, inconsistent and under-18 results fail closed; an apparent error uses the documented correction route. This supersedes item 12 and every statement below that the result is unused or unreliable.
> 16. **Donor age.** Donors must be 18 or over and actively self-certify legal capacity. Parent-or-guardian permission is not an alternative. Browsing remains open to all ages, so children remain likely to access the service.
> 17. **No student-card processing.** Student status is checked through control of a recognised university email. Every reference below to collecting, inspecting, retaining or deleting student-card data is superseded.
> 18. **Society-only beta.** The beta authoring journey is a Society Campaign operated by a verified Responsible Representative. The final risk assessment must be re-scored against that journey and the implemented controls before sign-off. The carried-forward body is reasoning history, not an implementation specification.

---
# Dono — Children's Risk Assessment

**Prepared for:** Online Safety Act compliance file
**Service:** Dono (joindono.com) — student crowdfunding platform, Oxford launch
**Designated person (Online Safety Act):** Amrit Kaur Rooprai. **Backup:** Sashank. **Second backup:** Joe.
**Version:** Production operating baseline v2.3 — 6 August 2026
**Approved by:** _________________ **Date:** _________________
**Review triggers:** introduction of direct messaging; links or attachments permitted in comments; campaign creation opened to under-18s; introduction of age assurance; evidence that a significant proportion of users are children; six months of operating data.

**Implementation and traceability:** [`ENGINEERING_MODERATION_REQUIREMENTS_v2.3.md`](ENGINEERING_MODERATION_REQUIREMENTS_v2.3.md) and [`ONLINE_SAFETY_TRACEABILITY_v2.3.md`](ONLINE_SAFETY_TRACEABILITY_v2.3.md).

## Changes in v2.2 — corrections to the factual record

The previous version overstated Dono's controls in four material ways. Because a risk assessment that overstates its controls does not satisfy the statutory duty, each is corrected here rather than softened.

| Previous statement | Correct position |
|---|---|
| Publishing is gated by "an actual verification mechanism (Stripe Identity), not a checkbox", which confirms 18+ | **For Campaign and Society creators, the Payment Provider returns a government-document date of birth and Dono uses it as the fail-closed final age gate.** Account creation and commenting require the separate declared-age gate; Donor age is self-certified at checkout. None of those controls prevents children browsing public pages |
| "Stripe Identity verification for all campaign creators **and commenters**" | **Stripe Identity applies to campaign and society creation only.** Commenting requires an account, which requires a declared date of birth — nothing more |
| Beneficiaries are "verified as affiliated with the university **or school** named in the campaign" | **Dono does not perform institution verification and does not recognise schools.** Creators are adult students at recognised higher-education institutions. Third parties, including children, may incidentally benefit from or participate in a qualifying official Society initiative, but they are not verified Dono users merely because they benefit. The risk assessment must consider that possibility |
| "Ask Stripe to hold payouts" is a confirmed existing safety measure | **Dono cannot hold or delay a payout.** This is not a control and has been removed from every document |
| Identity documents "deleted once Stripe completes KYC" | Dono never receives Stripe identity documents or face scans and **does not collect student-card images or numbers**. It stores only the permitted verification outcome, verified name and verified date of birth, subject to the Privacy Notice retention rule |

The consequence is that Dono's position on children is **weaker than the previous draft claimed**, and the ratings below reflect that. Children are not excluded from authoring roles by a real verification mechanism; they are excluded by a declaration. That is a meaningful deterrent for an incidental under-18 visitor and no barrier at all to a determined one.

---

## 1. Service description

Dono lets students run public fundraising campaigns for university-related costs and lets others donate to them.

- **Campaign creators:** in beta, a Society's Responsible Representative must hold an account, verify a recognised university email address, pass the Payment Provider's verified-DOB age gate, and complete Connected Account onboarding before publication or receipt of Donations.
- **Content in a campaign:** text, images and video.
- **Comments:** account holders (18+ by declared date of birth) may post public comments. Comments are **post-moderated** — they go live immediately and are removed on report. **Links and attachments are not permitted in comments.**
- **Beneficiaries:** a Society Campaign's primary purpose must advance the Society's activities, members or legitimate objectives. Incidental third-party benefit is permitted; the official-initiative exception in Terms of Service clause 8.4 applies. Pass-through fundraising is prohibited.
- **Donors:** may donate with or without an account only if **18 or over**. Checkout requires active legal-capacity self-certification — a declaration, not verified age assurance.
- **Viewers:** campaigns are public and browsable without logging in.
- **Absent by design:** no direct messaging, no livestreaming, no private groups, no disappearing content, no recommendation or engagement-ranked feed. The product surface is a public campaign list plus campaign pages.
- **Moderation:** every campaign is reviewed by a person before publication. Comments are post-moderated.
- **Reporting and complaints:** a report control on every item of user content and a public form for people without an account; reports create tracked moderation cases, acknowledgement is sent within 5 Working Days where contact details are available, outcomes are targeted within 30 days, and urgent matters are handled immediately. Suspected CSEA content enters the specialist NCA workflow.

## 2. Children's access assessment

**Are children likely to visit?** **Yes.** The service is public and unauthenticated, and campaign links are shareable — a child can reach it via search, a shared link or social media, with no barrier at the door.

**Can they browse without logging in?** Yes, fully.

**Can they donate?** Contractually, **no**. Donation requires an active 18+ and legal-capacity confirmation at checkout. That declaration is not highly effective age assurance, so a child who lies may still pass it; the risk assessment must not treat it as verified exclusion.

**Can they comment?** Not without an account, and accounts require a declared date of birth of 18 or over. **A child who states a false date of birth can create an account and comment.** They can in any event **read** every comment as an unauthenticated visitor.

**Can they publish campaigns?** Not without a creator account, a recognised university email, the Payment Provider's identity/onboarding checks and a verified date of birth confirming 18+. The verified-DOB result is the final age gate and fails closed.

**Conclusion.** **Children are likely to access the service** because public browsing is open. Creators are excluded by the Payment Provider's verified-DOB gate. Donor and commenter controls remain declaration-based, so the residual child-access analysis must focus on viewing, comments and attempts to bypass self-certification.

## 3. User journeys

**Child visitor.** Arrives via search, link or social share, with no login. Browses or searches public campaigns. Views campaign text, images, video and updates. Reads public comments. **Can donate as a guest** — no account, no verified age check, no parental visibility, one self-declaration.

**Child who states a false age.** May bypass a declaration-based account, comment or donation gate. Cannot publish a Campaign because the verified-DOB creator gate fails closed.

**Adult campaign creator.** Creates an account, verifies a recognised university email, completes the Payment Provider's identity and Connected Account onboarding, passes the verified-DOB age gate, builds a Society Campaign, submits it for human review and, on approval, goes live.

**Adult commenter.** Holds an account. Posts a comment. The comment is live immediately — visible to everyone including children — before any human reviews it. It can be reported and removed afterwards.

## 4. Harm assessment

Assessed on: can a child encounter it, how, how likely, what controls exist, and residual risk.

### Illegal content — fraud, scams, terrorist fundraising, CSAM, hate

A child could encounter this as a **viewer** of a published campaign or comment, and could in principle author a comment if they falsified their age.

- *Campaigns:* every campaign is reviewed by a person before publication. This is a genuine pre-publication gate and the single strongest control in this assessment.
- *Comments:* post-moderated, so illegal content could be visible for a window before removal. The author pool is people who hold accounts, which is a weaker constraint than the previous draft assumed, since the only barrier is a declared date of birth. Links and attachments are not permitted, which removes the most common vector.
- **Residual risk: Low** (campaigns) / **Medium** (comments — raised from Low–Medium, because the author pool is not identity-verified as previously claimed).

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
- The checkout confirmation is: **“I confirm that I am 18 years of age or older and have the legal capacity to enter into this agreement.”** It is a declaration, not a verified check, and Dono does not pretend otherwise.
- The Refund and Dispute Policy treats a Donation by a person under 18 as an objective refund ground without a materiality, reliance or causation test.
- **Residual risk: Medium.** Reduced from Medium–High because there is now a control at the point of payment and a real remedy afterwards — but not to Low, because neither prevents the donation happening.

## 5. Risk factors — why Dono is lower risk than a typical social platform

- **No direct messaging**, so no private one-to-one channel between an adult and a child. This is the single most important structural protection, and it is absent from most services where children come to harm.
- **No recommendation or engagement-ranked feed** surfacing content to children.
- **No livestreaming, no private groups, no disappearing content** — the formats associated with the hardest-to-moderate children's harms are simply not in the product.
- **No anonymous publishing.** Every campaign and comment is attributable to an account.
- **Every campaign is reviewed by a person before it goes live** — a pre-publication gate, which is stronger than most platforms' post-publication moderation.
- **Campaign creation is genuinely gated** by the Payment Provider's verified date of birth, a recognised university email and Connected Account onboarding.
- **No links or attachments in comments.**

**What these do not address** is the donation-side risk in section 4, which sits outside the publishing and commenting gates entirely, and the fact that comment authorship is gated only by a declaration.

## 6. Operational safety measures

- University-email student-status check for every campaign creator; no student-card collection.
- Payment Provider identity and Connected Account onboarding for every campaign creator, with verified DOB used as the final age gate.
- Declared date of birth enforced at account creation, campaign creation and society creation.
- Mandatory human review of every campaign before publication.
- No direct messaging; no links or attachments in comments; no livestreaming, private groups, disappearing content or recommendation feed.
- Audit logging of administrator access to the permitted verification outcome, verified name and verified DOB.
- Designated person (Amrit) for Online Safety Act complaints and for CSEA reports, with a named backup (Sashank) and second backup (Joe).
- Checkout requires an 18-or-parental-permission confirmation and stores the confirmation with the donation record.
- Every user-content surface has a report control, and `/report` accepts logged-out and anonymous reports.
- Every report creates a case with urgency triage, alerts, evidence preservation, moderator assignments, decisions, notices and appeal linkage.
- Role-authorised moderators can restrict and restore content, campaigns, donations and accounts.
- NCA CSEA portal registration, named reporters and quarterly access tests are maintained.
- Retention jobs delete verification outcome fields and case evidence on the configured schedule, subject to audited legal holds.
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


---

## Approval and version control (v2.3)

| Field | Entry |
|---|---|
| Version | 2.3 |
| Version date | 6 August 2026 |
| Accountable owner | Amrit Kaur Rooprai |
| Reviewed by / Approved by | *(to be completed)* |
| Status | Carried forward from v2.2 and amended by the v2.3 amendment block at the top of this document, which takes precedence over anything below it |
| Next scheduled review | 6 February 2027 |
| Supersedes | The corresponding document in `terms_v2.2/`, which is retained unaltered as the historical baseline |
