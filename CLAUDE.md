# CLAUDE.md — Venice Escape

Questo file viene letto automaticamente da Claude Code all'avvio. Contiene il contesto del progetto e le convenzioni di lavoro.

---

## Cos'è questo progetto

**Venice Escape** è un sito web per un'esperienza tipo escape room diffusa per le calli di Venezia, regalo di addio al celibato per uno sposo appassionato di videogiochi anni 90 e profondo conoscitore della città.

L'esperienza ha **due livelli**:
1. **Main Quest** (Fase 1): 7 enigmi lungo un percorso fisso, fruita in giro per Venezia il giorno dell'evento
2. **Manoscritto / Side Content** (Fase 2): contenuti estesi, audio lunghi, diario foto, easter egg risolti, rilasciato gradualmente dopo l'evento

Stile visivo: **estetica SCUMM/LucasArts anni 90** (Monkey Island + Indiana Jones Fate of Atlantis). Pixel art VGA, palette ocra/seppia, dialog box classico, inventario, font pixel.

---

## Documentazione di riferimento

**Leggi sempre i file in `docs/` prima di lavorare**. Sono il contratto di design:

| File | Cosa contiene |
|------|---------------|
| `docs/01_lore_bible.md` | Personaggi, mitologia, regole interne della storia |
| `docs/02_route_and_timing.md` | Percorso fisico a Venezia, tempi, logistica |
| `docs/03_voice_and_tone.md` | Registro linguistico, voci, estetica audio/visiva |
| `docs/04_website_architecture.md` | **CRITICO**: struttura tecnica completa del sito |
| `docs/05_side_content.md` | Manoscritto post-evento, easter egg, personalizzazioni |
| `docs/mood_scumm.html` | **Mockup visivo di riferimento** — palette esatta, componenti, layout |

> ⚠️ Quando in dubbio sull'estetica, **apri `docs/mood_scumm.html` e usa quello come ground truth**. È stato approvato esplicitamente dall'utente.

---

## Stack tecnico

```
Framework      Next.js 15 (App Router)
Styling        Tailwind CSS v4
Font           Press Start 2P (titoli) + VT323 (corpo)
               via Google Fonts
Audio          <audio> HTML nativo + UI custom
Stato          localStorage (no backend)
Sicurezza      SHA-256 hashing delle risposte (client-side)
Deploy         Vercel
Linguaggio     TypeScript strict
```

---

## Struttura del progetto

```
venice-escape/
├── CLAUDE.md                    ← questo file
├── README.md                    ← guida generale
├── docs/                        ← documentazione di design (NON modificare)
│   ├── 01_lore_bible.md
│   ├── 02_route_and_timing.md
│   ├── 03_voice_and_tone.md
│   ├── 04_website_architecture.md
│   ├── 05_side_content.md
│   └── mood_scumm.html
├── contenuti/                   ← output testuali dal Claude Project
│   ├── ancora-1/
│   ├── ancora-2/
│   └── ...
├── public/
│   ├── audio/
│   │   ├── main/                ← audio brevi (15-25 sec)
│   │   └── extended/            ← audio lunghi (60-180 sec, fase 2)
│   └── images/
│       ├── sprites/
│       └── scenes/
└── src/                         ← codice Next.js
    ├── app/
    │   ├── page.tsx             (boot screen)
    │   ├── ancora/[id]/page.tsx
    │   ├── transizione/[id]/page.tsx
    │   ├── finale/page.tsx
    │   └── manoscritto/         (fase 2)
    ├── components/
    │   ├── scumm/               (DialogBox, AudioPlayer, Inventory, ecc.)
    │   └── manuscript/          (componenti per il side content)
    └── lib/
        ├── progress.ts          (gestione localStorage)
        └── crypto.ts            (hashing risposte)
```

---

## Convenzioni di codice

### Linguaggio
- TypeScript strict mode
- Componenti React funzionali con hook
- Nessuna API esterna obbligatoria (tutto client-side)

### Styling
- Tailwind CSS utility-first
- Palette colori in `tailwind.config.ts` secondo `docs/04_website_architecture.md`
- Componenti SCUMM in `src/components/scumm/`
- Mai usare colori hex hardcoded — sempre custom properties Tailwind

### Performance
- **Mobile-first sempre**. Il sito viene usato in calle, con una mano, al sole
- Tap target minimo 44x44px
- Audio max 300KB per file main quest
- Immagini in webp con lazy loading
- Service Worker per offline (dopo prima visita)

### Naming
- File componenti: PascalCase (`DialogBox.tsx`)
- File utility/hook: kebab-case o camelCase (`use-progress.ts`)
- Cartelle: kebab-case
- Variabili Tailwind custom: kebab-case in italiano dove sensato (`bg-pergamena`)

### Accessibilità
- Tutti gli audio devono avere controlli accessibili (play/pause con label)
- Contrasto sufficiente per uso al sole (palette già pensata)
- Input grandi, etichette chiare

---

## Logica chiave: progresso e unlock

Vedi `docs/04_website_architecture.md` sezione "Logica di unlock".

In sintesi:

```typescript
type Progress = {
  unlockedAnchors: number[]
  fragments: Record<number, string>
  easterEggsFound: string[]
  photosUploaded: string[]
  completedMainQuest: boolean
  startedAt: number
  completedAt?: number
}
```

