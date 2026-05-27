"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Props = {
  /** Chiude l'overlay e riporta al Beat 3. */
  onClose: () => void;
  /** Se true: niente scroll automatico, contenuto leggibile/scrollabile a mano. */
  reducedMotion?: boolean;
};

/** Stesso target del Beat 3: la via di casa resta sempre raggiungibile. */
const RETURN_HREF = "/mappa?focus=ritorno";

/** Durata dello scroll automatico (range di spec: 45-55 sec). */
const SCROLL_SECONDS = 52;

/**
 * Beat 4 di /finale — Titoli di coda in stile LucasArts anni 90.
 *
 * Overlay full-screen (NON una route) sopra /finale. Scroll verticale
 * automatico dal basso verso l'alto; un tap salta allo stato finale statico.
 * Audio chiptune in loop a volume basso (degrada in silenzio se bloccato).
 * Nessuna scrittura su localStorage: è puramente presentazionale.
 */
export function CreditsRoll({ onClose, reducedMotion }: Props) {
  // "rolling" = scroll in corso; "ended" = stato finale statico (GRAZIE / FINE).
  // Con reduced-motion partiamo già statici: contenuto interamente leggibile.
  const [ended, setEnded] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const rolling = !reducedMotion && !ended;

  // Skip (tap) e fine-scroll convergono sullo stesso stato finale statico.
  const finish = () => setEnded(true);

  // Avvio audio + lock dello scroll del body finché l'overlay è montato.
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.4;
      // Autoplay non forzato: se il browser lo blocca, i crediti scorrono muti.
      audio.play().catch(() => {});
    }
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const next = !muted;
    audio.muted = next;
    if (!next && audio.paused) audio.play().catch(() => {});
    setMuted(next);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Titoli di coda"
      className="crt fixed inset-0 z-50 overflow-hidden bg-bg-deep text-white-text"
    >
      {/* Sfondo: laguna notturna seppia-scura. Degrada sul colore di base
          se l'asset non è ancora presente. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-60"
        style={{
          backgroundImage: "url(/images/credits_bg.webp)",
          backgroundColor: "var(--color-bg-deep)",
          imageRendering: "pixelated",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(26,15,8,0.35) 40%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      {/* Layer di skip: copre tutta l'area, sotto il testo (pointer-events-none)
          così ogni tap sui crediti lo raggiunge. Solo durante lo scroll. */}
      {rolling && (
        <button
          type="button"
          onClick={finish}
          aria-label="Salta i titoli di coda"
          className="absolute inset-0 z-10 h-full w-full cursor-pointer bg-transparent"
        />
      )}

      {/* Controlli sempre in primo piano (alto a destra). */}
      <div className="absolute right-3 top-3 z-30 flex items-center gap-2">
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Riattiva l'audio" : "Silenzia l'audio"}
          aria-pressed={muted}
          className="flex h-11 w-11 items-center justify-center border-2 border-stone-mid bg-bg-night/80 font-pixel text-[11px] text-ocra-light hover:border-ocra hover:text-sand active:translate-x-[1px] active:translate-y-[1px]"
          style={{ opacity: muted ? 0.5 : 1 }}
        >
          ♪
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label="Chiudi i titoli di coda"
          className="flex h-11 w-11 items-center justify-center border-2 border-black bg-verb-yellow font-pixel text-[12px] text-black shadow-[2px_2px_0_var(--color-bg-deep)] hover:bg-sand active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        >
          ✕
        </button>
      </div>

      {ended ? (
        // ── Stato finale statico (dopo scroll o skip) ──
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center">
          <FinaleBlock />
        </div>
      ) : rolling ? (
        // ── Scroll automatico ──
        <div
          onAnimationEnd={finish}
          className="pointer-events-none absolute left-0 top-0 z-20 w-full px-6"
          style={{
            animation: `credits-scroll ${SCROLL_SECONDS}s linear forwards`,
            willChange: "transform",
          }}
        >
          <CreditsBody />
        </div>
      ) : (
        // ── Reduced motion: tutto leggibile, scrollabile a mano ──
        <div className="absolute inset-0 z-20 overflow-y-auto px-6 py-10">
          <CreditsBody />
          <div className="mt-10">
            <FinaleBlock />
          </div>
        </div>
      )}

      <audio
        ref={audioRef}
        src="/audio/main/credits_loop.mp3"
        loop
        preload="auto"
      />
    </div>
  );
}

