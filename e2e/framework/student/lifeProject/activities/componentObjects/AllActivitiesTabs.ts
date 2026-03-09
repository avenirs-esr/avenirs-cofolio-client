import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { t } from '@e2e/framework/shared/utils/i18n'
import { extractNumberFromText } from '@e2e/framework/shared/utils/text'
import { ActivityCard } from '@e2e/framework/student/lifeProject/activities/componentObjects/ActivityCard'
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

  getNewActivitiesPaginatorCardTitle () {
    return this.root.getByTestId('new-activities-paginator-card-title')
  }

  getAllActivitiesSection () {
    return this.root.getByTestId('all-activities-section')
  }

  getAllActivitiesSectionTitle () {
    return this.root.getByTestId('all-activities-section-title')
  }

  getNewCardLayout () {
    return this.getNewActivitiesPaginatorCard().getByTestId('cards-layout')
  }

  getAllCardLayout () {
    return this.getAllActivitiesSection().getByTestId('cards-layout')
  }

  getNewCards () {
    return this.getNewCardLayout().getByTestId('activity-card')
  }

  getAllCards () {
    return this.getAllCardLayout().getByTestId('activity-card')
  }

  getNewCardByIndex (index: number) {
    return new ActivityCard(this.getNewCards().nth(index))
  }

  getAllCardByIndex (index: number) {
    return new ActivityCard(this.getAllCards().nth(index))
  }

  async verifyVisible () {
    await this.isVisible()
    await expect(this.getHeaderDescription()).toBeVisible()
    await expect(this.getHeaderSeeAllButton()).toBeVisible()
    await expect(this.getNewActivitiesPaginatorCard()).toBeVisible()
    await expect(this.getNewActivitiesPaginatorCardTitle()).toBeVisible()
    await expect(this.getAllActivitiesSection()).toBeVisible()
    await expect(this.getAllActivitiesSectionTitle()).toBeVisible()
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
    await expect(this.getNewActivitiesPaginatorCard()).toBeVisible()
    await expect(this.getNewActivitiesPaginatorCardTitle()).toBeVisible()
    const count = await extractNumberFromText(this.getNewActivitiesPaginatorCardTitle())
    expect(count).toBeGreaterThan(0)
  }

  async verifyAllActivitiesSection () {
    await expect(this.getAllActivitiesSection()).toBeVisible()
    await expect(this.getAllActivitiesSectionTitle()).toBeVisible()
    const count = await extractNumberFromText(this.getAllActivitiesSectionTitle())
    expect(count).toBeGreaterThan(0)
  }
}
