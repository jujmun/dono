# Dono: Comprehensive Product and Repository Overview

**Repository reviewed:** `jujmun/dono`  
**Branch reviewed:** `main`  
**Review date:** 15 July 2026  
**Repository version:** `0.1.0`

## 1. Executive summary

Dono is a university-focused crowdfunding and community-giving platform. It is designed to let students and student-led organisations raise money directly from alumni for specific, tangible improvements to student life.

Its central proposition is not merely that people should donate more. It is that donors should be able to understand exactly where their money went, follow the people and communities they care about, and see the resulting impact over time.

In practical terms, Dono allows:

- students and student organisations to create fundraising campaigns;
- alumni and other donors to browse specific projects;
- donors to make one-off or monthly donations;
- users to follow campaigns and university communities;
- societies to establish verified community pages;
- the Dono team to review and moderate campaigns before publication;
- donors to track their giving and impact through a personal dashboard;
- donations to be pooled through broader Community Funds.

The present repository is built primarily around a University of Oxford pilot. Most authenticated student functionality is restricted to Oxford email addresses, campaign creation defaults to the University of Oxford, and society verification is built into the platform. However, parts of the public-facing copy refer more broadly to universities across the UK, indicating that the intended model could expand beyond Oxford.

Dono is best understood as **community infrastructure for transparent university giving**, rather than as a generic GoFundMe-style crowdfunding website.

---

## 2. One-sentence definition

**Dono is a cross-platform crowdfunding and community platform that enables students and student-led organisations to raise money from alumni for specific university projects, while giving donors clear visibility over where their money goes and what it achieves.**

---

## 3. The problem Dono is trying to solve

Traditional university giving often presents several problems for younger donors:

1. **Giving can feel opaque.**  
   A donor may contribute to a broad university fund without knowing which student, society, department or project ultimately benefited.

2. **Large institutional appeals can feel remote.**  
   Young alumni may not be ready to fund major buildings, endowments or capital campaigns, but may be willing to contribute £10, £20 or £50 towards a concrete need.

3. **Small student needs fall between existing systems.**  
   Students and societies may need equipment, educational resources, travel funding, instruments, accessibility improvements or welfare supplies. These needs can be too small for conventional development-office fundraising but too ordinary for emergency-oriented crowdfunding.

4. **Crowdfunding is usually transactional rather than relational.**  
   Many platforms focus on a single campaign and payment. Dono instead seeks to preserve the relationship between donors and the communities they care about.

5. **Donors receive little lasting evidence of impact.**  
   Dono is structured around visible outcomes, campaign updates, impact summaries and personal giving records.

The homepage expresses this problem directly through the question:

> “Where did my money actually go?”

The product is therefore built around **specificity, transparency, continuity and community**.

---

## 4. Dono’s core product philosophy

### 4.1 Visible giving

Dono is designed around “visible, specific, low-opacity giving”. A campaign is expected to explain:

- what is needed;
- why it matters;
- how much it will cost;
- who is responsible;
- which university community is involved;
- what a donation will fund;
- what progress has been made.

### 4.2 Tangible outcomes

Campaigns are framed as concrete projects rather than vague appeals. Repository examples and interface copy include needs such as:

- anatomy models;
- textbooks and learning resources;
- musical instruments;
- sports equipment;
- conference travel;
- welfare kits;
- accessibility improvements.

The campaign creation interface says that Dono is optimised for small-to-medium funding needs, particularly in the approximate range of **£500 to £10,000**, although the backend technically accepts goals from £1 to £1,000,000.

### 4.3 Communities outlast campaigns

One of Dono’s most important ideas is stated directly in the Communities interface:

> “Campaigns come and go — communities remain.”

This makes the community layer central to the product. A donor might initially give to one project, but Dono aims to maintain their relationship with the relevant college, society or department after that campaign ends.

### 4.4 Small donations become collective impact

Dono is aimed particularly at younger alumni and other donors who may not be able to make large gifts. The platform makes small contributions meaningful by aggregating them around a clear shared outcome.

### 4.5 Giving should be socially rewarding without becoming opaque

Dono includes follows, likes, comments, activity items and donor-impact tracking. These features are intended to make giving feel participatory and rewarding while preserving verification and clear financial purpose.

### 4.6 Students should not pay to ask for help

The creation flow explicitly states that students do not pay to create campaigns. The interface indicates that Dono intends to earn revenue through a small transaction fee on donations.

