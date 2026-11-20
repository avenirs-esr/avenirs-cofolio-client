import type { ActivityContentDTO, SubActivityOverviewDTO } from '@avenirs-esr/shared/api/avenir-esr'

export function getOverflowedParentActivityPeriod (
  parentActivity: ActivityContentDTO,
  startDate: string,
  endDate: string
): Required<Pick<ActivityContentDTO, 'startDate' | 'endDate'>> | undefined {
  if (!parentActivity.startDate || !parentActivity.endDate) {
    return undefined
  }

  if (parentActivity.startDate > startDate || parentActivity.endDate < endDate) {
    return {
      startDate: parentActivity.startDate,
      endDate: parentActivity.endDate
    }
  }

  return undefined
}

export function getUncoveredSubActivityPeriod (
  subActivity: SubActivityOverviewDTO,
  startDate: string,
  endDate: string
): Required<Pick<SubActivityOverviewDTO, 'startDate' | 'endDate'>> | undefined {
  if (!subActivity.startDate || !subActivity.endDate) {
    return undefined
  }

  if (subActivity.startDate < startDate || subActivity.endDate > endDate) {
    return {
      startDate: subActivity.startDate,
      endDate: subActivity.endDate
    }
  }

  return undefined
}

export function getUncoveredSubActivitiesPeriod (
  subActivities: SubActivityOverviewDTO[],
  startDate: string,
  endDate: string,
): Required<Pick<SubActivityOverviewDTO, 'startDate' | 'endDate'>> | undefined {
  const uncoveredPeriods = subActivities.flatMap(subActivity => getUncoveredSubActivityPeriod(subActivity, startDate, endDate) ?? [])

  if (uncoveredPeriods.length === 0) {
    return undefined
  }

  return uncoveredPeriods.reduce((period, { startDate, endDate }) => ({
    startDate: startDate < period.startDate ? startDate : period.startDate,
    endDate: endDate > period.endDate ? endDate : period.endDate
  }))
}
