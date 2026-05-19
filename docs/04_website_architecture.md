# 04 — Architettura del Sito Web

Documento di riferimento per la struttura tecnica e di design del sito web che ospita l'esperienza.

---

## Filosofia: due livelli, una sola esperienza

Il sito web ospita **due esperienze sovrapposte** che condividono lo stesso universo narrativo ma servono momenti e bisogni diversi:

```
                  ESPERIENZA SU DUE LIVELLI
                  ━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────┐    ┌─────────────────────────────┐
│   MAIN QUEST                │    │   MANOSCRITTO (side)        │
│   in calle, in giro         │    │   a casa, dopo              │
├─────────────────────────────┤    ├─────────────────────────────┤
│                             │    │                             │
│  Velocità > profondità      │    │  Profondità > velocità      │
│                             │    │                             │
│  Un tap, un audio breve,    │    │  Manoscritto completo,      │
│  un enigma, una risposta    │    │  lore espansa, ricordi      │
│                             │    │                             │
│  Mobile, una mano,          │    │  Desktop o tablet,          │
│  schermo al sole            │    │  divano, vino, calma        │
│                             │    │                             │
│  ~3-5 min per ancora        │    │  Quanto vuoi                │
│                             │    │                             │
│  ESSENZIALE                 │    │  OPZIONALE MA RICCO         │
└─────────────────────────────┘    └─────────────────────────────┘
          │                                      │
          └──────────────┬───────────────────────┘
                         ▼
                  Stesso sito, due modi
                  di entrarci
```

---

## Strategia di rilascio in due fasi

```
FASE 1 — PRIMA DELLA GIORNATA
  Obiettivo: main quest pronta, testata, deployata

  ├─ 7 ancore con audio brevi (15-25 sec)
  ├─ Pagine compatte, mobile-first
  ├─ UI semplificata: 1 tap, 1 audio, 1 input
  ├─ NESSUN side content visibile
  └─ Easter egg di side content NASCOSTI nel codice
     (tappabili o triggerabili durante il gioco
      ma non spiegati esplicitamente)

FASE 2 — DOPO LA GIORNATA (1-4 settimane)
  Obiettivo: regalo finale, hub del manoscritto

  ├─ Manoscritto integrale (testo, miniature)
  ├─ Audio extended cut (registrati con calma)
  ├─ Diario fotografico (foto del giorno)
  ├─ Easter egg risolti, side quest rivelate
  ├─ Inside joke, dediche personali
  └─ Email/messaggio allo sposo:
     "Ehi, ho aggiornato il sito. Dai un'occhiata..."
```

Il sito è **lo stesso URL** in entrambe le fasi. Cambia solo cosa è visibile/accessibile.

---

## Stack tecnico

```
FRAMEWORK     │ Next.js 15 (App Router)
              │
STYLING       │ Tailwind CSS + font custom:
              │ - Press Start 2P (titoli pixel)
              │ - VT323 (corpo, dialoghi)
              │ Stack font dual per il side content:
              │ - Caveat o Homemade Apple (note "manuale")
              │ - EB Garamond (testi lunghi del manoscritto)
              │
AUDIO         │ <audio> HTML nativo con UI custom in React
              │ File MP3 statici in /public/audio/
              │ Due cartelle:
              │ - /audio/main/    (versioni brevi 15-25 sec)
              │ - /audio/extended/ (versioni lunghe 60-180 sec)
              │
IMMAGINI      │ Statiche .webp in /public/images/
              │ - Sprite e scene pixel art per main quest
              │ - Illustrazioni "manuale" per side content
              │
STATO         │ localStorage per:
              │ - Progresso main quest (ancore sbloccate)
              │ - Easter egg trovati (per side quest)
              │ - Foto del gruppo (URL upload)
              │
LOGICA        │ Verifica risposte client-side
              │ Risposte hashate (SHA-256)
              │ Gating su capitoli side content
              │
DEPLOY        │ Vercel (push su GitHub → live)
              │
DOMINIO       │ Suggerimenti:
              │ - le-sette-ancore.com
              │ - manoscritto-celestino.it
```

---

## Mappa delle route

