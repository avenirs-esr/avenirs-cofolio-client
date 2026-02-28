import type { Locator } from '@playwright/test'

export async function extractNumberFromText (locator: Locator): Promise<number> {
  const text = await locator.textContent()
  return Number.parseInt(text?.match(/\d+/)?.[0] ?? '0')
}
