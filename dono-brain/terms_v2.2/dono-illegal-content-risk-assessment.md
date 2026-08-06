# Dono Illegal-Content Risk Assessment

> **Draft status.** Working draft, not legal advice. Requires review by a solicitor with UK Online Safety Act experience before it is signed.

## Document control

| Field | Entry |
|---|---|
| Service provider | **Amrit Kaur Rooprai, trading as Dono** — a sole trader. Dono is not a company and there is no plan to incorporate |
| Service assessed | Dono crowdfunding platform |
| Service type | User-to-user service |
| Assessment version | **2.2 — pre-launch** |
| Assessment date | **31 July 2026** |
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

This draft reflects the following confirmed launch design:

- Dono is initially a small UK-focused crowdfunding service for students and recognised student organisations. At launch it recognises one institution (the University of Oxford) and restricts registration to that institution's email domain.
- **Campaign creators** must hold an account (18+ by declared date of birth), pass a **manual student-card and university-email check by a Dono administrator**, and complete Stripe Connect onboarding including Stripe Identity, before a campaign can be published or receive funds.
- **Every campaign is reviewed by a person before publication** — this is confirmed, not provisional. Comments are post-moderated.
- **The Beneficiary of a campaign is its Campaign Owner.** Dono does not permit third-party beneficiaries or pass-through campaigns, so there is no separate category of unverified beneficiary. Campaign Owners must be UK-based; donors may be anywhere.
- Dono does not provide private messaging, encrypted messaging, livestreaming, group chats, disappearing content or a recommendation feed. **Comments do not permit links, attachments or images.**
- Campaign owners may upload images, video and supporting documents. Account holders may set an optional profile avatar.
- Public anonymity does not mean anonymity from Dono: Dono retains account information and always holds a donor's name against a payment.
- Campaigns and comments will have a visible report control, and people without an account will be able to report through a public web form (**both still to be built — see section 11**).
- **Fund flow: Dono does not receive, hold, safeguard or control donor funds.** Payments are made through Stripe Connect using **direct charges** to the Campaign Owner's connected account. The Campaign Owner legally receives the payment. Dono provides the software interface and acts as the Campaign Owner's contractual agent for presenting the campaign and receiving donation offers on their behalf. **Dono cannot independently release, redirect, withhold or recall funds, and cannot hold or delay a payout.**

### 2A. Age access — resolved

The age position is settled and is no longer an open question. It is:

- **There is no minimum age to create an account or to post a comment.** 18 or over is required only to create a campaign or act for a society, checked at that specific step.
- **Browsing and donating are open to everyone, at any age.** No account is needed to donate.
- **Age is established by a declared date of birth**, where it is checked at all. Stripe Identity does not reliably return a date of birth in every flow and **is not used as Dono's age gate**. A declared date of birth is **not** highly effective age assurance under Ofcom's children's access assessment tool.
- Checkout asks a donor to confirm they are 18 or over — a declaration, not a check, and with no parent-or-guardian-permission alternative.

**[COMPLIANCE — 6 Aug 2026: revised from "18+ to create an account, and therefore to comment" (see TRUTH.md, Age section). Any severity/likelihood rating elsewhere in this document that assumed a declared-DOB gate on account creation or commenting was assessing a control that will not be built and needs re-scoring against no gate at all — Amrit/counsel to re-assess.]**

**Consequence: children are likely to access the service**, and Dono has completed a separate Children's Risk Assessment on that footing. Dono operates **child-safe by default** rather than deploying age assurance to exclude under-18s; the decision and its reasoning are recorded in the Online Safety Act Procedures section 3.3.

**Effect on the ratings below.** Because commenting is gated only by a declared date of birth, a determined under-18 could hold an account and comment. The CSEA grooming, harassment and intimate-image ratings are therefore given on the basis that minors may in practice be present as viewers, as donors, and — despite the rule — as comment authors. They are **not** reduced on the strength of the 18+ rule, because that rule is not enforced by an effective check.

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
- the fact that Dono is pre-launch and therefore has no historic reports, moderation decisions, user complaints or illegal-content prevalence data.

The lack of historic incidents is not evidence that a risk is absent. Pre-launch conclusions are based principally on service design, intended use and reasonably foreseeable misuse.

