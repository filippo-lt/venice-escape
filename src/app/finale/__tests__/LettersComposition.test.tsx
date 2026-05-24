import { describe, it, expect } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { LettersComposition } from "../LettersComposition";

const FULL: Record<number, string> = {
  1: "V",
  2: "E",
  3: "N",
  4: "E",
  5: "Z",
  6: "I",
  7: "A",
};

describe("LettersComposition", () => {
  it("renders the heading and tagline", () => {
    render(<LettersComposition fragments={FULL} />);
    expect(
      screen.getByText(/I FRAMMENTI SI COMPONGONO/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Sette ancore\. Una città\. Un nome solo\./i),
    ).toBeInTheDocument();
  });

  it("renders all 7 letters spelling VENEZIA", () => {
    render(<LettersComposition fragments={FULL} />);
    const composition = screen.getByLabelText(/Composizione: V E N E Z I A/);
    expect(composition).toBeInTheDocument();
    // Seven span children for the seven letters
    expect(composition.querySelectorAll("span")).toHaveLength(7);
  });

  it("renders '?' for missing letters", () => {
    render(<LettersComposition fragments={{ 1: "V", 3: "N" }} />);
    const composition = screen.getByLabelText(/Composizione: V \? N \? \? \? \?/);
    expect(composition).toBeInTheDocument();
  });

  it("trims whitespace from fragment values and replaces empty with '?'", () => {
    render(
      <LettersComposition
        fragments={{ 1: "  V  ", 2: "   ", 3: "N" }}
      />,
    );
    expect(
      screen.getByLabelText(/Composizione: V \? N \? \? \? \?/),
    ).toBeInTheDocument();
  });

  it("with reducedMotion=true shows letters revealed immediately (opacity-100)", () => {
    render(<LettersComposition fragments={FULL} reducedMotion />);
    const composition = screen.getByLabelText(/Composizione:/);
    const spans = composition.querySelectorAll("span");
    spans.forEach((s) => {
      expect(s.className).toContain("opacity-100");
      // reducedMotion → no inline transition/animation delays
      expect((s as HTMLElement).style.transition).toBe("");
      expect((s as HTMLElement).style.animationDelay).toBe("");
    });
  });

  it("renders to a string on the server (exercises server snapshot)", () => {
    const html = renderToString(<LettersComposition fragments={FULL} />);
    expect(html).toContain("I FRAMMENTI SI COMPONGONO");
    // Server render should mark letters as hidden (opacity-0) since
    // getRevealedServerSnapshot returns false.
    expect(html).toContain("opacity-0");
  });

  it("without reducedMotion starts hidden, then reveals after the timer tick", async () => {
    const { rerender } = render(<LettersComposition fragments={FULL} />);
    const composition = screen.getByLabelText(/Composizione:/);
    const spans = composition.querySelectorAll("span");
    // initially opacity-0
    expect(spans[0].className).toContain("opacity-0");
    // wait for the ~60ms reveal timer
    await act(async () => {
      await new Promise((r) => setTimeout(r, 120));
    });
    // force re-render so useSyncExternalStore picks up store change
    rerender(<LettersComposition fragments={FULL} />);
    const after = screen
      .getByLabelText(/Composizione:/)
      .querySelectorAll("span");
    expect(after[0].className).toContain("opacity-100");
    // inline transition delay should scale with index
    expect((after[1] as HTMLElement).style.transitionDelay).toBe("200ms");
    expect((after[6] as HTMLElement).style.animationDelay).toBe("1200ms");
  });
});
