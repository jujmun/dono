# Dono UK GDPR Article 14 Assessment — third-party data on uploaded receipts

**Version:** 2.3
**Version date:** 6 August 2026
**Document type:** Internal assessment
**Owner:** Amrit Kaur Rooprai (data protection lead)
**Resolves review finding:** F43
**Supports:** Privacy Notice clause 11.5

---

## 1. The processing being assessed

1.1 Campaign Owners upload receipts and invoices to Dono as evidence that campaign funds were spent as described. Those documents may **incidentally** contain personal data about people other than the uploader.

1.2 **Dono did not obtain that data from the data subject**, so Article 14 applies rather than Article 13.

## 2. Categories of third-party data that may appear

| Category | Likelihood | Typical example | Risk if held |
|---|---|---|---|
| Named individual acting for a business supplier (sales assistant, account manager) | High | "Served by Tom" on a till receipt | Very low — business context, minimal |
| Supplier business contact details | High | An email address on an invoice | Very low |
| Delivery recipient name and address | Medium | A courier invoice | Low–medium |
| Another individual named as a co-purchaser or attendee | Low–medium | A group booking | Low–medium |
| Individual's telephone number or email | Low | An order confirmation | Medium |
| Payment card fragment or bank detail belonging to another person | Low | A shared card used for a purchase | **High** |
| Special category data about another person | Very low | Medical items on a pharmacy receipt | **High** |

## 3. Why individual notice is not given — the Article 14(5)(b) disproportionate-effort analysis

3.1 Article 14(5)(b) disapplies the notice obligation where providing it "**proves impossible or would involve a disproportionate effort**", provided appropriate measures are taken to protect the person's rights, freedoms and legitimate interests — including making the information publicly available.

3.2 **The assessment, category by category.**

| Factor | Analysis |
|---|---|
| **Number of data subjects** | Unknown and unknowable in advance. Every receipt could name one or more people, and Dono cannot enumerate them without reading and indexing every document — which would itself increase the processing |
| **Age of the data** | Contemporaneous with the purchase; retained for the evidence period |
| **Appropriate safeguards adopted** | Extensive — see clause 4 |
| **Do we have contact details?** | **Usually not.** A name on a till receipt is not a contact route. Where an email address does appear, it is ordinarily a business address for a supplier, not the individual's own |
| **Effort required to notify** | Dono would have to read every receipt, extract every individual, determine which are personal rather than business contacts, find a contact route for each, and send a notice. For a small volunteer team processing evidence for student campaigns, this is disproportionate to any benefit |
| **The notice would itself be intrusive** | Contacting someone who appears incidentally on a receipt requires processing **more** of their data, and creates a communication they did not expect about a platform they have never used. The privacy cost of notifying may exceed the privacy benefit |
| **Impact of not notifying** | Low for most categories. The data is used only to check an expenditure figure, is not used to make any decision about the person, is never published, is never shared, is never used to contact them, and is deleted with the evidence |
| **Reasonable expectations** | A supplier named on an invoice would reasonably expect that invoice to be shown to whoever is checking the buyer's spending. That is what receipts are for |

3.3 **Conclusion.** For every category except payment fragments and special category data, providing individual notice **would involve a disproportionate effort**, and the Article 14(5)(b) exception is available, supported by the safeguards in clause 4 and by making the Privacy Notice publicly available. **The measure Dono takes in place of individual notice is the publicly available Privacy Notice clause 11, which describes the processing specifically rather than generically.**

3.4 **Where the exception is not relied on.** Where Dono holds a direct contact route for an identified individual (not a business), **and** the data is of a category rated medium or high in clause 2, **and** it is retained rather than rejected, Dono gives **direct notice**. In practice this should be rare, because clause 4 is designed to stop such data being retained at all.

## 4. Safeguards — minimisation at source

| # | Safeguard | Effect |
|---|---|---|
| S1 | **Mandatory pre-upload guidance** listing exactly what must be redacted and what must be kept, shown before every upload | Stops most third-party data entering the system |
| S2 | **Contractual obligation** on Campaign Owners to redact (Student Campaign Terms clause 7.2; Society Campaign Terms clause 4.1) | Enforceable; breach is a ground for rejection and enforcement |
| S3 | **Validation and reviewer check** for unnecessary personal data (reviewer checklist item 11) | Catches what slips through |
| S4 | **Rejection and quarantine**: a non-compliant receipt is not accepted into the evidence store; it goes to a short-retention quarantine and is **automatically deleted after 30 days** | Limits exposure to 30 days |
| S5 | **Dono may itself redact** before acceptance | Reduces retained data |
| S6 | **Minimum retention on acceptance** — supplier, item, amount, date, reference | Limits what persists |
| S7 | **Never published.** Receipts are private to Dono and are never shown to donors | No public exposure |
| S8 | **Restricted, logged access** | Limits internal exposure |
| S9 | **Defined retention** — 6 years for accepted evidence, 30 days for quarantine | No indefinite holding |
| S10 | **Publicly available Privacy Notice clause 11**, describing this processing specifically | The Article 14(5)(b) measure |
| S11 | **A route to object**: anyone who believes their data is on a receipt Dono holds can contact Dono, and Dono will locate, assess and delete or restrict it | Rights are effective in practice |

4.1 **Hard rule.** Payment-card fragments, bank details and special category data about a third party are **never knowingly retained**. Where they are found, the receipt is rejected and quarantined, or the data is redacted before acceptance.

## 5. Lawful basis for the underlying processing

| Element | Position |
|---|---|
| Article 6 | **Legitimate interests** — verifying that campaign funds were used as donors were told, which protects donors and the integrity of the Platform. A Legitimate Interests Assessment is recorded |
| Article 9 | Not relied on. Special category data is not knowingly retained. Where it appears, the receipt is rejected |
| Article 10 | Not applicable |
| Balancing | The interest is substantial (donor protection, fraud prevention); the impact is minimal because of the safeguards; the processing is narrow and time-limited; and there is no less intrusive way of verifying expenditure than looking at the receipt |

## 6. Review

6.1 This assessment is reviewed **annually**, and immediately if: the volume of evidence uploads changes materially; a complaint is received from a third party named on a receipt; the categories in clause 2 change; or any safeguard in clause 4 is removed or fails.

6.2 **The assessment depends on the safeguards being real.** If S1, S3 or S4 are not implemented, the disproportionate-effort conclusion in clause 3.3 is weakened and must be reassessed before receipts are accepted at volume.

---

## Approval and version control

| Field | Entry |
|---|---|
| Document | Dono UK GDPR Article 14 Assessment |
| Version | 2.3 |
| Version date | 6 August 2026 |
| Accountable owner | Amrit Kaur Rooprai (data protection lead) |
| Reviewed by / Approved by | *(to be completed)* |
| Outstanding before it is fully supported | S1 (pre-upload guidance), S3 (validation and reviewer check), S4 (quarantine and 30-day auto-delete) must be implemented. See `ENGINEERING_IMPLEMENTATION_CHECKLIST_v2.3.md`, items RC-01 to RC-04 |
| Solicitor review outstanding on | Whether the disproportionate-effort conclusion holds for the delivery-recipient and co-purchaser categories |
| Next scheduled review | 6 August 2027 |
| Supersedes | No previous version — new in v2.3 |
