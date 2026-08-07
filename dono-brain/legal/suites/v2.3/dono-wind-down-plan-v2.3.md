# Dono Wind-Down and Business Continuity Plan

**Version:** 2.3.1
**Version date:** 6 August 2026
**Revision note:** 2.3.1 corrects the insurance position while preserving the rule that no policy or reserve guarantees a funded wind-down.
**Document type:** Internal plan
**Owner:** Amrit Kaur Rooprai. Authorised deputies: Sashank, then Joe.
**Resolves review finding:** F55
**Referenced by:** Terms of Service clause 31.4

---

## 1. What this plan is

1.1 This plan describes the **minimum realistic steps Dono would take if it permanently ceased operating.** It is written to be executable by one or two people with no external funding, because that is Dono's actual position. It deliberately does not promise a funded, orderly, professionally administered wind-down, because Dono could not deliver one.

1.2 **The single most important fact.** **Donations are paid directly into Campaign Owners' own Stripe connected accounts. Dono never holds, controls or has access to that money.** If Dono ceases to operate, funds already in a Connected Account are unaffected: they remain with the Recipient and with Stripe, under Stripe's own agreement with that account holder. **Dono cannot recover, redistribute, protect, return or account for those funds, and this plan does not pretend otherwise.** Nothing in the Terms of Service promises that it can.

## 2. Triggers

This plan is activated on any of:

(a) a decision by the sole trader to cease operating the Platform;
(b) the death or incapacity of the sole trader (clause 8);
(c) financial failure, or the inability to meet hosting, payment-provider or other essential costs;
(d) loss of the Stripe platform account with no replacement available;
(e) a regulatory prohibition on continuing to operate; or
(f) a security or legal event that makes continued operation untenable.

## 3. Decision authority

3.1 The sole trader decides to activate the plan. If she is unable to, the first available authorised deputy (Sashank, then Joe) may activate it, and must record the reason and the date.

3.2 The person who activates the plan becomes the **Wind-Down Lead** and is responsible for every step below and for the record of what was done.

## 4. Day 0–2: stop taking on new obligations

| # | Action | Owner |
|---|---|---|
| 4.1 | **Disable new campaign creation.** No new campaign may be submitted or published | Wind-Down Lead |
| 4.2 | **Disable new donations across the whole Platform.** Close every live campaign to further contributions | Wind-Down Lead |
| 4.3 | **Disable new account registration** | Wind-Down Lead |
| 4.4 | **Disable comments and all new user-generated content submission** | Wind-Down Lead |
| 4.5 | Publish a clear notice on the site homepage and every campaign page stating that Dono is closing, the date donations stopped, the date the Platform will close, and what users must do | Wind-Down Lead |
| 4.6 | Record the activation decision, the trigger, the date and the authority | Wind-Down Lead |

## 5. Day 1–7: tell people

| # | Action | Owner |
|---|---|---|
| 5.1 | **Email every Campaign Owner and Responsible Representative** with a live or unclosed campaign: donations have stopped; their continuing obligations under the Terms survive termination; they must still use funds for the stated purpose, refund what cannot be used, and deal with refunds and chargebacks; and the date after which Dono can no longer assist | Wind-Down Lead |
| 5.2 | **Email every Donor with an open refund request or an unresolved dispute**, telling them the status of their case and how it will be concluded | Wind-Down Lead |
| 5.3 | **Email every Donor to a campaign that has not submitted a Closure Statement**, explaining that Dono will no longer monitor closure, that their contract is with the Campaign Owner, and that their chargeback and legal rights are unaffected | Wind-Down Lead |
| 5.4 | Notify Stripe of the platform wind-down and follow its offboarding process for connected accounts | Wind-Down Lead |
| 5.5 | Notify every other processor (Vercel, Convex, Resend, PostHog) and establish the data-return and deletion position for each | Wind-Down Lead |
| 5.6 | Notify the **Information Commissioner's Office** and **Ofcom** where required | Wind-Down Lead |

## 6. Day 1–30: finish what can be finished

6.1 **Refund determinations already made** are executed where the Connected Account has funds, using the refund mandate in clause 13.2 of the Terms of Service, before Stripe access is lost. This is the only step in the plan that moves money, and it moves it from a Campaign Owner to a Donor.

6.2 **Open refund requests** are decided if that is possible within the wind-down period. Where it is not, each party is told: the request is closed undecided; Dono is not making a determination; and the Donor's contractual, chargeback and legal rights against the Campaign Owner are unaffected. **A closed-undecided case is never recorded as a finding in anyone's favour.**

6.3 **Open complaints and appeals** are concluded where practicable. Where a complaint cannot be concluded, the complainant is told so, told what was done, and told they may complain to the ICO (data protection) or Ofcom (online safety) as applicable. Data-protection complaints and rights requests are prioritised, because they carry statutory clocks.

6.4 **Open moderation cases** are closed. Illegal content is removed before the Platform goes offline. Any outstanding **CSEA report to the National Crime Agency is completed before shutdown** and its reference preserved — this obligation does not lapse because Dono is closing.

6.5 **Live legal, regulatory or law-enforcement matters** are identified and a legal hold applied to the relevant records.

## 7. Day 7–60: data, records and closing down

