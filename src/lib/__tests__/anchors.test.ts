import { describe, it, expect } from "vitest";
import { ANCHORS, TOTAL_ANCHORS, getAnchor } from "../anchors";

const HEX64 = /^[0-9a-f]{64}$/;

describe("ANCHORS catalogue", () => {
  it("has exactly 7 anchors", () => {
    expect(TOTAL_ANCHORS).toBe(7);
    expect(ANCHORS).toHaveLength(7);
  });

  it("fragment letters spell VENEZIA in order", () => {
    const word = ANCHORS.map((a) => a.fragment).join("");
    expect(word).toBe("VENEZIA");
  });

  it.each(ANCHORS.map((a) => [a.id, a] as const))(
    "anchor %i has a valid shape",
    (_id, a) => {
      expect(typeof a.id).toBe("number");
      expect(a.id).toBeGreaterThanOrEqual(1);
      expect(a.id).toBeLessThanOrEqual(7);
      expect(typeof a.slug).toBe("string");
      expect(a.slug.length).toBeGreaterThan(0);
      expect(typeof a.location).toBe("string");
      expect(a.location.length).toBeGreaterThan(0);
      expect(typeof a.theme).toBe("string");
      expect(a.theme.length).toBeGreaterThan(0);
      expect(typeof a.fragment).toBe("string");
      expect(a.fragment.length).toBe(1);
      expect(a.href).toBe(`/ancora/${a.id}`);
      expect(a.audioMain).toBe(`/audio/main/ancora_${a.id}.mp3`);
      expect(a.scene).toBe(`/images/ancora-${a.id}/ancora_${a.id}_scene.png`);
      expect(Array.isArray(a.acceptedHashes)).toBe(true);
      expect(a.acceptedHashes.length).toBeGreaterThan(0);
    },
  );

  it("every accepted hash is a 64-char lowercase hex SHA-256", () => {
    for (const a of ANCHORS) {
      for (const h of a.acceptedHashes) {
        expect(h).toMatch(HEX64);
      }
    }
  });

  it("only anchor 6 has normalize.stripHours === true", () => {
    for (const a of ANCHORS) {
      if (a.id === 6) {
        expect(a.normalize?.stripHours).toBe(true);
      } else {
        expect(a.normalize?.stripHours).toBeFalsy();
      }
    }
  });

  it("every easterEgg (when present) has hitbox numbers within 0-100", () => {
    for (const a of ANCHORS) {
      if (!a.easterEgg) continue;
      const { top, left, width, height } = a.easterEgg.hitbox;
      for (const v of [top, left, width, height]) {
        expect(typeof v).toBe("number");
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(100);
      }
      expect(typeof a.easterEgg.id).toBe("string");
      expect(a.easterEgg.id.length).toBeGreaterThan(0);
      expect(typeof a.easterEgg.toast).toBe("string");
    }
  });

  it("ids are unique and sequential 1..7", () => {
    const ids = ANCHORS.map((a) => a.id);
    expect(ids).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("slugs are unique", () => {
    const slugs = ANCHORS.map((a) => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("getAnchor", () => {
  it("returns the matching anchor by id", () => {
    const a = getAnchor(3);
    expect(a).toBeDefined();
    expect(a?.id).toBe(3);
    expect(a?.slug).toBe("santa-margherita");
  });

  it("returns the first anchor for id 1", () => {
    expect(getAnchor(1)?.fragment).toBe("V");
  });

  it("returns undefined for an unknown id", () => {
    expect(getAnchor(0)).toBeUndefined();
    expect(getAnchor(99)).toBeUndefined();
    expect(getAnchor(-1)).toBeUndefined();
  });
});
