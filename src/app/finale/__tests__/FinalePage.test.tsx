import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, fireEvent, within } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { makeRouter } from "@/test/mocks";
import {
  initialProgress,
  saveProgress,
  type Progress,
} from "@/lib/progress";

// Hoisted mock state so vi.mock factory can reach it.
const navState = vi.hoisted(() => ({
  router: {
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  },
  search: new URLSearchParams(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => navState.router,
  useSearchParams: () => navState.search,
  useParams: () => ({}),
  usePathname: () => "/finale",
}));

function seedCompletedProgress(): Progress {
  const p: Progress = {
    ...initialProgress(),
    unlockedAnchors: [1, 2, 3, 4, 5, 6, 7],
    fragments: { 1: "V", 2: "E", 3: "N", 4: "E", 5: "Z", 6: "I", 7: "A" },
    completedMainQuest: false, // verify it gets set to true by effect
  };
  saveProgress(p);
  return p;
}

async function flush() {
  // give useSyncExternalStore's queueMicrotask + effect time to run
  await act(async () => {
    await Promise.resolve();
    await new Promise((r) => setTimeout(r, 0));
  });
}

describe("FinalePage", () => {
  beforeEach(() => {
    navState.router = makeRouter();
    navState.search = new URLSearchParams();
    localStorage.clear();
    // Reset the FinalePage module-level cachedProgress between tests by
    // re-importing fresh.
    vi.resetModules();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("shows the loading placeholder before progress is hydrated", async () => {
    seedCompletedProgress();
    const { FinalePage } = await import("../FinalePage");
    render(<FinalePage />);
    expect(screen.getByText(/CARICAMENTO FINALE/i)).toBeInTheDocument();
  });

  it("renders the full finale when main quest is complete", async () => {
    seedCompletedProgress();
    const { FinalePage } = await import("../FinalePage");
    render(<FinalePage />);
    await flush();

    // Composition heading
    expect(
      screen.getByText(/I FRAMMENTI SI COMPONGONO/i),
    ).toBeInTheDocument();
    // Fra Celestino outro section title (header + audio label both mention "ADDIO")
    expect(screen.getAllByText(/ADDIO/i).length).toBeGreaterThan(0);
    // The dialog box speaker
    expect(screen.getAllByText(/FRA CELESTINO/i).length).toBeGreaterThan(0);
    // Final closing section
    expect(screen.getByText(/FINE DELLA MAIN QUEST/i)).toBeInTheDocument();
    // Easter egg counter (0/7 default)
    expect(screen.getByText(/INDIZI TROVATI: 0\/7/i)).toBeInTheDocument();
    // Return CTA link
    const ret = screen.getByRole("link", { name: /TORNA VERSO LA STAZIONE/i });
    expect(ret).toHaveAttribute("href", "/mappa?focus=ritorno");
    // Manoscritto disabled placeholder
    expect(
      screen.getByText(/in arrivo nelle prossime settimane/i),
    ).toBeInTheDocument();
    // The image hero
    const img = screen.getByAltText(/Venezia all'alba/i) as HTMLImageElement;
    expect(img.getAttribute("src")).toBe("/images/finale_venezia.webp");
  });

  it("sets completedMainQuest=true after first render with complete fragments", async () => {
    seedCompletedProgress();
    const { FinalePage } = await import("../FinalePage");
    render(<FinalePage />);
    await flush();

    const stored = JSON.parse(
      localStorage.getItem("venice-escape-progress")!,
    ) as Progress;
    expect(stored.completedMainQuest).toBe(true);
    expect(typeof stored.completedAt).toBe("number");
    expect(navState.router.replace).not.toHaveBeenCalled();
  });

  it("redirects to first missing anchor when fragments incomplete", async () => {
    const p: Progress = {
      ...initialProgress(),
      unlockedAnchors: [1, 2, 3],
      // missing fragment for anchor 3
      fragments: { 1: "V", 2: "E" },
    };
    saveProgress(p);
    const { FinalePage } = await import("../FinalePage");
    render(<FinalePage />);
    await flush();
    expect(navState.router.replace).toHaveBeenCalledWith("/ancora/3");
  });

  it("re-reads fresh progress on remount instead of a stale cache", async () => {
    // 1ª visita con progresso incompleto → redirect e cache popolata.
    saveProgress({
      ...initialProgress(),
      fragments: { 1: "V", 2: "E" },
    });
    const { FinalePage } = await import("../FinalePage");
    const { unmount } = render(<FinalePage />);
    await flush();
    expect(navState.router.replace).toHaveBeenCalledWith("/ancora/3");
    unmount();

    // L'utente completa la quest e torna su /finale: niente redirect stantio.
    navState.router = makeRouter();
    saveProgress({
      ...initialProgress(),
      fragments: { 1: "V", 2: "E", 3: "N", 4: "E", 5: "Z", 6: "I", 7: "A" },
    });
    render(<FinalePage />);
    await flush();
    expect(navState.router.replace).not.toHaveBeenCalled();
    expect(screen.getByText(/FINE DELLA MAIN QUEST/i)).toBeInTheDocument();
  });

  it("bypasses redirect when ?gm=skip", async () => {
    navState.search = new URLSearchParams({ gm: "skip" });
    // fresh progress with NO fragments
    saveProgress(initialProgress());
    const { FinalePage } = await import("../FinalePage");
    render(<FinalePage />);
    await flush();
    expect(navState.router.replace).not.toHaveBeenCalled();
    // page rendered with all '?' letters
    expect(
      screen.getByLabelText(/Composizione: \? \? \? \? \? \? \?/),
    ).toBeInTheDocument();
  });

  it("bypasses redirect when ?from=ancora7 even without all fragments", async () => {
    navState.search = new URLSearchParams({ from: "ancora7" });
    const p: Progress = {
      ...initialProgress(),
      fragments: { 1: "V", 2: "E" },
    };
    saveProgress(p);
    const { FinalePage } = await import("../FinalePage");
    render(<FinalePage />);
    await flush();
    expect(navState.router.replace).not.toHaveBeenCalled();
    expect(screen.getByText(/FINE DELLA MAIN QUEST/i)).toBeInTheDocument();
  });

  it("shows the segreti placeholder text when easterEggsFound >= 3", async () => {
    const p: Progress = {
      ...initialProgress(),
      fragments: { 1: "V", 2: "E", 3: "N", 4: "E", 5: "Z", 6: "I", 7: "A" },
      easterEggsFound: ["a", "b", "c"],
      completedMainQuest: true,
    };
    saveProgress(p);
    const { FinalePage } = await import("../FinalePage");
    render(<FinalePage />);
    await flush();
    expect(screen.getByText(/INDIZI TROVATI: 3\/7/)).toBeInTheDocument();
    expect(
      screen.getByText(/I segreti vi attenderanno nel manoscritto/i),
    ).toBeInTheDocument();
  });

  it("does not re-save progress when already completed", async () => {
    const p: Progress = {
      ...initialProgress(),
      fragments: { 1: "V", 2: "E", 3: "N", 4: "E", 5: "Z", 6: "I", 7: "A" },
      completedMainQuest: true,
      completedAt: 12345,
    };
    saveProgress(p);
    const { FinalePage } = await import("../FinalePage");
    render(<FinalePage />);
    await flush();
    const after = JSON.parse(
      localStorage.getItem("venice-escape-progress")!,
    ) as Progress;
    expect(after.completedAt).toBe(12345);
  });

  it("renders the audio player with the finale src", async () => {
    seedCompletedProgress();
    const { FinalePage } = await import("../FinalePage");
    render(<FinalePage />);
    await flush();
    const audio = document.querySelector("audio") as HTMLAudioElement;
    expect(audio).toBeTruthy();
    expect(audio.getAttribute("src")).toBe("/audio/main/finale.mp3");
  });

  // ---------- Beat 4: titoli di coda ----------

  function creditsAudio(): HTMLAudioElement | null {
    return document.querySelector<HTMLAudioElement>(
      'audio[src="/audio/main/credits_loop.mp3"]',
    );
  }

  async function openCredits() {
    seedCompletedProgress();
    const { FinalePage } = await import("../FinalePage");
    render(<FinalePage />);
    await flush();
    fireEvent.click(
      screen.getByRole("button", { name: /TITOLI DI CODA/i }),
    );
    return screen.getByRole("dialog", { name: /Titoli di coda/i });
  }

  it("opens the credits overlay with the chiptune loop on demand", async () => {
    const dialog = await openCredits();
    expect(within(dialog).getByText(/LE SETTE ÀNCORE/i)).toBeInTheDocument();
    expect(within(dialog).getByText(/IL LETTORE ELETTO/i)).toBeInTheDocument();
    const audio = creditsAudio();
    expect(audio).toBeTruthy();
    expect(audio!.loop).toBe(true);
    // Skip layer present while rolling.
    expect(
      within(dialog).getByRole("button", { name: /Salta i titoli di coda/i }),
    ).toBeInTheDocument();
  });

  it("closes the credits overlay via the ✕ button", async () => {
    await openCredits();
    fireEvent.click(
      screen.getByRole("button", { name: /Chiudi i titoli di coda/i }),
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("skips to the static FINE state on tap", async () => {
    const dialog = await openCredits();
    fireEvent.click(
      within(dialog).getByRole("button", { name: /Salta i titoli di coda/i }),
    );
    expect(within(dialog).getByText(/▸ FINE ◂/)).toBeInTheDocument();
    expect(within(dialog).getByText(/vai a casa, Cirpo/i)).toBeInTheDocument();
    // The way home is still reachable from the final state.
    const ret = within(dialog).getByRole("link", {
      name: /TORNA VERSO LA STAZIONE/i,
    });
    expect(ret).toHaveAttribute("href", "/mappa?focus=ritorno");
    // No skip layer once ended.
    expect(
      within(dialog).queryByRole("button", { name: /Salta i titoli di coda/i }),
    ).not.toBeInTheDocument();
  });

  it("toggles the credits audio mute state", async () => {
    const dialog = await openCredits();
    const audio = creditsAudio()!;
    const mute = within(dialog).getByRole("button", {
      name: /Silenzia l'audio/i,
    });
    fireEvent.click(mute);
    expect(audio.muted).toBe(true);
    // Label flips, allowing re-enable.
    const unmute = within(dialog).getByRole("button", {
      name: /Riattiva l'audio/i,
    });
    fireEvent.click(unmute);
    expect(audio.muted).toBe(false);
  });

  it("renders the credits statically (no skip layer) under reduced motion", async () => {
    const originalMM = window.matchMedia;
    window.matchMedia = vi.fn().mockReturnValue({
      matches: true,
      media: "(prefers-reduced-motion: reduce)",
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });

    seedCompletedProgress();
    const { FinalePage } = await import("../FinalePage");
    render(<FinalePage />);
    await flush();
    fireEvent.click(screen.getByRole("button", { name: /TITOLI DI CODA/i }));
    const dialog = screen.getByRole("dialog", { name: /Titoli di coda/i });

    // Full content readable at once: cast list AND final block both present.
    expect(within(dialog).getByText(/LE SETTE ÀNCORE/i)).toBeInTheDocument();
    expect(within(dialog).getByText(/vai a casa, Cirpo/i)).toBeInTheDocument();
    // No automatic-scroll skip layer.
    expect(
      within(dialog).queryByRole("button", { name: /Salta i titoli di coda/i }),
    ).not.toBeInTheDocument();

    window.matchMedia = originalMM;
  });

  it("restores body scroll when the credits overlay closes", async () => {
    await openCredits();
    expect(document.body.style.overflow).toBe("hidden");
    fireEvent.click(
      screen.getByRole("button", { name: /Chiudi i titoli di coda/i }),
    );
    expect(document.body.style.overflow).not.toBe("hidden");
  });

  it("renders the loading state via SSR (exercises server snapshots)", async () => {
    const { FinalePage } = await import("../FinalePage");
    const html = renderToString(<FinalePage />);
    expect(html).toContain("CARICAMENTO FINALE");
  });

  it("falls back gracefully when matchMedia is unavailable", async () => {
    const original = window.matchMedia;
    // @ts-expect-error simulating environments without matchMedia
    delete window.matchMedia;
    seedCompletedProgress();
    const { FinalePage } = await import("../FinalePage");
    const { unmount } = render(<FinalePage />);
    await flush();
    // Still renders something even with no matchMedia.
    expect(screen.getByText(/I FRAMMENTI SI COMPONGONO/i)).toBeInTheDocument();
    unmount();
    window.matchMedia = original;
  });

  it("subscribes to matchMedia for reduced motion and unsubscribes on unmount", async () => {
    const addEventListener = vi.fn();
    const removeEventListener = vi.fn();
    const originalMM = window.matchMedia;
    window.matchMedia = vi.fn().mockReturnValue({
      matches: true,
      media: "(prefers-reduced-motion: reduce)",
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener,
      removeEventListener,
      dispatchEvent: vi.fn(),
    });

    seedCompletedProgress();
    const { FinalePage } = await import("../FinalePage");
    const { unmount } = render(<FinalePage />);
    await flush();
    expect(addEventListener).toHaveBeenCalledWith("change", expect.any(Function));
    unmount();
    expect(removeEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function),
    );

    window.matchMedia = originalMM;
  });
});
