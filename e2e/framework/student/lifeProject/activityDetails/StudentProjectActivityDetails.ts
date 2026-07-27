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

  @Then('the activity description is visible')
  async verifyActivityDescriptionVisible () {
    await this.getProjectActivityDetails().verifyDescriptionVisible()
  }

  @Then('the activity recommended completion contexts list is visible')
  async verifyRecommendedCompletionContextsListVisible () {
    await this.getProjectActivityDetails().verifyRecommendedCompletionContextsListVisible()
  }

  @Then('the activity status is visible')
  async verifyActivityStatusVisible () {
    await expect(this.getStatus()).toBeVisible()
  }

  @When('the student clicks the my perspective item in the activity side menu')
  async clickMyPerspectiveItemInSideMenu () {
    await this.getActivityDetailedSideNavigation().getByText('Ma réflexion').click()
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
    await this.getMyPerspectiveSection().waitForPerspectiveCardEditable()
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

  @Then('the finish activity button is enabled')
  async verifyFinishActivityButtonEnabled () {
    await this.getMyPerspectiveSection().verifyFinishButtonEnabled()
  }

  @Then('the finish activity button is disabled')
  async verifyFinishActivityButtonDisabled () {
    await this.getMyPerspectiveSection().verifyFinishButtonDisabled()
  }

  @Then('the finish activity badge is visible')
  async verifyFinishActivityBadgeVisible () {
    await this.getMyPerspectiveSection().verifyFinishBadgeVisible()
  }

  @Then('the finish activity badge is hidden')
  async verifyFinishActivityBadgeHidden () {
    await this.getMyPerspectiveSection().verifyFinishBadgeHidden()
  }

  @When('the student clicks the finish activity button')
  async clickFinishActivityButton () {
    await this.getMyPerspectiveSection().clickFinishButton()
    await this.getMyPerspectiveSection().waitForFinishConfirmationModalVisible()
  }

  @Then('the finish activity confirmation modal is visible')
  async verifyFinishActivityConfirmationModalVisible () {
    await this.getMyPerspectiveSection().verifyFinishConfirmationModalVisible()
  }

  @Then('the request feedback button is visible')
  async verifyRequestFeedbackButtonVisible () {
    await this.getMyPerspectiveSection().verifyRequestFeedbackButtonVisible()
  }

  @Then('the request feedback button is hidden')
  async verifyRequestFeedbackButtonHidden () {
    await this.getMyPerspectiveSection().verifyRequestFeedbackButtonHidden()
  }

  @Then('the request feedback button is enabled')
  async verifyRequestFeedbackButtonEnabled () {
    await this.getMyPerspectiveSection().verifyRequestFeedbackButtonEnabled()
  }

  @Then('the update feedback button is visible')
  async verifyUpdateFeedbackButtonVisible () {
    await this.getMyPerspectiveSection().verifyUpdateFeedbackButtonVisible()
  }

  @Then('the update feedback button is hidden')
  async verifyUpdateFeedbackButtonHidden () {
    await this.getMyPerspectiveSection().verifyUpdateFeedbackButtonHidden()
  }

  @Then('the update feedback button is enabled')
  async verifyUpdateFeedbackButtonEnabled () {
    await this.getMyPerspectiveSection().verifyUpdateFeedbackButtonEnabled()
  }

  @When('the student clicks the request feedback button')
  async clickRequestFeedbackButton () {
    await this.getMyPerspectiveSection().clickRequestFeedbackButton()
    await this.getMyPerspectiveSection().waitForRequestFeedbackConfirmModalVisible()
  }

  @When('the student clicks the update feedback button')
  async clickUpdateFeedbackButton () {
    await this.getMyPerspectiveSection().clickUpdateFeedbackButton()
    await this.getMyPerspectiveSection().waitForRequestFeedbackConfirmModalVisible()
  }

  @Then('the request feedback confirmation modal is visible')
  async verifyRequestFeedbackConfirmationModalVisible () {
    await this.getMyPerspectiveSection().verifyRequestFeedbackConfirmModalVisible()
  }

  @Then('the request feedback confirmation modal is hidden')
  async verifyRequestFeedbackConfirmationModalHidden () {
    await this.getMyPerspectiveSection().verifyRequestFeedbackConfirmModalHidden()
  }

  @When('the student clicks the cancel button in the request feedback confirmation modal')
  async clickCancelRequestFeedbackConfirmModal () {
    await this.getMyPerspectiveSection().clickCancelRequestFeedbackConfirmModal()
  }

  @Then('the feedback hint is visible')
  async verifyFeedbackHintVisible () {
    await this.getMyPerspectiveSection().verifyFeedbackHintVisible()
  }

  @Then('the feedback hint is hidden')
  async verifyFeedbackHintHidden () {
    await this.getMyPerspectiveSection().verifyFeedbackHintHidden()
  }

  @Then('the updatable feedback hint is visible')
  async verifyUpdatableFeedbackHintVisible () {
    await this.getMyPerspectiveSection().verifyUpdatableFeedbackHintVisible()
  }

  @Then('the finished hint is visible')
  async verifyFinishedHintVisible () {
    await this.getMyPerspectiveSection().verifyFinishedHintVisible()
  }

  @Then('the finished hint is hidden')
  async verifyFinishedHintHidden () {
    await this.getMyPerspectiveSection().verifyFinishedHintHidden()
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

  @Then('the feedback info card is visible')
  async verifyFeedbackInfoCardVisible () {
    await this.getMyPerspectiveSection().verifyFeedbackInfoCardVisible()
  }

  @Then('the feedback info card title is visible')
  async verifyFeedbackInfoCardTitleVisible () {
    await this.getMyPerspectiveSection().verifyFeedbackInfoCardTitleVisible()
  }

  @Then('the feedback info card iterations badge is visible')
  async verifyFeedbackInfoCardBadgeVisible () {
    await this.getMyPerspectiveSection().verifyFeedbackInfoCardBadgeVisible()
  }

  @Then('the received feedbacks section is visible')
  async verifyReceivedFeedbacksSectionVisible () {
    await this.getMyPerspectiveSection().verifyReceivedFeedbacksSectionVisible()
  }

  @Then('the received feedbacks section is hidden')
  async verifyReceivedFeedbacksSectionHidden () {
    await this.getMyPerspectiveSection().verifyReceivedFeedbacksSectionHidden()
  }

  @Then('the received feedbacks section title is visible')
  async verifyReceivedFeedbacksSectionTitleVisible () {
    await this.getMyPerspectiveSection().verifyReceivedFeedbacksSectionTitleVisible()
  }

  @Then('the received feedbacks empty state is visible')
  async verifyReceivedFeedbacksSectionEmptyVisible () {
    await this.getMyPerspectiveSection().verifyReceivedFeedbacksSectionEmptyVisible()
  }

  @Then('the received feedbacks empty state is hidden')
  async verifyReceivedFeedbacksSectionEmptyHidden () {
    await this.getMyPerspectiveSection().verifyReceivedFeedbacksSectionEmptyHidden()
  }

  @Then('the received feedback cards are visible')
  async verifyReceivedFeedbackCardsVisible () {
    await this.getMyPerspectiveSection().verifyReceivedFeedbackCardsVisible()
  }

  @Then('the trace association limit card is visible')
  async verifyTraceAssociationLimitCardVisible () {
    await this.getMyPerspectiveSection().verifyTraceAssociationLimitCardVisible()
  }

  @Then('the trace association limit badge is visible')
  async verifyTraceAssociationLimitBadgeVisible () {
    await this.getMyPerspectiveSection().verifyTraceAssociationLimitBadgeVisible()
  }
}
