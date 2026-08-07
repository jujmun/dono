# Dono — engineering fact-finding questionnaire for legal completion

> **HISTORICAL QUESTIONNAIRE — NOT A BUILD LIST.** The resulting requirements are centralised in [`../../engineering/legal-launch/`](../../engineering/legal-launch/README.md). Retain this file as evidence of the questions asked; do not track implementation here.

**Prepared:** 5 August 2026  
**Release being assessed:** Real-user beta next week, followed by public launch the week after  
**Source:** *Dono pre-launch legal due diligence review*, 31 July 2026; the current v2.2 legal suite; and the existing engineering questionnaire/answers in this repository.  
**Purpose:** Obtain the factual product, configuration and test evidence needed to finalise accurate legal documents. This is not a request to build every feature. If an answer is “not built”, “unknown” or cannot be evidenced, the related feature must stay disabled and the public wording must not say that it exists.

## How engineering should respond

For every question, provide:

1. **Answer:** Yes / No / Partly / Unknown, followed by a short factual description.
2. **Scope:** Web, iOS and Android; guest and signed-in flows; staff/admin and external-user flows; production versus test mode.
3. **Evidence:** A dated test result, screenshot/screen recording, configuration export, relevant route/function, or provider-console capture. Link it in the release-control matrix.
4. **Owner and date:** The accountable engineer and the date the answer was verified.
5. **If not ready:** Whether the feature can be disabled completely for beta and public launch, including any API or deep-link route that could still expose it.

`P0` means the answer is needed before a real-user beta. `P1` means it is needed before the public launch. A beta accepting real people, money, personal data or public user-generated content must be treated as a live launch for these purposes.

## 1. Release scope and feature flags

1. **[P0] What exact production features will be enabled at beta launch, by platform and user role?** Include sign-up, guest donation, campaign creation, society creation, card/identity upload, comments, images, documents, video, avatars, links, recurring donations, Match Windows, evidence uploads, public search/sharing, PostHog and all payment methods.

2. **[P0] For every deferred feature, where is the hard disablement?** Identify the feature flag, server-side authorization check, API/mutation protection and UI removal. Can an old app version, direct URL/deep link or direct API call bypass it?

3. **[P0] Is production Stripe live-mode access enabled for beta?** State the account(s), supported currencies/countries, payment methods, connected-account types, and whether any platform-account or community-fund charge path remains reachable.

4. **[P0] Can engineering produce a release matrix linking each enabled feature to its legal copy, data flow, owner and evidence?** Confirm the source of truth and who can approve an enablement or wording/configuration change.

5. **[P0] What is the intended geographic perimeter, and what actually enforces it?** Confirm whether anyone outside the UK can sign up, view campaigns, donate, create campaigns or receive payouts; include App Store/Play Store availability and payment-country constraints.

## 2. Payments, Stripe Connect, price disclosure and refunds

6. **[P0] Please provide an evidence pack for the executed Stripe model.** For each connected-account type, provide the Stripe Connect agreement/version, account type, controller properties, charge type, payment flow, application-fee flow, payout settings, and the live values for `controller.fees.payer` and `controller.losses.payments`.

7. **[P0] Are all donation charges direct charges on the connected account?** List every exception, including test, fallback, community-fund, subscription, manual-payment or admin route. Confirm whether Dono ever receives, holds, controls or pays out donation funds.

8. **[P0] What fee is actually charged in each path today?** Give the formula and worked test cases for one-off and recurring donations: standard UK, premium/EEA/international card, FX, fee-cover selected/not selected, refund, partial refund and dispute. Identify any difference between code and checkout copy.

9. **[P0] Can checkout show the exact total before confirmation without using a card-dependent surcharge?** If not, identify every variable that could change the total after the user sees it, the highest possible amount, and whether the customer can ever be charged above the displayed figure.

