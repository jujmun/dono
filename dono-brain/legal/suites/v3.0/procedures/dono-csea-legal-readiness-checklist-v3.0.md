# CSEA Legal-Readiness Checklist — Dono

**Document:** Legal readiness gate for the section 66 CSEA reporting duty
**Version:** 3.0
**Version date:** 7 August 2026
**Effective from:** on publication approval (see approval block)
**Service provider:** Amrit Kaur Rooprai, sole trader, trading as Dono
**Online Safety lead:** Amrit Kaur Rooprai · **Deputy:** Sashank · **Second backup:** Joe
**Status:** New consolidated record at v3.0. **NOT READY. Every item is outstanding.**
**Next review:** monthly until closed, then on any change of law, portal arrangement or named person.

> **This checklist is a gate, not a plan.** It records whether Dono is **legally able to discharge** its CSEA duty today. It is separate from and additional to the eight acceptance tests in `dono-online-safety-procedures-v3.0.md`. **Both gates must pass** before public user-generated content is enabled.

---

## 1. The duty

Under **section 66 of the Online Safety Act 2023** and the **Online Safety (CSEA Content Reporting by Regulated User-to-User Service Providers) Regulations 2026**, in force from **7 April 2026**, an in-scope user-to-user service provider must report all **detected and unreported** child sexual exploitation and abuse content to the **National Crime Agency**.

**Three features of the duty govern everything below:**

1. **It is absolute once content is detected.** It does not depend on volume, on scale, or on an assessed level of risk. A service with one detection has the same duty as a service with a million.
2. **"Detected" means aware.** However Dono becomes aware — a user report, a moderation flag, or something a team member notices in the ordinary course of review. **It does not need confirmation by law enforcement for the duty to arise.**
3. **It does not require proactive detection.** The duty is to report what Dono actually detects, not to deploy hash-matching or scanning technology. *(Whether such technology is separately required by an Ofcom Code measure is a distinct question, open at Illegal Content Risk Assessment §4.2.)*

**The authoritative operational procedure is `dono-csea-reporting-procedure-v3.0.md`.** This checklist records readiness to execute it.

---

## 2. Readiness determination

> ## **DONO IS NOT LEGALLY READY TO DISCHARGE THE SECTION 66 DUTY THROUGH THE NCA PORTAL.**
>
> **Every item C1 to C12 is outstanding. NCA registration is not confirmed.**
>
> Until C1–C5 close, Dono **cannot submit a report through the portal at all**. The consequence is not that the duty is suspended — the duty is absolute — but that Dono would be unable to comply if content were detected today.

### 2.1 The interim position

**Until registration is confirmed, trained and test-submitted, the operative route for an imminent risk to a child is 999 and local police.** That route is available now, requires no registration, and must be the one every moderator is told to use.

**This is a mitigation, not compliance.** It does not discharge the section 66 duty to report to the NCA. It is what Dono does while it cannot.

### 2.2 Why the launch block reduces but does not remove the exposure

Public user-generated content is disabled. That materially reduces the likelihood of detection — there is no public upload surface accepting user media at present. **But it does not remove the duty**, because Dono still operates a service on which content could be detected through the existing administrator queue, and because the duty attaches to detection however it occurs.

**No document may describe the CSEA reporting route as operational, registered or tested until section 4 is signed.**

---

## 3. The checklist

### 3.1 Registration and authorised reporters — **legal requirements, not negotiable**

| # | Requirement | Evidence required | Owner | Status |
|---|---|---|---|---|
| **C1** | Dono registered with the NCA CSEA reporting portal **as an organisation** | Written registration confirmation from the NCA | Amrit | **OUTSTANDING** |
| **C2** | **Organisation Administrator** (Amrit) account created and access tested | Dated test login record | Amrit | **OUTSTANDING** |
| **C3** | **Deputy Organisation Administrator** (Sashank) account created and access tested | Dated test login record | Sashank | **OUTSTANDING** |
| **C4** | **Named individual working accounts, not shared credentials** | Account list showing one account per named person | Amrit | **OUTSTANDING** |
| **C5** | **24-hour emergency contact registered** with the NCA | NCA confirmation | Amrit | **OUTSTANDING** |

