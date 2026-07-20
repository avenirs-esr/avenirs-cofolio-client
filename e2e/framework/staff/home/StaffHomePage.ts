import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import type { Page } from '@playwright/test'
import { BasePage } from '@e2e/framework/shared/base/BasePage'
import { NotificationsDropdown } from '@e2e/framework/shared/componentObjects/NotificationsDropdown'
import { UserProfileDropdown } from '@e2e/framework/shared/componentObjects/UserProfileDropdown'
import { STAFF_ROUTES } from '@e2e/framework/shared/constants/routes'
import { t } from '@e2e/framework/shared/utils/i18n'
import { waitForPageLoad } from '@e2e/framework/shared/utils/waits'
import { StaffOverviewWidget } from '@e2e/framework/staff/home/componentObjects/StaffOverviewWidget'
import { expect } from '@playwright/test'
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

  getStaffNotificationsDropdown () {
    return new NotificationsDropdown(this.page)
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

  @Given('the staff opens the notifications dropdown')
  async openStaffNotificationsDropdown () {
    await this.getStaffNotificationsDropdown().open()
  }

  @Then('the staff notifications dropdown title is displayed')
  async verifyStaffNotificationsDropdownTitle () {
    await this.getStaffNotificationsDropdown().verifyTitleVisible()
  }

  @Then('the staff notifications toggle is enabled')
  async verifyStaffNotificationsToggleEnabled () {
    await this.getStaffNotificationsDropdown().verifyToggleEnabled()
  }

  @Then('the staff notifications toggle is disabled')
  async verifyStaffNotificationsToggleDisabled () {
    await this.getStaffNotificationsDropdown().verifyToggleDisabled()
  }

  @When('the staff activates the notifications toggle')
  async activateStaffNotificationsToggle () {
    await this.getStaffNotificationsDropdown().activateToggle()
  }

  @When('the staff deactivates the notifications toggle')
  async deactivateStaffNotificationsToggle () {
    await this.getStaffNotificationsDropdown().deactivateToggle()
  }

  @Then('the staff notifications disabled message is displayed')
  async verifyStaffNotificationsDisabledMessage () {
    await this.getStaffNotificationsDropdown().verifyDisabledMessageVisible()
  }

  @Then('the staff exit button is displayed')
  async verifyStaffNotificationsExitButton () {
    await this.getStaffNotificationsDropdown().verifyExitButtonVisible()
  }

  @When('the staff clicks the exit button on the notifications dropdown')
  async clickStaffNotificationsExitButton () {
    await this.getStaffNotificationsDropdown().close()
  }

  @Then('the staff notifications dropdown is closed')
  async verifyStaffNotificationsDropdownClosed () {
    await this.getStaffNotificationsDropdown().verifyClosed()
  }

  @Then('the feedback notification card is displayed')
  async verifyStaffFeedbackNotificationCardVisible () {
    await this.getStaffNotificationsDropdown().verifyAtLeastOneFeedbackCardVisible()
  }

  @When('the staff clicks on a feedback notification card')
  async clickStaffFeedbackNotificationCard () {
    await this.getStaffNotificationsDropdown().clickFirstFeedbackCard()
  }

  @Then('the page navigates to the feedback detail page')
  async verifyNavigationToFeedbackDetailPage () {
    const [basePath] = STAFF_ROUTES.ACTIVITY_FEEDBACK_DETAILS.split(':')
    await expect(this.page).toHaveURL(new RegExp(`${basePath}.+`))
  }

  @Then('the notification is marked as read')
  async verifyStaffNotificationMarkedAsRead () {
    await this.page.goBack()
    await waitForPageLoad(this.page)
    await this.getStaffNotificationsDropdown().open()
    await this.getStaffNotificationsDropdown().verifyFirstFeedbackCardMarkedAsRead()
  }
}