10. **[P0] What is shown immediately before payment confirmation?** Supply screenshots for web, iOS and Android showing: campaign contribution, Dono fee, total payable, the campaign, campaign owner/contracting party, verified society representative where relevant, destination account and applicable cancellation/consent controls.

11. **[P0] Who can initiate and process a refund today?** Enumerate all UI, API, webhook, scheduled-job and Stripe-dashboard paths. Confirm whether Dono can create a direct-charge refund while acting as the connected account, and whether that is intentionally enabled.

12. **[P0] What happens to the platform/application fee on full and partial refunds and lost disputes?** Provide the Stripe calls, reconciliation fields and end-to-end evidence that Dono's fee is refunded proportionately without double-refunding.

13. **[P0] What does a connected-account holder receive when a dispute opens?** Confirm Stripe notifications, Dono notifications, responsible owner, evidence access, card-scheme deadline handling and outcomes for won/lost disputes and negative balances.

14. **[P0] Has an end-to-end payment test been completed?** Provide dated test results for a direct charge, checkout price display, successful payment, full/partial refund, fee reversal, dispute opened/won/lost, payout, failed payout and negative balance.

15. **[P0] Can an unincorporated society complete the actual Stripe onboarding?** Test the precise recipient structures that beta will permit, and provide the completed onboarding outcome, account holder, bank-account control and who has dashboard/refund/dispute access.

16. **[P1] What protects against double recovery?** Explain how a chargeback, platform refund, connected-account refund and any refund request are linked so the same donation cannot be repaid twice, and how approaching deadlines are surfaced.

17. **[P1] Are recurring donations and Match Windows enabled?** If yes, provide lifecycle behaviour, required disclosure fields, cancellation, next-charge notice, campaign-closure handling, matching-party evidence and failure-to-pay behaviour. If no, evidence their complete disablement.

## 3. Accounts, age, identity and recipient authority

18. **[P0] Where are age/eligibility checks enforced server-side?** Map account creation, campaign creation, society creation, commenting, uploading and donating. State the exact rule for beta, including whether under-18 donations are possible and any parental-authority confirmation.

19. **[P0] Does any Stripe Identity or Connect response supply verified DOB, and is it used?** State which identity paths can return DOB/name, when the fields are stored, who can access them, retention/deletion behaviour, and confirm it is not being treated as a reliable age gate unless it truly is.

20. **[P0] What identity evidence is collected for campaign and society creators?** Describe capture, processing, verification status, failure/retry and manual-review flows; identify whether a user can create, publish or accept donations while verification is pending/failed.

21. **[P0] What recipient types can create a live campaign?** For each, state the legal/account holder represented in the product, required role/authority assertions, Stripe onboarding result, destination bank account and whether Campaign Owner, Recipient and property owner can differ.

22. **[P1] What happens when a society officer changes, leaves, loses access or disputes authority?** Describe succession, access revocation, Stripe-account control, existing funds, campaign control and audit trail.

## 4. Content, reporting, moderation and safeguarding

23. **[P0] Which user-generated-content types are live at beta?** Separately identify campaign text, images, uploaded documents, comments, usernames, avatars, video and external links. For each, state whether it is pre-moderated, post-moderated or unavailable.

24. **[P0] Are links, attachments and images technically blocked in comments?** Evidence the actual validation on client and server, including direct API requests and copy/paste URLs.

25. **[P0] Is there an accessible, logged-out `/report` route and a report control beside every relevant item?** Test on all supported platforms for campaign pages, images, documents, comments and usernames. Provide screenshots and a submitted test report.

26. **[P0] What data and audit trail does a report create?** Confirm content/user reference, reporter details, category, explanation, received time, urgency, moderator, temporary/final action, reasons, notices, appeal, restoration and external-referral reference.

27. **[P0] What moderation actions are usable in a production interface?** Test unpublishing campaigns, hiding comments/images/documents, restricting visibility, pausing donations, suspending accounts, restoration and recording reasons. Distinguish UI-supported controls from backend-only mutations.

