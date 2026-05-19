"use client";

import { useEffect, useRef, useState } from "react";

type AudioPlayerProps = {
  /** URL del file audio (MP3). */
  src: string;
  /** Etichetta mostrata accanto al play (es. "VOICE.WAV — Fra Celestino"). */
  label: string;
  /** Autoplay alla prima visita? (Nota: i browser lo bloccano comunque senza interazione.) */
  autoPlay?: boolean;
};

function format(t: number): string {
  if (!Number.isFinite(t)) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * Player retro stile SCUMM: bottone play grande giallo, label monospace,
 * waveform decorativo a barre verticali animate solo durante la riproduzione.
 *
 * Mobile-first: tap target ≥ 44x44px sul bottone primario.
 */
export function AudioPlayer({ src, label, autoPlay }: AudioPlayerProps) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const a = ref.current;
    if (!a) return;
    const onTime = () => setCurrent(a.currentTime);
    const onMeta = () => setDuration(a.duration);
    const onEnd = () => setPlaying(false);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("ended", onEnd);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("ended", onEnd);
    };
  }, []);

  const toggle = () => {
    const a = ref.current;
    if (!a) return;
    if (a.paused) {
      a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      a.pause();
      setPlaying(false);
    }
  };

  // 8 barre del waveform decorativo
  const bars = [30, 60, 90, 50, 75, 40, 85, 25];

  return (
    <div className="flex items-center gap-3 border-t border-stone-dark bg-bg-night px-4 py-3 font-mono">
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Metti in pausa" : "Riproduci"}
        aria-pressed={playing}
        className="flex h-11 w-11 shrink-0 items-center justify-center border-2 border-black bg-verb-yellow font-pixel text-[12px] text-black shadow-[2px_2px_0_var(--color-bg-deep)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
      >
        {playing ? "❚❚" : "▶"}
      </button>

      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-base text-ocra-light sm:text-lg">
          ► {label}
        </span>
        <span className="text-sm text-stone-light">
          {format(current)} / {format(duration)}
        </span>
      </div>

      <div
        className="flex h-5 items-end gap-[2px]"
        aria-hidden="true"
      >
        {bars.map((h, i) => (
          <span
            key={i}
            className="w-[3px] bg-verb-yellow"
            style={{
              height: `${h}%`,
              opacity: playing ? 1 : 0.35,
              transition: "opacity 0.15s",
              animation: playing
                ? `pulse-scumm ${0.6 + (i % 3) * 0.2}s ease-in-out infinite`
                : undefined,
            }}
          />
        ))}
      </div>

      <audio ref={ref} src={src} preload="metadata" autoPlay={autoPlay} />
    </div>
  );
}
