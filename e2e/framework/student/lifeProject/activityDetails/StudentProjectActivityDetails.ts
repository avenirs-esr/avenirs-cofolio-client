import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import { BasePage } from '@e2e/framework/shared/base/BasePage'
import { waitForPageLoad } from '@e2e/framework/shared/utils/waits'
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
    return this.page.getByTestId('section-navigation-side-navigation')
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

  @Then('the my perspective card is visible')
  async verifyMyPerspectiveCardVisible () {
    await this.getMyPerspectiveSection().verifyPerspectiveCardVisible()
  }

  @Then('the my perspective card is in readonly mode')
  async verifyMyPerspectiveCardReadonly () {
    await this.getMyPerspectiveSection().verifyPerspectiveCardReadonly()
  }

  @When('the student clicks the edit my perspective button')
  async clickEditMyPerspectiveButton () {
    await this.getMyPerspectiveSection().clickEditPerspectiveButton()
  }

  @Then('the my perspective card is in editable mode')
  async verifyMyPerspectiveCardEditable () {
    await this.getMyPerspectiveSection().verifyPerspectiveCardEditable()
  }

  @When('the student cancels the perspective edition')
  async clickCancelEditPerspectiveButton () {
    await this.getMyPerspectiveSection().clickCancelEditPerspectiveButton()
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

  @When('the student opens associated elements tab')
  async clickAssociatedElementsTab () {
    await this.getMyPerspectiveSection().clickAssociatedElementsTab()
    await waitForPageLoad(this.page)
  }

  @Then('the associated traces card is visible')
  async verifyAssociatedTracesCardVisible () {
    await this.getMyPerspectiveSection().verifyAssociatedTracesCardVisible()
  }

  @Then('the associated trace cards are hidden')
  async verifyAssociatedTraceCardsHidden () {
    await this.getMyPerspectiveSection().verifyAssociatedTraceCardsHidden()
  }

  @When('the student clicks the associated traces card')
  async clickAssociatedTracesCard () {
    await this.getMyPerspectiveSection().clickAssociatedTracesCard()
  }

  @Then('the associated trace cards are visible')
  async verifyAssociatedTraceCardsVisible () {
    await this.getMyPerspectiveSection().verifyAssociatedTraceCardsVisible()
  }

  @Then('the associated traces card is hidden')
  async verifyAssociatedTracesCardHidden () {
    await this.getMyPerspectiveSection().verifyAssociatedTracesCardHidden()
  }

  @When('the student opens the associate elements dropdown')
  async openAssociateElementsDropdown () {
    await this.getMyPerspectiveSection().openAssociateElementsDropdown()
  }

  @When('the student clicks the associate traces dropdown item')
  async clickAssociateTracesDropdownItem () {
    await this.getMyPerspectiveSection().clickAssociateTracesDropdownItem()
  }

  @Then('the associate traces modal is visible')
  async verifyAssociateTracesModalVisible () {
    await this.getMyPerspectiveSection().verifyAssociateTracesModalVisible()
  }

  @Then('the associate traces modal title is visible')
  async verifyAssociateTracesModalTitleVisible () {
    await this.getMyPerspectiveSection().verifyAssociateTracesModalTitleVisible()
  }

  @Then('the traces type select is visible in associate traces modal')
  async verifyTracesTypeSelectVisibleInAssociateTracesModal () {
    await this.getMyPerspectiveSection().verifyTracesTypeSelectVisibleInAssociateTracesModal()
  }

  @Then('the search association layout is visible in associate traces modal')
  async verifySearchAssociationLayoutVisibleInAssociateTracesModal () {
    await this.getMyPerspectiveSection().verifySearchAssociationLayoutVisibleInAssociateTracesModal()
  }

  @Then('the associate traces confirmation modal is hidden')
  async verifyAssociateTracesConfirmationModalHidden () {
    await this.getMyPerspectiveSection().verifyAssociateTracesConfirmationModalHidden()
  }
}
