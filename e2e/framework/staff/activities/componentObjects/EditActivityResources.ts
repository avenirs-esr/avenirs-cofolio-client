import type { Page } from '@playwright/test'
import { clickOnElement } from '@e2e/framework/shared/utils/click'
import { t } from '@e2e/framework/shared/utils/i18n'
import { expect } from '@playwright/test'

export class EditActivityResources {
  constructor (private page: Page) {}

  private getResourcesList () {
    return this.page.getByTestId('activity-resources-list-editable')
  }

  private getResourceCheckbox (resourceLabel: string) {
    return this.getResourcesList()
      .locator(`[data-testid="selector-overlay"][data-resource-label="${resourceLabel}"]`)
  }

  private getDeleteButton () {
    return this.getResourcesList().getByTestId('activity-resources-list-delete-button')
  }

  private getAddResourceButton () {
    return this.page.getByTestId('activity-resources-list-add-card')
  }

  private getAddResourceModal () {
    return this.page.getByTestId('add-activity-resource-modal')
  }

  private getAddResourceModalTypeSelect () {
    return this.getAddResourceModal().getByTestId('add-activity-resource-type-select')
  }

  private getAddResourceModalTypeOption (type: 'file' | 'link') {
    const checkboxId = `select-collapse-options-list-${type}-checkbox`

    return this.getAddResourceModal()
      .getByTestId('av-select__collapse')
      .locator(`label[for="${checkboxId}"]`)
  }

  private getAddResourceModalFileUploadContainer () {
    return this.getAddResourceModal().getByTestId('add-activity-resource-file-upload-container')
  }

  private getAddResourceModalFileNameInput () {
    return this.getAddResourceModal().getByTestId('add-activity-resource-name-input')
  }

  private getAddResourceModalLinkInput () {
    return this.getAddResourceModal().getByTestId('add-activity-resource-link-input')
  }

  private getDeleteConfirmationModal () {
    return this.page.getByTestId('delete-activity-resources-confirmation-modal')
  }

  private getDeleteModalTitle () {
    return this.getDeleteConfirmationModal().getByTestId('delete-activity-resources-confirmation-modal-title')
  }

  private getModalResourceTitle (resourceLabel: string) {
    return this.getDeleteConfirmationModal()
      .getByTestId('activity-resource-card-title')
      .filter({ hasText: resourceLabel })
  }

  private getDeleteModalCancelButton () {
    return this.getDeleteConfirmationModal().getByRole('button', { name: t('global.buttons.cancel') })
  }

  private getDeleteModalConfirmButton () {
    return this.getDeleteConfirmationModal().getByRole('button', { name: t('global.buttons.confirm') })
  }

  async clickAddResourceButton () {
    await clickOnElement(this.getAddResourceButton())
  }

  async selectAddResourceModalType (type: 'file' | 'link') {
    await clickOnElement(this.getAddResourceModalTypeSelect())
    await expect(this.getAddResourceModalTypeOption(type)).toBeVisible()
    await this.getAddResourceModalTypeOption(type).click({ position: { x: 2, y: 2 } })
  }

  async verifyAddResourceModalFileFormVisible () {
    await expect(this.getAddResourceModalFileUploadContainer()).toBeVisible()
    await expect(this.getAddResourceModalFileNameInput()).toBeVisible()
  }

  async verifyAddResourceModalFileFormHidden () {
    await expect(this.getAddResourceModalFileUploadContainer()).not.toBeVisible()
    await expect(this.getAddResourceModalFileNameInput()).not.toBeVisible()
  }

  async verifyAddResourceModalLinkFormVisible () {
    await expect(this.getAddResourceModalLinkInput()).toBeVisible()
  }

  async verifyAddResourceModalLinkFormHidden () {
    await expect(this.getAddResourceModalLinkInput()).not.toBeVisible()
  }

  async selectResource (resourceLabel: string) {
    await clickOnElement(this.getResourceCheckbox(resourceLabel))
  }

  async verifyDeleteButtonDisabled () {
    await expect(this.getDeleteButton()).toBeDisabled()
  }

  async verifyDeleteButtonEnabled () {
    await expect(this.getDeleteButton()).toBeEnabled()
  }

  async clickDeleteButton () {
    await clickOnElement(this.getDeleteButton())
  }

  async verifyConfirmationModalVisible () {
    await expect(this.getDeleteConfirmationModal()).toBeVisible()
  }

  async verifyConfirmationModalHidden () {
    await expect(this.getDeleteConfirmationModal()).toBeHidden()
  }

  async verifySingularConfirmationMessage () {
    await expect(this.getDeleteModalTitle()).toHaveText(t('staff.activities.modals.DeleteActivityResourcesConfirmationModal.title', { count: 1 }))
  }

  async verifyPluralConfirmationMessage () {
    await expect(this.getDeleteModalTitle()).toHaveText(t('staff.activities.modals.DeleteActivityResourcesConfirmationModal.title', { count: 2 }))
  }

  async verifyModalListsResource (resourceLabel: string) {
    await expect(this.getModalResourceTitle(resourceLabel)).toBeVisible()
  }

  async clickCancelButton () {
    await clickOnElement(this.getDeleteModalCancelButton())
  }

  async clickConfirmButton () {
    await clickOnElement(this.getDeleteModalConfirmButton())
  }

  async verifyResourceListed (resourceLabel: string) {
    await expect(this.getResourceCheckbox(resourceLabel)).toBeVisible()
  }

  async verifyResourceNotListed (resourceLabel: string) {
    await expect(this.getResourceCheckbox(resourceLabel)).toHaveCount(0)
  }
}
