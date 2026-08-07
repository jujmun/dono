# Illegal Content Risk Assessment — Dono

**Document:** Illegal content risk assessment, Online Safety Act 2023 sections 9 and 23
**Version:** 3.0
**Version date:** 7 August 2026
**Effective from:** on publication approval (see approval block)
**Service provider:** Amrit Kaur Rooprai, sole trader, trading as Dono
**Service assessed:** Dono — a user-to-user donation platform for UK student Societies
**Online Safety lead:** Amrit Kaur Rooprai · **Deputy:** Sashank
**Supersedes:** v2.3 (6 August 2026) and all earlier versions, retained unaltered in the version archive
**Status:** **Re-performed** clean assessment. States the current position only.
**Next review:** 7 February 2027, on any material product change, on any serious incident, and **before public user-generated content is enabled**.

---

## 1. Method

This assessment is performed against **the service as it exists at the date of assessment, having regard to controls actually in place** — not to planned measures. Ofcom's position is that a risk assessment which credits unbuilt controls is not a risk assessment.

For each priority offence:

1. **Likelihood and impact are scored separately**, with the reasoning for each stated.
2. **Baseline risk** is stated with **only evidenced current controls**.
3. **Post-control risk** is stated for the position once each control has passed its acceptance test, **with the test reference**.
4. Each mitigation is **mapped to the relevant Ofcom Code measure area**.
5. Any recommended measure **not adopted** is identified with the reason.
6. The approver and date are recorded.

**Scoring.** Likelihood: Low · Medium · High. Impact: Low · Medium · High · Very high. Risk = the combination, banded Low / Medium / High.

> **The distinction that matters.** *Baseline* is the honest position today. *Post-control* is what the design achieves once evidenced. **Post-control is not a claim that a control exists.** No feature is enabled on a post-control score.

---

## 2. Service description

| Attribute | Position |
|---|---|
| **Service type** | User-to-user service. Users create Campaign pages and post comments that other users can encounter |
| **Beta scope** | **Society Campaigns only.** Individual Student Campaigns are disabled at the API boundary and are a future release |
| **Who may author content** | Only account holders aged 18 or over. Campaign authoring is limited to a verified **Responsible Representative** of a Society. **Commenting is restricted to approved members of the Society that owns the Campaign** |
| **Who may read content** | **Anyone, of any age, without logging in.** Campaign links are shareable |
| **Who may donate** | Anyone aged 18 or over, with or without an account, on an active self-certification |
| **Content formats** | Campaign text, images, documents, video, external links; campaign updates; comments |
| **Comment format** | **Plain text only. No links, images or attachments** |
| **Absent formats** | **No private messaging. No livestreaming. No private or invite-only groups. No disappearing content. No recommendation feed. No user profiles visible to strangers beyond a display name. No recurring donations. No matched funding or Match Windows** |
| **Money flow** | Stripe Connect **direct charges** to the Society's Connected Account. Dono never holds, pools, delays or diverts funds |
| **Creator age gate** | The Payment Provider's **government-document date of birth**, fail-closed. Missing, inconsistent or under-18 results block onboarding. No manual override |
| **Donor age gate** | **Active self-certification.** Not verified age assurance and not highly effective age assurance |
| **Prohibited fundraising** | Commercial and entrepreneurial campaigns. Pass-through fundraising. Society Campaigns must satisfy the **primary-purpose and official-initiative rule** in Terms of Service clause 8.4; incidental third-party benefit is not itself disqualifying |
| **Scale** | Pre-launch. **Zero Donations processed to date.** Single institution |

### 2.1 Risk factors that reduce inherent risk

