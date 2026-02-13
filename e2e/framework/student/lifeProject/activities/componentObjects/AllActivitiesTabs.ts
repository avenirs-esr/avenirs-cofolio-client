import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { t } from '@e2e/framework/shared/utils/i18n'
import { expect, type Page } from '@playwright/test'

export class AllActivitiesTabs extends BaseObject {
  constructor (protected page: Page) {
    super(page.getByTestId('all-activities-tab'), page)
  }

  getHeaderDescription () {
    return this.root.getByTestId('all-activities-header-description')
  }

  getHeaderSeeAllButton () {
    return this.root.getByTestId('all-activities-header-see-all-button')
  }

  getNewActivitiesPaginatorCard () {
    return this.root.getByTestId('new-activities-paginator-card')
  }

  getAllActivitiesSection () {
    return this.root.getByTestId('all-activities-section')
  }

  async verifyVisible () {
    await this.isVisible()
    await expect(this.getHeaderDescription()).toBeVisible()
    await expect(this.getHeaderSeeAllButton()).toBeVisible()
    await expect(this.getNewActivitiesPaginatorCard()).toBeVisible()
    await expect(this.getAllActivitiesSection()).toBeVisible()
  }

  async verifyHeaderDescription () {
    const expectedText = t('student.buildProject.views.projectActivitiesView.allActivitiesTab.header.description')
    await expect(this.getHeaderDescription()).toBeVisible()
    await expect(this.getHeaderDescription()).toHaveText(expectedText)
  }

  async verifySeeAllButton () {
    const expectedText = t('student.buildProject.views.projectActivitiesView.allActivitiesTab.header.seeAll')
    await expect(this.getHeaderSeeAllButton()).toBeVisible()
    await expect(this.getHeaderSeeAllButton()).toHaveText(expectedText)
  }

  async verifyNewActivitiesPaginatorCard () {
    const expectedText = t('student.buildProject.views.projectActivitiesView.allActivitiesTab.newActivitiesPaginatorCard.title', { count: 8 }) // TODO US#959
    await expect(this.getNewActivitiesPaginatorCard()).toBeVisible()
    await expect(this.getNewActivitiesPaginatorCard()).toHaveText(expectedText)
  }

  async verifyAllActivitiesSection () {
    const expectedText = t('student.buildProject.views.projectActivitiesView.allActivitiesTab.allActivitiesSection.title', { count: 8 }) // TODO US#959
    await expect(this.getAllActivitiesSection()).toBeVisible()
    await expect(this.getAllActivitiesSection()).toHaveText(expectedText)
  }

  async clickHeaderSeeAllButton () {
    await this.getHeaderSeeAllButton().click()
  }
}
