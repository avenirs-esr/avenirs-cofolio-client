import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { expect, type Page } from '@playwright/test'

export class ActivitiesPreviousNextNavigation extends BaseObject {
  constructor (protected page: Page) {
    super(page.getByTestId('activities-previous-next-navigation'), page)
  }

  getPreviousButton () {
    return this.root.getByTestId('previous-activity-button')
  }

  getNextButton () {
    return this.root.getByTestId('next-activity-button')
  }

  async verifyVisible () {
    await expect(this.root).toBeVisible()
    await expect(this.getPreviousButton()).toBeVisible()
    await expect(this.getNextButton()).toBeVisible()
  }

  async verifyHidden () {
    await expect(this.root).toBeHidden()
  }

  async previousButtonClick () {
    await expect(this.getPreviousButton()).toBeVisible()
    await this.getPreviousButton().click()
  }

  async nextButtonClick () {
    await expect(this.getNextButton()).toBeVisible()
    await this.getNextButton().click()
  }
}
