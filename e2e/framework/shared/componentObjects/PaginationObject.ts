import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { verifyLocatorDisabled, verifyLocatorEnabled } from '@e2e/framework/shared/utils/enabled'
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
    await verifyLocatorDisabled(this.getFirstButton())
  }

  async verifyPreviousDisabled () {
    await verifyLocatorDisabled(this.getPreviousButton())
  }

  async verifyNextEnabled () {
    await verifyLocatorEnabled(this.getNextButton())
  }

  async verifyNextDisabled () {
    await verifyLocatorDisabled(this.getNextButton())
  }

  async verifyLastDisabled () {
    await verifyLocatorDisabled(this.getLastButton())
  }
}
