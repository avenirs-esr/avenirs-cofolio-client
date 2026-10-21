import process from 'node:process'
import { AfterScenario } from '@e2e/framework/shared/fixtures/fixtures'

AfterScenario({ tags: '@unsubscribe-activity-from-catalog' }, async ({ studentActivitiesCatalogPage }) => {
  if (process.env.MSW_MODE_ON === 'true') {
    return
  }
  await studentActivitiesCatalogPage.unsubscribeFromDefaultActivity()
})
