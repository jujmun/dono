/**
 * Server-side UGC moderation: blocks common profanity/slurs, CSEA terminology,
 * suicide-encouragement phrases, spam/phishing, and any URL/link (OS-09, OS-11,
 * OS-22). Dependency-free so it stays auditable. Called from engagement /
 * campaign create paths — must run server-side since client input can't be trusted.
 */

export type BlockCategory =
  | "profanity"
  | "slur"
  | "csea"
  | "suicide"
  | "spam"
  | "url";

export type BlockMatch = {
  category: BlockCategory;
  /** Pattern label for the audit log — not the full matched text. */
  matchedPattern: string;
};

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
  "fuck",
  "fucker",
  "goddamn",
  "handjob",
  "hell",
  "jerkoff",
  "jizz",
  "motherfucker",
  "piss",
  "prick",
  "pussy",
  "shit",
  "slut",
  "tit",
  "titty",
  "twat",
  "wank",
  "wanker",
  "whore",
];

/** Racial / religious / homophobic / sexist slurs (CG 6.3(a)). */
const SLUR_WORDS = [
  "dyke",
  "fag",
  "faggot",
  "nigger",
  "nigga",
  "retard",
  "spic",
  "kike",
  "chink",
  "tranny",
  "paki",
];

/**
 * Obvious CSEA terminology — short configurable list of unambiguous phrases.
 * Keep this narrow to avoid false positives on legitimate safeguarding discussion.
 */
const CSEA_PHRASES = [
  "child porn",
  "childporn",
  "cp collection",
  "underage porn",
  "pedo porn",
  "paedo porn",
  "loli porn",
  "preteen nude",
];

/** Obvious suicide-encouragement / method-instruction phrases. */
const SUICIDE_PHRASES = [
  "kill yourself",
  "kys now",
  "you should die",
  "how to suicide",
  "suicide method",
  "best way to hang yourself",
  "how to overdose",
];

/** Common spam / phishing bait. */
const SPAM_PHRASES = [
  "click here to claim",
  "free gift card",
  "crypto airdrop",
  "send bitcoin",
  "wire transfer now",
  "verify your account at",
  "you have won a prize",
  "nigerian prince",
  "double your money",
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

const SLUR_PATTERNS = SLUR_WORDS.map(
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

function findPhraseMatch(
  normalized: string,
  phrases: readonly string[],
  category: BlockCategory,
): BlockMatch | null {
  for (const phrase of phrases) {
    if (normalized.includes(phrase)) {
      return { category, matchedPattern: phrase };
    }
  }
  return null;
}

/**
 * Returns the first matching blocked category, or null if the text is clean.
 * Order: URL → CSEA → suicide → slur → spam → profanity (highest harm first).
 */
export function findBlockedContent(text: string): BlockMatch | null {
  if (containsUrl(text)) {
    return { category: "url", matchedPattern: "url" };
  }

  const normalized = normalize(text);

  const csea = findPhraseMatch(normalized, CSEA_PHRASES, "csea");
  if (csea) return csea;

  const suicide = findPhraseMatch(normalized, SUICIDE_PHRASES, "suicide");
  if (suicide) return suicide;

  for (const pattern of SLUR_PATTERNS) {
    if (pattern.test(normalized)) {
      return { category: "slur", matchedPattern: pattern.source };
    }
  }

  const spam = findPhraseMatch(normalized, SPAM_PHRASES, "spam");
  if (spam) return spam;

  for (const pattern of PROFANITY_PATTERNS) {
    if (pattern.test(normalized)) {
      return { category: "profanity", matchedPattern: pattern.source };
    }
  }

  return null;
}

export function containsBlockedContent(text: string): boolean {
  return findBlockedContent(text) !== null;
}
