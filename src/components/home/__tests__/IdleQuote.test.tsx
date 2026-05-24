import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import IdleQuote from "../IdleQuote";

describe("IdleQuote", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders nothing initially", () => {
    const { container } = render(<IdleQuote />);
    expect(container.querySelector("p")).toBeNull();
  });

  it("shows first-visit quote after 5s on first visit and marks firstVisit", () => {
    render(<IdleQuote />);
    expect(localStorage.getItem("firstVisit")).toBe("0");
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(
      screen.getByText(/Sète àncore\. Un novizo\. Una sola sera\. Andèmo\./),
    ).toBeInTheDocument();
  });

  it("shows a non-first quote on subsequent visit", () => {
    localStorage.setItem("firstVisit", "0");
    // Force Math.random to a deterministic value so we know which quote we get.
    const randSpy = vi.spyOn(Math, "random").mockReturnValue(0);
    render(<IdleQuote />);
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    // With random=0 → idx = floor(0 * 7) + 1 = 1 → second quote.
    expect(
      screen.getByText(/Ostrega, ancora qua\? La Serenissima no la speta\./),
    ).toBeInTheDocument();
    randSpy.mockRestore();
  });

  it("does not show the quote before 5s elapse", () => {
    render(<IdleQuote />);
    act(() => {
      vi.advanceTimersByTime(4999);
    });
    expect(screen.queryByText(/Sète àncore/)).not.toBeInTheDocument();
  });

  it("resets the timer on mousemove and re-hides any visible quote", () => {
    render(<IdleQuote />);
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getByText(/Sète àncore/)).toBeInTheDocument();
    act(() => {
      fireEvent.mouseMove(window);
    });
    expect(screen.queryByText(/Sète àncore/)).not.toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getByText(/Sète àncore/)).toBeInTheDocument();
  });

  it("resets the timer on keydown", () => {
    render(<IdleQuote />);
    act(() => {
      vi.advanceTimersByTime(3000);
      fireEvent.keyDown(window, { key: "a" });
      vi.advanceTimersByTime(3000);
    });
    expect(screen.queryByText(/Sète àncore/)).not.toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByText(/Sète àncore/)).toBeInTheDocument();
  });

  it("resets the timer on touchstart", () => {
    render(<IdleQuote />);
    act(() => {
      vi.advanceTimersByTime(3000);
      fireEvent.touchStart(window);
      vi.advanceTimersByTime(4999);
    });
    expect(screen.queryByText(/Sète àncore/)).not.toBeInTheDocument();
  });

  it("removes listeners on unmount", () => {
    const { unmount } = render(<IdleQuote />);
    unmount();
    act(() => {
      vi.advanceTimersByTime(10000);
      fireEvent.mouseMove(window);
      fireEvent.keyDown(window, { key: "a" });
      fireEvent.touchStart(window);
    });
    // No throw — quote never rendered, no error.
    expect(screen.queryByText(/Sète/)).not.toBeInTheDocument();
  });

  it("falls back to the first quote if localStorage throws", () => {
    const spy = vi
      .spyOn(Storage.prototype, "getItem")
      .mockImplementation(() => {
        throw new Error("denied");
      });
    render(<IdleQuote />);
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getByText(/Sète àncore/)).toBeInTheDocument();
    spy.mockRestore();
  });
});
