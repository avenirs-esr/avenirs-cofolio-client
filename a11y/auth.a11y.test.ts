import type { AvRoute } from '@/common/types'
import fs from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ROUTES } from '@/common/constants'
import { AxeBuilder } from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { GLOBAL_TIMEOUT } from 'a11y/playwright.a11y.config'
import { waitMswToStart } from 'a11y/utils'
import { createHtmlReport } from 'axe-html-reporter'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const routesToCheck: Array<AvRoute> = [
  ROUTES.AUTH.LOGIN,
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

      const rawAxeResults = await new AxeBuilder({ page })
        .exclude('[data-user-content]')
        .analyze()

      const pageName = path.replace(/^\/|\/$/g, '').replace(/\//g, '-')

      if (rawAxeResults.violations.length > 0) {
        const reportHTML = createHtmlReport({
          results: rawAxeResults,
          options: {
            projectKey: `Cofolio A11y Report - Auth -  ${pageName}`,
            doNotCreateReportFile: true,
          },
        })
        const reportPath = resolve(__dirname, `reports/auth/${pageName}.html`)

        fs.mkdirSync(dirname(reportPath), { recursive: true })

        fs.writeFileSync(reportPath, reportHTML)
      }

      expect(rawAxeResults.violations.length, 'No accessibility violations').toBe(0)
    })
  })
})
