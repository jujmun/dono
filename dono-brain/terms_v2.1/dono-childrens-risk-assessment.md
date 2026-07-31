# Dono — Children's Risk Assessment

**Prepared for:** Online Safety Act compliance file
**Service:** Dono (joindono.com) — student crowdfunding platform, Oxford launch
**Designated person (Online Safety Act):** Amrit (co-founder)
**Date:** 31 July 2026
**Status:** Draft for founder review — open items are flagged in Section 8, not glossed over

A reviewer's usual objection to a risk assessment like this is that it leans on an "18+" clause in the Terms of Service and stops there. Dono's position is stronger than that, because publishing is gated by an actual verification mechanism (Stripe Identity), not a checkbox. That said, this assessment does not treat verified publishing as solving every risk on its own — in particular, donation is deliberately open to any age with no gate at all, and that creates a genuine residual risk this document does not minimise.

---

## 1. Service description

Dono lets people run public fundraising campaigns for university-related costs (travel, kit, projects) and lets others donate to them.

- **Campaign creators**: must hold an 18+ Stripe Identity-verified account before they can publish a campaign.
- **Content in a campaign**: text, images, and video.
- **Comments**: verified 18+ account holders can post public comments under campaigns. Comments are post-moderated — they go live immediately and are removed on report, not reviewed before posting.
- **Beneficiaries**: verified as affiliated with the university or school named in the campaign ("institution verification").
- **Donors**: can donate with or without an account, of any age. Guest checkout requires no account and no age check.
- **Viewers**: campaigns are public and browsable without logging in.
- **No direct messaging**, no livestreaming, no private groups, no disappearing content, no recommendation/feed algorithm — the product surface is a public campaign list plus campaign pages, not a social feed.
- **Moderation**: every campaign is manually reviewed by a human before it is published (pre-moderation). Comments are reviewed after the fact (post-moderation), removable on report.
- **Reporting and complaints**: complaints route to a designated person (Amrit), acknowledged within 5 business days, target resolution within 30 days. Suspected CSEA content is escalated to the NCA via the same designated person. Suspected financial crime (fraud, money laundering, sanctions evasion) is escalated internally, with authorised staff able to pause or remove campaigns, ask Stripe to hold payouts, restrict accounts, and preserve evidence.

## 2. Child access assessment

**Are children likely to visit?** Yes. The service is public, unauthenticated, and campaign links are shareable — a child could reach it via search, a shared link, or social media, with no barrier at the door.

**Can they browse without logging in?** Yes, fully. Nothing prevents a child reaching any public campaign page.

**Can they donate?** Yes, and this is the point at which the design is most permissive: no age gate, and no account required at all (guest checkout). A child does not need to identify themselves as a child, an adult, or anything, to donate.

**Can they comment?** No. Posting a comment requires an 18+ verified account. A child cannot create an account capable of commenting, so cannot author a comment. They can, however, **read** comments as an unauthenticated visitor — comment content is public.

**Can they publish campaigns?** No. Campaign creation requires the same 18+ Stripe Identity verification. A child cannot pass this step, so cannot become a campaign creator.

**Conclusion:** children are excluded from every content-*authoring* role (campaigns, comments) by a real verification mechanism, not by policy wording alone. But they are not excluded from two roles that matter for this assessment: **viewer** of anything published, and **donor**. Those two roles are where the actual risk to children sits.

## 3. User journeys

**Child visitor**
1. Arrives via search, link, or social share — no login required.
2. Browses or searches public campaigns.
3. Views campaign text, images, video, and updates.
4. Reads public comments (posted only by verified adults, but visible to anyone).
5. Can donate as a guest — no account, no age check, no parental consent step.

**Adult campaign creator**
1. Creates an account and completes Stripe Identity verification (confirms 18+ and identity).
2. Institution verification confirms the beneficiary's university/school affiliation.
3. Builds a campaign (text, images, video).
4. Submits for human review.
5. On approval, campaign goes live and can receive donations and post updates.

