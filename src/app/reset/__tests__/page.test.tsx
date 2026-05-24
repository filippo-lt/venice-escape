import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

import ResetPage from "../page";

describe("ResetPage /reset", () => {
  beforeEach(() => {
    pushMock.mockReset();
    localStorage.clear();
  });

  it("clears venice-escape-progress and bootSeen on mount, then shows confirmation", () => {
    localStorage.setItem(
      "venice-escape-progress",
      JSON.stringify({ unlockedAnchors: [1, 2, 3] }),
    );
    localStorage.setItem("bootSeen", "1");

    render(<ResetPage />);

    expect(localStorage.getItem("venice-escape-progress")).toBeNull();
    expect(localStorage.getItem("bootSeen")).toBeNull();
    expect(screen.getByText(/PROGRESSO AZZERATO/)).toBeInTheDocument();
    expect(screen.getByText(/Il localStorage è stato pulito/)).toBeInTheDocument();
    expect(
      screen.getByText(/La pergamena è di nuovo bianca/),
    ).toBeInTheDocument();
  });

  it("navigates to / when the TORNA ALL'INIZIO button is clicked", async () => {
    const user = userEvent.setup();
    render(<ResetPage />);
    const btn = screen.getByRole("button", { name: /TORNA ALL/i });
    expect(btn).not.toBeDisabled();
    await user.click(btn);
    expect(pushMock).toHaveBeenCalledWith("/");
  });

  it("survives localStorage.removeItem throwing", () => {
    const orig = Storage.prototype.removeItem;
    Storage.prototype.removeItem = vi.fn(() => {
      throw new Error("blocked");
    });
    try {
      // resetProgress also calls removeItem — that path should also be swallowed
      // by progress.ts; but if not, we still confirm the page mounts.
      expect(() => render(<ResetPage />)).not.toThrow();
    } finally {
      Storage.prototype.removeItem = orig;
    }
  });

  it("shows the GM header marker", () => {
    render(<ResetPage />);
    expect(screen.getByText(/GAME MASTER · RESET/)).toBeInTheDocument();
  });
});
