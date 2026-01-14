import fs from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ROUTES } from '@/common/constants'
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
  ROUTES.STUDENT.ACTIVITY,
  ROUTES.STUDENT.EDUCATION_SKILLS,
  ROUTES.STUDENT.EDUCATION_ACTIVITIES,
  ROUTES.STUDENT.PROJECT_SKILLS,
  {
    ...ROUTES.STUDENT.PERSONAL_CAREER,
    children: [
      ROUTES.STUDENT.PERSONAL_CAREER_MY_CAREER,
      ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAMS,
      ROUTES.STUDENT.PERSONAL_CAREER_ACTIVITIES,
      ROUTES.STUDENT.PERSONAL_CAREER_EXPERIENCES,
    ],
  },
  ROUTES.STUDENT.PROJECT_TRAJECTORIES,
  ROUTES.STUDENT.TOOLS_TRACES,
  ROUTES.STUDENT.TOOLS_PAGES,
  ROUTES.STUDENT.TOOLS_RESUMES,
  ROUTES.STUDENT.ABOUT,
  ROUTES.STUDENT.MAILBOX,
  ROUTES.STUDENT.NOTIFICATIONS,
  ROUTES.STUDENT.DECLARED_SKILL,
]

const pathsToTest = [
  `.${ROUTES.STUDENT.HOME.path}`,
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
