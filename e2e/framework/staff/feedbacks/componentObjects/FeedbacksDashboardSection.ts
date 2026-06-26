import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { expect, type Locator } from '@playwright/test'

export class FeedbacksDashboardSection extends BaseObject {
  constructor (root: Locator) {
    super(root)
  }

  getNewFeedbacksCard () {
    return this.root.getByTestId('new-feedbacks-dashboard-card')
  }

  getPendingFeedbacksCard () {
    return this.root.getByTestId('pending-feedbacks-dashboard-card')
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

  async verifyPendingFeedbacksCard () {
    await this.verifyDashboardCard(this.getPendingFeedbacksCard())
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
