import process from 'node:process'
import { defineConfig, devices } from '@playwright/test'

export const GLOBAL_TIMEOUT = 60 * 1000
export default defineConfig({
  testDir: './',
  tsconfig: './tsconfig.json',
  use: {
    baseURL: 'http://localhost:4174/cofolio-back-office/',
    headless: !!process.env.CI,
  },
  timeout: GLOBAL_TIMEOUT,
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],

  workers: process.env.CI ? 1 : undefined,

  outputDir: '.output',

  webServer: {
    command: 'pnpm run preview:development --port 4174 --strictPort',
    port: 4174,
    reuseExistingServer: true,
    cwd: '../',
  },
})
