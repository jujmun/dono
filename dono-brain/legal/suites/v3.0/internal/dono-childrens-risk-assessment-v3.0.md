# Children's Risk Assessment — Dono

**Document:** Children's risk assessment, Online Safety Act 2023 sections 11 and 25
**Version:** 3.0
**Version date:** 7 August 2026
**Effective from:** on publication approval (see approval block)
**Service provider:** Amrit Kaur Rooprai, sole trader, trading as Dono
**Online Safety lead:** Amrit Kaur Rooprai · **Deputy:** Sashank
**Supersedes:** v2.3 (6 August 2026) and all earlier versions, retained unaltered in the version archive
**Status:** **Re-performed** clean assessment. States the current position only.
**Next review:** 7 February 2027, after the first six months of operation, on any material product change, and **before public user-generated content is enabled**.

> **This is not the ICO Children's Code assessment.** The Age Appropriate Design Code is a separate statutory data-protection assessment and is **not** satisfied by this document. See `dono-ico-childrens-code-assessment-v3.0.md`.

---

## 1. Children's access assessment — is this service likely to be accessed by children?

| Question | Answer |
|---|---|
| Is it possible for children to access the service, or part of it? | **Yes.** Anyone of any age may view public Campaign pages and read comments without logging in. Campaign links are shareable and indexed |
| Are there age-assurance measures that prevent children accessing it? | **No.** Dono operates **no age assurance on browsing at all.** Account creation, commenting and donating are gated, but reading is not |
| Is there a significant number of child users, or is the service of a kind likely to attract children? | **Yes, in kind.** Dono is a **student** fundraising platform. Its content is authored by university societies, shared through university and social networks, and concerns student life. Sixth-formers considering university, siblings and school-age friends of members are a natural readership. Campaigns are shared on social platforms where the audience skews young |

**Conclusion: children are likely to access the service. This assessment is required and Dono operates as a service likely to be accessed by children.**

A declared date of birth is **not** highly effective age assurance, so Dono cannot and does not conclude that it excludes under-18s.

---

## 2. Age bands considered

| Band | Presence on Dono | What they can do |
|---|---|---|
| **Under 13** | Possible but uncommon. Would arrive incidentally — a shared link, a sibling's campaign | Read Campaign pages and comments. Cannot create an account, comment or donate lawfully |
| **13–15** | **Plausible and expected.** Active on the social platforms through which Campaigns are shared | Read everything. May attempt to donate using a parent's or their own card. May attempt to create an account |
| **16–17** | **The most likely child cohort.** Sixth-formers researching universities, applicants, prospective members, younger siblings of students. May have their own debit card and independent spending | Read everything. **Most likely to attempt a donation** and most likely to be able to complete one on a real card. May be close enough to 18 that a false declaration feels trivial |
| **Adults (18+)** | The intended user base | Full access |

**The assessment is weighted towards 16–17**, because that band has both the motivation to engage with student fundraising and the practical means to complete a payment.

---

## 3. Child user journeys

These are the ways a child actually encounters Dono. Each is assessed in section 5.

| # | Journey | What happens |
|---|---|---|
| **J1** | **Arrives via a shared link** — from Instagram, a group chat, a sibling, a school friend | Lands directly on a public Campaign page. No sign-in, no age question, no interstitial. **Nothing on the journey establishes or asks their age** |
| **J2** | **Browses a Campaign page** | Reads the campaign narrative, sees images, may watch an embedded video, may follow an external link, sees the funding progress and the donor list with amounts |
| **J3** | **Reads comments** | Sees plain-text comments from approved Society members. No links, images or attachments. Comments are **post-moderated**, so they are publicly visible before any review |
| **J4** | **Attempts to donate** | Reaches checkout, is presented with the recipient panel, the fee breakdown and the **18-or-over and capacity confirmation**. **A false tick lets the donation proceed.** The card is the only remaining obstacle |
| **J5** | **Attempts to create an account** | Asked for a declared date of birth. An under-18 date blocks creation. **A false date does not.** No verification |
| **J6** | **Attempts to comment** | Requires an account **and** approved membership of the owning Society — a real-world institutional check that a child is very unlikely to pass |
| **J7** | **Attempts to create a Campaign** | Requires an account, Society Representative status, institutional email verification **and** the Payment Provider's identity check. **The government-document date of birth is a fail-closed final gate.** A child cannot pass this |
| **J8** | **Encounters something harmful and wants to report it** | **There is no report control on any content, and no logged-out reporting route. A child currently has no way to report anything.** This is the most serious child-safety gap on the service |
| **J9** | **A parent or guardian discovers a donation** | May contact Dono to ask about, correct or delete the child's data, and to request a refund. Being under 18 at the time of donation is an **objective refund ground** requiring no proof of materiality, reliance or causation |

