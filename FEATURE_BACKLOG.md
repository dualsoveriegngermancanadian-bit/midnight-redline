# Midnight Redline — Expansion Backlog

The expanded experience is organized around a simple loop: choose a vehicle, acquire and install meaningful hardware, validate the build on the dyno, enter a matched event, handle wear or failure through the pit crew, and progress toward the final host run. Every paid item must map to a visible mechanic or clearly labeled cosmetic effect.

| Priority | System | Feature | Validation target |
|---|---|---|---|
| P0 | Vehicle showroom | Featured creator car plus comparable lineup with stock horsepower, class, ETA, price, and real-world reference context kept separate from game prices. | Every listed vehicle is visible and selectable; stock and built figures are not conflated. |
| P0 | Garage catalog | Itemized engine, driveline, tire, chassis, service, body, and cosmetic products. | Each product has a price, compatibility rule, effect, and entitlement outcome. |
| P0 | Build state | Installed parts, engine state, covered access, build totals, and replacement requirements. | The build sheet always matches the actual game state. |
| P0 | Dyno | Horsepower, torque estimate, grip, power-to-weight, estimated ET, and before/after deltas. | Dyno output changes only when the installed build changes; pressing the button does not invent power. |
| P0 | Competition | Performance-band matching, race entry requirements, and event-specific telemetry. | Players race comparable builds and can see why a matchup is selected. |
| P1 | Engine service | Blown-engine state, diagnosis, pit-crew removal, replacement engine selection, install completion, and re-dyno. | A failed engine blocks racing until a compatible confirmed replacement is installed. |
| P1 | Suspension | Sensitivity range, launch behavior, grip trade-offs, and alignment/tuning controls. | Suspension changes affect telemetry and launch outcomes without overstating top speed. |
| P1 | Pit crew | Visible service actions for engine swaps, tire changes, and setup preparation. | Service state is visible, ordered, and cannot grant an unpurchased entitlement. |
| P1 | Reliability | Heat, wear, nitrous use, over-rev, and failure thresholds. | Failure is explainable from telemetry and does not occur as an arbitrary monetization trap. |
| P1 | Race progression | City circuit, rivals, host progression, rewards, and covered-through access dates. | Progress persists and expired access requires an explicit renewal request. |
| P2 | Cosmetics and body | Paint, wheels, body panels, aero, stance, and visual inspection. | Cosmetic items are labeled visual-only unless a measured effect is explicitly implemented. |
| P2 | Review surface | Accessible build history, part effects, dyno logs, and purchase ledger. | A reviewer can inspect what was purchased and what changed. |

## Payment Boundary

The active payment direction is RBC business e-transfer. The game may create an order reference and show a pending bank handoff, but it must not unlock a product until an approved business reconciliation process confirms the exact amount and reference. No customer or creator banking credentials are stored in the project. No automatic recurring e-transfer is assumed; lineup access is one-time prepaid and renewals are explicit.

## Delivery Discipline

New ideas are added to this backlog before implementation. Mechanics are implemented before monetization copy is finalized, and every catalog product is tested through the showroom-to-garage-to-dyno-to-race path. Live payment collection remains disabled until the bank-side business enrollment and confirmation adapter are separately approved and configured.
