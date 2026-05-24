import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { InlineInventory } from "../InlineInventory";

describe("InlineInventory", () => {
  it("renders 7 cells by default, all empty when fragments is {}", () => {
    render(<InlineInventory fragments={{}} />);
    const list = screen.getByRole("list", { name: /frammenti raccolti/i });
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(7);
    items.forEach((li) => {
      expect(li).toHaveTextContent("◇");
      expect(li).toHaveAttribute("title", expect.stringMatching(/^Ancora \d$/));
    });
  });

  it("respects a custom total", () => {
    render(<InlineInventory fragments={{}} total={3} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("shows ◆ for filled fragments and includes the letter in the title", () => {
    render(
      <InlineInventory fragments={{ 1: "V", 3: "N" }} />,
    );
    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("◆");
    expect(items[0]).toHaveAttribute("title", "Frammento 1: V");
    expect(items[1]).toHaveTextContent("◇");
    expect(items[1]).toHaveAttribute("title", "Ancora 2");
    expect(items[2]).toHaveTextContent("◆");
    expect(items[2]).toHaveAttribute("title", "Frammento 3: N");
  });

  it("marks the justRevealed cell with aria-current=step and glow class", () => {
    render(
      <InlineInventory fragments={{ 2: "E" }} justRevealed={2} />,
    );
    const items = screen.getAllByRole("listitem");
    expect(items[1]).toHaveAttribute("aria-current", "step");
    expect(items[1].className).toContain("anim-glow");
    // others are not current
    expect(items[0]).not.toHaveAttribute("aria-current");
    expect(items[0].className).not.toContain("anim-glow");
  });

  it("does not mark justRevealed when that fragment is not actually filled", () => {
    render(<InlineInventory fragments={{}} justRevealed={4} />);
    const items = screen.getAllByRole("listitem");
    expect(items[3]).not.toHaveAttribute("aria-current");
    expect(items[3].className).not.toContain("anim-glow");
  });

  it("applies the filled styling classes only to filled cells", () => {
    render(<InlineInventory fragments={{ 5: "Z" }} />);
    const items = screen.getAllByRole("listitem");
    expect(items[4].className).toContain("bg-blood");
    expect(items[0].className).toContain("bg-bg-night");
  });
});
