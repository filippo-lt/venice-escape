import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import { webcrypto } from "node:crypto";

// jsdom does not provide SubtleCrypto — wire Node's webcrypto in.
if (!globalThis.crypto || !globalThis.crypto.subtle) {
  // @ts-expect-error — assigning webcrypto to globalThis.crypto
  globalThis.crypto = webcrypto;
}

// Stub HTMLMediaElement methods (jsdom doesn't implement them).
Object.defineProperty(HTMLMediaElement.prototype, "play", {
  configurable: true,
  value: vi.fn().mockResolvedValue(undefined),
});
Object.defineProperty(HTMLMediaElement.prototype, "pause", {
  configurable: true,
  value: vi.fn(),
});
Object.defineProperty(HTMLMediaElement.prototype, "load", {
  configurable: true,
  value: vi.fn(),
});

// Vitest 4 + jsdom 29 has a broken localStorage shim — replace with a
// minimal in-memory Storage so tests can rely on it.
class MemoryStorage implements Storage {
  private store = new Map<string, string>();
  get length() { return this.store.size; }
  clear() { this.store.clear(); }
  getItem(k: string) { return this.store.has(k) ? this.store.get(k)! : null; }
  key(i: number) { return Array.from(this.store.keys())[i] ?? null; }
  removeItem(k: string) { this.store.delete(k); }
  setItem(k: string, v: string) { this.store.set(k, String(v)); }
}
Object.defineProperty(globalThis, "localStorage", {
  configurable: true,
  value: new MemoryStorage(),
});
Object.defineProperty(globalThis, "sessionStorage", {
  configurable: true,
  value: new MemoryStorage(),
});

// matchMedia stub (used by some Next/React libs)
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

afterEach(() => {
  cleanup();
  localStorage.clear();
  sessionStorage.clear();
  vi.clearAllMocks();
});
