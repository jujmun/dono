# Dono — Online Safety Act Procedures (Draft)

Covers sections 3.3–3.5 of the compliance checklist: children's access assessment, CSEA reporting route, and the Online Safety complaints procedure. Drafted for internal review — treat as a working draft pending legal sign-off, and update the bracketed placeholders once confirmed.

---

## 3.3 Children's Access Assessment

Dono's core pages — campaign listings, campaign detail pages, and comments — are browseable without login or age check. Donating requires payment details but no age declaration; only campaign creators go through ID verification (18+, via Stripe). On that basis, children are likely to access the service, and the assessment proceeds on that footing rather than assuming an adult-only audience.

**Decision.** Dono is designing for child-safe operation by default, rather than deploying age assurance to exclude under-18s. The reasoning: age assurance adds friction to a browsing and donating flow that depends on openness and trust, and campaign creation — the higher-risk activity — is already gated by ID verification. Excluding children from browsing and donating would also cut against Dono's own use case, since students and young people are a natural donor and supporter base.

**What "child-safe by default" means in practice:**

- **Content moderation applies before publication.** Every campaign already receives manual human review before it goes live (per Dono's existing design); this review checks for content unsuitable for a mixed-age audience, not only fraud risk.
- **Comments are moderated, not just posted freely.** Given comments are public and browseable, Dono needs a reporting/removal path for comments (see 3.5) and a policy on what commenters can attach (links, images) — this is still open and should be resolved before launch, since open attachment policies are a common vector for both scams and harmful content reaching minors.
- **No targeting of children.** Dono's marketing, in-app prompts, and design language should not be built to appeal specifically to under-18s (no gamified donation mechanics aimed at children, no youth-specific ad targeting).
- **Escalation path for harmful content.** Anything encountered that constitutes CSEA content follows the separate procedure at 3.4, regardless of who reported it or how it was found.

**Review trigger.** This assessment should be revisited if Dono's user base or functionality changes materially — for example, if the platform introduces direct messaging between users, if campaign creation opens up to under-18s, or if evidence emerges that a significant proportion of users are children (which would point back toward considering age assurance).

**Engineering tie-in.** This assessment depends on the age-signal question already flagged to engineering — specifically, whether any age data is collected anywhere in the flow (e.g. at account creation) that could be used as a signal, even if no hard gate is implemented. If age data ends up being collected for any other reason, that changes what "child-safe by default" requires and this section should be updated.

---

## 3.4 CSEA Reporting Route

**Duty.** Under section 66 of the Online Safety Act 2023 and the Online Safety (CSEA Content Reporting by Regulated User-to-User Service Providers) Regulations 2026 (in force from 7 April 2026), in-scope user-to-user services must report all detected and unreported child sexual exploitation and abuse (CSEA) content to the National Crime Agency (NCA). This applies regardless of expected volume — the duty is absolute once content is detected, not discretionary or threshold-based.

**Designated person.** Amrit is Dono's designated person for CSEA reporting and for registering Dono with the NCA ahead of any report being made (registration is a precondition of using the NCA's reporting portal). Amrit is also the person accountable for Online Safety Act compliance more broadly, so this sits within an existing responsibility rather than a new one.

**Scope — what counts as "detected".** CSEA content is detected when Dono becomes aware of it, however that happens: through a user report, a comment or campaign flagged in moderation, or anything a team member notices in the ordinary course of reviewing campaigns or comments. It does not need to be confirmed by law enforcement to trigger the duty — awareness is enough.

**Procedure:**

1. **Anyone at Dono who encounters suspected CSEA content must not share, forward, download, or re-view it beyond what's necessary to recognise what it is.** Do not attempt to investigate further or discuss details outside this procedure.
2. **Escalate immediately to Amrit** (or, if Amrit is unavailable and there is an imminent risk to a child, call 999 directly and report to local UK police).
3. **Amrit registers Dono with the NCA** (via the Child Sexual Exploitation & Abuse Industry Reporting Portal — CSEA-IRP) if not already registered, and submits the report through the portal. Reports must only be used for CSEA — no other crime type should be reported through this channel.
4. **Preserve the content and metadata** (user ID, timestamps, URLs, any technical data available) in a restricted, access-limited location pending submission — do not delete the content from Dono's systems before reporting, but restrict visibility to Amrit only.
5. **Remove the content from public view** on the platform as soon as it's safe to do so without destroying evidence needed for the report.
6. **Retain records of the report** for up to five years, in line with the Regulations' data retention requirement, stored securely and accessible only to Amrit (and legal counsel if engaged).

**False reporting.** Note that knowingly submitting false information as part of a CSEA report is a criminal offence — this procedure is only for genuine, good-faith detections.

**Volume expectation.** Given Dono's scale and use case, very few (ideally zero) reports are expected. The procedure exists regardless — the duty applies from the first piece of content, not from a volume threshold.

---

## 3.5 Online Safety Complaints Procedure

This can sit inside Dono's general Complaints Policy rather than as a standalone document, but should cover Online Safety Act-specific categories distinctly from general customer service complaints.

**Report categories.** Users (and non-users) should be able to report:

- Illegal content (including but not limited to CSEA — see 3.4 for that specific route)
- Content that is legal but harmful to children
- Fraudulent or scam campaigns
- Harassment or abusive comments
- Anything else that breaches Dono's terms or content standards

**How to complain.** Complaints go to **joindono.team@gmail.com**. The complaint form/email should ask for: what the complaint concerns (a specific campaign, comment, or user), why the reporter believes it breaches the relevant standard, and any supporting detail (screenshots, links).

**Acknowledgement.** Every complaint is acknowledged within **5 business days** of receipt, confirming it's been received and giving a rough timeframe for resolution.

**Triage.** On receipt, complaints are categorised by type and urgency:

- **Urgent** (suspected illegal content, particularly anything touching child safety) — escalated immediately to Amrit and handled outside the standard timeline, following 3.4 where CSEA is suspected.
- **Standard** — queued for review in category order (e.g. fraud reports ahead of tone-of-comment disputes, though all get addressed).

**Outcome.** Dono aims to resolve complaints within **30 days** of receipt. The outcome is communicated to the complainant with brief reasoning — what was reviewed, what was found, and what action (if any) was taken (e.g. content removed, account restricted, no action with a short explanation why).

**Appeals.** A complainant who disagrees with the outcome can request a review. Amrit, as the designated person, handles the appeal as well as the initial triage — Dono's small team means this isn't split across separate reviewers at this stage, but the appeal should still be a genuine second look (re-reading the original complaint and evidence, not just restating the first decision) rather than a rubber stamp.

**Record-keeping.** Dono keeps a log of all Online Safety complaints received, including: date received, category, acknowledgement date, outcome, and appeal outcome (if any). This supports both internal consistency (spotting repeat problem accounts or content types) and any future regulatory enquiry from Ofcom.

---

### Open items before this goes final

- Comment attachment/link policy (referenced in 3.3) still needs a decision.
- Confirm whether joindono.team@gmail.com is the long-term complaints address or a placeholder ahead of a dedicated domain inbox.
- Legal sign-off on the CSEA procedure once Dono's incorporation and NCA registration are underway.
