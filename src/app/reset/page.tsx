"use client";

// Pagina /reset — utility per Game Master e test sul campo.
// Azzera il progresso (localStorage) e mostra una conferma con CTA verso /.
// Niente form, niente conferme: chi arriva qui sa cosa sta facendo.

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DialogBox } from "@/components/scumm";
import { resetProgress } from "@/lib/progress";

type State = "wiping" | "done";

export default function ResetPage() {
  const router = useRouter();
  const [state, setState] = useState<State>("wiping");

  useEffect(() => {
    // Cancella la chiave canonica "venice-escape-progress".
    resetProgress();
    // Reset opzionale: il flag bootSeen della home (così rivedi il boot).
    try {
      window.localStorage.removeItem("bootSeen");
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState("done");
  }, []);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-bg-deep px-4 py-10 text-white-text">
      <div className="w-full max-w-md">
        <p className="mb-3 text-center font-pixel text-[10px] tracking-widest text-ocra-light">
          ★ GAME MASTER · RESET ★
        </p>

        <div className="border-2 border-ocra bg-stone-dark/40 p-5">
          {state === "wiping" ? (
            <p className="text-center font-mono text-xl leading-snug">
              Azzero il progresso…
            </p>
          ) : (
            <>
              <p className="mb-3 text-center font-pixel text-[11px] tracking-widest text-verb-yellow anim-blink">
                ★ PROGRESSO AZZERATO ★
              </p>
              <p className="font-mono text-lg leading-snug text-paper">
                Il localStorage è stato pulito. Frammenti, ancore sbloccate
                ed easter egg sono spariti.
              </p>
            </>
          )}
        </div>

        {state === "done" && (
          <div className="mt-6">
            <DialogBox speaker="L'ARCHIVISTA:" showCursor showNext={false}>
              La pergamena è di nuovo bianca. Buona avventura.
            </DialogBox>
          </div>
        )}

        <button
          type="button"
          onClick={() => router.push("/")}
          disabled={state !== "done"}
          className="mt-6 flex min-h-14 w-full items-center justify-center border-2 border-black bg-verb-yellow px-5 py-3 text-center font-pixel text-[11px] tracking-widest text-black shadow-[3px_3px_0_var(--color-bg-deep)] hover:bg-sand active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          ★ RIVEDI INTRO →
        </button>

        <p className="mt-3 text-center font-mono text-sm italic text-stone-light">
          (Il boot animato e la title screen ripartono da zero.)
        </p>
      </div>
    </main>
  );
}
