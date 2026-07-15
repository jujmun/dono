import Stripe from "stripe";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { shouldProcessWebhookEvent } from "./lib/webhookIdempotency";
import { formatDob, fullName } from "./lib/stripeIdentityOutputs";

function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }

  return new Stripe(secretKey);
}

/**
 * Separate from the payments webhook (/stripe/webhook): a distinct endpoint,
 * a distinct signing secret (STRIPE_IDENTITY_WEBHOOK_SECRET), and it never
 * touches donations/campaigns — only societies' Stripe Identity fields.
 */
export const identityWebhook = httpAction(async (ctx, request) => {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing stripe-signature header.", { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_IDENTITY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return new Response("Stripe Identity webhook secret is not configured.", {
      status: 500,
    });
  }

  const payload = await request.text();
  const stripe = getStripeClient();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      payload,
      signature,
      webhookSecret,
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid webhook signature.";
    return new Response(message, { status: 400 });
  }

  const existingEvent = await ctx.runQuery(
    internal.stripeInternal.getWebhookEvent,
    { stripeEventId: event.id },
  );

  if (!shouldProcessWebhookEvent(existingEvent)) {
    return new Response(JSON.stringify({ received: true, duplicate: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  switch (event.type) {
    case "identity.verification_session.verified": {
      const session = event.data.object as Stripe.Identity.VerificationSession;
      // verified_outputs is an expandable field — not reliably present on the
      // raw webhook payload, so re-retrieve the session with it expanded
      // rather than trusting event.data.object.verified_outputs directly.
      const expanded = await stripe.identity.verificationSessions.retrieve(
        session.id,
        { expand: ["verified_outputs"] },
      );
      await ctx.runMutation(internal.societies.updateVerificationFromWebhook, {
        stripeVerificationSessionId: session.id,
        status: expanded.status,
        verifiedName: fullName(expanded.verified_outputs),
        verifiedDob: formatDob(expanded.verified_outputs?.dob),
      });
      break;
    }
    case "identity.verification_session.requires_input": {
      const session = event.data.object as Stripe.Identity.VerificationSession;
      await ctx.runMutation(internal.societies.updateVerificationFromWebhook, {
        stripeVerificationSessionId: session.id,
        status: session.status,
        lastErrorCode: session.last_error?.code ?? undefined,
        lastErrorReason: session.last_error?.reason ?? undefined,
      });
      break;
    }
    case "identity.verification_session.processing":
    case "identity.verification_session.canceled": {
      const session = event.data.object as Stripe.Identity.VerificationSession;
      await ctx.runMutation(internal.societies.updateVerificationFromWebhook, {
        stripeVerificationSessionId: session.id,
        status: session.status,
      });
      break;
    }
    default:
      break;
  }

  await ctx.runMutation(internal.stripeInternal.recordWebhookEvent, {
    stripeEventId: event.id,
    type: event.type,
  });

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
