import type { AvSkillCardProps } from './types'

export const defaultAvSkillCardProps: AvSkillCardProps = {
  title: 'Mon super titre',
  skillColor: '#7216D4',
  skill: 'academic',
  lastValidatedLevel: 0,
  currentLevelStatus: 'toEvaluate',
  maxLevel: 2,
  attachments: 0,
  practices: 0
} as const
