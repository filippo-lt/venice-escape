import { describe, it, expect, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

vi.mock("next/font/google", () => {
  const fontFactory = () => () => ({
    variable: "--mock-font",
    className: "mock-font",
    style: { fontFamily: "mock" },
  });
  return {
    Press_Start_2P: fontFactory(),
    VT323: fontFactory(),
    Caveat: fontFactory(),
    EB_Garamond: fontFactory(),
  };
});

// globals.css side-effect import — stub.
vi.mock("../globals.css", () => ({}), { virtual: true } as never);

import RootLayout, { metadata, viewport } from "../layout";

describe("RootLayout", () => {
  it("renders children wrapped in html/body", () => {
    const html = renderToStaticMarkup(
      <RootLayout>
        <p>hello</p>
      </RootLayout>,
    );
    expect(html).toContain("<html");
    expect(html).toContain('lang="it"');
    expect(html).toContain("<body");
    expect(html).toContain("hello");
  });

  it("exposes metadata and viewport", () => {
    expect(metadata.title).toBe("Le Sette Àncore della Serenissima");
    expect(viewport.themeColor).toBe("#1a0f08");
  });
});
