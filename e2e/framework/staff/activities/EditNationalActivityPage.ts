import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import { BasePage } from '@e2e/framework/shared/base/BasePage'
import { STAFF_ROUTES } from '@e2e/framework/shared/constants/routes'
import { clickOnElement } from '@e2e/framework/shared/utils/click'
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
      .locator('[data-testid="activity-table-title"][data-activity-status="DRAFT"], [data-testid="activity-card-title"][data-activity-status="DRAFT"]')
      .first()
      .getAttribute('data-activity-id')

    if (!activityId) {
      throw new Error('No draft activity found')
    }

    await this.page.goto(
      `${STAFF_ROUTES.ACTIVITIES_EDIT_NATIONAL_ACTIVITY.replace(':id', activityId)}?mode=add`
    )
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

  @Then('the side navigation has {string} content section')
  async verifySideNavHasContentSection (section: string) {
    await expect(this.page.getByTestId(`menu-CONTENT-${section}`)).toBeVisible()
  }

  @Then('the activity title form field is visible')
  async verifyActivityTitleFormFieldVisible () {
    await expect(this.page.getByTestId('activity-title-form-field')).toBeVisible()
  }

  @Then('the side navigation menu is not visible')
  async verifySideNavigationMenuNotVisible () {
    await expect(this.getSideNavigation()).not.toBeVisible()
  }

  @When('the user clicks on the side navigation {string} content item')
  async clickSideNavContentItem (item: string) {
    await clickOnElement(this.page.getByTestId(`menu-CONTENT-${item}`))
  }

  @Given('the staff navigates to the publication tab')
  async navigateToPublicationTab () {
    await clickOnElement(this.page.getByTestId('activity-publication-tab'))
    await this.page.waitForURL('**tab=PUBLICATION**')
  }

  @When('the user clicks on the side navigation {string} publication item')
  async clickSideNavPublicationItem (item: string) {
    await clickOnElement(this.page.getByTestId(`menu-PUBLICATION-${item}`))
  }

  @Then('the side navigation has {string} publication section')
  async verifySideNavHasPublicationSection (section: string) {
    await expect(this.page.getByTestId(`menu-PUBLICATION-${section}`)).toBeVisible()
  }
}
