# ICO Children's Code (Age Appropriate Design Code) Assessment — Dono

**Document:** Standalone Children's Code conformance assessment
**Version:** 3.0
**Version date:** 7 August 2026
**Effective from:** on publication approval (see approval block)
**Controller:** Amrit Kaur Rooprai, sole trader, trading as Dono
**Accountable owner:** Amrit Kaur Rooprai (data protection lead) · **Deputy:** Sashank
**Supersedes:** `../../../generated/childrens-code-assessment/dono-ico-childrens-code-assessment-2026-08-06.md` (6 August 2026, prepared by Midpage Legal Research), retained unaltered as the historical baseline
**Status:** Clean consolidated assessment, **materially corrected**. States the current position only.
**Next review:** at three and six months after launch, then 7 February 2027, or on any review trigger.

> **This is a separate statutory data-protection assessment.** It is not satisfied by the DPIA or by the Online Safety Act Children's Risk Assessment, and neither of those is satisfied by this. All three are cross-referenced and must be read together.

---

## 1. What changed at v3.0, and why it matters

The 6 August 2026 assessment was prepared on the premise that **"people under 18 may browse and donate"**. That premise is **no longer correct** and its consequences ran through the whole document.

**The settled position is that Donors must be 18 or over.** A person may donate only if they actively confirm that they are 18 or over and have legal capacity. **Parent or guardian permission is not an alternative.** An under-18 donation is not a permitted category of use to be managed with caps and limits — **it is a rule breach and an objective refund ground**.

Consequences for this assessment:

| Superseded position | Corrected position |
|---|---|
| Enforce under-18 one-off and rolling donation limits | **Deleted.** There is no permitted under-18 donation to cap. Capping would imply the transaction is allowed |
| Block recurring gifts by under-18s | **Deleted.** Recurring donations do not exist in the product at all, for any user |
| No optional analytics or institutional sharing for under-18s | **Reframed.** Analytics restrictions apply to **all unknown-age visitors**, because Dono does not and will not identify who is a child |
| A checkout "age/permission" declaration | **Corrected.** It is an **age and capacity** declaration. It is not a parental-permission mechanism and must never be presented as one |
| Verified parental consent for under-13 consent-based processing | **Avoided by design.** Dono offers **no** consent-based optional processing to any visitor of unknown age beyond analytics, which is being restricted to a non-identifying configuration |
| Student-card processing | **Deleted.** Dono collects no student cards, student numbers or identity documents |
| Stripe Identity "not a reliable Dono age gate" | **Corrected.** The Payment Provider's government-document date of birth **is** the settled fail-closed final age gate **for creators**. It is not, and cannot be, a gate for donors or visitors |

Everything else in the 6 August analysis of the 15 standards is sound and is carried into section 4 with the factual corrections applied.

---

## 2. Scope — does the Code apply?

**Yes. Dono should proceed on the basis that the Children's Code applies.**

| Test | Position |
|---|---|
| Is Dono an information society service? | **Yes.** A service normally provided for remuneration, at a distance, by electronic means, at the individual request of a recipient. Dono charges a platform fee |
| Is it likely to be accessed by children? | **Yes.** Public Campaign pages are available without authentication. Content is authored by university societies and shared through social networks with a young audience. Sixth-formers, applicants and younger siblings are a natural readership. Dono's own Online Safety children's access assessment reaches the same conclusion |
| Does not targeting children remove Dono from scope? | **No.** Nor does restricting accounts to adults. The test is whether children are **likely to access** the service, not whether they are welcome |

**Legal status.** The Code is a **statutory code of practice**, not a separate set of offences. Its 15 standards explain how the ICO expects the UK GDPR and PECR to apply. Non-conformance is not automatically a standalone breach, but it makes it materially harder to demonstrate fairness, transparency, accountability, data protection by design and lawful processing. Since June 2026 the **Data (Use and Access) Act 2025** amendments are fully in force and expressly require in-scope information society services to take children's higher-protection matters into account when designing processing.

---

## 3. Risk profile

**Dono's beta risk is materially lower than a typical social or content platform.** It has **no direct messaging, no recommender feed, no behavioural advertising, no livestreaming, no precise geolocation, no private groups, no disappearing content, no recurring donations and no matched funding.** Campaigns are human-reviewed before publication. Comments are plain text from approved Society members only. Donors can use the service without an account.

**The Children's Code risks that remain are narrow:**