28. **[P0] How are urgent reports handled, including outside office hours?** Identify automatic restrictions, alerts, recipient(s), backup coverage, acknowledgement and escalation timing. Confirm the NCA CSEA reporting account/portal is ready and whether required reporting can be completed without downloading prohibited material.

29. **[P0] Can reporters and affected users appeal a decision?** If so, demonstrate submission, case linkage, deadline, independent reviewer routing, decision/reasons and restoration. If not, identify wording that must be removed or the beta feature that must remain disabled.

30. **[P1] What controls cover video, avatars and mutable/external links?** Include upload limits, preview/full review ability, malware/scanning, link handling, reporting, restriction and retention.

31. **[P1] What online-safety metrics can the product produce each month?** Confirm reports by category, first-review/restriction times, child-related reports, appeals and reversals, referrals and repeat-offender indicators.

## 5. Personal data, retention, cookies and third parties

32. **[P0] What personal data is collected in each enabled beta flow, and where does it go?** Provide the fields, database/storage location, third-party processor, access roles and production region for sign-up, donation, verification, support, moderation, evidence uploads, analytics and email.

33. **[P0] Are student-card images deleted as claimed?** Demonstrate immediate deletion after a successful check and automatic deletion within 30 days after rejection/abandonment, including deletion logs and the result in file storage—not just application metadata.

34. **[P0] What retention/deletion jobs run today?** Give actual schedules for account data, identity data, campaign evidence, receipts, moderation cases, consent, legal acceptances, refund/dispute records and logs. For each, state whether deletion is automatic, manual, absent or only anonymisation.

35. **[P0] What happens in backups when data is deleted?** Confirm backup provider, retention period, restoration behaviour, deletion propagation/expiry and whether a restored backup can resurrect deleted data.

36. **[P0] What is the account-deletion flow in practice?** Identify data deleted, anonymised and retained; how the user requests it; how deletion is verified; and whether campaign/evidence access or pending obligations are affected.

37. **[P0] What information does PostHog collect in production?** Provide the production project settings, EU-region setting, event schema/properties, session replay/autocapture settings, device/location collection, retention and all enabled integrations. Include a clean-browser/mobile capture after acceptance and after rejection.

38. **[P0] Can a user withdraw analytics consent as easily as grant it?** Demonstrate a persistent settings control on web and native, immediate SDK/event cessation, consent timestamp/version storage, and what happens to existing identifiers/cookies/storage.

39. **[P0] What cookies/local storage/SDK storage is set before and after consent?** Supply a clean-browser audit for the production-like web environment, listing name, party, purpose, expiry and trigger. Include Stripe, Convex Auth, PostHog, Resend-related flows and first-party storage.

40. **[P0] Which processors and sub-processors receive personal data, and where?** Confirm current use/configuration for Convex, Vercel, Stripe, Stripe Identity, Resend, PostHog, storage/CDN, analytics and support email. Provide DPA/transfer-assessment inputs: entity, processing regions, transfer mechanism, retention and support-access locations.

41. **[P1] Can a user submit a data-protection complaint or access request, and can operations meet the statutory clock?** Describe intake, identity verification, tracking, data export, communications and escalation. Provide a test case.

42. **[P1] Is there a legal-hold control?** Explain how scheduled deletion is paused for litigation, regulator, fraud or law-enforcement needs, with who can impose/release a hold and the audit record.

## 6. Security, access and incident response facts

43. **[P0] Is MFA enforced for every privileged/admin account?** Define privileged roles, supported MFA method(s), enforcement points, recovery, break-glass accounts and evidence of a current access review. If not, identify whether privileged access can be limited for beta.

44. **[P0] What access controls protect student-card/identity data and moderation data?** Map the roles, server-side checks, least-privilege separation, who can access a signed URL, URL expiry and whether moderators can see identity data unnecessarily.

45. **[P0] What privileged actions are logged, and are logs tamper-resistant?** Cover identity-document viewing, refunds, payout-affecting actions, moderation, account suspension, data deletion, role changes and legal-document publication. State retention, who can alter/delete logs, and how logs are exported for an incident.