```
/                            Boot screen → "Press Start"
                             Main quest entry point

MAIN QUEST (Fase 1)
/ancora/1 ... /ancora/7      Schermate gioco SCUMM-style
/transizione/1 ... /6        Frammento svelato + prossimo luogo
/finale                      Rivelazione cena
/mappa                       Mappa minimale, accessibile sempre

MANOSCRITTO (Fase 2 — sbloccato dopo)
/manoscritto                 Hub centrale del side content
/manoscritto/capitolo/[1-7]  Manoscritto integrale per ancora
/manoscritto/bestiario       Personaggi (Fra Celestino, l'Archivista, Fra Bortolo, ecc)
/manoscritto/glossario       Veneziano-italiano completo
/manoscritto/diario          Foto del giorno + ricordi
/manoscritto/segreti         Easter egg risolti, ottava ancora
/manoscritto/extra           Audio extended cut, behind the scenes

ADMIN / GAME MASTER
/soluzioni                   (URL segreto) tutte le risposte
/reset                       Reset progresso per test
```

---

## UI principale durante il gioco — semplificata per la calle

Vincoli reali dell'uso in mobilità:

```
- Schermo al sole, riflessi
- Una mano impegnata con spritz
- Mano libera = pollice solo
- Distrazioni: rumore, passanti, foto
- Connessione 4G intermittente
- Vaporetto in transito = rumore
- Diverse persone guardano lo stesso schermo
```

Conseguenze sul design:

```
✓ TAP TARGET grandi (min 44x44px)
✓ Una sola azione primaria per schermata
✓ Audio in alto, sempre visibile, sempre rigiocabile
✓ Testo breve — preview testuale max 2-3 righe
✓ Pulsante INVIO grande, in basso, raggiungibile col pollice
✓ Contrasto altissimo (l'estetica SCUMM aiuta — palette satura, font pixel net)
✓ Nessuna informazione decorativa visibile di default
✓ Hint progressivi attivabili solo se richiesti
```

**Verbi SCUMM**: nella mockup sono per atmosfera. Nella main quest reale **non sono cliccabili** (sono decorativi, fanno solo "vibe"). L'unica interazione è il command input in basso + il play audio.

---

## Schema di una pagina-ancora (versione mobile-first ottimizzata)

```
┌────────────────────────────────────────┐
│ ▼ SCENE 03 — ZATTERE BY NIGHT          │  ← scene bar
├────────────────────────────────────────┤
│                                        │
│        [SCENA PIXEL ART]               │  ← scena, max 220px
│        ridotta per mobile              │
│                                        │
├────────────────────────────────────────┤
│ FRA CELESTINO:                         │
│ "Ah, le Zattere! ..."                  │  ← dialog, max 3 righe
│                                    ▼   │
├────────────────────────────────────────┤
│ ▶ VOICE [══════════] 0:12/0:22         │  ← audio, breve
├────────────────────────────────────────┤
│ [I][II][?][?][?][?][?]                 │  ← inventario, sempre visibile
├────────────────────────────────────────┤
│                                        │
│  > [______________________] [INVIO]    │  ← input, grande
│                                        │
└────────────────────────────────────────┘
```

Verbi SCUMM e dettagli scenografici **non compaiono** nella versione mobile in-game. Compaiono solo nella versione "vetrina" del manoscritto (post-game), come citazione estetica.

---

## Side Quest — meccanica degli indizi opzionali

Durante la main quest ci sono **3-4 indizi opzionali** sparsi negli audio o nelle scene. Se il gruppo non li nota, la main quest funziona perfettamente. Se qualcuno li nota, si accumulano e sbloccano contenuti speciali nel manoscritto.

### Come funzionano (lato tecnico)

```
1. Fra Celestino dice qualcosa di "sospetto" nell'audio
   ("se uno de vu xe attento, vedrà...")

2. Sulla pagina-ancora compare un piccolo elemento
   tappabile, NON evidenziato:
   - una briccola con 3 tacche nella scena
   - un dettaglio dello sprite (la bottiglia)
   - una parola sottolineata nel dialogo

3. Se nessuno tappa: nulla accade. Si va avanti.

4. Se qualcuno tappa: micro-feedback visivo
   ("EUREKA!" o "★ INDIZIO TROVATO ★" in pixel)
   + localStorage segna l'indizio raccolto.

5. Al termine della main quest, in /finale,
   si conta quanti indizi sono stati trovati.

6. Se ≥ N indizi trovati, si sblocca
   /manoscritto/segreti con contenuti extra.
```

