import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import { BasePage } from '@e2e/framework/shared/base/BasePage'
import { STAFF_ROUTES } from '@e2e/framework/shared/constants/routes'
import { waitForPageLoad } from '@e2e/framework/shared/utils/waits'
import { EditActivitySideNavigation } from '@e2e/framework/staff/activities/componentObjects/EditActivitySideNavigation'
import { EditActivityTabs } from '@e2e/framework/staff/activities/componentObjects/EditActivityTabs'
import { expect, type Page } from '@playwright/test'
import { Fixture, Given, Then, When } from 'playwright-bdd/decorators'

export
@Fixture<typeof test>('staffEditNationalActivityPage')
class StaffEditNationalActivityPage extends BasePage {
  constructor (public page: Page) {
    super(page)
  }

  private tabs () { return new EditActivityTabs(this.page) }
  private sideNav () { return new EditActivitySideNavigation(this.page) }

  @Given('the staff navigates to the first activity edit page')
  async navigateToEditNationalActivity () {
    const activityLocator = await this.page
      .locator('[data-testid="activity-table-title"][data-activity-status="DRAFT"], [data-testid="activity-card-title"][data-activity-status="DRAFT"]')
      .first()

    await expect(activityLocator).toBeVisible()

    const activityId = await activityLocator.getAttribute('data-activity-id')

    if (!activityId) {
      throw new Error('No draft activity found')
    }

    const url = STAFF_ROUTES.ACTIVITIES_EDIT_NATIONAL_ACTIVITY
      .replace(':id', activityId)
      .concat('?mode=add')

    await this.page.goto(url)
    await waitForPageLoad(this.page)
    await expect(this.page.getByTestId('activity-title-form-field')).toBeVisible()
  }

  @Then('the edit national activity page is displayed')
  async verifyPageLoaded () {
    const expectedPattern = STAFF_ROUTES.ACTIVITIES_EDIT_NATIONAL_ACTIVITY
      .replace(':id', '[^/]+')

    await expect(this.page).toHaveURL(new RegExp(expectedPattern))
  }

  @Then('the content tab is active by default')
  async verifyContentTabActiveByDefault () {
    await this.tabs().verifyContentTabActiveByDefault()
  }

  @Then('the side navigation menu is visible')
  async verifySideNavigationVisible () {
    await this.sideNav().verifyVisible()
  }

  @Then('the side navigation menu is expanded by default')
  async verifySideNavigationExpandedByDefault () {
    await this.sideNav().verifyExpandedByDefault()
  }

  @Then('the side navigation menu has content header')
  async verifySideNavigationHasContentHeader () {
    await this.sideNav().verifyHasHeader('CONTENT')
  }

  @Then('the side navigation menu has {string} content section')
  async verifySideNavigationHasContentSection (sectionId: string) {
    await this.sideNav().verifyHasSection('CONTENT', sectionId)
  }

  @Given('the staff navigates to the publication tab')
  async navigateToPublicationTab () {
    await this.tabs().clickPublicationTab()
  }

  @Then('the side navigation menu has publication header')
  async verifySideNavigationHasPublicationHeader () {
    await this.sideNav().verifyHasHeader('PUBLICATION')
  }

  @Then('the side navigation menu has {string} publication section')
  async verifySideNavigationHasPublicationSection (sectionId: string) {
    await this.sideNav().verifyHasSection('PUBLICATION', sectionId)
  }

  @Then('the publication tab is active')
  async verifyPublicationTabActive () {
    await this.tabs().verifyPublicationTabActive()
  }

  @When('the staff clicks on the content {string} section in the side navigation menu')
  async clickContentSectionInSideNav (sectionId: string) {
    await this.sideNav().clickMenuSection('CONTENT', sectionId)
  }

  @Then('the content {string} section is active in the side navigation menu')
  async verifyContentSectionActiveInSideNav (sectionId: string) {
    await this.sideNav().verifyMenuSectionIsActive('CONTENT', sectionId)
  }

  @Then('the content {string} section is not active in the side navigation menu')
  async verifyContentSectionNotActiveInSideNav (sectionId: string) {
    await this.sideNav().verifyMenuSectionIsNotActive('CONTENT', sectionId)
  }

  @When('the staff clicks on the publication {string} section in the side navigation menu')
  async clickPublicationSectionInSideNav (sectionId: string) {
    await this.sideNav().clickMenuSection('PUBLICATION', sectionId)
  }

