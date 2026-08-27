# Technical Structure: Fast & Furious — Midnight Redline

## Runtime Ownership

The React application provides a single full-screen `GameCanvas` and manages the non-game interface around it. Babylon.js owns the render loop, scene, camera, meshes, lights, materials, and the physical presentation of the race. Gameplay rules remain in plain TypeScript under `client/src/game/` so the simulation is neither tied to React renders nor hidden in mesh metadata.

| Module | Ownership | Responsibility |
|---|---|---|
| `GameCanvas.tsx` | React host | Starts one Babylon engine, resizes it, disposes it safely, and exposes game snapshots to the overlay UI. |
| `scene.ts` | Babylon entry point | Creates the race strip, low racing camera, lighting, timing tree, procedural cars, and the `GameWorld`. |
| `GameWorld.ts` | Gameplay coordinator | Owns the game-state machine, race timer, player tune, rival data, race results, and lifecycle cleanup. |
| `DragRaceSimulation.ts` | Deterministic simulation | Translates tune configuration, inputs, and race time into RPM, speed, distance, traction, shifts, and elapsed time. |
| `CarRig.ts` | Gameplay object | Owns a procedural car mesh, wheels, simple suspension pose, exhaust light, and material state. |
| `StartingTree.ts` | Gameplay object | Owns staged, amber, green, and red lamp materials plus its scheduled start sequence. |
| `raceData.ts` | Data source | Defines rounds, rival power bands, upgrade catalog, subscription benefit copy, and balance rules. |
| `Home.tsx` | Presentation UI | Renders the pit-board HUD, garage sheet, event panel, results display, membership pitch, and responsive control labels. |

## State Model

The game has explicit modes: `garage`, `briefing`, `staging`, `countdown`, `racing`, `results`, and `membership`. The simulation only consumes throttle, shift, nitro, and staged inputs when the current mode makes them valid. UI interactions request semantic actions through the world’s small public API; the world returns snapshots describing what happened.

## Asset Hints

The scene uses procedural geometry for a 402-metre strip, concrete pillars, barriers, finish truss, timing tree, wheels, and body panels. The generated artwork is used where it is high impact: full-screen garage/rival art, the membership surface, the race-world visual direction, and the brand mark. The game never depends on an imported GLB vehicle pipeline.
