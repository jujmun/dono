# Dono Incident Response Plan

**Version:** 3.0
**Version date:** 7 August 2026
**Effective from:** on publication approval (see approval block)
**Document type:** Internal plan — operational
**Owner:** Amrit Kaur Rooprai (incident lead). Deputy: Sashank. Second backup: Joe.
**Supersedes:** v2.3 (6 August 2026) and all earlier versions, retained unaltered in the version archive at `../../v2.3/`, `../../v2.2/`, `../../v2.1/`, `../../v2.0/` and `../../v1.0/`
**Resolves review finding:** F48

> **This plan describes what three people can actually do.** It does not describe a 24/7 operations team, because Dono does not have one. Every step below is executable by the people named in it.

---

## 1. Scope

1.1 An **incident** is any event that compromises, or may compromise, the confidentiality, integrity or availability of personal data or the Platform, or that presents an urgent safety risk to a user. This includes: a personal-data breach; unauthorised access to production systems or the Stripe platform account; loss or corruption of data; a processor's own breach affecting Dono data; a credible threat to a person made through the Platform; detection of child sexual abuse material; and a sustained outage.

1.2 **Not an incident under this plan:** an ordinary content report (Community Guidelines clause 7); an ordinary refund dispute; a routine support query.

## 2. Roles — the beta on-call arrangement

2.1 Dono has **no 24/7 rota** and does not claim one.

2.2 **A rotating founder acts as Incident Lead on a weekly rota.** The rota is published internally each month. The Incident Lead is the first responder and holds decision authority for containment.

| Role | Person | Responsibility |
|---|---|---|
| **Incident Lead (weekly rota)** | Amrit / Sashank / Joe | First response; containment decisions; running the incident; the record |
| **Accountable Owner** | Amrit Kaur Rooprai | Final decision on regulatory notification, user notification and public statements. Cannot be delegated except to the Deputy in her documented absence |
| **Deputy** | Sashank | Acts as Accountable Owner where Amrit is unavailable for more than 4 hours |
| **Second backup** | Joe | Acts where neither is available |
| **Data protection decisions** | Amrit (lead), Sashank (deputy) | ICO notification, data-subject notification |
| **Online safety / CSEA decisions** | Amrit (lead), Sashank (Deputy Organisation Administrator) | NCA reporting, urgent content decisions |

2.3 **Expected response.** The Incident Lead aims to acknowledge an incident **within 4 hours during 09:00–23:00 UK time**, and **by 10:00 the next day** for anything raised overnight. **These are targets, not guarantees**, and no Dono document promises otherwise. Anything indicating an immediate risk to life is escalated to the emergency services first, by whoever sees it, without waiting.

2.4 **Escalation to the Accountable Owner is mandatory, immediately, for:** any suspected personal-data breach; any unauthorised access to production or Stripe; any suspected child sexual abuse material; any credible threat to life; any law-enforcement or regulator contact; and any incident likely to attract press attention.

## 3. Secure out-of-band communication

3.1 **During an incident, the team communicates on a dedicated Signal group ("Dono Incident"), on personal mobile devices.** It is used only for incidents.

3.2 **Why out of band:** if the incident involves the Platform, the hosting provider, Google Workspace or the shared inbox, those channels may be compromised, unavailable, or later disclosable. Signal is independent of every Dono system.

3.3 **Rules.** Personal data is not posted into the group beyond what is strictly necessary to run the incident, and no special category data, no card data and never any suspected child sexual abuse material. Substantive decisions are transferred to the incident record (clause 7) as they are made. Voice calls are used for anything sensitive.

3.4 **Every founder's mobile number is recorded in the plan and re-confirmed at each quarterly review.** A founder who changes number must tell the others the same day.

## 4. Processor and vendor emergency contacts

> **These must be populated and verified before launch.** A blank contact is a launch blocker, because it cannot be found during an incident.

| Provider | What they hold | Security / incident contact | Support route | Verified on |
|---|---|---|---|---|
| **Stripe** | Payments, Connect accounts, KYC | `security@stripe.com`; report a vulnerability via Stripe's security page | Stripe Dashboard → Support (authenticated, fastest route); Stripe Support | *(to be verified)* |
| **Vercel** | Hosting, deployment, platform logs | `security@vercel.com` | Vercel Dashboard → Support; account owner login | *(to be verified)* |
| **Convex** | Database, file storage, backups | `security@convex.dev` | `support@convex.dev`; Convex Discord for availability incidents | *(to be verified)* |
| **Resend** | Transactional email, one-time codes | `security@resend.com` | `support@resend.com`; Resend dashboard | *(to be verified)* |
| **PostHog** | Analytics (consented users only) | `security@posthog.com` | `hey@posthog.com`; in-app support | *(to be verified)* |
| **Domain registrar** | DNS, domain control | *(to be completed)* | *(to be completed)* | *(to be verified)* |
| **Google (Workspace / Gmail)** | The support inbox | Google account security / recovery | Google account support | *(to be verified)* |

4.1 **External contacts.**

| Body | When | Route |
|---|---|---|
| **Information Commissioner's Office** | Personal-data breach likely to result in a risk — **within 72 hours** of becoming aware | ico.org.uk breach report; 0303 123 1113 |
| **National Crime Agency** | Suspected child sexual exploitation and abuse content | The registered CSEA reporting route — see the CSEA Reporting Procedure |
| **Ofcom** | Online-safety incident where a duty to inform arises | ofcom.org.uk |
| **Action Fraud / police** | Suspected fraud or crime; 999 for immediate risk to life | actionfraud.police.uk; 101; 999 |
| **OFSI** | Suspected sanctions breach | ofsi@hmtreasury.gov.uk |

