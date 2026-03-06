import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { expect, type Locator } from '@playwright/test'

export class ProjectActivityDetailsObject extends BaseObject {
  constructor (protected root: Locator) {
    super(root)
  }

  getPeriodInput () {
    return this.root.getByTestId('activity-period-input')
  }

  getTitle () {
    return this.root.getByTestId('activity-title')
  }

  getSummary () {
    return this.root.getByTestId('activity-summary')
  }

  getExecutionPeriodList () {
    return this.root.getByTestId('activity-execution-period')
  }

  async verifyPeriodInputVisible () {
    await expect(this.getPeriodInput()).toBeVisible()
  }

  async verifyTitleVisible () {
    await expect(this.getTitle()).toBeVisible()
  }

  async verifySummaryVisible () {
    await expect(this.getSummary()).toBeVisible()
  }

  async verifyExecutionPeriodListVisible () {
    await expect(this.getExecutionPeriodList()).toBeVisible()
  }
}
