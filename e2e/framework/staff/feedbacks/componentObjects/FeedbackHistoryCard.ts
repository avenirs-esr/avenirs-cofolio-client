import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { clickOnElement } from '@e2e/framework/shared/utils/click'
import { expect, type Locator } from '@playwright/test'

export class FeedbackHistoryCard extends BaseObject {
  constructor (root: Locator) {
    super(root)
  }

  private getBadge () {
    return this.root.getByTestId('feedback-history-card-badge')
  }

  private getDate () {
    return this.root.getByTestId('feedback-history-card-date')
  }

  private getAuthor () {
    return this.root.getByTestId('feedback-history-card-author')
  }

  private getContent () {
    return this.root.getByTestId('feedback-history-card-content')
  }

  private getDetailLink () {
    return this.root.getByTestId('feedback-history-card-detail-link')
  }

  private getExpandButton () {
    return this.root.getByTestId('expand-button')
  }

  async verifyCollapsed () {
    await expect(this.root).toHaveAttribute('data-collapsed', 'true')
    await this.verifyCardExpandedStateHidden()
  }

  async verifyCardCollapsedStateVisible () {
    await expect(this.getBadge()).toBeVisible()
    await expect(this.getDate()).toBeVisible()
    await expect(this.getAuthor()).toBeVisible()
  }

  async verifyCardExpandedStateVisible () {
    await expect(this.getBadge()).toBeVisible()
    await expect(this.getDate()).toBeVisible()
    await expect(this.getAuthor()).toBeVisible()
    await expect(this.getContent()).toBeVisible()
    await expect(this.getDetailLink()).toBeVisible()
  }

  async verifyCardExpandedStateHidden () {
    await expect(this.getContent()).toBeHidden()
    await expect(this.getDetailLink()).toBeHidden()
  }

  async expand () {
    await clickOnElement(this.getExpandButton())
  }

  async getIterationNumber (): Promise<number> {
    const text = await this.getBadge().textContent() ?? ''
    const match = text.match(/\d+/)
    return match ? Number.parseInt(match[0], 10) : 0
  }
}
