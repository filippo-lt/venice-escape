import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  addEasterEgg,
  canAccessAnchor,
  completeMainQuest,
  highestUnlocked,
  initialProgress,
  loadProgress,
  resetProgress,
  saveProgress,
  unlockAnchor,
} from "../progress.ts";

// minimo polyfill di localStorage per i test in Node
class MemoryStorage {
  private store = new Map<string, string>();
  getItem(k: string) {
    return this.store.has(k) ? this.store.get(k)! : null;
  }
  setItem(k: string, v: string) {
    this.store.set(k, v);
  }
  removeItem(k: string) {
    this.store.delete(k);
  }
  clear() {
    this.store.clear();
  }
  get length() {
    return this.store.size;
  }
  key(i: number) {
    return Array.from(this.store.keys())[i] ?? null;
  }
}

// @ts-expect-error — montiamo localStorage/window per il branch isBrowser
globalThis.localStorage = new MemoryStorage();
// @ts-expect-error
globalThis.window = globalThis;

beforeEach(() => {
  localStorage.clear();
});

describe("initialProgress", () => {
  it("starts with anchor 1 unlocked and nothing else", () => {
    const p = initialProgress();
    assert.deepEqual(p.unlockedAnchors, [1]);
    assert.deepEqual(p.fragments, {});
    assert.equal(p.completedMainQuest, false);
  });
});

describe("unlockAnchor", () => {
  it("adds the anchor and stores the fragment for the previous one", () => {
    const p0 = initialProgress();
    const p1 = unlockAnchor(p0, 2, { anchorId: 1, fragment: "SOGLIA" });
    assert.deepEqual(p1.unlockedAnchors, [1, 2]);
    assert.equal(p1.fragments[1], "SOGLIA");
  });

  it("is idempotent on re-unlock", () => {
    const p0 = unlockAnchor(initialProgress(), 2);
    const p1 = unlockAnchor(p0, 2);
    assert.deepEqual(p1.unlockedAnchors, [1, 2]);
  });

  it("keeps the unlock list sorted", () => {
    let p = initialProgress();
    p = unlockAnchor(p, 3);
    p = unlockAnchor(p, 2);
    assert.deepEqual(p.unlockedAnchors, [1, 2, 3]);
  });
});

describe("easter eggs", () => {
  it("de-duplicates", () => {
    let p = initialProgress();
    p = addEasterEgg(p, "bricola-3");
    p = addEasterEgg(p, "bricola-3");
    p = addEasterEgg(p, "bottiglia");
    assert.deepEqual(p.easterEggsFound, ["bricola-3", "bottiglia"]);
  });
});

describe("completeMainQuest", () => {
  it("sets the flag and a timestamp", () => {
    const p = completeMainQuest(initialProgress());
    assert.equal(p.completedMainQuest, true);
    assert.equal(typeof p.completedAt, "number");
  });
});

describe("canAccessAnchor / highestUnlocked", () => {
  it("gates access and returns highest", () => {
    const p = unlockAnchor(initialProgress(), 3);
    assert.equal(canAccessAnchor(p, 1), true);
    assert.equal(canAccessAnchor(p, 3), true);
    assert.equal(canAccessAnchor(p, 4), false);
    assert.equal(highestUnlocked(p), 3);
  });
});

describe("save/load roundtrip", () => {
  it("persists and re-reads", () => {
    let p = initialProgress();
    p = unlockAnchor(p, 2, { anchorId: 1, fragment: "SOGLIA" });
    saveProgress(p);
    const re = loadProgress();
    assert.deepEqual(re.unlockedAnchors, [1, 2]);
    assert.equal(re.fragments[1], "SOGLIA");
  });

  it("returns initial state when key is missing", () => {
    const p = loadProgress();
    assert.deepEqual(p.unlockedAnchors, [1]);
  });

  it("recovers from corrupted JSON", () => {
    localStorage.setItem("venice-escape-progress", "{not json");
    const p = loadProgress();
    assert.deepEqual(p.unlockedAnchors, [1]);
  });

  it("ignores a wrong-version blob", () => {
    localStorage.setItem(
      "venice-escape-progress",
      JSON.stringify({ version: 999, unlockedAnchors: [1, 2, 3] }),
    );
    const p = loadProgress();
    assert.deepEqual(p.unlockedAnchors, [1]);
  });

  it("resetProgress clears storage", () => {
    saveProgress(unlockAnchor(initialProgress(), 5));
    resetProgress();
    assert.deepEqual(loadProgress().unlockedAnchors, [1]);
  });
});
