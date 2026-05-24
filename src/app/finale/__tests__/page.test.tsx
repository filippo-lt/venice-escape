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
  usePathname: () => "/finale",
}));

import Page, { metadata } from "../page";

describe("finale/page.tsx (server wrapper)", () => {
  it("exports SEO metadata", () => {
    expect(metadata.title).toMatch(/Venice Escape — Finale/);
    expect(metadata.description).toMatch(/sette frammenti/i);
  });

  it("renders the FinalePage inside a Suspense boundary", () => {
    render(<Page />);
    // Either the suspense fallback or the loading message inside FinalePage
    // shows the same text — assert at least one is present.
    expect(screen.getAllByText(/CARICAMENTO FINALE/i).length).toBeGreaterThan(0);
  });
});
