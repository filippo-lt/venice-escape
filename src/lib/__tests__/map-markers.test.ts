import { describe, it, expect } from "vitest";
import { MAP_MARKERS, MAP_MARKER_IDS } from "../map-markers";

describe("MAP_MARKERS", () => {
  it("contains exactly 7 entries for ids 1..7", () => {
    const ids = Object.keys(MAP_MARKERS)
      .map((k) => Number(k))
      .sort((a, b) => a - b);
    expect(ids).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("MAP_MARKER_IDS mirrors the entries 1..7 in order", () => {
    expect([...MAP_MARKER_IDS]).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("every coordinate is a finite number in [0, 100]", () => {
    for (const id of MAP_MARKER_IDS) {
      const { top, left } = MAP_MARKERS[id];
      expect(Number.isFinite(top)).toBe(true);
      expect(Number.isFinite(left)).toBe(true);
      expect(top).toBeGreaterThanOrEqual(0);
      expect(top).toBeLessThanOrEqual(100);
      expect(left).toBeGreaterThanOrEqual(0);
      expect(left).toBeLessThanOrEqual(100);
    }
  });

  it("keeps markers inside the safe area (≥5, ≤95) to avoid the frame", () => {
    // Soft contract: la cornice decorativa della mappa occupa qualche % ai bordi.
    for (const id of MAP_MARKER_IDS) {
      const { top, left } = MAP_MARKERS[id];
      expect(top).toBeGreaterThanOrEqual(5);
      expect(top).toBeLessThanOrEqual(95);
      expect(left).toBeGreaterThanOrEqual(5);
      expect(left).toBeLessThanOrEqual(95);
    }
  });
});
