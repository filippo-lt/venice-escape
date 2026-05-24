"use client";

import { useEffect, useRef, useState } from "react";

const AUDIO_KEY = "audioOn";
const AMBIENT_SRC = "/audio/ambient/ambient_lagoon.mp3";
const TARGET_VOL = 0.3;
const FADE_MS = 1000;

/**
 * Pulsante speaker top-right. Toggle ambient laguna.
 * Default: muto. Persistenza in localStorage.audioOn.
 * Se il file ambient non è disponibile, il toggle non rompe la pagina.
 */
export default function AmbientToggle() {
  const [on, setOn] = useState(false);
  const [available, setAvailable] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIdRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(AUDIO_KEY);
      if (stored === "1") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setOn(true);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (fadeIdRef.current) {
      window.clearInterval(fadeIdRef.current);
      fadeIdRef.current = null;
    }

    if (on) {
      audio.volume = 0;
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          // autoplay bloccato / file mancante: nascondi UI
          setAvailable(false);
          setOn(false);
        });
      }
      const start = performance.now();
      const tick = () => {
        const t = Math.min(1, (performance.now() - start) / FADE_MS);
        audio.volume = TARGET_VOL * t;
        if (t < 1) {
          fadeIdRef.current = window.requestAnimationFrame(tick);
        } else {
          fadeIdRef.current = null;
        }
      };
      fadeIdRef.current = window.requestAnimationFrame(tick);
    } else {
      audio.pause();
      audio.currentTime = 0;
    }

    return () => {
      if (fadeIdRef.current) {
        window.cancelAnimationFrame(fadeIdRef.current);
        fadeIdRef.current = null;
      }
    };
  }, [on]);

  const toggle = () => {
    setOn((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(AUDIO_KEY, next ? "1" : "0");
      } catch {
        // ignore
      }
      return next;
    });
  };

  if (!available) {
    return <audio ref={audioRef} src={AMBIENT_SRC} loop preload="none" aria-hidden />;
  }

  return (
    <>
      <audio ref={audioRef} src={AMBIENT_SRC} loop preload="none" aria-hidden />
      <button
        type="button"
        onClick={toggle}
        aria-label={on ? "Disattiva audio ambient" : "Attiva audio ambient"}
        aria-pressed={on}
        className="absolute right-3 top-3 z-30 flex h-11 w-11 items-center justify-center border-2 border-ocra bg-bg-deep/70 text-verb-yellow shadow-[0_0_8px_rgba(0,0,0,0.6)] hover:bg-bg-deep focus:outline-none focus:ring-2 focus:ring-verb-yellow"
      >
        <span aria-hidden className="font-pixel text-base">
          {on ? "♪" : "×"}
        </span>
      </button>
    </>
  );
}
