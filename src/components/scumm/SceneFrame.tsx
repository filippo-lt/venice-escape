import type { ReactNode } from "react";

type SceneFrameProps = {
  /** Etichetta a sinistra della scene-bar (es. "SCENE 03 — ZATTERE BY NIGHT"). */
  label: string;
  /** Etichetta a destra (es. "QUEST: TROVA IL TERZO SEGNO"). Opzionale. */
  quest?: string;
  /** Contenuto della scena: <img>, sprite CSS, illustrazione pixel. */
  children?: ReactNode;
  /** URL immagine. Se passato, viene renderizzato come background pixel-perfect. */
  src?: string;
  alt?: string;
};

/**
 * Cornice scena pixel-art. Mobile-first: altezza compatta (~220px).
 * La scene-bar in alto è il "titolo del capitolo" SCUMM-style.
 */
export function SceneFrame({
  label,
  quest,
  children,
  src,
  alt,
}: SceneFrameProps) {
  return (
    <section className="border-y border-stone-dark bg-black">
      <header className="flex items-center justify-between gap-3 border-b border-stone-dark bg-bg-night px-3 py-2 font-pixel text-[8px] tracking-widest text-ocra-light sm:text-[10px]">
        <span>{label}</span>
        {quest && <span className="hidden sm:inline">{quest}</span>}
      </header>
      <div
        className="relative h-[220px] w-full overflow-hidden bg-sky-night sm:h-[280px]"
        style={{ imageRendering: "pixelated" }}
      >
        {src ? (
          // Tag <img> intenzionale: l'ottimizzatore di next/image
          // ricampiona la pixel art rovinandola. Useremo asset .webp
          // statici già dimensionati per il viewport mobile.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt ?? ""}
            className="h-full w-full object-cover"
            style={{ imageRendering: "pixelated" }}
          />
        ) : (
          children
        )}
      </div>
    </section>
  );
}
