import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { clickOnElement } from '@e2e/framework/shared/utils/click'
import { waitForPageLoad } from '@e2e/framework/shared/utils/waits'
import { expect, type Page } from '@playwright/test'

export class SubscribeActivityConfirmModal extends BaseObject {
  constructor (protected page: Page) {
    super(page.getByTestId('subscribe-activity-confirm-modal'), page)
  }

  private getModalRoot () {
    return this.page?.getByTestId('subscribe-activity-confirm-modal') ?? this.root
  }

  private getCancelButton () {
    return this.getModalRoot().getByTestId('cancel-button')
  }

  private getConfirmButton () {
    return this.getModalRoot().getByTestId('confirm-button')
  }

  private getTitle () {
    return this.getModalRoot().getByTestId('subscribe-activity-confirm-modal__title')
  }

  async verifyVisible () {
    await this.isVisible()
    await expect(this.getCancelButton()).toBeVisible()
    await expect(this.getConfirmButton()).toBeVisible()
    await expect(this.getTitle()).toBeVisible()
  }

  async verifyHidden () {
    await this.isHidden()
  }

  async clickCancel () {
    await clickOnElement(this.getCancelButton())
    await waitForPageLoad(this.page)
  }

  async clickConfirm () {
    await clickOnElement(this.getConfirmButton())
    await waitForPageLoad(this.page)
  }
}
