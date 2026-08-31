import type {
  AddActivityResourceFileFormData,
  AddActivityResourceFormData,
  AddActivityResourceLinkFormData
} from '@/features/activities/types/forms.types'
import { ActivityResourceType } from '@/features/activities/types/resource.types'

export function isActivityResourceFileType (data: AddActivityResourceFormData): data is AddActivityResourceFileFormData {
  return data.resourceType === ActivityResourceType.FILE
}

export function isActivityResourceLinkType (data: AddActivityResourceFormData): data is AddActivityResourceLinkFormData {
  return data.resourceType === ActivityResourceType.LINK
}
