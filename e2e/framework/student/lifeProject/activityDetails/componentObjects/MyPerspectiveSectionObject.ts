import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { clickOnElement } from '@e2e/framework/shared/utils/click'
import { expect, type Locator } from '@playwright/test'

export class MyPerspectiveSectionObject extends BaseObject {
  constructor (protected root: Locator) {
    super(root)
  }

  getPerspectiveCard () {
    return this.root.getByTestId('my-perspective-card')
  }

  getEditPerspectiveButton () {
    return this.root.getByTestId('my-perspective-card-edit-button')
  }

  getUpdatePerspectiveInProgressBadge () {
    return this.root.getByTestId('update-in-progress-badge')
  }

  getPerspectiveContent () {
    return this.root.getByTestId('my-perspective-card-content')
  }

  getRichTextEditor () {
    return this.root.getByTestId('av-rich-text-editor')
  }

  getCancelEditPerspectiveButton () {
    return this.root.getByTestId('my-perspective-card-cancel-button')
  }

  getSavePerspectiveButton () {
    return this.root.getByTestId('my-perspective-card-save-button')
  }

  getFinishButton () {
    return this.root.getByTestId('finish-declared-activity-button')
  }

  getFinishBadge () {
    return this.root.getByTestId('finish-declared-activity-finished-badge')
  }

  getFinishConfirmationModal () {
    return this.root.page().getByTestId('finish-declared-activity-confirm-modal')
  }

  getRequestFeedbackButton () {
    return this.root.getByTestId('request-feedback-button')
  }

  getUpdateFeedbackButton () {
    return this.root.getByTestId('update-feedback-button')
  }

  getRequestFeedbackConfirmModal () {
    return this.root.page().getByTestId('request-feedback-confirm-modal')
  }

  getRequestFeedbackCancelButton () {
    return this.root.page().getByTestId('request-feedback-confirm-modal').getByTestId('cancel-button')
  }

  getFeedbackHint () {
    return this.root.getByTestId('actions-hint').and(this.root.locator('[data-type="feedback-pending"], [data-type="max-feedback-reached"]'))
  }

  getUpdatableFeedbackHint () {
    return this.root.getByTestId('actions-hint').and(this.root.locator('[data-type="updatable-feedback"]'))
  }

  getFinishedHint () {
    return this.root.getByTestId('actions-hint').and(this.root.locator('[data-type="finished"]'))
  }

  getAssociatedElementsTab () {
    return this.root.page().getByTestId('associated-elements-tab-item')
  }

  getAssociatedTracesCard () {
    return this.root.page().getByTestId('associated-traces-card')
  }

  getAssociatedTraceCards () {
    return this.root.page().getByTestId('associated-trace-card')
  }

  getTraceAssociationLimitCard () {
    return this.root.page().getByTestId('association-limit-card')
  }

  getTraceAssociationLimitBadge () {
    return this.root.page().getByTestId('association-limit-card-badge')
  }

  getAssociateElementsDropdownTrigger () {
    return this.root.page().getByTestId('activity-associate-elements-dropdown')
  }

  getAssociateTracesDropdownItem () {
    return this.root.page().getByTestId('traces')
  }

  getAssociateTracesModal () {
    return this.root.page().getByTestId('associate-traces-modal')
  }

  getAssociateTracesModalTitle () {
    return this.root.page().getByTestId('header')
  }

  getTracesTypeSelectInAssociateModal () {
    return this.root.page().getByTestId('traces-type-select').first()
  }

  getSearchAssociationLayoutInAssociateModal () {
    return this.root.page().getByTestId('search-association-layout')
  }

  getAssociateTracesConfirmationModal () {
    return this.root.page().getByTestId('confirm-associate-modal')
  }

  async verifyTraceAssociationLimitCardVisible () {
    await expect(this.getTraceAssociationLimitCard()).toBeVisible()
  }

  async verifyTraceAssociationLimitBadgeVisible () {
    await expect(this.getTraceAssociationLimitBadge()).toBeVisible()
  }

  async verifyVisible () {
    await expect(this.root).toBeVisible()
  }

  async verifyPerspectiveCardVisible () {
    await expect(this.getPerspectiveCard()).toBeVisible()
  }

  async verifyPerspectiveCardReadonly () {
    await expect(this.getEditPerspectiveButton()).toBeVisible()
    await expect(this.getUpdatePerspectiveInProgressBadge()).toBeHidden()

    await expect(this.getPerspectiveContent()).toBeVisible()
    await expect(this.getRichTextEditor()).toBeHidden()

    await expect(this.getSavePerspectiveButton()).toBeHidden()
    await expect(this.getCancelEditPerspectiveButton()).toBeHidden()
  }

