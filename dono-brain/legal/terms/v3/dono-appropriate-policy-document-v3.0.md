# Appropriate Policy Document — Special Category and Criminal Offence Data

**Controller:** Amrit Kaur Rooprai, trading as Dono
**Owner:** Amrit. **Deputy:** Sashank. **Second backup:** Joe.
**Version:** 3.0
**Version date:** 7 August 2026
**Effective from:** on publication approval (see approval block)
**Approved by:** _________________ **Date:** _________________
**Next review:** 31 January 2027, and whenever a product change could introduce a new source of special category or criminal-offence data.
**Status:** Internal record. This document is Dono's **Appropriate Policy Document** under Part 4 of Schedule 1 to the Data Protection Act 2018 ("DPA 2018"), required wherever Dono relies on a Schedule 1, Part 2 or Part 3 condition. **To be reviewed by a solicitor before reliance.**
**Supersedes:** v2.3 (6 August 2026) and all earlier versions, retained unaltered in the version archive at `../v2.3/`, `../v2.2/`, `../v2.1/`, `../v2/` and `../v1/`

---

## 1. Purpose and scope

1.1 This policy records, for every Dono activity that processes special category data (Article 9 UK GDPR) or criminal offence data (Article 10 UK GDPR): the precise processing activity; the Article 6 basis; the Article 9 or Article 10 condition; the Schedule 1 DPA 2018 condition where one is required; why that condition is necessary and proportionate; and why a less intrusive alternative would not do the job instead.

1.2 **Dono does not ask users to provide special category or criminal offence data, and does not design any feature to collect it.** Where it arises, it is because a user chose to disclose something about themselves, because another person made an allegation, or because Dono had to act on a safeguarding, fraud, online-safety or legal concern that happened to touch this kind of data.

1.3 **A condition is not a permission slip.** Finding an Article 9/10 condition and a Schedule 1 paragraph for an activity is necessary but not sufficient. Every activity below is also tested against necessity (is there a less intrusive way to achieve the purpose?) and proportionality (does the intrusion match the purpose?). Where an activity fails that test, section 9 says so and the recommendation is redesign or removal — not a strained condition.

## 2. The distinctions this document draws, and why they matter

Folding every source of sensitive data into one "moderation" or "reports" category was the structural problem with the previous version — it made paragraph 10 look like the only available condition, because a report and a safeguarding concern and a fraud allegation all looked like the same thing on paper. They are not the same thing, and they do not share a condition:

| Category | What it is | Whose data it is | Why it needs its own row |
|---|---|---|---|
| **Self-disclosed information** | A user's own campaign, comment or profile content that reveals something about themselves | The discloser's own data | The only category where Article 9(2)(e) can apply — because it is the data subject's own act of making it public |
| **Information alleged about another person** | A report, comment or complaint that says something about someone else | The person named, not the reporter | Article 9(2)(e) cannot apply. Needs a Schedule 1 condition matched to *why* the allegation is being processed |
| **Safeguarding reports** | A concern that a person — often but not only a child — may be at risk of harm | The person the concern is about | Has its own, purpose-built condition (Schedule 1 paragraph 18) that fits far better than paragraph 10 |
| **Fraud reports** | A concern that a campaign or user is dishonest about money | The person accused | Fits paragraph 11 (protecting the public against dishonesty) in the ordinary case; paragraph 10 only where a further Article 10 unlawful-act dimension is genuinely present |
| **Moderation decisions** | Dono's own record of what it decided about content and why | The moderated user | Genuinely a paragraph 10 case — Dono is recording why it judged something as suspected unlawful content |
| **User complaints** | "Dono got this wrong" — a complaint about service or a decision | The complainant, sometimes also the original subject | Usually **not** special category or criminal offence data at all. Only escalates to this policy if the complaint's content itself contains sensitive material |
| **Criminal or misconduct allegations (general)** | An allegation of a criminal offence or serious misconduct not otherwise covered above | The person accused | The category where Dono is most likely to be asked to process something it should refuse. Section 5 gives the refusal rule |

## 3. Article 6 basis, Article 9 condition and Schedule 1 condition, by activity

