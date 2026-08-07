# Dono Evidence Review and Campaign Closure Procedure

**Version:** 3.0
**Version date:** 7 August 2026
**Effective from:** on publication approval (see approval block)
**Document type:** Internal procedure
**Owner:** Amrit Kaur Rooprai. Reviewers: authorised Dono team members.
**Resolves review finding:** F56
**Implements:** Terms of Service clause 10; Refund and Dispute Policy clause 11; Student and Society Campaign Terms clause 7

> **Why this matters.** Dono's whole proposition is that a donation is a *conditional* contribution. The condition is only real if someone checks whether the money was used as promised, and if what donors were told can be proved later. This procedure is that check.

---

## 1. The lifecycle

```
Campaign published
   → Funding open
      → Funding closed (target reached or Campaign End Date passed)
         → Expenditure declared; receipts submitted within 14 days of each purchase
            → Closure Statement due 30 days after funds fully dealt with
               → Reviewer assigned → Review (30 days)
                  → Accepted  ─────────────► Closed (substantive)
                  → Rejected → one cure cycle (14 days) → re-review
                      → Accepted → Closed (substantive)
                      → Not cured → Closed (unresolved) + enforcement + refund grounds
                  → No decision in 30 days ► Administratively closed (procedural only)
```

## 2. Evidence status values

| Value | Meaning | Public? |
|---|---|---|
| `funding_open` | Accepting donations | Yes |
| `funding_closed` | No longer accepting donations | Yes |
| `evidence_outstanding` | Expenditure declared, evidence not yet due | Yes |
| `evidence_overdue` | Evidence due and not received | Yes |
| `evidence_submitted` | Evidence received | Yes |
| `under_review` | Closure Statement received and being reviewed | Yes |
| `cure_requested` | Rejected once; awaiting a corrected submission | Internal |
| `closed_accepted` | Closure Statement accepted | Shown as `closed` |
| `closed_administrative` | Dono missed its 30-day deadline | Shown as `closed (administrative)` with the explanatory label |
| `closed_unresolved` | Cure cycle failed | Shown as `closed` — enforcement handled separately |

2.1 **No status is a quality signal.** Public states describe where the Campaign has reached, never whether Dono approves of it. No badge, tick, colour or icon may be used to render them (Verification Notice clause 7).

## 3. Deadlines and reminders

| Event | Deadline | Reminders |
|---|---|---|
| Receipt for each item of expenditure | 14 days from purchase | Day 7, day 12, day 15 (overdue) |
| Closure Statement | 30 days after funds fully dealt with | Day 14, day 25, day 29, day 31 (overdue), day 45 (final) |
| Cure of a rejected Closure Statement | 14 days from rejection | Day 7, day 13 |
| Dono's review of a complete Closure Statement | 30 days | Internal reviewer alerts at day 14, 21, 27, 29 |
| Campaign Owner response to a query | 10 Working Days, extendable | Day 5, day 9 |

## 4. Reviewer assignment and checklist

4.1 Cases are assigned from a queue. **A reviewer must not review a campaign in which they have any interest** — a personal connection to the Campaign Owner, a donation to the campaign, or involvement in its promotion. They must declare it and reassign; the recusal is recorded.

4.2 **Reviewer checklist — every item recorded as pass / fail / not applicable, with a note:**

| # | Check |
|---|---|
| 1 | Is the Closure Statement complete against the minimum contents in ToS 10.3(b)? |
| 2 | Does the total expenditure reconcile to the total raised, less refunds and fees? |
| 3 | Does each line item in the final breakdown correspond to a line item in the published budget, or to a documented permitted variation? |
| 4 | Is there a receipt or invoice for each material item of expenditure? |
| 5 | Do the receipt amounts match the declared amounts? |
| 6 | Are the receipt dates consistent with the declared expenditure dates and the campaign period? |
| 7 | Are the suppliers plausible for the stated items? |
| 8 | Is any variance from the published campaign explained, and is the explanation consistent with the evidence? |
| 9 | Was any Material Change notified before implementation, as required? |
| 10 | Is there surplus? If so, has it been dealt with under ToS 14.5, and is the ledger consistent? |
| 11 | Do the receipts contain unnecessary third-party personal data? (If so, reject or redact — see clause 6) |
| 12 | Is there anything suggesting fraud, misuse, or expenditure outside the stated purpose? |
| 13 | Is the funded property owned as the Ownership Statement said? |
| 14 | Are there unresolved refund requests, disputes or reports on this campaign? |

4.3 **Assessment criteria.** The reviewer asks one question: **on the balance of probabilities, was the money used for the purpose donors were told about?** They are **not** authenticating documents, valuing purchases, auditing the Campaign Owner's finances, or judging whether the project was a good idea. Where the answer is yes, the statement is accepted even if presentation is imperfect.

