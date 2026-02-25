import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { t } from '@e2e/framework/shared/utils/i18n'
import { ActivityLibraryCard } from '@e2e/framework/student/lifeProject/activities/componentObjects/ActivityLibraryCard'
import { expect, type Page } from '@playwright/test'

export class ActivityLibraryTab extends BaseObject {
  constructor (protected page: Page) {
    super(page.getByTestId('activity-library-tab'), page)
  }

  getTitle () {
    return this.root.getByTestId('activity-library-tab-title')
  }

  getCardList () {
    return this.root.getByTestId('activity-library-card-list')
  }

  getCards () {
    return this.getCardList().getByTestId('activity-library-card')
  }

  getCardByIndex (index: number) {
    return new ActivityLibraryCard(this.getCards().nth(index))
  }

  getLastCard () {
    return new ActivityLibraryCard(this.getCards().last())
  }

  async verifyTitle (count: number) {
    await expect(this.getTitle()).toBeVisible()
    const expectedText = t('student.buildProject.views.projectActivitiesView.ActivityLibraryTab.tabTitle', { count })
    await expect(this.getTitle()).toHaveText(expectedText)
  }

  async verifyTitleWithCount () {
    await expect(this.getTitle()).toBeVisible()
    const text = await this.getTitle().textContent()
    const count = Number.parseInt(text?.match(/\d+/)?.[0] ?? '0')
    await expect(this.getTitle()).toHaveText(
      t('student.buildProject.views.projectActivitiesView.ActivityLibraryTab.tabTitle', { count })
    )
  }

  getEmptyState () {
    return this.root.getByTestId('activity-library-empty-state')
  }

  async verifyEmptyStateVisible () {
    await expect(this.getEmptyState()).toBeVisible()
  }

  async verifyEmptyStateMessage () {
    await expect(this.getEmptyState()).toHaveText(
      t('student.buildProject.views.projectActivitiesView.ActivityLibraryTab.emptyState')
    )
  }

  getPagination () {
    return this.root.getByTestId('pagination')
  }

  async verifyPaginationNotVisible () {
    await expect(this.getPagination()).not.toBeVisible()
  }

  async verifyCardListVisible () {
    await expect(this.getCardList()).toBeVisible()
  }

  async verifyCardCount (count: number) {
    await expect(this.getCards()).toHaveCount(count)
  }

  async verifyCardsNotEmpty () {
    await expect(this.getCards()).not.toHaveCount(0)
  }
}