> **C1 is the single blocking dependency for the whole regime.** Nothing downstream can be tested until the NCA confirms registration and which individuals are eligible users. **This is an external dependency Dono cannot resolve unilaterally and must be chased actively rather than waited on.**

### 3.2 Retention and deletion — **legal requirements**

| # | Requirement | Evidence required | Owner | Status |
|---|---|---|---|---|
| **C8** | **Automated deletion at 1 year** of the detected content, the information submitted, the information used to make the CSEA judgement, and relevant associated user data — with logging and a documented lawful-hold override | Clock-controlled test evidence; deletion log sample; hold test | Engineering | **OUTSTANDING** |
| **C9** | **5-year reference record held separately from the content**, so that the two clocks cannot be conflated | Schema evidence showing `report_reference_delete_at` and `restricted_evidence_delete_at` as distinct fields on distinct records | Engineering | **OUTSTANDING** |

> **Two clocks, never one.** `report_reference_delete_at` = report date + 5 years. `restricted_evidence_delete_at` = report date + 1 year.
>
> **Never write "all CSEA evidence is retained for five years."** Retaining the content for five years would be unlawful over-retention of the most sensitive material Dono will ever hold. Deleting the reference at one year would destroy the record the NCA may need.
>
> **No retention or deletion job of any kind currently runs** (DPIA risk L-01, L-16). C8 and C9 cannot close until the retention engine exists.

### 3.3 Safe handling — treated as blockers

C6, C7 and C10 are described in some guidance as best practice. **Dono treats them as blockers, because without them the legal requirements cannot in practice be met safely.** A moderator who cannot restrict content without deleting it will either destroy evidence needed for the report or leave the material accessible.

| # | Requirement | Evidence required | Owner | Status |
|---|---|---|---|---|
| **C6** | **Restricted storage built**: segregated, encrypted, role-limited, access-logged, specialist-access-only | Access-control test; storage segregation evidence; access log sample | Engineering | **OUTSTANDING** |
| **C7** | **Hide-in-place available to moderators** — restrict without delete, so evidence is preserved while public access is removed | Test evidence showing content restricted and still retrievable by an authorised specialist | Engineering | **OUTSTANDING** |
| **C10** | **Safe-handling training completed by every moderator** — non-graphic, covering recognition, when to stop viewing, restriction, escalation, the three priority levels, the 999 route, the prohibition on personal downloads, screenshots and forwarding, confidentiality, and welfare | Training register with names, dates and refresher dates | Amrit | **OUTSTANDING** |

### 3.4 Exercises — treated as blockers

| # | Requirement | Evidence required | Owner | Status |
|---|---|---|---|---|
| **C11** | **Harmless-data drill completed end to end** — a synthetic file through the full workflow, with **no real material at any point** | Dated drill record with participants and outcome | Amrit | **OUTSTANDING** |
| **C12** | **Tabletop exercise T2 completed** | Dated exercise record with participants, scenario and lessons | Amrit | **OUTSTANDING** |

> **C11 is the only way to discover that the workflow does not work before it matters.** A drill that has never been run is not a control.

---

## 4. Standing legal rules — in force now, independent of readiness

These are not checklist items. They apply from today and every moderator must be told them **before** they have any prospect of encountering such material.

