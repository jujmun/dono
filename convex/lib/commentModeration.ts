/**
 * Server-side comment moderation: blocks common profanity and any comment
 * containing a URL/link. Dependency-free so it stays auditable — no external
 * wordlist package. Called from convex/engagement.ts (addComment/editComment);
 * must run server-side since client input can't be trusted.
 */

// Base forms only — normalize() + the suffix pattern in containsProfanity
// catch plurals/tense variants (e.g. "ass" also matches "asses").
const PROFANITY_WORDS = [
  "arse",
  "ass",
  "asshole",
  "bastard",
  "bitch",
  "bollock",
  "bullshit",
  "cock",
  "crap",
  "cunt",
  "damn",
  "dick",
  "dickhead",
  "douche",
  "dyke",
  "fag",
  "faggot",
  "fuck",
  "fucker",
  "goddamn",
  "handjob",
  "hell",
  "jerkoff",
  "jizz",
  "motherfucker",
  "nigger",
  "nigga",
  "piss",
  "prick",
  "pussy",
  "retard",
  "shit",
  "slut",
  "spic",
  "tit",
  "titty",
  "twat",
  "wank",
  "wanker",
  "whore",
];

// Common leetspeak substitutions, applied before matching so "sh1t" / "a$$"
// still get caught.
const LEETSPEAK_MAP: Record<string, string> = {
  "0": "o",
  "1": "i",
  "3": "e",
  "4": "a",
  "5": "s",
  "7": "t",
  "@": "a",
  $: "s",
};

function normalize(text: string): string {
  let result = text.toLowerCase();
  for (const [from, to] of Object.entries(LEETSPEAK_MAP)) {
    result = result.split(from).join(to);
  }
  return result;
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const PROFANITY_PATTERNS = PROFANITY_WORDS.map(
  (word) => new RegExp(`\\b${escapeRegExp(word)}(?:s|es|ed|ing|er)?\\b`, "i"),
);

/** Whole-word match only (avoids the "Scunthorpe problem" of flagging
 * innocuous words that merely contain a banned substring, e.g. "class"). */
export function containsProfanity(text: string): boolean {
  const normalized = normalize(text);
  return PROFANITY_PATTERNS.some((pattern) => pattern.test(normalized));
}

// Matches http(s)://..., www.___, or a bare domain-looking token
// (label.label.tld[/path]) with a letters-only TLD of 2+ chars, so plain
// sentence punctuation ("Good. Thanks!") and numbers ("3.14") don't match.
const URL_PATTERN =
  /(?:https?:\/\/|www\.)\S+|\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}(?:\/\S*)?\b/i;

export function containsUrl(text: string): boolean {
  return URL_PATTERN.test(text);
}
