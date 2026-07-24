/** Signs/verifies one-click unsubscribe links for campaign update opt-ins.
 * Uses Web Crypto (not Node's `crypto` module) so this works unchanged from
 * both the "use node" sending action and the plain-runtime unsubscribe
 * httpAction. */

function getUnsubscribeSecret(): string {
  const secret = process.env.CAMPAIGN_UPDATE_UNSUBSCRIBE_SECRET;
  if (!secret) {
    throw new Error("CAMPAIGN_UPDATE_UNSUBSCRIBE_SECRET is not configured.");
  }
  return secret;
}

async function getHmacKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
}

function toBase64Url(bytes: ArrayBuffer): string {
  const binary = String.fromCharCode(...new Uint8Array(bytes));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function signUnsubscribeToken(optInId: string): Promise<string> {
  const key = await getHmacKey(getUnsubscribeSecret());
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(optInId),
  );
  return toBase64Url(signature);
}

export async function verifyUnsubscribeToken(
  optInId: string,
  token: string,
): Promise<boolean> {
  try {
    const expected = await signUnsubscribeToken(optInId);
    if (expected.length !== token.length) return false;
    let diff = 0;
    for (let i = 0; i < expected.length; i++) {
      diff |= expected.charCodeAt(i) ^ token.charCodeAt(i);
    }
    return diff === 0;
  } catch {
    return false;
  }
}
