import Link from "next/link";
import type { CSSProperties } from "react";
import type { MapMarkerPosition } from "@/lib/map-markers";

export type AnchorMarkerState = "locked" | "unlocked" | "solved";

type AnchorMarkerProps = {
  /** ID dell'ancora (1..7). */
  id: number;
  /** Stato corrente (riflette `progress`). */
  state: AnchorMarkerState;
  /** Coordinate in % rispetto al contenitore. */
  position: MapMarkerPosition;
  /** Frammento svelato (lettera/numero). Mostrato come badge se `state==='solved'`. */
  fragment?: string;
  /** Nome del luogo, usato come aria-label. */
  label: string;
};

// Marker trasparente di 56x56 px (≥ tap target 44x44) che AVVOLGE l'icona
// dipinta sulla mappa, invece di coprirla con un quadrato pieno. Lo stato
// è comunicato da bordo/scrim/glow, non dal background.
const BASE_BUTTON =
  "absolute -translate-x-1/2 -translate-y-1/2 inline-flex items-center justify-center " +
  "min-h-14 min-w-14 h-14 w-14 rounded-full font-pixel text-[10px] tracking-widest " +
  "select-none";

const STATE_CLASSES: Record<AnchorMarkerState, string> = {
  locked:
    "bg-bg-deep/55 text-transparent pointer-events-none [filter:grayscale(0.7)]",
  unlocked:
    "ring-2 ring-ocra ring-offset-1 ring-offset-transparent text-transparent " +
    "shadow-[0_0_12px_2px_rgba(214,166,71,0.55)] animate-pulse " +
    "hover:ring-ocra-light active:translate-x-[1px] active:translate-y-[1px]",
  solved:
    "ring-2 ring-verb-yellow ring-offset-1 ring-offset-transparent text-transparent " +
    "shadow-[0_0_10px_1px_rgba(232,200,120,0.7)] " +
    "hover:ring-sand active:translate-x-[1px] active:translate-y-[1px]",
};

/**
 * Marker sulla mappa per una singola ancora.
 *
 * - `locked`: opaco, non interattivo (ancora non ancora sbloccata).
 * - `unlocked`: glow ocra con pulse leggero (no infinite spin: rispetta la
 *   batteria) e tap target ≥ 44x44px.
 * - `solved`: oro pieno + badge col frammento.
 */
export function AnchorMarker({
  id,
  state,
  position,
  fragment,
  label,
}: AnchorMarkerProps) {
  const style: CSSProperties = {
    top: `${position.top}%`,
    left: `${position.left}%`,
  };

  const ariaLabel =
    state === "locked"
      ? `Ancora ${id} — ${label} (bloccata)`
      : state === "solved"
        ? `Ancora ${id} — ${label} (risolta, frammento ${fragment ?? "?"})`
        : `Ancora ${id} — ${label}`;

  const content = (
    <>
      <span aria-hidden="true">{id}</span>
      {state === "solved" && fragment ? (
        <span
          className="absolute -right-2 -top-2 inline-flex h-5 w-5 items-center justify-center border-2 border-black bg-paper font-pixel text-[8px] text-black"
          aria-hidden="true"
          data-testid={`marker-${id}-fragment`}
        >
          {fragment}
        </span>
      ) : null}
    </>
  );

  if (state === "locked") {
    return (
      <span
        className={`${BASE_BUTTON} ${STATE_CLASSES.locked}`}
        style={style}
        aria-label={ariaLabel}
        role="img"
        data-testid={`marker-${id}`}
        data-state={state}
        data-locked="true"
      >
        {content}
      </span>
    );
  }

  return (
    <Link
      href={`/ancora/${id}`}
      className={`${BASE_BUTTON} ${STATE_CLASSES[state]}`}
      style={style}
      aria-label={ariaLabel}
      data-testid={`marker-${id}`}
      data-state={state}
    >
      {content}
    </Link>
  );
}
