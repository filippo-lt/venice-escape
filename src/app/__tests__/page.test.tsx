import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

// Mock BootSequence / TitleScreen to isolate orchestrator logic.
vi.mock("@/components/home/BootSequence", () => ({
  default: ({
    mode,
    onDone,
  }: {
    mode: "full" | "fast";
    onDone: () => void;
  }) => (
    <div data-testid="boot" data-mode={mode}>
      <button type="button" onClick={onDone}>
        finish-boot
      </button>
    </div>
  ),
}));

vi.mock("@/components/home/TitleScreen", () => ({
  default: ({ onStart }: { onStart: () => void }) => (
    <div data-testid="title">
      <button type="button" onClick={onStart}>
        press-start
      </button>
    </div>
  ),
}));

import Home from "../page";

describe("Home /", () => {
  beforeEach(() => {
    pushMock.mockReset();
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("boots in full mode on first visit and renders BootSequence", () => {
    render(<Home />);
    const boot = screen.getByTestId("boot");
    expect(boot).toBeInTheDocument();
    expect(boot).toHaveAttribute("data-mode", "full");
    expect(screen.queryByTestId("title")).not.toBeInTheDocument();
  });

  it("boots in fast mode when bootSeen=1 in localStorage", () => {
    localStorage.setItem("bootSeen", "1");
    render(<Home />);
    expect(screen.getByTestId("boot")).toHaveAttribute("data-mode", "fast");
  });

  it("still plays the boot even with prefers-reduced-motion set", () => {
    window.matchMedia = vi.fn().mockImplementation((q: string) => ({
      matches: true,
      media: q,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    render(<Home />);
    expect(screen.getByTestId("boot")).toBeInTheDocument();
    expect(screen.queryByTestId("title")).not.toBeInTheDocument();
  });

  it("transitions from boot to title after onDone and persists bootSeen", async () => {
    const user = userEvent.setup();
    render(<Home />);
    await user.click(screen.getByText("finish-boot"));
    expect(screen.getByTestId("title")).toBeInTheDocument();
    expect(screen.queryByTestId("boot")).not.toBeInTheDocument();
    expect(localStorage.getItem("bootSeen")).toBe("1");
  });

  it("press start triggers exit animation then navigates to /ancora/1", async () => {
    vi.useFakeTimers();
    render(<Home />);
    // skip boot first
    act(() => {
      screen.getByText("finish-boot").click();
    });
    // press start
    act(() => {
      screen.getByText("press-start").click();
    });
    const main = document.querySelector("main");
    expect(main).toHaveClass("anim-crt-collapse");
    expect(pushMock).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(pushMock).toHaveBeenCalledWith("/ancora/1");
  });

  it("survives localStorage getItem throwing (defaults to full)", () => {
    const orig = Storage.prototype.getItem;
    Storage.prototype.getItem = vi.fn(() => {
      throw new Error("blocked");
    });
    try {
      render(<Home />);
      expect(screen.getByTestId("boot")).toHaveAttribute("data-mode", "full");
    } finally {
      Storage.prototype.getItem = orig;
    }
  });

  it("survives localStorage setItem throwing on boot completion", async () => {
    const user = userEvent.setup();
    const orig = Storage.prototype.setItem;
    Storage.prototype.setItem = vi.fn(() => {
      throw new Error("blocked");
    });
    try {
      render(<Home />);
      await user.click(screen.getByText("finish-boot"));
      expect(screen.getByTestId("title")).toBeInTheDocument();
    } finally {
      Storage.prototype.setItem = orig;
    }
  });

});