1. **A child can complete a donation by making a false declaration.** No control sits at the point of payment.
2. **Individual donation amounts and timing may be displayed publicly**, creating avoidable re-identification and peer-pressure risk in a small university community.
3. **Analytics consent can be given by a visitor whose age is unknown**, including a child under 13 who cannot independently give UK GDPR consent for an information society service.
4. **The long-form Privacy Notice is not sufficient on its own for a child reader.**
5. **Several launch-critical controls are documented but not built.** Publishing claims before implementation is itself a fairness and accuracy problem.

---

## 4. Assessment of the 15 standards

Each standard records the ICO expectation, its application to Dono, the required action, and a classification distinguishing **legal requirement** from **ICO Code approach** from **best practice**.

### Standard 1 — Best interests of the child

**Application.** The relevant child interests are privacy, protection from economic exploitation and unfair pressure, freedom to support community causes, access to understandable information, and an effective remedy where a payment was not authorised. Dono's absence of private messaging and algorithmic promotion, its human campaign review, and its objective refund ground support those interests. **Public display of granular donation activity and persuasive donation prompts cut the other way.**

**Required action.** Record a short **best-interests decision** for each beta feature that uses donor data or changes checkout: the child benefit, the privacy impact, the commercial interest, less intrusive alternatives, and the decision owner. **Do not treat donation conversion as outweighing a child's privacy or financial welfare.**

**Classification.** Considering children in design is a **legal requirement** under Article 25 as amended. Treating best interests as the primary design consideration and documenting the balancing method is the **ICO Code approach**. Child user-testing of checkout is **best practice**.

### Standard 2 — Data protection impact assessments

**Application.** Dono has a general DPIA and an Online Safety children's risk assessment. **Neither substitutes for a Children's Code assessment.** This document supplies the standalone Code analysis. The DPIA cross-references it and remains separate.

**Required action.** Approve this assessment before launch; enter its controls into the engineering and compliance tracker; amend the DPIA only where this assessment changes the description, lawful basis or residual risk of processing.

**Classification.** A DPIA is a **legal requirement** where processing is likely to result in high risk. The ICO's expectation that an in-scope child-accessed service completes one addressing all 15 standards is **ICO guidance**. Publishing the full DPIA is **best practice**; a concise summary suffices.

### Standard 3 — Age-appropriate application

**Application.** A self-declared date of birth is a **weak age signal**, adequate only as friction for an otherwise low-risk adult account. It is not proof of age.

**Two distinct gates must not be conflated:**

- **Creators.** The Payment Provider's **government-document date of birth is the settled fail-closed final age gate.** Missing, inconsistent or under-18 results block onboarding, with no manual override. This is a genuine age control and is properly relied on.
- **Donors and visitors.** There is **no age assurance of any kind**. The checkout declaration is not age assurance and must never be described as such.

Because most beta protections can be applied universally without impairing the service, **an all-user high-privacy baseline is more proportionate than collecting identity documents or biometric age estimates from donors and visitors.**

**Required action.** Adopt the universal baseline in section 5. Keep account creation at 18-or-over with neutral date-of-birth entry, and **prevent immediate re-entry after a failed age attempt**. Do not describe any donor-side control as verified age assurance or highly effective age assurance. Treat institutional email verification as an eligibility control, not proof of age.

**Classification.** The underlying fairness, accountability and Article 25 obligations are **legal requirements**. The choice between proportionate age assurance and applying the standards to all users is **ICO guidance**. General identity-document or biometric age verification for beta donors is not legally required on this risk profile and would be disproportionate.

### Standard 4 — Transparency

**Application.** The Privacy Notice is comprehensive but written for adults and dense with legal and operational detail. A child reader is unlikely to understand from it what is collected, what becomes public, what the Payment Provider and the recipient see, whether analytics runs, and how to get help. The Donor Terms are far too long to serve as checkout notice.

**Required action.** Publish a **short child-friendly privacy summary** aimed primarily at 13–17-year-old readers, with a parent and carer section and a route to the full notice. Add **just-in-time explanations** at: the analytics choice; the donation display choice; the age and capacity confirmation; and any future institutional sharing. The checkout notice must explain in plain language that **Dono and the Payment Provider will process the donation, the recipient may see payment details, public display is optional, donations are for adults only, and a parent may request a refund where a child donated.**

**Classification.** Clear, intelligible privacy information is a **legal requirement** under Articles 12–14. A separate child-friendly layer and just-in-time notices are the **ICO Code's expected method**. Cartoons, video and gamification are optional **best practice** and unnecessary for a predominantly teen readership.

