# Midnight Redline — Paid Competitive Garage Model

> **Status: Stripe-ready commercial specification.** This document defines the paid catalog requested for the game. It does not activate Stripe, create a charge, or collect financial information.

## Core Commercial Model

Midnight Redline is a **paid competitive racing platform**. A player enters the game through a paid **Garage Lineup Subscription**, selects from multiple race-ready cars, pays a separate **$25 event-access charge** for each race entered, and may buy individual micro-products—parts, services, performance work, and cosmetics—to build the selected car. The continuing goal is to progress through the circuit and race **The Architect**, the final host opponent.

| Revenue family | Player experience | Billing pattern | Creator settlement |
|---|---|---|---|
| Garage Lineup Subscription | Access the active car lineup, garage, dyno, qualifiers, and host progression. | Recurring term subscription. | Standard Stripe receipts settle to the creator’s Stripe account and configured payout schedule. |
| Race Entry | Pay to enter an eligible race as an active subscriber. | $25 one-time event-access payment per entry. | Standard product receipt. Player prizes remain separately controlled. |
| Vehicle Ownership | Optionally convert a rental car into a permanent in-game unlock. | One-time individual vehicle product. | Standard product receipt. |
| Parts and garage services | Buy a named component, tune, install, service, or cosmetic action. | One-time micro-payment per catalog item. | Standard product receipt. |
| Player awards and prize movement | Receive campaign progression and award outcomes. | Separate restricted workflow. | Must not be mixed with ordinary shop and subscription receipts. |

## Garage Lineup Subscription Terms

A member pays for access to **a lineup of cars**, not merely a single vehicle. Each plan renews at its selected term until the player cancels through the Stripe customer portal. The term plans below preserve the range stated for the game; the amounts remain a **draft catalog awaiting final approval before live Stripe activation**.

| Stripe lookup key | Term | Draft price | Renewal cadence | Included access |
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

Each race entry is a **$25 one-time paid access product** for an active subscriber. A new Stripe Checkout Session must be created server-side for every entry. The gameplay client must unlock the race only after a verified purchase entitlement is returned by the server. Event-entry revenue is creator-directed product revenue; any future cash-prize pool or player payout is a separate controlled program and is not automatically created from the entry payment.

| Stripe lookup key pattern | Price | Eligibility | Entitlement |
|---|---:|---|---|
| `race_entry_<event_slug>` | $25 per entry | Active Garage Lineup Subscription required | One eligible entry for the named event. |

## One-Time Vehicle and Micro-Product Catalog

The full vehicle, part, garage-service, and cosmetic inventory is commercially payable. The source item list and existing game balance values are preserved in [`PRICING_INVENTORY.md`](./PRICING_INVENTORY.md). Each real-money sellable item requires a dedicated Stripe Product, a one-time Stripe Price, a tax code, a refund treatment, and a verified entitlement result before the player’s game state changes.

| Product family | Current catalog count | Checkout type | Entitlement result |
|---|---:|---|---|
| Permanent vehicle unlocks | 9 | One-time | Car remains in the player’s permanent garage. |
| Performance parts and services | 13 | One-time | Named part, tune, service, or cosmetic is unlocked. |
| Race entries | 7 planned event products | One-time | One entry to the named eligible event. |
| Garage lineup terms | 6 | Recurring | Temporary lineup access for the paid term. |

## Creator Settlement and Financial Boundary

All ordinary paid catalog items—subscriptions, race access, permanent vehicles, parts, services, and cosmetics—are created as seller receipts on the creator’s Stripe account. Stripe-hosted Checkout collects customer payment details; Stripe applies the configured payment, billing, tax, refund, and dispute treatment; and eligible proceeds settle to the creator’s verified bank account on the creator’s selected **weekly** Stripe payout schedule. Neither the game client nor this repository stores card numbers, account-routing details, banking credentials, or tax identity information.

Player award and prize disbursement flows are deliberately separated from ordinary catalog revenue. They require their own eligibility, official-rule, review, audit, and payout controls before a payment provider is asked to distribute awards.

## Preconditions for Live Activation

Live collection remains off until the creator approves the entire price table, connects the Stripe account, supplies secure server-side Stripe credentials, creates the Product and Price records, configures a production webhook endpoint, completes Stripe business/tax/bank onboarding, and tests the entitlement workflow in Stripe test mode. The game must never grant paid access merely because the browser has clicked a checkout button.
