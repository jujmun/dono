<wizard-report>
# PostHog post-wizard report

The wizard completed a deep integration of PostHog into the Dono Expo app. The SDK was already installed (`posthog-react-native` v4.54.4) and the `PostHogProvider` was already wired up in `app/_layout.tsx`. The wizard added manual screen tracking via Expo Router, and instrumented all critical user-facing actions: viewing campaigns, initiating donations, selecting donation amounts, liking/following/sharing campaigns, following communities, and launching new fundraising campaigns.

| Event name | Description | File |
|---|---|---|
| `campaign_viewed` | Fired when a user views a campaign detail page, marking the top of the donation funnel. | `app/campaigns/[id].tsx` |
| `donation_started` | Fired when a user taps the Donate Now button on a campaign page. | `app/campaigns/[id].tsx` |
| `donation_amount_selected` | Fired when a user selects a preset donation amount on a campaign page. | `app/campaigns/[id].tsx` |
| `campaign_liked` | Fired when a user likes a campaign. | `app/campaigns/[id].tsx` |
| `campaign_followed` | Fired when a user follows a campaign to receive updates. | `app/campaigns/[id].tsx` |
| `campaign_shared` | Fired when a user shares a campaign. | `app/campaigns/[id].tsx` |
| `campaign_created` | Fired when a user successfully launches a new fundraising campaign. | `app/create.tsx` |
| `community_followed` | Fired when a user follows a community. | `app/communities/[id].tsx` |
| `user_signed_in` | Fired on successful sign-in (pre-existing). | `app/signin.tsx` |
| `user_signed_up` | Fired on successful sign-up (pre-existing). | `app/signin.tsx` |

Screen tracking (automatic, via `posthog.screen()`) was added to `AppTree` in `app/_layout.tsx`, covering all route transitions.

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://eu.posthog.com/project/219186/dashboard/803820)
- [Donation conversion funnel](https://eu.posthog.com/project/219186/insights/8AWRcSqQ)
- [Campaign views](https://eu.posthog.com/project/219186/insights/omYQ0uRk)
- [Campaign creations over time](https://eu.posthog.com/project/219186/insights/tmToYRVt)
- [Campaign engagement actions](https://eu.posthog.com/project/219186/insights/GtOjnhc1)
- [Sign-ups and sign-ins](https://eu.posthog.com/project/219186/insights/gDWqcunn)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `EXPO_PUBLIC_POSTHOG_API_KEY` and `EXPO_PUBLIC_POSTHOG_HOST` to `.env.local.example` and any team onboarding docs so collaborators know what to set. (These keys are already in `.env.local.example` but confirm the values are documented.)
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is only called on fresh login/signup in `app/signin.tsx`. A user who reopens the app with an active session will be on an anonymous distinct ID until they sign in again. Consider calling `posthog.identify(userId, ...)` when `isAuthenticated` becomes `true` in `AuthGuard`, using the Convex user ID as the distinct ID rather than the user's email.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
