import { internal } from "./_generated/api";
import { internalMutation } from "./_generated/server";
import { cronJobs } from "convex/server";

const crons = cronJobs();

crons.interval(
  "reconcile stale pending donations",
  { hours: 6 },
  internal.maintenance.reconcileStalePendingDonations,
);

crons.daily(
  "complete expired campaigns",
  { hourUTC: 3, minuteUTC: 0 },
  internal.maintenance.completeExpiredCampaigns,
);

export default crons;
