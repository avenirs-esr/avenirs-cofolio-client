import type { EAdditionalSkillLevel, EAdditionalSkillType, TraceOverviewDTO } from '@/api/avenir-esr'

// TODO: temp waiting for the back implementation
export interface AdditionalSkillProgressDetailsDTO {
  id: string
  title: string
  pathSegments: Array<AdditionalSkillCategory>
  comment?: string
  type: EAdditionalSkillType
  level: EAdditionalSkillLevel
  traceAssociations: Array<TraceOverviewDTO>
}

export enum EAdditionalSkillCategoryType {
  MACRO_SKILL,
  TARGET,
  ISSUE,
  DOMAIN
}

export interface AdditionalSkillCategory {
  type: EAdditionalSkillCategoryType
  title: string
}
