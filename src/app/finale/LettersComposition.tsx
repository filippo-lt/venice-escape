"use client";

import { useSyncExternalStore } from "react";

type Props = {
  /** Frammenti raccolti, indicizzati 1..7. */
  fragments: Record<number, string>;
  /** Se true, niente animazioni: lettere subito visibili. */
  reducedMotion?: boolean;
};

/**
 * Store esterno "una tantum": parte da `false` e diventa `true` ~60ms
 * dopo la prima subscribe. Risolve la rivelazione senza usare
 * setState dentro useEffect (vietato dal lint del repo).
 */
let revealedNow = false;
const revealedListeners = new Set<() => void>();

function subscribeToReveal(notify: () => void): () => void {
  revealedListeners.add(notify);
  let timer: number | undefined;
  if (!revealedNow) {
    timer = window.setTimeout(() => {
      revealedNow = true;
      revealedListeners.forEach((fn) => fn());
    }, 60);
  }
  return () => {
    revealedListeners.delete(notify);
    if (timer !== undefined) window.clearTimeout(timer);
  };
}

function getRevealedSnapshot(): boolean {
  return revealedNow;
}

function getRevealedServerSnapshot(): boolean {
  return false;
}

/**
 * Atto 1 — Composizione VENEZIA.
 * Rende 7 lettere/glifi prelevati da `fragments[1..7]` con fade-in
 * scalato + glow ocra persistente. Mobile-first, leggibile al sole.
 *
 * Se i frammenti registrati non sono lettere singole (es. "MAREA"),
 * mostriamo comunque il valore raccolto: il valore semantico sta nel
 * fatto che lo hai conquistato.
 */
export function LettersComposition({ fragments, reducedMotion }: Props) {
  // useSyncExternalStore evita il problema "setState dentro useEffect":
  // - SSR / first render: getServerSnapshot → false (no flash)
  // - dopo il mount: getSnapshot torna true al primo tick di setTimeout
  const tickRevealed = useSyncExternalStore(
    subscribeToReveal,
    getRevealedSnapshot,
    getRevealedServerSnapshot,
  );
  const revealed = Boolean(reducedMotion) || tickRevealed;

  const letters = [1, 2, 3, 4, 5, 6, 7].map(
    (id) => fragments[id]?.trim() || "?",
  );

  return (
    <div className="flex flex-col items-center justify-center px-4 text-center">
      <p className="font-pixel text-[10px] tracking-widest text-ocra-light">
        ★ I FRAMMENTI SI COMPONGONO ★
      </p>

      <div
        className="mt-6 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-4 sm:gap-x-5"
        aria-label={`Composizione: ${letters.join(" ")}`}
      >
        {letters.map((char, i) => (
          <span
            key={i}
            className={[
              "font-pixel text-5xl text-sand sm:text-6xl",
              revealed ? "anim-glow opacity-100" : "opacity-0",
            ].join(" ")}
            style={{
              transition: reducedMotion
                ? undefined
                : "opacity 700ms ease-out",
              transitionDelay: reducedMotion
                ? undefined
                : `${i * 200}ms`,
              animationDelay: reducedMotion ? undefined : `${i * 200}ms`,
              textShadow:
                "2px 2px 0 var(--color-blood), 4px 4px 0 var(--color-bg-deep)",
            }}
          >
            {char}
          </span>
        ))}
      </div>

      <p className="mt-6 font-mono text-base italic text-ocra-light sm:text-lg">
        Sette ancore. Una città. Un nome solo.
      </p>
    </div>
  );
}
