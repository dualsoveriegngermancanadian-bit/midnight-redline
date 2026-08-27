# Midnight Redline — Stripe Commerce Guardrails

> **Status: implementation specification.** These guardrails protect legitimate creator revenue and customer clarity. They do not enable live payments or bypass payment-provider controls.

## Fee-Efficient Checkout Rules

The game must use one secure Stripe-hosted Checkout Session per intended commercial purchase. Small parts and services should be added to a cart and checked out together, rather than triggering one card transaction per item. This avoids repeatedly applying the fixed per-transaction component of card-processing fees while still letting the player choose individual items.

| Purchase type | Checkout rule | Reason |
|---|---|---|
| Garage Lineup membership | One recurring subscription Checkout Session for the selected 1-, 2-, 3-, 4-, 5-, or 6-month term. | Keeps each membership’s renewal, receipt, cancellation, and entitlement tied to one subscription. |
| Race access | One one-time $25 Checkout Session for one named event. | Keeps the charge purpose transparent and the entitlement auditable. |
| Parts, services, and cosmetics | Add multiple selected items to a cart, then create one one-time Checkout Session for the cart total. | Reduces repeated fixed card fees and gives the customer one clear receipt. |
| Permanent vehicle access | One one-time Checkout Session, optionally combined with other garage products in the same cart when the entitlement rules allow it. | Preserves a clean ownership record and avoids unnecessary duplicate charges. |

The unit-economics model in [`stripe_unit_economics.txt`](./stripe_unit_economics.txt) shows why cart checkout matters. Under the recorded U.S. domestic-card planning assumption, five separate $5 purchases incur $2.225 in processing fees, while a single $25 cart incurs $1.025, retaining an additional $1.20 before taxes, refunds, disputes, international-card fees, and other variable costs.

## Transparent Customer and Provider Controls

Every payable item must have a clear player-facing name, price, description, refund treatment, and resulting entitlement. Checkout should use Stripe-hosted payment pages, a recognizable customer-facing billing descriptor, and a server-side product/price lookup. The game client must never accept a customer-provided price, decide a successful payment from a browser redirect alone, or store card, bank, or tax-identity information.

| Control | Required behavior |
|---|---|
| Product names | Match the in-game offering: the selected lineup term, named race, vehicle, part, service, or cosmetic item. |
| Price integrity | Resolve every Stripe Price ID or lookup key on the server from an allowlist. |
| Entitlements | Grant or revoke access only after a verified server-side Stripe event or successful server-side session retrieval. |
| Customer records | Store the Stripe customer and subscription reference against the game account only in a production database. |
| Cancellations | Use the Stripe-hosted customer portal so customers can manage billing without the game collecting payment data. |
| Refunds and disputes | Follow the published policy, preserve product and entitlement records, and respond through ordinary Stripe workflows. |
| Tax | Enable the appropriate Stripe tax setting only after the creator completes tax registration/onboarding for the applicable jurisdictions. |
| Payouts | Allow Stripe to send eligible creator balances to the creator’s verified bank account using the payout schedule selected in Stripe. |

## Segregation of Prize Operations

The paid catalog is ordinary game commerce. Player awards, prize pools, and any cash disbursement are not part of the normal cart, membership, or vehicle-payment path. Such activities require a separately approved operational flow with eligibility, geographic, rules, audit, and disbursement controls. The standard catalog must not promise, imply, or automate player cash payouts merely because a player has paid a race-entry charge.

## Configuration Boundary

A live deployment requires server-side values for the Stripe secret key, webhook signing secret, success/cancel URLs, allowed price lookup keys, optional tax setting, and the production game-account database. These values are environment configuration, never client code or repository secrets. The current repository stores none of them and remains non-live until the creator completes secure Stripe onboarding and approves the catalog.
