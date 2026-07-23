# Dono Brain

The **knowledge base for Dono** — the community infrastructure for transparent
university giving. This repository is the single source of truth for how Dono is
conceived, designed, built, governed, and researched. It holds context documents
and handoffs rather than application code; think of it as the company's shared
long-term memory.

> **Dono in one sentence:** a mobile-first platform that lets young alumni and
> students collectively fund tangible, transparent improvements to student life —
> campaigns are the content, communities are the product.

---

## How this repository is organised

Documents are grouped by **domain**. Each top-level folder owns one area of the
business, so you can go straight to the context you need without reading
everything.

| Folder | Domain | What lives here |
|---|---|---|
| [company/](company/) | **Vision & strategy** | Mission, problem, core insight, product philosophy, business model, long-term vision |
| [product/](product/) | **Product** | The comprehensive product & repository overview: user journeys, product areas, data model, technical architecture |
| [design/](design/) | **Design & UX** | Psychological, community and donation design strategy; brand, IA, flows, gamification, copy, accessibility |
| [engineering/](engineering/) | **Engineering** | Payments/disputes/risk architecture and engineering change handoffs |
| [legal/](legal/) | **Legal & policy** | Terms of Service structure, eligibility, use-of-funds rules, verification, fee model, IP/branding, and data handling |
| [corporate/](corporate/) | **Corporate & founders** | Incorporation, cap table, founder equity, vesting, immigration constraints, required documents |
| [research/](research/) | **Research** | Student survey instrument and responses; market research; college development-office and advisor meeting notes |

---

## Folder contents

### [company/](company/) — Vision & strategy
- [company-context.md](company/company-context.md) — Foundational company context (v2.0): vision, mission, the problem, core insight, trust model, community model, business model, and guiding beliefs.
- [history/](company/history/) — Prior iterations of the product concept:
  - [alma-matters-v1-product-overview.pdf](company/history/alma-matters-v1-product-overview.pdf) — **Alma Matters**, the v1.0 (March 2026) product overview and first iteration of what became Dono. Originally framed as a three-sided platform (students, alumni, institutions) built around student requests, peer upvoting, and alumni funding. Kept for historical context on how the product concept evolved into Dono's current campaign/community model.

### [product/](product/) — Product
- [comprehensive-product-overview.md](product/comprehensive-product-overview.md) — The master product document: user personas and journeys, all main product areas (homepage, campaigns, communities, funds, Dono Wrapped, admin), trust & verification, payments model, data model, and technical architecture.

### [design/](design/) — Design & UX
- [design-psychology-and-community-guide.md](design/design-psychology-and-community-guide.md) — Design strategy grounded in donation psychology and research: brand and visual identity, information architecture, campaign cards/pages, donation flow, post-donation experience, community features, gamification, notifications, copy/tone, accessibility, metrics, and a design-review checklist.

### [engineering/](engineering/) — Engineering
- [payments-architecture.md](engineering/payments-architecture.md) — Payments, disputes & risk architecture. The governing principle ("donor money must never pass through Dono"), Stripe Connect Standard direct-charge model, refund vs chargeback lifecycles, evidence/data-retention requirements, fraud controls, and deferred items.
- [engineering-change-handoff.docx](engineering/engineering-change-handoff.docx) — Engineering change handoff (binary doc).

### [legal/](legal/) — Legal & policy
- [legal-terms-context-handoff.md](legal/legal-terms-context-handoff.md) — Legal terms & policy context: operator identity, geographic scope and eligibility, document architecture, proposed Terms of Service structure, verification, use-of-funds and surplus rules, society campaigns, and the fee model.
- [ip-branding-and-data-notes.md](legal/ip-branding-and-data-notes.md) — Informal legal guidance on trademark/branding protection, confidentiality, GDPR-safe data handling, and tax.

### [corporate/](corporate/) — Corporate & founders
- [founder-context-handoff.md](corporate/founder-context-handoff.md) — Founder structure & incorporation context: five-founder situation, UK Ltd structure, proposed cap table, founder option agreements for visa-holding founders, vesting, directors, required legal documents, and open immigration questions.

### [research/](research/) — Research
- [student-survey.docx](research/student-survey.docx) — The student research survey instrument.
- [responses/](research/responses/) — Raw survey response exports:
  - [survey-responses-batch-1.csv](research/responses/survey-responses-batch-1.csv)
  - [survey-responses-batch-2.csv](research/responses/survey-responses-batch-2.csv)
- [market-research-notes.md](research/market-research-notes.md) — Market data behind the Dono pitch (UK giving decline, student cost pressures), the OxReach prior-art precedent, three-sided customer segmentation, full Fable student-survey analysis, and a note on US fraternity alumni giving.
- [meetings/](research/meetings/) — Notes from calls with Oxford college development
  offices and advisors, on existing fundraising models, channels, and go-to-market
  advice (used to ground Dono's product against how colleges actually raise money
  today):
  - [lmh-development-strategy.md](research/meetings/lmh-development-strategy.md) — LMH's two-tier (mass + major gift) fundraising approach.
  - [worcester-fundraising-model.md](research/meetings/worcester-fundraising-model.md) — Worcester's telethon, giving day, and regular giving program.
  - [david-parker-st-hughs-development-fund.md](research/meetings/david-parker-st-hughs-development-fund.md) — St Hugh's Development Fund; Oxford fundraising landscape overview (09 Jul 26).
  - [kate-gaffka-gtc-alumni-engagement.md](research/meetings/kate-gaffka-gtc-alumni-engagement.md) — GTC Alumni Engagement Team; international alumni and tax-effective giving (10 Jul 26).
  - [tilly-hertford-development-fund.md](research/meetings/tilly-hertford-development-fund.md) — Hertford Development Fund overview (10 Jul 26).
  - [murray-univ-development-office.md](research/meetings/murray-univ-development-office.md) — Univ Development Office; donation pipeline overview (15 Jul 26).
  - [martha-univ-head-of-development.md](research/meetings/martha-univ-head-of-development.md) — Univ Head of Development; donation process and alumni relations (16 Jul 26).
  - [olivia-tan-christ-church.md](research/meetings/olivia-tan-christ-church.md) — Christ Church; fundraising channels and effectiveness (21 Jul 26).
  - [milos-martinez-st-cross-development-office.md](research/meetings/milos-martinez-st-cross-development-office.md) — St Cross Development Office fundraising overview (22 Jul 26).
  - [sean-rainey-magdalen-development-fund.md](research/meetings/sean-rainey-magdalen-development-fund.md) — Magdalen's contrarian, major-gifts-only view: skeptical of small-donor pipelines and student-led platforms.
  - [will-gregory-advisor-call.md](research/meetings/will-gregory-advisor-call.md) — Advisor call on UK vs US philanthropy culture, the difficulty of working with universities, and for-profit vs. fiscal-sponsorship structuring.

---

## Conventions

- **One domain per top-level folder.** Add new documents to the folder that owns
  the subject; create a new domain folder only when a document genuinely fits
  none of the above.
- **File names are lower-case kebab-case** and describe the content, not the date
  or author. Where a document is a point-in-time handoff, keep the date inside the
  document rather than in the filename.
- **Markdown is the default format.** Binary sources (`.docx`, `.pdf`, `.csv`) are
  kept alongside the relevant domain; prefer a Markdown summary in-repo when the
  content is worth reading often.
- **When you add or move a file, update this README** so the index stays the
  single source of navigation.
