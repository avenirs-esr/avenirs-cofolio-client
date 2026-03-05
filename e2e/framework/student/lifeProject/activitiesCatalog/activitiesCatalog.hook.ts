import process from 'node:process'
import { AfterScenario } from '@e2e/framework/shared/fixtures/fixtures'

AfterScenario({ tags: '@unsubscribe-activity-from-catalog' }, async ({ studentProjectActivitiesCatalogPage }) => {
  if (process.env.MSW_MODE_ON === 'true') {
    return
  }
  await studentProjectActivitiesCatalogPage.unsubscribeFromDefaultActivity()
})
