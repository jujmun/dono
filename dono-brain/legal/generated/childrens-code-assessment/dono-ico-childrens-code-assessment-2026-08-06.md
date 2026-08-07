# Dono — ICO Children’s Code (Age Appropriate Design Code) Assessment

**Standalone assessment**  
**Date:** 6 August 2026  
**Prepared for:** Dono beta launch  
**Prepared by:** Midpage Legal Research  
**Status:** Legal and product compliance working paper; obtain UK solicitor sign-off before public launch

## Executive conclusion

Dono should proceed on the basis that the Children’s Code applies. Dono is an information society service, its public campaign pages are available without authentication, and its own operating position is that people under 18 may browse and donate. The fact that Dono does not target children and restricts accounts to adults does not remove it from scope when children are nevertheless likely to use the service.

The Code is a statutory code of practice, not a separate set of criminal or civil offences. Its 15 standards explain how the ICO expects the UK GDPR and PECR to apply to services likely to be accessed by children. Failure to conform is not automatically a standalone breach, but it makes it materially harder to demonstrate fairness, transparency, accountability, data protection by design and lawful processing. Since June 2026, the Data (Use and Access) Act 2025 amendments are fully in force and expressly require in-scope information society services to take children’s higher-protection matters into account when designing processing.

Dono’s beta risk is lower than that of a typical social or content platform. It has no direct messages, recommender feed, behavioural advertising, livestreaming, precise geolocation, private groups or disappearing content; campaigns are reviewed before publication; comments cannot contain links or attachments; and donors can use the service without an account. The principal Children’s Code risks are narrower:

1. a child can donate without verified age or verified parental permission;
2. individual donation amounts and timing may be displayed publicly, creating avoidable re-identification and peer-pressure risk;
3. analytics consent can be given by a visitor whose age is unknown, including a child under 13 who cannot independently provide UK GDPR consent for an information society service;
4. Dono’s current long-form Privacy Notice is not sufficient on its own for a child donor; and
5. the product and published documents contain launch-critical controls that are planned but not yet implemented.

For beta, the most practical and proportionate approach is to apply high-privacy defaults to everyone, rather than introduce general age verification. This is expressly contemplated by the Code and avoids collecting additional identity data merely to distinguish children from adults. Dono should combine that universal baseline with a narrow checkout declaration, low financial limits for under-18 donations, no recurring donations by under-18s, no optional analytics or institutional sharing for under-18s, and a prompt refund route for donations made without parental permission. General documentary or biometric age assurance is not proportionate to Dono’s present processing risks. It should be reconsidered if Dono introduces higher-risk features, sees material child use, or cannot keep under-18 donations within the beta safeguards.

The current under-18 donor approach is therefore not yet sufficient as a complete launch package. The declaration and refund remedy are useful, but should be supplemented by the targeted controls in this assessment. Verified parental consent is legally required for consent-based processing offered directly to a child under 13, but it is not automatically required for every donation or every item of processing. Dono can avoid the need to build a parental-consent verification system during beta by not offering consent-based optional processing to under-18 users and by relying only on an appropriate non-consent lawful basis for strictly necessary donation processing.

## 1. Scope, legal status and assumptions

### 1.1 Why the Code applies

Section 123 of the Data Protection Act 2018 required the ICO to issue an age-appropriate design code for online services likely to be accessed by children. The ICO treats a child as anyone under 18 and says “likely” means more probable than not, assessed by the nature and appeal of the service and the effectiveness of access restrictions. Dono’s public pages are open, campaign links are shareable, and donating is expressly open to any age. Those facts support treating under-18 access as likely rather than merely possible.

Dono is also an information society service: it is provided electronically, at a distance, at the user’s request, and as part of a remunerated platform business. It is not merely an informational website and does not fall within the preventive or counselling service exception.

**Assessment:** in scope for browsing and donation journeys. The adult-only account rule narrows the child user journey but does not take the whole service outside the Code.

### 1.2 Legal requirements, ICO guidance and conservative best practice

This assessment uses three labels throughout:

