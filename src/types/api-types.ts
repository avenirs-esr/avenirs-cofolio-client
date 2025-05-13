export interface LevelDTO {
  id: string
  name: string
  status: 'VALIDATED' | 'UNDER_REVIEW' | 'TO_EVALUATE' | 'NOT_VALIDATED'
}

export interface SkillDTO {
  id: string
  name: string
  trackCount: number
  activityCount: number
  levels: Array<LevelDTO>
}

export interface CourseDTO {
  id: string
  name: string
  skills: Array<SkillDTO>
}
