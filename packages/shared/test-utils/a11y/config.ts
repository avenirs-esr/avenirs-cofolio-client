import type { PlaywrightTestConfig } from '@playwright/test'
import process from 'node:process'
import { devices } from '@playwright/test'

export const A11Y_TEST_TIMEOUT = 60 * 1000

export const A11Y_SHARED_CONFIG: Partial<PlaywrightTestConfig> = {
  timeout: A11Y_TEST_TIMEOUT,
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      }
    },
  ],

  workers: process.env.CI ? 1 : undefined,

  outputDir: '.output',
}