- The authoring population is **small, identified and institutionally connected** — a verified Responsible Representative of a Society at a Recognised Institution, gated on a government-document date of birth.
- **Commenting is not open to any account holder** — only to approved members of the owning Society. This is materially narrower than an open commenting surface and was the single largest correction to earlier assessments.
- **Plain-text-only comments** remove the vectors that carry most illegal content on general platforms: images, files and links.
- **No private channel of any kind**, so the service cannot be used for the one-to-one contact that grooming, extortion and coordinated harassment depend on.
- **No recommendation feed**, so no amplification pathway.
- **Money moves directly to an identity-verified Connected Account** subject to the Payment Provider's own KYC and AML controls as independent controller — a strong disincentive to financial offending through the Platform.
- **Adults only** for accounts, authoring and donating.

### 2.2 Risk factors that do NOT reduce risk, and must not be treated as though they do

- **Campaign pages remain publicly viewable by people of any age.** Child exposure to campaign content and comments is unchanged by any of the above.
- **The donor age control is a self-certification.** It is not age assurance.
- **Small scale is not a control.** It reduces expected volume, not the adequacy of the response when something occurs.

---

## 3. Evidenced current controls — the baseline

**Only these are credited in the baseline scores.**

| # | Control | Evidence | Strength |
|---|---|---|---|
| E1 | **Human pre-publication review of every Campaign** — text, images, documents, **full** video and every external link — and re-review after any material edit | Verified 5 August 2026 | **Strong.** The single most effective control Dono operates |
| E2 | **Commenting restricted to approved members of the owning Society** | Verified 5 August 2026 | **Strong.** Small, identified, Society-controlled population |
| E3 | **Plain-text comments; attachments and images blocked** | Verified 5 August 2026 | **Strong** for file-borne content. **URLs are not blocked** (OS-22) |
| E4 | **Creator age gate on the Payment Provider's verified date of birth**, fail-closed | Settled 6 August 2026 | **Strong** for creators |
| E5 | **Payment Provider KYC, AML and fraud controls** on every Connected Account, as independent controller | Stripe DPA and product configuration | **Strong** for financial offences |
| E6 | **Content can be hidden and Campaigns unpublished** by an administrator | Verified 5 August 2026 | **Partial** — no account-level action available |
| E7 | **Audit logging that cannot be altered or deleted through the application** | Verified 5 August 2026 | **Partial** — refund decisions, role changes and account deletion are not logged; no export route |
| E8 | **No private messaging, livestreaming, groups or recommendation feed** | Product design | **Strong** — structural, not operational |
| E9 | **Prohibition on commercial and pass-through fundraising**, applied at review | Terms of Service 8.3, 8.4 | **Moderate** — depends on reviewer judgement |
| E10 | **Emergency route to 999 and local police** for imminent risk | Available now | **Moderate** |

### 3.1 Controls that do NOT exist and are NOT credited in the baseline

| Gap | Consequence |
|---|---|
| **No report control on any content** | Users cannot report. Acceptance test 1 fails |
| **No logged-out reporting route** | The majority of readers — who never sign in — cannot report at all. Test 2 fails |
| **No automatic case creation, categories or content-version capture** | Test 3 fails |
| **No urgency routing and no monitoring or alerting of any kind** | Nothing surfaces an urgent report except a person happening to look. Test 4 fails |
| **No account suspension or ban capability** | The only account action is deletion. Test 5 partly fails |
| **No counter-notice or appeals workflow** | Test 7 fails |
| **No moderator training and no incident drill** | Test 8 fails |
| **No malware or image-safety scanning on any upload path** | AL-02 |
| **URLs not blocked in comments** | OS-22 |
| **NCA CSEA portal registration not confirmed** | The statutory reporting route cannot be described as operational |

---

## 4. Priority offence assessment

Priority offences are those in Schedules 5, 6 and 7 to the Online Safety Act 2023. Offences with no plausible pathway on this service are addressed in section 5.

### 4.1 Fraud and financial offences — *the principal risk on this service*

**Pathway.** A person creates a Society Campaign for a purpose that is fabricated, exaggerated or never delivered; or applies donated funds to something other than the stated purpose; or uses the Platform to launder funds by donating and reclaiming.

