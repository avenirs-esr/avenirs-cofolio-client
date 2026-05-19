import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import { BasePage } from '@e2e/framework/shared/base/BasePage'
import { STAFF_ROUTES } from '@e2e/framework/shared/constants/routes'
import { waitForPageLoad } from '@e2e/framework/shared/utils/waits'
import { StaffLayout } from '@e2e/framework/staff/shared/componentObjects/StaffLayout'
import { expect, type Page } from '@playwright/test'
import { Fixture, Given, Then, When } from 'playwright-bdd/decorators'

export
@Fixture<typeof test>('staffGlobalSteps')
class StaffGlobalSteps extends BasePage {
  private layout: StaffLayout

  constructor (page: Page) {
    super(page)
    this.layout = new StaffLayout(page)
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

  @When('the user click on the ACTIVITIES link')
  async clickActivitiesLink () {
    await this.layout.getActivitiesNavLink().click()
  }

  @Then('the page navigates to activities page')
  async verifyNavigationToActivitiesPage () {
    await expect(this.page).toHaveURL(STAFF_ROUTES.ACTIVITIES)
  }

  @Then('the staff HOME link is visible')
  async verifyHomeLink () {
    await expect(this.layout.getHomeNavLink()).toBeVisible()
  }

  @Then('the staff ACTIVITIES link is visible')
  async verifyActivitiesLink () {
    await expect(this.layout.getActivitiesNavLink()).toBeVisible()
  }

  @Then('the staff main navigation menu is visible')
  async verifyMainNavigationMenuVisible () {
    await expect(this.layout.getMainNavigation()).toBeVisible()
  }
}
