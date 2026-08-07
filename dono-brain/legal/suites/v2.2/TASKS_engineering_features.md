# Features for engineers to build — obligations created by terms_v2.2

**Version:** 2.3 — 6 August 2026
**Owner:** Amrit

This file remains the tracker for non-moderation product obligations in the wider legal suite. Moderation, complaints and Online Safety requirements are now canonical in `ENGINEERING_MODERATION_REQUIREMENTS.md`, with policy traceability in `ONLINE_SAFETY_TRACEABILITY.md`. The policy documents describe the production launch system in present tense; implementation status is tracked against acceptance tests and does not qualify policy wording.

**P0** — blocks publication of the cited document and blocks launch.
**P1** — required before general public launch.
**P2** — required, but a documented interim position is defensible.

---

## P0 — Blocks publication and launch

### Payments

**1. Change the fee model from the fixed envelope to per-card + 3.5 points.**
Adopt one effective-dated Dono application-fee formula for one-off and recurring Donations, including rounding, fee-cover allocation and partial-refund calculations. Checkout must show the Dono fee actually charged, separate it from the Payment Provider's estimated processing cost, and identify that processing figure as an estimate until the actual cost settles.
*Source: ToS 16.1; Donor 6.1.*

**2. Disable or remove the platform-initiated refund path.**
`processApprovedRefund` calls `stripe.refunds.create` with `stripeAccount` set to the connected account. v2.2 states in six places that Dono does not initiate refunds and holds no reserve power to do so. Either the code goes or the clauses do — the decision is that the code goes. **Keep the application-fee refund**, which is Dono returning its own money and is a promise we make.
*Source: ToS 15.4; Refund 1.2, 6.1; Donor 12.1; Student 9.2; Society 4.2.*

**3. Remove the community-fund charge path.**
Community-fund gifts settle on Dono's own platform account with Dono as merchant of record. That makes "Dono does not receive, hold, safeguard or control donation funds" untrue, and it is the sentence the payment-services perimeter conclusion rests on. No such feature until any required authorisation is held.
*Source: ToS 4.2, 8.4; Financial Crime 3, 7.2.*

**4. Enforce the campaign target as a hard server-side cap.**
Four documents state that a campaign cannot be over-funded, and the rule that over-funding is refunded in full with no de minimis depends on it. Must hold under concurrent donations.
*Source: ToS 14.6; Student 5.1; Donor 10.3; Refund 10.3.*

**5. Show the exact total, or a true maximum, before the donor confirms.**
Checkout currently estimates a standard UK card. Either detect the card category before confirmation, or show the calculation method and a genuine worst-case maximum — and never charge more than the confirmed total.
*Source: ToS 16.5; Donor 6.4.*

**6. Build the "You're donating to" checkout panel.**
Must show, before confirmation: the Campaign; the Campaign Owner; for a Society Campaign the verified representative; the account funds will be paid into; and the contracting party. Contract formation depends on the donor being able to identify their counterparty.
*Source: ToS 12.4; Donor 3.3.*

**7. Label checkout amounts separately.**
"Campaign contribution", "Dono service fee", "Payment processing" — and, where fee cover is selected, the price of Dono's service, that it is optional, and the immediate-performance request and cancellation acknowledgement in a **separate unticked control**.
*Source: ToS 16.4; Donor 5.2; Society Forms 8.3 item 2.*

### Age and children

**8. Build the checkout age confirmation, and remove the donate age gate.**
Replace `DonateDobGate` with: *"I am 18 or over."* **Not** the parent-or-guardian-permission alternative from earlier drafts — that branch was decided against building, not deferred (6 Aug 2026, see TRUTH.md, Age section). Actively confirmed, on every donation including guest donations, wording and version stored. This is the only control at the point where a child parts with money.
*Source: ToS 11.4; Donor 2.2; Children's RA §8 item 1; Society Forms 8.3 item 1.*

### Online safety