### Tipologie di indizi possibili

```
TIPO              ESEMPIO                          DOVE NASCONDERLO
─────             ──────                            ────────────────
DIALOGO           "se ti varda ben, fra le         Parola sottolineata
                   pietre, gh'è un nome"            nel testo del dialogo

SCENA             "i tre tacche sulla bricola"     Elemento cliccabile
                                                    nella scena pixel art

INVENTARIO        "el vin xe pì importante         Slot inventario cliccabile
                   de quel che pensè"               (la bottiglia)

VERBO             "no doperè el verbo giusto"     Verbo SCUMM specifico
                                                    cliccabile (eccezione!)

NUMERICO          "conta i lions, fioi"           Conteggio nella scena

EXTERNAL          "varda la luna stanote"          Reazione a un dettaglio
                                                    della realtà (vera!)
```

### Trigger esterni della realtà

Bonus: alcuni indizi possono essere triggerati da cose **reali** che il gruppo vede a Venezia. Fra Celestino dice una frase enigmatica → il gruppo deve trovare un dettaglio nella città vera → tap su un elemento del sito per "registrare" la scoperta.

Esempio: *"in sti caleti se nasconde un omo de pietra che varda in alto"* → il gruppo cerca, trova una statua o un bassorilievo → tap su un'icona "L'HO VISTO" → indizio registrato.

---

## Design system del side content (Fase 2)

Il manoscritto post-game cita **altre estetiche 90s** oltre allo SCUMM:

```
ESTETICA              QUANDO USARLA
─────────              ──────────────
Manuale di gioco       Pagine introduttive del manoscritto
illustrato             Bestiario dei personaggi
(stile Lucasarts)      Glossario

Fanzine fotocopiata    Diario del gruppo
                       Inside joke

Schermate "behind      Sezione extra / making of
the scenes"

Pagine di diario       Manoscritto integrale per capitolo
scritto a mano         (testo lungo di Fra Celestino)

Cartolina d'epoca      Foto del gruppo
veneziana              Ricordi della giornata
```

### Palette aggiuntiva per side content

Mantiene la base ocra/seppia ma aggiunge:

```
CARTA INGIALLITA    │ #f4e4b8  (pagine manoscritto)
ACQUERELLO BLU      │ #6b8aa0  (note marginali)
INCHIOSTRO VIOLA    │ #4a3050  (dediche, lettere d'amore)
NASTRO ROSSO        │ #c42424  (decorazioni manuale)
```

### Componenti specifici del side content

```
1. PAGINA-MANOSCRITTO
   Layout a doppia colonna stile manuale anni 90:
   - Testo principale (italiano dell'Archivista)
   - Colonna laterale con note, illustrazioni, glossario
   - Capolettera illuminato in pixel art
   - Macchie di vino, scarabocchi a margine

2. SCHEDA PERSONAGGIO
   Stile manuale di gioco:
   - Ritratto pixel art grande
   - Statistiche fittizie ("Resistenza al vino: 99/100")
   - Bio narrativa
   - Citazioni famose
   - "Dove si trova nel gioco"

3. POLAROID
   Per le foto del gruppo:
   - Cornice bianca, ombra
   - Caption scritta a mano (font Caveat)
   - Data e luogo
   - Rotazione leggera asimmetrica

4. EASTER EGG CARD
   Per gli indizi rivelati:
   - Look "carta rivelata" (effetto flip)
   - Numero progressivo
   - Hint originale + spiegazione
   - Eventuale collegamento ad altre side quest

5. INSIDE JOKE BOX
   Per dediche e ricordi del gruppo:
   - Background tipo "post-it"
   - Foto + testo personalizzato
   - Eventuale audio bonus
```

---

## Performance e affidabilità (immutate)

### Vincoli reali (main quest in calle)

```
- Connessione 4G/5G in calle: instabile
- Vaporetto in transito: rumore importante
- Schermo all'aperto: brillantezza ridotta
- Mani impegnate con spritz: tap area generose
- Diverse fasce d'età: leggibilità prioritaria
```

### Ottimizzazioni necessarie

