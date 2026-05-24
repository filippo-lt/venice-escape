# Home Flow — Prompt per la generazione degli asset

> Prompt pronti per generare gli asset grafici e audio della home
> (`boot → title screen → press start`). Companion del build spec
> `home_flow.md`, che assume questi asset già pronti ai path indicati.
> Estetica di riferimento: SCUMM/LucasArts anni 90 (Monkey Island 2 /
> Indiana Jones Fate of Atlantis), palette ocra-seppia (file 03).

---

## Riepilogo asset

```
#   ASSET                      PATH                                    PESO~     PRIORITÀ
──  ─────                      ────                                    ─────     ────────
A1  Sfondo title (laguna)      /public/images/title_lagoon.webp        ~150KB    ESSENZIALE
A2  Sprite gondola             /public/images/sprite_gondola.webp      ~40KB     CONSIGLIATO
A3  Sprite lanterna            /public/images/sprite_lantern.webp      ~15KB     CONSIGLIATO
A4  Riflesso luna              — (solo CSS, nessun asset)              0KB       OPZIONALE
A5  Audio ambient laguna       /public/audio/ambient/ambient_lagoon.mp3  ~150KB    INCLUSO
```

> Nota budget: target home < 200KB complessivi. Se A1+A2+A3+A5 sforano,
> comprimere prima A1 (sfondo) e A5 (audio), mai a scapito della nitidezza
> degli sprite.

---

## A1 — Sfondo title screen · ESSENZIALE

**Path:** `/public/images/title_lagoon.webp` · statico · ~150KB

La gondola è uno sprite separato (A2) per poterla animare → **NON includerla
nel fondale**. Lasciare l'acqua in basso semplice: la "marea" è un layer CSS
sovrapposto. Lasciare l'area in alto al centro più scura/vuota per il titolo.

### Prompt (generazione AI)

```
Pixel art, VGA 320x200 style, LucasArts SCUMM aesthetic (Monkey Island 2
title screen / Indiana Jones Fate of Atlantis). Wide nocturnal Venetian
lagoon at dusk. Background: silhouette skyline of domes and campanili on
the horizon in deep sepia-teal. Midground: several weathered wooden
bricole (mooring poles) rising from calm water, varying heights. A low
warm full moon casting a long reflection. Foreground lower third is open
calm water (kept simple — an animated tide layer goes on top in CSS).
Rich ochre, sepia and deep teal-night palette, warm moon reflections.
Detailed dithering, atmospheric depth, layered fog over distant city.
Subtle CRT scanlines feel, slight vignette. Crisp dithered pixels,
limited palette, no modern elements, no people, no boats, no text.
Upper center left intentionally open and darker for a title overlay.
```

### Post-elaborazione
- Esportare in `.webp`, comprimere a ~150KB mantenendo i pixel netti.
- Verificare che il terzo inferiore (acqua) sia uniforme abbastanza da
  reggere il gradiente "marea" CSS sovrapposto.
- Verificare che l'area titolo (alto-centro) abbia contrasto sufficiente
  per testo ocra/sand leggibile.

---

## A2 — Sprite gondola che attraversa · CONSIGLIATO

**Path:** `/public/images/sprite_gondola.webp` · trasparente · ~40KB

Scivola lentissima da un lato all'altro (CSS `translateX`, ~25s, loop). Dà
vita al quadro. Profilo laterale, vuota (niente gondoliere → resta senziente
e atemporale, coerente col tono).

### Prompt (generazione AI)

```
Small pixel art sprite of a single empty Venetian gondola in side profile,
silhouette with subtle sepia highlights, gentle curved prow (ferro),
SCUMM/Monkey Island style, isolated on transparent background, limited
ochre-sepia palette, ~80px wide feel, no gondolier, no people, no text,
no water, no background.
```

### Post-elaborazione
- Sfondo trasparente (PNG → `.webp` con alpha).
- Coerenza palette col fondale A1 (stessa famiglia seppia-notte).

---

