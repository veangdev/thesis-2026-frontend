import { defineConfig, devices } from '@playwright/test'

// Use a dedicated port so e2e never collides with the backend (which runs on 3000).
const PORT = 3100
const baseURL = `http://localhost:${PORT}`

/** @see https://playwright.dev/docs/test-configuration */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['html']] : 'html',

  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 5'] } },
  ],

  // In CI the app is built first, then served with `yarn start`.
  // E2E always runs in mock mode so the suite needs no backend.
  webServer: {
    command: process.env.CI ? `yarn start -p ${PORT}` : `yarn dev -p ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: { NEXT_PUBLIC_USE_MOCKS: 'true' },
  },
})
