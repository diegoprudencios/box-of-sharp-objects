"use client";

import { useState } from "react";
import PhysicsCanvas, {
  type ContainerShape,
} from "../components/PhysicsCanvas";

export default function Home() {
  const [rotationSpeed, setRotationSpeed] = useState(0.3);
  const [shapeCount, setShapeCount] = useState(6);
  const [containerShape, setContainerShape] =
    useState<ContainerShape>("square");
  const [isPlaying, setIsPlaying] = useState(true);
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setResetKey((key) => key + 1);
  };

  return (
    <main className="flex min-h-screen bg-[#0A0A0A] text-neutral-100">
      <section className="w-[30%] min-w-[260px] max-w-md bg-[#111111] flex flex-col p-6">
        <div className="space-y-8">
          <div>
            <h1 className="text-xs tracking-[0.25em] text-neutral-500 uppercase">
              LIFE IS A BOX FULL OF SHARP OBJECTS
            </h1>
          </div>

          <div className="space-y-6 text-sm">
            <div className="space-y-2">
              <label className="flex items-center justify-between text-xs text-neutral-300">
                <span>Speed</span>
                <span className="tabular-nums text-neutral-500">
                  {rotationSpeed.toFixed(2)}
                </span>
              </label>
              <input
                type="range"
                min={0}
                max={2}
                step={0.01}
                value={rotationSpeed}
                onChange={(e) =>
                  setRotationSpeed(parseFloat(e.target.value) || 0)
                }
                className="w-full accent-neutral-100"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs text-neutral-300">
                Container
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setContainerShape("square")}
                  className={`flex flex-1 aspect-square items-center justify-center rounded-md bg-neutral-800 text-neutral-100 transition-colors hover:bg-neutral-700 ${
                    containerShape === "square"
                      ? "bg-neutral-600 ring-2 ring-neutral-400"
                      : ""
                  }`}
                  aria-label="Square"
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                    <rect x="4" y="4" width="16" height="16" rx="1" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setContainerShape("hexagon")}
                  className={`flex flex-1 aspect-square items-center justify-center rounded-md bg-neutral-800 text-neutral-100 transition-colors hover:bg-neutral-700 ${
                    containerShape === "hexagon"
                      ? "bg-neutral-600 ring-2 ring-neutral-400"
                      : ""
                  }`}
                  aria-label="Hexagon"
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                    <path d="M12 3 L19.79 7.5 L19.79 16.5 L12 21 L4.21 16.5 L4.21 7.5 Z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setContainerShape("circle")}
                  className={`flex flex-1 aspect-square items-center justify-center rounded-md bg-neutral-800 text-neutral-100 transition-colors hover:bg-neutral-700 ${
                    containerShape === "circle"
                      ? "bg-neutral-600 ring-2 ring-neutral-400"
                      : ""
                  }`}
                  aria-label="Circle"
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                className="w-full rounded-md bg-neutral-800 px-3 py-2 text-xs font-medium text-neutral-100 hover:bg-neutral-700 transition-colors"
              >
                {isPlaying ? "STOP" : "PLAY"}
              </button>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={handleReset}
                className="w-full rounded-md bg-neutral-800 px-3 py-2 text-xs font-medium text-neutral-100 hover:bg-neutral-700 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="flex-1 h-screen">
        <PhysicsCanvas
          rotationSpeed={isPlaying ? rotationSpeed : 0}
          shapeCount={shapeCount}
          containerShape={containerShape}
          resetKey={resetKey}
        />
      </section>
    </main>
  );
}
