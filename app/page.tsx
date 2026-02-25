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
  const [rotationReversed, setRotationReversed] = useState(false);
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
            <div className="flex flex-row items-center gap-5">
              <div className="flex min-w-0 flex-1 flex-col space-y-2">
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
              <div className="flex flex-none items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlaying((p) => !p)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#222222] text-white transition-colors hover:bg-[#333333]"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                      <rect x="8" y="6" width="3" height="12" rx="0.5" />
                      <rect x="13" y="6" width="3" height="12" rx="0.5" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setRotationReversed((r) => !r)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#222222] text-white transition-colors hover:bg-[#333333]"
                  aria-label={rotationReversed ? "Forward rotation" : "Reverse rotation"}
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" style={{ transform: "scaleX(-1)" }}>
                    <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs text-neutral-300">
                Container
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setContainerShape("square")}
                  className={`group flex flex-1 aspect-square items-center justify-center rounded-md bg-neutral-800 text-neutral-100 transition-colors hover:bg-neutral-700 ${
                    containerShape === "square"
                      ? "bg-neutral-600 ring-2 ring-neutral-400"
                      : ""
                  }`}
                  aria-label="Square"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-8 w-8 group-hover:animate-[spin_1.15s_linear_infinite]"
                    fill="currentColor"
                  >
                    <rect x="4" y="4" width="16" height="16" rx="1" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setContainerShape("hexagon")}
                  className={`group flex flex-1 aspect-square items-center justify-center rounded-md bg-neutral-800 text-neutral-100 transition-colors hover:bg-neutral-700 ${
                    containerShape === "hexagon"
                      ? "bg-neutral-600 ring-2 ring-neutral-400"
                      : ""
                  }`}
                  aria-label="Hexagon"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-8 w-8 group-hover:animate-[spin_1.15s_linear_infinite]"
                    fill="currentColor"
                  >
                    <path d="M12 3 L19.79 7.5 L19.79 16.5 L12 21 L4.21 16.5 L4.21 7.5 Z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setContainerShape("circle")}
                  className={`group hidden flex-1 aspect-square items-center justify-center rounded-md bg-neutral-800 text-neutral-100 transition-colors hover:bg-neutral-700 ${
                    containerShape === "circle"
                      ? "bg-neutral-600 ring-2 ring-neutral-400"
                      : ""
                  }`}
                  aria-label="Circle"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-8 w-8 group-hover:animate-[spin_1.15s_linear_infinite]"
                    fill="currentColor"
                  >
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </button>
              </div>
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
          rotationSpeed={rotationSpeed}
          shapeCount={shapeCount}
          containerShape={containerShape}
          resetKey={resetKey}
          isRunning={isPlaying}
          rotationReversed={rotationReversed}
        />
      </section>
    </main>
  );
}
