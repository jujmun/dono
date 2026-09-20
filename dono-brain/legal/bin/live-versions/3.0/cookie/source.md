# Dono Cookie Notice

**Version:** 3.0
**Version date:** 7 August 2026
**Effective from:** on publication approval (see approval block)
**Document type:** Notice — information, not contract
**Supersedes:** v2.3 (6 August 2026) and all earlier versions, retained unaltered in the version archive at `../../v2.3/`, `../../v2.2/`, `../../v2.1/`, `../../v2.0/` and `../../v1.0/`
**Precedence:** This Notice governs cookies and similar technologies (Terms of Service clause 1.7). It sits alongside the Privacy Notice.

> **This is a Notice, not a contract.** It provides information; it is not something you have to accept.

---

## 1. What this Notice covers

1.1 Cookies are small files placed on your device. Similar technologies — local storage, session storage, secure device storage, pixels and software development kits — do comparable things. In this Notice **"cookies" covers all of them**, because the law treats them the same way.

1.2 That distinction matters for Dono, because **Dono sets almost no classic cookies of its own.** Your sign-in session, your analytics choice and your interface preferences are stored in your browser's own storage (or, in the app, your device's secure storage) rather than in a cookie sent to us with every request. It is still storage on your device, so it is still covered here.

## 2. The law we work to

2.1 Under the Privacy and Electronic Communications Regulations 2003 we may store information on your device, or read it, **without consent only where it is strictly necessary** for a service you asked for. Everything else needs your consent, which must be freely given, specific, informed and **as easy to refuse and to withdraw as it is to give**. **Consent cannot be obtained through terms and conditions.**

2.2 **Why analytics needs your consent.** The rules above apply to *storing or reading anything on your device*, whatever the data is later used for. Our analytics provider stores an identifier on your device, so consent is required regardless of how identifiable the data is. There is a narrow exception for certain privacy-preserving statistical analytics; **Dono does not rely on it**, because our analytics records specific product events rather than aggregate-only measurement.

2.3 **A point in your favour.** Dono does **not** link analytics events to your account: we never send your identity to the analytics provider, so the identifier it holds stays pseudonymous. That reduces the impact but does not remove the need for consent.

## 3. Categories we use

3.1 **Strictly necessary — no consent required.**

- your authentication session;
- your record of whether you accepted or rejected analytics, with the timestamp and the version of this Notice you were shown — we have to remember your choice in order to respect it;
- interface state such as whether you have completed the welcome tour, and a temporary key that links a guest donation to the terms accepted; and
- storage set by the Payment Provider during checkout and identity verification.

3.2 **Analytics — consent required.** We use **PostHog (EU)** to understand how the Platform is used so we can fix problems and improve it. **It is not loaded at all unless you accept it.** When you accept, we collect:

- pages and screens viewed;
- campaign events — viewed, liked, followed, shared;
- the donation funnel — started, amount selected, completed;
- society follows and subscription events;
- sign-in and sign-up events;
- the campaign-creation funnel;
- **limited interaction capture** — taps and clicks, recorded only against a component's test identifier, not its content;
- **device and browser information** — browser, operating system, device type, screen size;
- **approximate location** — your IP address is anonymised as it arrives, and an approximate country and city are derived from it. **We do not receive or store your full IP address in the analytics system**; and
- aggregate interaction and page-performance measurements, including heatmaps and web-vitals data.

We do **not** use session replay. Authentication fields are excluded from capture, so email addresses, passcodes and passwords are never collected. **We do not send your name, email address or account identity to the analytics provider.**

3.3 **Advertising and cross-site tracking.** Dono uses **none**. There are no advertising pixels and no cross-site or cross-device tracking. If this ever changes, this Notice is updated and consent obtained first.

3.4 **A/B testing.** Dono does not run A/B tests.

3.5 **How long analytics data is kept.** Analytics events are retained for **12 months** and then deleted. Consent records are covered in clause 5.3.

## 4. What we actually store on your device

> **How this table was produced.** It is compiled from a **source-level audit** of every storage call and every third-party component in the Platform, dated 5 August 2026. **A live clean-browser inspection on desktop and mobile has not yet been run**, so the exact names and expiry times of items set by Stripe are as that provider documents them rather than as observed. That inspection must be completed, and this table corrected against it, **before this Notice is published**. It is re-run whenever the Platform's storage changes.

