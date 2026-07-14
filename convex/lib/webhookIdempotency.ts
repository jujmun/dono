export function shouldProcessWebhookEvent(
  existingEvent: { stripeEventId: string } | null,
) {
  return existingEvent === null;
}
