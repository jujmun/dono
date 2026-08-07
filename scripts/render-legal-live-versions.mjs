#!/usr/bin/env node
/**
 * Renders v3.0 public Markdown into live-versions HTML + PDF artifacts,
 * verifies source hashes, and generates app/convex registry modules.
 *
 * Usage: node scripts/render-legal-live-versions.mjs
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const DOCS = [
  [
    "terms_of_service",
    "01_dono_terms_of_service_v3.0.md",
    "Terms of Service",
    "cc818552ddb1be407a8dd1af5825b50959cba0dea8d7d09869c144017f428bda",
  ],
  [
    "society_campaign_terms",
    "03_dono_society_campaign_terms_v3.0.md",
    "Society Campaign Terms",
    "75607b402c151a2f3b33989d52c20d0083be20a361908955202f652890208530",
  ],
  [
    "donor_terms",
    "04_dono_donor_terms_v3.0.md",
    "Donor Terms",
    "efe48e3a0abc008e2a6f4dc6299efe53a60353bc3450bf9c33d2cf555759f74b",
  ],
  [
    "community_guidelines",
    "05_dono_community_guidelines_v3.0.md",
    "Community Guidelines",
    "92c00f4465f11385c7470b42952b79cff3b7ffc1095639c1c0803315ac1149e1",
  ],
  [
    "verification",
    "06_dono_verification_notice_v3.0.md",
    "Verification Notice",
    "10b71d0efc30c5c7b012275e274f69173bc900ac7f617ff949511871be822f11",
  ],
  [
    "refund_dispute",
    "07_dono_refund_and_dispute_policy_v3.0.md",
    "Refund and Dispute Policy",
    "1237eba717eee26b2e89122dc4e61fc89ebb866184b4c86f3e97976a415428fa",
  ],
  [
    "privacy",
    "08_dono_privacy_notice_v3.0.md",
    "Privacy Notice",
    "4cdf37035558f7727a3450a90506e0193c0e1978ba8a771d56b32e2825e116ff",
  ],
  [
    "cookie",
    "09_dono_cookie_notice_v3.0.md",
    "Cookie Notice",
    "42e80d52b73728d51fa22bd1376e903eb93f9f28a9f7660ab1f921eecc83331e",
  ],
  [
    "complaints",
    "dono-complaints-policy-v3.0.md",
    "Complaints Policy",
    "ee96e212927b8a73c9bd8c4c93f2ca02440218e4e7895ba6c35ef37eb19eccdb",
  ],
];

function sha256(buf) {
  return crypto.createHash("sha256").update(buf).digest("hex");
}

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inlineFormat(escaped) {
  return escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

function mdToHtml(title, md) {
  const lines = md.split(/\r?\n/);
  let html = "";
  let inList = false;
  let inCode = false;
  let para = [];

  const flushPara = () => {
    if (para.length) {
      html += `<p>${inlineFormat(escapeHtml(para.join(" ")))}</p>\n`;
      para = [];
    }
  };

  for (const line of lines) {
    if (line.startsWith("```")) {
      flushPara();
      if (inCode) {
        html += "</pre>\n";
        inCode = false;
      } else {
        html += "<pre>";
        inCode = true;
      }
      continue;
    }
    if (inCode) {
      html += `${escapeHtml(line)}\n`;
      continue;
    }
    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      flushPara();
      if (inList) {
        html += "</ul>\n";
        inList = false;
      }
      const level = heading[1].length;
      html += `<h${level}>${escapeHtml(heading[2])}</h${level}>\n`;
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      flushPara();
      if (!inList) {
        html += "<ul>\n";
        inList = true;
      }
      html += `<li>${inlineFormat(escapeHtml(line.replace(/^[-*]\s+/, "")))}</li>\n`;
      continue;
    }
    if (line.trim() === "") {
      flushPara();
      if (inList) {
        html += "</ul>\n";
        inList = false;
      }
      continue;
    }
    if (inList) {
      html += "</ul>\n";
      inList = false;
    }
    para.push(line.trim());
  }
  flushPara();
  if (inList) html += "</ul>\n";
  if (inCode) html += "</pre>\n";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${escapeHtml(title)}</title>
<style>
body{font-family:Georgia,serif;max-width:42rem;margin:2rem auto;padding:0 1rem;line-height:1.55;color:#17211B}
h1,h2,h3,h4{font-family:system-ui,sans-serif}
pre{white-space:pre-wrap;background:#f4f4f0;padding:1rem}
</style>
</head>
<body>
<article>
${html}
</article>
</body>
</html>
`;
}

function escapePdfText(line) {
  return line
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

/** Minimal Helvetica text PDF for durable download (ASCII-safe). */
function simplePdf(title, text) {
  const content = `${title}\n\n${text}`
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, "?")
    .slice(0, 80000);
  const lines = content.split("\n");
  const cmds = ["BT", "/F1 9 Tf", "11 TL", "40 750 Td"];
  for (const line of lines.slice(0, 900)) {
    cmds.push(`(${escapePdfText(line.slice(0, 95))}) Tj`, "T*");
  }
  cmds.push("ET");
  const stream = cmds.join("\n");
  const objs = [
    "1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj\n",
    "2 0 obj<< /Type /Pages /Kids [3 0 R] /Count 1 >>endobj\n",
    "3 0 obj<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>endobj\n",
    `4 0 obj<< /Length ${Buffer.byteLength(stream, "utf8")} >>stream\n${stream}\nendstream\nendobj\n`,
    "5 0 obj<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>endobj\n",
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (const o of objs) {
    offsets.push(Buffer.byteLength(pdf, "utf8"));
    pdf += o;
  }
  const xrefStart = Buffer.byteLength(pdf, "utf8");
  pdf += `xref\n0 ${objs.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (let i = 1; i < offsets.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;
  return Buffer.from(pdf, "utf8");
}

function genTs(manifest, bodies) {
  return `// AUTO-GENERATED by scripts/render-legal-live-versions.mjs — do not edit.
export const LIVE_LEGAL_VERSION = "3.0" as const;
export const LIVE_LEGAL_MANIFEST = ${JSON.stringify(manifest, null, 2)} as const;
export const LIVE_LEGAL_BODIES: Record<string, string> = ${JSON.stringify(bodies, null, 2)};
`;
}

const base = path.join(root, "dono-brain/legal/suites/v3.0/public");
const outRoot = path.join(root, "dono-brain/legal/live-versions/3.0");
fs.mkdirSync(outRoot, { recursive: true });

const manifest = {
  version: "3.0",
  versionDate: "2026-08-07",
  documents: {},
};
const bodies = {};

for (const [id, file, title, expectedHash] of DOCS) {
  const srcPath = path.join(base, file);
  const src = fs.readFileSync(srcPath);
  const sourceHash = sha256(src);
  if (sourceHash !== expectedHash) {
    console.error(`HASH MISMATCH for ${id}: got ${sourceHash}, expected ${expectedHash}`);
    process.exit(1);
  }
  const md = src.toString("utf8");
  const htmlBuf = Buffer.from(mdToHtml(title, md), "utf8");
  const pdfBuf = simplePdf(title, md);
  const dir = path.join(outRoot, id);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "document.html"), htmlBuf);
  fs.writeFileSync(path.join(dir, "document.pdf"), pdfBuf);
  fs.writeFileSync(path.join(dir, "source.md"), src);
  const entry = {
    id,
    title,
    version: "3.0",
    sourceFile: file,
    sourceHash,
    htmlHash: sha256(htmlBuf),
    pdfHash: sha256(pdfBuf),
    htmlPath: `${id}/document.html`,
    pdfPath: `${id}/document.pdf`,
  };
  manifest.documents[id] = entry;
  bodies[id] = md.replace(/\r\n/g, "\n");
  console.log(`OK ${id} html=${entry.htmlHash.slice(0, 12)}`);
}

fs.writeFileSync(
  path.join(outRoot, "manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);

const generated = genTs(manifest, bodies);
fs.mkdirSync(path.join(root, "lib/legal/artifacts"), { recursive: true });
fs.mkdirSync(path.join(root, "convex/lib/legalArtifacts"), { recursive: true });
fs.writeFileSync(path.join(root, "lib/legal/artifacts/generated.ts"), generated);
fs.writeFileSync(
  path.join(root, "convex/lib/legalArtifacts/generated.ts"),
  generated,
);
console.log("Wrote live-versions/3.0 + generated registry modules");
