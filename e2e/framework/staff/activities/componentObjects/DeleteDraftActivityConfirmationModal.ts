import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { clickOnElement } from '@e2e/framework/shared/utils/click'
import { expect, type Page } from '@playwright/test'

export class DeleteDraftActivityConfirmationModal extends BaseObject {
  constructor (protected page: Page) {
    super(page.getByTestId('delete-draft-activity-confirmation-modal'), page)
  }

  private getCancelButton () {
    return this.getRoot().getByTestId('cancel-button')
  }

  private getConfirmButton () {
    return this.getRoot().getByTestId('confirm-button')
  }

  async verifyVisible () {
    await this.isVisible()
  }

  async verifyHidden () {
    await this.isHidden()
  }

  async verifyCancelButtonVisible () {
    await expect(this.getCancelButton()).toBeVisible()
  }

  async verifyConfirmButtonVisible () {
    await expect(this.getConfirmButton()).toBeVisible()
  }

  async clickCancel () {
    await clickOnElement(this.getCancelButton())
  }
}