- **Legal requirement** means a duty arising from the UK GDPR, Data Protection Act 2018, PECR or other binding law. Examples include the data protection principles; Articles 12–14 transparency duties; Article 25 data protection by design and default, including the new children’s higher-protection duty; Article 35 DPIA requirements where processing is likely to be high risk; and Article 8 parental-authorisation rules when consent is relied on for an information society service offered directly to a child under 13.
- **ICO Code / guidance** means the 15 standards and related ICO interpretation. The Code does not create a separate offence, but the ICO must take it into account and uses conformance as a key measure of compliance with underlying law. A court may also take a statutory code into account where relevant.
- **Conservative best practice** means a control that is not clearly mandatory on Dono’s current facts but reduces regulatory, consumer, safeguarding or reputational risk at modest cost.

The ICO notes that parts of its existing Children’s Code guidance are under review following the Data (Use and Access) Act 2025. This assessment uses the Code as currently published and separately accounts for the new statutory duty. It should be revisited when revised ICO guidance is issued.

### 1.3 Product assumptions

This assessment assumes the beta described in Dono’s v2.2 materials:

- campaigns are public and browsable without an account;
- campaign owners and commenters require an account declared to be 18+;
- campaign owners additionally undergo university-email, student-card and Stripe checks;
- guest donations are permitted and anyone may donate;
- checkout is intended to ask whether the donor is 18+ or has a parent or guardian’s permission;
- campaigns are pre-moderated; comments are post-moderated and cannot contain links or attachments;
- there is no direct messaging, personalised recommender feed, behavioural advertising, precise geolocation, livestreaming, private groups or disappearing content;
- PostHog analytics is intended to run only after consent, may identify signed-in users, and may collect device/browser and approximate-location data unless project settings are restricted;
- institutional donor-data sharing is not live and, if introduced, is intended to be a separate opt-in; and
- individual donation information may currently be shown on public campaign pages even where a donor hides their name.

If any assumption is wrong, the assessment should be updated before approval.

## 2. Assessment of the 15 standards

### Standard 1 — Best interests of the child

**ICO standard.** The best interests of the child should be a primary consideration when designing and developing an online service likely to be accessed by children.

**Application to Dono.** The relevant child interests are privacy, protection from economic exploitation and unfair pressure, freedom to support community causes, access to understandable information, and an effective remedy if a payment was not authorised. Dono’s absence of private messaging and algorithmic promotion, its campaign review, and its refund ground for unauthorised child donations support those interests. Public display of granular donation activity, persuasive donation prompts, recurring gifts by children and unnecessary analytics cut the other way.

**Required action.** Record a short best-interests decision for each beta feature that uses donor data or changes checkout. Include the child benefit, privacy impact, commercial interest, less intrusive alternatives and decision owner. Do not treat donation conversion as outweighing a child’s privacy or financial welfare.

**Classification.** Considering children in design is now a **legal requirement** under Article 25 as amended; treating best interests as the primary design consideration and documenting the balancing method is the **ICO Code approach**. Child user-testing of checkout is **conservative best practice** for this small beta.

### Standard 2 — Data protection impact assessments

**ICO standard.** Undertake a DPIA that assesses and mitigates risks to children arising from the processing and explains conformance with each Code standard.

**Application to Dono.** Dono has a general DPIA and an Online Safety Act children’s risk assessment, but neither substitutes for a Children’s Code assessment. This document supplies the missing standalone Code analysis. The general DPIA should cross-reference this document but remain separate.

**Required action.** Before launch, approve this assessment, enter its controls into the engineering/compliance tracker, and amend the general DPIA only where this assessment changes the description, lawful basis or residual risk of processing. Reassess on the triggers in section 8.

**Classification.** A DPIA is a **legal requirement** where processing is likely to result in high risk. The ICO’s position that an in-scope child-accessed online service should complete one, and that it should address all 15 standards, is **ICO guidance**. Publishing the full DPIA is **best practice**, not required; Dono may publish a concise summary instead.

### Standard 3 — Age-appropriate application

**ICO standard.** Establish age with certainty proportionate to the data risk, or apply the Code’s protections to all users.

