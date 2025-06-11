import fs from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import routes, {
  studentAboutRoute,
  studentEducationActivitiesRoute,
  studentEducationSkillsRoute,
  studentMailboxRoute,
  studentNotificationsRoute,
  studentProjectExperiencesRoute,
  studentProjectSkillsRoute,
  studentProjectTrajectoriesRoute,
  studentToolsPagesRoute,
  studentToolsResumesRoute,
  studentToolsTracesRoute
} from '@/features/student/routes/routes'
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
  studentToolsTracesRoute,
  studentToolsPagesRoute,
  studentToolsResumesRoute,
  studentAboutRoute,
  studentMailboxRoute,
  studentNotificationsRoute
]
const parentRoute = routes[0]

const pathsToTest = [
  parentRoute.path,
  ...routesToCheck.map(route => join(parentRoute.path, route.path))
]

pathsToTest.forEach((path) => {
  test(`${path} should have no accessibility violations`, async ({ page }) => {
    await page.goto(path)

    const rawAxeResults = await new AxeBuilder({ page }).analyze()

    const pageName = path.replace(/^\/|\/$/g, '').replace(/\//g, '-')

    if (rawAxeResults.violations.length > 0) {
      const reportHTML = createHtmlReport({
        results: rawAxeResults,
        options: {
          projectKey: `Cofolio A11y Report- Student Universe - ${pageName}`,
          doNotCreateReportFile: true,
        },
      })
      const reportPath = resolve(__dirname, `reports/student/${pageName}.html`)

      fs.mkdirSync(dirname(reportPath), { recursive: true })

      fs.writeFileSync(reportPath, reportHTML)
    }

    expect(rawAxeResults.violations.length, 'No accessibility violations').toBe(0)
  })
})
