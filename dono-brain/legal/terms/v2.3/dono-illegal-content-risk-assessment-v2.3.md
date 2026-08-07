> ## v2.3 AMENDMENT BLOCK — READ FIRST
>
> **Version 2.3 — 6 August 2026.** This document is carried forward from v2.2 with the amendments below.
> **Where anything in the body of this document conflicts with this block, this block prevails.** The v2.2 text is retained beneath so that the reasoning and evidence are not lost.
>
> **Amendments applying to this document (Illegal Content Risk Assessment):**
>
> 1. **This assessment must be re-performed before public user-generated content is enabled, and must not credit controls that are not yet built.** Ofcom's position is that risk is assessed against the service **as it exists at the time of assessment, having regard to controls actually in place** — not to planned measures. Every rating in the body of this document that depends on report controls, moderation tooling, keyword filtering, the logged-out reporting route or the audit log is **suspended** and must be re-scored.
> 2. **Method required for the re-performance:** for each of the priority offences, score **likelihood and impact separately**; state the **baseline** risk with only evidenced current controls; then state the **post-control** risk once each control has passed its acceptance test, with the test reference; map each mitigation to the relevant Ofcom Code measure; explain why any recommended measure has not been adopted; and record the approver and date.
> 3. **Scope changes that reduce inherent risk and must be reflected:** comments are plain text with **no links, images or attachments**; there is no private messaging, no livestreaming and no recommendation feed; **donors and account holders must now be 18 or over**; commercial and pass-through fundraising are prohibited; Society Campaigns apply the primary-purpose/official-initiative rule in Terms of Service clause 8.4; and recurring donations and matched funding do not exist.
> 4. **Scope changes that must not be treated as reducing risk:** campaign pages remain publicly viewable by people of any age, so child exposure to campaign content and comments is unchanged.
> 5. **No launch of public user-generated content** until the re-performed assessment is approved and every mandatory acceptance test in `dono-online-safety-procedures-v2.3.md` has passed with dated evidence.
>
> **Revision 2.3.1 — verified build position, 5 August 2026. Read this before scoring anything.**
>
> - **There is no reporting system.** No report control on content, no logged-out reporting route, no report categories, no urgency routing, no counter-notice and no appeals workflow. What exists is a rudimentary report with a free-text reason and an administrator queue. **Acceptance tests 1, 2, 3, 4 and 7 therefore fail outright.**
> - **There is no user suspension or ban capability in the product at all.** The only options are delete the account or leave it. **Acceptance test 5 partly fails**: content can be hidden and campaigns unpublished, but accounts cannot be restricted.
> - **Audit logging is partial.** It cannot be altered or deleted through the application, which is good, but **refund decisions, role changes and account deletion are not logged at all**, and there is no export route. **Acceptance test 6 partly fails.**
> - **There is no monitoring or alerting of any kind**, so nothing surfaces an urgent report outside someone looking. **Acceptance test 4 fails.**
> - **No moderator training has been delivered and no incident drill has been run.** **Acceptance test 8 fails.**
> - **URLs are not blocked in comments** — attachments and images are. Item OS-22.
> - **No malware or image-safety scanning exists on any upload path.** Item AL-02.
>
> **Two things are genuinely strong and should be credited in any assessment:** every campaign, including its images, documents, video and every external link, **is reviewed by a person before publication** and again after any change; and **commenting is restricted to approved members of the society that owns the campaign**, so the population that can post is small, identified and society-controlled.
>
> **Conclusion: the launch block on public user-generated content is correct and must hold.** Nothing in the evidence supports relaxing it.
>
> **Revision 2.3.2 — settled decisions of 6 August 2026:** the Society-only beta applies the primary-purpose and official-initiative rule in Terms of Service clause 8.4; incidental third-party benefit is not itself disqualifying. Creators use the Payment Provider's verified-DOB fail-closed age gate; Donor age remains an active self-certification. These facts supersede contrary descriptions in the carried-forward body and must be used in the required re-performance.

---
# Dono Illegal-Content Risk Assessment

> **Status.** Authoritative production risk assessment and operating baseline. Legal review is recorded through document control; engineering implementation is specified separately and does not qualify the controls described here.

**Implementation and traceability:** [`ENGINEERING_MODERATION_REQUIREMENTS_v2.3.md`](ENGINEERING_MODERATION_REQUIREMENTS_v2.3.md) and [`ONLINE_SAFETY_TRACEABILITY_v2.3.md`](ONLINE_SAFETY_TRACEABILITY_v2.3.md).