  async verifyPerspectiveCardEditable () {
    await expect(this.getEditPerspectiveButton()).toBeHidden()
    await expect(this.getUpdatePerspectiveInProgressBadge()).toBeVisible()

    await expect(this.getPerspectiveContent()).toBeHidden()
    await expect(this.getRichTextEditor()).toBeVisible()

    await expect(this.getSavePerspectiveButton()).toBeHidden()
    await expect(this.getCancelEditPerspectiveButton()).toBeVisible()
  }

  async verifyPerspectiveCardEdited () {
    await expect(this.getEditPerspectiveButton()).toBeHidden()
    await expect(this.getUpdatePerspectiveInProgressBadge()).toBeVisible()

    await expect(this.getPerspectiveContent()).toBeHidden()
    await expect(this.getRichTextEditor()).toBeVisible()

    await expect(this.getSavePerspectiveButton()).toBeVisible()
    await expect(this.getCancelEditPerspectiveButton()).toBeHidden()
  }

  async clickEditPerspectiveButton () {
    await clickOnElement(this.getEditPerspectiveButton())
  }

  async verifyFinishButtonVisible () {
    await expect(this.getFinishButton()).toBeVisible()
  }

  async verifyFinishButtonEnabled () {
    await expect(this.getFinishButton()).toBeEnabled()
  }

  async verifyFinishButtonDisabled () {
    await expect(this.getFinishButton()).toBeDisabled()
  }

  async verifyFinishBadgeVisible () {
    await expect(this.getFinishBadge()).toBeVisible()
  }

  async verifyFinishBadgeHidden () {
    await expect(this.getFinishBadge()).toBeHidden()
  }

  async verifyFinishButtonHidden () {
    await expect(this.getFinishButton()).toBeHidden()
  }

  async clickCancelEditPerspectiveButton () {
    await clickOnElement(this.getCancelEditPerspectiveButton())
  }

  async clickFinishButton () {
    await clickOnElement(this.getFinishButton())
  }

  async waitForFinishConfirmationModalVisible () {
    await expect(this.getFinishConfirmationModal()).toBeVisible({ timeout: 10000 })
  }

  async verifyFinishConfirmationModalVisible () {
    await expect(this.getFinishConfirmationModal()).toBeVisible()
  }

  async verifyRequestFeedbackButtonVisible () {
    await expect(this.getRequestFeedbackButton()).toBeVisible()
  }

  async verifyRequestFeedbackButtonHidden () {
    await expect(this.getRequestFeedbackButton()).toBeHidden()
  }

  async verifyRequestFeedbackButtonEnabled () {
    await expect(this.getRequestFeedbackButton()).toBeEnabled()
  }

  async verifyUpdateFeedbackButtonVisible () {
    await expect(this.getUpdateFeedbackButton()).toBeVisible()
  }

  async verifyUpdateFeedbackButtonHidden () {
    await expect(this.getUpdateFeedbackButton()).toBeHidden()
  }

  async verifyUpdateFeedbackButtonEnabled () {
    await expect(this.getUpdateFeedbackButton()).toBeEnabled()
  }

  async clickRequestFeedbackButton () {
    await clickOnElement(this.getRequestFeedbackButton())
  }

  async clickUpdateFeedbackButton () {
    await clickOnElement(this.getUpdateFeedbackButton())
  }

  async waitForRequestFeedbackConfirmModalVisible () {
    await expect(this.getRequestFeedbackConfirmModal()).toBeVisible({ timeout: 10000 })
  }

  async verifyRequestFeedbackConfirmModalVisible () {
    await expect(this.getRequestFeedbackConfirmModal()).toBeVisible()
  }

  async verifyRequestFeedbackConfirmModalHidden () {
    await expect(this.getRequestFeedbackConfirmModal()).toBeHidden()
  }

  async clickCancelRequestFeedbackConfirmModal () {
    await clickOnElement(this.getRequestFeedbackCancelButton())
  }

  async verifyFeedbackHintVisible () {
    await expect(this.getFeedbackHint()).toBeVisible()
  }

  async verifyFeedbackHintHidden () {
    await expect(this.getFeedbackHint()).toBeHidden()
  }

  async verifyUpdatableFeedbackHintVisible () {
    await expect(this.getUpdatableFeedbackHint()).toBeVisible()
  }

