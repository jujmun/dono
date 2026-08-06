# Dono — Online Safety Act Procedures

**Owner / Online Safety lead:** Amrit Kaur Rooprai — accountable for Dono's illegal-content, child-safety, and reporting-and-complaints duties
**Operational backup and appeal reviewer:** **Sashank**
**Second backup:** **Joe**
**Version:** Production operating baseline v2.3 — 6 August 2026
**Approved by:** _________________ **Date:** _________________
**Next review:** 31 January 2027, or on any material product change or serious incident.

Authoritative launch-state internal procedure. It describes the production children's-access position, CSEA reporting route, moderation triage and Online Safety complaints process. The **public-facing** complaints and appeals framework is clause 8 of the Community Guidelines; this procedure implements that framework and does not create a different route.

**Implementation and traceability:** [`ENGINEERING_MODERATION_REQUIREMENTS.md`](ENGINEERING_MODERATION_REQUIREMENTS.md) and [`ONLINE_SAFETY_TRACEABILITY.md`](ONLINE_SAFETY_TRACEABILITY.md).

## Changes in v2.2

- The **children's access position is corrected**: 18+ for accounts, **no age restriction on donating**, and age is **declared, not verified**. The previous draft's reasoning is replaced because it relied on Stripe Identity as an age gate, which engineering has confirmed it is not.
- **CSEA roles are named**: Amrit as Organisation Administrator, **Sashank as Deputy Organisation Administrator**, **Joe as backup for Sashank**.
- **CSEA retention is corrected** from a single five-year period to the two periods the 2026 Regulations actually require.
- The complaints procedure is replaced by a cross-reference to the single framework, and the **address is corrected to `joindono.team@gmail.com`**, which is now the address used in every Dono document.
- Appeal reviewer corrected: Amrit no longer both triages and decides the appeal in the ordinary case.
- The moderation triage levels and production control-verification test are added.

---

## 3.1 Accountability

Amrit Kaur Rooprai is the named individual accountable for Online Safety Act compliance. Because Dono is a sole trader and not a company, there is no separate governing body; Amrit is accountable as the operator and maintains the evidence needed to explain Dono's moderation decisions, risk controls, residual risks and corrective actions.

| Role | Person |
|---|---|
| Accountable owner and final escalation point | **Amrit** |
| Operational backup and appeal reviewer | **Sashank** |
| Second backup | **Joe** |
| Emergency temporary restriction | **Any founder** may impose one |
| System availability and emergency restriction controls | Engineering |

## 3.2 Moderation triage

Every report creates a case. Cases are triaged into three levels.

**Priority 1 — immediate danger or exceptionally serious content.** Suspected child sexual abuse material; a credible threat to life; terrorist content or an operational threat; non-consensual intimate imagery; active encouragement of imminent suicide or serious self-harm; a campaign facilitating an ongoing serious offence.

*Response:* immediately prevent further public access or campaign activity; send an urgent alert to Amrit and the backup; restrict access to the evidence; consider police, emergency-service or NCA escalation; record every action and its time. **Restriction and alert are immediate.**

**Priority 2 — potentially illegal or materially harmful.** Fraud or dishonest fundraising; hate or harassment; sale or promotion of unlawful goods; credible criminal allegations; repeated targeting of an individual.

*Response:* prompt human review, target **within 24 hours**; temporarily restrict the material where continued exposure creates a meaningful risk; decide whether to remove, restore or request further information.

**Priority 3 — ordinary policy dispute.** Misleading but not obviously fraudulent descriptions; offensive comments; intellectual-property complaints; disagreements about campaign accuracy.

*Response:* review through the normal queue, target **within three working days**.

These are Dono's **operational targets, not statutory deadlines**, and must not be published as contractual guarantees.

**Two possible conclusions.** A moderator may conclude either that Dono has reasonable grounds to consider the content illegal, **or** that Dono cannot confidently determine legality but the content nevertheless breaches the Community Guidelines or the Terms. Either is sufficient to act. Moderators are not required to decide whether a criminal offence has been committed.

