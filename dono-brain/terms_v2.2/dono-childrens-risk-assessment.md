# Dono — Children's Risk Assessment

**Prepared for:** Online Safety Act compliance file
**Service:** Dono (joindono.com) — student crowdfunding platform, Oxford launch
**Designated person (Online Safety Act):** Amrit Kaur Rooprai. **Backup:** Sashank. **Second backup:** Joe.
**Version:** 2.2 — 31 July 2026
**Approved by:** _________________ **Date:** _________________
**Review triggers:** introduction of direct messaging; links or attachments permitted in comments; campaign creation opened to under-18s; introduction of age assurance; evidence that a significant proportion of users are children; six months of operating data.

## Changes in v2.2 — corrections to the factual record

The previous version overstated Dono's controls in four material ways. Because a risk assessment that overstates its controls does not satisfy the statutory duty, each is corrected here rather than softened.

| Previous statement | Correct position |
|---|---|
| Publishing is gated by "an actual verification mechanism (Stripe Identity), not a checkbox", which confirms 18+ | **Stripe Identity does not reliably return a date of birth and is not used as Dono's age gate.** The gate for accounts, campaigns and comments is a **declared date of birth** — a checkbox in substance. Under Ofcom's children's access assessment tool that is **not** highly effective age assurance |
| "Stripe Identity verification for all campaign creators **and commenters**" | **Stripe Identity applies to campaign and society creation only.** Commenting requires an account, which requires a declared date of birth — nothing more |
| Beneficiaries are "verified as affiliated with the university **or school** named in the campaign" | **Dono does not perform institution verification at all**, and **does not recognise schools.** Only UK higher-education institutions participate. There are no under-18 beneficiaries because the Beneficiary is the Campaign Owner, who must be 18+ |
| "Ask Stripe to hold payouts" is a confirmed existing safety measure | **Dono cannot hold or delay a payout.** This is not a control and has been removed from every document |
| Identity documents "deleted once Stripe completes KYC" | Dono never receives identity documents. **Dono holds a student-card image**, which is deleted on a successful check — a control that **is not yet built** |

The consequence is that Dono's position on children is **weaker than the previous draft claimed**, and the ratings below reflect that. Children are not excluded from authoring roles by a real verification mechanism; they are excluded by a declaration. That is a meaningful deterrent for an incidental under-18 visitor and no barrier at all to a determined one.

---

## 1. Service description

Dono lets students run public fundraising campaigns for university-related costs and lets others donate to them.

- **Campaign creators:** must hold an account (18+ by **declared date of birth**), pass a manual student-card and university-email check by a Dono administrator, and complete Stripe Connect onboarding including Stripe Identity, before they can publish.
- **Content in a campaign:** text, images and video.
- **Comments:** account holders (18+ by declared date of birth) may post public comments. Comments are **post-moderated** — they go live immediately and are removed on report. **Links and attachments are not permitted in comments.**
- **Beneficiaries:** the Beneficiary of a campaign **is** its Campaign Owner. Dono does not permit third-party beneficiaries, and does not verify affiliation with any institution beyond the student-card check it performs itself.
- **Donors:** may donate with or without an account, **at any age**. Checkout asks the donor to confirm they are 18 or over or have a parent or guardian's permission — a declaration, not a check.
- **Viewers:** campaigns are public and browsable without logging in.
- **Absent by design:** no direct messaging, no livestreaming, no private groups, no disappearing content, no recommendation or engagement-ranked feed. The product surface is a public campaign list plus campaign pages.
- **Moderation:** every campaign is reviewed by a person before publication. Comments are post-moderated.
- **Reporting and complaints:** a report control on every item of user content and a public form for people without an account; acknowledged within 5 Working Days, outcome targeted within 30 days; urgent matters handled immediately. Suspected CSEA content escalates to the NCA. **[Both report routes are still being built — see section 6.]**

## 2. Children's access assessment

**Are children likely to visit?** **Yes.** The service is public and unauthenticated, and campaign links are shareable — a child can reach it via search, a shared link or social media, with no barrier at the door.

**Can they browse without logging in?** Yes, fully.

**Can they donate?** **Yes.** No account is required and there is no age gate. The only control is a self-declaration at checkout.

**Can they comment?** **Yes.** Commenting needs an account, but account creation asks for no date of birth and has no age gate of any kind — not even a self-declaration to state falsely. **[COMPLIANCE — 6 Aug 2026: the account-creation/comment age gate this section previously assumed will not be built (see TRUTH.md, Age section). The paragraph above and the Conclusion below need re-scoring against "no barrier at all" rather than "gameable self-declaration" — Amrit/counsel to re-assess.]** They can in any event **read** every comment as an unauthenticated visitor.

