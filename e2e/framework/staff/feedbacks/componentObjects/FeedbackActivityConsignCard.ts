import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { expect, type Locator } from '@playwright/test'

export class FeedbackActivityConsignCard extends BaseObject {
  constructor (root: Locator) {
    super(root)
  }

  private getContent () {
    return this.root.getByTestId('feedback-activity-consign-card')
  }

  async verifyVisible () {
    await expect(this.root).toBeVisible()
  }

  async verifyCollapsedByDefault () {
    await expect(this.getContent()).not.toBeVisible()
  }
}