### Standard 5 — Detrimental use of data

**Application.** Dono does not use child data to recommend harmful content or to advertise. Risk would arise if donation history, social proof, countdowns or inactivity notifications were personalised to pressure repeat giving. **Publicly visible donor amounts create comparison and peer-pressure effects** in a small university community.

**Required action.** Do not personalise donation prompts using any individual's history. Do not send donation-conversion or inactivity notifications. Do not rank or recommend campaigns using individual behaviour. **Do not use "friends donated", scarcity, streaks, countdowns or guilt-based copy anywhere.** Apply these platform-wide, because Dono cannot identify who is a child.

**Classification.** Fairness and the prohibition on detrimental processing rest on **legal requirements**. The specific product restrictions are **ICO-guided controls**. Applying them platform-wide is proportionate **best practice** and simpler than maintaining two journeys.

### Standard 6 — Policies and community standards

**Application.** The written package contains strong commitments, but **multiple controls are unbuilt** — the real checkout confirmation, automated retention, deletion logging, report controls, appeals. **Publishing claims before implementation is a direct fairness and accuracy problem**, and is why the publication gate exists.

**Required action.** **Do not publish any document until each factual claim has an implementation owner and evidence.** Launch only after the age confirmation record, public-display defaults, retention promises and complaint and report routes work end to end. Maintain a **monthly sample audit** of checkout records, privacy choices, child-related refunds and moderation response times.

**Classification.** Processing fairly, transparently and for stated purposes is a **legal requirement**. "Say what you do and do what you say" is the **ICO Code formulation**. Monthly sampling is **best practice**.

### Standard 7 — Default settings

**Application.** Consent-gated analytics off by default, and no institutional sharing, are positive. **The material gap is public donation activity**: hiding a name while publishing an exact amount and precise timestamp can still identify a donor in a small university community. Public comment names are acceptable because commenting is restricted to approved adult Society members and is an intentionally public act.

**Required action.** **Default every donation to no public name, no individual amount and no precise timestamp.** Show campaign totals and aggregate donor counts. Offer an optional, **unticked** "show my support publicly" control with a plain explanation; if activated, let the user choose name and/or amount. Keep analytics, marketing and any future personalisation off by default. **Preserve choices across updates.**

**Classification.** Article 25(2) data protection by default is a **legal requirement**. "High privacy" and the compelling-reason test are **ICO Code guidance**. Suppressing granular public donation data for all users is a proportionate implementation of both, not gold-plating.

### Standard 8 — Data minimisation

**Application.** A guest donor needs to provide only what is necessary to process and evidence the donation, send a receipt, and operate refunds and fraud controls. Account profile fields, institutional details and broad behavioural telemetry are not necessary. **A full date of birth at checkout would create additional identity data without establishing anything** — a binary age and capacity declaration is less intrusive and achieves the same evidential purpose.

**Required action.** For guest donations collect **only**: name, email address, Payment Provider identifiers, amount, campaign, time, display choice, the age and capacity declaration, and necessary fraud and security data. **Do not collect a full date of birth from guest donors.** Disable approximate-location capture, autocapture and unapproved analytics default properties. **Enforce the retention schedule before making any public promise about it.**

**Classification.** Data minimisation, purpose limitation and storage limitation are **legal requirements**. The service-element analysis and separate product choices are **ICO guidance**. Omitting date of birth at donor checkout is proportionate **best practice**.

### Standard 9 — Data sharing

**Application.** Necessary payment sharing with the Payment Provider, card networks and the Connected Account recipient is justifiable to complete a requested donation, provided it is transparent and limited. **Public disclosure and institutional relationship-building are not necessary.**

**Required action.** **Institutional data sharing is disabled entirely and must not be built for beta.** Because Dono cannot reliably identify who is a child, a consent-based sharing feature cannot be offered safely. Contractually prohibit Campaign Owners from using payment details to identify, contact or pressure a donor who chose not to be named, and enforce it by suspension. Record recipient categories clearly in the child-friendly notice, **including the honest disclosure that a recipient may see a hidden donor's name in their own Payment Provider account**.

**Classification.** A lawful basis, transparency and processor and controller compliance are **legal requirements**. The compelling-reason standard is **ICO guidance**. A beta-wide pause on institutional sharing is proportionate.

### Standard 10 — Geolocation

