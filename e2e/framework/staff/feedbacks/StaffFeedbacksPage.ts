import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import { BasePage } from '@e2e/framework/shared/base/BasePage'
import { STAFF_ROUTES } from '@e2e/framework/shared/constants/routes'
import { waitForPageLoad } from '@e2e/framework/shared/utils/waits'
import { FeedbacksTable } from '@e2e/framework/staff/feedbacks/componentObjects/FeedbacksTable'
import { expect, type Page } from '@playwright/test'
import { Fixture, Given, Then, When } from 'playwright-bdd/decorators'

@Fixture<typeof test>('staffFeedbacksPage')
export class StaffFeedbacksPage extends BasePage {
  private static readonly ACTIVITY_WITH_ASSOCIATED_ELEMENTS_ID
    = '2a9f6c4d-8b1e-4d33-9c7a-5e2b8f1c6d77'

  constructor (public page: Page) {
    super(page)
  }

  private getFeedbacksTable () {
    return new FeedbacksTable(
      this.page.getByTestId('feedbacks-table'),
    )
  }

  private getStatusPicker () {
    return this.page.getByTestId('feedback-status-picker')
  }

  @Given('the staff opens the feedbacks page')
  async goToFeedbacksPage () {
    await this.page.goto(STAFF_ROUTES.STUDENT_FEEDBACKS)
    await waitForPageLoad(this.page)
  }

  @Then('the staff feedbacks page is displayed')
  async verifyPageLoaded () {
    await expect(this.page).toHaveURL(STAFF_ROUTES.STUDENT_FEEDBACKS)
  }

  @Then('the feedback status picker is visible and contains 4 elements')
  async verifyStatusPickerVisibleAndContainsFourElements () {
    await expect(this.getStatusPicker()).toBeVisible()

    await expect(
      this.getStatusPicker().locator('button'),
    ).toHaveCount(4)
  }

  @Then('the feedbacks table is visible and contains at least 2 rows')
  async verifyFeedbacksTableVisibleAndContainsAtLeast2Rows () {
    await this.getFeedbacksTable().verifyTableVisibleAndContainsRows()
  }

  @When('the staff clicks the access feedback button for an activity with associated elements')
  async clickAccessButtonForActivity () {
    await this.page
      .locator(
        `[data-testid="access-button"][data-activity-id="${StaffFeedbacksPage.ACTIVITY_WITH_ASSOCIATED_ELEMENTS_ID}"]`,
      )
      .first()
      .click()
  }
}