**Application to Dono.** Dono’s self-declared date of birth is a weak age signal. It is adequate only as a friction measure for an otherwise low-risk adult account, not as proof that commenters are adults. Stripe Identity is not a reliable Dono age gate on the current facts. Because most beta protections can be applied universally without impairing the service, an all-user high-privacy baseline is more proportionate than collecting documents or biometric age estimates from donors and visitors.

**Required action.** Adopt the universal baseline in section 4. Keep account creation at 18+ with neutral date-of-birth entry, prevent immediate re-entry after a failed age attempt, and do not describe the control as verified age assurance. Treat campaign-creator student and Stripe checks as eligibility/identity controls, not proof of age unless Stripe returns a verified age attribute and Dono formally adopts it for that purpose.

**Classification.** The underlying fairness, accountability and Article 25 obligations are **legal requirements**. The choice between proportionate age assurance and applying the standards to all users is **ICO guidance**. General identity-document or biometric age verification for beta donors is not legally required on the current risk profile and would be disproportionate.

### Standard 4 — Transparency

**ICO standard.** Privacy information, terms and policies must be concise, prominent and in language suited to the child; bite-sized explanations should appear when a use of data is activated.

**Application to Dono.** The v2.2 Privacy Notice is comprehensive but written for adults and contains dense legal and operational detail. Clause 14.2 acknowledges children, but a child donor is unlikely to understand from that clause what is collected, what becomes public, what Stripe and the recipient see, whether analytics runs, and how to get help. The Donor Terms are also too long to serve as checkout notice.

**Required action.** Publish a short child-friendly privacy summary aimed primarily at 13–17-year-old donors, with a parent/carer section and a route to the full notice. Add just-in-time explanations at: analytics choice; donation identity/display choice; age/permission confirmation; recurring donation (adults only); and any future institutional sharing. The checkout notice should explain in plain language that Dono and the payment provider will process the donation, the recipient may see payment details, public display is optional, and a parent can request a refund if permission was not given.

**Classification.** Clear, intelligible privacy information is a **legal requirement** under Articles 12–14. A separate child-friendly layer and just-in-time notices are the **ICO Code’s expected method**. Cartoons, video or gamification are optional **best practice** and unnecessary for Dono’s predominantly teen audience.

### Standard 5 — Detrimental use of data

**ICO standard.** Do not use children’s data in ways shown to be detrimental to wellbeing or contrary to relevant codes, regulation or government advice.

**Application to Dono.** Dono does not currently use child data to recommend harmful content or advertise. Risk could arise if donation history, social proof, countdowns, matching windows or inactivity notifications are personalised to pressure repeat giving. Publicly visible donor amounts may also create comparison and peer-pressure effects.

**Required action.** Do not personalise donation prompts using a child’s history; do not send donation-conversion or inactivity notifications to under-18s; do not rank or recommend campaigns using an individual child’s behaviour; and do not use “friends donated”, scarcity, streaks or guilt-based copy for under-18 journeys. Apply these restrictions to all unknown-age visitors during beta.

**Classification.** Fairness and the prohibition on detrimental processing are rooted in **legal requirements**. The specific product restrictions are **ICO-guided controls**; avoiding guilt, streak and peer-pressure mechanics platform-wide is proportionate **best practice**.

### Standard 6 — Policies and community standards

**ICO standard.** Uphold published privacy, age, behaviour and content rules in practice.

**Application to Dono.** The written package contains strong commitments, but multiple controls are marked as unbuilt, including the checkout confirmation, automated retention, deletion logging and complete report controls. Publishing claims before implementation would create a direct fairness and accuracy problem. Comment post-moderation must also be described honestly and operated to the stated service levels.

**Required action.** Do not publish the v2.2 documents until each factual claim has an implementation owner and evidence. Launch only after the age/permission record, public-display defaults, retention promises and complaint/report routes work end to end. Maintain a monthly sample audit of checkout records, privacy choices, child-related refunds and moderation response times.

**Classification.** Processing fairly, transparently and for stated purposes is a **legal requirement**. “Say what you do and do what you say” is the **ICO Code formulation**. Monthly sampling is **best practice**.

### Standard 7 — Default settings

**ICO standard.** Settings must be high privacy by default unless a compelling reason supports another default in the child’s best interests.

