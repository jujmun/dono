# Dono Online Safety and Moderation Traceability Matrix

**Version:** 1.0 — 6 August 2026  
**Status:** Authoritative cross-document consistency record  

## 1. Canonical document register

| Document | Moderation scope | Canonical relationship |
|---|---|---|
| `05_dono_community_guidelines_v2.2.md` | Public prohibited-content, reporting, complaints and appeals rules | Public source of truth for content and moderation |
| `dono-online-safety-procedures.md` | Internal accountability, triage, child safety, CSEA, metrics and assurance | Implements the Community Guidelines without changing public rights |
| `dono-illegal-content-risk-assessment.md` | Illegal-content risks, controls and effectiveness monitoring | Explains why the operational controls are required |
| `dono-childrens-risk-assessment.md` | Children's access, harm controls and monitoring | Defines child-safe-by-default controls and residual risk |
| `dono-complaints-policy.md` | General complaints and route coordination | Defers content/moderation challenges to Community Guidelines clause 8 |
| `dono-dp-complaints-workflow.md` | Data-protection complaint handling | Separate statutory route sharing unified intake |
| `dono-incident-response-plan.md` | Security/personal-data incidents and emergency containment | CSEA matters defer to the specialist Online Safety procedure |
| `01_dono_terms_of_service_v2.2.md` clauses 17–25 and 33 | Contractual platform, enforcement, evidence and complaint promises | Must match the Community Guidelines and procedures |
| `ENGINEERING_MODERATION_REQUIREMENTS.md` | Build, permissions, data, audit, notices, edge cases and acceptance tests | Implementation blueprint for every operational capability |

## 2. Interpretation

Each row below is an atomic operational statement or a set of adjacent statements that describe one indivisible capability. Wording such as “Dono has,” “Dono provides,” “Users can,” “Moderators review,” “Dono records,” and “Dono operates” is represented by a statement ID. A row passes traceability only when it identifies both an engineering feature and its policy basis; a feature cannot exist solely because engineering finds it useful.

Owner roles are: **PE** Product Engineering; **TSE** Trust & Safety Engineering; **PS** Platform/Security; **DC** Data/Compliance; **MO** Moderation Operations. Operational policy accountability remains with the Online Safety lead.

## 3. Policy → feature → acceptance test → engineering owner

