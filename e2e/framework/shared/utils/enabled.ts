import type { Locator } from '@playwright/test'
import { expect } from '@playwright/test'

export async function verifyLocatorEnabled (locator: Locator) {
  await expect(locator).toBeVisible()

  const ariaDisabled = await locator.getAttribute('aria-disabled')
  expect(ariaDisabled).not.toBe('true')
}

export async function verifyLocatorDisabled (locator: Locator) {
  await expect(locator).toBeVisible()
  await expect(locator).toHaveAttribute('aria-disabled', 'true')
}
