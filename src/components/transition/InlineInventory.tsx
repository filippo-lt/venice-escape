// Striscia compatta di 7 celle (◆ piena / ◇ vuota) coerente con
// <Inventory /> SCUMM ma in formato in-line per la pagina di transizione.

type Props = {
  /** Stato dei frammenti per anchorId (1..7). */
  fragments: Record<number, string>;
  /** ID dell'ancora appena risolta (per highlight extra). */
  justRevealed?: number;
  total?: number;
};

export function InlineInventory({ fragments, justRevealed, total = 7 }: Props) {
  return (
    <ul
      className="mx-auto flex w-full max-w-[320px] items-center justify-between gap-1"
      aria-label="Frammenti raccolti"
    >
      {Array.from({ length: total }, (_, i) => {
        const id = i + 1;
        const filled = fragments[id] !== undefined;
        const isNew = filled && id === justRevealed;
        return (
          <li
            key={id}
            title={filled ? `Frammento ${id}: ${fragments[id]}` : `Ancora ${id}`}
            className={[
              "flex aspect-square min-h-6 min-w-6 flex-1 items-center justify-center border font-pixel text-[14px] leading-none",
              filled
                ? "border-blood-bright bg-blood text-sand shadow-[inset_-1px_-1px_0_rgba(0,0,0,0.3),inset_1px_1px_0_rgba(255,255,255,0.1)]"
                : "border-stone-dark bg-bg-night text-stone-mid",
              isNew ? "anim-glow" : "",
            ].join(" ")}
            aria-current={isNew ? "step" : undefined}
          >
            {filled ? "◆" : "◇"}
          </li>
        );
      })}
    </ul>
  );
}