**Items 9–16 are superseded by MOD-001 through MOD-038 in `ENGINEERING_MODERATION_REQUIREMENTS.md`.** That specification expands the former eight-line summary into separate requirements for every report target, logged-out intake, dashboard, queues, cases, evidence, notes, assignment, illegal-content and child workflows, emergency/CSEA escalation, enforcement, restoration, warnings, suspension, bans, appeals, notices, audit, permissions, retention, risk signals, search, notifications, complaints, incident response, analytics and the no-private-messaging release guard. Every feature has a named acceptance test, priority and owner.

### Data protection

**17. Automatic deletion of student-card images.**
Immediately on a successful check; within 30 days for a rejected or abandoned one. Log every deletion. Cards currently persist until removed by hand.
*Source: ToS 6.2; Student 3.1; Verification 3.3; Privacy 6.2, 7.1; DPIA risk 1.*

**18. Retention enforcement across the whole schedule.**
Scheduled deletion jobs implementing Privacy Notice clause 7.1; deletion audit logging; documented backup propagation. The Privacy Notice cannot be published while its retention table is aspirational.
*Source: Privacy 7.1, 7.4; DPIA risk 2.*

**19. Account deletion must delete, not only anonymise.**
Subject to the categories the retention schedule requires Dono to keep.
*Source: Privacy 7.1, 13.2; DPIA risk 5.*

**20. Multi-factor authentication for every administrator.**
*Source: Privacy 14.1; DPIA risk 6.*

**21. Store the wording, version and timestamp of every consent.**
Currently the analytics consent stores only `granted` or `denied`, client-side, with no timestamp. Three documents claim more.
*Source: Cookie 5.3; Privacy 7.1; Society Forms 8.3.*

**22. Cookie settings link in the footer, and the ability to withdraw consent.**
The footer omits the Cookie Notice entirely, and once analytics is accepted the only way to withdraw is to clear site data or reinstall. Withdrawal must be as easy as giving consent.
*Source: Cookie 5.2.*

### Acceptance and evidence

**23. Store role, campaign and displayed wording with each acceptance.**
*Source: ToS 2.2.*

**24. Immutable archive of superseded document versions.**
An acceptance record pointing at a version string is weak evidence if the text behind it can change.
*Source: ToS 2.2.*

**25. Durable copy of accepted terms.**
Email a copy or a permanent link to the exact version accepted, and make it available from the account.
*Source: ToS 2.3.*

**26. Versioned campaign snapshot at donation.**
Store what the donor actually saw. Without it, every refund ground based on misrepresentation is hard to determine, because later edits overwrite the live campaign.
*Source: Refund 3.2(a), 4.1.*

---

## P1 — Before general public launch

**27. Structured Closure Statement.**
Submission form with the minimum contents in ToS 10.3(b); 30-day submission deadline tracking; Dono's 30-day review clock; one cure cycle; **administrative closure** at 30 days — recorded as administrative closure, not as acceptance.
*Source: ToS 10.3; Student 7.4; Refund 11.1.*

**28. Evidence status display.**
The three statuses on the campaign page, driven by the evidence ledger and the 14-day `dueAt`.
*Source: ToS 10.2; Donor 9.1; Verification 7.2.*

**29. Material Change workflow.**
Versioned change proposal; classification into the three tiers; calculation of affected donations; individual notification of affected donors; a 14-day refund window; opt-in records for a fundamental change; re-review of the campaign after a material change to purpose.
*Source: ToS 14.4; Student 5.4; Donor 10.2.*

**30. Surplus refund ledger.**
Reverse-chronological allocation, recorded so the order and every refund can be audited, and the residue under the de minimis threshold declared in the Closure Statement.
*Source: ToS 14.5–14.6; Refund 10.2–10.3.*

**31. Recurring donation management.**
Pre-setup disclosure of amount, interval and next charge dates; **cancel from the account with effect from the next charge, no reason required**; email before any amount change with express agreement required; charges stop when the campaign closes.
*Source: ToS 11.5; Donor 5.4.*

