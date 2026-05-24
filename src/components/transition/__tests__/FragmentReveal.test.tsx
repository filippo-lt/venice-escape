import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FragmentReveal } from "../FragmentReveal";

describe("FragmentReveal", () => {
  it("renders the letter as visible content", () => {
    render(<FragmentReveal letter="V" />);
    expect(screen.getByText("V")).toBeInTheDocument();
  });

  it("exposes the letter via aria-label", () => {
    render(<FragmentReveal letter="E" />);
    const box = screen.getByRole("img", { name: /frammento e/i });
    expect(box).toBeInTheDocument();
    expect(box).toHaveAttribute("aria-label", "Frammento E");
  });

  it("renders multi-character or symbol fragments unchanged", () => {
    render(<FragmentReveal letter="◆" />);
    expect(screen.getByText("◆")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /frammento ◆/i }),
    ).toBeInTheDocument();
  });

  it("emits the embedded keyframes/reduced-motion styles", () => {
    const { container } = render(<FragmentReveal letter="N" />);
    const style = container.querySelector("style");
    expect(style).not.toBeNull();
    expect(style?.textContent).toContain("fragmentFlashKf");
    expect(style?.textContent).toContain("fragmentShakeKf");
    expect(style?.textContent).toContain("fragmentLetterKf");
    expect(style?.textContent).toContain("prefers-reduced-motion");
  });

  it("renders the scanline and flash decorative layers as aria-hidden", () => {
    const { container } = render(<FragmentReveal letter="I" />);
    const hidden = container.querySelectorAll("[aria-hidden]");
    // scanline + flash
    expect(hidden.length).toBeGreaterThanOrEqual(2);
  });
});