**Application.** Dono has **no user-facing geolocation feature**. Approximate location may nevertheless be derived from an IP address by analytics. Security logs may legitimately record IP data; analytics does not need approximate location.

**Required action.** **Disable analytics geographic enrichment.** Do not request device location permission. Limit IP-derived data to security and fraud purposes with restricted access and short retention. Complete a new assessment before any future location-based feature.

**Classification.** Lawfulness, minimisation and Article 25 controls are **legal requirements**. Off-by-default and active indicators are **ICO guidance**. A complete beta prohibition on product geolocation is proportionate **best practice**.

### Standard 11 — Parental controls

**Application.** Dono provides **no parental monitoring and no parent dashboard**. The checkout declaration and the parent refund route are not monitoring tools. Building a parental dashboard would add data, create authentication complexity and risk undermining older teenagers' privacy.

**Required action.** No parental-control feature for beta. Provide a **clearly labelled parent and carer help route**, and explain that Dono does not give parents routine access to a child's donation history — requests are handled with regard to the child's competence, rights and best interests. **Do not promise deletion or disclosure automatically to any adult claiming to be a parent without appropriate verification.**

**Classification.** There is **no general legal requirement** to build parental controls. Transparency and fair handling of rights requests are legal duties. The specific notice and indicator obligations apply under **ICO guidance** only if controls are offered.

### Standard 12 — Profiling

**Application.** Dono does not infer characteristics, run recommender systems, or make significant automated decisions, and the Appropriate Policy Document contains a **closed rule** against inferring characteristics from donation history. **But analytics event histories linked to a signed-in user can still constitute behavioural profiling** if used to analyse or predict preferences or behaviour.

**Required action.** For beta: **no identify call**, so no analytics event is linked to an identified user; **no individual donor profiles**; **no session replay and no autocapture**; **no personalised campaigns or appeals**. Prefer aggregate, privacy-preserving measurement. Because Dono cannot identify who is a child, **the restriction applies to every visitor rather than to a declared under-18 subset** — which also removes the under-13 consent problem entirely.

**Classification.** Lawful, fair and transparent profiling and the automated-decision safeguards are **legal requirements**. Off-by-default and harm controls are **ICO guidance**. Suspending individual-level analytics for beta is **best practice** and the simplest route to conformance.

### Standard 13 — Nudge techniques

**Application.** Risk points are the cookie banner, the "show my name" control, fee cover, donation amount suggestions, and the age declaration. Problems would arise from a preselected public-sharing option, a more prominent "accept analytics" button, suggested high amounts, guilt copy, or an age screen that reveals the permitted answer.

**Required action.** Give privacy choices **equal visual weight**; make reject as easy as accept; leave optional sharing and fee cover **unticked**; use neutral amount suggestions; **phrase age entry neutrally and do not permit immediate retry with a different date after a failed under-18 account attempt**; and **test mobile and web flows for dark patterns before launch, recording the review**.

**Classification.** Fairness and valid consent are **legal requirements**. The anti-nudge standard is **ICO guidance**. Equal visual weight and a documented dark-pattern review are proportionate **best practice**.

### Standard 14 — Connected toys and devices

**Application. Not applicable.** Dono is a web and mobile service and supplies no connected physical products, sensors, microphones or wearables.

**Required action.** None. Reassess if Dono later integrates a giving terminal, campus kiosk, wearable or voice device.

**Classification. Not applicable** on current facts.

### Standard 15 — Online tools

**Application.** A child reader without an account needs a simple route to raise a concern that does not require legal vocabulary. **An email address in the Privacy Notice is not an adequate implementation.** The Data (Use and Access) Act 2025 complaint-handling requirements reinforce the need for an accessible electronic mechanism.

**Required action.** Provide a public **"Privacy or donation help" form accessible without login**, with options to: get a copy of my data; correct details; delete where possible; object or restrict; **report a donation made by someone under 18**; and raise another concern. Acknowledge data-protection complaints within the applicable statutory period and respond without undue delay. Explain that a child may contact Dono directly and may ask a trusted adult to help.

**Classification.** Data subject rights, accessible communications and statutory complaint handling are **legal requirements**. A prominent in-product tool is the **ICO Code implementation**. Child-oriented labels and a combined privacy and refund route are proportionate **best practice**.

---

## 5. The universal high-privacy baseline

Because Dono does not and will not identify who is a child, **every protection below applies to every user.** This is expressly contemplated by the Code as an alternative to age assurance, and it avoids collecting additional identity data merely to distinguish children from adults.

