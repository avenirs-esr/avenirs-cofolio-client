import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { t } from '@e2e/framework/shared/utils/i18n'
import { SkillCard } from '@e2e/framework/student/skills/componentObjects/SkillCard'
import { expect, type Page } from '@playwright/test'

export class SkillsWidget extends BaseObject {
  constructor (protected page: Page) {
    super(page.getByTestId('student-skills-widget'), page)
  }

  getTitle () {
    return this.root.getByTestId('home-widget-title')
  }

  getCourseCount () {
    return this.root.getByTestId('student-skills-peer-course').count()
  }

  getCards () {
    return this.root.getByTestId('skill-card')
  }

  getCard (index: number) {
    return new SkillCard(this.getCards().nth(index))
  }

  getSeeAllButton () {
    return this.root.getByTestId('see-all-button')
  }

  async countCards () {
    return await this.getCards().count()
  }

  async verifyVisible () {
    await expect(this.getTitle()).toBeVisible()
    await expect(this.getTitle()).toHaveText(t('student.skills.cards.StudentSkillsWidget.title'))
  }

  async verifyRenderedSkillsCount (expectedSkills: number) {
    const count = await this.countCards()
    expect(count).toEqual(expectedSkills)
  }

  async verifyRenderedCoursesCount (expectedCourses: number) {
    const count = await this.getCourseCount()
    expect(count).toEqual(expectedCourses)
  }

  async verifyCardsDisplayed () {
    const count = await this.countCards()
    expect(count).toBeGreaterThan(0)
    for (let i = 0; i < count; i++) {
      await expect(this.getCards().nth(i)).toBeVisible()
    }
  }

  async verifyEachCardStatusBadge () {
    const count = await this.countCards()
    expect(count).toBeGreaterThan(0)
    for (let i = 0; i < count; i++) {
      await this.getCard(i).verifyStatusBadge()
    }
  }

  async verifyEachCardTraceCount () {
    const count = await this.countCards()
    expect(count).toBeGreaterThan(0)
    for (let i = 0; i < count; i++) {
      await this.getCard(i).verifyTraceCount()
    }
  }

  async verifyEachCardAmsCount () {
    const count = await this.countCards()
    expect(count).toBeGreaterThan(0)
    for (let i = 0; i < count; i++) {
      await this.getCard(i).verifyAmsCount()
    }
  }

  async verifySeeAllButton () {
    await expect(this.getSeeAllButton()).toBeVisible()
    await expect(this.getSeeAllButton()).toHaveText(t('student.skills.cards.StudentSkillsWidget.buttons.seeAll'))
  }

  async clickFirstCard () {
    await this.getCard(0).click()
  }

  async clickSeeAllButton () {
    await this.getSeeAllButton().click()
  }
}
