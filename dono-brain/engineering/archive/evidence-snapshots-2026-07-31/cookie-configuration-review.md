# Dono cookie & storage configuration — comprehensive review

> **HISTORICAL EVIDENCE — ACCURATE ONLY TO THE 31 JULY 2026 REVIEW. NOT A BUILD LIST.** Current privacy, consent, retention and DPIA implementation is consolidated in [`../../legal-launch/PRIVACY_DPIA_ENGINEERING_NARRATIVE.md`](../../legal-launch/PRIVACY_DPIA_ENGINEERING_NARRATIVE.md) and the master checklist. Re-run the tests there against the release configuration.

**Date:** 31 Jul 2026  
**Method:** Code inventory (not a live clean-browser capture)  
**Related:** [developer-configuration-form.md](developer-configuration-form.md) §4–5 · [terms-engineering-questionnaire-answers.md](terms-engineering-questionnaire-answers.md) §H · historical [09_dono_cookie_policy.md](../../../legal/suites/v1.0/09_dono_cookie_policy.md)

> **Publication caution:** Engineering facts for counsel. Exact third-party cookie names/expiries from Stripe/PostHog vary by environment — re-run a clean-browser audit before Cookie Notice publication. Not legal advice.

---

## Headline finding

Dono barely uses classic HTTP cookies. Auth, consent, and UX prefs live in **Web Storage / SecureStore**, not first-party `Set-Cookie` headers. The only non-essential technology that needs consent is **PostHog EU**, which mounts only after Accept. Stripe may still set its own cookies/SDK storage at checkout (treated as strictly necessary). Formal Cookie Policy clause 4 is still empty; the in-app stub is draft.

| Metric | Value |
|---|---|
| First-party HTTP `Set-Cookie` in-repo | **0** |
| Consent-gated SDKs | **1** (PostHog) |
| First-party storage keys | **5+** |
| CMP vendor | **In-house** (`AnalyticsConsentBanner`) — not OneTrust/Cookiebot |
| PECR readiness | **Partial** |

---

## Consent flow (architecture)

**Sources:** `app/_layout.tsx` · `lib/analytics-consent.ts` · `components/analytics-consent-banner.tsx`

```
Boot → read dono:analyticsConsent
  ├─ null     → show AnalyticsConsentBanner
  ├─ granted  → mount PostHogProvider around app tree
  └─ denied   → no SDK (tree unwrapped)
```

### Gate condition

Banner shows only if `EXPO_PUBLIC_POSTHOG_API_KEY` is set **and** consent is `null`. No API key ⇒ no banner, no PostHog.

### Mount rule

`PostHogProvider` wraps the app tree only when `consent === "granted"`. Reject leaves the tree unwrapped — the SDK never initializes.

### Persistence

| Field | Detail |
|---|---|
| Key | `dono:analyticsConsent` |
| Values | `"granted"` \| `"denied"` |
| Web | `localStorage` |
| Native | Expo SecureStore |
| Timestamp | **Not stored** |

---

## Storage inventory (code)

Treat “cookies” broadly (PECR-style): HTTP cookies + local/session storage + SDKs. Exact Stripe/PostHog cookie names require a live DevTools audit.

| Name / item | Set by | Category | Mechanism | Lifespan / notes |
|---|---|---|---|---|
| Convex Auth JWT + refresh | 1st · Convex Auth | Necessary | Web: `sessionStorage` (fallback `localStorage`); Native: SecureStore | ~1h JWT / ~30d refresh (Convex Auth defaults; not overridden in repo) |
| `dono:analyticsConsent` | 1st · Dono | Necessary (consent record) | `localStorage` / SecureStore | Until cleared; gates analytics only |
| `dono:welcomeTourComplete:*` / `dono:pendingWelcomeTour:*` | 1st · Dono | Necessary (UX) | `localStorage` / SecureStore | Per-`userId` preference flags |
| `dono_donate_guest_key` | 1st · Dono | Necessary (guest donate) | `localStorage` (web) | Links guest legal acceptance / donate flow |
| `dono:create-society:slug` | 1st · Dono | Necessary (wizard) | `sessionStorage` (web) | Resume create-society flow |
| PostHog cookies / SDK storage | 3rd · PostHog EU | Analytics (consent required) | `posthog-react-native` | **Only if consent granted**; host defaults to `https://eu.i.posthog.com` |
| Stripe.js / Payment Element / Identity / RN SDK | 3rd · Stripe | Necessary (payment / KYC) | SDK / Stripe-controlled cookies | During/after checkout & Identity; uses Payment Element / Payment Sheet, **not** Checkout Sessions |

---

## Auth storage config

