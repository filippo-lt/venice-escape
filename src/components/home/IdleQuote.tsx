"use client";

import { useEffect, useState } from "react";

const IDLE_QUOTES = [
  "Sète àncore. Un novizo. Una sola sera. Andèmo.",
  "Ostrega, ancora qua? La Serenissima no la speta.",
  "Se vièn la marea granda, fioi, andemo tuti soto. Movève.",
  "Mi gò za beest. Vu cossa spetè?",
  "Varda ben, fioi: Venezia la sprofonda mentre ti pensi.",
  "Un fioi se marida. Prima che la mugiera ghe taja le ale... andemo.",
  "Mòneghi mii, gò un manoscrito e 'na sé che no vede l'ora.",
  "Stè boni che ve conto tuto. Ma prima: dème 'na man co' 'ste àncore.",
];

const FIRST_VISIT_KEY = "firstVisit";
const IDLE_MS = 5000;

/**
 * Idle quote di Fra Celestino. Appare dopo 5s di inattività sul title.
 * Mostra IDLE_QUOTES[0] al primo accesso, altrimenti una a caso.
 */
export default function IdleQuote() {
  const [quote, setQuote] = useState<string | null>(null);

  useEffect(() => {
    // Determina indice della quote
    let idx = 0;
    try {
      const firstVisit = window.localStorage.getItem(FIRST_VISIT_KEY);
      if (firstVisit === "0") {
        idx = Math.floor(Math.random() * (IDLE_QUOTES.length - 1)) + 1;
      } else {
        window.localStorage.setItem(FIRST_VISIT_KEY, "0");
      }
    } catch {
      // ignore — fallback to first quote
    }

    let timer: number | undefined;
    const start = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setQuote(IDLE_QUOTES[idx]), IDLE_MS);
    };
    const reset = () => {
      setQuote(null);
      start();
    };

    start();
    window.addEventListener("mousemove", reset);
    window.addEventListener("touchstart", reset, { passive: true });
    window.addEventListener("keydown", reset);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("mousemove", reset);
      window.removeEventListener("touchstart", reset);
      window.removeEventListener("keydown", reset);
    };
  }, []);

  if (!quote) return null;

  return (
    <p
      className="idle-quote pointer-events-none mt-6 px-4 text-center font-mono italic text-paper sm:text-lg"
      style={{ opacity: 0.7 }}
    >
      &ldquo;{quote}&rdquo;
      <style jsx>{`
        .idle-quote {
          animation: idle-fade-in 600ms ease-out forwards;
        }
        @keyframes idle-fade-in {
          from { opacity: 0; }
          to { opacity: 0.7; }
        }
      `}</style>
    </p>
  );
}