**Moderator powers.** Role-authorised moderators can unpublish a campaign; hide a campaign update, comment, image or document; restrict content from public viewing; pause campaign activity and new donations; issue warnings; suspend or permanently ban an account; and restore content, campaign functionality or account access following review. Each action requires a reason, creates a tamper-evident audit event and is reversible except where the action is a lawful permanent deletion after retention expires.

## 3.3 Children's access assessment

**The position, stated accurately.**

- **Anyone of any age may view public campaign pages**, without logging in. Campaign links are shareable, so a child can reach any public page via search, a shared link or social media.
- **Anyone of any age may donate**, with or without an account. There is no age gate on donating. Checkout asks the donor to confirm they are 18 or over — a **declaration, not a verified check**, with no parent-or-guardian-permission alternative.
- **There is no minimum age to create an account or to post a comment.** Only people aged 18 or over may create a campaign or act for a society, checked at that step. **Age is established by a declared date of birth**, where it is checked at all.
- Campaign creators additionally complete Stripe Identity verification. **Stripe Identity does not reliably return a date of birth in every flow and is not used as Dono's age gate** — engineering has confirmed this. The gate is the declared date of birth.
- Children **cannot** author campaigns or act for a society, but they **can** read everything published, they **can** comment, and they **can** donate. **[COMPLIANCE — 6 Aug 2026: revised — commenting was previously listed as blocked to children via the account-creation age gate; that gate will not be built (see TRUTH.md, Age section). Downstream moderation/OSA procedures that assumed comments come only from declared-adult accounts should be reviewed against this — Amrit/counsel to re-assess.]**

**Conclusion: children are likely to access the service.** A declared date of birth is not highly effective age assurance, so Dono cannot conclude that it excludes under-18s. Dono therefore operates as a service likely to be accessed by children and has completed a full children's risk assessment.

**Decision.** Dono operates **child-safe by default** rather than deploying age assurance to exclude under-18s. The reasons: campaign creation is already restricted to adults; the higher-risk formats associated with children's online harms are absent from the product (no private messaging, no livestreaming, no private groups, no disappearing content, no recommendation feed); and adding age assurance to browsing and donating would not remove the residual risk, which sits at the point of payment rather than at the point of access. **[COMPLIANCE — 6 Aug 2026: this reasoning previously also cited commenting as restricted to adults; that gate will not be built (see TRUTH.md, Age section), so commenting is not a content-authoring role restricted by age. Whether that changes the "child-safe by default, no age assurance" conclusion is for Amrit/counsel to re-assess, not assumed unchanged here.]**

**What child-safe by default means in practice:**

- **Every campaign is reviewed by a person before publication**, checking for content unsuitable for a mixed-age audience and not only for fraud.
- **Comments are post-moderated**, with a report control on every comment and removal on report. **Links and attachments are not permitted in comments** — a deliberate choice, because comments are the one surface visible to children that is not pre-moderated.
- **No targeting of children.** Dono's marketing, prompts and design must not be built to appeal specifically to under-18s: no gamified donation mechanics aimed at children, no youth-specific targeting.
- **A checkout confirmation at the point of payment**, which is where the residual risk to children actually sits.
- **A parent or guardian route**: a parent or guardian may ask about, correct or delete a child's data. A donation made without their permission is refundable as an ordinary unauthorised-payment claim under the Refund and Dispute Policy — not a separate parental-permission mechanism, which was decided against building (6 Aug 2026, see TRUTH.md, Age section).
- **Escalation path** for harmful content, per 3.4 and 3.2.

**Residual risk, stated honestly.** The most significant residual risk is financial exploitation of a child donor: a verified adult creator could write a campaign that emotionally pressures a young reader, and nothing upstream — identity verification, pre-publication review — sits at the point where a child parts with money. The checkout confirmation is a real but limited mitigation. This is recorded as **Medium** in the Children's Risk Assessment and is reviewed after the first six months of operation.

**Review trigger.** Revisit if Dono introduces direct messaging, opens campaign creation to under-18s, permits links or attachments in comments, or if evidence emerges that a significant proportion of users are children.

## 3.4 CSEA reporting route

