import type { AvRoute } from '@/common/types'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { waitMswToStart } from '@avenirs-esr/shared/test-utils'
import { test } from '@playwright/test'
import { GLOBAL_TIMEOUT } from 'a11y/playwright.a11y.config'
import { auditAccessibility } from 'a11y/utils'
import { ROUTES } from '@/common/constants/route-names'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const routesToCheck: Array<AvRoute> = [
  ROUTES.STAFF.ACTIVITIES as AvRoute,
  ROUTES.STAFF.ACTIVITIES_EDIT_NATIONAL_ACTIVITY as AvRoute,
]

const pathsToTest = [
  `./staff${ROUTES.STAFF.HOME.path}`,
  ...routesToCheck.map((route) => {
    const routes = [join(`./staff`, route.path)]

    if (!Array.isArray(route.children)) {
      return routes
    }

    route.children.forEach((childRoute) => {
      routes.push(join(`./staff`, route.path, childRoute.path))
    })

    return routes
  }).flat(),
]

test.describe('staff routes', () => {
  pathsToTest.forEach((path) => {
    test(`${path} should have no accessibility violations`, async ({ page }) => {
      await page.goto(path)
      await waitMswToStart(page)
      await page.waitForSelector('#app', { timeout: GLOBAL_TIMEOUT })

      const pageName = path.replace(/^\/|\/$/g, '').replace(/\//g, '-')

      await auditAccessibility({
        page,
        projectKey: `Cofolio A11y Report - Staff Universe -  ${pageName}`,
        reportPath: resolve(__dirname, `reports/staff/${pageName}.html`),
      })
    })
  })
})
