"use client";

import { useEffect, useRef, useState } from "react";
import PhysicsCanvas, {
  type ContainerShape,
  type Palette,
} from "../components/PhysicsCanvas";

const palettes: Palette[] = [
  {
    id: "constructivist",
    name: "Constructivist",
    container: "#1A1A1A",
    square: "#1B4BA8",
    bar: "#1B4BA8",
    triangle: "#1A6B3A",
    hexagon: "#B01A1A",
    background: "#E7E0D6",
  },
  {
    id: "original",
    name: "Original",
    container: "#8B7EA8",
    square: "#ADD8E6",
    bar: "#E8894A",
    triangle: "#8FBA8F",
    hexagon: "#2E4A8B",
    background: "#E7E0D6",
  },
];

export default function Home() {
  const [speedLevel, setSpeedLevel] = useState<1 | 2 | 3>(1);
  const [shapeCount, setShapeCount] = useState(6);
  const [containerShape, setContainerShape] =
    useState<ContainerShape>("square");
  const [isPlaying, setIsPlaying] = useState(true);
  const [rotationReversed, setRotationReversed] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [selectedPaletteId, setSelectedPaletteId] =
    useState<Palette["id"]>("constructivist");
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  const paletteWrapperRef = useRef<HTMLDivElement | null>(null);

  const selectedPalette =
    palettes.find((p) => p.id === selectedPaletteId) ?? palettes[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        paletteWrapperRef.current &&
        !paletteWrapperRef.current.contains(event.target as Node)
      ) {
        setIsPaletteOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleReset = () => {
    setResetKey((key) => key + 1);
  };

  return (
    <main className="flex min-h-screen bg-[#0A0A0A] text-neutral-100">
      <section className="w-[30%] min-w-[260px] max-w-md bg-[#111111] flex flex-col p-6">

        {/* Title block */}
        <div className="mb-10">
          <p className="text-[10px] tracking-[0.3em] text-neutral-600 uppercase leading-relaxed">
            Life Is A Box Full Of Sharp Objects
          </p>
          <div className="mt-3 h-px bg-neutral-800" />
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-8 text-sm">

          {/* Speed and rotation */}
          <div className="space-y-2">
            <label className="block text-[10px] tracking-widest text-neutral-500 uppercase">
              Speed and rotation
            </label>
            <div className="flex flex-row gap-2">
              <button
                type="button"
                onClick={() =>
                  setSpeedLevel((s) => (s === 3 ? 1 : ((s + 1) as 1 | 2 | 3)))
                }
                className="flex h-12 flex-1 items-center justify-center bg-[#1A1A1A] text-white transition-colors hover:bg-neutral-800"
                aria-label={`Speed ${speedLevel}x`}
              >
                <span className="text-xs font-medium tabular-nums">
                  {speedLevel}x
                </span>
              </button>
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                className="flex h-12 flex-1 items-center justify-center bg-[#1A1A1A] text-white transition-colors hover:bg-neutral-800"
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
                className="flex h-12 flex-1 items-center justify-center bg-[#1A1A1A] text-white transition-colors hover:bg-neutral-800"
                aria-label={rotationReversed ? "Forward rotation" : "Reverse rotation"}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="currentColor"
                  style={{
                    transform: rotationReversed ? "scaleX(-1)" : "scaleX(1)",
                    transition: "transform 0.3s ease",
                  }}
                >
                  <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Palette */}
          <div className="space-y-2">
            <label className="block text-[10px] tracking-widest text-neutral-500 uppercase">
              Palette
            </label>
            <div ref={paletteWrapperRef} className="relative">
              <button
                type="button"
                onClick={() => setIsPaletteOpen((open) => !open)}
                className="w-full border border-neutral-800 bg-[#111111] text-left hover:border-neutral-700 transition-colors"
                aria-label="Select palette"
              >
                <div className="flex items-stretch h-11">
                  {/* Color swatches */}
                  <div className="flex flex-1 h-full">
                    {[
                      selectedPalette.container,
                      selectedPalette.square,
                      selectedPalette.triangle,
                      selectedPalette.hexagon,
                    ].map((color, index) => (
                      <div
                        key={index}
                        className="flex-1 h-full"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  {/* Chevron */}
                  <div className="flex items-center gap-2 px-3 border-l border-neutral-800 bg-[#111111] min-w-0">
                    <svg
                      viewBox="0 0 10 6"
                      className="h-2 w-2 text-neutral-500 flex-shrink-0 transition-transform duration-200"
                      style={{ transform: isPaletteOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M1 1l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </button>

              {isPaletteOpen && (
                <div className="absolute left-0 right-0 mt-1 border border-neutral-800 bg-[#111111] z-10">
                  {palettes.map((palette) => (
                    <button
                      key={palette.id}
                      type="button"
                      onClick={() => {
                        setSelectedPaletteId(palette.id);
                        setIsPaletteOpen(false);
                      }}
                      className="flex items-stretch w-full h-11 hover:bg-[#1A1A1A] transition-colors"
                    >
                      <div className="flex flex-1 h-full">
                        {[
                          palette.container,
                          palette.square,
                          palette.triangle,
                          palette.hexagon,
                        ].map((color, index) => (
                          <div
                            key={index}
                            className="flex-1 h-full"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Container */}
          <div className="space-y-2">
            <label className="block text-[10px] tracking-widest text-neutral-500 uppercase">
              Container
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setContainerShape("square")}
                className={`group flex flex-1 aspect-square items-center justify-center bg-neutral-800 text-neutral-100 transition-colors hover:bg-neutral-700 ${
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
                className={`group flex flex-1 aspect-square items-center justify-center bg-neutral-800 text-neutral-100 transition-colors hover:bg-neutral-700 ${
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
                className={`group hidden flex-1 aspect-square items-center justify-center bg-neutral-800 text-neutral-100 transition-colors hover:bg-neutral-700 ${
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

          {/* Reset — visually demoted */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="w-full py-2 text-[10px] tracking-widest text-neutral-600 uppercase hover:text-neutral-400 transition-colors border border-neutral-800 hover:border-neutral-700"
            >
              Reset
            </button>
          </div>

        </div>
      </section>

      <section className="flex-1 h-screen">
        <PhysicsCanvas
          rotationSpeed={speedLevel === 1 ? 0.6 : speedLevel === 2 ? 1.2 : 1.8}
          shapeCount={shapeCount}
          containerShape={containerShape}
          resetKey={resetKey}
          isRunning={isPlaying}
          rotationReversed={rotationReversed}
          palette={selectedPalette}
        />
      </section>
    </main>
  );
}