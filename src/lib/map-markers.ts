// Posizioni dei 7 marker sulla mappa pergamena (`/images/mappa_ancore.webp`).
// Coordinate in percentuale rispetto al box dell'immagine (top/left).
//
// Stima iniziale fatta a occhio dall'asset esistente, seguendo l'ordine del
// percorso descritto in `docs/02_route_and_timing.md`:
//   1. Stazione/Scalzi        -> icona chiesa in alto a sinistra
//   2. San Giacomo dell'Orio   -> icona vera da pozzo, centro-sinistra
//   3. Campo Santa Margherita  -> icona drago, centro
//   4. Zattere                 -> icona briccole, lato destro
//   5. Ponte dell'Accademia    -> icona ponte, centro-basso
//   6. Rialto                  -> icona rosa dei venti/orologio
//   7. Misericordia            -> icona bottiglia, in basso a destra
//
// TODO(filippo): rifinire le coordinate quando l'asset definitivo arriva.
// I valori sono volutamente conservativi (≥ 5%, ≤ 95%) per non finire
// sotto la cornice decorativa della mappa.
export type MapMarkerPosition = {
  /** Percentuale dall'alto del contenitore (0..100). */
  top: number;
  /** Percentuale da sinistra del contenitore (0..100). */
  left: number;
};

export const MAP_MARKERS: Record<number, MapMarkerPosition> = {
  1: { top: 15, left: 32 },
  2: { top: 35, left: 27 },
  3: { top: 37, left: 53 },
  4: { top: 37, left: 75 },
  5: { top: 58, left: 47 },
  6: { top: 63, left: 56 },
  7: { top: 75, left: 62 },
};

export const MAP_MARKER_IDS: readonly number[] = [1, 2, 3, 4, 5, 6, 7];
