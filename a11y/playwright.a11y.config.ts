import process from 'node:process'
import { defineConfig, devices } from '@playwright/test'

export const GLOBAL_TIMEOUT = 60 * 1000
export default defineConfig({
  testDir: './',
  tsconfig: './tsconfig.a11y.json',
  use: {
    baseURL: 'http://localhost:4173',
    headless: !!process.env.CI
  },
  timeout: GLOBAL_TIMEOUT,
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome']
      }
    },
  ],

  workers: process.env.CI ? 1 : undefined,

  outputDir: '.output',

  /* Run your local dev server before starting the tests */
  webServer: {
    /**
     * Use the dev server by default for faster feedback loop.
     * Use the preview server on CI for more realistic testing.
     * Playwright will re-use the local server if there is already a dev-server running.
     */
    command: 'npm run preview:development',
    port: 4173,
    reuseExistingServer: true,
    cwd: '../'
  },
})
