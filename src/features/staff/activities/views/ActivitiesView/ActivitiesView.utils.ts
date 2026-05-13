import type { ActivityPresentationDTO } from '@/api/avenir-esr'
import type { ActivityTableRow } from '@/features/staff/activities/views/ActivitiesView/ActivitiesView.types'

export function mapActivityToActivityTableRow (activity: ActivityPresentationDTO): ActivityTableRow {
  return {
    id: activity.id,
    owner: '',
    // TODO: #1618 map status when its added to the dto
    status: 'draft',
    thematic: activity.thematic,
    title: activity.title,
    updatedAt: activity.updatedAt ?? '',
  }
}