### 3.1 Self-disclosed information

| Activity | Art. 6 basis | Art. 9 condition | Sch. 1 condition | Necessity and proportionality | Why a less intrusive alternative isn't used |
|---|---|---|---|---|---|
| Special category data a user chooses to include in a **published** campaign page, campaign update or public comment | Contract (providing the hosting service the user asked for); legitimate interests (moderating and displaying it) | **Article 9(2)(e)** — manifestly made public by the data subject | **None required** — 9(2)(e) is self-executing under DPA 2018 s.10(2) | Dono cannot host a campaign without processing what its creator wrote in it. Fundraising campaigns routinely and legitimately explain a medical need, a bereavement, a disability, or a religious or community purpose — that explanation is the whole point of the page, not an incidental by-product | Redacting or pre-clearing every sensitive disclosure before publication would delay or defeat the legitimate purpose of medical and community fundraising, which depends on the creator being able to explain their situation in their own words. Guidance not to over-share, and the right to redact (3.3), are the proportionate control |
| The same data once it also appears in a **private draft**, before the user publishes | Contract | **Not available yet** — the data is not public until the user publishes it. Treated as ordinary campaign-drafting data under legitimate interests, minimised on the same terms as 3.2 below | — | The draft is processed only because the platform lets a user prepare a campaign before submitting it; Dono does not review drafts proactively | A user could be required to finalise a campaign in one step with no drafting stage, but that would increase error rates in what gets published, which cuts against safety, not for it |

### 3.2 Special category data that is not the discloser's own public statement

| Activity | Art. 6 basis | Art. 9 condition | Sch. 1 condition | Necessity and proportionality | Why a less intrusive alternative isn't used |
|---|---|---|---|---|---|
| Special category data that incidentally appears in an **uploaded receipt or piece of evidence** (for example, a prescription on a receipt, or a name suggesting protected characteristics) | Legitimate interests (verifying use of funds) | **Not 9(2)(e)** — this was not made public by anyone. Processed only where necessary for the purpose of verifying expenditure; where it is not necessary, it is redacted or removed rather than processed. Where the data becomes relevant to a dispute, **Article 9(2)(f)** — establishment, exercise or defence of legal claims | **None where 9(2)(f) applies** (self-executing). Otherwise, no condition is sought — the data is minimised out instead | Dono needs the expenditure detail on a receipt, not the sensitive detail that happens to sit next to it. The receipt is submitted privately and never shown to donors | Asking creators to submit redacted receipts as standard would be the more proportionate long-term control (see section 8); until that exists, Dono's own redaction at review is the mitigation, and unnecessary sensitive content is deleted rather than retained |
| Pre-publication human review of a campaign that may contain special category data, **before** the campaign is public | Legitimate interests (fraud prevention, safeguarding, protecting a mixed-age audience); legal obligation (Online Safety Act duties) | The reviewer is reading what the creator submitted **in order to publish it** — the same content that will shortly become 3.1 above if approved. This is treated as incidental to, and inseparable from, the creator's own act of preparing the disclosure for publication, and is therefore proportionate on the same footing as 3.1. Where the review instead surfaces a **safeguarding** concern going beyond ordinary review, see 3.3. Where it surfaces a **suspected unlawful act** going beyond ordinary review, see 3.4 | — for ordinary review; **paragraph 18** or **paragraph 10/11** respectively for the escalated cases below | A human must read the campaign before it goes live — there is no proactive content-safety tool in use, and none of Dono's user base is old enough to be excluded by an age gate that would make review unnecessary | Automated pre-screening is not yet available and would not remove the need for human review of borderline cases in any case |

### 3.3 Safeguarding reports

