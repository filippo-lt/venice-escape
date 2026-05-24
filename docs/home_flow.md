# Home Flow — Boot → Title Screen → Press Start

> **Build spec self-contained** per l'implementazione della home `/`.
> Documento di handoff per Claude Code. I prompt per generare gli asset
> grafici/audio sono in un file separato (`home_assets_prompts.md`): qui
> si assume che gli asset esistano già ai path indicati.
> Filosofia trasversale → file di knowledge `01`–`05`
> (voce di Fra Celestino → `03`; stack/font/palette/budget → `04`).

---

## ⚠ Istruzioni per Claude Code (leggere prima)

1. Questa pagina sostituisce l'attuale `/` (`app/page.tsx`).
2. **Mobile-first**, estetica SCUMM (Monkey Island 2 / Indy Fate of Atlantis).
   Font già nello stack: **Press Start 2P** (titoli), **VT323** (corpo/boot).
   Palette: usare i design token già presenti (`bg-deep`, `bg-night`,
   `bg-water`, `stone-*`, `ocra*`, `sand`, `paper`, `blood`, `verb-yellow`).
3. **RIMUOVERE dalla home il blocco di debug "DESIGN TOKENS — M1 CHECK"**
   (lista token a schermo). Era un check di milestone, non va in produzione.
4. **Budget — due metriche DISTINTE (non confonderle):**
   • Bundle JS < 100KB + First Paint < 1s su 4G (vincolo file 04, invariato).
     Le animazioni sono CSS puro → JS resta vicino a zero, vincolo rispettato.
   • Peso ASSET home (immagini + audio) < 200KB; load 5-10s tollerato perché
     coperto dal boot (vedi istr. 5). Questo NON intacca il bundle JS.
   Nessuna libreria di animazione, nessun JS di animazione (sarebbe peso morto
   sul bundle).
5. **Il boot copre il caricamento.** Lo sfondo title (`title_lagoon.webp`) e
   gli sprite si caricano DURANTE il Beat 1. Quando il boot finisce, devono
   essere pronti. Preload esplicito all'avvio. Il load diventa finzione.
   Inoltre: **registrare gli asset home nel Service Worker** (cache aggressiva,
   file 04). Alla seconda visita gli asset arrivano dalla cache → il load
   5-10s sparisce del tutto. Si combina con `bootSeen` (istr. 8).
6. Rispettare `prefers-reduced-motion` (vedi §5).
7. **Skip del boot:** un tap/click/keydown qualsiasi durante il Beat 1 salta
   subito al Beat 2. Il boot non è mai bloccante.
8. **Persistenza:** se `localStorage.bootSeen === "1"`, mostrare un boot
   ultra-rapido (~0.8s) → title. Il boot completo si vede una volta sola.
   Settare `bootSeen = "1"` alla fine del Beat 1.
9. **Audio:** presente ma **NON in autoplay** (vedi §4-audio). Default muto.

---

## Meta

| Campo | Valore |
|-------|--------|
| Route | `/` (`app/page.tsx`) |
| Sostituisce | Home attuale (boot statico + titolo + bottone + debug token) |
| CTA finale | `PRESS START TO BEGIN` → naviga a `/ancora/1` |
| Fasi | 3 beat: Boot animato → Title screen vivo → Press Start |
| Tecnica | CSS puro per le animazioni; asset = 1 sfondo + 2 sprite + 1 audio |
| Budget | < 200KB, load 5-10s tollerato |
| Stato | da implementare |

---

## Mappa del flusso

```
BEAT 1                 BEAT 2                       BEAT 3
BOOT ANIMATO     →     TITLE SCREEN (idle loop)  →  PRESS START
~3.5 sec               resta finché non premi       transizione → /ancora/1
(typewriter +          scena viva + titolo +        CRT power-off → fade
 glitch + cursore)     acqua animata + idle quote
   │                       │                            │
   └── tap = skip ─────────┘                            │
   └── prefers-reduced-motion: salta a Beat 2 ──────────┘
   └── bootSeen=1: boot rapido 0.8s
   └── (durante Beat 1: preload sfondo + sprite)
```

---

## Asset attesi (path)

> Generati a parte. Qui si assume esistano già.

```
/public/images/title_lagoon.webp     sfondo title (statico, ~150KB)
/public/images/sprite_gondola.webp   gondola che attraversa (anim. CSS)
/public/images/sprite_lantern.webp   lanterna su bricola (flicker CSS)
/public/audio/ambient/ambient_lagoon.mp3   loop ambient laguna (armato, non autoplay)
  ↑ NB: cartella /ambient/ separata. Le cartelle /audio/main/ e /audio/extended/
    (file 04) sono per gli enigmi e gli extended cut — l'ambient home è un terzo tipo.
```

---

## BEAT 1 — Boot animato

