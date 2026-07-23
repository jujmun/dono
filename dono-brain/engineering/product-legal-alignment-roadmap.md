# Dono Engineering Brief
## Product-Legal Alignment Roadmap
**Version:** July 2026

---

# Purpose

This document summarises all engineering work required to align the Dono platform with the current legal framework, product roadmap, and MVP strategy.

This is **not** a request to immediately build every feature.

Instead, this document should act as the engineering source of truth for:

- current implementation
- intentional deviations
- urgent work before demo
- post-demo roadmap
- legal alignment requirements

The legal documents remain the ultimate source of truth.

---

# Current MVP Scope

The MVP is intentionally limited.

The platform currently demonstrates:

- Society campaigns
- Society approval
- Stripe onboarding
- Donations
- Campaign pages
- Updates
- Basic moderation

The following are **not** part of the MVP:

- Student-created campaigns
- Community Funds
- Institution-wide campaigns
- Monthly donations
- Advanced dispute workflows

The engineering team should therefore implement infrastructure that supports future expansion without delaying the demo.

---

# Priority Levels

## P0 — Must be completed before the demo

These are blockers.

---

## 1. Society Approval Infrastructure

This is currently the highest engineering priority.

Every campaign must require approval before becoming publicly visible.

Required workflow:

Draft Campaign

↓

Submitted for Approval

↓

Society Committee Review

↓

Approved / Rejected

↓

Published

No campaign should automatically become public.

### Required functionality

Committee members need:

- pending campaign queue
- approve
- reject
- optional rejection reason

Campaign creators need:

- pending status
- rejected status
- approval notification

Future institutional approval should reuse this infrastructure.

---

## 2. Verification Badge System

Replace generic labels.

Current examples:

- Society Campaign
- New Campaign

Need proper verification badges matching the legal documents.

Required badges:

- Verified Student
- Student Status Checked by Dono
- Stripe Onboarding Completed
- Society Approved
- Institutionally Endorsed

Notes:

All approved student users should automatically become Verified Students.

Badges should be reusable across the platform.

---

## 3. Campaign Creation Fields

Current campaign creation is missing several legally required fields.

Add:

### Purchase Links

Multiple links if necessary.

Purpose:

Evidence of intended purchases.

---

### Expected Expenditure Date

Internal record.

Shown only where appropriate.

---

### Planned Update Schedule

Internal only.

Not publicly visible.

Used for reminders and compliance.

---

Existing fields already present:

- title
- description
- goal
- deadline
- impact items / itemised budget

---

## 4. Fee Cover Option

Current implementation:

Every donation loses 5%.

New checkout:

Donation Amount

↓

Optional checkbox

"I would like to cover Dono and payment processing fees."

Checkout should display:

- intended donation
- Dono fee
- Stripe fee
- total charged
- amount reaching campaign

This should become the default donation experience.

---

## 5. Society Infrastructure

Needs to exist before the demo.

Includes:

committee roles

approval permissions

campaign moderation

society ownership

future committee succession

This infrastructure will become the foundation for:

- committee dashboards
- society analytics
- campaign management

---

# P1 — Build Immediately After Demo

---

## Refund Request System

Current implementation only reacts to Stripe disputes.

Need full product workflow.

Required:

User submits refund request

↓

Campaign owner notified

↓

Evidence submitted

↓

Decision

↓

Appeal (future)

↓

Stripe refund if approved

Should support:

- duplicate donations
- fraud
- accidental payment
- campaign cancellation
- non-delivery

Must integrate with future audit logs.

---

## Evidence System

Required by Student Campaign Terms.

Campaign owners should upload:

- receipts
- invoices
- proof of purchase

Evidence should be attached to expenditure.

---

## Outcome Updates

Campaign owners should be required to submit updates.

Need:

scheduled reminders

completion updates

images

documents

progress reports

Long-term:

automatic reminder engine.

---

