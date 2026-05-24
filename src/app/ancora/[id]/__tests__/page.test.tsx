import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { mockNextNavigation, mockNextImage } from "@/test/mocks";

mockNextNavigation({ params: { id: "1" } });
mockNextImage();

const Page = (await import("../page")).default;
const { generateStaticParams } = await import("../page");
const { TOTAL_ANCHORS } = await import("@/lib/anchors");

describe("ancora/[id] page (server wrapper)", () => {
  it("renders the AnchorPage for a valid id", async () => {
    const ui = await Page({ params: Promise.resolve({ id: "1" }) });
    render(ui);
    expect(screen.getByText(/SCENE 01/)).toBeInTheDocument();
  });

  it("calls notFound() for non-integer id", async () => {
    await expect(
      Page({ params: Promise.resolve({ id: "abc" }) }),
    ).rejects.toThrow(/NOT_FOUND/);
  });

  it("calls notFound() for an out-of-range id", async () => {
    await expect(
      Page({ params: Promise.resolve({ id: "99" }) }),
    ).rejects.toThrow(/NOT_FOUND/);
  });

  it("generateStaticParams returns one entry per anchor", () => {
    const params = generateStaticParams();
    expect(params).toHaveLength(TOTAL_ANCHORS);
    expect(params[0]).toEqual({ id: "1" });
    expect(params[TOTAL_ANCHORS - 1]).toEqual({ id: String(TOTAL_ANCHORS) });
  });
});