| | Score | Reasoning |
|---|---|---|
| **Likelihood — baseline** | **Medium** | Crowdfunding is an established fraud vector. Reduced substantially here: the creator is identity-verified by the Payment Provider, is institutionally connected through a verified institutional email, and every Campaign is read by a person before publication. But **pre-publication review cannot detect a plausible lie about future intent** — a well-written fabricated campaign passes review |
| **Impact — baseline** | **Medium–High** | Direct financial loss to donors; reputational harm to the Society and the institution; loss of trust in the Platform. Individual donation sizes are small, which caps loss per donor, but a successful campaign aggregates |
| **Baseline risk** | **MEDIUM–HIGH** | |
| **Likelihood — post-control** | **Low–Medium** | Adds: mandatory evidence of expenditure with human review; a Closure Statement; report controls enabling donors to raise concerns; an executable refund route |
| **Impact — post-control** | **Medium** | The **refund mandate** in Terms of Service clause 13.2 converts a paper determination into an executable remedy. **But it remains limited by the funds in the Connected Account** — a fraudster who has withdrawn cannot be reached through it |
| **Post-control risk** | **MEDIUM** | |

**Controls.** E1, E4, E5, E9 (baseline). Post-control: evidence and closure procedure; refund mandate and dispute state (RF-01 to RF-08); report controls (tests 1–3); institutional referral; financial crime and sanctions escalation.
**Ofcom measure areas.** Governance and accountability; content moderation; reporting and complaints; terms of service.
**Not adopted.** Automated fraud scoring — disproportionate at current scale, and would introduce automated decision-making requiring its own DPIA assessment. Recorded as a review trigger.
**Residual after all controls: MEDIUM.** Accepted, because the remedy's limit — the balance in the Connected Account — is inherent to a model in which Dono deliberately does not hold funds.

### 4.2 Child sexual exploitation and abuse (Schedule 6)

**Pathway.** CSEA material uploaded as a campaign image, document or video, or posted in a comment; or grooming conducted through comments.

| | Score | Reasoning |
|---|---|---|
| **Likelihood — baseline** | **Low** | **No private messaging, no livestreaming, no groups, no disappearing content** — grooming has no channel here. Comments are **plain text only, from approved Society members**. Images and files reach the public only through **human pre-publication review**. There is no anonymous upload route. This is a structurally hostile environment for CSEA |
| **Impact — baseline** | **VERY HIGH** | The most serious harm the Act addresses. Severity does not scale down with likelihood |
| **Baseline risk** | **MEDIUM** | Driven entirely by impact. Low likelihood does not permit a low rating where the impact is catastrophic and the statutory reporting route is unconfirmed |
| **Likelihood — post-control** | **Low** | Adds report controls, urgency routing and trained recognition. Structural factors already do most of the work |
| **Impact — post-control** | **Very high** | Unchanged. Impact is not reducible by process |
| **Post-control risk** | **LOW–MEDIUM** | |

**Controls.** E1, E2, E3, E8 (baseline). Post-control: report control and urgency routing (tests 1–4); CSEA recognition training (test 8); the restricted CSEA procedure; the two retention clocks; **image-safety and malware scanning on upload paths (AL-02)**.

**Two specific gaps drive the current rating and must close:**

1. **NCA portal registration is not confirmed.** The section 66 reporting duty is absolute once content is detected. Dono cannot presently discharge it through the portal. **The 999 and local police route (E10) is the operative route until registration is confirmed, trained and test-submitted.**
2. **No malware or image-safety scanning exists on any upload path** (AL-02).

**Ofcom measure areas.** Governance and accountability; content moderation; automated content moderation (CSAM hash matching and URL detection); reporting and complaints.
**Not adopted.** Perceptual hash matching against a CSAM database. **This is under active consideration and is not refused.** It is not yet adopted because (a) the applicable Ofcom measure's scope for a service of Dono's size and risk profile must be confirmed against the Codes in force, and (b) the structural absence of private and anonymous upload channels materially changes the analysis. **This is recorded as an open decision, not a settled non-adoption**, and must be resolved before public UGC is enabled.
**Residual after all controls: LOW–MEDIUM**, conditional on NCA registration being confirmed and the scanning decision being made.

