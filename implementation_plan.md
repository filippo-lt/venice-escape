# Implementation Plan — Home, Intro/Transizioni, Finale

> Piano operativo per chiudere le tre "schermate cornice" della Main Quest:
> la **home animata** (`/`), le **6 transizioni-intro** (`/transizione/[id]`)
> e il **finale** (`/finale`). Le pagine `/ancora/[id]` esistono già e non
> sono toccate qui. Per il gating con codice di arrivo vedere `docs/06`.
>
> **Stack:** Next.js 15 App Router, Tailwind v4, TypeScript strict. Animazioni
> in **CSS puro** (nessuna libreria JS). Mobile-first. Vedi `CLAUDE.md`.
>
> **Asset disponibili adesso in `public/`:**
> - `images/title_lagoon.png`, `sprite_gondola.png`, `sprite_lantern.png`
> - `images/finale_venezia.png`, `images/mappa_ancore.png`
> - `images/fra_celestino_portrait.png`
> - `audio/main/ancora_1..7.mp3`, `audio/main/finale.mp3`
> - `audio/ambient/ambient_lagoon.mp3` (da aggiungere, vedi Fase 1)

---

## Fase 0 — Pre-flight (30 min)

Allineamenti necessari prima di toccare le pagine. Una sola sessione, niente
animazioni qui.

- [x] **0.1** Convertire i `.png` della home in `.webp` per stare nel budget
  (`title_lagoon`, `sprite_gondola`, `sprite_lantern`,`finale_venezia`,
  `mappa_ancore`, `fra_celestino_portrait`). Target: `title_lagoon ≤ 150KB`,
  `finale_venezia ≤ 200KB`. Lasciare i `.png` originali finché tutte le
  reference puntano al `.webp`.