| # | Baseline control | Status |
|---|---|---|
| 1 | Donation display defaults to **no public name, no individual amount, no precise timestamp** | **Not built** |
| 2 | Analytics off until consent; **no identify call, no session replay, no autocapture, no geographic enrichment** | Partly — session replay is on at project level; retention enforcement is off |
| 3 | **No behavioural profiling and no inference of characteristics from donation history** | Rule in place (APD §10); no profiling exists |
| 4 | **No personalised prompts, no scarcity, streak, countdown or guilt mechanics** | Design rule in place |
| 5 | **No institutional data sharing**, and none to be built for beta | Not built, correctly |
| 6 | **No marketing without a separate, unticked opt-in** | Rule in place |
| 7 | **No geolocation feature and no device location request** | Correct today |
| 8 | Privacy choices given **equal visual weight**; reject as easy as accept | Verified 5 August 2026 for the analytics banner |
| 9 | Fee cover **unticked** by default | Rule in place |
| 10 | **Child-friendly privacy layer** and just-in-time notices | **Not built** |
| 11 | **Logged-out privacy, complaint and unauthorised-donation form** | **Not built** |
| 12 | Neutral age entry; **no immediate retry after a failed under-18 account attempt** | **Not built** |

---

## 6. Under-18 donations — the corrected approach

**Donations are for adults only.** Dono's approach is **prevent, detect, remedy** — not permit-with-limits.

| Stage | Control |
|---|---|
| **Prevent** | An active, mandatory 18-or-over and capacity confirmation, in the exact Donor Terms wording, with **payment blocked without it**. Parent or guardian permission is **not** offered as an alternative and must never appear as one. Clear statements in the Donor Terms, the Privacy Notice and the child-friendly layer that donating is for adults |
| **Detect** | A logged-out form allowing anyone — including a parent — to report a donation made by a person under 18. Sample audit of checkout records monthly for the first three months |
| **Remedy** | Being under 18 at the time of the donation is an **objective refund ground** requiring no proof of materiality, reliance or causation. **Dono may itself instruct the Payment Provider to reverse the charge** under the refund mandate. Only proportionate evidence is sought and **the family is not interrogated**. The child's data is then deleted, subject to the minimum record needed to evidence the refund |

**No donation caps or limits for under-18s are imposed, and none should be.** A cap would imply that a smaller under-18 donation is permitted. It is not.

**Verified parental consent** is legally required for consent-based processing offered directly to a child under 13. **Dono avoids that requirement entirely by design**: it offers no consent-based optional processing to any visitor of unknown age other than analytics, which is configured so that no event is linked to an identified individual.

---

## 7. Beta launch control set

### 7.1 Launch-critical — must be complete

| # | Control | Standard | Status |
|---|---|---|---|
| 1 | Approve this assessment and record an owner for every control | 2 | **Outstanding** |
| 2 | Implement and store the **real** checkout age and capacity confirmation; remove the hard-coded constant | 3, 8 | **Outstanding** (AG-01, CH-04) |
| 3 | Make donor name, individual amount and precise time **private by default** | 7 | **Outstanding** |
| 4 | Keep institutional sharing, marketing and personalisation **disabled** | 5, 9, 12 | Correct today; must not regress |
| 5 | Disable analytics identity linking, session replay, autocapture and geographic enrichment **at project level as well as in the client** | 10, 12 | **Outstanding** (CK-07, CK-08) |
| 6 | Publish the **child-friendly privacy layer** and just-in-time checkout notices | 4 | **Outstanding** |
| 7 | Provide **logged-out** privacy, complaint and unauthorised-donation forms | 15 | **Outstanding** |
| 8 | Ensure every policy claim matches a working control — especially retention and deletion, reporting and refund routes | 6 | **Outstanding** |
| 9 | Test account age enforcement, privacy defaults, analytics blocking and the parent refund journey on web and mobile | 3, 7, 12 | **Outstanding** |
| 10 | Complete and record a **dark-pattern review** of the mobile and web flows | 13 | **Outstanding** |

### 7.2 Shortly after launch

- Review metrics monthly for the first three months.
- Sample-check ten checkout records of unknown-age donors, or all such records if fewer.
- Review whether campaign copy or donation UX creates pressure on young readers.
- Conduct a small usability test with older teenagers and a parent or carer representative, or record why that is disproportionate.
- Review this assessment at three months and again at six months.

