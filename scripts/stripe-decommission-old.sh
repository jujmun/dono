#!/usr/bin/env bash
# Decommission the OLD Dono Stripe sandbox (acct_1TrduJJSrO8JVmT4).
#
# Run ONLY after the new account is live and smoke-tested.
# Requires Stripe CLI logged into the OLD account (or use Dashboard manually).
#
# Usage: ./scripts/stripe-decommission-old.sh

set -euo pipefail

echo "==> Listing webhook endpoints on current Stripe CLI account"
stripe webhook_endpoints list --limit 20

echo
read -r -p "Delete ALL listed webhook endpoints? (yes/no): " CONFIRM
if [[ "$CONFIRM" != "yes" ]]; then
  echo "Aborted."
  exit 0
fi

ENDPOINTS=$(stripe webhook_endpoints list --limit 100 | jq -r '.data[].id')
for id in $ENDPOINTS; do
  echo "Deleting $id"
  stripe webhook_endpoints delete "$id"
done

echo
echo "==> Manual steps remaining (Stripe Dashboard):"
echo "  1. Developers → API keys → Roll/revoke sk_test_ and sk_live_ secret keys"
echo "  2. Cancel any active subscriptions on connected/platform customers"
echo "  3. Export reports if needed"
echo "  4. Contact Stripe support to close the account if desired"
