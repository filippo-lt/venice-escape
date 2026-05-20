// Normalizzazione e hashing delle risposte alle ancore.
//
// Le risposte in chiaro non devono mai comparire nel bundle: in anchors.ts
// teniamo solo gli hash SHA-256 delle varianti accettate, e a runtime
// confrontiamo l'hash della risposta dell'utente (normalizzata).

/**
 * Normalizza una risposta per renderla confrontabile a prescindere da:
 *  - maiuscole/minuscole
 *  - spazi extra all'inizio/fine/in mezzo
 *  - accenti e diacritici (à → a, è → e, ç → c, ecc.)
 *  - punteggiatura comune
 */
export function normalizeAnswer(input: string): string {
  return input
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[\p{P}\p{S}]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Normalizzazione "estesa" per le risposte alle ancore:
 *  - normalizeAnswer (lowercase, no accenti, no punteggiatura, no spazi extra)
 *  - rimuove articolo iniziale: il / lo / la / i / gli / le / l'
 *  - rimuove sostantivo finale generico: statua/statue, figura/figure
 *  - ricollassa eventuali spazi
 *
 * Es. "Il Cristo" → "cristo", "la statua del cristo" → "del cristo".
 */
export function normalizeAnchorAnswer(input: string): string {
  let s = normalizeAnswer(input);
  s = s.replace(/^(?:il|lo|la|i|gli|le|l)\s+/u, "");
  s = s.replace(/\s+(?:statue|statua|figure|figura)$/u, "");
  return s.replace(/\s+/g, " ").trim();
}

/** SHA-256 esadecimale di una stringa, lato client o lato Node. */
export async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Hash normalizzato: normalize → sha256. Helper per i confronti. */
export async function hashAnswer(input: string): Promise<string> {
  return sha256(normalizeAnswer(input));
}

/** Come hashAnswer ma usa normalizeAnchorAnswer (articolo + sostantivo). */
export async function hashAnchorAnswer(input: string): Promise<string> {
  return sha256(normalizeAnchorAnswer(input));
}

/**
 * Verifica se una risposta utente corrisponde a una delle varianti
 * accettate per un enigma, identificate dai loro hash SHA-256.
 */
export async function matchesAnyHash(
  userInput: string,
  acceptedHashes: readonly string[],
): Promise<boolean> {
  if (!userInput.trim()) return false;
  const h = await hashAnswer(userInput);
  return acceptedHashes.includes(h);
}

/** Variante per le ancore: usa la normalizzazione estesa. */
export async function matchesAnchorHash(
  userInput: string,
  acceptedHashes: readonly string[],
): Promise<boolean> {
  if (!userInput.trim()) return false;
  const h = await hashAnchorAnswer(userInput);
  return acceptedHashes.includes(h);
}
