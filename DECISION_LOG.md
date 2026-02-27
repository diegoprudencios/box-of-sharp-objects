# Decision Log — Life Is A Box Full Of Sharp Objects

---

## Entry 001 — Project Setup — 25 Feb 2026

**Context**
Diego starting a new generative art project from scratch.

**Problem**
Needed a clean repo, local dev environment, and framework scaffold.

**Options Considered**
Starting inside existing crypto-portfolio project vs clean setup.

**Decision**
New GitHub repo, cloned locally, scaffolded with create-next-app (TypeScript, Tailwind, App Router). Matter.js installed separately.

**Rationale**
Clean separation from other projects. Next.js gives a solid foundation for future export and NFT features.

**Outcome**
Working local dev environment with all dependencies in ~30 minutes.

**Key Learnings**
Cloning from inside an existing project folder creates nested repos. Always cd ~ before cloning.

**Open Questions**
None.

---

## Entry 002 — Project Rename — 25 Feb 2026

**Context**
Working title "life-is-hard" felt generic and disconnected from the concept.

**Problem**
Name didn't reflect the project specifically enough to carry into a portfolio or NFT context.

**Options Considered**
Keeping "life-is-hard" vs finding a name that earned its meaning conceptually.

**Decision**
Renamed to "Life Is A Box Full Of Sharp Objects" — repo slug box-of-sharp-objects.

**Rationale**
More specific, more visceral, conceptually true — the gold circle is small and soft, displaced by heavier, sharper things. The name describes what you're actually watching.

**Outcome**
GitHub repo renamed, git remote URL updated locally, panel title updated.

**Key Learnings**
git remote set-url origin updates the remote without needing to re-clone.

**Open Questions**
None.

---

## Entry 003 — Physics Architecture — 25 Feb 2026

**Context**
Core mechanic is a rotating container with physics-based shapes inside.

**Problem**
How to implement container rotation without breaking gravity or making shapes feel weightless.

**Options Considered**
— Rotating the gravity vector each frame
— Rotating the container walls while keeping gravity fixed

**Decision**
Gravity stays fixed at (0, 1) always. Only the container walls rotate using Body.setAngle() each frame.

**Rationale**
Rotating gravity would break the conceptual meaning — the world is indifferent, only the box spins. This distinction is core to the project.

**Outcome**
Implemented correctly. Shapes tumble naturally as walls shift beneath them.

**Key Learnings**
This is a locked constraint. Never change it regardless of performance pressure or feature requests.

**Open Questions**
None — locked.

---

## Entry 004 — Container Background — 25 Feb 2026

**Context**
Needed a fill color inside the container that rotates in sync with the walls.

**Problem**
Multiple approaches failed before finding a stable solution.