| Statement | Policy source and operational statement | Feature | Acceptance test | Engineering owner |
|---|---|---|---|---|
| OS-001 | Community Guidelines 7.1: every campaign has a report control | MOD-001 | AT-MOD-001 | TSE |
| OS-002 | Community Guidelines 7.1: every campaign update has a report control | MOD-002 | AT-MOD-002 | TSE |
| OS-003 | Community Guidelines 7.1: every comment has a report control | MOD-003 | AT-MOD-003 | TSE |
| OS-004 | Community Guidelines 7.1: every username/avatar is reportable | MOD-004 | AT-MOD-004 | TSE |
| OS-005 | Community Guidelines 7.1: every image, video and document is separately reportable | MOD-005 | AT-MOD-005 | PS |
| OS-006 | Community Guidelines 7.2: `/report` works without login and allows anonymous reporting | MOD-006 | AT-MOD-006 | PE |
| OS-007 | Community Guidelines 7.2, Complaints 1.2: email and form intake reach one tracked system | MOD-007, MOD-032 | AT-MOD-007, AT-MOD-032 | TSE / PE |
| OS-008 | Community Guidelines 7.3: reporters choose plain-language harm categories and need not decide criminality | MOD-001–006, MOD-013 | AT-MOD-001–006, AT-MOD-013 | TSE |
| OS-009 | Community Guidelines 7.3: CSEA reporters are told not to copy or attach material | MOD-005, MOD-015 | AT-MOD-005, AT-MOD-015 | PS |
| OS-010 | Community Guidelines 7.4: every report creates a moderation case | MOD-007, MOD-010 | AT-MOD-007, AT-MOD-010 | TSE |
| OS-011 | Community Guidelines 7.4: Dono acknowledges, triages and assigns reports | MOD-007, MOD-009, MOD-012 | AT-MOD-007, AT-MOD-009, AT-MOD-012 | TSE / PE |
| OS-012 | Community Guidelines 7.4: reported content and context are preserved | MOD-001–005, MOD-011 | AT-MOD-001–005, AT-MOD-011 | PS |
| OS-013 | Community Guidelines 7.4: humans decide illegal-content or policy-breach grounds | MOD-013 | AT-MOD-013 | TSE |
| OS-014 | Community Guidelines 7.4: urgent danger bypasses the ordinary queue | MOD-009, MOD-016 | AT-MOD-009, AT-MOD-016 | TSE / PS |
| OS-015 | Community Guidelines 7.5: good-faith rejected reports are not abusive | MOD-007, MOD-027 | AT-MOD-007, AT-MOD-027 | TSE / DC |
| OS-016 | Community Guidelines 7.5: knowing/reckless coordinated abuse is reviewable | MOD-027 | AT-MOD-027 | DC |
| OS-017 | Community Guidelines 8.2: affected users, reporters, non-users and children can complain or appeal | MOD-006, MOD-014, MOD-023, MOD-032 | AT-MOD-006, AT-MOD-014, AT-MOD-023, AT-MOD-032 | PE / TSE |
| OS-018 | Community Guidelines 8.3: decision notices and tracking references link to the correct appeal | MOD-023, MOD-024, MOD-031 | AT-MOD-023, AT-MOD-024, AT-MOD-031 | TSE / PE |
| OS-019 | Community Guidelines 8.4: Online Safety matters are acknowledged within five Working Days and target 30 days | MOD-007, MOD-023, MOD-032 | AT-MOD-007, AT-MOD-023, AT-MOD-032 | TSE / PE |
| OS-020 | Community Guidelines 8.5: appeal reviewer was not substantially involved; conflicts and recusal are enforced | MOD-010, MOD-012, MOD-023, MOD-030 | AT-MOD-010, AT-MOD-012, AT-MOD-023, AT-MOD-030 | PS / TSE |
| OS-021 | Community Guidelines 8.6: outcome confirms, varies or reverses | MOD-023, MOD-024 | AT-MOD-023, AT-MOD-024 | TSE |
| OS-022 | Community Guidelines 8.6: reversal restores eligible content, campaign functionality or access | MOD-019 | AT-MOD-019 | PE |
| OS-023 | Community Guidelines 8.7: decisions, evidence, grounds, notices and reversals are recorded | MOD-010, MOD-024, MOD-025 | AT-MOD-010, AT-MOD-024, AT-MOD-025 | TSE / PS |
| OS-024 | Community Guidelines 8.7: moderator actions and privileged access are tamper-evident | MOD-025, MOD-026 | AT-MOD-025, AT-MOD-026 | PS / DC |
| OS-025 | Community Guidelines 8.7: monthly review detects repeat offenders, linked accounts and recurring patterns | MOD-027, MOD-035 | AT-MOD-027, AT-MOD-035 | DC |
| OS-026 | Community Guidelines 6.1: comments are public, account-attributed, editable/deletable and restorable after owner misuse | MOD-003, MOD-019, MOD-034 | AT-MOD-003, AT-MOD-019, AT-MOD-034 | PE |
| OS-027 | Community Guidelines 6.2: comments reject links, images and attachments in client and server | MOD-034 | AT-MOD-034 | PE |
| OS-028 | Community Guidelines 3.3: proportionate actions include no action, warning, restriction, suspension, removal and ban | MOD-013, MOD-018, MOD-020–022 | AT-MOD-013, AT-MOD-018, AT-MOD-020–022 | TSE / PE / PS |
| OS-029 | Community Guidelines 4.3: moderators can redact sensitive information while leaving a campaign online | MOD-018 | AT-MOD-018 | PE |
| OS-030 | Online Safety Procedures 3.1: named accountability, deputies and emergency restriction authority operate | MOD-016, MOD-030 | AT-MOD-016, AT-MOD-030 | PS |
| OS-031 | Online Safety Procedures 3.2: P1 is immediate, P2 targets 24 hours, P3 targets three Working Days | MOD-009 | AT-MOD-009 | TSE |
| OS-032 | Online Safety Procedures 3.2: moderators can restrict updates, comments, media, campaigns, donations and accounts | MOD-018, MOD-021 | AT-MOD-018, AT-MOD-021 | PE / PS |
| OS-033 | Online Safety Procedures 3.2: actions require reason, audit event and reversibility | MOD-018, MOD-019, MOD-024, MOD-025 | AT-MOD-018, AT-MOD-019, AT-MOD-024, AT-MOD-025 | PE / PS |
| OS-034 | Online Safety Procedures 3.3: child-safe-by-default service has no DM, livestreaming, groups, disappearing content or recommendations | MOD-038 plus product architecture | AT-MOD-038 | PE |
| OS-035 | Online Safety Procedures 3.3: every campaign and full video is reviewed before publication | MOD-033 | AT-MOD-033 | PE / MO |
| OS-036 | Online Safety Procedures 3.3: checkout records adult/parental-permission confirmation | Existing checkout requirement; child workflow linkage in MOD-014 | AT-MOD-014 plus checkout test | PE |
| OS-037 | Online Safety Procedures 3.3: parents can request correction/deletion and unauthorised-child-donation refund | MOD-014, MOD-032, MOD-036 | AT-MOD-014, AT-MOD-032, AT-MOD-036 | PE |
| OS-038 | Online Safety Procedures 3.4: CSEA access is immediately restricted and specialist-only | MOD-005, MOD-015 | AT-MOD-005, AT-MOD-015 | PS |
| OS-039 | Online Safety Procedures 3.4: system preserves available statutory data without unnecessary new collection | MOD-011, MOD-015 | AT-MOD-011, AT-MOD-015 | PS |
| OS-040 | Online Safety Procedures 3.4: NCA priorities, duplicate checks, portal submission and reference are recorded | MOD-015 | AT-MOD-015 | PS |
| OS-041 | Online Safety Procedures 3.4: imminent child danger uses 999 fallback | MOD-015, MOD-016 | AT-MOD-015, AT-MOD-016 | PS |
| OS-042 | Online Safety Procedures 3.4: CSEA evidence deletes at one year and NCA reference at five years unless lawfully held | MOD-015, MOD-029 | AT-MOD-015, AT-MOD-029 | PS |
| OS-043 | Online Safety Procedures Training: roles receive training and records are retained | MOD-030 plus operational training register | AT-MOD-030 and quarterly exercise evidence | PS / MO |
| OS-044 | Online Safety Procedures Records: monthly compliance dashboard covers reports, timing, outcomes, child cases, referrals, appeals and repeat patterns | MOD-026, MOD-035 | AT-MOD-026, AT-MOD-035 | DC |
| OS-045 | Online Safety Procedures assurance: continuous controls and quarterly P1/CSEA exercises operate | MOD-015, MOD-016, MOD-025, MOD-029, MOD-030, MOD-035, MOD-037 | Corresponding ATs | PS / DC |
| OS-046 | Complaints Policy 1: unified intake routes each element and avoids duplicate decisions | MOD-032 | AT-MOD-032 | PE |
| OS-047 | Complaints Policy 2–3: completeness, one consolidated information request and applicable clocks are tracked | MOD-032 | AT-MOD-032 | PE |
| OS-048 | Complaints Policy 4–6: assigned investigation, reasoned response, internal review and ADR information | MOD-024, MOD-032 | AT-MOD-024, AT-MOD-032 | TSE / PE |
| OS-049 | Complaints Policy 7: six-year complaint record and monthly review | MOD-029, MOD-035 | AT-MOD-029, AT-MOD-035 | PS / DC |
| OS-050 | DP Complaints Workflow: public/email intake, 30-day acknowledgement and restricted tracking | MOD-036 | AT-MOD-036 | PE / PS |
| OS-051 | DP Complaints Workflow: ROPA-based investigation, identity/data export and breach escalation | MOD-036, MOD-037 | AT-MOD-036, AT-MOD-037 | PS |
| OS-052 | Incident Response Plan 1–3: severity, alert, 24-hour assessment and emergency containment | MOD-037 | AT-MOD-037 | PS |
| OS-053 | Incident Response Plan 4–8: evidence, ICO/individual analysis, remediation and breach log | MOD-011, MOD-025, MOD-037 | AT-MOD-011, AT-MOD-025, AT-MOD-037 | PS |
| OS-054 | Incident Response Plan 9: post-incident review and corrective actions | MOD-037 | AT-MOD-037 | PS |
| OS-055 | Illegal-Content Risk Assessment 8.1: responsibility matrix, training, targets and coverage are maintained | MOD-009, MOD-026, MOD-030 | AT-MOD-009, AT-MOD-026, AT-MOD-030 | TSE / DC / PS |
| OS-056 | Illegal-Content Risk Assessment 8.2: campaign checklist records approve/request/reject/escalate | MOD-033 | AT-MOD-033 | PE / MO |
| OS-057 | Illegal-Content Risk Assessment 8.3: material campaign edits require re-review; comments rate-limit; comments can be disabled | MOD-033, MOD-034 | AT-MOD-033, AT-MOD-034 | PE |
| OS-058 | Illegal-Content Risk Assessment 9–10: metrics, versioning, annual/change/incident review and retained assessments | MOD-035 | AT-MOD-035 | DC |
| OS-059 | Children's Risk Assessment 6: role-authorised restrictions, NCA readiness, retention and audit operate | MOD-015, MOD-018, MOD-025, MOD-029, MOD-030 | Corresponding ATs | PS / PE |
| OS-060 | Children's Risk Assessment 8: child fast track, comment risk signals and repeat-offender review operate | MOD-014, MOD-027, MOD-034 | AT-MOD-014, AT-MOD-027, AT-MOD-034 | TSE / DC / PE |
| OS-061 | Terms 17.1: Dono has no private messaging | MOD-038 | AT-MOD-038 | PE |
| OS-062 | Terms 18.2: Dono records decisions, permits appeals, restores and reports detected CSEA | MOD-015, MOD-019, MOD-023–025 | Corresponding ATs | TSE / PS / PE |
| OS-063 | Terms 20.2: notice-and-action, affected-user notice, counter-notice, repeat controls and evidence preservation operate | MOD-024, MOD-027, MOD-011 | AT-MOD-024, AT-MOD-027, AT-MOD-011 | TSE / PS |
| OS-064 | Terms 22: warning, restriction, suspension and ban safeguards operate | MOD-020–024 | AT-MOD-020–024 | PE / PS / TSE |
| OS-065 | Terms 23.4–23.6: emergency action, authority verification, notice/appeal and evidence preservation operate | MOD-011, MOD-016, MOD-023–025 | Corresponding ATs | PS / TSE |
| OS-066 | Terms 33: general complaints process and final response operate | MOD-032 | AT-MOD-032 | PE |
| OS-067 | Production system: moderator dashboard, queues, search, filtering and assignments operate | MOD-008–012, MOD-028 | AT-MOD-008–012, AT-MOD-028 | PE / TSE |
| OS-068 | Production system: trusted specialists are supported without automatic takedown authority | MOD-017 | AT-MOD-017 | TSE |
| OS-069 | Production system: risk scoring is explainable, minimised and human-review-only | MOD-027 | AT-MOD-027 | DC / PS |
| OS-070 | Production system: internal analytics and public transparency outputs are disclosure-safe | MOD-035 | AT-MOD-035 | DC |

