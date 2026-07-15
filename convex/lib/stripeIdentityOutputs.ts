import type Stripe from "stripe";

export function formatDob(
  dob: Stripe.Identity.VerificationSession.VerifiedOutputs.Dob | null | undefined,
) {
  if (!dob || !dob.year || !dob.month || !dob.day) return undefined;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${dob.year}-${pad(dob.month)}-${pad(dob.day)}`;
}

export function fullName(
  outputs: Stripe.Identity.VerificationSession.VerifiedOutputs | null | undefined,
) {
  if (!outputs) return undefined;
  const parts = [outputs.first_name, outputs.last_name].filter(
    (part): part is string => Boolean(part),
  );
  return parts.length > 0 ? parts.join(" ") : undefined;
}
