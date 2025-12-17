import fs from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ROUTES } from '@/common/constants'
import { AxeBuilder } from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { GLOBAL_TIMEOUT } from 'a11y/playwright.a11y.config'
import { waitMswToStart } from 'a11y/utils'
import { createHtmlReport } from 'axe-html-reporter'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const pathsToTest = [
  `./teacher${ROUTES.TEACHER.HOME.path}`,
]

test.describe('teacher routes', () => {
  pathsToTest.forEach((path) => {
    test(`${path} should have no accessibility violations`, async ({ page }) => {
      await page.goto(path)
      await waitMswToStart(page)
      await page.waitForSelector('#app', { timeout: GLOBAL_TIMEOUT })

      const rawAxeResults = await new AxeBuilder({ page }).analyze()

      const pageName = path.replace(/^\/|\/$/g, '').replace(/\//g, '-')

      if (rawAxeResults.violations.length > 0) {
        const reportHTML = createHtmlReport({
          results: rawAxeResults,
          options: {
            projectKey: `Cofolio A11y Report - Teacher Universe -  ${pageName}`,
            doNotCreateReportFile: true,
          },
        })
        const reportPath = resolve(__dirname, `reports/teacher/${pageName}.html`)

        fs.mkdirSync(dirname(reportPath), { recursive: true })

        fs.writeFileSync(reportPath, reportHTML)
      }

      expect(rawAxeResults.violations.length, 'No accessibility violations').toBe(0)
    })
  })
})