**32. Match Window fields and disclosure.**
Matching party name, total committed, ratio, period, cap, and evidence of the commitment held before the window opens; a way to show on the page that a matching party failed to pay.
*Source: ToS 11.6; Community 5.3; Student 5.5.*

**33. Dispute notification to the connected account holder.**
On `charge.dispute.created`, notify the account holder with the card-scheme deadline and the records Dono holds, so they can submit evidence. They own the dispute; today nothing tells them.
*Source: ToS 15.5; Refund 8.3; Student 9.3.*

**34. Data-protection complaints and subject-access intake.**
Form per the Data Protection Complaints Workflow; request tracking against the one-month statutory clock; a data export for access requests.
*Source: Privacy 13.3–13.4; DP Complaints Workflow.*

**35. Redaction guidance at receipt upload, and an admin redaction tool.**
Just-in-time guidance on what to redact, and the ability for an administrator to redact or remove unnecessary personal data from an upload — a right the Terms and Privacy Notice both assert.
*Source: Student 7.2; Privacy 11.2; LIA 4.*

**36. Separate moderation views from identity data.**
A moderator reviewing campaign content should not need access to student-card data.
*Source: DPIA risk 4.*

**37. Legal hold.**
Suspend scheduled deletion where data is needed for litigation, a regulatory enquiry, a fraud investigation or a law-enforcement request, with a record of each hold.
*Source: Privacy 7.3.*

**38. Institution referral record.**
Where a referral is made under ToS 23.7: what was sent, to whom, the lawful basis, the allegation labelled as an allegation, notice to the user where lawful, and a correction route.
*Source: ToS 23.7; ROPA row 19.*

**39. Monthly online-safety metrics.**
Reports by category; time to first review; time to restriction or removal; cases upheld, rejected, unresolved; reports involving children; external referrals; appeals; decisions reversed; repeat offenders.
*Source: OSA Procedures; Illegal-Content RA §9.*

---

## P2 — Required, interim position defensible

**40. Comment pre-screening.** Keyword or pattern detection to shrink the post-moderation window, which is the basis of four Medium ratings in the Children's Risk Assessment. *Source: Children's RA §8 item 5.*

**41. Fast-track reporting path** so reports about content visible to children are triaged ahead of the general queue. *Source: Children's RA §8 item 4.*

**42. Repeat-offender detection** for comment authors. *Source: Children's RA §8 item 6.*

**43. Evidence and closure deadline reminders** — the 14-day evidence deadline and the 30-day Closure Statement deadline currently have no reminder. *Source: Student 7.1, 7.4.*

**44. Reverification prompts and automatic pause** on a bounced university email or a lapsed student status. *Source: Verification 8.1.*

**45. Automated product-to-policy acceptance test** verifying that the correct documents are presented for each role and action. *Source: ToS 1.5; review H24.*

**46. Evidence download on account closure** — 30 days' access to submitted evidence and records. *Source: ToS 31.2(g).*

---

## Cross-check before any document is published

Moderation, complaints and Online Safety documents contain no build-status qualifiers. Their launch gate is the complete passage of every P0 acceptance test in `ENGINEERING_MODERATION_REQUIREMENTS.md`. Other documents retain their existing product/legal completion process. Current non-moderation build references are:

| Document | Build items outstanding |
|---|---|
| Terms of Service | 1, 2, 3, 4, 5, 6, 7, 8, 17, 23, 24, 25, 27, 29 |
| Student Campaign Terms | 4, 17, 27, 29, 32 |
| Society Campaign Terms | — (subject to A10 in the questions list) |
| Donor Terms | 1, 5, 6, 7, 8, 26, 31 |
| Community Guidelines | Moderation scope governed entirely by MOD-001–MOD-038; no separate entries here |
| Verification Notice | 8, 17 |
| Refund & Dispute Policy | 2, 4, 26, 27, 30, 33 |
| Privacy Notice | 17, 18, 19, 20, 21, 34, 35, 37 |
| Cookie Notice | 21, 22, and a live clean-browser audit |
