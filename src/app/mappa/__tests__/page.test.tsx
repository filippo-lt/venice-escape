import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
  usePathname: () => "/mappa",
}));

import Page, { metadata } from "../page";

describe("mappa/page.tsx (server wrapper)", () => {
  it("exports SEO metadata", () => {
    expect(metadata.title).toMatch(/Venice Escape — Mappa/);
    expect(metadata.description).toMatch(/sette ancore/i);
  });

  it("renders the MapPage inside a Suspense boundary", () => {
    render(<Page />);
    expect(screen.getAllByText(/CARICAMENTO MAPPA/i).length).toBeGreaterThan(0);
  });
});
