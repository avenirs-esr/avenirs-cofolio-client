import type { ActivityStaffOverviewDTO } from '@/api/avenir-esr'
import type { ActivityTableRow } from '@/features/staff/activities/views/ActivitiesView/ActivitiesView.types'

export function mapActivityToActivityTableRow (activity: ActivityStaffOverviewDTO): ActivityTableRow {
  return {
    id: activity.activityId,
    owner: activity.leaders.map(leader => `${leader.firstName} ${leader.lastName}`).join(', '),
    leaderIds: activity.leaders.map(leader => leader.id),
    status: activity.activityStatus,
    thematic: activity.thematic,
    title: activity.title,
    updatedAt: activity.updatedAt,
  }
}
