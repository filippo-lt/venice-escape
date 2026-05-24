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
  /** Riga di outro che Fra Celestino "sussurra" dopo l'enigma. */
  archivistaOutro?: string;
  /** Frase teaser per la prossima destinazione (1-2 righe, no spoiler). */
  nextTeaser?: string;
  /** Hint progressivi mostrati su errori ripetuti. */
  hints?: readonly string[];
  /** Easter egg opzionale (sprite tappabile). */
  easterEgg?: EasterEgg;
  /**
   * Opzioni di normalizzazione extra passate a `matchesAnchorHash`.
   * Es. ancora 6: `{ stripHours: true }` per accettare "24 ore" come "24".
   */
  normalize?: { stripHours?: boolean };
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
    fragment: "V",
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
    audioMain: "/audio/main/ancora_1.mp3",
    scene: "/images/ancora-1/ancora_1_scene.png",
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
    archivistaOutro:
      "Bravi, ragazzi miei. Il Cristo vi ha aperto la porta — la prima lettera è vostra. Ora seguite l'acqua che non si vede: quella che dorme sotto la pietra.",
    nextTeaser:
      "Un campo silenzioso, un campanile storto e cinque vere da pozzo che ricordano quando Venezia beveva il cielo.",
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
    fragment: "E",
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
    scene: "/images/ancora-2/ancora_2_scene.png",
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
    archivistaOutro:
      "Il leone c'era, anche se non lo vedete più. Anche un nome cancellato pesa, ragazzi — fidatevi di un frate. Adesso scendete verso l'acqua larga.",
    nextTeaser:
      "Dove il legname dei monti incontrava il sale, e la laguna respira due volte al giorno. Sentite la marea?",
    easterEgg: {
      id: "lion-sconduo",
      // Tondo scalpellato sulla vera da pozzo, in basso a destra nella scena.
      hitbox: { top: 63, left: 57, width: 14, height: 17 },
      toast: "★ INDIZIO TROVATO ★",
    },
  },
  {
    id: 3,
    slug: "santa-margherita",
    location: "Campo Santa Margherita",
    theme: "L'Incontro — il campo dove le vite si intrecciano",
    fragment: "N",
    // Forme post-normalizzazione (normalizeAnchorAnswer strip "la"/"il"):
    // santa margherita, margherita, santa margherita di antiochia,
    // margherita di antiochia, santa margarita.
    acceptedHashes: [
      "a5472fbd504e16900a25bf7ac76b429a4743e97cbc687c6e0438869581075894",
      "e6e45d8dad824b5c53b9252f439778e196963ec98de3376339e1484e68097330",
      "34aac9e77782bc26fdf93b55b682204b0595de86f6ddb2285d36760727158293",
      "e3129fae8e970910f5752f90e5353ac30db9ab5cd99d9d80360dad9f7853807b",
      "0c71b789165e8215f91c2cb358cfb06df342c7a5261a1f24eff4dca8256a52f3",
    ],
    href: "/ancora/3",
    audioMain: "/audio/main/ancora_3.mp3",
    scene: "/images/ancora-3/ancora_3_scene.png",
    archivistaIntro:
      "Terzo frammento. Il frate ci porta in uno dei campi più vivi della città e — devo segnalarlo — sembra di ottimo umore. Allude a frequentazioni giovanili che preferisco non commentare. Traduco la parte utile.",
    traduzione:
      '"Ah, ragazzi miei, questo campo! Qui io e Fra Bortolo venivamo a guardare le ragazze con il fresco della sera — lui lo chiamava \'studio dei moti celesti\', il furbo. Perbacco, ragazzi: in questo campo certi incontri ti cambiano una vita intera... ma non dico altro. Guardate bene: c\'è una lastra antica su una casa bassa in mezzo al campo. Una santa che esce viva dalla bestia. Chi è lei, sposo? Tu che sai — e tu che qui, beh, ci sei stato."',
    archivistaNota:
      "Nota dell'Archivista: il frate insinua qualcosa sul Lettore Eletto e questo campo, con la solita inopportuna familiarità. E parla di una santa \"che esce viva dalla bestia\": un'agiografia precisa, in effetti. Su quello, almeno, posso lavorare.",
    doveCercare:
      "Al centro del campo, isolata, c'è una piccola casa bassa che un tempo era la sede di un'antica corporazione di artigiani. Sulla sua parete, una lastra di pietra scolpita: la pietra è consumata e la figura è poco leggibile, ma si distingue ancora una creatura accanto a lei — un drago. Chi sconfigge il mostro dà il nome al campo intero.",
    hints: [
      "Non cercate tra le tante case: una sola, bassa e isolata al centro del campo, porta una lastra scolpita. La figura è consumata, ma la creatura/drago è ancora riconoscibile: è quello il dettaglio. Guardate la creatura accanto a lei.",
      "La figura è una santa. La creatura è un drago. La santa lo affronta e ne esce viva. È la stessa santa che dà il nome a TUTTO il campo in cui vi trovate.",
      "Il nome del campo. Quello che leggi sulle insegne. Quella santa lì. Il nome basta.",
    ],
    nextHint:
      "Là dove il legname dai monti incontrava il sale, e la laguna respira due volte al giorno. Verso le ZATTERE.",
    archivistaOutro:
      "Santa Margherita — la santa che entrò nella bestia e ne uscì viva e intera. In questo campo, ragazzi, le cose cominciano. Qualcuno qui lo sa meglio degli altri.",
    nextTeaser:
      "Dove il legname dei monti incontrava il sale, e la laguna respira due volte al giorno. Sentite la marea?",
    easterEgg: {
      id: "drago-margherita",
      // Drago scolpito sulla lastra dei Varoteri, casa bassa al centro
      // del campo. Tap target generoso per coprire variazioni di crop.
      hitbox: { top: 55, left: 44, width: 14, height: 17 },
      toast: "★ INDIZIO TROVATO ★",
    },
  },
  {
    id: 4,
    slug: "zattere",
    location: "Zattere",
    theme: "L'acqua, la marea — la via segnata nella laguna",
    fragment: "E",
    // Forme post-normalizzazione: briccola, bricola, briccole, bricole,
    // palo, pali, briccola da ormeggio, palina.
    acceptedHashes: [
      "4c896a85dd03cc4577cfb4cacc8ed2f716c7306c0fc8c98033ef388d8776795a",
      "767c97f97f8111b0b86cc5c0fd43c695edd2e8a7fd98278fbdf765bda4260602",
      "49c1f38cc03b2380a1aaee821c8085aa8820bedfdc4f2a5c756672f72709b875",
      "f22d619526002606863fdc15ee9699270267f269a87bdcebf7674c2f1b0a529b",
      "20a4611836d9648a53789efa3d70565eedee2991e9227dcbc95c750ca602a0be",
      "487b01bf06caa17d32fb5b6e0f4c8e337bf3df7fffcbcce460dc44c2cff50fd6",
      "cf101785e2efa6e9f6bc0a4deb3867921b6d133de142ed16c005d8530c2cc24a",
      "3de94a89e0612b596fc4f2bfde1dd0fe2a19e9d389bbec0086e9da2db25a3211",
    ],
    href: "/ancora/4",
    audioMain: "/audio/main/ancora_4.mp3",
    scene: "/images/ancora-4/ancora_4_scene.png",
    archivistaIntro:
      "Quarto frammento. Fra Celestino è giunto alle Zattere e — devo segnalarlo nuovamente — pare essersi concesso un secondo ristoro. Alcune espressioni risultano difficili da rendere in italiano contemporaneo. Faccio del mio meglio.",
    traduzione:
      '"Ah, le Zattere, ragazzi! Tenete stretto il bicchiere, che questo è il secondo. Io e Fra Bortolo, questi pomeriggi, li chiamavamo \'osservazione astronomica\'... e già vedevamo due lune. Ma adesso guardate l\'acqua: vedete quei pali piantati nella laguna? Non sono lì per caso. Quelli segnano la strada giusta quando la marea sale — chi non li conosce, si arena. Come si chiamano, questi guardiani di legno? Tu che sai, dimmelo tu."',
    archivistaNota:
      "Nota dell'Archivista: il frate parla di una \"osservazione astronomica\" in compagnia del confratello Fra Bortolo che pare consistesse, soprattutto, nel vedere doppio. Le fonti monastiche non confermano alcuna attività astronomica congiunta. Sorvolo.",
    doveCercare:
      "Non cercate a terra: guardate l'acqua. Davanti a voi, piantati nel fondo della laguna lungo il canale, ci sono pali di legno scuro, spesso legati a gruppi. Sono lì da secoli, a indicare la rotta. Hanno un nome veneziano preciso.",
    hints: [
      "Non è qualcosa sulla riva. È nell'acqua. Pali di legno, scuri, consumati dalla marea, spesso legati insieme a piccoli gruppi.",
      "Servono a segnare dove le barche possono passare senza arenarsi. Sono il 'cartello stradale' della laguna. Hanno un nome veneziano specifico.",
      "Mirco, è la parola che ogni veneziano conosce per quei pali da ormeggio e segnalazione. Inizia per B. Il nome basta.",
    ],
    nextHint:
      "Cambiate sponda. Dove il legno dura più della pietra, e il provvisorio è diventato eterno. Verso il PONTE DELL'ACCADEMIA.",
    archivistaOutro:
      "Le briccole — i guardiani di legno della laguna. Segnano la rotta a chi sa leggerla, e ingoiano chi non la rispetta. Quattro frammenti su sette: il manoscritto ora vi riconosce come naviganti.",
    nextTeaser:
      "Un ponte che doveva durare una stagione e regge ancora. Sotto i piedi non c'è pietra: c'è legno.",
    easterEgg: {
      id: "briccola-tre-tacche",
      // Briccola in primo piano nella scena, con tre tacche orizzontali
      // incise sul legno.
      hitbox: { top: 55, left: 22, width: 12, height: 24 },
      toast: "★ INDIZIO TROVATO ★",
    },
  },
  {
    id: 5,
    slug: "accademia",
    location: "Ponte dell'Accademia",
    theme: "Il Passaggio — l'impermanenza, ciò che regge",
    fragment: "Z",
    // Forme post-normalizzazione: legno, di legno, de legno, ponte di
    // legno, ponte de legno, legname, ponte di legno provvisorio.
    // (Articolo "il legno" collassa su "legno".)
    acceptedHashes: [
      "58f766b5a4642c95e9e02d2cc8c0461ccb6c108e4fcf525c6c08ef7c85162df6",
      "64862f4b6ab23c9c4bd565a97149c8a55dcaeea9361abd34a8807224c0632023",
      "35a225fee3524640e83cbbecf075b23787daaedb3b6abd0f90677dbb13c5f8d4",
      "d3d00977300e62aa143d497567426b2a224e2092742a66f096257f1fa67277b9",
      "938a70fe0618626d18c2ef70353bca405b1f885738b1a5b0aafe5b683c169491",
      "d1cec2e55503bb24de271ff25ea84763277f9ad282e5834b2ccc39d01b4b0b2c",
      "846bb7964001aab5b7dcdd722ffb9a34ff3e8c62413b0ceb8ed1655f4e6de26e",
    ],
    href: "/ancora/5",
    audioMain: "/audio/main/ancora_5.mp3",
    scene: "/images/ancora-5/ancora_5_scene.png",
    archivistaIntro:
      "Quinto frammento. Vi conduce sul ponte e — lo confesso — non so più se trasmetto un astronomo o un filosofo da osteria. Divaga sulla pazienza e sulle cose che \"non hanno fretta di cadere\". Mi rassegno e traduco la parte che conta.",
    traduzione:
      '"Ragazzi, fermatevi qui, in mezzo al ponte. Sotto di voi non c\'è pietra: c\'è legno. Questo ponte era nato per durare una stagione, e guardalo, il mona — è ancora qui, che non ha mai avuto fretta di cadere. Ehi: a Venezia regge quello che sembra non possa reggere. Ditemi di cosa è fatto, sposo — la cosa umile che ha superato il ferro e la pietra. Tu che sai."',
    archivistaNota:
      "Nota dell'Archivista: il frate insiste sul fatto che certe cose \"non hanno fretta di cadere\", come se fosse una virtù. Suppongo intenda qualcosa sulla durevolezza. La parte verificabile, almeno, è chiara: chiede di che materiale è fatto il ponte.",
    doveCercare:
      "Non guardate lontano: guardate sotto i vostri piedi e le vostre mani. Quattro ponti attraversano il Canal Grande, e questo è l'unico che non è fatto di pietra né di ferro. Toccate il parapetto. Quello di cui è fatto — quello che doveva essere provvisorio e non se n'è più andato — è la risposta.",
    hints: [
      "Non è una figura, non è un nome scolpito. È la materia stessa del ponte. Toccatela.",
      "Gli altri ponti del Canal Grande sono di pietra (o, uno, di ferro). Questo no. Di cosa è fatto ciò su cui state camminando?",
      "Il ponte 'provvisorio' del '33, quello che non hanno mai sostituito. La materia umile che ha tenuto. Una parola: il materiale.",
    ],
    nextHint:
      "Verso il cuore mercantile, dove anche le ore si contano per intero. Verso RIALTO.",
    archivistaOutro:
      "Legno. La cosa più umile, e l'unica che ha tenuto. Quattro ponti, e questo — il provvisorio, quello nato per un giorno — è ancora in piedi. A Venezia, ragazzi, regge ciò che non ha fretta. Ricordatevelo.",
    nextTeaser:
      "Là dove Venezia si pesava in monete e ore intere. L'orologio della chiesa più antica non conta a metà.",
    easterEgg: {
      id: "doga-tarch",
      // Doga del corrimano con un nodo nel legno, lato Dorsoduro,
      // sul parapetto in primo piano.
      hitbox: { top: 62, left: 10, width: 14, height: 14 },
      toast: "★ INDIZIO TROVATO ★",
    },
  },
  {
    id: 6,
    slug: "rialto",
    location: "Rialto",
    theme: "Il Cuore — il mercato, il numero",
    fragment: "I",
    // Forme post-normalizzazione (con stripHours): 24, ventiquattro,
    // ventiquattrore, ore 24. Con normalize.stripHours abilitato qui
    // sotto, anche "24 ore" e "ventiquattro ore" collassano e matchano.
    acceptedHashes: [
      "c2356069e9d1e79ca924378153cfbbfb4d4416b1f99d41a2940bfdb66c5319db",
      "5037ed7ebbf1d640595569dbd19d970551ffe76142b1deda6907f1271fea2c4c",
      "c1f151b1ae304091a55dfda48b2afbad1d852e53a57ad140c083024882a00610",
      "1b42205eaf67023a1c575f08eff44cbb806d62e1647b39c4e8a710f744f5a9f4",
    ],
    normalize: { stripHours: true },
    href: "/ancora/6",
    audioMain: "/audio/main/ancora_6.mp3",
    scene: "/images/ancora-6/ancora_6_scene.png",
    archivistaIntro:
      "Sesto frammento. Vi avevo avvertiti: il passaggio è particolarmente colorito. Il frate è al suo secondo... ristoro della giornata, e si sente. Traduco la parte utile e sorvolo, per quanto possibile, sul resto.",
    traduzione:
      '"Eh, ragazzi miei — siamo arrivati al cuore: Rialto! Qui si pesa, si conta, si baratta ogni cosa di questo mondo. Guardate l\'orologio sulla chiesa più antica di Venezia: questo matto non conta a metà come gli altri, lui va fino in fondo, tutto il giorno intero. Quante ore ci sono in un giorno veneziano, sposo? Tu che sai. Eh, perbacco, l\'orologio è sempre ubriaco come me — versatemi un\'ombra, su, che ho la gola secca."',
    archivistaNota:
      "Nota dell'Archivista: il frate paragona un orologio pubblico al proprio stato. Mi limito a registrare un dato: l'orologio della chiesa di San Giacomo è effettivamente noto, da secoli, per la sua inaffidabilità. Su questo, almeno, non posso smentirlo.",
    doveCercare:
      "Nel campo dietro il ponte, dove i bàcari versano l'ombra e i banchi un tempo pesavano l'oro. C'è una piccola chiesa — dicono la più antica della città. Alzate gli occhi alla sua facciata: porta un grande orologio. Guardatelo bene. Non conta come gli altri.",
    hints: [
      "Non contate i bàcari né le arcate del ponte. Alzate lo sguardo: sulla facciata della chiesetta più antica c'è un grande orologio. È lì.",
      "Quell'orologio non è normale: ha una sola lancetta e non si ferma a 12. Seguite i numeri fino in fondo. Quante ore segna, in tutto?",
      "Il modo veneziano di contare le ore. La giornata intera, da un tramonto all'altro, in un giro solo. Il numero. Solo il numero.",
    ],
    nextHint:
      "A nord, attraverso Cannaregio, lontano dal rumore. Dove i bàcari versano l'ombra fino a sera. Verso la FONDAMENTA DELLA MISERICORDIA.",
    archivistaOutro:
      "Ventiquattro. A Rialto perfino il tempo si conta per intero: il giorno veneziano non si spezza a metà come altrove. Nel cuore del mercato, dove ogni cosa ha un numero e un peso, anche le ore sono merce — e si contano tutte.",
    nextTeaser:
      "Una fondamenta tranquilla, lontana dal chiasso. Tra i bàcari, una vecchia osteria porta scritto il nome di un paradiso perduto.",
    easterEgg: {
      id: "ora-ciuca",
      // Orologio a 24 ore sulla facciata di San Giacometto.
      hitbox: { top: 18, left: 42, width: 16, height: 18 },
      toast: "★ INDIZIO TROVATO ★",
    },
  },
  {
    id: 7,
    slug: "misericordia",
    location: "Fondamenta della Misericordia",
    theme: "La Rivelazione — il paradiso ritrovato",
    fragment: "A",
    // Forme post-normalizzazione: paradiso, paradiso perduto,
    // paradiso perduo, el paradiso perduo, el paradiso perduto.
    // ("el" non è coperto dal regex articoli → hash distinti.)
    acceptedHashes: [
      "114f26a1d2265a436f6ef3d6f9abb01f00b9f7e182b2c36eea7252e52aa0cac7",
      "57979e057fdece0e4baffeead1ca7c143fa53204704342440aee4130b65bd630",
      "c2daa64adb8e0b53fc6add2273729851341fd3b180b926af287c46c32d34616a",
      "1eeddf0abbb228e447d5f61bd6084f6e4b4eac70ee52c05d5a46c4defd979783",
      "0332ae19380a5cc9ddc4a7113733cc7a81036b62eed856be765f84e60f519c80",
    ],
    href: "/ancora/7",
    audioMain: "/audio/main/ancora_7.mp3",
    scene: "/images/ancora-7/ancora_7_scene.png",
    archivistaIntro:
      "L'ultimo frammento. Il frate ha smesso di scherzare: la voce gli si è fatta diversa. Lo traduco parola per parola, perché stavolta — credo — conta tutto.",
    traduzione:
      '"Ragazzi miei… siamo all\'ultima. Ma stavolta non vi mando in una chiesa. Guardate questa fondamenta: qui, tra i bàcari, c\'è una vecchia osteria che io e Bortolo chiamavamo il nostro paradiso — e che paradiso, ragazzi! Adesso, per me, è perduto. Ma per voi… no. Trovatela: porta scritto proprio il nome di ciò che ho perduto. Guardate bene l\'insegna, sposo — tu che sai."',
    archivistaNota:
      "Nota dell'Archivista: il frate parla di un luogo reale, su questa stessa fondamenta. Non aggiungo altro: per una volta, le sue parole non hanno bisogno di me.",
    doveCercare:
      "Lungo la fondamenta, là dove i bàcari versano l'ombra fino a sera. Cercate una vecchia osteria con un'insegna inconfondibile: porta il nome di un paradiso che si è perso. Leggetela bene — dice più di quel che sembra.",
    hints: [
      "Stavolta non è una chiesa né un monumento. Guardate i bàcari della fondamenta: a uno di loro il frate è molto affezionato. Leggetene i nomi.",
      "Il frate lo chiama 'il nostro paradiso', e dice che ora è perduto. C'è un'osteria che si chiama esattamente così. Il nome è la risposta.",
      "Lo storico bàcaro della Misericordia, quello con l'insegna 'vietato ormeggiare'. Il Paradiso Perduto. Scrivete solo: paradiso.",
    ],
    easterEgg: {
      id: "vietato-ormeggiare",
      // Targhetta "VIETATO ORMEGGIARE" + briccola, sul bordo acqua
      // in primo piano nella scena.
      hitbox: { top: 70, left: 8, width: 16, height: 18 },
      toast: "★ INDIZIO TROVATO ★",
    },
  },
] as const;

export function getAnchor(id: number): Anchor | undefined {
  return ANCHORS.find((a) => a.id === id);
}

export const TOTAL_ANCHORS = ANCHORS.length;
