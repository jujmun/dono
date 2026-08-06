# Engineering evidence questions — terms_v2.2 production baseline

**Version:** 2.3 — 6 August 2026
**Owner:** Amrit
**Purpose:** this is an implementation-evidence questionnaire, not policy and not a description of the production service. The policy suite states the required launch operation in present tense. Moderation requirements and acceptance tests are canonical in `ENGINEERING_MODERATION_REQUIREMENTS.md`; answers here supply evidence or identify work needed to pass them.

Each item cites the clause it comes from. Anything marked **BLOCKING** prevents launch or the affected feature from operating; it does not change the policy requirement.

---

## A. Payments and Stripe

**A1. Fee model — what single application-fee calculation will apply to one-off and recurring Donations?** **BLOCKING**
The Terms now distinguish Dono's application fee from Stripe's processing fee and require checkout to show the Dono fee actually charged. The code still uses different one-off and subscription calculations. Confirm the effective-dated fee formula, rounding, fee-cover allocation and refund calculation before recurring Donations are enabled.
*Source: ToS 16.1; Donor 6.1; VAT position paper §11.*

**A2. Can the card category be determined before the charge is confirmed?**
The Terms say that any pre-settlement processing figure and expected Campaign amount are estimates. Can the card category be determined at checkout so those figures can be exact? If not, confirm the disclosed estimate and ensure the Donor is never charged more than the confirmed total.
*Source: ToS 16.5; Donor 6.4.*

**A3. Recurring donations — does the subscription path use the same fee mechanic as one-off donations?**
Engineering flagged that monthly subscriptions set `application_fee_percent` to a raw 5% without the Stripe-share residual split. The Terms describe one fee mechanic. Is the difference intentional?
*Source: ToS 16.1, 11.5; dev config form §1.5.*

**A4. Once the admin refund path is disabled, does anything else in the backend move money on a connected account?**
Decision: Dono does not initiate refunds. `processApprovedRefund` must go. Is there any other code path — a webhook handler, a scheduled job, an admin tool — that can create a refund, transfer or payout on a connected account?
*Source: ToS 15.4; Refund 6.1.*

**A5. Confirm the application-fee refund stays.** 
Refunding Dono's own platform fee is a promise we keep, and the webhook-driven `applicationFees.createRefund` implements it. Confirm that disabling the charge-refund path in A4 does not break it, and that it still fires proportionally on a partial refund.
*Source: Refund 9.3; Donor 11.7.*

**A6. Are there any other charges on the platform account rather than a connected account?** **BLOCKING**
Community-fund gifts are being removed (decision 6). Once they are gone, is every charge a direct charge on a connected account, with no exception? The statement "Dono does not receive, hold, safeguard or control donation funds" must be true without qualification.
*Source: ToS 4.2; Illegal-Content RA §2.*

**A7. When a dispute is opened, what does the connected account holder actually see, and when?**
The Terms say the connected account owns the dispute and submits evidence, and that Dono assists. Today Dono records `charge.dispute.created` and `charge.dispute.closed` but does not notify anyone. Does Stripe notify the account holder directly, and does that notification arrive in time for the card-scheme deadline?
*Source: ToS 15.5; Refund 8.3.*

**A8. Confirm the losses, fees and dispute settings, and tell us if they change.**
v2.2 publishes these as facts: losses collector = Stripe; fees collector = connected account; dispute owner = connected account; UK dispute fee £20; platform cannot hold payouts. If any of these is altered in the Stripe configuration, the Terms become untrue — please treat a change as requiring a legal review first.
*Source: ToS 15.5–15.6.*

**A9. Has an end-to-end test been run in test mode covering: a direct charge, fee cover, fee deduction, a full refund, a partial refund, the application-fee reversal, a dispute won, a dispute lost, and a negative balance?** **BLOCKING**
Section 7.2 of the config form records this as not evidenced. We need dated references before the fee and refund clauses can be published.
*Source: ToS 15–16; Refund 6, 8, 9.*

**A10. Can an unincorporated society actually complete Stripe Connect onboarding?** **BLOCKING**
The whole Society model assumes a Society-held connected account. There is no evidence in the repo that a demo society has succeeded. Has any actually onboarded? What did it need?
*Source: Society 3.5; dev config form §3.2.*

## B. Accounts, age and identity

