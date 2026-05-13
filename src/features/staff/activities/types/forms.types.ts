import type { AnyVueFormApi } from '@/common/types'

export interface ActivityDraftCreationFormData {
  title: string
}

export type ActivityDraftCreationForm = AnyVueFormApi<ActivityDraftCreationFormData>
