# Data Breach Incident Response Plan — Dono

**Owner / Incident Lead:** Amrit Kaur Rooprai
**Deputy Incident Lead:** **Sashank**
**Second backup:** **Joe**
**Version:** 2.2 — 31 July 2026
**Approved by:** _________________ **Date:** _________________
**Next review:** 31 January 2027, or after any incident.

## Changes in v2.2

- The blank backup is filled: **Sashank is Deputy Incident Lead, Joe is second backup.** This matches the CSEA allocation, so there is one escalation chain rather than three.
- A **severity matrix**, **containment authority**, **breach log fields**, **user notification templates** and a **CSEA annex** are added.
- Processor notification is stated as a contractual requirement.
- Records that the plan has **not yet been tested**, so the Privacy Notice does not claim that it has.

---

## Roles

| Role | Person | Responsibility |
|---|---|---|
| Incident Lead | Amrit | Owns every incident; decides on ICO and user notification; may take any emergency containment action without prior approval |
| Deputy Incident Lead | **Sashank** | Acts with the Incident Lead's full authority whenever Amrit is unavailable |
| Second backup | **Joe** | Acts where neither Amrit nor Sashank is contactable |
| Everyone | All founders and team members | Must report a suspected incident immediately |

There is no 24-hour rota. What there is, is a credible arrangement under which any suspected incident reaches someone with authority to act.

## Severity matrix

| Severity | Examples | Response |
|---|---|---|
| **Critical** | Large personal-data breach; database exposure; account compromise; ransomware; credential theft; exposure of student-card images or identity data | Immediate escalation to the Incident Lead; containment begins at once |
| **High** | Unauthorised access to user data; a processor reporting a breach affecting Dono data; misdirected disclosure of identifiable data | Immediate investigation |
| **Medium** | Lost or stolen device holding Platform access; failure of the authentication system; accidental internal disclosure | Investigation the same business day |
| **Low** | Repeated failed login attempts; a minor configuration issue; an unsuccessful attack | Record and monitor |

## 1. Detect and report

Anyone who becomes aware of a suspected personal-data breach — unauthorised access, accidental disclosure, loss of a device holding Platform data, or a processor (Stripe, Convex, Vercel, Resend, PostHog) reporting an incident — must notify the Incident Lead **immediately**, and in any event within 24 hours of becoming aware.

**Processor notification.** Every processor is contractually required to notify Dono **without undue delay** after becoming aware of any security incident affecting Dono data. Dono does not impose its own hour limit where the contract already governs this. Confirm this obligation is in each DPA as it is filed (see the DPA Register).

## 2. Assess

The Incident Lead (or Deputy) assesses, within 24 hours of notification:

- what data is affected, and approximately how many people;
- whether it includes special category data, criminal-offence data, student-card images or identity data;
- the likely cause — technical failure, human error, third-party breach, malicious access;
- whether it is likely to result in a **risk** to people's rights and freedoms (which triggers ICO notification) or a **high risk** (which triggers notification to the individuals); and
- the severity, using the matrix above.

Record the assessment in the breach log.

## 3. Containment authority

**The Incident Lead may take any of the following immediately, without prior approval, where necessary to protect users:**

- disable accounts;
- suspend campaigns;
- revoke API keys and rotate secrets;
- disable an integration;
- take the Platform or a feature offline;
- contact a processor; and
- notify the other founders.

The Deputy Incident Lead has the same authority whenever the Incident Lead is unavailable. Every action taken is recorded with its time.

## 4. Preserve evidence

Before remediating, preserve logs, access records, processor incident reports, screenshots and timestamps. This supports both the ICO notification and any later investigation. Preserve evidence in a way that does not create unnecessary additional copies of the affected data.

## 5. Notify the ICO where required

If the breach is likely to result in a risk to individuals, notify the ICO **within 72 hours** of Dono becoming aware, through the ICO's breach reporting service. Registration status does not remove this obligation. Include: the nature of the breach; the categories and approximate number of individuals and records affected; the likely consequences; and the measures taken or proposed.

If the 72-hour deadline cannot be met, notify with the information available and provide the rest in phases, explaining the delay.

## 6. Notify affected individuals where the risk is high

If the breach is likely to result in a **high** risk — for example exposed identity documents or student-card images, payment data, or data that could lead to fraud or harm — notify those individuals directly and without undue delay. Explain: what happened; what data was affected; the likely consequences; what Dono is doing; and what they can do to protect themselves. Use the templates in the annex.

## 7. Contain and remediate

Take the steps needed to contain the breach and close the underlying cause, and record what was done and when.

## 8. Breach log

**Log every security incident, not only those reportable to the ICO.** Fields:

Incident ID · date and time discovered · who reported it · systems affected · processor involved · categories of personal data · approximate number of people affected · severity · root cause · containment actions and times · risk assessment · whether the ICO was notified and when · whether individuals were notified and when · decision-maker · dates of each decision · lessons learned · corrective actions · date closed.

## 9. Post-incident review

Once resolved, review how the breach happened, whether the response met the timescales above, and what should change — technical controls, process, training. Update this plan if gaps are found, and record the review in the breach log.

## Annex A — User notification templates

Hold a short template for each of: password reset required; a processor breach; accidental disclosure; a service outage; an investigation ongoing; and an incident resolved. Each states plainly what happened, what data was involved, what Dono is doing, what the person should do, and how to contact Dono.

## Annex B — CSEA incidents

An incident involving suspected child sexual exploitation and abuse content is **not** handled under this plan alone. Follow the specialist procedure in the Online Safety Act Procedures, which takes precedence. In summary: stop ordinary review; do not download, screenshot or forward the material; restrict it from public access; freeze the campaign or account where necessary; notify Amrit and the deputy through the emergency channel; and preserve only the system data the Regulations require.

Retention for CSEA material is deliberately **different from everything else in this plan**: the NCA report reference is kept for **five years**, and the reported content and the prescribed supporting information for **one year** from submission, in restricted storage, then securely deleted — unless the NCA, the police or another competent authority lawfully requires longer. Two separate automated deletion dates apply:

- `report_reference_delete_at` = report date + 5 years
- `restricted_evidence_delete_at` = report date + 1 year

Where there is an immediate risk to a child and the Incident Lead cannot be reached, call **999**.

## Contacts

- ICO breach reporting: ico.org.uk
- Incident Lead: **Amrit Kaur Rooprai**
- Deputy Incident Lead: **Sashank**
- Second backup: **Joe**
- Processors: Stripe, Convex, Vercel, Resend, PostHog — support and security contacts to be recorded here. **[OUTSTANDING]**

## Status

**This plan has not yet been tested.** A tabletop exercise covering a stolen account, an exposed database and a compromised API key must be run before launch, with the timeline, decisions and improvements recorded. **Until that exercise has happened, no Dono document may state that the incident-response plan is tested** — the Privacy Notice has been corrected accordingly. **[OUTSTANDING — BLOCKING]**
