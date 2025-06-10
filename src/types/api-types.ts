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

export enum TrackType {
  GROUP = 'GROUP',
  INDIVIDUAL = 'INDIVIDUAL',
}

export interface TrackOverviewDTO {
  id: string
  name: string
  skillCount: number
  activityCount: number
  filedAt: string
  type: TrackType
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
