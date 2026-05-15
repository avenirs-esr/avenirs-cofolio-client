import type { AnyVueFormApi } from '@/common/types'

export interface ActivityDraftCreationFormData {
  title: string
}

export interface EditActivityFormData extends ActivityDraftCreationFormData {

}

export type ActivityDraftCreationForm = AnyVueFormApi<ActivityDraftCreationFormData>
export type EditActivityForm = AnyVueFormApi<EditActivityFormData>
