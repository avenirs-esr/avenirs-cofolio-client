import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { t } from '@e2e/framework/shared/utils/i18n'
import { TraceCard } from '@e2e/framework/student/traces/componentObjects/TraceCard'
import { expect, type Page, test } from '@playwright/test'

export class TracesWidget extends BaseObject {
  constructor (protected page: Page) {
    super(page.getByTestId('student-traces-widget'), page)
  }

  getTitle () {
    return this.root.getByTestId('home-widget-title')
  }

  getCards () {
    return this.page.getByTestId('trace-card')
  }

  getCard (index: number) {
    return new TraceCard(this.getCards().nth(index))
  }

  getSeeAllButton () {
    return this.root.getByTestId('see-all-button')
  }

  async countCards () {
    return await this.getCards().count()
  }

  async skipIfNoTraces () {
    const count = await this.countCards()
    test.skip(count === 0, 'No traces available from backend')
  }

  async verifyVisible () {
    await this.isVisible()
    await expect(this.getTitle()).toBeVisible()
    await expect(this.getTitle()).toHaveText(t('student.traces.cards.StudentTracesWidget.title'))
  }

  async verifyMaximum3Traces () {
    const count = await this.countCards()
    expect(count).toBeGreaterThan(0)
    expect(count).toBeLessThanOrEqual(3)
  }

  async verifyEachCardSkillCount () {
    const count = await this.countCards()
    expect(count).toBeGreaterThan(0)
    for (let i = 0; i < count; i++) {
      await this.getCard(i).verifySkillCount()
    }
  }

  async verifyEachCardAmsCount () {
    const count = await this.countCards()
    expect(count).toBeGreaterThan(0)
    for (let i = 0; i < count; i++) {
      await this.getCard(i).verifyAmsCount()
    }
  }

  async verifyEachCardType () {
    const count = await this.countCards()
    expect(count).toBeGreaterThan(0)
    for (let i = 0; i < count; i++) {
      await this.getCard(i).verifyType()
    }
  }

  async verifySeeAllButton () {
    await expect(this.getSeeAllButton()).toBeVisible()
    await expect(this.getSeeAllButton()).toHaveText(t('student.traces.cards.StudentTracesWidget.buttons.seeAll'))
  }

  async clickFirstCard () {
    await this.getCard(0).click()
  }

  async clickSeeAllButton () {
    await this.getSeeAllButton().click()
  }
}