**Application to Dono.** Consent-gated analytics and institutional sharing off by default are positive. The fee-cover option is also unticked. The material gap is public donation activity: hiding only a name while publishing an amount and exact timing can still identify a donor in a small university community. Public comment names are acceptable only because children are not permitted to comment and commentary is an intentionally public act; the weak age gate remains relevant.

**Required action.** Default every donation to no public name, no individual amount and no precise timestamp. Show campaign totals and aggregate donor counts. Offer an optional, unticked “show my support publicly” control with a plain explanation; if activated, permit the user to choose name and/or amount. Keep analytics, marketing, institutional sharing and future personalisation off by default. Preserve choices across updates.

**Classification.** Article 25(2) data protection by default is a **legal requirement**. “High privacy” and the compelling-reason test are **ICO Code guidance**. Suppressing granular public donation data for all users is a proportionate implementation of both, not merely gold-plating.

### Standard 8 — Data minimisation

**ICO standard.** Collect and retain only data needed for the service element the child knowingly uses, with separate choices for optional elements.

**Application to Dono.** A guest child donor needs to provide only the information necessary to process and evidence the donation, send a receipt and operate refunds/fraud controls. Account profile, university details and broad behavioural telemetry are not necessary. A full date of birth at checkout would create additional sensitive identity data without solving parental authority; a binary age/permission declaration is less intrusive.

**Required action.** For guest donations collect only name, email, payment-provider identifiers, amount, campaign, time, display choice, age/permission declaration and necessary fraud/security data. Do not collect full date of birth from guest donors. Disable approximate-location capture, autocapture and unapproved PostHog default properties. Enforce the retention schedule before making public promises.

**Classification.** Data minimisation, purpose limitation and storage limitation are **legal requirements**. Separate product choices and the service-element analysis are **ICO guidance**. Omitting full date of birth at donor checkout is proportionate **best practice**.

### Standard 9 — Data sharing

**ICO standard.** Do not disclose children’s data unless a compelling reason exists, taking account of the child’s best interests.

**Application to Dono.** Necessary payment sharing with Stripe, card networks and the connected-account recipient can be justified to complete a requested donation, provided it is transparent and limited. Public disclosure and institutional relationship-building are not necessary. The current plan to make institutional sharing a separate opt-in is insufficient for children under 13 unless parental authorisation is verified; for 13–17-year-olds it still creates an avoidable secondary use during beta.

**Required action.** Do not offer institutional sharing to any under-18 donor during beta. Because Dono cannot reliably identify every child, keep the feature disabled entirely until age handling and data-sharing agreements are mature. Contractually prohibit campaign owners from using payment details to identify, contact or pressure hidden donors and enforce the rule. Record recipient categories clearly in the child-friendly notice.

**Classification.** A lawful basis, transparency and processor/controller compliance for sharing are **legal requirements**. The compelling-reason standard is **ICO guidance**. A beta-wide pause on institutional sharing is conservative but proportionate **best practice**.

### Standard 10 — Geolocation

**ICO standard.** Switch geolocation off by default, show when tracking is active, and reset location-sharing options at session end.

**Application to Dono.** Dono has no user-facing geolocation feature. Approximate location may nevertheless be collected by PostHog or derived from IP addresses. Security logs may legitimately record IP data, but analytics does not need approximate location for beta.

**Required action.** Disable PostHog geographic enrichment and do not request device location permission. Limit IP-derived data to security/fraud purposes with restricted access and short retention. If a future local-campaign feature uses location, complete a new assessment before enabling it.

**Classification.** Lawfulness, minimisation and Article 25 controls are **legal requirements**. Off-by-default and active indicators are **ICO guidance**. A complete beta prohibition on product geolocation is proportionate **best practice**.

### Standard 11 — Parental controls

**ICO standard.** If parental controls are provided, explain them to the child and visibly indicate monitoring or tracking.

**Application to Dono.** Dono does not provide parental monitoring or a parent dashboard. A checkout permission declaration and a parent refund route are not monitoring tools. Building a parental dashboard would add data, create authentication complexity and risk undermining older teenagers’ privacy.

