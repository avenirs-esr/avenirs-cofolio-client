import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import type { Page } from '@playwright/test'
import { BasePage } from '@e2e/framework/shared/base/BasePage'
import { NotificationsDropdown } from '@e2e/framework/shared/componentObjects/NotificationsDropdown'
import { UserProfileDropdown } from '@e2e/framework/shared/componentObjects/UserProfileDropdown'
import { t } from '@e2e/framework/shared/utils/i18n'
import { waitForPageLoad } from '@e2e/framework/shared/utils/waits'
import { ActivitiesWidget } from '@e2e/framework/staff/home/componentObjects/ActivitiesWidget'
import { FeedbacksWidget } from '@e2e/framework/staff/home/componentObjects/FeedbacksWidget'
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

  getFeedbacksWidget () {
    return new FeedbacksWidget(this.page)
  }

  getDraftActivitiesWidget () {
    return new ActivitiesWidget(this.page, true)
  }

  getPublishedActivitiesWidget () {
    return new ActivitiesWidget(this.page, false)
  }

  // TODO: La gestion du dropdown ne doit pas être dans StaffHomePage.
  // C'est un composant du layout global au staff, il devrait être dans StaffLayout
  getStaffProfileDropdown () {
    return new UserProfileDropdown(this.page)
  }

  // TODO: La gestion des notifications ne doit pas être dans StaffHomePage.
  // C'est un composant du layout global au staff, il devrait être dans StaffLayout
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

  @Given('the staff feedbacks widget is visible')
  async verifyStaffFeedbacksWidgetVisible () {
    await this.getFeedbacksWidget().isVisible()
  }

  @Then('the feedbacks widget displays correctly')
  async verifyFeedbacksWidgetDisplaysCorrectly () {
    await this.getFeedbacksWidget().verifyFeedbacksWidget()
  }

  @When('the staff clicks a feedback card')
  async clickFirstFeedbackCard () {
    await this.getFeedbacksWidget().clickFirstCard()
    await waitForPageLoad(this.page)
  }

  @When('the staff clicks see all feedbacks button')
  async clickSeeAllFeedbacksButton () {
    await this.getFeedbacksWidget().clickSeeAllButton()
    await waitForPageLoad(this.page)
  }

  @Given('the staff draft activities widget is visible')
  async verifyStaffDraftActivitiesWidgetVisible () {
    await this.getDraftActivitiesWidget().isVisible()
  }

  @Then('the draft activities widget displays correctly')
  async verifyDraftActivitiesWidgetDisplaysCorrectly () {
    await this.getDraftActivitiesWidget().verifyActivitiesWidget()
  }

  @When('the staff clicks a draft activity card')
  async clickFirstDraftActivityCard () {
    await this.getDraftActivitiesWidget().clickFirstCard()
    await waitForPageLoad(this.page)
  }

  @When('the staff clicks see all draft activities button')
  async clickSeeAllDraftActivitiesButton () {
    await this.getDraftActivitiesWidget().clickSeeAllButton()
    await waitForPageLoad(this.page)
  }

  @Given('the staff published activities widget is visible')
  async verifyStaffPublishedActivitiesWidgetVisible () {
    await this.getPublishedActivitiesWidget().isVisible()
  }

  @Then('the published activities widget displays correctly')
  async verifyPublishedActivitiesWidgetDisplaysCorrectly () {
    await this.getPublishedActivitiesWidget().verifyActivitiesWidget()
  }

  @When('the staff clicks a published activity card')
  async clickFirstPublishedActivityCard () {
    await this.getPublishedActivitiesWidget().clickFirstCard()
    await waitForPageLoad(this.page)
  }

  @When('the staff clicks see all published activities button')
  async clickSeeAllPublishedActivitiesButton () {
    await this.getPublishedActivitiesWidget().clickSeeAllButton()
    await waitForPageLoad(this.page)
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
}
