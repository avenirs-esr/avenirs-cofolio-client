import type { SubActivityOverviewDTO } from '@avenirs-esr/shared/api/avenir-esr'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { addDays, format, parseISO } from 'date-fns'
import { expect } from 'vitest'
import { mockedSubActivitiesOverviewDTO, mockedSubActivitiesOverviewDTOWithPeriod } from '@/__mocks__/fixtures/shared/activities.fixtures'
import { getUncoveredSubActivitiesPeriod, getUncoveredSubActivityPeriod } from '@/common/activities/utils/activity-period'

const SUB_ACTIVITIES_WITH_PERIOD = mockedSubActivitiesOverviewDTOWithPeriod
const SUB_ACTIVITY_WITH_PERIOD = SUB_ACTIVITIES_WITH_PERIOD.find(({ startDate, endDate }) => startDate && endDate)!
const SUB_ACTIVITY_WITHOUT_PERIOD = mockedSubActivitiesOverviewDTO[0]!
const SUB_ACTIVITY_START_DATE = SUB_ACTIVITY_WITH_PERIOD.startDate!
const SUB_ACTIVITY_END_DATE = SUB_ACTIVITY_WITH_PERIOD.endDate!
const SUB_ACTIVITY_PERIOD = { startDate: SUB_ACTIVITY_START_DATE, endDate: SUB_ACTIVITY_END_DATE }

BddTest().given('an activity period util', () => {
  const shiftDate = (date: string, days: number) => {
    return format(addDays(parseISO(date), days), 'yyyy-MM-dd')
  }

  BddTest().when('looking for the uncovered period of a sub-activity', () => {
    BddTest().then('it should return nothing when the period contains the sub-activity period', () => {
      const startDate = shiftDate(SUB_ACTIVITY_START_DATE, -1)
      const endDate = shiftDate(SUB_ACTIVITY_END_DATE, 1)

      expect(getUncoveredSubActivityPeriod(SUB_ACTIVITY_WITH_PERIOD, startDate, endDate)).toBeUndefined()
    })

    BddTest().then('it should include the bounds, so that a period equal to the sub-activity period covers it', () => {
      expect(getUncoveredSubActivityPeriod(SUB_ACTIVITY_WITH_PERIOD, SUB_ACTIVITY_START_DATE, SUB_ACTIVITY_END_DATE)).toBeUndefined()
    })

    BddTest().then('it should return the sub-activity period when it starts before the period', () => {
      const startDate = shiftDate(SUB_ACTIVITY_START_DATE, 1)

      expect(getUncoveredSubActivityPeriod(SUB_ACTIVITY_WITH_PERIOD, startDate, SUB_ACTIVITY_END_DATE)).toEqual(SUB_ACTIVITY_PERIOD)
    })

    BddTest().then('it should return the sub-activity period when it ends after the period', () => {
      const endDate = shiftDate(SUB_ACTIVITY_END_DATE, -1)

      expect(getUncoveredSubActivityPeriod(SUB_ACTIVITY_WITH_PERIOD, SUB_ACTIVITY_START_DATE, endDate)).toEqual(SUB_ACTIVITY_PERIOD)
    })

    BddTest().then('it should return the sub-activity period when it starts before and ends after the period', () => {
      const startDate = shiftDate(SUB_ACTIVITY_START_DATE, 1)
      const endDate = shiftDate(SUB_ACTIVITY_END_DATE, -1)

      expect(getUncoveredSubActivityPeriod(SUB_ACTIVITY_WITH_PERIOD, startDate, endDate)).toEqual(SUB_ACTIVITY_PERIOD)
    })

    BddTest().then('it should ignore a sub-activity without a staff-defined period', () => {
      expect(getUncoveredSubActivityPeriod(SUB_ACTIVITY_WITHOUT_PERIOD, SUB_ACTIVITY_START_DATE, SUB_ACTIVITY_START_DATE)).toBeUndefined()
    })
  })

  BddTest().when('looking for the period of the uncovered sub-activities', () => {
    BddTest().then('it should return nothing when the period covers every sub-activity period', () => {
      expect(getUncoveredSubActivitiesPeriod(SUB_ACTIVITIES_WITH_PERIOD, SUB_ACTIVITY_START_DATE, SUB_ACTIVITY_END_DATE)).toBeUndefined()
    })

    BddTest().then('it should return nothing when no sub-activity has a staff-defined period', () => {
      expect(getUncoveredSubActivitiesPeriod(mockedSubActivitiesOverviewDTO, SUB_ACTIVITY_START_DATE, SUB_ACTIVITY_START_DATE)).toBeUndefined()
    })

    BddTest().then('it should return the period of the only uncovered sub-activity', () => {
      const startDate = shiftDate(SUB_ACTIVITY_START_DATE, 1)

      expect(getUncoveredSubActivitiesPeriod(SUB_ACTIVITIES_WITH_PERIOD, startDate, SUB_ACTIVITY_END_DATE)).toEqual(SUB_ACTIVITY_PERIOD)
    })

    BddTest().then('it should span from the earliest start to the latest end of the uncovered sub-activities', () => {
      const laterSubActivity: SubActivityOverviewDTO = {
        ...SUB_ACTIVITY_WITH_PERIOD,
        id: 'later-sub-activity',
        startDate: shiftDate(SUB_ACTIVITY_START_DATE, 1),
        endDate: shiftDate(SUB_ACTIVITY_END_DATE, 1)
      }
      const subActivities: SubActivityOverviewDTO[] = [
        ...mockedSubActivitiesOverviewDTOWithPeriod,
        laterSubActivity
      ]
      const startDate = shiftDate(SUB_ACTIVITY_START_DATE, 2)

      expect(getUncoveredSubActivitiesPeriod(subActivities, startDate, SUB_ACTIVITY_END_DATE)).toEqual({
        startDate: SUB_ACTIVITY_START_DATE,
        endDate: shiftDate(SUB_ACTIVITY_END_DATE, 1)
      })
    })

    BddTest().then('it should ignore the covered sub-activities', () => {
      const coveredSubActivity: SubActivityOverviewDTO = {
        ...SUB_ACTIVITY_WITH_PERIOD,
        id: 'covered-sub-activity',
        startDate: shiftDate(SUB_ACTIVITY_END_DATE, 1),
        endDate: shiftDate(SUB_ACTIVITY_END_DATE, 5)
      }
      const subActivities: SubActivityOverviewDTO[] = [
        ...mockedSubActivitiesOverviewDTOWithPeriod,
        coveredSubActivity
      ]
      const startDate = shiftDate(SUB_ACTIVITY_START_DATE, 1)
      const endDate = shiftDate(SUB_ACTIVITY_END_DATE, 10)

      expect(getUncoveredSubActivitiesPeriod(subActivities, startDate, endDate)).toEqual(SUB_ACTIVITY_PERIOD)
    })
  })
})
