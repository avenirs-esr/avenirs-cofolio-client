import type { AnyVueFormApi } from '@/common/types'

export interface ActivityDraftCreationFormData {
  title: string
}

export interface EditActivityFormData extends ActivityDraftCreationFormData {
  description: string
  enableReflection?: boolean
  executionPeriodInfo: string
  feedbackAllowedIterations?: number
  summary: string
  traceAllowedAssociations?: number
}

export type ActivityDraftCreationForm = AnyVueFormApi<ActivityDraftCreationFormData>
export type EditActivityForm = AnyVueFormApi<EditActivityFormData>
