import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CommandBar } from "../CommandBar";

describe("CommandBar", () => {
  it("renders default placeholder and INVIO button", () => {
    render(<CommandBar onSubmit={vi.fn()} />);
    expect(
      screen.getByPlaceholderText("digita la parola del frammento..."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "INVIO" })).toBeInTheDocument();
  });

  it("respects custom placeholder", () => {
    render(<CommandBar onSubmit={vi.fn()} placeholder="rispondi" />);
    expect(screen.getByPlaceholderText("rispondi")).toBeInTheDocument();
  });

  it("submit button disabled when input empty", () => {
    render(<CommandBar onSubmit={vi.fn()} />);
    expect(screen.getByRole("button", { name: "INVIO" })).toBeDisabled();
  });

  it("calls onSubmit with the typed value when form submitted", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<CommandBar onSubmit={onSubmit} />);
    const input = screen.getByLabelText("Risposta all'enigma");
    await user.type(input, "leone");
    await user.click(screen.getByRole("button", { name: "INVIO" }));
    expect(onSubmit).toHaveBeenCalledWith("leone");
  });

  it("does not submit whitespace-only input", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<CommandBar onSubmit={onSubmit} />);
    const input = screen.getByLabelText("Risposta all'enigma");
    await user.type(input, "   ");
    // button stays disabled
    expect(screen.getByRole("button", { name: "INVIO" })).toBeDisabled();
    // submit via enter — handler bails out
    await user.type(input, "{Enter}");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("supports submit by pressing Enter", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<CommandBar onSubmit={onSubmit} />);
    const input = screen.getByLabelText("Risposta all'enigma");
    await user.type(input, "venezia{Enter}");
    expect(onSubmit).toHaveBeenCalledWith("venezia");
  });

  it("disables input and button when disabled prop set", () => {
    render(<CommandBar onSubmit={vi.fn()} disabled />);
    expect(screen.getByLabelText("Risposta all'enigma")).toBeDisabled();
    expect(screen.getByRole("button", { name: "INVIO" })).toBeDisabled();
  });

  it("does not call onSubmit when disabled even with text", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    // disabled inputs can't be typed in; instead use rerender pattern:
    const { rerender } = render(<CommandBar onSubmit={onSubmit} />);
    const input = screen.getByLabelText("Risposta all'enigma");
    await user.type(input, "ciao");
    rerender(<CommandBar onSubmit={onSubmit} disabled />);
    // submit the form programmatically
    const form = input.closest("form")!;
    form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("renders loading state with '...' label and disables interactions", () => {
    render(<CommandBar onSubmit={vi.fn()} status="loading" />);
    const btn = screen.getByRole("button", { name: "..." });
    expect(btn).toBeDisabled();
    expect(screen.getByLabelText("Risposta all'enigma")).toBeDisabled();
    const form = btn.closest("form")!;
    expect(form).toHaveAttribute("aria-busy", "true");
  });

  it("applies error styling when status is wrong", async () => {
    const user = userEvent.setup();
    render(<CommandBar onSubmit={vi.fn()} status="wrong" />);
    const input = screen.getByLabelText("Risposta all'enigma");
    await user.type(input, "x");
    expect(input.className).toContain("text-blood-bright");
  });

  it("supports async onSubmit returning a promise", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<CommandBar onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText("Risposta all'enigma"), "abc{Enter}");
    expect(onSubmit).toHaveBeenCalledWith("abc");
  });
});
