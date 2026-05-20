"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Anchor } from "@/lib/anchors";

type Props = {
  anchor: Anchor;
  next?: Anchor;
};

export function TransitionPage({ anchor, next }: Props) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setRevealed(true), 800);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-bg-deep px-5 py-10 text-white-text">
      <div className="w-full max-w-md border-2 border-ocra bg-black p-5 text-center">
        <p className="font-pixel text-[11px] tracking-widest text-verb-yellow">
          ★ ANCORA {anchor.id} ATTIVATA ★
        </p>

        <p className="mt-5 font-mono text-xl leading-snug">
          Il frammento è vostro. La soglia è varcata: ora siete{" "}
          <em>dentro</em> Venezia, e il manoscritto comincia a fidarsi di voi.
        </p>

        <div
          className={[
            "mx-auto mt-6 flex h-24 w-24 items-center justify-center border-2 border-blood-bright bg-blood font-pixel text-2xl text-sand transition-opacity duration-700",
            revealed ? "opacity-100" : "opacity-0",
          ].join(" ")}
          aria-label={`Frammento ${anchor.fragment}`}
        >
          {anchor.fragment}
        </div>

        {anchor.nextHint && (
          <p className="mt-6 font-mono text-base italic text-ocra-light">
            {anchor.nextHint}
          </p>
        )}

        <p
          className="mt-4 font-mono text-sm italic"
          style={{ color: "#6b8aa0" }}
        >
          (L&apos;Archivista, sottovoce: &quot;Spero solo che resti sobrio
          almeno fino alla prossima.&quot;)
        </p>

        {next ? (
          <Link
            href={next.href}
            className="mt-6 inline-block min-h-11 border-2 border-black bg-verb-yellow px-5 py-3 font-pixel text-[10px] tracking-widest text-black shadow-[2px_2px_0_var(--color-bg-deep)] hover:bg-sand active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            VERSO {next.location.toUpperCase()} →
          </Link>
        ) : (
          <Link
            href="/finale"
            className="mt-6 inline-block min-h-11 border-2 border-black bg-verb-yellow px-5 py-3 font-pixel text-[10px] tracking-widest text-black"
          >
            AL FINALE →
          </Link>
        )}
      </div>
    </main>
  );
}
