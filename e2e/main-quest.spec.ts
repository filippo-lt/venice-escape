import { test, expect } from "@playwright/test";
import { makeFullyUnlocked, seedProgress } from "./fixtures/progress";

test.describe("main quest", () => {
  test("transizione/1 rivela il frammento V", async ({ page }) => {
    // Seed: tutte le ancore sbloccate, nessun frammento ancora.
    await seedProgress(page, makeFullyUnlocked());

    // /ancora/1 con bypass GM (anche se è già sbloccata di default).
    await page.goto("/ancora/1?gm=skip");
    await expect(page).toHaveURL(/\/ancora\/1/);

    // Vai alla pagina di transizione 1 con bypass GM: aggiunge il frammento
    // anche senza aver risolto l'enigma.
    await page.goto("/transizione/1?gm=skip");

    // La FragmentReveal espone un aria-label "Frammento V".
    const fragment = page.getByRole("img", { name: /frammento V/i });
    await expect(fragment).toBeVisible({ timeout: 10_000 });
  });
});
