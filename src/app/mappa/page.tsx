import { Suspense } from "react";
import { MapPage } from "./MapPage";

export const metadata = {
  title: "Venice Escape — Mappa",
  description:
    "La mappa delle sette ancore. Tocca un punto sbloccato per tornare alla scena.",
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-dvh items-center justify-center bg-bg-deep text-white-text">
          <p className="font-pixel text-[10px] tracking-widest text-ocra-light">
            ► CARICAMENTO MAPPA…
          </p>
        </main>
      }
    >
      <MapPage />
    </Suspense>
  );
}
