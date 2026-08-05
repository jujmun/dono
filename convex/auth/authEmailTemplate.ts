import { Resend as ResendClient } from "resend";
import { DONO_LOGO_BASE64 } from "./authEmailAssets";

/**
 * Reproduces the `dono-verify-email.html` Claude Design source: a table-based,
 * inline-styled layout for maximum email client compatibility. All four OTP
 * auth emails (sign-in, password reset, admin sign-in, verify email) share
 * this exact layout/styling — only heading, intro, code, expiry text, and an
 * optional footer note differ between them.
 */

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** "482916" -> "4 8 2 9 1 6", matching the design's spaced-digit code display. */
function spaceOutCode(code: string): string {
  return code.split("").join(" ");
}

export type AuthEmailTemplateParams = {
  heading: string;
  intro?: string;
  code: string;
  expiryText: string;
  footerNote?: string;
};

export function renderAuthEmailHtml({
  heading,
  intro,
  code,
  expiryText,
  footerNote,
}: AuthEmailTemplateParams): string {
  const safeHeading = escapeHtml(heading);
  const safeIntro = intro ? escapeHtml(intro) : null;
  const safeCode = escapeHtml(spaceOutCode(code));
  const safeExpiryText = escapeHtml(expiryText);
  const safeFooterNote = footerNote ? escapeHtml(footerNote) : null;
  const preheader = escapeHtml(`${heading} Your code is inside — ${expiryText}`);

  const introBlock = safeIntro
    ? `
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="padding-bottom:16px;">
                <tr>
                  <td align="center" style="font-family:Arial, Helvetica, sans-serif; font-size:15px; line-height:22px; color:#3a362f;">
                    ${safeIntro}
                  </td>
                </tr>
              </table>`
    : "";

  const footerNoteBlock = safeFooterNote
    ? `
                <tr>
                  <td align="center" style="padding-bottom:14px; font-family:Arial, Helvetica, sans-serif; font-size:12px; line-height:18px; color:#8a8374;">
                    ${safeFooterNote}
                  </td>
                </tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="color-scheme" content="light dark" />
<meta name="supported-color-schemes" content="light dark" />
<title>${safeHeading} — Dono</title>
<!--[if mso]>
<noscript>
<xml>
<o:OfficeDocumentSettings>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>
</noscript>
<![endif]-->
<style>
  body { margin:0; padding:0; }
  table { border-collapse:collapse; }
  img { border:0; outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; }
  a { text-decoration:none; }
  @media only screen and (max-width:600px) {
    .container { width:100% !important; }
    .fluid-pad { padding-left:20px !important; padding-right:20px !important; }
    .code-cell { font-size:28px !important; letter-spacing:6px !important; }
  }
  @media (prefers-color-scheme: dark) {
    .bg-cream { background-color:#1c1a16 !important; }
    .txt-dark { color:#f2ece0 !important; }
  }
</style>
</head>
<body style="margin:0; padding:0; background-color:#FBF3E7; font-family:Arial, Helvetica, sans-serif;">
  <span style="display:none; font-size:1px; color:#FBF3E7; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden; mso-hide:all;">
    ${preheader}
  </span>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="bg-cream" style="background-color:#FBF3E7;">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" class="container" style="width:600px; max-width:600px;">

          <!-- Header / Logo banner -->
          <tr>
            <td align="center" class="fluid-pad" style="background-color:#FBF3E7; padding:32px 32px; border:2px solid #1a1a1a; border-radius:16px 16px 0 0; border-bottom:0;">
              <img width="280" height="93" style="display:block; width:280px; height:93px; margin:0 auto;" src="data:image/png;base64,${DONO_LOGO_BASE64}" alt="Dono" />
            </td>
          </tr>

          <!-- Orange hero band -->
          <tr>
            <td align="center" class="fluid-pad" style="background-color:#E8562A; padding:40px 32px 36px; border-left:2px solid #1a1a1a; border-right:2px solid #1a1a1a;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="font-family:Arial, Helvetica, sans-serif; font-size:30px; line-height:36px; font-weight:bold; color:#ffffff;">
                    ${safeHeading}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td align="center" class="fluid-pad" style="background-color:#ffffff; padding:36px 32px; border-left:2px solid #1a1a1a; border-right:2px solid #1a1a1a;">
${introBlock}
              <!-- Code / receipt-style box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:2px dashed #1a1a1a; border-radius:8px; background-color:#FBF3E7; margin-top:8px;">
                <tr>
                  <td align="center" style="padding:24px 16px 6px; font-family:'Courier New', Courier, monospace; font-size:12px; letter-spacing:2px; color:#6b6558; text-transform:uppercase;">
                    Your code
                  </td>
                </tr>
                <tr>
                  <td align="center" class="code-cell" style="padding:4px 16px 22px; font-family:'Courier New', Courier, monospace; font-size:36px; font-weight:bold; letter-spacing:10px; color:#1a1a1a;">
                    ${safeCode}
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="padding-top:20px;">
                <tr>
                  <td align="center" style="font-family:Arial, Helvetica, sans-serif; font-size:13px; line-height:20px; color:#6b6558;">
                    ${safeExpiryText}
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Divider strip -->
          <tr>
            <td style="background-color:#ffffff; border-left:2px solid #1a1a1a; border-right:2px solid #1a1a1a; padding:0 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td style="border-top:1px dashed #d8d1c2; font-size:1px; line-height:1px;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" class="fluid-pad" style="background-color:#ffffff; padding:24px 32px 32px; border:2px solid #1a1a1a; border-top:0; border-radius:0 0 16px 16px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
${footerNoteBlock}
                <tr>
                  <td align="center" style="font-family:Arial, Helvetica, sans-serif; font-size:12px; line-height:19px; color:#8a8374;">
                    Sent by Dono · Community infrastructure for university giving<br />
                    27 St Giles', Oxford, OX1 3LB, United Kingdom
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top:14px; font-family:Arial, Helvetica, sans-serif; font-size:12px; color:#8a8374;">
                    <a href="https://dono.app/unsubscribe" style="color:#2D9C89; text-decoration:underline;">Unsubscribe</a>
                    &nbsp;·&nbsp;
                    <a href="https://dono.app/help" style="color:#2D9C89; text-decoration:underline;">Help centre</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
`;
}

export type SendAuthEmailArgs = {
  apiKey: string | undefined;
  from: string;
  to: string;
  subject: string;
  heading: string;
  intro?: string;
  code: string;
  expiryText: string;
  footerNote?: string;
  /** Plain-text fallback — required. Clients that block HTML and spam filters both need it. */
  text: string;
};

/** Shared sender for all OTP auth emails: renders the branded HTML template and sends both html + text. */
export function sendAuthEmail(args: SendAuthEmailArgs) {
  const resend = new ResendClient(args.apiKey);
  const html = renderAuthEmailHtml({
    heading: args.heading,
    intro: args.intro,
    code: args.code,
    expiryText: args.expiryText,
    footerNote: args.footerNote,
  });

  return resend.emails.send({
    from: args.from,
    to: [args.to],
    subject: args.subject,
    html,
    text: args.text,
  });
}