| Activity | Art. 6 basis | Art. 9 condition | Sch. 1 condition | Necessity and proportionality | Why a less intrusive alternative isn't used |
|---|---|---|---|---|---|
| A report, or something a reviewer notices, raising a concern that a person — a child, or an adult who may be at risk — may be experiencing or at risk of neglect, or physical, mental or emotional harm | Legitimate interests (protecting the individual); vital interests (Article 6(1)(d)) where there is an immediate risk to life or safety | **Article 9(2)(g)** — substantial public interest | **Schedule 1, paragraph 18** — safeguarding of children and of individuals at risk. This is the purpose-built condition for exactly this activity, and is used instead of the generic paragraph 10 that the previous version applied here | The point of a safeguarding referral is to protect someone who may not be able to protect themselves. Asking the subject's consent before processing the concern would defeat the purpose in the cases that matter most — where the subject is a child, is not able to consent, or where asking would itself increase the risk | Waiting for confirmation from the subject or a third party before recording the concern would remove the ability to act quickly in the cases where speed matters. The safeguard is not withholding the initial record — it is the strict access and correction controls in sections 6–7 |

### 3.4 Fraud reports and dishonesty concerns

| Activity | Art. 6 basis | Art. 9 condition | Sch. 1 condition | Necessity and proportionality | Why a less intrusive alternative isn't used |
|---|---|---|---|---|---|
| A report, or an internal signal, that a campaign or user may be dishonest about money — a fabricated need, misused funds, or a fake campaign — where the concern incidentally touches special category data (for example, the honesty of a medical claim) | Legitimate interests (protecting donors and platform integrity) | **Article 9(2)(g)** | **Schedule 1, paragraph 11** — protecting the public against dishonesty, malpractice or mismanagement. This replaces the previous reliance on paragraph 10 for this activity, because paragraph 11's own wording ("dishonesty, malpractice ... mismanagement") is a closer match than the general "unlawful acts" language of paragraph 10 | Donors give money on the strength of a claim Dono cannot independently verify; some level of dishonesty investigation is core to the trust the whole model depends on | Requiring pre-verification of every medical or personal claim before a campaign can raise funds would be disproportionate to the actual fraud rate and would defeat the low-friction model the product is built on; post-hoc investigation triggered by a specific concern is the narrower alternative |
| The same activity, where the concern has crossed into a clearly criminal allegation — for example, a suspected scam, not merely an exaggerated need | Legitimate interests; legal obligation where a reporting duty applies | This is **Article 10** data (an allegation of an unlawful act), not Article 9, unless special category data is also present | **Schedule 1, paragraph 10**, as extended to Article 10 by **paragraph 36** of Part 3 — genuinely the right condition here, because the activity is specifically the prevention or detection of an unlawful act and nothing broader | Consent would prejudice the investigation — a suspected fraudster cannot be asked to consent to being investigated | As above |

### 3.5 Moderation decisions (Dono's own record)

| Activity | Art. 6 basis | Art. 9 / 10 condition | Sch. 1 condition | Necessity and proportionality | Why a less intrusive alternative isn't used |
|---|---|---|---|---|---|
| Dono's internal record of a moderation decision — what was reviewed, what was decided, and why, including where the decision records that content was assessed as, or suspected of being, illegal | Legal obligation (Online Safety Act duties, and the general duty to be able to explain a decision on appeal); legitimate interests | **Article 10** where the decision concerns suspected illegality | **Schedule 1, paragraph 10**, extended to Article 10 by **paragraph 36**. This is the one place in this document where paragraph 10 is squarely and narrowly the right fit — the activity *is* "detecting an unlawful act," not something broader dressed up as one | Dono must be able to show why it removed or retained content, both to comply with its own duties and to give the affected user a fair appeal | Not keeping a reasoned record would make appeals impossible to run fairly and would leave Dono unable to demonstrate compliance to the ICO or a regulator |

### 3.6 User complaints

| Activity | Art. 6 basis | Art. 9 / 10 condition | Sch. 1 condition | Necessity and proportionality | Why a less intrusive alternative isn't used |
|---|---|---|---|---|---|
| An ordinary complaint about Dono's service, a moderation decision, or how a report was handled, where the complaint **does not itself contain** special category or criminal offence data | Contract; legitimate interests | **Not engaged.** Ordinary complaints are not special category or criminal offence data and this policy does not need to, and does not, apply a condition to them | — | — | — |
| A complaint whose **content** discloses special category data (for example, "I was discriminated against because of my religion") or alleges criminal conduct (for example, "the campaign owner threatened me") | As for 3.2–3.4 depending on content | Apply the condition for the underlying content type above — a complaint does not get its own separate condition; it inherits the analysis of what it actually contains | As above | Treating every complaint as sensitive by default would be disproportionate; treating a complaint that plainly discloses sensitive content as ordinary data would understate the protection it needs | — |

