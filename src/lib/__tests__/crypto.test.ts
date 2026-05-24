import { describe, it, expect } from "vitest";
import {
  hashAnchorAnswer,
  hashAnswer,
  matchesAnchorHash,
  matchesAnyHash,
  normalizeAnchorAnswer,
  normalizeAnswer,
  sha256,
} from "../crypto";

describe("normalizeAnswer", () => {
  it("lowercases, trims and collapses whitespace", () => {
    expect(normalizeAnswer("  Ciao   Mondo  ")).toBe("ciao mondo");
  });

  it("strips diacritics", () => {
    expect(normalizeAnswer("àncora")).toBe("ancora");
    expect(normalizeAnswer("perché")).toBe("perche");
    expect(normalizeAnswer("MAREA")).toBe("marea");
  });

  it("strips common punctuation", () => {
    expect(normalizeAnswer("la marea!")).toBe("la marea");
    expect(normalizeAnswer("«sette»")).toBe("sette");
  });

  it("two visually equal but differently composed strings collapse", () => {
    const a = "àncora";
    const b = "àncora";
    expect(normalizeAnswer(a)).toBe(normalizeAnswer(b));
  });
});

describe("sha256", () => {
  it("matches a known vector", async () => {
    const h = await sha256("");
    expect(h).toBe(
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    );
  });
});

describe("hashAnswer + matchesAnyHash", () => {
  it("matches an accepted variant regardless of casing/diacritics", async () => {
    const hMarea = await hashAnswer("marea");
    expect(await matchesAnyHash("MAREA", [hMarea])).toBe(true);
    expect(await matchesAnyHash("  Marèa  ", [hMarea])).toBe(true);
    expect(await matchesAnyHash("Marea!", [hMarea])).toBe(true);
  });

  it("rejects empty and wrong answers", async () => {
    const h = await hashAnswer("marea");
    expect(await matchesAnyHash("", [h])).toBe(false);
    expect(await matchesAnyHash("   ", [h])).toBe(false);
    expect(await matchesAnyHash("acqua", [h])).toBe(false);
  });
});

describe("normalizeAnchorAnswer", () => {
  it("strips leading article", () => {
    expect(normalizeAnchorAnswer("Il Cristo")).toBe("cristo");
    expect(normalizeAnchorAnswer("la marea")).toBe("marea");
  });

  it("strips trailing statua/figura", () => {
    expect(normalizeAnchorAnswer("Cristo statua")).toBe("cristo");
    expect(normalizeAnchorAnswer("leone figura")).toBe("leone");
  });

  it("does not strip 'ore|ora' by default", () => {
    expect(normalizeAnchorAnswer("24 ore")).toBe("24 ore");
    expect(normalizeAnchorAnswer("ventiquattro ore")).toBe("ventiquattro ore");
  });

  it("strips trailing 'ore|ora' with stripHours option", () => {
    expect(normalizeAnchorAnswer("24 ore", { stripHours: true })).toBe("24");
    expect(normalizeAnchorAnswer("ventiquattro ore", { stripHours: true })).toBe(
      "ventiquattro",
    );
    expect(normalizeAnchorAnswer("VENTIQUATTRO ORA", { stripHours: true })).toBe(
      "ventiquattro",
    );
  });
});

describe("edge cases", () => {
  it("matchesAnyHash with empty array returns false", async () => {
    expect(await matchesAnyHash("marea", [])).toBe(false);
  });

  it("collapses multiple internal spaces", () => {
    expect(normalizeAnswer("ciao    mondo  bello")).toBe("ciao mondo bello");
  });

  it("strips symbol characters (\\p{S})", () => {
    // currency, math, copyright symbols
    expect(normalizeAnswer("marea © $")).toBe("marea");
    expect(normalizeAnswer("a+b=c")).toBe("abc");
  });

  it("hashAnchorAnswer with stripHours produces normalized hash", async () => {
    const h1 = await hashAnchorAnswer("24 ore", { stripHours: true });
    const h2 = await hashAnchorAnswer("24");
    expect(h1).toBe(h2);
  });

  it("matchesAnchorHash rejects empty/whitespace input", async () => {
    const h = await hashAnchorAnswer("cristo");
    expect(await matchesAnchorHash("", [h])).toBe(false);
    expect(await matchesAnchorHash("   ", [h])).toBe(false);
  });
});

describe("matchesAnchorHash with stripHours", () => {
  it("'24 ore' matches the hash of '24'", async () => {
    const h = await hashAnchorAnswer("24", { stripHours: true });
    expect(
      await matchesAnchorHash("24 ore", [h], { stripHours: true }),
    ).toBe(true);
    expect(
      await matchesAnchorHash("ventiquattro", [h], { stripHours: true }),
    ).toBe(false);
  });

  it("without stripHours, '24 ore' does NOT match '24'", async () => {
    const h = await hashAnchorAnswer("24");
    expect(await matchesAnchorHash("24 ore", [h])).toBe(false);
  });
});
