import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DialogBox } from "../DialogBox";

describe("DialogBox", () => {
  it("renders speaker and children text", () => {
    render(<DialogBox speaker="FRA CELESTINO:">Ciao mondo</DialogBox>);
    expect(screen.getByText("FRA CELESTINO:")).toBeInTheDocument();
    expect(screen.getByText(/Ciao mondo/)).toBeInTheDocument();
  });

  it("shows the blinking cursor by default", () => {
    const { container } = render(
      <DialogBox speaker="X">hello</DialogBox>,
    );
    expect(container.querySelector(".animate-blink")).not.toBeNull();
  });

  it("hides the cursor when showCursor is false", () => {
    const { container } = render(
      <DialogBox speaker="X" showCursor={false}>
        hello
      </DialogBox>,
    );
    expect(container.querySelector(".animate-blink")).toBeNull();
  });

  it("does not render the next indicator by default", () => {
    render(<DialogBox speaker="X">hello</DialogBox>);
    expect(screen.queryByText("▼")).not.toBeInTheDocument();
  });

  it("renders the next indicator when showNext is true", () => {
    render(
      <DialogBox speaker="X" showNext>
        hello
      </DialogBox>,
    );
    expect(screen.getByText("▼")).toBeInTheDocument();
  });

  it("renders rich children nodes", () => {
    render(
      <DialogBox speaker="X">
        <span data-testid="hl">highlight</span>
      </DialogBox>,
    );
    expect(screen.getByTestId("hl")).toHaveTextContent("highlight");
  });
});
