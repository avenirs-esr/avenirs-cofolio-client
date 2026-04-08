import { FooterSteps } from '@e2e/framework/shared/steps/FooterSteps'
import { PageTitleSteps } from '@e2e/framework/shared/steps/PageTitleSteps'
import { PaginationSteps } from '@e2e/framework/shared/steps/PaginationSteps'
import { setLocaleFromPage } from '@e2e/framework/shared/utils/i18n'
import { StaffHomePage } from '@e2e/framework/staff/home/StaffHomePage'
import { StudentHomePage } from '@e2e/framework/student/home/StudentHomePage'
import { StudentProjectActivitiesPage } from '@e2e/framework/student/lifeProject/activities/StudentProjectActivitiesPage'
import { StudentProjectActivitiesCatalogPage } from '@e2e/framework/student/lifeProject/activitiesCatalog/StudentProjectActivitiesCatalog'
import { StudentProjectActivityDetails } from '@e2e/framework/student/lifeProject/activityDetails/StudentProjectActivityDetails'
import { StudentTrajectoriesSelfKnowledgePage } from '@e2e/framework/student/lifeProject/selfKnowledge/StudentTrajectoriesSelfKnowledgePage'
import { StudentGlobalSteps } from '@e2e/framework/student/shared/steps/StudentGlobalSteps'
import { StudentTracePage } from '@e2e/framework/student/tools/traceDetails/StudentTracePage'
import { StudentToolsTracesPage } from '@e2e/framework/student/tools/traces/StudentToolsTracesPage'
import { test as base, createBdd } from 'playwright-bdd'

interface Fixtures {
  pageTitleSteps: PageTitleSteps
  paginationSteps: PaginationSteps
  footerSteps: FooterSteps
  staffHomePage: StaffHomePage
  studentGlobalSteps: StudentGlobalSteps
  studentHomePage: StudentHomePage
  studentProjectActivitiesPage: StudentProjectActivitiesPage
  studentProjectActivityDetails: StudentProjectActivityDetails
  studentTrajectoriesSelfKnowledgePage: StudentTrajectoriesSelfKnowledgePage
  studentProjectActivitiesCatalogPage: StudentProjectActivitiesCatalogPage
  studentToolsTracesPage: StudentToolsTracesPage
  studentTracePage: StudentTracePage
}

export const test = base.extend<Fixtures>({
  pageTitleSteps: async ({ page }, use) => {
    await use(new PageTitleSteps(page))
  },
  paginationSteps: async ({ page }, use) => {
    await setLocaleFromPage(page)
    await use(new PaginationSteps(page))
  },
  footerSteps: async ({ page }, use) => {
    await setLocaleFromPage(page)
    await use(new FooterSteps(page))
  },
  staffHomePage: async ({ page }, use) => {
    await setLocaleFromPage(page)
    await use(new StaffHomePage(page))
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
  studentProjectActivityDetails: async ({ page }, use) => {
    await setLocaleFromPage(page)
    await use(new StudentProjectActivityDetails(page))
  },
  studentTrajectoriesSelfKnowledgePage: async ({ page }, use) => {
    await setLocaleFromPage(page)
    await use(new StudentTrajectoriesSelfKnowledgePage(page))
  },
  studentProjectActivitiesCatalogPage: async ({ page }, use) => {
    await setLocaleFromPage(page)
    await use(new StudentProjectActivitiesCatalogPage(page))
  },
  studentToolsTracesPage: async ({ page }, use) => {
    await setLocaleFromPage(page)
    await use(new StudentToolsTracesPage(page))
  },
  studentTracePage: async ({ page }, use) => {
    await setLocaleFromPage(page)
    await use(new StudentTracePage(page))
  }
})

export const { BeforeScenario, AfterScenario } = createBdd(test)
