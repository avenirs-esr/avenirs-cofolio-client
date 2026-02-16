import { PageTitleSteps } from '@e2e/framework/shared/steps/PageTitleSteps'
import { setLocaleFromPage } from '@e2e/framework/shared/utils/i18n'
import { StudentHomePage } from '@e2e/framework/student/home/StudentHomePage'
import { StudentProjectActivitiesPage } from '@e2e/framework/student/lifeProject/activities/StudentProjectActivitiesPage'
import { StudentTrajectoriesSelfKnowledgePage } from '@e2e/framework/student/lifeProject/selfKnowledge/StudentTrajectoriesSelfKnowledgePage'
import { StudentGlobalSteps } from '@e2e/framework/student/shared/steps/StudentGlobalSteps'
import { test as base, createBdd } from 'playwright-bdd'

interface Fixtures {
  pageTitleSteps: PageTitleSteps
  studentGlobalSteps: StudentGlobalSteps
  studentHomePage: StudentHomePage
  studentProjectActivitiesPage: StudentProjectActivitiesPage
  studentTrajectoriesSelfKnowledgePage: StudentTrajectoriesSelfKnowledgePage
}

export const test = base.extend<Fixtures>({
  pageTitleSteps: async ({ page }, use) => {
    await use(new PageTitleSteps(page))
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
  }
})

export const { BeforeScenario } = createBdd(test)
