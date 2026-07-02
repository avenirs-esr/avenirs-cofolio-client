import { type ActivityResource, type ActivityResourceFile, type ActivityResourceLink, ActivityResourceType } from '@/features/staff/activities/types/resource.types'

export function isActivityResourceFile (
  resource: ActivityResource,
): resource is ActivityResourceFile {
  return resource.type === ActivityResourceType.FILE
}

export function isActivityResourceLink (
  resource: ActivityResource,
): resource is ActivityResourceLink {
  return resource.type === ActivityResourceType.LINK
}
