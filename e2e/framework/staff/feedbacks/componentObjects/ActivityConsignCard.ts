import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { expect, type Locator } from '@playwright/test'

export class ActivityConsignCard extends BaseObject {
  constructor (root: Locator) {
    super(root)
  }

  private getContent () {
    return this.root.getByTestId('activity-consign-card-content')
  }

  async verifyVisible () {
    await expect(this.root).toBeVisible()
  }

  async verifyCollapsedByDefault () {
    await expect(this.getContent()).not.toBeVisible()
  }
}
