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

export type EasterEgg = {
  /** ID stabile salvato in localStorage (es. "cristo-soglia"). */
  id: string;
  /** Area tappabile invisibile, coordinate in % rispetto alla scena. */
  hitbox: { top: number; left: number; width: number; height: number };
  /** Toast mostrato al tap (breve, pixel). */
  toast: string;
};

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
  /** Testo "L'ARCHIVISTA TRASMETTE" mostrato sopra il player. */
  archivistaIntro?: string;
  /** Trascrizione del frammento mostrata persistente sotto l'audio. */
  traduzione?: string;
  /** Nota tra parentesi quadre dell'Archivista (corsivo blu). */
  archivistaNota?: string;
  /** Blocco "Dove cercare" con istruzioni di luogo. */
  doveCercare?: string;
  /** Suggerimento per la prossima missione (mostrato in transizione). */
  nextHint?: string;
  /** Hint progressivi mostrati su errori ripetuti. */
  hints?: readonly string[];
  /** Easter egg opzionale (sprite tappabile). */
  easterEgg?: EasterEgg;
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
    fragment: "◆₁",
    // Hash SHA-256 di risposte normalizzate (normalizeAnchorAnswer).
    // La normalizzazione applica: lowercase, trim, no accenti, no
    // punteggiatura, strip articolo iniziale, strip sostantivo finale
    // (statua/figura). Le forme qui sotto sono quindi *post-normalizzazione*
    // dello spec originario (cristo, cristo benedicente, cristo redentore,
    // redentore, gesu, gesu cristo, cristo risorto).
    acceptedHashes: [
      "fddd32057e20bdf35b55f766f50addc2c9683af0176425a7db62ed2b6d0ce79d",
      "af5304d8ef1587f9350a127c858ba52cd922c29c91a52866bb25b4c090750b47",
      "1fea3f88ebde6f9f25bea1e3d1326ff3c1ba215ea7995e7fe3012de6f0c79f71",
      "a1abbaed98d7cf85c8339c4461be0bfffbb1d6e809536b262477f1df6311bb8c",
      "f20f4b86162324ee88ffbe32416add1311747b1924a01ae3a068624cb0c0824e",
      "84e24684992c1cdd8ee58c482d4216eb5db60ba347ff37235232450317c3a2e3",
      "510cd116cfb34c88f8ea4efb5c7693256704d17b39c5ee11d854b5339af6a7d0",
    ],
    href: "/ancora/1",
    // Placeholder finché non arriva l'MP3 reale (vedi contenuti/ancora_1).
    audioMain: "/audio/main/ancora_1.wav",
    scene: "/images/scenes/ancora_1.webp",
    archivistaIntro:
      "Trasmetto il primo frammento del manoscritto. La voce è quella di Fra Celestino da Torcello, registrata — per quanto è dato sapere — sotto le fondamenta della città. Ascoltate con attenzione.",
    traduzione:
      '"Ragazzi miei, sono Fra Celestino. La prima ancora è qui, sulla soglia. Alzate gli occhi alla chiesa bianca: una sola figura sta in cima a tutto, con il braccio alzato verso il cielo. La risposta, ragazzi, la troverete nel Cristo. Guardate bene — tu che sai."',
    archivistaNota:
      'Nota dell\'Archivista: l\'espressione "nel Cristo" è una formula devozionale piuttosto comune nel veneziano antico. Non vedo cosa ci sia da ridere.',
    doveCercare:
      "La prima grande chiesa bianca che incontrate uscendo dalla stazione, affacciata sul Canal Grande. Guardate in alto, oltre il frontone, fin dove la pietra incontra il cielo.",
    hints: [
      "Non contate le statue — sono molte, e il frate parla di UNA sola. Quella più in alto, isolata contro il cielo, sopra il triangolo.",
      "Ha il braccio destro alzato in un gesto di benedizione. È una figura sacra, la più importante di tutta la facciata. Chi domina sempre, dall'alto, una chiesa cristiana?",
      "Pensa a chi 'giudica' nella tradizione cristiana, chi sta sopra ogni cosa. Il suo nome basta.",
    ],
    nextHint: "Là dove la città comincia a contare i suoi pozzi.",
    easterEgg: {
      id: "cristo-soglia",
      // Cristo in cima al frontone. La scena usa object-cover quindi
      // l'immagine viene croppata in altezza su mobile: tenere il box
      // un po' largo per coprire le variazioni di viewport e garantire
      // un tap target ≥ 44x44px.
      hitbox: { top: 2, left: 51, width: 12, height: 18 },
      toast: "★ INDIZIO TROVATO ★",
    },
  },
  {
    id: 2,
    slug: "san-giacomo-orio",
    location: "San Giacomo dell'Orio",
    theme: "L'origine, i pozzi — e ciò che è stato cancellato",
    fragment: "◆₂",
    // Forme post-normalizzazione: leone, leon, leone di san marco,
    // leon de san marco, leone marciano, leon marciano, san marco.
    // (Le varianti con articolo "il leone" collassano già su "leone".)
    acceptedHashes: [
      "6dcf3e832f437961fa133fa47279e074014433e8118bab8feb9cd9696a2190d1",
      "1534cf2af76ecd84b803010b700287c00446599c68e8d81befa9c569f03e64dd",
      "60df64fded0d811495f3c65f84b06a45c9fa6bcb660e30d95b3b0fe5e393c10b",
      "25cbcde704e6dc2ddbb6b3550d9ad945b2a690e5b823fdbb7fee4b9bc59cfac5",
      "bbc248adc638b6877f1e7ad8fbec4961831d0e3b7f0a221a61a215a87f0db151",
      "dcc0f343c26a993ae0188f4e08d6ed50754f11309ebd9b49fb945327f5940d1e",
      "b800d1dfcf33bd7f649aa87ed231a6fa7c1f6b8ecb4cde414bf6049c270a457d",
    ],
    href: "/ancora/2",
    audioMain: "/audio/main/ancora_2.mp3",
    scene: "/images/scenes/ancora_2.webp",
    archivistaIntro:
      "Secondo frammento. Fra Celestino ci conduce alle origini idriche della città — un tema, devo ammettere, di reale interesse storico. Il frate sembra però in vena di divagazioni personali. Traduco fedelmente, come d'obbligo.",
    traduzione:
      '"Ragazzi miei, siamo nel campo dove Venezia beveva — prima di tutto, prima degli acquedotti, qui si attingeva l\'acqua piovana dai pozzi. Guardate bene le vere: su una era scolpito il segno della Serenissima... ma qualcuno l\'ha portato via. (Indovinate voi chi è stato — gente che parla col naso.) Resta solo il cerchio vuoto. Cosa manca? Chi è sparito dalla pietra? Tu che sai — tu che qui ci sei stato..."',
    archivistaNota:
      "Nota dell'Archivista: il frate accenna a \"gente che parla col naso\" e si rivolge al Lettore Eletto con inattesa familiarità, come se conoscesse di persona chi ascolta. Formule retoriche, suppongo. Suppongo.",
    doveCercare:
      "Uno dei campi più antichi della città, raccolto attorno a un alto campanile in mattoni. Cercate le vere da pozzo in pietra: una di esse porta una ferita — un tondo svuotato, dove un tempo viveva un simbolo.",
    hints: [
      "Non contate le vere — cercate quella ferita. Una sola porta un cerchio vuoto nella pietra, dove un tempo c'era un'incisione.",
      "Il segno cancellato era l'emblema della Repubblica di Venezia. Lo trovate ovunque in città: alato, con un libro tra le zampe. Che animale è?",
      "Pensa a cosa fu cancellato da TUTTA Venezia quando cadde la Repubblica. L'animale simbolo di San Marco. Il nome basta.",
    ],
    nextHint:
      "Fra Celestino già si volta verso l'acqua. Dice qualcosa sulle maree, sulle Zattere dove il legname scendeva dai monti — e sul primo spritz della giornata, a quanto pare. Verso le ZATTERE.",
    easterEgg: {
      id: "lion-sconduo",
      // Tondo scalpellato sulla vera da pozzo, in basso a destra nella scena.
      hitbox: { top: 63, left: 57, width: 14, height: 17 },
      toast: "★ INDIZIO TROVATO ★",
    },
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
