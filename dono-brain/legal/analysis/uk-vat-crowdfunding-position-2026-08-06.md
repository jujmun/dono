# Dono: UK VAT and tax position for the proposed crowdfunding model

**Date:** 6 August 2026  
**Status:** Working legal and tax position for implementation; obtain written sign-off from a UK VAT adviser before launch and again before VAT registration or any overseas/trader expansion.

## Executive position

Dono's platform or application fee is consideration for a platform service. The better and operationally safest view is that this is a standard-rated taxable supply, not an exempt financial service. The fact that the fee is collected through Stripe Connect, and that Dono does not hold campaign money, does not make Dono's service exempt. HMRC distinguishes the execution of a payment from technical and administrative payment-handling services; the latter do not obtain the financial-services exemption. Most goods and services that are not expressly relieved are taxed at 20%. [HMRC, VATFIN2450](https://www.gov.uk/hmrc-internal-manuals/vat-finance-manual/vatfin2450); [GOV.UK, VAT rates](https://www.gov.uk/vat-rates).

Dono is not currently VAT registered. It therefore must not add an amount described as VAT or issue a VAT invoice. It must register when the UK taxable turnover of the sole-trader business exceeds £90,000 in any rolling 12-month period, or when it expects that turnover to exceed £90,000 in the next 30 days alone. It may register voluntarily below that figure if it makes or intends to make taxable supplies. The threshold is not a financial-year test. [GOV.UK, when to register for VAT](https://www.gov.uk/register-for-vat/when-register-for-vat); [Value Added Tax (Increase of Registration Limits) Order 2024](https://www.legislation.gov.uk/uksi/2024/307/pdfs/uksi_20240307_en.pdf).

Only Dono's own consideration for taxable supplies counts as Dono's sales turnover. Campaign receipts paid by direct charge into a connected account are not Dono's revenue merely because Dono's software initiated the payment or Dono can see the transaction. Dono's application fee is platform revenue. Stripe processing fees charged to the connected account are the connected account holder's cost, not Dono's cost or revenue. Any Stripe or other overseas service supplied to Dono on which Dono must apply the reverse charge must also be included in the registration calculation in the manner HMRC prescribes. [HMRC, VAT Notice 741A, paragraph 5.7](https://www.gov.uk/guidance/vat-place-of-supply-of-services-notice-741a); [Stripe, direct charges](https://docs.stripe.com/connect/direct-charges?locale=en-GB).

Dono should use one supply model consistently: the Campaign Owner receives Dono's campaign-hosting and platform service. A donor who selects fee cover makes a third-party payment towards the Campaign Owner's transaction costs. The fee-cover toggle should not be allowed to change the identity of Dono's customer. HMRC requires the economic reality and direction of the supply to be identified; payment by a third party does not by itself make that payer the recipient. [HMRC, VATSC06316](https://www.gov.uk/hmrc-internal-manuals/vat-supply-and-consideration/vatsc06316); [HMRC, VATSC11522](https://www.gov.uk/hmrc-internal-manuals/vat-supply-and-consideration/vatsc11522).

Commercial and entrepreneurial campaigns should remain disabled until Dono implements a separate trader pathway. That pathway must identify the trader and the legal recipient of Dono's service, collect tax and location evidence, determine whether campaign payments are gifts or consideration, support compliant invoicing, give the required consumer/trader disclosures, and route rewards or sales away from the donation-only terms. This is an operational risk control, not a conclusion that every payment to a commercial venture is automatically subject to VAT.

## 1. VAT liability of Dono's fees

### 1.1 The fee is standard-rated

Dono supplies campaign hosting, access to fundraising tools, pre-publication review, moderation, transaction administration, record generation and an internal refund process. The Campaign Owner receives those services in return for the platform fee. That is a direct supply for consideration.

No identified exemption covers this composite service. Dono does not itself execute the bank or card transfer and should not describe the fee as exempt payment processing. HMRC's published position is that technical or administrative payment handling does not fulfil the essential functions of a transfer of money and is not brought within the financial-services exemption. The platform fee should therefore be treated as standard-rated when its place of supply is the UK and Dono is VAT registered.

The rate applies to Dono's consideration, not to the campaign contribution. Under the proposed direct-charge flow:

- the **campaign contribution** belongs to the Campaign Owner or other disclosed Recipient;
- the **Dono platform fee** is Dono's taxable consideration;
- the **Stripe processing fee** is a separate charge by Stripe to the connected account holder under the present fee-payer configuration; and
- an optional **fee-cover amount** is a funding mechanism. It should be allocated between the Campaign Owner's Dono fee and Stripe cost in the transaction ledger; it should not be booked wholesale as Dono revenue.

The current engineering record describes a one-off-payment fee envelope and a different recurring-payment calculation. Before launch, the code, checkout, ledger and terms must use one effective-dated fee formula. VAT must be calculated on the application fee Dono actually earns, not on an estimated Stripe fee or the entire donation.

### 1.2 Dono should not rely on the user's tax covenant

A term saying that users are responsible for their taxes cannot transfer Dono's output-VAT, registration, invoicing, record-keeping or return obligations. The terms may accurately say that each Campaign Owner must determine the tax treatment of its own receipts, but they must separately state Dono's responsibility for its fees.

## 2. Registration: compulsory, voluntary and threshold revenue

### 2.1 Compulsory registration

As at the date of this paper, the compulsory threshold is **more than £90,000** of taxable turnover. Registration is required under either test:

1. **Backward-looking test:** at the end of every month, total taxable turnover for the previous 12 months is more than £90,000. The application is due within 30 days after the end of the month in which the threshold was crossed; the normal effective date is the first day of the second month after crossing.
2. **Forward-looking test:** at any time, Dono expects taxable turnover in the next 30 days alone to exceed £90,000. The effective date is the date on which that expectation arose, and the application is due by the end of that 30-day period.

Late registration can make Dono liable for VAT from the date it should have registered, even if its customer-facing price did not include an additional VAT amount. [GOV.UK, when to register](https://www.gov.uk/register-for-vat/when-register-for-vat).

### 2.2 What counts

The registration calculation belongs to the legal person carrying on the business: currently Amrit Kaur Rooprai as sole trader. It must aggregate taxable turnover from all of that person's business activities, not only transactions carrying the Dono name.

Include:

- Dono application/platform fees for UK-place supplies, before deducting Stripe payout charges or other business expenses;
- any subscriptions, listing charges, service charges, advertising, sponsorship or other standard-, reduced- or zero-rated business supplies made by the same sole trader;
- the value of imported B2B general-rule services for which the business must apply the reverse charge, including any relevant Stripe services supplied to Dono from outside the UK; and
- non-cash consideration and other items HMRC expressly includes in taxable turnover.

Exclude:

- gross campaign contributions that are direct charges to connected accounts and are never supplied to Dono as principal;
- Stripe processing fees charged to and borne by the connected account holder;
- genuine reductions or reversals of Dono's own fee, recorded as changes in consideration;
- exempt supplies; and
- supplies whose place of supply is outside the UK, although those supplies and the evidence supporting their treatment must still be recorded and may create foreign registration obligations.

The calculation is turnover, not profit. Dono may not deduct software, marketing, Stripe, refund, dispute or other expenses from taxable turnover. HMRC defines taxable turnover as the total value of what the business sells that is not exempt or outside scope. [GOV.UK, taxable-turnover calculation](https://www.gov.uk/register-for-vat/when-register-for-vat).

### 2.3 Voluntary registration

Dono may register below £90,000 if it makes or intends to make taxable supplies. Voluntary registration would permit recovery of qualifying input VAT but would require Dono to account for output VAT, keep digital VAT records and file returns. Because many Campaign Owners will be consumers or bodies unable to recover VAT, voluntary registration will either increase the all-in fee or reduce Dono's margin if the advertised price is held constant. A quantified input-VAT and pricing model should be prepared before electing.

At an advertised VAT-inclusive platform price of £3.50, output VAT at 20% is £0.5833 and net revenue is £2.9167. If Dono wishes to preserve £3.50 of net revenue, the VAT-inclusive price becomes £4.20. The commercial decision must be made and implemented before the registration date; it cannot be hidden in later checkout steps.

## 3. Displayed fees and VAT-inclusive prices

Consumer-facing prices must show the total price, including unavoidable fees, taxes and charges. If the whole price cannot reasonably be calculated in advance, the calculation method must enable the consumer to calculate it and must be as prominent as the headline price. [Digital Markets, Competition and Consumers Act 2024, section 230](https://www.legislation.gov.uk/ukpga/2024/13/pdfs/ukpga_20240013_en.pdf); [CMA, Price transparency](https://www.gov.uk/government/publications/price-transparency-cma209).

Before registration, checkout may accurately state: **"Dono is not VAT registered. No VAT is charged."** It should not say that the service is exempt or zero-rated.

From the effective date of registration:

- every consumer-facing headline and checkout total must be VAT-inclusive;
- the last confirmation button must show the exact total the donor will pay;
- the breakdown may show the net Dono fee and VAT, but the VAT-inclusive total must remain prominent;
- any percentage description must state whether the percentage is VAT-inclusive; and
- B2B material may quote a VAT-exclusive price only where it is genuinely directed to business customers and clearly adds VAT. The shared public checkout should remain VAT-inclusive.

## 4. Supply, invoices and donation confirmations

### 4.1 Recommended supply map

| Payment element | Supplier | Customer/recipient | Document |
|---|---|---|---|
| Campaign contribution | Campaign Owner | Donor is contributor; no supply to donor if nothing is provided in return | Donation confirmation, not VAT invoice |
| Dono platform service | Dono | Campaign Owner | Fee statement now; VAT invoice after registration where required |
| Donor fee cover | Donor pays towards Campaign Owner's costs | Does not change the recipient of Dono's service | Shown on donation confirmation and Campaign Owner fee statement |
| Stripe processing | Stripe | Connected account holder under current direct-charge setup | Stripe fee record/tax invoice to connected account holder |

The legal customer must be identified from the service and contract, not the source of cash. For an individual Campaign, it is normally the named Campaign Owner. For a Society Campaign it is the Society or other expressly identified legal recipient of Dono's service; if a college, charity or individual merely holds the connected account, that alone does not make that account holder Dono's customer.

### 4.2 Donor document

The donor should receive a **donation confirmation** that states:

- Dono acts as the Campaign Owner's disclosed agent for the confirmation;
- the Campaign Owner and connected-account Recipient;
- date, currency, campaign contribution and total charged;
- optional fee cover;
- Dono platform fee and Stripe processing amount as separate lines;
- refund or partial-refund amounts when applicable;
- "not a charitable tax receipt", "no Gift Aid claimed" and "not a VAT invoice"; and
- a unique payment reference and applicable terms version.

If a future campaign supplies goods, rewards or services to the donor, the campaign operator—not Dono—must determine whether it must issue a sales/VAT invoice. That scenario is outside the present donation-only pathway.

### 4.3 Dono fee invoice

Before registration, Dono should provide the Campaign Owner with a normal fee statement containing Dono's legal name/trading name, address, customer, campaign/payment reference, supply date, amount and any later reversal. It must not show VAT as charged.

After registration, Dono must issue VAT invoices where legally required. A VAT invoice is generally required for a supply to a VAT-registered customer and normally must be issued within 30 days of the tax point. Retail simplifications can apply at £250 or less, but Dono should build a full compliant invoice or a compliant periodic statement rather than rely on consumer emails. HMRC states that VAT invoices are not required for customers who are not VAT registered, although Dono should still give them a receipt. [HMRC, VAT Notice 700, invoicing](https://www.gov.uk/guidance/vat-guide-notice-700); [GOV.UK, invoice contents](https://www.gov.uk/invoicing-and-taking-payment-from-customers/invoices-what-they-must-include).

The invoice dataset must include the supplier's legal name, address and VAT number; unique invoice number; customer name and address; tax point and issue date; description; net amount; VAT rate and amount; and gross total. It must be issued to the recipient of the supply, not merely the person whose card or Stripe balance funded it.

## 5. Stripe fees, refunds, chargebacks and reversed platform fees

### 5.1 Stripe processing fees

For direct charges, Stripe records the charge on the connected account, deducts Stripe fees there and transfers the application fee to Dono. Stripe's documentation says the connected account is responsible for direct-charge processing fees, refunds and chargebacks. [Stripe, Connect payment links/direct charges](https://docs.stripe.com/connect/payment-links).

Therefore:

- the Stripe processing fee is an expense of the connected account holder, not Dono;
- Dono must not claim input VAT on a Stripe fee invoiced to the connected account holder;
- the connected account holder must assess the VAT or reverse-charge treatment of Stripe's cross-border service based on its own status;
- any separate Stripe Connect, platform, Tax, Radar or other fee billed to Dono is Dono's expense and must be supported by Stripe's fee record or monthly tax invoice; and
- Stripe currently supplies UK payment services cross-border from Ireland. Where no UK VAT is charged, Dono must assess the UK reverse charge for services supplied to Dono. Stripe itself advises customers to make that assessment. [Stripe, global taxation of fees](https://support.stripe.com/questions/global-taxation-of-stripe-fees?locale=en-GB).

### 5.2 Full and partial donation refunds

A refund of campaign money is not a refund of Dono turnover. The Recipient reverses the charge from its connected account. Dono separately reverses its application fee where the refund policy requires it.

Before Dono's VAT registration, the application-fee reversal is recorded as a reduction of platform revenue. After registration, a genuine full or partial fee reduction changes the consideration and output VAT. Dono must:

1. link the reversal to the original application fee and invoice;
2. reduce net revenue and output VAT by the actual amount reversed;
3. issue a valid credit note within 14 days after the refund payment where required; and
4. make the VAT adjustment in the period in which the decrease occurs.

HMRC requires a credit note to reflect a genuine price reduction, identify the original invoice and state the net and VAT credited. [HMRC, VAT Notice 700, paragraph 18.2](https://www.gov.uk/guidance/vat-guide-notice-700).

For a partial refund, the ledger should use the actual application-fee refund generated by the agreed fee formula. A simple percentage of the gross charge is safe only if it reproduces that formula, including any fixed component and prior partial refunds.

### 5.3 Stripe fee retention on refunds

Stripe's standard UK pricing states that original payment-processing, Connect and currency-conversion fees are not returned for most refunds. That retained amount remains an expense of the party Stripe charged; it does not become Dono revenue and does not alter output VAT on Dono's fee. [Stripe UK pricing, refunds FAQ](https://stripe.com/gb/pricing).

### 5.4 Chargebacks

A chargeback reverses the disputed connected-account payment under card-scheme rules. Under the stated direct-charge setup, the connected account bears the disputed amount and Stripe dispute fees. Stripe currently lists a £20 dispute-received fee and a separate £20 manual countering fee, with the latter returned if the dispute is won. [Stripe UK pricing](https://stripe.com/gb/pricing); [Stripe dispute-fee FAQ](https://support.stripe.com/questions/dispute-fees-faq?locale=en-GB).

For Dono:

- if the application fee is reversed, record a platform-earning refund, reduce revenue and make the corresponding VAT adjustment after registration;
- if the charge is disputed but Dono retains the application fee, the dispute alone does not reduce Dono's consideration;
- if Dono later reimburses a connected account without reducing the contractual fee, that payment may be compensation or an expense rather than a VAT price adjustment; do not reduce output VAT without a documented change in consideration; and
- if Stripe charges a dispute or Connect fee to Dono rather than the connected account, book it as Dono's expense using the Stripe fee record and assess any input/reverse-charge VAT separately.

If Dono's fee remains legally due but is unpaid, that is a debt rather than a price reduction. After registration, Dono may claim VAT bad-debt relief only when the statutory conditions are met, including having accounted for the VAT, writing the debt off to a bad-debt account and waiting six months after the later of the due date and supply date. A credit note must not be used merely because a customer has failed to pay. [HMRC, VAT Notice 700/18](https://www.gov.uk/guidance/relief-from-vat-on-bad-debts-notice-70018).

Stripe classifies application fees as `platform_earning` and application-fee refunds as `platform_earning_refund`, which should be the primary VAT reconciliation categories. [Stripe, reporting categories](https://docs.stripe.com/reports/reporting-categories?locale=en-GB).

## 6. Place of supply and overseas users

Under the recommended model, the Campaign Owner receives Dono's paid platform service. At launch Campaign Owners are UK students and UK societies. Their service is therefore UK-place and, after registration, subject to UK VAT. An overseas donor does not change that result because the donor is not the recipient of Dono's paid service.

For future expansion, the general service rules are:

- B2B: the place of supply is where the business customer belongs;
- B2C: the place of supply is where the supplier belongs, unless a special rule applies; and
- electronically supplied B2C services are generally supplied where the consumer is located.

[HMRC, VAT Notice 741A](https://www.gov.uk/guidance/vat-place-of-supply-of-services-notice-741a).

Dono's present service includes mandatory human campaign review, moderation and a human-operated refund process. The better view is that the composite service is not an automatically delivered electronic service with minimal human intervention. That classification should be revisited if those elements become ancillary or automated. HMRC's digital-services guidance makes minimal or no human intervention central to the definition. [HMRC, VAT rules for digital services](https://www.gov.uk/guidance/the-vat-rules-if-you-supply-digital-services-to-private-consumers).

Before admitting a non-UK Campaign Owner, Dono must collect and retain the customer's legal name, address, country, business/consumer status and VAT or tax identifier; determine the place of supply; place any reverse-charge wording on the invoice; and assess local registration. A non-UK card used by a donor is payment evidence, not reliable evidence of the location or status of Dono's customer.

## 7. Dono revenue versus campaign receipts

For Dono's books:

- **Revenue:** application/platform fees actually earned, excluding VAT after registration.
- **Output VAT:** one-sixth of a VAT-inclusive standard-rated fee, subject to rounding and the applicable tax point.
- **Contra-revenue:** genuine application-fee refunds or reductions.
- **Expenses:** only costs legally charged to Dono, including Dono's own Stripe Connect or software fees. A cost charged to a connected account is not Dono's expense.
- **Not Dono turnover:** campaign contributions, surplus campaign funds, charge refunds executed from a connected account, or amounts merely visible through Connect.

This net presentation depends on the legal and operational facts continuing to match the direct-charge, disclosed-agency model. If Dono begins receiving destination charges, controlling campaign money, contracting as principal with donors, or guaranteeing refunds, the accounting and VAT analysis must be redone.

For the Campaign Owner's books, the gross connected-account charge, fee-cover contribution, application fee, Stripe fee, refunds and payouts must be reconcilable. The exact income-tax or corporation-tax presentation depends on the owner and purpose; Dono should provide data but not issue a generic tax conclusion.

## 8. Campaign categories

### Personal student campaigns

A freely given monetary contribution for which the donor receives nothing in return is outside the scope of VAT. HMRC looks at substance, conditions, third-party benefits and the contract. [HMRC, donations](https://www.gov.uk/hmrc-internal-manuals/vat-supply-and-consideration/vatsc06110). That does not decide whether the receipt is taxable income for the student; a personal gift and a receipt connected with a trade or service can have different direct-tax outcomes.

### Society campaigns

The same VAT donation test applies. A society's non-profit purpose does not itself create a VAT exemption. Its legal form, business activities and any benefits supplied must be considered. Where a college, university or charity holds the connected account for the society, the terms and records must identify separately the Campaign Owner, Recipient, owner of funded assets and recipient of Dono's platform service.

### Charitable-purpose campaigns

A charitable purpose does not make the Campaign Owner a registered charity and does not make Gift Aid available. Dono should continue to say that it does not claim Gift Aid and that its confirmation is not a charitable tax receipt. If a registered charity later raises funds as principal, that must use a separate charity pathway confirming the charity, the eligible donation, Gift Aid authority and the charity's VAT/invoicing position. HMRC confirms that a freely given donation with nothing supplied in return is outside the scope, including for charities. [GOV.UK, charities and VAT registration](https://www.gov.uk/vat-charities/registration).

### Commercial and entrepreneurial campaigns

The label "donation" does not control. A payment is outside scope only if it is freely given and not directly linked to goods, services or a benefit to the donor or specified third party. If a reward, product, service, priority access, discount, sponsorship benefit, equity or repayment is provided, the payment may be consideration and the full amount—not an assumed market value—can be taxable. [HMRC, VATSC03560](https://www.gov.uk/hmrc-internal-manuals/vat-supply-and-consideration/vatsc03560); [HMRC, outside-scope income](https://www.gov.uk/hmrc-internal-manuals/vat-business-non-business/vbnb20900).

Commercial campaigns should therefore remain disabled until the separate trader pathway exists. The pathway should, at minimum, collect trader identity and address, legal form, company/UTR details where appropriate, VAT number and registration status, business/consumer status, country, description of any promised benefit, expected annual taxable turnover, invoice requirements and an acknowledgement that the donation-only pathway cannot be used to sell or pre-sell.

## 9. Records and Stripe reports

Dono should retain VAT and supporting business records for at least six years. VAT-registered businesses must keep the required records digitally in compatible software and preserve the digital links used to make returns. [HMRC, VAT Notice 700/21](https://www.gov.uk/guidance/record-keeping-for-vat-notice-70021).

For every transaction, retain:

- Campaign Owner, legal customer and Recipient IDs, names, addresses and countries;
- customer business/consumer status, VAT number and evidence relied upon;
- campaign and terms-version identifiers;
- Stripe connected-account, PaymentIntent, Charge, balance-transaction and application-fee IDs;
- UTC creation time, tax point, settlement currency and exchange-rate data;
- gross charge, campaign contribution, fee cover, Dono application fee, Stripe fee, net connected-account amount and payout;
- VAT rate, net taxable amount, output VAT and place-of-supply code after registration;
- donation confirmation, Dono fee statement/VAT invoice and Stripe fee document;
- every refund, partial refund, application-fee refund, credit note, dispute, chargeback, dispute outcome and fee;
- webhook payloads and processing/audit logs sufficient to prove the ledger entry; and
- the link from each ledger entry to the accounting posting and bank payout.

At least monthly, download and archive:

1. **Balance Summary / Balance change from activity — itemised**, in UTC, for Dono's platform account;
2. **Collected fees/Application fees** or the equivalent application-fee export;
3. **Fees Report — itemised**, reconciled to the Balance Summary;
4. **Connect connected-account balance activity** needed to reconcile direct charges, refunds and disputes;
5. **Payout reconciliation** and matching bank statements;
6. **Stripe monthly tax invoices** and related transaction detail from Dashboard Documents;
7. **refund and dispute exports**, including dispute-received and countering fees; and
8. an exceptions report for missing invoices, duplicate webhook processing, unreconciled application fees, unlinked refunds and negative balances.

Stripe describes the Balance Summary as the account reconciliation report, the Fees Report as the itemised source for fees, and its monthly tax invoices as the document for fees and taxes charged by Stripe. [Stripe, Balance Summary](https://docs.stripe.com/reports/balance); [Stripe, Fees Report](https://docs.stripe.com/reports/all-fees); [Stripe, monthly tax invoice](https://support.stripe.com/questions/understanding-your-monthly-tax-invoice?locale=en-GB).

The privacy retention schedule should expressly permit six-year retention of transaction, invoice, VAT and accounting records under legal obligation, while minimising cardholder data and avoiding storage of full card details.

## 10. VAT-threshold monitoring process

### Data model

Maintain an immutable `taxable_turnover_ledger` separate from campaign GMV. Each entry should contain the tax point, legal supplier, legal customer, supply country/status, gross application fee, VAT amount (zero before registration, calculated after), net taxable turnover, reversal link, source Stripe ID and accounting status. It must also include non-Stripe Dono revenue and any reverse-charge service value that counts towards registration.

### Controls

1. **Daily ingestion:** import application-fee creations and refunds; deduplicate by Stripe object/event ID; flag missing customer and location data.
2. **Monthly close:** reconcile platform earnings and refunds to Stripe Balance Summary, Fees Report, payout/bank data and the nominal ledger. A person other than the preparer should approve the reconciliation.
3. **Rolling test:** after each daily load and at every month-end, calculate taxable turnover for each trailing 12-month window. Do not use the financial year.
4. **Forward test:** maintain a separate 30-day forecast using live campaigns, recurring charges, signed sponsorship or service contracts and expected non-Stripe revenue. Trigger immediately when facts make more than £90,000 in the next 30 days likely.
5. **Whole-person aggregation:** obtain a monthly declaration of any other taxable business activity of the sole trader and add it to the monitor.
6. **Reverse-charge review:** monthly, review Stripe and all other overseas supplier invoices and add amounts that count under HMRC's registration rules.
7. **Refund discipline:** reduce turnover only for an actual, evidenced change in Dono's consideration linked to the original fee. Do not net general compensation, campaign refunds or Stripe expenses.

### Alerts and ownership

- **£63,000 (70%):** monthly founder and accountant review; validate the customer/supply model and pricing decision.
- **£72,000 (80%):** prepare the registration file, VAT invoice template, MTD-compatible ledger and effective-date release plan.
- **£81,000 (90%):** weekly review of both tests and obtain written adviser confirmation.
- **£85,500 (95%):** daily review; freeze any launch or contract that could trigger the forward test until its VAT treatment and price are approved.
- **Threshold crossed or forward test met:** notify the founder and accountant the same day, preserve the calculation and file within the statutory deadline.

The named owner should be the sole trader, with a designated finance preparer and an external UK VAT adviser as reviewer. Keep a signed monthly threshold certificate showing the rolling figure, 30-day forecast, other sole-trader turnover, reverse-charge amount, exceptions and reviewer.

## 11. Implementation decisions before launch

1. Keep commercial and entrepreneurial campaigns disabled.
2. Adopt the Campaign Owner as the recipient of Dono's paid platform service in the contract, checkout, ledger and invoices.
3. Make the donor's fee cover an optional third-party contribution towards the Campaign Owner's costs, not a switch that changes Dono's customer.
4. Separate campaign contribution, Dono application fee and Stripe processing fee in every ledger and confirmation.
5. Resolve the one-off versus recurring fee-formula inconsistency and disable recurring charging until the same documented fee and refund calculation applies.
6. Build Campaign Owner fee statements now and VAT invoices/credit notes behind an effective-dated VAT feature flag.
7. Implement the threshold monitor and six-year export archive before processing live money.
8. Obtain a written UK VAT adviser opinion on: the direction of Dono's supply; standard-rating; the treatment of donor fee cover as third-party consideration; Dono's reverse charge on Stripe services from Ireland; and the digital-service classification before any non-UK Campaign Owner is admitted.

## 12. Terms revisions made with this position

The working v2.2 terms have been revised so that:

- Terms of Service clause 11.2 separates the donation confirmation, charitable/Gift Aid statement and the parties' tax responsibilities;
- clause 16.3 states Dono's current non-registration, standard-rated treatment after registration, VAT-inclusive consumer pricing and Dono's own responsibility;
- clauses 12.5 and 16.4 use one Campaign Owner supply model and treat donor fee cover as third-party funding;
- clause 16.7 allocates donation confirmations, Dono fee statements/VAT invoices and Stripe fee documents correctly;
- the Donor Terms remove the unsupported claim that selecting fee cover creates a separate paid Dono service for the donor;
- the Student and Society Campaign Terms distinguish campaign receipts, Dono revenue and Stripe costs and avoid transferring Dono's tax obligations; and
- commercial and entrepreneurial campaigns are disabled pending a separate trader pathway.

These are working drafts. The wider terms still contain unrelated engineering and solicitor-review markers and are not ready for publication merely because the tax clauses have been revised.
