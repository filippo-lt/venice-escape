"use client";

import IdleQuote from "./IdleQuote";
import AmbientToggle from "./AmbientToggle";

interface TitleScreenProps {
  onStart: () => void;
}

/**
 * Beat 2 — Title screen vivo.
 * 6 layer in `absolute inset-0`: sfondo laguna, marea, riflesso luna,
 * gondola in pan, lanterna in flicker, scanline+vignette, e i contenuti
 * testuali (titolo, PRESS START, idle quote).
 */
export default function TitleScreen({ onStart }: TitleScreenProps) {
  return (
    <div className="relative h-dvh w-screen overflow-hidden bg-bg-deep">
      {/* LAYER 0 — sfondo laguna */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/title_lagoon.webp"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* LAYER 1 — marea: gradiente che oscilla */}
      <div
        aria-hidden
        className="tide-overlay anim-tide absolute inset-x-0 bottom-0 h-1/2"
      />

      {/* LAYER 2 — riflesso luna che ondeggia */}
      <div
        aria-hidden
        className="moon-reflection absolute left-1/2 top-1/3 h-24 w-48 -translate-x-1/2"
      />

      {/* LAYER 3 — gondola in pan */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/sprite_gondola.webp"
        alt=""
        aria-hidden
        className="gondola-pan absolute top-1/2 h-16 w-auto sm:h-24"
      />

      {/* LAYER 4 — lanterna flicker */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/sprite_lantern.webp"
        alt=""
        aria-hidden
        className="anim-flicker absolute right-[12%] top-[28%] h-20 w-auto sm:h-28"
      />

      {/* LAYER 5 — vignette (scanline globale viene dal layout `.crt`) */}
      <div aria-hidden className="vignette absolute inset-0 pointer-events-none" />

      {/* LAYER 6 — testo */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-between px-6 py-10">
        <AmbientToggle />

        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <h1
            className="anim-glow font-pixel text-2xl leading-tight text-sand sm:text-4xl"
            style={{
              textShadow:
                "2px 2px 0 var(--color-blood), 4px 4px 0 var(--color-bg-deep)",
              letterSpacing: "0.05em",
            }}
          >
            LE SETTE ÀNCORE
          </h1>
          <h2
            className="anim-glow mt-3 font-pixel text-base leading-tight text-sand sm:text-2xl"
            style={{
              textShadow:
                "2px 2px 0 var(--color-blood), 4px 4px 0 var(--color-bg-deep)",
              letterSpacing: "0.05em",
            }}
          >
            DELLA SERENISSIMA
          </h2>
          <p className="mt-4 font-mono text-base tracking-widest text-ocra-light sm:text-xl">
            ~ a SCUMM adventure ~
          </p>
        </div>

        <div className="flex flex-col items-center pb-6">
          <button
            type="button"
            onClick={onStart}
            className="anim-blink inline-block min-h-11 border-2 border-verb-yellow bg-bg-deep/70 px-6 py-3 font-pixel text-[10px] tracking-widest text-verb-yellow hover:bg-verb-yellow hover:text-bg-deep focus:outline-none focus:ring-2 focus:ring-verb-yellow sm:text-xs"
            aria-label="Inizia l'avventura"
          >
            ▶ PRESS START TO BEGIN ◀
          </button>
          <IdleQuote />
        </div>
      </div>

      <style jsx>{`
        .tide-overlay {
          background: linear-gradient(
            to top,
            var(--color-bg-water) 0%,
            rgba(61, 42, 24, 0.6) 40%,
            transparent 100%
          );
          mix-blend-mode: multiply;
        }
        .moon-reflection {
          background: radial-gradient(
            ellipse,
            rgba(232, 200, 120, 0.45) 0%,
            rgba(232, 200, 120, 0.1) 50%,
            transparent 80%
          );
          filter: blur(2px);
          animation: moon-shimmer 7s ease-in-out infinite;
        }
        @keyframes moon-shimmer {
          0%, 100% { transform: translateX(-50%) skewX(0deg); opacity: 0.85; }
          50%      { transform: translateX(-50%) skewX(-3deg); opacity: 1; }
        }
        .gondola-pan {
          animation: gondola-pan 25s linear infinite;
        }
        @keyframes gondola-pan {
          0%   { transform: translateX(-20vw); }
          100% { transform: translateX(120vw); }
        }
        .scanline {
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.18) 0px,
            rgba(0, 0, 0, 0.18) 1px,
            transparent 1px,
            transparent 3px
          );
          z-index: 5;
        }
        .vignette {
          background: radial-gradient(
            ellipse at center,
            transparent 55%,
            rgba(0, 0, 0, 0.55) 100%
          );
          z-index: 6;
        }
        @media (prefers-reduced-motion: reduce) {
          .gondola-pan,
          .moon-reflection {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
