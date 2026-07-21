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
    await expect(this.page).toHaveURL(
      /\/cofolio\/staff\/activities\/(?:PUBLISHED|UNPUBLISHED)\/[^/]+$/
    )
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

  @Then('the staff sees at least one resource card for a file')
  async verifyAtLeastOneResourceCardWithFileVisible () {
    const count = await this.page.getByTestId('activity-resource-card-file').count()
    expect(count).toBeGreaterThan(0)
  }

  @Then('the staff sees at least one resource card for a link')
  async verifyAtLeastOneResourceCardWithLinkVisible () {
    const count = await this.page.getByTestId('activity-resource-card-link').count()
    expect(count).toBeGreaterThan(0)
  }

  @Then('the staff sees the setting details trace')
  async verifySettingDetailsTraceVisible () {
    await expect(this.page.getByTestId('activity-setting-details-trace')).toBeVisible()
  }

  @Then('the staff sees the trace associations limit badge')
  async verifyTraceAssociationsLimitBadgeVisible () {
    await expect(this.page.getByTestId('trace-associations-limit-badge')).toBeVisible()
  }
}
