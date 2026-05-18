import type { EActivityThematic } from '@/api/avenir-esr'
import type { AnyVueFormApi } from '@/common/types'

export interface ActivityDraftCreationFormData {
  title: string
}

export interface EditActivityFormData extends ActivityDraftCreationFormData {
  thematic: EActivityThematic
  description: string
  enableReflection?: boolean
  executionPeriodInfo: string
  feedbackAllowedIterations?: number
  summary: string
  traceAllowedAssociations?: number
}

export type ActivityDraftCreationForm = AnyVueFormApi<ActivityDraftCreationFormData>
export type EditActivityForm = AnyVueFormApi<EditActivityFormData>
