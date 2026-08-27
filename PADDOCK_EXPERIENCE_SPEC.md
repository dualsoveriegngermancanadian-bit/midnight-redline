# Midnight Redline — Professional Paddock Experience

The game’s competitive world expands beyond the start line into a working race-weekend paddock. The player’s home hub is a branded fifth-wheel hauler and garage compound containing the featured car, spare cars, replacement engines, parts storage, dyno bay, pit-crew stations, tools, hospitality space, and a race-control board.

## Core Paddock Areas

| Area | Function | Player-visible state |
|---|---|---|
| Team hauler | Operations hub and mobile base | Door status, crew roster, inventory, schedule, and team funds. |
| Car bay | Holds multiple owned vehicles | Each car shows stock/build HP, class, ET, reliability, installed engine, and readiness. |
| Engine rack | Stores spare and failed engines | New, installed, cooling, failed, and rebuild-required states. |
| Parts wall | Holds purchased components | Compatibility, installed/uninstalled state, price, effect, and order status. |
| Dyno bay | Validates the current build | Before/after horsepower, torque estimate, grip, power-to-weight, ET, and run log. |
| Pit lane | Executes service actions | Engine swap, tire change, setup check, and race-ready confirmation. |
| Hospitality and control | Gives the paddock a lived-in race-weekend feel | Schedule, rival-team row, event briefing, weather/track note, and host progression. |

## Race-Weekend Loop

A player arrives at the event, checks the team board, selects a car, verifies its installed engine and build, stages required spare equipment, runs the dyno, and sends the car to pit lane. A rival-team row communicates the scale of the event without making background assets mechanically important. The race-control board then shows the matched performance band, event fee, and readiness state.

The paddock should communicate consequence without using dark patterns. A failed engine blocks the affected car until a compatible replacement is purchased and confirmed. A different owned car may be selected if it is ready. Parts and service actions show their real effects before installation. Hospitality and atmosphere add context; they do not hide prices or gate a player into an unreviewed purchase.

## Expansion Discipline

The first implementation should use existing game assets and data structures, then add a visual hauler/paddock layer around the verified garage, dyno, telemetry, and event loop. New cars, engines, parts, crew roles, and event systems are added only when each has a visible state, a gameplay effect, and a testable transition. Payment remains the RBC business e-transfer boundary, and no entitlement is granted until the corresponding order is bank-confirmed.
