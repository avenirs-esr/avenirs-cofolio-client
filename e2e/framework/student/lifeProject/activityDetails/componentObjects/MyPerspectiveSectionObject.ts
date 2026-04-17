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

  getFinishConfirmationModal () {
    return this.root.page().getByTestId('finish-declared-activity-confirm-modal')
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
}
