import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  addEasterEgg,
  addFragment,
  canAccessAnchor,
  completeMainQuest,
  firstMissingFragment,
  highestUnlocked,
  initialProgress,
  loadProgress,
  resetProgress,
  saveProgress,
  unlockAnchor,
} from "../progress";

beforeEach(() => {
  localStorage.clear();
});

describe("initialProgress", () => {
  it("starts with anchor 1 unlocked and nothing else", () => {
    const p = initialProgress();
    expect(p.unlockedAnchors).toEqual([1]);
    expect(p.fragments).toEqual({});
    expect(p.completedMainQuest).toBe(false);
  });
});

describe("unlockAnchor", () => {
  it("adds the anchor and stores the fragment for the previous one", () => {
    const p0 = initialProgress();
    const p1 = unlockAnchor(p0, 2, { anchorId: 1, fragment: "SOGLIA" });
    expect(p1.unlockedAnchors).toEqual([1, 2]);
    expect(p1.fragments[1]).toBe("SOGLIA");
  });

  it("is idempotent on re-unlock", () => {
    const p0 = unlockAnchor(initialProgress(), 2);
    const p1 = unlockAnchor(p0, 2);
    expect(p1.unlockedAnchors).toEqual([1, 2]);
  });

  it("keeps the unlock list sorted", () => {
    let p = initialProgress();
    p = unlockAnchor(p, 3);
    p = unlockAnchor(p, 2);
    expect(p.unlockedAnchors).toEqual([1, 2, 3]);
  });
});

describe("easter eggs", () => {
  it("de-duplicates", () => {
    let p = initialProgress();
    p = addEasterEgg(p, "bricola-3");
    p = addEasterEgg(p, "bricola-3");
    p = addEasterEgg(p, "bottiglia");
    expect(p.easterEggsFound).toEqual(["bricola-3", "bottiglia"]);
  });
});

describe("completeMainQuest", () => {
  it("sets the flag and a timestamp", () => {
    const p = completeMainQuest(initialProgress());
    expect(p.completedMainQuest).toBe(true);
    expect(typeof p.completedAt).toBe("number");
  });
});

describe("canAccessAnchor / highestUnlocked", () => {
  it("gates access and returns highest", () => {
    const p = unlockAnchor(initialProgress(), 3);
    expect(canAccessAnchor(p, 1)).toBe(true);
    expect(canAccessAnchor(p, 3)).toBe(true);
    expect(canAccessAnchor(p, 4)).toBe(false);
    expect(highestUnlocked(p)).toBe(3);
  });
});

describe("save/load roundtrip", () => {
  it("persists and re-reads", () => {
    let p = initialProgress();
    p = unlockAnchor(p, 2, { anchorId: 1, fragment: "SOGLIA" });
    saveProgress(p);
    const re = loadProgress();
    expect(re.unlockedAnchors).toEqual([1, 2]);
    expect(re.fragments[1]).toBe("SOGLIA");
  });

  it("returns initial state when key is missing", () => {
    const p = loadProgress();
    expect(p.unlockedAnchors).toEqual([1]);
  });

  it("recovers from corrupted JSON", () => {
    localStorage.setItem("venice-escape-progress", "{not json");
    const p = loadProgress();
    expect(p.unlockedAnchors).toEqual([1]);
  });

  it("ignores a wrong-version blob", () => {
    localStorage.setItem(
      "venice-escape-progress",
      JSON.stringify({ version: 999, unlockedAnchors: [1, 2, 3] }),
    );
    const p = loadProgress();
    expect(p.unlockedAnchors).toEqual([1]);
  });

  it("resetProgress clears storage", () => {
    saveProgress(unlockAnchor(initialProgress(), 5));
    resetProgress();
    expect(loadProgress().unlockedAnchors).toEqual([1]);
  });

  it("merges partial stored progress with initial state", () => {
    localStorage.setItem(
      "venice-escape-progress",
      JSON.stringify({ version: 1, unlockedAnchors: [1, 2, 3] }),
    );
    const p = loadProgress();
    expect(p.unlockedAnchors).toEqual([1, 2, 3]);
    // Fields not in stored blob fall back to initialProgress defaults
    expect(p.fragments).toEqual({});
    expect(p.easterEggsFound).toEqual([]);
    expect(p.completedMainQuest).toBe(false);
  });

  it("unlockAnchor without fragment leaves fragments untouched", () => {
    const p0 = initialProgress();
    const p1 = unlockAnchor(p0, 2);
    expect(p1.fragments).toBe(p0.fragments);
  });

  it("addEasterEgg returns same object when already present", () => {
    const p0 = addEasterEgg(initialProgress(), "egg-1");
    const p1 = addEasterEgg(p0, "egg-1");
    expect(p1).toBe(p0);
  });

  it("completeMainQuest is idempotent", () => {
    const p0 = completeMainQuest(initialProgress());
    const p1 = completeMainQuest(p0);
    expect(p1).toBe(p0);
  });

  it("highestUnlocked returns 1 when list is empty", () => {
    const p = { ...initialProgress(), unlockedAnchors: [] };
    expect(highestUnlocked(p)).toBe(1);
  });
});

