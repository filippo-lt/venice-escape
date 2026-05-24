import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AmbientToggle from "../AmbientToggle";

describe("AmbientToggle", () => {
  let rafSpy: ReturnType<typeof vi.spyOn>;
  let cafSpy: ReturnType<typeof vi.spyOn>;
  let rafCb: FrameRequestCallback | null = null;

  beforeEach(() => {
    rafCb = null;
    rafSpy = vi
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((cb) => {
        rafCb = cb;
        return 1 as unknown as number;
      });
    cafSpy = vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
  });

  afterEach(() => {
    rafSpy.mockRestore();
    cafSpy.mockRestore();
    localStorage.clear();
  });

  it("renders the toggle button with default OFF state", () => {
    render(<AmbientToggle />);
    const btn = screen.getByRole("button", { name: /Attiva audio ambient/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute("aria-pressed", "false");
    expect(btn).toHaveTextContent("×");
  });

  it("reads initial ON state from localStorage", () => {
    localStorage.setItem("audioOn", "1");
    render(<AmbientToggle />);
    const btn = screen.getByRole("button", { name: /Disattiva audio ambient/i });
    expect(btn).toHaveAttribute("aria-pressed", "true");
    expect(btn).toHaveTextContent("♪");
  });

  it("ignores non-'1' values in localStorage", () => {
    localStorage.setItem("audioOn", "0");
    render(<AmbientToggle />);
    expect(
      screen.getByRole("button", { name: /Attiva audio ambient/i }),
    ).toHaveAttribute("aria-pressed", "false");
  });

  it("toggles state and persists '1' to localStorage", async () => {
    const user = userEvent.setup();
    render(<AmbientToggle />);
    const btn = screen.getByRole("button", { name: /Attiva audio ambient/i });
    await user.click(btn);
    expect(localStorage.getItem("audioOn")).toBe("1");
    expect(btn).toHaveAttribute("aria-pressed", "true");
  });

  it("toggles back to OFF and persists '0' to localStorage", async () => {
    localStorage.setItem("audioOn", "1");
    const user = userEvent.setup();
    render(<AmbientToggle />);
    const btn = screen.getByRole("button", { name: /Disattiva audio ambient/i });
    await user.click(btn);
    expect(localStorage.getItem("audioOn")).toBe("0");
    expect(btn).toHaveAttribute("aria-pressed", "false");
  });

  it("calls audio.play when toggled ON and audio.pause when toggled OFF", async () => {
    const user = userEvent.setup();
    const playMock = HTMLMediaElement.prototype.play as unknown as ReturnType<typeof vi.fn>;
    const pauseMock = HTMLMediaElement.prototype.pause as unknown as ReturnType<typeof vi.fn>;
    playMock.mockClear();
    pauseMock.mockClear();
    render(<AmbientToggle />);
    const btn = screen.getByRole("button", { name: /Attiva audio ambient/i });
    await user.click(btn);
    expect(playMock).toHaveBeenCalled();
    await user.click(btn);
    expect(pauseMock).toHaveBeenCalled();
  });

  it("advances the fade tick via requestAnimationFrame: partial then complete", async () => {
    const user = userEvent.setup();
    // Control performance.now so we can hit both branches of the tick.
    let fakeNow = 1000;
    const nowSpy = vi.spyOn(performance, "now").mockImplementation(() => fakeNow);
    render(<AmbientToggle />);
    const btn = screen.getByRole("button", { name: /Attiva audio ambient/i });
    await user.click(btn);
    // First tick: t < 1 → re-schedule (covers the if-truthy branch)
    fakeNow = 1300;
    act(() => {
      const cb = rafCb;
      rafCb = null;
      cb?.(fakeNow);
    });
    // Second tick: t === 1 → set fadeIdRef to null (else branch)
    fakeNow = 5000;
    act(() => {
      const cb = rafCb;
      rafCb = null;
      cb?.(fakeNow);
    });
    nowSpy.mockRestore();
    expect(rafSpy).toHaveBeenCalled();
  });

  it("hides the toggle UI but keeps the audio element when play() rejects", async () => {
    const user = userEvent.setup();
    const playMock = HTMLMediaElement.prototype.play as unknown as ReturnType<typeof vi.fn>;
    playMock.mockRejectedValueOnce(new Error("autoplay blocked"));
    const { container } = render(<AmbientToggle />);
    const btn = screen.getByRole("button", { name: /Attiva audio ambient/i });
    await user.click(btn);
    // After rejection, UI should no longer show the button.
    expect(
      screen.queryByRole("button", { name: /audio ambient/i }),
    ).not.toBeInTheDocument();
    // Audio element still rendered.
    expect(container.querySelector("audio")).not.toBeNull();
    // Reset the play mock for later tests
    playMock.mockResolvedValue(undefined);
  });

  it("handles localStorage.getItem throwing in initial read", () => {
    const spy = vi
      .spyOn(Storage.prototype, "getItem")
      .mockImplementation(() => {
        throw new Error("denied");
      });
    render(<AmbientToggle />);
    expect(
      screen.getByRole("button", { name: /Attiva audio ambient/i }),
    ).toHaveAttribute("aria-pressed", "false");
    spy.mockRestore();
  });

  it("handles localStorage.setItem throwing on toggle", async () => {
    const user = userEvent.setup();
    render(<AmbientToggle />);
    const spy = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("denied");
      });
    const btn = screen.getByRole("button", { name: /Attiva audio ambient/i });
    await user.click(btn);
    // State still toggled despite throw
    expect(btn).toHaveAttribute("aria-pressed", "true");
    spy.mockRestore();
  });

  it("cleans up animation frame on unmount", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<AmbientToggle />);
    const btn = screen.getByRole("button", { name: /Attiva audio ambient/i });
    await user.click(btn);
    unmount();
    expect(cafSpy).toHaveBeenCalled();
  });

  it("handles play() returning undefined (no .catch path)", async () => {
    const user = userEvent.setup();
    const playMock = HTMLMediaElement.prototype.play as unknown as ReturnType<typeof vi.fn>;
    // @ts-expect-error — intentionally returning undefined to exercise the guard
    playMock.mockReturnValueOnce(undefined);
    render(<AmbientToggle />);
    const btn = screen.getByRole("button", { name: /Attiva audio ambient/i });
    await user.click(btn);
    // No throw; UI stays mounted.
    expect(btn).toHaveAttribute("aria-pressed", "true");
    playMock.mockResolvedValue(undefined);
  });

  it("renders the audio element with correct src and loop", () => {
    const { container } = render(<AmbientToggle />);
    const audio = container.querySelector("audio");
    expect(audio).not.toBeNull();
    expect(audio?.getAttribute("src")).toBe("/audio/ambient/ambient_lagoon.mp3");
    expect(audio?.hasAttribute("loop")).toBe(true);
  });
});
