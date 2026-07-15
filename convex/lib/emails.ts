import { Resend as ResendClient } from "resend";
import { getAuthFromAddress } from "../auth/otpConfig";

export async function sendTransactionalEmail(args: {
  to: string;
  subject: string;
  text: string;
}) {
  const apiKey = process.env.AUTH_RESEND_KEY;
  if (!apiKey) {
    console.error("AUTH_RESEND_KEY missing; email not sent:", args.subject);
    return { sent: false as const };
  }

  const resend = new ResendClient(apiKey);
  const { error } = await resend.emails.send({
    from: getAuthFromAddress(),
    to: [args.to],
    subject: args.subject,
    text: args.text,
  });

  if (error) {
    console.error("Failed to send email:", args.subject, error);
    return { sent: false as const };
  }

  return { sent: true as const };
}
