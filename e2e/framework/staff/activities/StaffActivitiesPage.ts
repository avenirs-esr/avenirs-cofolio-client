import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import { BasePage } from '@e2e/framework/shared/base/BasePage'
import { STAFF_ROUTES } from '@e2e/framework/shared/constants/routes'
import { clickOnElement } from '@e2e/framework/shared/utils/click'
import { waitForPageLoad } from '@e2e/framework/shared/utils/waits'
import { expect, type Page } from '@playwright/test'
import { Fixture, Given, Then, When } from 'playwright-bdd/decorators'

@Fixture<typeof test>('staffActivitiesPage')
export class StaffActivitiesPage extends BasePage {
  constructor (public page: Page) {
    super(page)
  }

  getCreateActivityButton () {
    return this.page.getByTestId('create-activity-button')
  }

  getActivityDraftCreationModal () {
    return this.page.getByTestId('activity-draft-creation-modal')
  }

  getMyWorkspaceTable () {
    return this.page.getByTestId('activities-tab-table')
  }

  @Given('the staff opens the activities page')
  async goToActivitiesPage () {
    await this.page.goto(STAFF_ROUTES.ACTIVITIES)
    await waitForPageLoad(this.page)
  }

  @Then('the staff activities page is displayed')
  async verifyPageLoaded () {
    await expect(this.page).toHaveURL(STAFF_ROUTES.ACTIVITIES)
  }

  @Given('the create activity button is visible')
  async verifyCreateActivityButtonVisible () {
    await expect(this.getCreateActivityButton()).toBeVisible()
  }

  @Then('the my workspace table is visible and contains data')
  async verifyMyWorkspaceTableVisible () {
    await expect(this.getMyWorkspaceTable()).toBeVisible()
    await expect(this.getMyWorkspaceTable().locator('th')).toHaveCount(4)
    const rowCount = await this.getMyWorkspaceTable().locator('tr').count()
    expect(rowCount).toBeGreaterThanOrEqual(2)
  }

  @When('the user clicks on the create activity button')
  async clickCreateActivityButton () {
    await clickOnElement(this.getCreateActivityButton())
  }

  @Then('the activity draft creation modal is visible')
  async verifyActivityDraftCreationModalVisible () {
    await expect(this.getActivityDraftCreationModal()).toBeVisible()
  }

  @Then('the title form field is visible')
  async verifyTitleFormFieldVisible () {
    await expect(this.getActivityDraftCreationModal().getByTestId('activity-title-form-field')).toBeVisible()
  }

  @When('the user clicks on the activity draft creation modal cancel button')
  async clickActivityDraftCreationModalCancelButton () {
    await clickOnElement(this.getActivityDraftCreationModal().getByTestId('cancel-button'))
  }

  @Then('the activity draft creation modal is hidden')
  async verifyActivityDraftCreationModalHidden () {
    await expect(this.getActivityDraftCreationModal()).toBeHidden()
  }
}
