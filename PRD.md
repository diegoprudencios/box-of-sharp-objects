PRD — Geometric Physics Art Generator
Overview
A browser-based interactive art tool that generates variations of a specific concept: a rotating geometric container holding weighted shapes that respond to gravity and physics, with a small gold circle always present — representing a dream being displaced by heavier forces.
Built in Next.js + React + TypeScript + Tailwind. Physics via Matter.js.

Core Concept
A main geometric container rotates continuously on its own axis, centered on screen. Inside it, geometric shapes behave with real physics — gravity, collision, momentum. One shape is always a gold/yellow circle, fixed in identity but free in movement. The other shapes are heavier, larger, and push it around.

Layout

Two-column layout: 30% controls panel (left) / 70% canvas (right)
Background color: #808080 (mid-grey, placeholder — will change later)
Controls panel: dark theme
Canvas area: same grey background, container centered within it


Features
1. The Canvas

The main container is centered in the 70% canvas area at all times
It rotates continuously around its center point when playing
Gravity is global and fixed (always pulls down) — the container rotates around it, so shapes inside tumble, slide and collide as the walls shift beneath them
Canvas renders at 2x pixel density (retina-ready)

2. The Container

Fills approximately 70% of the canvas area
User can select shape:

Square
Hexagon
Triangle
Pentagon


Rendered as a closed rigid body with white or light fill so shapes inside are clearly readable
When the user switches container shape, the scene resets with the new shape

3. Shapes Inside

A fixed set of shape types: rectangles (varied proportions), circles, hexagons, bars (long thin rectangles)
The gold circle is always present — always one, always #F5C518, always locked
All other shapes are generated randomly from the shape set
User controls quantity of non-gold shapes: range of 3–10
Shapes are dropped into the container on load and on reset — not placed statically
The gold circle has slightly less mass than the other shapes — intentional, part of the concept

4. Color Control

User selects a color palette distributed randomly across non-gold shapes
4 preset palettes:

Palette 1 (original): coral red #E8526A, sage green #7FAF7A, navy blue #2B3F8C, lilac #8B7BB5
Palette 2: muted earth tones — terracotta, sand, olive, warm brown
Palette 3: high contrast primaries — red, blue, yellow, black
Palette 4: monochrome greys


Gold circle color is always locked — never affected by palette selection

5. Controls Panel
Dark panel, left side, 30% width. Contains:
ControlTypeDetailsPlay / PauseButtonToggles container rotation. Physics continues while paused — shapes still settle under gravityRotation speedSlider0.2–3 RPMNumber of shapesSlider3–10Container shapeButton groupSquare / Hexagon / Triangle / PentagonColor paletteSwatch selector4 preset optionsReset / RegenerateButtonClears and respawns all shapes freshSave frameButtonExports current canvas state as PNG
6. Export

"Save frame" button captures the current canvas state as PNG
Output resolution: 3000×3000px minimum, rendered offscreen at required scale
Square format — consistent with NFT minting standards
File named art-[timestamp].png


Technical Notes

Physics engine: Matter.js
Container walls rotate as static rigid bodies using Body.setAngle() updated each frame
Gravity vector remains fixed at (0, 1) — do not rotate the world, rotate only the container bodies
Shapes are dynamic bodies spawned at the top of the container interior on load/reset
On Play/Pause: toggling pause stops the rotation increment each frame but Matter.js engine keeps running so shapes continue to settle naturally
On container shape change or Reset: clear all dynamic bodies, respawn fresh
Gold circle has slightly less mass than other shapes (intentional)


Boundary Behaviour

Shapes must always remain inside the container
If any dynamic body is detected outside container bounds, it is immediately repositioned to the container center and re-added as a new body
This check runs on every frame


Out of Scope (v1)

Custom color picker per shape
Animated export / GIF
Seed-based generation for reproducible outputs (future — needed for NFT provenance)
Sound
Mobile optimisation
Saving or sharing configurations