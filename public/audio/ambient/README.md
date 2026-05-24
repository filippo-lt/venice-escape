Ambient loops per la home.

- `ambient_lagoon.mp3` — loop atmosferico per il title screen (Beat 2 di `/`).
  Volume target 0.3, durata 30–60s loopabile senza cut udibile.
  Prompt di generazione in `docs/home_assets_prompts.md`.

Finché il file manca, `AmbientToggle` resta off di default e l'assenza non
rompe la home (il `<audio>` semplicemente fallisce silenziosamente).
