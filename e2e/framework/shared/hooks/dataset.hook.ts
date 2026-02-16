import type { Page } from '@playwright/test'
import { BeforeScenario } from '@e2e/framework/shared/fixtures/fixtures'
import { DatasetType, type UserDataset, users } from '@e2e/framework/shared/test-data/users'

async function setupTokenInterception (page: Page, userDataset: UserDataset): Promise<void> {
  if (userDataset.shouldIntercept && userDataset.token) {
    await page.route('**/apim/**', async (route) => {
      const headers = {
        ...route.request().headers(),
        Authorization: `Bearer ${userDataset.token}`
      }
      await route.continue({ headers })
    })
  }
}

BeforeScenario({ tags: DatasetType.EMPTY }, async ({ page }) => {
  await setupTokenInterception(page, users[DatasetType.EMPTY])
})

BeforeScenario({ tags: DatasetType.NOMINAL }, async ({ page }) => {
  await setupTokenInterception(page, users[DatasetType.NOMINAL])
})

BeforeScenario({ tags: DatasetType.FULL }, async ({ page }) => {
  await setupTokenInterception(page, users[DatasetType.FULL])
})
