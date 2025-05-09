import fs from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { AxeBuilder } from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { createHtmlReport } from 'axe-html-reporter'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

test('Home page should have no accessibility violations', async ({ page }) => {
  await page.goto('/')

  const rawAxeResults = await new AxeBuilder({ page }).analyze()

  const reportHTML = createHtmlReport({
    results: rawAxeResults,
    options: {
      projectKey: 'Cofolio A11y Report',
      doNotCreateReportFile: true, // we handle saving manually
    },
  })

  const reportPath = resolve(__dirname, '../../.a11y/accessibility-report.html')
  fs.mkdirSync(dirname(reportPath), { recursive: true })
  fs.writeFileSync(reportPath, reportHTML)

  // Fail the test if violations are found
  expect(rawAxeResults.violations, 'No accessibility violations').toHaveLength(0)
})