**Required action.** No parental-control feature is required for beta. Provide a clearly labelled parent/carer help route and explain that Dono does not give parents routine access to a child’s donation history; requests are handled with regard to the child’s competence, rights and best interests. Do not promise deletion or disclosure automatically to any adult claiming to be a parent without appropriate verification.

**Classification.** There is no general **legal requirement** to build parental controls. Transparency and fair handling of rights requests are legal duties; the specific notice/indicator obligations apply under **ICO guidance** only if controls are offered. Avoiding a parent dashboard is the proportionate choice.

### Standard 12 — Profiling

**ICO standard.** Profiling should be off by default unless a compelling reason exists, and safeguards must prevent harmful effects.

**Application to Dono.** Dono says it does not infer characteristics, run recommender systems or make significant automated decisions. PostHog event histories linked to signed-in users can still constitute behavioural profiling if used to analyse or predict preferences or behaviour. Touch autocapture and donation-funnel histories are unnecessary for a child-accessed beta if they create individual profiles.

**Required action.** For beta, do not identify users in PostHog, do not build individual donor profiles, do not use session replay or touch autocapture, and do not personalise campaigns or appeals. Prefer aggregate, privacy-preserving measurement. If Dono retains consent-based analytics, exclude all declared under-18s and do not invite unknown-age visitors to opt into individual-level analytics without resolving under-13 consent.

**Classification.** Lawful, fair and transparent profiling and the current automated-decision safeguards are **legal requirements**. Off-by-default and harm controls are **ICO guidance**. Suspending individual-level analytics for beta is **best practice** and the simplest way to avoid parental-consent and profiling complexity.

### Standard 13 — Nudge techniques

**ICO standard.** Do not nudge children to provide unnecessary data or weaken privacy protections.

**Application to Dono.** Risk points include cookie banners, “show my name” controls, fee cover, institutional sharing, recurring donations, donation amounts and age declarations. A preselected public-sharing option, more prominent “accept analytics” button, suggested high amounts, guilt copy or an age screen revealing the permitted answer would be problematic.

**Required action.** Give privacy choices equal visual weight; make reject as easy as accept; leave optional sharing and fee cover unticked; use neutral amount suggestions; do not preselect recurring giving; phrase age entry neutrally; and do not permit immediate retry with a different date after an under-18 account attempt. Test the mobile and web flows for dark patterns before launch.

**Classification.** Fairness and valid consent are **legal requirements**. The anti-nudge standard is **ICO guidance**. Equal visual weight and a documented dark-pattern review are proportionate **best practice**.

### Standard 14 — Connected toys and devices

**ICO standard.** Connected toys and devices must include effective tools to enable Code conformance.

**Application to Dono.** Not applicable. Dono is a web/mobile service and does not supply connected physical products, sensors, microphones or wearable devices.

**Required action.** None for beta. Reassess if Dono later integrates a physical giving terminal, campus kiosk, wearable or voice device that transmits personal data.

**Classification.** **Not applicable** on current facts.

### Standard 15 — Online tools

**ICO standard.** Provide prominent, accessible tools for children to exercise data rights and report concerns.

**Application to Dono.** Dono plans content reporting and data-protection complaint routes, but a child donor without an account needs a simple route that does not require legal vocabulary. The Privacy Notice’s email address alone is not the strongest implementation. The Data (Use and Access) Act complaint-handling requirements now reinforce the need for an accessible electronic complaint mechanism.

**Required action.** Provide a public “Privacy or donation help” form accessible without login, with options for: get a copy; correct details; delete where possible; object/restrict; report an unauthorised child donation; and raise another concern. Acknowledge data-protection complaints within the applicable statutory period and respond without undue delay. Explain that a child may contact Dono directly and may ask a trusted adult to help.

**Classification.** Data-subject rights, accessible communications and statutory complaint handling are **legal requirements**. A prominent in-product tool is the **ICO Code implementation**. Child-oriented labels and a combined privacy/refund route are proportionate **best practice**.

## 3. Required changes by surface

### 3.1 Privacy Notice

Before beta, the Privacy Notice should:

