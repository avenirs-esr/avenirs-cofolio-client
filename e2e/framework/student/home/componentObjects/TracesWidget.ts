import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { clickOnElement } from '@e2e/framework/shared/utils/click'
import { t } from '@e2e/framework/shared/utils/i18n'
import { expect, type Page } from '@playwright/test'

export class TracesWidget extends BaseObject {
  constructor (protected page: Page) {
    super(page.getByTestId('student-traces-widget'), page)
  }

  getTitle () {
    return this.root.getByTestId('home-widget-title')
  }

  getCards () {
    return this.root.getByTestId('trace-long-icon-card')
  }

  getSeeAllButton () {
    return this.root.getByTestId('see-all-button')
  }

  async countCards () {
    return await this.getCards().count()
  }

  async verifyVisible () {
    await this.isVisible()
    await expect(this.getTitle()).toBeVisible()
    await expect(this.getTitle()).toHaveText(t('student.traces.cards.TracesWidget.title'))
  }

  async verfifyHasTraces () {
    const count = await this.countCards()
    expect(count).toBeGreaterThan(0)
  }

  async verifySeeAllButton () {
    await expect(this.getSeeAllButton()).toBeVisible()
    await expect(this.getSeeAllButton()).toHaveText(t('student.traces.cards.TracesWidget.buttons.seeAll'))
  }

  async verifyTracesWidget () {
    await this.verifyVisible()
    await this.verfifyHasTraces()
    await this.verifySeeAllButton()
  }

  async clickFirstCard () {
    await clickOnElement(this.getCards().nth(0))
  }

  async clickSeeAllButton () {
    await clickOnElement(this.getSeeAllButton())
  }
}
