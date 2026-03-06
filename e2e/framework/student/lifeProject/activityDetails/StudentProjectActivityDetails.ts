import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import { BasePage } from '@e2e/framework/shared/base/BasePage'
import { ProjectActivityDetailsObject } from '@e2e/framework/student/lifeProject/activityDetails/componentObjects/ProjectActivityDetailsObject'
import { expect, type Page } from '@playwright/test'
import { Fixture, Then } from 'playwright-bdd/decorators'

@Fixture<typeof test>('studentProjectActivityDetails')
export class StudentProjectActivityDetails extends BasePage {
  constructor (public page: Page) {
    super(page)
  }

  getProjectActivityDetails () {
    return new ProjectActivityDetailsObject(this.page.getByTestId('project-activity-details'))
  }

  getDetailTitle () {
    return this.page.getByTestId('activity-detail-title')
  }

  getDropdown () {
    return this.page.getByTestId('activity-detailed-dropdown')
  }

  @Then('the activity detail title is visible')
  async verifyDetailTitleVisible () {
    await expect(this.getDetailTitle()).toBeVisible()
  }

  @Then('the activity dropdown is visible')
  async verifyDropdownVisible () {
    await expect(this.getDropdown()).toBeVisible()
  }

  @Then('the activity start date is visible')
  async verifyStartDateVisible () {
    await this.getProjectActivityDetails().verifyPeriodInputVisible()
  }

  @Then('the activity end date is visible')
  async verifyEndDateVisible () {
    await this.getProjectActivityDetails().verifyPeriodInputVisible()
  }

  @Then('the activity title is visible')
  async verifyActivityTitleVisible () {
    await this.getProjectActivityDetails().verifyTitleVisible()
  }

  @Then('the activity summary is visible')
  async verifyActivitySummaryVisible () {
    await this.getProjectActivityDetails().verifySummaryVisible()
  }

  @Then('the activity execution period list is visible')
  async verifyExecutionPeriodListVisible () {
    await this.getProjectActivityDetails().verifyExecutionPeriodListVisible()
  }
}
