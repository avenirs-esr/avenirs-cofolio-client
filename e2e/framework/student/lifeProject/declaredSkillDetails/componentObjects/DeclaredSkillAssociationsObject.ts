import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { clickOnElement } from '@e2e/framework/shared/utils/click'
import { verifyTextLocator } from '@e2e/framework/shared/utils/text'
import { waitForPageLoad } from '@e2e/framework/shared/utils/waits'
import { expect, type Locator } from '@playwright/test'

export class DeclaredSkillAssociationsObject extends BaseObject {
  constructor (protected root: Locator) {
    super(root)
  }

  getAssociatedTracesCard () {
    return this.root.getByTestId('associated-traces-card')
  }

  getAssociatedActivitiesCard () {
    return this.root.getByTestId('associated-declared-activities-card')
  }

  getTracesCardTitle () {
    return this.getAssociatedTracesCard().getByTestId('associations-card-title')
  }

  getActivitiesCardTitle () {
    return this.getAssociatedActivitiesCard().getByTestId('associations-card-title')
  }

  getTracesCardContainer () {
    return this.getAssociatedTracesCard().getByTestId('associations-card-container')
  }

  getActivitiesCardContainer () {
    return this.getAssociatedActivitiesCard().getByTestId('associations-card-container')
  }

  getTraceAssociationItems () {
    return this.getTracesCardContainer().getByTestId('association-card')
  }

  getActivityAssociationItems () {
    return this.getActivitiesCardContainer().getByTestId('association-card')
  }

  async verifyVisible () {
    await expect(this.root).toBeVisible()
  }

  async verifyTracesCardVisible () {
    await expect(this.getAssociatedTracesCard()).toBeVisible()
  }

  async verifyActivitiesCardVisible () {
    await expect(this.getAssociatedActivitiesCard()).toBeVisible()
  }

  async verifyTracesCardTitleDefined () {
    await verifyTextLocator(this.getTracesCardTitle())
  }

  async verifyActivitiesCardTitleDefined () {
    await verifyTextLocator(this.getActivitiesCardTitle())
  }

  async expandTracesCard () {
    await this.getTracesCardTitle().click()
  }

  async expandActivitiesCard () {
    await this.getActivitiesCardTitle().click()
  }

  async verifyTraceItemsNotEmpty () {
    const count = await this.getTraceAssociationItems().count()
    expect(count).toBeGreaterThan(0)
  }

  async verifyActivityItemsNotEmpty () {
    const count = await this.getActivityAssociationItems().count()
    expect(count).toBeGreaterThan(0)
  }

  async verifyAllTraceItemsHaveTitles () {
    const items = this.getTraceAssociationItems()
    const count = await items.count()
    for (let i = 0; i < count; i++) {
      const titleLocator = items.nth(i).getByTestId('floating-icon-card-title')
      await verifyTextLocator(titleLocator)
    }
  }

  async verifyAllActivityItemsHaveTitles () {
    const items = this.getActivityAssociationItems()
    const count = await items.count()
    for (let i = 0; i < count; i++) {
      const titleLocator = items.nth(i).getByTestId('floating-icon-card-title')
      await verifyTextLocator(titleLocator)
    }
  }

  getDeleteAssociationsDropdown () {
    return this.root.getByTestId('delete-declared-skill-associated-elements-dropdown')
  }

  getDeleteActivitiesOption () {
    return this.root.page().getByTestId('activities')
  }

  getDeleteAssociationsModal () {
    return this.root.page().getByTestId('delete-associations-modal-header')
  }

  getDeleteAssociationsModalItems () {
    return this.root.page().getByTestId('compact-card-selector-item')
  }

  getDeleteAssociationsModalItemSelectors () {
    return this.root.page().getByTestId('selector-overlay')
  }

  getDeleteAssociationsModalConfirmButton () {
    return this.root.page().getByTestId('confirm-button')
  }

  getDeleteAssociationsModalCancelButton () {
    return this.root.page().getByTestId('cancel-button')
  }

  getDeleteAssociationsConfirmModal () {
    return this.root.page().getByTestId('delete-associations-confirm-modal__header')
  }

  getDeleteAssociationsConfirmModalContainer () {
    return this.root.page().locator('dialog').filter({ has: this.getDeleteAssociationsConfirmModal() })
  }

  getDeleteAssociationsConfirmModalCancelButton () {
    return this.getDeleteAssociationsConfirmModalContainer().getByTestId('cancel-button')
  }

  async verifyDeleteAssociationsDropdownVisible () {
    await expect(this.getDeleteAssociationsDropdown()).toBeVisible()
  }

  async openDeleteAssociationsDropdown () {
    await clickOnElement(this.getDeleteAssociationsDropdown())
    await waitForPageLoad(this.root.page())
  }

  async selectDeleteActivitiesOption () {
    await clickOnElement(this.getDeleteActivitiesOption())
  }

  async verifyDeleteAssociationsModalVisible () {
    await expect(this.getDeleteAssociationsModal()).toBeVisible()
  }

  async verifyDeleteAssociationsModalHidden () {
    await expect(this.getDeleteAssociationsModal()).toBeHidden()
  }

  async verifyDeleteAssociationsModalItemsNotEmpty () {
    const count = await this.getDeleteAssociationsModalItems().count()
    expect(count).toBeGreaterThan(0)
  }

  async verifyDeleteAssociationsModalConfirmButtonVisible () {
    await expect(this.getDeleteAssociationsModalConfirmButton()).toBeVisible()
  }

  async verifyDeleteAssociationsModalCancelButtonVisible () {
    await expect(this.getDeleteAssociationsModalCancelButton()).toBeVisible()
  }

  async selectFirstDeleteAssociationsModalItem () {
    await clickOnElement(this.getDeleteAssociationsModalItemSelectors().first())
  }

  async confirmDeleteAssociationsModal () {
    await clickOnElement(this.getDeleteAssociationsModalConfirmButton())
  }

  async verifyDeleteAssociationsConfirmModalVisible () {
    await expect(this.getDeleteAssociationsConfirmModal()).toBeVisible()
  }

  async verifyDeleteAssociationsConfirmModalHidden () {
    await expect(this.getDeleteAssociationsConfirmModal()).toBeHidden()
  }

  async cancelDeleteAssociationsConfirmModal () {
    await clickOnElement(this.getDeleteAssociationsConfirmModalCancelButton())
  }

  async cancelDeleteAssociationsModal () {
    await clickOnElement(this.getDeleteAssociationsModalCancelButton())
  }
}
