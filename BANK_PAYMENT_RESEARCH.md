# Bank-supported payment research

## Preferred path

The preferred non-card path is Interac e-Transfer Business Request Money or an equivalent business service offered by the user’s financial institution. It is not an informal personal e-transfer workflow. Interac describes Business Request Money as a way for businesses to collect payments from customers through a website, app, QR code, or invoice. The customer initiates payment from their own banking environment, and the business receives the payment through the participating financial institution.

Interac states that Business Request Money is set up through a participating financial institution. Its current published participating-institution list includes BMO, CIBC, DC Bank, Peoples Trust, and Scotiabank, with additional institutions potentially being added. The user’s bank must therefore be confirmed before selecting the bank-specific activation path.

Interac also describes business request-money flows as supporting invoice references and tracking, and its broader Business e-Transfer materials describe rich remittance data, immediate confirmation, and business-oriented reconciliation. The actual availability, limits, fees, settlement timing, refund workflow, and API access remain bank-specific and must be confirmed with the user’s financial institution before production activation.

## Midnight Redline design implication

The game can preserve the existing 29-item commercial catalog while replacing the Stripe checkout handoff with a business payment-request order flow. Each order should receive a unique server-generated reference. The game should grant subscriptions, race access, cars, parts, services, or cosmetics only after the business payment channel confirms the matching order. The implementation must not accept screenshots, client-supplied paid flags, customer banking credentials, or unverified email claims as proof of payment.

Creator revenue should settle to the user’s own business account. Player-award disbursements must remain a separate ledger and workflow. The direct-bank path may reduce card-processing costs, but it does not remove obligations for transaction records, taxes, refunds, fraud controls, privacy, or applicable consumer and gaming rules.

## Official references

1. Interac e-Transfer for Business — Send & receive money: https://www.interac.ca/en/payments/business/send-receive-money-with-interac-e-transfer-for-business/
2. Interac e-Transfer Business Request Money: https://www.interac.ca/en/payments/business/interac-e-transfer-business-request-money/
3. Interac Innovation Hub — Business Request Money API: https://innovation.interac.ca/solution/business-request-money/

## RBC and Scotiabank comparison

RBC’s business receivables page states that businesses can request up to $10,000 from each customer per day through RBC Online Banking for Business, include a payment due date and invoice number, and use Interac Bulk Request Money for up to 10,000 individual requests at a time. RBC separately publishes business banking API materials describing an RBC Move Money API via Interac e-Transfer and real-time payment and acknowledgement capabilities, but it directs businesses to speak with an RBC advisor about availability and enrollment.

Scotiabank’s business page states that Interac e-Transfer for business is provided through ScotiaConnect, supports business sending and receiving, Autodeposit, and invoice or purchase-order details. Its commercial receiving page specifically describes collecting memberships and receiving deposits into a business account, with sign-up through ScotiaConnect. The published Scotiabank page lists payments in Canadian dollars to Canadian financial institutions with Interac capability.

For Midnight Redline, the practical implementation should therefore use a provider-neutral order and entitlement layer, with a bank-specific adapter selected after the creator chooses whether the receiving business account is RBC or Scotiabank and confirms the bank’s enabled Business Request Money/API service. The game can safely generate a payment request and order reference, but should not claim an order is paid until the bank service or a verified reconciliation process confirms it.

## Official bank references

4. RBC — Receive Payments from Customers and Others: https://www.rbcroyalbank.com/business/paying-and-receiving/receive-payments.html
5. RBC — Business Banking APIs: https://www.rbcroyalbank.com/business/api/index.html
6. Scotiabank — Interac e-Transfer for business: https://www.scotiabank.com/ca/en/business-banking/banking-solutions/payments-and-merchant-services/interac-e-transfer-for-business.html
7. Scotiabank — Receiving Interac e-Transfer for business: https://www.scotiabank.com/ca/en/commercial-banking/banking-solutions/payments/receiving-customer-payments/receiving-interac-e-transfer.html