### 3.7 Legal claims

| Activity | Art. 6 basis | Art. 9 / 10 condition | Sch. 1 condition | Necessity and proportionality | Why a less intrusive alternative isn't used |
|---|---|---|---|---|---|
| Records needed to establish, exercise or defend a legal claim, where they contain special category data | Legitimate interests; legal obligation | **Article 9(2)(f)** | **None required** — self-executing | Dono must be able to bring or defend a claim | — |
| The same, where the records contain criminal offence data (for example, a claim arising from an alleged fraud) | Legitimate interests; legal obligation | **Article 10** | **Schedule 1, paragraph 33** — legal claims. This replaces the previous reliance on paragraph 10 for this activity: paragraph 33 exists specifically for legal proceedings, legal advice and establishing, exercising or defending legal rights, and is the closer condition | As above | As above |

### 3.8 Reports to the National Crime Agency (CSEA)

| Activity | Art. 6 basis | Art. 9 / 10 condition | Sch. 1 condition | Necessity and proportionality | Why a less intrusive alternative isn't used |
|---|---|---|---|---|---|
| Reporting suspected child sexual exploitation and abuse content to the NCA under section 66 of the Online Safety Act 2023 and the 2026 Regulations | **Legal obligation** | **Article 10** | **Schedule 1, paragraph 10**, extended to Article 10 by **paragraph 36**. This is correctly a paragraph 10 case — the report is the detection and reporting of an unlawful act, with nothing broader claimed for it | The report is compulsory once content is detected. Seeking consent from the person reported is obviously inappropriate and would prejudice both the report and any resulting investigation | None — this is a statutory duty with no alternative route |

### 3.9 Institutional referrals

| Activity | Art. 6 basis | Art. 9 / 10 condition | Sch. 1 condition | Necessity and proportionality | Why a less intrusive alternative isn't used |
|---|---|---|---|---|---|
| Referring a status or conduct concern about a Campaign Owner to their institution under clause 23.7 of the Terms of Service | Legitimate interests; legal obligation where applicable | Depends on the nature of the concern — apply 3.3 (safeguarding), 3.4 (fraud) or 3.4's Article 10 row (suspected criminal conduct) as appropriate. There is no separate, generic "referral" condition | As matched above | A referral is necessary only where Dono needs the institution to confirm status, or the matter is serious enough that the institution needs to know | A referral is used only where the underlying concern independently clears the bar in 3.3/3.4 — a referral is never used as a way to escalate something that would otherwise be declined under section 5 |

## 4. Criminal offence data — summary table

This table draws together the Article 10 rows above with the general run of activities, so the Article 10 picture can be checked in one place without re-reading section 3.

| Activity | Art. 6 basis | Art. 10 condition | Sch. 1 condition |
|---|---|---|---|
| CSEA reports to the NCA | Legal obligation | Detecting/reporting an unlawful act | **Para. 10**, extended by para. 36 |
| Moderation decisions recording suspected illegal content | Legal obligation; legitimate interests | Detecting an unlawful act | **Para. 10**, extended by para. 36 |
| Fraud reports that have crossed into a clear criminal allegation | Legitimate interests; legal obligation | Detecting an unlawful act | **Para. 10**, extended by para. 36 |
| Financial-crime escalations (suspected fraud, money laundering, sanctions evasion) reported to the police or OFSI | Legitimate interests; legal obligation for sanctions | Detecting an unlawful act | **Para. 10**, extended by para. 36. (If Dono ever joins a recognised anti-fraud or AML disclosure scheme as a regulated-sector participant, paragraphs 14 or 15 become available and are the better fit — reviewed if that happens) |
| Legal claim records involving an allegation of criminal conduct | Legitimate interests; legal obligation | Legal proceedings, advice, or establishing/defending legal rights | **Para. 33** |
| Safeguarding concerns with a criminal dimension (for example, suspected abuse) | Legitimate interests; vital interests | Protecting an individual at risk | **Para. 18**, applied to Article 10 via the general effect of DPA 2018 s.11(2) and paragraph 36 |
| **User-to-user allegations of criminal conduct with no platform-integrity, safeguarding or legal-claim dimension** | — | — | **No condition applies. See section 5 — Dono does not process these.** |

