import type { Locator, Page } from '@playwright/test'
import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { t } from '@e2e/framework/shared/utils/i18n'

export class ActivityLibraryDropdown extends BaseObject {
  constructor (root: Locator, page: Page) {
    super(root, page)
  }

  getTriggerButton () {
    return this.root.getByRole('button')
  }

  getUnsubscribeItem () {
    return this.page!.getByRole('button', { name: t('student.buildProject.activities.buttons.unsubscribe'), exact: true })
  }

  async clickUnsubscribe () {
    await this.getTriggerButton().click()
    await this.getUnsubscribeItem().click()
  }
}