**B1. Where exactly is the 18+ declared-date-of-birth gate enforced?** **ANSWERED 6 Aug 2026.**
Confirmed in code: the gate is enforced (server-side, `assertAdultOrThrow`) on campaign creation and society creation/leadership only. There is no gate on account creation, on commenting, or on donating. v2.2 previously said the gate also covered account creation and commenting; that was wrong, and the documents (ToS 1.8, 5.1, 17.1; Verification 4.3; Donor 2.2, 14.1; Community Guidelines 6.1; Privacy 14.2; RoPA; Children's RA; Illegal-Content RA; OSA Procedures) have been corrected to match rather than the gate being built — see TRUTH.md, Age section.
*Source: ToS 1.8, 5.1, 17.1; Verification 4.3.*

**B2. What happens to the existing `DonateDobGate`?** **BLOCKING**
Donating is now open to all ages, so the donate age gate must be removed and replaced with the confirmation in `TASKS_engineering_features.md` F1. Confirm what removing it affects, and whether `ageAttested` should be repurposed to store the new confirmation.
*Source: ToS 11.4; Donor 2.2.*

**B3. Does Stripe Identity return `verifiedDob` reliably enough to be worth storing at all?** **ANSWERED 6 Aug 2026.**
Decision: keep storing it where Stripe returns it, but do not wire it into the age check (`assertAdultOrThrow`) — self-declared date of birth remains the sole age-gate model, as v2.2 already states. Data-minimisation concern addressed separately: `verifiedName`/`verifiedDob` are now cleared automatically 90 days after capture, and immediately on account deletion for campaigns/societies the deleted user created, rather than retained indefinitely (see `convex/lib/verificationRetention.ts`).
*Source: Verification 4.1; Privacy 3.2; ROPA row 4.*

**B4. Is the `ox.ac.uk` restriction the only institution gate, and how is a new institution added?**
ToS 4.7 names Oxford as the only recognised institution. Confirm, and tell us what changing the list involves so the clause can be kept accurate.
*Source: ToS 4.7.*

## C. Content, comments and moderation

**C1. Provide client and direct-server test evidence that links, attachments and images in comments are rejected.** **BLOCKING**
Include obfuscated URLs, rich-text paste, Unicode and direct mutation tests. This evidence satisfies AT-MOD-034.
*Source: Community 6.2; Illegal-Content RA §8.3; Children's RA §5; MOD-034.*

**C2. Provide end-to-end evidence for every moderator action in MOD-018 through MOD-022.** **BLOCKING**
Demonstrate unpublishing a campaign; hiding and restoring an update, comment, image and document; disabling comments; pausing new donations; warning, suspending and banning an account; permission denial; notice delivery; appeal and restoration. Backend-only mutations do not satisfy the moderator-interface acceptance tests.
*Source: OSA Procedures 3.2; Community 3.3; MOD-018–MOD-022.*

**C3. Provide route/schema inventory evidence that the only profile image surface is the optional avatar and that it is reportable.**
The evidence satisfies the surface inventory for AT-MOD-004 and AT-MOD-005.
*Source: Illegal-Content RA §1; ROPA row 1; MOD-004–MOD-005.*

**C4. Provide workflow and audit evidence that every campaign video is reviewed in full before publication.** **BLOCKING**
Show the completion record, content hash, material-edit invalidation and server publication guard required by AT-MOD-033.
*Source: Children's RA §4, §8; MOD-033.*

## D. Data protection and retention

**D1. What is the backup retention window, and does deleting a record propagate to backups?** **BLOCKING**
The Privacy Notice states a rolling 30–35 days. Confirm the actual window, whether backup restoration could resurrect deleted data, and whether expiry is automatic.
*Source: Privacy 7.1, 7.3; LIA 3.*

**D2. What are the actual retention settings on Vercel and Convex platform logs?**
The ROPA has a placeholder. We need a number or a documented default.
*Source: ROPA row 26; Cookie 6.1.*

**D3. Which email provider handles support correspondence, and where does it process data?**
Support correspondence is stated as retained for three years, but the provider is not recorded anywhere.
*Source: ROPA row 27; Privacy 8.1.*

**D4. What are Resend's processing region, transfer mechanism, and email content and log retention?** **BLOCKING**
Three entries in the Privacy Notice and the ROPA are placeholders because of this.
*Source: Privacy 8.1; ROPA rows 23–24; Transfer Assessment.*

**D5. What are the PostHog project settings for approximate location, device data and event retention?** **BLOCKING**
The Cookie Notice lists what we collect. If the project captures more than that by default, either the Notice is wrong or the setting must change. Retention must be set to 26 months.
*Source: Cookie 3.2; Privacy 7; ROPA row 25.*

**D6. Confirm PostHog Cloud EU processing is genuinely EU-only, including sub-processors and support access.**
Selecting an EU region does not by itself prevent a restricted transfer.
*Source: Transfer Assessment.*

**D7. Does account deletion delete, or only anonymise?**
`requestAccountDeletion` currently anonymises profile fields. The Privacy Notice describes deletion subject to the retention schedule. These need to match.
*Source: Privacy 7.1, 13.2; DPIA risk 5.*

**D8. Is administrator access to identity data the only thing audit-logged, or are other admin actions logged too?**
The Privacy Notice claims audit logging of identity-data access specifically, which engineering confirms. We deliberately do **not** claim more. Tell us if more is in fact logged, so we can say so.
*Source: Privacy 6.3, 14.1.*

## E. Security

**E1. Is multi-factor authentication feasible for administrator accounts, and on what timeline?** **BLOCKING**
DPIA risk 6 is High solely because of this.
*Source: DPIA §5 risk 6; Privacy 14.1.*

**E2. Where are API keys and secrets stored, and what is the rotation and revocation process?**
Needed for the incident-response plan's containment steps to be real.
*Source: Incident Response Plan §3.*

**E3. What infrastructure protections exist — WAF, DDoS protection, rate limiting beyond auth, malware scanning on uploads?**
We only publish controls we can evidence. Anything confirmed can go into Privacy 14.1; anything not confirmed stays out.
*Source: Privacy 14.1.*

**E4. Is encryption at rest actually enabled on Convex and on file storage, and who manages the keys?**
The Privacy Notice says data at rest is encrypted by our providers. Confirm.
*Source: Privacy 14.1.*

**E5. Can logs be altered or deleted by an administrator?**
Relevant to whether the audit log is evidence.
*Source: Privacy 14.1; Incident Response Plan §4.*

**E6. Is there any alerting on suspicious activity, and who receives it?**
The incident-response plan assumes someone finds out. If detection is entirely manual, we should say so rather than imply monitoring.
*Source: Incident Response Plan §1.*

## F. Acceptance records

**F1. What would it take to store the role, the campaign and the exact wording shown alongside an acceptance?** **BLOCKING**
ToS 2.2 promises these. Currently only user or guest identifier, document identifier, version string, context and timestamp are stored.
*Source: ToS 2.2.*

**F2. What would an immutable archive of superseded document versions involve?** **BLOCKING**
An acceptance record pointing at a version string is worth much less if the text behind that string can change.
*Source: ToS 2.2; H24 of the review.*

**F3. Is a guest donor's acceptance reliably linked to their donation?**
`dono_donate_guest_key` links guest legal acceptance to the donate flow. Confirm it survives long enough and is stored server-side against the donation.
*Source: ToS 2.2; Donor 1.1.*

## G. Campaign integrity

**G1. Can a campaign be edited after donations are received, and is any snapshot kept?** **BLOCKING**
There is no versioned snapshot at donation — later edits overwrite live fields. That undermines every refund ground based on misrepresentation, because we cannot show what the donor actually saw. What would a snapshot at donation involve?
*Source: Refund 3.2(a), 4.1; ToS 14.4.*

**G2. Is the campaign target enforced as a hard cap on donations?** **BLOCKING**
v2.2 states in four places that a campaign cannot be over-funded, and the no-de-minimis rule for over-funding depends on it. Confirm the cap is enforced server-side, including for concurrent donations.
*Source: ToS 14.6; Student 5.1; Donor 10.3; Refund 10.3.*

**G3. What happens to a Recurring Donation when its campaign closes, is removed or is suspended?**
The Terms say further charges stop. Confirm.
*Source: ToS 11.5; Donor 5.4.*

**G4. How does a Match Window work today, and what is stored about the matching party?**
The Terms now require the matching party, amount, ratio, period and cap to be shown, and evidence held before the window opens. None of that appears to exist as fields.
*Source: ToS 11.6; Community 5.3.*
