import { internal } from "./_generated/api";
import { internalMutation } from "./_generated/server";
import { cronJobs } from "convex/server";

const crons = cronJobs();

crons.interval(
  "reconcile stale pending donations",
  { hours: 1 },
  internal.maintenance.reconcileStalePendingDonations,
  {},
);

crons.daily(
  "complete expired campaigns",
  { hourUTC: 3, minuteUTC: 0 },
  internal.maintenance.completeExpiredCampaigns,
);

crons.daily(
  "expire verified identity PII",
  { hourUTC: 4, minuteUTC: 0 },
  internal.maintenance.expireVerifiedIdentityPii,
  {},
);

export default crons;
