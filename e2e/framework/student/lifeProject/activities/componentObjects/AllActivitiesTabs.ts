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

  async verifyVisible () {
    await this.isVisible()
    await expect(this.getHeaderDescription()).toBeVisible()
    await expect(this.getHeaderSeeAllButton()).toBeVisible()
  }

  async verifyHeaderDescription () {
    const expectedText = t('student.buildProject.views.projectActivitiesView.allActivities.header.description')
    await expect(this.getHeaderDescription()).toBeVisible()
    await expect(this.getHeaderDescription()).toHaveText(expectedText)
  }

  async verifySeeAllButton () {
    const expectedText = t('student.buildProject.views.projectActivitiesView.allActivities.header.seeAll')
    await expect(this.getHeaderSeeAllButton()).toBeVisible()
    await expect(this.getHeaderSeeAllButton()).toHaveText(expectedText)
  }

  async clickHeaderSeeAllButton () {
    await this.getHeaderSeeAllButton().click()
  }
}