---

## 4. Method

Likelihood and severity are **scored separately with the reasoning stated**, against **implemented controls only**. For each risk the assessment records the **specific control** that reduces it and the **evidence that the control works**, referencing the test that demonstrates it. Where a control is unbuilt, it is recorded as unbuilt and is **not** credited.

**Likelihood:** Low · Medium · High. **Severity:** Low · Medium · High · Very high.

---

## 5. Harm assessment

### C1 — Financial exploitation of a child donor · **THE PRINCIPAL CHILD RISK**

**The harm.** A child, most likely aged 16–17, donates money they cannot afford or do not have permission to spend, in response to an emotionally compelling campaign narrative. Journey J4.

| | Score | Reasoning |
|---|---|---|
| **Likelihood** | **Medium** | Every upstream control — creator identity verification, institutional connection, human pre-publication review — sits **before publication**, not at the point of payment. Nothing between a child reading a campaign and completing a payment establishes their age except a tick box. A 16–17 year old with a debit card can complete a donation by ticking a box that is untrue. Campaign narratives are, by design, persuasive |
| **Severity** | **Medium** | Real financial loss to a child, and potential family conflict. Bounded by: typical donation sizes are small; a refund route exists; and a card issuer's own protections may apply. Not bounded by any Dono control at the moment of payment |
| **Risk** | **MEDIUM** | |

**Implemented controls.** Human pre-publication review of every Campaign, which screens for content unsuitable for a mixed-age audience and not only for fraud (**evidence: verified 5 August 2026**). No gamified donation mechanics and no youth-specific targeting (**evidence: product design review**). The prohibition on personal-crisis and commercial fundraising, which removes the most emotionally coercive campaign types (**Terms of Service 8.3, 8.4**).

**Control not implemented.** The **18-or-over confirmation is a hard-coded constant**, so at the version date it is **not a control and is not scored as one** (checklist AG-01, CH-04). Once built as a real, actively given confirmation, it becomes a genuine but limited mitigation.

**Remedy, stated with its limits.** A refund is available on an objective ground. Under Terms of Service clause 13.2 **Dono may itself instruct the Payment Provider to reverse the charge** under the refund mandate, which is materially stronger than depending on the Campaign Owner's cooperation. **But the remedy remains limited by the funds in the Connected Account** — if the money has been spent or withdrawn, the mandate cannot reach it. The remedy is real, and it is not a guarantee.

**Residual: MEDIUM.** **Expressly accepted** — recorded as accepted residual risk A2 in the DPIA §8. Verified age assurance for donors is assessed as disproportionate for a Society-only beta in which the payment instrument is ordinarily an adult instrument, and would require collecting more identity data from every donor than the risk warrants. **Reviewed after the first six months of operation, and immediately on any evidence of actual under-18 donation volume or any change in Ofcom's expectations on age assurance for this service type.**

### C2 — A child cannot report harmful content

**The harm.** A child encounters content that distresses or endangers them and has no way to tell anyone. Journey J8.

| | Score | Reasoning |
|---|---|---|
| **Likelihood** | **High** | Not "likely that harmful content appears" — **certain that if it appears, a child cannot report it.** There is no report control on any content and no logged-out route. Most child readers are logged out, so even a future logged-in-only control would not reach them |
| **Severity** | **High** | A child's route to protection is closed. In a CSEA, grooming or self-harm scenario the consequence is severe |
| **Risk** | **HIGH** | |

**Implemented controls.** **None.** Pre-publication review reduces the chance that harmful campaign content is published, but comments are post-moderated and nothing gives a child a voice.

**Controls required.** A visible report control on every item of user-generated content (**test 1**); a reporting route that works logged out (**test 2**); automatic case creation (**test 3**); urgent escalation for child-safety concerns (**test 4**). All four currently fail.

