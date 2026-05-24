import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import BootSequence from "../BootSequence";

describe("BootSequence", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders all 7 boot lines in full mode", () => {
    render(<BootSequence mode="full" onDone={vi.fn()} />);
    expect(screen.getByText("SCUMM v5.1.42 — Loading...")).toBeInTheDocument();
    expect(screen.getByText("Reading manuscript from disk A:\\")).toBeInTheDocument();
    expect(screen.getByText("Checking memory... 640K OK")).toBeInTheDocument();
    expect(screen.getByText("WARNING: file corrupted — anno 1297")).toBeInTheDocument();
    expect(
      screen.getByText("Recovering data from monastery_torcello.dat"),
    ).toBeInTheDocument();
    expect(screen.getByText(". . .")).toBeInTheDocument();
    expect(screen.getByText("OK — ready to play")).toBeInTheDocument();
    expect(screen.getByText("(tap to skip)")).toBeInTheDocument();
  });

  it("renders only the final line in fast mode", () => {
    render(<BootSequence mode="fast" onDone={vi.fn()} />);
    expect(screen.getByText("OK — ready to play")).toBeInTheDocument();
    expect(screen.queryByText("SCUMM v5.1.42 — Loading...")).not.toBeInTheDocument();
  });

  it("calls onDone after FULL_DURATION_MS (4200ms) in full mode — ultima riga deve finire il typewriter (3.2s + 0.6s) + hold 0.4s", () => {
    const onDone = vi.fn();
    render(<BootSequence mode="full" onDone={onDone} />);
    expect(onDone).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(4199);
    });
    expect(onDone).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it("calls onDone after fast duration (800ms) in fast mode — spec §5 visitatore di ritorno", () => {
    const onDone = vi.fn();
    render(<BootSequence mode="fast" onDone={onDone} />);
    act(() => {
      vi.advanceTimersByTime(799);
    });
    expect(onDone).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it("only fires onDone once even if both timer and skip trigger", () => {
    const onDone = vi.fn();
    render(<BootSequence mode="full" onDone={onDone} />);
    act(() => {
      fireEvent.click(window);
    });
    expect(onDone).toHaveBeenCalledTimes(1);
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it("skips on click", () => {
    const onDone = vi.fn();
    render(<BootSequence mode="full" onDone={onDone} />);
    act(() => {
      fireEvent.click(window);
    });
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it("skips on touchstart", () => {
    const onDone = vi.fn();
    render(<BootSequence mode="full" onDone={onDone} />);
    act(() => {
      fireEvent.touchStart(window);
    });
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it("skips on keydown", () => {
    const onDone = vi.fn();
    render(<BootSequence mode="full" onDone={onDone} />);
    act(() => {
      fireEvent.keyDown(window, { key: "Enter" });
    });
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it("removes listeners and timer on unmount", () => {
    const onDone = vi.fn();
    const { unmount } = render(<BootSequence mode="full" onDone={onDone} />);
    unmount();
    act(() => {
      vi.advanceTimersByTime(10000);
      fireEvent.click(window);
      fireEvent.keyDown(window, { key: "Enter" });
      fireEvent.touchStart(window);
    });
    expect(onDone).not.toHaveBeenCalled();
  });

  it("renders the glitch line with proper class", () => {
    const { container } = render(<BootSequence mode="full" onDone={vi.fn()} />);
    expect(container.querySelector(".boot-line.glitch")).not.toBeNull();
  });

  it("renders the cursor on the final line in full mode", () => {
    const { container } = render(<BootSequence mode="full" onDone={vi.fn()} />);
    expect(container.querySelector(".cursor")).not.toBeNull();
  });

  it("renders the cursor in fast mode", () => {
    const { container } = render(<BootSequence mode="fast" onDone={vi.fn()} />);
    expect(container.querySelector(".cursor")).not.toBeNull();
  });

  it("cursor uses the shared anim-blink class (no local keyframes redefinition)", () => {
    const { container } = render(<BootSequence mode="full" onDone={vi.fn()} />);
    const cursor = container.querySelector(".cursor");
    expect(cursor).not.toBeNull();
    expect(cursor?.className).toContain("anim-blink");
  });

  it("boot line delays match the spec timing table (0.0, 0.5, 1.0, 1.6, 2.3, 2.8, 3.2)", () => {
    const { container } = render(<BootSequence mode="full" onDone={vi.fn()} />);
    const lines = Array.from(
      container.querySelectorAll<HTMLElement>(".boot-line"),
    );
    const delays = lines.map((el) => el.style.animationDelay);
    expect(delays).toEqual([
      "0s",
      "0.5s",
      "1s",
      "1.6s",
      "2.3s",
      "2.8s",
      "3.2s",
    ]);
  });
});
