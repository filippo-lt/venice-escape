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

const BASE_BUTTON =
  "absolute -translate-x-1/2 -translate-y-1/2 inline-flex items-center justify-center " +
  "min-h-11 min-w-11 h-11 w-11 border-2 font-pixel text-[10px] tracking-widest " +
  "shadow-[2px_2px_0_var(--color-bg-deep)] select-none";

const STATE_CLASSES: Record<AnchorMarkerState, string> = {
  locked:
    "border-stone-dark bg-stone-dark/60 text-stone-light/70 opacity-30 pointer-events-none",
  unlocked:
    "border-black bg-ocra text-black hover:bg-ocra-light active:translate-x-[2px] active:translate-y-[2px] active:shadow-none animate-pulse",
  solved:
    "border-black bg-verb-yellow text-black hover:bg-sand active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
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
