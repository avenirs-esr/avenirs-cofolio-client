import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import { BasePage } from '@e2e/framework/shared/base/BasePage'
import { NotificationsDropdown } from '@e2e/framework/shared/componentObjects/NotificationsDropdown'
import { UserProfileDropdown } from '@e2e/framework/shared/componentObjects/UserProfileDropdown'
import { t } from '@e2e/framework/shared/utils/i18n'
import { waitForPageLoad } from '@e2e/framework/shared/utils/waits'
import { ActivitiesWidget } from '@e2e/framework/student/home/componentObjects/ActivitiesWidget'
import { StudentOverviewWidget } from '@e2e/framework/student/home/componentObjects/StudentOverviewWidget'
import { TracesWidget } from '@e2e/framework/student/home/componentObjects/TracesWidget'
import { expect, type Page } from '@playwright/test'
import { Fixture, Given, Then, When } from 'playwright-bdd/decorators'

export
@Fixture<typeof test>('studentHomePage')
class StudentHomePage extends BasePage {
  constructor (public page: Page) {
    super(page)
  }

  getTracesWidget () {
    return new TracesWidget(this.page)
  }

  getNewActivitiesWidget () {
    return new ActivitiesWidget(this.page, true)
  }

  getLibraryActivitiesWidget () {
    return new ActivitiesWidget(this.page, false)
  }

  getStudentOverviewWidget () {
    return new StudentOverviewWidget(this.page)
  }

  getPageHeading () {
    return this.page.getByRole('heading', { level: 1 })
  }

  getMobileMenuButton () {
    return this.page.getByTestId('open-menu-btn')
  }

  getStudentProfileDropdown () {
    return new UserProfileDropdown(this.page)
  }

  getStudentNotificationsDropdown () {
    return new NotificationsDropdown(this.page)
  }

  @Given('the profile overview widget is visible')
  @Then('the profile overview widget is still visible')
  async verifyProfileOverviewWidgetVisible () {
    await this.getStudentOverviewWidget().isVisible()
  }

  @Given('there are traces available')
  async verifyTracesAvailable () {
    await this.getTracesWidget().verifyVisible()
  }

  @Then('the last traces widget is visible')
  async verifyLastTracesWidgetVisible () {
    await this.getTracesWidget().verifyVisible()
  }

  @Then('the profile banner is visible')
  async verifyProfileBanner () {
    await this.getStudentOverviewWidget().verifyProfileBanner()
  }

  @Then('the profile picture is visible')
  async verifyProfilePicture () {
    await this.getStudentOverviewWidget().verifyProfilePicture()
  }

  @Then('the student name is visible')
  async verifyStudentName () {
    await this.getStudentOverviewWidget().verifyStudentName()
  }

  @Then('the student bio is visible')
  async verifyStudentBio () {
    await this.getStudentOverviewWidget().verifyStudentBio()
  }

  @Then('the student bio is hidden')
  async verifyStudentBioHidden () {
    await this.getStudentOverviewWidget().verifyStudentBioHidden()
  }

  @Then('profile action buttons are displayed')
  async verifyProfileActionButtons () {
    await this.getStudentOverviewWidget().verifyActionButtons()
  }

  @Then('edit profile button is displayed')
  async verifyEditProfileButton () {
    await expect(this.getStudentOverviewWidget().getEditProfileButton()).toBeVisible()
  }

  @When('the student clicks the edit profile button')
  async clickEditProfileButton () {
    await this.getStudentOverviewWidget().clickEditProfileButton()
  }

  @Then('the update profile drawer is opened')
  async verifyUpdateProfileDrawerOpened () {
    await this.getStudentOverviewWidget().verifyDrawerOpened()
  }

  @When('the student closes the drawer')
  async closeDrawer () {
    await this.getStudentOverviewWidget().closeDrawer()
  }

  @Then('the update profile drawer is closed')
  async verifyUpdateProfileDrawerClosed () {
    await this.getStudentOverviewWidget().verifyDrawerClosed()
  }

  @Then('some trace cards are displayed')
  async verifyHasTraceCards () {
    await this.getTracesWidget().verfifyHasTraces()
  }

  @Then('the see all traces button is visible')
  async verifySeeAllTracesButton () {
    await this.getTracesWidget().verifySeeAllButton()
  }

  @When('the student clicks a trace card')
  async clickFirstTraceCard () {
    await this.getTracesWidget().clickFirstCard()
    await waitForPageLoad(this.page)
  }

  @When('the student clicks see all traces button')
  async clickSeeAllTracesButton () {
    await this.getTracesWidget().clickSeeAllButton()
    await waitForPageLoad(this.page)
  }

  @Given('the new activities widget is visible')
  async verifyNewActivitiesWidgetVisible () {
    await this.getNewActivitiesWidget().verifyVisible()
  }

  @Then('the see all new activities button is visible')
  async verifySeeAllNewActivitiesButton () {
    await this.getNewActivitiesWidget().verifySeeAllButton()
  }

