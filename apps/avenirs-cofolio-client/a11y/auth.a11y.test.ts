import type { AvRoute } from '@/common/types'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { test } from '@playwright/test'
import { GLOBAL_TIMEOUT } from 'a11y/playwright.a11y.config'
import { auditAccessibility, waitMswToStart } from 'a11y/utils'
import { ROUTES } from '@/common/constants'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const routesToCheck: Array<AvRoute> = [
  ROUTES.AUTH.LOGIN as AvRoute,
]

const pathsToTest = [
  ...routesToCheck.map((route) => {
    const routes = [join(`./auth`, route.path)]

    if (!Array.isArray(route.children)) {
      return routes
    }

    route.children.forEach((childRoute) => {
      routes.push(join(`./auth`, route.path, childRoute.path))
    })

    return routes
  }).flat(),
]

test.describe('auth routes', () => {
  pathsToTest.forEach((path) => {
    test(`${path} should have no accessibility violations`, async ({ page }) => {
      await page.goto(path)
      await waitMswToStart(page)
      await page.waitForSelector('#app', { timeout: GLOBAL_TIMEOUT })

      const pageName = path.replace(/^\/|\/$/g, '').replace(/\//g, '-')

      await auditAccessibility({
        page,
        projectKey: `Cofolio A11y Report - Auth -  ${pageName}`,
        reportPath: resolve(__dirname, `reports/auth/${pageName}.html`),
      })
    })
  })
})
