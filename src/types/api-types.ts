import type { SkillLevelOverviewDTO, SkillOverviewDTO } from '@/api/avenir-esr'

export interface DeliverableOverviewDTO {
  id: string
  deliverableUntil: string
  skill: string
  activity: string
}

export interface EventOverviewDTO {
  id: string
  name: string
  startDate: string
  endDate: string
  location: string
}

export interface PageOverviewDTO {
  id: string
  name: string
  updatedAt: string
}

export interface ResumeOverviewDTO {
  id: string
  name: string
  updatedAt: string
}

export enum TraceType {
  GROUP = 'GROUP',
  INDIVIDUAL = 'INDIVIDUAL',
}

export interface TraceOverviewDTO {
  id: string
  name: string
  skillCount: number
  activityCount: number
  filedAt: string
  type: TraceType
  course?: string
}

export interface StudentHeaderSummaryDTO {
  id: string
  name: string
  messagesCount: number
  notificationsCount: number
}

// TODO: waiting for #269
export type SkillLevelViewDTO = {
  shortDescription: string
} & SkillLevelOverviewDTO

// TODO: waiting for #269
export type SkillViewDTO = {
  levelCount: number
  currentSkillLevel: SkillLevelViewDTO
} & Omit<SkillOverviewDTO, 'currentSkillLevel'>

// TODO: waiting for #269
export interface ProgramProgressViewDTO {
  id: string
  name: string
  skills: SkillViewDTO[]
}

export enum ActivityStatus {
  COMPLETED = 'COMPLETED',
  IN_PROGRESS = 'IN_PROGRESS',
  NOT_STARTED = 'NOT_STARTED',
  SUBMITTED = 'SUBMITTED',
}

export interface ActivityDTO {
  id: string
  name: string
  startedActivityCount: number
  totalActivityCount: number
  skillCount: number
  trackCount: number
  status: ActivityStatus
}