| # | Rule |
|---|---|
| 1 | **Never download suspected CSEA content to a personal computer or phone.** |
| 2 | **Never screenshot it.** |
| 3 | **Never forward it** by email, Slack, WhatsApp or any other channel. |
| 4 | **Stop ordinary review immediately** and restrict the content from public access. |
| 5 | **Notify Amrit and the deputy** through the emergency channel. |
| 6 | **Only the minimum number of trained people may access** the quarantined material. |
| 7 | **Do not delete it** — deletion destroys evidence required for the report. Restrict in place. |
| 8 | **Where there is imminent risk to a child and Amrit cannot be reached, call 999.** |
| 9 | **Do not collect categories of information Dono does not otherwise hold** merely to complete the report form. The obligation concerns information available to the provider. |
| 10 | **The same content must not be reported through both NCMEC and the NCA.** Check for duplicate reporting before submitting, and link any new report to the earlier reference. |
| 11 | **Knowingly submitting false information in a CSEA report is a criminal offence.** This procedure is for genuine, good-faith detections only. |
| 12 | **A CSEA report or a Priority 1 safety concern is never declined at intake** (Appropriate Policy Document §5.6). |

---

## 5. Data-protection position

| Question | Position |
|---|---|
| **Article 6 basis** | **Legal obligation** — section 66 Online Safety Act 2023 and the 2026 Regulations |
| **Article 9 / 10 condition** | **Schedule 1 paragraph 10**, extended to Article 10 criminal-offence data by **paragraph 36**. This is a direct fit: the processing is the detection and reporting of suspected unlawful conduct |
| **Recipient** | The **National Crime Agency**, as an independent controller |
| **Transfers outside the UK** | **None** |
| **Retention** | Reference 5 years; content and prescribed supporting information 1 year (§3.2) |
| **Data subject rights** | Substantially restricted while a report is live, under the crime and safeguarding exemptions. **Do not notify the subject of a CSEA report**, which would prejudice the NCA's function |
| **Records** | ROPA row 18; Appropriate Policy Document §3; DPIA risk L-16 |

---

## 6. Summary

| Group | Items | Status |
|---|---|---|
| Registration and authorised reporters (legal) | C1–C5 | **0 of 5 complete** |
| Retention and deletion (legal) | C8–C9 | **0 of 2 complete** |
| Safe handling (blocking) | C6, C7, C10 | **0 of 3 complete** |
| Exercises (blocking) | C11, C12 | **0 of 2 complete** |
| **Total** | **C1–C12** | **0 of 12 complete** |

**Critical path.** C1 (NCA registration) blocks C2–C5. The retention engine blocks C8 and C9. Restricted storage (C6) blocks C11. Training (C10) blocks C11 and C12.

**The single most urgent action is to submit and chase the NCA registration**, because it is an external dependency with an unknown lead time that blocks five of the twelve items and cannot be accelerated once the rest is ready.

---

## 7. Approval block — SIGNATURE REQUIRED

> **This block is unsigned. Dono is NOT legally ready. Public user-generated content remains disabled.**

**I confirm that I have reviewed each item C1 to C12 against actual evidence, that no item is marked complete without the stated evidence on file, that I understand the section 66 duty is absolute once content is detected, and that until this checklist is complete the operative route for an imminent risk to a child is 999 and local police.**

| Field | Entry |
|---|---|
| Approver name | Amrit Kaur Rooprai |
| Role | Online Safety lead and service provider |
| Document version approved | 3.0 |
| Items complete | **0 of 12** |
| NCA registration confirmed (C1)? | ☐ Yes, on ____________ · ☑ **No** |
| CSEA route legally ready? | ☐ Yes, on ____________ · ☑ **No** |
| Interim route communicated to every person capable of reviewing content? | ☐ Yes, on ____________ · ☐ No |
| Signature | ______________________ |
| Date | ______________________ |

**Reviewed by:** Sashank (deputy) — Signature ______________________  Date ______________

---

## 8. Version control

| Field | Entry |
|---|---|
| Version | 3.0 |
| Version date | 7 August 2026 |
| Effective from | On publication approval |
| Accountable owner | Amrit Kaur Rooprai |
| Prepared by | Legal consolidation, 7 August 2026 |
| Approved by | *(signature required — section 7)* |
| Status | **NOT READY.** 0 of 12 items complete |
| Supersedes | Nothing — consolidated at v3.0 from the pre-launch checklist in `../../v2.3/dono-csea-reporting-procedure-v2.3.md` §9 |
| Next scheduled review | **Monthly until closed**, then on any change of law, portal arrangement or named person |
