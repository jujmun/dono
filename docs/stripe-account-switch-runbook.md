# Stripe account switch runbook

Use this when moving Dono from one Stripe platform account to another (dev **and** prod). The repo ships an automated helper at [`scripts/stripe-account-switch.sh`](../scripts/stripe-account-switch.sh) and a one-time data wipe at [`convex/adminStripeReset.ts`](../convex/adminStripeReset.ts).

**Current dev Convex site (from `.env.local`):** `https://brave-parakeet-947.eu-west-1.convex.site`

---

## Phase 0 — Configure the NEW Stripe account

Do this in the **new** Stripe Dashboard before rotating keys.

### Platform profile (test + live)

| Setting | Value |
|---------|--------|
| Country | GB |
| Default currency | GBP |
| Website | `https://joindono.com` |
| MCC | `5734` (Computer Software Stores) or appropriate |
| Statement descriptor | e.g. `DONO` (live) / `DONO SANDBOX` (test) |

Complete identity verification so **charges** and **payouts** are enabled in both test and live modes.

### Enable products

1. **Connect** — platform/marketplace; Accounts **v2** merchant onboarding
2. **Identity** — document + matching selfie (society/campaign KYC)
3. **Billing** — Customers, Prices, Subscriptions (monthly donations)

Connect controller settings must match code in [`convex/lib/stripeConnectMerchant.ts`](../convex/lib/stripeConnectMerchant.ts): full Dashboard, Stripe collects fees/losses, GB merchant accounts.

### Payment methods

Dashboard → **Settings → Payment methods**. Code uses `automatic_payment_methods: { enabled: true }` — the Dashboard controls what donors see.

### Apple Pay (production)

- Register web domains in Stripe Dashboard
- Apple Developer merchant ID: `merchant.com.dono.app` (see [`lib/stripe/provider.native.tsx`](../lib/stripe/provider.native.tsx))
- Change code only if you adopt a different merchant ID

---

## Phase 1 — Webhook endpoints

Webhooks hit **Convex** (`*.convex.site`), not Vercel.

| Deployment | Payments URL | Identity URL |
|------------|--------------|--------------|
| Dev | `https://brave-parakeet-947.eu-west-1.convex.site/stripe/webhook` | `.../stripe/identity-webhook` |
| Prod | `https://<prod-deployment>.convex.site/stripe/webhook` | `.../stripe/identity-webhook` |

### Payments webhook events

- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `charge.refunded`
- `charge.dispute.created`
- `charge.dispute.closed`
- `invoice.paid`
- `invoice.payment_failed`
- `customer.subscription.deleted`
- `v2.core.account[configuration.merchant].capability_status_updated`
- `v2.core.account[configuration.merchant].updated`

### Identity webhook events

- `identity.verification_session.verified`
- `identity.verification_session.requires_input`
- `identity.verification_session.processing`
- `identity.verification_session.canceled`

### Automated setup (Stripe CLI on NEW account)

```bash
stripe login   # log into the NEW account
./scripts/stripe-account-switch.sh dev
# For prod:
PROD_CONVEX_SITE_URL=https://<prod>.convex.site ./scripts/stripe-account-switch.sh prod
```

The script creates both webhooks, sets Convex secrets, updates `.env.local` (dev), and wipes Stripe-linked Convex data.

---

## Phase 2 — Environment variables

### Convex (server) — per deployment

| Variable | Dev | Prod |
|----------|-----|------|
| `STRIPE_SECRET_KEY` | `sk_test_...` | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | from payments webhook | from payments webhook |
| `STRIPE_IDENTITY_WEBHOOK_SECRET` | from identity webhook | from identity webhook |
| `STRIPE_CONNECT_WEBHOOK_SECRET` | optional; falls back to `STRIPE_WEBHOOK_SECRET` |

```bash
npx convex env set STRIPE_SECRET_KEY sk_test_...
npx convex env set STRIPE_WEBHOOK_SECRET whsec_...
npx convex env set STRIPE_IDENTITY_WEBHOOK_SECRET whsec_...
npx convex env list   # verify names only — never commit values
```

Switch Convex prod deployment before setting live keys (`npx convex deploy --prod` context or dashboard team selector).

**Prod data wipe:** repeat Phase 3 manual commands while your CLI targets the **production** Convex deployment (not dev). Dev has already been wiped if you ran the script locally.

### Client (publishable key)

| Location | Variable | Mode |
|----------|----------|------|
| `.env.local` | `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` |
| Vercel Production | `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` |

Restart Expo after changing `.env.local`.

---

## Phase 3 — Wipe Convex Stripe data

Stripe IDs (`acct_`, `cus_`, `pi_`, `sub_`, Identity sessions) are account-scoped. Run on **dev first**, then **prod**.

### Automated (via switch script)

Included in `./scripts/stripe-account-switch.sh`.

### Manual

```bash
RESET_TOKEN=$(openssl rand -hex 16)
npx convex env set STRIPE_RESET_TOKEN "$RESET_TOKEN"
npx convex run adminStripeReset:resetAllStripeData "{\"confirmToken\":\"$RESET_TOKEN\"}"
npx convex env remove STRIPE_RESET_TOKEN
```

### What gets cleared

**Deleted tables:** `stripeConnectAccounts`, `stripeCustomers`, `stripeWebhookEvents`, `recurringDonations`, `donations`, `fundAllocations`, `campaignPayouts`, `campaignUpdateOptIns`, `campaignUpdateEmailLog`

**Reset fields:** campaign `raised`/`donors`/Identity fields; society Identity fields; community `totalRaised`; fund aggregates

After both deployments are reset, delete [`convex/adminStripeReset.ts`](../convex/adminStripeReset.ts).

---

## Phase 4 — Decommission OLD account (`acct_1TrduJJSrO8JVmT4`)

**Only after** new keys are live and smoke tests pass:

1. Delete/disable webhook endpoints pointing at Convex URLs
2. Revoke old `sk_test_` / `sk_live_` keys and restricted keys
3. Cancel any active subscriptions still on the old account (Convex rows are already wiped)
4. Export reports if needed, then close/archive the old account

```bash
# List old webhooks (while CLI still points at old account, before re-login)
stripe webhook_endpoints list

# Delete each old endpoint
stripe webhook_endpoints delete we_...

# Roll secret keys in Dashboard → Developers → API keys
```

---

## Phase 5 — Smoke tests

Run on dev (test keys) then prod (live keys).

| Flow | Pass criteria |
|------|---------------|
| Society Connect onboarding | New `acct_` in `stripeConnectAccounts`; return URL works |
| Connect webhook | `cardPaymentsActive` updates without manual refresh |
| Campaign one-time donation | PI on connected account; 5% app fee; payment completes |
| Payment webhook | Donation succeeded; campaign `raised` increments |
| Community fund | Platform charge; allocations created |
| Monthly subscription | Subscription + `invoice.paid` webhook |
| Identity | Session created; verification status updates |
| Refund | Admin refund adjusts donation + campaign raised |

Watch Convex logs for `Invalid webhook signature` (secret mismatch).

---

## Key mode pairing

Always pair consistently:

- Dev Convex + `.env.local` → **test** keys (`sk_test_`, `pk_test_`, test webhooks)
- Prod Convex + Vercel Production → **live** keys (`sk_live_`, `pk_live_`, live webhooks)

See also [`docs/stripe-smoke-test-checklist.md`](stripe-smoke-test-checklist.md) for verification steps.
