# Legitimate Interests Assessments (LIAs) — Dono

Owner: Amrit (data protection lead)
Last updated: 30 July 2026

Each assessment follows the ICO's three-part test: purpose, necessity, balancing.

## LIA 1 — Fraud prevention

**Purpose test.** Dono has a legitimate interest in preventing fake campaigns, stolen-card use, and fake beneficiaries — this protects donors, genuine campaign creators, and the platform's integrity and viability.

**Necessity test.** Manual review of every campaign, and use of Stripe's fraud signals, are necessary to this purpose. There is no less intrusive way to achieve the same level of assurance at Dono's current scale (automated-only screening would be less reliable at this stage).

**Balancing test.** The individuals affected are campaign creators and, incidentally, donors and third parties named on receipts. The processing is proportionate: it uses data already collected for verification/moderation purposes, does not involve additional intrusive collection, and directly benefits the individuals whose funds or donations are protected from fraud. Risk to individuals is low provided access is restricted to those with a fraud/moderation role.

**Outcome:** legitimate interests applies. Review if fraud detection moves to automated/algorithmic scoring, which would need its own assessment (and likely DPIA update).

## LIA 2 — Dispute resolution

**Purpose test.** Dono needs to resolve donor disputes about use of funds (e.g. a donor alleging a campaign misrepresented its purpose) to maintain trust and meet its obligations to donors.

**Necessity test.** Handling disputes requires access to the relevant campaign, transaction, and correspondence records. This is currently an informal process — formalising it (a documented intake, investigation, and resolution step) doesn't change the lawful basis but will make this LIA easier to evidence in practice.

**Balancing test.** Affected individuals (donors, campaign creators) would reasonably expect Dono to investigate a dispute they raised or that concerns their campaign. Processing is limited to what's needed for the specific dispute and retained only until it's resolved (plus the standard transaction retention period). Low risk to individuals.

**Outcome:** legitimate interests applies. Recommend formalising the dispute process (a short internal procedure: intake → investigation → decision → communication) so this LIA has a clear process to point to.

## LIA 3 — Platform security and improvement

**Purpose test.** Dono has a legitimate interest in keeping the platform secure and understanding how it's used, to fix problems and improve the product (via PostHog analytics and general security monitoring).

**Necessity test.** Basic usage analytics and security logging are necessary to operate a platform responsibly; alternatives (no monitoring at all) would leave Dono unable to detect abuse, outages, or usability problems.

**Balancing test.** Users would generally expect a platform to monitor for security and to use aggregated/pseudonymised analytics to improve the service. Risk is kept low by pseudonymising analytics data where feasible and not using it for individual profiling beyond what's needed for the stated purpose.

**Outcome:** legitimate interests applies. Confirm PostHog is configured to minimise identifiable data where possible (e.g. avoid unnecessary capture of free-text inputs).

## LIA 4 — Backups

**Purpose test.** Dono has a legitimate interest in maintaining backups for business continuity and disaster recovery — losing platform data would harm every user, not just Dono.

**Necessity test.** Backups necessarily mirror live data; there's no meaningfully less intrusive way to achieve recoverability.

**Balancing test.** Backup data carries the same risk profile as live data, so it should be subject to the same access controls and an equivalent (or shorter) retention/rolling-deletion window. Provided backups aren't retained indefinitely or accessed outside recovery scenarios, risk to individuals is low.

**Outcome:** legitimate interests applies. Fix a specific rolling backup window (e.g. 30–90 days) rather than leaving retention open-ended, and record it in the ROPA once decided.