/** Riga "intestazione" in Press Start 2P. */
function Head({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-pixel text-[11px] leading-relaxed tracking-widest text-sand sm:text-xs">
      {children}
    </p>
  );
}

/** Riga di corpo in VT323. */
function Body({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-lg leading-snug text-ocra-light sm:text-xl">
      {children}
    </p>
  );
}

function Divider() {
  return (
    <div aria-hidden="true" className="my-7 text-center font-mono text-stone-mid">
      ─────────────────────────
    </div>
  );
}

/** Il rullo dei crediti — contenuto base (Fase 1), vedi finale.md sez. 2. */
function CreditsBody() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 text-center">
      <div className="mb-2">
        <Head>LE SETTE ÀNCORE</Head>
        <Head>DELLA SERENISSIMA</Head>
      </div>
      <Body>un manoscritto perduto,</Body>
      <Body>ritrovato come gioco</Body>

      <Divider />

      <Head>FRA CELESTINO DA TORCELLO</Head>
      <Body>se stesso</Body>
      <div className="h-4" />
      <Head>L&apos;ARCHIVISTA</Head>
      <Body>suo malgrado</Body>
      <div className="h-4" />
      <Head>FRA BORTOLO</Head>
      <Body>non pervenuto</Body>

      <Divider />

      <Head>IL LETTORE ELETTO</Head>
      <p className="font-pixel text-lg tracking-widest text-verb-yellow sm:text-xl">
        Cirpo
      </p>
      <Body>
        ── senza di lui questo manoscritto era solo inchiostro bagnato ──
      </Body>

      <Divider />

      <Head>LA COMPAGNIA</Head>
      <Body>Mick</Body>
      <Body>Tarch</Body>
      <Body>Bobo</Body>
      <Body>Vendra</Body>
      <Body>Varta</Body>
      <Body>Turpe</Body>

      <Divider />

      <Body>ASTRONOMIA &amp; OSTERIA . . . Fra Celestino</Body>
      <Body>TRADUZIONI &amp; RIMORSO . . . L&apos;Archivista</Body>
      <Body>ARCHITETTO DELL&apos;INGANNO . Zuppo</Body>

      <Divider />

      <Head>GIRATO INTERAMENTE IN ESTERNI</Head>
      <Body>a Venezia, a piedi,</Body>
      <Body>con la fretta di tornare a casa</Body>
      <div className="h-5" />
      <Head>NESSUN FRATE È STATO</Head>
      <Head>SOBRIO DURANTE LE RIPRESE</Head>
    </div>
  );
}

/** Stato finale statico: GRAZIE / FINE + via di casa. */
function FinaleBlock() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-5 text-center">
      <div>
        <Head>GRAZIE PER AVER TENUTO</Head>
        <Head>VENEZIA A GALLA.</Head>
      </div>
      <p className="font-pixel text-base tracking-widest text-verb-yellow sm:text-lg">
        ▸ FINE ◂
      </p>
      <p className="font-mono text-lg italic leading-snug text-stone-light">
        (ricominciare? no.
        <br />
        vai a casa, Cirpo.)
      </p>
      <Link
        href={RETURN_HREF}
        className="mt-2 inline-block min-h-11 border-2 border-black bg-verb-yellow px-5 py-3 font-pixel text-[10px] tracking-widest text-black shadow-[2px_2px_0_var(--color-bg-deep)] hover:bg-sand active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
      >
        ↩ TORNA VERSO LA STAZIONE
      </Link>
    </div>
  );
}