## 4. Completeness results

- **Policy statements without an engineering feature:** none identified in the moderation, complaints and Online Safety scope.
- **Engineering features without a policy requirement:** none. MOD-017, MOD-026–028 and MOD-035 are operational means of satisfying the monitoring, prioritisation, repeat-offender, evidence and accountability statements identified above.
- **Private-message reporting:** not applicable because Terms 17.1 and the risk assessments prohibit/private-message functionality is absent. MOD-038 is the release guard; any future messaging proposal requires a new risk assessment and feature specification before implementation.
- **Automated moderation:** not used for final decisions. MOD-027 permits explainable prioritisation signals only, and AT-MOD-027 verifies human decision control.
- **Acceptance coverage:** every feature MOD-001 through MOD-038 has a named acceptance test and launch criticality in the engineering specification.
- **Ownership coverage:** every row maps to at least one engineering owner role; the release tracker assigns named individual DRIs before implementation begins.

## 5. Change-control rule

A moderation policy change is incomplete until this matrix and the engineering specification are updated in the same change. A feature change affecting user-generated content, age access, reporting, moderation, appeals, evidence, roles, notifications, retention or analytics is incomplete until the Online Safety lead confirms whether the public documents and risk assessments also change.

## 6. Official legal-source verification

The 6 August 2026 consistency review checked the core legal architecture against official sources:

