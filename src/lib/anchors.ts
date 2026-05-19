// Definizione delle 7 ancore della main quest.
//
// IMPORTANTE: in questo file NON devono mai comparire le risposte in chiaro.
// Per ogni ancora teniamo gli SHA-256 delle varianti accettate (lowercase,
// senza accenti, senza punteggiatura — vedi normalizeAnswer in crypto.ts).
//
// Per generare gli hash di test:
//   await hashAnswer("MAREA")
// e incollare il risultato in `acceptedHashes`.
//
// Il `fragment` è la parola/numero che compare al giocatore quando risolve
// l'enigma. Può anche stare qui in chiaro: non è la risposta, è la ricompensa.

export type Anchor = {
  id: number;
  /** Slug del luogo, per URL e analytics interne. */
  slug: string;
  /** Nome del luogo per UI (header della scena). */
  location: string;
  /** Tema narrativo (vedi 01_lore_bible.md). */
  theme: string;
  /** Frammento svelato dopo la risoluzione. Mostrato in /transizione. */
  fragment: string;
  /** Hash SHA-256 delle varianti accettate (risposta normalizzata). */
  acceptedHashes: readonly string[];
  /** Path della pagina ancora (utility). */
  href: string;
  /** Path agli asset (placeholder finché non arrivano). */
  audioMain: string;
  scene: string;
  /** Suggerimento per la prossima missione (mostrato in transizione). */
  nextHint?: string;
};

// TODO: sostituire gli hash con quelli reali quando le risposte definitive
// arrivano dal Claude Project. Per ora sono stub e la verifica fallirà:
// in dev possiamo bypassare via Game Master (?gm=skip).
export const ANCHORS: readonly Anchor[] = [
  {
    id: 1,
    slug: "stazione",
    location: "Stazione / Scalzi",
    theme: "La soglia, l'ingresso",
    fragment: "TODO",
    acceptedHashes: [],
    href: "/ancora/1",
    audioMain: "/audio/main/01.mp3",
    scene: "/images/scenes/01.webp",
    nextHint: "Là dove la città comincia a contare i suoi pozzi.",
  },
  {
    id: 2,
    slug: "santa-croce",
    location: "Santa Croce",
    theme: "L'origine, i pozzi",
    fragment: "TODO",
    acceptedHashes: [],
    href: "/ancora/2",
    audioMain: "/audio/main/02.mp3",
    scene: "/images/scenes/02.webp",
    nextHint: "Verso l'acqua larga, dove la Zueca guarda la città.",
  },
  {
    id: 3,
    slug: "zattere",
    location: "Zattere",
    theme: "L'acqua, la marea",
    fragment: "MAREA",
    acceptedHashes: [], // TODO: hash di "marea" e varianti
    href: "/ancora/3",
    audioMain: "/audio/main/03.mp3",
    scene: "/images/scenes/03.webp",
    nextHint:
      "Là dove il legno regge ciò che la pietra non poté. Cercate il quarto segno prima che il sole tocchi i tetti.",
  },
  {
    id: 4,
    slug: "accademia",
    location: "Ponte dell'Accademia",
    theme: "L'impermanenza, ciò che regge",
    fragment: "TODO",
    acceptedHashes: [],
    href: "/ancora/4",
    audioMain: "/audio/main/04.mp3",
    scene: "/images/scenes/04.webp",
    nextHint: "Verso il rumore del mercato, dove i numeri si fanno carne.",
  },
  {
    id: 5,
    slug: "rialto",
    location: "Rialto",
    theme: "Il mercato, il numero",
    fragment: "TODO",
    acceptedHashes: [],
    href: "/ancora/5",
    audioMain: "/audio/main/05.mp3",
    scene: "/images/scenes/05.webp",
    nextHint: "Dove la città fu spaccata in due per far passare i piedi.",
  },
  {
    id: 6,
    slug: "strada-nuova",
    location: "Strada Nuova",
    theme: "Ciò che è stato distrutto",
    fragment: "TODO",
    acceptedHashes: [],
    href: "/ancora/6",
    audioMain: "/audio/main/06.mp3",
    scene: "/images/scenes/06.webp",
    nextHint: "Verso la fondamenta che guarda Murano: lo sguardo all'origine.",
  },
  {
    id: 7,
    slug: "misericordia",
    location: "Fondamenta della Misericordia",
    theme: "Lo sguardo verso le origini",
    fragment: "TODO",
    acceptedHashes: [],
    href: "/ancora/7",
    audioMain: "/audio/main/07.mp3",
    scene: "/images/scenes/07.webp",
  },
] as const;

export function getAnchor(id: number): Anchor | undefined {
  return ANCHORS.find((a) => a.id === id);
}

export const TOTAL_ANCHORS = ANCHORS.length;
