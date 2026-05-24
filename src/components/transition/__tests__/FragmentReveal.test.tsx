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
    // scanline + sweep + flash + halo
    expect(hidden.length).toBeGreaterThanOrEqual(4);
  });

  it("emits the parchment sweep keyframes and layer", () => {
    const { container } = render(<FragmentReveal letter="V" />);
    const style = container.querySelector("style");
    expect(style?.textContent).toContain("fragmentSweepKf");
    const sweep = container.querySelector(".fragment-sweep-inner");
    expect(sweep).not.toBeNull();
  });

  it("emits the echo halo keyframes and layer", () => {
    const { container } = render(<FragmentReveal letter="V" />);
    const style = container.querySelector("style");
    expect(style?.textContent).toContain("fragmentHaloKf");
    const halo = container.querySelector(".fragment-halo");
    expect(halo).not.toBeNull();
  });

  it("reduced-motion branch short-circuits sweep and halo to instant", () => {
    const { container } = render(<FragmentReveal letter="Z" />);
    const css = container.querySelector("style")?.textContent ?? "";
    // Extract the @media (prefers-reduced-motion: reduce) block
    const idx = css.indexOf("prefers-reduced-motion");
    expect(idx).toBeGreaterThan(-1);
    const reducedBlock = css.slice(idx);
    // Sweep + halo + flash must collapse to invisible/no-animation in reduced
    expect(reducedBlock).toMatch(/\.fragment-sweep-inner[\s\S]*opacity:\s*0/);
    expect(reducedBlock).toMatch(/\.fragment-halo[\s\S]*opacity:\s*0/);
    expect(reducedBlock).toMatch(/\.fragment-letter[\s\S]*opacity:\s*1/);
  });
});