Ofcom specifically identifies user profiles, comments, images, hyperlinks and user-generated content search as relevant risk factors. Commenting is associated with increased risks including fraud, hate, harassment, grooming, terrorism and suicide or serious self-harm. Hyperlinks are associated with terrorism, CSAM URLs, fraud, drugs, self-harm and foreign interference. User profiles may increase fraud, grooming, harassment, proceeds-of-crime and foreign-interference risks.

## 4. Risk-rating methodology

Each harm is assessed by considering likelihood, impact, reach, existing controls and residual risk. Ratings:

- **Negligible** — impossible or extremely unlikely because of the service's design and supported by evidence.
- **Low** — possible, but unlikely, with few relevant risk factors or effective controls.
- **Medium** — a moderate likelihood or impact, several relevant risk factors, or controls whose effectiveness has not yet been demonstrated.
- **High** — a high likelihood or severe impact, substantial evidence of occurrence, or many uncontrolled risk factors.

Where the evidence is inconclusive, Ofcom expects providers to err towards the higher rating.

## 5. Priority illegal-content assessment

| Illegal harm | Dono risk analysis | Provisional rating |
|---|---|---|
| 1. Terrorism | A campaign could solicit funds for a proscribed organisation, glorify terrorism, or distribute or link to terrorist material. Manual review of every campaign and UK-only beneficiaries substantially reduce this. | **Low.** |
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
| 9. Human trafficking | Campaigns or links could solicit funds for trafficking; UK-only beneficiaries and manual review reduce likelihood. | **Low.** |
| 10. Unlawful immigration | A campaign could theoretically fund unlawful entry or people-smuggling; campaign descriptions and manual review provide the main check. | **Low.** |
| 11. Fraud and financial-services offences | Dono's clearest illegal-content risk. A creator could invent a beneficiary, impersonate a society, falsify evidence, misrepresent use of funds, or use coordinated fake comments to lend credibility. Manual review of every campaign and Stripe identity verification are meaningful controls, but their effectiveness in operation is not yet demonstrated. | **Medium.** Would move towards High if manual review were dropped or beneficiary verification weakened. |
| 12. Proceeds of crime | Overseas donors are now permitted, which widens exposure to layering, fraudulent payment instruments or unusual fund movement, though UK-only beneficiaries and direct transfer to verified connected accounts constrain it. | **Low-to-Medium** — depends on Stripe's own sanctions/AML screening for international donors, which should be confirmed as part of the separate financial-crime assessment. |
| 13. Drugs and psychoactive substances | Not a goods marketplace; campaigns are manually reviewed. | **Low.** |
| 14. Firearms, knives and other weapons | Itemised expenditure and manual review reduce this. | **Low.** |
| 15. Suicide and serious self-harm | Campaigns, images, documents, links or comments could encourage or assist suicide or self-harm; legitimate mental-health or medical fundraising should not be treated as inherently harmful. | **Low,** with urgent escalation required where content appears to encourage or assist imminent harm. |
| 16. Foreign interference | Overseas donors slightly widen exposure to covert financing of student-community activity, but UK-only beneficiaries and manual review constrain it. | **Low.** |
| 17. Animal cruelty | Campaigns, images or comments could encourage cruelty or fund offences. | **Low.** |
| 18. Cyberflashing | No direct messaging; unsolicited sexual images could still be uploaded as campaign or profile content, but every campaign is manually reviewed before publication. | **Low, near-negligible** given confirmed pre-publication review of all uploaded images. |

## 6. Other illegal content

Potential examples include blackmail or extortion connected with campaigns or comments; false or malicious communications; criminal infringement involving uploaded documents or images; unlawful disclosure of personal information; contempt of court; and impersonation or forged documents outside the assessed fraud category.

Provisional overall rating: **Low.** Reports and moderation outcomes must be monitored to determine whether any particular non-priority offence needs its own separate assessment.

## 7. Overall conclusion

Dono is provisionally assessed as a multi-risk service, because:

- **fraud and financial-services offences** are rated Medium;
- **harassment, stalking, threats and abuse** are rated Medium;
- **hate offences** are provisionally rated Medium pending operational evidence; and
- **CSEA (grooming-driven)** is rated Medium. That rating reflects the resolved age position in section 2A: accounts are nominally 18+ but the gate is a declared date of birth, and browsing and donating are open to all ages.

No category is currently assessed as High. That conclusion depends on the controls in Section 8 being fully implemented before public launch, and specifically on Section 2A being resolved in a way that restricts general account access to verified adults, or on a documented Children's Access Assessment being completed if it is not.

## 8. Required controls

### 8.1 Governance