**Residual on evidence: LOW–MEDIUM.** **Residual today: HIGH.** This risk alone justifies the launch block.

### C3 — Exposure to harmful or age-inappropriate campaign content

**The harm.** A child reads a Campaign containing material unsuitable for their age. Journey J2.

| | Score | Reasoning |
|---|---|---|
| **Likelihood** | **Low** | **Every Campaign — text, images, documents, full video and every external link — is reviewed by a person before publication and again after any material edit.** This is Dono's strongest control and it is genuinely implemented. Society fundraising content is intrinsically low-risk: equipment, trips, events, kit, performances |
| **Severity** | **Medium** | Distress or inappropriate exposure, without a contact or escalation pathway attached |
| **Risk** | **LOW** | |

**Implemented controls and evidence.** Human pre-publication review (**verified 5 August 2026**); re-review after material edit; explicit instruction to review for a mixed-age audience; the Community Guidelines content rules; the prohibition on soliciting sensitive personal narratives (**Appropriate Policy Document §6.3**).

**Gap.** **No malware or image-safety scanning on any upload path** (AL-02), so review is entirely manual and depends on the reviewer.

**Residual: LOW.**

### C4 — Exposure to harmful comments

**The harm.** A child reads abusive, hateful or distressing comments. Journey J3.

| | Score | Reasoning |
|---|---|---|
| **Likelihood** | **Low** | **Commenting is restricted to approved members of the Society that owns the Campaign.** The population able to post is small, identified, institutionally accountable and known to each other — not open to any account holder. This was the single largest correction to earlier assessments, which wrongly assumed an open commenting surface. Comments are **plain text only**: no links, images or attachments |
| **Severity** | **Medium** | Distress, unmediated by any support pathway a child can reach |
| **Risk** | **LOW** | Elevated above negligible only because comments are **post**-moderated and **unreportable** |

**Implemented controls and evidence.** Society-member-only commenting (**verified 5 August 2026**); plain-text only, attachments and images blocked (**verified 5 August 2026**); administrator ability to hide a comment.

**Gaps.** **URLs are not blocked in comments** (OS-22), so a comment can carry a link to anything, and a child can follow it. No report control (C2). No keyword or pattern filtering before publication. No account restriction, so a repeat offender can only be deleted or left alone.

**Residual on evidence: LOW. Residual today: LOW–MEDIUM**, driven by the URL gap and unreportability.

### C5 — Contact harms: grooming, coercion, unwanted contact

**The harm.** An adult uses the service to contact, groom or coerce a child.

| | Score | Reasoning |
|---|---|---|
| **Likelihood** | **Low** | **Structural, not operational.** Dono has **no private messaging, no direct messages, no livestreaming, no private or invite-only groups, no disappearing content, no friend or follow mechanic, and no user profile visible to strangers beyond a display name.** The only user-to-user surface is a public, plain-text comment thread restricted to approved Society members. **There is no channel through which contact offending could be conducted** |
| **Severity** | **Very high** | |
| **Risk** | **LOW–MEDIUM** | Driven entirely by severity, not by any identified pathway |

**Implemented controls.** The absence of the functionality itself — the strongest form of control, because it cannot fail operationally.

**Residual: LOW–MEDIUM.** **Review trigger: any proposal to introduce private messaging, direct contact, follows, or a media-capable comment surface must be assessed against this risk before it is built.**

### C6 — A child creates a Campaign or an account

**The harm.** A child takes on the obligations of a Campaign Owner, or holds an account they are not permitted to hold. Journeys J5, J7.

| | Score | Reasoning |
|---|---|---|
| **Likelihood — Campaign creation** | **Low** | The **Payment Provider's government-document date of birth is the fail-closed final creator age gate.** Missing, inconsistent and under-18 results block onboarding. There is **no manual override**. A child cannot pass this |
| **Likelihood — account creation** | **Medium** | Account creation is gated only by a **declared** date of birth. A false date is not detected. Commenting additionally requires approved Society membership (J6), which a child is very unlikely to obtain, so the practical consequence of a false account is limited to reading — which a child can do anyway without one |
| **Severity** | **Medium** | For Campaign creation, high — financial and legal obligations. For a bare account, low, because it unlocks almost nothing a logged-out reader lacks |
| **Risk** | **LOW** for Campaign creation · **LOW–MEDIUM** for account creation | |

