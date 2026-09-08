import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import { BasePage } from '@e2e/framework/shared/base/BasePage'
import { STAFF_ROUTES } from '@e2e/framework/shared/constants/routes'
import { clickOnElement } from '@e2e/framework/shared/utils/click'
import { t } from '@e2e/framework/shared/utils/i18n'
import { waitForPageLoad } from '@e2e/framework/shared/utils/waits'
import { ActivityDashboardSection } from '@e2e/framework/staff/activities/componentObjects/ActivityDashboardSection'
import { NationalActivityCatalogPreviewTabObject } from '@e2e/framework/staff/activities/componentObjects/NationalActivityCatalogPreviewTabObject'
import { expect, type Page } from '@playwright/test'
import { Fixture, Given, Then, When } from 'playwright-bdd/decorators'

const KEY_FIGURES_TAB_QUERY_VALUE = 'KEY_FIGURES'

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

  private getKeyFiguresTabSelector () {
    return this.page.getByTestId('national-activity-catalog-key-figures-tab-item')
  }

  private getActivityDashboardSection () {
    return new ActivityDashboardSection(
      this.page.getByTestId('activity-dashboard-section'),
    )
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

  @Then('the national activity catalog key figures tab selector is visible')
  async verifyKeyFiguresTabSelectorVisible () {
    await expect(this.getKeyFiguresTabSelector()).toBeVisible()
  }

  @Then('the national activity catalog key figures tab selector is labelled with the key figures title')
  async verifyKeyFiguresTabSelectorLabel () {
    await expect(this.getKeyFiguresTabSelector()).toContainText(
      t('staff.activities.views.NationalActivityCatalogView.tabs.keyFigures'),
    )
  }

  @When('the user clicks on the national activity catalog key figures tab')
  async clickKeyFiguresTab () {
    await clickOnElement(this.getKeyFiguresTabSelector())
  }

  @When('the staff reloads the national activity catalog page on the key figures tab')
  async reloadOnKeyFiguresTab () {
    const url = new URL(this.page.url())
    url.searchParams.set('tab', KEY_FIGURES_TAB_QUERY_VALUE)

    await this.page.goto(url.toString())
    await waitForPageLoad(this.page)
  }

  @Then('the national activity catalog key figures tab is selected')
  async verifyKeyFiguresTabSelected () {
    await expect(this.getKeyFiguresTabSelector()).toHaveAttribute('aria-selected', 'true')
  }

  @Then('the activity dashboard section is visible')
  async verifyActivityDashboardSectionVisible () {
    await this.getActivityDashboardSection().verifyVisible()
  }

  @Then('the activity dashboard section is not visible')
  async verifyActivityDashboardSectionHidden () {
    await this.getActivityDashboardSection().isHidden()
  }

  @Then('the unique student views dashboard card is displayed')
  async verifyUniqueStudentViewsDashboardCard () {
    await this.getActivityDashboardSection().verifyUniqueStudentViewsCard()
  }

  @Then('the enrolled students dashboard card is displayed')
  async verifyEnrolledStudentsDashboardCard () {
    await this.getActivityDashboardSection().verifyEnrolledStudentsCard()
  }

  @Then('the unsubscriptions of the last 30 days dashboard card is displayed')
  async verifyUnsubscriptionsLast30DaysDashboardCard () {
    await this.getActivityDashboardSection().verifyUnsubscriptionsLast30DaysCard()
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