### 4.3 Harassment, stalking, threats and abuse

**Pathway.** Abusive comments directed at a Society, a Representative or another commenter; a Campaign created to target an individual.

| | Score | Reasoning |
|---|---|---|
| **Likelihood — baseline** | **Low–Medium** | Comments come only from approved members of the owning Society — a small group with a real-world relationship and institutional accountability. Anonymous pile-ons are structurally unavailable. But intra-Society disputes are real, and comments are **post**-moderated, so abusive text is publicly visible before anyone acts |
| **Impact — baseline** | **Medium–High** | Distress to the target, potentially amplified by the institutional context in which they must continue to operate |
| **Baseline risk** | **MEDIUM** | **Nobody can report it.** With no report control and no logged-out route, an abusive comment is removed only if a moderator happens to see it |
| **Likelihood — post-control** | **Low** | Keyword and pattern filtering before publication; report control on every comment; rate limiting; repeat-offender thresholds |
| **Impact — post-control** | **Medium** | Rapid removal, account restriction, appeal route |
| **Post-control risk** | **LOW** | |

**Controls.** E2, E3, E6 (baseline). Post-control: pre-publication keyword/pattern filtering; report control (test 1); case creation (test 3); **account suspension and ban (test 5)**; appeals (test 7).
**Ofcom measure areas.** Content moderation; reporting and complaints; user controls; terms of service.
**Not adopted.** Blocking and muting between users — **not applicable**: there is no user-to-user contact surface to block.

### 4.4 Hate offences

**Pathway.** Hateful content in a Campaign description or a comment.

| | Score | Reasoning |
|---|---|---|
| **Likelihood — baseline** | **Low** | Campaigns pass human pre-publication review, which catches this reliably. Comments come from a small, identified, institutionally accountable population |
| **Impact — baseline** | **Medium–High** | Harm to targeted groups; a mixed-age audience includes children |
| **Baseline risk** | **LOW–MEDIUM** | Elevated only because comments are post-moderated and unreportable |
| **Post-control risk** | **LOW** | Report control, filtering and removal |

**Controls.** E1, E2 (baseline). Post-control: filtering; report control; removal; account restriction.
**Ofcom measure areas.** Content moderation; reporting and complaints; terms of service.

### 4.5 Encouraging or assisting suicide or serious self-harm

**Pathway.** A Campaign narrative or comment touching on self-harm, or a fundraising appeal framed around a personal crisis in a way that encourages harm.

| | Score | Reasoning |
|---|---|---|
| **Likelihood — baseline** | **Low** | Society Campaigns fundraise for society activities, not personal crises. The primary-purpose rule in Terms of Service clause 8.4 excludes personal appeals. Human review of every Campaign. **Dono does not prompt for health or personal-crisis narratives** and the Appropriate Policy Document forbids soliciting them |
| **Impact — baseline** | **Very high** | Irreversible harm, and the audience includes children |
| **Baseline risk** | **MEDIUM** | Driven by impact |
| **Post-control risk** | **LOW–MEDIUM** | Report control; urgency routing to Priority 1; trained recognition; signposting to support |

**Controls.** E1, E9 (baseline). Post-control: Priority 1 escalation (test 4); report control (test 1); training (test 8).
**Ofcom measure areas.** Content moderation; reporting and complaints; user support.
**Not adopted.** Automated crisis-language detection — disproportionate at scale, and the narrow content scope makes human review adequate. Review trigger if individual Student Campaigns are enabled, since personal-crisis narratives become far more likely.

### 4.6 Proceeds of crime and money laundering

**Pathway.** The Platform used to move criminal proceeds by donating to a controlled Campaign and withdrawing the funds.