  @Then('the publication {string} section is active in the side navigation menu')
  async verifyPublicationSectionActiveInSideNav (sectionId: string) {
    await this.sideNav().verifyMenuSectionIsActive('PUBLICATION', sectionId)
  }

  @Then('the publication {string} section is not active in the side navigation menu')
  async verifyPublicationSectionNotActiveInSideNav (sectionId: string) {
    await this.sideNav().verifyMenuSectionIsNotActive('PUBLICATION', sectionId)
  }

  @When('the staff collapses the side navigation menu')
  async collapseSideNavigation () {
    await this.sideNav().collapse()
  }

  @Then('the side navigation menu is collapsed')
  async verifySideNavigationCollapsed () {
    await this.sideNav().verifyCollapsed()
  }

  @Then('the side navigation menu is not visible')
  async verifySideNavigationMenuIsNotVisible () {
    await this.sideNav().verifyHidden()
  }

  @Then('the context of realization section is collapsed by default')
  async verifyContextSectionCollapsedByDefault () {
    await this.tabs().verifyContextSectionCollapsed()
  }

  @Then('the context of realization section is visible')
  async verifyContextSectionVisible () {
    await this.tabs().verifyContextSectionVisible()
  }

  @Then('the summary section is visible')
  async verifySummarySectionVisible () {
    await this.tabs().verifySummarySectionVisible()
  }

  @Then('the reflection parameter is visible')
  async verifyReflectionParameterVisible () {
    await this.tabs().verifyReflectionToggleVisible()
  }

  @Then('the trace association parameter is visible')
  async verifyTraceAssociationParameterVisible () {
    await this.tabs().verifyToggleVisible()
  }

  @Then('the feedback request parameter is visible')
  async verifyFeedbackRequestParameterVisible () {
    await this.tabs().verifyFeedbackCardVisible()
  }

  @When('the staff ensures the feedback request is enabled')
  async ensureFeedbackRequestEnabled () {
    await this.tabs().ensureFeedbackEnabled()
  }

  @When('the staff disables the feedback request')
  async disableFeedbackRequest () {
    await this.tabs().disableFeedback()
  }

  @When('the staff ensures unlimited feedback interactions is disabled')
  async ensureUnlimitedFeedbackInteractionsDisabled () {
    await this.tabs().disableInfinityFeedback()
  }

  @When('the staff enables unlimited feedback interactions')
  async enableUnlimitedFeedbackInteractions () {
    await this.tabs().enableInfinityFeedback()
  }

  @When('the staff disables unlimited feedback interactions')
  async disableUnlimitedFeedbackInteractions () {
    await this.tabs().disableInfinityFeedback()
  }

  @Then('the feedback max iterations input is visible')
  async verifyFeedbackMaxIterationsInputVisible () {
    await this.tabs().verifyFeedbackMaxInputVisible()
  }

  @Then('the feedback max iterations input is hidden')
  async verifyFeedbackMaxIterationsInputHidden () {
    await this.tabs().verifyFeedbackMaxInputHidden()
  }

  @Then('the consign section is collapsed by default')
  async verifyConsignFormFieldCollapsed () {
    await this.tabs().verifyActivityConsignFormFieldCollapsed()
  }

  @Then('the publish button is visible and enabled')
  async verifyPublishButtonVisibleAndEnabled () {
    await this.tabs().verifyPublishButtonVisible()
    await this.tabs().verifyPublishButtonEnabled()
  }

  @When('the staff clicks on the publish button')
  async clickPublishButton () {
    await this.tabs().clickPublishButton()
  }

  @Then('the publish confirmation modal is visible')
  async verifyPublishConfirmationModalVisible () {
    await this.tabs().verifyPublishConfirmationModalVisible()
  }

  @Then('the confirm and cancel buttons are visible')
  async verifyConfirmAndCancelButtonsVisible () {
    await this.tabs().verifyPublishConfirmButtonVisible()
    await this.tabs().verifyPublishCancelButtonVisible()
  }

  @When('the staff clicks on the cancel button in the confirmation modal')
  async clickPublishCancelButton () {
    await this.tabs().clickPublishCancelButton()
  }

  @Then('the confirmation modal is closed')
  async verifyPublishConfirmationModalClosed () {
    await this.tabs().verifyPublishConfirmationModalNotVisible()
  }
}
