import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { initialProgress, saveProgress, type Progress } from "@/lib/progress";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
  usePathname: () => "/mappa",
}));

async function flush() {
  await act(async () => {
    await Promise.resolve();
    await new Promise((r) => setTimeout(r, 0));
  });
}

function assertState(id: number, state: "locked" | "unlocked" | "solved") {
  const el = screen.getByTestId(`marker-${id}`);
  expect(el.getAttribute("data-state")).toBe(state);
}

describe("MapPage", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("shows the loading placeholder before progress is hydrated", async () => {
    saveProgress(initialProgress());
    const { MapPage } = await import("../MapPage");
    render(<MapPage />);
    expect(screen.getByText(/CARICAMENTO MAPPA/i)).toBeInTheDocument();
  });

  it("vergine: only anchor 1 is unlocked, the rest are locked", async () => {
    saveProgress(initialProgress());
    const { MapPage } = await import("../MapPage");
    render(<MapPage />);
    await flush();

    assertState(1, "unlocked");
    for (const id of [2, 3, 4, 5, 6, 7]) {
      assertState(id, "locked");
    }
    // Header presente
    expect(screen.getByRole("heading", { name: /MAPPA/i })).toBeInTheDocument();
    // Back link a /
    const back = screen.getByRole("link", { name: /INDIETRO/i });
    expect(back).toHaveAttribute("href", "/");
  });

  it("metà: 3 risolte, 4ª sbloccata in corso, 5-7 ancora bloccate", async () => {
    const p: Progress = {
      ...initialProgress(),
      unlockedAnchors: [1, 2, 3, 4],
      fragments: { 1: "V", 2: "E", 3: "N" },
    };
    saveProgress(p);
    const { MapPage } = await import("../MapPage");
    render(<MapPage />);
    await flush();

    assertState(1, "solved");
    assertState(2, "solved");
    assertState(3, "solved");
    assertState(4, "unlocked");
    for (const id of [5, 6, 7]) {
      assertState(id, "locked");
    }

    // I tre badge dei frammenti risolti sono visibili
    expect(screen.getByTestId("marker-1-fragment").textContent).toBe("V");
    expect(screen.getByTestId("marker-2-fragment").textContent).toBe("E");
    expect(screen.getByTestId("marker-3-fragment").textContent).toBe("N");
    expect(screen.queryByTestId("marker-4-fragment")).toBeNull();
  });

  it("completato: tutte 7 risolte con frammento VENEZIA", async () => {
    const p: Progress = {
      ...initialProgress(),
      unlockedAnchors: [1, 2, 3, 4, 5, 6, 7],
      fragments: { 1: "V", 2: "E", 3: "N", 4: "E", 5: "Z", 6: "I", 7: "A" },
      completedMainQuest: true,
    };
    saveProgress(p);
    const { MapPage } = await import("../MapPage");
    render(<MapPage />);
    await flush();

    for (const id of [1, 2, 3, 4, 5, 6, 7]) {
      assertState(id, "solved");
      // ogni marker è cliccabile a /ancora/[id]
      expect(screen.getByTestId(`marker-${id}`)).toHaveAttribute(
        "href",
        `/ancora/${id}`,
      );
    }
    // Frammenti formano VENEZIA
    const fragments = [1, 2, 3, 4, 5, 6, 7]
      .map((id) => screen.getByTestId(`marker-${id}-fragment`).textContent)
      .join("");
    expect(fragments).toBe("VENEZIA");
  });

  it("renders the map background image with the expected src", async () => {
    saveProgress(initialProgress());
    const { MapPage } = await import("../MapPage");
    render(<MapPage />);
    await flush();
    const img = screen.getByAltText(/Mappa di Venezia/i) as HTMLImageElement;
    expect(img.getAttribute("src")).toBe("/images/mappa_ancore.webp");
  });
});
