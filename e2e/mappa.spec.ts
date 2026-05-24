import { test, expect } from "@playwright/test";
import { makeMidQuest, seedProgress } from "./fixtures/progress";

// Selettori adattabili: Track A potrebbe usare attributi diversi.
// Se la convenzione cambia, basta aggiornare qui.
// Track A espone `data-testid="marker-{1..7}"` + `data-state`.
const SELECTORS = {
  marker: '[data-testid^="marker-"][data-state]',
  solvedState: '[data-state="solved"]',
  lockedState: '[data-state="locked"]',
  unlockedState: '[data-state="unlocked"]',
};

test.describe("mappa", () => {
  test("mostra 3 ancore risolte e le restanti locked/unlocked", async ({ page }) => {
    // Pre-check: la rotta /mappa esiste? Track A potrebbe non averla mergiata.
    const probe = await page.request.get("/mappa", { failOnStatusCode: false });
    test.skip(
      probe.status() === 404,
      "/mappa non ancora implementata (Track A in parallelo)",
    );

    // Seed mid-quest: 3 risolte (1,2,3), la 4 sbloccata, 5/6/7 locked.
    await seedProgress(page, makeMidQuest(3));

    await page.goto("/mappa");

    const markers = page.locator(SELECTORS.marker);
    // Attendi che lo store esterno idrati (vedi MapPage useSyncExternalStore).
    await markers.first().waitFor({ state: "attached", timeout: 5000 });

    await expect(markers).toHaveCount(7);

    const solved = page.locator(`${SELECTORS.marker}${SELECTORS.solvedState}`);
    await expect(solved).toHaveCount(3);

    const locked = page.locator(`${SELECTORS.marker}${SELECTORS.lockedState}`);
    const unlocked = page.locator(`${SELECTORS.marker}${SELECTORS.unlockedState}`);
    const nonSolvedCount = (await locked.count()) + (await unlocked.count());
    expect(nonSolvedCount).toBe(4);
  });
});