- [x] **0.2** Verificare che `public/audio/ambient/ambient_lagoon.mp3` esista
  (la home lo aspetta). Se manca, generare un file da `home_assets_prompts.md`
  o mettere un silenzio loopabile come placeholder. *(Directory creata con
  README; file `ambient_lagoon.mp3` da generare esternamente — no MP3 encoder
  locale. La home tollera l'assenza.)*
- [x] **0.3** Aggiungere al `next.config.ts` (se non c'è già) il preset
  immagini WebP standard. No modifiche a Tailwind in questa fase.
- [x] **0.4** Estendere `globals.css` con i keyframe condivisi che useremo
  in tutte e tre le pagine:

  ```css
  @keyframes blink { 50% { opacity: 0 } }
  @keyframes flicker {
    0%,100% { opacity: 1 }
    45%     { opacity: 0.55 }
    47%     { opacity: 0.95 }
    60%     { opacity: 0.7 }
  }
  @keyframes tide-drift {
    0%,100% { transform: translateY(0) }
    50%     { transform: translateY(-4px) }
  }
  @keyframes glow-pulse {
    0%,100% { text-shadow: 2px 2px 0 var(--color-blood),
                           4px 4px 0 var(--color-bg-deep),
                           0 0 6px rgba(184,132,42,0.0) }
    50%     { text-shadow: 2px 2px 0 var(--color-blood),
                           4px 4px 0 var(--color-bg-deep),
                           0 0 14px rgba(184,132,42,0.55) }
  }
  @keyframes crt-collapse {
    0%   { transform: scaleY(1);    filter: brightness(1) }
    70%  { transform: scaleY(0.02); filter: brightness(2.5) }
    100% { transform: scaleY(0);    filter: brightness(0) }
  }
  @media (prefers-reduced-motion: reduce) {
    .anim-blink, .anim-flicker, .anim-tide,
    .anim-glow,  .anim-crt-collapse { animation: none !important; }
  }
  ```

- [x] **0.5** Commit: `chore: assets webp + shared keyframes per home/finale`.

---

## Fase 1 — Home `/` (boot → title → press start)

**Spec autoritativa:** `docs/home_flow.md` (leggere prima di iniziare). Tre
beat, asset già preparati, animazioni CSS pure. Bundle JS deve restare
< 100KB. Asset home < 200KB.

### 1.1 — Pulizia e scheletro

- [ ] Rinominare l'attuale `src/app/page.tsx` in
  `src/app/_legacy_page.tsx.bak` (riferimento per copia/incolla token) e
  creare uno scheletro client `"use client"` nuovo. Il vecchio blocco
  "DESIGN TOKENS — M1 CHECK" va eliminato in produzione.
- [ ] La home è **client component** (serve `useEffect`, `useState`,
  `localStorage`, listener tap/keydown). Niente fetch SSR — è statica.

### 1.2 — Sotto-componenti (un file ciascuno)

Creare in `src/components/home/`:

- [ ] `BootSequence.tsx` — Beat 1. Riceve `mode: "full" | "fast"` e
  `onDone: () => void`. Renderizza le righe del boot in sequenza con
  `animation-delay` su `steps()`; al `t=3.5s` chiama `onDone()`.
  Skip: tap/click/keydown anywhere → `onDone()` immediato.
  Riga "WARNING ... 1297" con classe `glitch` (shake 250ms + text-shadow
  rosso/ciano ±2px). Cursore `█` con `animation: blink 1s infinite`.
  In `mode="fast"` mostra solo `OK — ready to play █` per ~0.8s.
- [ ] `TitleScreen.tsx` — Beat 2. Layout:

  ```
  layer 0: <img src="/images/title_lagoon.webp"> object-cover, full bleed
  layer 1: <div class="tide-overlay anim-tide"> gradiente bg-water → trasparente
  layer 2: <div class="moon-reflection"> gradiente ocra che ondeggia (skewX)
  layer 3: <img src="/images/sprite_gondola.webp" class="gondola-pan">
           keyframe 25s translateX(-20vw → 120vw) infinite linear
  layer 4: <img src="/images/sprite_lantern.webp" class="anim-flicker">
  layer 5: scanline + vignette (CSS gradients absolute inset-0 pointer-events-none)
  layer 6: titolo (font-pixel, anim-glow), PRESS START (anim-blink),
           IdleQuote (vedi sotto)
  ```

  Tutti i layer `absolute inset-0`. Wrapper `relative w-screen h-dvh
  overflow-hidden bg-bg-deep`.
- [ ] `IdleQuote.tsx` — Mostra una battuta dopo 5s di inattività sul title.
  Listener `mousemove/touchstart/keydown` resetta il timer. Set di quote
  in `home_flow.md` § Idle quote (8 quote, indice 0 al primo accesso,
  altri random successivi). Persiste `firstVisit` in `localStorage`.
  Fade-in 600ms (o appare secco con `prefers-reduced-motion`).
- [ ] `AmbientToggle.tsx` — Icona altoparlante top-right, tap target 44×44.
  Default `audioOn=false`. Quando true: `<audio loop src=".../ambient_lagoon.mp3">`
  con volume 0.3 e fade-in 1s. Stato in `localStorage.audioOn`.

### 1.3 — Orchestrazione in `page.tsx`

- [ ] Stato locale `beat: "boot" | "title" | "exit"`. Su mount:
  - Se `prefers-reduced-motion`: salta direttamente a `"title"`.
  - Altrimenti se `localStorage.bootSeen === "1"`: `BootSequence mode="fast"`.
  - Altrimenti `BootSequence mode="full"` e setta `bootSeen="1"` a fine boot.
- [ ] **Preload asset durante Boot:** in un `useEffect` con immagini
  `new Image()` per `title_lagoon`, `sprite_gondola`, `sprite_lantern` +
  `<link rel="preload" as="image">` iniettati. Coprire i 3.5s di Beat 1.
- [ ] Al click su `PRESS START`: `beat = "exit"`, applica `anim-crt-collapse`
  sul wrapper per 400ms, poi `router.push("/ancora/1")`.

### 1.4 — Verifiche

- [ ] Lighthouse mobile: Performance ≥ 90, First Contentful Paint < 1s su
  throttling 4G (Slow 4G nel DevTools).
- [ ] `bundle analyze`: la pagina `/` non deve aggiungere > 30KB di JS.
- [ ] Test su iPhone Safari reale e Android Chrome: skip al tap funziona,
  ambient toggle non parte da solo, `prefers-reduced-motion` rispettato
  (testare con `Settings → Accessibility → Reduce Motion`).
- [ ] Service Worker (può venire dopo, in milestone 6) — non bloccante qui,
  ma annotare gli asset da precachare: `title_lagoon.webp`, sprite,
  `ambient_lagoon.mp3`.

### 1.5 — Commit

- [ ] `feat(home): boot animato + title vivo + press start CRT collapse`

---

## Fase 2 — Intro / Transizioni `/transizione/[id]`

Le `/transizione/1..6` esistono già come stub (`TransitionPage.tsx`) ma sono
piatte: mostrano solo il frammento svelato. Vanno trasformate in **intro
narrative**: rivelazione drammatica del frammento, voce di Fra Celestino
(testo + opzionale outro audio), preview del prossimo luogo. Sono il
"respiro" tra un'ancora e l'altra.

> **Importante:** la transizione **non** dà il codice di arrivo (lo dà il
> GM a voce). La pagina mostra solo *dove andare* (`anchor.nextHint`) e che
> "il custode vi attende".
>
> **Ancora 7 non ha transizione:** dopo `/ancora/7` si va direttamente a
> `/finale` (vedi `docs/04` § route).

### 2.1 — Dati: campi nuovi su `Anchor`

- [ ] In `src/lib/anchors.ts` estendere il tipo `Anchor` con due campi
  opzionali per la transizione:

  ```ts
  /** Riga di outro che Fra Celestino "sussurra" dopo l'enigma. */
  archivistaOutro?: string;
  /** Frase teaser per la prossima destinazione (1-2 righe, no spoiler). */
  nextTeaser?: string;
  ```

  Riempire i 6 valori prendendoli dai blocchi "transizione" degli
  `contenuti/ancora_N.md` (sezione 4). NON toccare `nextHint`: resta come
  indicazione di luogo concreta.

### 2.2 — Sotto-componenti per la transizione

In `src/components/transition/`:

- [ ] `FragmentReveal.tsx` — Box pixel-art che rivela la lettera del
  frammento. Sequenza animata:
  1. `t=0`: box vuoto, bordo `border-blood-bright`, scanline interno.
  2. `t=400ms`: lampo (flash bianco) + scuotimento (`animation: shake 200ms`).
  3. `t=600ms`: la lettera appare in `font-pixel text-5xl text-sand` con
     `anim-glow` infinito.
  4. `t=1200ms`: appare sotto la "tacca" nell'inventario inline (◆ piena).
  Tutto in CSS puro con `animation-delay`.
- [ ] `InlineInventory.tsx` — Striscia di 7 caselle `◆ ◆ ◆ ◇ ◇ ◇ ◇` che
  mostra lo stato corrente dei frammenti (legge `progress.fragments`).
  Riusare lo style dell'`<Inventory />` SCUMM ma in formato compatto.
- [ ] `NextDestinationCard.tsx` — Card "manoscritto" stile pergamena con
  `nextTeaser` (corsivo, paper) + `nextHint` (concreto, ocra) + CTA grande
  `VERSO <LUOGO> →` che linka all'`anchor.href` successivo. La CTA NON
  mostra il codice; la pagina-ancora successiva sarà bloccata e chiederà
  il codice del custode (vedi `docs/06`).

### 2.3 — Riscrittura `TransitionPage.tsx`

- [ ] Pulire l'attuale (la copia ancora ha solo `archivistaNota` hardcoded).
- [ ] Layout mobile-first, max-width 480px:

  ```
  ┌──────────────────────────────────┐
  │ ★ ANCORA N ATTIVATA ★              │  pixel, verb-yellow, blink slow
  │                                    │
  │        [FRAGMENTReveal]            │  box centrale, anim
  │                                    │
  │        [InlineInventory]           │  ◆ ◆ ◆ ◇ ◇ ◇ ◇
  │                                    │
  │ FRA CELESTINO sottovoce:           │
  │ "...{archivistaOutro}..."          │  italic, paper, 0.8 opacity
  │                                    │
  │ [▶ play outro audio breve]         │  opz. — solo se outro registrato
  │                                    │
  │ ─── la prossima soglia ───         │
  │ [NextDestinationCard]              │
  │                                    │
  │ [VERSO SANTA MARGHERITA →]         │  CTA grande
  └──────────────────────────────────┘
  ```

- [ ] Su mount, scrivi `progress.fragments[anchor.id] = anchor.fragment` se
  non già presente (idempotente). Funzione già in `lib/progress.ts` o da
  aggiungere come `addFragment(n, letter)`.
- [ ] Gating in `page.tsx`: se l'utente arriva su `/transizione/N` senza
  aver risolto `/ancora/N` (no fragment in progress), redirect a
  `/ancora/N`. Tollerante in dev: bypass con `?gm=skip`.
- [ ] Caso `id === 7`: non dovrebbe accadere (ancora 7 → finale diretto),
  ma se accade redirect a `/finale`.

### 2.4 — Verifiche

- [ ] Aprire `/transizione/1..6` in sequenza e verificare:
  - frammento corretto (V, E, N, E, Z, I per id 1..6),
  - teaser e hint dell'ancora successiva corrispondono ai `contenuti/`,
  - CTA porta a `/ancora/(id+1)` e questa è bloccata (mostra UI codice
    di arrivo — vedi nota: se la UI ancora bloccata non è ancora
    implementata, marcare TODO e lasciare la nav semplice).
- [ ] Inventario inline coerente con quello mostrato in `/ancora/[id]`.
- [ ] `prefers-reduced-motion`: rivelazione del frammento istantanea, no
  flash/shake.

### 2.5 — Commit

- [ ] `feat(transizione): rivelazione frammento + outro Celestino + next card`

---

## Fase 3 — Finale `/finale`

**Pagina che non esiste ancora.** È il climax: i 7 frammenti si compongono
in **VENEZIA**, Fra Celestino chiude, e si torna verso Santa Lucia (niente
cena finale, vedi `docs/02`/`04`). C'è già `public/audio/main/finale.mp3` e
`public/images/finale_venezia.png` pronti.

### 3.1 — Route e gating

- [ ] Creare `src/app/finale/page.tsx` (server) +
  `src/app/finale/FinalePage.tsx` (client). La server page legge il progress
  client-side via il componente client; il gating effettivo è
  client-side (no cookie/header).
- [ ] In `FinalePage.tsx`, su mount: se `progress.fragments` non ha tutte
  e 7 le lettere → redirect a `/ancora/N` dove `N = primaAncoraMancante`.
  Bypass in dev con `?gm=skip` o `?from=ancora7` (per test).
- [ ] All'arrivo legittimo: `progress.completedMainQuest = true`,
  `progress.completedAt = Date.now()`. Persistere via `lib/progress.ts`.

### 3.2 — Composizione visiva

- [ ] Layout in 4 atti, scroll verticale naturale (uno schermo per atto su
  mobile, niente snap). Wrapper `bg-bg-deep text-white-text`.

  **Atto 1 — Comparsa lettere (auto, ~3s):**
  ```
  ┌────────────────────────┐
  │     V E N E Z I A       │   ogni lettera fade-in con
  │     ──────────────       │   delay scalato 0/200/400... ms
  │                          │   font-pixel text-6xl text-sand
  │  (i 7 frammenti raccolti)│   glow ocra
  └────────────────────────┘
  ```
  Componente `LettersComposition.tsx`: rende 7 `<span>` da
  `progress.fragments[1..7]`; ognuno con `animation-delay` crescente +
  `anim-glow` finale persistente.

  **Atto 2 — Immagine rivelazione:**
  - `<img src="/images/finale_venezia.webp">` full-width con `loading="eager"`.
  - Overlay leggero scanline + vignette.
  - Sotto: didascalia VT323 paper: *"Venezia non si conquista. Ti si
    rivela quando smetti di cercarla."*

  **Atto 3 — Outro Fra Celestino:**
  - `<AudioPlayer>` (riusare componente SCUMM esistente) con
    `src="/audio/main/finale.mp3"`. Autoplay **no**; etichetta
    "▶ ASCOLTA L'ADDIO DI FRA CELESTINO".
  - Sotto, in `<DialogBox>` SCUMM: il testo dell'addio (prenderlo dal
    `contenuti/ancora_7.md` se presente in chiusura, o da
    `docs/01_lore_bible.md` se l'outro è documentato lì; altrimenti
    chiedere e parcheggiare un placeholder breve coerente con la voce).

  **Atto 4 — Ritorno a casa:**
  - Card "manoscritto" con due CTA grandi (44×44+):
    - `↩ TORNA VERSO LA STAZIONE` → `/mappa?focus=ritorno`
      (la `/mappa` evidenzierà il tracciato S.Lucia ← Misericordia).
    - `★ APRI IL MANOSCRITTO` → `/manoscritto` (può essere disabilitata
      finché `SIDE_CONTENT_RELEASED=false`; in quel caso mostra
      "in arrivo nelle prossime settimane").

### 3.3 — Easter egg counter (opzionale, se tempo)

- [ ] Sotto l'Atto 4, una microriga: `★ INDIZI TROVATI: {n}/{tot}`. Se
  `n >= 3` aggiungere CTA secondaria `→ I SEGRETI` verso
  `/manoscritto/segreti` (anche questa gated da `SIDE_CONTENT_RELEASED`).

### 3.4 — Verifiche

- [ ] Forzare progress completo (via `?gm=skip` + popolare manualmente
  `localStorage.venice-escape-progress`) e percorrere i 4 atti.
- [ ] `progress.completedMainQuest === true` dopo prima visita.
- [ ] Audio `finale.mp3` parte solo su tap, mai in autoplay (iOS la blocca
  comunque, ma testare).
- [ ] `prefers-reduced-motion`: le 7 lettere appaiono insieme, niente glow
  pulsante.

### 3.5 — Commit

- [ ] `feat(finale): composizione VENEZIA + outro audio + ritorno a casa`

---

## Fase 4 — Integrazione e regressioni (1 sessione)

- [ ] **4.1** Smoke test del flusso completo in dev (`pnpm dev` / `npm run
  dev`): `/ → /ancora/1 → /transizione/1 → /ancora/2 → … → /ancora/7 →
  /finale`. Usare `?gm=skip` dove serve per saltare i codici.
- [ ] **4.2** Verifica che `localStorage.venice-escape-progress` venga
  popolato correttamente a ogni step (fragments, unlockedAnchors,
  completedMainQuest).
- [ ] **4.3** `/reset` (se non esiste, crearlo: pagina cliccabile che fa
  `localStorage.clear()` e redirect a `/`). Necessaria per i prossimi test
  sul campo.
- [ ] **4.4** Lighthouse mobile su `/`, `/transizione/3`, `/finale`:
  Performance ≥ 90 ciascuna.
- [ ] **4.5** Test reale su un iPhone e un Android (rete 4G simulata + sole
  reale). Annotare problemi di leggibilità.
- [ ] **4.6** Commit: `chore: smoke test end-to-end main quest`.

---

## Cosa NON è in questo piano (esplicito)

- **`/mappa`** vista manoscritto con punti animati → piano separato (è
  trasversale, va fatta in parallelo ma ha la sua spec in `docs/06` § 4).
- **`/soluzioni`** GM → piano separato (richiede `ARRIVAL_CODES`
  configurati e UI di override).
- **Codici di arrivo + UI "ancora sigillata"** → piano separato. Questo
  piano si limita a NON entrare in conflitto: le CTA `VERSO X →` portano
  a `/ancora/(N+1)` che, una volta implementato il gating, mostrerà
  l'input codice prima dell'enigma.
- **Service Worker** e ottimizzazioni offline → milestone 6 separata.
- **Manoscritto / Fase 2** → fuori scope.

---

## Stima

| Fase | Tempo |
|------|-------|
| 0 — Pre-flight | ~30 min |
| 1 — Home animata | ~4-6h (1-2 sessioni) |
| 2 — Transizioni intro | ~3-4h |
| 3 — Finale | ~3-4h |
| 4 — Integrazione | ~1-2h |
| **Totale** | **~12-17h** |

Tutte le fasi sono indipendenti tra loro (a parte la 0), si possono
parallelizzare se più persone lavorano insieme. Ordine consigliato per una
singola persona: **0 → 2 → 3 → 1 → 4** (le transizioni e il finale dipendono
solo da dati testuali, la home invece richiede iterazione fine sulle
animazioni e conviene farla quando tutto il resto regge).
