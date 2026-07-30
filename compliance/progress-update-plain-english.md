# Dono — Where Things Stand (Plain-English Update)

*Covers the two rounds of work done so far ("Session A" and "Session B"). For the full technical detail, see `v2.1-gap-analysis.md` in this same folder — this document is the short, readable version.*

---

## The short version

We fixed a handful of real problems in how donations and refunds work. The app is in better shape than it was, but it is **not ready to take real donations yet** — a few things the requirements list says must exist before real money moves are still missing, and none of them are things we can code our way past. They need a decision from you (or from a lawyer).

---

## What we fixed — Round 1 (Session A)

These were small, self-contained fixes to the donation checkout screen:

- **The "cover our fees" tickbox was on by default.** That meant, unless a donor noticed and unticked it, they were quietly paying more than they meant to so the campaign received the full amount. It now starts unticked, which is what the rules require.
- **The checkout screen now shows a full breakdown** before you pay: your donation, our fee, the card-processing fee, the total you're charged, and how much actually reaches the campaign. Before, donors only saw a total.
- **Added a real "hide my name" option.** The back-end already correctly hid a donor's name from the campaign organiser (not just the public) — it just had no button to turn it on. Now there's a checkbox for it.
- **Campaign owners can now opt in (or out, any time) to letting us use their campaign photos/updates in our own marketing.** This didn't exist before at all.
- **Turned on the "leftover money" refund logic.** If a campaign raises more than it ends up needing, there's a rule that the most recent donors get refunded first, working backwards until the extra money is used up. That logic existed in the code already but was never actually switched on — it now runs automatically when a campaign owner posts their final spending update. It still requires a staff member to approve each refund before anything happens — this doesn't auto-refund money on its own.
- **Found and fixed a broken "Pay" button on the web checkout** that wasn't part of what we were asked to fix, but it meant the web donation flow was throwing an error and wouldn't work at all. Worth flagging since it's a big deal even though it was already broken before we started.

## What we fixed — Round 2 (Session B): how refunds actually happen

This one needs a bit more explanation because it was a real conflict, not just a bug.

**The problem:** The code had our system reach into a campaign's Stripe account and issue refunds directly, automatically, once a staff member approved a refund request. But the finalised Refund Policy says something different: *the campaign owner should refund the money themselves, from their own Stripe account* — we should only be the ones deciding a refund is owed, not the ones pressing the button. The reason this matters: if we're the ones actually moving money out of someone else's account, that starts to look less like "we run a website" and more like "we're a payments company," which is a different, more heavily regulated thing to be. The legal document itself flagged this exact issue and said it needed a lawyer's opinion before going live either way.

**What we did:** Rather than guess, we asked you which way to go. You chose to make the code match the policy. So now:

- When a staff member approves a refund, we no longer touch Stripe ourselves.
- Instead, the campaign owner gets an email and an in-app notification telling them a refund was approved and asking them to process it from their own Stripe account, with the payment details they need to find it.
- Once they do that, our system automatically notices (via Stripe) and marks the refund as complete — no manual double-checking needed on that part.
- We also added proper automated tests for this whole area, since there were none before. If someone breaks this in the future, tests will catch it before it reaches donors' money.

**One thing we did not fix**, on purpose, because it's a separate question: the policy also says *who's at fault* should decide who eats our fee on a refund (e.g. if the campaign owner made a mistake, we should give the donor our fee back rather than keep it). The code doesn't do that fault-based split yet — it treats every refund the same way. That's a real gap, just not the one we were asked to close this round.

---

## What still needs to happen before real donations should go live

Four things stand out as genuinely important, and all four need a decision from you or from a lawyer — none of them are things engineering can just build without that input:

1. **The legal documents people are agreeing to are marked as drafts.** Literally — the Terms and Privacy pages currently shown to users say "not for publication" on them. Every "I agree" click captured while that's true is agreeing to something that says it isn't final yet. This needs real, finished legal documents before it matters.

2. **There's no actual age check.** Right now, every donor is automatically treated as "confirmed 18+" regardless of who they really are — there's no real prompt or check behind it. Since the terms require donors to be adults, this is worth fixing even with something simple, before real money is involved.

3. **Student verification doesn't exist yet.** The idea that Dono checks a student's ID card isn't built at all — no upload, no check, nothing. If any part of the app currently claims students are "verified" in that sense, that claim isn't backed by anything real yet.

4. **We don't know if we're charging the fee we're supposed to.** The requirements document says our fee should be "Stripe's real cost + 3.5%, plus 2% only for foreign cards." What the code actually charges is a flat 5% + 20p, which is a different formula. We need to know which one is actually correct before either "fixing" the code or updating the requirements — right now we genuinely don't know which is the real, current number.

## Smaller things, lower urgency

- The part of the system that listens for messages from Stripe (refunds, disputes, etc.) works, but doesn't have automated tests checking that Stripe's messages are being read correctly — only the logic that happens after does. Worth doing eventually, not urgent.
- A handful of features from the original requirements list simply haven't been built yet (things like: letting a campaign show updates over time with a proper history, a formal "closing statement" when a campaign wraps up, cookie consent controls, stronger reporting/moderation tools). None of these are on fire, but they're on the list for later rounds of work.

## Decisions we're waiting on from you

- Which legal/config document is the real, current source of truth (we used a stand-in file since the one named in the original brief doesn't exist in the project).
- Which fee number is correct: 3.5% or the current 5%+20p.
- How long a campaign owner should be given to actually process an approved refund once we tell them about it (the policy just says "promptly," with no specific number of days).
- What the "leftover money" refund threshold should be — right now it's set to refund everything, with no minimum amount below which we don't bother.
- Whether the missing student-card verification (point 3 above) is genuinely meant to be built, or intentionally left out of the first version of the product.
