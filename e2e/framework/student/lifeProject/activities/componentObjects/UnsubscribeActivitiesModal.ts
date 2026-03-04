import type { Locator, Page } from '@playwright/test'
import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { UnsubscribeActivitiesConfirmModal } from '@e2e/framework/student/lifeProject/activitiesCatalog/componentObjects/UnsubscribeActivitiesConfirmModal'

export class UnsubscribeActivitiesModal extends BaseObject {
  constructor (root: Locator, page: Page) {
    super(root, page)
  }

  getActivityItems () {
    return this.root.getByTestId('selector-overlay')
  }

  getConfirmButton () {
    return this.root.getByTestId('confirm-button')
  }

  getConfirmModal () {
    return new UnsubscribeActivitiesConfirmModal(this.page!)
  }

  async selectActivityByIndex (index: number) {
    await this.getActivityItems().nth(index).click()
  }

  async clickConfirm () {
    await this.getConfirmButton().click()
  }
}
