# Midnight Redline — Payable Product Inventory

> **Status: Stripe catalog specification.** Every offering in this inventory is a commercially payable product. The file does not activate Stripe, create live products, collect payment details, or charge customers.

## Creator-Directed Commercial Model

Midnight Redline is a paid game catalog, not a single-subscription product. The catalog contains recurring membership offers and separate, one-time payable offerings for vehicle access, performance parts, services, and paid progression access. When live collection is approved, each eligible offering will map to its own Stripe Product and Price, with receipts settling to the creator’s Stripe account under its configured payout schedule.

| Catalog family | Billing type | Commercial role | Stripe representation |
|---|---|---|---|
| Memberships | Recurring | Unlock continuing member access and subscription benefits. | One Stripe Product and recurring Price for each approved tier. |
| Vehicle access | One-time | Unlock an individual vehicle configuration. | One Stripe Product and one-time Price for each car. |
| Performance parts | One-time | Unlock an individual part or tuning item. | One Stripe Product and one-time Price for each part. |
| Garage services | One-time | Unlock a service, calibration, installation, or cosmetic application. | One Stripe Product and one-time Price for each service. |
| Paid access | One-time or recurring, as approved | Unlock optional access or progression products. | Separately defined Stripe Product and Price. |
| Competitive prize operations | Segregated | Player awards and prize-ledger movement. | Not part of ordinary product checkout until a separate compliant prize workflow is approved. |

## Recorded Membership Pricing

| Product code | Offering | Billing cadence | Current source price | Stripe product status |
|---|---|---|---:|---|
| `nitro-pass-monthly` | Nitro Pass | Monthly recurring | $12 per month | Must be created as a recurring Stripe Price after the full tier schedule is reconciled. |

The present source contains the Nitro Pass monthly display value, but it does not retain the additional membership-tier names, benefits, or amounts discussed outside the repository. Those tiers must be restored before activation; this single value must not be presented as the entire commercial structure.

## Vehicle Access Products

| Product code | Vehicle | Current source catalog value | Billing type | Stripe product status |
|---|---|---:|---|---|
| `vehicle-havoc-707` | Havoc 707 | 42,000 | One-time | Individual Stripe Product and Price required. |
| `vehicle-c8-vortex` | C8 Vortex | 78,000 | One-time | Individual Stripe Product and Price required. |
| `vehicle-zl-track` | ZL Track | 51,000 | One-time | Individual Stripe Product and Price required. |
| `vehicle-iron-charger` | Iron Charger | 36,000 | One-time | Individual Stripe Product and Price required. |
| `vehicle-chevelle-ssr` | Chevelle SSR | 33,000 | One-time | Individual Stripe Product and Price required. |
| `vehicle-nova-8` | Nova 8 | 27,500 | One-time or campaign reward | Individual Stripe Product and Price required when sold. |
| `vehicle-firebird-ram` | Firebird Ram | 29,000 | One-time | Individual Stripe Product and Price required. |
| `vehicle-avento-r` | Avento R | 145,000 | One-time | Individual Stripe Product and Price required. |
| `vehicle-monza-v12` | Monza V12 | 165,000 | One-time | Individual Stripe Product and Price required. |

## Performance Parts and Services Products

| Product code | Offering | Current source catalog value | Billing type | Stripe product status |
|---|---|---:|---|---|
| `service-dyno-street-tune` | Dyno Street Tune | 6 | One-time | Individual Stripe Product and Price required. |
| `service-ecu-flash` | ECU Flash | 15 | One-time | Individual Stripe Product and Price required. |
| `part-10-5-drag-radials` | 10.5 Drag Radials | 10 | One-time | Individual Stripe Product and Price required. |
| `part-4-barrel-carb-kit` | 4-Barrel Carb Kit | 15 | One-time | Individual Stripe Product and Price required. |
| `part-wet-nitrous-kit` | Wet Nitrous Kit | 25 | One-time | Individual Stripe Product and Price required. |
| `part-short-ratio-transmission` | Short-Ratio Transmission | 35 | One-time | Individual Stripe Product and Price required. |
| `part-4-10-rear-end` | 4.10 Rear End | 75 | One-time | Individual Stripe Product and Price required. |
| `service-weight-relief` | Weight Relief | 60 | One-time | Individual Stripe Product and Price required. |
| `part-roots-supercharger` | Roots Supercharger | 35 | One-time | Individual Stripe Product and Price required. |
| `part-twin-scroll-turbo` | Twin-Scroll Turbo | 35 | One-time | Individual Stripe Product and Price required. |
| `part-free-flow-exhaust` | Free-Flow Exhaust | 18 | One-time | Individual Stripe Product and Price required. |
| `part-forged-wheel-package` | Forged Wheel Package | 8 | One-time | Individual Stripe Product and Price required. |
| `service-midnight-paint-finish` | Midnight Paint Finish | 5 | One-time | Individual Stripe Product and Price required. |

## Competitive-Event Products and Awards

| Product code | Offering | Current source catalog value | Commercial treatment |
|---|---|---:|---|
| `event-dockside-pulse-entry` | Dockside Pulse entry | 250 | Candidate paid access product; not activated as an entry fee pending separate prize-operation approval. |
| `event-underpass-eight-entry` | Underpass Eight entry | 400 | Candidate paid access product; not activated as an entry fee pending separate prize-operation approval. |
| `event-signal-burn-entry` | Signal Burn entry | 650 | Candidate paid access product; not activated as an entry fee pending separate prize-operation approval. |
| `event-blacktop-tax-entry` | Blacktop Tax entry | 900 | Candidate paid access product; not activated as an entry fee pending separate prize-operation approval. |
| `event-freightline-entry` | Freightline entry | 1,250 | Candidate paid access product; not activated as an entry fee pending separate prize-operation approval. |
| `event-midnight-redline-entry` | Midnight Redline entry | 2,500 | Candidate paid access product; not activated as an entry fee pending separate prize-operation approval. |
| `event-pink-slip-entry` | Pink Slip event entry | 750 | Candidate paid access product; not activated as a real-world vehicle transaction. |
| `award-campaign-results` | Race result awards | 1,250–15,000 | Segregated player-award ledger; not a standard creator checkout product. |

## Required Before Live Stripe Activation

Every live offering needs an explicit real-money amount, currency, Stripe Product ID, Stripe Price ID or lookup key, tax code, refund treatment, and entitlement outcome. The encoded source values above are the available in-game catalogue values, not an approved dollar conversion or a complete record of the additional subscription tiers. The final tier schedule and external prices must be reviewed as a whole before the Stripe account is connected and live collection begins.

## Source Locations

| Data area | Source |
|---|---|
| Membership display and membership-gating interface | `client/src/components/RaceOverlay.tsx` |
| Vehicle, upgrade, rival, entry, and award catalog values | `client/src/game/raceData.ts` |
| Vehicle, part, and event purchase mechanics | `client/src/game/GameWorld.ts` |
| Commercial ownership and payout boundary | `todo.md` |
