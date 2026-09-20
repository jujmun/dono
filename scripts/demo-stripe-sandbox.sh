#!/usr/bin/env bash
# Wire demo.joindono.com + local dev to Stripe TEST mode on the Dono platform account.
#
# Prerequisites:
#   - Stripe CLI logged into the Dono account (not the legacy "Dono sandbox" profile):
#       stripe login
#   - Convex CLI linked to dev deployment (brave-parakeet-947)
#   - jq installed
#
# Usage:
#   ./scripts/demo-stripe-sandbox.sh
#   ./scripts/demo-stripe-sandbox.sh --skip-convex   # Vercel env checklist only
#   ./scripts/demo-stripe-sandbox.sh --skip-vercel   # Convex + Stripe webhooks only
#
# After running, redeploy demo on Vercel so the client bundle picks up env changes.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

SKIP_CONVEX=0
SKIP_VERCEL=0
for arg in "$@"; do
  case "$arg" in
    --skip-convex) SKIP_CONVEX=1 ;;
    --skip-vercel) SKIP_VERCEL=1 ;;
  esac
done

CONVEX_CLOUD_URL="${CONVEX_CLOUD_URL:-https://brave-parakeet-947.eu-west-1.convex.cloud}"
CONVEX_SITE_URL="${CONVEX_SITE_URL:-https://brave-parakeet-947.eu-west-1.convex.site}"
DEMO_SITE_URL="${DEMO_SITE_URL:-https://demo.joindono.com}"

command -v stripe >/dev/null || {
  echo "Install Stripe CLI: https://docs.stripe.com/stripe-cli" >&2
  exit 1
}
command -v jq >/dev/null || {
  echo "Install jq." >&2
  exit 1
}

read_stripe_test_keys() {
  local config="${STRIPE_CONFIG:-$HOME/.config/stripe/config.toml}"
  if [[ ! -f "$config" ]]; then
    echo "Stripe config not found at $config — run: stripe login" >&2
    exit 1
  fi
  STRIPE_SECRET_KEY="$(
    awk -F"'" '
      /^\[default\]/ { in_default=1; next }
      /^\[/ { in_default=0 }
      in_default && /test_mode_api_key/ { print $2; exit }
    ' "$config"
  )"
  STRIPE_PUBLISHABLE_KEY="$(
    awk -F"'" '
      /^\[default\]/ { in_default=1; next }
      /^\[/ { in_default=0 }
      in_default && /test_mode_pub_key/ { print $2; exit }
    ' "$config"
  )"
  if [[ -z "$STRIPE_SECRET_KEY" || -z "$STRIPE_PUBLISHABLE_KEY" ]]; then
    echo "Could not read test keys from Stripe CLI [default] profile." >&2
    exit 1
  fi
  if [[ "$STRIPE_SECRET_KEY" != sk_test_* ]]; then
    echo "Expected sk_test_* secret key in [default] profile." >&2
    exit 1
  fi
  if [[ "$STRIPE_PUBLISHABLE_KEY" != pk_test_* ]]; then
    echo "Expected pk_test_* publishable key in [default] profile." >&2
    exit 1
  fi
}

create_webhooks_if_missing() {
  local payments_url="${CONVEX_SITE_URL}/stripe/webhook"
  local identity_url="${CONVEX_SITE_URL}/stripe/identity-webhook"

  local existing_payments
  existing_payments="$(stripe webhook_endpoints list --limit 100 | jq -r --arg url "$payments_url" '.data[] | select(.url == $url) | .id' | head -1)"

  if [[ -n "$existing_payments" ]]; then
    echo "    Payments webhook already exists: $existing_payments"
    echo "    Roll its signing secret in Stripe Dashboard → Developers → Webhooks, then:"
    echo "      npx convex env set STRIPE_WEBHOOK_SECRET whsec_..."
    PAYMENTS_SECRET=""
  else
    PAYMENTS_JSON="$(stripe webhook_endpoints create \
      --url "$payments_url" \
      --enabled-events payment_intent.succeeded \
      --enabled-events payment_intent.payment_failed \
      --enabled-events charge.refunded \
      --enabled-events charge.dispute.created \
      --enabled-events charge.dispute.closed \
      --enabled-events invoice.paid \
      --enabled-events invoice.payment_failed \
      --enabled-events customer.subscription.deleted \
      -d "metadata[dono_deployment]=demo" \
      -d "metadata[dono_route]=payments")"
    PAYMENTS_SECRET="$(echo "$PAYMENTS_JSON" | jq -r '.secret // empty')"
    if [[ -z "$PAYMENTS_SECRET" ]]; then
      echo "    Failed to create payments webhook:" >&2
      echo "$PAYMENTS_JSON" >&2
      exit 1
    fi
    echo "    Created payments webhook"
  fi

  local existing_identity
  existing_identity="$(stripe webhook_endpoints list --limit 100 | jq -r --arg url "$identity_url" '.data[] | select(.url == $url) | .id' | head -1)"

  if [[ -n "$existing_identity" ]]; then
    echo "    Identity webhook already exists: $existing_identity"
    echo "    Roll its signing secret in Stripe Dashboard, then:"
    echo "      npx convex env set STRIPE_IDENTITY_WEBHOOK_SECRET whsec_..."
    IDENTITY_SECRET=""
  else
    IDENTITY_JSON="$(stripe webhook_endpoints create \
      --url "$identity_url" \
      --enabled-events identity.verification_session.verified \
      --enabled-events identity.verification_session.requires_input \
      --enabled-events identity.verification_session.processing \
      --enabled-events identity.verification_session.canceled \
      -d "metadata[dono_deployment]=demo" \
      -d "metadata[dono_route]=identity")"
    IDENTITY_SECRET="$(echo "$IDENTITY_JSON" | jq -r '.secret // empty')"
    if [[ -z "$IDENTITY_SECRET" ]]; then
      echo "    Failed to create identity webhook:" >&2
      echo "$IDENTITY_JSON" >&2
      exit 1
    fi
    echo "    Created identity webhook"
  fi
}