**Amrit Kaur Rooprai** is the named individual accountable for Online Safety Act compliance, and must be able to explain Dono's moderation decisions, risk controls, residual risks and outstanding actions. Because Dono is a sole trader there is no separate governing body; Amrit is accountable as the operator. **Sashank** is the operational backup and appeal reviewer, and **Joe** is the second backup. Any founder may impose an emergency temporary restriction.

Because Dono is provisionally multi-risk, it should also maintain: a written statement of moderation responsibilities; internal illegal-content policies; prioritisation rules; moderator guidance and training; performance targets; sufficient moderation cover during operating periods; and monitoring for new or increasing forms of harm.

### 8.2 Preventive campaign controls

Before publication, every campaign should be checked for: campaign-owner identity as verified by Stripe Identity; student or society status as checked by Dono against a student card and university email; **that the Beneficiary is the Campaign Owner** (Dono does not permit third-party beneficiaries, so a campaign presenting one is rejected on its face); an itemised and plausible use of funds; supporting documents and links; false claims of affiliation or endorsement; prohibited financial promotions or investment propositions; sanctions, terrorism or proscribed-organisation concerns; fundraising for illegal goods, services or conduct; signs of impersonation, fabricated evidence or stolen images; unnecessary sensitive personal information; and content falling within Dono's prohibited-content policy.

The moderator should record the outcome as approve, request evidence, reject, or escalate. This is consistent with the confirmed manual-review process.

### 8.3 Product restrictions

At launch, Dono should:

- **Comment attachments are resolved: links, attachments and images are prohibited in comments.** If links are ever permitted, they must be rate-limited for new accounts and subject to moderation, and this assessment must be reviewed first. **[ENGINEERING — confirm this is technically enforced, not merely a policy rule.]**
- **The age-access question is resolved** (section 2A). Dono operates child-safe by default, with a separate Children's Risk Assessment.
- prohibit private messaging;
- require an account before posting a comment;
- prevent users from editing a campaign's stated purpose or Ownership Statement after approval without re-review;
- require re-review after a material change to the campaign purpose;
- rate-limit comments;
- retain internal traceability even where a donor appears anonymous publicly;
- provide tools to disable comments on a campaign;
- allow Dono to freeze publication or fundraising while a serious report is investigated; and
- avoid displaying precise home addresses, live locations or unnecessary personal documents publicly.

### 8.4 Reporting

A clearly visible Report control must appear on **every campaign page, every campaign image and uploaded document, every comment, and every username**. For a document, the control appears beside the document on the campaign page rather than inside a document viewer.

A separate **publicly accessible reporting form at `/report`, requiring no login**, must be available to people who do not hold a Dono account, since the Act's reporting and complaints routes extend to "affected persons" who may not be registered users. It must let the reporter give the content link, the type of content, why they are concerned, whether they are personally affected, an optional email address for updates, and any explanation they consider relevant. An email address may remain as a backup, but a structured form is materially easier to track and audit.

The report categories are set out in clause 7.3 of the Community Guidelines. Reporters must not be required to decide whether a criminal offence has legally occurred, and the categories must include content that may be **harmful to children**, not only content the reporter believes is criminal. For suspected CSEA content, the form must tell reporters **not to download, copy or attach the material** and to give the URL or campaign identifier instead.

**Neither the on-platform report control nor the public reporting form has been built. Both are blocking actions (section 11).**

### 8.5 Moderation and removal

A report of suspected illegal content must create a moderation case. The moderator should: preserve relevant identifiers, timestamps and audit information; assess whether immediate restriction is necessary; review the content against Dono's Terms and an illegal-content decision guide; remove or restrict content swiftly where illegal or prohibited; consider whether the account or campaign should be suspended; consider whether connected content or accounts require review; notify the affected user where lawful and safe; record the reasoning and action; and escalate to law enforcement or an appropriate specialist body where legally required or necessary to protect life.

Suspected CSAM must be handled under a specialist procedure. Staff should not unnecessarily download, copy or circulate the material.

Internal triage targets:

- **Immediate:** imminent threat to life, suspected CSAM, terrorism or active exploitation.
- **Within 24 hours:** credible threats, intimate-image abuse, fraud involving active fundraising, hate offences and serious harassment.
- **Within three working days:** other content reports.

These should be internal operational targets rather than unconditional public contractual guarantees.

### 8.6 Appeals and complaints

