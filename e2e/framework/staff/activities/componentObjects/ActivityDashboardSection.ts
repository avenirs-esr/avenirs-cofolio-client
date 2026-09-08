import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { expect, type Locator } from '@playwright/test'

export class ActivityDashboardSection extends BaseObject {
  constructor (root: Locator) {
    super(root)
  }

  private getUniqueStudentViewsCard () {
    return this.root.getByTestId('unique-student-views-dashboard-card')
  }

  private getEnrolledStudentsCard () {
    return this.root.getByTestId('enrolled-students-dashboard-card')
  }

  private getUnsubscriptionsLast30DaysCard () {
    return this.root.getByTestId('unsubscriptions-last-30-days-dashboard-card')
  }

  async verifyVisible () {
    await expect(this.root).toBeVisible()
  }

  async verifyUniqueStudentViewsCard () {
    await this.verifyDashboardCard(this.getUniqueStudentViewsCard())
  }

  async verifyEnrolledStudentsCard () {
    await this.verifyDashboardCard(this.getEnrolledStudentsCard())
  }

  async verifyUnsubscriptionsLast30DaysCard () {
    await this.verifyDashboardCard(this.getUnsubscriptionsLast30DaysCard())
  }

  private async verifyDashboardCard (card: Locator) {
    await expect(card).toBeVisible()
    await expect(card.getByTestId('dashboard-card-value')).toHaveText(/^\d+$/)
    await expect(card.getByTestId('dashboard-card-label')).not.toBeEmpty()
  }
}