**Duty.** Under section 66 of the Online Safety Act 2023 and the Online Safety (CSEA Content Reporting by Regulated User-to-User Service Providers) Regulations 2026, in force from **7 April 2026**, in-scope user-to-user services must report all detected and unreported child sexual exploitation and abuse content to the National Crime Agency. The duty is absolute once content is detected — it does not depend on volume or on an assessed level of risk.

**Registration and named people.**

| Role | Person | Status |
|---|---|---|
| Organisation Administrator | **Amrit** | Registered; access tested through the NCA CSEA Industry Reporting Portal |
| Deputy Organisation Administrator | **Sashank** | Registered; access tested |
| Backup for the Deputy | **Joe** | Emergency access and escalation route tested |
| Authorised reporters | Amrit and Sashank, subject to current NCA eligibility | Individual reporter access tested |
| Emergency contact | Maintained in the restricted operational contact register | Tested through the quarterly emergency exercise |

Portal registration and access are maintained continuously and tested quarterly using harmless test data.

**Scope — what counts as "detected".** CSEA content is detected when Dono becomes aware of it, however that happens: a user report, a campaign or comment flagged in moderation, or something a team member notices in the ordinary course of review. It does not need to be confirmed by law enforcement for the duty to arise — awareness is enough. This duty does **not** require Dono to introduce proactive detection or hash-matching technology; it requires Dono to report what it actually detects.

### Procedure

**Step 1 — restrict access immediately.** Anyone who encounters suspected CSEA content must: stop ordinary review; **not download it to a personal computer or phone; not screenshot it; not forward it by email, Slack, WhatsApp or any other channel**; restrict the content from public access; prevent further sharing; freeze the relevant campaign or account where necessary; and notify Amrit and the deputy through the emergency channel. Only the minimum number of trained people may access the quarantined material.

**Step 2 — preserve the system data.** The system preserves what is available, without asking the moderator to make extra copies: content and file identifier; campaign, comment or profile URL; uploader and relevant recipient account identifiers; upload date and time; account email and telephone number; upload IP address and port information where collected; recent relevant IP information held by Dono; file metadata; file hash where technically available; how Dono became aware; linked reports and previous NCA report reference numbers; and actions taken with their timestamps. **Dono does not begin collecting categories of information it does not otherwise hold merely to fill in the form** — the obligation concerns information available to the provider.

**Step 3 — decide the priority.** Use the NCA's three levels. *Priority 1:* current or imminent danger, an offence happening or about to happen, an immediate safeguarding need, or a threat to life. *Priority 2:* risk in the near future, evidence of contact offending, recently generated material, or another reason swift action is required. *Priority 3:* neither of the above.

Submit Priority 1 **immediately**; Priority 2 **as soon as reasonably practicable** (Dono's internal standard: restrict and report the same day); Priority 3 **without undue delay** (Dono's internal standard: report no later than the next working day). The latter two are internal standards, not statutory hour limits.

**Step 4 — check for duplicate reporting.** Before submitting, record: whether Dono has already reported the same incident; whether the same material was included in an earlier report; and whether another reporting arrangement, such as NCMEC, has already covered it. **The same content should not be reported through both NCMEC and the NCA.** Where a further user shares previously reported content, a further report may still be required and must be linked to the earlier reference.

> Previously reported? Yes / No / Unknown · Reporting body: NCA / NCMEC / other · Reference number: · Reason a new report is required:

**Step 5 — submit through the portal.** The authorised reporter completes a checklist covering: reporter and organisation details; the content or incident; how it was detected; the platform and URL; upload date and time; related report numbers; the priority assessment; uploader, sender or recipient details held by Dono; account, email, telephone and IP information; relevant metadata or hash; any emergency or safeguarding action already taken; and confirmation that all reasonably available information has been provided. **Store the portal-generated report reference in the incident record.**

**Step 6 — remove from public view** as soon as it is safe to do so without destroying evidence needed for the report.

**Emergency route.** Where there is an imminent risk to a child and Amrit cannot be reached, **call 999** and report to local police.

**False reporting.** Knowingly submitting false information as part of a CSEA report is a criminal offence. This procedure is only for genuine, good-faith detections.

### Retention — two separate clocks

Under the 2026 Regulations:

