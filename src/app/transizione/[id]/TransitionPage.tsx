"use client";

// Pagina di transizione tra un'ancora e la successiva.
// - Rivela il frammento con sequenza animata (vedi FragmentReveal).
// - Aggiorna localStorage (progress.fragments[anchor.id] = anchor.fragment).
// - Mostra outro di Fra Celestino + card della prossima destinazione.
// - Per Ancora 7 si va a /finale (vedi gating in page.tsx).

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import type { Anchor } from "@/lib/anchors";
import {
  addFragment,
  loadProgress,
  saveProgress,
  type Progress,
} from "@/lib/progress";
import { FragmentReveal } from "@/components/transition/FragmentReveal";
import { InlineInventory } from "@/components/transition/InlineInventory";
import { NextDestinationCard } from "@/components/transition/NextDestinationCard";

type Props = {
  anchor: Anchor;
  next?: Anchor;
  /** Path opzionale di un audio di outro (se esiste in /audio/main/). */
  outroAudio?: string;
};

export function TransitionPage(props: Props) {
  return (
    <Suspense fallback={<TransitionFallback />}>
      <TransitionPageInner {...props} />
    </Suspense>
  );
}

function TransitionFallback() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-bg-deep text-ocra-light">
      <p className="font-pixel text-[10px] tracking-widest">CARICAMENTO…</p>
    </main>
  );
}

function TransitionPageInner({ anchor, next, outroAudio }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Lazy init: durante SSR loadProgress() ritorna lo stato iniziale; sul
  // client viene riletto al mount. Evita un setState in useEffect.
  const [progress, setProgress] = useState<Progress>(() => loadProgress());
  const [audioPlaying, setAudioPlaying] = useState(false);

  // Gating + side-effect (solo escritura su localStorage, niente setState).
  // - se l'utente non ha risolto /ancora/N (nessun frammento per N) e non
  //   ha il bypass ?gm=skip → redirect a /ancora/N;
  // - altrimenti registra il frammento (idempotente).
  useEffect(() => {
    const current = loadProgress();
    const gmSkip = searchParams.get("gm") === "skip";
    const alreadySolved = current.fragments[anchor.id] !== undefined;

    if (!alreadySolved && !gmSkip) {
      router.replace(anchor.href);
      return;
    }

    const updated = addFragment(current, anchor.id, anchor.fragment);
    if (updated !== current) saveProgress(updated);
    // Sincronizzazione one-shot dello stato React con il localStorage:
    // questa è esattamente la "lettura iniziale da sistema esterno" che
    // l'eslint rule scoraggia in generale, ma è il pattern voluto qui.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(updated);
  }, [anchor.id, anchor.fragment, anchor.href, router, searchParams]);

  // Inventario coerente: include sempre il frammento appena risolto.
  const fragmentsForDisplay: Record<number, string> = {
    ...progress.fragments,
    [anchor.id]: anchor.fragment,
  };

  return (
    <main className="flex min-h-dvh flex-col items-center bg-bg-deep px-4 py-8 text-white-text">
      <div className="flex w-full max-w-[480px] flex-col items-center gap-6">
        {/* Header */}
        <h1 className="text-center font-pixel text-[11px] tracking-widest text-verb-yellow anim-blink">
          ★ ANCORA {anchor.id} ATTIVATA ★
        </h1>

        {/* Fragment reveal */}
        <FragmentReveal letter={anchor.fragment} />

        {/* Inventario inline */}
        <InlineInventory
          fragments={fragmentsForDisplay}
          justRevealed={anchor.id}
        />

        {/* Outro Fra Celestino */}
        {anchor.archivistaOutro && (
          <figure className="w-full">
            <figcaption className="font-pixel text-[8px] tracking-widest text-ocra-light">
              FRA CELESTINO, SOTTOVOCE
            </figcaption>
            <blockquote
              className="mt-2 font-mono text-lg italic leading-snug text-paper"
              style={{ opacity: 0.85 }}
            >
              &ldquo;{anchor.archivistaOutro}&rdquo;
            </blockquote>
          </figure>
        )}

        {/* Outro audio opzionale */}
        {outroAudio && (
          <OutroAudioButton
            src={outroAudio}
            playing={audioPlaying}
            onToggle={setAudioPlaying}
          />
        )}

        {/* Separator */}
        <div className="flex w-full items-center gap-3 font-pixel text-[8px] tracking-widest text-stone-light">
          <span className="h-px flex-1 bg-stone-dark" />
          la prossima soglia
          <span className="h-px flex-1 bg-stone-dark" />
        </div>

        {/* Next destination */}
        {next ? (
          <NextDestinationCard next={next} />
        ) : (
          <Link
            href="/finale"
            className="flex min-h-14 w-full items-center justify-center border-2 border-black bg-verb-yellow px-5 py-3 text-center font-pixel text-[11px] tracking-widest text-black shadow-[3px_3px_0_var(--color-bg-deep)] hover:bg-sand active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            AL FINALE →
          </Link>
        )}
      </div>
    </main>
  );
}

function OutroAudioButton({
  src,
  playing,
  onToggle,
}: {
  src: string;
  playing: boolean;
  onToggle: (v: boolean) => void;
}) {
  return (
    <div className="w-full">
      <audio
        src={src}
        onPlay={() => onToggle(true)}
        onPause={() => onToggle(false)}
        onEnded={() => onToggle(false)}
        preload="none"
        id="outro-audio"
      />
      <button
        type="button"
        onClick={() => {
          const el = document.getElementById(
            "outro-audio",
          ) as HTMLAudioElement | null;
          if (!el) return;
          if (el.paused) el.play();
          else el.pause();
        }}
        className="flex min-h-11 w-full items-center justify-center gap-2 border-2 border-ocra bg-bg-night px-4 py-2 font-pixel text-[9px] tracking-widest text-ocra-light hover:bg-stone-dark"
        aria-pressed={playing}
        aria-label={playing ? "Pausa outro" : "Riproduci outro"}
      >
        {playing ? "❚❚ PAUSA OUTRO" : "▶ ASCOLTA OUTRO"}
      </button>
    </div>
  );
}
