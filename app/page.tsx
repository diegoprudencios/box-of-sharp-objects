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
              LIFE IS HARD
            </h1>
          </div>

          <div className="space-y-6 text-sm">
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleReset}
                className="w-full rounded-md bg-neutral-800 px-3 py-2 text-xs font-medium text-neutral-100 hover:bg-neutral-700 transition-colors"
              >
                Reset
              </button>
            </div>

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
              <label className="flex items-center justify-between text-xs text-neutral-300">
                <span>Shapes</span>
                <span className="tabular-nums text-neutral-500">
                  {shapeCount}
                </span>
              </label>
              <input
                type="range"
                min={3}
                max={10}
                step={1}
                value={shapeCount}
                onChange={(e) =>
                  setShapeCount(
                    Math.min(
                      10,
                      Math.max(3, parseInt(e.target.value, 10) || 3)
                    )
                  )
                }
                className="w-full accent-neutral-100"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs text-neutral-300">
                Container
              </label>
              <select
                value={containerShape}
                onChange={(e) =>
                  setContainerShape(e.target.value as ContainerShape)
                }
                className="w-full rounded-md bg-neutral-900 px-3 py-2 text-xs text-neutral-100 outline-none ring-0 focus:bg-neutral-800"
              >
                <option value="square">Square</option>
                <option value="hexagon">Hexagon</option>
                <option value="triangle">Triangle</option>
                <option value="pentagon">Pentagon</option>
              </select>
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
        />
      </section>
    </main>
  );
}
