# Midnight Redline — Payment Guardrails

> **Status: RBC-only implementation specification.** These rules protect creator revenue, customer clarity, and payment integrity. They do not enable live collection until RBC business-payment enrollment and confirmation access are configured.

## Efficient Business Payment Rules

The game uses a bank-supported RBC business payment request for each approved order. Parts, services, and cosmetics should be combined into one cart order so the customer receives one clear reference and the business can reconcile the order once. The game must never ask customers to send money to a personal account or accept a screenshot as payment proof.

| Purchase type | Payment rule | Entitlement rule |
|---|---|---|
| Garage Lineup membership | One business payment request for the selected 1-, 2-, 3-, 4-, 5-, or 6-month term. | Activate the lineup only after verified bank confirmation. |
| Race access | One $25 business payment request for the named event. | Activate one entry only after verified confirmation and an active lineup. |
| Parts, services, and cosmetics | Combine selected items in a single cart order where practical. | Unlock only the named items in the confirmed order. |
| Permanent vehicle access | One item-specific business payment request, optionally combined with permitted garage items. | Record the permanent unlock only after verified confirmation. |

## Bank and Order Controls

Every order receives a server-generated reference, an immutable product allowlist, a CAD amount, a creation timestamp, and an `awaiting_bank_confirmation` status. The client cannot set the amount, mark an order paid, or grant an entitlement. A production bank adapter must verify the matching RBC business payment reference and amount before changing the order status to paid.

| Control | Required behavior |
|---|---|
| Product integrity | Resolve items and prices on the server from the approved catalog. |
| Payment confirmation | Accept only bank-service confirmation or a controlled reconciliation record; never accept client claims or screenshots. |
| Idempotency | A bank transaction reference can settle at most one order. |
| Reconciliation | Record order reference, bank transaction reference, amount, currency, status, and settlement timestamp in durable storage. |
| Refunds | Handle refunds through the business-bank policy or the approved manual finance workflow; revoke or preserve entitlements according to the published product policy. |
| Privacy | Keep customer banking credentials, account numbers, identity documents, and tax identifiers out of the game and repository. |
| Payouts | Use the creator’s RBC business account and the approved weekly settlement ledger; the game does not initiate arbitrary transfers. |

## Segregation of Prize Operations

The paid catalog is ordinary game commerce. Player awards, prize pools, and cash disbursements are separate from subscriptions, race entries, and garage purchases. Those activities require their own eligibility, official rules, audit, and disbursement controls before any payout is promised or initiated.

## Activation Boundary

The current implementation can create a pending RBC order reference but remains inactive until RBC business payment-request enrollment and a verified confirmation/reconciliation mechanism are available. No customer payment is collected and no paid access is granted while `RBC_BUSINESS_PAYMENTS_ENABLED` is false. Bank credentials are supplied only through RBC’s secure business-banking environment.


## Customer Handoff

The customer-facing payment request may be delivered using the customer’s email address or phone number. The game stores only the minimum order reference and payment-request status needed for reconciliation; it does not store the customer’s bank login, account number, password, card details, or security answers. The customer completes authorization in their own banking environment.


## Due-Payment Ledger

The order ledger records the selected product or cart, the amount due, a customer or payer reference supplied through the approved account flow, the unique order reference, and whether the payment is pending, confirmed, expired, refunded, or disputed. It is an accounts-receivable record, not a bank account or debt-collection system. The ledger never stores bank credentials, account numbers, security answers, or unverified payment claims.


## Payment Status and Renewals

A customer receives no paid access while an order is pending, rejected, expired, refunded, or otherwise unconfirmed. Access begins only when the approved bank-payment channel confirms receipt of the exact order amount and reference. This payment result is not a credit-score assessment.

A subscription term is a commercial access period, but an ordinary e-transfer does not silently renew itself. Each renewal must use a new bank payment request or an explicit recurring authorization supported by the bank service. If renewal funds are not confirmed, the lineup moves to renewal-required status and the player cannot enter another paid event until access is restored.


## Settlement Destination

Customer payment requests use the creator’s designated business email address or phone number, linked to the RBC business account. The project stores no actual contact value or banking credential. A payment remains pending until the business-side transfer confirmation matches its unique order reference and amount.
