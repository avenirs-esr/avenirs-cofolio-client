import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { t } from '@e2e/framework/shared/utils/i18n'
import { expect, type Locator } from '@playwright/test'

export class PageTitle extends BaseObject {
  constructor (root: Locator) {
    super(root)
  }

  getBreadcrumb () {
    return this.root.getByRole('navigation')
  }

  getBreadcrumbItems () {
    return this.getBreadcrumb().getByRole('listitem')
  }

  getBreadcrumbItemByIndex (index: number) {
    return this.getBreadcrumbItems().nth(index)
  }

  getBreadcrumbLinkByIndex (index: number) {
    return this.getBreadcrumbItemByIndex(index).getByRole('link')
  }

  getBreadcrumbLinkByText (text: string) {
    return this.getBreadcrumb().getByRole('link', { name: text })
  }

  getShowBreadcrumbButton () {
    return this.getBreadcrumb().getByRole('button', { name: t('global.breadcrumb.expandButtonLabel') })
  }

  getTitle () {
    return this.root.locator('h1')
  }

  async verifyBreadcrumbVisible () {
    await expect(this.getBreadcrumb()).toBeVisible()
  }

  async verifyBreadcrumbItemsCount (expectedCount: number) {
    await expect(this.getBreadcrumbItems()).toHaveCount(expectedCount)
  }

  async verifyBreadcrumbItemText (index: number, expectedText: string) {
    await expect(this.getBreadcrumbItemByIndex(index)).toHaveText(expectedText)
  }

  async verifyBreadcrumbLinkHref (index: number, expectedHref: string | RegExp) {
    await expect(this.getBreadcrumbLinkByIndex(index)).toHaveAttribute('href', expectedHref)
  }

  async verifyBreadcrumbItems (expectedItems: Array<{ text: string, href?: string | RegExp }>) {
    await this.verifyBreadcrumbItemsCount(expectedItems.length)

    for (let i = 0; i < expectedItems.length; i++) {
      await this.verifyBreadcrumbItemText(i, expectedItems[i].text)
      if (expectedItems[i].href) {
        await this.verifyBreadcrumbLinkHref(i, expectedItems[i].href!)
      }
    }
  }

  async clickBreadcrumbLink (index: number) {
    await this.getBreadcrumbLinkByIndex(index).click()
  }

  async verifyTitleVisible () {
    await expect(this.getTitle()).toBeVisible()
  }

  async verifyVisible () {
    await this.isVisible()
    await this.verifyBreadcrumbVisible()
    await this.verifyTitleVisible()
  }

  async verifyTitle (expectedTitle: string) {
    await expect(this.getTitle()).toHaveText(expectedTitle)
  }

  async verifyBreadcrumbItemsHidden () {
    await expect(this.getBreadcrumbItems().first()).toBeHidden()
  }

  async verifyBreadcrumbItemsVisible () {
    await expect(this.getBreadcrumbItems().first()).toBeVisible()
  }

  async verifyShowBreadcrumbButtonVisible () {
    await expect(this.getShowBreadcrumbButton()).toBeVisible()
  }

  async verifyShowBreadcrumbButtonHidden () {
    await expect(this.getShowBreadcrumbButton()).toBeHidden()
  }

  async clickShowBreadcrumbButton () {
    await this.getShowBreadcrumbButton().click()
  }
}
