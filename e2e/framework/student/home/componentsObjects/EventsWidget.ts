import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { t } from '@e2e/framework/shared/utils/i18n'
import { expect, type Page } from '@playwright/test'

export class EventsWidget extends BaseObject {
  constructor (protected page: Page) {
    super(page.getByTestId('student-events-widget'), page)
  }

  getTitle () {
    return this.root.getByTestId('home-widget-title')
  }

  getItems () {
    return this.page.getByTestId('event-item')
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
    await expect(this.getTitle()).toHaveText(t('student.global.widgets.events.title'))
  }

  async verifyMaximum3Events () {
    const count = await this.countItems()
    expect(count).toBeLessThanOrEqual(3)
  }

  async verifySeeAllButton () {
    await expect(this.getSeeAllButton()).toBeVisible()
    await expect(this.getSeeAllButton()).toHaveText(t('student.global.widgets.events.buttons.seeAll'))
  }

  async clickSeeAllButton () {
    await this.getSeeAllButton().click()
  }
}