## Document control

| Field | Entry |
|---|---|
| Service provider | **Amrit Kaur Rooprai, trading as Dono** — a sole trader. Dono is not a company and there is no plan to incorporate |
| Service assessed | Dono crowdfunding platform |
| Service type | User-to-user service |
| Assessment version | **Production operating baseline v2.3** |
| Assessment date | **6 August 2026** |
| Responsible person | **Amrit Kaur Rooprai** — accountable for Online Safety Act compliance. **Backup: Sashank. Second backup: Joe** |
| Approved by | _________________ (Amrit Kaur Rooprai, as operator — there is no separate governing body) |
| Next scheduled review | No later than 31 July 2027 |
| Earlier review triggers | Significant product change; serious incident; material change in user behaviour; new Ofcom Risk Profile; introduction of messaging, links or attachments in comments, age assurance, automated recommendations or new upload types |

## Corrections in v2.2

Four statements in the previous version were factually wrong and would have undermined the assessment's reliability. Each is corrected in the body below.

| Previous statement | Correct position |
|---|---|
| "Dono generally holds donor funds and pays out to the recipient, with a fallback to direct transfer" | **Dono does not receive, hold, safeguard or control donor funds.** Payments are made through Stripe Connect using direct charges to the Campaign Owner's connected account. The Campaign Owner legally receives the payment. Dono provides the software interface and acts as the Campaign Owner's contractual agent for presenting the campaign and receiving donation offers. **Dono cannot independently release or redirect funds** |
| Provider is "Dono (UK Ltd — incorporation not yet started)" and Amrit reports "to the company's most senior governing body once incorporated" | The provider is **Amrit Kaur Rooprai, a sole trader.** There is no company and no separate governing body. Amrit is accountable as the operator |
| The service offers "replies", "profiles, usernames and photographs" and "user-generated content search" | The product has **public comments only** — no replies, no profile photographs beyond an optional avatar, and no user-generated-content search. The assessment must describe the service as operated |
| Section 2A treats general age access as an open question with three options | **The question is resolved.** 18+ (by declared date of birth) is required for accounts, campaigns and comments; **browsing and donating are open to everyone.** See section 2A as rewritten |

## 1. Purpose and scope

This assessment considers the risk of harm arising from illegal content being encountered through Dono, and the risk of Dono being used to commit or facilitate priority offences.

Dono enables users to publish:

- campaign text, images, video, documents and hyperlinks;
- public comments (plain text only — **no replies, no links, no attachments, no images**); and
- a username and an optional profile avatar.

Dono does **not** offer replies, user-generated-content search, private messaging, livestreaming, private groups, disappearing content or a recommendation feed.

The principal purpose of the service is to allow users to raise money for campaigns. This creates a distinctive financial risk because user-generated representations may directly influence another person's decision to transfer money.

This document assesses the 18 kinds of priority illegal content identified by Ofcom, including the separate CSEA sub-risks of grooming, image-based CSAM and CSAM URLs. It also considers relevant non-priority illegal content.

This is not Dono's complete operational risk register. Separate assessments are still required for matters including:

- data protection and special-category data;
- payment fraud, sanctions and anti-money-laundering controls (see the note on overseas donors below);
- consumer protection and misleading campaigns;
- intellectual property and confidential information;
- safeguarding; and
- cybersecurity.

## 2. Service description and assumptions

This assessment reflects the production service:

- Dono is initially a small UK-focused crowdfunding service for students and recognised student organisations. At launch it recognises one institution (the University of Oxford) and restricts registration to that institution's email domain.
- **Campaign creators** must hold an account (18+ by declared date of birth), pass a **manual student-card and university-email check by a Dono administrator**, and complete Stripe Connect onboarding including Stripe Identity, before a campaign can be published or receive funds.
- **Every campaign is reviewed by a person before publication.** Comments are post-moderated.
- **The Campaign Owner or Society owns and controls the Campaign and funds.** Incidental third-party benefit, and qualifying official Society initiatives under Terms of Service clause 8.4, are permitted; pass-through fundraising is not. Creators must be enrolled at a Recognised Institution and a Connected Account holder must meet the UK address/onboarding requirements; physical presence in the UK is not required. Donors may be anywhere.
- Dono does not provide private messaging, encrypted messaging, livestreaming, group chats, disappearing content or a recommendation feed. **Comments do not permit links, attachments or images.**
- Campaign owners may upload images, video and supporting documents. Account holders may set an optional profile avatar.
- Public anonymity does not mean anonymity from Dono: Dono retains account information and always holds a donor's name against a payment.
- Campaigns, campaign updates, images, uploaded documents, comments and usernames have a visible report control. People without an account can report through the public `/report` form.
- **Fund flow: Dono does not receive, hold, safeguard or control donor funds.** Payments are made through Stripe Connect using **direct charges** to the Campaign Owner's connected account. The Campaign Owner legally receives the payment. Dono provides the software interface and acts as the Campaign Owner's contractual agent for presenting the campaign and receiving donation offers on their behalf. **Dono cannot independently release, redirect, withhold or recall funds, and cannot hold or delay a payout.**

