import fs from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import routes, {
  studentAboutRoute,
  studentEducationActivitiesRoute,
  studentEducationSkillsRoute,
  studentMessagesRoute,
  studentNotificationsRoute,
  studentProjectExperiencesRoute,
  studentProjectSkillsRoute,
  studentProjectTrajectoriesRoute,
  studentToolsPagesRoute,
  studentToolsResumesRoute,
  studentToolsTracksRoute
} from '@/features/student/routes'
import { AxeBuilder } from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { createHtmlReport } from 'axe-html-reporter'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const routesToCheck = [
  studentEducationSkillsRoute,
  studentEducationActivitiesRoute,
  studentProjectSkillsRoute,
  studentProjectExperiencesRoute,
  studentProjectTrajectoriesRoute,
  studentToolsTracksRoute,
  studentToolsPagesRoute,
  studentToolsResumesRoute,
  studentAboutRoute,
  studentMessagesRoute,
  studentNotificationsRoute
]
const parentRoute = routes[0]

const paths = [
  parentRoute.path,
  ...routesToCheck.map(route => join(parentRoute.path, route.path))
]

paths.forEach((path) => {
  test(`${path} should have no accessibility violations`, async ({ page }) => {
    // Navigate to each page
    await page.goto(path)

    // Analyze page for accessibility violations
    const rawAxeResults = await new AxeBuilder({ page }).analyze()

    const pageName = path.replace(/^\/|\/$/g, '').replace(/\//g, '-')

    if (rawAxeResults.violations.length > 0) {
      // Generate the HTML report
      const reportHTML = createHtmlReport({
        results: rawAxeResults,
        options: {
          projectKey: `Cofolio A11y Report- Student Universe - ${pageName}`,
          doNotCreateReportFile: true, // we handle saving manually
        },
      })
      // Define a unique path for each report
      const reportPath = resolve(__dirname, `reports/student/${pageName}.html`)

      // Ensure the directory exists
      fs.mkdirSync(dirname(reportPath), { recursive: true })

      // Write the HTML report to the file system
      fs.writeFileSync(reportPath, reportHTML)
    }

    // Assert that no accessibility violations exist
    expect(rawAxeResults.violations.length, 'No accessibility violations').toBe(0)
  })
})