---

## 5. Who Dono is for

## 5.1 Student campaign creators

Individual students can create campaigns for defined university-related needs. They must sign in using an eligible university email address and complete an onboarding profile.

A student creator can:

- enter a campaign title;
- select a category;
- identify the type of creator;
- write a short description;
- explain the full story;
- set a fundraising goal;
- upload several campaign photographs;
- preview the campaign;
- submit it for review.

Survey research (n=23) found embarrassment about asking publicly is the
single biggest barrier to creating a campaign, ahead of doubting anyone would
donate — and that institutional (college/university) endorsement matters more
to trust than any product feature. See
[research/market-research-notes.md](../research/market-research-notes.md#student-survey-analysis-fable-form-n23)
for the full segmentation.

## 5.2 Student societies

Societies are treated as persistent communities rather than merely campaign creators.

The platform supports:

- creation of a society page;
- society verification by Dono administrators;
- leaders and members;
- pending, approved and rejected memberships;
- society-level campaign approval;
- multiple campaigns associated with one society;
- society followers;
- verification status and moderation.

When a campaign is created on behalf of a society, it can require approval from a recognised society leader before Dono’s administrators publish it.

## 5.3 Colleges, departments and universities

The campaign interface allows a creator to identify themselves as an:

- individual student;
- student society;
- college;
- department;
- university.

The broader community interface is designed to accommodate colleges, societies and departments. However, the current backend’s public community listing is primarily restricted to verified societies, so support for public college and department pages is not yet fully aligned across the application.

## 5.4 Alumni and donors

Donors can:

- browse active campaigns;
- search by campaign, description or university;
- filter by category;
- inspect goals, money raised and donor counts;
- view verification information;
- read the campaign story;
- see campaign updates and impact items;
- make one-off donations;
- make monthly recurring donations when signed in;
- donate to a Community Fund;
- follow campaigns and communities;
- view their donation history and impact.

The product copy particularly emphasises young alumni who want to make smaller but more personally meaningful contributions.

## 5.5 Dono administrators

A separate outreach-admin portal allows authorised administrators to:

- view pending campaigns;
- search submissions;
- inspect campaign and creator information;
- approve campaigns;
- reject campaigns with a reason;
- take down live campaigns;
- restore moderated campaigns;
- review society applications;
- verify or reject societies;
- communicate moderation feedback to creators;
- maintain an admin audit trail.

The admin account is deliberately separated from the normal student-facing application.

---

## 6. The core user journey

## 6.1 Student journey

1. The student opens Dono.
2. They sign in using an eligible Oxford email address.
3. Dono sends a one-time passcode by email.
4. The student verifies the passcode.
5. On first sign-in, they complete onboarding by adding their name.
6. They choose **Start a Campaign**.
7. They complete a five-stage flow:
   - Details
   - Story
   - Goal
   - Review
   - Submit
8. They may upload campaign photographs.
9. Dono creates the campaign with a `pending` status.
10. If the campaign represents a society, society-leader approval may be required.
11. A Dono administrator reviews the campaign.
12. The campaign is approved and becomes publicly active, or it is rejected with feedback.
13. The student receives review information through their account and potentially by email.
14. Donors contribute to the campaign.
15. The creator can ultimately provide updates and visible impact information.

## 6.2 Donor journey

1. The donor visits the homepage or campaign directory.
2. They browse featured or active campaigns.
3. They search by title, description or university and filter by category.
4. They open a campaign.
5. They review:
   - the project story;
   - fundraising progress;
   - deadline;
   - creator;
   - university or college;
   - verification badges;
   - donor, follower, like and comment counts;
   - what donations will fund;
   - campaign updates.
6. They select a suggested donation amount or enter a custom amount.
7. They make a one-off donation through Stripe.
8. A guest donor may provide an email address for a receipt.
9. A signed-in donor may establish a monthly recurring donation.
10. Their successful donations contribute to their Dono impact record.

## 6.3 Society journey

1. A verified user creates a society.
2. The creator becomes the initial approved society leader.
3. The society remains pending until reviewed by Dono.
4. An administrator verifies or rejects it.
5. Once verified, it becomes publicly visible.
6. Members can be associated with the society.
7. Society campaigns may require leader approval before central Dono approval.
8. Donors can follow the society and view its campaigns.

## 6.4 Administrator journey

1. The outreach administrator signs in through the dedicated admin identity.
2. The application routes them into the admin portal rather than the student platform.
3. They see campaign-review statistics and pending submissions.
4. They inspect a campaign and its student creator.
5. They approve it, reject it with a reason, or later take it down.
6. Review messages are stored and can be emailed to the creator.
7. Administrative actions can be recorded in the audit log.

---

## 7. Main product areas

## 7.1 Homepage

The homepage introduces Dono’s mission and highlights:

- transparent university giving;
- specific student projects;
- featured campaigns;
- featured communities;
- clear outcomes;
- secure payments;
- free campaign creation for students;
- the Dono dinosaur mascot.

Its primary calls to action are:

- **Find a Campaign**
- **Create a Campaign**

## 7.2 Campaign directory

The campaign directory presents active campaigns in a card grid.

Users can:

- search campaigns;
- search universities;
- search descriptions;
- filter by campaign category;
- open individual campaign pages.

The backend also contains support for:

- paginated campaign results;
- trending campaigns;
- featured campaigns;
- related campaigns;
- campaigns belonging to a community.

## 7.3 Campaign pages

A campaign page contains:

- image gallery;
- category;
- title;
- university and optional college;
- deadline;
- verification badges;
- amount raised;
- funding goal;
- progress bar;
- number of donors;
- number of followers;
- engagement statistics;
- full campaign story;
- itemised impact information;
- campaign updates;
- related campaigns;
- donation controls.

Campaign statuses include:

- `pending`
- `rejected`
- `active`
- `funded`
- `completed`

Only appropriate public statuses should appear in normal browsing.

## 7.4 Campaign creation

Campaign creation is a structured, multi-stage process rather than an unrestricted text form.

The form captures:

- title;
- category;
- creator type;
- description;
- full story;
- funding goal;
- photographs;
- university.

The current application defaults campaigns to the **University of Oxford**.

The frontend gives creators a donor-facing preview before submission. Submitted campaigns enter moderation rather than immediately becoming public.

## 7.5 Communities

Communities represent the longer-term social structure behind campaigns.

A community stores information including:

- name;
- slug;
- type;
- description;
- avatar;
- cover image;
- university;
- follower count;
- number of campaigns;
- total raised;
- verification state;
- creator;
- moderation information.

The frontend describes communities as colleges, societies and departments. The most developed present workflow is for verified student societies.

## 7.6 Community Funds

Community Funds allow donors to contribute without selecting a single campaign.

A fund has:

- a name;
- a category;
- a description;
- total money raised;
- donor count;
- number of supported campaigns;
- associated university;
- image.

The conceptual purpose is to distribute a contribution among related active projects, such as several educational, sporting or welfare needs.

The data model includes explicit fund allocations that connect:

- a fund;
- the original donation;
- recipient campaigns;
- the amount assigned to each campaign.

## 7.7 Personal impact dashboard

The dashboard shows signed-in donors:

- total donated;
- number of campaigns supported;
- number of communities followed;
- impact highlights;
- recent donations;
- campaigns presented as followed campaigns.

The backend can derive impact statements from the tangible items listed in campaigns.

## 7.8 Dono Wrapped

The backend contains a Dono Wrapped summary with:

- current year;
- total donated;
- campaigns supported;
- top community;
- a donor rank or status;
- a personalised impact statement.

Example donor statuses include:

- “Top 15% of donors”
- “Rising donor”
- “Start your giving journey”

This supports Dono’s goal of making generosity visible, memorable and repeatable. The backend capability exists, although the current main navigation and dashboard do not yet expose a complete dedicated Wrapped experience.

## 7.9 Account area

The account page allows users to:

- view their account email;
- change their display name;
- upload or change a profile photograph;
- read moderation feedback on their campaigns;
- view recurring donations;
- cancel monthly subscriptions;
- sign out.

## 7.10 Admin portal

The admin portal is a distinct operational interface. It currently contains campaign queues and review workflows, and the backend supports:

- pending campaign review;
- campaign approval;
- rejection with reasons;
- live-campaign takedown;
- restoration;
- society verification;
- review messaging;
- email notifications;
- audit logging.

---

## 8. Campaign categories and funding use cases

The category system is defined centrally in the application and is used for:

- browsing;
- campaign creation;
- visual badges;
- related-campaign recommendations;
- analytics.

Although the exact labels can evolve, repository examples show Dono being designed for needs such as:

- educational resources;
- medical teaching equipment;
- sports;
- music and arts;
- student welfare;
- accessibility;
- travel and conferences;
- society equipment;
- community improvements.

Dono’s strongest use case is a campaign with a clear relationship between a modest funding target and a visible outcome.

---

## 9. Trust, verification and moderation

Trust is a structural part of Dono rather than a simple badge added to the interface.

## 9.1 Restricted student authentication

Normal sign-in is restricted to University of Oxford email addresses under `ox.ac.uk` and its subdomains.

A separate, hard-coded outreach-admin email is allowed for the administration portal.

## 9.2 Passwordless email verification

Dono uses email one-time passcodes rather than conventional passwords.

The flow includes:

- sign-in request;
- email delivery;
- passcode verification;
- onboarding;
- reset or recovery entry;
- rate limiting;
- neutral anti-enumeration messages.

Passcodes are generated using Oslo tooling and delivered through Resend.

## 9.3 Verified profiles

The application maintains a profile for each authenticated user, including:

- email;
- name;
- avatar;
- role;
- verification time;
- creation and update times.

Roles are:

- `user`
- `admin`

Sensitive permissions are intended to be enforced on the server rather than trusted from the client.

## 9.4 Campaign moderation

Campaigns are not automatically public.

The moderation system supports:

- pending review;
- approval;
- rejection;
- takedown of an already published campaign;
- restoration;
- written moderation reasons;
- moderator identity and timestamps;
- direct review messages to creators.

## 9.5 Society verification

Societies have a separate verification status:

- `pending`
- `verified`
- `rejected`

Only verified societies are normally included in public society listings.

## 9.6 Society approval of campaigns

A campaign created as a student-society campaign can require an approved society leader to authorise it before Dono’s administrators make it public.

This creates two levels of legitimacy:

1. internal society approval;
2. central platform approval.

## 9.7 Auditability

Administrative actions can be stored in an audit log with:

- administrator;
- action;
- target type;
- target identifier;
- metadata;
- timestamp.

## 9.8 Uploaded-file ownership

The backend records which user owns each uploaded Convex file. This supports safer handling of campaign images and profile avatars.

---

## 10. Payments and donation model

## 10.1 Stripe integration

Dono uses Stripe for payment processing across web and native platforms.

The repository includes:

- Stripe.js and React Stripe.js for web;
- Stripe React Native for mobile;
- the Stripe server SDK;
- payment-intent creation;
- recurring subscriptions;
- customer records;
- webhook event tracking;
- Stripe Connect account records;
- payout records.

## 10.2 One-off donations

One-off donations can be made by:

- signed-in users;
- guests who provide an optional receipt email.

The payment is associated with:

- a campaign or fund;
- an amount;
- GBP currency;
- donor identity where available;
- Stripe payment intent;
- payment status.

Donation payment statuses include:

- `pending`
- `succeeded`
- `failed`
- `refunded`

## 10.3 Recurring donations

Signed-in users can create monthly recurring donations to campaigns.

The system stores:

- campaign;
- monthly amount;
- currency;
- Stripe subscription;
- Stripe price;
- status;
- creation date;
- cancellation date.

Recurring statuses include:

- `active`
- `past_due`
- `canceled`

Users can cancel their recurring donations from the account page.

## 10.4 Community Fund donations

The platform can create Stripe payment intents for Community Funds. Fund donations can then be allocated among campaigns through the `fundAllocations` table.

## 10.5 Donation safeguards

The Stripe actions include controls such as:

- server-side amount validation;
- server-side campaign validation;
- email validation;
- payment-creation quotas;
- limits on excessive pending donations;
- checks preventing administrators from acting as normal donors;
- webhook deduplication records.

## 10.6 Stripe Connect and payouts

The data model includes a foundation for paying campaign recipients through Stripe Connect.

It tracks:

- connected account owner;
- optional community;
- Stripe account identifier;
- onboarding completion;
- whether charges are enabled;
- whether payouts are enabled;
- campaign payout amount;
- transfer state;
- Stripe transfer identifier.

Payout statuses include:

- `pending`
- `transferred`
- `failed`

This indicates that Dono is intended not only to collect payments but also to manage the controlled movement of funds to the appropriate recipient.

## 10.7 Revenue model indicated in the application

The campaign creation interface says:

- campaign creation is free for students;
- Dono takes a small transaction fee on donations.

The repository does not yet provide a complete commercial pricing specification, but the product’s visible model is a transaction-supported platform rather than an upfront creator-fee service.

---

## 11. Social and community features

The backend contains functional support for:

- following campaigns;
- unfollowing campaigns;
- liking campaigns;
- unliking campaigns;
- following communities;
- unfollowing communities;
- adding comments;
- deleting comments;
- viewing comments;
- listing followed campaigns;
- counting followed communities;
- checking a user’s relationship with a campaign or community.

Activity records can represent:

- a donation;
- a campaign launch;
- a follow;
- an update;
- a match.

This infrastructure supports a live or social activity feed, although the current top-level navigation does not expose a dedicated Discover feed.

---

## 12. Data model

The Convex schema contains the following principal entities.

## 12.1 Identity and security

### `users`
Provided through Convex Auth.

### `profiles`
Stores user-facing identity, role and verification details.

### `appRateLimits`
Stores rate-limit windows, attempts and lockout information.

### `storageOwners`
Associates uploaded files with their owners.

## 12.2 Communities and societies

### `communities`
Stores colleges, societies, departments or related university communities.

### `societyMembers`
Stores society membership, role and approval state.

### `communityFollows`
Tracks users following communities.

## 12.3 Campaigns

### `campaigns`
Stores the complete campaign record, including content, creator, fundraising figures, status, images, updates, verification and moderation.

### `campaignFollows`
Tracks campaign followers.

### `campaignLikes`
Tracks campaign likes.

### `campaignComments`
Stores user comments and soft deletion.

### `campaignReviewMessages`
Stores administrator feedback sent to campaign creators.

## 12.4 Funds and giving

### `communityFunds`
Stores pooled giving funds.

### `donations`
Stores one-off and recurring donation events.

### `recurringDonations`
Stores monthly donation subscriptions.

### `fundAllocations`
Records how a fund donation is divided among campaigns.

## 12.5 Stripe and payouts

### `stripeCustomers`
Links Dono users to Stripe customers.

### `stripeWebhookEvents`
Prevents duplicate webhook processing.

### `stripeConnectAccounts`
Stores recipients’ connected Stripe accounts and payout readiness.

### `campaignPayouts`
Stores transfers to campaign recipients.

## 12.6 Engagement and operations

### `activityItems`
Stores social and product activity.

### `adminAuditLog`
Stores administrator actions.

---

## 13. Technical architecture

## 13.1 Cross-platform application

Dono uses **Expo with Expo Router**, allowing one React Native codebase to target:

- web;
- iOS;
- Android.

Routing is file-based inside the `app/` directory.

## 13.2 Language

The project uses **TypeScript** throughout.

## 13.3 Frontend

The frontend uses:

- React 19;
- React Native;
- React Native Web;
- Expo Router;
- NativeWind;
- Lucide React Native icons;
- Expo Image Picker;
- Safe Area Context;
- React Native Reanimated.

## 13.4 Styling

Styling is primarily implemented through **NativeWind**, the React Native adaptation of Tailwind CSS.

The interface uses a calm green visual system, rounded cards, soft borders and a minimal layout intended to feel both friendly and trustworthy.

## 13.5 Typography and identity

The application loads:

- **Fraunces** for display typography;
- **Inter** for general interface text;
- **JetBrains Mono** for numerical or technical emphasis.

The homepage includes a dinosaur mascot, reinforcing a more approachable and memorable brand identity.

## 13.6 Backend

The backend uses **Convex**, including:

- database;
- queries;
- mutations;
- server actions;
- scheduled functions;
- file storage;
- authentication integration.

Frontend data access is handled through Convex React hooks such as:

- `useQuery`
- `useMutation`
- `useAction`

## 13.7 Authentication

Authentication uses:

- Convex Auth;
- Auth.js core;
- Resend;
- Oslo cryptographic utilities;
- secure local token storage.

## 13.8 Payments

Payments use:

- Stripe server SDK;
- Stripe.js;
- React Stripe.js;
- Stripe React Native;
- Stripe webhooks;
- Stripe Connect foundations.

## 13.9 Analytics

Dono uses **PostHog EU**.

The repository records intentional events such as:

- campaign viewed;
- donation started;
- donation amount selected;
- campaign liked;
- campaign followed;
- campaign shared;
- campaign created.

Automatic capture is disabled so that authentication fields such as email addresses and one-time passcodes are not inadvertently collected. Session replay is also disabled.

## 13.10 Email

Resend is used for:

- login passcodes;
- society-review notifications;
- campaign approval notifications;
- moderation feedback;
- other transactional communication.

## 13.11 Validation and testing

The repository uses:

- Zod for client-side validation;
- server-side Convex validators;
- ESLint;
- TypeScript type checking;
- Vitest.

---

## 14. Navigation and interface structure

The current principal navigation is:

- Home
- Campaigns
- Communities
- Impact
- You

A prominent **Start a Campaign** action is provided separately.

Additional routes include:

- sign in;
- email verification;
- onboarding;
- account recovery;
- campaign details;
- campaign creation;
- Community Funds;
- administrator portal.

The application has:

- a desktop header;
- a mobile menu;
- a mobile bottom navigation bar;
- a shared footer;
- responsive layouts.

---

## 15. What differentiates Dono

## 15.1 University-specific trust

Dono is not an entirely open crowdfunding marketplace. It uses university identity, society verification and moderation to create a more trusted environment.

## 15.2 Tangible, ordinary student needs

Dono is suited to needs that matter but may not constitute emergencies: equipment, resources, opportunities and improvements to student life.

## 15.3 Persistent community relationships

A generic crowdfunding platform centres the campaign. Dono centres both the campaign and the community around it.

## 15.4 Donor impact tracking

The dashboard and Wrapped infrastructure turn donations into a visible personal history.

## 15.5 Layered moderation

Dono combines:

- authenticated identity;
- society approval;
- central approval;
- public verification;
- administrator review;
- audit logging.

## 15.6 Pooled giving

Community Funds allow donors to support a category or community without needing to choose a single campaign.

## 15.7 One codebase across web and mobile

The Expo architecture supports a consistent product across browser, iPhone and Android.

---

## 16. What Dono is not

Based on the repository, Dono is not intended to be:

- an unrestricted anonymous crowdfunding marketplace;
- a replacement for major university capital campaigns;
- a platform where campaigns become public without review;
- a platform that charges students to create campaigns;
- merely a payment-processing page;
- solely a collection of isolated fundraising campaigns;
- currently an open authenticated network for every university.

Its present design is more specific: a moderated Oxford-first platform for transparent student and community giving, with architecture that could later support a wider university network.

---

## 17. Current implementation status

The repository is an actively developed early-stage product. It contains substantial full-stack functionality, but it should still be treated as an MVP or pre-production application rather than a completely finished platform.

## 17.1 Areas that are substantially implemented

- cross-platform Expo application;
- responsive public homepage;
- campaign browsing and filtering;
- campaign detail pages;
- campaign image galleries;
- multi-stage campaign creation;
- Oxford email authentication;
- email one-time passcodes;
- onboarding and profiles;
- campaign moderation backend;
- administrator campaign queue;
- society creation and verification;
- society membership model;
- one-off Stripe donations;
- guest donor support;
- monthly donations;
- recurring-donation cancellation;
- Community Fund payment support;
- donor-impact queries;
- Dono Wrapped backend summary;
- engagement backend;
- campaign and community follows;
- likes and comments;
- admin feedback messages;
- email notifications;
- audit logging;
- Stripe Connect and payout data structures;
- analytics instrumentation.

## 17.2 Areas where the current interface and backend are not fully aligned

### Campaign likes and follows

The backend contains real like and follow mutations. However, the campaign-detail buttons currently appear to record PostHog analytics events without calling those mutations. The UI therefore presents the controls, but the displayed interaction may not yet persist from that page.

### Followed campaigns on the dashboard

The backend can return a user’s genuinely followed campaigns. The current dashboard instead takes the first two campaigns from the full campaign list and labels them as “Campaigns You Follow”. This is placeholder behaviour.

### Dono Wrapped

The backend calculates a Wrapped summary, but the current dashboard does not call that query and the principal navigation does not include a dedicated Wrapped page.

### Discover or activity feed

The README describes a Discover area with a live activity feed and trending campaigns. The backend contains activity data and trending queries, but the present navigation does not contain a Discover route.

### Community types

The frontend lets users filter communities by college, society and department. The backend’s public `communities.list` query presently returns only verified societies. The broader community model is therefore more advanced conceptually than in the current public listing.

### Geographic scope

The campaigns page refers to projects at universities across the UK. In contrast:

- authentication is restricted to Oxford email addresses;
- campaign creation defaults to the University of Oxford;
- society creation assigns the University of Oxford.

The implemented product is consequently Oxford-first, despite broader national language.

### README admin notes

Parts of the README state that additional backend work is required for campaign approval. The current backend already includes campaign statuses, pending campaign queries, approval, rejection and moderation. This section of the README appears to lag behind the code.

### Payments and payouts

Payment collection is comparatively developed. The schema also contains Stripe Connect and campaign-payout records, but the complete operational recipient-onboarding and payout journey is not as visible in the reviewed user interface as the donation journey.

## 17.3 Product-stage interpretation

The codebase is more than a visual prototype: it contains a real database model, authentication, payment actions, moderation, administrative controls and security checks.

However, placeholder data removal utilities, partially wired controls, documentation drift and unfinished product surfaces indicate that Dono is still being consolidated into a production-ready system.

---

## 18. Likely product direction

The repository suggests the following product direction:

1. **Launch through a controlled Oxford community.**
2. **Build trust through university email verification and manual moderation.**
3. **Use tangible campaigns to attract donors.**
4. **Convert one-off donors into followers of communities.**
5. **Encourage repeat and monthly giving.**
6. **Show donors a cumulative record of impact.**
7. **Introduce pooled Community Funds for donors who do not want to select one campaign.**
8. **Expand the community model to more colleges, departments and universities.**
9. **Operationalise recipient payouts through Stripe Connect.**
10. **Use analytics to refine campaign discovery and donation conversion.**

---

## 19. Concise product positioning

### Primary positioning

**Community infrastructure for transparent university giving.**

### Donor-facing positioning

**Support specific student projects, follow the communities you care about and see exactly what your contribution achieved.**

### Student-facing positioning

**Raise money for a tangible university need and reach alumni who already care about your community.**

### Society-facing positioning

**Build a verified community, fund multiple projects and maintain a long-term relationship with supporters.**

### Strategic positioning

**Dono turns university fundraising from an opaque institutional transaction into a visible, community-based relationship.**

---

## 20. Repository map

The following files are particularly important for understanding the product.

### Product description and setup

- `README.md`
- `CLAUDE.md`
- `AGENTS.md`
- `package.json`

### Application shell and navigation

- `app/_layout.tsx`
- `app/index.tsx`
- `components/app-shell.tsx`
- `components/layout.tsx`

### Campaigns

- `app/campaigns/index.tsx`
- `app/campaigns/[id].tsx`
- `app/create.tsx`
- `convex/campaigns.ts`
- `convex/validators.ts`

### Communities and societies

- `app/communities/index.tsx`
- `convex/communities.ts`
- `convex/schema.ts`

### Donations and payments

- `components/donate-sheet.tsx`
- `convex/stripe.ts`
- `convex/donations.ts`
- `convex/schema.ts`

### Impact and account

- `app/dashboard.tsx`
- `app/account.tsx`
- `convex/donations.ts`

### Engagement

- `convex/engagement.ts`
- `convex/activity.ts`

### Administration and moderation

- `app/admin/index.tsx`
- `convex/campaigns.ts`
- `convex/communities.ts`
- `convex/reviewMessages.ts`
- `convex/adminAudit.ts`

### Authentication and security

- `convex/auth.ts`
- `convex/auth/ResendEmailOTP.ts`
- `convex/auth/AdminEmailOTP.ts`
- `convex/lib/authz.ts`
- `lib/auth-storage.ts`
- `lib/validation/auth.ts`

---

## 21. Final interpretation

Dono is building a trusted digital layer between university communities and the people who want to support them.

Campaigns provide the immediate reason to give: a model, instrument, trip, kit, resource or improvement. Communities provide the enduring relationship: a society, college, department or group that a donor can continue to follow. Verification and moderation provide trust. Stripe provides the payment infrastructure. The impact dashboard and Dono Wrapped provide the feedback that makes generosity feel visible and worthwhile.

The strongest way to understand Dono is therefore:

> **Campaigns are the immediate funding mechanism, but transparent, long-term communities of generosity are the underlying product.**

At present, the repository represents a sophisticated Oxford-first MVP with meaningful full-stack foundations. Its ambition is broader: to make university giving more direct, specific, social, trustworthy and rewarding.
