import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import type { Page } from '@playwright/test'
import { BasePage } from '@e2e/framework/shared/base/BasePage'
import { StaffOverviewWidget } from '@e2e/framework/staff/home/componentObjects/StaffOverviewWidget'
import { Fixture, Given, Then } from 'playwright-bdd/decorators'

@Fixture<typeof test>('staffHomePage')
export class StaffHomePage extends BasePage {
  constructor (public page: Page) {
    super(page)
  }

  getStaffOverviewWidget () {
    return new StaffOverviewWidget(this.page)
  }

  @Given('the staff profile overview widget is visible')
  async verifyStaffProfileOverviewWidgetVisible () {
    await this.getStaffOverviewWidget().isVisible()
  }

  @Then('the staff profile banner is visible')
  async verifyStaffProfileBanner () {
    await this.getStaffOverviewWidget().verifyProfileBanner()
  }

  @Then('the staff profile picture is visible')
  async verifyStaffProfilePicture () {
    await this.getStaffOverviewWidget().verifyProfilePicture()
  }

  @Then('the staff name is visible')
  async verifyStaffName () {
    await this.getStaffOverviewWidget().verifyStaffName()
  }
}