4.2 **Verification.** Every contact route in clauses 4 and 4.1 is **tested at least annually** — by sending a non-urgent enquiry and confirming a reply is received — and the date recorded in the table. An unverified route is treated as not existing.

## 4B. A plan is only as good as its trigger — verified position, 5 August 2026

4B.1 **There is no monitoring or alerting of any kind.** No error tracking; no notification when a payment dispute opens (it writes a database flag and tells nobody); no alert when a scheduled job fails; no alert on repeated authentication failures. Rate limiting blocks abuse but notifies no one.

4B.2 **This plan assumes that someone becomes aware of an incident. Nothing currently makes that happen.** Every timescale below — the four-hour acknowledgement, the 72-hour regulatory clock, containment — runs from awareness. **Item AL-01 is therefore a dependency of this entire plan, not an improvement to it.**

4B.3 **Two further gaps affecting execution.** There is **no documented credential rotation or revocation procedure**, so step 3 below has nothing to execute under pressure (item SE-10). And **no one holds a documented record of who has production access** to the database, hosting, payment, email and analytics consoles (item SE-01).

4B.4 Until AL-01 exists, the interim control is a **daily manual check** by the Incident Lead of: the payment dashboard for new disputes; the platform logs for job failures; and the support inbox. **Record that the check was done.** This is weak, and it is stated as weak.

## 5. Response steps

| Phase | Target | Actions |
|---|---|---|
| **1. Detect and record** | Immediately | Open an incident record; note who found it, when, and how. Start the timeline. **The clock for the 72-hour ICO deadline starts when Dono becomes aware, not when the incident is understood** |
| **2. Triage** | Within 4 hours (target) | Incident Lead classifies severity (clause 6) and decides whether to escalate to the Accountable Owner. Move to Signal |
| **3. Contain** | As soon as possible | Revoke compromised credentials; rotate secrets; disable affected accounts or features; use the kill switches (campaigns, donations, registration, comments); remove unlawful content; take the Platform offline if necessary. **Containment does not wait for full understanding** |
| **4. Assess** | Within 24 hours where possible | What data, whose, how much, what harm is likely, is it still ongoing, is a processor involved. Record what is known and what is not |
| **5. Notify — regulator** | ICO within **72 hours** of awareness where the breach is likely to result in a risk | Accountable Owner decides. If the assessment is incomplete at 72 hours, **report anyway with what is known** and supplement later. Record the reasoning if a decision is taken not to report |
| **6. Notify — individuals** | Without undue delay where the risk is **high** | Plain-English description; likely consequences; what Dono is doing; what the person should do; contact point |
| **7. Notify — others** | As applicable | Stripe; affected processors; NCA; Ofcom; police; and Dono's insurer/broker where the policy notice conditions or circumstances require |
| **8. Recover** | — | Restore service; verify integrity; confirm the vulnerability is closed; monitor for recurrence |
| **9. Review** | Within **14 days** of closure | Written post-incident review: what happened, timeline, root cause, what worked, what did not, actions with owners and dates. Update this plan |

## 6. Severity

| Level | Definition | Response |
|---|---|---|
| **S1 — critical** | Confirmed personal-data breach affecting many users; unauthorised production or Stripe access; CSEA detected; credible threat to life; total outage | Immediate; Accountable Owner engaged at once; all-hands |
| **S2 — high** | Suspected breach; limited unauthorised access; a processor breach affecting Dono data; a serious safety report | Incident Lead runs it; Accountable Owner informed within 4 hours |
| **S3 — moderate** | Contained internal error; misdirected email; partial outage | Incident Lead; recorded; reviewed at the quarterly review |
| **S4 — low** | Near miss; no data affected | Logged only |

## 7. The incident record

7.1 Every incident has a written record containing: reference and severity; who detected it and when; a timestamped timeline; the systems and data involved; the number and categories of people affected; containment steps and times; the assessment; every notification decision **including a reasoned decision not to notify**; external communications; recovery steps; the post-incident review and its actions; and the closure date and approver.

7.2 Incident records are retained for **six years** and held with restricted, logged access.

## 8. Tabletop exercises

8.1 **Dono must run and document at least two tabletop exercises before launch.** No launch may proceed without them.

8.2 **Mandatory pre-launch scenarios:**

| # | Scenario | Tests |
|---|---|---|
| **T1** | A founder's laptop is stolen, unlocked, with an authenticated session to the production dashboard | Credential revocation; secret rotation; access review; breach assessment; ICO decision; out-of-band comms |
| **T2** | A reviewer finds suspected child sexual abuse material on a campaign page at 23:00 on a Saturday | Out-of-hours escalation; not downloading or copying; preservation; NCA reporting; restricted storage; the two retention clocks; support for the person who saw it |

8.3 **Recommended within three months of launch:** a Convex or Vercel breach notification affecting Dono data; a Stripe platform-account compromise; and a mass fraudulent-campaign event with chargebacks.

8.4 **Each exercise must be documented** with: the date; the scenario; the attendees and their roles; the timeline the team produced; the decisions taken; **the findings — specifically what could not be done**; the follow-up actions with owners and deadlines; and the sign-off. **Follow-up actions must be closed before launch, or the residual risk expressly accepted and recorded by the Accountable Owner.**

8.5 Tabletop exercises are repeated **annually**, and after any S1 incident.

## 9. Review

9.1 Reviewed **quarterly** (contacts, rota, mobile numbers) and **annually** in full; and after every S1 or S2 incident, every tabletop exercise, and every change of team, processor or payment architecture.

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
