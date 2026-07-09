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

Dono uses Convex Auth with password credentials, email verification OTP, and password reset OTP.

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
- `AUTH_EMAIL_FROM`

### 3) Auth flows available

- `/signin` — email/password sign in & sign up
- `/verify-email` — OTP verification
- `/forgot-password` — request reset OTP
- `/reset-password` — submit reset OTP + new password
- `/account` — profile settings + password change

### 4) Role-based access control

- `profiles.role` supports `user` and `admin`.
- Admin bootstrap (first admin only):

```bash
npx convex run users:bootstrapFirstAdmin '{"email":"you@example.com"}'
```

After first bootstrap, role changes should be made via admin-only mutation (`users:setUserRole`).

### 5) Security controls

- Password strength validation on client + server
- Server-side authorization checks for sensitive mutations
- Anti-enumeration user messaging on password reset requests
- OTP verification/reset delivered via Resend
- Convex Auth session handling and secure token storage (`lib/auth-storage.ts`)

### 6) OTP manual QA checklist

1. Sign up via `/signin` (Create account).
2. Confirm verification OTP email arrives from `AUTH_EMAIL_FROM`.
3. Complete `/verify-email` with the OTP and verify redirect to `/dashboard`.
4. Go to `/forgot-password`, request reset for the same email.
5. Confirm reset OTP email arrives.
6. Complete `/reset-password` with code + new password.
7. Sign in using the new password.
8. Try invalid OTP repeatedly and verify lockout/rate-limit messaging appears.

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