L'attuale boot è testo statico. Va animato come un caricamento da floppy
SCUMM. **Le righe compaiono in sequenza**, una alla volta, effetto macchina
da scrivere, cursore `█` lampeggiante in coda. Durante questo beat, **preload
degli asset** del title (vedi istruzione 5).

### Righe (in ordine, con timing)

```
[t=0.0s]  SCUMM v5.1.42 — Loading...
[t=0.5s]  Reading manuscript from disk A:\
[t=1.0s]  Checking memory... 640K OK
[t=1.6s]  WARNING: file corrupted — anno 1297      ← GLITCH (vedi sotto)
[t=2.3s]  Recovering data from monastery_torcello.dat
[t=2.8s]  . . .                                     ← puntini in dissolvenza
[t=3.2s]  OK — ready to play █                      ← cursore lampeggia
[t=3.5s]  → fade out boot, fade in Title (Beat 2)
```

### Effetti CSS (specifiche)

- **Typewriter per riga:** reveal con `steps()` (clip su `width`) o
  carattere-per-carattere via `animation-delay`. Mono = **VT323**, colore
  `verb-yellow` su `bg-deep`.
- **Cursore `█`:** `@keyframes blink { 50% { opacity: 0 } }`, ~1s.
- **Riga "WARNING... 1297" = glitch:** scuotimento orizzontale breve +
  aberrazione cromatica fake (text-shadow rosso/ciano sfalsato ±2px) per
  ~250ms; colore vira a `blood`. Unico momento "rotto": sottolinea il
  manoscritto corrotto/riemerso (lore, file 01).
- **Scanline CRT + vignetta:** attive qui e per tutto il flusso.
- **Skip:** listener `click`/`touchstart`/`keydown` → Beat 2.

```
┌───────────────────────────────────┐
│ SCUMM v5.1.42 — Loading...        │
│ Reading manuscript from disk A:\  │
│ Checking memory... 640K OK        │
│ W̷A̷R̷N̷I̷N̷G̷: file corrupted — 1297  │ ← glitch rosso, shake
│ Recovering monastery_torcello.dat │
│ . . .                             │
│ OK — ready to play █              │ ← cursore blink
│                                   │
│        (tap to skip)              │ ← piccolo, in basso, opacità 0.4
└───────────────────────────────────┘
```

---

## BEAT 2 — Title screen vivo (il cuore)

Non un fondale piatto: una **scena pixel art con micro-animazioni in loop**,
come la title di Monkey Island. Prima promessa estetica del gioco.

### Composizione (layer, dal fondo)

```
LAYER 0  title_lagoon.webp           sfondo statico (laguna, luna, bricole)
LAYER 1  gradiente "marea" CSS       sale/scende lento — LA PROFEZIA
LAYER 2  riflesso luna CSS           gradiente ocra che ondeggia (skewX)
LAYER 3  sprite_gondola.webp         translateX lentissimo, loop
LAYER 4  sprite_lantern.webp         flicker opacità + glow caldo
LAYER 5  scanline CRT + vignetta     statiche (o scroll lentissimo)
LAYER 6  TESTO: titolo + PRESS START + idle quote
```

```
┌─────────────────────────────────────────┐
│        LE SETTE ÀNCORE                   │  ← Press Start 2P, glow ocra
│        DELLA SERENISSIMA                 │     che "respira"
│        ~ a SCUMM adventure ~             │  ← VT323, piccolo, sand
│   ╭──────────────────────────────────╮  │
│   │   [laguna · luna · bricole]      │  │
│   │       ⛵ gondola che scorre →     │  │
│   │ ~~~~~~~~ ACQUA ANIMATA ~~~~~~~~~  │  │  ← marea sale/scende
│   ╰──────────────────────────────────╯  │
│        ▶ PRESS START TO BEGIN ◀          │  ← blink ~1.2s
│   "Sète àncore. Un novizo..."            │  ← idle quote (dopo 5s fermi)
└─────────────────────────────────────────┘
```

### Animazioni (CSS puro, loop infinito, lente)

| Elemento | Animazione | Timing |
|----------|-----------|--------|
| **Acqua/marea** (L1) | `translateY` + opacity gradiente sovrapposto | ~6-8s |
| **Riflesso luna** (L2) | `skewX` lieve / gradiente che scorre | ~7s |
| **Gondola** (L3) | `translateX` da fuori a fuori schermo | ~25s |
| **Lanterna** (L4) | flicker opacità irregolare + glow | ~2s irregolare |
| **Titolo** (L6) | `text-shadow` ocra pulsante | ~4s |
| **PRESS START** (L6) | blink opacità | ~1.2s |

> Regola: animazioni **lente e in loop**. Niente deve distrarre dal
> `PRESS START`. Il movimento dice "questo mondo è vivo", non fa spettacolo.

