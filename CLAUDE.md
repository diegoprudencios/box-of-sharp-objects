# CLAUDE.md — Life Is A Box Full Of Sharp Objects

Technical reference for Cursor.

After every session that changes architecture, props, patterns, or constraints:
1. Update this file to reflect the change
2. Run: git add CLAUDE.md && git commit -m "docs: update CLAUDE.md" && git push origin main

---

## File structure

app/page.tsx — UI panel, state, palette definitions, prop passing
components/PhysicsCanvas.tsx — Matter.js world, shapes, containers, rotation

---

## PhysicsCanvas props

```ts
type PhysicsCanvasProps = {
  rotationSpeed: number        // degrees/frame — 0.6 / 1.2 / 1.8
  shapeCount: number           // currently unused in rendering, kept for future
  containerShape: 'square' | 'hexagon' | 'circle'
  resetKey: number             // increment to remount
  isRunning: boolean           // pause/play — stops rotation only
  rotationReversed: boolean    // reverses rotation direction
  palette: Palette             // shape and background colors
}

type Palette = {
  id: 'original' | 'ember' | 'constructivist' | 'glacier'
  container: string
  square: string
  bar: string
  triangle: string
  hexagon: string
  background: string
}
```

---

## Ref pattern — critical

All dynamic props must be synced to a ref via a separate useEffect.
Never read props directly inside Matter.js event handlers — stale closure.

```ts
// Each dynamic prop gets its own useEffect
useEffect(() => { isRunningRef.current = isRunning }, [isRunning])
useEffect(() => { rotationReversedRef.current = rotationReversed }, [rotationReversed])
useEffect(() => { rotationSpeedRef.current = rotationSpeed }, [rotationSpeed])
useEffect(() => { paletteRef.current = palette }, [palette])
```

Main useEffect dependency array is fixed and must never change:
```ts
useEffect(() => { ... }, [shapeCount, containerShape, resetKey])
```

Palette and speed changes must never trigger a remount.
useEffect dependency arrays must always be fixed size — React throws if size changes.

---

## Refs maintained across renders

```ts
renderRef           // Matter.js Render instance
backgroundBodyRef   // sensor body for container fill
containerWallsRef   // array of static wall bodies
dynamicBodiesRef    // array of dynamic shape bodies (index 0 = gold circle)
```

Used by the palette useEffect to update colors without remounting:
```ts
// dynamicBodiesRef indices
0 — gold circle (never recolor — always #F5C518)
1 — square
2 — bar
3 — triangle
4 — hexagon
```

---

## Shape set

All sizes relative to containerWidth (= size variable).
Sizes are fixed and intentional — do not randomize.

| Shape   | Size                                  | Notes                        |
|---------|---------------------------------------|------------------------------|
| Circle  | radius = base * 0.03                  | Gold #F5C518, sacred, index 0 |
| Square  | side = base * 0.14                    | index 1                      |
| Bar     | width = base * 0.40, h = base * 0.06 | index 2                      |
| Triangle| circumradius = base * 0.16            | index 3                      |
| Hexagon | circumradius = base * 0.24            | dominant shape, index 4      |

Gold circle: never recolor, never remove, never resize.
No other circles in the shape set.

---

## Container sizes

```ts
square:   size = 0.6 * Math.min(width, height)
hexagon:  size = 0.75 * Math.min(width, height)
circle:   size = 0.75 * Math.min(width, height)
```

Each container has a sensor body background that rotates with the walls.
Background geometry must match container shape exactly:
- Square → rectangle sensor
- Hexagon → fromVertices polygon sensor
- Circle → Bodies.circle sensor
Wall render color must always match palette.background — walls are
never meant to be visible. Container fill comes from the sensor body only.

---

## Rotation

Gravity is always fixed at (0, 1). Never rotate the gravity vector.
Only the container walls rotate via Body.setAngle() in beforeUpdate.

```ts
const angleStep = rotationSpeedRef.current * (Math.PI / 180)
angle += rotationReversedRef.current ? -angleStep : angleStep
```

Each wall rotates using stored wallOffsets and wallBaseAngles:
```ts
const rotatedX = centerX + ox * Math.cos(angle) - oy * Math.sin(angle)
const rotatedY = centerY + ox * Math.sin(angle) + oy * Math.cos(angle)
Body.setPosition(wall, { x: rotatedX, y: rotatedY })
Body.setAngle(wall, wallBaseAngles[idx] + angle)
```

Circle container applies tangential force per frame to simulate wall drag:
```ts
magnitude = body.mass * rotationSpeedRef.current * 0.008 * direction
```

---

## Palette updates without remount

Palette changes are applied in a separate useEffect that reads refs directly.
No physics reset, no remount — only render colors are updated.

```ts
useEffect(() => {
  // update render.options.background
  // update backgroundBodyRef.current.render.fillStyle
  // update containerWallsRef wall fill styles
  // update dynamicBodiesRef[1..4] fill styles
  // never touch dynamicBodiesRef[0] (gold circle)
}, [palette])
```

---

## Spawn positions

Shapes spawn inside the container near the top and fall in under gravity.
Horizontal position: centerX ± size * 0.25 (random per shape).
Vertical position: centerY - half + wallThickness + containerWidth * 0.12.
Initial angle: random between -0.3 and 0.3 radians.

---

## Physics constants

```ts
engine.gravity = { x: 0, y: 1 }  // never change
restitution: 0.3
friction: 0.7
frictionAir: 0.015
density: 1.2 (shapes) / 0.8 (gold circle — slightly lighter)
wallThickness: Math.max(20, size * 0.05)
```

---

## Key rules

- "use client" on line 1 must always be typed manually — never pasted
- Always end Cursor prompts with "Touch nothing else"
- Never add rotationSpeed, palette, isRunning, or rotationReversed
  to the main useEffect dependency array
- Shapes must never escape the container
- Gold circle is sacred — never recolor, never remove
