import type { Locator } from '@playwright/test'
import { expect } from '@playwright/test'

export async function clickOnElement (element: Locator) {
  await expect(element).toBeVisible()
  await expect(element).toBeEnabled()
  await element.click()
}