| | Score | Reasoning |
|---|---|---|
| **Likelihood — baseline** | **Low** | **The Payment Provider conducts KYC and AML screening on every Connected Account as independent controller.** Direct charges mean Dono never holds funds. Campaign proceeds are tied to a verified Society Representative at a named institution, and expenditure must be evidenced. Small transaction sizes make the route inefficient for laundering |
| **Impact — baseline** | **High** | Criminal exposure; Platform integrity |
| **Baseline risk** | **LOW–MEDIUM** | |
| **Post-control risk** | **LOW** | Evidence and closure procedure; financial-crime escalation; sanctions screening; institutional referral |

**Controls.** E4, E5, E9 (baseline). Post-control: Financial Crime and Sanctions Policy escalation; evidence review; surplus ledger.
**Ofcom measure areas.** Governance and accountability; terms of service.
**Note.** Dono has **no** money-laundering regulated status of its own and no AML obligation. That obligation is the Payment Provider's. Dono must not describe itself as conducting AML.

### 4.7 Terrorism content (Schedule 5)

**Pathway.** Terrorist content in a Campaign or comment, or fundraising for a proscribed organisation.

| | Score | Reasoning |
|---|---|---|
| **Likelihood — baseline** | **Low** | Human pre-publication review of every Campaign and every external link; institutionally connected verified creators; Payment Provider sanctions and financial-crime screening; a plain-text, Society-restricted comment surface with no file or media capability |
| **Impact — baseline** | **Very high** | |
| **Baseline risk** | **MEDIUM** | Driven by impact |
| **Post-control risk** | **LOW–MEDIUM** | Report control; urgency routing; trained recognition; sanctions escalation |

**Controls.** E1, E2, E3, E5, E8 (baseline). Post-control: report control; Priority 1 routing; **URL blocking in comments (OS-22)**.
**Ofcom measure areas.** Governance and accountability; content moderation; automated content moderation (terrorism URL detection); reporting and complaints.
**Not adopted.** Automated terrorism URL detection — scope for a service of Dono's size must be confirmed against the Codes in force. **Recorded as an open decision, not a settled non-adoption.**

### 4.8 Extreme pornography and intimate image abuse

| | Score | Reasoning |
|---|---|---|
| **Likelihood — baseline** | **Low** | Images and video reach the public only through **human pre-publication review**. Comments carry no images or attachments. No private channel |
| **Impact — baseline** | **High** | Severe harm to the person depicted; audience includes children |
| **Baseline risk** | **LOW–MEDIUM** | |
| **Post-control risk** | **LOW** | Report control; Priority 1 routing; image-safety scanning (AL-02) |

### 4.9 Drugs, psychoactive substances, firearms, knives and other weapons

| | Score | Reasoning |
|---|---|---|
| **Likelihood — baseline** | **Low** | No marketplace, no listings, no private messaging. Commercial fundraising is prohibited. Every Campaign is reviewed. A weapons or drugs Campaign would be refused at review |
| **Impact — baseline** | **High** | |
| **Baseline risk** | **LOW–MEDIUM** | |
| **Post-control risk** | **LOW** | Report control; account restriction |

### 4.10 Human trafficking, sexual exploitation of adults, unlawful immigration

| | Score | Reasoning |
|---|---|---|
| **Likelihood — baseline** | **Low** | These offences depend on recruitment, advertisement or private contact. Dono has **no private messaging, no listings, no marketplace and no user-to-user contact surface**. Campaigns are human-reviewed. The Society-purpose and pass-through prohibitions exclude the fundraising structures such offending would use |
| **Impact — baseline** | **Very high** | |
| **Baseline risk** | **LOW–MEDIUM** | |
| **Post-control risk** | **LOW** | Report control; Priority 1 routing; institutional and police referral |

---

## 5. Priority offences with no plausible pathway

Assessed and recorded as **Low likelihood, no specific control required beyond the general moderation controls**, because the service lacks the functionality the offence requires:

