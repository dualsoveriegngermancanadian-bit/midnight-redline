# Midnight Redline — Payable Product Inventory

> **Status: RBC business-payment catalog specification.** Every listed offering is a payable product in the shop. The file does not activate transfers, collect banking details, or grant access without confirmed payment.

## Creator-Directed Commercial Model

Midnight Redline is a paid competitive racing catalog, not a single low-cost membership. Players purchase prepaid lineup access, select a car, buy build components, and pay event access as they progress. Each payable item has an item-level order key, amount, description, and entitlement result. Ordinary receipts are directed to the creator’s RBC business settlement process on the approved weekly cadence. Player awards remain separate.

| Catalog family | Billing type | Shop treatment | Payment representation |
|---|---|---|---|
| Lineup access | One-time prepaid | Select 1–6 months of access to the active race-ready lineup. | One business-payment order for the selected term. |
| Vehicle access | One-time | Select one permanent vehicle unlock; vehicle prices vary by model. | One item-level business-payment order. |
| Performance parts | One-time micro-payment | Buy named components for the selected build. | Cart item with its own order key and price. |
| Garage services and cosmetics | One-time micro-payment | Buy tuning, service, installation, or finish actions. | Cart item with its own order key and price. |
| Race access | One-time | Pay $25 for each eligible event after lineup access is confirmed. | One event-specific business-payment order. |
| Competitive prize operations | Segregated | Player awards are not ordinary shop purchases. | Separate controlled ledger and workflow. |

## Prepaid Lineup Access

Each player pays once for the selected term and receives a covered-through date. The lineup gives access to multiple race-ready cars, the garage, dyno, qualifiers, and host progression. A renewal request may be offered before expiry; no automatic recurring e-transfer is assumed.

| Product code | Offering | Price | Coverage |
|---|---|---:|---|
| `garage_lineup_1m` | Garage Lineup Access — 1 Month | **$40 CAD** | 1 month |
| `garage_lineup_2m` | Garage Lineup Access — 2 Months | **$45 CAD** | 2 months |
| `garage_lineup_3m` | Garage Lineup Access — 3 Months | **$55 CAD** | 3 months |
| `garage_lineup_4m` | Garage Lineup Access — 4 Months | **$65 CAD** | 4 months |
| `garage_lineup_5m` | Garage Lineup Access — 5 Months | **$75 CAD** | 5 months |
| `garage_lineup_6m` | Garage Lineup Access — 6 Months | **$80 CAD** | 6 months |

## Permanent Vehicle Products

Vehicle prices are itemized separately. The current game values map to the intended hundreds-of-dollars range as CAD shop prices; the source game value is retained in code for auditability.

| Product code | Vehicle | Shop price |
|---|---|---:|
| `vehicle_havoc_707` | Havoc 707 | **$420 CAD** |
| `vehicle_c8_vortex` | C8 Vortex | **$780 CAD** |
| `vehicle_zl_track` | ZL Track | **$510 CAD** |
| `vehicle_iron_charger` | Iron Charger | **$360 CAD** |
| `vehicle_chevelle_ssr` | Chevelle SSR | **$330 CAD** |
| `vehicle_nova_8` | Nova 8 | **$275 CAD** |
| `vehicle_firebird_ram` | Firebird Ram | **$290 CAD** |
| `vehicle_avento_r` | Avento R | **$1,450 CAD** |
| `vehicle_monza_v12` | Monza V12 | **$1,650 CAD** |

A vehicle purchase is a permanent in-game unlock as described at the point of sale. If a future game mode can consume, retire, or remove a vehicle, that rule must be disclosed and confirmed before the purchase; the current shop does not silently charge for replacement vehicles.

## Garage Parts, Services, and Cosmetics

Each item below is a separate one-time micro-product. Players may combine multiple items in one cart to reduce repeated payment friction and receive one clear order reference.

| Product code | Offering | Shop price |
|---|---|---:|
| `service_dyno_street_tune` | Dyno Street Tune | **$6 CAD** |
| `service_ecu_flash` | ECU Flash | **$15 CAD** |
| `part_10_5_drag_radials` | 10.5 Drag Radials | **$10 CAD** |
| `part_4_barrel_carb_kit` | 4-Barrel Carb Kit | **$15 CAD** |
| `part_wet_nitrous_kit` | Wet Nitrous Kit | **$25 CAD** |
| `part_short_ratio_transmission` | Short-Ratio Transmission | **$35 CAD** |
| `part_4_10_rear_end` | 4.10 Rear End | **$75 CAD** |
| `service_weight_relief` | Weight Relief | **$60 CAD** |
| `part_roots_supercharger` | Roots Supercharger | **$35 CAD** |
| `part_twin_scroll_turbo` | Twin-Scroll Turbo | **$35 CAD** |
| `part_free_flow_exhaust` | Free-Flow Exhaust | **$18 CAD** |
| `part_forged_wheel_package` | Forged Wheel Package | **$8 CAD** |
| `service_midnight_paint_finish` | Midnight Paint Finish | **$5 CAD** |

## Race Access

Each eligible event costs **$25 CAD** after the player has confirmed prepaid lineup access. The order ledger records the named event and grants one entry only after the matching bank payment is confirmed.

## Payment and Entitlement Boundary

The customer receives a payment request by email or phone and authorizes it through their own bank. The game creates an order reference and records what is due, who the order belongs to through the approved account reference, and whether payment is pending or confirmed. It does not store bank credentials or account numbers. No subscription, race entry, car, part, service, or cosmetic is unlocked until the confirmed transfer matches the order amount and reference.


## Showroom-to-Garage Sequence

The front page functions as the vehicle showroom and competitive entry point. It presents the featured creator car alongside comparable vehicles with horsepower, weight, class, estimated time, description, and itemized price. A player first selects and purchases a vehicle, then enters the garage to purchase compatible parts and services. The resulting build stats determine its performance band and the appropriate race matchup; add-ons must not be hidden behind the vehicle purchase or bundled without an itemized price.
