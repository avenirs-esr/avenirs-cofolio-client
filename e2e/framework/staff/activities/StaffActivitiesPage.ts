import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import { BasePage } from '@e2e/framework/shared/base/BasePage'
import { STAFF_ROUTES } from '@e2e/framework/shared/constants/routes'
import { clickOnElement } from '@e2e/framework/shared/utils/click'
import { waitForPageLoad } from '@e2e/framework/shared/utils/waits'
import { DeleteDraftActivityConfirmationModal } from '@e2e/framework/staff/activities/componentObjects/DeleteDraftActivityConfirmationModal'
import { expect, type Page } from '@playwright/test'
import { Fixture, Given, Then, When } from 'playwright-bdd/decorators'

@Fixture<typeof test>('staffActivitiesPage')
export class StaffActivitiesPage extends BasePage {
  private static readonly ACTIVITY_WITH_ENROLLED_STUDENTS
    = '8c5d1f77-2a9e-4b33-9f6c-1e4b7a2d9c11'

  private deleteConfirmationModal: DeleteDraftActivityConfirmationModal

  constructor (public page: Page) {
    super(page)
    this.deleteConfirmationModal = new DeleteDraftActivityConfirmationModal(page)
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

  getMyWorkspaceTab () {
    return this.page.getByTestId('my-workspace-tab')
  }

  getAllPublishedActivitiesTab () {
    return this.page.getByTestId('all-published-activities-tab')
  }

  getAllPublishedActivitiesTable () {
    return this.page.getByTestId('all-published-activities-tab-content')
      .getByTestId('activities-tab-table')
  }

  private getPublishedActivityTitleLinkWithEnrolledStudents () {
    return this.getAllPublishedActivitiesTable().locator(
      `[data-testid="activity-table-title-link"][data-activity-id="${StaffActivitiesPage.ACTIVITY_WITH_ENROLLED_STUDENTS}"]`,
    )
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
    await expect(this.getMyWorkspaceTable().locator('th')).toHaveCount(5)
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

  @When('the user clicks on the my workspace tab')
  async clickMyWorkspaceTab () {
    await clickOnElement(this.getMyWorkspaceTab())
  }

  @Then('the my workspace tab is visible')
  async verifyMyWorkspaceTabVisible () {
    await expect(this.getMyWorkspaceTab()).toBeVisible()
  }

  @Then('the all published activities tab is visible')
  async verifyAllPublishedActivitiesTabVisible () {
    await expect(this.getAllPublishedActivitiesTab()).toBeVisible()
  }

  @When('the user clicks on the all published activities tab')
  async clickAllPublishedActivitiesTab () {
    await clickOnElement(this.getAllPublishedActivitiesTab())
  }

  @Then('the all published activities title is visible')
  async verifyAllPublishedActivitiesTitleVisible () {
    await expect(this.page.getByTestId('all-published-activities-tab-content').getByTestId('activities-tab-title')).toBeVisible()
  }

  @Then('the all published activities table is visible and contains data')
  async verifyAllPublishedActivitiesTableVisible () {
    await expect(this.getAllPublishedActivitiesTable()).toBeVisible()
    const rowCount = await this.getAllPublishedActivitiesTable().locator('tr').count()
    expect(rowCount).toBeGreaterThanOrEqual(2)
  }

  private getMoreActionsDropdown () {
    return this.page.getByTestId('more-actions-dropdown').first()
  }

  private getMoreActionsDropdownTrigger () {
    return this.getMoreActionsDropdown().getByRole('button')
  }

  private getDeleteOption () {
    return this.page.getByTestId('delete')
  }

  @When('the user clicks on the first activity more actions button')
  async clickFirstActivityMoreActionsButton () {
    await clickOnElement(this.getMoreActionsDropdownTrigger())
  }

  @When('the user clicks on the more actions button for activity that has feedbacks')
  async clickMoreActionsButtonForActivityWithFeedbacks () {
    const activityId = '8c5d1f77-2a9e-4b33-9f6c-1e4b7a2d9c11'
    const dropdown = this.page.locator(
      `[data-testid="more-actions-dropdown"][data-activity-id="${activityId}"]`,
    )
    await clickOnElement(dropdown.getByRole('button'))
  }

  @When('the user clicks on the navigate to feedbacks option')
  async clickNavigateToFeedbacksOption () {
    await clickOnElement(this.page.getByTestId('navigateToFeedbacks'))
    await waitForPageLoad(this.page)
  }

  @Then('the delete option is visible')
  async verifyDeleteOptionVisible () {
    await expect(this.getDeleteOption()).toBeVisible()
  }

  @When('the user clicks on the delete option')
  async clickDeleteOption () {
    await clickOnElement(this.getDeleteOption())
  }

  @Then('the delete draft activity confirmation modal is visible')
  async verifyDeleteConfirmationModalVisible () {
    await this.deleteConfirmationModal.verifyVisible()
  }

  @Then('the delete confirmation modal cancel button is visible')
  async verifyDeleteConfirmationModalCancelButtonVisible () {
    await this.deleteConfirmationModal.verifyCancelButtonVisible()
  }

  @Then('the delete confirmation modal confirm button is visible')
  async verifyDeleteConfirmationModalConfirmButtonVisible () {
    await this.deleteConfirmationModal.verifyConfirmButtonVisible()
  }

  @When('the user clicks on the delete confirmation modal cancel button')
  async clickDeleteConfirmationModalCancelButton () {
    await this.deleteConfirmationModal.clickCancel()
  }

  @Then('the delete draft activity confirmation modal is hidden')
  async verifyDeleteConfirmationModalHidden () {
    await this.deleteConfirmationModal.verifyHidden()
  }

  @When('the user clicks on the first published activity title with enrolled students')
  async clickFirstPublishedActivityTitle () {
    await clickOnElement(this.getPublishedActivityTitleLinkWithEnrolledStudents())
    await waitForPageLoad(this.page)
  }
}
