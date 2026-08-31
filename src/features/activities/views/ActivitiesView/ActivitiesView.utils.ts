import type { ActivityStaffOverviewDTO } from '@/api/avenir-esr'
import type { ActivityTableRow } from '@/features/activities/views/ActivitiesView/ActivitiesView.types'

export function mapActivityToActivityTableRow (activity: ActivityStaffOverviewDTO): ActivityTableRow {
  return {
    id: activity.activityId,
    owner: `${activity.author.firstName} ${activity.author.lastName}`,
    status: activity.activityStatus,
    thematic: activity.thematic,
    title: activity.title,
    updatedAt: activity.updatedAt,
  }
}