### 2A. Age access — resolved

The age position is settled and is no longer an open question. It is:

- **18 or over is required to create an account**, and therefore to create a campaign, act for a society, or post a comment.
- **Browsing is open to everyone, at any age.** Donating may be done without an account but requires active 18+ and legal-capacity self-certification.
- **Creator age uses the Payment Provider's government-document date of birth as the fail-closed final gate.** Account, comment and Donor gates remain declaration-based and are **not** highly effective age assurance under Ofcom's children's access assessment tool.
- Checkout asks a Donor to confirm they are 18 or over and have legal capacity — a declaration, not a verified check. Parent/guardian permission is not an alternative.

**Consequence: children are likely to access the service**, and Dono has completed a separate Children's Risk Assessment on that footing. Dono operates **child-safe by default** rather than deploying age assurance to exclude under-18s; the decision and its reasoning are recorded in the Online Safety Act Procedures section 3.3.

**Effect on the ratings below.** Because commenting and donating are declaration-gated, a determined under-18 could attempt either. The CSEA grooming, harassment and intimate-image ratings are therefore given on the basis that minors may in practice be present as viewers and, despite the rule, as comment authors or attempted Donors. Creator ratings may credit the verified-DOB gate once its acceptance test passes.

Note that Dono does **not** recognise schools or any institution whose students are predominantly under 18, so there is no route by which a school-age person becomes a campaign creator or beneficiary.

## 3. Evidence considered

- Dono's intended user base and operating model;
- the confirmed campaign, comment and profile functionality;
- the manual student-card check performed by Dono, and Stripe Identity verification, for campaign creators only;
- confirmed human review of every campaign before publication;
- the absence of private messaging, livestreaming and comment attachments;
- the **direct-charge** payment model, under which Dono never holds funds;
- the engineering configuration answers of 31 July 2026, which establish what is built and what is not;
- Ofcom's Risk Assessment Guidance and Risk Profiles;
- Ofcom's Illegal Content Codes of Practice;
- launch-state test evidence, risk exercises and the operational-data baseline available at the assessment date.

Limited historic incidents are not evidence that a risk is absent. Conclusions use service design, intended use, reasonably foreseeable misuse, control tests and the operational data available.

Ofcom specifically identifies user profiles, comments, images, hyperlinks and user-generated content search as relevant risk factors. Commenting is associated with increased risks including fraud, hate, harassment, grooming, terrorism and suicide or serious self-harm. Hyperlinks are associated with terrorism, CSAM URLs, fraud, drugs, self-harm and foreign interference. User profiles may increase fraud, grooming, harassment, proceeds-of-crime and foreign-interference risks.

## 4. Risk-rating methodology

Each harm is assessed by considering likelihood, impact, reach, existing controls and residual risk. Ratings:

- **Negligible** — impossible or extremely unlikely because of the service's design and supported by evidence.
- **Low** — possible, but unlikely, with few relevant risk factors or effective controls.
- **Medium** — a moderate likelihood or impact, several relevant risk factors, or controls that require continued effectiveness monitoring.
- **High** — a high likelihood or severe impact, substantial evidence of occurrence, or many uncontrolled risk factors.

Where the evidence is inconclusive, Ofcom expects providers to err towards the higher rating.

## 5. Priority illegal-content assessment

