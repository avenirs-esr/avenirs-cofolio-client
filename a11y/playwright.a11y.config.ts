import process from 'node:process'
import { defineConfig, devices } from '@playwright/test'

export const GLOBAL_TIMEOUT = 60 * 1000
export default defineConfig({
  testDir: './',
  tsconfig: './tsconfig.a11y.json',
  use: {
    baseURL: 'http://localhost:4173/cofolio/',
    headless: true,
    colorScheme: 'light',
    deviceScaleFactor: 1,
    locale: 'fr-FR',
    timezoneId: 'Europe/Paris',
    launchOptions: {
      args: ['--force-color-profile=srgb'],
    },
  },
  timeout: GLOBAL_TIMEOUT,
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        colorScheme: 'light',
        deviceScaleFactor: 1,
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
