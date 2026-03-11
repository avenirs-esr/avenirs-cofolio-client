import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import { BasePage } from '@e2e/framework/shared/base/BasePage'
import { MyPerspectiveSectionObject } from '@e2e/framework/student/lifeProject/activityDetails/componentObjects/MyPerspectiveSectionObject'
import { ProjectActivityDetailsObject } from '@e2e/framework/student/lifeProject/activityDetails/componentObjects/ProjectActivityDetailsObject'
import { expect, type Page } from '@playwright/test'
import { Fixture, Then, When } from 'playwright-bdd/decorators'

@Fixture<typeof test>('studentProjectActivityDetails')
export class StudentProjectActivityDetails extends BasePage {
  constructor (public page: Page) {
    super(page)
  }

  getProjectActivityDetails () {
    return new ProjectActivityDetailsObject(this.page.getByTestId('project-activity-details'))
  }

  getMyPerspectiveSection () {
    return new MyPerspectiveSectionObject(this.page.getByTestId('my-perspective-tab'))
  }

  getDetailTitle () {
    return this.page.getByTestId('activity-detail-title')
  }

  getStatus () {
    return this.page.getByTestId('activity-status-badge')
  }

  getDropdown () {
    return this.page.getByTestId('activity-detailed-dropdown')
  }

  getActivityDetailedSideNavigation () {
    return this.page.getByTestId('activity-detailed-side-navigation')
  }

  @Then('the project activity details are loaded')
  async verifyProjectActivityDetailsVisible () {
    await this.getProjectActivityDetails().verifyVisible()
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

  @Then('the activity status is visible')
  async verifyActivityStatusVisible () {
    await expect(this.getStatus()).toBeVisible()
  }

  @When('the student clicks the my perspective item in the activity side menu')
  async clickMyPerspectiveItemInSideMenu () {
    await this.getActivityDetailedSideNavigation().getByText('Ma prise de recul').click()
  }

  @Then('the my perspective section is visible')
  async verifyMyPerspectiveSectionVisible () {
    await this.getMyPerspectiveSection().verifyVisible()
  }

  @Then('the finish activity button is hidden')
  async verifyFinishActivityButtonHidden () {
    await this.getMyPerspectiveSection().verifyFinishButtonHidden()
  }

  @Then('the finish activity button is visible')
  async verifyFinishActivityButtonVisible () {
    await this.getMyPerspectiveSection().verifyFinishButtonVisible()
  }

  @When('the student clicks the finish activity button')
  async clickFinishActivityButton () {
    await this.getMyPerspectiveSection().clickFinishButton()
  }

  @Then('the finish activity confirmation modal is visible')
  async verifyFinishActivityConfirmationModalVisible () {
    await this.getMyPerspectiveSection().verifyFinishConfirmationModalVisible()
  }
}
