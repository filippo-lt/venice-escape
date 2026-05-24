// Card "manoscritto" stile pergamena: teaser narrativo + indicazione di luogo
// + CTA grande verso la prossima ancora. La CTA NON mostra il codice di
// arrivo: la pagina-ancora successiva chiederà il codice del custode.

import Link from "next/link";
import type { Anchor } from "@/lib/anchors";

type Props = {
  anchor: Anchor;
  next: Anchor;
};

export function NextDestinationCard({ anchor, next }: Props) {
  return (
    <section className="w-full">
      <div className="relative border-2 border-ocra bg-paper px-4 py-4 text-bg-deep shadow-[3px_3px_0_var(--color-bg-deep)]">
        {/* Pseudo-pergamena: leggera trama tramite gradient */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 30% 20%, rgba(74,53,32,0.18), transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(74,53,32,0.15), transparent 60%)",
          }}
        />

        <p className="relative font-pixel text-[8px] tracking-widest text-blood">
          ✦ LA PROSSIMA SOGLIA ✦
        </p>

        {anchor.nextTeaser && (
          <p className="relative mt-3 font-mono text-lg italic leading-snug text-bg-deep">
            {anchor.nextTeaser}
          </p>
        )}

        {anchor.nextHint && (
          <p className="relative mt-3 font-mono text-base leading-snug text-stone-dark">
            <span className="font-pixel text-[8px] tracking-widest text-ocra">
              DOVE ANDARE —{" "}
            </span>
            {anchor.nextHint}
          </p>
        )}
      </div>

      <Link
        href={next.href}
        className="mt-4 flex min-h-14 w-full items-center justify-center border-2 border-black bg-verb-yellow px-5 py-3 text-center font-pixel text-[11px] tracking-widest text-black shadow-[3px_3px_0_var(--color-bg-deep)] hover:bg-sand active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
      >
        VERSO {next.location.toUpperCase()} →
      </Link>
    </section>
  );
}
