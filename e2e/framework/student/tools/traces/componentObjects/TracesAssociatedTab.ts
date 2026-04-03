import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { expect, type Page } from '@playwright/test'

export class TracesAssociatedTab extends BaseObject {
  constructor (protected page: Page) {
    super(page.getByTestId('associated-traces-tab'), page)
  }

  getCards () {
    return this.root.getByTestId('associated-trace-card')
  }

  async getCardsCount () {
    return await this.getCards().count()
  }

  async verifyAssociatedTraceCardsNotEmpty () {
    const count = await this.getCards().count()
    expect(count).toBeGreaterThan(0)
  }

  getCardByIndex (index: number) {
    return this.getCards().nth(index)
  }

  async clickFirstCard () {
    await this.getCardByIndex(0).click()
  }
}
