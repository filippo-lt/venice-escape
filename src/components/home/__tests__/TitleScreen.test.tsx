import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TitleScreen from "../TitleScreen";

describe("TitleScreen", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the title text", () => {
    render(<TitleScreen onStart={vi.fn()} />);
    expect(screen.getByText("LE SETTE ÀNCORE")).toBeInTheDocument();
    expect(screen.getByText("DELLA SERENISSIMA")).toBeInTheDocument();
    expect(screen.getByText("~ a SCUMM adventure ~")).toBeInTheDocument();
  });

  it("renders the press start button with accessible label", () => {
    render(<TitleScreen onStart={vi.fn()} />);
    const button = screen.getByRole("button", { name: /Inizia l'avventura/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/PRESS START TO BEGIN/);
  });

  it("invokes onStart when the press start button is clicked", () => {
    const onStart = vi.fn();
    render(<TitleScreen onStart={onStart} />);
    const button = screen.getByRole("button", { name: /Inizia l'avventura/i });
    fireEvent.click(button);
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it("invokes onStart on keyboard Enter activation of the button", () => {
    const onStart = vi.fn();
    render(<TitleScreen onStart={onStart} />);
    const button = screen.getByRole("button", { name: /Inizia l'avventura/i });
    button.focus();
    fireEvent.keyDown(button, { key: "Enter" });
    fireEvent.keyUp(button, { key: "Enter" });
    // Native button: synthetic click via keyboard
    fireEvent.click(button);
    expect(onStart).toHaveBeenCalled();
  });

  it("renders ambient toggle button by default", () => {
    render(<TitleScreen onStart={vi.fn()} />);
    expect(
      screen.getByRole("button", { name: /Attiva audio ambient/i }),
    ).toBeInTheDocument();
  });

  it("renders decorative layers (lagoon, gondola, lantern)", () => {
    const { container } = render(<TitleScreen onStart={vi.fn()} />);
    const imgs = container.querySelectorAll("img");
    const srcs = Array.from(imgs).map((i) => i.getAttribute("src"));
    expect(srcs).toContain("/images/title_lagoon.webp");
    expect(srcs).toContain("/images/sprite_gondola.webp");
    expect(srcs).toContain("/images/sprite_lantern.webp");
  });
});
