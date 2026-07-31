# Dono Illegal-Content Risk Assessment

> **Draft status.** This is a working draft prepared from your answers and is not legal advice. Before it is board-approved or signed, it should be reviewed by a solicitor with UK Online Safety Act experience — particularly the age-access point flagged in Section 2A, which is the single biggest change from the previous draft.

## Document control

| Field | Entry |
|---|---|
| Service provider | Dono (UK Ltd — incorporation not yet started; insert full legal entity name and company number once incorporated) |
| Service assessed | Dono crowdfunding platform |
| Service type | User-to-user service |
| Assessment version | 0.2 — pre-launch draft |
| Assessment date | 30 July 2026 |
| Responsible person | Amrit, co-founder — accountable for Online Safety Act compliance |
| Approved by | [Founder/director or governing body — pending incorporation] |
| Next scheduled review | No later than 30 July 2027 |
| Earlier review triggers | Significant product change; serious incident; material change in user behaviour; new Ofcom Risk Profile; introduction of messaging, under-18 account restrictions, automated recommendations or new upload types; resolution of the open comment-attachment decision below |

## 1. Purpose and scope

This assessment considers the risk of harm arising from illegal content being encountered through Dono, and the risk of Dono being used to commit or facilitate priority offences.

Dono enables users to publish:

- campaign text, images, documents and hyperlinks;
- public comments and replies; and
- profiles, usernames and photographs.

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

- Dono is initially a small UK-focused crowdfunding service for students and recognised student organisations.
- **Campaign creators** must create an account, complete identity verification through Stripe, and confirm student or organisational status before receiving funds.
- **Every campaign is manually reviewed by a human before publication** — this is confirmed, not provisional.
- Beneficiaries are UK-based only. Donors may be based in the UK or overseas.
- Dono does not provide private messaging, encrypted messaging, livestreaming, group chats or disappearing content.
- Campaign owners may upload images and supporting documents. Profile users may upload one profile photograph.
- Public anonymity does not mean anonymity from Dono: Dono retains verified account information where required.
- Campaigns, profiles and comments will have a visible reporting function, and non-account-holders will be able to report through an accessible web form (both still to be built — see Section 11).
- Fund flow: Dono generally holds donor funds and pays out to the recipient, with a fallback to direct transfer if holding becomes too slow or costly.

### 2A. Age access — the material open question

**Only campaign creators are age- and identity-verified (18+, via Stripe). Anyone of any age can otherwise access the platform** — meaning, on the current design, a person under 18 could hold an account, view campaigns, donate, comment publicly and hold a profile with a photograph.

