import { httpRouter } from "convex/server";
import { auth } from "./auth";
import { stripeWebhook } from "./stripeWebhook";
import { identityWebhook } from "./societyIdentityWebhook";
import { unsubscribeFromCampaignUpdates } from "./campaignUpdateUnsubscribe";

const http = httpRouter();

auth.addHttpRoutes(http);

http.route({
  path: "/stripe/webhook",
  method: "POST",
  handler: stripeWebhook,
});

http.route({
  path: "/stripe/identity-webhook",
  method: "POST",
  handler: identityWebhook,
});

http.route({
  path: "/campaign-updates/unsubscribe",
  method: "GET",
  handler: unsubscribeFromCampaignUpdates,
});

export default http;