**Dono only ever processes the allegation itself.** It does not seek criminal-record data, does not ask users about convictions or cautions, and does not obtain police records. Where a user volunteers that information unprompted, it is treated as unsolicited special category/criminal offence data under section 8, not sought out or retained beyond what the relevant row above requires.

## 5. Refusal — when Dono does not process an allegation

5.1 The gap the previous version left open was exactly this: a user-to-user report alleging criminal conduct, where the allegation has no connection to platform integrity, no safeguarding dimension, and no legal-claim purpose. There is no Schedule 1 condition that fits that case, because none of the conditions were written for "one person says something bad about another person, unconnected to anything Dono needs to do." **Dono does not process that case.** It is not a gap to be filled with paragraph 10; it is a category of report Dono declines.

5.2 **A report or allegation is refused — meaning Dono does not open a moderation case, does not investigate, does not label the accused user, and does not retain the substance of the allegation beyond the minimal refusal log in 5.4 — where any of the following applies:**

- the conduct alleged has **no connection to the Platform**, to a donor's or Campaign Owner's use of it, or to a safeguarding, fraud or legal concern Dono has a legitimate reason to act on (for example, "this person has a criminal record from before they joined Dono" or "I heard this person did something bad in their personal life");
- the report is **speculative** — phrased as suspicion, rumour or personal opinion with no stated basis, no evidence and no specific, checkable claim;
- the reporter, when asked, **cannot or will not identify what actually happened**, when it happened, or why they believe it, beyond a general assertion;
- the pattern of reporting suggests the report is being used to **harass, pressure or discredit** the person named, rather than to raise a genuine concern; or
- the report asks Dono to take an action — banning, publicly labelling, or disclosing information about a user — that **the underlying concern, even if true, would not justify** under the Community Guidelines or this policy.

5.3 **This is a floor, not a ceiling.** Meeting the bar in 5.2 (having a stated basis, a specific claim, a plausible connection to the Platform) is what makes a report eligible for ordinary triage under the Online Safety Act Procedures — it does not mean the report is accepted as true. An eligible report is still recorded as an allegation, not a fact, under section 6.

5.4 **What "refused" means in practice.** A refused report is not silently dropped. The reporting system records: that a report was received, its category, the date, and the reason it was declined (using the criteria in 5.2) — but **not** the substance of the allegation itself, and **not** any identifying detail about the person it concerned beyond what is unavoidably part of the case reference. This minimal log exists so Dono can show a pattern of misuse if one develops, and is kept for **12 months**, then deleted. The person accused is not notified that a report was made and declined, because notifying them would itself be a disproportionate use of an allegation Dono has decided not to act on.

5.5 **The reporter is told, in general terms, that Dono has not opened a case** and, where the pattern in 5.2's fourth bullet is present, may be reminded of the misuse-of-reporting provisions in the Community Guidelines. Dono does not explain its full reasoning to the reporter where doing so would itself require disclosing information about the accused person.

5.6 **This rule does not apply** to CSEA content (section 3.8, which is a statutory duty independent of the merits of the underlying report) or to Priority 1 safety concerns under the Online Safety Act Procedures, where the cost of being wrong about declining is too high — those are always triaged, and the safeguard against a false allegation is the human review and evidentiary standard in the Online Safety Act Procedures, not a refusal at intake.

## 6. Safeguards for allegation data

These apply to every activity in sections 3.3 (safeguarding), 3.4 (fraud), 3.5 (moderation decisions), 3.8 (CSEA) and 3.9 (referrals) — anywhere Dono processes something alleged about a person, rather than something that person disclosed about themselves.

