import { setLocaleFromPage } from '@e2e/framework/shared/utils/i18n'
import { StudentHomePage } from '@e2e/framework/student/home/StudentHomePage'
import { test as base } from 'playwright-bdd'

interface Fixtures {
  studentHomePage: StudentHomePage
}

export const test = base.extend<Fixtures>({
  studentHomePage: async ({ page }, use) => {
    await setLocaleFromPage(page)
    await use(new StudentHomePage(page))
  }
})
