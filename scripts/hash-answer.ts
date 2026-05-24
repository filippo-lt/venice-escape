// Genera l'hash SHA-256 normalizzato di una o più risposte.
// Uso base:
//   npm run hash -- "MAREA" "le maree"
// Per le ancore (normalizzazione estesa: articolo iniziale, sostantivo
// finale, opzionale strip "ore|ora"):
//   npm run hash -- --anchor "il cristo" "cristo benedicente"
//   npm run hash -- --anchor --strip-hours "24 ore" "ventiquattro ore"
//
// L'output va incollato in src/lib/anchors.ts → acceptedHashes.
// Le risposte in chiaro NON vengono persistite da nessuna parte.

import {
  hashAnchorAnswer,
  hashAnswer,
  normalizeAnchorAnswer,
  normalizeAnswer,
} from "../src/lib/crypto.ts";

const argv = process.argv.slice(2);
const anchor = argv.includes("--anchor");
const stripHours = argv.includes("--strip-hours");
const values = argv.filter((a) => !a.startsWith("--"));

if (values.length === 0) {
  console.error(
    'Usage: npm run hash -- [--anchor] [--strip-hours] "risposta 1" "variante 2" ...',
  );
  process.exit(1);
}

if (stripHours && !anchor) {
  console.error("--strip-hours requires --anchor");
  process.exit(1);
}

for (const a of values) {
  if (anchor) {
    const norm = normalizeAnchorAnswer(a, { stripHours });
    const h = await hashAnchorAnswer(a, { stripHours });
    console.log(`${h}  // "${norm}"`);
  } else {
    const norm = normalizeAnswer(a);
    const h = await hashAnswer(a);
    console.log(`${h}  // "${norm}"`);
  }
}
