import type { AvCardProps, AvSkillCardProps } from './types'
import { palette } from '../tokens'

export const defaultAvCardProps: AvCardProps = {
  backgroundColor: palette.background.card,
  borderColor: palette.foreground.stroke,
  height: 'auto',
  width: 'auto',
  titleBackground: palette.background.surfaceBackground,
} as const

export const defaultAvSkillCardProps: AvSkillCardProps = {
  title: 'Mon super titre',
  skillColor: palette.competence.competence1,
  skill: 'academic',
  lastValidatedLevel: 0,
  currentLevelStatus: 'toEvaluate',
  maxLevel: 2,
  attachments: 0,
  practices: 0
} as const
