type InventoryProps = {
  /** Frammento per ciascuna ancora risolta. La chiave è l'id (1-7). */
  fragments: Record<number, string>;
  /** Numero totale di slot (default 7). */
  total?: number;
};

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII"];

/**
 * Inventario a 7 slot. Slot pieno = ancora risolta, mostra il numerale
 * romano. Slot vuoto = "?" su sfondo bg-night.
 */
export function Inventory({ fragments, total = 7 }: InventoryProps) {
  return (
    <div className="border-2 border-ocra bg-black p-2">
      <p className="text-center font-pixel text-[7px] tracking-widest text-ocra-light">
        FRAMMENTI
      </p>
      <ul
        className="mt-2 grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: total }, (_, i) => {
          const id = i + 1;
          const filled = fragments[id] !== undefined;
          return (
            <li
              key={id}
              title={filled ? fragments[id] : `Ancora ${ROMAN[i]}`}
              className={[
                "flex aspect-square items-center justify-center border font-pixel text-[10px]",
                filled
                  ? "border-blood-bright bg-blood text-sand shadow-[inset_-2px_-2px_0_rgba(0,0,0,0.3),inset_2px_2px_0_rgba(255,255,255,0.1)]"
                  : "border-stone-dark bg-bg-night text-ocra-light",
              ].join(" ")}
            >
              {filled ? ROMAN[i] : "?"}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
