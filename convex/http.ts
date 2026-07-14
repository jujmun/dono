import { httpRouter } from "convex/server";
import { auth } from "./auth";
import { stripeWebhook } from "./stripeWebhook";

const http = httpRouter();

auth.addHttpRoutes(http);

http.route({
  path: "/stripe/webhook",
  method: "POST",
  handler: stripeWebhook,
});

export default http;
