# Dono — Engineering questions to answer before the Terms can be finalised

**For:** the Dono engineering team
**Purpose:** the revised Terms (v2.1) still contain **[CONFIRM WITH ENGINEERING]** markers. We cannot publish an accurate, honest T&C suite until we know how the current stack actually works. Please answer as specifically as possible — "how it is today", not "how it might be". Where a feature isn't built yet, say **NOT BUILT** and give the plan/ETA. One-word or "typically" answers aren't enough; a wrong cookie table or security claim can be checked by anyone in seconds.

Use the checkboxes/blanks. If an answer is "it depends", state on what.

---

## A. Architecture & hosting (Privacy Notice §8, §14)

A1. What is the **hosting provider** and region(s) for the web app and API? ________
A2. What is the **database/backend** platform (the draft guessed Convex — confirm or correct), and in which country is data stored? ________
A3. Where are **file uploads** (student-card images before deletion, receipts) stored — which provider, which region, and is the bucket private by default? ________
A4. Which **authentication** provider/library is used (e.g. Clerk, Auth0, Supabase Auth, custom)? ________
A5. Which **transactional email** provider sends receipts and service messages? ________
A6. Do we use an **analytics** tool today? If yes, which, and is it first-party/self-hosted or third-party? If none, confirm "none yet". ________
A7. Which **error-monitoring** tool (if any) receives logs, and could those logs contain personal data (IPs, emails, request bodies)? ________
A8. For every provider above: is a signed **Data Processing Agreement** in place, and does any of them store or process data **outside the UK**? List each with its transfer mechanism (adequacy / IDTA / UK Addendum). ________

## B. Accounts & authentication (ToS §5, §6; Verification §4.3)

B1. Exactly how are passwords/credentials handled — hashed (which algorithm) or delegated to the auth provider? ________
B2. Is there MFA, session expiry, and account-lockout on suspicious login? What session/persistent cookies or tokens does auth set (name, lifespan, first/third party)? ________
B3. Does the Stripe onboarding flow **return a reliable age/date-of-birth signal** to us for every onboarding path? If not, what age check can we implement instead? ________
B4. Can a single person currently create multiple accounts, and do we detect it? ________

## C. Payment-data handling (ToS §15.6; Privacy §5)

C1. Is checkout implemented with Stripe Elements / Checkout / Payment Element such that **full card numbers and CVCs never reach our servers**? Confirm the exact integration. ________
C2. Precisely which fields do we receive/store from Stripe (amount, status, brand, last4, expiry, billing details)? List the actual stored fields. ________
C3. Is any cardholder data ever logged (in error monitors, request logs, analytics)? How is that prevented? ________

## D. Acceptance records & versioning (ToS §2.2, §1.5)

D1. Do we currently capture an acceptance record at each step (user, role, campaign, document names + **version numbers**, timestamp, wording shown)? If not, what exists today? ________
D2. Can we store and serve **immutable historical versions** of each legal document, tied to the acceptance event? ________
D3. Can we deliver a **durable copy** (email/download) of the exact terms a user accepted? ________

## E. Campaign, evidence & closure workflows (ToS §10; Refund §11)

E1. Does the campaign page keep a **versioned snapshot** as shown at the time of each donation? ________
E2. How are receipts uploaded and stored, who can view them, and is access logged? Can an admin **redact/remove** parts of an uploaded file? ________
E3. Is there any redaction check on upload, or is it entirely manual by the uploader today? ________
E4. Is the Closure Statement a structured form (fields) or free text? Can we enforce deadlines, a review timer, and a **deemed-acceptance** state after 30 days? ________

## F. Refunds, disputes & payouts (Refund §6–9; ToS §15)

F1. Today, can an admin trigger anything on a Campaign Owner's Connected Account, or is all refund action performed by the owner in their own Stripe dashboard? (The Terms now say owner-only — confirm the code matches.) ________
F2. Can we programmatically **refund Dono's own application fee** as a separate step after the owner's charge refund, including proportionally for partial refunds? ________
F3. Can we **withhold/hold a payout** that hasn't been released yet for a specific Recipient? ________
F4. How are chargeback/dispute webhooks handled today, and who is notified within the card-scheme deadline? ________

## G. Data retention & deletion (Privacy §6, §7)

G1. Is there an automated job that **deletes the student-card image** after a successful check (and 30-day cleanup for failed/abandoned)? If not, how is deletion done today? ________
G2. When a user is deleted or data is erased, does deletion **propagate to backups**, and what is the backup cycle/retention? ________
G3. Can we apply a **legal hold** that suspends automated deletion for specific records? ________
G4. Are the retention periods in the Privacy Notice table technically enforceable today, or aspirational? Flag any that aren't. ________

## H. Cookies, analytics & consent (Cookie Notice §4–5)

H1. Load the site in a clean browser and list **every** cookie and every local/session-storage item: name, set-by, purpose, first/third party, expiry. ________
H2. Is there a **consent management** tool? If not, what's the plan before any non-essential cookie is set? ________
H3. If analytics exist, can we implement a **working "turn off analytics"** control that genuinely stops collection (not just hides a banner)? ________
H4. What does the mobile app (if any) store on-device, and does it embed any analytics SDK? ________

## I. Security & incident response (Privacy §14)

I1. Confirm exactly which of these are **true today**: encryption in transit; encryption at rest; role-based access control; admin-access logging on identity data. For any not yet true, say so — we must not claim it. ________
I2. Is there a written, tested **incident-response** procedure and a named responsible person? ________
I3. How would we detect and, within 72 hours where required, assess a personal-data breach? ________

## J. What is actually built vs planned (operational readiness — ToS §80 of the review)

J1. Please mark each of these **BUILT / PARTIAL / NOT BUILT** with a note: reporting tools; moderation queue + audit log; appeals routing; reminder emails; evidence-status display; institution contact channel; consent banner; DSAR/complaints handling; account closure/offboarding.
J2. Which promises in the Terms can the **current** product deliver consistently, and which cannot? List anything we should soften or remove before publication.
