import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { expect, type Page } from '@playwright/test'

export class StudentProfileDropdown extends BaseObject {
  constructor (protected page: Page) {
    super(page.getByTestId('profile-button'))
  }

  getLogoutAction () {
    return this.page.getByTestId('logout-button')
  }

  getLogoutConfirmationModal () {
    return this.page.getByTestId('logout-confirmation-modal')
  }

  async open () {
    await this.root.click()
  }

  async verifyLogoutLabel (label: string) {
    await expect(this.getLogoutAction()).toHaveText(label)
  }

  async clickLogoutAction () {
    await this.getLogoutAction().click()
  }

  async verifyLogoutConfirmationModalVisible () {
    await expect(this.getLogoutConfirmationModal()).toBeVisible()
  }
}
