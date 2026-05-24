"use client";

import { useEffect, useRef } from "react";

type BootMode = "full" | "fast";

interface BootSequenceProps {
  mode: BootMode;
  onDone: () => void;
}

/**
 * Beat 1 — Boot animato.
 * Le righe del boot vengono rivelate via CSS (`animation-delay`), con effetto
 * "typewriter" (steps()) e una riga di "warning" glitchata. Tap/click/keydown
 * → skip. In modalità `fast` mostra solo l'ultima riga per ~0.8s.
 */
// Timing allineato alla tabella in docs/home_flow.md §Beat 1
// (t = 0.0, 0.5, 1.0, 1.6, 2.3, 2.8, 3.2).
const FULL_LINES: { text: string; delay: number; cls?: string; width: number }[] = [
  { text: "SCUMM v5.1.42 — Loading...", delay: 0.0, width: 28 },
  { text: "Reading manuscript from disk A:\\", delay: 0.5, width: 33 },
  { text: "Checking memory... 640K OK", delay: 1.0, width: 26 },
  { text: "WARNING: file corrupted — anno 1297", delay: 1.6, cls: "glitch", width: 36 },
  { text: "Recovering data from monastery_torcello.dat", delay: 2.3, width: 43 },
  { text: ". . .", delay: 2.8, width: 5 },
  { text: "OK — ready to play", delay: 3.2, cls: "with-cursor", width: 19 },
];

// L'ultima riga inizia a t=3.2s con typewriter 600ms (→ termina a 3.8s),
// poi piccolo hold di 400ms per leggere "OK — ready to play" prima del cutover.
// Lo spec indica 3.5s ma quel taglio interrompe l'ultima riga a metà animazione.
const FULL_DURATION_MS = 4200;
const FAST_DURATION_MS = 800;

export default function BootSequence({ mode, onDone }: BootSequenceProps) {
  const doneRef = useRef(false);

  useEffect(() => {
    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      onDone();
    };

    const duration = mode === "fast" ? FAST_DURATION_MS : FULL_DURATION_MS;
    const timer = window.setTimeout(finish, duration);

    const skip = () => finish();
    window.addEventListener("click", skip);
    window.addEventListener("touchstart", skip, { passive: true });
    window.addEventListener("keydown", skip);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("click", skip);
      window.removeEventListener("touchstart", skip);
      window.removeEventListener("keydown", skip);
    };
  }, [mode, onDone]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-start justify-center bg-bg-deep px-6 py-10 font-mono text-base leading-snug text-verb-yellow sm:text-xl">
      <div className="mx-auto w-full max-w-2xl space-y-1">
        {mode === "full" ? (
          FULL_LINES.map((line, i) => (
            <BootLine key={i} {...line} />
          ))
        ) : (
          <BootLine text="OK — ready to play" delay={0} cls="with-cursor" width={19} />
        )}
      </div>
      <p className="absolute bottom-6 left-0 right-0 text-center font-mono text-sm text-stone-light opacity-60 sm:text-base">
        (tap to skip)
      </p>

      <style jsx global>{`
        .boot-line {
          opacity: 0;
          animation: boot-line-in 600ms steps(20, end) forwards;
          white-space: nowrap;
          overflow: hidden;
          display: inline-block;
          max-width: 100%;
        }
        @keyframes boot-line-in {
          from {
            opacity: 1;
            width: 0;
          }
          to {
            opacity: 1;
            width: var(--target-width, 100%);
          }
        }
        .boot-line.glitch {
          color: var(--color-blood-bright);
          animation:
            boot-line-in 400ms steps(16, end) forwards,
            shake 250ms ease-in-out 400ms 1;
          text-shadow:
            2px 0 var(--color-blood),
            -2px 0 #4ad2d2;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-2px); }
          40% { transform: translateX(2px); }
          60% { transform: translateX(-1px); }
          80% { transform: translateX(1px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .boot-line {
            animation: none;
            opacity: 1;
            width: auto;
          }
          .boot-line.glitch {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

function BootLine({
  text,
  delay,
  cls,
  width,
}: {
  text: string;
  delay: number;
  cls?: string;
  width: number;
}) {
  const isGlitch = cls === "glitch";
  const hasCursor = cls === "with-cursor";

  return (
    <p className="m-0">
      <span
        className={`boot-line${isGlitch ? " glitch" : ""}`}
        style={{
          animationDelay: `${delay}s`,
          // target width in ch — matches text length
          ["--target-width" as string]: `${width}ch`,
        }}
      >
        {text}
      </span>
      {hasCursor && (
        <span
          className="cursor anim-blink ml-1 inline-block"
          style={{ animationDelay: `${delay + 0.4}s` }}
        >
          █
        </span>
      )}
    </p>
  );
}
