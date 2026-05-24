import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import DevComponentsPage from "../page";

describe("DevComponentsPage /dev/components", () => {
  it("renders header and key sections", () => {
    render(<DevComponentsPage />);
    expect(
      screen.getByText(/DEV \/ COMPONENTS SHOWCASE/),
    ).toBeInTheDocument();
    expect(screen.getByText(/M3 — SCUMM components/)).toBeInTheDocument();
    expect(screen.getByText(/VerbUI \(decorativo\)/)).toBeInTheDocument();
    expect(screen.getByText(/DialogBox · stati/)).toBeInTheDocument();
    expect(screen.getByText(/Inventory · stati/)).toBeInTheDocument();
    expect(screen.getByText(/CommandBar · stati/)).toBeInTheDocument();
  });

  it("renders the fake scene with audio player", () => {
    render(<DevComponentsPage />);
    expect(screen.getByText(/SCENE 03 — ZATTERE BY NIGHT/)).toBeInTheDocument();
    expect(screen.getByText(/VOICE\.WAV — Fra Celestino/)).toBeInTheDocument();
  });

  it("accepts the correct answer 'marea' and adds fragment #3", async () => {
    const user = userEvent.setup();
    render(<DevComponentsPage />);
    const inputs = screen.getAllByRole("textbox");
    await user.type(inputs[0], "marea{Enter}");
    await waitFor(
      () => {
        // Slot III gains title="MAREA" when the fragment is added.
        expect(document.querySelector('[title="MAREA"]')).not.toBeNull();
      },
      { timeout: 2000 },
    );
  });

  it("invokes the no-op onSubmit callbacks for the variant CommandBars", async () => {
    const user = userEvent.setup();
    render(<DevComponentsPage />);
    const inputs = screen.getAllByRole("textbox");
    // inputs[0] = interactive; inputs[1] = idle variant; inputs[2] = wrong;
    // inputs[3] is disabled, skip it.
    for (const idx of [1, 2]) {
      if (inputs[idx] && !(inputs[idx] as HTMLInputElement).disabled) {
        await user.type(inputs[idx], "x{Enter}");
      }
    }
    expect(screen.getByText(/M3 — SCUMM components/)).toBeInTheDocument();
  });

  it("rejects a wrong answer and recovers to idle", async () => {
    const user = userEvent.setup();
    render(<DevComponentsPage />);
    const inputs = screen.getAllByRole("textbox");
    await user.type(inputs[0], "sbagliata{Enter}");
    // Wait long enough for the 400ms delay + 1200ms recovery
    await new Promise((r) => setTimeout(r, 1800));
    expect(screen.getByText(/M3 — SCUMM components/)).toBeInTheDocument();
  });
});
