#!/usr/bin/env node
/**
 * @deprecated Use scripts/sync-legal-live-terms.mjs
 *
 * The old path rendered suites/v3.0/public straight into live-versions and
 * published internal approval / solicitor-review material. That directory was
 * removed; the product must consume dono-brain/legal/live-terms only.
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

console.warn(
  "render-legal-live-versions.mjs is deprecated — forwarding to sync-legal-live-terms.mjs",
);
const script = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "sync-legal-live-terms.mjs",
);
const result = spawnSync(process.execPath, [script], { stdio: "inherit" });
process.exit(result.status ?? 1);
