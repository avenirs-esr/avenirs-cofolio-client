import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { expect, type Locator } from '@playwright/test'

export class MyPerspectiveSectionObject extends BaseObject {
  constructor (protected root: Locator) {
    super(root)
  }

  getFinishButton () {
    return this.root.getByTestId('finish-declared-activity-button')
  }

  getFinishConfirmationModal () {
    return this.root.page().getByTestId('finish-declared-activity-confirm-modal')
  }

  async verifyVisible () {
    await expect(this.root).toBeVisible()
  }

  async verifyFinishButtonVisible () {
    await expect(this.getFinishButton()).toBeVisible()
  }

  async verifyFinishButtonHidden () {
    await expect(this.getFinishButton()).toBeHidden()
  }

  async clickFinishButton () {
    await this.getFinishButton().click()
  }

  async verifyFinishConfirmationModalVisible () {
    await expect(this.getFinishConfirmationModal()).toBeVisible()
  }
}