**6.1 Recorded as allegation, not fact.** Every case record carries a status field — reported, under review, upheld, not upheld, referred, declined — and the wording used in the record, in any referral, and in any communication with a third party (an institution, the police, the NCA) must be allegation language: "reported to have," "alleged," "suspected," never an assertion that the conduct occurred. Where a decision is later reversed on appeal, or an allegation is withdrawn, the record is updated to reflect that, and where a referral was already made to a third party, Dono corrects the position with that recipient.

**6.2 Correction and challenge.** A person who is the subject of an allegation may:

- ask Dono to correct a **factual inaccuracy** in how the allegation or Dono's handling of it is recorded — for example, a wrong date, a misattributed statement, or an outcome that was not correctly updated after a reversal. This does not include a right to have the fact that a report was made removed from the record, which is Dono's own accountability record, not the subject's personal narrative;
- be told, **where telling them would not prejudice** an ongoing safeguarding matter, a live fraud or legal investigation, or an NCA report, that a moderation or enforcement decision has been taken about them, and given the reason, through the appeals framework at clause 8 of the Community Guidelines;
- **appeal** a decision made against them through that same framework, reviewed by someone who was not substantially involved in the original decision, per the Online Safety Act Procedures §3.5; and
- **complain to Dono, and separately to the ICO**, about how their personal data was handled in the course of the allegation, using the data-protection complaints route in the Privacy Notice, which is distinct from a content appeal.

Where Dono withholds information about an allegation from its subject under a Data Protection Act 2018 exemption (section 7 below), that reliance is itself recorded, with the reason and who decided it, and is reviewed when the matter concludes.

**6.3 Data minimisation.** Dono does not seek out special category or criminal-offence data beyond what a report or referral already contains. Sensitive detail inside campaign or comment content is retained as part of that content and is **not extracted, tagged or separately indexed**. A report intake that includes irrelevant sensitive material — for example, unnecessary detail about a third party who is not the subject of the report — is trimmed to what is relevant before the case record is created, where that can be done without losing the substance of the concern. Section 5 governs what is refused outright; this clause governs what is trimmed from an accepted report. Inference of characteristics from behaviour remains prohibited (section 10).

**6.4 Retention.** Set out in full in section 11. In summary: allegation and case records are kept only as long as needed for resolution, any appeal window, and Dono's own accountability, with the two CSEA clocks kept strictly separate from everything else.

**6.5 Restricted access.** Access to safeguarding, fraud, financial-crime and CSEA case records is limited by role: general moderation cases to role-authorised moderators; safeguarding, financial-crime and legal-claim escalations to Amrit and those she directs; CSEA material to the smallest possible group under the Online Safety Act Procedures §3.4, held in restricted storage, never downloaded, screenshotted or forwarded. **Every access to an allegation record involving identity or safeguarding data is audit-logged.**

## 7. Individual rights and exemptions

7.1 Rights apply as set out in the Privacy Notice, subject to the exemptions in the Data Protection Act 2018. Dono may withhold information, decline to act on an erasure or rectification request, or refuse a subject access request in part, where complying would be likely to prejudice the prevention or detection of crime, the apprehension or prosecution of offenders, or an ongoing safeguarding matter — but only to the extent that prejudice would actually occur, not as a blanket refusal. Any such reliance is recorded under 6.2.

7.2 A person cannot use a subject access request to obtain the identity of someone who reported them, or the content of a CSEA report, where disclosure would undermine the purpose of the report or expose the reporter to a real risk.

7.3 An erasure request from the subject of an accepted allegation does not automatically remove the record where Dono needs it for an ongoing investigation, a legal obligation, or to defend a legal claim — but is honoured once none of those needs remain and the applicable retention period in section 11 has been reached or waived early.

## 8. Unsolicited disclosure

8.1 Where a user volunteers special category or criminal offence data Dono did not ask for and does not need — for example, disclosing a criminal conviction unprompted in a support message, or a health condition irrelevant to a campaign in a comment — Dono does not retain it beyond what is operationally unavoidable (for example, the message it arrived in, retained on the same terms as ordinary correspondence), does not act on it, does not tag or reference it elsewhere, and does not treat its presence as triggering any of the conditions in section 3.

