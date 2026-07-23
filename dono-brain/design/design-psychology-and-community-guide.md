# Dono Design Strategy

## Psychological, Community and Donation Design Recommendations

**Document purpose:** Product and design guidance for Dono  
**Audience:** Founders, product designers, software engineers and campaign moderators  
**Status:** Recommended product direction  
**Last updated:** 23 July 2026

---

## 1. Executive summary

Dono should be designed as a **community participation platform that facilitates donations**, not as a payment form with social-media features added around it.

The central psychological proposition should be:

> **People like me, in a community I belong to, are working together to make a specific good thing happen — and my contribution visibly helps.**

The product should optimise for five feelings, in this order:

1. **Trust** — “This campaign is legitimate, clear and safe.”
2. **Belonging** — “This is part of my community.”
3. **Agency** — “I can choose whether, how and how publicly to help.”
4. **Collective efficacy** — “Together, we can realistically achieve this.”
5. **Recognition** — “My contribution matters, whether or not I display it.”

The recommended brand personality is:

> **Optimistic, not childish. Reassuring, not corporate. Energetic around collective action, quiet around money.**

Dono should not feel like:

- a casino;
- a shopping checkout;
- a guilt-driven charity advert;
- a social-status leaderboard;
- a popularity contest between people in need;
- or an infinite feed designed to maximise screen time.

It should feel like:

- a trusted community noticeboard;
- a transparent shared project;
- a record of collective accomplishment;
- and a calm, modern platform through which communities help themselves.

### The most important product decisions

Dono should:

- organise discovery primarily around **real communities**, not global virality;
- make the **campaign organiser, purpose, budget, verification and next steps** immediately clear;
- show **progress and participation**, but avoid pressuring users through false urgency or public comparison;
- offer **suggested donation amounts** without making any one amount feel compulsory;
- give donors separate control over whether their **name, amount and message** are visible;
- make updates and evidence of delivery central to the product;
- reward **participation and follow-through**, not wealth or frequency of spending;
- use community recognition carefully and never rank donors by money given;
- keep Dono’s fees and payment consequences visible before confirmation;
- make privacy-preserving choices the easiest choices;
- and treat accessibility, dignity and informed consent as core product quality.

---

## 2. Dono’s existing product direction

This guide builds on the following decisions already made for Dono:

- Dono is intended as **community infrastructure for transparent university giving**.
- Core communities may include colleges, societies, departments, sports clubs, student groups and other defined communities.
- Campaigns should generally concern specific, achievable and comparatively low-cost goals.
- Controversial or inappropriate campaigns should be excluded.
- Verification may involve institutions, societies or other trusted community organisations.
- Community validation may include likes, follows and visible participation.
- Donors may receive campaign updates and retain a history of their impact.
- Longer-term ideas include:
  - community funds;
  - matching;
  - pooled giving;
  - following communities;
  - friend activity;
  - visible giving;
  - donor summaries or “Dono Wrapped”;
  - and friendly community competition.
- The current preferred visual direction is a green-led identity:
  - **Primary green:** `#168456`
  - **Dark green:** `#126E49`
  - **Soft eucalyptus:** `#69A984`
  - **Pale green:** `#E8F5EE`
  - **Primary text:** `#17211B`
  - **Secondary text:** `#56615A`
  - **Page background:** `#F7FAF8`
  - **Cards:** `#FFFFFF`
  - **Borders:** `#DDE6E0`
- A previous marigold secondary colour was rejected because it felt too disconnected from the green system.

These are coherent foundations. The main design challenge is now to ensure that the social and behavioural features strengthen community without becoming manipulative, exclusionary or status-driven.

---

## 3. The psychological model behind a donation

A potential donor is likely to be resolving six questions, consciously or unconsciously:

1. **Who is asking?**
2. **Why should I trust them?**
3. **What exactly will happen with the money?**
4. **Why does this matter to me or my community?**
5. **Will my contribution make a meaningful difference?**
6. **What happens after I donate?**

Every important Dono screen should reduce uncertainty around at least one of these questions.

A weak fundraising experience asks the user to feel first and understand later. A strong Dono experience should help the user **understand, identify, trust and then act**.

### 3.1 The desired behavioural sequence

The ideal journey is:

> **Recognition → relevance → trust → efficacy → voluntary action → acknowledgement → continued connection**

This means:

- **Recognition:** the user sees a familiar community, organiser or cause.
- **Relevance:** the need is connected to something they value.
- **Trust:** verification, budget and accountability reduce risk.
- **Efficacy:** the user can see that collective contributions can achieve the goal.
- **Voluntary action:** the donation interface supports rather than pressures.
- **Acknowledgement:** the user immediately sees that their contribution was received and mattered.
- **Continued connection:** updates transform a transaction into a relationship.

The product should not optimise exclusively for conversion at the donation screen. It should optimise for **trustworthy repeat participation across the full campaign lifecycle**.

---

## 4. What the research suggests

### 4.1 Social identity and belonging

Research across charitable giving indicates a meaningful positive relationship between social identification and giving. A 2025 systematic review and meta-analysis reported a positive association between social identification and charitable giving across decades of research.[R1] Experimental work also suggests that strengthened group identity can increase group-based donations.[R2]

#### Product interpretation

Dono’s strongest differentiation is not simply that it allows students to donate. It is that it can make giving feel like a normal act of membership within a real community.

The interface should therefore use language such as:

- “Help St Peter’s reach the goal”
- “Back a project from your community”
- “42 members of this community have contributed”
- “Made possible by members, alumni and friends”
- “Your communities”

It should avoid language that defines the community narrowly or implies that only donors are true members.

#### Important ethical limit

Belonging can become coercion. Research on social influence suggests that higher visible contribution norms may increase donations through perceived pressure rather than voluntary altruism.[R3]

The product must communicate:

> **Participation is welcomed; donation is never the price of belonging.**

Users should be able to support a campaign by following, sharing, volunteering, contributing ideas or leaving encouragement. Money should be one form of community contribution, not the only recognised form.

---

### 4.2 Social proof and donation norms

Online fundraising research has found sizeable peer effects. One study reported that a £10 increase in the mean of previous donations was associated with an average £2.50 increase in the next donation.[R4]

This demonstrates that visible contribution information can influence the amount people perceive as normal.

#### Product interpretation

Dono may use social proof, but it should use **participation-centred social proof** more prominently than **amount-centred social proof**.

Prefer:

- “38 people have contributed”
- “12 new supporters this week”
- “Members from six groups are taking part”
- “This campaign is 72% funded”
- “£180 remains”

Use cautiously:

- the average contribution;
- exact recent donation amounts;
- “most people give £X”;
- or a feed dominated by large gifts.

Avoid:

- “Your friends donated more than you”
- “You are below the community average”
- “Top donor”
- public wealth-based rankings;
- or notifications that expose another person’s donation without explicit permission.

#### Recommended social-proof hierarchy

1. **Number of participants**
2. **Progress towards a defined outcome**
3. **Breadth of community participation**
4. **Recent momentum**
5. **Individual names, where opted in**
6. **Exact amounts, only where opted in and genuinely useful**

This order creates momentum while reducing the risk that users interpret a large amount as the minimum acceptable contribution.

