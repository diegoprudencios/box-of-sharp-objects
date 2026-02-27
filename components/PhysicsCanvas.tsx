"use client";

import { useEffect, useRef } from "react";
import Matter, {
  Engine,
  Render,
  Runner,
  Bodies,
  Composite,
  Body,
  Events,
} from "matter-js";
import decomp from "poly-decomp";

Matter.Common.setDecomp(decomp);

const BACKGROUND_COLOR = "#FCFCFC";
const GOLD_COLOR = "#F5C518";

export type ContainerShape = "square" | "hexagon" | "circle";

export type Palette = {
  id: "original" | "ember" | "constructivist";
  container: string;
  square: string;
  bar: string;
  triangle: string;
  hexagon: string;
  background: string;
};

type PhysicsCanvasProps = {
  rotationSpeed: number;
  shapeCount: number;
  containerShape: ContainerShape;
  resetKey: number;
  isRunning: boolean;
  rotationReversed: boolean;
  palette: Palette;
};

export default function PhysicsCanvas({
  rotationSpeed,
  shapeCount,
  // containerShape is currently unused; square container is always used
  // to keep physics behavior identical for now.
  containerShape,
  resetKey,
  isRunning,
  rotationReversed,
  palette,
}: PhysicsCanvasProps) {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const isRunningRef = useRef(isRunning);
  const rotationReversedRef = useRef(rotationReversed);
  const rotationSpeedRef = useRef(rotationSpeed);
  const paletteRef = useRef<Palette>(palette);

  const renderRef = useRef<Render | null>(null);
  const backgroundBodyRef = useRef<Body | null>(null);
  const containerWallsRef = useRef<Body[]>([]);
  const dynamicBodiesRef = useRef<Body[]>([]);

  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  useEffect(() => {
    rotationReversedRef.current = rotationReversed;
  }, [rotationReversed]);

  useEffect(() => {
    rotationSpeedRef.current = rotationSpeed;
  }, [rotationSpeed]);

  useEffect(() => {
    paletteRef.current = palette;
  }, [palette]);

  useEffect(() => {
    const element = sceneRef.current;
    if (!element) return;

    let cleanup: (() => void) | undefined;
    const id = setTimeout(() => {
      const width = element.offsetWidth;
      const height = element.offsetHeight;

      const engine = Engine.create();
    const world = engine.world;

    engine.gravity.x = 0;
    engine.gravity.y = 1;

    const currentPalette = paletteRef.current;

    const render = Render.create({
      element,
      engine,
      options: {
        width,
        height,
        wireframes: false,
        background: currentPalette.background ?? BACKGROUND_COLOR,
      },
    });

    const pixelRatio = window.devicePixelRatio || 1;
    render.canvas.width = width * pixelRatio;
    render.canvas.height = height * pixelRatio;
    render.canvas.style.width = `${width}px`;
    render.canvas.style.height = `${height}px`;
    (render as any).options.pixelRatio = pixelRatio;

    const runner = Runner.create();

    const size =
      containerShape === "hexagon" || containerShape === "circle"
        ? 0.75 * Math.min(width, height)
        : 0.6 * Math.min(width, height);
    const half = size / 2;
    const wallThickness = Math.max(20, size * 0.05);

    const centerX = width / 2;
    const centerY = height / 2;

    const wallOptions = {
      isStatic: true,
      friction: 0.8,
      restitution: 0.1,
      render: { fillStyle: paletteRef.current.background ?? BACKGROUND_COLOR },
    } as const;

    let containerWalls: Body[];
    let wallOffsets: { x: number; y: number }[];
    let wallBaseAngles: number[];

    if (containerShape === "hexagon") {
      const hexWallThickness = wallThickness * 1.5;
      const hexSideLength = half;
      const hexWalls: Body[] = [];
      const offsets: { x: number; y: number }[] = [];
      const baseAngles: number[] = [];
      for (let i = 0; i < 6; i += 1) {
        const angle0 = -Math.PI / 2 + (i * Math.PI) / 3;
        const angle1 = -Math.PI / 2 + ((i + 1) * Math.PI) / 3;
        const midAngle = (angle0 + angle1) / 2;
        const midDist = half * Math.cos(Math.PI / 6);
        const wallX = centerX + midDist * Math.cos(midAngle);
        const wallY = centerY + midDist * Math.sin(midAngle);
        const wallAngle = midAngle + Math.PI / 2;
        const wall = Bodies.rectangle(
          wallX,
          wallY,
          hexSideLength,
          hexWallThickness,
          { ...wallOptions, angle: wallAngle }
        );
        hexWalls.push(wall);
        offsets.push({ x: wall.position.x - centerX, y: wall.position.y - centerY });
        baseAngles.push(wallAngle);
      }
      containerWalls = hexWalls;
      wallOffsets = offsets;
      wallBaseAngles = baseAngles;
    } else if (containerShape === "circle") {
      const circleSides = 90;
      const circleWalls: Body[] = [];
      const offsets: { x: number; y: number }[] = [];
      const baseAngles: number[] = [];
      const chordLength = 2 * half * Math.sin(Math.PI / circleSides);
      for (let i = 0; i < circleSides; i += 1) {
        const angle0 = -Math.PI / 2 + (i * 2 * Math.PI) / circleSides;
        const angle1 = -Math.PI / 2 + ((i + 1) * 2 * Math.PI) / circleSides;
        const midAngle = (angle0 + angle1) / 2;
        const midDist = half * Math.cos(Math.PI / circleSides);
        const wallX = centerX + midDist * Math.cos(midAngle);
        const wallY = centerY + midDist * Math.sin(midAngle);
        const wallAngle = midAngle + Math.PI / 2;
        const wall = Bodies.rectangle(
          wallX,
          wallY,
          chordLength,
          wallThickness,
          {
            ...wallOptions,
            angle: wallAngle,
            friction: 1,
            frictionStatic: 1,
          }
        );
        circleWalls.push(wall);
        offsets.push({
          x: wall.position.x - centerX,
          y: wall.position.y - centerY,
        });
        baseAngles.push(wallAngle);
      }
      containerWalls = circleWalls;
      wallOffsets = offsets;
      wallBaseAngles = baseAngles;
    } else {
      const topWall = Bodies.rectangle(
        centerX,
        centerY - half,
        size,
        wallThickness,
        wallOptions
      );
      const bottomWall = Bodies.rectangle(
        centerX,
        centerY + half,
        size,
        wallThickness,
        wallOptions
      );
      const leftWall = Bodies.rectangle(
        centerX - half,
        centerY,
        wallThickness,
        size,
        wallOptions
      );
      const rightWall = Bodies.rectangle(
        centerX + half,
        centerY,
        wallThickness,
        size,
        wallOptions
      );
      containerWalls = [topWall, bottomWall, leftWall, rightWall];
      wallOffsets = [
        { x: 0, y: -half },
        { x: 0, y: half },
        { x: -half, y: 0 },
        { x: half, y: 0 },
      ];
      wallBaseAngles = [0, 0, 0, 0];
    }

    let backgroundBody: Body;
    if (containerShape === "hexagon") {
      const hexInnerRadius = half - wallThickness / 2;
      const hexBgVerts: { x: number; y: number }[] = [];
      for (let i = 0; i < 6; i += 1) {
        const a = -Math.PI / 2 + (i * Math.PI) / 3;
        hexBgVerts.push({
          x: centerX + hexInnerRadius * Math.cos(a),
          y: centerY + hexInnerRadius * Math.sin(a),
        });
      }
      backgroundBody = Bodies.fromVertices(
        centerX,
        centerY,
        [hexBgVerts],
        {
          isStatic: true,
          isSensor: true,
          render: { fillStyle: currentPalette.container },
        }
      );
    } else if (containerShape === "circle") {
      const circleInnerRadius = half - wallThickness / 2;
      backgroundBody = Bodies.circle(centerX, centerY, circleInnerRadius, {
        isStatic: true,
        isSensor: true,
        render: { fillStyle: currentPalette.container },
      });
    } else {
      const interiorWidth = size - wallThickness;
      const interiorHeight = size - wallThickness;
      backgroundBody = Bodies.rectangle(
        centerX,
        centerY,
        interiorWidth,
        interiorHeight,
        {
          isStatic: true,
          isSensor: true,
          render: { fillStyle: currentPalette.container },
        }
      );
    }

    const containerWidth = size;
    const base = containerWidth;
    const goldRadius = base * 0.03;
    const circleStartY = centerY - half + wallThickness + goldRadius * 2;

    const goldCircle = Bodies.circle(centerX, circleStartY, goldRadius, {
      restitution: 0.75,
      friction: 0.6,
      frictionAir: 0.003,
      density: 0.8,
      render: { fillStyle: GOLD_COLOR },
    });

    const dynamicBodies: Body[] = [goldCircle];

    const spawnBaseY = centerY - half + wallThickness + containerWidth * 0.12;
    const horizontalRange = size * 0.25;
    const density = 1.2;

    // Square: side = base * 0.14 * scale
    const squareScale = 0.8 + Math.random() * 0.4;
    const squareSize = base * 0.14 * squareScale;
    const squareX = centerX + (Math.random() * 2 - 1) * horizontalRange;
    const squareBody = Bodies.rectangle(
      squareX,
      spawnBaseY,
      squareSize,
      squareSize,
      {
        restitution: 0.75,
        friction: 0.4,
        frictionAir: 0.003,
        density: density * 1.1,
        render: { fillStyle: currentPalette.square },
      }
    );
    Body.setAngle(squareBody, (Math.random() - 0.5) * Math.PI * 0.5);
    dynamicBodies.push(squareBody);

    // Bar: width = base * 0.40 * scale, height = base * 0.06 * scale
    const barScale = 0.8 + Math.random() * 0.4;
    const barWidth = base * 0.4 * barScale;
    const barHeight = base * 0.06 * barScale;
    const barX = centerX + (Math.random() * 2 - 1) * horizontalRange;
    const barBody = Bodies.rectangle(barX, spawnBaseY, barWidth, barHeight, {
      restitution: 0.75,
      friction: 0.4,
      frictionAir: 0.003,
      density: density * 1.1,
        render: { fillStyle: currentPalette.bar },
    });
    Body.setAngle(barBody, (Math.random() - 0.5) * Math.PI * 0.5);
    dynamicBodies.push(barBody);

    // Triangle: circumradius = base * 0.16 * scale
    const triScale = 0.8 + Math.random() * 0.4;
    const triRadius = base * 0.16 * triScale;
    const triX = centerX + (Math.random() * 2 - 1) * horizontalRange;
    const triVerts = [
      { x: triX + triRadius * Math.cos(-Math.PI / 2), y: spawnBaseY + triRadius * Math.sin(-Math.PI / 2) },
      { x: triX + triRadius * Math.cos(-Math.PI / 2 + (2 * Math.PI) / 3), y: spawnBaseY + triRadius * Math.sin(-Math.PI / 2 + (2 * Math.PI) / 3) },
      { x: triX + triRadius * Math.cos(-Math.PI / 2 + (4 * Math.PI) / 3), y: spawnBaseY + triRadius * Math.sin(-Math.PI / 2 + (4 * Math.PI) / 3) },
    ];
    const triBody = Bodies.fromVertices(triX, spawnBaseY, [triVerts], {
      restitution: 0.75,
      friction: 0.4,
      frictionAir: 0.003,
      density: density * 1.1,
        render: { fillStyle: currentPalette.triangle },
    });
    Body.setAngle(triBody, (Math.random() - 0.5) * Math.PI * 0.5);
    dynamicBodies.push(triBody);

    // Hexagon: circumradius = base * 0.24 * scale
    const hexScale = 0.8 + Math.random() * 0.4;
    const hexRadius = base * 0.24 * hexScale;
    const hexX = centerX + (Math.random() * 2 - 1) * horizontalRange;
    const hexVerts: { x: number; y: number }[] = [];
    for (let i = 0; i < 6; i += 1) {
      const angle = (i * Math.PI) / 3 - Math.PI / 2;
      hexVerts.push({
        x: hexX + hexRadius * Math.cos(angle),
        y: spawnBaseY + hexRadius * Math.sin(angle),
      });
    }
    const hexBody = Bodies.fromVertices(hexX, spawnBaseY, [hexVerts], {
      restitution: 0.75,
      friction: 0.4,
      frictionAir: 0.003,
      density: density * 1.1,
        render: { fillStyle: currentPalette.hexagon },
    });
    Body.setAngle(hexBody, (Math.random() - 0.5) * Math.PI * 0.5);
    dynamicBodies.push(hexBody);

    const shapeEntries = [
      { body: squareBody, scale: squareScale },
      { body: barBody, scale: barScale },
      { body: triBody, scale: triScale },
      { body: hexBody, scale: hexScale },
    ];
    const shapeColors = [
      currentPalette.square,
      currentPalette.bar,
      currentPalette.triangle,
      currentPalette.hexagon,
    ];
    shapeEntries.sort((a, b) => a.scale - b.scale);
    shapeEntries.forEach((entry, i) => {
      entry.body.render.fillStyle = shapeColors[i];
    });

    Composite.add(world, [
      backgroundBody,
      ...containerWalls,
      ...dynamicBodies,
    ]);

    // Store references for palette updates without remounting
    renderRef.current = render;
    backgroundBodyRef.current = backgroundBody;
    containerWallsRef.current = containerWalls;
    dynamicBodiesRef.current = dynamicBodies;

    // Rotation state
    let angle = 0;

    Events.on(engine, "beforeUpdate", () => {
      if (!isRunningRef.current) {
        return;
      }

      const angleStep = rotationSpeedRef.current * (Math.PI / 180);
      angle += rotationReversedRef.current ? -angleStep : angleStep;

      Body.setPosition(backgroundBody, { x: centerX, y: centerY });
      Body.setAngle(backgroundBody, angle);

      // Rotate each wall around the container center
      containerWalls.forEach((wall, idx) => {
        const ox = wallOffsets[idx].x;
        const oy = wallOffsets[idx].y;
        const rotatedX =
          centerX + ox * Math.cos(angle) - oy * Math.sin(angle);
        const rotatedY =
          centerY + ox * Math.sin(angle) + oy * Math.cos(angle);
        Body.setPosition(wall, { x: rotatedX, y: rotatedY });
        Body.setAngle(wall, wallBaseAngles[idx] + angle);
      });

      // Circle container: apply tangential force so shapes are dragged by spinning walls
      if (containerShape === "circle") {
        const bodies = Composite.allBodies(world);
        const direction = rotationReversedRef.current ? -1 : 1;
        for (const body of bodies) {
          if (body.isStatic) continue;
          const dx = body.position.x - centerX;
          const dy = body.position.y - centerY;
          const len = Math.sqrt(dx * dx + dy * dy) || 0.0001;
          const magnitude = body.mass * rotationSpeedRef.current * 0.008 * direction;
          const tx = -dy / len;
          const ty = dx / len;
          Body.applyForce(body, body.position, {
            x: magnitude * tx,
            y: magnitude * ty,
          });
        }
      }
    });

      Render.run(render);
      Runner.run(runner, engine);

      cleanup = () => {
        renderRef.current = null;
        backgroundBodyRef.current = null;
        containerWallsRef.current = [];
        dynamicBodiesRef.current = [];

        Render.stop(render);
        Runner.stop(runner);
        Composite.clear(world, false);
        Engine.clear(engine);
        if (render.canvas?.parentNode) {
          render.canvas.parentNode.removeChild(render.canvas);
        }
        (render.textures as Record<string, HTMLImageElement>) = {};
      };
    }, 50);

    return () => {
      clearTimeout(id);
      cleanup?.();
    };
  }, [shapeCount, containerShape, resetKey]);

  // Apply palette changes without resetting physics
  useEffect(() => {
    const current = paletteRef.current;
    const render = renderRef.current;
    if (!render) return;

    (render.options as any).background = current.background ?? BACKGROUND_COLOR;
    if (render.canvas) {
      render.canvas.style.backgroundColor = current.background ?? BACKGROUND_COLOR;
    }

    if (backgroundBodyRef.current) {
      backgroundBodyRef.current.render.fillStyle = current.container;
    }

    containerWallsRef.current.forEach((wall) => {
      wall.render.fillStyle = paletteRef.current.background;
    });

    const bodies = dynamicBodiesRef.current;
    if (bodies.length > 1) {
      // Index 0 is the gold circle; keep its color
      if (bodies[1]) bodies[1].render.fillStyle = current.square;
      if (bodies[2]) bodies[2].render.fillStyle = current.bar;
      if (bodies[3]) bodies[3].render.fillStyle = current.triangle;
      if (bodies[4]) bodies[4].render.fillStyle = current.hexagon;
    }
  }, [palette]);

  return (
    <div
      ref={sceneRef}
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: BACKGROUND_COLOR,
        margin: 0,
        padding: 0,
        overflow: "hidden",
      }}
    />
  );
}