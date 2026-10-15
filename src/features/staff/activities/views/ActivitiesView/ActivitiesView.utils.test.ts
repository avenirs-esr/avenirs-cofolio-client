import type { ActivityStaffOverviewDTO } from '@/api/avenir-esr'
import { EActivityStatus, EActivityThematic } from '@/api/avenir-esr'
import { mapActivityToActivityTableRow } from '@/features/staff/activities/views/ActivitiesView/ActivitiesView.utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'

const activity: ActivityStaffOverviewDTO = {
  activityId: 'activity-1',
  title: 'Définir ses valeurs',
  thematic: EActivityThematic.SELF_KNOWLEDGE,
  activityStatus: EActivityStatus.PUBLISHED,
  updatedAt: '2024-01-15T10:00:00Z',
  leaders: [
    { id: 'staff-1', firstName: 'Jean', lastName: 'Dupont' },
    { id: 'staff-2', firstName: 'Marie', lastName: 'Martin' },
  ],
}

BddTest().given('activities view utils', () => {
  BddTest().when('a staff activity overview is mapped to a table row', () => {
    BddTest().then('it should join every leader name into the owner cell', () => {
      expect(mapActivityToActivityTableRow(activity).owner).toBe('Jean Dupont, Marie Martin')
    })

    BddTest().then('it should keep the leader ids', () => {
      expect(mapActivityToActivityTableRow(activity).leaderIds).toEqual(['staff-1', 'staff-2'])
    })

    BddTest().then('it should leave the owner cell empty when the activity has no leader', () => {
      const row = mapActivityToActivityTableRow({ ...activity, leaders: [] })

      expect(row.owner).toBe('')
      expect(row.leaderIds).toEqual([])
    })
  })
})
