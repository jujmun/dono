# Dono

Community infrastructure for transparent university giving.

## Getting Started

```bash
npm install
npm run dev:backend   # Convex (separate terminal)
npm run start         # Expo (web / iOS / Android)
```

Press `w` in the Expo CLI for web, or scan the QR code for a device.

## Platform Features

- **Campaigns** — Browse and support specific, tangible university projects
- **Communities** — Follow colleges, societies, and departments
- **Community Funds** — Donate across related projects
- **Discover** — Live activity feed and trending campaigns
- **Dashboard** — Personal impact tracking and Dono Wrapped
- **Create** — Multi-step campaign creation flow

## Tech Stack

- Expo (Expo Router) — web, iOS, and Android from one React Native codebase
- TypeScript
- NativeWind (Tailwind CSS)
- Convex + Convex Auth
- PostHog (EU) via `posthog-react-native`
- Lucide React Native icons

## Authentication Setup (Production)

Dono uses Convex Auth with passwordless email OTP (Resend delivery + Oslo token generation) and a required onboarding step after verification.

### 1) Install and run

```bash
npm install
npx convex dev
```

### 2) Required environment variables

Set these in `.env.local` (see `.env.local.example`):

- `EXPO_PUBLIC_CONVEX_URL`
- `EXPO_PUBLIC_CONVEX_SITE_URL`
- `AUTH_RESEND_KEY`
- `AUTH_EMAIL_FROM` (optional; defaults to `Dono <auth@dono.app>`)

Sign-in is restricted to University of Oxford email addresses (`ox.ac.uk` and
its subdomains), with one hard-coded exception: `dono.outreach@gmail.com`
(outreach admin portal). Oxford OTP is enforced in
`convex/auth/ResendEmailOTP.ts`; outreach admin OTP uses
`convex/auth/AdminEmailOTP.ts`. Client validation mirrors this in
`lib/validation/auth.ts` / `lib/auth/admin.ts`.

### 3) Auth flows available

- `/signin` — request OTP for sign-in/sign-up
- `/verify-email` — submit OTP to complete auth
- `/onboarding` — required after first verified sign-in (profile completion)
- `/forgot-password` — request a fresh OTP with anti-enumeration messaging
- `/reset-password` — OTP verification fallback entry
- `/account` — profile settings

### 4) Role-based access control

- `profiles.role` supports `user` and `admin`.
- Admin bootstrap (first admin only):

```bash
npx convex run users:bootstrapFirstAdmin '{"email":"you@example.com"}'
```

After first bootstrap, role changes should be made via admin-only mutation (`users:setUserRole`).

### 4b) Outreach admin portal (backend handoff)

The `/admin` campaign-review UI is frontend-ready. These **Convex changes are required**
before accept/deny works end-to-end. Do not confuse with the local OTP bypass.

**Separate identities**

| Email | Purpose |
|-------|---------|
| `admin@ox.ac.uk` | Local/dev OTP bypass only (`AUTH_ADMIN_OTP_BYPASS`). Leaves `resend` + fixed code `000000` unchanged. Does **not** open `/admin`. |
| `dono.outreach@gmail.com` | Primary outreach admin (`ADMIN_EMAIL`). Signs in via `admin-email` provider → `/admin`. |
| `juyeon27312@gmail.com` | Additional outreach admin. Oxford domain bypass for password signup/sign-in; OTP emailed to this address; same portal access via `role: "admin"`. |

**Env (set on the Convex deployment + client)**

```bash
npx convex env set ADMIN_EMAIL dono.outreach@gmail.com
npx convex env set ADMIN_CODE_RECIPIENT dono.outreach@gmail.com
```

In `.env.local` the client no longer needs `EXPO_PUBLIC_ADMIN_EMAIL` — it
hardcodes the outreach admin allowlist in `lib/auth/admin.ts` as the
non-Oxford sign-in exceptions.

**Backend checklist**

1. In `ensureMyProfile` / profile creation: if email equals `ADMIN_EMAIL`, set `role: "admin"` (today `bootstrapFirstAdmin` rejects non-Oxford emails).
2. Extend campaign `status` to `"pending" | "rejected" | "active" | "funded" | "completed"`.
3. `campaigns.create` inserts `status: "pending"`.
4. Public campaign queries return only `active` | `funded` | `completed`.
5. Admin-only: `campaigns.listPendingForAdmin`, `campaigns.approve` (`pending` → `active`), `campaigns.reject` (`pending` → `rejected`) — args use `{ slug: string }` to match client campaign `id`.
6. Leave `AUTH_ADMIN_OTP_BYPASS` / `admin@ox.ac.uk` bypass logic alone.

### 5) Security controls

- Server-side authorization checks for sensitive mutations
- Verified-user guards (`requireVerifiedUser`) for protected writes
- Anti-enumeration user messaging on OTP resend/reset requests
- Rate limiting for request/verify/reset flows
- OTP generation via Oslo and delivery via Resend (10-minute token validity)
- Convex Auth session handling and secure token storage (`lib/auth-storage.ts`)

### 6) OTP manual QA checklist

1. Open `/signin`, request a code with a valid email.
2. Confirm OTP email arrives from the configured sender.
3. Complete `/verify-email` with the code and confirm redirect to `/onboarding`.
4. Submit onboarding name and confirm redirect to `/dashboard`.
5. Open `/forgot-password`, request code for both known and unknown emails and verify response text remains neutral.
6. Complete `/reset-password` with email + code and confirm redirect into authenticated flow.
7. Attempt invalid or expired codes and confirm friendly error messaging.
8. Trigger repeated attempts and confirm rate-limit messaging/lockout behavior.
9. Confirm unauthenticated access to protected pages redirects to `/signin`.
10. Confirm authenticated users without profile name are redirected to `/onboarding`.

### 7) Resend deliverability requirements

- Use a verified sender domain/address in Resend for `AUTH_EMAIL_FROM`.
- Ensure SPF/DKIM are configured for your sender domain.
- For production, avoid sandbox sender identities.

## PostHog

SDK and provider are already wired. To connect your PostHog EU project (interactive login):

```bash
npx -y @posthog/wizard@latest --region eu
```

Or set `EXPO_PUBLIC_POSTHOG_API_KEY` (and optionally `EXPO_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com`) in `.env.local`.