  async verifyFinishedHintVisible () {
    await expect(this.getFinishedHint()).toBeVisible()
  }

  async verifyFinishedHintHidden () {
    await expect(this.getFinishedHint()).toBeHidden()
  }

  async clickAssociatedElementsTab () {
    await clickOnElement(this.getAssociatedElementsTab())
  }

  async verifyAssociatedTracesCardVisible () {
    await expect(this.getAssociatedTracesCard()).toBeVisible()
  }

  async verifyAssociatedTraceCardsHidden () {
    const count = await this.getAssociatedTraceCards().count()
    expect(count).toBe(0)
  }

  async clickAssociatedTracesCard () {
    await clickOnElement(this.getAssociatedTracesCard())
  }

  async verifyAssociatedTraceCardsVisible () {
    const count = await this.getAssociatedTraceCards().count()
    expect(count).toBeGreaterThan(0)
  }

  async verifyAssociatedTracesCardHidden () {
    await expect(this.getAssociatedTracesCard()).toBeHidden()
  }

  async openAssociateElementsDropdown () {
    await clickOnElement(this.getAssociateElementsDropdownTrigger())
  }

  async clickAssociateTracesDropdownItem () {
    await clickOnElement(this.getAssociateTracesDropdownItem())
  }

  async verifyAssociateTracesModalVisible () {
    await expect(this.getAssociateTracesModal()).toBeVisible()
  }

  async verifyAssociateTracesModalTitleVisible () {
    await expect(this.getAssociateTracesModalTitle()).toBeVisible()
  }

  async verifyTracesTypeSelectVisibleInAssociateTracesModal () {
    await expect(this.getTracesTypeSelectInAssociateModal()).toBeVisible()
  }

  async verifySearchAssociationLayoutVisibleInAssociateTracesModal () {
    await expect(this.getSearchAssociationLayoutInAssociateModal()).toBeVisible()
  }

  async verifyAssociateTracesConfirmationModalHidden () {
    await expect(this.getAssociateTracesConfirmationModal()).toBeHidden()
  }

  async waitForPerspectiveCardEditable () {
    await expect(this.getEditPerspectiveButton()).toBeHidden({ timeout: 10000 })
    await expect(this.getRichTextEditor()).toBeVisible({ timeout: 10000 })
  }

  getFeedbackInfoCard () {
    return this.root.getByTestId('feedback-info-card')
  }

  getFeedbackInfoCardTitle () {
    return this.root.getByTestId('feedback-info-card-title')
  }

  getFeedbackInfoCardBadge () {
    return this.root.getByTestId('feedback-info-card-iterations-badge')
  }

  async verifyFeedbackInfoCardVisible () {
    await expect(this.getFeedbackInfoCard()).toBeVisible()
  }

  async verifyFeedbackInfoCardTitleVisible () {
    await expect(this.getFeedbackInfoCardTitle()).toBeVisible()
  }

  async verifyFeedbackInfoCardBadgeVisible () {
    await expect(this.getFeedbackInfoCardBadge()).toBeVisible()
  }

  getReceivedFeedbacksSection () {
    return this.root.getByTestId('received-feedbacks-section')
  }

  getReceivedFeedbacksSectionTitle () {
    return this.root.getByTestId('received-feedbacks-section-title')
  }

  getReceivedFeedbacksSectionEmpty () {
    return this.root.getByTestId('received-feedbacks-section-empty')
  }

  getReceivedFeedbackCards () {
    return this.root.getByTestId('feedback-card')
  }

  async verifyReceivedFeedbacksSectionVisible () {
    await expect(this.getReceivedFeedbacksSection()).toBeVisible()
  }

  async verifyReceivedFeedbacksSectionHidden () {
    await expect(this.getReceivedFeedbacksSection()).toBeHidden()
  }

  async verifyReceivedFeedbacksSectionTitleVisible () {
    await expect(this.getReceivedFeedbacksSectionTitle()).toBeVisible()
  }

  async verifyReceivedFeedbacksSectionEmptyVisible () {
    await expect(this.getReceivedFeedbacksSectionEmpty()).toBeVisible()
  }

  async verifyReceivedFeedbacksSectionEmptyHidden () {
    await expect(this.getReceivedFeedbacksSectionEmpty()).toBeHidden()
  }

  async verifyReceivedFeedbackCardsVisible () {
    const count = await this.getReceivedFeedbackCards().count()
    expect(count).toBeGreaterThan(0)
  }
}
