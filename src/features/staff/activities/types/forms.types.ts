import type { EActivityThematic, FileDTO } from '@/api/avenir-esr'
import type { AnyVueFormApi } from '@/common/types'
import type { ActivityResourceType } from '@/features/staff/activities/types/resource.types'

export interface ActivityDraftCreationFormData {
  title: string
}

export enum EditActivityFormDataBannerAction {
  DELETE = 'DELETE',
  NONE = 'NONE',
  UPDATE = 'UPDATE',
}

export interface EditActivityFormData extends ActivityDraftCreationFormData {
  thematic: EActivityThematic
  description: string
  enableReflection?: boolean
  recommendedCompletionContexts: string
  startDate?: string
  endDate?: string
  feedbackAllowedIterations?: number
  summary: string
  traceAllowedAssociations?: number
  bannerAction: EditActivityFormDataBannerAction
  files: (File | FileDTO)[]
  links: string[]
}

export interface AddActivityResourceFileFormData {
  resourceType: ActivityResourceType.FILE
  file: File | null
  resourceName: string
}

export interface AddActivityResourceLinkFormData {
  resourceType: ActivityResourceType.LINK
  link: string
}

export type AddActivityResourceFormData =
  | AddActivityResourceFileFormData
  | AddActivityResourceLinkFormData

export type ActivityDraftCreationForm = AnyVueFormApi<ActivityDraftCreationFormData>
export type EditActivityForm = AnyVueFormApi<EditActivityFormData>
export type AddActivityResourceForm = AnyVueFormApi<AddActivityResourceFormData>
