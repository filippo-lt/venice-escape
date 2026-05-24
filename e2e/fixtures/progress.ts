// Helper per costruire un oggetto Progress e iniettarlo in localStorage
// via Playwright `addInitScript`, senza dipendere dai moduli applicativi.
//
// Lo shape è copiato da `src/lib/progress.ts`. Se cambia laggiù, ricordarsi
// di aggiornare anche qui (è documentato nel CLAUDE.md / progress.ts).

import type { Page } from "@playwright/test";

export const STORAGE_KEY = "venice-escape-progress";
export const STORAGE_VERSION = 1;

export type Progress = {
  version: number;
  unlockedAnchors: number[];
  fragments: Record<number, string>;
  easterEggsFound: string[];
  photosUploaded: string[];
  completedMainQuest: boolean;
  startedAt: number;
  completedAt?: number;
};

/** Frammenti canonici delle 7 ancore (V-E-N-E-Z-I-A). */
export const ANCHOR_FRAGMENTS: Record<number, string> = {
  1: "V",
  2: "E",
  3: "N",
  4: "E",
  5: "Z",
  6: "I",
  7: "A",
};

export type ProgressOverrides = Partial<Progress>;

export function makeProgress(overrides: ProgressOverrides = {}): Progress {
  return {
    version: STORAGE_VERSION,
    unlockedAnchors: [1],
    fragments: {},
    easterEggsFound: [],
    photosUploaded: [],
    completedMainQuest: false,
    startedAt: 0,
    ...overrides,
  };
}

/**
 * Progresso completo: tutte e 7 ancore sbloccate ma nessun frammento
 * collezionato (cioè la quest è "aperta" su tutti i nodi).
 */
export function makeFullyUnlocked(): Progress {
  return makeProgress({ unlockedAnchors: [1, 2, 3, 4, 5, 6, 7] });
}

/**
 * Progresso "mid-quest": le prime N ancore risolte (con frammenti),
 * la (N+1) sbloccata ma non ancora risolta.
 */
export function makeMidQuest(solvedCount: number): Progress {
  const unlocked: number[] = [];
  const fragments: Record<number, string> = {};
  for (let i = 1; i <= solvedCount; i++) {
    unlocked.push(i);
    fragments[i] = ANCHOR_FRAGMENTS[i]!;
  }
  if (solvedCount < 7) unlocked.push(solvedCount + 1);
  return makeProgress({ unlockedAnchors: unlocked, fragments });
}

/**
 * Inietta il progresso in localStorage prima di ogni navigazione.
 * Usa `addInitScript` così è disponibile anche al primo render.
 */
export async function seedProgress(
  page: Page,
  progress: Progress,
): Promise<void> {
  await page.addInitScript(
    ([key, value]) => {
      try {
        window.localStorage.setItem(key as string, value as string);
      } catch {
        // ignore (storage non disponibile)
      }
    },
    [STORAGE_KEY, JSON.stringify(progress)] as const,
  );
}

/** Skippa l'animazione di boot della home settando il flag `bootSeen`. */
export async function seedBootSeen(page: Page): Promise<void> {
  await page.addInitScript(() => {
    try {
      window.localStorage.setItem("bootSeen", "1");
    } catch {
      // ignore
    }
  });
}
