import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { t } from '@e2e/framework/shared/utils/i18n'
import { expect, type Locator } from '@playwright/test'

export class TraceCard extends BaseObject {
  constructor (protected root: Locator) {
    super(root)
  }

  getSkillCountElement () {
    return this.root.getByTestId('trace-card-skill-count')
  }

  getTypeTagElement () {
    return this.root.getByTestId('trace-card-type-tag')
  }

  async verifySkillCount () {
    const countSkillsText = this.getSkillCountElement()
    await expect(countSkillsText).toBeVisible()
    const text = await countSkillsText.textContent()
    const match = text?.trim().match(/^(\d+)\s+/)
    expect(match).toBeTruthy()
    const skillCount = Number.parseInt(match![1])
    const expectedText = t('student.traces.cards.StudentTraceCard.skillCount', { count: skillCount })
    expect(text?.trim()).toEqual(expectedText)
  }

  async verifyType () {
    const expectedTypes = [
      t('student.traces.cards.StudentTraceCard.tagLabel.solo'),
      t('student.traces.cards.StudentTraceCard.tagLabel.group')
    ]
    const typeTag = this.getTypeTagElement()
    await expect(typeTag).toBeVisible()
    const text = await typeTag.textContent()
    expect(expectedTypes).toContain(text?.trim())
  }
}