- the **unique NCA report reference number is retained for five years**; and
- the **detected CSEA content, the information submitted, the information used to make the CSEA judgement, and relevant associated user data are retained for one year** from the report, in restricted storage, unless the NCA, the police or another competent authority lawfully requires longer preservation. The material is then securely deleted.

**Do not write "all CSEA evidence is retained for five years".** Implement two automated deletion dates:

- `report_reference_delete_at` = report date + 5 years
- `restricted_evidence_delete_at` = report date + 1 year

The case-management service applies both deletion dates automatically, blocks ordinary moderator access to restricted evidence and records deletion or an authorised legal hold in the audit log.

### Training

Everyone capable of reviewing user reports receives a short, **non-graphic** training session covering: what may amount to CSEA content, including grooming material and not only images; when to stop viewing; how to restrict content; how to trigger the specialist escalation; the three priority levels; the 999 route; the prohibition on personal downloads, screenshots and forwarding; confidentiality and account security; the portal reporter's role; and staff welfare, including the ability to step away after exposure.

Amrit and the deputy receive detailed portal training. Other moderators receive recognition-and-escalation training and do not undertake prolonged specialist assessment. The training register records completion, refresher dates and exercise participation.

## 3.5 Online Safety complaints

**The complaints and appeals framework is clause 8 of the Community Guidelines.** That is the single framework, and this document does not restate it differently. In summary, so that internal readers have it to hand:

- **One address for everything: `joindono.team@gmail.com`**, plus the in-product report controls and the public reporting form at `/report`.
- **Two distinct things.** A **report** says "this content may be illegal or harmful". A **complaint or appeal** says "Dono handled my report wrongly", "Dono wrongly removed my content", or "Dono wrongly suspended my account".
- **Who may complain:** a person whose content, campaign or account was moderated; a person who reported content and believes Dono failed to act or mishandled it; anyone, including a non-user, who believes Dono is not complying with its illegal-content, child-safety, reporting, complaints or freedom-of-expression duties; and children, or adults on their behalf, including about content harmful to children.
- **Acknowledge within five Working Days. Outcome targeted within 30 days.** Urgent matters bypass both.
- **Who decides:** a person who was **not substantially involved in the original decision** — ordinarily **Sashank** where Amrit made the original decision, and Amrit where Sashank did. Where the team's size genuinely prevents separation, the original decision-maker may reconsider, but only as a documented, genuine second look at the original evidence and any new information. **Dono does not promise independence it cannot supply.** External legal or specialist advice may be taken for complex or high-risk cases.
- **Outcomes:** the original decision is confirmed, varied or reversed. Where reversed, content, campaign functionality or account access is restored so far as reasonably possible, and the reason is recorded.

## Records and metrics

Dono's compliance dashboard produces a monthly record of: reports received by category and reporting route; time to first review; time to restriction or removal; cases upheld, rejected and unresolved; reports involving children; external referrals; appeals received; decisions reversed; restorations; repeat offenders and recurring campaign patterns; queue age; moderator activity; and service-target breaches. Monthly snapshots are immutable, exportable and linked to the applicable policy version.

## Production control verification

Dono continuously verifies that:

1. every user-generated-content surface exposes a working report control, including campaign updates, images and documents;
2. a logged-out person can submit a report and receives a tracking reference when contact details are supplied;
3. every report creates a case, enters the correct queue and triggers urgent alerts where applicable;
4. a moderator can immediately restrict content, pause new donations, suspend an account and later restore each state;
5. every privileged action, reason, evidence access and notification is logged;
6. affected users and reporters can submit the correct complaint or appeal and track its status;
7. a reversed decision restores the affected content or account and records the restoration;
8. Priority 1, CSEA and emergency-response exercises succeed at least quarterly;
9. automated retention and legal-hold tests preserve and delete the correct records at the correct time;
10. role and permission tests prevent unauthorised access and enforce appeal-reviewer separation;
11. the public wording matches the production system; and
12. the risk assessments identify the controls Dono operates and the evidence used to assess their effectiveness.

Failed controls create a P0 incident, alert the Online Safety lead and Engineering owner, and block launch or trigger feature disablement until the control passes.
