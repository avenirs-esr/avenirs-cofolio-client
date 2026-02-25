import { EDeclaredActivityStatus } from '@cofolio/api/avenir-esr/generated/types/eDeclaredActivityStatus'
import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { t } from '@e2e/framework/shared/utils/i18n'
import { expect, type Locator } from '@playwright/test'

export class ActivityStatusBadgeObject extends BaseObject {
  private validStatuses: string[]

  constructor (root: Locator) {
    super(root)
    this.validStatuses = Object.values(EDeclaredActivityStatus).map(status =>
      t(`student.buildProject.activities.declaredActivityStatus.${status}`)
    )
  }

  async verify (expectedStatus: string) {
    await expect(this.root).toBeVisible()
    await expect(this.root).toHaveText(t(`student.buildProject.activities.declaredActivityStatus.${expectedStatus}`))
  }

  async verifyValid () {
    await expect(this.root).toBeVisible()
    const text = await this.root.textContent()
    expect(this.validStatuses).toContain(text?.trim())
  }

  async verifyNotVisible () {
    await expect(this.root).not.toBeVisible()
  }
}