46. **[P0] What secrets and key-management controls are in place?** State storage location, production access group, rotation/revocation procedure, audit trail, and whether credentials appear in client bundles, logs, repositories or preview deployments.

47. **[P0] What detection and alerting exists?** Include authentication abuse, suspicious admin actions, unexpected payment/refund/dispute events, failed deletion jobs, upload threats, production errors and provider incidents; identify recipients and response coverage.

48. **[P0] Can engineering run and evidence an incident-response tabletop before beta?** Cover detection, containment, preserving evidence, Stripe/Convex/Vercel/Resend escalation, personal-data breach assessment, customer communications and a 72-hour decision process.

## 7. Contract acceptance, campaign records and legal change control

49. **[P0] What exactly is recorded when each user accepts legal documents?** Confirm user/guest identifier, role, campaign/society/donation context, document ID, version, exact wording/hash, acceptance time, affirmative-action method and whether it is stored server-side.

50. **[P0] Is the accepted document text immutable and recoverable?** Explain how historical versions are retained, protected against alteration and linked to an acceptance. Demonstrate retrieval of an old version after a current version changes.

51. **[P0] Does the user receive a durable copy of the exact terms accepted?** Demonstrate an email or persistent account link for signup, campaign creation, society creation and guest/signed-in donation; include failure/retry behaviour.

52. **[P0] Is a guest donor's acceptance linked permanently to the payment/donation record?** Test clearing local storage, changing browser/device and receipt retrieval without relying solely on a client-side guest key.

53. **[P0] Is a snapshot of campaign information retained at donation?** Identify the immutable fields captured—purpose, target, recipient, owner, evidence commitments, price/fee disclosures, relevant terms/version and timestamp—and demonstrate that later campaign edits do not change it.

54. **[P0] Is the campaign target enforced server-side under concurrent donations?** Provide concurrency and boundary tests showing the target cannot be exceeded, and explain the treatment of an authorisation that completes after the remaining amount changes.

55. **[P1] How are material campaign changes, evidence and closure handled?** Confirm versioned change proposals, donor notices, affected-donor/refund logic, evidence due dates, closure-statement fields, review/cure timelines, reminders, closure state and public status display.

56. **[P0] How do changes to code, configuration, Stripe settings or legal copy trigger legal review and re-acceptance?** Identify the release owner, approval gate, audit record and test that correct role-specific documents are shown for every applicable action.

## 8. Evidence pack and sign-off

57. **[P0] Can engineering assemble the minimum evidence pack by the beta decision date?** It must include: Stripe configuration/export and payment tests; checkout screenshots; feature-flag evidence; reporting/moderation and NCA readiness tests; deletion/retention/cookie-withdrawal tests; MFA/access-review evidence; acceptance/version/durable-copy tests; and the release-control matrix.

58. **[P0] For each answer above, what is the production-equivalent test environment and how will the result be re-run after the public-launch deployment?** Legal wording should be signed off only against the configuration that will actually be live.

59. **[P0] Who is authorised to make a final factual “truth at release” confirmation?** Name the engineering owner and backup, the version/configuration identifiers they will sign against, and the process for pausing a release if an answer changes.

## Legal-document consequences to apply when responses arrive

- Do not describe a control as current unless engineering provides current evidence for it.
- Do not publish exact Stripe rates, a card-dependent fee calculation, loss/refund/dispute allocation, or a payment-services characterisation until the executed configuration and specialist payment advice align.
- Keep payments, public user-generated content, verification uploads, comments, recurring donations, Match Windows, analytics or external access disabled if their P0 factual answer cannot be evidenced.
- Where a feature is deliberately deferred, revise the relevant legal document to say only what beta actually does, rather than leaving a future-control promise in place.
- Re-run this questionnaire and evidence pack before public launch; a passing test-mode answer is not evidence for a different production configuration.
