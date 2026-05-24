import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  hashAnchorAnswer,
  hashAnswer,
  matchesAnchorHash,
  matchesAnyHash,
  normalizeAnchorAnswer,
  normalizeAnswer,
  sha256,
} from "../crypto.ts";

describe("normalizeAnswer", () => {
  it("lowercases, trims and collapses whitespace", () => {
    assert.equal(normalizeAnswer("  Ciao   Mondo  "), "ciao mondo");
  });

  it("strips diacritics", () => {
    assert.equal(normalizeAnswer("àncora"), "ancora");
    assert.equal(normalizeAnswer("perché"), "perche");
    assert.equal(normalizeAnswer("MAREA"), "marea");
  });

  it("strips common punctuation", () => {
    assert.equal(normalizeAnswer("la marea!"), "la marea");
    assert.equal(normalizeAnswer("«sette»"), "«sette»".replace(/[«»]/g, "").toLowerCase());
  });

  it("two visually equal but differently composed strings collapse", () => {
    // "à" composta vs decomposta
    const a = "àncora"; // à in NFC
    const b = "àncora"; // a + combining grave in NFD
    assert.equal(normalizeAnswer(a), normalizeAnswer(b));
  });
});

describe("sha256", () => {
  it("matches a known vector", async () => {
    // sha256("") = e3b0c4...
    const h = await sha256("");
    assert.equal(
      h,
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    );
  });
});

describe("hashAnswer + matchesAnyHash", () => {
  it("matches an accepted variant regardless of casing/diacritics", async () => {
    const hMarea = await hashAnswer("marea");
    assert.equal(await matchesAnyHash("MAREA", [hMarea]), true);
    assert.equal(await matchesAnyHash("  Marèa  ", [hMarea]), true);
    assert.equal(await matchesAnyHash("Marea!", [hMarea]), true);
  });

  it("rejects empty and wrong answers", async () => {
    const h = await hashAnswer("marea");
    assert.equal(await matchesAnyHash("", [h]), false);
    assert.equal(await matchesAnyHash("   ", [h]), false);
    assert.equal(await matchesAnyHash("acqua", [h]), false);
  });
});

describe("normalizeAnchorAnswer", () => {
  it("strips leading article", () => {
    assert.equal(normalizeAnchorAnswer("Il Cristo"), "cristo");
    assert.equal(normalizeAnchorAnswer("la marea"), "marea");
  });

  it("strips trailing statua/figura", () => {
    assert.equal(normalizeAnchorAnswer("Cristo statua"), "cristo");
    assert.equal(normalizeAnchorAnswer("leone figura"), "leone");
  });

  it("does not strip 'ore|ora' by default", () => {
    assert.equal(normalizeAnchorAnswer("24 ore"), "24 ore");
    assert.equal(normalizeAnchorAnswer("ventiquattro ore"), "ventiquattro ore");
  });

  it("strips trailing 'ore|ora' with stripHours option", () => {
    assert.equal(
      normalizeAnchorAnswer("24 ore", { stripHours: true }),
      "24",
    );
    assert.equal(
      normalizeAnchorAnswer("ventiquattro ore", { stripHours: true }),
      "ventiquattro",
    );
    assert.equal(
      normalizeAnchorAnswer("VENTIQUATTRO ORA", { stripHours: true }),
      "ventiquattro",
    );
  });
});

describe("matchesAnchorHash with stripHours", () => {
  it("'24 ore' matches the hash of '24'", async () => {
    const h = await hashAnchorAnswer("24", { stripHours: true });
    assert.equal(
      await matchesAnchorHash("24 ore", [h], { stripHours: true }),
      true,
    );
    assert.equal(
      await matchesAnchorHash("ventiquattro", [h], { stripHours: true }),
      false,
    );
  });

  it("without stripHours, '24 ore' does NOT match '24'", async () => {
    const h = await hashAnchorAnswer("24");
    assert.equal(await matchesAnchorHash("24 ore", [h]), false);
  });
});
