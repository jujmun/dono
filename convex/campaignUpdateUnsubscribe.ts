import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { verifyUnsubscribeToken } from "./lib/unsubscribeToken";

export const unsubscribeFromCampaignUpdates = httpAction(async (ctx, request) => {
  const url = new URL(request.url);
  const optInId = url.searchParams.get("optInId");
  const sig = url.searchParams.get("sig");

  if (!optInId || !sig) {
    return new Response("Missing or invalid unsubscribe link.", { status: 400 });
  }

  const valid = await verifyUnsubscribeToken(optInId, sig);
  if (!valid) {
    return new Response("This unsubscribe link is invalid or has expired.", {
      status: 400,
    });
  }

  try {
    await ctx.runMutation(internal.campaignUpdateEmailsInternal.setUnsubscribed, {
      optInId: optInId as Id<"campaignUpdateOptIns">,
    });
  } catch {
    return new Response("This unsubscribe link is invalid or has expired.", {
      status: 400,
    });
  }

  return new Response(
    "You've been unsubscribed from updates for this campaign. You can close this page.",
    { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } },
  );
});
