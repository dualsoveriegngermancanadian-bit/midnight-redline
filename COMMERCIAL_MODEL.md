# Midnight Redline — Paid Competitive Garage Model

> **Status: RBC-only commercial specification.** This document defines the paid catalog requested for the game. It does not activate payment collection, create a transfer, or collect financial information.

## Core Commercial Model

Midnight Redline is a **paid competitive racing platform**. A player enters the game through paid **Garage Lineup Access**, selects from multiple race-ready cars, pays a separate **$25 event-access charge** for each race entered, and may buy individual micro-products—parts, services, performance work, and cosmetics—to build the selected car. The continuing goal is to progress through the circuit and race **The Architect**, the final host opponent.

| Revenue family | Player experience | Billing pattern | Creator settlement |
|---|---|---|---|
| Garage Lineup Access | Access the active car lineup, garage, dyno, qualifiers, and host progression. | One-time prepaid term. | Confirmed business-payment receipts settle to the creator’s RBC business account and approved weekly settlement ledger. |
| Race Entry | Pay to enter an eligible race while a prepaid lineup term is active. | $25 one-time event-access payment per entry. | Standard product receipt. Player prizes remain separately controlled. |
| Vehicle Ownership | Optionally convert a rental car into a permanent in-game unlock. | One-time individual vehicle product. | Standard product receipt. |
| Parts and garage services | Buy a named component, tune, install, service, or cosmetic action. | One-time micro-payment per catalog item. | Standard product receipt. |
| Player awards and prize movement | Receive campaign progression and award outcomes. | Separate restricted workflow. | Must not be mixed with ordinary shop and subscription receipts. |

## Garage Lineup Prepaid Terms

A member pays for access to **a lineup of cars**, not merely a single vehicle. Each plan is paid once for its selected term. A renewal request may be issued before the covered-through date, but no automatic renewal is assumed. The term plans below preserve the range stated for the game; the amounts remain a **draft catalog awaiting final approval before live bank-payment activation**.

| Bank order key | Term | Draft price | Renewal cadence | Included access |
|---|---:|---:|---|---|
| `garage_lineup_1m` | 1 month | **$40** | Every 1 month | Active rental lineup, garage, dyno, qualifiers, and final-host progression. |
| `garage_lineup_2m` | 2 months | **$45** | Every 2 months | Same lineup access, locked for a longer term. |
| `garage_lineup_3m` | 3 months | **$55** | Every 3 months | Same lineup access, locked for a longer term. |
| `garage_lineup_4m` | 4 months | **$65** | Every 4 months | Same lineup access, locked for a longer term. |
| `garage_lineup_5m` | 5 months | **$75** | Every 5 months | Same lineup access, locked for a longer term. |
| `garage_lineup_6m` | 6 months | **$80** | Every 6 months | Same lineup access, locked for the longest stated term. |

## Active Rental Lineup

Every active Garage Lineup Subscription makes the present competitive garage available. A player may choose a car before a race and return to the garage to switch among eligible vehicles. Permanent ownership is optional; a lapsed subscription removes rental-lineup access but does not remove permanent unlocks.

| Included rental vehicle | Optional permanent unlock | Subscription status |
|---|---|---|
| Havoc 707 | Yes | Available while the line-up subscription is active. |
| C8 Vortex | Yes | Available while the line-up subscription is active. |
| ZL Track | Yes | Available while the line-up subscription is active. |
| Iron Charger | Yes | Available while the line-up subscription is active. |
| Chevelle SSR | Yes | Available while the line-up subscription is active. |
| Nova 8 | Yes, or earned through the campaign | Available while the line-up subscription is active. |
| Firebird Ram | Yes | Available while the line-up subscription is active. |
| Avento R | Yes | Available while the line-up subscription is active. |
| Monza V12 | Yes | Available while the line-up subscription is active. |

## Per-Race Paid Access

Each race entry is a **$25 one-time paid access product** for an active subscriber. A new bank-payment order reference must be created server-side for every entry. The gameplay client must unlock the race only after a verified payment entitlement is returned by the server. Event-entry revenue is creator-directed product revenue; any future cash-prize pool or player payout is a separate controlled program and is not automatically created from the entry payment.

| Bank order key pattern | Price | Eligibility | Entitlement |
|---|---:|---|---|
| `race_entry_<event_slug>` | $25 per entry | Active Garage Lineup Subscription required | One eligible entry for the named event. |

## One-Time Vehicle and Micro-Product Catalog

The full vehicle, part, garage-service, and cosmetic inventory is commercially payable. The source item list and existing game balance values are preserved in [`PRICING_INVENTORY.md`](./PRICING_INVENTORY.md). Each sellable item requires a dedicated business-payment product record, a one-time payable amount, a tax and refund treatment, and a verified entitlement result before the player’s game state changes.

| Product family | Current catalog count | Checkout type | Entitlement result |
|---|---:|---|---|
| Permanent vehicle unlocks | 9 | One-time | Car remains in the player’s permanent garage. |
| Performance parts and services | 13 | One-time | Named part, tune, service, or cosmetic is unlocked. |
| Race entries | 7 planned event products | One-time | One entry to the named eligible event. |
| Garage lineup terms | 6 | One-time prepaid | Temporary lineup access through the paid covered-through date. |

## Creator Settlement and Financial Boundary

All ordinary paid catalog items—prepaid lineup access, race access, permanent vehicles, parts, services, and cosmetics—are represented as business-payment orders payable to the creator’s RBC business account. The customer authorizes payment through their own bank, and the business-payment service provides the confirmation used for reconciliation. Eligible proceeds settle on the creator’s approved **weekly** settlement cadence. Neither the game client nor this repository stores card numbers, account-routing details, banking credentials, or tax identity information.

Player award and prize disbursement flows are deliberately separated from ordinary catalog revenue. They require their own eligibility, official-rule, review, audit, and payout controls before a payment provider is asked to distribute awards.

## Preconditions for Live Activation

Live collection remains off until the creator approves the entire price table, enrolls the RBC business payment service, configures the production bank confirmation or reconciliation adapter, completes applicable business and tax requirements, and tests the entitlement workflow. The game must never grant paid access merely because a customer clicked a payment-request button.


## Receiving Bank Decision

The primary receiving institution for the direct-bank payment path is **RBC Royal Bank**, using the creator’s existing sole-proprietorship business relationship. Scotiabank remains an alternative institution but is not the primary settlement path. The creator’s legal name, Gmail address, business number, licensing records, account numbers, and login credentials remain confined to the secure bank or payment-provider onboarding flow and are not stored in this repository.


## Featured Car — Real-World Build Context

The featured creator build is presented as a stock vehicle reference plus a separately funded race build. The current user-provided estimate is approximately **$250,000 CAD for the stock vehicle** and approximately **$100,000 CAD in engine and supporting add-ons**, before ongoing suspension calibration, tuning, and maintenance. These figures are contextual build economics only; they are not silently converted into shop charges. The showroom must distinguish stock horsepower from the completed 1,000-HP build and display the build investment separately.
