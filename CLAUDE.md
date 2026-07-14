@AGENTS.md
# CLAUDE.md

## Project

Dono is a crowdfunding platform for university students and student-led societies
to receive funding directly from alumni. Donors browse campaigns, communities
(colleges, societies, departments), and community funds, and donate to specific
projects. Auth is restricted to University of Oxford email addresses.

## Scope — FRONTEND ONLY (hard rule)

You are working on frontend code only.

- **Never create, edit, or delete anything inside `convex/`.** The backend is
  owned by another workflow. You may READ files in `convex/` to understand
  schema, function signatures, and data shapes — but treat the entire
  directory as read-only.
- Never edit `.env.local` or any env file. Never print or paste secret values
  (`AUTH_RESEND_KEY`, Stripe keys, etc.) into output, commits, or logs.
- If a task appears to require a backend change (new Convex function, schema
  change, auth change), STOP and say so — describe what backend change would
  be needed and let a human make it. Do not work around it from the client.

## Commands

```bash
npm install            # install deps (rerun after any git clean / fresh pull)
npm run dev:backend    # Convex dev server (separate terminal — do not manage this)
npm run start          # Expo dev server; press `w` for web
npx tsc --noEmit       # typecheck — run after every change set
npx eslint .           # lint
```

Always run the typecheck (and lint if files changed) before declaring a task done.

## Tech stack & conventions

- Expo with **Expo Router** (file-based routing in `app/`) — one codebase for
  web, iOS, and Android. Prefer cross-platform primitives; avoid web-only or
  native-only APIs unless explicitly asked.
- **TypeScript** everywhere. No `any` unless unavoidable; explain if used.
- **NativeWind (Tailwind)** for all styling via `className`. Do not use
  `StyleSheet.create` or inline style objects unless NativeWind cannot express it.
- Icons: **lucide-react-native** only.
- Data access: use the existing Convex React hooks (`useQuery`, `useMutation`)
  against functions already exported from `convex/`. If the function you need
  doesn't exist, flag it (see Scope) rather than writing one.
- Analytics: PostHog is already wired via provider — use the existing hooks;
  don't reinitialize the SDK.
- Reusable UI lives in `components/`; shared utilities in `lib/`. Match the
  existing patterns in neighboring files before inventing new ones.

## Git rules

- Never commit or push unless explicitly asked.
- When asked to commit: stage only the files relevant to the task — never
  `git add .` blindly.
- One logical change per commit, with a descriptive message.
- Never commit `.env.local`, secrets, or anything in `.gitignore`.
- Never use `git push --force`, `git reset --hard`, or `git clean` without
  explicit instruction.

## Workflow expectations

- For multi-file features, present a short plan before editing.
- If you've attempted the same fix twice without success, stop and summarize
  what you've learned instead of trying a third variation.
- Ask rather than assume when a requirement is ambiguous — especially anything
  touching auth flows, payments, or donation amounts.