import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextDestinationCard } from "../NextDestinationCard";
import type { Anchor } from "@/lib/anchors";

function makeAnchor(overrides: Partial<Anchor> = {}): Anchor {
  return {
    id: 1,
    slug: "rialto",
    location: "Rialto",
    theme: "acqua",
    fragment: "V",
    acceptedHashes: [],
    href: "/ancora/1",
    audioMain: "/audio/main/ancora_1.mp3",
    scene: "/images/ancora-1/ancora_1_scene.png",
    ...overrides,
  } as Anchor;
}

describe("NextDestinationCard", () => {
  it("renders the section header and the CTA link to the next anchor", () => {
    const anchor = makeAnchor({
      nextTeaser: "Segui il canto delle campane.",
      nextHint: "Verso San Marco.",
    });
    const next = makeAnchor({
      id: 2,
      slug: "san-marco",
      location: "San Marco",
      href: "/ancora/2",
    });

    render(<NextDestinationCard anchor={anchor} next={next} />);

    expect(screen.getByText(/LA PROSSIMA SOGLIA/)).toBeInTheDocument();
    expect(screen.getByText("Segui il canto delle campane.")).toBeInTheDocument();
    expect(screen.getByText(/Verso San Marco\./)).toBeInTheDocument();
    expect(screen.getByText(/DOVE ANDARE/)).toBeInTheDocument();

    const cta = screen.getByRole("link", { name: /verso san marco/i });
    expect(cta).toHaveAttribute("href", "/ancora/2");
    expect(cta).toHaveTextContent("VERSO SAN MARCO →");
  });

  it("omits the teaser paragraph when nextTeaser is absent", () => {
    const anchor = makeAnchor({ nextHint: "Solo hint." });
    const next = makeAnchor({ id: 2, location: "Dorsoduro", href: "/ancora/2" });

    render(<NextDestinationCard anchor={anchor} next={next} />);
    expect(screen.queryByText(/segui il canto/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Solo hint\./)).toBeInTheDocument();
  });

  it("omits the hint paragraph when nextHint is absent", () => {
    const anchor = makeAnchor({ nextTeaser: "Solo teaser." });
    const next = makeAnchor({ id: 2, location: "Castello", href: "/ancora/2" });

    render(<NextDestinationCard anchor={anchor} next={next} />);
    expect(screen.getByText("Solo teaser.")).toBeInTheDocument();
    expect(screen.queryByText(/DOVE ANDARE/)).not.toBeInTheDocument();
  });

  it("omits both optional paragraphs when neither field is set", () => {
    const anchor = makeAnchor();
    const next = makeAnchor({ id: 2, location: "Cannaregio", href: "/ancora/2" });

    render(<NextDestinationCard anchor={anchor} next={next} />);
    expect(screen.queryByText(/DOVE ANDARE/)).not.toBeInTheDocument();
    // The header is still rendered
    expect(screen.getByText(/LA PROSSIMA SOGLIA/)).toBeInTheDocument();
    // CTA still appears with the next location uppercased
    expect(
      screen.getByRole("link", { name: /verso cannaregio/i }),
    ).toHaveTextContent("VERSO CANNAREGIO →");
  });

  it("uppercases multi-word locations in the CTA label", () => {
    const anchor = makeAnchor();
    const next = makeAnchor({
      id: 2,
      location: "Campo San Polo",
      href: "/ancora/2",
    });

    render(<NextDestinationCard anchor={anchor} next={next} />);
    expect(
      screen.getByRole("link", { name: /verso campo san polo/i }),
    ).toHaveTextContent("VERSO CAMPO SAN POLO →");
  });
});
