#!/usr/bin/env bash
# Wipe Stripe-linked Convex data only (no key rotation or webhooks).
# Usage: ./scripts/stripe-wipe-only.sh

set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

RESET_TOKEN=$(openssl rand -hex 16)
npx convex env set STRIPE_RESET_TOKEN "$RESET_TOKEN"
npx convex run adminStripeReset:resetAllStripeData "{\"confirmToken\":\"$RESET_TOKEN\"}"
npx convex env remove STRIPE_RESET_TOKEN
echo "Stripe-linked Convex data wiped on current deployment."
