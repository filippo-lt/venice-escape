import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockNextNavigation, mockNextImage } from "@/test/mocks";

// Mock next/navigation + next/image BEFORE importing the component under test.
const router = mockNextNavigation({ params: { id: "1" } });
mockNextImage();

// Dynamic imports after mocks are in place.
const { AnchorPage } = await import("../AnchorPage");
const { getAnchor } = await import("@/lib/anchors");
const { initialProgress } = await import("@/lib/progress");

const STORAGE_KEY = "venice-escape-progress";

function seedProgress(partial: Partial<ReturnType<typeof initialProgress>> = {}) {
  const p = { ...initialProgress(), ...partial };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  return p;
}

describe("AnchorPage", () => {
  beforeEach(() => {
    localStorage.clear();
    router.push.mockClear();
  });

  it("renders anchor 1 with location, intro, audio player and command bar", async () => {
    seedProgress();
    const anchor = getAnchor(1)!;

    render(<AnchorPage anchor={anchor} />);

    // SceneFrame label (uppercased)
    expect(
      screen.getByText(/SCENE 01 — STAZIONE/i),
    ).toBeInTheDocument();
    // Audio player label
    expect(
      screen.getByText(/VOICE\.WAV — Fra Celestino · Ancora 1/),
    ).toBeInTheDocument();
    // Archivista intro is rendered
    expect(
      screen.getByText(/L'ARCHIVISTA TRASMETTE/),
    ).toBeInTheDocument();
    // Command bar input
    expect(
      screen.getByLabelText(/Risposta all'enigma/i),
    ).toBeInTheDocument();
    // Easter egg button rendered for ancora 1
    expect(
      screen.getByRole("button", { name: /indizio nascosto/i }),
    ).toBeInTheDocument();
  });

  it("renders the doveCercare block and translation note when present", () => {
    seedProgress();
    const anchor = getAnchor(1)!;
    render(<AnchorPage anchor={anchor} />);

    expect(screen.getByText(/DOVE CERCARE/)).toBeInTheDocument();
    expect(screen.getByText(/TRADUZIONE DEL FRAMMENTO/)).toBeInTheDocument();
    // archivistaNota appears in italics with brackets
    expect(
      screen.getByText(/Nota dell'Archivista/i),
    ).toBeInTheDocument();
  });

  it("rejects a wrong answer with feedback and does not navigate or unlock", async () => {
    const user = userEvent.setup();
    seedProgress();
    const anchor = getAnchor(1)!;

    render(<AnchorPage anchor={anchor} />);

    const input = screen.getByLabelText(/Risposta all'enigma/i);
    await user.type(input, "sbagliato");
    await user.click(screen.getByRole("button", { name: /INVIO/i }));

    await waitFor(() =>
      expect(
        screen.getByText(/Fra Celestino scuote la testa/i),
      ).toBeInTheDocument(),
    );

    expect(router.push).not.toHaveBeenCalled();
    const raw = localStorage.getItem(STORAGE_KEY)!;
    const stored = JSON.parse(raw);
    // Anchor 2 must NOT be unlocked
    expect(stored.unlockedAnchors).toEqual([1]);
    expect(stored.fragments).toEqual({});
  });

  it("accepts a correct answer for ancora 1 (cristo), unlocks next and navigates", async () => {
    const user = userEvent.setup();
    seedProgress();
    const anchor = getAnchor(1)!;

    render(<AnchorPage anchor={anchor} />);

    const input = screen.getByLabelText(/Risposta all'enigma/i);
    await user.type(input, "Cristo");
    await user.click(screen.getByRole("button", { name: /INVIO/i }));

    await waitFor(() =>
      expect(router.push).toHaveBeenCalledWith("/transizione/1"),
    );

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(stored.unlockedAnchors).toContain(2);
    expect(stored.fragments[1]).toBe(anchor.fragment);
  });

  it("accepts variant 'il Cristo' (article stripped via normalize)", async () => {
    const user = userEvent.setup();
    seedProgress();
    const anchor = getAnchor(1)!;

    render(<AnchorPage anchor={anchor} />);
    await user.type(
      screen.getByLabelText(/Risposta all'enigma/i),
      "il Cristo",
    );
    await user.click(screen.getByRole("button", { name: /INVIO/i }));

    await waitFor(() =>
      expect(router.push).toHaveBeenCalledWith("/transizione/1"),
    );
  });

  it("accepts answer with stripHours option (ancora 6: '24 ore')", async () => {
    const user = userEvent.setup();
    seedProgress({ unlockedAnchors: [1, 2, 3, 4, 5, 6] });
    const anchor = getAnchor(6)!;

    render(<AnchorPage anchor={anchor} />);
    await user.type(
      screen.getByLabelText(/Risposta all'enigma/i),
      "24 ore",
    );
    await user.click(screen.getByRole("button", { name: /INVIO/i }));

    await waitFor(() =>
      expect(router.push).toHaveBeenCalledWith("/transizione/6"),
    );
  });

  it("reveals progressive hints after repeated wrong answers", async () => {
    const user = userEvent.setup();
    seedProgress();
    const anchor = getAnchor(1)!;
    render(<AnchorPage anchor={anchor} />);

    // No hints visible at start
    expect(screen.queryByText(/FRA CELESTINO BORBOTTA/)).not.toBeInTheDocument();

    const input = screen.getByLabelText(/Risposta all'enigma/i);
    const submit = screen.getByRole("button", { name: /INVIO/i });

    // 2 wrong answers ⇒ floor(2/2)=1 hint
    for (let i = 0; i < 2; i++) {
      await user.clear(input);
      await user.type(input, `nope${i}`);
      await user.click(submit);
      await waitFor(() =>
        expect(screen.getByText(/scuote la testa/i)).toBeInTheDocument(),
      );
    }

    expect(screen.getByText(/FRA CELESTINO BORBOTTA/)).toBeInTheDocument();
    // First hint text fragment
    expect(
      screen.getByText(/Non contate le statue/i),
    ).toBeInTheDocument();
  });

  it("registers an easter egg tap into localStorage and shows a toast", async () => {
    const user = userEvent.setup();
    seedProgress();
    const anchor = getAnchor(1)!;

    render(<AnchorPage anchor={anchor} />);

    const egg = screen.getByRole("button", { name: /indizio nascosto/i });
    await user.click(egg);

    expect(screen.getByText(/INDIZIO TROVATO/)).toBeInTheDocument();

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(stored.easterEggsFound).toContain("cristo-soglia");

    // Toast disappears after timeout
    await act(async () => {
      await new Promise((r) => setTimeout(r, 1700));
    });
    expect(screen.queryByText(/INDIZIO TROVATO/)).not.toBeInTheDocument();
  });

  it("does nothing on easter egg tap when anchor has no easterEgg (defensive)", () => {
    seedProgress();
    const anchor = getAnchor(1)!;
    // Strip the easter egg
    const stripped = { ...anchor, easterEgg: undefined };
    render(<AnchorPage anchor={stripped} />);
    expect(
      screen.queryByRole("button", { name: /indizio nascosto/i }),
    ).not.toBeInTheDocument();
  });

  it("renders without crashing when localStorage progress hasn't loaded yet (no fragments)", () => {
    // Don't seed — loadProgress returns initial; component still mounts
    const anchor = getAnchor(2)!;
    render(<AnchorPage anchor={anchor} />);
    expect(screen.getByText(/SCENE 02/)).toBeInTheDocument();
  });
});
