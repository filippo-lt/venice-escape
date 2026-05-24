import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SceneFrame } from "../SceneFrame";

describe("SceneFrame", () => {
  it("renders the label", () => {
    render(<SceneFrame label="SCENE 01" />);
    expect(screen.getByText("SCENE 01")).toBeInTheDocument();
  });

  it("renders the quest when provided", () => {
    render(<SceneFrame label="SCENE 01" quest="QUEST: TROVA" />);
    expect(screen.getByText("QUEST: TROVA")).toBeInTheDocument();
  });

  it("omits quest when not provided", () => {
    render(<SceneFrame label="SCENE 01" />);
    expect(screen.queryByText(/QUEST:/)).not.toBeInTheDocument();
  });

  it("renders image with src and alt", () => {
    render(<SceneFrame label="X" src="/img.png" alt="alt text" />);
    const img = screen.getByAltText("alt text") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.getAttribute("src")).toBe("/img.png");
  });

  it("renders image with empty alt when alt prop missing", () => {
    const { container } = render(<SceneFrame label="X" src="/img.png" />);
    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    expect(img?.getAttribute("alt")).toBe("");
  });

  it("does not render img when src is missing", () => {
    const { container } = render(<SceneFrame label="X" />);
    expect(container.querySelector("img")).toBeNull();
  });

  it("renders children inside the scene area", () => {
    render(
      <SceneFrame label="X">
        <div data-testid="overlay">sprite</div>
      </SceneFrame>,
    );
    expect(screen.getByTestId("overlay")).toBeInTheDocument();
  });
});
