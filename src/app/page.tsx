"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BootSequence from "@/components/home/BootSequence";
import TitleScreen from "@/components/home/TitleScreen";

type Beat = "boot" | "title" | "exit";

const BOOT_SEEN_KEY = "bootSeen";
const PRELOAD_ASSETS = [
  "/images/title_lagoon.webp",
  "/images/sprite_gondola.webp",
  "/images/sprite_lantern.webp",
];

/**
 * Home `/` — orchestratore tre beat: boot → title → exit (CRT collapse).
 * Spec: docs/home_flow.md
 */
export default function Home() {
  const router = useRouter();
  const [beat, setBeat] = useState<Beat>("boot");
  const [bootMode, setBootMode] = useState<"full" | "fast">("full");

  useEffect(() => {
    // Preload asset durante il boot
    PRELOAD_ASSETS.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });

    // prefers-reduced-motion → skippa il boot
    let prefersReduced = false;
    try {
      prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
    } catch {
      // ignore
    }

    if (prefersReduced) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBeat("title");
      return;
    }

    try {
      const seen = window.localStorage.getItem(BOOT_SEEN_KEY);
      setBootMode(seen === "1" ? "fast" : "full");
    } catch {
      // default già "full"
    }
  }, []);

  const handleBootDone = () => {
    try {
      window.localStorage.setItem(BOOT_SEEN_KEY, "1");
    } catch {
      // ignore
    }
    setBeat("title");
  };

  const handleStart = () => {
    setBeat("exit");
    // CRT collapse 400ms → naviga
    window.setTimeout(() => {
      router.push("/ancora/1");
    }, 400);
  };

  return (
    <main className={beat === "exit" ? "anim-crt-collapse" : ""}>
      {beat === "boot" && (
        <BootSequence mode={bootMode} onDone={handleBootDone} />
      )}
      {(beat === "title" || beat === "exit") && (
        <TitleScreen onStart={handleStart} />
      )}
    </main>
  );
}