- [Online Safety Act 2023 explanatory notes — content reporting and complaints procedures](https://www.legislation.gov.uk/ukpga/2023/50/notes/division/6/index.htm): users and affected persons can report illegal content; child-accessible services also enable reports of content harmful to children; complaints procedures are accessible, transparent and provide appropriate action including removal or reinstatement.
- [Ofcom — CSEA reporting duty](https://www.ofcom.org.uk/online-safety/illegal-and-harmful-content/duty-to-report-child-sexual-exploitation-and-abuse-csea-content-know-the-rules-and-how-to-comply): the user-to-user reporting regime operates from 7 April 2026, applies regardless of service size or assessed CSEA risk, requires registration and secure NCA reporting, avoids duplicate NCA/NCMEC reports, and uses 999 for immediate danger.
- [Ofcom — illegal-content duties](https://www.ofcom.org.uk/online-safety/illegal-and-harmful-content/illegal-content-duties-under-the-online-safety-act): providers assess risk, implement safety measures, keep written records and review assessments, including before significant service changes.
- [Ofcom — regulatory documents and guidance](https://www.ofcom.org.uk/online-safety/illegal-and-harmful-content/online-safety-regulatory-documents): current Codes of Practice, risk guidance, risk registers and Illegal Content Judgements Guidance are the controlled source set for operational reviews.
- [GOV.UK — 2026 ADR regulations](https://www.gov.uk/government/publications/the-digital-markets-competition-and-consumers-act-2024-alternative-dispute-regulations-2026): the 2026 instruments implement Chapter 4 of Part 4 of the Digital Markets, Competition and Consumers Act 2024 and replace the previous voluntary accreditation framework.

This source check confirms the architecture and does not replace final advice on Dono-specific scope, categorisation, ADR participation, defamation notices or individual enforcement decisions.
