import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { t } from '@e2e/framework/shared/utils/i18n'
import { expect, type Locator } from '@playwright/test'

export class PaginationObject extends BaseObject {
  constructor (root: Locator) {
    super(root)
  }

  getNextButton () {
    return this.root.getByTitle(t('global.avPagination.nextPageTitle'))
  }

  getPageLink (pageNum: number) {
    return this.root.getByRole('link', { name: String(pageNum), exact: true })
  }

  async verifyPageCount (count: number) {
    await expect(this.getPageLink(count)).toBeVisible()
  }

  async navigateToPage (pageNum: number) {
    await this.getPageLink(pageNum).click()
  }

  async navigateToNext () {
    await this.getNextButton().click()
  }

  async verifyNextDisabled () {
    await expect(this.getNextButton()).toHaveAttribute('aria-disabled', 'true')
  }
}