The single complaints and appeals framework is **clause 8 of the Community Guidelines**, and this assessment does not describe it differently. It covers: removal of a person's content; rejection or suspension of a campaign; restriction or termination of an account; a reporter's complaint that Dono failed to remove content or mishandled their report; a complaint from anyone, including a non-user, that Dono is not complying with its illegal-content, child-safety, reporting, complaints or freedom-of-expression duties; and children's-safety complaints. Acknowledgement within 5 Working Days; outcome targeted within 30 days; urgent matters handled immediately. **A person not substantially involved in the original decision determines the appeal** — ordinarily Sashank where Amrit decided. Where team size genuinely prevents separation, the original decision-maker may reconsider, but only as a documented, genuine second look. Content, campaign functionality or account access is restored where a decision is reversed, and the reason recorded.

### 8.7 Terms of service

Dono's Terms should clearly explain: that terrorism, CSEA and all other illegal content are prohibited; how Dono minimises the time illegal content remains available; that Dono will act swiftly once aware of suspected illegal content; the reporting and complaints procedure; potential moderation actions; the right to appeal; when information may be preserved or disclosed lawfully; and any automated moderation technology used. These provisions must be easy to find, clear and accessible.

## 9. Monitoring

Dono will record and review: number of reports by harm category; number and proportion of reports upheld; time from report to first review; time from awareness to restriction or removal; campaign rejections by reason; fraud losses, refunds and chargebacks; repeat offenders and linked accounts; appeals and overturned decisions; complaints concerning moderator error; law-enforcement or regulator notices; user reports involving children or vulnerable adults; and any evidence of coordinated misuse.

An initial effectiveness review should take place after the first three months of public operation, followed by a further review at six months.

## 10. Record keeping and review

The assessment and supporting records will be dated, version-controlled, kept in an accessible electronic format and written clearly enough for Ofcom to understand. Earlier versions will be retained for at least three years, or longer where Dono's general retention policy or a legal requirement requires it.

The assessment will be reviewed: at least annually; before any significant service change; after a serious illegal-content incident; if Dono introduces private messaging, image comments, livestreaming, user groups, recommendations or anonymous posting; if the age-access position changes; after a material increase in users or geographic scope; following a significant Ofcom Risk Profile change; or where reports, chargebacks or moderation data suggest a risk has increased.

## 11. Actions required before approval

| Action | Owner | Deadline | Status |
|---|---|---|---|
| Age-access position resolved (section 2A); Children's Access Assessment and Children's Risk Assessment completed | Amrit | Done | **Closed** |
| Comment links and attachments prohibited (decision made) — **confirm technically enforced** | Engineering | Before launch | Open |
| Implement report control on every campaign, campaign image, uploaded document, comment and username | Engineering | Before launch | **Open — BLOCKING** |
| Build the public `/report` form for people without an account | Engineering | Before launch | **Open — BLOCKING** |
| Create moderation decision guide covering all 18 priority harms, permitting either conclusion (reasonable grounds to consider content illegal, **or** breach of Dono's own Terms) | Amrit | Before launch | Open |
| Urgent CSEA, terrorism and imminent-harm procedure | Amrit | Before launch | **Drafted** — Online Safety Act Procedures 3.4. Registration and tested portal access still outstanding |
| Finalise campaign pre-publication review checklist (section 8.2) | Amrit | Before launch | Open |
| Confirm Stripe's sanctions and AML screening for overseas donors; complete Dono's own sanctions and financial-crime risk assessment | Amrit | Before launch | Open |
| ~~Complete company incorporation~~ — **not applicable.** The provider is Amrit Kaur Rooprai, a sole trader; there is no plan to incorporate | Amrit | — | **Closed** |
| Create moderation and appeals log, and the monthly metrics record in section 9 | Engineering / Amrit | Before launch | **Open — BLOCKING** |
| Add illegal-content and complaint provisions to the Terms | Amrit | Before launch | **Done** — Terms of Service 18.2, Community Guidelines 3, 7 and 8 |
| Reassess provisional Medium ratings after three months' evidence | Amrit | Three months after launch | Open |
| Complete the pre-launch acceptance test in the Online Safety Act Procedures | Amrit | Before launch | **Open — BLOCKING** |

## Approval statement

I confirm that this assessment accurately describes Dono's service as it operates on the assessment date, that the stated existing controls have been implemented, and that the identified actions have been assigned to responsible persons.

Name: ____________________
Role: ____________________
Date: ____________________
Signature/approval record: ____________________
