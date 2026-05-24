# 06 — Gating, Soluzioni, Mappa e Normalizzazione (spec tecnica)

> **Build spec self-contained** per Claude Code. Raccoglie le spec
> trasversali che mancavano agli `ancora_N.md`: la **meccanica di sblocco**
> tra ancore, la **pagina `/soluzioni`** (GM), la **pagina `/mappa`**, e la
> **funzione di normalizzazione** canonica delle risposte.
> Filosofia trasversale → file di knowledge `01`–`05`.

---

## 1. Gating tra ancore — CODICE DI ARRIVO DEL GM (DECISO)

**Decisione:** la progressione fisica è controllata dal **Game Master**, che
comunica a voce un **codice di arrivo** quando il gruppo è effettivamente sul
posto. Niente GPS (fragile tra le calli, batterie scariche — Varta docet),
niente sblocco automatico.

### Flusso

```
/ancora/N  →  enigma risolto  →  /transizione/N
                                  (frammento + prossima destinazione)
        cammino verso il luogo N+1  ───────────────►  il GM, sul posto,
                                                       dà il CODICE DI ARRIVO
/ancora/(N+1)  parte BLOCCATA:                              │
  "📍 Siete arrivati? Inserite il codice del custode."  ◄───┘
  codice corretto → la pagina si sblocca e mostra audio + enigma
```

- **`/ancora/1` è l'unica già sbloccata** (entry dalla home): nessun codice.
- Le ancore **2..7** partono **bloccate** e si sbloccano col codice di arrivo.
- Il codice **NON è la soluzione dell'enigma**: è una password di presenza,
  che solo il GM conosce e dà a voce quando il gruppo è lì.
- La `/transizione/N` mostra la destinazione ma **non** il codice.

### UI della pagina-ancora bloccata

```
┌────────────────────────────────────────┐
│  ▓▓▓ ANCORA N — SIGILLATA ▓▓▓           │  ← stile "lucchetto" SCUMM
│                                        │
│  📍 Quando siete sul posto, il custode │
│     vi darà la parola d'accesso.       │
│                                        │
│  > [____________________]  [SBLOCCA]   │  ← input grande, pollice
│                                        │
│  (Frammenti raccolti: ◆ ◆ ◇ ◇ ◇ ◇ ◇)   │
└────────────────────────────────────────┘
```

- Codice errato → micro-feedback ("Il custode scuote la testa…"), nessuna
  penalità. Tap target generosi (in calle, una mano).
- Codice corretto → `unlockedAnchors = [...unlockedAnchors, N]`, si rivela
  la pagina-ancora completa (audio + Archivista + enigma).

### Verifica del codice (client)

Stessa logica anti-spoiler delle risposte: **hash SHA-256**, codici NON in
chiaro nel sorgente. Normalizzazione del codice = **solo** `trim` +
`toLowerCase` (niente strip articoli/sostantivi: i codici sono parole secche).

```js
// Hash SHA-256 dei CODICI DI ARRIVO (forma: code.trim().toLowerCase())
// I codici in chiaro vivono SOLO qui e in /soluzioni (GM). Configurabili.
const ARRIVAL_CODES = {
  2: "dab41234953ddef39b5b7959edf610eb3ecc5dee017fff3dfdc867d526d8fa7c", // ORO
  3: "f11740e9c6f20023f31c08b088147a577963d9d0ba3962e1cc0f295fc29b5da6", // FRESCA
  4: "2ca3f2f5df7e87d254900bcbca0798ba2e4e976d760effb9d6a8e8813823c7f4", // BRENTA
  5: "2a8b708154403288396216317c07fd9419ae0921c2c7815b3040d8cd660a5b56", // CADORE
  6: "5bc49ab5a201d2a8a5d785116b7537e7bc253e0721d63b124a031a54abb4386c", // SCHEI
  7: "cdbeb640cf2cc046d9f826d5cdda3eb7b4b079f72b748144d41a74efbe1925e1", // SENSA
};
```

### Codici di default (configurabili dall'organizzatore)

| Ancora | Luogo | Codice di arrivo (default) |
|--------|-------|----------------------------|
| 2 | San Giacomo dell'Orio | `ORO` |
| 3 | Campo Santa Margherita | `FRESCA` |
| 4 | Zattere | `BRENTA` |
| 5 | Ponte dell'Accademia | `CADORE` |
| 6 | Rialto / San Giacometto | `SCHEI` |
| 7 | Fondamenta della Misericordia | `SENSA` |

> Parole veneziane-flavoured, **nessuna coincide con la soluzione di un
> enigma** (cristo, leone, santa margherita, briccola, legno, 24, paradiso).
> Cambiali pure: rigenera gli hash con lo **script in fondo** e aggiorna
> `ARRIVAL_CODES` + `/soluzioni`. Il GM porta un **foglietto stampato** coi
> 7 codici (fallback offline, file 02 § backup).

### Fallback GM (file 02)

- Modalità **"skip ancora"** del GM (file 04 § backup): se il gruppo è
  bloccato/in ritardo, il GM può sbloccare manualmente da `/soluzioni`.
- Se cade la rete: il GM ha comunque tutti i codici/soluzioni sul foglietto.

---

