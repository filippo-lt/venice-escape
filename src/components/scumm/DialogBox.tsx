import type { ReactNode } from "react";

type DialogBoxProps = {
  /** Chi parla, es. "FRA CELESTINO:" */
  speaker: string;
  /** Testo del dialogo. Può contenere <span> per highlight. */
  children: ReactNode;
  /** Mostra il cursorino lampeggiante in fondo? */
  showCursor?: boolean;
  /** Mostra l'indicatore "▼ avanti" in basso a destra? */
  showNext?: boolean;
};

/**
 * Dialog box stile SCUMM/MI1: bordo ocra in alto, sfondo nero,
 * speaker in pixel-font giallo, testo VT323 grande e leggibile al sole.
 */
export function DialogBox({
  speaker,
  children,
  showCursor = true,
  showNext = false,
}: DialogBoxProps) {
  return (
    <div className="relative border-t-2 border-ocra bg-black px-5 py-4">
      <p className="mb-2 font-pixel text-[10px] tracking-widest text-verb-yellow">
        {speaker}
      </p>
      <p className="font-mono text-2xl leading-snug text-white-text">
        {children}
        {showCursor && (
          <span className="animate-blink ml-1 inline-block text-verb-yellow">
            █
          </span>
        )}
      </p>
      {showNext && (
        <span
          className="absolute bottom-3 right-4 text-2xl text-verb-yellow"
          style={{ animation: "pulse-scumm 0.8s ease-in-out infinite" }}
        >
          ▼
        </span>
      )}
    </div>
  );
}
