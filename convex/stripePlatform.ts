import { query } from "./_generated/server";

/** Whether the Convex deployment has a Stripe secret key (no key material exposed). */
export const isConfigured = query({
  args: {},
  handler: async () => {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    return {
      configured: Boolean(secretKey),
      mode: secretKey?.startsWith("sk_live_")
        ? ("live" as const)
        : secretKey?.startsWith("sk_test_")
          ? ("test" as const)
          : null,
    };
  },
});