| Offence | Why there is no pathway |
|---|---|
| Foreign interference | No political advertising, no recommendation feed, no amplification mechanism, no political campaign category |
| Animal cruelty content | No general media-sharing surface; images pass human review; comments carry no media |
| Controlling or coercive behaviour | Requires a sustained private relationship channel; none exists |
| Unlawful immigration facilitation (advertisement) | No listings, no private contact, no marketplace |
| Epilepsy trolling | No direct-send capability to a specific user; no auto-playing media in comments |

Each becomes a review trigger if Dono introduces private messaging, a media-capable comment surface, a recommendation feed, or a listings or marketplace function.

---

## 6. Summary risk table

| Ref | Offence | Baseline likelihood | Baseline impact | **Baseline risk** | **Post-control risk** |
|---|---|---|---|---|---|
| 4.1 | Fraud and financial offences | Medium | Medium–High | **MEDIUM–HIGH** | **MEDIUM** |
| 4.2 | CSEA | Low | Very high | **MEDIUM** | **LOW–MEDIUM** |
| 4.3 | Harassment, stalking, threats, abuse | Low–Medium | Medium–High | **MEDIUM** | **LOW** |
| 4.4 | Hate offences | Low | Medium–High | **LOW–MEDIUM** | **LOW** |
| 4.5 | Encouraging suicide or serious self-harm | Low | Very high | **MEDIUM** | **LOW–MEDIUM** |
| 4.6 | Proceeds of crime | Low | High | **LOW–MEDIUM** | **LOW** |
| 4.7 | Terrorism | Low | Very high | **MEDIUM** | **LOW–MEDIUM** |
| 4.8 | Extreme pornography, intimate image abuse | Low | High | **LOW–MEDIUM** | **LOW** |
| 4.9 | Drugs, weapons | Low | High | **LOW–MEDIUM** | **LOW** |
| 4.10 | Trafficking, sexual exploitation, immigration | Low | Very high | **LOW–MEDIUM** | **LOW** |

**Overall baseline: MEDIUM, with fraud the principal risk.**
**Overall post-control: LOW–MEDIUM, with fraud remaining MEDIUM.**

**The gap between the two columns is entirely the reporting and moderation system that does not exist.** That is why public user-generated content is launch-blocked.

---

## 7. Ofcom Codes of Practice — measure mapping

| Measure area | Applicable to Dono? | Position |
|---|---|---|
| **Governance and accountability** | Yes | A named accountable individual (Amrit); this assessment; the Online Safety Procedures; a review cycle. **In place at v3.0** |
| **Content moderation** | Yes | Human pre-publication review of every Campaign (**in place, strong**); comment filtering, prioritisation and swift-action systems (**not built**) |
| **Reporting and complaints** | Yes | **Not built.** Acceptance tests 1, 2, 3, 4 and 7 fail. This is the single largest compliance gap |
| **Terms of service** | Yes | Terms of Service, Community Guidelines, Society and Donor Terms specify prohibited content and the action Dono takes. **Drafted; publication gated** |
| **Automated content moderation** — CSAM hash matching, CSAM URL detection, terrorism URL detection | **To be confirmed** | Applicability turns on service size and risk profile under the Codes in force. **Open decision recorded at §4.2 and §4.7 — must be resolved before public UGC is enabled** |
| **User access** — suspension and banning | Yes | **Not built.** Acceptance test 5 partly fails |
| **Recommender systems** | **No** | Dono operates no recommendation feed |
| **User controls** — blocking, muting | **No** | No user-to-user contact surface exists to block or mute |
| **Enhanced user control** | **No** | Not applicable to this service type |
| **User support** — signposting to help | Partly | Required for §4.5. **Not built** |

> **Verification required.** The exact Ofcom measure references and their applicability thresholds for a service of Dono's size and risk profile **must be confirmed against the version of the Illegal Content Codes of Practice in force at the date of approval.** This mapping identifies measure areas; it does not assert specific measure numbers.

---

## 8. Conclusion

1. **The service's structural design is genuinely low-risk for most priority offences.** The absence of private messaging, livestreaming, groups, media-capable comments and a recommendation feed removes the pathways that carry most illegal content on general platforms. The narrow, identified, institutionally accountable authoring population and human pre-publication review are real and evidenced controls.

