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

export interface TraceConfigInfoDTO {
  maxDayBeforeDeletion: number
}
