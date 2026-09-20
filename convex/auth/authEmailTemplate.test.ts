import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { renderAuthEmailHtml } from "./authEmailTemplate";

describe("renderAuthEmailHtml", () => {
  it("renders the code as one unbroken, copyable token", () => {
    const html = renderAuthEmailHtml({
      heading: "Confirm it's you.",
      code: "482916",
      expiryText: "Expires in 10 minutes.",
    });
    // No literal whitespace inside or around the digits — mail clients would
    // otherwise copy "4 8 2 9 1 6", which no OTP input accepts.
    expect(html).toContain(">482916</td>");
    expect(html).not.toContain("4 8 2 9 1 6");
  });

  it("escapes HTML in every interpolated field", () => {
    const html = renderAuthEmailHtml({
      heading: '<img src=x onerror=alert(1)>',
      intro: "<script>alert('intro')</script>",
      code: "000000",
      expiryText: "<b>bold</b> & 'quoted'",
      footerNote: '"note" <b>x</b>',
    });
    expect(html).not.toContain("<img src=x");
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<b>bold</b>");
    expect(html).not.toContain('"note" <b>x</b>');
    expect(html).toContain("&lt;img src=x onerror=alert(1)&gt;");
    expect(html).toContain("&lt;script&gt;alert(&#39;intro&#39;)&lt;/script&gt;");
  });

  it("omits the intro block when not provided", () => {
    const html = renderAuthEmailHtml({
      heading: "Verify your email.",
      code: "123456",
      expiryText: "This code expires shortly.",
    });
    expect(html).not.toContain('font-size:15px; line-height:22px; color:#3a362f');
  });

  it("includes the intro block when provided", () => {
    const html = renderAuthEmailHtml({
      heading: "Admin sign-in.",
      intro: "Sign-in code for admin@ox.ac.uk.",
      code: "123456",
      expiryText: "Expires in 10 minutes.",
    });
    expect(html).toContain("Sign-in code for admin@ox.ac.uk.");
  });
});

describe("preview: renders all four auth emails to disk", () => {
  it("writes one HTML file per email, openable in a browser", () => {
    const emails = [
      {
        name: "sign-in",
        heading: "Confirm it's you.",
        code: "482916",
        expiryText: "Expires in 10 minutes. Didn't request this? Ignore this email.",
      },
      {
        name: "password-reset",
        heading: "Reset your password.",
        code: "150742",
        expiryText: "Expires in 10 minutes. Didn't request this? Ignore this email.",
      },
      {
        name: "admin-sign-in",
        heading: "Admin sign-in.",
        intro: "Sign-in code for admin@ox.ac.uk.",
        code: "093815",
        expiryText: "Expires in 10 minutes. Didn't request this? Ignore this email.",
      },
      {
        name: "verify-email",
        heading: "Verify your email.",
        code: "271004",
        expiryText: "This code expires shortly.",
      },
    ];

    const dir = mkdtempSync(join(tmpdir(), "dono-auth-emails-"));
    const paths: string[] = [];

    for (const email of emails) {
      const html = renderAuthEmailHtml(email);
      const path = join(dir, `${email.name}.html`);
      writeFileSync(path, html, "utf8");
      paths.push(path);
      expect(html).toContain("<!DOCTYPE html>");
    }

    // eslint-disable-next-line no-console -- intentional: this is how `npx vitest run
    // convex/auth/authEmailTemplate.test.ts` surfaces the preview paths to a developer.
    console.log(`\nOpen these in a browser to preview all four auth emails:\n${paths.join("\n")}\n`);
  });
});
