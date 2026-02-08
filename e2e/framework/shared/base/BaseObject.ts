import { expect, type Locator, type Page } from '@playwright/test'

export abstract class BaseObject {
  protected constructor (protected readonly root: Locator, protected page?: Page) { }

  async click () {
    await this.root.click()
  }

  async isVisible () {
    await expect(this.root).toBeVisible()
  }
}
