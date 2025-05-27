import type { BaseApiException } from '@/common/exceptions'
import type { UseQueryDefinedReturnType } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import { useStudentTracksSummaryQuery } from '@/features/student/queries'
import { type TrackDTO, TrackType } from '@/types'
import { mount } from '@vue/test-utils'
import StudentTracksWidget from './StudentTracksWidget.vue'

const navigateToStudentTracks = vi.fn()

vi.mock('@/common/composables', () => ({
  useNavigation: () => ({
    navigateToStudentTracks,
  }),
}))

vi.mock('@/features/student/queries', () => ({
  useStudentTracksSummaryQuery: vi.fn()
}))

const mockedUseStudentTracksSummaryQuery = vi.mocked(useStudentTracksSummaryQuery)

function mockUseStudentTracksSummaryQuery (payload: TrackDTO[]) {
  const mockData: Ref<TrackDTO[]> = ref(payload)
  const queryMockedData = {
    data: mockData,
  } as unknown as UseQueryDefinedReturnType<TrackDTO[], BaseApiException>
  mockedUseStudentTracksSummaryQuery.mockReturnValue(queryMockedData)
}

describe('studentTracksWidget', () => {
  const tracks: Array<TrackDTO> = [
    {
      id: 'track1',
      name: 'Prévenir la pollution à la source',
      skillCount: 1,
      activityCount: 8,
      type: TrackType.GROUP,
      filedAt: '2024-05-13T08:42:17',
      course: 'Master Chimie Verte et Éco-innovations'
    },
    {
      id: 'track2',
      name: 'Mettre en place des filières d’économies circulaires',
      skillCount: 2,
      activityCount: 7,
      type: TrackType.INDIVIDUAL,
      filedAt: '2024-11-29T19:15:03'
    },
    {
      id: 'track3',
      name: 'Évaluer l’impact environnemental et économique',
      skillCount: 3,
      activityCount: 6,
      type: TrackType.INDIVIDUAL,
      filedAt: '2025-02-07T23:08:51',
      course: 'Master Chimie Verte et Éco-innovations'

    },
    {
      id: 'track4',
      name: 'Concevoir des synthèses chimiques durables',
      skillCount: 4,
      activityCount: 5,
      type: TrackType.GROUP,
      filedAt: '2024-08-21T04:26:39'
    },
  ]

  beforeEach(() => {
    mockUseStudentTracksSummaryQuery(tracks)
  })

  it('should display up to 3 tracks', () => {
    const wrapper = mount(StudentTracksWidget)
    const studentTrackCards = wrapper.findAllComponents({ name: 'StudentTrackCard' })
    expect(studentTrackCards).toHaveLength(3)
  })

  it('should call navigation on button click', async () => {
    const wrapper = mount(StudentTracksWidget)
    const btn = wrapper.findComponent({ name: 'AvButton' })
    await btn.trigger('click')

    expect(navigateToStudentTracks).toHaveBeenCalled()
  })
})