1. state prominently near the beginning that under-18s may browse and donate, while accounts and comments are 18+;
2. link to a child-friendly privacy summary and parent/carer information;
3. separate the lawful basis for adult donation processing from under-18 donation processing — do not rely uncritically on “contract” where the donor’s capacity is uncertain; document legitimate interests or another appropriate basis for strictly necessary child-donation administration;
4. explain that Article 8 parental authorisation applies where Dono relies on consent for optional processing offered directly to a child under 13;
5. state that institutional sharing and marketing are not offered to under-18s during beta;
6. describe the public-display default accurately: no name, individual amount or precise time unless the donor actively chooses otherwise;
7. state whether analytics is disabled for beta or describe the restricted, aggregate configuration accurately;
8. remove approximate-location and autocapture language if those features are disabled;
9. explain the parent/carer request route without implying that a parent automatically controls a competent child’s data rights; and
10. retain the warning that Stripe and the connected-account recipient may see payment information, expressed in child-friendly language at checkout.

### 3.2 Terms and Donor Terms

The terms should:

- retain the rule that accounts, comments and campaign creation are 18+;
- replace “anyone may donate, at any age” with a more careful statement: an under-18 may make a one-off donation only with parent/guardian permission, within Dono’s limits, using an authorised payment method;
- prohibit recurring donations by under-18s during beta;
- state the under-18 per-donation and rolling-period cap;
- retain the objective refund ground for a donation made without permission and the instruction not to interrogate the family;
- make clear that the declaration is not verified age assurance;
- state that optional public display is off by default; and
- avoid suggesting that parental permission makes every contract or payment issue legally conclusive.

### 3.3 Onboarding and checkout

For account creation, use neutral date-of-birth entry, an 18+ explanation, server-side enforcement and a retry control. Do not describe the process as age verification.

For guest checkout, use a short branching question:

> Are you 18 or over?  
> **Yes** / **No — I have permission from my parent or guardian**

If the second option is chosen, show a short explanation of the spending limit, the no-recurring-gift rule, what information is used, the refund route, and a prompt to ask the adult if unsure. Store the wording version, answer and time with the donation record. Do not collect the parent’s name, email, identity document or the child’s full date of birth for a low-value beta donation.

If neither statement is true, checkout must stop. The screen should not reveal a way to bypass an account age restriction.

### 3.4 Defaults and product design

The beta defaults should be:

- donor name private;
- individual donation amount and precise time private;
- optional public support off;
- analytics off or aggregate and non-identifying;
- marketing off;
- institutional sharing unavailable;
- fee cover off;
- recurring donation not preselected and unavailable to under-18s;
- no location permission or product geolocation;
- no personalised campaign ranking, appeals or notifications; and
- privacy and refund tools available without an account.

Campaign totals and aggregate donor counts may remain public because they serve the core transparency function without exposing a child’s individual activity.

## 4. Is an all-user high-privacy approach practical?

Yes. It is the recommended beta architecture.

The Code expressly allows a service to apply its standards to all users where it cannot or does not wish to establish age with sufficient certainty. Dono’s processing is low enough that the main protections — private donation defaults, no behavioural profiling, no optional data sharing, no geolocation and neutral choices — can be applied universally without undermining the product. The approach also reduces engineering complexity and avoids collecting additional age/identity data.

Universal high privacy does not eliminate every age issue. Dono still needs an adult-only gate for accounts and publishing roles, a permission declaration and limits for under-18 donations, and a solution for consent-based processing by under-13s. But it is more practical than trying to age-verify every public visitor and donor.

The decision should be revisited if Dono introduces direct messaging, targeted advertising, individual recommendations, public social graphs, precise location, high donation limits, child accounts, or evidence of significant use by younger children.

## 5. Is a child-friendly privacy notice required?

A child must receive privacy information that is concise, transparent, intelligible, easily accessible and written in clear language. That is a legal requirement. The law does not prescribe a document with the exact title “Child Privacy Notice,” and a separate standalone notice is not always mandatory.

For Dono, however, the current adult Privacy Notice cannot by itself meet the practical transparency need of a child donor. Dono should provide a separate short layer — “Privacy for young donors” — alongside the full notice. It can be one to two screens/pages, written for 13–17-year-olds, because that is the most plausible child donor group. It should include:

