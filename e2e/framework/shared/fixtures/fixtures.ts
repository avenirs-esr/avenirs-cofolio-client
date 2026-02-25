import { PageTitleSteps } from '@e2e/framework/shared/steps/PageTitleSteps'
import { PaginationSteps } from '@e2e/framework/shared/steps/PaginationSteps'
import { setLocaleFromPage } from '@e2e/framework/shared/utils/i18n'
import { StudentHomePage } from '@e2e/framework/student/home/StudentHomePage'
import { StudentProjectActivitiesPage } from '@e2e/framework/student/lifeProject/activities/StudentProjectActivitiesPage'
import { StudentProjectActivitiesCatalogPage } from '@e2e/framework/student/lifeProject/activitiesCatalog/StudentProjectActivitiesCatalog'
import { StudentTrajectoriesSelfKnowledgePage } from '@e2e/framework/student/lifeProject/selfKnowledge/StudentTrajectoriesSelfKnowledgePage'
import { StudentGlobalSteps } from '@e2e/framework/student/shared/steps/StudentGlobalSteps'
import { test as base, createBdd } from 'playwright-bdd'

interface Fixtures {
  pageTitleSteps: PageTitleSteps
  paginationSteps: PaginationSteps
  studentGlobalSteps: StudentGlobalSteps
  studentHomePage: StudentHomePage
  studentProjectActivitiesPage: StudentProjectActivitiesPage
  studentTrajectoriesSelfKnowledgePage: StudentTrajectoriesSelfKnowledgePage
  studentProjectActivitiesCatalogPage: StudentProjectActivitiesCatalogPage
}

export const test = base.extend<Fixtures>({
  pageTitleSteps: async ({ page }, use) => {
    await use(new PageTitleSteps(page))
  },
  paginationSteps: async ({ page }, use) => {
    await setLocaleFromPage(page)
    await use(new PaginationSteps(page))
  },
  studentGlobalSteps: async ({ page }, use) => {
    await setLocaleFromPage(page)
    await use(new StudentGlobalSteps(page))
  },
  studentHomePage: async ({ page }, use) => {
    await setLocaleFromPage(page)
    await use(new StudentHomePage(page))
  },
  studentProjectActivitiesPage: async ({ page }, use) => {
    await setLocaleFromPage(page)
    await use(new StudentProjectActivitiesPage(page))
  },
  studentTrajectoriesSelfKnowledgePage: async ({ page }, use) => {
    await setLocaleFromPage(page)
    await use(new StudentTrajectoriesSelfKnowledgePage(page))
  },
  studentProjectActivitiesCatalogPage: async ({ page }, use) => {
    await setLocaleFromPage(page)
    await use(new StudentProjectActivitiesCatalogPage(page))
  },
})

export const { BeforeScenario } = createBdd(test)
