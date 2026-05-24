import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Inventory } from "../Inventory";

describe("Inventory", () => {
  it("renders 7 slots by default", () => {
    render(<Inventory fragments={{}} />);
    expect(screen.getByText("FRAMMENTI")).toBeInTheDocument();
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(7);
    items.forEach((li) => expect(li).toHaveTextContent("?"));
  });

  it("renders custom total slot count", () => {
    render(<Inventory fragments={{}} total={3} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("renders roman numerals for filled fragments and tooltip", () => {
    render(
      <Inventory
        fragments={{ 1: "ORO", 3: "ARGENTO" }}
      />,
    );
    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("I");
    expect(items[0]).toHaveAttribute("title", "ORO");
    expect(items[1]).toHaveTextContent("?");
    expect(items[1]).toHaveAttribute("title", "Ancora II");
    expect(items[2]).toHaveTextContent("III");
    expect(items[2]).toHaveAttribute("title", "ARGENTO");
  });

  it("fills all 7 slots when all fragments present", () => {
    const fragments: Record<number, string> = {};
    for (let i = 1; i <= 7; i++) fragments[i] = `f${i}`;
    render(<Inventory fragments={fragments} />);
    const items = screen.getAllByRole("listitem");
    const expected = ["I", "II", "III", "IV", "V", "VI", "VII"];
    items.forEach((li, i) => expect(li).toHaveTextContent(expected[i]));
  });
});
