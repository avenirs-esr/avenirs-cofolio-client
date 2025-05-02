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
