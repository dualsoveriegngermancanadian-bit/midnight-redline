# Game Plan: Fast & Furious — Midnight Redline

## Risk Tasks

### 1. Simulated Drag-Race Physics and Timing

- **Why isolated:** The game needs launch RPM, reaction time, gear shifts, traction, engine output, and an AI opponent to resolve a fast race in a way that feels readable without a heavy physics plugin.
- **Approach:** Use deterministic longitudinal vehicle simulation. Calculate acceleration from configurable horsepower, vehicle mass, tyre grip, current gear ratio, RPM curve, launch quality, boost, and shift efficiency. Keep player and opponent on predefined straight lanes, and show the exact cause of a poor launch, bog, wheelspin, or missed shift.
- **Verify:** A clean stage followed by a green-light launch advances both cars; launching early is visibly red-lit; holding more revs increases launch power but can produce wheelspin; each correct shift advances a gear and restores acceleration; one race resolves with a visible elapsed time and a winner.

### 2. 3D Scene and Vehicle Motion

- **Why isolated:** Two procedural vehicles, a long perspective track, and animated start lamps must remain visually coherent in a full-screen browser canvas.
- **Approach:** Use simplified procedural meshes with a locked low lateral camera. Translate cars along one axis, roll the wheels, gently squat chassis under throttle, and use material emissive values for lamp state rather than an imported physics or animation pipeline.
- **Verify:** Both cars remain grounded in separate lanes from stage through finish; wheel rotation, body movement, and car translation begin only after green; amber-to-green-to-results state transitions are visible and no vehicle clips through the road or finish truss.

## Main Build

The production build combines a full-screen drag-strip scene, physical timing tree, keyboard and touch race controls, performance HUD, controllable engine-tuning garage, named rivals, event-bracket progression, post-race payouts, and a subscription-ready membership display. The campaign uses original race events and rival copy while carrying the user-authorized Fast & Furious franchise presentation.

- **Assets needed:** A 16:9 visual target; one custom timing-tree/track scene reference; player and rival vehicle visual references; a transparent gauge-needle monogram.
- **Verify:**
  - Holding the primary race input produces an RPM response and player input maps clearly to on-screen controls.
  - Stage, amber sequence, green start, reaction timing, quarter-mile progress, shifting, nitro, and results are always readable.
  - Garage upgrades alter power, grip, mass, and displayed quarter-mile estimate; a purchase cannot reduce cash below zero.
  - Winning pays the entry purse, unlocks the next rival, and advances the story/event index.
  - The campaign and membership panels are keyboard reachable and fit desktop and narrow mobile screens.
  - No missing textures, visible fallback materials, clipping, placeholder art, or browser console errors appear during captured gameplay.
  - The screenshot holds the visual target’s petrol-black palette, wet-lane material, low perspective, physical starting tree, and dense-but-readable instrumentation.
  - **Presentation proof bundle:** A deterministic `?demo` run displays a staged start, green-light launch, gear change, and result state for visual proof in the final screenshot pass.
