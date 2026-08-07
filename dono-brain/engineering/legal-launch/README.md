# Dono legal-launch engineering pack

This folder is the single engineering entry point for everything Dono must build, remove, configure or evidence to make the legal suite accurate.

## Source hierarchy

When files disagree, use this order:

1. [`TRUTH.md`](../../TRUTH.md) — settled product and business decisions.
2. This folder — the authoritative engineering specification and acceptance evidence requirements.
3. [`../../legal/suites/v3.0/`](../../legal/suites/v3.0/README.md) — the current, content-ready legal source. Its Markdown files must be rendered before display. Legal text does not prove that a feature exists.

Any contradiction must be raised before implementation. Engineers must not resolve a legal or commercial ambiguity by choosing a convenient implementation.

## Start here

| File | Purpose |
|---|---|
| [`ENGINEERING_IMPLEMENTATION_CHECKLIST_v2.3.md`](ENGINEERING_IMPLEMENTATION_CHECKLIST_v2.3.md) | Master build/removal/configuration backlog, priorities, acceptance criteria and evidence |
| [`PRIVACY_DPIA_ENGINEERING_NARRATIVE.md`](PRIVACY_DPIA_ENGINEERING_NARRATIVE.md) | One coherent data-flow, retention, privacy and DPIA implementation narrative |
| [`ENGINEERING_MODERATION_REQUIREMENTS_v2.3.md`](ENGINEERING_MODERATION_REQUIREMENTS_v2.3.md) | Detailed moderation, complaints, appeals, CSEA and incident feature specifications |
| [`ONLINE_SAFETY_TRACEABILITY_v2.3.md`](ONLINE_SAFETY_TRACEABILITY_v2.3.md) | Mapping from legal requirement to feature and acceptance test |

The detailed moderation file remains separate because its feature and acceptance-test detail is too large to merge into the master checklist without making both documents harder to use. The privacy narrative is separate because it defines a cross-cutting data model used by payments, identity, content, evidence, moderation and deletion.

## Acceptance and live legal documents

Engineering must implement the three-event [`ACCEPTANCE_MATRIX.md`](../../legal/suites/v3.0/publication-package/ACCEPTANCE_MATRIX.md) as a launch requirement:

- **A — account creation:** accept the Terms of Service and Community Guidelines; show or acknowledge the Privacy Notice; keep cookie consent separate.
- **B — Society onboarding:** accept the Society Campaign Terms and Refund and Dispute Policy, plus the separate active declarations listed in the matrix.
- **C — donation:** accept the Donor Terms and Refund and Dispute Policy; a guest must also accept the Terms of Service; keep optional choices unticked.

The distinction between **accept**, **show/acknowledge** and **separate optional consent** is part of the build specification. Do not collapse the events into a generic legal tick box. Student Campaign Terms are a future document and must never be presented during the Society-only beta.

The correct wording is the current v3.0 source. It still needs to be rendered into accessible in-product HTML and formal PDF files. Build a configurable document registry and permanent version routes against the empty [`legal/live-versions/`](../../legal/live-versions/) handoff location. Do not serve raw Markdown or the current product draft stub. A required acceptance must fail closed if its release-authorised document ID, version, rendered bytes or publication hash is unavailable.

## Legacy engineering material

Older roadmaps, questionnaires, configuration reviews and engineering answers are retained in [`../archive/`](../archive/) as **historical material only**. Their open actions have been absorbed into this folder. They are not competing backlogs and must not be used to revive superseded features or decisions. In particular, [`../archive/superseded-architecture/product-legal-alignment-roadmap.md`](../archive/superseded-architecture/product-legal-alignment-roadmap.md) and [`../archive/superseded-architecture/payments-architecture.md`](../archive/superseded-architecture/payments-architecture.md) contain old positions on verification badges, individual campaigns, fee allocation and owner-only refunds that no longer govern.

Do not create another legal-build list. Add a requirement to the master checklist, put cross-cutting privacy detail in the privacy narrative, and put detailed moderation behaviour in the moderation specification.

## Settled implementation boundaries

