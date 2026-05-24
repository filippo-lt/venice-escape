// Box pixel-art che rivela la lettera del frammento.
// Sequenza CSS (animation-delay):
//   t=0     parchment sweep (overlay ocra che spazza, ~300ms ease-out)
//   t=0     box vuoto, bordo blood-bright, scanline interno
//   t=400ms lampo bianco + shake (200ms)
//   t=600ms lettera appare in font-pixel text-5xl text-sand + anim-glow
//   t=550ms echo halo (anello ocra che si espande e svanisce, ~500ms)
//   t=1200ms ◆ pieno (handled da NextDestinationCard/InlineInventory via state)
// Con prefers-reduced-motion tutti gli effetti decadono a istantaneo
// (lettera subito visibile, sweep/halo/flash nascosti).

type Props = {
  /** Lettera del frammento (es. "V"). */
  letter: string;
};

export function FragmentReveal({ letter }: Props) {
  return (
    <div
      className="fragment-reveal relative mx-auto h-32 w-32 select-none"
      aria-label={`Frammento ${letter}`}
      role="img"
    >
      {/* Box vuoto: bordo blood-bright + scanline interna */}
      <div className="absolute inset-0 border-2 border-blood-bright bg-bg-deep shadow-[inset_0_0_0_2px_rgba(0,0,0,0.5)]">
        <div
          aria-hidden
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(0,0,0,0.35) 0px, rgba(0,0,0,0.35) 1px, transparent 1px, transparent 3px)",
          }}
        />
      </div>

      {/* Parchment sweep: overlay ocra che spazza da sinistra a destra (t=0, ~300ms) */}
      <div
        aria-hidden
        className="fragment-sweep absolute inset-0 overflow-hidden"
      >
        <div
          className="fragment-sweep-inner absolute inset-y-0 left-0 w-full"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(196,154,108,0) 0%, rgba(196,154,108,0.85) 45%, rgba(168,124,82,0.95) 55%, rgba(196,154,108,0) 100%)",
          }}
        />
      </div>

      {/* Flash bianco a t=400ms (durata ~150ms) */}
      <div
        aria-hidden
        className="fragment-flash absolute inset-0 bg-white-text opacity-0"
      />

      {/* Echo halo: anello ocra che si espande dopo il flash (t=550ms, ~500ms) */}
      <div
        aria-hidden
        className="fragment-halo pointer-events-none absolute inset-0 rounded-sm opacity-0"
        style={{
          boxShadow: "0 0 0 0 rgba(196,154,108,0.7)",
        }}
      />

      {/* Lettera: appare a t=600ms con glow */}
      <div className="fragment-letter absolute inset-0 flex items-center justify-center font-pixel text-5xl text-sand opacity-0 anim-glow">
        {letter}
      </div>

      <style>{`
        @keyframes fragmentFlashKf {
          0% { opacity: 0; }
          30% { opacity: 0.9; }
          100% { opacity: 0; }
        }
        @keyframes fragmentShakeKf {
          0%, 100% { transform: translate(0, 0); }
          20% { transform: translate(-3px, 2px); }
          40% { transform: translate(3px, -2px); }
          60% { transform: translate(-2px, -2px); }
          80% { transform: translate(2px, 1px); }
        }
        @keyframes fragmentLetterKf {
          0%   { opacity: 0; transform: scale(0.7); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes fragmentSweepKf {
          0%   { transform: translateX(-100%); opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
        @keyframes fragmentHaloKf {
          0%   { opacity: 0; box-shadow: 0 0 0 0 rgba(196,154,108,0.7); }
          20%  { opacity: 1; }
          100% { opacity: 0; box-shadow: 0 0 0 28px rgba(196,154,108,0); }
        }
        .fragment-reveal {
          animation: fragmentShakeKf 200ms ease-in-out 400ms 1;
        }
        .fragment-sweep-inner {
          animation: fragmentSweepKf 300ms ease-out 0ms 1 both;
        }
        .fragment-flash {
          animation: fragmentFlashKf 150ms ease-out 400ms 1 both;
        }
        .fragment-halo {
          animation: fragmentHaloKf 500ms ease-out 550ms 1 both;
        }
        .fragment-letter {
          animation: fragmentLetterKf 220ms steps(4, end) 600ms 1 forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .fragment-reveal { animation: none !important; }
          .fragment-flash { animation: none !important; opacity: 0 !important; }
          .fragment-sweep-inner {
            animation: none !important;
            opacity: 0 !important;
            transform: none !important;
          }
          .fragment-halo {
            animation: none !important;
            opacity: 0 !important;
            box-shadow: none !important;
          }
          .fragment-letter {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}
