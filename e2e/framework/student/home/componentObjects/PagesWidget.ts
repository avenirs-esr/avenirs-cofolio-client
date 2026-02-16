import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { t } from '@e2e/framework/shared/utils/i18n'
import { expect, type Page } from '@playwright/test'

export class PagesWidget extends BaseObject {
  constructor (protected page: Page) {
    super(page.getByTestId('student-pages-widget'), page)
  }

  getTitle () {
    return this.root.getByTestId('home-widget-title')
  }

  getItems () {
    return this.page.getByTestId('page-item')
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
    await expect(this.getTitle()).toHaveText(t('student.global.widgets.pages.title'))
  }

  async verifyRenderedPagesCount (expectedPages: number) {
    const count = await this.countItems()
    expect(count).toEqual(expectedPages)
  }

  async verifyEachItemLastUpdateDate () {
    const count = await this.countItems()
    expect(count).toBeGreaterThan(0)
    const i18nPrefix = t('student.global.widgets.pages.updatedAt').trim()
    for (let i = 0; i < count; i++) {
      const pageItem = this.getItems().nth(i)
      const updateDateElement = pageItem.getByTestId('page-item-updated-at')
      await expect(updateDateElement).toBeVisible()
      const text = await updateDateElement.textContent()
      expect(text).toBeTruthy()
      expect(text?.trim().startsWith(i18nPrefix)).toBeTruthy()
    }
  }

  async verifySeeAllButton () {
    await expect(this.getSeeAllButton()).toBeVisible()
    await expect(this.getSeeAllButton()).toHaveText(t('student.global.widgets.pages.buttons.seeAll'))
  }

  async clickSeeAllButton () {
    await this.getSeeAllButton().click()
  }
}
