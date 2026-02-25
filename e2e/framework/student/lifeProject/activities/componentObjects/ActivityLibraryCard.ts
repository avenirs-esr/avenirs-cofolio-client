import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { t } from '@e2e/framework/shared/utils/i18n'
import { ActivityStatusBadgeObject } from '@e2e/framework/student/lifeProject/activities/componentObjects/ActivityStatusBadgeObject'
import { ActivityThematicBadgeObject } from '@e2e/framework/student/lifeProject/activities/componentObjects/ActivityThematicBadgeObject'
import { expect, type Locator } from '@playwright/test'

export class ActivityLibraryCard extends BaseObject {
  constructor (protected root: Locator) {
    super(root)
  }

  getTitle () {
    return this.root.getByTestId('floating-icon-card-title')
  }

  getStatusBadge () {
    return new ActivityStatusBadgeObject(this.root.getByTestId('activity-library-card-status-badge'))
  }

  getThematicBadge () {
    return new ActivityThematicBadgeObject(this.root.getByTestId('activity-library-card-thematic-badge'))
  }

  getPeriodBadge () {
    return this.root.getByTestId('activity-library-card-period-badge')
  }

  getSummary () {
    return this.root.getByTestId('activity-library-card-summary')
  }

  async verifyTitle (expectedTitle: string) {
    await expect(this.getTitle()).toBeVisible()
    await expect(this.getTitle()).toHaveText(expectedTitle)
  }

  async verifyTitleVisible () {
    await expect(this.getTitle()).toBeVisible()
  }

  async verifyStatusBadge (expectedStatus: string) {
    await this.getStatusBadge().verify(expectedStatus)
  }

  async verifyStatusBadgeValid () {
    await this.getStatusBadge().verifyValid()
  }

  async verifyThematicBadge (expectedThematic: string) {
    await this.getThematicBadge().verify(expectedThematic)
  }

  async verifyThematicBadgeValid () {
    await this.getThematicBadge().verifyValid()
  }

  async verifyNoPeriodBadge () {
    await expect(this.getPeriodBadge()).not.toBeVisible()
  }

  async verifyPeriodBadge () {
    await expect(this.getPeriodBadge()).toBeVisible()
    await expect(this.getPeriodBadge()).toHaveText(
      t('student.buildProject.views.projectActivitiesView.ActivityLibraryCard.period')
    )
  }

  async verifySummary (expectedDescription: string) {
    await expect(this.getSummary()).toBeVisible()
    await expect(this.getSummary()).toContainText(expectedDescription)
  }

  async verifySummaryVisible () {
    await expect(this.getSummary()).toBeVisible()
  }
}
