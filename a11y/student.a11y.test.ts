import fs from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ROUTE_NAMES } from '@/common/constants'
import { AxeBuilder } from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { waitMswToStart } from 'a11y/utils'
import { createHtmlReport } from 'axe-html-reporter'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

interface Route {
  name: string
  path: string
  children?: Route[]
}

const routesToCheck: Array<Route> = [
  ROUTE_NAMES.STUDENT.ACTIVITY,
  ROUTE_NAMES.STUDENT.EDUCATION_SKILLS,
  ROUTE_NAMES.STUDENT.EDUCATION_ACTIVITIES,
  ROUTE_NAMES.STUDENT.PROJECT_SKILLS,
  {
    ...ROUTE_NAMES.STUDENT.PERSONAL_CAREER,
    children: [
      ROUTE_NAMES.STUDENT.PERSONAL_CAREER_MY_CAREER,
      ROUTE_NAMES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAMS,
      ROUTE_NAMES.STUDENT.PERSONAL_CAREER_ACTIVITIES,
      ROUTE_NAMES.STUDENT.PERSONAL_CAREER_EXPERIENCES,
    ],
  },
  ROUTE_NAMES.STUDENT.PROJECT_TRAJECTORIES,
  ROUTE_NAMES.STUDENT.TOOLS_TRACES,
  ROUTE_NAMES.STUDENT.TOOLS_PAGES,
  ROUTE_NAMES.STUDENT.TOOLS_RESUMES,
  ROUTE_NAMES.STUDENT.ABOUT,
  ROUTE_NAMES.STUDENT.MAILBOX,
  ROUTE_NAMES.STUDENT.NOTIFICATIONS,
  ROUTE_NAMES.STUDENT.ADDITIONAL_SKILL,
]

const pathsToTest = [
  `.${ROUTE_NAMES.STUDENT.HOME.path}`,
  ...routesToCheck.map((route) => {
    const routes = [join(`./student`, route.path)]

    if (!Array.isArray(route.children)) {
      return routes
    }

    route.children.forEach((childRoute) => {
      routes.push(join(`./student`, route.path, childRoute.path))
    })

    return routes
  }).flat(),
]

pathsToTest.forEach((path) => {
  test(`${path} should have no accessibility violations`, async ({ page }) => {
    await page.goto(path)
    await waitMswToStart(page)
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
