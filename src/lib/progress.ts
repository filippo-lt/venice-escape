// Gestione del progresso della main quest e degli easter egg.
// Lo stato vive in localStorage — niente backend, niente account.
//
// La chiave è versionata: se cambiamo lo shape, bumpiamo la versione e
// resettiamo silenziosamente i progressi vecchi (è un gioco one-shot).

const STORAGE_KEY = "venice-escape-progress";
const STORAGE_VERSION = 1;

export type Progress = {
  version: number;
  /** ID delle ancore sbloccate (1-7). Inizia con [1]. */
  unlockedAnchors: number[];
  /** Frammento svelato per ciascuna ancora (la parola/numero che compare). */
  fragments: Record<number, string>;
  /** ID degli easter egg trovati durante la main quest. */
  easterEggsFound: string[];
  /** Foto caricate per il diario (post-evento). */
  photosUploaded: string[];
  /** Main quest completata? */
  completedMainQuest: boolean;
  startedAt: number;
  completedAt?: number;
};

export function initialProgress(): Progress {
  return {
    version: STORAGE_VERSION,
    unlockedAnchors: [1],
    fragments: {},
    easterEggsFound: [],
    photosUploaded: [],
    completedMainQuest: false,
    startedAt: Date.now(),
  };
}

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

/** Legge il progresso da localStorage, o restituisce uno stato iniziale. */
export function loadProgress(): Progress {
  if (!isBrowser()) return initialProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialProgress();
    const parsed = JSON.parse(raw) as Partial<Progress>;
    if (parsed?.version !== STORAGE_VERSION) return initialProgress();
    return { ...initialProgress(), ...parsed } as Progress;
  } catch {
    return initialProgress();
  }
}

export function saveProgress(p: Progress): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

export function resetProgress(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Sblocca l'ancora `id` e registra il frammento risolto per quella
 * precedente. Idempotente.
 */
export function unlockAnchor(
  p: Progress,
  id: number,
  fragmentForPrevious?: { anchorId: number; fragment: string },
): Progress {
  const next: Progress = {
    ...p,
    unlockedAnchors: p.unlockedAnchors.includes(id)
      ? p.unlockedAnchors
      : [...p.unlockedAnchors, id].sort((a, b) => a - b),
    fragments: fragmentForPrevious
      ? { ...p.fragments, [fragmentForPrevious.anchorId]: fragmentForPrevious.fragment }
      : p.fragments,
  };
  return next;
}

/**
 * Registra il frammento svelato per l'ancora `id`. Idempotente: se è già
 * presente, restituisce lo stesso oggetto. Usato dalla pagina di transizione.
 */
export function addFragment(p: Progress, id: number, letter: string): Progress {
  if (p.fragments[id] === letter) return p;
  return { ...p, fragments: { ...p.fragments, [id]: letter } };
}

export function addEasterEgg(p: Progress, eggId: string): Progress {
  if (p.easterEggsFound.includes(eggId)) return p;
  return { ...p, easterEggsFound: [...p.easterEggsFound, eggId] };
}

export function completeMainQuest(p: Progress): Progress {
  if (p.completedMainQuest) return p;
  return { ...p, completedMainQuest: true, completedAt: Date.now() };
}

/** L'utente può accedere alla pagina di un'ancora? */
export function canAccessAnchor(p: Progress, anchorId: number): boolean {
  return p.unlockedAnchors.includes(anchorId);
}

/** Numero dell'ultima ancora sbloccata (per il redirect di fallback). */
export function highestUnlocked(p: Progress): number {
  return p.unlockedAnchors.length === 0
    ? 1
    : Math.max(...p.unlockedAnchors);
}
