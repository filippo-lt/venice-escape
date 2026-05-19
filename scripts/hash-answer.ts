// Genera l'hash SHA-256 normalizzato di una o più risposte.
// Uso:
//   npm run hash -- "MAREA" "le maree"
//
// L'output va incollato in src/lib/anchors.ts → acceptedHashes.
// Le risposte in chiaro NON vengono persistite da nessuna parte.

import { hashAnswer, normalizeAnswer } from "../src/lib/crypto.ts";

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: npm run hash -- "risposta 1" "variante 2" ...');
  process.exit(1);
}

for (const a of args) {
  const norm = normalizeAnswer(a);
  const h = await hashAnswer(a);
  console.log(`${h}  // "${norm}"`);
}
