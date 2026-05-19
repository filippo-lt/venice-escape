/**
 * Pannello "verbi" SCUMM. **Decorativo**: i verbi non sono interattivi
 * nella main quest (cfr. docs/04_website_architecture.md). Esistono per
 * atmosfera. Eventuali eccezioni (easter egg "verbo giusto") possono
 * tappare un verbo specifico via prop `onTapVerb`, ma di default no.
 */

const DEFAULT_VERBS = [
  ["Guarda", "Parla a", "Apri"],
  ["Prendi", "Usa", "Bevi con"],
  ["Esamina", "Conta", "Mostra"],
] as const;

type VerbUIProps = {
  /** Verbo "attivo" (evidenziato in bianco), solo decorativo. */
  active?: string;
  /** Se passato, i verbi diventano cliccabili (per easter egg). */
  onTapVerb?: (verb: string) => void;
};

export function VerbUI({ active = "Parla a", onTapVerb }: VerbUIProps) {
  return (
    <div className="grid grid-cols-3 gap-2 border-t-2 border-ocra bg-bg-night p-3">
      {DEFAULT_VERBS.map((col, ci) => (
        <div key={ci} className="flex flex-col gap-1">
          {col.map((verb) => {
            const isActive = verb === active;
            const interactive = Boolean(onTapVerb);
            const className = [
              "text-left font-mono text-lg leading-none tracking-wide sm:text-xl",
              isActive ? "text-selected" : "text-verb-yellow",
              interactive ? "cursor-pointer hover:text-selected" : "cursor-default",
            ].join(" ");
            return interactive ? (
              <button
                key={verb}
                type="button"
                onClick={() => onTapVerb?.(verb)}
                className={className}
              >
                ► {verb}
              </button>
            ) : (
              <span key={verb} className={className} aria-hidden>
                ► {verb}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}