**Implemented controls and evidence.** Fail-closed verified-DOB creator gate (**settled 6 August 2026**); institutional email verification; approved-Society-membership requirement for commenting (**verified 5 August 2026**); declared date of birth at account creation.

**Residual: LOW.**

### C7 — A child's personal data is processed without an appropriate basis

**The harm.** Dono processes a child's data because they falsely declared their age.

| | Score | Reasoning |
|---|---|---|
| **Likelihood** | **Medium** | Follows directly from C1 and C6 |
| **Severity** | **Medium** | Dono collects **no more from a child than from any other user**: name, email, amount, display preference. **No profiling. No inference of characteristics from donation history. No marketing without opt-in.** No special category data is solicited |
| **Risk** | **LOW–MEDIUM** | |

**Implemented controls.** Data minimisation by design; the closed no-inference rule (**Appropriate Policy Document §10**); consent-gated analytics with no identify call and no session replay; a parent or guardian route to access, correct and delete.

**Cross-reference.** Fully assessed in `dono-ico-childrens-code-assessment-v3.0.md` and in the DPIA at risk L-15.

**Residual: LOW–MEDIUM.**

### C8 — Nothing escalates an urgent child-safety concern

**The harm.** An urgent child-safety matter sits unseen because no system surfaces it.

| | Score | Reasoning |
|---|---|---|
| **Likelihood** | **High** | **There is no monitoring or alerting of any kind.** Nothing escalates anything. Detection depends entirely on a person happening to look |
| **Severity** | **High** | Delay in a child-safety matter is itself the harm |
| **Risk** | **HIGH** | |

**Implemented controls.** **None**, other than a small team likely to notice a small volume of activity — which is not a control and is not scored as one.

**Controls required.** Urgent escalation routing (**test 4**); alerting (**AL-01**); the escalation pathway in Online Safety Procedures §3.3; moderator training (**test 8**).

**Residual on evidence: LOW–MEDIUM. Residual today: HIGH.**

### C9 — CSEA material encountered by or concerning a child

| | Score | Reasoning |
|---|---|---|
| **Likelihood** | **Low** | Assessed at Illegal Content Risk Assessment §4.2. No private channel, no anonymous upload, plain-text Society-restricted comments, human review of all media |
| **Severity** | **Very high** | |
| **Risk** | **MEDIUM** | Driven by severity, and elevated because the statutory reporting route is unconfirmed |

**Gap.** **NCA CSEA portal registration is not confirmed.** The section 66 duty is absolute once content is detected. **The 999 and local police route is the operative route until registration is confirmed, trained and test-submitted.** No image-safety or malware scanning exists (AL-02).

**Residual on evidence: LOW–MEDIUM. Residual today: MEDIUM.**

---

## 6. Summary

| Ref | Harm | Likelihood | Severity | **Risk today** | **Risk on evidence** |
|---|---|---|---|---|---|
| C1 | Financial exploitation of a child donor | Medium | Medium | **MEDIUM** | **MEDIUM — accepted** |
| C2 | A child cannot report harmful content | High | High | **HIGH** | **LOW–MEDIUM** |
| C3 | Exposure to harmful campaign content | Low | Medium | **LOW** | **LOW** |
| C4 | Exposure to harmful comments | Low | Medium | **LOW–MEDIUM** | **LOW** |
| C5 | Contact harms — grooming, coercion | Low | Very high | **LOW–MEDIUM** | **LOW–MEDIUM** |
| C6 | A child creates a Campaign or account | Low / Medium | Medium | **LOW / LOW–MEDIUM** | **LOW** |
| C7 | A child's data processed without a basis | Medium | Medium | **LOW–MEDIUM** | **LOW–MEDIUM** |
| C8 | Nothing escalates an urgent concern | High | High | **HIGH** | **LOW–MEDIUM** |
| C9 | CSEA material | Low | Very high | **MEDIUM** | **LOW–MEDIUM** |

**Two risks are HIGH today: C2 and C8.** Both are the absence of the reporting and escalation system. Both fall to Low–Medium once acceptance tests 1–4 pass.

**One risk is accepted and does not fall: C1**, at MEDIUM.

---

## 7. Why Dono is lower risk than a typical platform accessed by children

Recorded so that the low ratings on C3, C4, C5 and C6 are transparent rather than assumed:

