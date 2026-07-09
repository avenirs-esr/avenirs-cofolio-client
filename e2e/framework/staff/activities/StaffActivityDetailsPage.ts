import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import { BasePage } from '@e2e/framework/shared/base/BasePage'
import { clickOnElement } from '@e2e/framework/shared/utils/click'
import { waitForPageLoad } from '@e2e/framework/shared/utils/waits'
import { expect, type Page } from '@playwright/test'
import { Fixture, Then, When } from 'playwright-bdd/decorators'

@Fixture<typeof test>('staffActivityDetailsPage')
export class StaffActivityDetailsPage extends BasePage {
  constructor (public page: Page) {
    super(page)
  }

  private getEditPublishedActivityButton () {
    return this.page.getByTestId('edit-draft-button')
  }

  @Then('the staff published activity details page is displayed')
  async verifyPublishedActivityDetailsPageDisplayed () {
    await expect(this.page).toHaveURL(/\/cofolio\/staff\/activities\/PUBLISHED\/[^/]+$/)
  }

  @Then('the edit published activity button is visible')
  async verifyEditPublishedActivityButtonVisible () {
    await expect(this.getEditPublishedActivityButton()).toBeVisible()
  }

  @When('the user clicks on the edit published activity button')
  async clickEditPublishedActivityButton () {
    await clickOnElement(this.getEditPublishedActivityButton())
    await waitForPageLoad(this.page)
  }
}
