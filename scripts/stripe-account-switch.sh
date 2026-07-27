#!/usr/bin/env bash
# Stripe account switch helper for Dono.
#
# Prerequisites:
#   - Stripe CLI logged into the NEW account: stripe login
#   - Convex CLI linked to the target deployment
#   - jq installed (for parsing Stripe CLI JSON output)
#
# Usage:
#   ./scripts/stripe-account-switch.sh dev
#   ./scripts/stripe-account-switch.sh prod
#
# Set PROD_CONVEX_SITE_URL before running prod (see docs/stripe-account-switch-runbook.md).

set -euo pipefail

MODE="${1:-}"
if [[ "$MODE" != "dev" && "$MODE" != "prod" ]]; then
  echo "Usage: $0 dev|prod" >&2
  exit 1
fi

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [[ "$MODE" == "dev" ]]; then
  CONVEX_SITE_URL="${DEV_CONVEX_SITE_URL:-https://brave-parakeet-947.eu-west-1.convex.site}"
  KEY_PREFIX="test"
else
  CONVEX_SITE_URL="${PROD_CONVEX_SITE_URL:?Set PROD_CONVEX_SITE_URL to your prod *.convex.site URL}"
  KEY_PREFIX="live"
fi

PAYMENTS_WEBHOOK_URL="${CONVEX_SITE_URL}/stripe/webhook"
IDENTITY_WEBHOOK_URL="${CONVEX_SITE_URL}/stripe/identity-webhook"

PAYMENT_EVENTS=(
  payment_intent.succeeded
  payment_intent.payment_failed
  charge.refunded
  charge.dispute.created
  charge.dispute.closed
  invoice.paid
  invoice.payment_failed
  customer.subscription.deleted
  "v2.core.account[configuration.merchant].capability_status_updated"
  "v2.core.account[configuration.merchant].updated"
)

IDENTITY_EVENTS=(
  identity.verification_session.verified
  identity.verification_session.requires_input
  identity.verification_session.processing
  identity.verification_session.canceled
)

echo "==> Dono Stripe switch ($MODE)"
echo "    Convex site: $CONVEX_SITE_URL"
echo "    Stripe mode: $KEY_PREFIX"
echo

command -v stripe >/dev/null || {
  echo "Install Stripe CLI: https://docs.stripe.com/stripe-cli" >&2
  exit 1
}

command -v jq >/dev/null || {
  echo "Install jq for webhook secret extraction." >&2
  exit 1
}

echo "==> Step 1: Create webhook endpoints on NEW Stripe account"
EVENTS_CSV=$(IFS=,; echo "${PAYMENT_EVENTS[*]}")
PAYMENTS_JSON=$(stripe webhook_endpoints create \
  --url "$PAYMENTS_WEBHOOK_URL" \
  --enabled-events "$EVENTS_CSV" \
  -d "metadata[dono_deployment]=$MODE" \
  -d "metadata[dono_route]=payments")

PAYMENTS_SECRET=$(echo "$PAYMENTS_JSON" | jq -r '.secret')
PAYMENTS_ID=$(echo "$PAYMENTS_JSON" | jq -r '.id')
echo "    Payments webhook: $PAYMENTS_ID"

IDENTITY_EVENTS_CSV=$(IFS=,; echo "${IDENTITY_EVENTS[*]}")
IDENTITY_JSON=$(stripe webhook_endpoints create \
  --url "$IDENTITY_WEBHOOK_URL" \
  --enabled-events "$IDENTITY_EVENTS_CSV" \
  -d "metadata[dono_deployment]=$MODE" \
  -d "metadata[dono_route]=identity")

IDENTITY_SECRET=$(echo "$IDENTITY_JSON" | jq -r '.secret')
IDENTITY_ID=$(echo "$IDENTITY_JSON" | jq -r '.id')
echo "    Identity webhook: $IDENTITY_ID"
echo

echo "==> Step 2: Set Convex env vars"
if [[ -n "${STRIPE_SECRET_KEY:-}" ]]; then
  SK="$STRIPE_SECRET_KEY"
else
  read -r -p "Paste NEW Stripe secret key (sk_${KEY_PREFIX}_...): " SK
fi

npx convex env set STRIPE_SECRET_KEY "$SK"
npx convex env set STRIPE_WEBHOOK_SECRET "$PAYMENTS_SECRET"
npx convex env set STRIPE_IDENTITY_WEBHOOK_SECRET "$IDENTITY_SECRET"
echo "    Convex Stripe env vars updated."
echo

echo "==> Step 3: Client publishable key"
if [[ -n "${STRIPE_PUBLISHABLE_KEY:-}" ]]; then
  PUBLISHABLE_KEY="$STRIPE_PUBLISHABLE_KEY"
else
  read -r -p "Paste NEW publishable key (pk_${KEY_PREFIX}_...): " PUBLISHABLE_KEY
fi

if [[ "$MODE" == "dev" ]]; then
  if grep -q '^EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=' .env.local 2>/dev/null; then
    sed -i.bak "s|^EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=.*|EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=$PUBLISHABLE_KEY|" .env.local
    rm -f .env.local.bak
  else
    echo "EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=$PUBLISHABLE_KEY" >> .env.local
  fi
  echo "    Updated .env.local — restart Expo (npm run start)."
else
  echo "    Set in Vercel → Project → Environment Variables (Production):"
  echo "    EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=$PUBLISHABLE_KEY"
fi
echo

echo "==> Step 4: Wipe Convex Stripe-linked data"
if [[ "${SKIP_DATA_WIPE:-}" == "1" ]]; then
  echo "    Skipped (SKIP_DATA_WIPE=1)."
else
RESET_TOKEN=$(openssl rand -hex 16)
npx convex env set STRIPE_RESET_TOKEN "$RESET_TOKEN"
npx convex run adminStripeReset:resetAllStripeData "{\"confirmToken\":\"$RESET_TOKEN\"}"
npx convex env remove STRIPE_RESET_TOKEN
echo "    Convex Stripe data wiped."
fi
echo

echo "==> Done for $MODE deployment."
echo "    Next: run smoke tests (docs/stripe-account-switch-runbook.md)."
if [[ "$MODE" == "prod" ]]; then
  echo "    Then decommission the OLD Stripe account (revoke keys, delete old webhooks)."
fi