### Idle quote di Fra Celestino (tocco LucasArts)

Dopo **5 secondi** di inattività sul title, in basso compare in dissolvenza
una battuta breve (VT323, corsivo, `paper` opacità ~0.7). Trucco classico
LucasArts del personaggio che commenta se resti fermo.

**Set definitivo (validato col file 03, tono burlona, zero spoiler):**

```js
const IDLE_QUOTES = [
  "Sète àncore. Un novizo. Una sola sera. Andèmo.",                      // [0] primo accesso
  "Ostrega, ancora qua? La Serenissima no la speta.",
  "Se vièn la marea granda, fioi, andemo tuti soto. Movève.",
  "Mi gò za beest. Vu cossa spetè?",
  "Varda ben, fioi: Venezia la sprofonda mentre ti pensi.",
  "Un fioi se marida. Prima che la mugiera ghe taja le ale... andemo.",
  "Mòneghi mii, gò un manoscrito e 'na sé che no vede l'ora.",
  "Stè boni che ve conto tuto. Ma prima: dème 'na man co' 'ste àncore.",
];
```

> `IDLE_QUOTES[0]` (la più "trailer") va mostrata al **primo accesso**; le
> altre random alle visite successive. Nessuna contiene formule riservate
> (es. "ti che ti sa" è del Lettore Eletto e NON va sprecata qui).

---

## BEAT 3 — Press Start → transizione al gioco

Al tap su `PRESS START TO BEGIN`:

1. **Transizione CRT power-off:** schermo collassa verticalmente in una
   linea + flash bianco (~400ms), spegnimento monitor a tubo. Tutto CSS
   (`scaleY` → 0.01 + `brightness` flash). Poi fade.
2. Naviga a `/ancora/1`.

```
PRESS START ──tap──▶ [CRT collapse + flash, ~400ms CSS] ──▶ /ancora/1
```

---

## §4-audio — Ambient (armato, non autoplay)

```
File: /public/audio/ambient/ambient_lagoon.mp3  (loop, ~150KB)
Default: MUTO.
UI: piccola icona altoparlante 🔊/🔇 in un angolo (top-right), tap per
    attivare/disattivare. Stato in localStorage (audioOn).
Motivo: l'autoplay è bloccato dai browser; in calle il gruppo (8 persone,
    una sola cuffia, file 02) non deve avere audio a sorpresa. L'ambient è
    un bonus per chi vuole l'atmosfera, non deve competere con l'audio
    degli enigmi.
Volume: basso (~0.3). Fade-in di ~1s all'attivazione.
```

---

## §5 — Stati alternativi (obbligatori)

```
prefers-reduced-motion: reduce
  → niente boot animato, niente CRT collapse, niente gondola/marea in moto
  → title screen STATICO (sfondo + titolo + PRESS START fisso)
  → idle quote: sì, senza fade (appare e basta)

localStorage.bootSeen === "1"  (visitatore di ritorno)
  → boot ultra-rapido: solo "OK — ready to play █" ~0.8s → title
  → il boot lungo si vede UNA volta

primo accesso
  → boot completo (Beat 1) → bootSeen = "1" → title → IDLE_QUOTES[0]
```

---

## §6 — Accessibilità & UX

- `PRESS START` e icona audio: tap target ≥ 44×44px (file 04), pollice-friendly.
- Contrasto alto (palette satura SCUMM aiuta).
- Boot sempre **skippabile** (tap) e **mai bloccante**.
- Titolo = testo vero (non immagine): leggibile, selezionabile, buono per SEO.

---

## §7 — Note di campo / da fare

- [ ] Rimuovere blocco debug "DESIGN TOKENS — M1 CHECK" dalla home.
- [ ] Verificare presenza asset ai path indicati (sezione "Asset attesi").
- [ ] Beat 1: typewriter + glitch + skip + bootSeen + preload asset.
- [ ] Beat 2: 6 layer + animazioni CSS + idle quote (IDLE_QUOTES[0] al 1° accesso).
- [ ] Beat 3: CRT collapse → `/ancora/1`.
- [ ] Audio armato non-autoplay + toggle + localStorage `audioOn` (§4).
- [ ] `prefers-reduced-motion` + visitatore di ritorno (§5).
- [ ] Verificare asset totali < 200KB; load 5-10s coperto dal boot.
- [ ] Verificare bundle JS < 100KB e First Paint < 1s (file 04) — metrica distinta.
- [ ] Registrare asset home nel Service Worker (precache, file 04).
- [ ] Test mobile: iOS Safari + Android Chrome.

---

## Riferimenti incrociati

- Voce di Fra Celestino / idle quote → `03_voice_and_tone.md`
- Stack, font, palette, budget, route `/` → `04_website_architecture.md`
- Lore (manoscritto corrotto/riemerso, profezia marea) → `01_lore_bible.md`