- what Dono needs to process a donation;
- what Stripe and the campaign recipient may see;
- what is private and what the donor may choose to show publicly;
- that optional analytics, marketing and institutional sharing are not used for under-18s in beta;
- how long core records are kept, in simple terms;
- how to ask for access, correction or deletion;
- how to report a donation made without permission; and
- how to contact Dono directly or with help from a trusted adult.

Just-in-time checkout explanations remain necessary; a separate notice is not a substitute for them. Multiple versions for every developmental stage, cartoons and video are not proportionate for beta unless evidence shows meaningful use by younger children.

## 6. Under-18 donations, parental permission and age assurance

### 6.1 Data protection position

Article 8 does not require parental consent for every processing operation involving a child. It applies where Dono relies on consent for processing connected with an information society service offered directly to a child under 13. Strictly necessary donation administration may instead rely on an appropriate non-consent lawful basis, assessed and documented for the actual purpose.

Accordingly:

- a verified parental-consent system is not automatically required merely because a child makes a donation;
- it would be required if Dono invites an under-13 child to consent to analytics, marketing, institutional sharing or another optional data use and relies on that consent;
- a self-declared “I have permission” checkbox is not verified parental authorisation for Article 8; and
- Dono should avoid that issue at beta by not offering consent-based optional processing to under-18s and by keeping unknown-age public journeys free from individual-level optional analytics.

### 6.2 Payment and consumer position

Parental permission is sensible but does not conclusively resolve a minor’s contractual capacity, authority to use a payment method, card-scheme rights or the rights of the person whose card was used. Dono should not promise that the checkbox makes the payment legally valid. The payment provider’s authentication and fraud controls remain relevant, and the parent/cardholder must retain external statutory and card-scheme remedies.

The planned objective refund ground is important, but it is remedial rather than preventive. A family should not be required to prove age through intrusive documents for a plausible low-value request. Dono should preserve records, reverse its own fee where appropriate, and support the recipient/payment-provider refund or chargeback process promptly.

### 6.3 Proportionate beta control

The legally defensible and proportionate beta position is:

1. under-18s may make one-off donations only with parent/guardian permission;
2. cap an under-18 donation at **£25 per transaction and £50 in any rolling 30-day period** during beta;
3. prohibit recurring donations and saved payment methods for under-18s;
4. store the declaration and version shown;
5. keep donation activity private by default;
6. do not use under-18 donation data for analytics, marketing, recommendations or institutional sharing;
7. provide immediate, plain-language parent/child support and refund routes;
8. monitor under-18 donation rates, amounts, refund requests and fraud indicators monthly; and
9. escalate to stronger age or parental assurance only if the data shows material use, circumvention, higher values or harm.

The £25/£50 limits are **conservative best practice**, not a statutory threshold. They should be approved as a beta risk limit and can be adjusted using evidence. If Dono does not want operational caps or cannot technically enforce them, the cleaner alternative is to restrict donations to 18+ until a more robust parental-authorisation flow exists.

General documentary or biometric age assurance for every donor is not currently necessary or proportionate. It would collect more sensitive data, create abandonment and introduce its own accuracy, bias, security and supplier risks. A stronger attribute-based check may become appropriate for unusually high donations or repeated attempts, but that is outside the recommended beta scope.

## 7. Beta launch control set

### Launch-critical — must be complete

1. Approve this standalone assessment and record an owner for every control.
2. Implement and log the checkout age/permission declaration.
3. Enforce under-18 one-off and rolling donation limits; block recurring gifts.
4. Make donor name, individual amount and precise time private by default.
5. Disable institutional sharing, marketing and personalised recommendations for beta.
6. Disable PostHog identity linking, session replay, touch autocapture and geographic enrichment; preferably pause non-essential analytics entirely.
7. Publish the child-friendly privacy layer and just-in-time checkout notices.
8. Provide logged-out privacy, complaint and unauthorised-donation forms.
9. Ensure policy claims match working controls, especially retention/deletion, reporting and refund routes.
10. Test account age enforcement, privacy defaults, analytics blocking, payment caps and the parent refund journey on web, iOS and Android.

