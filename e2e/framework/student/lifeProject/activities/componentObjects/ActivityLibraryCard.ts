import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { expect, type Locator } from '@playwright/test'

export class ActivityLibraryCard extends BaseObject {
  constructor (protected root: Locator) {
    super(root)
  }

  getTitle () {
    return this.root.getByTestId('floating-icon-card-title')
  }

  getStatusBadge () {
    return this.root.getByTestId('activity-library-card-status-badge')
  }

  getThematicBadge () {
    return this.root.getByTestId('activity-library-card-thematic-badge')
  }

  getPeriodBadge () {
    return this.root.getByTestId('activity-library-card-period-badge')
  }

  getSummary () {
    return this.root.getByTestId('activity-library-card-summary')
  }

  async verifyTitleVisible () {
    await expect(this.getTitle()).toBeVisible()
  }

  async verifyThematicBadgeVisible () {
    await expect(this.getThematicBadge()).toBeVisible()
  }

  async verifyStatusBadgeVisible () {
    await expect(this.getStatusBadge()).toBeVisible()
  }

  async verifyStatusBadgeHidden () {
    await expect(this.getStatusBadge()).toBeHidden()
  }

  async verifySummaryVisible () {
    await expect(this.getSummary()).toBeVisible()
  }

  async verifySummaryHidden () {
    await expect(this.getSummary()).toBeHidden()
  }

  async verifyPeriodBadgeHidden () {
    await expect(this.getPeriodBadge()).toBeHidden()
  }
}