**Can they publish campaigns?** Not without an account, and additionally not without passing a manual student-card check and Stripe Identity. **The student-card check is the meaningful barrier here** — a child would need a plausible university student card and a working university email address, which is a real obstacle in a way that a declared date of birth is not.

**Conclusion.** **Children are likely to access the service.** Dono cannot conclude otherwise on the strength of a self-declared date of birth. Children are effectively excluded from **publishing campaigns** by the student-card and university-email requirement, but only nominally excluded from **commenting**, and not excluded at all from **viewing** or **donating**. Those last three are where the risk sits. **[COMPLIANCE — this conclusion still describes commenting as "only nominally excluded," which assumed a gameable declared-DOB gate at account creation. That gate does not exist and will not be built; commenting has no age-related barrier at all. Needs re-scoring, not just a wording fix.]**

## 3. User journeys

**Child visitor.** Arrives via search, link or social share, with no login. Browses or searches public campaigns. Views campaign text, images, video and updates. Reads public comments. **Can donate as a guest** — no account, no verified age check, no parental visibility, one self-declaration.

**Child who states a false age.** Creates an account. Can post public comments. Cannot publish a campaign, because the student-card and university-email check would fail.

**Adult campaign creator.** Creates an account, declares a date of birth of 18 or over, submits a student card and university email for manual review, completes Stripe Connect and Stripe Identity, builds a campaign, submits it for human review, and on approval goes live.

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
- The **checkout confirmation** — "you are 18 or over, or have a parent or guardian's permission" — is the only control that sits at the point of payment. It is a declaration, not a check, and Dono does not pretend otherwise. It is nonetheless a meaningfully stronger signal than silence: it makes the position explicit at the moment of decision, it gives a parent or guardian a clear basis to say the donation was unauthorised, and it costs nothing to implement.
- The **Refund and Dispute Policy makes a donation by a child without a parent or guardian's permission an objective refund ground** — one that does not require the family to prove materiality or causation. That is a genuine remedy, not a paper one.
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

## 6. Existing safety measures

**In place today:**

- Manual student-card and university-email check by a Dono administrator for every campaign creator.
- Stripe Connect onboarding and Stripe Identity for every campaign creator (identity, **not** a reliable age signal).
- Declared date of birth enforced at account creation, campaign creation and society creation.
- Mandatory human review of every campaign before publication.
- No direct messaging; no links or attachments in comments; no livestreaming, private groups, disappearing content or recommendation feed.
- Audit logging of every administrator access to student-card and identity data.
- Designated person (Amrit) for Online Safety Act complaints and for CSEA reports, with a named backup (Sashank) and second backup (Joe).

**Not yet built — do not treat these as controls:**

- **The checkout age confirmation** (section 4's principal mitigation).
- **Report controls on every user-content surface**, and the public reporting form for people without an account.
- The moderation case record, urgent alerting, and the moderator restriction controls.
- **NCA CSEA portal registration** and tested accounts.
- Automated deletion of student-card images, and retention enforcement generally.
- Automated content scanning of images or video.
- Keyword or pattern detection on comments before post-moderation.
- Structured audit logging beyond the current admin action log.
- A formalised, built refund process.

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

**Overall: children are likely to access the service, and Dono operates child-safe by default rather than deploying age assurance to exclude them.** That decision is recorded in the Online Safety Act Procedures section 3.3, with its reasoning. No harm is rated High. Several are rated Medium, and **those ratings depend on the section 6 items marked "not yet built" being built** — particularly the report controls, without which a child who encounters harmful content has no straightforward way to tell Dono about it.

## 8. Further improvements, in priority order

1. **Build the checkout age confirmation.** It is the only control at the point where a child parts with money, and it is currently drafted in the Terms but absent from the product. **[BLOCKING]**
2. **Build the report controls and the public reporting form.** A child viewer who encounters harmful content currently has no in-product route to report it, and a child without an account has no route at all. **[BLOCKING]**
3. **Full-length video review**, not spot-checking, as an explicit part of pre-publication review. Two Low ratings in section 7 depend on it.
4. **A fast-track reporting path** so that reports concerning content visible to children are triaged ahead of the general queue rather than sharing the same 30-day target.
5. **Comment pre-screening** — automated keyword or pattern detection — to shrink the post-moderation window, which is the basis of four Medium ratings.
6. **Repeat-offender detection** for comment authors.
7. **Confirm links and attachments are technically disabled in comments**, not merely prohibited by policy.
8. **Review after six months of operating data**, particularly on: whether under-18 donations are actually occurring and at what volume; whether any account has been created by someone who falsified their date of birth; and the time from comment publication to removal on report.
