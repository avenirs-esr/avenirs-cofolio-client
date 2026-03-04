import process from 'node:process'
import { DESKTOP_VIEWPORT } from '@e2e/framework/shared/utils/dimension'
import { defineConfig, devices } from '@playwright/test'
import * as dotenv from 'dotenv'
import { defineBddConfig } from 'playwright-bdd'

dotenv.config({ path: '.env' })

const CI = process.env.CI === 'true'
const REVIEW_MODE = process.env.REVIEW_MODE === 'true'

const reviewModeIgnore = REVIEW_MODE ? ['**/*.deferred.feature.spec.js'] : []

const testDir = defineBddConfig({
  features: 'tests/**/*.feature',
  steps: ['framework/**/*Page.ts', 'framework/shared/fixtures/fixtures.ts', 'framework/**/*.hook.ts']
})

const reporter: Parameters<typeof defineConfig>[0]['reporter'] = [
  ['html', { open: 'never' }],
]

if (CI) {
  reporter.push(['github'])
}

export default defineConfig({
  testDir,
  preserveOutput: 'never',
  timeout: CI ? 30000 : 10000,
  expect: {
    timeout: CI ? 10000 : 5000
  },
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 2 : 0,
  workers: CI ? 2 : 5,
  reporter,
  testIgnore: reviewModeIgnore,
  use: {
    baseURL: process.env.VITE_API_URL || 'http://localhost:4173/cofolio/',
    locale: 'fr-FR',
    timezoneId: 'Europe/Paris',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: DESKTOP_VIEWPORT
      },
      testIgnore: ['**/*.mobile.feature.spec.js', ...reviewModeIgnore]
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: DESKTOP_VIEWPORT
      },
      testIgnore: ['**/*.mobile.feature.spec.js', ...reviewModeIgnore]
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        viewport: DESKTOP_VIEWPORT
      },
      testIgnore: ['**/*.mobile.feature.spec.js', ...reviewModeIgnore]
    },
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5']
      },
      testMatch: '**/*.mobile.feature.spec.js'
    },
    {
      name: 'mobile-safari',
      use: {
        ...devices['iPhone 12']
      },
      testMatch: '**/*.mobile.feature.spec.js'
    }
  ],
  globalSetup: './global-setup.ts',
  globalTeardown: './global-teardown.ts'
})
