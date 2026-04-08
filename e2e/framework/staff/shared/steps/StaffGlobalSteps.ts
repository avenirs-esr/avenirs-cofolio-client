import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import { BasePage } from '@e2e/framework/shared/base/BasePage'
import { STAFF_ROUTES } from '@e2e/framework/shared/constants/routes'
import { waitForPageLoad } from '@e2e/framework/shared/utils/waits'
import { expect, type Page } from '@playwright/test'
import { Fixture, Given, Then } from 'playwright-bdd/decorators'

export
@Fixture<typeof test>('staffGlobalSteps')
class StaffGlobalSteps extends BasePage {
  constructor (page: Page) {
    super(page)
  }

  @Given('the staff opens the home page')
  async goToHomePage () {
    await this.page.goto(STAFF_ROUTES.HOME)
    await waitForPageLoad(this.page)
  }

  @Then('the staff home page is displayed')
  async verifyPageLoaded () {
    await expect(this.page).toHaveURL(STAFF_ROUTES.HOME)
  }
}
