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
    baseURL: 'http://localhost:4174/cofolio-back-office/',
    headless: !!process.env.CI,
  },

  workers: process.env.CI ? 1 : undefined,
  outputDir: '.output',
  webServer: {
    command: 'pnpm run preview:development --port 4174 --strictPort',
    port: 4174,
    reuseExistingServer: true,
    cwd: '../',
  },
})
