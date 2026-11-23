import type { Page } from '@playwright/test'
import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { clickOnElement } from '@e2e/framework/shared/utils/click'

export class EditPublishedActivityConfirmationModal extends BaseObject {
  constructor (protected page: Page) {
    super(page.getByTestId('edit-published-activity-confirmation-modal'))
  }

  getConfirmButton () {
    return this.root.getByTestId('confirm-button')
  }

  async clickConfirm () {
    await clickOnElement(this.getConfirmButton())
  }
}
