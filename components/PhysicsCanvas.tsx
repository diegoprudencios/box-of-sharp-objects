"use client";

import { useEffect, useRef } from "react";
import {
  Engine,
  Render,
  Runner,
  Bodies,
  Composite,
  Body,
  Events,
} from "matter-js";

const BACKGROUND_COLOR = "#0A0A0A";
const GOLD_COLOR = "#F5C518";

export type ContainerShape = "square" | "hexagon" | "triangle" | "pentagon";

type PhysicsCanvasProps = {
  rotationSpeed: number;
  shapeCount: number;
  containerShape: ContainerShape;
  resetKey: number;
};

export default function PhysicsCanvas({
  rotationSpeed,
  shapeCount,
  // containerShape is currently unused; square container is always used
  // to keep physics behavior identical for now.
  containerShape,
  resetKey,
}: PhysicsCanvasProps) {
  const sceneRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = sceneRef.current;
    if (!element) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const engine = Engine.create();
    const world = engine.world;

    engine.gravity.x = 0;
    engine.gravity.y = 1;

    const render = Render.create({
      element,
      engine,
      options: {
        width,
        height,
        wireframes: false,
        background: BACKGROUND_COLOR,
      },
    });

    const pixelRatio = window.devicePixelRatio || 1;
    render.canvas.width = width * pixelRatio;
    render.canvas.height = height * pixelRatio;
    render.canvas.style.width = `${width}px`;
    render.canvas.style.height = `${height}px`;
    (render as any).options.pixelRatio = pixelRatio;

    const runner = Runner.create();

    const size = 0.6 * Math.min(width, height);
    const half = size / 2;
    const wallThickness = Math.max(20, size * 0.05);

    const centerX = width / 2;
    const centerY = height / 2;

    const wallOptions = {
      isStatic: true,
      friction: 0.8,
      restitution: 0.1,
      render: { fillStyle: "#1A1A1A" },
    } as const;

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

    const containerWalls = [topWall, bottomWall, leftWall, rightWall];

    const containerWidth = size;
    const minExtent = containerWidth * 0.08;
    const maxExtent = containerWidth * 0.15;
    const goldRadius = containerWidth * 0.025;
    const circleStartY = centerY - half + wallThickness + goldRadius * 2;

    const goldCircle = Bodies.circle(centerX, circleStartY, goldRadius, {
      restitution: 0.3,
      friction: 0.6,
      frictionAir: 0.01,
      density: 0.8,
      render: { fillStyle: GOLD_COLOR },
    });

    const dynamicBodies: Body[] = [goldCircle];

    const clampedShapeCount = Math.max(3, Math.min(10, shapeCount));
    const extraCount = clampedShapeCount;
    const spawnBaseY = centerY - half + wallThickness + minExtent * 1.2;
    const horizontalRange = size * 0.25;
    const lightColors = ["#FFFFFF", "#CCCCCC"] as const;

    type ShapeKind = "rect" | "circle";
    const shapeKinds: ShapeKind[] = ["rect", "rect", "circle", "circle"];
    while (shapeKinds.length < extraCount) {
      shapeKinds.push(Math.random() < 0.5 ? "rect" : "circle");
    }
    for (let i = shapeKinds.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shapeKinds[i], shapeKinds[j]] = [shapeKinds[j], shapeKinds[i]];
    }

    const extents: number[] = [];
    for (let i = 0; i < extraCount; i += 1) {
      const t = extraCount === 1 ? 0.5 : i / (extraCount - 1);
      extents.push(minExtent + t * (maxExtent - minExtent));
    }
    for (let i = extents.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [extents[i], extents[j]] = [extents[j], extents[i]];
    }

    for (let i = 0; i < extraCount; i += 1) {
      const x = centerX + (Math.random() * 2 - 1) * horizontalRange;
      const y = spawnBaseY;
      const extent = extents[i];
      const density = 1.2 + Math.random() * 0.6;
      const fillStyle = lightColors[Math.random() < 0.5 ? 0 : 1];
      let body: Body;

      if (shapeKinds[i] === "circle") {
        body = Bodies.circle(x, y, extent, {
          restitution: 0.3,
          friction: 0.6,
          frictionAir: 0.015,
          density,
          render: { fillStyle: "#CCCCCC" },
        });
      } else {
        const aspect = 0.5 + Math.random() * 1.5;
        const maxDim = extent * 2;
        const minDim = maxDim / aspect;
        const w = Math.random() < 0.5 ? maxDim : minDim;
        const h = w === maxDim ? minDim : maxDim;
        body = Bodies.rectangle(x, y, w, h, {
          restitution: 0.3,
          friction: 0.7,
          frictionAir: 0.015,
          density: density * 1.1,
          render: { fillStyle },
        });
        Body.setAngle(body, (Math.random() - 0.5) * Math.PI * 0.5);
      }

      dynamicBodies.push(body);
    }

    Composite.add(world, [...containerWalls, ...dynamicBodies]);

    // Rotation state
    let angle = 0;
    const angleStep = rotationSpeed * (Math.PI / 180);

    Events.on(engine, "beforeUpdate", () => {
      angle += angleStep;

      // Rotate each wall around the container center
      const offsets = [
        { x: 0, y: -half }, // top
        { x: 0, y: half }, // bottom
        { x: -half, y: 0 }, // left
        { x: half, y: 0 }, // right
      ];

      containerWalls.forEach((wall, idx) => {
        const ox = offsets[idx].x;
        const oy = offsets[idx].y;
        const rotatedX =
          centerX + ox * Math.cos(angle) - oy * Math.sin(angle);
        const rotatedY =
          centerY + ox * Math.sin(angle) + oy * Math.cos(angle);
        Body.setPosition(wall, { x: rotatedX, y: rotatedY });
        Body.setAngle(wall, angle);
      });
    });

    Render.run(render);
    Runner.run(runner, engine);

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      Composite.clear(world, false);
      Engine.clear(engine);
      if (render.canvas?.parentNode) {
        render.canvas.parentNode.removeChild(render.canvas);
      }
      (render.textures as Record<string, HTMLImageElement>) = {};
    };
  }, [rotationSpeed, shapeCount, containerShape, resetKey]);

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