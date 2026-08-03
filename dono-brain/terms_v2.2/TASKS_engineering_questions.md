# Questions for engineers — things terms_v2.2 assumes and needs confirmed

**Version:** 2.2 — 31 July 2026
**Owner:** Amrit
**Purpose:** every question here is something v2.2 now states or relies on, where the technical answer is unknown or unverified. These are **questions**, not build requests — build requests are in `TASKS_engineering_features.md`.

Each item cites the clause it comes from. Anything marked **BLOCKING** prevents the relevant document from being published as drafted.

---

## A. Payments and Stripe

**A1. Fee model — what is the plan and the timeline for switching from the envelope to the per-card model?** **BLOCKING**
The Terms say Dono charges the Payment Provider's applicable fee **plus 3.5 percentage points**. The code charges a fixed 5% + 20p envelope with Dono taking the residual. These agree only for a standard UK card. What does changing this involve, and does the Payment Provider expose the applicable rate at charge time or only at settlement?
*Source: ToS 16.1; Donor 6.1.*

**A2. Can the card category be determined before the charge is confirmed?** **BLOCKING**
The Terms promise the total before confirmation, or the calculation method and a true maximum. Today checkout always estimates a standard UK card. Is card-category detection possible at that point? If not, what is the genuine worst case we should show as the maximum?
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

**B1. Where exactly is the 18+ declared-date-of-birth gate enforced?**
v2.2 says 18+ for account creation, campaign creation, society creation and commenting. Confirm the gate is on all four, and confirm **there is no gate on donating** — which is now the intended behaviour, not an oversight.
*Source: ToS 1.8, 5.1, 17.1; Verification 4.3.*

**B2. What happens to the existing `DonateDobGate`?** **BLOCKING**
Donating is now open to all ages, so the donate age gate must be removed and replaced with the confirmation in `TASKS_engineering_features.md` F1. Confirm what removing it affects, and whether `ageAttested` should be repurposed to store the new confirmation.
*Source: ToS 11.4; Donor 2.2.*

**B3. Does Stripe Identity return `verifiedDob` reliably enough to be worth storing at all?**
v2.2 says Dono records a verified name or date of birth **where Stripe returns them**, and does not rely on it for age. If it is returned rarely, is storing it justified under data minimisation, or should we stop?
*Source: Verification 4.1; Privacy 3.2; ROPA row 4.*

**B4. Is the `ox.ac.uk` restriction the only institution gate, and how is a new institution added?**
ToS 4.7 names Oxford as the only recognised institution. Confirm, and tell us what changing the list involves so the clause can be kept accurate.
*Source: ToS 4.7.*

## C. Content, comments and moderation

**C1. Are links, attachments and images in comments technically blocked, or only prohibited by policy?** **BLOCKING**
Four Medium ratings in the Children's Risk Assessment and the CSAM-URL rating in the Illegal-Content Risk Assessment depend on this being a technical control.
*Source: Community 6.2; Illegal-Content RA §8.3; Children's RA §5.*

**C2. What can a moderator actually do today, and through what interface?**
The Terms and the Online Safety Act Procedures list: unpublish a campaign, hide a comment, image or document, restrict content from public view, suspend campaign activity or donations, suspend an account, and restore. Which exist, which have a UI, and which are backend-only?
*Source: OSA Procedures 3.2; Community 3.3.*

**C3. Is there a profile photograph feature?**
The ROPA records an optional avatar. The Illegal-Content Risk Assessment previously assessed "profiles, usernames and photographs" as a risk surface. Confirm what exists so the assessment describes the real product.
*Source: Illegal-Content RA §1; ROPA row 1.*

**C4. Is campaign video reviewed in full before publication, or sampled?**
Two Low ratings in the Children's Risk Assessment are expressly contingent on full-length review. This is partly a process question, but we need to know whether the tooling makes full review practical.
*Source: Children's RA §4, §8.*

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
