import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { t } from '@e2e/framework/shared/utils/i18n'
import { expect } from '@playwright/test'

export class SkillCard extends BaseObject {
  getStatusBadge () {
    return this.root.getByTestId('skill-level-badge')
  }

  async verifyStatusBadge () {
    const validStatuses = [
      t('student.skills.cards.StudentSkillCard.badgeStatus.validated'),
      t('student.skills.cards.StudentSkillCard.badgeStatus.underReview'),
      t('student.skills.cards.StudentSkillCard.badgeStatus.failed'),
      t('student.skills.cards.StudentSkillCard.badgeStatus.toBeEvaluated')
    ]

    const badge = this.getStatusBadge()
    await expect(badge).toBeVisible()

    const badgeText = await badge.textContent()
    expect(badgeText).toBeTruthy()

    const hasValidStatus = validStatuses.some(status => badgeText?.includes(status))
    expect(hasValidStatus).toBeTruthy()
  }
}
