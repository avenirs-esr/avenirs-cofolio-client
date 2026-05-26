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

  @When('the staff navigates to the publication tab')
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
}