2. **Fraud is the principal risk and is inherent to crowdfunding.** It is reduced but not eliminated by identity verification, institutional connection, pre-publication review, expenditure evidence and the refund mandate. It remains **MEDIUM** post-control, and that residual is accepted.

3. **CSEA, terrorism and suicide-encouragement carry very high impact at low likelihood.** Their ratings are driven by impact, correctly, and cannot be reduced below Low–Medium by process alone.

4. **The reporting and moderation system does not exist.** Users cannot report; logged-out readers — the majority of the audience — cannot report at all; nothing escalates urgently; accounts cannot be restricted; there is no appeal. **This is not a partial gap. It is the absence of the primary safety mechanism the Act requires.**

5. **The NCA CSEA reporting route is not confirmed operational**, so the section 66 duty cannot presently be discharged through the portal.

6. **The launch block on public user-generated content is correct and must hold.** Nothing in the evidence supports relaxing it.

---

## 9. Actions before public user-generated content is enabled

| # | Action | Gate |
|---|---|---|
| 1 | Pass acceptance tests 1–8 in `dono-online-safety-procedures-v3.0.md`, each with dated evidence and a named approver | **BLOCKING** |
| 2 | Confirm NCA CSEA portal registration and eligible users; complete training and a test submission | **BLOCKING** |
| 3 | Resolve the automated content moderation decision at §4.2 and §4.7 against the Codes in force, and record the reasoning | **BLOCKING** |
| 4 | Implement malware and image-safety scanning on every upload path (AL-02) | **BLOCKING** |
| 5 | Block URLs in comments (OS-22) | **BLOCKING** |
| 6 | Build account suspension and ban (test 5) | **BLOCKING** |
| 7 | Extend audit logging to refund decisions, role changes and account deletion, with an export route (test 6) | High |
| 8 | Deliver moderator training and run an incident drill (test 8) | **BLOCKING** |
| 9 | Verify Ofcom measure references and applicability thresholds against the Codes in force | **BLOCKING** |
| 10 | **Re-perform this assessment** on the evidence and re-score before approval | **BLOCKING** |

---

## 10. Approval block — SIGNATURE REQUIRED

> **This block is unsigned. This assessment is not approved, and public user-generated content remains disabled.**

**I confirm that I have performed this illegal content risk assessment against the service as it actually exists, that no rating credits an unbuilt control, that I have scored likelihood and impact separately for each priority offence, that I have mapped mitigations to the applicable Ofcom measure areas and recorded the reason for any measure not adopted, and that I approve this assessment.**

| Field | Entry |
|---|---|
| Approver name | Amrit Kaur Rooprai |
| Role | Online Safety lead and service provider |
| Document version approved | 3.0 |
| Assessment performed against | The service as at 7 August 2026, on engineering evidence of 5 August 2026 |
| Overall baseline risk | **MEDIUM** |
| Overall post-control risk | **LOW–MEDIUM** |
| Public user-generated content enabled? | ☐ Yes, on ____________ · ☑ **No** |
| Ofcom measure references verified against the Codes in force? | ☐ Yes, on ____________ · ☑ **No** |
| Signature | ______________________ |
| Date of approval | ______________________ |

**Reviewed by:** Sashank (deputy) — Signature ______________________  Date ______________

---

## 11. Version control

| Field | Entry |
|---|---|
| Version | 3.0 |
| Version date | 7 August 2026 |
| Effective from | On publication approval |
| Accountable owner | Amrit Kaur Rooprai |
| Prepared by | Legal consolidation, 7 August 2026 — **re-performed**, not carried forward |
| Approved by | *(signature required — section 10)* |
| Status | **Not approved.** Launch block in force |
| Supersedes | v2.3 (6 August 2026) and all earlier versions |
| Next scheduled review | 7 February 2027, on any material product change, on any serious incident, and before public user-generated content is enabled |
