export enum LevelStatus {
  VALIDATED = 'VALIDATED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  TO_EVALUATE = 'TO_EVALUATE',
  NOT_VALIDATED = 'NOT_VALIDATED',
}

export interface LevelDTO {
  id: string
  name: string
  status: LevelStatus
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

export interface DeliverableDTO {
  id: string
  deliverableUntil: string
  skill: string
  activity: string
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

export enum TrackType {
  GROUP = 'GROUP',
  INDIVIDUAL = 'INDIVIDUAL',
}

export interface TrackDTO {
  id: string
  name: string
  skillCount: number
  activityCount: number
  filedAt: string
  type: TrackType
  course?: string
}

export interface StudentSummaryDTO {
  id: string
  firstname: string
  lastname: string
  profilePicture: string
  coverPicture: string
  bio: string
}

export interface StudentHeaderSummaryDTO {
  id: string
  name: string
  messagesCount: number
  notificationsCount: number
}
