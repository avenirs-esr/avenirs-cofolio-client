import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { clickOnElement } from '@e2e/framework/shared/utils/click'
import { expect, type Page } from '@playwright/test'

export class NotificationsPopover extends BaseObject {
  constructor (protected page: Page) {
    super(page.getByTestId('notifications-popover-trigger'), page)
  }

  getBody () {
    return this.page.getByTestId('notifications-popover-body')
  }

  getList () {
    return this.getBody().getByTestId('notifications-popover-list')
  }

  getActivityModifiedNotificationCards () {
    return this.getList().getByTestId('activity-modified-notification-card')
  }

  getActivityModifiedNotificationCard (index: number) {
    return this.getActivityModifiedNotificationCards().nth(index)
  }

  getActivityModifiedNotificationCardContent (index: number) {
    return this.getActivityModifiedNotificationCard(index).getByTestId('activity-modified-notification-card-content')
  }

  getPreferenceToggle () {
    return this.getBody().getByRole('checkbox')
  }

  private getPreferenceToggleLabel () {
    return this.getBody().locator('label[data-testid$="-label"]')
  }

  async open () {
    await clickOnElement(this.root)
  }

  async enableNotificationPreference () {
    const toggle = this.getPreferenceToggle()
    await expect(toggle).toBeVisible()
    if (!(await toggle.isChecked())) {
      await clickOnElement(this.getPreferenceToggleLabel())
    }
  }

  async clickActivityModifiedNotificationCard (index: number) {
    await clickOnElement(this.getActivityModifiedNotificationCard(index))
  }
}