- Le risposte sono normalizzate (lowercase, trim, no accenti) e poi hashate con SHA-256
- Confronto degli hash, mai delle stringhe in chiaro nel sorgente
- Ogni ancora può avere multiple risposte valide (varianti accettabili)
- Il progresso vive in localStorage con chiave `venice-escape-progress`
- L'accesso a una `/ancora/[id]` richiede che `id <= max(unlockedAnchors)`
- Tentativo di accesso non autorizzato → redirect alla prima ancora bloccata

---

## Roadmap di lavoro

### Fase 1 — Pre-evento (urgente)

```
✦ Milestone 1: Infrastruttura
  □ Inizializza Next.js 15 + Tailwind v4
  □ Configura font Google
  □ Imposta palette colori e design system
  □ Setup deploy su Vercel
  □ Verifica HMR e build production

✦ Milestone 2: Componenti SCUMM
  □ <DialogBox /> con speaker + testo + cursor
  □ <AudioPlayer /> con waveform stilizzato
  □ <Inventory /> con 7 slot per i frammenti
  □ <VerbUI /> (decorativo, non interattivo)
  □ <SceneFrame /> per le scene pixel art
  □ <CommandBar /> per l'input risposta
  □ Tutti coerenti con docs/mood_scumm.html

✦ Milestone 3: Pagina prototipo
  □ /ancora/3 (Zattere) come prototipo completo
  □ Layout mobile-first
  □ Integra tutti i componenti
  □ Test su iPhone reale + Android reale
  □ Itera fino a convergenza

✦ Milestone 4: Replica e completa
  □ /ancora/[1-7] tutte funzionanti
  □ /transizione/[1-6] con animazioni di rivelazione
  □ / (boot screen) con sequenza di avvio
  □ /finale con composizione frammenti
  □ /mappa accessibile sempre

✦ Milestone 5: Logica
  □ Verifica risposte con SHA-256
  □ localStorage per progresso
  □ Gating delle ancore
  □ Easter egg con tracking separato

✦ Milestone 6: Polish
  □ Service Worker per offline
  □ Performance audit (Lighthouse mobile > 90)
  □ /soluzioni nascosta per Game Master
  □ /reset per test
  □ Test integrale a Venezia
```

### Fase 2 — Post-evento

```
✦ Manoscritto
  □ /manoscritto hub
  □ /manoscritto/capitolo/[1-7] integrali
  □ /manoscritto/bestiario schede personaggio
  □ /manoscritto/glossario veneziano
  □ /manoscritto/diario foto del gruppo
  □ /manoscritto/segreti easter egg risolti
  □ /manoscritto/extra behind the scenes
```

---

## Cosa NON fare

- ❌ Non aggiungere backend (Firebase, Supabase, ecc.) — tutto deve essere statico
- ❌ Non usare localStorage per dati sensibili (solo progresso del gioco)
- ❌ Non scrivere risposte degli enigmi in chiaro nel sorgente
- ❌ Non aggiungere librerie pesanti se non strettamente necessarie
- ❌ Non modificare i file in `docs/` senza chiedere conferma
- ❌ Non rompere mai la mobile-friendliness — è la primaria
- ❌ Non implementare animazioni che girano in continuo (battery drain)
- ❌ Non aggiungere tracking/analytics non richiesti

---

## Cosa fare sempre

- ✅ Leggere `docs/` prima di prendere decisioni di architettura
- ✅ Usare `docs/mood_scumm.html` come reference visivo
- ✅ Testare su mobile reale, non solo in DevTools
- ✅ Mantenere il sito funzionante anche offline (dopo prima visita)
- ✅ Commenti in italiano nel codice quando aiutano la comprensione
- ✅ Commit message descrittivi (it/en indifferente)
- ✅ Proporre alternative quando hai dubbi sull'approccio
- ✅ Chiedere conferma prima di cambiare lo stack tecnico

---

## Come gestire i contenuti

I contenuti **testuali** (script di Fra Celestino, testi dell'Archivista, indicazioni di luogo) vengono dal Claude Project separato. L'utente li deposita in `contenuti/ancora-N/`.

I contenuti **multimediali** (audio MP3, immagini WebP) vengono prodotti esternamente:
- **Audio**: ElevenLabs → post-prod Audacity → `public/audio/`
- **Immagini**: Midjourney/Flux → ottimizzate WebP → `public/images/`

Quando un contenuto manca, usa **placeholder** chiaramente identificati:
- Audio: file `placeholder.mp3` (silenzio di 20 sec)
- Immagini: `placeholder.webp` con scritta "ASSET DA GENERARE"
- Testi: lorem ipsum stile veneziano `"Mòneghi mii, ipsum lorem..."`

---

## Comando di avvio rapido

Quando lavoriamo insieme, il primo prompt utile in ogni sessione è:

```
Riprendiamo Venice Escape. Vai a vedere docs/ se serve,
poi dimmi lo stato attuale del progetto e cosa
suggerisci come prossimo step.
```

---

## Note finali

Questo è un regalo di addio al celibato. La qualità conta più della quantità di feature. Se devi tagliare, taglia il side content (è la Fase 2, c'è tempo). Mai tagliare l'esperienza in-calle: deve essere fluida, magica, memorabile.

Buon lavoro. 🦁
