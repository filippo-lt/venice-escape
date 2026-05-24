import { describe, it, expect, vi } from "vitest";

// Mock next/navigation to control notFound/redirect.
vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NOT_FOUND");
  }),
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  }),
}));

// Mock TransitionPage to avoid rendering its hook-dependent internals here.
vi.mock("../TransitionPage", () => ({
  TransitionPage: (props: Record<string, unknown>) => {
    return Object.assign(
      Object.create(null),
      { __tp: true, props },
    );
  },
}));

import Page, { generateStaticParams } from "../page";
import { TOTAL_ANCHORS, getAnchor } from "@/lib/anchors";

describe("transizione/[id]/page", () => {
  it("generateStaticParams returns ids 1..TOTAL_ANCHORS-1", () => {
    const params = generateStaticParams();
    expect(params).toHaveLength(TOTAL_ANCHORS - 1);
    expect(params[0]).toEqual({ id: "1" });
    expect(params[params.length - 1]).toEqual({
      id: String(TOTAL_ANCHORS - 1),
    });
  });

  it("calls notFound for non-integer id", async () => {
    await expect(
      Page({ params: Promise.resolve({ id: "abc" }) }),
    ).rejects.toThrow("NOT_FOUND");
  });

  it("calls notFound for non-existent anchor id (e.g. 99)", async () => {
    await expect(
      Page({ params: Promise.resolve({ id: "99" }) }),
    ).rejects.toThrow("NOT_FOUND");
  });

  it("redirects to /finale for the last anchor (TOTAL_ANCHORS)", async () => {
    await expect(
      Page({ params: Promise.resolve({ id: String(TOTAL_ANCHORS) }) }),
    ).rejects.toThrow(`REDIRECT:/finale`);
  });

  it("returns TransitionPage element with the correct anchor and next props", async () => {
    const result = (await Page({
      params: Promise.resolve({ id: "1" }),
    })) as unknown as { props: { anchor: unknown; next: unknown } };
    expect(result).toBeTruthy();
    expect(result.props.anchor).toEqual(getAnchor(1));
    expect(result.props.next).toEqual(getAnchor(2));
  });

  it("works for each valid intermediate id (1..6)", async () => {
    for (let i = 1; i <= TOTAL_ANCHORS - 1; i++) {
      const result = (await Page({
        params: Promise.resolve({ id: String(i) }),
      })) as unknown as { props: { anchor: { id: number }; next: { id: number } } };
      expect(result.props.anchor.id).toBe(i);
      expect(result.props.next.id).toBe(i + 1);
    }
  });
});
