import process from 'node:process'
import { A11Y_SHARED_CONFIG } from '@avenirs-esr/shared/test-utils'
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './',
  tsconfig: './tsconfig.json',
  use: {
    baseURL: 'http://localhost:4174/cofolio-back-office/',
    headless: !!process.env.CI,
  },
  ...A11Y_SHARED_CONFIG,
  outputDir: '.output',
  webServer: {
    command: 'pnpm run preview:development --port 4174 --strictPort',
    port: 4174,
    reuseExistingServer: true,
    cwd: '../',
  },
})