## A3 — Lanterna su bricola · CONSIGLIATO

**Path:** `/public/images/sprite_lantern.webp` · trasparente · ~15KB

Piccola lanterna appesa, in primo piano. Animata in CSS con flicker
irregolare di opacità + glow caldo. È il punto di calore della scena.

### Prompt (generazione AI)

```
Tiny pixel art sprite of a small hanging oil lantern with warm glowing
flame, weathered metal frame, SCUMM/Monkey Island style, isolated on
transparent background, warm ochre glow around the flame, ~24px feel,
no text, no background, no pole.
```

### Post-elaborazione
- Sfondo trasparente.
- Il glow può essere rinforzato in CSS (`box-shadow`/`filter`), quindi nello
  sprite basta una fiamma sobria.

---

## A4 — Riflesso luna · OPZIONALE (nessun asset)

Non serve generare nulla: è un **gradiente CSS verticale** (ocra → trasparente)
sovrapposto all'acqua, che ondeggia con `transform: skewX` lieve in loop (~7s).
Citato qui solo per completezza — costo zero byte, alta resa.

---

## A5 — Audio ambient laguna · INCLUSO (armato, non autoplay)

**Path:** `/public/audio/ambient/ambient_lagoon.mp3` · loop · ~150KB

Loop d'atmosfera per il title screen. **Non parte in autoplay** (default muto,
toggle 🔊 — vedi build spec §4-audio): è un bonus per chi vuole il mood, non
deve competere con l'audio degli enigmi né sorprendere il gruppo in calle.

### Contenuto sonoro desiderato
```
- Base: acqua di laguna calma, sciabordio leggero contro le bricole
- Mid : un remo lontano (occasionale), legno che cigola piano
- Top : 1-2 gabbiani lontani, radi (non insistenti)
- NO  : musica melodica, voci, campane (campane = rischio confusione col gioco)
- Mood: notturno, calmo, leggermente malinconico — "la città prima della marea"
```

### Parametri tecnici (coerenti con file 03)
```
Formato      : MP3, ~96-112 kbps
Durata loop  : 20-40 sec, loop seamless (crossfade inizio/fine ~1s)
Volume mix   : basso, headroom — pensato per stare "sotto"
Peso target  : ~150KB
```

### Servizio consigliato: ElevenLabs SFX
(Già nel workflow del progetto per la voce di Fra Celestino — file 03.
 Loop nativo, fino a 30s, licenza royalty-free sui piani a pagamento.)

**Prompt:**
```
Calm nocturnal Venetian lagoon ambience. Gentle water lapping against
wooden mooring poles, soft and continuous. Occasional distant single oar
splash. Faint creaking of wet wood. One or two distant seagulls, sparse.
Quiet, melancholic, nighttime atmosphere. No music, no voices, no bells,
no boat engines. Seamless ambient loop.
```
**Impostazioni:** Loop ON · Duration ~25-30s · Prompt influence medio-alto.
**Workflow:** genera 4-5 take e scegli (ElevenLabs non edita i layer, si
rigenera). Export, poi verifica volume a -18/-22dB (sta "sotto").

### Post-produzione (Audacity, stile file 03)
1. Loop seamless: crossfade ~1s tra coda e testa.
2. EQ: ammorbidire le alte (effetto notturno ovattato).
3. Reverb molto leggero (spazio aperto laguna).
4. Normalizzare basso, lasciare dinamica.
5. Esportare MP3 ~96-112 kbps, verificare peso ~150KB.

---

## Checklist generazione

- [ ] A1 generato, compresso `.webp` ~150KB, area titolo + acqua verificate.
- [ ] A2 generato, trasparente, palette coerente con A1.
- [ ] A3 generato, trasparente, fiamma sobria (glow lo aggiunge il CSS).
- [ ] A5 generato/scelto, loop seamless, post-prodotto, ~150KB.
- [ ] Somma asset home verificata < 200KB.
- [ ] Tutti i file ai path indicati nel build spec `home_flow.md`.
