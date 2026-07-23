import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { clickOnElement } from '@e2e/framework/shared/utils/click'
import { expect, type Page } from '@playwright/test'

export class UnpublishActivityConfirmationModal extends BaseObject {
  constructor (protected page: Page) {
    super(page.getByTestId('unpublish-activity-confirmation-modal'), page)
  }

  private getCancelButton () {
    return this.getRoot().getByTestId('cancel-button')
  }

  private getConfirmButton () {
    return this.getRoot().getByTestId('confirm-button')
  }

  async verifyVisible () {
    await expect(this.getRoot()).toBeVisible()
    await expect(this.getCancelButton()).toBeVisible()
    await expect(this.getConfirmButton()).toBeVisible()
  }

  async verifyHidden () {
    await expect(this.getRoot()).toBeHidden()
  }

  async clickCancel () {
    await clickOnElement(this.getCancelButton())
  }

  async clickConfirm () {
    await clickOnElement(this.getConfirmButton())
  }
}
