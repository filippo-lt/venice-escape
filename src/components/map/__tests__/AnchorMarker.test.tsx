import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AnchorMarker } from "../AnchorMarker";

const POS = { top: 10, left: 20 };

describe("AnchorMarker", () => {
  it("renders the LOCKED state as a non-interactive role=img with reduced opacity", () => {
    render(
      <AnchorMarker
        id={3}
        state="locked"
        position={POS}
        label="Campo Santa Margherita"
      />,
    );
    const el = screen.getByTestId("marker-3");
    expect(el.tagName).toBe("SPAN");
    expect(el).toHaveAttribute("data-state", "locked");
    expect(el).toHaveAttribute("data-locked", "true");
    expect(el.getAttribute("aria-label")).toMatch(/bloccata/i);
    expect(el.className).toMatch(/opacity-30/);
    expect(el.className).toMatch(/pointer-events-none/);
    expect(el.style.top).toBe("10%");
    expect(el.style.left).toBe("20%");
  });

  it("renders the UNLOCKED state as a link to /ancora/[id] with the pulse class", () => {
    render(
      <AnchorMarker
        id={2}
        state="unlocked"
        position={POS}
        label="San Giacomo dell'Orio"
      />,
    );
    const link = screen.getByTestId("marker-2") as HTMLAnchorElement;
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/ancora/2");
    expect(link).toHaveAttribute("data-state", "unlocked");
    expect(link.className).toMatch(/animate-pulse/);
    expect(link.className).toMatch(/bg-ocra/);
    expect(link.getAttribute("aria-label")).toBe(
      "Ancora 2 — San Giacomo dell'Orio",
    );
    // tap target: classi min-h-11 e min-w-11 garantiscono ≥ 44x44px
    expect(link.className).toMatch(/min-h-11/);
    expect(link.className).toMatch(/min-w-11/);
  });

  it("renders the SOLVED state as a link with the gold variant and a fragment badge", () => {
    render(
      <AnchorMarker
        id={5}
        state="solved"
        position={POS}
        fragment="Z"
        label="Ponte dell'Accademia"
      />,
    );
    const link = screen.getByTestId("marker-5") as HTMLAnchorElement;
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/ancora/5");
    expect(link).toHaveAttribute("data-state", "solved");
    expect(link.className).toMatch(/bg-verb-yellow/);
    expect(link.getAttribute("aria-label")).toMatch(/risolta/);
    expect(link.getAttribute("aria-label")).toMatch(/frammento Z/);

    const badge = screen.getByTestId("marker-5-fragment");
    expect(badge.textContent).toBe("Z");
  });

  it("omits the badge when SOLVED but fragment is missing (defensive)", () => {
    render(
      <AnchorMarker
        id={6}
        state="solved"
        position={POS}
        label="Rialto"
      />,
    );
    expect(screen.queryByTestId("marker-6-fragment")).toBeNull();
    // aria-label still indicates 'risolta' with placeholder
    expect(screen.getByTestId("marker-6").getAttribute("aria-label")).toMatch(
      /risolta/,
    );
  });

  it("applies the position coordinates as CSS percentages", () => {
    render(
      <AnchorMarker
        id={1}
        state="unlocked"
        position={{ top: 42.5, left: 88 }}
        label="Stazione"
      />,
    );
    const el = screen.getByTestId("marker-1");
    expect(el.style.top).toBe("42.5%");
    expect(el.style.left).toBe("88%");
  });
});