describe("addFragment", () => {
  it("adds a new fragment for an anchor", () => {
    const p = addFragment(initialProgress(), 2, "E");
    expect(p.fragments[2]).toBe("E");
  });

  it("is idempotent when the same letter is already present", () => {
    const p0 = addFragment(initialProgress(), 2, "E");
    const p1 = addFragment(p0, 2, "E");
    expect(p1).toBe(p0);
  });

  it("overwrites when a different letter is provided", () => {
    const p0 = addFragment(initialProgress(), 2, "E");
    const p1 = addFragment(p0, 2, "Z");
    expect(p1.fragments[2]).toBe("Z");
    expect(p1).not.toBe(p0);
  });
});

describe("firstMissingFragment", () => {
  it("returns 1 when no fragments are present", () => {
    expect(firstMissingFragment(initialProgress())).toBe(1);
  });

  it("returns the first gap id", () => {
    let p = initialProgress();
    p = addFragment(p, 1, "V");
    p = addFragment(p, 2, "E");
    expect(firstMissingFragment(p)).toBe(3);
  });

  it("treats empty/whitespace fragments as missing", () => {
    let p = initialProgress();
    p = addFragment(p, 1, "V");
    p = addFragment(p, 2, "   ");
    expect(firstMissingFragment(p)).toBe(2);
  });

  it("returns null when all fragments up to total are present", () => {
    let p = initialProgress();
    for (let i = 1; i <= 7; i++) p = addFragment(p, i, "X");
    expect(firstMissingFragment(p)).toBeNull();
  });

  it("honors custom total", () => {
    let p = initialProgress();
    p = addFragment(p, 1, "V");
    p = addFragment(p, 2, "E");
    expect(firstMissingFragment(p, 2)).toBeNull();
  });
});

describe("SSR (non-browser) branches", () => {
  it("loadProgress returns initial state when window is undefined", () => {
    const originalWindow = globalThis.window;
    // @ts-expect-error simulate SSR
    delete globalThis.window;
    try {
      const p = loadProgress();
      expect(p.unlockedAnchors).toEqual([1]);
    } finally {
      globalThis.window = originalWindow;
    }
  });

  it("saveProgress is a no-op when window is undefined", () => {
    const originalWindow = globalThis.window;
    // @ts-expect-error simulate SSR
    delete globalThis.window;
    try {
      expect(() => saveProgress(initialProgress())).not.toThrow();
    } finally {
      globalThis.window = originalWindow;
    }
    // Storage should not contain key (no save happened)
    expect(localStorage.getItem("venice-escape-progress")).toBeNull();
  });

  it("resetProgress is a no-op when window is undefined", () => {
    saveProgress(unlockAnchor(initialProgress(), 3));
    const originalWindow = globalThis.window;
    // @ts-expect-error simulate SSR
    delete globalThis.window;
    try {
      expect(() => resetProgress()).not.toThrow();
    } finally {
      globalThis.window = originalWindow;
    }
    // Storage was not cleared
    expect(localStorage.getItem("venice-escape-progress")).not.toBeNull();
  });
});

// keep vi import referenced in case future tests need it
void vi;
