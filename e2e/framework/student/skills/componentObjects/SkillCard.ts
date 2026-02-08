import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { t } from '@e2e/framework/shared/utils/i18n'
import { AmsCountIconText } from '@e2e/framework/student/ams/componentObjects/AmsCountIconText'
import { TracesCountIconText } from '@e2e/framework/student/traces/componentObjects/TracesCountIconText'
import { expect } from '@playwright/test'

export class SkillCard extends BaseObject {
  getStatusBadge () {
    return this.root.getByTestId('skill-level-badge')
  }

  getTraceCountElement () {
    return new TracesCountIconText(this.root.getByTestId('count-traces-icon-text'))
  }

  getAmsCountIconText () {
    return new AmsCountIconText(this.root.getByTestId('count-ams-icon-text'))
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

  async verifyTraceCount () {
    const traceCount = this.getTraceCountElement()
    await traceCount.verify()
  }

  async verifyAmsCount () {
    await this.getAmsCountIconText().verify()
  }
}
