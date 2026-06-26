import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { clickOnElement } from '@e2e/framework/shared/utils/click'
import { expect, type Page } from '@playwright/test'

export class UserProfileDropdown extends BaseObject {
  constructor (protected page: Page) {
    super(page.getByTestId('profile-button'))
  }

  getLogoutAction () {
    return this.page.getByTestId('logout-button')
  }

  getLogoutConfirmationModal () {
    return this.page.getByTestId('logout-confirmation-modal')
  }

  getLogoutConfirmationModalTitle () {
    return this.getLogoutConfirmationModal().getByTestId('modal-title')
  }

  async open () {
    await clickOnElement(this.root)
  }

  async verifyLogoutLabel (label: string) {
    await expect(this.getLogoutAction()).toHaveText(label)
  }

  async clickLogoutAction () {
    await clickOnElement(this.getLogoutAction())
  }

  async verifyLogoutConfirmationModalVisible () {
    await expect(this.getLogoutConfirmationModal()).toBeVisible()
  }
}
