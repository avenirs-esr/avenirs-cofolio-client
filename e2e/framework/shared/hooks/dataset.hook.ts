import type { Page } from '@playwright/test'
import { BeforeScenario } from '@e2e/framework/shared/fixtures/fixtures'
import { DatasetType, type UserDataset, users } from '@e2e/framework/shared/test-data/users'

async function setupTokenInterception (page: Page, userDataset: UserDataset, type: DatasetType): Promise<void> {
  if (userDataset.shouldIntercept && userDataset.token) {
    await page.setExtraHTTPHeaders({
      [type.replace('@', 'x-')]: 'true',
      Authorization: `Bearer ${userDataset.token}`,
    })
  }
}

BeforeScenario({ tags: DatasetType.EMPTY }, async ({ page }) => {
  await setupTokenInterception(page, users[DatasetType.EMPTY], DatasetType.EMPTY)
})

BeforeScenario({ tags: DatasetType.NOMINAL }, async ({ page }) => {
  await setupTokenInterception(page, users[DatasetType.NOMINAL], DatasetType.NOMINAL)
})

BeforeScenario({ tags: DatasetType.FULL }, async ({ page }) => {
  await setupTokenInterception(page, users[DatasetType.FULL], DatasetType.FULL)
})