## 2. Normalizzazione risposte — funzione canonica (UNICA fonte)

Tutti gli `ancora_N.md` citano questa pipeline. Qui la versione **client**
definitiva. Deve combaciare **esattamente** con quella usata per generare
gli hash (Appendice Python in ogni `ancora_N.md`), altrimenti i confronti
falliscono.

```js
function normalizeAnswer(input, { stripHours = false } = {}) {
  let s = input.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // togli accenti
  s = s.trim().toLowerCase();
  s = s.replace(/^(il|lo|la|i|gli|le)\s+/, "");                   // articolo iniziale
  const tail = stripHours
    ? /\s+(statue|statua|figure|figura|ore|ora)$/                 // +ore/ora SOLO Ancora 6
    : /\s+(statue|statua|figure|figura)$/;
  s = s.replace(tail, "");                                        // sostantivo finale
  s = s.replace(/\s+/g, " ").trim();                              // collassa spazi
  return s;
}
```

- **Ordine accenti↔lowercase:** togliere gli accenti dopo `NFD` e poi
  `toLowerCase` è equivalente per le lettere latine usate qui; mantenere
  quest'ordine identico allo script Python di generazione hash.
- **Ancora 6 (Rialto):** chiamare con `{ stripHours: true }` (così "24 ore"
  e "ventiquattro ore" collassano su "24"/"ventiquattro").
- **Ancora 7 (Misericordia):** l'articolo veneziano **`el`** NON è coperto
  dalla regex → "el paradiso perduo/perduto" sono hash dedicati (già presenti
  in `ancora_7.md`). Non aggiungere `el` alla regex (romperebbe gli hash).
- I **codici di arrivo** (§1) usano una normalizzazione **diversa e più
  semplice** (solo trim+lowercase): non passarli da `normalizeAnswer`.

---

## 3. Pagina `/soluzioni` (GM-only, URL segreto)

Pagina **non linkata**, fuori dal flusso, per il solo Game Master. Aggrega
ciò che è già nei blocchi GM-only degli `ancora_N.md`.

Contenuto:
```
- Codici di arrivo (in chiaro):    1 (—) · 2 ORO · 3 FRESCA · 4 BRENTA ·
                                   5 CADORE · 6 SCHEI · 7 SENSA
- Soluzioni enigmi (in chiaro):    1 cristo · 2 leone · 3 santa margherita ·
                                   4 briccola · 5 legno · 6 24 · 7 paradiso
- Lettere frammenti:               V · E · N · E · Z · I · A  → VENEZIA
- Hint progressivi per ancora      (copiati dalle sez. 6 degli ancora_N.md)
- Pulsanti "sblocca ancora N"      (override manuale del gating, fallback)
- Pulsante "skip ancora"           (file 04 § backup)
```

Protezione: URL non indovinabile + (opz.) gate con una password GM. Niente
indicizzazione (noindex). Mai linkata dalle pagine pubbliche.

---

## 4. Pagina `/mappa`

Mappa minimale, accessibile sempre (file 04). Due usi:
```
DURANTE IL GIOCO
- Mostra solo le ancore GIÀ sbloccate (◆) + la prossima destinazione come
  meta generica ("verso Santa Margherita"), SENZA spoiler dei luoghi futuri.
- Stile mappa "manoscritto" XIII sec. (file 03 § mappa): seppia, simboli,
  i punti si rivelano uno alla volta man mano che si sbloccano.

AL /finale
- Mostra il tracciato completo dei 7 punti + il RITORNO a Stazione S. Lucia
  (il pulsante "↩ Torna verso la stazione" del /finale apre questa vista).
- Niente cena: l'ultima indicazione è il rientro a casa.
```
Implementazione: SVG statico stilizzato (NON mappa reale interattiva, per
peso/offline, file 04 § performance). I 7 punti come layer che si accendono
in base a `unlockedAnchors`.

---

## 5. Riepilogo route (allineato a file 04)

```
/                      home (boot → title → press start)  [sbloccata]
/ancora/1              [sbloccata da inizio]
/ancora/2../ancora/7   [BLOCCATE: richiedono codice di arrivo GM]
/transizione/1../6     frammento + destinazione (NON danno il codice)
/finale                VENEZIA + addio + ritorno a casa (no /transizione/7)
/mappa                 punti sbloccati / tracciato finale
/soluzioni             GM-only (codici, soluzioni, override)
/reset                 reset progresso per test
```

---

## Appendice: generazione hash CODICI DI ARRIVO (script GM, non committare)

```python
import hashlib

# Normalizzazione codici = solo trim + lowercase (diversa dalle risposte!)
codici = {2:"ORO", 3:"FRESCA", 4:"BRENTA", 5:"CADORE", 6:"SCHEI", 7:"SENSA"}
for n, c in codici.items():
    h = hashlib.sha256(c.strip().lower().encode()).hexdigest()
    print(f'  {n}: "{h}", // {c}')
```

---

## Riferimenti incrociati

- Architettura sito / route / unlock logic → `04_website_architecture.md`
- Percorso, tempi, backup GM → `02_route_and_timing.md`
- Estetica mappa manoscritto → `03_voice_and_tone.md` § mappa
- Hash e normalizzazione per ancora → `ancora_N.md` § 3 + Appendice
