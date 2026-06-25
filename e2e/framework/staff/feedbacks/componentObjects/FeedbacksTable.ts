import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { expect, type Locator } from '@playwright/test'

export class FeedbacksTable extends BaseObject {
  constructor (root: Locator) {
    super(root)
  }

  async verifyTableVisibleAndContainsRows () {
    await expect(this.root).toBeVisible()
    await expect(this.root.locator('tr')).not.toHaveCount(0)

    const countRows = await this.root.locator('tr').count()

    expect(countRows).toBeGreaterThanOrEqual(2)
  }

  private getStudentCell () {
    return this.root.locator('[data-testid="feedback-student-cell"]').first()
  }

  private getReceivedAtCell () {
    return this.root.locator('[data-testid="feedback-received-at-cell"]').first()
  }

  private getIterationCell () {
    return this.root.locator('[data-testid="feedback-iteration-badge"]').first()
  }

  async verifyStudentCellVisible () {
    await expect(this.getStudentCell()).toBeVisible()
  }

  async verifyReceivedAtCellVisible () {
    await expect(this.getReceivedAtCell()).toBeVisible()
  }

  async verifyIterationCellVisible () {
    await expect(this.getIterationCell()).toBeVisible()
  }
}
