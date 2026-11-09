import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { A11Y_TEST_TIMEOUT, waitMswToStart } from '@avenirs-esr/shared/test-utils/a11y'
import { test } from '@playwright/test'
import { auditAccessibility } from 'a11y/utils'
import { ROUTES } from '@/constants/route-names'

const __dirname = dirname(fileURLToPath(import.meta.url))

const routesToCheck = [
  ROUTES.NATIONAL_TOOLS,
  ROUTES.TERMS_OF_SERVICE,
  ROUTES.GLOBAL_ALERT.DETAILS,
  ROUTES.GLOBAL_ALERT.UPDATE,
]

test.describe('routes', () => {
  routesToCheck.forEach((route) => {
    test(`${route.path} should have no accessibility violations`, async ({ page }) => {
      await page.goto(`.${route.path}`)
      await waitMswToStart(page)
      await page.waitForSelector('#app', { timeout: A11Y_TEST_TIMEOUT })

      const pageName = route.name

      await auditAccessibility({
        page,
        projectKey: `Cofolio Backoffice A11y Report - ${pageName}`,
        reportPath: resolve(__dirname, `reports/${pageName}.html`),
      })
    })
  })
})
