import { AV_BREAKPOINTS } from '@e2e/framework/shared/utils/dimension'
import { expect, type Locator, type Page } from '@playwright/test'
import { Given, Then, When } from 'playwright-bdd/decorators'

export abstract class BasePage {
  protected constructor (public page: Page) {}

  @Then('no horizontal scrolling is required')
  async verifyNoHorizontalScroll () {
    const { scrollWidth, clientWidth } = await this.page.evaluate(() => {
      const el = document.documentElement
      return { scrollWidth: el.scrollWidth, clientWidth: el.clientWidth }
    })

    expect(scrollWidth).toBeLessThanOrEqual(clientWidth)
  }

  async verifyLocatorIsFullWidth (locator: Locator, tolerancePercent = 10) {
    const viewport = this.page.viewportSize()
    if (!viewport) {
      throw new Error('Viewport not available')
    }

    const box = await locator.boundingBox()
    if (!box) {
      throw new Error('Element not visible')
    }

    const tolerancePx = (viewport.width * tolerancePercent) / 100
    expect(box.width).toBeGreaterThan(viewport.width - tolerancePx)
  }

  @Given('the page is displayed on mobile viewport')
  async verifyMobileViewport () {
    const viewport = this.page.viewportSize()
    expect(viewport?.width).toBeLessThanOrEqual(AV_BREAKPOINTS.md)
  }

  @When('the user scrolls down through the page')
  async scrollDown () {
    await this.page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight / 2)
    })
    await this.page.waitForTimeout(500)
  }

  @Then('the URL contains {string}')
  async verifyUrlContains (url: string) {
    await expect.poll(
      () => this.page.url(),
      { timeout: 5000 }
    ).toContain(url)
  }

  @Then('the page title is {string}')
  async verifyPageTitle (title: string) {
    await expect(this.page).toHaveTitle(title)
  }
}