1. **No private messaging, direct messages or user-to-user contact of any kind.** Removes the primary vector for grooming and coercion.
2. **No livestreaming, no disappearing content, no private groups.** Removes the formats associated with the most serious children's online harms.
3. **No recommendation feed and no algorithmic amplification.** A child is never served content by a system optimising for engagement.
4. **Commenting restricted to approved Society members**, so the posting population is small, identified and institutionally accountable.
5. **Plain-text comments only.** No images, files or attachments.
6. **Human review of every published Campaign**, including full video and every external link.
7. **Creators gated on a government-document date of birth**, fail-closed.
8. **No behavioural profiling of any user, and a closed rule against inferring characteristics from donation history.**
9. **No advertising, no advertising integrations, no third-party trackers.**
10. **Narrow content scope** — society fundraising for equipment, trips, events and activities.

**None of this changes the fact that children can read everything, cannot report anything, and can complete a payment by ticking a box.** That is what the ratings on C1, C2 and C8 record.

---

## 8. Actions before public user-generated content is enabled

| # | Action | Addresses | Gate |
|---|---|---|---|
| 1 | Report control on every item of user-generated content (test 1) | C2 | **BLOCKING** |
| 2 | Logged-out reporting route (test 2) | C2 | **BLOCKING** |
| 3 | Automatic case creation with content version (test 3) | C2 | **BLOCKING** |
| 4 | Urgent escalation and alerting for child-safety concerns (test 4, AL-01) | C2, C8 | **BLOCKING** |
| 5 | Build the real 18-or-over confirmation; remove the hard-coded constant (AG-01, CH-04) | C1, C7 | **BLOCKING** |
| 6 | Confirm NCA CSEA registration; train and test-submit | C9 | **BLOCKING** |
| 7 | Malware and image-safety scanning on upload paths (AL-02) | C3, C9 | **BLOCKING** |
| 8 | Block URLs in comments (OS-22) | C4 | **BLOCKING** |
| 9 | Keyword and pattern filtering before comment publication | C4 | High |
| 10 | Account suspension and ban (test 5) | C4 | **BLOCKING** |
| 11 | Moderator training including child-safety recognition, and an incident drill (test 8) | C2, C8, C9 | **BLOCKING** |
| 12 | Publish the parent and guardian route clearly, including the refund ground | C1, C7 | High |
| 13 | Approve the ICO Children's Code assessment | C7 | **BLOCKING** |
| 14 | **Re-perform this assessment** on the evidence and re-score before approval | All | **BLOCKING** |

---

## 9. Review triggers

Revisit immediately if Dono: introduces direct messaging or any private contact channel; opens Campaign creation to under-18s; permits links, images or attachments in comments; changes the donor age control; enables individual Student Campaigns, which make personal-crisis narratives far more likely; introduces a recommendation feed; or if evidence emerges that a significant proportion of readers or donors are children. Also on any change to Ofcom's expectations on age assurance for this service type, and after the first six months of operation.

---

## 10. Approval block — SIGNATURE REQUIRED

> **This block is unsigned. This assessment is not approved, and public user-generated content remains disabled.**

**I confirm that I have performed this children's risk assessment against the service as it actually exists, that I have considered the age bands and child user journeys set out above, that I have scored likelihood and severity separately with reasoning, that no rating credits an unbuilt control, that I have identified the specific implemented control and its evidence for each risk, and that I approve this assessment.**

| Field | Entry |
|---|---|
| Approver name | Amrit Kaur Rooprai |
| Role | Online Safety lead and service provider |
| Document version approved | 3.0 |
| Children's access conclusion | **Likely to be accessed by children** |
| Assessment performed against | The service as at 7 August 2026, on engineering evidence of 5 August 2026 |
| Risks rated HIGH today | **C2** (a child cannot report) and **C8** (nothing escalates) |
| Residual risk expressly accepted | **C1 — financial exploitation of a child donor, MEDIUM.** Also recorded as DPIA accepted residual risk A2 |
| ICO Children's Code assessment separately approved? | ☐ Yes, on ____________ · ☑ **No** |
| Public user-generated content enabled? | ☐ Yes, on ____________ · ☑ **No** |
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
| Next scheduled review | 7 February 2027, after six months of operation, on any material product change, and before public user-generated content is enabled |
