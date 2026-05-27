"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { AudioPlayer, DialogBox } from "@/components/scumm";
import {
  completeMainQuest,
  firstMissingFragment,
  loadProgress,
  saveProgress,
  type Progress,
} from "@/lib/progress";
import { CreditsRoll } from "./CreditsRoll";
import { LettersComposition } from "./LettersComposition";

/**
 * Flag di rilascio del Manoscritto (Fase 2). Default false: i CTA verso
 * `/manoscritto*` restano visibili ma disabilitati. Quando i contenuti
 * saranno pronti, basterà valorizzare `NEXT_PUBLIC_SIDE_CONTENT_RELEASED=true`.
 */
const SIDE_CONTENT_RELEASED =
  process.env.NEXT_PUBLIC_SIDE_CONTENT_RELEASED === "true";

const TOTAL_EASTER_EGGS = 7;

// TODO: sostituire con l'addio definitivo di Fra Celestino quando il testo
// finale arriva dal Claude Project (vedi contenuti/ancora_7.md, chiusura).
// Per ora un placeholder coerente con la voce documentata in
// docs/01_lore_bible.md e docs/03_voice_and_tone.md.
const FRA_CELESTINO_ADDIO = [
  "Mòneghi mii, gh'avete fatto. Sète ancore, sète nodi, e ora la corda tien.",
  "Venezia la xe vostra non perché l'avete vinta — ma perché v'à riconossùo.",
  "Tornè verso la stazion col passo lento: la laguna no scapa, e gnanca el mio ricordo.",
].join(" ");

// ---------- Store esterno: progress da localStorage ----------
// useSyncExternalStore evita setState-in-effect (vietato dal lint del repo).
// Niente eventi cross-tab: il finale è single-tab; basta una sola lettura.

let cachedProgress: Progress | null = null;
const progressListeners = new Set<() => void>();

