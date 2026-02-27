import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { t } from '@e2e/framework/shared/utils/i18n'
import { waitForPageLoad } from '@e2e/framework/shared/utils/waits'
import { expect, type Page } from '@playwright/test'

export class UnsubscribeActivitiesConfirmModal extends BaseObject {
  constructor (protected page: Page) {
    super(page.getByTestId('unsubscribe-activities-confirm-modal'), page)
  }

  private getModalRoot () {
    return this.page?.getByTestId('unsubscribe-activities-confirm-modal') ?? this.root
  }

  private getConfirmButton () {
    return this.getModalRoot().getByTestId('confirm-button')
  }

  async verifyVisible () {
    await this.isVisible()
    await expect(this.getConfirmButton()).toBeVisible()
  }

  async verifyHidden () {
    await this.isHidden()
  }

  async verify () {
    await this.verifyVisible()

    const expectedConfirmButtonText = t('global.buttons.confirm')
    await expect(this.getConfirmButton()).toBeVisible()
    await expect(this.getConfirmButton()).toHaveText(expectedConfirmButtonText)
  }

  async clickConfirm () {
    await this.getConfirmButton().click()
    await waitForPageLoad(this.page)
  }
}