4.4 **Grounds for rejection are limited** to those in ToS 10.3(d): missing required information; incomplete evidence; expenditure inconsistent with the campaign; reasonable grounds to suspect fraud or misuse; or a reasonable need for clarification. **A reviewer may not reject for any other reason.**

## 5. Cure, determination and closure

5.1 **One cure cycle.** A rejection states exactly what is missing or wrong, what is required, and the 14-day deadline. Only one cure cycle is given.

5.2 **On acceptance:** status `closed_accepted`; the Campaign Owner is notified; donors are notified that the campaign has closed and the closure review is complete; update obligations end; evidence, refund, cooperation and investigation obligations continue.

5.3 **Where the cure fails:** status `closed_unresolved`; the failure is a **standalone refund ground** under Refund Policy clause 3.3(d); enforcement under ToS Part 9 is considered; donors are notified that Dono did not receive adequate evidence and told how to request a refund.

5.4 **Administrative closure.** If Dono has not decided within 30 days of a complete Closure Statement, the campaign closes administratively. **This must be labelled prominently and in plain words wherever it appears, to the Campaign Owner and to donors:**

> *"Administrative closure: Dono did not complete its review within 30 days. This is a procedural outcome only. It is not a finding that the closure statement was adequate, that funds were used properly, or that the Campaign Owner complied with the Terms. Donors' rights are unaffected."*

Administrative closure must never be rendered with a tick, a green state or any approving styling, and must be visually distinct from `closed_accepted`.

5.5 **Appeal.** A Campaign Owner may appeal a rejection or an unresolved closure within **ten Working Days of being notified**, under Community Guidelines clause 8. The appeal is decided by a reviewer who was not substantially involved in the original decision.

## 6. Receipts and personal data

6.1 Guidance on what to redact is shown **before every upload** (Privacy Notice clause 11.2).

6.2 A receipt containing unnecessary third-party personal data is **rejected and quarantined**, automatically deleted after **30 days**, and the uploader asked to resubmit a redacted version. Deletion is logged.

6.3 Only the minimum needed for verification is retained from an accepted receipt.

## 7. What must be preserved as immutable evidence

7.1 The following are captured and **cannot be altered after creation**:

| # | Snapshot | Captured when |
|---|---|---|
| E1 | **The campaign page exactly as it appeared at the moment of each donation** — text, images, budget, target, Ownership Statement, end date | At each donation |
| E2 | **The donation-specific disclosures** — the "You're donating to" panel, the fee breakdown, the total, the applicable document versions | At each donation |
| E3 | **Every campaign edit** — before, after, who, when | At each edit |
| E4 | **Every uploaded item of evidence**, with hash, uploader, upload time | At upload |
| E5 | **Every reviewer decision** — checklist answers, outcome, reasons, reviewer identity | At decision |
| E6 | **All timestamps** on every state transition | Continuously |
| E7 | **Notification history** — what was sent, to whom, when, and whether delivery succeeded | At each notification |
| E8 | **The full audit log** — every administrative and moderator action on the campaign | Continuously |
| E9 | **The surplus and refund ledger** for the campaign | On each refund |

7.2 Snapshots are retained for **six years** from campaign completion.

## 8. Reviewer interface requirements

- A **queue** with filters: overdue evidence, closure due, closure overdue, in review, cure outstanding, review deadline approaching, appeals pending, unassigned.
- **Sort** by deadline proximity and by campaign value.
- **Escalation flags** for: value above a configured threshold; an open refund request; an open report; a previous rejection; a conflict-of-interest declaration.
- A **case view** showing the campaign as published, every donation-time snapshot, the budget, the declared expenditure, every receipt inline, the reconciliation, the edit history, the notification history and the audit log.
- The **checklist in clause 4.2 as a structured form** — a decision cannot be recorded until every item is answered.
- **One-click actions:** accept, reject with a reason, request a cure, request information, escalate, reassign, recuse.
- **A visible countdown** to Dono's own 30-day deadline, and a prominent warning that expiry produces administrative closure.
- **Full audit history** for every case, immutable and exportable.

## 9. Notifications

