import process from 'node:process'
import { A11Y_SHARED_CONFIG } from '@avenirs-esr/shared/test-utils'
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './',
  tsconfig: './tsconfig.json',
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
  ...A11Y_SHARED_CONFIG,
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
