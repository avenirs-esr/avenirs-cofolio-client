import { AfterScenario } from '@e2e/framework/shared/fixtures/fixtures'

AfterScenario({ tags: '@unsubscribe-activity' }, async ({ studentProjectActivitiesPage, studentProjectActivitiesCatalogPage }) => {
  await studentProjectActivitiesPage.restoreActivitySubscription(studentProjectActivitiesCatalogPage)
})
