import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AudioPlayer } from "../AudioPlayer";

describe("AudioPlayer", () => {
  beforeEach(() => {
    // reset shared mocks
    (HTMLMediaElement.prototype.play as unknown as ReturnType<typeof vi.fn>)
      .mockReset()
      .mockResolvedValue(undefined);
    (HTMLMediaElement.prototype.pause as unknown as ReturnType<typeof vi.fn>)
      .mockReset();
  });

  it("renders label and initial 0:00 / 0:00 time", () => {
    render(<AudioPlayer src="/a.mp3" label="VOICE.WAV — Test" />);
    expect(screen.getByText(/VOICE.WAV — Test/)).toBeInTheDocument();
    expect(screen.getByText("0:00 / 0:00")).toBeInTheDocument();
  });

  it("starts with play label and toggles to pause after click", async () => {
    const user = userEvent.setup();
    render(<AudioPlayer src="/a.mp3" label="Test" />);
    const btn = screen.getByRole("button", { name: "Riproduci" });
    expect(btn).toHaveAttribute("aria-pressed", "false");

    // jsdom doesn't set paused properly after play(); simulate by stubbing
    const audio = document.querySelector("audio") as HTMLAudioElement;
    Object.defineProperty(audio, "paused", {
      configurable: true,
      get: () => true,
    });

    await user.click(btn);
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
    expect(
      screen.getByRole("button", { name: "Metti in pausa" }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("pauses when clicked while playing", async () => {
    const user = userEvent.setup();
    render(<AudioPlayer src="/a.mp3" label="Test" />);
    const audio = document.querySelector("audio") as HTMLAudioElement;

    // first click: not paused initially? we control with a flag
    let paused = true;
    Object.defineProperty(audio, "paused", {
      configurable: true,
      get: () => paused,
    });

    await user.click(screen.getByRole("button", { name: "Riproduci" }));
    paused = false;

    await user.click(screen.getByRole("button", { name: "Metti in pausa" }));
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Riproduci" })).toBeInTheDocument();
  });

  it("handles play() rejection by staying paused", async () => {
    (HTMLMediaElement.prototype.play as unknown as ReturnType<typeof vi.fn>)
      .mockReset()
      .mockRejectedValue(new Error("autoplay blocked"));
    const user = userEvent.setup();
    render(<AudioPlayer src="/a.mp3" label="Test" />);
    const audio = document.querySelector("audio") as HTMLAudioElement;
    Object.defineProperty(audio, "paused", {
      configurable: true,
      get: () => true,
    });
    await user.click(screen.getByRole("button", { name: "Riproduci" }));
    // should remain in play state (label "Riproduci")
    expect(screen.getByRole("button", { name: "Riproduci" })).toBeInTheDocument();
  });

  it("updates time display on timeupdate and loadedmetadata events", () => {
    render(<AudioPlayer src="/a.mp3" label="Test" />);
    const audio = document.querySelector("audio") as HTMLAudioElement;
    Object.defineProperty(audio, "currentTime", {
      configurable: true,
      value: 65,
    });
    Object.defineProperty(audio, "duration", {
      configurable: true,
      value: 130,
    });
    act(() => {
      audio.dispatchEvent(new Event("loadedmetadata"));
      audio.dispatchEvent(new Event("timeupdate"));
    });
    expect(screen.getByText("1:05 / 2:10")).toBeInTheDocument();
  });

  it("handles non-finite duration by formatting as 0:00", () => {
    render(<AudioPlayer src="/a.mp3" label="Test" />);
    const audio = document.querySelector("audio") as HTMLAudioElement;
    Object.defineProperty(audio, "duration", {
      configurable: true,
      value: Infinity,
    });
    act(() => {
      audio.dispatchEvent(new Event("loadedmetadata"));
    });
    expect(screen.getByText("0:00 / 0:00")).toBeInTheDocument();
  });

  it("resets playing on ended event", async () => {
    const user = userEvent.setup();
    render(<AudioPlayer src="/a.mp3" label="Test" />);
    const audio = document.querySelector("audio") as HTMLAudioElement;
    Object.defineProperty(audio, "paused", {
      configurable: true,
      get: () => true,
    });
    await user.click(screen.getByRole("button", { name: "Riproduci" }));
    act(() => {
      audio.dispatchEvent(new Event("ended"));
    });
    expect(screen.getByRole("button", { name: "Riproduci" })).toBeInTheDocument();
  });

  it("supports autoPlay prop", () => {
    render(<AudioPlayer src="/a.mp3" label="Test" autoPlay />);
    const audio = document.querySelector("audio") as HTMLAudioElement;
    expect(audio).toHaveAttribute("autoplay");
  });

  it("renders src attribute on audio element", () => {
    render(<AudioPlayer src="/test.mp3" label="Test" />);
    const audio = document.querySelector("audio") as HTMLAudioElement;
    expect(audio.getAttribute("src")).toBe("/test.mp3");
  });
});
