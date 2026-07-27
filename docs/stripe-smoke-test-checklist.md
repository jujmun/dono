# Stripe smoke test checklist

Run after `./scripts/stripe-account-switch.sh dev` or `prod`. Check Convex dashboard logs for webhook signature errors.

## Dev (test keys)

- [ ] **Connect onboarding** — society leader completes onboarding; row in `stripeConnectAccounts`; return URL works
- [ ] **Connect webhook** — `cardPaymentsActive` becomes true without manual refresh
- [ ] **Campaign one-time donation** — Payment Element / Payment Sheet succeeds; 5% application fee on connected account
- [ ] **Payment webhook** — donation `paymentStatus: succeeded`; campaign `raised` increments
- [ ] **Community fund** — platform charge succeeds; `fundAllocations` created
- [ ] **Monthly subscription** — subscription created; `invoice.paid` webhook; recurring row in DB
- [ ] **Identity (society)** — verification session; webhook updates `stripeVerificationStatus`
- [ ] **Identity (campaign)** — same for campaign creator flow
- [ ] **Refund** — admin/creator refund reduces `raised` correctly

## Prod (live keys)

Repeat all dev checks with a small live charge (£1 minimum or Stripe minimum).

## Failure signals

| Symptom | Likely cause |
|---------|----------------|
| `STRIPE_NOT_CONFIGURED` | Missing `STRIPE_SECRET_KEY` on Convex deployment |
| `Invalid webhook signature` | Wrong `STRIPE_WEBHOOK_SECRET` or identity secret |
| Payment succeeds but donation stuck pending | Webhook not registered or wrong URL |
| Connect onboarding 404 | Wrong Stripe account / Connect not enabled |
| Identity stuck on `created` | Identity webhook missing or wrong secret |
| Client "Stripe not configured" | Missing `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` or Expo not restarted |

## Quick webhook test

```bash
stripe trigger payment_intent.succeeded
# Or forward locally:
stripe listen --forward-to https://brave-parakeet-947.eu-west-1.convex.site/stripe/webhook
```
