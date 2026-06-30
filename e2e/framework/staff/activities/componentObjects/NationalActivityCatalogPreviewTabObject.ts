import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { verifyTextLocator } from '@e2e/framework/shared/utils/text'
import { expect, type Page } from '@playwright/test'

export class NationalActivityCatalogPreviewTabObject extends BaseObject {
  constructor (protected page: Page) {
    super(page.getByTestId('national-activity-catalog-preview-tab'), page)
  }

  private getTitle () {
    return this.getRoot().getByTestId('activity-title')
  }

  private getBanner () {
    return this.getRoot().getByTestId('activity-banner')
  }

  private getThematic () {
    return this.getRoot().getByTestId('activity-thematic-badge')
  }

  private getSummary () {
    return this.getRoot().getByTestId('activity-summary')
  }

  private getExecutionPeriodInfo () {
    return this.getRoot().getByTestId('activity-execution-period-info')
  }

  async verifyTitleVisible () {
    await verifyTextLocator(this.getTitle())
  }

  async verifyBannerVisible () {
    await expect(this.getBanner()).toBeVisible()
  }

  async verifyThematicVisible () {
    await expect(this.getThematic()).toBeVisible()
  }

  async verifySummaryVisible () {
    await verifyTextLocator(this.getSummary())
  }

  async verifyExecutionPeriodInfoVisible () {
    await expect(this.getExecutionPeriodInfo()).toBeVisible()
  }
}
