import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { waitMswToStart } from '@avenirs-esr/shared/test-utils'
import { test } from '@playwright/test'
import { GLOBAL_TIMEOUT } from 'a11y/playwright.a11y.config'
import { auditAccessibility } from 'a11y/utils'
import { ROUTES } from '@/constants/route-names'

const __dirname = dirname(fileURLToPath(import.meta.url))

const routesToCheck = [
  ROUTES.TERMS_OF_SERVICE,
]

test.describe('routes', () => {
  routesToCheck.forEach((route) => {
    test(`${route.path} should have no accessibility violations`, async ({ page }) => {
      await page.goto(`.${route.path}`)
      await waitMswToStart(page)
      await page.waitForSelector('#app', { timeout: GLOBAL_TIMEOUT })

      const pageName = route.name

      await auditAccessibility({
        page,
        projectKey: `Cofolio Backoffice A11y Report - ${pageName}`,
        reportPath: resolve(__dirname, `reports/${pageName}.html`),
      })
    })
  })
})