---

### 4.3 Seed support and momentum

Field research on charitable fundraising has found that publicly announced seed funding can increase participation and total contributions.[R5]

A campaign with no support may look untrusted or socially risky, even when it is legitimate. Early momentum can therefore make a meaningful difference.

#### Product interpretation

Dono should not simply publish every campaign into a global feed at £0.

Instead, the creator flow should encourage a **quiet launch**:

1. complete verification;
2. secure the first few supporters;
3. ask the organising committee or close community to contribute or endorse;
4. publish the first update;
5. then launch more broadly.

Useful launch states might include:

- **Preparing**
- **Community preview**
- **Live**
- **Goal reached**
- **Delivering**
- **Completed**
- **Closed or refunded**

The platform should distinguish honestly between:

- money already donated;
- confirmed matching;
- pledged but not captured funding;
- institutionally committed support;
- and the remaining public target.

Never simulate momentum with fake donors, fabricated activity or platform-funded contributions that are not clearly identified.

---

### 4.4 Progress and collective efficacy

Progress bars make a collective target legible. The user can see that others are participating and that a finite result is possible.

However, progress framing should change over the campaign lifecycle:

- At the beginning, emphasise **who has already backed the campaign** and why it is credible.
- In the middle, emphasise **momentum, milestones and the next achievable step**.
- Near the end, emphasise **the specific remaining gap**.
- After the goal, emphasise **delivery rather than continued accumulation**.

#### Recommended progress presentation

Show:

- amount raised;
- target;
- percentage;
- number of contributors;
- time remaining, only when the deadline is real;
- next funding milestone;
- and what the current amount enables.

Example:

> **£820 of £1,000 raised by 46 people**  
> £180 remains to fund the final two equipment sets.

#### Avoid

- artificially accelerating progress animations;
- red countdown clocks for ordinary campaigns;
- “Only X minutes left” unless literally true and materially relevant;
- ambiguous targets that move upwards after the campaign succeeds;
- celebrating money raised without explaining what happens next;
- or leaving a completed campaign in an indefinite “fundraising” state.

### Goal changes

Campaign targets should not be silently changed.

A changed target should display:

- the previous target;
- the new target;
- the reason;
- the date of the change;
- how existing donations will be used;
- and whether donors have any refund or cancellation rights.

---

### 4.5 Concrete impact and “unit asking”

Concrete impact can make an abstract amount easier to understand. Research on identified beneficiaries and unit-based framing suggests that the way a single unit is described can influence giving.[R6–R8]

#### Product interpretation

Use contribution equivalents only when they are:

- accurate;
- attributable to a real budget;
- understandable;
- and not misleadingly precise.

Good examples:

- “£12 covers one reusable event sign”
- “£30 funds one first-aid kit”
- “£75 covers one of four room-hire blocks”
- “Every £250 unlocks the next stage of the project”

Weak examples:

- “£5 changes a life”
- “£10 makes everything possible”
- “A coffee could save this campaign”
- or any equivalent that cannot be traced to the budget.

#### Avoid downward anchoring

If the smallest “unit” is very cheap, it may unintentionally suggest that a small gift is the expected amount. Present multiple accurate levels rather than one artificially low anchor.

For example:

- £5 — joins the community effort;
- £12 — funds one specific unit;
- £25 — funds two units;
- custom amount.

The first option should not imply that a user giving less is inadequate.

---

### 4.6 Recognition, signalling and anonymity

Public recognition can encourage giving, including through social-image motives.[R9] Yet recognition does not help everyone. Research also indicates that visibility can discourage people who prefer private, self-directed giving, and anonymous giving is a normal feature of crowdfunding.[R10–R11]

#### Product interpretation

Donors should control three separate settings:

1. **Show my name**
2. **Show my donation amount**
3. **Show my message**

These must not be combined into a single all-or-nothing “anonymous” switch.

Recommended defaults:

- Name visibility: **private or clearly chosen at donation**
- Amount visibility: **private**
- Message visibility: **private until the user writes and submits one**
- Profile donation history: **private by default**
- Appearance in public activity feeds: **off by default unless explicitly chosen**

The confirmation page can ask:

> **How would you like this contribution to appear?**

Options:

- Name and amount
- Name only
- Anonymous
- Customise visibility

The interface must give all choices comparable prominence.

#### Recognition design

Recognise:

- participation;
- consistency of community involvement;
- volunteering;
- campaign creation;
- project completion;
- useful updates;
- and collective milestones.

Do not publicly rank:

- lifetime amount given;
- largest single contribution;
- personal donation frequency;
- or “generosity scores”.

Publicly rewarding wealth would weaken community cohesion, embarrass people with fewer resources and shift the platform from solidarity to status competition.

---

### 4.7 Warm glow and donor benefit

Charitable action can be motivated partly by the positive feeling associated with helping. Large-scale experimental work suggests that appeals to the benefit experienced by the donor can affect giving, although effects depend on context.[R12]

#### Product interpretation

It is reasonable for Dono to make giving feel satisfying. The design should celebrate completion with:

- a clear confirmation;
- a warm but restrained animation;
- a personalised statement of contribution;
- a visible update to campaign progress;
- and an invitation to follow the outcome.

Example:

> **You helped move this project to 74%.**  
> We will let you know when the organiser posts the next update.

Avoid exaggerated praise such as:

- “You are a hero”
- “You saved them”
- “Best donor”
- or emotional rewards that grow with the amount given.

The emotional reward should come from **connection and impact**, not from a game-like display of spending.

---

### 4.8 Stories, identifiable beneficiaries and dignity

Specific stories can make a problem easier to understand than abstract statistics. Meta-analytic and field evidence supports a modest identifiable-person effect in some fundraising contexts.[R6–R8]

However, this creates ethical risks:

- private hardship may become public content;
- people may be pressured to disclose trauma;
- the most visually compelling campaign may outperform the most important;
- and beneficiaries may lose dignity or control over their own story.

#### Product interpretation

Campaign narratives should follow a **dignity-first structure**:

1. What the community wants to achieve
2. Why it matters
3. Who benefits, with consent
4. The concrete plan
5. The budget
6. What success looks like
7. How progress will be reported

Use photographs of real organisers, projects or places where appropriate. Do not pressure creators to use images of distress.

Dono should provide guidance such as:

> Tell people enough to understand the need, but do not share sensitive information that is unnecessary for the campaign.

For campaigns involving an individual beneficiary, require confirmation that:

- the person has consented to the campaign;
- they understand what information will be public;
- images and names may be removed later;
- and the organiser has authority to receive or direct the funds.

---

### 4.9 Transparency and trust

Official fundraising guidance stresses fair treatment, informed decisions and clarity about fees. The current UK Code of Fundraising Practice requires online platforms to explain fees and how voluntary tips may be changed or removed.[R13–R16]

Research also associates perceived financial transparency with donor trust.[R17]

#### Product interpretation

Trust information should not be confined to legal pages.

Every campaign page should show:

- who created the campaign;
- who receives the money;
- verification status and what it means;
- the amount requested;
- a budget;
- campaign deadline, if any;
- platform and payment fees;
- refund and cancellation approach;
- reporting expectations;
- risks or dependencies;
- and how to report a concern.