### 7.3 Not required for this beta

Identity-document or biometric age verification for visitors or donors; a parental dashboard or ongoing monitoring; separate privacy notices for every ICO age band; a child account or child commenting feature; connected-device controls; automated child-detection profiling; **and under-18 donation caps, which are actively inappropriate.**

---

## 8. Review triggers

Review this assessment **before** introducing any of: child accounts, child comments or campaign creation by under-18s; direct messaging, social graphs, private groups or livestreaming; behavioural advertising, individual recommendations or engagement-ranked feeds; individual-level analytics or an identify call; precise location or location-based discovery; institutional donor-data sharing; saved payment methods or recurring donations; individual Student Campaigns; a new age-assurance provider or method.

Also review on: a material increase in detected under-18 use or parental refund requests; a serious child-related incident or regulatory complaint; or revised ICO Children's Code guidance following the Data (Use and Access) Act 2025.

---

## 9. Overall decision

| Question | Determination |
|---|---|
| **Scope** | **The Code applies.** |
| **Current readiness** | **Partially conformant. Not ready to rely on the written package** until the launch-critical controls in §7.1 are implemented and evidenced |
| **Age strategy** | **Apply high-privacy defaults to all users.** Use a targeted declaration for donors and the fail-closed verified-DOB gate for creators, rather than general age verification |
| **Child-friendly notice** | **Required in substance.** A separate short layer is the most practical implementation |
| **Under-18 donor approach** | **Prevent, detect, remedy.** Donations are adults-only. The declaration plus the executable refund mandate plus private-by-default display plus no optional data uses is the control set. **No caps** |
| **Parental consent** | **Not required, by design** — no consent-based optional processing is offered to any visitor of unknown age |
| **Residual risk after controls** | **Low to medium**, and proportionate for a closed, closely monitored beta. Consistent with DPIA accepted residual risk A2 and Children's Risk Assessment C1 |

---

## 10. Cross-references

| Document | Relationship |
|---|---|
| `dono-dpia-v3.0.md` | The general DPIA. Cross-references this assessment; does not replace it. Risk L-15 and accepted residual A2 |
| `dono-childrens-risk-assessment-v3.0.md` | Online Safety Act children's risk assessment. A **different statutory instrument with a different purpose.** Harm C1 and C7 |
| `08_dono_privacy_notice_v3.0.md` | The full notice. The child-friendly layer sits alongside it, not instead of it |
| `09_dono_cookie_notice_v3.0.md` | Analytics consent, which is the principal under-13 consent risk |
| `dono-appropriate-policy-document-v3.0.md` | §10, the closed no-inference rule relied on at Standard 12 |
| `07_dono_refund_and_dispute_policy_v3.0.md` | The objective under-18 refund ground relied on at §6 |

---

## 11. Approval block — SIGNATURE REQUIRED

> **This block is unsigned. This assessment is not approved.**

**I confirm that I have assessed Dono against all 15 standards of the ICO Age Appropriate Design Code, that the assessment reflects the settled position that Donors must be 18 or over, that no control credited above is one that does not exist, and that I approve this assessment.**

| Field | Entry |
|---|---|
| Approver name | Amrit Kaur Rooprai |
| Role | Controller and data protection lead |
| Document version approved | 3.0 |
| Code applies? | **Yes** |
| Conformance position | **Partially conformant — launch-critical controls outstanding** |
| Launch-critical controls complete? | ☐ Yes, on ____________ · ☑ **No — 10 outstanding** |
| Solicitor sign-off obtained? | ☐ Yes, on ____________ · ☑ **No** |
| Signature | ______________________ |
| Date of approval | ______________________ |

**Reviewed by:** Sashank (deputy) — Signature ______________________  Date ______________

---

## 12. Version control

| Field | Entry |
|---|---|
| Version | 3.0 |
| Version date | 7 August 2026 |
| Effective from | On publication approval |
| Accountable owner | Amrit Kaur Rooprai |
| Prepared by | Legal consolidation, 7 August 2026, materially correcting the 6 August 2026 assessment |
| Approved by | *(signature required — section 11)* |
| Status | **Not approved.** Prepared for signature |
| Supersedes | `../../../generated/childrens-code-assessment/dono-ico-childrens-code-assessment-2026-08-06.md`, retained unaltered as the historical baseline |
| Next scheduled review | Three and six months after launch, then 7 February 2027, or on any review trigger |
