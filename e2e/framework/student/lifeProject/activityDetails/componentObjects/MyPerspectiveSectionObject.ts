import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
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
    await this.getEditPerspectiveButton().click()
  }

  async verifyFinishButtonVisible () {
    await expect(this.getFinishButton()).toBeVisible()
  }

  async verifyFinishButtonHidden () {
    await expect(this.getFinishButton()).toBeHidden()
  }

  async clickCancelEditPerspectiveButton () {
    await this.getCancelEditPerspectiveButton().click()
  }

  async clickFinishButton () {
    await this.getFinishButton().click()
  }

  async verifyFinishConfirmationModalVisible () {
    await expect(this.getFinishConfirmationModal()).toBeVisible()
  }
}
