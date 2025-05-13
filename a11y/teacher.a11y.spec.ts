import fs from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import routes from '@/features/teacher/routes'
import { AxeBuilder } from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { createHtmlReport } from 'axe-html-reporter'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const parentRoute = routes[0]

const paths = [
  parentRoute.path,
]

test.describe('teacher routes', () => {
  paths.forEach((path) => {
    test(`${path} should have no accessibility violations`, async ({ page }) => {
      // Navigate to each page
      await page.goto(path)

      const rawAxeResults = await new AxeBuilder({ page }).analyze()

      const pageName = path.replace(/^\/|\/$/g, '').replace(/\//g, '-')

      if (rawAxeResults.violations.length > 0) {
        // Generate the HTML report
        const reportHTML = createHtmlReport({
          results: rawAxeResults,
          options: {
            projectKey: `Cofolio A11y Report - Teacher Universe -  ${pageName}`,
            doNotCreateReportFile: true, // we handle saving manually
          },
        })
        // Define a unique path for each report
        const reportPath = resolve(__dirname, `reports/teacher/${pageName}.html`)

        // Ensure the directory exists
        fs.mkdirSync(dirname(reportPath), { recursive: true })

        // Write the HTML report to the file system
        fs.writeFileSync(reportPath, reportHTML)
      }

      // Assert that no accessibility violations exist
      expect(rawAxeResults.violations.length, 'No accessibility violations').toBe(0)
    })
  })
})
