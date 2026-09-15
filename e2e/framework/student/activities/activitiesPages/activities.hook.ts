import { AfterScenario } from '@e2e/framework/shared/fixtures/fixtures'

AfterScenario({ tags: '@unsubscribe-activity-from-library' }, async ({ studentActivitiesPage, studentActivitiesCatalogPage }) => {
  await studentActivitiesPage.restoreActivitySubscription(studentActivitiesCatalogPage)
})
