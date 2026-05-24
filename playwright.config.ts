import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config — mobile-first E2E per Venice Escape.
 * Il sito si usa in calle con una mano, quindi testiamo su iPhone 13.
 */
export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "list" : [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "mobile-chromium",
      // iPhone 13 viewport/userAgent ma motore chromium (mobile emulation),
      // così non serve installare WebKit (l'app è cross-browser, qui ci
      // interessa il form factor mobile).
      use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