- **Beta is Society-only.** Individual campaigns are a planned later release. Individual campaign creation, publication and donation routes must be disabled server-side for beta. Future Student Campaign Terms must not be presented as operative beta terms.
- **Production fee formula is 5% + 20p** and the **demo fee formula is 2% + 20p**, each identical for every card, payment method and country. The applicable schedule is locked to the Campaign. Each is borne by the Campaign Owner unless the Donor actively chooses unticked fee cover. Demo checkout labels Dono's charge **“Payment processing fee (Dono)”** and must distinguish it from Stripe's actual processing cost.
- **No previous payments exist.** Remove the platform-account and variable donor-cost paths before the first payment; no historic transaction-remediation workflow is required.
- **No platform-held funds.** Donations use Stripe Connect direct charges to the Connected Account. Remove the platform-account payment path at the API boundary.
- **Creator age uses the Payment Provider's verified DOB.** Missing, inconsistent or under-18 results fail closed, with a documented correction/review route.
- **Student eligibility follows enrolment, not physical location.** A student temporarily outside the UK remains eligible, but a Connected Account holder must provide a valid UK address and satisfy the Payment Provider's UK onboarding requirements.
- **Society succession uses a new Connected Account.** Suspend new Donations during handover; never attempt to transfer a Stripe account or balance in code. Future Donations use the successor's fully onboarded account; historic transactions remain with the outgoing account.
- **No recurring donations or Match Windows for beta.** Remove them at the API boundary.
- **No Dono identity-document upload.** Stripe performs its own identity process; Dono keeps only the permitted outcome fields.
- **All public UGC remains gated** until the online-safety acceptance tests pass.

## Decisions and confirmations that engineering cannot make

These are the remaining external dependencies. They should not be converted into invented product rules.

| Decision or confirmation | What is needed to close it | Interim engineering rule |
|---|---|---|
| Payments/FCA perimeter | Solicitor confirms direct-charge model and refund mandate. Founders expect this to be a confirmation rather than a major blocker | Never hold, pool, delay, divert or transfer donation funds; do not expand the refund authority |
| Unused platform-account and card-dependent paths | Counsel confirms removal is sufficient on the zero-payment facts | Remove both paths before the first payment; retain negative tests and the founder's zero-payment confirmation |
| Society legal model | Solicitor confirms representative authority, connected-account ownership, limited recourse and the settled replacement-account succession wording | Build the settled Responsible Representative flow; never move a balance or account between representatives |
| Donation/consumer-law characterisation | Solicitor confirms contract formation, information and cancellation treatment | Implement versioned acceptance, exact checkout disclosures and durable copy without guessing at legal labels |
| Special-category/criminal data conditions | Solicitor reviews the APD and the pre-publication/private-draft position | Do not solicit this data; minimise, quarantine and restrict it; never treat a private draft as manifestly public |
| DPIA approval | Data protection lead re-scores the completed system, links evidence and signs; consult ICO only if high residual risk remains | Produce the evidence bundle described in the privacy narrative |
| Stripe/provider roles, DPAs and transfers | Legal/operations verify current contracts, entities, regions and mechanisms | Expose configuration and data-flow evidence; do not label a provider's legal role in code |
| CSEA portal access | NCA response confirming registration and eligible users; training and test completion | Build restricted case handling and evidence/retention controls; do not claim portal readiness yet |
| Insurance interaction | Insurer/broker confirms the crowdfunding/payment activity is accurately disclosed and covered | Do not treat insurance as a substitute for product controls or legal compliance |
| Contributor/IP position | Execute the Team and Contributor Agreement with every contributor and confirm worker-status advice if required | Block production access for anyone not recorded as authorised |
| Display-ready legal publication set | Render the current v3.0 Society-only beta source into accessible HTML and formal PDF, verify it, and place the exact artifacts and hashes in `legal/live-versions/` | Build the registry and routes now; serve only release-authorised immutable artifacts; fail closed while a required document is missing |
| ICO fee registration | Complete the ICO self-assessment and record the outcome | No product choice required |

## Completion rule

An item is not complete because code exists. Completion requires its stated acceptance test, dated evidence, the deployment/commit identifier and the named approver. The Release Control Matrix must link the deployed product to the exact legal-document manifest.
