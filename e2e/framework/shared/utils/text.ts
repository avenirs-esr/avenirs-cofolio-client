import { expect, type Locator } from '@playwright/test'

export async function extractNumberFromText (locator: Locator): Promise<number> {
  const text = await locator.textContent()
  return Number.parseInt(text?.match(/\d+/)?.[0] ?? '0')
}

export async function verifyTextLocator (locator: Locator) {
  await expect(locator).toBeVisible()
  const text = await locator.textContent()
  expect(text?.trim()).toBeTruthy()
}
