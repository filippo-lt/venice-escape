import { Suspense } from "react";
import { FinalePage } from "./FinalePage";

export const metadata = {
  title: "Venice Escape — Finale",
  description: "I sette frammenti compongono il nome. Venezia vi saluta.",
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-dvh items-center justify-center bg-bg-deep text-white-text">
          <p className="font-pixel text-[10px] tracking-widest text-ocra-light">
            ► CARICAMENTO FINALE…
          </p>
        </main>
      }
    >
      <FinalePage />
    </Suspense>
  );
}