**Options Considered**
— Sensor rectangle body (misaligned, size didn't match walls)
— Canvas context drawing via beforeRender event (complex, hard to sync)
— CSS overlay (doesn't rotate with physics)
— Sensor body matched to container geometry

**Decision**
Sensor body approach per container type — rectangle for square, triangle segments for hexagon, Bodies.circle for circle.

**Rationale**
Each container shape needs its own background geometry. A single rectangle sensor always bleeds outside non-rectangular walls.

**Outcome**
Working on all three container types.

**Key Learnings**
Match the sensor geometry to the container geometry exactly. Trying to reuse one approach across different shapes always fails.

**Open Questions**
Approach needs revisiting if more container shapes are added.

---

## Entry 005 — Shape Set — 25 Feb 2026

**Context**
Initial shapes were generic circles and rectangles — no personality, no visual identity.

**Problem**
Gold circle wasn't reading as special. Shapes felt interchangeable.

**Options Considered**
— Stars with 10–20 points (tried, removed)
— Custom SVGs
— Pure geometric primitives

**Decision**
Square, long bar (4:1 ratio), triangle, hexagon. Gold circle is the only circle. Polygon shapes built with Bodies.fromVertices(). poly-decomp installed for concave body support.

**Rationale**
Geometric set is closer to Swiss/Brazilian modernist references. Making the gold circle the only round form makes it sacred and visually singular.

**Outcome**
Clean, deliberate shape vocabulary. Each shape has a distinct silhouette that reads clearly at any rotation.

**Key Learnings**
Stars created physics pockets that trapped the gold circle. Simpler geometry is better for physics stability and visual clarity.

**Open Questions**
Whether to add more shape variety in future palette variations.

---

## Entry 006 — Size Hierarchy — 25 Feb 2026

**Context**
All shapes were similar in size — no visual weight or hierarchy.

**Problem**
Gold circle didn't feel precious or outnumbered. Shapes felt like equals.

**Options Considered**
— Golden ratio progression (tried, too subtle at this scale)
— Random sizes within a range
— Fixed deliberate sizes assigned by shape type

**Decision**
Fixed intentional sizes: gold circle very small, bar long and thin, square medium, triangle medium-large, hexagon dominant.

**Rationale**
Golden ratio steps were too subtle at this scale — differences weren't readable. Fixed sizes give more control and intentionality.

**Outcome**
Clear visual hierarchy. Gold circle reads as small and precious. Hexagon dominates. Bar reads as a completely different kind of object.

**Key Learnings**
Mathematical progressions don't always translate well visually at small scale. Trust your eye over the formula.

**Open Questions**
Sizes may need per-container adjustment since available space differs.

---

## Entry 007 — Container Shape Implementation — 25 Feb 2026

**Context**
PRD specifies multiple container shapes. Early attempts to implement more than one at a time broke the physics.

**Problem**
Cursor kept modifying wall positioning logic across all containers when asked to add a new one, breaking previously working states.

**Options Considered**
— Implementing all shapes in one pass
— One shape at a time with a commit between each

**Decision**
One container shape at a time. Commit after each working state. Every Cursor prompt ends with "Touch nothing else" and explicitly names what must not change.

**Rationale**
Every failure was caused by Cursor touching too much at once.

**Outcome**
Square, hexagon, and circle all working. Switching via icon selector triggers a full scene reset with the correct container geometry.

**Key Learnings**
Never ask Cursor to implement multiple container shapes in one prompt. "Touch nothing else" is not optional — it changes the output significantly.

**Open Questions**
Triangle container not yet implemented.

---

## Entry 008 — UI Panel — 25 Feb 2026

**Context**
PRD specifies a minimal dark control panel that doesn't compete with the canvas.

**Problem**
Panel was lost twice due to missing commits. Dropdown for container selection felt wrong visually.

**Options Considered**
— Text dropdown for container selection
— Icon-based selector

**Decision**
Rebuilt panel with icon-based container selector, speed slider with inline pause/play and reverse buttons, reset button.

**Rationale**
Icon selector is more visual and on-brand. Lost work forced better commit discipline.

**Outcome**
Panel working and wired to all physics props.

**Key Learnings**
Commit after every working state. Small UI decisions (dropdown vs icons) have a bigger impact on overall feel than expected.

**Open Questions**
Export button not yet in panel.

---

## Entry 009 — Circle Container Physics — 25 Feb 2026

**Context**
Circle container has no angled surfaces — shapes settle at the bottom and don't respond to rotation.

**Problem**
Friction alone can't push shapes in a circular container. Without corners or edges, gravity always wins.

**Options Considered**
— High wall friction (tried, no effect)
— Tangential force applied per frame to each dynamic body
— Hide the circle option entirely

**Decision**
Apply tangential force each frame: body.mass * rotationSpeed * 0.008, perpendicular to the radius vector from center to body.

**Rationale**
Simulates wall drag as it spins. Force magnitude needed to be much higher than initially estimated (0.0003 → 0.008).

**Outcome**
Shapes move with a centrifugal quality. Occasional sticking when shapes settle. Acceptable for now.

**Key Learnings**
Circular containers need explicit force simulation. The centrifugal effect may be a feature worth keeping.

**Open Questions**
Whether circle container stays in the final product. Sticking behaviour may need further tuning.

---

## Entry 010 — Playback Controls — 25 Feb 2026

**Context**
Original stop button triggered a full component remount instead of pausing rotation.

**Problem**
Pause was resetting the scene. No way to reverse rotation direction.

**Options Considered**
— Remount on pause (wrong — destroys physics state)
— Pass isRunning as prop and gate the rotation increment
— Separate reverse prop negating the angle step

**Decision**
Pause/play gates the angle increment in beforeUpdate via a ref. Reverse toggles direction by negating angleStep via a separate ref. Both refs stay in sync via useEffect.

**Rationale**
Physics world must keep running during pause. Using refs avoids stale closure bugs inside Matter.js event handlers.

**Outcome**
Pause stops rotation cleanly. Reverse works in both states. Scene is never remounted on either action.

**Key Learnings**
Never read props directly inside Matter.js event handlers — they capture stale values. Always sync to a ref via useEffect.

**Open Questions**
None.

---

## Entry 011 — Shape Size Increase — 25 Feb 2026

**Context**
Shapes felt too small relative to the container, leaving too much empty space.

**Problem**
Visual weight of the shape set wasn't filling the container enough. Composition felt sparse.

**Options Considered**
— Adjusting individual shapes selectively
— Uniform 20% increase across all non-gold shapes

**Decision**
All non-gold shapes increased by 20%. Gold circle size unchanged.

**Rationale**
Keeping the gold circle at its original size increases the contrast between it and everything else — reinforcing its smallness and preciousness as the only round form.

**Outcome**
Shapes fill the container more convincingly. Gold circle reads as even more isolated.

**Key Learnings**
The gold circle's size is a visual anchor — changing it would shift the entire hierarchy. Treat it as fixed even when resizing everything else.

**Open Questions**
May need per-container size adjustments as new container shapes are added.

---

## Entry 012 — Playback Controls Redesign — 25 Feb 2026

**Context**
Original speed control was a slider. Needed to feel more like a tool, less like a generic UI.

**Problem**
Slider allowed arbitrary values and took too much panel space. No consistent visual language with the rest of the panel.

**Options Considered**
— Keep slider, add separate pause/reverse buttons
— Replace all three with a unified square button row matching container selector style
— Circular icon buttons

**Decision**
Three equal-width square buttons spanning full panel width: speed cycle (1x/2x/3x), pause/play, reverse. Speed cycles through fixed values only — no arbitrary input. Reverse flips the SVG icon horizontally when active.

**Rationale**
Fixed speed values (0.6/1.2/1.8) are more intentional than a free slider. The button row creates visual consistency with the container selector. Icon flip on reverse gives immediate visual feedback without needing labels.

**Outcome**
All three controls working. Speed changes don't trigger remount. Pause stops rotation only — physics world keeps running. Reverse works in both paused and running states.

**Key Learnings**
Never read props directly inside Matter.js event handlers — they capture stale closure values. Always sync to a ref via useEffect. useEffect dependency arrays must be fixed size — React throws if the array length changes between renders.

**Open Questions**
None.

---

## Entry 013 — Palette System — 26 Feb 2026

**Context**
Project had a single fixed color palette. As a generative art tool with NFT ambitions, color variation is essential for producing distinct outputs.

**Problem**
No way to explore different color combinations. Single palette limits the visual range of the tool.

**Options Considered**
— Random per-shape colors (too unpredictable, ugly combinations likely)
— 2x2 grid of palette chips in panel
— Single row of palette chips
— Dropdown with color swatch previews

**Decision**
Custom dropdown component with curated palettes. Trigger shows color swatches filling full width. Each palette option is a full-width swatch row. No palette names shown — pure visual selection.

**Rationale**
Curated palettes give controlled variation — every combination is intentionally good. Dropdown saves panel space. Swatch-only UI is more visual and on-brand.

**Outcome**
Palette selector built and wired to PhysicsCanvas. Palette changes update shape colors and canvas background without remounting. Gold circle color never changes regardless of palette.

**Key Learnings**
Palette changes must be synced via ref like other dynamic props — never in the main useEffect dependency array. Canvas background color is part of the palette, not a fixed value. Duplicate hex values in palette objects will cause React key errors if colors are used as keys — always use index.

**Open Questions**
Whether palette becomes part of the seed for NFT provenance. Whether users can define custom palettes in a future version.

---

## Entry 014 — CLAUDE.md and Documentation System — 26 Feb 2026

**Context**
System prompt was becoming too detailed with hex codes, exact sizes, and values likely to change. Cursor sessions had no persistent context.

**Problem**
Technical values in the system prompt go stale quickly. Every new Cursor session starts without context about architecture decisions.

**Options Considered**
— Keep everything in the system prompt
— Split into Claude.ai system prompt (conceptual) and CLAUDE.md (technical)

**Decision**
Split into two files. System prompt stays conceptual — constraints, principles, who Diego is. CLAUDE.md in the repo root holds all technical details — prop types, ref patterns, shape indices, container sizes, physics constants. Cursor reads CLAUDE.md automatically.

**Rationale**
Values that change frequently shouldn't live in the system prompt. Architecture patterns that Cursor needs to follow should be as close to the code as possible. CLAUDE.md is version controlled alongside the code.

**Outcome**
CLAUDE.md created and committed. Cursor confirmed reading it correctly. Auto-update rule added: Cursor updates CLAUDE.md and commits at the end of any session that changes architecture.

**Key Learnings**
Cursor reads CLAUDE.md automatically — no setup needed. The auto-update rule only fires at end of session, not after every individual file edit.

**Open Questions**
None.

---

## Entry 015 — Wall Color Fix and Design Principle — 26 Feb 2026

**Context**
Wall bleed was visible on non-original palettes — the sensor body background was bleeding outside the container boundaries.

**Problem**
Two approaches attempted: (1) fix sensor geometry to match walls exactly, (2) match wall color to canvas background. First approach was over-engineered.

**Options Considered**
— Fix sensor body geometry: size - wallThickness * 2
— Set wall render color to palette.background so bleed is invisible

**Decision**
Wall color always matches palette.background. Walls are never meant to be visible. Container fill is handled entirely by the sensor body.

**Rationale**
Hiding the bleed is simpler and equally correct for the output. The wall was never meant to be seen anyway. No physics geometry needs to change.

**Outcome**
Wall bleed invisible across all palettes and container types.

**Key Learnings**
When something looks wrong visually, ask if it can be hidden before trying to fix the geometry. Simpler solutions that don't touch physics are always preferable.

**Open Questions**
None.

---

## Entry 016 — Color Weight Principle and Palette Rebalancing — 26 Feb 2026

**Context**
Palette colors had no relationship to shape size. Smaller shapes were sometimes darker than larger ones.

**Problem**
No visual principle connecting color to physical weight. Compositions felt arbitrary.

**Options Considered**
— Enforce size-to-darkness rule in code
— Apply as a design principle when curating palettes manually

**Decision**
Design principle only, not a coded rule: smaller shapes get lighter colors, larger shapes get darker colors. Size order: square (lightest) → bar → triangle → hexagon (darkest). Gold circle explicitly exempt — it is small and bright by design.

**Rationale**
Coding the rule would conflict with the gold circle and remove creative control. Applying it manually gives the same visual result with more flexibility. The gold circle's brightness is intentional — its contrast against heavier, darker shapes reinforces its preciousness.

**Outcome**
All three palettes rebalanced. Weight principle visible in every combination.

**Key Learnings**
The weight rule breaks down in monochromatic palettes — when all shapes are the same hue, darkness alone creates no tension. At least one disruptor color is needed to give the composition life.

**Open Questions**
Should a fourth palette replace Glacier? Is the weight rule strict or can some palettes break it intentionally for effect?

---

## Entry 017 — Palette Reduction and Reorder — 26 Feb 2026

**Context**
Glacier palette couldn't be resolved — no color combination produced sufficient visual tension while staying true to the concept.

**Problem**
Monochromatic blue palette with weight rule applied made all shapes feel the same. Adding a warm disruptor (orange bar) worked partially but triangle still had no good solution.

**Options Considered**
— Keep glacier with white triangle
— Replace glacier with a different concept
— Remove glacier entirely

**Decision**
Glacier removed. Palette selector now has three palettes: Original, Constructivist, Ember. Checkmark removed from palette selector. Palette order updated.

**Rationale**
A palette that can't be resolved is worse than no palette. Three strong palettes are better than four where one is weak. Checkmark was visual noise — swatch selection is self-evident.

**Outcome**
Three palettes working. Selector cleaner without checkmark.

**Key Learnings**
Monochromatic palettes need a structural disruptor to work — one shape that breaks the color family entirely. Without it, size-based darkness alone can't create enough tension.

**Open Questions**
Whether a fourth palette should be added in a future session.

---

## Entry 018 — Container Bump Feedback (Paused) — 26 Feb 2026

**Context**
Explored adding a small visual “bump” to the container when a shape hits the wall — e.g. container shifts slightly down — to make motion feel more organic and reactive.

**Problem**
Initial implementation caused shaky, glitchy motion. Later tuning (bigger displacement, “Disney”-smooth feel) still didn’t read clearly. Feature was paused and all related code removed.

**Options Considered**
— Collision-driven offset with decay only (too many collision events → stacking)
— One add per frame + cooldown (reduced jitter)
— Display lerp (smooth applied offset) + slower decay (softer motion)
— Scaling bump to container size (fixed pixels invisible on large canvas)
— Keeping the feature with further tuning vs removing and documenting learnings

**Decision**
Remove all bump/collision-feedback code for now. Document learnings in this log for a possible future retry.

**Rationale**
The experiment produced clear technical learnings but no shipping-ready behaviour in this session. Keeping half-finished logic in the codebase would add maintenance and confusion. Capturing what worked and what didn’t preserves value without leaving dead code.

**Outcome**
Bounce feature removed. Container again uses fixed center only. DECISION_LOG updated with this entry.

**Key Learnings**
— Matter.js `collisionStart` can fire many times per physical bounce (multiple contacts/frames). Rate-limit: e.g. one add per frame via a flag, and a short cooldown (e.g. 100–150 ms) so one impact doesn’t stack.
— Apply the bump to a “target” value, then lerp a separate “display” offset toward it each frame. Use the display offset for container position. That smooths both the hit and the return and avoids harsh snaps.
— Any visual feedback in world units must scale with container or canvas size (e.g. bump strength/max as a fraction of `size`). Fixed pixel values are invisible on large viewports.
— If we re-add this later: collision listener → set flag; in beforeUpdate add to target once per frame when not in cooldown; decay target; lerp display toward target; use display for center. Remove listener in cleanup.

**Open Questions**
Whether to re-attempt container bump feedback in a future session with the above pattern, or leave the interaction as-is.
