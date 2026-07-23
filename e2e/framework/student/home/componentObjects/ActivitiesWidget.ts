import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { clickOnElement } from '@e2e/framework/shared/utils/click'
import { t } from '@e2e/framework/shared/utils/i18n'
import { expect, type Page } from '@playwright/test'

export class ActivitiesWidget extends BaseObject {
  private isNew: boolean

  constructor (protected page: Page, isNew = false) {
    super(page.getByTestId(`${isNew ? 'new' : 'library'}-activities-widget`), page)
    this.isNew = isNew
  }

  getTitle () {
    return this.root.getByTestId('home-widget-title')
  }

  getCards () {
    return this.page.getByTestId('activity-long-icon-card')
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
    await expect(this.getTitle()).toHaveText(t(`student.global.views.studentHomeView.widgets.ActivitiesWidget.title.${this.isNew ? 'new' : 'library'}`))
  }

  async verifyHasActivities () {
    const count = await this.countCards()
    expect(count).toBeGreaterThan(0)
  }

  async verifySeeAllButton () {
    await expect(this.getSeeAllButton()).toBeVisible()
    await expect(this.getSeeAllButton()).toHaveText(t(`student.global.views.studentHomeView.widgets.ActivitiesWidget.seeAll.${this.isNew ? 'new' : 'library'}`))
  }

  async verifyActivitiesWidget () {
    await this.verifyVisible()
    await this.verifyHasActivities()
    await this.verifySeeAllButton()
  }

  async clickFirstCard () {
    await clickOnElement(this.getCards().nth(0))
  }

  async clickSeeAllButton () {
    await clickOnElement(this.getSeeAllButton())
  }
}
