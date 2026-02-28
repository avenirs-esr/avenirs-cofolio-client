import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { expect, type Locator } from '@playwright/test'

export class PaginationObject extends BaseObject {
  constructor (root: Locator) {
    super(root)
  }

  getFirstButton () {
    return this.root.getByTestId('first-page-link')
  }

  getPreviousButton () {
    return this.root.getByTestId('previous-page-link')
  }

  getNextButton () {
    return this.root.getByTestId('next-page-link')
  }

  getLastButton () {
    return this.root.getByTestId('last-page-link')
  }

  getPageLink (pageNum: number) {
    return this.root.getByTestId(`page-link-${pageNum - 1}`)
  }

  async verifyPageCount (count: number) {
    await expect(this.getPageLink(count)).toBeVisible()
  }

  async navigateToFirst () {
    await this.getFirstButton().click()
  }

  async navigateToPrevious () {
    await this.getPreviousButton().click()
  }

  async navigateToPage (pageNum: number) {
    await this.getPageLink(pageNum).click()
  }

  async navigateToNext () {
    await this.getNextButton().click()
  }

  async navigateToLast () {
    await this.getLastButton().click()
  }

  async getCurrentPageSize (): Promise<number> {
    const text = await this.root.locator('.av-tag--selected').textContent()
    return Number.parseInt(text?.trim() ?? '12')
  }

  async verifyFirstDisabled () {
    await expect(this.getFirstButton()).toHaveAttribute('aria-disabled', 'true')
  }

  async verifyPreviousDisabled () {
    await expect(this.getPreviousButton()).toHaveAttribute('aria-disabled', 'true')
  }

  async verifyNextEnabled () {
    await expect(this.getNextButton()).not.toHaveAttribute('aria-disabled', 'true')
  }

  async verifyNextDisabled () {
    await expect(this.getNextButton()).toHaveAttribute('aria-disabled', 'true')
  }

  async verifyLastDisabled () {
    await expect(this.getLastButton()).toHaveAttribute('aria-disabled', 'true')
  }
}
