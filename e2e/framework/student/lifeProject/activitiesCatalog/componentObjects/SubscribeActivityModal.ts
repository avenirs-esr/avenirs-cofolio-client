import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { t } from '@e2e/framework/shared/utils/i18n'
import { waitForPageLoad } from '@e2e/framework/shared/utils/waits'
import { CancelSubscribeActivityConfirmModal } from '@e2e/framework/student/lifeProject/activitiesCatalog/componentObjects/CancelSubscribeActivityConfirmModal'
import { expect, type Page } from '@playwright/test'

export class SubscribeActivityModal extends BaseObject {
  constructor (protected page: Page) {
    super(page.getByTestId('subscribe-activity-modal'), page)
  }

  private getModalRoot () {
    return this.page?.getByTestId('subscribe-activity-modal') ?? this.root
  }

  private getCancelButton () {
    return this.getModalRoot().getByTestId('cancel-button')
  }

  private getConfirmButton () {
    return this.getModalRoot().getByTestId('confirm-button')
  }

  private getTitle () {
    return this.getModalRoot().getByTestId('subscribe-activity-modal__title')
  }

  getCancelSubscribeActivityConfirmModal () {
    return new CancelSubscribeActivityConfirmModal(this.page)
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

  async verify () {
    await this.verifyVisible()

    const expectedCancelButtonText = t('global.buttons.cancel')
    await expect(this.getCancelButton()).toBeVisible()
    await expect(this.getCancelButton()).toHaveText(expectedCancelButtonText)

    const expectedConfirmButtonText = t('global.buttons.confirm')
    await expect(this.getConfirmButton()).toBeVisible()
    await expect(this.getConfirmButton()).toHaveText(expectedConfirmButtonText)

    const expectedTitle = t('student.buildProject.activities.views.ProjectActivitiesCatalogView.overlays.ActivitySubscribeModal.title', { title: 'Définir ses valeurs' })
    await expect(this.getTitle()).toBeVisible()
    await expect(this.getTitle()).toHaveText(expectedTitle)
  }

  async clickCancel () {
    await this.getCancelButton().click()
    await waitForPageLoad(this.page)
  }

  async verifyCancelSubscribeActivityConfirmModal () {
    const cancelSubscribeActivityConfirmModal = this.getCancelSubscribeActivityConfirmModal()
    await cancelSubscribeActivityConfirmModal.verify()
  }

  async verifyCancelSubscribeActivityConfirmModalHidden () {
    const cancelSubscribeActivityConfirmModal = this.getCancelSubscribeActivityConfirmModal()
    await cancelSubscribeActivityConfirmModal.verifyHidden()
  }

  async clickCancelAndConfirm () {
    await this.clickCancel()
    const cancelSubscribeActivityConfirmModal = this.getCancelSubscribeActivityConfirmModal()
    await cancelSubscribeActivityConfirmModal.verify()
    await cancelSubscribeActivityConfirmModal.clickConfirm()
  }

  async clickCancelAndCancel () {
    await this.clickCancel()
    const cancelSubscribeActivityConfirmModal = this.getCancelSubscribeActivityConfirmModal()
    await cancelSubscribeActivityConfirmModal.verify()
    await cancelSubscribeActivityConfirmModal.clickCancel()
  }

  async clickConfirm () {
    await this.getConfirmButton().click()
    await waitForPageLoad(this.page)
  }
}
