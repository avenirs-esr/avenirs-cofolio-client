import type { Page } from '@playwright/test'
import process from 'node:process'
import { BeforeScenario } from '@e2e/framework/shared/fixtures/fixtures'
import { DatasetType, type UserDataset, users } from '@e2e/framework/shared/test-data/users'

async function setupTokenInterception (page: Page, userDataset: UserDataset, type: DatasetType): Promise<void> {
  if (userDataset.shouldIntercept && userDataset.token) {
    const headers = {
      Authorization: `Bearer ${userDataset.token}`
    }

    if (process.env.MSW_MODE_ON === 'true') {
      Object.assign(headers, {
        [type.replace('@', 'x-')]: 'true'
      })
    }

    await page.setExtraHTTPHeaders(headers)
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
