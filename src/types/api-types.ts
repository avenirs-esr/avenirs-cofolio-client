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

export interface EventDTO {
  id: string
  name: string
  startDate: string
  endDate: string
  location: string
}

export interface PageDTO {
  id: string
  name: string
  updatedAt: string
}

export interface ResumeDTO {
  id: string
  name: string
  updatedAt: string
}

export interface TrackDTO {
  id: string
  name: string
  skillCount: number
  activityCount: number
}

export interface StudentSummaryDTO {
  id: string
  firstname: string
  lastname: string
  profilePicture: string
  coverPicture: string
  bio: string
}