| Illegal harm | Dono risk analysis | Provisional rating |
|---|---|---|
| 1. Terrorism | A Campaign could solicit funds for a proscribed organisation, glorify terrorism, or distribute or link to terrorist material. Manual review, a UK-onboarded Connected Account and the prohibition on pass-through fundraising reduce this. | **Low.** |
| 2A. CSEA — grooming | Comments could be used to identify or approach a younger user. **No private messaging removes the main concealment route entirely**, which is the single most important structural protection here. But comment authorship is gated only by a declared date of birth, so a minor could in practice hold an account and comment, and children may in any event be present as viewers and donors. | **Medium.** Would fall to Low only with highly effective age assurance on accounts, which Dono has decided not to deploy (section 2A). |
| 2B. CSEA — image-based CSAM | Campaign and profile image uploads make the risk technically possible. Manual review of every campaign and single-purpose profile-image upload reduce likelihood. | **Low.** |
| 2C. CSEA — CSAM URLs | Campaign text, documents and hyperlinks could direct users to illegal material. Human review of every campaign before publication is the principal control. **Comments permit no links, attachments or images**, which closes the comment route. | **Low.** |
| 2. Overall CSEA rating | Driven principally by the grooming sub-risk. | **Medium.** |
| 3. Hate offences | Campaign descriptions, profiles and comments may contain threatening or inflammatory material directed at protected groups; the student-community context may make individuals or societies readily identifiable. | **Medium** at launch — review after six months of operational evidence. |
| 4. Harassment, stalking, threats and abuse | Public comments may target campaign owners, donors or identifiable students, and the student-community context makes individuals readily identifiable. No private messaging or location sharing reduces the risk. Because browsing and donating are open to all ages and comment authorship is gated only by a declaration, a target or a perpetrator could be a minor. | **Medium.** |
| 5. Controlling or coercive behaviour | Not a private-communication service; public content could nevertheless form part of wider coercive conduct. | **Low.** |
| 6. Intimate-image abuse | A user could upload an intimate image as a campaign image, document or profile photograph without consent. Manual review of every campaign and single-purpose profile-image function are the principal controls. | **Low.** |
| 7. Extreme pornography | Inconsistent with Dono's purpose; detectable through manual review and reporting. | **Low.** |
| 8. Sexual exploitation of adults | A campaign could theoretically be used to advertise or fund exploitation; no messaging or marketplace function for sexual services. | **Low.** |
| 9. Human trafficking | Campaigns or links could solicit funds for trafficking; Society control, the mission/official-initiative test, no pass-throughs and manual review reduce likelihood. | **Low.** |
| 10. Unlawful immigration | A campaign could theoretically fund unlawful entry or people-smuggling; campaign descriptions and manual review provide the main check. | **Low.** |
| 11. Fraud and financial-services offences | Dono's clearest illegal-content risk. A creator could invent a beneficiary, impersonate a society, falsify evidence, misrepresent use of funds, or use coordinated fake comments to lend credibility. Manual review of every campaign, Stripe identity verification, linked-account signals and repeat-offender review are the principal controls. | **Medium.** Moves towards High if manual review or beneficiary verification is weakened. |
| 12. Proceeds of crime | Overseas Donors are permitted, which widens exposure to layering, fraudulent payment instruments or unusual fund movement, though direct transfer to a UK-onboarded Connected Account, Society control and the pass-through prohibition constrain it. | **Low-to-Medium** — depends on the Payment Provider's sanctions/AML screening for international Donors, which should be confirmed as part of the separate financial-crime assessment. |
| 13. Drugs and psychoactive substances | Not a goods marketplace; campaigns are manually reviewed. | **Low.** |
| 14. Firearms, knives and other weapons | Itemised expenditure and manual review reduce this. | **Low.** |
| 15. Suicide and serious self-harm | Campaigns, images, documents, links or comments could encourage or assist suicide or self-harm; legitimate mental-health or medical fundraising should not be treated as inherently harmful. | **Low,** with urgent escalation required where content appears to encourage or assist imminent harm. |
| 16. Foreign interference | Overseas Donors and outward-facing official Society initiatives slightly widen exposure to covert financing of student-community activity, but Society approval/control, direct charges and manual review constrain it. | **Low.** |
| 17. Animal cruelty | Campaigns, images or comments could encourage cruelty or fund offences. | **Low.** |
| 18. Cyberflashing | No direct messaging; unsolicited sexual images could still be uploaded as campaign or profile content, but every campaign is manually reviewed before publication. | **Low, near-negligible** given confirmed pre-publication review of all uploaded images. |

## 6. Other illegal content

