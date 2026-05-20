"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AudioPlayer,
  CommandBar,
  Inventory,
  SceneFrame,
} from "@/components/scumm";
import type { Anchor } from "@/lib/anchors";
import { matchesAnchorHash } from "@/lib/crypto";
import {
  addEasterEgg,
  loadProgress,
  saveProgress,
  unlockAnchor,
  type Progress,
} from "@/lib/progress";

type Status = "idle" | "wrong" | "loading" | "ok";

export function AnchorPage({ anchor }: { anchor: Anchor }) {
  const router = useRouter();
  const [progress, setProgress] = useState<Progress | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const onSubmit = async (value: string) => {
    setStatus("loading");
    const ok = await matchesAnchorHash(value, anchor.acceptedHashes);
    if (!ok) {
      setErrors((n) => n + 1);
      setStatus("wrong");
      return;
    }
    if (progress) {
      const next = unlockAnchor(progress, anchor.id + 1, {
        anchorId: anchor.id,
        fragment: anchor.fragment,
      });
      saveProgress(next);
    }
    setStatus("ok");
    router.push(`/transizione/${anchor.id}`);
  };

  const onEasterEggTap = () => {
    if (!anchor.easterEgg) return;
    setToast(anchor.easterEgg.toast);
    window.setTimeout(() => setToast(null), 1600);
    if (progress) {
      const next = addEasterEgg(progress, anchor.easterEgg.id);
      saveProgress(next);
      setProgress(next);
    }
  };

  const visibleHints =
    anchor.hints?.slice(0, Math.min(Math.floor(errors / 2), anchor.hints.length)) ?? [];

  const sceneLabel = `SCENE ${String(anchor.id).padStart(2, "0")} — ${anchor.location.toUpperCase()}`;

  return (
    <main className="min-h-dvh bg-bg-deep pb-8 text-white-text">
      <SceneFrame
        label={sceneLabel}
        quest={`QUEST: TROVA IL FRAMMENTO ${anchor.id}`}
        src={anchor.scene}
        alt={`Scena: ${anchor.location}`}
      >
        {anchor.easterEgg && (
          <button
            type="button"
            onClick={onEasterEggTap}
            aria-label="indizio nascosto"
            className="absolute cursor-default appearance-none border-0 bg-transparent p-0"
            style={{
              top: `${anchor.easterEgg.hitbox.top}%`,
              left: `${anchor.easterEgg.hitbox.left}%`,
              width: `${anchor.easterEgg.hitbox.width}%`,
              height: `${anchor.easterEgg.hitbox.height}%`,
            }}
          />
        )}
        {toast && (
          <div className="pointer-events-none absolute inset-x-2 top-2 animate-pulse border-2 border-ocra bg-black/90 px-3 py-2 text-center font-pixel text-[10px] tracking-widest text-verb-yellow">
            {toast}
          </div>
        )}
      </SceneFrame>

      <section className="px-4 pt-5">
        <Block title="L'ARCHIVISTA TRASMETTE">{anchor.archivistaIntro}</Block>
      </section>

      <section className="mt-4">
        <AudioPlayer
          src={anchor.audioMain}
          label={`VOICE.WAV — Fra Celestino · Ancora ${anchor.id}`}
        />
      </section>

      <section className="px-4 pt-5">
        <Block title="TRADUZIONE DEL FRAMMENTO">
          <p className="whitespace-pre-line">{anchor.traduzione}</p>
          {anchor.archivistaNota && (
            <p
              className="mt-3 italic"
              style={{ color: "#6b8aa0" }}
            >
              [{anchor.archivistaNota}]
            </p>
          )}
        </Block>

        {anchor.doveCercare && (
          <Block title="📍 DOVE CERCARE" tone="sand">
            {anchor.doveCercare}
          </Block>
        )}

        {visibleHints.length > 0 && (
          <Block title="FRA CELESTINO BORBOTTA…" tone="hint">
            <ul className="space-y-3">
              {visibleHints.map((h, i) => (
                <li key={i} className="border-l-2 border-ocra pl-3">
                  {h}
                </li>
              ))}
            </ul>
          </Block>
        )}
      </section>

      <section className="mt-5">
        <p className="px-4 pb-2 font-pixel text-[9px] tracking-widest text-ocra-light">
          LA RISPOSTA AL FRAMMENTO:
        </p>
        <CommandBar
          onSubmit={onSubmit}
          status={status === "ok" ? "loading" : status}
          placeholder="digita la parola del frammento..."
        />
        {status === "wrong" && (
          <p className="px-4 pt-2 font-mono text-lg text-blood-bright">
            Fra Celestino scuote la testa…
          </p>
        )}
      </section>

      <section className="px-4 pt-6">
        <Inventory fragments={progress?.fragments ?? {}} />
      </section>
    </main>
  );
}

type BlockProps = {
  title: string;
  tone?: "default" | "sand" | "hint";
  children: React.ReactNode;
};

function Block({ title, tone = "default", children }: BlockProps) {
  const toneCls =
    tone === "sand"
      ? "border-ocra bg-stone-dark/60"
      : tone === "hint"
        ? "border-blood bg-stone-dark/40"
        : "border-stone-dark bg-black/40";
  return (
    <div className={`mt-3 border-2 ${toneCls} p-3`}>
      <p className="mb-2 font-pixel text-[9px] tracking-widest text-ocra-light">
        {title}
      </p>
      <div className="font-mono text-lg leading-snug">{children}</div>
    </div>
  );
}
