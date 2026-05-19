"use client";

import { useState, type FormEvent } from "react";

type CommandBarProps = {
  /** Placeholder dell'input. */
  placeholder?: string;
  /** Callback chiamata al submit con la stringa inserita (non normalizzata). */
  onSubmit: (value: string) => void | Promise<void>;
  /** Stato visivo: "errore" (risposta sbagliata) o normale. */
  status?: "idle" | "wrong" | "loading";
  /** Disabilita input + bottone. */
  disabled?: boolean;
};

/**
 * Input "command line" stile SCUMM. Pollice-friendly:
 * input grande, bottone INVIO ≥ 44px, prompt > giallo.
 */
export function CommandBar({
  placeholder = "digita la parola del frammento...",
  onSubmit,
  status = "idle",
  disabled,
}: CommandBarProps) {
  const [value, setValue] = useState("");

  const handle = (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    void onSubmit(value);
  };

  return (
    <form
      onSubmit={handle}
      className="flex items-center gap-3 border-t border-stone-dark bg-black px-3 py-3 font-mono"
      aria-busy={status === "loading"}
    >
      <span className="font-mono text-2xl text-verb-yellow" aria-hidden>
        &gt;
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label="Risposta all'enigma"
        disabled={disabled || status === "loading"}
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        className={[
          "min-h-11 min-w-0 flex-1 bg-transparent font-mono text-2xl outline-none placeholder:text-stone-mid",
          status === "wrong" ? "text-blood-bright" : "text-white-text",
        ].join(" ")}
      />
      <button
        type="submit"
        disabled={disabled || status === "loading" || !value.trim()}
        className="min-h-11 border-2 border-black bg-verb-yellow px-4 py-2 font-pixel text-[9px] tracking-widest text-black shadow-[2px_2px_0_var(--color-bg-deep)] hover:bg-sand active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-40"
      >
        {status === "loading" ? "..." : "INVIO"}
      </button>
    </form>
  );
}