**Adult commenter**
1. Holds the same 18+ verified account type as a creator.
2. Posts a comment on a campaign.
3. Comment is live immediately (post-moderated) — visible to all visitors, including children, before any human reviews it.
4. Comment can be reported and removed after the fact.

## 4. Harm assessment

Each harm below is assessed on: can a child encounter it, how, how likely, what controls exist, and residual risk.

### Illegal content — fraud, scams, terrorist fundraising, CSAM, hate speech
A child could encounter this only as a **viewer** of a published campaign or comment, since they cannot author either.
- *Campaigns*: every campaign is manually reviewed before publication — this is a real pre-publication control, not a post-hoc one, and it is the single strongest mitigation in the whole assessment for this category.
- *Comments*: post-moderated, so illegal content in a comment could be visible for a window before removal. The author pool is verified adults (traceable, KYC'd), which reduces the incentive for casual abuse compared with an anonymous platform, but does not prevent a determined bad actor from posting once before being caught.
- **Residual risk: Low** for campaigns (pre-moderation is a genuine gate); **Low–Medium** for comments (the post-moderation window is real, even if the author pool is small and identifiable).

### Bullying and abuse (via comments)
A child cannot be bullied by another child on Dono, because children cannot comment. The risk is a child reading abusive content directed at a campaign creator or beneficiary, or abusive exchanges between verified adults.
- Controls: reporting, moderation, ability to remove comments and, per the financial-crime/abuse escalation process, restrict the offending account.
- **Residual risk: Medium.** Post-moderation means exposure happens before removal, not instead of it. This is the most exposed part of the product for a child *viewer*, precisely because it's the one UGC surface that isn't pre-moderated.

### Self-harm or suicide content
- *Campaigns*: pre-moderated — a campaign describing or encouraging self-harm would need to pass human review, which is a strong gate.
- *Comments*: post-moderated, so a comment referencing self-harm could be visible before review.
- **Residual risk: Low** for campaigns, **Low–Medium** for comments, consistent with the pattern above.

### Eating disorder content
Same structure and reasoning as self-harm. **Residual risk: Low (campaigns) / Low–Medium (comments).**

### Pornographic content
- Prohibited by policy; campaigns are pre-moderated (text, images, and video all go through the same human review before publication).
- The video content type is worth flagging on its own: video is materially harder to review manually at scale, end to end, than a still image or a paragraph of text. A reviewer skimming a video is more likely to miss embedded content than they would in a static image.
- **Residual risk: Low**, but this rests on the review team actually watching video content in full rather than sampling it — see Section 8.

### Violence / graphic content
Same reasoning as pornographic content, with the same video caveat. **Residual risk: Low**, contingent on full video review rather than spot-checking.

### Fraud and financial exploitation of children as donors
This is the category where the "verified adult publishers" argument does the least work, because the exploitation doesn't require the child to author anything — it only requires the child to see a campaign and pay.
- A campaign creator is identity-verified, but identity verification confirms *who they are*, not that their campaign's persuasive framing is appropriate for a child audience. A verified adult could still write a campaign, comment, or update that pressures or emotionally manipulates a reader into donating.
- Donation itself has **no age gate and no account requirement** — a child can donate as a guest with no check of any kind, and no parental visibility or consent step exists in that flow.
- **Residual risk: Medium–High.** This is the most significant gap in the current design, and it is not solved by anything upstream (KYC, institution verification, pre-moderation) because none of those controls sit at the point where a child actually parts with money. It deserves dedicated treatment rather than inheriting the "verified adults" comfort from the publishing side. See Section 8 for concrete mitigations.

## 5. Risk factors (why Dono is lower risk than a typical social platform)

- All content-authoring roles (campaign creation, commenting) require a real identity-verification step, not a self-declared checkbox.
- No anonymous publishing of any kind — every campaign and comment is traceable to a verified adult.
- Institution verification adds a second layer of accountability specific to campaigns (beneficiary affiliation is checked, not just claimed).
- Every campaign is reviewed by a human before it goes live — this is a pre-publication gate, which is stronger than most platforms' post-publication moderation.
- No direct messaging, so no private one-to-one contact channel between a child and an adult user.
- No recommendation or feed algorithm surfacing content to children based on engagement.
- No livestreaming, no private groups, no disappearing content — all formats associated with the harder-to-moderate end of children's online harms are simply absent from the product.

None of this changes the donation-side risk in Section 4, which sits outside the publishing/commenting gate entirely.

## 6. Existing safety measures

Confirmed as in place:
- Stripe Identity verification for all campaign creators and commenters (confirms 18+ and identity).
- Institution verification for beneficiaries (confirms university/school affiliation).
- Mandatory human review of every campaign before publication.
- Post-publication reporting and removal for comments.
- Designated person (Amrit) for Online Safety Act complaints, with 5-business-day acknowledgement and 30-day resolution target.
- Designated person (Amrit) for CSEA reports to the NCA.
- Financial crime escalation process: authorised staff can pause or remove a campaign, ask Stripe to hold payouts, restrict an account, and preserve evidence; incidents are logged.
- Identity documents used for verification are deleted once Stripe completes KYC — not retained indefinitely.

Not yet confirmed as built, or explicitly open (do not assume these exist — see Section 8):
- A formalised refund process for donors.
- Automated content scanning (image or video) ahead of, or alongside, human review.
- Keyword or pattern detection on comments prior to post-moderation.
- Structured audit logging beyond the current shared incident spreadsheet.
- Any control specific to donation-side risk (Section 4's fraud/exploitation category).

## 7. Residual risk summary

| Harm | Residual risk | Basis |
|---|---|---|
| Illegal content in campaigns | Low | Pre-publication human review |
| Illegal content in comments | Low–Medium | Post-moderation window; verified authors |
| Bullying/abuse (comments) | Medium | Post-moderation window is the main exposed surface |
| Self-harm/suicide (campaigns) | Low | Pre-publication human review |
| Self-harm/suicide (comments) | Low–Medium | Post-moderation window |
| Eating disorders (campaigns) | Low | Pre-publication human review |
| Eating disorders (comments) | Low–Medium | Post-moderation window |
| Pornographic content | Low | Pre-publication review, contingent on full video review |
| Violent/graphic content | Low | Pre-publication review, contingent on full video review |
| Fraud/financial exploitation of child donors | **Medium–High** | No age gate or account requirement on donation; no control at point of payment |

## 8. Further improvements

Listed roughly in priority order given the residual risk table above:

1. **Donation-side controls for the highest-risk category.** Options worth considering: a lower transaction cap for guest (unauthenticated) donations; a plain-language prompt at checkout asking the donor to confirm they are 18+ or have permission from a parent/guardian to donate (this doesn't verify age, but it's a meaningfully stronger signal than silence, and costs nothing to implement); monitoring flagged or reported campaigns for language that specifically targets or appeals to children.
2. **Full-length video review**, not spot-checking, as an explicit part of the pre-publication process, given video is the format most likely to let something slip past a manual reviewer.
3. **Comment-side pre-screening** (automated keyword/pattern detection) to shrink the post-moderation exposure window described throughout Section 4, even though comments will remain post-moderated in principle.
4. **A trusted-reporter or fast-track reporting path**, so reports about content visible to children are triaged ahead of the general complaints queue rather than sharing the same 30-day target.
5. **Formalise the refund process** and **move incident logging from a shared spreadsheet to a structured audit log**, both flagged as open in Section 6 — neither is child-safety-specific, but both would strengthen the evidence base the next version of this assessment can draw on.
6. **Repeat-offender detection** for comment authors, given the author pool is small and identifiable (a real KYC record), which makes pattern-based detection more tractable here than on an anonymous platform.