Potential examples include blackmail or extortion connected with campaigns or comments; false or malicious communications; criminal infringement involving uploaded documents or images; unlawful disclosure of personal information; contempt of court; and impersonation or forged documents outside the assessed fraud category.

Provisional overall rating: **Low.** Reports and moderation outcomes must be monitored to determine whether any particular non-priority offence needs its own separate assessment.

## 7. Overall conclusion

Dono is assessed as a multi-risk service, because:

- **fraud and financial-services offences** are rated Medium;
- **harassment, stalking, threats and abuse** are rated Medium;
- **hate offences** are rated Medium and monitored against operational evidence; and
- **CSEA (grooming-driven)** is rated Medium. That rating reflects the resolved age position in section 2A: accounts are nominally 18+ but the gate is a declared date of birth, and browsing and donating are open to all ages.

No category is assessed as High. That conclusion depends on the production controls in Section 8 and the documented decision in Section 2A to operate child-safe by default. Control effectiveness is reviewed through the monitoring programme in Section 9.

## 8. Operational controls

### 8.1 Governance

**Amrit Kaur Rooprai** is the named individual accountable for Online Safety Act compliance and maintains the evidence needed to explain Dono's moderation decisions, risk controls, residual risks and corrective actions. Because Dono is a sole trader there is no separate governing body; Amrit is accountable as the operator. **Sashank** is the operational backup and appeal reviewer, and **Joe** is the second backup. Any founder may impose an emergency temporary restriction, which is logged and promptly reviewed.

Because Dono is multi-risk, it maintains a written responsibility matrix, internal illegal-content policies, prioritisation rules, moderator guidance and training, performance targets, sufficient moderation cover during operating periods and monitoring for new or increasing forms of harm.

### 8.2 Preventive campaign controls

Before publication, a moderator checks every Campaign for: creator identity and adult status through the Payment Provider's result; student or Society status through the recognised university-email process; compliance with the Society primary-purpose/official-initiative rule; control, recipient and ownership disclosures; an itemised and plausible use of funds; supporting documents and links; false claims of affiliation or endorsement; prohibited financial promotions or investment propositions; sanctions, terrorism or proscribed-organisation concerns; fundraising for illegal goods, services or conduct; signs of impersonation, fabricated evidence or stolen images; unnecessary sensitive personal information; and content falling within Dono's prohibited-content policy.

The moderator records the outcome as approve, request evidence, reject or escalate, together with reasons, evidence references and the policy version applied.

### 8.3 Product restrictions

In production, Dono:

- prohibits links, attachments and images in comments through client and server validation; any proposal to permit them triggers a risk-assessment review before release;
- **The age-access question is resolved** (section 2A). Dono operates child-safe by default, with a separate Children's Risk Assessment.
- does not provide private messaging;
- requires an account before posting a comment;
- routes any post-approval change to a campaign's purpose or Ownership Statement through re-review;
- rate-limits comments and reporting campaigns;
- retains internal traceability even where a donor's name is hidden publicly;
- provides moderator tools to disable comments on a campaign;
- permits immediate restriction of publication and new donations during a serious investigation; and
- prevents precise home addresses, live locations and unnecessary personal documents from being displayed publicly.

### 8.4 Reporting

A clearly visible Report control appears on **every campaign page, campaign update, campaign image and uploaded document, every comment, and every username**. For an update, image or document, the control appears beside the specific item.

A separate **publicly accessible reporting form at `/report`, requiring no login**, accepts reports from people who do not hold an account. It captures the content link, content type, concern, whether the reporter is personally affected, an optional email address and supporting explanation. Email remains a monitored intake route; all routes create the same structured case.

The categories in Community Guidelines clause 7.3 do not require a reporter to determine whether an offence occurred and include content that may be **harmful to children**. For suspected CSEA content, the form instructs reporters **not to download, copy or attach the material** and to provide the URL or campaign identifier instead.

Every intake route creates a unique case, deduplicates repeated submissions where appropriate, preserves each reporter's record and triggers the applicable acknowledgement and priority workflow.

### 8.5 Moderation and removal

A report of suspected illegal content creates a moderation case. The moderator preserves relevant identifiers, timestamps and audit information; assesses whether immediate restriction is necessary; reviews the content against Dono's Terms and illegal-content decision guide; removes or restricts content swiftly where illegal or prohibited; considers account or campaign sanctions and connected content; notifies the affected user where lawful and safe; records reasoning and action; and escalates where legally required or necessary to protect life.

