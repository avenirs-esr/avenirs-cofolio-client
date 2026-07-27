import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import { BasePage } from '@e2e/framework/shared/base/BasePage'
import { STAFF_ROUTES } from '@e2e/framework/shared/constants/routes'
import { clickOnElement } from '@e2e/framework/shared/utils/click'
import { waitForPageLoad } from '@e2e/framework/shared/utils/waits'
import { NationalActivityCatalogPreviewTabObject } from '@e2e/framework/staff/activities/componentObjects/NationalActivityCatalogPreviewTabObject'
import { expect, type Page } from '@playwright/test'
import { Fixture, Given, Then, When } from 'playwright-bdd/decorators'

@Fixture<typeof test>('staffNationalActivityCatalogPage')
export class StaffNationalActivityCatalogPage extends BasePage {
  constructor (public page: Page) {
    super(page)
  }

  private getContentTab () {
    return this.page.getByTestId('national-activity-catalog-content-tab')
  }

  private getTitle () {
    return this.page.getByTestId('national-activity-content-tab-title')
  }

  private getThematicBadge () {
    return this.page.getByTestId('national-activity-content-tab-thematic-badge')
  }

  private getConsignTitle () {
    return this.page.getByTestId('national-activity-content-tab-consign-title')
  }

  private getContextTitle () {
    return this.page.getByTestId('national-activity-content-tab-context-title')
  }

  private getContentTabSelector () {
    return this.page.getByTestId('national-activity-catalog-content-tab-item')
  }

  private getPreviewTabSelector () {
    return this.page.getByTestId('national-activity-catalog-preview-tab-item')
  }

  private getPreviewTabObject () {
    return new NationalActivityCatalogPreviewTabObject(this.page)
  }

  @Given('the staff navigates to the first national activity catalog page')
  async navigateToNationalActivityCatalog () {
    const activityLocator = await this.page
      .locator('[data-testid="activity-table-title"][data-activity-status="DRAFT"], [data-testid="activity-card-title"][data-activity-status="DRAFT"]')
      .first()

    await expect(activityLocator).toBeVisible()

    const activityId = await activityLocator.getAttribute('data-activity-id')
    const activityStatus = await activityLocator.getAttribute('data-activity-status')

    if (!activityId || !activityStatus) {
      throw new Error('No activity found')
    }

    const url = STAFF_ROUTES.ACTIVITY_CATALOG
      .replace(':status', activityStatus)
      .replace(':id', activityId)

    await this.page.goto(url)
    await waitForPageLoad(this.page)
  }

  @Then('the national activity catalog page is displayed')
  async verifyPageLoaded () {
    const expectedPattern = STAFF_ROUTES.ACTIVITY_CATALOG
      .replace(':status', '[^/]+')
      .replace(':id', '[^/]+')

    await expect(this.page).toHaveURL(new RegExp(expectedPattern))
  }

  @Then('the national activity content tab is visible')
  async verifyContentTabVisible () {
    await expect(this.getContentTab()).toBeVisible()
  }

  @Then('the national activity title is visible')
  async verifyTitleVisible () {
    await expect(this.getTitle()).toBeVisible()
  }

  @Then('the national activity thematic badge is visible')
  async verifyThematicBadgeVisible () {
    await expect(this.getThematicBadge()).toBeVisible()
  }

  @Then('the national activity consign section is visible')
  async verifyConsignSectionVisible () {
    await expect(this.getConsignTitle()).toBeVisible()
  }

  @Then('the national activity context section is visible')
  async verifyContextSectionVisible () {
    await expect(this.getContextTitle()).toBeVisible()
  }

  @Then('the national activity catalog content tab selector is visible')
  async verifyContentTabSelectorVisible () {
    await expect(this.getContentTabSelector()).toBeVisible()
  }

  @Then('the national activity catalog preview tab selector is visible')
  async verifyPreviewTabSelectorVisible () {
    await expect(this.getPreviewTabSelector()).toBeVisible()
  }

  @When('the user clicks on the national activity catalog preview tab')
  async clickPreviewTab () {
    await clickOnElement(this.getPreviewTabSelector())
  }

  @Then('the national activity catalog preview tab is displayed')
  async verifyPreviewTabDisplayed () {
    await this.getPreviewTabObject().isVisible()
  }

  @Then('the activity title is visible in the preview tab')
  async verifyActivityTitleInPreviewTab () {
    await this.getPreviewTabObject().verifyTitleVisible()
  }

  @Then('the activity banner is visible in the preview tab')
  async verifyActivityBannerInPreviewTab () {
    await this.getPreviewTabObject().verifyBannerVisible()
  }

  @Then('the activity thematic is visible in the preview tab')
  async verifyActivityThematicInPreviewTab () {
    await this.getPreviewTabObject().verifyThematicVisible()
  }

  @Then('the activity summary is visible in the preview tab')
  async verifyActivitySummaryInPreviewTab () {
    await this.getPreviewTabObject().verifySummaryVisible()
  }

  @Then('the recommended completion contexts are visible in the preview tab')
  async verifyRecommendedCompletionContextsInPreviewTab () {
    await this.getPreviewTabObject().verifyRecommendedCompletionContextsInfoVisible()
  }

  getEditDraftButton () {
    return this.page.getByTestId('edit-draft-button')
  }

  @Then('the edit draft button is visible')
  async verifyEditDraftButtonVisible () {
    await expect(this.getEditDraftButton()).toBeVisible()
  }

  @When('the user clicks on the edit draft button')
  async clickEditDraftButton () {
    await clickOnElement(this.getEditDraftButton())
  }

  @Then('the staff is redirected to the edit national activity page')
  async verifyRedirectedToEditPage () {
    const expectedPattern = STAFF_ROUTES.ACTIVITIES_EDIT_NATIONAL_ACTIVITY
      .replace(':id', '[^/]+')

    await expect(this.page).toHaveURL(new RegExp(expectedPattern))
  }

  private getDeleteDraftButton () {
    return this.page.getByTestId('delete-draft-button')
  }

  @Then('the delete draft button is visible')
  async verifyDeleteDraftButtonVisible () {
    await expect(this.getDeleteDraftButton()).toBeVisible()
  }

  @When('the user clicks on the delete draft button')
  async clickDeleteDraftButton () {
    await clickOnElement(this.getDeleteDraftButton())
  }
}
