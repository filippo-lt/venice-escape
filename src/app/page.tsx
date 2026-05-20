import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-4 py-10">
      <div className="w-full border-[3px] border-ocra bg-black p-6 shadow-[0_0_30px_rgba(184,132,42,0.3)] sm:p-10">
        {/* finta sequenza di boot SCUMM */}
        <div className="space-y-1 font-mono text-base leading-snug text-ocra-light sm:text-xl">
          <p className="text-stone-mid">SCUMM v5.1.42 — Loading...</p>
          <p className="text-stone-mid">Reading manuscript from disk A:\</p>
          <p className="text-stone-mid">Checking memory... 640K OK</p>
          <p className="text-blood-bright">
            WARNING: file corrupted — anno 1297
          </p>
          <p className="text-white-text">
            Recovering data from{" "}
            <span className="text-verb-yellow">monastery_torcello.dat</span>
          </p>
          <p className="text-stone-mid">. . .</p>
          <p className="text-white-text">
            OK — ready to play <span className="animate-blink">█</span>
          </p>
        </div>

        {/* titolo */}
        <div className="mt-12 text-center">
          <h1
            className="font-pixel text-xl leading-tight text-sand sm:text-3xl"
            style={{
              textShadow:
                "2px 2px 0 var(--color-blood), 4px 4px 0 var(--color-bg-deep)",
              letterSpacing: "0.05em",
            }}
          >
            LE SETTE ÀNCORE
          </h1>
          <h2
            className="mt-3 font-pixel text-xs leading-tight text-sand sm:text-base"
            style={{
              textShadow:
                "2px 2px 0 var(--color-blood), 4px 4px 0 var(--color-bg-deep)",
              letterSpacing: "0.05em",
            }}
          >
            DELLA SERENISSIMA
          </h2>
          <p className="mt-4 font-mono text-lg tracking-widest text-ocra-light sm:text-2xl">
            ~ A SCUMM ADVENTURE ~
          </p>
        </div>

        {/* credits */}
        <div className="mt-10 text-center font-mono text-base leading-relaxed text-stone-light sm:text-xl">
          © Anno Domini MCCXCVII
          <br />
          <span className="text-ocra-light">
            Designed by FRA CELESTINO da Torcello
          </span>
          <br />
          <span className="text-stone-mid">
            (in stato di ubriachezza variabile)
          </span>
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link
            href="/ancora/1"
            className="animate-pulse-scumm inline-block min-h-11 border-2 border-verb-yellow bg-black px-6 py-3 font-pixel text-[10px] tracking-widest text-verb-yellow hover:bg-verb-yellow hover:text-black focus:outline-none focus:ring-2 focus:ring-verb-yellow sm:text-xs"
          >
            ▶ PRESS START TO BEGIN ◀
          </Link>
        </div>

        {/* mini palette per QA visivo durante M1 */}
        <div className="mt-12 border-t border-stone-dark pt-4">
          <p className="font-pixel text-[8px] tracking-widest text-ocra-light">
            ▼ DESIGN TOKENS — M1 CHECK ▼
          </p>
          <div className="mt-3 grid grid-cols-6 gap-2 sm:grid-cols-12">
            {[
              ["bg-deep", "bg-bg-deep"],
              ["bg-night", "bg-bg-night"],
              ["bg-water", "bg-bg-water"],
              ["stone-dark", "bg-stone-dark"],
              ["stone-mid", "bg-stone-mid"],
              ["stone-light", "bg-stone-light"],
              ["ocra", "bg-ocra"],
              ["ocra-light", "bg-ocra-light"],
              ["sand", "bg-sand"],
              ["paper", "bg-paper"],
              ["blood", "bg-blood"],
              ["verb-yellow", "bg-verb-yellow"],
            ].map(([name, cls]) => (
              <div key={name} className="flex flex-col items-center gap-1">
                <div className={`${cls} h-8 w-full border border-stone-dark`} />
                <span className="font-mono text-[10px] text-stone-light">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
