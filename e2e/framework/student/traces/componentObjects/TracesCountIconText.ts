import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { t } from '@e2e/framework/shared/utils/i18n'
import { expect } from '@playwright/test'

export class TracesCountIconText extends BaseObject {
  async verify () {
    await this.isVisible()
    await expect(this.root).toBeVisible()
    const text = await this.root.textContent()
    const match = text?.trim().match(/^(\d+)\s+/)
    expect(match).toBeTruthy()
    const traceCountValue = Number.parseInt(match![1])
    const expectedText = t('student.traces.base.StudentCountTracesIconText.text', { count: traceCountValue })
    expect(text?.trim()).toEqual(expectedText)
  }
}