function subscribeProgress(notify: () => void): () => void {
  progressListeners.add(notify);
  if (cachedProgress === null && typeof window !== "undefined") {
    // microtask: leggiamo dopo che il subscribe è registrato
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

/** Notifica i listener dopo una saveProgress locale. */
function commitProgress(next: Progress): void {
  cachedProgress = next;
  saveProgress(next);
  progressListeners.forEach((fn) => fn());
}

// ---------- Store esterno: prefers-reduced-motion ----------

function subscribeReducedMotion(notify: () => void): () => void {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", notify);
  return () => mq.removeEventListener("change", notify);
}

function getReducedMotionSnapshot(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot(): boolean {
  return false;
}

export function FinalePage() {
  const router = useRouter();
  const params = useSearchParams();

  const progress = useSyncExternalStore(
    subscribeProgress,
    getProgressSnapshot,
    getProgressServerSnapshot,
  );
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  // Beat 4 — titoli di coda: overlay facoltativo sopra /finale (no route).
  const [creditsOpen, setCreditsOpen] = useState(false);

  // Bypass dev: ?gm=skip o ?from=ancora7
  const bypass = useMemo(() => {
    const gm = params.get("gm");
    const from = params.get("from");
    return gm === "skip" || from === "ancora7";
  }, [params]);

  // Effetti collaterali (redirect + completeMainQuest) — niente setState diretto.
  useEffect(() => {
    if (progress === null) return;

    if (!bypass) {
      const missing = firstMissingFragment(progress);
      if (missing !== null) {
        router.replace(`/ancora/${missing}`);
        return;
      }
    }

    if (!progress.completedMainQuest) {
      commitProgress(completeMainQuest(progress));
    }
  }, [bypass, progress, router]);

  if (!progress) {
    // Loading minimale, niente flash di contenuti.
    return (
      <main className="flex min-h-dvh items-center justify-center bg-bg-deep text-white-text">
        <p className="font-pixel text-[10px] tracking-widest text-ocra-light">
          ► CARICAMENTO FINALE…
        </p>
      </main>
    );
  }

  const easterCount = progress.easterEggsFound.length;
  const showSegretiCta = easterCount >= 3;

  return (
    <main className="min-h-dvh bg-bg-deep text-white-text">
      {/* ATTO 1 — Composizione VENEZIA */}
      <section className="flex min-h-dvh flex-col items-center justify-center py-10">
        <LettersComposition
          fragments={progress.fragments}
          reducedMotion={reducedMotion}
        />
      </section>

      {/* ATTO 2 — Immagine rivelazione */}
      <section className="relative w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/finale_venezia.webp"
          alt="Venezia all'alba: i campanili e la laguna."
          loading="eager"
          className="block w-full select-none"
          style={{ imageRendering: "pixelated" }}
        />

        {/* Overlay scanline + vignette, solo sull'immagine */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 1px, transparent 1px, transparent 3px)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)",
          }}
        />

        <figcaption className="bg-bg-night px-5 py-4 text-center font-mono text-lg italic leading-snug text-paper sm:text-xl">
          &quot;Venezia non si conquista. Ti si rivela quando smetti di cercarla.&quot;
        </figcaption>
      </section>

      {/* ATTO 3 — Outro Fra Celestino */}
      <section className="mt-2 flex min-h-dvh flex-col justify-center py-8">
        <div className="px-4">
          <p className="mb-3 font-pixel text-[10px] tracking-widest text-ocra-light">
            ★ L&apos;ADDIO ★
          </p>
        </div>

        <AudioPlayer
          src="/audio/main/finale.mp3"
          label="ASCOLTA L'ADDIO DI FRA CELESTINO"
          autoPlay={false}
        />

        <div className="mt-4">
          <DialogBox speaker="FRA CELESTINO:" showCursor showNext={false}>
            {FRA_CELESTINO_ADDIO}
          </DialogBox>
        </div>
      </section>

      {/* ATTO 4 — Ritorno a casa */}
      <section className="flex min-h-dvh flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-md border-2 border-ocra bg-stone-dark/40 p-5 text-center">
          <p className="font-pixel text-[10px] tracking-widest text-verb-yellow">
            ★ FINE DELLA MAIN QUEST ★
          </p>

          <p className="mt-4 font-mono text-xl leading-snug text-white-text">
            Avete chiuso il cerchio. Ora la città vi lascia tornare —
            piano, senza fretta, lungo la riva.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/mappa?focus=ritorno"
              className="inline-block min-h-11 border-2 border-black bg-verb-yellow px-5 py-3 font-pixel text-[10px] tracking-widest text-black shadow-[2px_2px_0_var(--color-bg-deep)] hover:bg-sand active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              ↩ TORNA VERSO LA STAZIONE
            </Link>

            {/* Coda facoltativa: titoli di coda. Più piccola, secondaria. */}
            <button
              type="button"
              onClick={() => setCreditsOpen(true)}
              className="mx-auto inline-block min-h-11 border-2 border-stone-mid bg-transparent px-4 py-2 font-pixel text-[9px] tracking-widest text-ocra-light hover:border-ocra hover:text-sand active:translate-x-[1px] active:translate-y-[1px]"
            >
              ▸ TITOLI DI CODA
            </button>

            {SIDE_CONTENT_RELEASED ? (
              <Link
                href="/manoscritto"
                className="inline-block min-h-11 border-2 border-black bg-ocra px-5 py-3 font-pixel text-[10px] tracking-widest text-black shadow-[2px_2px_0_var(--color-bg-deep)] hover:bg-ocra-light active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              >
                ★ APRI IL MANOSCRITTO
              </Link>
            ) : (
              <div
                className="min-h-11 cursor-not-allowed border-2 border-stone-mid bg-stone-dark/60 px-5 py-3 font-pixel text-[10px] tracking-widest text-stone-light"
                aria-disabled="true"
              >
                ★ IL MANOSCRITTO
                <span className="mt-1 block font-mono text-sm not-italic text-stone-light/80">
                  in arrivo nelle prossime settimane
                </span>
              </div>
            )}
          </div>

          {/* Easter egg counter */}
          <div className="mt-6 border-t border-stone-dark pt-4">
            <p className="font-pixel text-[9px] tracking-widest text-ocra-light">
              ★ INDIZI TROVATI: {easterCount}/{TOTAL_EASTER_EGGS}
            </p>
            {showSegretiCta &&
              (SIDE_CONTENT_RELEASED ? (
                <Link
                  href="/manoscritto/segreti"
                  className="mt-3 inline-block font-mono text-base text-blood-bright underline decoration-dotted underline-offset-4 hover:text-ocra-light"
                >
                  → I SEGRETI
                </Link>
              ) : (
                <p className="mt-3 font-mono text-sm italic text-stone-light/80">
                  → I segreti vi attenderanno nel manoscritto
                </p>
              ))}
          </div>
        </div>

        <p className="mt-8 max-w-md text-center font-mono text-base italic text-stone-light">
          (L&apos;Archivista, ultima trasmissione: &quot;Buon ritorno. E
          mi raccomando, lo sposo intero alla stazione.&quot;)
        </p>
      </section>

      {/* BEAT 4 — Titoli di coda (overlay facoltativo) */}
      {creditsOpen && (
        <CreditsRoll
          onClose={() => setCreditsOpen(false)}
          reducedMotion={reducedMotion}
        />
      )}
    </main>
  );
}
