import { defineConfig } from "@playwright/test";

const PORT = 3111;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    // Set PW_CHANNEL=msedge (or chrome) to use an installed browser instead of a downloaded one.
    channel: process.env.PW_CHANNEL || undefined,
    viewport: { width: 390, height: 780 },
    permissions: ["clipboard-read", "clipboard-write"],
  },
  webServer: {
    command: `npm run build && npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
