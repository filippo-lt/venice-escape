import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockNextNavigation } from "@/test/mocks";

// Mock next/navigation BEFORE importing the component under test.
const router = mockNextNavigation({ searchParams: {} });

// Allow per-test override of searchParams. We default to empty.
let currentSearchParams: URLSearchParams = new URLSearchParams();
let suspendUseSearchParams = false;
vi.mock("next/navigation", async () => {
  return {
    useRouter: () => router,
    useSearchParams: () => {
      if (suspendUseSearchParams) throw new Promise(() => {});
      return currentSearchParams;
    },
    useParams: () => ({}),
    usePathname: () => "/",
    redirect: vi.fn((url: string) => {
      throw new Error(`REDIRECT:${url}`);
    }),
    notFound: vi.fn(() => {
      throw new Error("NOT_FOUND");
    }),
  };
});

import { TransitionPage } from "../TransitionPage";
import { ANCHORS, getAnchor } from "@/lib/anchors";
import {
  initialProgress,
  saveProgress,
  loadProgress,
  type Progress,
} from "@/lib/progress";

function seedProgress(overrides: Partial<Progress> = {}) {
  const base = initialProgress();
  const merged: Progress = { ...base, ...overrides };
  saveProgress(merged);
  return merged;
}

describe("TransitionPage", () => {
  beforeEach(() => {
    currentSearchParams = new URLSearchParams();
    router.replace.mockClear();
    router.push.mockClear();
    localStorage.clear();
  });

  it("redirects to anchor href when fragment not solved and no gm=skip", () => {
    const anchor = getAnchor(1)!;
    const next = getAnchor(2)!;
    seedProgress({ fragments: {} });

    render(<TransitionPage anchor={anchor} next={next} />);

    expect(router.replace).toHaveBeenCalledWith(anchor.href);
  });

  it("does not redirect when gm=skip even without solved fragment", () => {
    currentSearchParams = new URLSearchParams({ gm: "skip" });
    const anchor = getAnchor(1)!;
    const next = getAnchor(2)!;
    seedProgress({ fragments: {} });

    render(<TransitionPage anchor={anchor} next={next} />);

    expect(router.replace).not.toHaveBeenCalled();
    // Header is rendered
    expect(
      screen.getByText(/ANCORA 1 ATTIVATA/),
    ).toBeInTheDocument();
  });

  it("renders header, fragment, outro and NextDestinationCard for anchors 1..6", () => {
    for (let id = 1; id <= 6; id++) {
      const anchor = getAnchor(id)!;
      const next = getAnchor(id + 1)!;
      seedProgress({ fragments: { [id]: anchor.fragment } });

      const { unmount } = render(
        <TransitionPage anchor={anchor} next={next} />,
      );

      expect(
        screen.getByText(new RegExp(`ANCORA ${id} ATTIVATA`)),
      ).toBeInTheDocument();

      // Next destination CTA renders with next location
      expect(
        screen.getByRole("link", {
          name: new RegExp(`VERSO ${next.location.toUpperCase()}`, "i"),
        }),
      ).toBeInTheDocument();

      // The CTA href points to the next anchor.
      const link = screen.getByRole("link", {
        name: new RegExp(`VERSO ${next.location.toUpperCase()}`, "i"),
      });
      expect(link).toHaveAttribute("href", next.href);

      // Fra Celestino outro rendered when present
      if (anchor.archivistaOutro) {
        expect(
          screen.getByText(/FRA CELESTINO, SOTTOVOCE/),
        ).toBeInTheDocument();
      }

      unmount();
    }
  });

  it("renders 'AL FINALE' link when no next anchor (anchor 7)", () => {
    const anchor = getAnchor(7)!;
    seedProgress({ fragments: { 7: anchor.fragment } });

    render(<TransitionPage anchor={anchor} />);

    const link = screen.getByRole("link", { name: /AL FINALE/ });
    expect(link).toHaveAttribute("href", "/finale");
  });

  it("persists fragment to localStorage when rendering", () => {
    const anchor = getAnchor(2)!;
    const next = getAnchor(3)!;
    // Seed: user has solved anchor 2 (fragment present) but stored value differs
    seedProgress({ fragments: { 2: "WRONG" } });

    render(<TransitionPage anchor={anchor} next={next} />);

    const stored = loadProgress();
    expect(stored.fragments[2]).toBe(anchor.fragment);
  });

  it("does not overwrite when fragment already correct (idempotent)", () => {
    const anchor = getAnchor(3)!;
    const next = getAnchor(4)!;
    seedProgress({ fragments: { 3: anchor.fragment } });
    const before = localStorage.getItem("venice-escape-progress");

    render(<TransitionPage anchor={anchor} next={next} />);

    const after = localStorage.getItem("venice-escape-progress");
    expect(after).toBe(before);
  });

  it("renders outro audio button and toggles play/pause", async () => {
    const user = userEvent.setup();
    const anchor = getAnchor(1)!;
    const next = getAnchor(2)!;
    seedProgress({ fragments: { 1: anchor.fragment } });

    render(
      <TransitionPage
        anchor={anchor}
        next={next}
        outroAudio="/audio/main/ancora_1_outro.mp3"
      />,
    );

    const btn = screen.getByRole("button", { name: /Riproduci outro/i });
    expect(btn).toHaveAttribute("aria-pressed", "false");

    // Click triggers play (stubbed in setup); fire onPlay event to flip state.
    await user.click(btn);

    const audio = document.getElementById(
      "outro-audio",
    ) as HTMLAudioElement;
    expect(audio).toBeTruthy();
    // The stubbed play() does not auto-fire 'play' event in jsdom; simulate.
    act(() => {
      audio.dispatchEvent(new Event("play"));
    });
    expect(
      screen.getByRole("button", { name: /Pausa outro/i }),
    ).toHaveAttribute("aria-pressed", "true");

    // Pause path: force audio to report it's playing so the click triggers pause().
    Object.defineProperty(audio, "paused", {
      configurable: true,
      get: () => false,
    });
    const pauseSpy = vi.spyOn(audio, "pause");
    await user.click(screen.getByRole("button", { name: /Pausa outro/i }));
    expect(pauseSpy).toHaveBeenCalled();
    act(() => {
      audio.dispatchEvent(new Event("pause"));
    });
    expect(
      screen.getByRole("button", { name: /Riproduci outro/i }),
    ).toHaveAttribute("aria-pressed", "false");

    // Ended path
    act(() => {
      audio.dispatchEvent(new Event("ended"));
    });
    expect(
      screen.getByRole("button", { name: /Riproduci outro/i }),
    ).toHaveAttribute("aria-pressed", "false");
  });

  it("outro button is a no-op when audio element is missing", async () => {
    const user = userEvent.setup();
    const anchor = getAnchor(1)!;
    const next = getAnchor(2)!;
    seedProgress({ fragments: { 1: anchor.fragment } });

    render(
      <TransitionPage
        anchor={anchor}
        next={next}
        outroAudio="/audio/main/ancora_1_outro.mp3"
      />,
    );

    const audio = document.getElementById("outro-audio");
    audio?.remove();

    // Should not throw.
    await user.click(
      screen.getByRole("button", { name: /Riproduci outro/i }),
    );
  });

  it("validates ANCHORS dataset has 7 entries", () => {
    expect(ANCHORS.length).toBe(7);
  });

  it("renders the Suspense fallback (CARICAMENTO) when inner suspends", () => {
    suspendUseSearchParams = true;
    const anchor = getAnchor(1)!;
    const next = getAnchor(2)!;
    seedProgress({ fragments: { 1: anchor.fragment } });

    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<TransitionPage anchor={anchor} next={next} />);
    expect(screen.getByText(/CARICAMENTO/)).toBeInTheDocument();
    errSpy.mockRestore();
    suspendUseSearchParams = false;
  });
});