  @Then('the new activities widget displays correctly')
  async verifyNewActivitiesWidgetDisplaysCorrectly () {
    await this.getNewActivitiesWidget().verifyActivitiesWidget()
  }

  @When('the student clicks a new activity card')
  async clickFirstNewActivityCard () {
    await this.getNewActivitiesWidget().clickFirstCard()
    await waitForPageLoad(this.page)
  }

  @When('the student clicks see all new activities button')
  async clickSeeAllNewActivitiesButton () {
    await this.getNewActivitiesWidget().clickSeeAllButton()
    await waitForPageLoad(this.page)
  }

  @Given('the library activities widget is visible')
  async verifyLibraryActivitiesWidgetVisible () {
    await this.getLibraryActivitiesWidget().verifyVisible()
  }

  @Then('the see all library activities button is visible')
  async verifySeeAllLibraryActivitiesButton () {
    await this.getLibraryActivitiesWidget().verifySeeAllButton()
  }

  @Then('the library activities widget displays correctly')
  async verifyLibraryActivitiesWidgetDisplaysCorrectly () {
    await this.getLibraryActivitiesWidget().verifyActivitiesWidget()
  }

  @When('the student clicks a library activity card')
  async clickFirstLibraryActivityCard () {
    await this.getLibraryActivitiesWidget().clickFirstCard()
    await waitForPageLoad(this.page)
  }

  @When('the student clicks see all library activities button')
  async clickSeeAllLibraryActivitiesButton () {
    await this.getLibraryActivitiesWidget().clickSeeAllButton()
    await waitForPageLoad(this.page)
  }

  @Then('all visible widgets span full width')
  async verifyAllWidgetsSpanFullWidth () {
    await this.verifyLocatorIsFullWidth(this.getStudentOverviewWidget().getRoot())
  }

  @Then('all widgets load and display correctly')
  async verifyAllWidgetsLoadAndDisplayCorrectly () {
    await expect(this.getStudentOverviewWidget().getProfileBanner()).toBeAttached()
    await expect(this.getTracesWidget().verifyTracesWidget())
    await expect(this.getNewActivitiesWidget().verifyActivitiesWidget())
    await expect(this.getLibraryActivitiesWidget().verifyActivitiesWidget())
  }

  @Then('content remains readable during scroll')
  async verifyContentReadableDuringScroll () {
    await expect(this.getPageHeading()).toBeAttached()
    await expect(this.getStudentOverviewWidget().getProfileBanner()).toBeAttached()
  }

  @When('the student opens the profile dropdown')
  async openStudentProfileDropdown () {
    await this.getStudentProfileDropdown().open()
  }

  @When('the student clicks on the logout action')
  async clickStudentLogoutAction () {
    await this.getStudentProfileDropdown().clickLogoutAction()
  }

  @Then('the student logout action have correct label')
  async verifyStudentLogoutActionLabel () {
    await this.getStudentProfileDropdown().verifyLogoutLabel(t('global.buttons.logout'))
  }

  @Then('the student logout confirmation modal is visible')
  async verifyStudentLogoutConfirmationModalVisible () {
    await this.getStudentProfileDropdown().verifyLogoutConfirmationModalVisible()
  }

  @Given('the student opens the notifications dropdown')
  async openStudentNotificationsDropdown () {
    await this.getStudentNotificationsDropdown().open()
  }

  @Then('the student notifications dropdown title is displayed')
  async verifyStudentNotificationsDropdownTitle () {
    await this.getStudentNotificationsDropdown().verifyTitleVisible()
  }

  @Then('the student notifications toggle is enabled')
  async verifyStudentNotificationsToggleEnabled () {
    await this.getStudentNotificationsDropdown().verifyToggleEnabled()
  }

  @Then('the student notifications toggle is disabled')
  async verifyStudentNotificationsToggleDisabled () {
    await this.getStudentNotificationsDropdown().verifyToggleDisabled()
  }

  @When('the student activates the notifications toggle')
  async activateStudentNotificationsToggle () {
    await this.getStudentNotificationsDropdown().activateToggle()
  }

  @When('the student deactivates the notifications toggle')
  async deactivateStudentNotificationsToggle () {
    await this.getStudentNotificationsDropdown().deactivateToggle()
  }

  @Then('the student notifications disabled message is displayed')
  async verifyStudentNotificationsDisabledMessage () {
    await this.getStudentNotificationsDropdown().verifyDisabledMessageVisible()
  }

  @Then('the student exit button is displayed')
  async verifyStudentNotificationsExitButton () {
    await this.getStudentNotificationsDropdown().verifyExitButtonVisible()
  }

  @When('the student clicks the exit button on the notifications dropdown')
  async clickStudentNotificationsExitButton () {
    await this.getStudentNotificationsDropdown().close()
  }

  @Then('the student notifications dropdown is closed')
  async verifyStudentNotificationsDropdownClosed () {
    await this.getStudentNotificationsDropdown().verifyClosed()
  }
}