| # | To | When | Content |
|---|---|---|---|
| N1 | Campaign Owner | Expenditure declared | Receipt due in 14 days |
| N2 | Campaign Owner | Days 7, 12 | Receipt reminder |
| N3 | Campaign Owner | Day 15 | Receipt overdue; consequences |
| N4 | Campaign Owner | Funding closes | Closure Statement due in 30 days; what it must contain |
| N5 | Campaign Owner | Days 14, 25, 29 | Closure reminder |
| N6 | Campaign Owner | Days 31, 45 | Closure overdue; refund and enforcement consequences |
| N7 | Campaign Owner | On receipt | Closure Statement received; review within 30 days |
| N8 | Campaign Owner | On rejection | What is wrong, what is needed, 14-day deadline, appeal route |
| N9 | Campaign Owner | On acceptance | Accepted; what continues |
| N10 | Campaign Owner | On administrative closure | The clause 5.4 wording |
| N11 | **Every Donor** | Funding closes | The campaign has closed to donations |
| N12 | **Every Donor** | On closure outcome | Accepted / administratively closed / unresolved, with the correct explanation and, where relevant, how to request a refund |
| N13 | **Every Donor** | Surplus identified | There is surplus, how it is being dealt with, and their right to claim their share |
| N14 | **Affected Donors** | Material Change | The change, the 14-day refund window |
| N15 | Reviewer | Days 14, 21, 27, 29 | Review deadline approaching |
| N16 | Accountable owner | Day 29 | A campaign is about to close administratively |

## 10. Engineering specification, mapped to the legal provision it supports

| Requirement | Supports |
|---|---|
| **Tables:** `campaign_snapshot`, `donation_disclosure`, `campaign_edit`, `evidence_upload`, `evidence_quarantine`, `closure_statement`, `review_decision`, `review_checklist_answer`, `surplus_ledger`, `notification_log`, `audit_log` | ToS 10; Refund 11; E1–E9 |
| **Status model** on `campaign` with the values in clause 2 and enforced legal transitions | ToS 10.3 |
| **Immutability:** append-only writes, no update or delete on snapshot, decision, ledger and audit tables; content hashing on evidence | ToS 10.3; Refund 8.4; E1–E9 |
| **Scheduled jobs:** receipt reminders; closure reminders; cure-deadline expiry; **the 30-day administrative-closure job**; quarantine deletion at 30 days; campaign archival at 24 months | ToS 10.3(e), 31.3; Privacy 7.1, 11.3 |
| **APIs:** submit evidence; submit closure statement; assign; record decision; request cure; escalate; recuse; appeal | ToS 10.3; CG 8 |
| **Permissions:** reviewer role; conflict-of-interest block; **appeal reviewer must differ from the original decision-maker**; administrative actions restricted | CG 8.5 |
| **Reviewer dashboard** per clause 8 | ToS 10.3(c) |
| **Campaign Owner interface:** evidence upload with pre-upload redaction guidance; closure form; status and deadlines; appeal | ToS 10.2–10.3; Privacy 11.2 |
| **Donor interface:** neutral lifecycle state; closure notifications; refund request including a surplus-share claim | Donor Terms 9, 10; Refund 10.3(b) |
| **Notifications N1–N16 with delivery logging** | Clause 9 |
| **Surplus ledger preventing double refund** | Refund 10.3(c) |

## 10A. Verified build position as at 5 August 2026

Nothing in this procedure exists in the product today. Stated precisely, so the gap is not underestimated:

- **Closure statements do not exist.** There is no closure concept anywhere in the backend — no fields, no lifecycle state, no review, no cure cycle, no administrative-closure job, no public status.
- **Evidence records exist but are unreachable and unenforced.** A due date is calculated from the expenditure date, but **nothing ever reads it** — no reminder, no email, no escalation. There is no status field, no review gate and no redaction tooling.
- **Material change requests exist as a flat request-and-decide flow** with no severity tiers, no donor notification, no refund-window trigger and no spend-freeze field.
- **Neither evidence nor material changes is referenced by any part of the user interface.** Both are backend-only and unreachable by any user.
- **No snapshot is captured at donation.** The donation record holds a live reference to the campaign, so **editing a campaign's title, target or owner retroactively changes what every past donation appears to have funded.** This is a structural gap, and it is the one that most directly undermines the conditional-donation model.
- **No target cap exists**, so a campaign can currently be over-funded.

**Consequence.** The whole of section 7 (immutable evidence) and section 9 (notifications) is unbuilt, and items EV-01 to EV-12 and CR-09 are launch blockers for paid campaigns. **The immutable donation-time snapshot (EV-01) should be built first**, because every later evidence question depends on being able to say what the campaign said when the money was given.

## 11. Legal wording this procedure required

The following were amended in v2.3 to make the workflow above deliverable and accurate: ToS 10.2 (evidence status replaced with neutral lifecycle states); ToS 10.3(c)–(f) (reviewer checklist, one cure cycle, administrative-closure labelling, donor notification, appeal); ToS 31.3 (24-month archival); Refund Policy 3.3(d) (failure to provide evidence after cure as a standalone ground) and 10.3 (surplus ledger and individual claim); Student Campaign Terms 7.2 and 7.5; and Privacy Notice 7.1 and 11.

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