7.1 **User data export.** For at least **30 days from the wind-down notice**, users can download their own data and the evidence and records they submitted, using the existing export route. Where the export route is not functioning, Dono responds to individual requests by email for as long as it is able. **Where data cannot be exported, Dono says so rather than promising an export it cannot deliver.**

7.2 **Records Dono must keep after shutdown**, held securely by the sole trader (or her estate) for the periods in the Privacy Notice, not deleted merely because the Platform has closed:

| Record | Period |
|---|---|
| Donation, payment, fee and refund records | 6 years |
| Terms acceptance records and archived document versions | 6 years / indefinitely for archived versions |
| Refund and dispute case records | 6 years |
| Fraud, safeguarding and financial-crime records | 6 years |
| Complaints and appeals | 6 years |
| Institutional referral records | 6 years |
| Moderation records | The risk-based periods in the Privacy Notice |
| NCA report reference | 5 years |
| Content and prescribed information reported to the NCA | 1 year, restricted storage |
| Anything under legal hold | Until the matter concludes |

7.3 **Everything else is deleted**, and the deletion is documented: processor accounts closed and deletion confirmed in writing; storage buckets emptied; backups allowed to expire on the rolling 30–35 day cycle and confirmed gone; and analytics data deleted.

7.4 **Campaign pages.** Public campaign pages are taken offline at shutdown. Dono does not maintain a public archive after the Platform closes. The minimum evidence snapshot needed for the records in clause 7.2 is preserved privately.

7.5 **Domains and email.** The `joindono.team@gmail.com` address is monitored for **at least 6 months** after shutdown so that late complaints, rights requests and legal notices are received. An auto-reply states that Dono has ceased operating, gives the retention position, and tells people how to make a data-protection request and how to contact the ICO.

## 8. Death or incapacity of the sole trader

8.1 Dono is a sole trader. If Amrit Kaur Rooprai dies or becomes incapacitated, the Platform's contracts, data-controller responsibility and Stripe platform account do not automatically transfer to anyone.

8.2 **Standing arrangements that must exist:**

(a) **Named authorised deputies** — Sashank, then Joe — who are recorded as able to access production systems, the Stripe platform dashboard, the domain registrar, the support inbox and the credential store, and who are bound by the Team and Contributor Agreement.
(b) **A credential-recovery route** that does not depend on one person, held securely and tested.
(c) **A written instruction to her personal representatives** identifying Dono as a business asset with data-protection and Online Safety Act obligations, naming the deputies, and directing that this plan be followed.

8.3 On death or incapacity the first available deputy activates this plan, notifies the ICO and Ofcom, and works with the personal representatives on the retention obligations in clause 7.2. **The deputies have no authority over any Connected Account and cannot access campaign funds.**

## 8A. Verified position as at 5 August 2026

8A.1 **The kill switches in clause 4 do not exist as a single control.** Campaigns, donations, registration and comments cannot each be disabled independently today. Item **GV-05** builds them. Until then, activation of this plan depends on ad hoc code changes under pressure, which is exactly what a wind-down plan should avoid.

8A.2 **The user data-export route in clause 7.1 does not exist** (item PR-11 / GV-06). Until it does, clause 7.1's commitment is limited to responding to individual requests by email, and this plan says so rather than promising an export that cannot be produced.

8A.3 **Backup retention and restore behaviour are unverified** (item PR-10). Clause 7.3's statement that backups expire on a rolling 30–35 day cycle is taken from the retention schedule and has **not been confirmed with the database provider**. It must be, because it determines whether deleted data is actually gone.

8A.4 **Deputy access is not recorded or tested**, and there is no documented credential-recovery route (items GV-07, SE-10). Clause 8.2 is therefore a requirement, not a description.

## 9. What this plan does not promise

- It does not promise that campaign funds will be returned, protected or accounted for. They are outside Dono's control.
- It does not promise that every open case will be decided.
- It does not promise a funded wind-down. There is no dedicated reserve, and Dono's insurance is not a wind-down fund or guarantee.
- It does not promise continued access to the Platform after the shutdown date.
- It does not promise that a third party will take over the service.

## 10. Testing

10.1 A **desktop shutdown exercise** is run and documented before launch, and annually thereafter: the Wind-Down Lead walks through clauses 4 to 7 against the live system, confirms that each disable switch exists and can be operated, confirms the deputies' access, confirms the export route works, and records the findings and any follow-up actions.

---

## Approval and version control

| Field | Entry |
|---|---|
| Document | Dono Wind-Down and Business Continuity Plan |
| Version | 2.3.1 |
| Version date | 6 August 2026 |
| Accountable owner | Amrit Kaur Rooprai; authorised deputies Sashank, then Joe |
| Reviewed by | *(name, role, date — to be completed)* |
| Approved by | *(name, role, date — to be completed)* |
| Outstanding before it is true | Platform-wide kill switches for campaigns, donations, registration and comments; user data-export route; deputy access recorded and tested; credential-recovery route tested; written instruction to personal representatives; desktop shutdown exercise run and documented. See `ENGINEERING_IMPLEMENTATION_CHECKLIST_v2.3.md`, items WD-01 to WD-07 |
| Next scheduled review | 6 August 2027, or on any change of team, processor or payment architecture |
| Supersedes | No previous version — this plan is new in v2.3 |
