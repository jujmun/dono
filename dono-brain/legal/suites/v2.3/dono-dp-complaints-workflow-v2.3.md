# Dono Data Protection Complaints Workflow

**Version:** 2.3
**Version date:** 6 August 2026
**Document type:** Internal workflow
**Owner:** Amrit Kaur Rooprai (data protection lead). Backup: Sashank.
**Supersedes:** `terms_v2.2/dono-dp-complaints-workflow.md`
**Resolves review finding:** F49

> **The approved launch approach is a dedicated public email address and a lightweight internal tracker. No bespoke complaints portal, case-management system or workflow tool is being built for beta.** A more formal system will be considered if complaint volume or team size increases.

---

## 1. The public route

1.1 **Data-protection complaints are made by email to `joindono.team@gmail.com`.** The Privacy Notice clause 13.4 says exactly this, and does not describe a form or portal, because none exists.

1.2 **An automatic receipt confirmation is configured** and fires on every inbound email. It states that the message has been received, that a data-protection complaint will be acknowledged within 30 days, and that the person may also complain to the ICO at any time.

1.3 **Named responsibility.** Amrit Kaur Rooprai monitors the inbox and owns data-protection complaints. **Sashank is the named backup** and monitors it whenever she is unavailable for more than two working days. The inbox is checked on every working day.

## 2. Internal tracking — the minimum that works

2.1 **A dedicated Gmail label, `DP-Complaint`**, is applied to every data-protection complaint thread on the day it is identified. Sub-labels: `DP-Complaint/Open`, `DP-Complaint/Awaiting-user`, `DP-Complaint/Closed`.

2.2 **A single spreadsheet, `DP complaints register`**, with one row per complaint:

| Column | Content |
|---|---|
| Ref | `DPC-YYYY-NN` |
| Date received | The date the email arrived, not the date it was noticed |
| Complainant | Name or identifier |
| Summary | One line |
| Responsible person | Amrit or Sashank |
| Acknowledgement due | Date received + 30 days |
| Acknowledgement sent | Date |
| Status | Open / Awaiting user / Closed |
| Outcome | Upheld / Partly upheld / Not upheld / Withdrawn |
| Outcome date | Date |
| Actions taken | Free text |
| ICO involved? | Yes / No / Ref |

2.3 The register is reviewed **weekly** against the label, so nothing sits unrecorded. Entries are retained for **three years** after closure.

## 3. Telling the difference — a short note for the team

Everything arrives in one inbox, so the first job is routing. **When in doubt, treat it as a data-protection complaint and record it — over-recording is harmless, missing one is not.**

| It is a… | If the person is… | Route |
|---|---|---|
| **Data-protection complaint** | unhappy with **how Dono has handled their personal data** — "you kept my data too long", "you shared my details with my college", "your privacy notice is wrong", "you didn't tell me you were collecting this" | This workflow. **30-day acknowledgement.** Register it |
| **Rights request** | **asking Dono to do something** with their data — a copy, correction, deletion, restriction, objection, portability, withdrawal of consent | Privacy Notice clause 13.3. **One-month response.** Different clock. Not this register — but if they are *also* unhappy, it is both |
| **Refund or donation dispute** | unhappy about **money** — a refund, a fee, a campaign's spending | Refund and Dispute Policy |
| **Safeguarding report** | reporting that **someone is at risk** | Escalate immediately under the Online Safety Procedures. **Never queue this** |
| **Content complaint or appeal** | unhappy about **content or a moderation decision** | Community Guidelines clause 8 |
| **Service complaint** | unhappy about **fees, delays, technical faults or how a process was handled** | Complaints Policy |

**Two useful tests.** *Is the subject matter their personal data?* If yes, it is probably one of the first two. *Are they asking Dono to do something, or complaining that Dono did something?* Asking → rights request. Complaining → data-protection complaint. **A message can be more than one thing at once; handle each part on its own clock.**

## 4. The process

| Step | Timescale | What happens |
|---|---|---|
| **1. Identify and label** | Same working day | Apply `DP-Complaint/Open`; create the register row with the true date received |
| **2. Acknowledge** | **Within 30 days**, in practice within 5 working days | Confirm receipt, summarise what we understand the complaint to be, say who is handling it, give the reference, and tell them they may go to the ICO at any time |
| **3. Investigate** | Proportionate to the complaint | Establish what actually happened: check logs, records, correspondence and the relevant policy. Record what was checked |
| **4. Keep it under review** | Weekly | Anything open for more than 30 days gets a progress update to the complainant with a realistic date |
| **5. Conclude** | **Without undue delay** | Written outcome: what we found; whether the complaint is upheld, partly upheld or not upheld; what we are doing about it; what we have changed; and their right to complain to the ICO |
| **6. Close and learn** | On conclusion | Update the register. If the complaint revealed a real problem, record the fix and, where it affects a published document, raise it as a document change |

4.1 **Escalation.** Any complaint that involves a **personal-data breach**, a **special category or criminal-offence issue**, a **child**, or a **threat of legal action or an ICO referral** is escalated to the data-protection lead immediately and, where a breach is involved, handled under the Incident Response Plan and its 72-hour clock in parallel.

4.2 **Conflicts.** Where the complaint is about a decision the data-protection lead made personally, the backup conducts the investigation.

## 5. What Dono does not claim

Dono does not operate a complaints portal, a ticketing system, category-specific inboxes, role-based queues or a case-management tool, and **no Dono document says it does.** The public route is an email address; the internal route is a label and a spreadsheet. This is deliberate and proportionate for a three-person team, and it satisfies the obligation, which is about outcomes rather than tooling.

## 6. Review

Reviewed annually, and immediately if complaint volume exceeds roughly **one a week sustained over a month**, if the team grows beyond five people, or if the ICO raises a concern about how complaints are handled. **At that point a lightweight case-management tool should be reconsidered.**

---

## Approval and version control

| Field | Entry |
|---|---|
| Document | Dono Data Protection Complaints Workflow |
| Version | 2.3 |
| Version date | 6 August 2026 |
| Accountable owner | Amrit Kaur Rooprai; backup Sashank |
| Reviewed by / Approved by | *(to be completed)* |
| Outstanding before it is true | Automatic acknowledgement configured on the inbox; Gmail labels created; register spreadsheet created; routing note circulated to the team. See `ENGINEERING_IMPLEMENTATION_CHECKLIST_v2.3.md`, items DP-01 to DP-04 |
| Next scheduled review | 6 August 2027, or on any trigger in clause 6 |
| Supersedes | `terms_v2.2/dono-dp-complaints-workflow.md` |
