import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import { BasePage } from '@e2e/framework/shared/base/BasePage'
import { STAFF_ROUTES } from '@e2e/framework/shared/constants/routes'
import { waitForPageLoad } from '@e2e/framework/shared/utils/waits'
import { expect, type Page } from '@playwright/test'
import { Fixture, Given, Then, When } from 'playwright-bdd/decorators'

@Fixture<typeof test>('editNationalActivityPage')
export class EditNationalActivityPage extends BasePage {
  constructor (public page: Page) {
    super(page)
  }

  getSideNavigation () {
    return this.page.getByTestId('add-national-activity-side-navigation')
  }

  @Given('the staff navigates to the first activity edit page')
  async navigateToEditNationalActivity () {
    const activityId = await this.page
      .getByTestId('activity-table-title')
      .or(this.page.getByTestId('activity-card-title'))
      .first()
      .getAttribute('data-activity-id')

    if (!activityId) {
      throw new Error('No activity found')
    }

    await this.page.goto(`${STAFF_ROUTES.ACTIVITIES_EDIT_NATIONAL_ACTIVITY.replace(':id', activityId)}?mode=add`)
    await waitForPageLoad(this.page)
  }

  @Then('the edit national activity page is displayed')
  async verifyPageDisplayed () {
    await expect(this.getSideNavigation()).toBeVisible()
  }

  @Then('the side navigation menu is visible')
  async verifySideNavigationMenuVisible () {
    const sideNav = this.getSideNavigation()
    await expect(sideNav).toBeVisible()
  }

  @Then('the side navigation has TITLE section')
  async verifySideNavigationHasTitleSection () {
    await expect(this.page.getByTestId('menu-CONTENT-TITLE')).toBeVisible()
  }

  @Then('the side navigation has INSTRUCTIONS section')
  async verifySideNavigationHasInstructionsSection () {
    await expect(this.page.getByTestId('menu-CONTENT-INSTRUCTIONS')).toBeVisible()
  }

  @Then('the side navigation has CONTEXT section')
  async verifySideNavigationHasContextSection () {
    await expect(this.page.getByTestId('menu-CONTENT-CONTEXT')).toBeVisible()
  }

  @Then('the side navigation has DOCUMENTS section')
  async verifySideNavigationHasDocumentsSection () {
    await expect(this.page.getByTestId('menu-CONTENT-DOCUMENTS')).toBeVisible()
  }

  @Then('the side navigation has SCHEDULE section')
  async verifySideNavigationHasScheduleSection () {
    await expect(this.page.getByTestId('menu-CONTENT-SCHEDULE')).toBeVisible()
  }

  @Then('the side navigation has MODALITIES section')
  async verifySideNavigationHasModalitiesSection () {
    await expect(this.page.getByTestId('menu-CONTENT-MODALITIES')).toBeVisible()
  }

  @Then('the side navigation has THEMATIC section')
  async verifySideNavigationHasThematicSection () {
    await expect(this.page.getByTestId('menu-CONTENT-THEMATIC')).toBeVisible()
  }

  @Then('the side navigation menu is not visible')
  async verifySideNavigationMenuNotVisible () {
    await expect(this.getSideNavigation()).not.toBeVisible()
  }

  @When('the user clicks on the side navigation {string} item')
  async clickSideNavContentItem (item: string) {
    await this.page.getByTestId(`menu-CONTENT-${item}`).click()
  }

  @Given('the staff navigates to the publication tab')
  async navigateToPublicationTab () {
    await this.page.getByTestId('activity-publication-tab').click()
    await this.page.waitForURL('**tab=PUBLICATION**')
  }

  @When('the user clicks on the side navigation {string} publication item')
  async clickSideNavPublicationItem (item: string) {
    await this.page.getByTestId(`menu-PUBLICATION-${item}`).click()
  }

  @Then('the side navigation has {string} publication section')
  async verifySideNavHasPublicationSection (section: string) {
    await expect(this.page.getByTestId(`menu-PUBLICATION-${section}`)).toBeVisible()
  }
}
