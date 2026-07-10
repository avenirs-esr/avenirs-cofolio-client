import { clickOnElement } from '@e2e/framework/shared/utils/click'
import { expect, type Page } from '@playwright/test'

export class NotificationsDropdown {
  constructor (private page: Page) {}

  private getTriggerButton () {
    return this.page.getByTestId('notifications-popover-trigger')
  }

  private getDropdownBody () {
    return this.page.getByTestId('notifications-popover-body')
  }

  private getTitle () {
    return this.page.getByTestId('notifications-popover-body-title')
  }

  private getDisabledMessage () {
    return this.page.getByTestId('notifications-popover-disabled')
  }

  private getToggleInput () {
    return this.page.getByTestId('notification-preference-toggle-input')
  }

  private getToggleLabel () {
    return this.page.getByTestId('notification-preference-toggle-label')
  }

  private getExitButton () {
    return this.page.getByTestId('notifications-popover-body-close')
  }

  async open () {
    await clickOnElement(this.getTriggerButton())
    await expect(this.getDropdownBody()).toBeVisible()
  }

  async close () {
    await clickOnElement(this.getExitButton())
  }

  async activateToggle () {
    const isChecked = await this.getToggleInput().isChecked()
    if (!isChecked) {
      await clickOnElement(this.getToggleLabel())
    }
  }

  async deactivateToggle () {
    const isChecked = await this.getToggleInput().isChecked()
    if (isChecked) {
      await clickOnElement(this.getToggleLabel())
    }
  }

  async verifyTitleVisible () {
    await expect(this.getTitle()).toBeVisible()
  }

  async verifyToggleEnabled () {
    await expect(this.getToggleInput()).toBeChecked()
  }

  async verifyToggleDisabled () {
    await expect(this.getToggleInput()).not.toBeChecked()
  }

  async verifyDisabledMessageVisible () {
    await expect(this.getDisabledMessage()).toBeVisible()
  }

  async verifyExitButtonVisible () {
    await expect(this.getExitButton()).toBeVisible()
  }

  async verifyClosed () {
    await expect(this.getDropdownBody()).toBeHidden()
  }
}
