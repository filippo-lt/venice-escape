"use client";

import { useState } from "react";
import {
  AudioPlayer,
  CommandBar,
  DialogBox,
  Inventory,
  SceneFrame,
  VerbUI,
} from "@/components/scumm";

// Pagina di showcase / storybook minimale per i componenti SCUMM.
// Vive sotto /dev/components — verrà rimossa (o nascosta) prima del go-live.

export default function DevComponentsPage() {
  const [status, setStatus] = useState<"idle" | "wrong" | "loading">("idle");
  const [fragments, setFragments] = useState<Record<number, string>>({
    1: "SOGLIA",
    2: "POZZO",
  });

  const onSubmit = async (v: string) => {
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 400));
    if (v.trim().toLowerCase() === "marea") {
      setFragments((f) => ({ ...f, 3: "MAREA" }));
      setStatus("idle");
    } else {
      setStatus("wrong");
      setTimeout(() => setStatus("idle"), 1200);
    }
  };

  return (
    <main className="mx-auto max-w-3xl space-y-8 px-3 py-6 sm:py-10">
      <header className="space-y-1">
        <p className="font-pixel text-[9px] tracking-widest text-ocra-light">
          ▼ DEV / COMPONENTS SHOWCASE ▼
        </p>
        <h1 className="font-pixel text-base text-sand sm:text-xl">
          M3 — SCUMM components
        </h1>
        <p className="font-mono text-base text-stone-light">
          Pagina temporanea: validazione visiva dei componenti su mobile.
        </p>
      </header>

      {/* === Game window prototipo === */}
      <section className="border-[3px] border-ocra bg-black shadow-[0_0_30px_rgba(184,132,42,0.3)]">
        <SceneFrame
          label="SCENE 03 — ZATTERE BY NIGHT"
          quest="QUEST: TROVA IL TERZO SEGNO"
        >
          <FakeScene />
        </SceneFrame>

        <DialogBox speaker="FRA CELESTINO:" showNext>
          {`"Ah, le Zattere! Qua mi venia col confratel Fra Bortolo a vardar le tose che passava... ma adesso scoltème: la marea che vien da soto la Zueca la conta `}
          <span className="text-verb-yellow">sète volte</span>
          {`."`}
        </DialogBox>

        <AudioPlayer
          src="/audio/main/placeholder.mp3"
          label="VOICE.WAV — Fra Celestino"
        />

        <div className="border-t-2 border-ocra bg-bg-night p-2">
          <Inventory fragments={fragments} />
        </div>

        <CommandBar onSubmit={onSubmit} status={status} />
      </section>

      {/* === VerbUI (decorativo) === */}
      <section className="space-y-3">
        <h2 className="font-pixel text-[10px] tracking-widest text-ocra-light">
          ▼ VerbUI (decorativo) ▼
        </h2>
        <VerbUI active="Parla a" />
      </section>

      {/* === Stati DialogBox === */}
      <section className="space-y-3">
        <h2 className="font-pixel text-[10px] tracking-widest text-ocra-light">
          ▼ DialogBox · stati ▼
        </h2>
        <DialogBox speaker="L'ARCHIVISTA:" showCursor={false}>
          Il manoscritto, qui, presenta una macchia di vino. Ipotizziamo
          fosse un teramano. O un raboso.
        </DialogBox>
        <DialogBox speaker="FRA BORTOLO:" showCursor showNext>
          {`"Celestino, basta gòti! La marea no la spèta!"`}
        </DialogBox>
      </section>

      {/* === Inventory variants === */}
      <section className="space-y-3">
        <h2 className="font-pixel text-[10px] tracking-widest text-ocra-light">
          ▼ Inventory · stati ▼
        </h2>
        <Inventory fragments={{}} />
        <Inventory fragments={{ 1: "A", 2: "B", 3: "C", 4: "D" }} />
        <Inventory
          fragments={{ 1: "A", 2: "B", 3: "C", 4: "D", 5: "E", 6: "F", 7: "G" }}
        />
      </section>

      {/* === CommandBar stati === */}
      <section className="space-y-3">
        <h2 className="font-pixel text-[10px] tracking-widest text-ocra-light">
          ▼ CommandBar · stati ▼
        </h2>
        <CommandBar onSubmit={() => {}} status="idle" />
        <CommandBar
          onSubmit={() => {}}
          status="wrong"
          placeholder="risposta sbagliata, riprova"
        />
        <CommandBar onSubmit={() => {}} disabled placeholder="disabilitato" />
      </section>
    </main>
  );
}

// Scena fake CSS-only finché non arrivano gli asset pixel art veri.
function FakeScene() {
  return (
    <div className="absolute inset-0">
      {/* cielo */}
      <div className="absolute inset-x-0 top-0 h-[40%] bg-sky-night" />
      {/* luna */}
      <div
        className="absolute h-8 w-8 rounded-full bg-paper shadow-[0_0_20px_rgba(240,216,160,0.4),inset_-6px_-2px_0_var(--color-sand)]"
        style={{ top: "12%", right: "18%" }}
      />
      {/* stelle */}
      {[
        [10, 15],
        [18, 30],
        [8, 48],
        [22, 60],
        [14, 75],
        [25, 88],
      ].map(([t, l], i) => (
        <span
          key={i}
          className="absolute h-[2px] w-[2px] bg-sand shadow-[0_0_2px_var(--color-sand)]"
          style={{ top: `${t}%`, left: `${l}%` }}
        />
      ))}
      {/* laguna */}
      <div className="absolute inset-x-0 top-[40%] h-[25%] bg-laguna" />
      <div className="absolute inset-x-0 bottom-[30%] h-[10%] bg-bg-water" />
      {/* fondamenta */}
      <div className="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-b from-stone-mid to-stone-dark shadow-[inset_0_4px_0_var(--color-stone-light)]" />
      {/* briccole */}
      <div
        className="absolute bg-gradient-to-b from-stone-light to-stone-dark"
        style={{ left: "15%", bottom: "32%", width: 6, height: 70 }}
      />
      <div
        className="absolute bg-gradient-to-b from-stone-light to-stone-dark"
        style={{ left: "80%", bottom: "32%", width: 6, height: 80 }}
      />
      {/* lanterna */}
      <div
        className="absolute bg-stone-dark shadow-[0_0_30px_rgba(240,192,32,0.5)]"
        style={{ top: "38%", left: "65%", width: 14, height: 22 }}
      >
        <div
          className="absolute inset-1 bg-verb-yellow shadow-[0_0_12px_var(--color-verb-yellow)]"
          style={{ animation: "pulse-scumm 2s infinite" }}
        />
      </div>
    </div>
  );
}
