import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { waitMswToStart } from '@avenirs-esr/shared/test-utils/a11y'
import { test } from '@playwright/test'
import { auditAccessibility } from 'a11y/utils'
import { ROUTES } from '@/common/constants/route-names'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

interface Route {
  name: string
  path: string
  children?: Route[]
}

const routesToCheck: Array<Route> = [
  {
    ...ROUTES.STUDENT.PERSONAL_CAREER,
    children: [
      ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAMS,
      ROUTES.STUDENT.PERSONAL_CAREER_EXPERIENCES,
    ],
  },
  ROUTES.STUDENT.ACTIVITY,
  ROUTES.STUDENT.ACTIVITIES,
  ROUTES.STUDENT.ACTIVITIES_CATALOG,
  ROUTES.STUDENT.DECLARED_SKILL,
  ROUTES.STUDENT.SKILLS,
  ROUTES.STUDENT.BUILD_PROJECT,
  ROUTES.STUDENT.TOOLS_KIT,
  ROUTES.STUDENT.TOOLS_TRACES,
  ROUTES.STUDENT.ABOUT,
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
    const pageName = path.replace(/^\/|\/$/g, '').replace(/\//g, '-')

    await auditAccessibility({
      page,
      projectKey: `Cofolio A11y Report- Student Universe - ${pageName}`,
      reportPath: resolve(__dirname, `reports/student/${pageName}.html`),
    })
  })
})
