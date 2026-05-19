import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  hashAnswer,
  matchesAnyHash,
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
