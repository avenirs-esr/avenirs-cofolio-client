import type { SubActivityOverviewDTO } from '@avenirs-esr/shared/api/avenir-esr'

export const mockedSubActivitiesOverviewDTO: SubActivityOverviewDTO[] = [
  { id: 'sub-activity-1', title: 'Analyser la situation', publishable: true },
  { id: 'sub-activity-2', title: 'Mettre en œuvre une solution', publishable: true },
  { id: 'sub-activity-3', title: 'Évaluer les résultats', publishable: true },
]

export const mockedSubActivitiesOverviewDTOWithUnpublishable: SubActivityOverviewDTO[] = [
  ...mockedSubActivitiesOverviewDTO,
  { id: 'sub-activity-4', title: 'Présenter le bilan', publishable: false },
]

export const mockedSubActivitiesOverviewDTOWithPeriod: SubActivityOverviewDTO[] = [
  ...mockedSubActivitiesOverviewDTO,
  { id: 'sub-activity-5', title: 'Rédiger la synthèse', startDate: '2026-03-02', endDate: '2026-03-20', publishable: true },
]
