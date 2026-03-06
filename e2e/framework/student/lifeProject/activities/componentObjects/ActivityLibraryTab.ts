import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { PaginationObject } from '@e2e/framework/shared/componentObjects/PaginationObject'
import { t } from '@e2e/framework/shared/utils/i18n'
import { extractNumberFromText } from '@e2e/framework/shared/utils/text'
import { ActivityLibraryCard } from '@e2e/framework/student/lifeProject/activities/componentObjects/ActivityLibraryCard'
import { ActivityLibraryDropdown } from '@e2e/framework/student/lifeProject/activities/componentObjects/ActivityLibraryDropdown'
import { UnsubscribeActivitiesModal } from '@e2e/framework/student/lifeProject/activities/componentObjects/UnsubscribeActivitiesModal'
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

  getEmptyState () {
    return this.root.getByTestId('activity-library-empty-state')
  }

  getPagination () {
    return new PaginationObject(this.root.getByTestId('pagination'))
  }

  getDropdown () {
    return new ActivityLibraryDropdown(this.root.getByTestId('activity-library-dropdown'), this.page!)
  }

  getUnsubscribeModal () {
    return new UnsubscribeActivitiesModal(this.page!.getByTestId('unsubscribe-activities-modal'), this.page!)
  }

  async verifyTitleWithPositiveCount () {
    await expect(this.getTitle()).toBeVisible()
    const count = await extractNumberFromText(this.getTitle())
    expect(count).toBeGreaterThan(0)
  }

  async verifyEmptyStateVisible () {
    await expect(this.getEmptyState()).toBeVisible()
  }

  async verifyEmptyStateMessage () {
    await expect(this.getEmptyState()).toHaveText(
      t('student.buildProject.views.projectActivitiesView.ActivityLibraryTab.emptyState')
    )
  }

  async verifyCardListVisible () {
    await expect(this.getCardList()).toBeVisible()
  }

  async verifyCardsNotEmpty () {
    await expect(this.getCards()).not.toHaveCount(0)
  }

  async verifyCardCountNotExceedsPageSize () {
    const pageSize = await this.getPagination().getCurrentPageSize()
    const count = await this.getCards().count()
    expect(count).toBeLessThanOrEqual(pageSize)
  }

  async verifyCardCountLessThan (maxCount: number) {
    const count = await this.getCards().count()
    expect(count).toBeLessThan(maxCount)
  }

  async clickFirstCard () {
    await this.getCardByIndex(0).click()
  }
}
