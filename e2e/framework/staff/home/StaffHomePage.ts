import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import type { Page } from '@playwright/test'
import { BasePage } from '@e2e/framework/shared/base/BasePage'
import { UserProfileDropdown } from '@e2e/framework/shared/componentObjects/UserProfileDropdown'
import { t } from '@e2e/framework/shared/utils/i18n'
import { StaffOverviewWidget } from '@e2e/framework/staff/home/componentObjects/StaffOverviewWidget'
import { Fixture, Given, Then, When } from 'playwright-bdd/decorators'

@Fixture<typeof test>('staffHomePage')
export class StaffHomePage extends BasePage {
  constructor (public page: Page) {
    super(page)
  }

  getStaffOverviewWidget () {
    return new StaffOverviewWidget(this.page)
  }

  getStaffProfileDropdown () {
    return new UserProfileDropdown(this.page)
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

  @When('the staff opens the profile dropdown')
  async openStaffProfileDropdown () {
    await this.getStaffProfileDropdown().open()
  }

  @When('the staff clicks on the logout action')
  async clickStaffLogoutAction () {
    await this.getStaffProfileDropdown().clickLogoutAction()
  }

  @Then('the staff logout action have correct label')
  async verifyStaffLogoutActionLabel () {
    await this.getStaffProfileDropdown().verifyLogoutLabel(t('global.buttons.logout'))
  }

  @Then('the staff logout confirmation modal is visible')
  async verifyStaffLogoutConfirmationModalVisible () {
    await this.getStaffProfileDropdown().verifyLogoutConfirmationModalVisible()
  }
}
