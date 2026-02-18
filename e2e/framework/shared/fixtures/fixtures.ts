import { setLocaleFromPage } from '@e2e/framework/shared/utils/i18n'
import { StudentHomePage } from '@e2e/framework/student/home/StudentHomePage'
import { StudentProjectActivitiesPage } from '@e2e/framework/student/lifeProject/activities/StudentProjectActivitiesPage'
import { StudentTrajectoriesSelfKnowledgePage } from '@e2e/framework/student/lifeProject/selfKnowledge/StudentTrajectoriesSelfKnowledgePage'
import { test as base } from 'playwright-bdd'

interface Fixtures {
  studentHomePage: StudentHomePage
  studentProjectActivitiesPage: StudentProjectActivitiesPage
  studentTrajectoriesSelfKnowledgePage: StudentTrajectoriesSelfKnowledgePage
}

export const test = base.extend<Fixtures>({
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
