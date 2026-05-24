import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VerbUI } from "../VerbUI";

describe("VerbUI", () => {
  it("renders all 9 verbs as non-interactive spans by default", () => {
    const { container } = render(<VerbUI />);
    expect(container.querySelectorAll("button")).toHaveLength(0);
    const verbs = [
      "Guarda", "Parla a", "Apri",
      "Prendi", "Usa", "Bevi con",
      "Esamina", "Conta", "Mostra",
    ];
    verbs.forEach((v) => {
      expect(screen.getByText(`► ${v}`)).toBeInTheDocument();
    });
  });

  it("marks 'Parla a' as active by default", () => {
    render(<VerbUI />);
    const active = screen.getByText("► Parla a");
    expect(active.className).toContain("text-selected");
  });

  it("applies active class to custom active verb", () => {
    render(<VerbUI active="Usa" />);
    expect(screen.getByText("► Usa").className).toContain("text-selected");
    expect(screen.getByText("► Parla a").className).not.toContain("text-selected");
  });

  it("renders verbs as buttons when onTapVerb is provided", async () => {
    const onTap = vi.fn();
    const user = userEvent.setup();
    render(<VerbUI onTapVerb={onTap} />);
    const btns = screen.getAllByRole("button");
    expect(btns).toHaveLength(9);
    await user.click(screen.getByRole("button", { name: "► Guarda" }));
    expect(onTap).toHaveBeenCalledWith("Guarda");
  });
});
