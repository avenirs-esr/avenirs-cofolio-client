import { EActivityThematic } from '@cofolio/api/avenir-esr/generated/types/eActivityThematic'
import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { t } from '@e2e/framework/shared/utils/i18n'
import { expect, type Locator } from '@playwright/test'

export class ActivityThematicBadgeObject extends BaseObject {
  private validThematics: string[]

  constructor (root: Locator) {
    super(root)
    this.validThematics = Object.values(EActivityThematic).map(thematic =>
      t(`student.buildProject.activities.thematics.${thematic}`)
    )
  }

  async verify (expectedThematic: string) {
    await expect(this.root).toBeVisible()
    await expect(this.root).toHaveText(t(`student.buildProject.activities.thematics.${expectedThematic}`))
  }

  async verifyValid () {
    await expect(this.root).toBeVisible()
    const text = await this.root.textContent()
    expect(this.validThematics).toContain(text?.trim())
  }
}