### Shortly after launch

- Review metrics monthly for the first three months.
- Sample-check 10 child/unknown-age checkout records or all such records if fewer.
- Review whether campaign copy or donation UX creates pressure on young donors.
- Conduct a small usability test with older teenagers and a parent/carer representative, or document why this is disproportionate.
- Review the assessment at three months and again at six months.

### Not required for this beta

- identity-document or biometric age verification for all visitors/donors;
- a parental dashboard or ongoing monitoring;
- separate privacy notices for every ICO age band;
- a child account or child commenting feature;
- connected-device controls; or
- automated child-detection profiling.

## 8. Review triggers

Review this assessment before introducing any of the following:

- child accounts, child comments or campaign creation by under-18s;
- direct messaging, social graphs, private groups or livestreaming;
- behavioural advertising, individual recommendations or engagement-ranked feeds;
- individual-level analytics for unknown-age visitors;
- precise location or location-based discovery;
- institutional donor-data sharing;
- saved payment methods or recurring donations for under-18s;
- higher under-18 donation limits;
- a material increase in under-18 use or parental refund requests;
- a serious child-related incident or regulatory complaint;
- a new age-assurance provider or method; or
- revised ICO Children’s Code guidance following the Data (Use and Access) Act 2025.

## 9. Overall decision

**Scope:** The Code applies.  
**Current readiness:** Partially conformant; not ready to rely on the written package until launch-critical controls are implemented.  
**Age strategy:** Apply high-privacy defaults to all users; use targeted declarations and financial controls rather than general age verification.  
**Child-friendly notice:** Required in substance; a separate short layer is the most practical implementation.  
**Under-18 donor approach:** Declaration plus refund ground is not enough on its own. Add caps, no recurring gifts, private defaults, no optional data uses, monitoring and an accessible refund route. Verified parental consent is necessary only for consent-based processing of an under-13 child, which Dono should avoid offering during beta.  
**Residual risk after controls:** Low to medium and proportionate for a closed, closely monitored beta.

## 10. Principal sources

1. ICO, **Age appropriate design: a code of practice for online services** — https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/
2. ICO, **Services covered by this code** — https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/services-covered-by-this-code/
3. ICO, **Age appropriate application** — https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/3-age-appropriate-application/
4. ICO, **Transparency** — https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/4-transparency/
5. ICO, **Enforcement of this code** — https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/enforcement-of-this-code/
6. ICO, **Children and the UK GDPR**, updated 15 May 2026 — https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/children-and-the-uk-gdpr/
7. ICO, **Children’s Code Strategy progress update — December 2025** — https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/protecting-childrens-privacy-online-our-childrens-code-strategy/children-s-code-strategy-progress-update-december-2025/
8. Data Protection Act 2018, sections 9 and 123 — https://www.legislation.gov.uk/ukpga/2018/12/contents
9. Data (Use and Access) Act 2025, section 81 — https://www.legislation.gov.uk/ukpga/2025/18/contents
10. Department for Science, Innovation and Technology, **Data (Use and Access) Act factsheet: UK GDPR and DPA** — https://www.gov.uk/government/publications/data-use-and-access-act-2025-factsheets/data-use-and-access-act-factsheet-uk-gdpr-and-dpa

## 11. Internal Dono materials reviewed

- `terms_v2.2/dono-childrens-risk-assessment.md`
- `terms_v2.2/dono-dpia.md`
- `terms_v2.2/dono-ropa.md`
- `terms_v2.2/08_dono_privacy_notice_v2.2.md`
- `terms_v2.2/01_dono_terms_of_service_v2.2.md`
- `terms_v2.2/04_dono_donor_terms_v2.2.md`
- `terms_v2.2/05_dono_community_guidelines_v2.2.md`
- `engineering/developer-configuration-form.md`
- `engineering/cookie-configuration-review.md`
- `product/comprehensive-product-overview.md`

---

**Important:** This assessment is based on Dono’s documented beta design and the law and ICO material available on 6 August 2026. It does not replace final advice on contractual capacity, payment-services issues or the detailed implementation of the Online Safety Act regime.
