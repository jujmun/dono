# Release Control Matrix

**Status:** Required and not yet populated  
**Owner:** To be assigned  
**Last reviewed:** 7 August 2026

This is the operational release gate linking engineering, legal, compliance and
operations. [`../../TRUTH.md`](../../TRUTH.md) remains the single record of
settled facts and decisions; this matrix records whether those decisions have
been implemented and evidenced sufficiently for a feature to be released.

The keywords **MUST**, **MUST NOT**, **SHOULD** and **MAY** are normative.

## Principles

- Every user-facing feature **MUST** have exactly one matrix entry.
- No feature **MUST** move to production unless every applicable control is
  complete.
- If a required item is incomplete, the feature **MUST** remain blocked,
  regardless of engineering completion.
- A change affecting legal, privacy, payments, moderation, security, safety or
  data processing **MUST** update the relevant documentation before release.
- The matrix is authoritative for the release decision. It does not override or
  amend a fact or decision in `TRUTH.md`.

## Required fields

| Column | Content |
|---|---|
| Feature | The user-facing feature, named as users recognise it |
| Feature flag | Current production state: On or Off |
| Engineering status | Not started, In progress, Complete or Deployed to staging |
| Public documentation | Exact applicable public documents and versions |
| Data flow | Whether the personal-data flow has been mapped and reviewed |
| DPIA | Updated or Not applicable |
| Risk assessments | Applicable safety, privacy, financial-crime or geographic assessments |
| Moderation / operations | Updated procedure or Not applicable |
| Test evidence | Link to dated evidence and the tested deployment or commit |
| Accountable owner | A named person, not a team |
| Launch state | Blocked, Ready or Live |
| Notes | Context required to understand the decision |

## Release rules

- A feature **MUST NOT** be marked **Ready** unless every applicable field is
  complete.
- A feature **MUST NOT** be enabled in production while its launch state is
  **Blocked**.
- An inapplicable control **MUST** say **Not applicable**; fields must not be left
  blank.
- The matrix **MUST** be reviewed before every production deployment.
- Every production release **MUST** reference the relevant matrix entries.
- If an incomplete control is discovered after release, the feature flag
  **MUST** be turned off until the control is completed.
- The accountable owner **MUST** confirm every field. Where more than one person
  is available, the same person **MUST NOT** confirm both engineering status and
  legal documentation.
- The full matrix **SHOULD** be reviewed at least monthly.
- A blocked feature **MAY** run in staging with synthetic data if no real user,
  real payment or real personal data is involved.

## Matrix

Every user-facing feature requires an entry before launch. At minimum this
includes registration, verification, campaign creation and publication,
campaign pages, checkout, fee cover, refunds, disputes, evidence upload, closure
statements, comments, reporting, moderation, appeals, analytics consent,
campaign archival, data export and platform kill switches.

Population is tracked as **RM-01** in
[`../../engineering/legal-launch/ENGINEERING_IMPLEMENTATION_CHECKLIST_v2.3.md`](../../engineering/legal-launch/ENGINEERING_IMPLEMENTATION_CHECKLIST_v2.3.md).

| Feature | Flag | Engineering | Public docs | Data flow | DPIA | Risk assessments | Moderation / ops | Test evidence | Owner | Launch state | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| *(to be populated)* | | | | | | | | | | **Blocked** | |

## Updating the matrix

1. Confirm the relevant fact or decision in `TRUTH.md`.
2. Update the implementation, documents, assessments and procedures.
3. Link dated evidence tied to the tested deployment or commit.
4. Obtain the required named approvals.
5. Change the launch state only after every applicable field is complete.
6. Preserve the prior decision in release history rather than silently
   overwriting it.
