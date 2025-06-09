import { type LevelDTO, type LevelDTO_Temp, LevelStatus } from '@/types'

export function levelToBadge (level: LevelDTO | LevelDTO_Temp) {
  switch (level.status) {
    case LevelStatus.NOT_VALIDATED:
      return {
        labelkey: 'student.badges.studentLevelBadge.status.notValidated',
        color: 'var(--light-foreground-error)',
        backgroundColor: 'var(--light-background-error)',
        iconPath: '/assets/icons/close-circle-outline.svg'
      }
    case LevelStatus.TO_EVALUATE:
      return {
        labelkey: 'student.badges.studentLevelBadge.status.inProgress',
        color: 'var(--dark-background-primary1)',
        backgroundColor: 'var(--light-background-primary2)',
        iconPath: '/assets/icons/hourglass.svg'
      }
    case LevelStatus.UNDER_REVIEW:
      return {
        labelkey: 'student.badges.studentLevelBadge.status.underReview',
        color: 'var(--dark-background-critical)',
        backgroundColor: 'var(--light-background-critical)',
        iconPath: '/assets/icons/dots-horizontal-circle-outline.svg'
      }
    case LevelStatus.VALIDATED:
      return {
        labelkey: 'student.badges.studentLevelBadge.status.validated',
        color: 'var(--light-foreground-success)',
        backgroundColor: 'var(--light-background-success)',
        iconPath: '/assets/icons/check-circle.svg'
      }
  }
}
