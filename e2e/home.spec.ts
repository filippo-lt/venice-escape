import { test, expect } from "@playwright/test";
import { seedBootSeen } from "./fixtures/progress";

test.describe("home", () => {
  test("salta il boot, mostra il title e va a /ancora/1 con PRESS START", async ({ page }) => {
    // Fast-skip della sequenza di boot: bootSeen=1 → modalità "fast".
    await seedBootSeen(page);

    await page.goto("/");

    // Aspetta il bottone PRESS START (label accessibile).
    const startBtn = page.getByRole("button", { name: /inizia l'avventura/i });
    await expect(startBtn).toBeVisible({ timeout: 15_000 });

    await startBtn.tap();

    // La home fa un timeout di ~400ms (CRT collapse) prima del push.
    await page.waitForURL("**/ancora/1", { timeout: 5_000 });
    expect(new URL(page.url()).pathname).toBe("/ancora/1");
  });
});
