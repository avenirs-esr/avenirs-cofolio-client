import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { t } from '@e2e/framework/shared/utils/i18n'
import { expect } from '@playwright/test'

export class AmsCountIconText extends BaseObject {
  async verify () {
    await this.isVisible()
    const text = await this.root.textContent()
    const match = text?.trim().match(/^(\d+)\s+/)
    expect(match).toBeTruthy()
    const amsCountValue = Number.parseInt(match![1])
    const expectedText = t('student.ams.base.StudentCountAmsIconText.text', { count: amsCountValue })
    expect(text?.trim()).toEqual(expectedText)
  }
}
