import { vi } from "vitest";
import * as React from "react";

/**
 * Shared mocks for Next.js modules. Import once per test file (top-level)
 * BEFORE importing the component under test.
 *
 * Example:
 *   import { mockNextNavigation } from "@/test/mocks";
 *   const router = mockNextNavigation({ params: { id: "1" } });
 */

export type RouterMock = {
  push: ReturnType<typeof vi.fn>;
  replace: ReturnType<typeof vi.fn>;
  back: ReturnType<typeof vi.fn>;
  forward: ReturnType<typeof vi.fn>;
  refresh: ReturnType<typeof vi.fn>;
  prefetch: ReturnType<typeof vi.fn>;
};

export function makeRouter(): RouterMock {
  return {
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  };
}

export function mockNextNavigation(opts: {
  params?: Record<string, string>;
  searchParams?: Record<string, string>;
  pathname?: string;
} = {}) {
  const router = makeRouter();
  vi.doMock("next/navigation", () => ({
    useRouter: () => router,
    useParams: () => opts.params ?? {},
    useSearchParams: () => new URLSearchParams(opts.searchParams ?? {}),
    usePathname: () => opts.pathname ?? "/",
    redirect: vi.fn((url: string) => {
      throw new Error(`REDIRECT:${url}`);
    }),
    notFound: vi.fn(() => {
      throw new Error("NOT_FOUND");
    }),
  }));
  return router;
}

// Light next/image mock — passthrough <img>.
export function mockNextImage() {
  vi.doMock("next/image", () => ({
    default: (props: Record<string, unknown>) => {
      const { src, alt, ...rest } = props as { src: string; alt?: string };
      return React.createElement("img", { src, alt: alt ?? "", ...rest });
    },
  }));
}

// next/font mock — return classnames.
export function mockNextFont() {
  vi.doMock("next/font/google", () => ({
    Press_Start_2P: () => ({ className: "font-press-start", variable: "--font-press-start" }),
    VT323: () => ({ className: "font-vt323", variable: "--font-vt323" }),
  }));
}