This is a materially different risk position from a fully adult-gated service, and it changes several ratings below (principally CSEA grooming, harassment, and intimate-image abuse). It is the most consequential item for you to resolve before launch, because Ofcom's Protection of Children Codes and the Children's Access Assessment obligations turn on whether the service is likely to be accessed by children, not on whether children are the intended audience. A student-fundraising platform aimed at 18+ users is still, on this design, foreseeably accessible to under-18s (younger siblings, prospective students, school-age fundraising beneficiaries' friends, etc.).

You have three realistic options, each with different regulatory consequences:

1. **Restrict all accounts to 18+**, with proportionate age assurance (not just self-declaration) — this is the option that best supports the Low ratings elsewhere in this document.
2. **Permit general access but restrict specific higher-risk functions** (e.g. commenting, profile photos, donating) to verified adults, while allowing unauthenticated browsing of campaigns by anyone.
3. **Knowingly permit all-ages general access**, in which case Dono needs a documented, proportionate Children's Access Assessment and age-appropriate design considerations before launch, and several ratings below should be read as Medium rather than Low until that assessment exists.

Nothing below assumes you have chosen one of these — the ratings are given on the basis that this question is still open, and are flagged where the answer changes them.

## 3. Evidence considered

- Dono's intended user base and operating model;
- the confirmed campaign, comment and profile functionality;
- Stripe-based identity verification for campaign creators only;
- confirmed manual review of every campaign before publication;
- the absence of private messaging and livestreaming;
- Dono's fund-holding and pay-out model;
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
| 2A. CSEA — grooming | Public profiles and comments could be used to identify or approach younger users. No private messaging removes the main concealment route, but the open general-access position (Section 2A) means minors could plausibly hold accounts, comment and hold a photographed profile. | **Medium, pending resolution of Section 2A.** Falls to Low only if accounts are restricted to verified 18+ users generally, not just campaign creators. |
| 2B. CSEA — image-based CSAM | Campaign and profile image uploads make the risk technically possible. Manual review of every campaign and single-purpose profile-image upload reduce likelihood. | **Low.** |
| 2C. CSEA — CSAM URLs | Campaign text, documents, hyperlinks and comments could direct users to illegal material. Registered posting and manual campaign review reduce this; the open decision on comment links (Section 8.3) affects the comment route specifically. | **Low, provided comment links (if permitted) are moderated.** |
| 2. Overall CSEA rating | Driven principally by the grooming sub-risk. | **Medium, pending Section 2A.** |
| 3. Hate offences | Campaign descriptions, profiles and comments may contain threatening or inflammatory material directed at protected groups; the student-community context may make individuals or societies readily identifiable. | **Medium** at launch — review after six months of operational evidence. |
| 4. Harassment, stalking, threats and abuse | Public comments may target campaign owners, donors or identifiable students. Profiles and photographs assist identification. No private messaging or location sharing reduces risk, but open general access (Section 2A) means targets or perpetrators could include minors. | **Medium.** |
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
- **CSEA (grooming-driven)** is rated Medium, and this rating — along with the harassment and intimate-image ratings — depends directly on how the open age-access question (Section 2A) is resolved.

No category is currently assessed as High. That conclusion depends on the controls in Section 8 being fully implemented before public launch, and specifically on Section 2A being resolved in a way that restricts general account access to verified adults, or on a documented Children's Access Assessment being completed if it is not.

## 8. Required controls

### 8.1 Governance

Amrit is the named individual accountable for Online Safety Act compliance and will report to the company's most senior governing body once incorporated, and will be able to explain moderation decisions, risk controls, residual risks and outstanding actions.

Because Dono is provisionally multi-risk, it should also maintain: a written statement of moderation responsibilities; internal illegal-content policies; prioritisation rules; moderator guidance and training; performance targets; sufficient moderation cover during operating periods; and monitoring for new or increasing forms of harm.

### 8.2 Preventive campaign controls

Before publication, every campaign should be checked for: verified campaign-owner identity; verified student, society or institutional status; a clear and lawful beneficiary; an itemised and plausible use of funds; supporting documents and links; false claims of affiliation or endorsement; prohibited financial promotions or investment propositions; sanctions, terrorism or proscribed-organisation concerns; fundraising for illegal goods, services or conduct; signs of impersonation, fabricated evidence or stolen images; unnecessary sensitive personal information; and content falling within Dono's prohibited-content policy.

The moderator should record the outcome as approve, request evidence, reject, or escalate. This is consistent with the confirmed manual-review process.

### 8.3 Product restrictions

At launch, Dono should:

- **Resolve the comment-attachment question.** Until a decision is made, the safer default is to prohibit links and attachments in comments entirely; if links are later permitted, they should be rate-limited for new or unverified accounts and subject to moderation.
- **Resolve the general age-access question (Section 2A)** — this is the single highest-priority open item.
- prohibit private messaging;
- prohibit images in comments;
- require an account before posting a comment or profile;
- prevent users from editing a campaign's beneficiary after approval without re-review;
- require re-review after a material change to the campaign purpose;
- rate-limit comments and repeated replies;
- retain internal traceability even where a donor appears anonymous publicly;
- provide tools to disable comments on a campaign;
- allow Dono to freeze publication or fundraising while a serious report is investigated; and
- avoid displaying precise home addresses, live locations or unnecessary personal documents publicly.

### 8.4 Reporting

A clearly visible Report control should appear on every campaign, comment or reply, and profile. A separate reporting form must be available to people who do not have a Dono account, allowing the reporter to select the relevant content, state the suspected harm, provide supporting information, identify an immediate danger or safeguarding concern, and provide contact details voluntarily. Neither the on-platform report control nor the non-user reporting form has been built yet — both remain open actions (Section 11).

### 8.5 Moderation and removal

A report of suspected illegal content must create a moderation case. The moderator should: preserve relevant identifiers, timestamps and audit information; assess whether immediate restriction is necessary; review the content against Dono's Terms and an illegal-content decision guide; remove or restrict content swiftly where illegal or prohibited; consider whether the account or campaign should be suspended; consider whether connected content or accounts require review; notify the affected user where lawful and safe; record the reasoning and action; and escalate to law enforcement or an appropriate specialist body where legally required or necessary to protect life.

Suspected CSAM must be handled under a specialist procedure. Staff should not unnecessarily download, copy or circulate the material.

Internal triage targets:

- **Immediate:** imminent threat to life, suspected CSAM, terrorism or active exploitation.
- **Within 24 hours:** credible threats, intimate-image abuse, fraud involving active fundraising, hate offences and serious harassment.
- **Within three working days:** other content reports.

These should be internal operational targets rather than unconditional public contractual guarantees.

### 8.6 Appeals and complaints

Users must be able to challenge: removal of their content; rejection or suspension of a campaign; restriction or termination of an account; failure to remove content they reported; and alleged interference with privacy or freedom of expression. A person who did not make the original decision should determine the appeal where practicable. Dono should restore content or account access where a decision is reversed and record the reason.

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
| **Resolve general age-access position (Section 2A)** — restrict to verified adults, tier access by function, or complete a Children's Access Assessment | Amrit | Before launch | Open |
| **Decide whether comments may contain links or attachments** | [TBC] | Before launch | Open |
| Implement reporting control on campaigns, comments and profiles | [TBC] | Before launch | Open |
| Build external reporting route for non-users | [TBC] | Before launch | Open |
| Create moderation decision guide covering all 18 harms | Amrit | Before launch | Open |
| Create urgent CSAM, terrorism and imminent-harm procedure | Amrit | Before launch | Open |
| Finalise campaign pre-publication review checklist (Section 8.2) | [TBC] | Before launch | Open |
| Confirm Stripe's sanctions/AML screening for overseas donors, and whether a separate financial-crime assessment is needed | [TBC] | Before launch | Open |
| Complete company incorporation and insert legal entity name/number into this document | Founders | Before launch | Open |
| Create moderation and appeals log | [TBC] | Before launch | Open |
| Add illegal-content and complaint provisions to the Terms | [TBC] | Before launch | Open |
| Reassess provisional Medium ratings after three months' evidence | Amrit | Three months after launch | Open |

## Approval statement

I confirm that this assessment accurately describes Dono's service as it operates on the assessment date, that the stated existing controls have been implemented, and that the identified actions have been assigned to responsible persons.

Name: ____________________
Role: ____________________
Date: ____________________
Signature/approval record: ____________________
