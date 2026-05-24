"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { AnchorMarker, type AnchorMarkerState } from "@/components/map/AnchorMarker";
import { ANCHORS } from "@/lib/anchors";
import { MAP_MARKERS, MAP_MARKER_IDS } from "@/lib/map-markers";
import { loadProgress, type Progress } from "@/lib/progress";

// ---------- Store esterno: progress da localStorage ----------
// Stesso pattern di FinalePage: useSyncExternalStore evita setState-in-effect
// e dà uno snapshot consistente lato client. Non leggiamo niente lato server
// (snapshot iniziale = null → fallback di caricamento).

let cachedProgress: Progress | null = null;
const progressListeners = new Set<() => void>();

function subscribeProgress(notify: () => void): () => void {
  progressListeners.add(notify);
  if (cachedProgress === null && typeof window !== "undefined") {
    queueMicrotask(() => {
      if (cachedProgress === null) {
        cachedProgress = loadProgress();
        progressListeners.forEach((fn) => fn());
      }
    });
  }
  return () => {
    progressListeners.delete(notify);
  };
}

function getProgressSnapshot(): Progress | null {
  return cachedProgress;
}

function getProgressServerSnapshot(): Progress | null {
  return null;
}

/** Per i test: resetta lo store modulo (chiamato dai test via dynamic import). */
export function __resetMapPageStore(): void {
  cachedProgress = null;
  progressListeners.clear();
}

function markerStateFor(
  id: number,
  progress: Progress,
): AnchorMarkerState {
  const solved = Boolean(progress.fragments[id]);
  if (solved) return "solved";
  if (progress.unlockedAnchors.includes(id)) return "unlocked";
  return "locked";
}

export function MapPage() {
  const progress = useSyncExternalStore(
    subscribeProgress,
    getProgressSnapshot,
    getProgressServerSnapshot,
  );

  if (!progress) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-bg-deep text-white-text">
        <p className="font-pixel text-[10px] tracking-widest text-ocra-light">
          ► CARICAMENTO MAPPA…
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-bg-deep text-white-text">
      <header className="flex items-center justify-between gap-3 border-b border-stone-dark bg-bg-night px-3 py-3">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center border-2 border-black bg-stone-dark px-3 py-2 font-pixel text-[9px] tracking-widest text-ocra-light hover:bg-stone-mid active:translate-x-[2px] active:translate-y-[2px]"
        >
          ← INDIETRO
        </Link>
        <h1 className="font-pixel text-[12px] tracking-widest text-ocra-light sm:text-[14px]">
          ★ MAPPA ★
        </h1>
        <span aria-hidden="true" className="min-w-11" />
      </header>

      <section className="mx-auto w-full max-w-3xl px-3 py-4">
        <div
          className="relative w-full overflow-hidden border-2 border-stone-dark bg-bg-night shadow-[2px_2px_0_var(--color-bg-deep)]"
          style={{ aspectRatio: "600 / 374", imageRendering: "pixelated" }}
          data-testid="map-container"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/mappa_ancore.webp"
            alt="Mappa di Venezia con le sette ancore della main quest."
            loading="eager"
            className="block h-full w-full select-none object-contain"
            style={{ imageRendering: "pixelated" }}
          />

          {/* Overlay scanline pixel-art, decorativo. */}
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
            style={{
              background:
                "repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 1px, transparent 1px, transparent 3px)",
            }}
          />

          {/* Marker assoluti in % */}
          {MAP_MARKER_IDS.map((id) => {
            const anchor = ANCHORS.find((a) => a.id === id);
            if (!anchor) return null;
            return (
              <AnchorMarker
                key={id}
                id={id}
                state={markerStateFor(id, progress)}
                position={MAP_MARKERS[id]}
                fragment={progress.fragments[id]}
                label={anchor.location}
              />
            );
          })}
        </div>

        <p className="mt-4 text-center font-mono text-base italic text-stone-light">
          (Le ancore d&apos;oro sono risolte. Quelle palpitanti vi
          aspettano. Quelle in ombra dormono ancora.)
        </p>
      </section>
    </main>
  );
}
