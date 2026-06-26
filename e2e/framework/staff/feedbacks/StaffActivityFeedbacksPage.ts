import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import { BasePage } from '@e2e/framework/shared/base/BasePage'
import { STAFF_ROUTES } from '@e2e/framework/shared/constants/routes'
import { FeedbacksDashboardSection } from '@e2e/framework/staff/feedbacks/componentObjects/FeedbacksDashboardSection'
import { FeedbacksTable } from '@e2e/framework/staff/feedbacks/componentObjects/FeedbacksTable'
import { expect, type Page } from '@playwright/test'
import { Fixture, Then } from 'playwright-bdd/decorators'

@Fixture<typeof test>('staffActivityFeedbacksPage')
export class StaffActivityFeedbacksPage extends BasePage {
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

  private getFeedbacksDashboardSection () {
    return new FeedbacksDashboardSection(
      this.page.getByTestId('feedbacks-dashboard-section'),
    )
  }

  @Then('the staff activity feedbacks page is displayed')
  async verifyPageLoaded () {
    const expectedPattern = STAFF_ROUTES.ACTIVITY_FEEDBACKS.replace(':id', '[^/]+')
    await expect(this.page).toHaveURL(new RegExp(expectedPattern))
  }

  @Then('the activity feedbacks status picker is visible and contains 4 elements')
  async verifyStatusPickerVisibleAndContainsFourElements () {
    await expect(this.getStatusPicker()).toBeVisible()
    await expect(this.getStatusPicker().locator('button')).toHaveCount(4)
  }

  @Then('the activity feedbacks table is visible and contains at least 1 row')
  async verifyFeedbacksTableVisibleAndContainsRows () {
    await this.getFeedbacksTable().verifyTableVisibleAndContainsRows()
  }

  @Then('the activity feedbacks table shows the student name column')
  async verifyStudentNameColumn () {
    await this.getFeedbacksTable().verifyStudentCellVisible()
  }

  @Then('the activity feedbacks table shows the received date column')
  async verifyReceivedDateColumn () {
    await this.getFeedbacksTable().verifyReceivedAtCellVisible()
  }

  @Then('the activity feedbacks table shows the iteration column')
  async verifyIterationColumn () {
    await this.getFeedbacksTable().verifyIterationCellVisible()
  }

  @Then('the feedbacks dashboard section is visible')
  async verifyFeedbacksDashboardSectionVisible () {
    await this.getFeedbacksDashboardSection().verifyVisible()
  }

  @Then('the new feedbacks dashboard card is displayed')
  async verifyNewFeedbacksDashboardCard () {
    await this.getFeedbacksDashboardSection().verifyNewFeedbacksCard()
  }

  @Then('the pending feedbacks dashboard card is displayed')
  async verifyPendingFeedbacksDashboardCard () {
    await this.getFeedbacksDashboardSection().verifyPendingFeedbacksCard()
  }

  @Then('the processed feedbacks dashboard card is displayed')
  async verifyProcessedFeedbacksDashboardCard () {
    await this.getFeedbacksDashboardSection().verifyProcessedFeedbacksCard()
  }
}
