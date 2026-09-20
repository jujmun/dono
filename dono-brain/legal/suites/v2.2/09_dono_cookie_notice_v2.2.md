# Dono Cookie Notice

**Version:** Working draft v2.2 — 31 July 2026
**Status:** DRAFT — NOT FOR PUBLICATION. The table in clause 4 is drawn from a **code inventory**, not a live clean-browser inspection; that inspection must be run before publication. Requires final UK solicitor sign-off. Open items marked **[ENGINEERING — BUILD REQUIRED]** or **[SOLICITOR SIGN-OFF]**.

> **This is a Notice, not a contract.** It provides information; it is not something visitors must accept.

> **What changed from v2.1:** analytics is now stated to run on **consent**, not the statistical-purpose exception, because our analytics can link events to an identified user; the **storage table is completed** from the code inventory, and it records that most of what Dono stores is browser storage rather than classic cookies; the promise of a permanent settings link and easy withdrawal is marked as **not yet built**, because it is not; the consent record is stated as it is (no timestamp) with a build requirement; analytics retention is stated as **26 months**; and the contact address is standardised.

---

## 1. What this Notice covers

1.1 Cookies are small files placed on your device. Similar technologies — local storage, session storage, secure device storage, pixels and software development kits — do comparable things. In this Notice, **"cookies" covers all of them**, because the law treats them the same way.

1.2 That distinction matters for Dono, because **Dono sets almost no classic cookies of its own.** Your sign-in session, your analytics choice and your interface preferences are stored in your browser's own storage (or, in the mobile app, in your device's secure storage) rather than in a cookie sent to us with every request. It is still storage on your device, so it is still covered here.

1.3 This Notice sits alongside the Privacy Notice.

## 2. The law we work to

2.1 Under the Privacy and Electronic Communications Regulations 2003, we may store information on your device, or read it, **without consent only where it is strictly necessary** for a service you asked for. Everything else needs your consent, which must be freely given, specific, informed and as easy to refuse and to withdraw as it is to give. **Consent cannot be obtained through terms and conditions.**

2.2 There is an exception for certain privacy-preserving statistical analytics. **Dono does not rely on it.** Our analytics captures product events that can be linked to an identified user once they sign in, so it is not the aggregate-only measurement the exception is designed for. We therefore treat analytics as requiring **consent**, which is the stricter position.

## 3. Categories we use

3.1 **Strictly necessary — no consent required.** These are the things without which the Platform does not work:

- your authentication session (see clause 4);
- your record of whether you accepted or rejected analytics — we have to remember your choice in order to respect it;
- interface state such as whether you have completed the welcome tour, and a temporary key that links a guest donation to the terms you accepted; and
- storage set by the Payment Provider during checkout and identity verification.

3.2 **Analytics — consent required.** We use PostHog (EU) to understand how the Platform is used, so we can fix problems and improve it. **It is not loaded at all unless you accept it.** When you accept, we collect: pages and screens viewed; campaign events (viewed, liked, followed, shared); the donation funnel (started, amount selected, completed); society follows and subscriptions; sign-in and sign-up events; the campaign-creation funnel; and limited interaction capture. Device, browser and approximate location are collected by default by the analytics provider. **[ENGINEERING — confirm the analytics project's default settings for approximate location and device data, and disable anything not listed here.]**

We do **not** use session replay, and it is switched off in our configuration. Authentication fields are excluded from capture, so email addresses, passcodes and passwords are not collected.

3.3 **Advertising and cross-site tracking.** Dono uses **none**. There are no advertising pixels and no cross-site or cross-device tracking. If this ever changes, this Notice is updated and consent obtained first.

3.4 **A/B testing.** Dono does not currently run A/B tests.

## 4. What we actually store on your device

> **[ENGINEERING — BUILD REQUIRED]** — this table is compiled from a review of Dono's code, not from a live inspection in a clean browser. **A clean-browser audit of every route and checkout state must be run and this table corrected before publication**, because third-party names and expiry times vary by environment.

| Name / item | Set by | Category | Where it is stored | How long it lasts |
|---|---|---|---|---|
| Authentication token and refresh token | Dono (Convex Auth) | Strictly necessary | Web: session storage, falling back to local storage. App: secure device storage | Token about 1 hour; refresh token about 30 days |
| `dono:analyticsConsent` | Dono | Strictly necessary (records your choice) | Local storage / secure device storage | Until you clear it |
| `dono:welcomeTourComplete:*`, `dono:pendingWelcomeTour:*` | Dono | Strictly necessary (interface preference) | Local storage / secure device storage | Until you clear it |
| `dono_donate_guest_key` | Dono | Strictly necessary (links a guest donation to the terms accepted) | Local storage (web) | Until you clear it |
| `dono:create-society:slug` | Dono | Strictly necessary (lets you resume the create-society form) | Session storage (web) | Until the browser tab closes |
| PostHog analytics storage | PostHog (EU) | **Analytics — consent required** | Set by the analytics provider | **Only if you accept analytics.** Not loaded at all if you decline |
| Stripe checkout and identity storage | Stripe | Strictly necessary (payment and identity verification) | Set by Stripe | During and after checkout and verification, controlled by Stripe |

4.1 **A note on sign-in.** On the web, your session is normally kept in session storage, which means **closing the browser tab signs you out.** That is a deliberate choice and not a fault.

## 5. Your choices

5.1 **The analytics banner.** Before any analytics loads, we show a banner with **equally prominent Accept and Reject options**. Nothing optional loads before you choose. If you reject, the analytics software is never started — it is not merely told to stay quiet.

5.2 **Changing your mind.** You can change your analytics choice at any time from the **Privacy and analytics settings** link in the footer of every page. **[ENGINEERING — BUILD REQUIRED: this link does not currently exist, the footer omits this Notice entirely, and once you have accepted, the only way to withdraw is to clear site data or reinstall the app. Withdrawal must be made as easy as giving consent, and this clause must not be published until it is.]**

5.3 **What we record about your choice.** We record whether you accepted or rejected. **[ENGINEERING — BUILD REQUIRED: we do not currently record when you chose, or which version of this Notice you were shown. Both are needed, and the Privacy Notice's retention entry for consent records assumes they exist.]**

5.4 **Your browser and device.** You can block or delete stored data through your browser or device settings; blocking strictly necessary storage stops parts of the Platform working, including signing in.

## 6. Server logs

6.1 Dono retains proportionate server logs (IP address, timestamp, requested page, browser and error data) for security, fraud prevention, service availability, fault detection and incident investigation. These are generated by our servers rather than stored on your device, so they do not require consent under clause 2.1; we rely on our legitimate interests, limit retention, restrict access, and do not repurpose security logs for behavioural analytics without reassessing the position. Dono uses no separate error-monitoring product — only the platform logs of its hosting and database providers.

## 7. Third parties, mobile apps, changes and contact

7.1 The Payment Provider sets strictly necessary storage during checkout and identity verification, governed by its own policies. Any other third party setting storage must appear in clause 4.

7.2 **Mobile app.** The Dono app stores the equivalent items in your device's secure storage, as shown in clause 4, and uses the same consent gate for analytics.

7.3 **Consent management.** Dono's consent banner is built in-house. We do not use a third-party consent-management platform.

7.4 We update this Notice when what we store changes. Questions: **joindono.team@gmail.com**. Dono is a trading name operated by Amrit Kaur Rooprai, a sole trader, 37 St Giles', Oxford OX1 3LD.