## 9. Where no valid combination exists — redesign or removal

9.1 **User-to-user allegations with no platform-integrity, safeguarding or legal-claim dimension** (section 5) have no valid Article 9/10-plus-Schedule-1 combination and are **not processed**. This is not a gap Dono is operating under an uncertain basis for — it is a category of processing Dono has decided not to do.

9.2 **Institutional aggregate reporting and any future automated inference or scoring feature** that would touch special category or criminal offence data must be assessed against this policy, and against a fresh DPIA, before it is built — not retrofitted afterwards. Until that assessment exists, no such feature is a live processing activity and none is described in section 3.

9.3 **Financial-crime escalation under an anti-fraud-organisation or AML disclosure scheme** (paragraphs 14/15) is not currently available to Dono because Dono is not a member of such a scheme and is not currently in the regulated sector for money-laundering purposes. Section 4's Article 10 row for financial-crime escalation therefore continues to rely on paragraph 10, which is a genuine fit for that specific activity (the escalation is squarely about detecting an unlawful act) and is not treated as a stand-in for a better-fitting condition that happens not to be available yet.

## 10. Inference — a closed rule (unchanged from v2.2)

**Dono does not derive, tag, record, segment or act on any inference about a person's health, disability, religion, political opinions, sexual orientation, sex life, racial or ethnic origin, or trade-union membership, from their donation history, browsing behaviour or any other pattern of activity.** No internal tagging of users by inferred characteristic. No analytics segment built on one. No use of one in moderation, fraud scoring or marketing. Where such an inference would arise incidentally, it is treated as data to be minimised, not used. Reflected in the Privacy Notice (clause 12.2) and the ROPA.

## 11. Retention

| Category | Period | Trigger |
|---|---|---|
| Self-disclosed special category data within campaign or comment content | As for the content itself — campaign pages remain accessible indefinitely at their direct URL; comments until deleted or removed, with a moderation copy kept **6 years** from removal | Publication / removal |
| Special category data in uploaded receipts and evidence | **6 years** | Campaign completion |
| Safeguarding case records | **6 years** from resolution, or longer where a competent authority lawfully requires it | Resolution |
| Fraud and dishonesty case records | **6 years** | Resolution or the enforcement decision |
| Moderation decisions and enforcement records | **6 years** | Resolution or the enforcement decision |
| Financial-crime escalation records | **6 years** | Case closure |
| Legal claim records | Duration of the matter + **6 years** | Conclusion |
| Institutional referral records | **6 years** | Referral |
| **Refused-report log (section 5.4)** | **12 months**, substance not retained | Decision to decline |
| **NCA CSEA report reference** | **5 years** | Report submitted |
| **CSEA content, information submitted, the material used to make the CSEA judgement, and associated user data** | **1 year**, in restricted storage, then securely deleted — unless the NCA, the police or another competent authority lawfully requires longer | Report submitted |
| This policy and its version history | For as long as the relevant processing continues, plus **6 years** | — |

The two CSEA clocks are deliberately different and must be implemented as two separate automated deletion dates. **Do not apply a single period to CSEA material** — that would cause excessive retention of the most sensitive and potentially unlawful material Dono will ever hold.

## 12. Sharing

Special category and criminal-offence data is shared only: with the **National Crime Agency**, under the statutory CSEA reporting duty; with the **police or another competent authority**, where Dono reports a suspected crime or is lawfully required to provide information; with **OFSI**, on a suspected sanctions breach; with a **Recognised Institution**, under the referral protocol in clause 23.7 of the Terms of Service, with the allegation labelled as an allegation and matched to the condition in 3.9; and with **professional advisers**, for a legal claim. Each disclosure is recorded, including the condition relied on for it.

## 13. Procedures against each data-protection principle

**Lawfulness, fairness and transparency.** The Article 6 basis and the Article 9/10/Schedule 1 condition for each activity are in sections 3–4. Where no condition fits, section 9 says so and the processing does not happen. The Privacy Notice tells users what Dono processes, why, and on what basis; clause 12 addresses special category and criminal-offence data specifically and is updated to reflect this document (see the v2.3 change log).