**File:** `lib/auth-storage.ts`  
**Wiring:** `ConvexAuthProvider` in `app/_layout.tsx` with `storage={authStorage}`

- **Web:** prefers `sessionStorage` (tab-scoped), falls back to `localStorage`.
- **Native:** Expo SecureStore.

**Implication:** Signed-in state on web does not survive closing the browser tab when `sessionStorage` is available — this is first-party app storage, not a persistent HTTP cookie.

---

## PostHog options (when consent granted)

**File:** `app/_layout.tsx`

| Option | Value |
|---|---|
| Host | `EXPO_PUBLIC_POSTHOG_HOST` or `https://eu.i.posthog.com` |
| `enableSessionReplay` | `false` |
| `captureScreens` | `false` (screens via manual `posthog.screen()`) |
| `captureTouches` | `true` |
| `propsToCapture` | `["testID"]` only |
| `maxElementsCaptured` | `20` |

Auth fields use `ph-no-capture` where applied so email/OTP/password text is not captured.

When consented, product events include: pages/screens; campaign viewed / liked / followed / shared; donation funnel; society follow / subscription; auth signed_in / signed_up; campaign-creation funnel; limited touch autocapture. Device / browser / approx geo are PostHog defaults unless disabled in the PostHog project — **DECISION NEEDED: confirm project settings**.

---

## Platform differences

### Web

- Auth → `sessionStorage` (preferred)
- Consent / welcome tour / guest donate key → `localStorage`
- Society wizard slug → `sessionStorage`
- Stripe Payment Element + Identity via Stripe.js (may set Stripe cookies)

### iOS / Android (Expo)

- Auth + consent + welcome tour → SecureStore
- Guest donate key helper is `localStorage`-oriented (web path)
- Stripe React Native SDK / Payment Sheet
- Same consent gate; PostHog RN only if granted

---

## Legal / product surface

| Surface | Status | Notes |
|---|---|---|
| In-app Cookie Policy (`/legal/cookie`) | Draft stub `2026-07-31-v0.2-stub` | `lib/legal/content.ts` — describes essential storage, consent-gated PostHog, Stripe. Not counsel-approved. |
| Formal Cookie Policy | Draft skeleton; **clause 4 empty** | `dono-brain/terms/09_dono_cookie_policy.md` — placeholders for CMP name, analytics confirmation, mobile SDK listing |
| Footer Legal links | Terms, Privacy, Donor Terms, Guidelines | **Omits Cookie Policy** and any cookie-settings control |
| CMP | In-house `AnalyticsConsentBanner` | Active only when PostHog API key is set |

---

## Gaps vs PECR / draft Cookie Policy claims

| Claim / expectation | Code reality | Severity |
|---|---|---|
| Footer “cookie settings” link to change mind (Policy §6.1) | Footer Legal links omit Cookie Policy; no post-choice settings UI | **High** |
| Consent record with timestamp (Policy §6.4) | Only `granted`\|`denied` string — no timestamp, no server-side audit | **High** |
| Withdraw consent as easily as give | Reject-at-banner works; after grant, must clear site data / reinstall | **High** |
| Complete cookie table from live inspection | Inventory is code-based only (config form §7.3 unchecked) | **Medium** |
| Advertising / cross-site tracking: none | Aligned — no ad pixels in-repo; session replay off | OK |
| Analytics only after consent | Aligned — SDK not mounted until Accept | OK |
| CMP vendor named | In-house `AnalyticsConsentBanner` only | OK (disclose accurately) |

---

## What to do before publishing Cookie Notice

1. **Live clean-browser audit** — list every cookie + storage key (Dono, PostHog, Stripe, hosting).
2. **Add Cookie Policy + cookie settings to footer** — allow reopening the banner / flipping consent without clearing site data.
3. **Persist consent timestamp** (and ideally version) — preferably server-side if claiming 6-year retention.
4. **Fill formal Policy §4** from the live table; name CMP as in-house; confirm PostHog project retention / DPA.

---

## Key source files

- `app/_layout.tsx` — PostHog consent gate + provider options
- `lib/analytics-consent.ts` — consent read/write
- `components/analytics-consent-banner.tsx` — UI
- `lib/auth-storage.ts` — Convex Auth token storage
- `lib/welcome-tour-storage.ts` — welcome-tour prefs
- `components/donate-sheet-types.ts` — `dono_donate_guest_key`
- `app/create-society.tsx` — society wizard slug in sessionStorage
- `lib/legal/content.ts` — cookie stub (draft)
- `lib/legal/documents.ts` / `convex/lib/legalDocuments.ts` — document id + version stamp

---

*Not legal advice. Code inventory only — not a live browser inspection.*
