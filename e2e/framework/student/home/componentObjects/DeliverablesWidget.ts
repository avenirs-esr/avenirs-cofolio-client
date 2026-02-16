import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { t } from '@e2e/framework/shared/utils/i18n'
import { expect, type Page } from '@playwright/test'

export class DeliverablesWidget extends BaseObject {
  constructor (protected page: Page) {
    super(page.getByTestId('student-deliverables-widget'), page)
  }

  getTitle () {
    return this.root.getByTestId('home-widget-title')
  }

  getItems () {
    return this.page.getByTestId('deliverable-item')
  }

  getSeeAllButton () {
    return this.root.getByTestId('see-all-button')
  }

  async countItems () {
    return await this.getItems().count()
  }

  async verifyVisible () {
    await this.isVisible()
    await expect(this.getTitle()).toBeVisible()
    await expect(this.getTitle()).toHaveText(t('student.global.widgets.deliverables.title'))
  }

  async verifyRenderedDeliverablesCount (expectedDeliverables: number) {
    const count = await this.countItems()
    expect(count).toEqual(expectedDeliverables)
  }

  async verifySeeAllButton () {
    const expectedText = t('student.global.widgets.deliverables.buttons.seeAll')
    await expect(this.getSeeAllButton()).toBeVisible()
    await expect(this.getSeeAllButton()).toHaveText(expectedText)
  }

  async clickSeeAllButton () {
    await this.getSeeAllButton().click()
  }
}