**Purpose limitation.** Each activity in sections 3–4 is processed only for the purpose recorded against it. Moderation and safeguarding data is not used for marketing. Financial-crime records are not used for product analytics. CSEA material is used only for the report.

**Data minimisation.** Section 6.3 and section 8. Dono does not seek out this data, does not extract or tag it, and declines what it does not need under section 5.

**Accuracy.** Section 6.1. An unresolved allegation is recorded as an allegation, never as a finding, and the record is corrected when the position changes.

**Storage limitation.** Section 11.

**Integrity and confidentiality.** Section 6.5. Access to escalated records is limited and audit-logged; CSEA material sits in restricted storage with the smallest practical group of people able to reach it.

**Accountability.** This document, the ROPA and the DPIA are reviewed together, and this document is made available to the ICO on request, per DPA 2018 Schedule 1 paragraph 40.

## 14. Governance and review

Amrit is accountable for this policy, consistent with her designated roles for Online Safety Act reporting and financial-crime escalation, with Sashank as deputy and Joe as second backup. It is reviewed alongside the Online Safety Act Procedures, the Financial Crime & Payments Policy, the ROPA and the DPIA, and whenever a product change could introduce a new source of this data — a new profile field, a new campaign category, a new upload type, a new report category, or any automated scoring.

## 15. Outstanding

- **[SOLICITOR SIGN-OFF]** — confirm the section 3–4 condition mapping, in particular: (a) that paragraph 18 (safeguarding) is correctly available where the individual at risk is not a "child" or "at risk" adult within the DPA 2018's own definitions in every case Dono applies it to; (b) that paragraph 11 (dishonesty) is correctly available for fraud concerns that have not yet crystallised into a specific criminal allegation; (c) the refusal rule in section 5, and specifically that declining to process an unsupported allegation does not itself create a liability to the reporter; and (d) the Article 10 treatment of safeguarding concerns with a criminal dimension in section 4, which relies on DPA 2018 s.11(2) read with paragraph 36 and should be checked rather than assumed.
- **[OUTSTANDING]** — no written confidentiality or data-handling agreement is in place with anyone who has access to this data. That is a gap in the integrity-and-confidentiality procedure (13, 6.5) and must be closed before launch. Carried over unresolved from v2.2.
- **[ENGINEERING]** — the refused-report log (5.4), the case-status field and allegation-language enforcement (6.1), and the two-tier retention automation (11) are not yet built. See `../../../engineering/legal-launch/ENGINEERING_MODERATION_REQUIREMENTS_v2.3.md` for the implementation specification, which must be updated to reference this document's section numbers rather than v2.2's.


---

## Approval block — SIGNATURE REQUIRED

> **This block is unsigned. This document is prepared for approval and is not approved.**

**I confirm that I have reviewed this document in its consolidated v3.0 form, that it states the current position only, and that I approve it.**

| Field | Entry |
|---|---|
| Approver name | Amrit Kaur Rooprai |
| Role | Controller, sole trader and accountable owner |
| Document version approved | 3.0 |
| Approved for use | ☐ Yes, on ____________ · ☑ **No** |
| Signature | ______________________ |
| Date of approval | ______________________ |

**Reviewed by:** Sashank (deputy) — Signature ______________________  Date ______________

---

## Version control

| Field | Entry |
|---|---|
| Version | 3.0 |
| Version date | 7 August 2026 |
| Effective from | On publication approval |
| Accountable owner | Amrit Kaur Rooprai, sole trader trading as Dono |
| Prepared by | Legal consolidation, 7 August 2026 |
| Reviewed by | *(signature required — approval block above)* |
| Approved by | *(signature required — approval block above)* |
| Status | **Not approved.** Clean consolidated document prepared for signature |
| Supersedes | v2.3 (6 August 2026) and all earlier versions, retained unaltered in the version archive |
| Next scheduled review | 7 February 2027, or on any material change to the Platform, the law, or Dono's payment configuration |
| Archive rule | Published versions are never overwritten or deleted. The version in force at the time of acceptance governs the relevant transaction |