| Name / item | Set by | Category | Where it is stored | When it is set | How long it lasts |
|---|---|---|---|---|---|
| `__convexAuthJWT_*` | Dono (Convex Auth) | Strictly necessary — your signed-in session | Web: session storage. App: secure device storage | On successful sign-in, not before | About 1 hour |
| `__convexAuthRefreshToken_*` | Dono (Convex Auth) | Strictly necessary — keeps you signed in | Web: session storage. App: secure device storage | On successful sign-in | About 30 days |
| `dono:analyticsConsent` (your choice, the time you made it, and the version of this Notice) | Dono | Strictly necessary — records your choice so we can respect it | Local storage / secure device storage | The moment you action the banner, not before | Until you change it or clear it |
| `dono:welcomeTourComplete:*`, `dono:pendingWelcomeTour:*` | Dono | Strictly necessary — interface preference | Local storage / secure device storage | On sign-in, once your profile loads | Until you clear it |
| `dono_donate_guest_key` | Dono | Strictly necessary — links a donation made without an account to the terms accepted for it | Local storage (web) | The first time the donation panel is opened | **Until you clear it** |
| Create-society / create-college draft key | Dono | Strictly necessary — lets you resume a part-finished form | Session storage (web) | When you open that form | Until the browser tab closes |
| PostHog analytics storage — identifier, session identifier, queued events | PostHog (EU) | **Analytics — consent required** | Local storage / device storage | **Only if you accept analytics.** Nothing is set, and nothing is sent, if you decline | Until cleared |
| `__stripe_mid`, `__stripe_sid` and similar, set by Stripe | Stripe | Strictly necessary — payment fraud prevention and identity verification | Set by Stripe, on Stripe's domain | **Only when you open a payment or identity-verification flow** — not when you load a page | `__stripe_mid` about 1 year; `__stripe_sid` about 30 minutes; controlled by Stripe |

**Our email provider sets nothing on your device.** Emails are sent from our servers; there is no email tracking script in the Platform.

4.1 **A note on sign-in.** On the web your session is kept in session storage, which means **closing the browser tab signs you out.** That is a deliberate choice, not a fault.

4.2 **Before you make a choice about analytics, nothing analytics-related and nothing from Stripe is on your device.** The only things present are the items above that are set by an action you have taken — signing in, opening a form, or opening a payment flow.

## 5. Your choices

5.1 **The analytics banner.** Before any analytics loads, we show a banner with **equally prominent "Accept analytics" and "Reject analytics" options.** Neither is emphasised over the other by size, colour, contrast, position or wording. **Nothing optional loads before you choose.** If you reject, the analytics software is never started — it is not merely told to stay quiet.

5.2 **Changing your mind.** There is a permanent **"Privacy and analytics settings"** link in the footer of every page, alongside a link to this Notice. You can change or withdraw your analytics choice there at any time.

> **You can withdraw analytics consent at any time through Privacy and analytics settings. Withdrawal takes effect immediately for future collection.**

Withdrawal also revokes consent downstream: the analytics client is stopped, no further events are sent, and we instruct the analytics provider accordingly.

5.3 **What we record about your choice.** We record **whether you accepted or rejected, when you chose, and which version of this Notice you were shown.** That record is kept while your choice is current and for 12 months afterwards. It is stored on your device, not against your account.

5.4 **Your browser and device.** You can block or delete stored data through your browser or device settings. Blocking strictly necessary storage stops parts of the Platform working, including signing in.

## 6. Server logs

6.1 Dono retains proportionate server logs (IP address, timestamp, requested page, browser and error data) for security, fraud prevention, service availability, fault detection and incident investigation. These are generated by our servers rather than stored on your device, so they do not require consent under clause 2.1; we rely on our legitimate interests, limit retention, restrict access, and do not repurpose security logs for behavioural analytics without reassessing the position. Dono uses no separate error-monitoring product — only the platform logs of its hosting and database providers.

## 7. Third parties, mobile apps, changes and contact

7.1 The Payment Provider sets strictly necessary storage during checkout and identity verification, governed by its own policies. Any other third party setting storage must appear in clause 4.

7.2 **Mobile app.** The Dono app stores the equivalent items in your device's secure storage, as shown in clause 4, and uses the same consent gate for analytics.

7.3 **Consent management.** Dono's consent banner is built in-house. We use no third-party consent-management platform.

7.4 We update this Notice when what we store changes, and **every version is permanently numbered, dated and archived**. Questions: **joindono.team@gmail.com**. Dono is a trading name of Amrit Kaur Rooprai, a sole trader, 37 St Giles', Oxford OX1 3LD.

---

## Approval block — SIGNATURE REQUIRED

> **This block is unsigned. This document is prepared for approval and is not approved.**

**I confirm that I have reviewed this document in its consolidated v3.0 form, that it states the current position only, and that I approve it.**

| Field | Entry |
|---|---|
| Approver name | Amrit Kaur Rooprai |
| Role | Controller, sole trader and accountable owner |
| Document version approved | 3.0 |
| Approved for publication | ☐ Yes, on ____________ · ☑ **No** — publication is gated on the items marked *publication-blocking* in `../../../../engineering/legal-launch/ENGINEERING_IMPLEMENTATION_CHECKLIST_v2.3.md` and on the manifest in `../publication-package/PUBLICATION_APPROVAL_REGISTER.md` |
| Signature | ______________________ |
| Date of approval | ______________________ |

**Reviewed by:** Sashank (deputy) — Signature ______________________  Date ______________

---

## Version control

| Field | Entry |
|---|---|
| Document | Dono Cookie Notice |
| Document type | Notice — information, not contract |
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
