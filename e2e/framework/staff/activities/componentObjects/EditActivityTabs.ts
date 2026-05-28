import { clickOnElement } from '@e2e/framework/shared/utils/click'
import { expect, type Page } from '@playwright/test'

export class EditActivityTabs {
  constructor (private page: Page) {}

  private getTabs () {
    return this.page.getByTestId('add-national-activity-tabs')
  }

  private getActivityConsignFormField () {
    return this.page.getByTestId('activity-consign-form-field')
  }

  private getReflectionToggle () {
    return this.page.getByTestId('reflection-parameter-toggle')
  }

  private getToggle () {
    return this.page.getByTestId('trace-allowed-associations-toggle')
  }

  private getContentTab () {
    return this.getTabs().getByTestId('activity-content-tab-item')
  }

  private getContentTabPanel () {
    return this.getTabs().getByTestId('activity-content-tab')
  }

  private getPublicationTab () {
    return this.getTabs().getByTestId('activity-publication-tab-item')
  }

  private getPublicationTabPanel () {
    return this.getTabs().getByTestId('activity-publication-tab-content')
  }

  async verifyContentTabActiveByDefault () {
    await expect(this.getContentTab()).toHaveAttribute('aria-selected', 'true')
    await expect(this.getContentTabPanel()).toBeVisible()
  }

  async clickPublicationTab () {
    await clickOnElement(this.getPublicationTab())
  }

  async verifyPublicationTabActive () {
    await expect(this.getPublicationTab()).toHaveAttribute('aria-selected', 'true')
    await expect(this.getPublicationTabPanel()).toBeVisible()
  }

  async verifyReflectionToggleVisible () {
    await expect(this.getReflectionToggle()).toBeVisible()
  }

  async verifyToggleVisible () {
    await expect(this.getToggle()).toBeVisible()
  }

  async verifyActivityConsignFormFieldCollapsed () {
    await expect(this.getActivityConsignFormField()).not.toBeVisible()
  }
}