The donation screen should show, before confirmation:

- donation amount;
- Dono fee or voluntary platform contribution;
- payment-processing consequences where relevant;
- total charged;
- recipient;
- whether the donation is refundable;
- whether Gift Aid or tax relief applies;
- and how the user’s name and amount will appear.

#### Verification language

Do not use one vague “Verified” badge.

Use specific badges such as:

- **Identity checked**
- **Student status checked**
- **Society confirmed**
- **Institutional endorsement**
- **Recipient account checked**
- **Budget reviewed**
- **Completed campaigns: 3**

Each badge should open a plain-language explanation of:

- what was checked;
- who checked it;
- when;
- what was not checked;
- and whether it expires.

A badge must never imply that Dono guarantees the campaign outcome unless Dono genuinely does so.

---

## 5. The central design principle: collective progress without pressure

Dono’s design should use behavioural insight to **reduce friction and uncertainty**, not to exploit cognitive bias.

### Ethical behaviour design

Good behavioural design:

- makes information easier to understand;
- helps users find relevant communities;
- reminds users of actions they chose;
- makes privacy controls visible;
- supports realistic suggested amounts;
- clarifies consequences;
- and makes collective progress legible.

Manipulative behavioural design:

- creates false urgency;
- hides fees;
- defaults users into recurring donations;
- makes declining visually difficult;
- repeatedly interrupts non-donors;
- exposes donations by default;
- exploits guilt;
- or makes cancellation more difficult than sign-up.

The Competition and Markets Authority defines harmful online choice architecture as design that can coerce, steer or deceive people into unintended or harmful decisions.[R18–R20]

Dono should adopt an internal rule:

> **A design is unacceptable when it raises conversion primarily by weakening informed, voluntary choice.**

---

## 6. Brand and visual identity

### 6.1 Recommended visual character

The visual system should communicate:

- trust;
- freshness;
- growth;
- approachability;
- community;
- and modern financial competence.

It should avoid:

- institutional navy-and-grey stiffness;
- hyperactive social-app styling;
- excessive gradients;
- confetti everywhere;
- cartoonish financial imagery;
- or luxury-fintech minimalism that makes small contributions feel insignificant.

### 6.2 Colour system

#### Core palette

| Role | Colour | Hex | Recommended use |
|---|---|---:|---|
| Primary | Dono green | `#168456` | Primary buttons, active navigation, progress, key links |
| Primary dark | Deep green | `#126E49` | Hover states, high-emphasis headings, dark surfaces |
| Secondary | Soft eucalyptus | `#69A984` | Illustrations, charts, tags and decorative accents |
| Highlight | Pale green | `#E8F5EE` | Success panels, selected cards, low-emphasis backgrounds |
| Primary text | Ink green | `#17211B` | Body copy and headings |
| Secondary text | Slate green | `#56615A` | Metadata and supporting copy |
| Page background | Off-white | `#F7FAF8` | Main app background |
| Card | White | `#FFFFFF` | Cards, modals and form surfaces |
| Border | Mist green | `#DDE6E0` | Dividers and low-emphasis borders |

#### Contrast findings

Using WCAG contrast calculations:

- `#168456` on white: approximately **4.70:1** — suitable for ordinary text at AA, but with little margin.
- `#126E49` on white: approximately **6.26:1** — stronger for text and high-emphasis controls.
- `#69A984` on white: approximately **2.76:1** — not suitable for ordinary text.
- `#69A984` with `#17211B`: approximately **5.99:1** — suitable when dark text is placed on the eucalyptus background.
- `#17211B` on white: approximately **16.54:1** — excellent.
- `#56615A` on white: approximately **6.46:1** — suitable for ordinary text.
- `#168456` on `#E8F5EE`: approximately **4.19:1** — insufficient for ordinary text at AA.

WCAG 2.2 requires at least 4.5:1 for normal text and 3:1 for large text.[R21]

#### Colour rules

- Use white text on `#168456` only for sufficiently large, medium-weight button labels and test across displays.
- Prefer `#126E49` for small white-on-green text.
- Never use `#69A984` as small text on white.
- Use `#69A984` primarily as:
  - a background tint;
  - a chart segment;
  - an illustration colour;
  - a non-text icon accent;
  - or a decorative surface with dark text.
- Never communicate success, risk, verification or error through colour alone.
- Add icons and words:
  - “Verified”
  - “Action needed”
  - “Goal reached”
  - “Refund pending”
- Introduce a restrained warning/error palette for system states. It should be functionally distinct from the brand palette rather than forced into green.

### 6.3 Typography

Use a humanist sans-serif with:

- open letterforms;
- strong differentiation between similar characters;
- comfortable x-height;
- good numeral rendering;
- and full support for accessibility and international names.

Recommended characteristics:

- Body: 16–18 px
- Line height: 1.45–1.65
- Maximum reading width: approximately 60–75 characters
- Donation totals: tabular numerals
- No ultra-light weights
- No all-capital body labels
- Sentence case for buttons and headings

Suggested hierarchy:

- Display: campaign outcome or community message
- H1: page purpose
- H2: section
- H3: component heading
- Body: explanatory copy
- Meta: timestamps, organiser information and secondary context

Money should not always be the largest typography on the campaign page. The **outcome** should lead; the amount should support it.

### 6.4 Shape and spacing

Recommended:

- moderately rounded cards and controls;
- generous white space;
- clear card boundaries;
- one main action per screen;
- consistent 8-point spacing system;
- and minimum touch targets of at least 44 × 44 CSS pixels as an internal standard.

WCAG 2.2 sets a 24 × 24 CSS pixel Level AA minimum in many cases; a larger internal standard is preferable for mobile comfort.[R22]

Avoid:

- pill shapes for every component;
- excessive shadows;
- dense dashboards;
- cramped campaign cards;
- and low-contrast border-only input fields.

### 6.5 Illustration and photography

Use imagery to convey:

- the people organising;
- the community involved;
- the intended outcome;
- progress being made;
- and the completed result.

Prefer:

- natural, candid photographs;
- contextual group imagery;
- real locations;
- project materials;
- and images showing agency.

Avoid:

- generic stock photography of “happy students”;
- staged cheque handovers;
- distress imagery;
- exaggerated before-and-after visuals;
- or images that reveal sensitive personal information.

Campaign images should be cropped consistently, but creators should be able to set a focal point so faces and important objects are not automatically cut off.

---

## 7. Information architecture

### 7.1 Recommended primary navigation

For donors:

1. **Home**
2. **Communities**
3. **Activity**
4. **My impact**
5. **Profile**

A central **Create campaign** action may be shown to eligible users.

For organisers, a switch or dedicated dashboard may add:

- Campaigns
- Updates
- Supporters
- Funds
- Tasks
- Verification

### 7.2 Home should answer “What matters to me?”

The home screen should not be a global popularity ranking.

Recommended order:

1. Campaigns from communities the user follows
2. Important updates from campaigns already supported
3. New verified campaigns from their communities
4. Campaigns near a genuine milestone
5. Local or adjacent communities
6. Platform-wide discovery, clearly labelled

This prioritises relational relevance over virality.

### 7.3 Discovery controls

Allow users to filter by:

- community;
- campaign category;
- location;
- funding stage;
- time remaining;
- verified status;
- and ways to help.

Do not use personalised donation capacity or inferred wealth to decide which campaigns or suggested amounts a user sees.

### 7.4 Avoid an infinite urgency feed

Infinite scrolling can turn serious community needs into disposable content.

Prefer:

- finite sections;
- clear pagination or “show more”;
- saved campaigns;
- intentional category browsing;
- and a visible end to the feed.

A user should leave with a sense of orientation, not exhaustion.

---

## 8. Campaign cards

A campaign card should communicate enough for a meaningful choice without becoming overloaded.

### Required elements

- Clear outcome-led title
- Campaign image
- Community name
- Organiser name or group
- Specific verification label
- One-sentence purpose
- Progress bar
- Amount raised and target
- Number of contributors
- Relevant time status
- A “Follow” or “Save” action

### Recommended title pattern

Prefer:

- “Fund new equipment for the women’s football team”
- “Restore the JCR music room”
- “Send the student team to the national final”

Avoid:

- “Please help us!”
- “Urgent!!!”
- “Fundraiser”
- “We need your support”
- vague internal project names.

### Card social proof

Show:

> 46 people contributed

rather than:

> Average donation: £27.40

The latter creates a financial norm that may deter people unable to match it.

### Milestone labels

Useful:

- “£180 remaining”
- “Goal reached”
- “Final equipment set”
- “New update”
- “Delivery in progress”

Avoid:

- “Trending” without a defined basis;
- “Going viral”;
- “Almost gone”;
- “Hot”;
- or red flashing urgency.

---

## 9. Campaign page

The campaign page is Dono’s primary trust surface.

### 9.1 Recommended order

1. **Outcome-led campaign title**
2. **Community and organiser**
3. **Verification summary**
4. **Image or short video**
5. **Progress and primary donate action**
6. **Concise campaign summary**
7. **What the money enables**
8. **Budget**
9. **Timeline and milestones**
10. **Updates**
11. **Supporters and messages**
12. **Risks, dependencies and refund information**
13. **Report or ask a question**

### 9.2 Above the fold

The user should immediately see:

- what is being achieved;
- for whom;
- who is organising;
- what has been raised;
- the target;
- whether the campaign has been verified;
- and the primary action.

Do not place a long emotional story before basic accountability information.

### 9.3 Campaign summary format

Require creators to write:

- **Goal:** one sentence
- **Why it matters:** two or three sentences
- **Plan:** what will be done
- **Budget:** how money will be used
- **Success:** how completion will be demonstrated

This is more persuasive than unrestricted long-form copy because it reduces uncertainty.

### 9.4 Budget design

Show a simple itemised budget:

| Item | Cost | Status |
|---|---:|---|
| Equipment | £500 | Partially funded |
| Room hire | £300 | Funded |
| Transport | £200 | Not funded |

Each item can have:

- a brief explanation;
- evidence or quotation;
- whether the cost is estimated or fixed;
- and whether substitutions are allowed.

The total must reconcile with the target.

### 9.5 Timeline

Use stages:

- Funding
- Purchase or preparation
- Delivery
- Evidence or completion update

A campaign should be understood as a process, not as a progress bar that ends when payment is captured.

### 9.6 Questions and comments

Prefer a structured **Questions** area over an unrestricted social comment feed.

Allow:

- questions to the organiser;
- organiser answers;
- moderator answers;
- useful upvotes;
- reporting;
- and a pinned answer.

Avoid:

- visible downvotes;
- popularity ratios;
- anonymous accusations;
- and unmoderated replies on sensitive campaigns.

A question-and-answer format strengthens accountability without turning campaigns into arguments.

---

## 10. Donation flow

The donation flow should be fast, calm and reversible until final confirmation.

### 10.1 Recommended flow

1. Select or enter amount
2. Choose whether to add a platform contribution, if applicable
3. Choose visibility
4. Add an optional message
5. Review recipient, total, fees and terms
6. Pay
7. Receive confirmation
8. Follow the campaign by explicit choice

Aim for one page or a short, clearly staged mobile flow.

### 10.2 Suggested donation amounts

Suggested amounts can reduce decision effort, but they also act as anchors.

Recommended structure:

- a low inclusive option;
- a middle option tied to a real unit;
- a higher option tied to a larger real unit;
- and a prominent custom amount.

Example:

- £5
- £12 — one reusable sign
- £25 — two signs
- Other

Rules:

- Base suggestions on campaign needs, not inferred personal wealth.
- Make “Other” as easy to choose as preset amounts.
- Never preselect an unexpectedly high amount.
- Do not label the smallest option “minimum”.
- Do not imply that the middle amount is morally preferred.
- Test whether suggestions alter the participation rate as well as average gift size.

### 10.3 Default amount

The safest initial approach is:

- no amount preselected; or
- the lowest ordinary amount selected only when the user has explicitly tapped a donate call-to-action and can easily change it.

A default should simplify the decision, not exploit inattention.

### 10.4 Recurring donations

Recurring donations require a distinct, affirmative choice.

Use separate tabs or controls:

- One-off
- Monthly

Do not:

- default to monthly;
- present monthly more prominently without good reason;
- disguise the annual total;
- or make cancellation difficult.

Show:

> £5 per month. Cancel at any time from Settings.

Before confirmation, show both:

- immediate charge;
- recurring frequency.

### 10.5 Platform contribution or tip

Where Dono offers a voluntary contribution:

- set it out separately;
- explain what it supports;
- make zero easy to select;
- show how to change or remove it;
- and reflect the correct total immediately.

The current fundraising code expressly emphasises clear treatment of platform fees and voluntary tips.[R13–R16]

Avoid:

- a hidden default percentage;
- a tiny “customise” link;
- guilt language when a user chooses zero;
- or a contribution added only at the final step.

### 10.6 Confirmation screen

Before payment:

> You are donating £12 to [Campaign], organised by [Organiser].  
> Dono/platform contribution: £0  
> Total today: £12  
> Your name will appear; your amount will remain private.

The final button should state the consequence:

- **Donate £12**
- not merely **Continue**.

### 10.7 Declined or failed payment

Use neutral language:

> We could not complete the payment. No donation was made.

Do not use red shame messaging or imply that the user has failed the campaign.

---

## 11. Post-donation experience

### 11.1 Immediate acknowledgement

Show:

- confirmation;
- the updated campaign progress;
- the user’s selected visibility;
- receipt access;
- and what will happen next.

Example:

> **Thank you — your £12 contribution is confirmed.**  
> 46 people have now raised £832 of £1,000.  
> The organiser expects to post the next update by 4 August.

### 11.2 Follow should not be silently bundled

Ask:

> Receive important updates from this campaign?

Choices:

- Follow updates
- Not now

Users who donate should not automatically consent to broad marketing.

### 11.3 Sharing

Offer values-led, non-boastful templates:

- “I backed this project from [community].”
- “We are £180 from the goal.”
- “Help our community complete [outcome].”

Allow users to remove the fact that they donated.

Do not prewrite:

- “I donated — you should too”
- “Can you beat my contribution?”
- or public messages containing the amount without explicit choice.

### 11.4 Receipt and records

The receipt should include:

- campaign;
- recipient;
- amount;
- fees;
- date;
- payment reference;
- tax or Gift Aid status;
- and refund information.

“My impact” should function as a personal record, not a score.

---

## 12. Community-building features

### 12.1 Community pages

Each community page should contain:

- mission or description;
- verified administrators;
- current campaigns;
- completed outcomes;
- updates;
- total participation;
- ways to help;
- community guidelines;
- and reporting controls.

A community page should show evidence that the group can organise and complete projects.

### 12.2 Community identity

Allow communities to use:

- a logo;
- a banner image;
- a restrained accent colour;
- a short description;
- membership or affiliation labels;
- and their own campaign categories.

Do not let custom branding reduce accessibility or make Dono’s trust interface inconsistent.

### 12.3 Membership language

Distinguish between:

- Member
- Follower
- Organiser
- Administrator
- Supporter
- Donor
- Volunteer
- Alumni or friend, where relevant

Do not conflate donating with membership.

### 12.4 Ways to contribute besides money

Every campaign should optionally display:

- volunteer;
- share;
- lend equipment;
- offer a skill;
- attend;
- introduce a sponsor;
- or follow updates.

This increases inclusion and reinforces the principle that participation is broader than spending.

### 12.5 Activity feed

A healthy activity feed should prioritise meaningful events:

- campaign launched;
- verified;
- milestone reached;
- organiser update;
- purchase completed;
- event delivered;
- thank-you message;
- final report.

It should not be dominated by:

- every individual donation;
- exact amounts;
- streaks;
- likes;
- or algorithmic controversy.

Recommended activity:

> 18 members helped the rowing club reach its first milestone.

Rather than:

> Alex donated £100. Priya donated £10. Sam donated £5.

### 12.6 Likes and endorsements

A simple “like” is ambiguous. It may mean approval, support, interest or sympathy.

Prefer distinct actions:

- **Support**
- **Follow**
- **Endorse**, for authorised organisations
- **Share**
- **Volunteer**

A support count can signal community interest without pretending it is a financial commitment.

### 12.7 Community funds

Community funds may strengthen shared identity, but they need stronger governance than ordinary campaigns.

The interface should explain:

- who controls allocation;
- how decisions are made;
- whether funds are restricted;
- what happens to unused money;
- withdrawal or refund rights;
- reporting frequency;
- and conflicts of interest.

Where members vote on allocation:

- explain eligibility;
- show alternatives;
- prevent duplicate voting;
- show the decision rule;
- and publish the result.

Do not obscure donor choice by automatically redirecting unused campaign funds into a general pool.

### 12.8 Pooled giving

Pooled giving should be explicitly chosen.

A good design:

> Contribute £10 to this community pool. Members will allocate it across the three listed projects on 15 October.

A weak design:

> Help the community — allocation decided later.

The more discretion involved, the more prominent the governance information should be.

---

## 13. Gamification: what to use and what to reject

Gamification can make collective progress enjoyable, but spending is a poor basis for competition.

### 13.1 Safe forms of gamification

Use:

- collective milestones;
- completion ceremonies;
- community participation goals;
- progress maps;
- campaign delivery checklists;
- collaborative unlocks;
- volunteer challenges;
- and time-limited community events where the rules are clear.

Examples:

- “100 community members participated”
- “All four project stages are now complete”
- “Three societies collaborated”
- “The community completed five projects this term”

### 13.2 High-risk forms

Avoid:

- donor leaderboards by money;
- streaks requiring repeated donations;
- daily donation missions;
- loot-box-like rewards;
- random prizes tied to contribution;
- spinning wheels;
- countdown pressure;
- public “generosity levels”;
- and notifications suggesting a user is losing status by not donating.

### 13.3 Badges

Potentially acceptable badges:

- First community joined
- Campaign completed
- Organiser delivered on time
- Helpful update posted
- Volunteer contribution
- Community collaborator

Avoid badges based on:

- £100 donated;
- top 1% donor;
- ten-month giving streak;
- or repeated spending.

If donation-related badges exist at all, keep them private and avoid displaying thresholds that encourage people to spend to reach the next level.

### 13.4 Dono Wrapped

A yearly summary can strengthen reflection and identity if it is impact-led.

Recommended metrics:

- communities supported;
- projects followed;
- completed outcomes;
- updates received;
- volunteer actions;
- collective number of people involved;
- impact categories;
- and optional private total donated.

Avoid:

- public donor ranking;
- “you gave more than X% of users”;
- shame comparisons;
- or automatically shareable financial totals.

Good wording:

> This year, you helped three community projects reach completion.

Not:

> You were a top 5% donor.

---

## 14. Matching and challenges

Matching can increase urgency and efficacy, but only when genuine.

### 14.1 Matching display

Show:

- matcher identity;
- maximum match;
- ratio;
- start and end;
- eligible donations;
- amount of match remaining;
- and whether the match is guaranteed.

Example:

> **Matched until £500**  
> The Alumni Association will add £1 for every £1 donated, up to £500, until 31 July.

### 14.2 Avoid misleading multiplication

Do not say:

- “Your donation is doubled”

unless the matching amount is still available and the user’s donation is eligible.

When the match is exhausted, update the interface immediately.

### 14.3 Community challenges

Good:

> If 100 members participate, the sponsor contributes £250.

This rewards broad participation rather than high individual spending.

Potential benefit:

- creates shared action;
- lowers the social barrier to small gifts;
- and communicates that every participant contributes to the outcome.

---

## 15. Notifications

Notifications can reconnect users with outcomes, but fundraising reminders can quickly become coercive.

### 15.1 Recommended notification categories

Users should control:

- campaign updates;
- funding milestones;
- requests from followed communities;
- direct questions or replies;
- payment and refund notices;
- impact summaries;
- and general product news.

### 15.2 Good notifications

- “The project you supported has reached its goal.”
- “The organiser posted a purchase update.”
- “£180 remains for the campaign you saved.”
- “Your community launched a verified campaign.”
- “A question you asked has been answered.”

### 15.3 Avoid

- “You have not donated this week.”
- “Your friends are giving without you.”
- “Do not let the community down.”
- repeated urgency notifications;
- or resurfacing a declined campaign immediately.

### 15.4 Frequency

Default to:

- transactional notices;
- important followed-campaign updates;
- and low-frequency community summaries.

Let users choose instant, daily, weekly or off.

Provide a simple **pause fundraising notifications** control.

---

## 16. Creator experience

### 16.1 Campaign creation should teach trust

The campaign builder should guide creators through:

1. Outcome
2. Community
3. Organiser
4. Recipient
5. Budget
6. Target
7. Timeline
8. Risks
9. Images and consent
10. Verification
11. Update plan
12. Preview

### 16.2 Quality prompts

Instead of a blank “Tell your story” field, ask:

- What will happen if the campaign succeeds?
- Who will benefit?
- How was the target calculated?
- What is the first action after funding?
- What could delay the project?
- How will supporters see the result?
- Who has approved the campaign?

This produces clearer campaigns and reduces dependence on persuasive writing skill.

### 16.3 Target setting

Require the target to reconcile with:

- budget;
- fees;
- contingency;
- and any existing funds.

The product should warn when:

- no budget is provided;
- a target is unusually high for the category;
- the target conflicts with item totals;
- the recipient is unclear;
- or the deadline appears unrealistic.

Warnings should request clarification rather than silently block legitimate campaigns.

### 16.4 Preview

The preview should display the campaign exactly as donors will see it, including:

- verification wording;
- fee presentation;
- recipient;
- image crop;
- default suggested amounts;
- and visibility options.

### 16.5 Update commitment

Before launch, creators should agree to:

- post after important milestones;
- explain delays;
- disclose material changes;
- retain receipts or evidence;
- and publish a completion or closure update.

The dashboard should convert these commitments into tasks.

---

## 17. Updates and accountability

Updates are essential to convert one-off transactions into durable community trust.

### 17.1 Update types

Use structured labels:

- Planning update
- Funding milestone
- Purchase
- Delivery
- Delay
- Budget change
- Goal change
- Completion
- Refund or closure

### 17.2 Update content

Prompt creators to include:

- what happened;
- evidence;
- current balance;
- changes to plan;
- next action;
- and expected next update.

### 17.3 Completion evidence

A completion update might contain:

- photographs;
- receipts;
- attendance numbers;
- a short outcome statement;
- unused funds;
- and acknowledgements.

Evidence should be proportionate. Do not force public disclosure of private personal information.

### 17.4 Delays

The interface should normalise honest delays:

> The organiser has marked this project as delayed and provided a new expected date.

Do not hide delayed campaigns from the organiser’s public record.

### 17.5 Organiser reputation

Reputation should be based on transparent behaviour, not popularity.

Useful signals:

- campaigns completed;
- updates posted on time;
- budget changes explained;
- unresolved concerns;
- refunds completed;
- identity or organisation verification.

Avoid a single opaque star rating.

---

## 18. Trust, safety and moderation

### 18.1 Reporting

Every campaign should have a visible **Report concern** action.

Report reasons:

- misleading information;
- identity concern;
- prohibited campaign;
- misuse of funds;
- harassment;
- privacy or image concern;
- duplicate campaign;
- other.

### 18.2 Report experience

Tell the reporter:

- what information is needed;
- whether the organiser may see their identity;
- what happens next;
- and how urgent safeguarding concerns are handled.

Do not promise a specific outcome before review.

### 18.3 Campaign states during review

Possible states:

- Under review
- Donations paused
- Updates required
- Closed
- Refunding
- Resolved

The public page should explain the state without making an unverified accusation.

### 18.4 Moderation principles

- Apply published rules consistently.
- Preserve records of material changes.
- Give organisers a route to respond.
- Protect reporters from retaliation.
- Escalate safeguarding, fraud and legal concerns.
- Avoid automated rejection based solely on writing quality or campaign popularity.
- Review edge cases involving sensitive personal hardship manually.

### 18.5 Prohibited persuasion

Campaigns should not be allowed to:

- threaten, shame or harass potential donors;
- name non-donors;
- imply academic, social or institutional consequences for not donating;
- use false deadlines;
- make unsupported medical, charitable or tax claims;
- or target vulnerable people with repeated direct requests.

---

## 19. Privacy and social visibility

The ICO requires data protection by design and by default, with use of personal information limited to what is necessary for the relevant purpose.[R23–R24]

### 19.1 Privacy principles

- Collect only information needed for the feature.
- Keep donation history private by default.
- Separate functional communications from marketing.
- Make community membership visibility controllable.
- Allow users to hide individual campaigns from their public profile.
- Avoid exposing precise location or routine attendance.
- Do not infer financial capacity from payment behaviour.
- Do not sell or provide identifiable donor behaviour to institutions for unrelated purposes.
- Use aggregated or anonymised analytics where possible.

### 19.2 Donation visibility controls

Users should be able to:

- edit visibility after donating;
- remove a public message;
- hide an amount;
- change display name;
- and request deletion where legally possible.

Changes should propagate to campaign feeds and public profiles.

### 19.3 Friend activity

Do not infer or publish friendship solely from contact syncing.

Friend activity should require:

- an explicit connection;
- consent to display activity;
- per-donation visibility;
- and clear controls.

A user should never discover that Dono exposed their donation to contacts because of a default setting.

### 19.4 Institutional analytics

Where Dono provides aggregated insight to colleges or communities:

- define minimum group sizes;
- suppress small cells;
- prevent re-identification;
- exclude exact individual donation histories;
- describe the analytics to users;
- and separate community-improvement analytics from advertising.

The design should make clear whether a statistic describes:

- visits;
- followers;
- supporters;
- donors;
- amounts;
- or completed payments.

---

## 20. Accessibility and inclusive design

Dono should target WCAG 2.2 Level AA as a minimum.[R21–R22]

### 20.1 Core requirements

- Keyboard access to all controls
- Visible focus states
- Proper semantic headings
- Form labels and useful error messages
- Text alternatives for meaningful images
- Captions and transcripts for campaign video
- No information conveyed by colour alone
- Responsive text up to 200%
- Reduced-motion support
- Adequate touch targets
- Screen-reader announcements for payment and progress changes
- Accessible authentication
- Clear language

### 20.2 Cognitive accessibility

- Use short paragraphs.
- Show one principal decision at a time.
- Keep button labels explicit.
- Avoid double negatives.
- Put errors next to the relevant field.
- Retain entered data after an error.
- Explain financial terms in plain English.
- Use consistent status labels.
- Avoid time limits wherever possible.

### 20.3 Financial inclusion

- Allow small custom amounts.
- Never make low donations appear embarrassing.
- Avoid minimum contributions unless technically necessary.
- Provide non-financial participation options.
- Do not visually enlarge high-value donors.
- Avoid assumptions that all students have similar disposable income.
- Make fees clear before the user commits.

### 20.4 Language and culture

- Do not assume all users understand UK fundraising terminology.
- Explain Gift Aid only where applicable.
- Allow names with accents and non-Latin scripts.
- Avoid idioms in critical payment information.
- Test imagery and campaign categories across different communities.

---

## 21. Copy and tone

### 21.1 Tone principles

Dono copy should be:

- clear;
- warm;
- specific;
- respectful;
- hopeful;
- and calm.

It should not be:

- melodramatic;
- patronising;
- guilt-driven;
- corporate;
- or over-celebratory.

### 21.2 Preferred vocabulary

Use:

- contribute;
- support;
- take part;
- help fund;
- community;
- project;
- outcome;
- update;
- organiser;
- recipient;
- completed.

Use “donate” when it is legally and factually accurate.

Avoid:

- save;
- rescue;
- hero;
- victim;
- needy;
- generous person;
- top donor;
- failure;
- last chance, unless literally true.

### 21.3 Calls to action

Primary:

- Donate
- Contribute
- Support this project
- Join the community effort
- Follow updates

Transactional buttons should state the consequence:

- Donate £10
- Confirm refund
- Publish campaign
- Submit for verification

Avoid vague buttons:

- Continue
- Yes
- Let’s go
- Make a difference

where the next action has a financial or public consequence.

---

## 22. Features to prioritise

### Phase 1: Trustworthy core

Build first:

1. Structured campaign creation
2. Specific verification labels
3. Outcome-led campaign pages
4. Itemised budgets
5. Clear progress
6. Accessible donation flow
7. Separate name, amount and message visibility
8. Fee and recipient disclosure
9. Campaign updates
10. Completion state and evidence
11. Reporting and moderation
12. Private donation history

### Phase 2: Community layer

Then add:

1. Community pages
2. Follow communities
3. Saved campaigns
4. Structured questions
5. Activity centred on milestones and delivery
6. Non-financial ways to help
7. Community-level impact history
8. Organiser reliability signals

### Phase 3: Collective participation

Then test:

1. Genuine matching
2. Participation-based challenges
3. Community funds
4. Pooled giving with explicit governance
5. Private yearly impact summaries
6. Institution-level aggregated analytics
7. Collaborations between communities

### Features to postpone or reject

Postpone until there is strong evidence and governance:

- friend donation feeds;
- public donor profiles;
- donor badges;
- algorithmic recommendations based on payment history;
- recurring donation prompts;
- and community competition.

Reject:

- public donor leaderboards;
- wealth-based status;
- donation streaks;
- false scarcity;
- hidden tips;
- preselected recurring payments;
- manipulative countdowns;
- or pay-to-increase campaign visibility.

---

## 23. Recommendation system principles

If Dono later personalises discovery, the algorithm should optimise for **relevance, trust and diversity**, not merely likely donation value.

### Recommended ranking factors

- followed community;
- user-selected interests;
- geographic relevance chosen by the user;
- verification;
- recent meaningful update;
- clear budget;
- achievable milestone;
- community diversity;
- and time relevance.

### Avoid ranking primarily by

- total raised;
- largest recent gift;
- predicted donor wealth;
- emotional extremity;
- sensational wording;
- repeated paid promotion;
- or engagement controversy.

### Transparency

Explain recommendations:

- “From a community you follow”
- “Similar to a project you supported”
- “Near you”
- “New verified campaign”
- “Approaching a final milestone”

Allow users to hide a campaign or reduce similar recommendations.

---

## 24. Metrics and experimentation

Dono should not define success as “more money extracted per user”.

### 24.1 North-star metric

Recommended:

> **Number or proportion of verified community projects that reach a transparent completion state with supporter updates.**

This aligns the platform with completed outcomes, not only fundraising volume.

### 24.2 Supporting metrics

#### Trust

- campaign-page-to-donation conversion;
- verification explanation opens;
- concern reports;
- refund rate;
- payment disputes;
- donor understanding of fees;
- donor understanding of recipient;
- trust survey score.

#### Community

- communities followed;
- proportion participating in more than one way;
- update engagement;
- repeat participation across campaigns;
- breadth of participation;
- collaborations between groups;
- completed projects viewed.

#### Campaign quality

- budget completion;
- creator update compliance;
- time to first update;
- completion update rate;
- target changes;
- unresolved campaigns.

#### Donation health

- participation rate;
- median rather than only mean donation;
- custom-amount use;
- small-donation completion;
- recurring donation cancellation;
- donor regret or refund request;
- visibility-setting changes after donation.

### 24.3 Guardrail metrics

Every conversion experiment should monitor:

- complaints;
- accidental recurring payments;
- refund requests;
- abandoned payments after fee disclosure;
- low-income exclusion indicators;
- notification opt-outs;
- hiding or muting;
- account deletion;
- and self-reported pressure.

A change that increases revenue but increases regret, confusion or pressure should not be considered successful.

### 24.4 Experiment rules

- Predefine the hypothesis.
- Test one major behavioural change at a time.
- Do not test deceptive variants.
- Include comprehension measures.
- Segment by new and returning users.
- Examine participation rate and donation distribution, not only average amount.
- Review effects on the smallest donors.
- Set a time limit and stopping rule.
- Record the decision and ethical assessment.
- Prefer reversible experiments.

### 24.5 High-value early experiments

1. **Participant count versus recent donation amounts**  
   Measure conversion, amount distribution and perceived pressure.

2. **No amount selected versus a low default**  
   Measure accidental choices, custom amount use and completion.

3. **Outcome-led title versus request-led title**  
   Measure comprehension and trust, not just clicks.

4. **Budget above versus below long story**  
   Measure campaign understanding and conversion.

5. **“£180 remains” versus “82% funded” near completion**  
   Measure efficacy and pressure.

6. **Follow by explicit opt-in versus automatic follow**  
   Measure update engagement, unsubscribe and trust.

7. **Participation challenge versus money challenge**  
   Compare broad participation and distribution of contributions.

---

## 25. Design-review checklist

Before approving a feature, ask:

### Trust

- Does the user know who receives the money?
- Are fees and total payment visible?
- Is verification specific rather than vague?
- Are risks and changes disclosed?
- Is the campaign outcome understandable?

### Agency

- Can the user decline easily?
- Is any default defensible?
- Can the user enter a custom amount?
- Are recurring payments affirmatively selected?
- Can visibility be changed?

### Community

- Does the feature reward participation rather than wealth?
- Can non-donors still belong?
- Does it strengthen real relationships?
- Could it shame or exclude anyone?
- Does it create cooperation rather than popularity competition?

### Privacy

- Is personal information necessary?
- Is public visibility actively chosen?
- Can activity be hidden later?
- Could aggregated data identify a person?
- Is friend or contact activity consensual?

### Accessibility

- Is the contrast sufficient?
- Is the feature usable by keyboard and screen reader?
- Is colour supplemented by text?
- Are touch targets large enough?
- Is the language clear?

### Behavioural ethics

- Is urgency genuine?
- Is the feature reducing friction or exploiting inattention?
- Would the design still feel fair if explained publicly?
- Could a financially vulnerable user feel coerced?
- Is the user likely to regret the choice?

### Outcomes

- Does the feature help campaigns deliver, not merely raise?
- Will supporters receive an update?
- Is the success metric aligned with community benefit?
- Are there guardrails against misuse?

---

## 26. Final recommended product doctrine

Dono should adopt the following principles internally:

### 1. Community before virality

Prioritise campaigns from real communities and existing relationships over platform-wide popularity.

### 2. Outcomes before amounts

Lead with what will happen, not how much money is being requested.

### 3. Trust before emotion

Show organiser, recipient, verification, budget and plan before asking for a contribution.

### 4. Participation before status

Recognise the breadth of collective action, not the wealth of individual donors.

### 5. Agency before conversion

Make every contribution voluntary, informed and easy to customise.

### 6. Privacy before publicity

Public generosity should be an explicit choice, not a default.

### 7. Progress before urgency

Show genuine movement towards an achievable goal without manufacturing pressure.

### 8. Completion before celebration

A fundraising target is not the final outcome. The project should be delivered and reported.

### 9. Dignity before engagement

Never require people to expose unnecessary hardship to make a campaign competitive.

### 10. Long-term trust before short-term revenue

Do not adopt a design that increases donations today by creating regret, pressure or opacity tomorrow.

---

## 27. Recommended one-sentence design brief

> **Design Dono as a calm, trustworthy community space where specific projects become achievable through visible collective participation, while every donor retains control over their money, privacy and level of involvement.**

---

## 28. Research notes and limitations

Behavioural findings in charitable giving are context-dependent. Effects may differ according to:

- type of cause;
- size and closeness of the community;
- donor income;
- campaign target;
- pre-existing relationships;
- cultural norms;
- whether the recipient is an individual or organisation;
- and whether the donation is genuinely charitable, communal or transactional.

The evidence should guide design hypotheses, not be treated as a guarantee that a tactic will increase donations on Dono.

Several research reviews find that common fundraising nudges have smaller or less consistent effects than individual headline studies may suggest.[R25] Dono should therefore:

- test changes in its own context;
- measure trust and pressure alongside conversion;
- avoid presenting behavioural claims as settled where evidence is mixed;
- and use the least manipulative effective design.

---

## 29. References

**[R1]** Chapman, C. M., Spence, J. L., Hornsey, M. J. and Dixon, L. (2025). *Social Identification and Charitable Giving: A Systematic Review and Meta-Analysis*. Nonprofit and Voluntary Sector Quarterly.  
https://doi.org/10.1177/08997640251317403

**[R2]** Sánchez, Á. and colleagues (2022). *Group identity and charitable contributions: Experimental evidence*. Journal of Economic Behavior & Organization.  
https://www.sciencedirect.com/science/article/abs/pii/S0167268121005424

**[R3]** Xu, Q. and colleagues (2023). *Voluntary or reluctant? Social influence in charitable giving*. Social Cognitive and Affective Neuroscience.  
https://academic.oup.com/scan/article/18/1/nsad010/7070418

**[R4]** Smith, S., Windmeijer, F. and Wright, E. (2015). *Peer Effects in Charitable Giving: Evidence from the (Running) Field*. The Economic Journal, 125(585), 1053–1071.  
https://academic.oup.com/ej/article/125/585/1053/5077361

**[R5]** List, J. A. and Lucking-Reiley, D. (2002). *The Effects of Seed Money and Refunds on Charitable Giving: Experimental Evidence from a University Capital Campaign*. Journal of Political Economy, 110(1).  
https://www.journals.uchicago.edu/doi/10.1086/324392

**[R6]** Lee, S. and Feeley, T. H. (2016). *The identifiable victim effect: a meta-analytic review*. Social Influence.  
https://doi.org/10.1080/15534510.2016.1216891

**[R7]** Kogut, T. and colleagues. Research on identified beneficiaries, singularity and charitable choice, summarised in subsequent experimental literature.

**[R8]** Erlandsson, A. and colleagues (2024). *Victim identifiability, number of victims, and unit asking in charitable giving*. PLOS ONE.  
https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0300863

**[R9]** Karlan, D. and McConnell, M. A. (2014). *Hey look at me: The effect of giving circles on giving*. Journal of Economic Behavior & Organization.  
https://www.sciencedirect.com/science/article/abs/pii/S0167268114002017

**[R10]** Tonin, M. and Vlassopoulos, M. (2013). *Experimental evidence of self-image concerns as motivation for giving*. Journal of Economic Behavior & Organization.  
https://www.sciencedirect.com/science/article/abs/pii/S0167268113000565

**[R11]** Oxford University Press (2023). Research discussion of privacy and anonymity in crowdfunding in *Crowdfunding: A New Era of Philanthropy?*  
https://academic.oup.com/book/46852/chapter/413596201

**[R12]** Samek, A. and colleagues (2021). *An experimental test of fundraising appeals targeting donor and recipient benefits*. Nature Human Behaviour.  
https://www.nature.com/articles/s41562-021-01095-8

**[R13]** Fundraising Regulator. *Code of Fundraising Practice*. Current code effective from 1 November 2025.  
https://www.fundraisingregulator.org.uk/code

**[R14]** Fundraising Regulator. *Online fundraising platforms*.  
https://www.fundraisingregulator.org.uk/code/specific-fundraising-methods/online-fundraising-platforms

**[R15]** Fundraising Regulator. *Guidance for online fundraising platforms*. Updated November 2025.  
https://www.fundraisingregulator.org.uk/about-fundraising/resources/guidance-online-fundraising-platforms

**[R16]** Fundraising Regulator (2025). *New code takes effect, marking an important step forward for fundraising standards in the UK*.  
https://www.fundraisingregulator.org.uk/news/new-code-takes-effect-marking-important-step-forward-fundraising-standards-uk

**[R17]** Ghoorah, U. and colleagues (2025). *Relationships between financial transparency, trust, and perceived performance*. Humanities and Social Sciences Communications.  
https://www.nature.com/articles/s41599-025-04640-2

**[R18]** Competition and Markets Authority (2022). *Evidence review of Online Choice Architecture and consumer and competition harm*.  
https://www.gov.uk/government/publications/online-choice-architecture-how-digital-design-can-harm-competition-and-consumers/evidence-review-of-online-choice-architecture-and-consumer-and-competition-harm

**[R19]** Competition and Markets Authority (2022). *Online Choice Architecture: How digital design can harm competition and consumers*.  
https://www.gov.uk/government/publications/online-choice-architecture-how-digital-design-can-harm-competition-and-consumers

**[R20]** Competition and Markets Authority (2026). *Agentic AI and consumers*. This reiterates that misleading interface features such as false urgency can fall within existing consumer-protection rules.  
https://www.gov.uk/government/publications/agentic-ai-and-consumers/agentic-ai-and-consumers

**[R21]** W3C (2024). *Web Content Accessibility Guidelines (WCAG) 2.2*, including contrast criterion 1.4.3.  
https://www.w3.org/TR/WCAG22/

**[R22]** W3C. *How to Meet WCAG 2.2: Quick Reference*, including target-size guidance.  
https://www.w3.org/WAI/WCAG22/quickref/

**[R23]** Information Commissioner’s Office (2026). *Data protection by design and by default*.  
https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/guide-to-accountability-and-governance/data-protection-by-design-and-by-default/

**[R24]** Information Commissioner’s Office. *Data minimisation*.  
https://ico.org.uk/for-organisations/advice-and-services/audits/data-protection-audit-framework/toolkits/age-appropriate-design/data-minimisation/

**[R25]** Bekkers, R. and colleagues (2022). *What Works to Increase Charitable Donations? A Meta-Review with Meta-Meta-Analysis*. VOLUNTAS.  
https://link.springer.com/article/10.1007/s11266-022-00499-y

---

## 30. Implementation handoff summary

The engineering and design teams should treat the following as immediate requirements:

- Build community-first discovery, not a global popularity feed.
- Use the approved green palette with the accessibility constraints in this document.
- Make campaign titles outcome-led.
- Put organiser, recipient, verification, progress and budget near the top.
- Use participant counts more prominently than visible donation amounts.
- Give separate controls for name, amount and message visibility.
- Keep donation history private by default.
- Make custom donation amounts prominent.
- Do not default users into recurring payments.
- Show every fee and the final charged total before confirmation.
- Use specific verification labels with explanatory detail.
- Require structured budgets, timelines and update commitments.
- Build campaign states beyond “funding”, including delivery and completion.
- Create a structured question-and-answer area with moderation.
- Recognise community participation and completed outcomes, never donor wealth.
- Avoid leaderboards, donation streaks, false urgency and hidden tips.
- Build accessible controls to WCAG 2.2 AA.
- Measure campaign completion, trust and repeat community participation as core outcomes.
