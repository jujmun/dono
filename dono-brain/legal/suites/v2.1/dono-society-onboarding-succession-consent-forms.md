# Society Onboarding, Succession & Checkout Consent Forms

**Version:** Working draft v0.1 — 30 July 2026
**Status:** DRAFT — NOT FOR PUBLICATION. Internal form specifications supporting the Society Campaign Terms and Terms of Service (clauses 6, 15, 11.3, 16.4). Flagged items need a decision or solicitor sign-off before build.

---

## 8.1 Society Representative Onboarding Form

Completed by the Responsible Individual (Society Representative) before a Society Campaign can be created, alongside the identity and student-status checks already required under clause 6.

**Fields captured:**

1. Full name
2. University email address (must be a valid address at the Recognised Institution — clause 6.1)
3. Role held within the Society (e.g. President, Treasurer, Secretary, other named office)
4. Society name and Recognised Institution
5. **Authority declaration** (must be actively ticked, not pre-checked): *"I confirm I am authorised under the Society's constitution, or equivalent governing document, to create and operate Campaigns on the Society's behalf, to authorise the receipt of Donations, and to accept the Society Campaign Terms and Refund and Dispute Policy for the Society."*
6. **Refund/chargeback acknowledgement** (mirrors clause 15.2): *"I understand that the Recipient is responsible for refunds and chargebacks associated with the Connected Account."*
7. **Asset-owner field** — who will legally hold and receive the funds (this determines the Connected Account holder under clause 15.1). One of:
   - The Society itself (unincorporated association)
   - The College or University (via its own account)
   - A registered charity
   - A named trustee
   - The Society's office-holder(s) personally, acting as authorised Society Representative
8. **Constitutional-approval evidence, scaled to campaign target.** The evidence required increases with the funding target, rather than a single binary "large campaign" cut-off:
   - **Under £2,500:** confirmation from the campaign creator that the committee has approved the Campaign.
   - **£2,500–£10,000:** written confirmation from two current committee officers.
   - **Over £10,000:** formal committee approval — minutes, a written resolution, or equivalent evidence permitted by the Society's constitution.

   Dono may request further evidence at any tier where a Campaign appears unusually risky. Satisfying these checks does not mean Dono endorses the Campaign or guarantees the Society has complied with its own constitution. The Society Campaign Terms should state these thresholds, the evidence required at each, Dono's right to ask for more, and this non-endorsement point. **[CONFIRM — these bands are a commercial risk decision, not a legal requirement; sign off the figures before publication.]**

**Record-keeping:** each submission is stored as a durable copy — submitter, role, Society, Campaign (where known), document versions accepted, wording shown, and timestamp — consistent with clause 2.2.

---

## 8.2 Succession Form

Captures the primary and secondary Society Representative at Campaign setup, and governs what happens when the primary changes.

**At setup:**

1. Primary Representative — name, university email, role
2. Secondary Representative — name, university email, role (a named backup contact; does not need to complete Stripe onboarding unless and until they become primary)

**Change-of-representative flow**, triggered when the primary steps down, graduates, or is replaced:

1. **Verify incoming representative.** The incoming Representative completes the same checks as onboarding (clause 6): valid university email, student-card check, current student status, and the Section 8.1 authority declaration.
2. **Committee confirmation.** The Society confirms the change was made in line with its constitution, using an evidence hierarchy rather than a single mandatory form (many student societies operate informally, and requiring minutes in every case could exclude legitimate changes without materially improving protection):
   - **Preferred:** approved committee minutes or a written committee resolution.
   - **Alternative:** written confirmation from two current officers, one of whom should ordinarily be the president, chair, treasurer or secretary.
   - **Officer-transition fallback:** confirmation from the outgoing principal officer and one current or incoming officer — used only where Dono can verify both individuals' roles; this should not become the standard route.
   - **Exceptional fallback:** another form of evidence accepted by Dono following manual review.

   Each signatory confirms: their name and committee role; that the Society has approved the change; the funding target and intended use of the Campaign; who is authorised to operate the connected Stripe account; that the change does not conflict with the Society's constitution or any known institutional rules; and that the Society will tell Dono if approval is withdrawn or the authorised officers change again.
3. **Connect Stripe.** Where the outgoing Representative was themselves the Connected Account holder (asset-owner = "Society Representative" in Section 8.1), the incoming Representative must complete their own Stripe Connect onboarding and KYC before the change takes effect. Where the asset-owner is the Society, College/University or a charity account, this step may not be needed — confirm the account holder is unchanged.
4. **Balance handling.** Any funds already raised but not yet paid out, and any funds already paid to the outgoing Representative's Connected Account, must be accounted for before the change is treated as complete:
   - record the balance at the point of handover;
   - where the Connected Account itself is changing, the balance must be transferred to the incoming Representative's new Connected Account, or to the Society/institution account, before the old account is disconnected;
   - the Campaign is paused (no new payouts) between steps 1–4 completing, consistent with the "frozen until resolved" approach used elsewhere for donor protection (clause 14.4).
5. Once all steps are confirmed, the incoming Representative becomes primary and the Campaign resumes.

**Record-keeping:** each change is logged with the date, outgoing and incoming Representative, evidence reviewed at step 2, and confirmation that steps 3–4 were completed (or were not needed, and why).

---

## 8.3 Checkout Consent Capture

Each of the following is a **separate, specific consent** — none may be bundled with another or with acceptance of the Donor Terms generally. For each, Dono stores: the exact wording displayed, a version identifier for that wording, and the timestamp of the donor's choice, tied to the specific Donation.

1. **Fee cover.** *"Cover the fees so [Campaign] receives the full [amount]"* — unticked by default; charged only if the Donor actively selects it (clause 16.4).
2. **Hide my name.** *"Hide my name"* — not labelled "anonymous". The donation amount remains publicly displayed regardless of this choice, and the re-identification risk (that hiding a name doesn't guarantee anonymity) is shown at the point of selection (clause 11.3).
3. **Institution data-sharing consent — do not build until the data flow is defined.** A vague or unused consent checkbox creates unnecessary compliance risk and may mislead donors into thinking an institution is formally involved in the Campaign. Before this is built, Dono needs to decide:
   - whether the feature is genuinely required, and for what legitimate purpose — for example, letting a college or university development office thank or recognise donors, including donors in institutional fundraising records, letting the institution contact donors about the specific Campaign, or providing aggregate reporting;
   - which institutions can receive data;
   - exactly what data is shared (e.g. name, email, donation amount, Campaign);
   - whether Donors who hid their name are excluded;
   - what the institution may use the data for, and whether it becomes an independent controller for that use;
   - how consent can be withdrawn, and that withdrawal stops future sharing but cannot reverse data already lawfully disclosed.

   Once defined, the checkbox must be optional, unticked by default, separate from accepting Dono's Terms, and specific about the recipient and purpose — it must not bundle in unrelated marketing or general alumni communications.

   **Interim default until this is built out:** Dono does not share identifiable Donor information with universities, colleges or other institutions for their own fundraising or relationship-management purposes unless the Donor has separately and expressly agreed to that specific sharing. Dono may still provide genuinely anonymised or aggregate campaign statistics, provided individuals cannot reasonably be identified.
4. **Marketing consent.** A separate, specific opt-in for Dono (and/or the Institution, if distinct) to contact the Donor about future campaigns or updates — unticked by default, independent of the data-sharing consent in item 3.

**Storage requirement:** each of the four choices above is recorded independently, even where a Donor accepts or declines several at once, so that a later change to one consent's wording doesn't retroactively affect the record of what an earlier Donor actually saw and agreed to.
