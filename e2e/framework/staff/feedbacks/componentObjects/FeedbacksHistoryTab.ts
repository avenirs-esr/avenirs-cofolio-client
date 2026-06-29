import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { FeedbackHistoryCard } from '@e2e/framework/staff/feedbacks/componentObjects/FeedbackHistoryCard'
import { expect, type Locator } from '@playwright/test'

export class FeedbacksHistoryTab extends BaseObject {
  constructor (root: Locator) {
    super(root)
  }

  private getCards () {
    return this.root.getByTestId('feedback-history-card')
  }

  private getCard (index: number) {
    return new FeedbackHistoryCard(this.getCards().nth(index))
  }

  async verifyVisible () {
    await expect(this.root).toBeVisible()
  }

  async verifyContainsAtLeastOneCard () {
    await expect(this.getCards().first()).toBeVisible()
  }

  async verifyFirstCardCollapsed () {
    await this.getCard(0).verifyCollapsed()
  }

  async verifyFirstCardCollapsedStateVisible () {
    await this.getCard(0).verifyCardCollapsedStateVisible()
  }

  async verifyFirstCardExpandedStateVisible () {
    await this.getCard(0).verifyCardExpandedStateVisible()
  }

  async expandFirstCard () {
    await this.getCard(0).expand()
  }

  async verifyAntiChronologicalOrder () {
    const count = await this.getCards().count()
    expect(count).toBeGreaterThanOrEqual(2)

    const firstIteration = await this.getCard(0).getIterationNumber()
    const lastIteration = await this.getCard(count - 1).getIterationNumber()

    expect(firstIteration).toBeGreaterThan(lastIteration)
  }
}
