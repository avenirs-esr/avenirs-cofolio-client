import type { Page } from '@playwright/test'

/**
 * Waits for the page to reach a stable state after loading.
 *
 * Instead of waiting for strict 'networkidle', we wait for 'domcontentloaded'
 * then check for idle network with a timeout. This is more reliable for testing
 * with MSW which may have pending requests that don't affect page usability.
 */
export async function waitForPageLoad (page: Page): Promise<void> {
  try {
    // First, wait for DOM to be loaded
    await page.waitForLoadState('domcontentloaded')

    // Then attempt to wait for network idle with a custom timeout.
    // If it fails (e.g., due to infinite polling), we continue anyway
    // as the page is likely usable even if some background requests are pending.
    try {
      const NETWORK_IDLE_TIMEOUT = 3000
      const networkIdlePromise = page.waitForLoadState('networkidle')
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Network idle timeout')), NETWORK_IDLE_TIMEOUT)
      })
      await Promise.race([networkIdlePromise, timeoutPromise])
    }
    catch {
      // Network didn't reach idle within timeout - this can happen with certain
      // API patterns or MSW mock configurations. The page is still usable.
      // We'll do a final brief delay to ensure the app has mounted
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }
  catch (error) {
    throw new Error(`Failed to wait for page load: ${error instanceof Error ? error.message : String(error)}`)
  }
}