echo "==> Dono demo Stripe sandbox wiring"
echo "    Convex cloud: $CONVEX_CLOUD_URL"
echo "    Convex site:  $CONVEX_SITE_URL"
echo "    Demo site:    $DEMO_SITE_URL"
echo

read_stripe_test_keys
echo "==> Stripe [default] profile: test mode keys loaded"

if [[ "$SKIP_CONVEX" == "0" ]]; then
  echo "==> Step 1: Webhooks → Convex"
  create_webhooks_if_missing

  echo "==> Step 2: Convex deployment env (dev)"
  npx convex env set STRIPE_SECRET_KEY "$STRIPE_SECRET_KEY"
  if [[ -n "$PAYMENTS_SECRET" ]]; then
    npx convex env set STRIPE_WEBHOOK_SECRET "$PAYMENTS_SECRET"
  fi
  if [[ -n "$IDENTITY_SECRET" ]]; then
    npx convex env set STRIPE_IDENTITY_WEBHOOK_SECRET "$IDENTITY_SECRET"
  fi
  npx convex env set EXPO_PUBLIC_SITE_URL "$DEMO_SITE_URL"
  npx convex env set SITE_URL "$DEMO_SITE_URL"
  npx convex env set DEMO_OPEN_ADMIN true
  echo "    Convex Stripe env updated (test mode)."
fi

if [[ "$SKIP_VERCEL" == "0" ]]; then
  echo
  echo "==> Step 3: Vercel (demo.joindono.com) — set these Preview/Development env vars:"
  cat <<EOF
    EXPO_PUBLIC_CONVEX_URL=$CONVEX_CLOUD_URL
    EXPO_PUBLIC_CONVEX_SITE_URL=$CONVEX_SITE_URL
    EXPO_PUBLIC_SITE_URL=$DEMO_SITE_URL
    EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=$STRIPE_PUBLISHABLE_KEY
    EXPO_PUBLIC_DEMO_OPEN_ADMIN=true
EOF
  echo
  if command -v vercel >/dev/null || npx vercel --version >/dev/null 2>&1; then
    echo "    Applying via Vercel CLI (Preview + Development)..."
    for var in \
      "EXPO_PUBLIC_CONVEX_URL=$CONVEX_CLOUD_URL" \
      "EXPO_PUBLIC_CONVEX_SITE_URL=$CONVEX_SITE_URL" \
      "EXPO_PUBLIC_SITE_URL=$DEMO_SITE_URL" \
      "EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=$STRIPE_PUBLISHABLE_KEY" \
      "EXPO_PUBLIC_DEMO_OPEN_ADMIN=true"; do
      name="${var%%=*}"
      value="${var#*=}"
      printf '%s' "$value" | npx vercel env add "$name" preview development --force 2>/dev/null || \
        printf '%s' "$value" | npx vercel env add "$name" preview --force 2>/dev/null || true
    done
    echo "    Redeploy demo: npx vercel --prod is NOT needed — redeploy the preview branch or demo alias."
  else
    echo "    Install Vercel CLI and rerun, or paste the vars above in Vercel → dono → Settings → Environment Variables."
  fi
fi

echo
echo "==> Verify"
echo "  1. Redeploy demo.joindono.com (Vercel) after env changes."
echo "  2. Open demo → society page → Complete payout setup (Stripe test onboarding)."
echo "  3. Donate with test card 4242 4242 4242 4242."
echo "  4. Stripe Dashboard (test mode) → Payments should show 'Dono: {campaign}'."
echo "  5. Bundle check: real ConvexReactClient URL is brave-parakeet-947 + pk_test_ (ignore happy-otter example string in SDK)."
echo
echo "Done."
