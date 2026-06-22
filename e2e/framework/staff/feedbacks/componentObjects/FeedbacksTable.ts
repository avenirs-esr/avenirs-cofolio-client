import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { expect, type Locator } from '@playwright/test'

export class FeedbacksTable extends BaseObject {
  constructor (root: Locator) {
    super(root)
  }

  async verifyTableVisibleAndContainsRows () {
    await expect(this.root).toBeVisible()

    const countrows = await this.root.locator('tr').count()

    expect(countrows).toBeGreaterThanOrEqual(2)
  }
}
