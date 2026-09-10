import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { expect, type Locator } from '@playwright/test'

export class FeedbacksDashboardCards extends BaseObject {
  constructor (root: Locator) {
    super(root)
  }

  getNewFeedbacksCard () {
    return this.root.getByTestId('new-feedbacks-dashboard-card')
  }

  getUnprocessedFeedbacksCard () {
    return this.root.getByTestId('unprocessed-feedbacks-dashboard-card')
  }

  getProcessedFeedbacksCard () {
    return this.root.getByTestId('processed-feedbacks-dashboard-card')
  }

  async verifyVisible () {
    await expect(this.root).toBeVisible()
  }

  async verifyNewFeedbacksCard () {
    await this.verifyDashboardCard(this.getNewFeedbacksCard())
  }

  async verifyUnprocessedFeedbacksCard () {
    await this.verifyDashboardCard(this.getUnprocessedFeedbacksCard())
  }

  async verifyProcessedFeedbacksCard () {
    await this.verifyDashboardCard(this.getProcessedFeedbacksCard())
  }

  private async verifyDashboardCard (card: Locator) {
    await expect(card).toBeVisible()
    await expect(card.getByTestId('dashboard-card-value')).not.toBeEmpty()
    await expect(card.getByTestId('dashboard-card-label')).not.toBeEmpty()
  }
}
