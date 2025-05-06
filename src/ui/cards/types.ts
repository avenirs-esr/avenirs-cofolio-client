export interface AvCardProps {
  backgroundColor?: string
  borderColor?: string
  height?: string
  width?: string
  titleBackground?: string
}

export interface AvSkillCardProps {
  title: string
  skillColor: string
  skill: 'academic' | 'todo'
  lastValidatedLevel: number
  currentLevelStatus: 'toEvaluate' | 'evaluating'
  maxLevel: number
  attachments: number
  practices: number
}