## Reporting Infrastructure

Need full community moderation.

Users should be able to report:

campaigns

comments

users

updates

Evidence should accompany reports.

Admin moderation queue required.

---

## Comment Moderation

Need:

edit comment

edited indicator

report comment

campaign-owner removal

admin removal

audit history

---

## Legal Pages

Build product routes for:

Terms of Service

Privacy Policy

Cookie Policy

Donor Terms

Student Campaign Terms

Community Guidelines

Initially these can simply render the legal documents.

Need footer links.

Need acceptance tracking.

---

## Acceptance Tracking

Users should explicitly accept:

Terms

Privacy

Cookies (where required)

Acceptance should be versioned.

Store:

accepted version

accepted timestamp

future reacceptance support

---

# P2 — Future Infrastructure

---

## Student Campaigns

Current MVP supports only Society Campaigns.

Future support:

Student Campaign

↓

Verification

↓

Student Connected Account

↓

Campaign Creation

The architecture should avoid assumptions that campaigns always belong to societies.

---

## Responsible Individual

Society campaigns require:

Responsible Individual

Successor

Transfer process

Should integrate with committee management.

---

## Campaign Funding Disclosure

Campaign page should clearly show:

Funds paid to:

- Society account

or

- Named student

This improves transparency.

---

## Monthly Donations

Not required before launch.

Future system:

monthly recurring donations

subscription management

failed payment recovery

subscription cancellation

financial reporting

This should reuse existing payment infrastructure where possible.

---

## Community Funds

Deferred.

No engineering work currently required.

Architecture should remain compatible.

---

# Age Verification

The legal framework requires all users to be 18+.

Investigate whether Stripe Identity / Stripe KYC verified DOB can become the authoritative age verification source.

Desired flow:

Identity verification

↓

Verified DOB

↓

Age >=18

↓

Account approved

↓

Verified Student badge

If Stripe cannot reliably provide this for every user flow, propose an alternative solution before implementation.

**Action:** Add this investigation to the company brain engineering/legal TODO list.

---

# Current Intentional Deviations

These differences are intentional.

Do not "fix" them.

---

## Student Campaigns

Not yet supported.

Only Society Campaigns for MVP.

---

## Community Funds

Deferred.

---

## Monthly Donations

Deferred.

---

## Institution Approval

Future feature.

Society approval only for MVP.

---

# Database Considerations

Likely new fields:

Campaign:

- purchase_links
- expected_expenditure_date
- planned_update_schedule
- approval_status
- approved_by
- approved_at
- rejection_reason

Verification:

- verification_badges
- verified_student
- stripe_verified
- society_verified
- institution_verified

Refunds:

- refund_requests
- refund_status
- appeal_status

Evidence:

- receipts
- invoices
- expenditure_records

Moderation:

- reports
- moderation_actions
- audit_logs

Legal:

- accepted_terms_version
- accepted_terms_timestamp
- privacy_version
- cookie_version

---

# UX Principles

Engineering decisions should prioritise:

Trust

Transparency

Verification

Minimal friction

Clear financial breakdowns

Strong moderation

Reusable infrastructure

Future scalability

The platform should be built so additional campaign types can be introduced with minimal architectural change.

---

# Out of Scope

Do not spend engineering effort on:

Community Funds

Institution campaigns

Student campaigns

Advanced appeal systems

Subscription engine

These will be implemented after the MVP.

---

# Engineering Deliverables

## Before Demo

- Society approval workflow
- Committee approval dashboard
- Verification badges
- Campaign approval queue
- New campaign fields
- Fee-cover checkout
- Society management infrastructure

---

## Immediately After Demo

- Refund request workflow
- Evidence uploads
- Campaign updates
- Reporting system
- Comment moderation
- Legal document pages
- Acceptance/version tracking

---

## Future

- Student campaigns
- Responsible Individual management
- Monthly donations
- Community Funds
- Institution approval
