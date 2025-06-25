import type { BaseApiException } from '@/common/exceptions'
import type { EventOverviewDTO } from '@/types'
import type { UseQueryDefinedReturnType } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import { getCalendarDate, getLocalizedAbbrMonth } from '@/common/utils'
import StudentEventsWidget from '@/features/student/components/widgets/StudentEventsWidget/StudentEventsWidget.vue'
import { useStudentEventsSummaryQuery } from '@/features/student/queries'
import { mockAddErrorMessage } from 'tests/mocks'
import { mountWithRouter, testUseBaseApiExceptionToast } from 'tests/utils'

vi.mock('@/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store')>()
  return {
    ...actual,
    useToasterStore: () => ({
      addErrorMessage: mockAddErrorMessage
    })
  }
})

const navigateToStudentEvents = vi.fn()

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()
  return {
    ...actual,
    useNavigation: () => ({
      navigateToStudentEvents,
    }),
  }
})

vi.mock('@/features/student/queries', () => ({
  useStudentEventsSummaryQuery: vi.fn()
}))

const mockedUseStudentEventsSummaryQuery = vi.mocked(useStudentEventsSummaryQuery)

function mockUseStudentEventsSummaryQuery (payload: EventOverviewDTO[]) {
  const mockData: Ref<EventOverviewDTO[]> = ref(payload)
  const mockError: Ref<null | null> = ref(null)
  const queryMockedData = {
    data: mockData,
    error: mockError,
  } as unknown as UseQueryDefinedReturnType<EventOverviewDTO[], BaseApiException>
  mockedUseStudentEventsSummaryQuery.mockReturnValue(queryMockedData)
}

describe('studentEventsWidget', () => {
  const events = [
    {
      id: 'event1',
      name: 'Forum de l’écologie et la chimie',
      startDate: '2025-05-19T08:00',
      endDate: '2025-05-19T18:00',
      location: 'Paris'
    },
    {
      id: 'event2',
      name: 'Super forum de la mécanique quantique',
      startDate: '2125-06-25T08:30',
      endDate: '2125-06-25T17:30',
      location: 'Toulouse'
    },
    {
      id: 'event3',
      name: 'Le café des associations',
      startDate: '2125-07-03T09:00',
      endDate: '2125-07-03T17:00',
      location: 'Bordeaux'
    },
    {
      id: 'event4',
      name: 'Assemblée générale ESUP',
      startDate: '2125-08-08T09:30',
      endDate: '2125-08-08T12:15',
      location: 'Brest'
    },
    {
      id: 'event5',
      name: 'Nouvel an 2225',
      startDate: '2225-01-01T09:30',
      endDate: '2225-01-01T12:15',
      location: 'Brest'
    },
  ] as Array<EventOverviewDTO>

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseStudentEventsSummaryQuery(events)
  })

  it('should only display up to 3 future events sorted by date', async () => {
    const wrapper = await mountWithRouter(StudentEventsWidget, {
      global: {
        plugins: [createPinia()],
      },
    })
    const richButtons = wrapper.findAll('.av-rich-button')

    expect(richButtons).toHaveLength(3)
    expect(richButtons[0].text()).toContain(getCalendarDate(events[1].startDate))
    expect(richButtons[0].text()).toContain(getLocalizedAbbrMonth(events[1].startDate, 'fr').toUpperCase())
    expect(richButtons[0].text()).toContain(events[1].location)
    expect(richButtons[1].text()).toContain(getCalendarDate(events[2].startDate))
    expect(richButtons[1].text()).toContain(getLocalizedAbbrMonth(events[2].startDate, 'fr').toUpperCase())
    expect(richButtons[1].text()).toContain(events[2].location)
    expect(richButtons[2].text()).toContain(getCalendarDate(events[3].startDate))
    expect(richButtons[2].text()).toContain(getLocalizedAbbrMonth(events[3].startDate, 'fr').toUpperCase())
    expect(richButtons[2].text()).toContain(events[3].location)

    await (richButtons[0]).trigger('click')
    await (richButtons[1]).trigger('click')
    await (richButtons[2]).trigger('click')
  })

  it('should call navigation on button click', async () => {
    const wrapper = await mountWithRouter(StudentEventsWidget, {
      global: {
        plugins: [createPinia()],
      },
    })
    const btn = wrapper.findComponent({ name: 'AvButton' })
    await btn.trigger('click')

    expect(navigateToStudentEvents).toHaveBeenCalled()
  })

  testUseBaseApiExceptionToast<EventOverviewDTO[]>({
    mockedUseQuery: mockedUseStudentEventsSummaryQuery,
    payload: [],
    mountComponent: () => mountWithRouter(StudentEventsWidget, {
      global: {
        plugins: [createPinia()],
      },
    })
  })
})