```
✓ Preloading: audio della pagina attuale + immagini della successiva
✓ Service Worker: cache aggressiva, funziona offline dopo prima visita
✓ Immagini: webp + lazy loading
✓ Audio main quest: MP3 a 96 kbps, max 300KB per traccia (più brevi!)
✓ Audio extended cut: separati, caricati solo nel side content
✓ Bundle JS: <100KB totali
✓ First Paint: <1 secondo su 4G
✓ Test mobile: iOS Safari + Android Chrome obbligatori
```

### Backup strategy

```
1. Service Worker che cacha tutto offline dopo la home
2. Game Master ha tutti i contenuti come fallback
3. URL /soluzioni nascosto per il Game Master
4. Test integrale a Milano prima della partenza
5. Modalità "skip ancora" attivabile dal Game Master se bloccati
```

---

## Logica di unlock — aggiornata

```typescript
type Progress = {
  // Main quest
  unlockedAnchors: number[]
  fragments: Record<number, string>

  // Side quest
  easterEggsFound: string[]    // ["bricola-3-tacche", "vin-importante", ...]
  photosUploaded: string[]      // (post-game)

  // Meta
  completedMainQuest: boolean
  startedAt: number
  completedAt?: number
}

// Sblocco del side content
function canAccessManuscript(progress: Progress): boolean {
  // Il manoscritto si sblocca solo dopo aver completato la main quest
  // O quando il sito viene aggiornato manualmente in Fase 2
  return progress.completedMainQuest || SIDE_CONTENT_RELEASED
}

function canAccessSegreti(progress: Progress): boolean {
  // I segreti si sbloccano solo se trovati abbastanza easter egg
  const MIN_EASTER_EGGS = 3
  return progress.easterEggsFound.length >= MIN_EASTER_EGGS
}
```

---

## Roadmap aggiornata

```
SETTIMANA 1 │ Setup tecnico + Main Quest base
            │ - Next.js + Tailwind + deploy
            │ - Design system SCUMM
            │ - Pagina ancora (1 prototipo funzionante)
            │ - Logica unlock + localStorage
            │
SETTIMANA 2 │ Contenuti Main Quest
            │ - Generazione sprite Fra Celestino
            │ - 7 scene pixel art
            │ - 7+1 audio brevi (intro + ancore)
            │ - Post-produzione audio
            │ - Easter egg nascosti inseriti
            │
SETTIMANA 3 │ Tutte le pagine Main Quest
            │ - Home boot screen
            │ - 7 ancore complete
            │ - 6 transizioni
            │ - Finale animato
            │ - Mappa minimale
            │
SETTIMANA 4 │ Test e rifinitura Main Quest
            │ - Test mobile
            │ - Test offline
            │ - Test percorso reale a Venezia
            │ - Aggiustamenti
            │ - GIORNATA EVENTO
            │
═══════════════════════════════════════════════
                  EVENTO
═══════════════════════════════════════════════
            │
SETTIMANA 5+│ Side Content (Fase 2)
            │ - Manoscritto integrale (7 capitoli)
            │ - Audio extended cut
            │ - Bestiario personaggi
            │ - Glossario veneziano
            │ - Diario foto del gruppo
            │ - Easter egg rivelati
            │ - Inside joke + dediche
            │ - Rilascio progressivo
            │ - Annuncio finale allo sposo
```

---

## Effort stimato (rivisto)

```
FASE 1 — Main Quest pronta per la giornata
─────────────────────────────────────────
- Setup + design system:        8h
- Componenti SCUMM:             6h
- Pagine ancora:                10h
- Audio + post-prod (brevi):    6h
- Sprite + scene:               8h
- Test e rifinitura:            6h
TOTALE FASE 1:                  ~44h (~6 settimane di sere)

FASE 2 — Manoscritto post-game
──────────────────────────────
- Hub manoscritto + design:     6h
- Capitoli integrali (7):       12h (richiede scrittura)
- Audio extended cut + prod:    10h
- Bestiario + glossario:        6h
- Diario foto + upload UI:      4h
- Easter egg risolti:           4h
- Personalizzazioni gruppo:     variable (tu fornisci materiale)
TOTALE FASE 2:                  ~42h (rilasciabile gradualmente)
```

Il vantaggio: la Fase 2 può essere costruita **dopo** l'evento, con calma, integrando foto reali e ricordi del giorno. Non c'è pressione di averla pronta in anticipo.
