/**
 * Simple boolean feature flags. No existing flag/config-toggle convention
 * was found in this codebase (checked env vars, app.json extras, remote
 * config) — this file is the source of truth until one exists.
 *
 * Flip a flag to true locally to test a gated feature; leave it false to
 * merge without activating it in production.
 */

/** Campaign page templates: the picker in the campaign-creation Review step,
 * and template-driven accent/layout on the published campaign page. */
export const ENABLE_CAMPAIGN_TEMPLATES = false;
