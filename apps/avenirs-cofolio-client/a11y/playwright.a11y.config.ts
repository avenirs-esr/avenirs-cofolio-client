import process from 'node:process'
import { A11Y_TEST_TIMEOUT } from '@avenirs-esr/shared/test-utils/a11y'
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './',
  tsconfig: './tsconfig.json',
  timeout: A11Y_TEST_TIMEOUT,
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
  use: {
    baseURL: 'http://localhost:4173/cofolio/',
    storageState: {
      cookies: [],
      origins: [{
        origin: 'http://localhost:4173',
        localStorage: [
          { name: 'staff-tutorial-seen', value: 'true' },
          { name: 'student-tutorial-seen', value: 'true' },
        ],
      }],
    },
    headless: !!process.env.CI,
  },
  workers: process.env.CI ? 1 : undefined,
  outputDir: '.output',
  /* Run your local dev server before starting the tests */
  webServer: {
    /**
     * Use the dev server by default for faster feedback loop.
     * Use the preview server on CI for more realistic testing.
     * Playwright will re-use the local server if there is already a dev-server running.
     */
    command: 'pnpm run preview:development',
    port: 4173,
    reuseExistingServer: true,
    cwd: '../'
  },
})
