import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { t } from '@e2e/framework/shared/utils/i18n'
import { waitForPageLoad } from '@e2e/framework/shared/utils/waits'
import { expect, type Page } from '@playwright/test'

export class CancelSubscribeActivityConfirmModal extends BaseObject {
  constructor (protected page: Page) {
    super(page.getByTestId('cancel-subscribe-activity-confirm-modal'), page)
  }

  private getModalRoot () {
    return this.page?.getByTestId('cancel-subscribe-activity-confirm-modal') ?? this.root
  }

  private getCancelButton () {
    return this.getModalRoot().getByTestId('cancel-button')
  }

  private getConfirmButton () {
    return this.getModalRoot().getByTestId('confirm-button')
  }

  private getTitle () {
    return this.getModalRoot().getByTestId('cancel-subscribe-activity-confirm-modal__title')
  }

  async verify () {
    await this.verifyVisible()

    const expectedCancelButtonText = t('global.buttons.cancel')
    await expect(this.getCancelButton()).toBeVisible()
    await expect(this.getCancelButton()).toHaveText(expectedCancelButtonText)

    const expectedConfirmButtonText = t('global.buttons.confirm')
    await expect(this.getConfirmButton()).toBeVisible()
    await expect(this.getConfirmButton()).toHaveText(expectedConfirmButtonText)

    const expectedTitle = t('student.buildProject.activities.views.ProjectActivitiesCatalogView.overlays.CancelSubscribeActivityModal.title')
    await expect(this.getTitle()).toBeVisible()
    await expect(this.getTitle()).toHaveText(expectedTitle)
  }

  async verifyVisible () {
    await expect(this.getTitle()).toBeVisible()
  }

  async verifyHidden () {
    await this.isHidden()
  }

  async clickCancel () {
    await this.getCancelButton().click()
    await waitForPageLoad(this.page)
  }

  async clickConfirm () {
    await this.getConfirmButton().click()
    await waitForPageLoad(this.page)
  }
}
