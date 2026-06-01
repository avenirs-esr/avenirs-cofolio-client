import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import { BasePage } from '@e2e/framework/shared/base/BasePage'
import { STAFF_ROUTES } from '@e2e/framework/shared/constants/routes'
import { waitForPageLoad } from '@e2e/framework/shared/utils/waits'
import { expect, type Page } from '@playwright/test'
import { Fixture, Given, Then } from 'playwright-bdd/decorators'

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
}