Suspected CSAM enters the specialist procedure. Staff do not download, copy or circulate the material outside the restricted evidence workflow.

Internal triage targets:

- **Immediate:** imminent threat to life, suspected CSAM, terrorism or active exploitation.
- **Within 24 hours:** credible threats, intimate-image abuse, fraud involving active fundraising, hate offences and serious harassment.
- **Within three working days:** other content reports.

These are internal operational targets rather than unconditional public contractual guarantees.

### 8.6 Appeals and complaints

The single complaints and appeals framework is **clause 8 of the Community Guidelines**, and this assessment does not describe it differently. It covers: removal of a person's content; rejection or suspension of a campaign; restriction or termination of an account; a reporter's complaint that Dono failed to remove content or mishandled their report; a complaint from anyone, including a non-user, that Dono is not complying with its illegal-content, child-safety, reporting, complaints or freedom-of-expression duties; and children's-safety complaints. Acknowledgement within 5 Working Days; outcome targeted within 30 days; urgent matters handled immediately. **A person not substantially involved in the original decision determines the appeal** — ordinarily Sashank where Amrit decided. Where team size genuinely prevents separation, the original decision-maker may reconsider, but only as a documented, genuine second look. Content, campaign functionality or account access is restored where a decision is reversed, and the reason recorded.

### 8.7 Terms of service

Dono's Terms clearly explain: that terrorism, CSEA and all other illegal content are prohibited; how Dono minimises the time illegal content remains available; that Dono acts swiftly once aware of suspected illegal content; the reporting and complaints procedure; moderation actions; the right to appeal; when information is preserved or disclosed lawfully; and whether automated moderation technology is used. These provisions are easy to find, clear and accessible.

## 9. Monitoring

Dono records and reviews: number of reports by harm category; number and proportion upheld; time from report to first review; time from awareness to restriction or removal; campaign rejections by reason; fraud losses, refunds and chargebacks; repeat offenders and linked accounts; appeals and overturned decisions; complaints concerning moderator error; law-enforcement or regulator notices; reports involving children or vulnerable adults; and evidence of coordinated misuse.

The Online Safety lead reviews effectiveness monthly, conducts formal reviews after three and six months of public operation, and conducts annual reviews thereafter.

## 10. Record keeping and review

The assessment and supporting records are dated, version-controlled, retained in an accessible electronic format and written clearly enough for Ofcom to understand. Earlier versions are retained for at least three years, or longer where Dono's retention policy or a legal requirement applies.

The assessment is reviewed at least annually; before any significant service change; after a serious illegal-content incident; before introducing private messaging, image comments, livestreaming, user groups, recommendations or anonymous posting; when the age-access position changes; after a material increase in users or geographic scope; following a significant Ofcom Risk Profile change; or where reports, chargebacks or moderation data indicate increased risk.

## 11. Control assurance register

| Control | Owner | Verification | Status |
|---|---|---|---|
| Children's access assessment and child-safe-by-default decision | Online Safety lead | Annual and change-trigger review | Active |
| Client and server rejection of comment links and attachments | Engineering | Continuous test | Active |
| Report controls on every UGC surface and logged-out `/report` | Engineering | Continuous synthetic test | Active |
| Decision guide covering all priority harms and policy-breach alternative | Online Safety lead | Quarterly sample review | Active |
| CSEA, terrorism and imminent-harm workflow; portal access | Online Safety lead | Quarterly exercise | Active |
| Campaign pre-publication review checklist | Moderation Operations | Per-campaign completion audit | Active |
| Financial-crime and sanctions escalation | Compliance | Quarterly control review | Active |
| Moderation, appeals, audit and monthly metrics records | Engineering / Online Safety lead | Monthly reconciliation | Active |
| Illegal-content, reporting and complaints terms | Legal / Online Safety lead | Version cross-check on every change | Active |
| Residual-risk reassessment | Online Safety lead | Monthly monitoring; formal 3-, 6- and 12-month review | Active |
| Production control verification in Online Safety Act Procedures | Engineering / Online Safety lead | Continuous tests and quarterly exercise | Active |

## Approval statement

I confirm that this assessment accurately describes Dono's service as it operates on the assessment date, that the stated existing controls have been implemented, and that the identified actions have been assigned to responsible persons.

Name: ____________________
Role: ____________________
Date: ____________________
Signature/approval record: ____________________


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
