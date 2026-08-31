import type { FileDTO } from '@/api/avenir-esr'
import type { ActivityResource } from '@/features/activities/types/resource.types'

export function isActivityResourceFile (
  resource: ActivityResource,
): resource is FileDTO | File {
  return typeof resource !== 'string' && (resource instanceof File || !!resource.id)
}

export function isActivityResourceLink (
  resource: ActivityResource,
): resource is string {
  return typeof resource === 'string'
}

export function isActivityResourcePendingFile (
  resource: ActivityResource,
): resource is File {
  return resource instanceof File
}
