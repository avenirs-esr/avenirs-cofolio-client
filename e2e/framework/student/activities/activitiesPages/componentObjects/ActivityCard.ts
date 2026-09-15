import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { expect, type Locator } from '@playwright/test'

export class ActivityCard extends BaseObject {
  constructor (protected root: Locator) {
    super(root)
  }

  getTitle () {
    return this.root.getByTestId('floating-icon-card-title')
  }

  getThematicBadge () {
    return this.root.getByTestId('activity-card-thematic-badge')
  }

  getSummary () {
    return this.root.getByTestId('activity-card-summary')
  }

  async verifyTitleVisible () {
    await expect(this.getTitle()).toBeVisible()
  }

  async verifyThematicBadgeVisible () {
    await expect(this.getThematicBadge()).toBeVisible()
  }

  async verifySummaryVisible () {
    await expect(this.getSummary()).toBeVisible()
  }
}
